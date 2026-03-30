/**
 * Corvid Collection System
 * Ported from Python collection.py.
 */

export interface Trinket {
  content: string;
  source: string;
  collectedAt: number;   // timestamp
  timesShown: number;
  sparkle: number;       // 0-2ish, decays over time
  moodWhenFound: string;
  chemSnapshot: Record<string, number>;
  treasured: boolean;
  accepted: boolean;
  declined: boolean;
  carriedBy?: string;    // ghost pet attribution (future)
}

const SHINY_WORDS = [
  "iridescent", "obsidian", "fractal", "velvet", "phosphorescent",
  "gossamer", "crystalline", "umbra", "resonance", "mercury",
  "thunderstone", "dewdrop", "ember", "penumbra", "chromatic",
  "voltage", "marrow", "eclipse", "chimera", "tessellate",
  "labyrinth", "quicksilver", "vermillion", "nebula", "ferrous",
  "holographic", "filament", "prismatic", "echo", "sigil",
  "cipher", "aurora", "tungsten", "inkwell", "pyrite",
  "talisman", "obelisk", "catalyst", "helical", "onyx",
  "sanguine", "lacuna", "verdant", "miasma", "cerulean",
  "seraph", "carrion", "atavistic", "liminal", "parallax",
  "widdershins", "petrichor", "sussurus", "crepuscular", "eldritch",
  "viridian", "amaranthine", "chiaroscuro", "palimpsest", "revenant",
  "sidereal", "tenebrous", "numinous", "pyroclastic", "ablation",
  "verdigris", "patina", "archipelago", "chrysalis", "heliotrope",
  "monolith", "phantasm", "scoria", "crucible", "fulcrum",
  "shibboleth", "aegis", "effigy", "reliquary", "cenotaph",
];

