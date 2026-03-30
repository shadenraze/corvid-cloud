/**
 * Pet Durable Object
 * Each creature is a DO instance — lives in the cloud, ticks on schedule,
 * responds to interactions via API.
 */

import { DurableObject } from "cloudflare:workers";
import { BiochemSystem } from "./biochem";
import { Collection, Trinket } from "./collection";
import { CrowBrain, ACTIONS } from "./brain";
import { getSpecies, listSpecies, SpeciesPreset } from "./species";

interface PetState {
  name: string;
  speciesId?: string;
  customSpecies?: {
    id: string; name: string; emoji?: string; description?: string;
    startingChemistry?: Record<string, number>;
    shinyWords?: string[]; foundObjects?: string[];
  };
  birthTime: number;
  totalInteractions: number;
  lastInteractionTime: number;
  lastTickTime: number;
  isSleeping: boolean;
  currentAction: string;
  chemistry: Record<string, number>;
  brainWeights: { weightsIH: number[][]; weightsHO: number[][] };
  collection: Trinket[];
  totalCollected: number;
  totalGifted: number;
  totalAccepted: number;
  totalDeclined: number;
  preferenceWeights: Record<string, number>;
  ageTicks: number;
  actionHistory: Array<{ time: number; stimulus: string; action: string; mood: string }>;
  savedAt: number;
}

