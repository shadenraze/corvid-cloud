/**
 * Corvid Biochemistry System
 * Creatures-inspired chemical simulation. Chemicals rise and fall over time,
 * interact through reactions, and drive emergent behavior.
 * 
 * Ported from Python biochem.py — identical logic, TypeScript.
 */

export interface ChemicalDef {
  name: string;
  level: number;
  decayRate: number;
  growthRate: number;
  minLevel: number;
  maxLevel: number;
}

export interface Reaction {
  name: string;
  conditions: [string, number, boolean][]; // [chemName, threshold, above]
  effects: [string, number][];             // [chemName, amountChange]
  rate: number;
}

export interface ChemState {
  [key: string]: number;
}

const CHEMICALS: ChemicalDef[] = [
  // Metabolic
  { name: "glucose", level: 0.7, decayRate: 0.008, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "melatonin", level: 0.0, decayRate: 0.02, growthRate: 0, minLevel: 0, maxLevel: 1 },
  // Stress / alertness
  { name: "cortisol", level: 0.1, decayRate: 0.005, growthRate: 0.002, minLevel: 0, maxLevel: 1 },
  { name: "adrenaline", level: 0.0, decayRate: 0.04, growthRate: 0, minLevel: 0, maxLevel: 1 },
  // Reward / bonding
  { name: "dopamine", level: 0.3, decayRate: 0.015, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "oxytocin", level: 0.2, decayRate: 0.003, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "serotonin", level: 0.4, decayRate: 0.008, growthRate: 0.001, minLevel: 0, maxLevel: 1 },
  // Drives (rise when unsatisfied)
  { name: "hunger", level: 0.2, decayRate: 0, growthRate: 0.006, minLevel: 0, maxLevel: 1 },
  { name: "boredom", level: 0.1, decayRate: 0, growthRate: 0.005, minLevel: 0, maxLevel: 1 },
  { name: "loneliness", level: 0.2, decayRate: 0, growthRate: 0.004, minLevel: 0, maxLevel: 1 },
  { name: "fatigue", level: 0.1, decayRate: 0, growthRate: 0.003, minLevel: 0, maxLevel: 1 },
  // Emergent personality (accumulate slowly)
  { name: "trust", level: 0.1, decayRate: 0.001, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "wariness", level: 0.2, decayRate: 0.001, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "curiosity_trait", level: 0.5, decayRate: 0.0005, growthRate: 0.001, minLevel: 0, maxLevel: 1 },
];

const REACTIONS: Reaction[] = [
  {
    name: "hunger_stress",
    conditions: [["hunger", 0.6, true], ["glucose", 0.3, false]],
    effects: [["cortisol", 0.02]],
    rate: 1.0,
  },
  {
    name: "stress_without_comfort",
    conditions: [["cortisol", 0.5, true], ["oxytocin", 0.3, false]],
    effects: [["wariness", 0.005], ["trust", -0.002]],
    rate: 1.0,
  },
  {
    name: "safe_bonding",
    conditions: [["oxytocin", 0.4, true], ["cortisol", 0.3, false]],
    effects: [["trust", 0.003], ["wariness", -0.002]],
    rate: 1.0,
  },
  {
    name: "boredom_to_curiosity",
    conditions: [["boredom", 0.5, true], ["glucose", 0.3, true]],
    effects: [["curiosity_trait", 0.002], ["boredom", -0.01]],
    rate: 1.0,
  },
  {
    name: "exhaustion",
    conditions: [["fatigue", 0.7, true], ["melatonin", 0.5, true]],
    effects: [["serotonin", -0.02], ["cortisol", 0.01]],
    rate: 1.0,
  },
  {
    name: "reward_cascade",
    conditions: [["dopamine", 0.5, true], ["serotonin", 0.4, true]],
    effects: [["cortisol", -0.02], ["boredom", -0.03]],
    rate: 1.0,
  },
  {
    name: "lonely_bored",
    conditions: [["loneliness", 0.5, true], ["boredom", 0.5, true]],
    effects: [["cortisol", 0.015], ["serotonin", -0.01]],
    rate: 1.0,
  },
  {
    name: "trust_amplifies_bonding",
    conditions: [["trust", 0.5, true], ["oxytocin", 0.3, true]],
    effects: [["oxytocin", 0.005], ["serotonin", 0.005]],
    rate: 1.0,
  },
  {
    name: "wary_startle",
    conditions: [["wariness", 0.5, true], ["adrenaline", 0.3, true]],
    effects: [["cortisol", 0.03], ["adrenaline", 0.02]],
    rate: 1.0,
  },
];