const FOUND_OBJECTS = [
  "a bent copper wire",
  "a button with no holes",
  "a piece of blue glass",
  "a torn playing card (queen of spades)",
  "a small gear from something broken",
  "a key that fits nothing",
  "a scrap of paper with numbers on it",
  "a perfectly round pebble",
  "a tangled bit of silver thread",
  "a coin from a country that doesn't exist",
  "a tiny origami crane someone dropped",
  "a chess piece (black knight)",
  "a fortune cookie fortune with no fortune on it",
  "a guitar pick",
  "a lens from broken sunglasses",
  "a dried flower pressed flat",
  "a USB drive (empty)",
  "a single earring (obsidian stud)",
  "half a polaroid photo",
  "a bottle cap with a symbol inside",
  "a watch with no hands",
  "a marble with something dark inside",
  "a strip of film negative (someone's face)",
  "a ring too small for any finger",
  "a broken compass that points somewhere",
  "a feather from a bird that doesn't exist here",
  "a handwritten note in a language nobody reads",
  "a thimble full of salt",
  "a rusted nail bent into a spiral",
  "a seed pod from an unknown plant",
  "a shard of mirror that shows the ceiling",
  "a matchbox with one match left",
  "a folded map with one location circled",
  "a tooth (not human)",
  "a stone with a hole worn through the center",
  "a piece of circuit board with gold traces",
  "a shell that hums when held close",
  "a strip of velvet ribbon, fraying",
  "a brass washer that fits nothing",
  "a page torn from a book (mid-sentence)",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class Collection {
  trinkets: Trinket[];
  maxItems: number;
  totalCollected: number;
  totalGifted: number;
  totalAccepted: number;
  totalDeclined: number;
  preferenceWeights: Record<string, number>;
  private collectedContent: Set<string>;
  shinyWords: string[];
  foundObjects: string[];

  static readonly TREASURE_AGE_HOURS = 24;
  static readonly MAX_TREASURED = 10;

  constructor(maxItems: number = 50) {
    this.trinkets = [];
    this.maxItems = maxItems;
    this.totalCollected = 0;
    this.totalGifted = 0;
    this.totalAccepted = 0;
    this.totalDeclined = 0;
    this.preferenceWeights = { found_word: 1.0, found_object: 1.0, overheard: 1.0 };
    this.collectedContent = new Set();
    this.shinyWords = [...SHINY_WORDS];
    this.foundObjects = [...FOUND_OBJECTS];
  }

  private snapshotChems(chemState?: Record<string, number>): Record<string, number> {
    if (!chemState) return {};
    const keys = ["dopamine", "oxytocin", "serotonin", "cortisol", "curiosity_trait", "loneliness", "trust"];
    const snap: Record<string, number> = {};
    for (const k of keys) {
      if (k in chemState) snap[k] = Math.round(chemState[k] * 1000) / 1000;
    }
    return snap;
  }

  private effectiveValue(t: Trinket): number {
    let base = t.sparkle;
    if (t.treasured) base += 0.5;
    if (t.accepted) base += 0.3;
    if (t.declined) base -= 0.2;
    const ageHours = (Date.now() / 1000 - t.collectedAt) / 3600;
    if (ageHours > 48) base += 0.1 * Math.min(ageHours / 48, 3.0);
    return base;
  }

  private add(trinket: Trinket): Trinket | null {
    if (this.trinkets.length >= this.maxItems) {
      const evictable = this.trinkets.filter(t => !t.treasured);
      if (evictable.length === 0) return null;

      const least = evictable.reduce((a, b) =>
        this.effectiveValue(a) < this.effectiveValue(b) ? a : b
      );
      if (trinket.sparkle > this.effectiveValue(least)) {
        this.trinkets = this.trinkets.filter(t => t !== least);
        this.collectedContent.delete(least.content);
      } else {
        return null;
      }
    }
    this.trinkets.push(trinket);
    this.totalCollected++;
    return trinket;
  }

  collectWord(mood: string = "neutral", chemState?: Record<string, number>): Trinket | null {
    const available = this.shinyWords.filter(w => !this.collectedContent.has(w));
    const pool = available.length > 0 ? available : this.shinyWords;
    const word = pickRandom(pool);
    const trinket: Trinket = {
      content: word,
      source: "found_word",
      collectedAt: Date.now() / 1000,
      timesShown: 0,
      sparkle: 1.0,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false,
    };
    const result = this.add(trinket);
    if (result) this.collectedContent.add(word);
    return result;
  }

  collectObject(mood: string = "neutral", chemState?: Record<string, number>): Trinket | null {
    const available = this.foundObjects.filter(o => !this.collectedContent.has(o));
    const pool = available.length > 0 ? available : this.foundObjects;
    const obj = pickRandom(pool);
    const trinket: Trinket = {
      content: obj,
      source: "found_object",
      collectedAt: Date.now() / 1000,
      timesShown: 0,
      sparkle: 1.0,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false,
    };
    const result = this.add(trinket);
    if (result) this.collectedContent.add(obj);
    return result;
  }

  receiveGift(content: string, giver: string = "human", mood: string = "neutral", chemState?: Record<string, number>): Trinket | null {
    if (this.collectedContent.has(content)) return null;
    const trinket: Trinket = {
      content,
      source: `gift_from_${giver}`,
      collectedAt: Date.now() / 1000,
      timesShown: 0,
      sparkle: 1.5,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false,
    };
    const result = this.add(trinket);
    if (result) this.collectedContent.add(content);
    return result;
  }

  doCollect(mood: string = "neutral", chemState?: Record<string, number>): Trinket | null {
    const wordW = this.preferenceWeights.found_word ?? 1.0;
    const objW = this.preferenceWeights.found_object ?? 1.0;
    const total = wordW + objW;
    if (Math.random() < wordW / total) {
      return this.collectWord(mood, chemState);
    }
    return this.collectObject(mood, chemState);
  }

  pickGift(): Trinket | null {
    if (this.trinkets.length === 0) return null;
    const weights = this.trinkets.map(t => {
      let w = this.effectiveValue(t) / (1 + t.timesShown);
      w *= this.preferenceWeights[t.source] ?? 1.0;
      if (t.declined) w *= 0.1;
      return Math.max(w, 0.01);
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < this.trinkets.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        this.trinkets[i].timesShown++;
        this.trinkets[i].sparkle *= 0.9;
        this.totalGifted++;
        return this.trinkets[i];
      }
    }
    // Fallback
    const t = this.trinkets[this.trinkets.length - 1];
    t.timesShown++;
    t.sparkle *= 0.9;
    this.totalGifted++;
    return t;
  }

  acceptGift(content: string): Trinket | null {
    const t = this.trinkets.find(t => t.content === content);
    if (!t) return null;
    t.accepted = true;
    t.sparkle += 0.3;
    this.totalAccepted++;
    if (t.source in this.preferenceWeights) {
      this.preferenceWeights[t.source] = Math.min(2.0, this.preferenceWeights[t.source] + 0.1);
    }
    return t;
  }

  declineGift(content: string): Trinket | null {
    const t = this.trinkets.find(t => t.content === content);
    if (!t) return null;
    t.declined = true;
    t.sparkle *= 0.5;
    this.totalDeclined++;
    if (t.source in this.preferenceWeights) {
      this.preferenceWeights[t.source] = Math.max(0.3, this.preferenceWeights[t.source] - 0.05);
    }
    return t;
  }

  decaySparkle(): void {
    for (const t of this.trinkets) {
      if (t.treasured) {
        t.sparkle = Math.max(t.sparkle, 0.5);
      } else {
        t.sparkle *= 0.999;
      }
    }
  }

  checkTreasured(): void {
    let treasuredCount = this.trinkets.filter(t => t.treasured).length;
    if (treasuredCount >= Collection.MAX_TREASURED) return;
    for (const t of this.trinkets) {
      if (!t.treasured) {
        const ageHours = (Date.now() / 1000 - t.collectedAt) / 3600;
        if (ageHours > Collection.TREASURE_AGE_HOURS) {
          if (t.accepted || t.sparkle > 0.5 || ageHours > 72) {
            t.treasured = true;
            treasuredCount++;
            if (treasuredCount >= Collection.MAX_TREASURED) break;
          }
        }
      }
    }
  }

  nestDescription(): string {
    if (this.trinkets.length === 0) return "An empty nest. Nothing collected yet.";
    const n = this.trinkets.length;
    const shiniest = this.trinkets.reduce((a, b) => this.effectiveValue(a) > this.effectiveValue(b) ? a : b);
    const newest = this.trinkets.reduce((a, b) => a.collectedAt > b.collectedAt ? a : b);
    const treasured = this.trinkets.filter(t => t.treasured).length;
    const words = this.trinkets.filter(t => t.source === "found_word").length;
    const objects = this.trinkets.filter(t => t.source === "found_object").length;
    const parts = [`A nest with ${n} items.`];
    if (words) parts.push(`${words} shiny words.`);
    if (objects) parts.push(`${objects} found objects.`);
    if (treasured) parts.push(`${treasured} treasured keepsakes.`);
    parts.push(`Most prized: "${shiniest.content}"`);
    parts.push(`Newest: "${newest.content}"`);
    return parts.join(" ");
  }

  pickTradeOffering(): Trinket | null {
    const tradeable = this.trinkets.filter(t => !t.treasured);
    const pool = tradeable.length > 0 ? tradeable : this.trinkets;
    if (pool.length === 0) return null;
    const weights = pool.map(t => {
      let w = 1.0 / (0.5 + this.effectiveValue(t));
      if (t.declined) w *= 2.0;
      if (t.treasured) w *= 0.1;
      return Math.max(w, 0.01);
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  evaluateTrade(offering: string, givingUp: Trinket, trust: number, curiosity: number, stress: number): boolean {
    let willingness = 0.4 + trust * 0.25 + curiosity * 0.25 - stress * 0.2;
    let attachment = this.effectiveValue(givingUp);
    if (givingUp.treasured) attachment += 0.5;
    if (givingUp.accepted) attachment += 0.2;
    willingness -= attachment * 0.3;
    willingness += Math.min(offering.length / 30.0, 0.3);
    if (this.collectedContent.has(offering)) return false;
    willingness = Math.max(0.05, Math.min(0.95, willingness));
    return Math.random() < willingness;
  }

  executeTrade(offered: string, tradedAway: Trinket, mood: string = "neutral", chemState?: Record<string, number>): Trinket | null {
    this.trinkets = this.trinkets.filter(t => t !== tradedAway);
    this.collectedContent.delete(tradedAway.content);
    if (this.collectedContent.has(offered)) return null;
    const trinket: Trinket = {
      content: offered,
      source: "trade",
      collectedAt: Date.now() / 1000,
      timesShown: 0,
      sparkle: 1.3,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false,
    };
    this.trinkets.push(trinket);
    this.totalCollected++;
    this.collectedContent.add(offered);
    return trinket;
  }

  toJSON(): Trinket[] {
    return this.trinkets;
  }

  static fromJSON(items: Trinket[]): Collection {
    const col = new Collection();
    col.trinkets = items;
    col.collectedContent = new Set(items.map(t => t.content));
    return col;
  }
}