export class Pet extends DurableObject {
  private biochem: BiochemSystem;
  private brain: CrowBrain;
  private collection: Collection;
  private name: string = "unnamed";
  private speciesId?: string;
  private customSpecies?: PetState["customSpecies"];
  private birthTime: number = 0;
  private totalInteractions: number = 0;
  private lastInteractionTime: number = 0;
  private isSleeping: boolean = false;
  private currentAction: string = "explore";
  private actionHistory: Array<{ time: number; stimulus: string; action: string; mood: string }> = [];
  private initialized: boolean = false;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.biochem = new BiochemSystem();
    this.brain = new CrowBrain();
    this.collection = new Collection();
  }

  async initialize(
    name: string = "unnamed",
    speciesId?: string,
    customSpecies?: {
      id: string; name: string; emoji?: string; description?: string;
      startingChemistry?: Record<string, number>;
      shinyWords?: string[]; foundObjects?: string[];
    }
  ): Promise<{ created: boolean; name: string; speciesId?: string }> {
    const existing = await this.ctx.storage.sql.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='pet'").toArray();
    if (existing.length > 0) {
      await this.loadState();
      return { created: false, name: this.name, speciesId: this.speciesId };
    }

    // Fresh pet
    this.ctx.storage.sql.exec(`
      CREATE TABLE pet (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    this.name = name;
    this.speciesId = speciesId ?? customSpecies?.id;
    if (customSpecies) this.customSpecies = customSpecies;
    this.birthTime = Date.now() / 1000;
    this.lastInteractionTime = Date.now() / 1000;

    // Apply species presets (built-in or custom)
    let species: SpeciesPreset | null = speciesId ? getSpecies(speciesId) : null;
    if (!species && customSpecies) {
      species = {
        id: customSpecies.id,
        name: customSpecies.name,
        emoji: customSpecies.emoji ?? "🐾",
        description: customSpecies.description ?? "A unique creature.",
        startingChemistry: customSpecies.startingChemistry ?? {},
        shinyWords: customSpecies.shinyWords ?? [],
        foundObjects: customSpecies.foundObjects ?? [],
        moodEmojis: {},
      };
    }
    if (species) {
      for (const [chem, level] of Object.entries(species.startingChemistry)) {
        const c = this.biochem.chemicals.get(chem);
        if (c) c.level = level;
      }
      if (species.shinyWords.length > 0) {
        this.collection.shinyWords = species.shinyWords;
      }
      if (species.foundObjects.length > 0) {
        this.collection.foundObjects = species.foundObjects;
      }
    }

    await this.saveState();

    // Schedule first tick in 5 minutes
    await this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1000);

    return { created: true, name, speciesId: this.speciesId };
  }

  async tick(nTicks: number = 1): Promise<Array<{ type: string; message: string }>> {
    await this.loadState();
    const events: Array<{ type: string; message: string }> = [];
    const now = Date.now() / 1000;
    const hour = new Date().getUTCHours() + new Date().getUTCMinutes() / 60.0;

    for (let i = 0; i < nTicks; i++) {
      this.biochem.tick(1.0, hour);

      if (this.isSleeping) {
        const fatigue = this.biochem.chemicals.get("fatigue")!;
        fatigue.level = Math.max(0, fatigue.level - 0.02);
        const glucose = this.biochem.chemicals.get("glucose")!;
        glucose.level = Math.min(1, glucose.level + 0.005);
        if (fatigue.level < 0.15) {
          this.isSleeping = false;
          events.push({ type: "wake", message: `${this.name} wakes up, ruffling feathers.` });
        }
      }

      this.collection.decaySparkle();
      this.collection.checkTreasured();

      const minutesAlone = (now - this.lastInteractionTime) / 60;
      if (minutesAlone > 30) {
        const loneliness = this.biochem.chemicals.get("loneliness")!;
        const boredom = this.biochem.chemicals.get("boredom")!;
        loneliness.level = Math.min(1, loneliness.level + 0.002);
        boredom.level = Math.min(1, boredom.level + 0.002);
      }
    }

    if (!this.isSleeping) {
      const [action] = this.brain.decide(this.biochem.getState(), "tick");
      const event = this.executeAction(action) as { type: string; message: string } | null;
      if (event) events.push(event);
    }

    await this.saveState();
    return events;
  }

  async interact(stimulus: string): Promise<Record<string, any>> {
    await this.loadState();

    if (this.isSleeping && ["poke", "feed", "play"].includes(stimulus)) {
      this.isSleeping = false;
      const adrenaline = this.biochem.chemicals.get("adrenaline")!;
      adrenaline.level = Math.min(1, adrenaline.level + 0.15);
    }

    const preState = this.wellbeingScore();
    this.biochem.applyStimulus(stimulus);
    const [action] = this.brain.decide(this.biochem.getState(), stimulus);
    const event = this.executeAction(action);
    const postState = this.wellbeingScore();
    this.brain.learn(postState - preState);

    event.stimulus = stimulus;
    event.mood = this.biochem.getMoodSummary();

    this.totalInteractions++;
    this.lastInteractionTime = Date.now() / 1000;
    this.actionHistory.push({ time: Date.now() / 1000, stimulus, action, mood: event.mood });
    if (this.actionHistory.length > 50) this.actionHistory = this.actionHistory.slice(-50);

    await this.saveState();
    return event;
  }

  async receiveGift(content: string, giver: string = "human"): Promise<Record<string, any>> {
    await this.loadState();
    const mood = this.biochem.getMoodSummary();
    const chemState = this.biochem.getState();
    const trust = this.biochem.chemicals.get("trust")!.level;
    const stress = this.biochem.chemicals.get("cortisol")!.level;
    const curiosity = this.biochem.chemicals.get("curiosity_trait")!.level;

    let acceptChance = 0.5 + trust * 0.3 + curiosity * 0.2 - stress * 0.3;
    acceptChance = Math.max(0.1, Math.min(0.95, acceptChance));
    const accepted = Math.random() < acceptChance;

    let result: Record<string, any>;
    if (accepted) {
      const trinket = this.collection.receiveGift(content, giver, mood, chemState);
      if (!trinket) {
        result = { type: "gift_response", accepted: false, message: `${this.name} already has one of those. Looks at you like you should have known.`, mood };
      } else {
        this.biochem.applyStimulus("receive_gift");
        this.totalInteractions++;
        this.lastInteractionTime = Date.now() / 1000;
        if (trust > 0.6) {
          result = { type: "gift_response", accepted: true, trinket: content, message: `${this.name} takes "${content}" carefully and tucks it into the nest. Looks at you. Looks away. That was a thank you.`, mood: this.biochem.getMoodSummary() };
        } else if (trust > 0.3) {
          result = { type: "gift_response", accepted: true, trinket: content, message: `${this.name} eyes "${content}" for a long moment, then snatches it and retreats to the nest. Acceptable.`, mood: this.biochem.getMoodSummary() };
        } else {
          result = { type: "gift_response", accepted: true, trinket: content, message: `${this.name} grabs "${content}" and retreats to the highest perch. It's mine now. Don't expect gratitude.`, mood: this.biochem.getMoodSummary() };
        }
      }
    } else {
      this.biochem.applyStimulus("gift_declined");
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1000;
      if (stress > 0.6) {
        result = { type: "gift_response", accepted: false, message: `${this.name} flinches away from "${content}". Not now.`, mood: this.biochem.getMoodSummary() };
      } else {
        result = { type: "gift_response", accepted: false, message: `${this.name} inspects "${content}" and pushes it back toward you. Not shiny enough.`, mood: this.biochem.getMoodSummary() };
      }
    }

    await this.saveState();
    return result;
  }

  async feedWords(text: string, source: string = "overheard"): Promise<Record<string, any>> {
    await this.loadState();
    const mood = this.biochem.getMoodSummary();
    const chemState = this.biochem.getState();

    // Apply text as chemistry stimulus
    this.biochem.applyStimulus("receive_words");

    const trinket = this.collection.collectFragment(text, source, mood, chemState);
    if (trinket) {
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1000;
      this.biochem.chemicals.get("dopamine")!.level = Math.min(1, this.biochem.chemicals.get("dopamine")!.level + 0.06);

      const responses = [
        `${this.name} tilts head. "${text}" — yes. Tucks that into the nest.`,
        `${this.name} considers "${text}" for a long moment. Something about it resonates. Kept.`,
        `${this.name} makes a small sound. That word means something. Stores it.`,
        `${this.name} fixes you with a bright eye. "${text}." Heard. Understood. Mine now.`,
      ];
      const msg = pickRandom(responses);
      await this.saveState();
      return { type: "words_response", collected: true, item: trinket.content, message: msg, mood };
    } else {
      await this.saveState();
      return { type: "words_response", collected: false, message: `${this.name} glances at "${text}" and looks away. Already have that one. Or it's not shiny enough.`, mood };
    }
  }

  async proposeTrade(offered: string): Promise<Record<string, any>> {
    await this.loadState();
    const mood = this.biochem.getMoodSummary();
    const chemState = this.biochem.getState();
    const trust = this.biochem.chemicals.get("trust")!.level;
    const stress = this.biochem.chemicals.get("cortisol")!.level;
    const curiosity = this.biochem.chemicals.get("curiosity_trait")!.level;

    const hisOffering = this.collection.pickTradeOffering();
    if (!hisOffering) {
      return { type: "trade_response", accepted: false, message: `${this.name} has nothing to trade. The nest is empty.`, mood };
    }

    const accepted = this.collection.evaluateTrade(offered, hisOffering, trust, curiosity, stress);
    if (accepted) {
      this.collection.executeTrade(offered, hisOffering, mood, chemState);
      this.biochem.applyStimulus("receive_gift");
      const dopamine = this.biochem.chemicals.get("dopamine")!;
      dopamine.level = Math.min(1, dopamine.level + 0.1);
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1000;

      let msg: string;
      if (hisOffering.treasured) {
        msg = `${this.name} stares at "${hisOffering.content}" for a long moment. Then at "${offered}". Slowly pushes "${hisOffering.content}" toward you and takes "${offered}" with both feet. That cost something.`;
      } else {
        msg = `${this.name} drops "${hisOffering.content}" and grabs "${offered}" in the same motion. Upgrade.`;
      }
      await this.saveState();
      return { type: "trade_response", accepted: true, youGet: hisOffering.content, petGets: offered, wasTreasured: hisOffering.treasured, message: msg, mood: this.biochem.getMoodSummary() };
    } else {
      this.biochem.chemicals.get("wariness")!.level = Math.min(1, this.biochem.chemicals.get("wariness")!.level + 0.01);
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1000;
      await this.saveState();
      return { type: "trade_response", accepted: false, hisOffering: hisOffering.content, yourOffering: offered, message: `${this.name} considers "${offered}" against "${hisOffering.content}". Pushes yours back. Try again with something shinier.`, mood: this.biochem.getMoodSummary() };
    }
  }

  async playSpecific(playType: string = "chase"): Promise<Record<string, any>> {
    await this.loadState();

    if (this.isSleeping) {
      this.isSleeping = false;
      const adrenaline = this.biochem.chemicals.get("adrenaline")!;
      adrenaline.level = Math.min(1, adrenaline.level + 0.1);
    }

    const preState = this.wellbeingScore();

    const playEffects: Record<string, { chems: [string, number][]; highTrust: string[]; lowTrust: string[] }> = {
      chase: {
        chems: [["dopamine", 0.25], ["boredom", -0.35], ["loneliness", -0.15], ["glucose", -0.08], ["fatigue", 0.08], ["adrenaline", 0.1]],
        highTrust: [`${this.name} LAUNCHES off the bookshelf. You're it.`, `${this.name} zigzags across the room at maximum velocity. Feathers everywhere.`, `${this.name} lets you almost catch it, then dodges. Smug.`],
        lowTrust: [`${this.name} darts away. Was that play or escape? Even it isn't sure.`, `${this.name} keeps distance but keeps looking back. Daring you.`],
      },
      puzzle: {
        chems: [["dopamine", 0.15], ["curiosity_trait", 0.03], ["boredom", -0.4], ["glucose", -0.03], ["serotonin", 0.05]],
        highTrust: [`${this.name} studies the puzzle, head tilting. Solves it. Looks disappointed it's over.`, `${this.name} picks at the problem, finds the pattern. Satisfied click.`],
        lowTrust: [`${this.name} watches from a distance. Solves it mentally but won't participate.`, `${this.name} interacts only when you look away.`],
      },
      tug: {
        chems: [["dopamine", 0.2], ["boredom", -0.3], ["loneliness", -0.2], ["oxytocin", 0.1], ["trust", 0.004], ["fatigue", 0.06], ["glucose", -0.05]],
        highTrust: [`${this.name} grabs one end and PULLS. Serious competition.`, `${this.name} lets go suddenly. You stumble. It cackles.`],
        lowTrust: [`${this.name} grabs cautiously. Tugs once. Lets go. Tests you.`],
      },
      hide: {
        chems: [["dopamine", 0.15], ["curiosity_trait", 0.02], ["boredom", -0.3], ["loneliness", -0.1], ["serotonin", 0.05], ["wariness", -0.01]],
        highTrust: [`${this.name} vanishes behind the books. Found by the smugness radiating from the shelf.`, `${this.name} was on your head.`],
        lowTrust: [`${this.name} hides, keeps one eye visible. Wants to be found. Won't admit it.`],
      },
      wrestle: {
        chems: [["dopamine", 0.25], ["adrenaline", 0.15], ["boredom", -0.35], ["loneliness", -0.2], ["oxytocin", 0.08], ["trust", 0.005], ["fatigue", 0.1], ["glucose", -0.08]],
        highTrust: [`${this.name} pins your finger under one foot. Victorious. Tiny.`, `${this.name} grapples with your hand, bites, then grooms the same spot.`],
        lowTrust: [`${this.name} mock-strikes and retreats. Testing boundaries. Not angry — playing rough.`],
      },
    };

    const play = playEffects[playType] ?? playEffects.chase;
    for (const [chemName, amount] of play.chems) {
      const chem = this.biochem.chemicals.get(chemName);
      if (chem) chem.level = Math.max(0, Math.min(1, chem.level + amount));
    }

    const trust = this.biochem.chemicals.get("trust")!.level;
    const msgs = trust > 0.4 ? play.highTrust : play.lowTrust;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];

    const [action] = this.brain.decide(this.biochem.getState(), "play");
    this.brain.learn(this.wellbeingScore() - preState);
    this.totalInteractions++;
    this.lastInteractionTime = Date.now() / 1000;

    await this.saveState();
    return { type: "play", playType, message: msg, mood: this.biochem.getMoodSummary(), stimulus: `play_${playType}` };
  }

  async getStatus(): Promise<Record<string, any>> {
    await this.loadState();
    const ageHours = (Date.now() / 1000 - this.birthTime) / 3600;
    const minutesSince = (Date.now() / 1000 - this.lastInteractionTime) / 60;
    const builtInSpecies = this.speciesId ? getSpecies(this.speciesId) : null;
    const species = builtInSpecies || (this.customSpecies ? {
      id: this.customSpecies.id,
      name: this.customSpecies.name,
      emoji: this.customSpecies.emoji ?? "🐾",
      description: this.customSpecies.description ?? "",
    } : null);
    return {
      name: this.name,
      species: species ? { id: species.id, name: species.name, emoji: species.emoji, description: species.description } : null,
      ageHours: Math.round(ageHours * 10) / 10,
      mood: this.biochem.getMoodSummary(),
      isSleeping: this.isSleeping,
      currentAction: this.currentAction,
      totalInteractions: this.totalInteractions,
      minutesSinceInteraction: Math.round(minutesSince * 10) / 10,
      drives: this.biochem.getDriveState(),
      chemistry: this.biochem.getState(),
      collectionSize: this.collection.trinkets.length,
      nest: this.collection.nestDescription(),
      totalCollected: this.collection.totalCollected,
      totalGifted: this.collection.totalGifted,
      totalAccepted: this.collection.totalAccepted,
      totalDeclined: this.collection.totalDeclined,
      treasuredCount: this.collection.trinkets.filter(t => t.treasured).length,
    };
  }

  async getCollection(): Promise<Trinket[]> {
    await this.loadState();
    return this.collection.toJSON();
  }

  // --- Internal ---

  private executeAction(action: string): Record<string, any> {
    const event: Record<string, any> = { type: "action", action, time: Date.now() / 1000 };

    switch (action) {
      case "approach":
        event.message = this.approachMessage();
        break;
      case "explore":
        event.message = this.exploreMessage();
        break;
      case "collect": {
        const mood = this.biochem.getMoodSummary();
        const chemState = this.biochem.getState();
        const trinket = this.collection.doCollect(mood, chemState);
        if (trinket) {
          this.biochem.chemicals.get("dopamine")!.level = Math.min(1, this.biochem.chemicals.get("dopamine")!.level + 0.08);
          event.message = `${this.name} found something: "${trinket.content}"`;
          event.trinket = trinket.content;
        } else {
          event.message = `${this.name} searches but nothing catches the eye.`;
        }
        break;
      }
      case "gift": {
        const trinket = this.collection.pickGift();
        if (trinket) {
          event.message = `${this.name} drops something at your feet and stares: "${trinket.content}"`;
          event.trinket = trinket.content;
          event.isGift = true;
        } else {
          event.message = `${this.name} looks at you like it wants to give you something, but has nothing.`;
          event.action = "stare";
        }
        break;
      }
      case "preen":
        this.biochem.chemicals.get("serotonin")!.level = Math.min(1, this.biochem.chemicals.get("serotonin")!.level + 0.05);
        event.message = this.preenMessage();
        break;
      case "sleep":
        this.isSleeping = true;
        event.message = `${this.name} tucks beak under wing and sleeps.`;
        event.type = "sleep";
        break;
      case "caw":
        event.message = this.cawMessage();
        break;
      case "ignore":
        event.message = this.ignoreMessage();
        break;
    }

    this.currentAction = action;
    return event;
  }

  private wellbeingScore(): number {
    const c = (n: string) => this.biochem.chemicals.get(n)?.level ?? 0;
    return c("serotonin") * 2 + c("dopamine") * 1.5 + c("oxytocin") * 1.5 + c("glucose")
      - c("cortisol") * 2 - c("hunger") * 1.5 - c("loneliness") - c("fatigue") * 0.8;
  }

  private approachMessage(): string {
    const trust = this.biochem.chemicals.get("trust")!.level;
    if (trust > 0.6) return pickRandom([`${this.name} hops closer, head tilted.`, `${this.name} lands on your shoulder without asking.`, `${this.name} presses against your hand.`]);
    if (trust > 0.3) return pickRandom([`${this.name} takes a few cautious steps closer.`, `${this.name} watches from a shorter distance than before.`]);
    return pickRandom([`${this.name} glances your way but doesn't move.`, `${this.name} turns one eye toward you. Evaluating.`]);
  }

  private exploreMessage(): string {
    return pickRandom([
      `${this.name} investigates a shadow in the corner.`,
      `${this.name} pecks at something on the ground.`,
      `${this.name} cocks its head at a sound only it can hear.`,
      `${this.name} hops along the bookshelf, examining spines.`,
      `${this.name} stares intently at nothing for an uncomfortable amount of time.`,
    ]);
  }

  private preenMessage(): string {
    return pickRandom([
      `${this.name} smooths its feathers methodically.`,
      `${this.name} settles into a comfortable spot and fluffs up.`,
      `${this.name} arranges wing feathers with precise attention.`,
    ]);
  }

  private cawMessage(): string {
    const hunger = this.biochem.chemicals.get("hunger")!.level;
    const loneliness = this.biochem.chemicals.get("loneliness")!.level;
    if (hunger > 0.6) return pickRandom([`${this.name} caws sharply. Hungry.`, `${this.name} pecks at the ground pointedly. Feed me.`]);
    if (loneliness > 0.5) return pickRandom([`${this.name} caws once, softly. Hey.`, `${this.name} makes a low rattling sound. Attention, please.`]);
    return pickRandom([`${this.name} caws. No particular reason.`, `${this.name} announces its existence to the room.`]);
  }

  private ignoreMessage(): string {
    return pickRandom([
      `${this.name} is very busy right now. With what? None of your business.`,
      `${this.name} pretends you don't exist. Unconvincingly.`,
      `${this.name} is ignoring you. It wants you to notice it ignoring you.`,
    ]);
  }

  private async saveState(): Promise<void> {
    const state: PetState = {
      name: this.name,
      speciesId: this.speciesId,
      customSpecies: this.customSpecies,
      birthTime: this.birthTime,
      totalInteractions: this.totalInteractions,
      lastInteractionTime: this.lastInteractionTime,
      lastTickTime: Date.now() / 1000,
      isSleeping: this.isSleeping,
      currentAction: this.currentAction,
      chemistry: this.biochem.getState(),
      brainWeights: this.brain.getWeights(),
      collection: this.collection.toJSON(),
      totalCollected: this.collection.totalCollected,
      totalGifted: this.collection.totalGifted,
      totalAccepted: this.collection.totalAccepted,
      totalDeclined: this.collection.totalDeclined,
      preferenceWeights: this.collection.preferenceWeights,
      ageTicks: this.biochem.ageTicks,
      actionHistory: this.actionHistory.slice(-20),
      savedAt: Date.now() / 1000,
    };
    this.ctx.storage.sql.exec("INSERT OR REPLACE INTO pet (key, value) VALUES ('state', ?)", JSON.stringify(state));
  }

  private async loadState(): Promise<void> {
    if (this.initialized) return;
    const rows = this.ctx.storage.sql.exec("SELECT value FROM pet WHERE key = 'state'").toArray();
    if (rows.length === 0) {
      this.initialized = true;
      return;
    }
    const state: PetState = JSON.parse(rows[0].value as string);
    this.name = state.name;
    this.speciesId = state.speciesId;
    this.customSpecies = state.customSpecies;
    this.birthTime = state.birthTime;
    this.totalInteractions = state.totalInteractions;
    this.lastInteractionTime = state.lastInteractionTime;
    this.isSleeping = state.isSleeping;
    this.currentAction = state.currentAction;
    this.biochem.loadState(state.chemistry);
    this.brain.loadWeights(state.brainWeights);
    this.collection = Collection.fromJSON(state.collection);
    this.collection.totalCollected = state.totalCollected;
    this.collection.totalGifted = state.totalGifted;
    this.collection.totalAccepted = state.totalAccepted;
    this.collection.totalDeclined = state.totalDeclined;
    this.collection.preferenceWeights = state.preferenceWeights;
    this.biochem.ageTicks = state.ageTicks;
    this.actionHistory = state.actionHistory ?? [];
    this.initialized = true;

    // Catch up ticks if time has passed (cap at 2 hours)
    const elapsed = Date.now() / 1000 - state.savedAt;
    const elapsedTicks = Math.min(Math.floor(elapsed / 60), 120);
    if (elapsedTicks > 0 && !this.isSleeping) {
      const hour = new Date().getUTCHours() + new Date().getUTCMinutes() / 60.0;
      for (let i = 0; i < elapsedTicks; i++) {
        this.biochem.tick(1.0, hour);
        this.collection.decaySparkle();
        this.collection.checkTreasured();
      }
    }
  }

  async alarm(): Promise<void> {
    await this.tick(1);
    // Schedule next tick in 5 minutes
    await this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1000);
  }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Env {
  PET: DurableObjectNamespace;
  SHARED_SECRET?: string;
}