const STIMULI: Record<string, [string, number][]> = {
  feed: [["glucose", 0.3], ["hunger", -0.4], ["dopamine", 0.1], ["loneliness", -0.05]],
  play: [["dopamine", 0.2], ["boredom", -0.3], ["loneliness", -0.15], ["glucose", -0.05], ["fatigue", 0.05], ["oxytocin", 0.08]],
  talk: [["loneliness", -0.2], ["oxytocin", 0.06], ["boredom", -0.1], ["serotonin", 0.05]],
  pet: [["oxytocin", 0.15], ["cortisol", -0.1], ["loneliness", -0.2], ["serotonin", 0.08], ["wariness", -0.02]],
  poke: [["adrenaline", 0.2], ["cortisol", 0.1], ["boredom", -0.1], ["wariness", 0.03]],
  gift_accepted: [["dopamine", 0.15], ["oxytocin", 0.1], ["serotonin", 0.1], ["trust", 0.005]],
  gift_declined: [["cortisol", 0.05], ["dopamine", -0.05], ["wariness", 0.01]],
  receive_gift: [["dopamine", 0.15], ["oxytocin", 0.12], ["loneliness", -0.15], ["boredom", -0.2], ["trust", 0.003], ["curiosity_trait", 0.02]],
  trade_complete: [["dopamine", 0.2], ["oxytocin", 0.08], ["boredom", -0.25], ["trust", 0.006], ["curiosity_trait", 0.015], ["loneliness", -0.1]],
  trade_refused: [["wariness", 0.015], ["cortisol", 0.03]],
};

export class BiochemSystem {
  chemicals: Map<string, ChemicalDef>;
  ageTicks: number;

  constructor() {
    this.chemicals = new Map();
    for (const c of CHEMICALS) {
      this.chemicals.set(c.name, { ...c });
    }
    this.ageTicks = 0;
  }

  tick(dt: number = 1.0, hourOfDay?: number): void {
    // Natural decay/growth
    for (const chem of this.chemicals.values()) {
      chem.level += (chem.growthRate - chem.decayRate) * dt;
      chem.level = Math.max(chem.minLevel, Math.min(chem.maxLevel, chem.level));
    }

    // Circadian rhythm — melatonin
    if (hourOfDay !== undefined) {
      const melatoninTarget = Math.max(0, Math.sin((hourOfDay - 14) * Math.PI / 12)) * 0.8;
      const melatonin = this.chemicals.get("melatonin")!;
      melatonin.level += (melatoninTarget - melatonin.level) * 0.05 * dt;
    }

    // Run reactions
    for (const reaction of REACTIONS) {
      if (this.checkConditions(reaction.conditions)) {
        for (const [chemName, amount] of reaction.effects) {
          const chem = this.chemicals.get(chemName);
          if (chem) {
            chem.level = Math.max(chem.minLevel, Math.min(chem.maxLevel, chem.level + amount * reaction.rate * dt));
          }
        }
      }
    }

    this.ageTicks++;
  }

  checkConditions(conditions: [string, number, boolean][]): boolean {
    for (const [chemName, threshold, above] of conditions) {
      const chem = this.chemicals.get(chemName);
      if (!chem) return false;
      if (above && chem.level < threshold) return false;
      if (!above && chem.level >= threshold) return false;
    }
    return true;
  }

  applyStimulus(stimulus: string): void {
    const effects = STIMULI[stimulus];
    if (!effects) return;
    for (const [chemName, amount] of effects) {
      const chem = this.chemicals.get(chemName);
      if (chem) {
        chem.level = Math.max(chem.minLevel, Math.min(chem.maxLevel, chem.level + amount));
      }
    }
  }

  getState(): ChemState {
    const state: ChemState = {};
    for (const [name, chem] of this.chemicals) {
      state[name] = Math.round(chem.level * 10000) / 10000;
    }
    return state;
  }

  getDriveState(): Record<string, number> {
    return {
      hunger: this.chemicals.get("hunger")!.level,
      boredom: this.chemicals.get("boredom")!.level,
      loneliness: this.chemicals.get("loneliness")!.level,
      fatigue: this.chemicals.get("fatigue")!.level,
      stress: this.chemicals.get("cortisol")!.level,
      happiness: this.chemicals.get("serotonin")!.level,
      energy: 1.0 - this.chemicals.get("fatigue")!.level,
      curiosity: this.chemicals.get("curiosity_trait")!.level,
      trust: this.chemicals.get("trust")!.level,
      wariness: this.chemicals.get("wariness")!.level,
    };
  }

  loadState(state: ChemState): void {
    for (const [name, level] of Object.entries(state)) {
      const chem = this.chemicals.get(name);
      if (chem) chem.level = level;
    }
  }

  getMoodSummary(): string {
    const drives = this.getDriveState();
    if (drives.fatigue > 0.7) return "exhausted";
    if (drives.hunger > 0.7) return "ravenous";
    if (drives.stress > 0.6 && drives.trust < 0.3) return "agitated";
    if (drives.loneliness > 0.6) return "lonely";
    if (drives.boredom > 0.6 && drives.energy > 0.4) return "restless";
    if (drives.happiness > 0.6 && drives.trust > 0.5) return "content";
    if (drives.happiness > 0.5) return "calm";
    if (drives.curiosity > 0.6 && drives.energy > 0.5) return "curious";
    if (drives.wariness > 0.5) return "wary";
    if (drives.fatigue > 0.5) return "drowsy";
    return "neutral";
  }
}
