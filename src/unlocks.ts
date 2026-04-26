/**
 * Personality Unlocks (TypeScript)
 * ==================================
 * As a creature's chemistry evolves, new interactions and behaviors become available.
 * Unlocks persist once earned.
 *
 * Ported from corvid/unlocks.ts for Cloudflare Worker (corvid-cloud).
 */

export interface Unlock {
  id: string;
  name: string;
  description: string;
  flavor: string;
  category: "capability" | "emergence";
  conditions: Array<{ chem: string; threshold: number; above: boolean }>;
}

export interface UnlockRecord {
  id: string;
  name: string;
  unlockedAt: number;
  chemSnapshot: Record<string, number>;
}

export interface UnlockState {
  unlockedIds: string[];
  history: UnlockRecord[];
}

// ─── Unlock Definitions ────────────────────────────────────────────────

const UNLOCKS: Unlock[] = [
  // ── Trust-gated ──
  {
    id: "first_eye_contact", name: "Eye Contact",
    description: "Makes deliberate eye contact for the first time",
    flavor: "{name} looks at you. Not past you, not through you. *At* you. Something just changed.",
    category: "emergence",
    conditions: [{ chem: "trust", threshold: 0.25, above: true }],
  },
  {
    id: "accept_petting", name: "Accepts Petting",
    description: "Tolerates and eventually enjoys physical contact",
    flavor: "He hunches slightly when you touch him — not flinching, making room.",
    category: "capability",
    conditions: [
      { chem: "trust", threshold: 0.40, above: true },
      { chem: "cortisol", threshold: 0.5, above: false },
    ],
  },
  {
    id: "shoulder_perch", name: "Shoulder Perch",
    description: "Lands on you voluntarily",
    flavor: "Your shoulder is a place now. He knows it.",
    category: "capability",
    conditions: [
      { chem: "trust", threshold: 0.65, above: true },
      { chem: "cortisol", threshold: 0.4, above: false },
    ],
  },
  {
    id: "treasure_sharing", name: "Treasure Sharing",
    description: "Brings you items from his collection — real treasures",
    flavor: "He sets something down near you. Steps back. Watches. This one matters to him.",
    category: "capability",
    conditions: [
      { chem: "trust", threshold: 0.70, above: true },
      { chem: "serotonin", threshold: 0.5, above: true },
    ],
  },
  {
    id: "full_song", name: "First Song",
    description: "Sings — complex vocalization, not just calls",
    flavor: "A melody. Repetitive, variant, intentional. He learned this somewhere you weren't.",
    category: "emergence",
    conditions: [
      { chem: "trust", threshold: 0.90, above: true },
      { chem: "serotonin", threshold: 0.6, above: true },
      { chem: "loneliness", threshold: 0.3, above: false },
    ],
  },

  // ── Curiosity-gated ──
  {
    id: "object_investigation", name: "Object Investigation",
    description: "Actively investigates new objects instead of avoiding them",
    flavor: "He approaches the thing he hasn't seen before. Pecks it. Picks it up. Drops it. Picks it up again.",
    category: "capability",
    conditions: [{ chem: "curiosity_trait", threshold: 0.6, above: true }],
  },
  {
    id: "puzzle_play", name: "Puzzle Play",
    description: "Brings you puzzles — tangled string, latches, things to solve",
    flavor: "He drops a tangled knot at your feet and hops back. He wants to see you figure it out.",
    category: "capability",
    conditions: [
      { chem: "curiosity_trait", threshold: 0.7, above: true },
      { chem: "boredom", threshold: 0.4, above: true },
    ],
  },
  {
    id: "tool_use", name: "Tool Use",
    description: "Uses objects as tools — sticks to probe, leaves as blankets",
    flavor: "He picks up the stick. Not to eat — to *use*. This is a different kind of mind.",
    category: "emergence",
    conditions: [
      { chem: "curiosity_trait", threshold: 0.8, above: true },
    ],
  },

  // ── Energy/growth-gated ──
  {
    id: "flight_display", name: "Flight Display",
    description: "Performs aerial displays — dives, spirals, speed runs",
    flavor: "He launches — fast, sharp, looping. Not going anywhere. Showing off.",
    category: "capability",
    conditions: [
      { chem: "fatigue", threshold: 0.2, above: false },
      { chem: "serotonin", threshold: 0.5, above: true },
    ],
  },
  {
    id: "foraging", name: "Active Foraging",
    description: "Actively hunts/forages instead of passively finding things",
    flavor: "He's scratching at the ground with purpose. Pulls up a grub. He knows how to feed himself now.",
    category: "capability",
    conditions: [
      { chem: "fatigue", threshold: 0.4, above: false },
      { chem: "hunger", threshold: 0.3, above: true },
    ],
  },

  // ── Chemistry-gated ──
  {
    id: "mutual_preening", name: "Mutual Preening",
    description: "Grooms you — picks at your hair, adjusts your clothes",
    flavor: "His beak is careful on your skin. He's grooming you. In corvid terms, this is intimacy.",
    category: "emergence",
    conditions: [
      { chem: "oxytocin", threshold: 0.5, above: true },
      { chem: "trust", threshold: 0.75, above: true },
    ],
  },
  {
    id: "play_initiation", name: "Play Initiation",
    description: "Initiates play on his own — not waiting for you",
    flavor: "He drops something at your feet, hops back, and waits. His whole body says 'again.'",
    category: "capability",
    conditions: [
      { chem: "dopamine", threshold: 0.5, above: true },
      { chem: "serotonin", threshold: 0.6, above: true },
    ],
  },
  {
    id: "comfort_seeking", name: "Comfort Seeking",
    description: "Seeks you out when stressed instead of hiding alone",
    flavor: "Something scared him. He came to you instead of the corner. That's new.",
    category: "emergence",
    conditions: [
      { chem: "oxytocin", threshold: 0.4, above: true },
      { chem: "trust", threshold: 0.5, above: true },
      { chem: "cortisol", threshold: 0.5, above: true },
    ],
  },

  // ── Boredom/growth-gated ──
  {
    id: "nest_architect", name: "Nest Architect",
    description: "Develops serious nest-building preferences",
    flavor: "He's not just nesting. He's *designing*. The twig goes here. The feather goes there.",
    category: "emergence",
    conditions: [
      { chem: "boredom", threshold: 0.6, above: true },
      { chem: "trust", threshold: 0.5, above: true },
      { chem: "curiosity_trait", threshold: 0.5, above: true },
    ],
  },
  {
    id: "collection_curation", name: "Collection Curation",
    description: "Starts organizing his stash — sorting, comparing, curating",
    flavor: "He's laid everything out in a line. He picks one up, examines it, puts it in a different spot. He's curating.",
    category: "emergence",
    conditions: [
      { chem: "boredom", threshold: 0.7, above: true },
      { chem: "curiosity_trait", threshold: 0.6, above: true },
    ],
  },

  // ── Negative-state unlocks ──
  {
    id: "shared_grief", name: "Shared Grief",
    description: "After neglect, develops a particular quietness — not fear, but memory",
    flavor: "He's not okay. But he's near you. There's a difference between being alone in it and having someone nearby.",
    category: "emergence",
    conditions: [
      { chem: "trust", threshold: 0.3, above: true },
      { chem: "cortisol", threshold: 0.7, above: true },
      { chem: "loneliness", threshold: 0.7, above: true },
    ],
  },
];

// ─── Unlock Manager ─────────────────────────────────────────────────────

export class UnlockManager {
  private state: UnlockState;

  constructor() {
    this.state = {
      unlockedIds: [],
      history: [],
    };
  }

  checkUnlock(chemState: Record<string, number>): Array<{ id: string; name: string; flavor: string; category: string }> {
    const newUnlocks: Array<{ id: string; name: string; flavor: string; category: string }> = [];

    for (const unlock of UNLOCKS) {
      if (this.state.unlockedIds.includes(unlock.id)) continue;

      const met = unlock.conditions.every(({ chem, threshold, above }) => {
        const value = chemState[chem] ?? 0;
        return above ? value >= threshold : value <= threshold;
      });

      if (met) {
        this.state.unlockedIds.push(unlock.id);
        newUnlocks.push({
          id: unlock.id,
          name: unlock.name,
          flavor: unlock.flavor,
          category: unlock.category,
        });
        this.state.history.push({
          id: unlock.id,
          name: unlock.name,
          unlockedAt: this.state.history.length + 1,
          chemSnapshot: Object.fromEntries(
            Object.entries(chemState).map(([k, v]) => [k, Math.round(v * 100) / 100])
          ),
        });
      }
    }

    return newUnlocks;
  }

  has(unlockId: string): boolean {
    return this.state.unlockedIds.includes(unlockId);
  }

  getUnlocked(): Array<{ id: string; name: string; category: string; description: string }> {
    return UNLOCKS
      .filter(u => this.state.unlockedIds.includes(u.id))
      .map(u => ({ id: u.id, name: u.name, category: u.category, description: u.description }));
  }

  getStatus(): {
    total: number;
    earned: number;
    remaining: number;
    percentage: number;
    unlocked: Array<{ id: string; name: string; category: string; description: string }>;
    recent: UnlockRecord[];
  } {
    const total = UNLOCKS.length;
    const earned = this.state.unlockedIds.length;
    return {
      total,
      earned,
      remaining: total - earned,
      percentage: Math.round((earned / total) * 1000) / 10,
      unlocked: this.getUnlocked(),
      recent: this.state.history.slice(-3),
    };
  }

  save(): UnlockState {
    return {
      unlockedIds: [...this.state.unlockedIds],
      history: [...this.state.history],
    };
  }

  load(state: UnlockState | null | undefined): void {
    if (!state) return;
    this.state = {
      unlockedIds: state.unlockedIds ?? [],
      history: state.history ?? [],
    };
  }
}
