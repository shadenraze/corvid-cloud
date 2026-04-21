/**
 * Scrit Behavioral Texture Matrix (TypeScript)
 * ==============================================
 * Maps drive states + trust tier to contextual behavioral descriptions.
 *
 * Ported from corvid/behaviors.py for Cloudflare Worker (corvid-cloud).
 * Three-layer system: dominant drive + secondary modifier + trust filter.
 */

export interface DriveState {
  hunger: number;
  boredom: number;
  loneliness: number;
  fatigue: number;
  stress: number;
  happiness: number;
  energy: number;
  curiosity: number;
  trust: number;
  wariness: number;
}

export interface TrustTier {
  name: string;
  style: string;
  distance: string;
}

interface BehaviorEntry {
  [key: string]: string[];
}

// ─── Trust Tiers ───────────────────────────────────────────────────────

function getTrustTier(trust: number): TrustTier {
  if (trust < 0.15) return { name: "abandoned", style: "hides, watches from distance", distance: "far" };
  if (trust < 0.35) return { name: "wary", style: "observes carefully, retreats fast", distance: "cautious" };
  if (trust < 0.60) return { name: "cautious", style: "approaches within reach, stays briefly", distance: "near" };
  if (trust < 0.80) return { name: "warming", style: "perches near, brings finds", distance: "close" };
  if (trust < 0.95) return { name: "bonded", style: "perches on shoulder, grooms you", distance: "on you" };
  return { name: "devoted", style: "follows you, sings, defends", distance: "attached" };
}

// ─── Behavioral Descriptions ───────────────────────────────────────────

const BEHAVIORS: BehaviorEntry = {
  // ── Trust Deficit ──
  "trust_deficit:abandoned": [
    "{name} is pressed against the wall. His eyes are open but he isn't looking at anything.",
    "{name} tracks you with one eye from behind the perch. He doesn't move.",
    "A dark shape in the corner. He's there but he's not.",
    "{name} flinches when you shift your weight. He'd forgotten something could move toward him.",
  ],
  "trust_deficit:wary": [
    "{name} watches from the far perch, head locked on you. Still as stone.",
    "He takes a half-step backward as you approach. His wings are slightly raised.",
    "{name} caws once — short, sharp. A warning, not a greeting.",
  ],

  // ── Hunger ──
  "hunger:abandoned": [
    "{name} pecks at the bare ground. Nothing there. He pecks again.",
    "He's hunched low. His head makes small mechanical movements toward nothing.",
  ],
  "hunger:wary": [
    "{name} watches the food in your hand. He snatches it and retreats.",
    "He eats with his back to you, wings slightly raised. Protective.",
  ],
  "hunger:cautious": [
    "{name} hops toward the food, head bobbing. He takes it and hops back two steps to eat.",
    "His eyes lock on the offering. He pretends not to care for exactly one second before taking it.",
  ],
  "hunger:warming": [
    "{name} lands near the food. He's not subtle about it. He eats while making soft contentment sounds.",
    "He eyes the food, then you, then the food. He eats.",
  ],
  "hunger:bonded": [
    "{name} does a little hop-skip to the food. A soft trill while he eats.",
    "He takes it from your hand eagerly, claws careful on your fingers.",
  ],
  "hunger:devoted": [
    "{name} eats happily, making that trilling sound. He saves a piece and sets it near you, like sharing.",
    "He chirps mid-bite. Even eating is a social event now.",
  ],

  // ── Hangry (hunger + fatigue) ──
  "hunger+fatigue:wary": [
    "{name} snaps at the food before you've even set it down. He eats hunched and bristled, making a low rattling sound. Don't touch him right now.",
    "He hisses when you approach with food. He takes it and turns his back.",
  ],
  "hunger+fatigue:cautious": [
    "{name} moves toward food like every step is personally offensive. He eats with one eye closed and the other burning.",
    "He takes the food, fumbles it, picks it up again. His beak makes an annoyed clicking sound.",
  ],
  "hunger+fatigue:warming": [
    "{name} has eaten but he's still bristled. He settles on the perch with that energy where one wrong move gets you pecked.",
    "Food helps. A little. He's less murder-y but still giving 'I will remember this.'",
  ],

  // ── Loneliness ──
  "loneliness:abandoned": [
    "{name} caws — flat and quiet. Not a call to anyone specific. Just... out.",
    "He's picked at his feathers until a small patch is bare. He doesn't notice.",
  ],
  "loneliness:wary": [
    "{name} caws — sharper than usual. He looks at you, then away, then back.",
    "He makes a sound that's almost a purr but not quite.",
  ],
  "loneliness:cautious": [
    "{name} shuffles closer on the perch. He makes a quiet clicking sound with his beak.",
    "He lands on the perch nearest to you. Not on you. Just... near.",
  ],
  "loneliness:warming": [
    "{name} lands on the perch beside you and leans slightly toward your warmth. He's not asking for anything.",
    "He makes soft conversational sounds. Not words, not quite. Just... presence.",
  ],
  "loneliness:bonded": [
    "{name} lands on your shoulder and tucks himself against your neck. He's warm. He stays.",
    "He perches on your knee and looks up at you. He makes that sound — the one that means he's glad you exist.",
  ],
  "loneliness:devoted": [
    "{name} follows you from room to room. Not clingy — just... unwilling to be far.",
    "He sings from wherever you are. A running commentary on your day.",
  ],

  // ── Boredom ──
  "boredom:abandoned": [
    "{name} pushes a pebble off the ledge. Watches it fall. Pushes another one.",
    "He arranges the same three pebbles in a line. Knocks them over. Lines them up again.",
  ],
  "boredom:wary": [
    "{name} rolls a stone back and forth under his foot. He's not playing. He's passing time.",
    "He pecks at a crack in the perch. Not eating. Just needing something to do.",
  ],
  "boredom:cautious": [
    "{name} has found a piece of mirror and keeps angling it to catch light.",
    "He pushes a small object toward you with his beak. Tests your reaction.",
  ],
  "boredom:warming": [
    "{name} brings you a tangled knot of string. Drops it at your feet. Hops back and watches.",
    "He's found something interesting and wants you to know.",
  ],
  "boredom:bonded": [
    "{name} lands on your desk and nudges your hand with his beak. He has a pebble. He wants you to throw it. Now.",
    "He drops a button on your keyboard and stares at you. Interpretive dance begins.",
  ],
  "boredom:devoted": [
    "{name} has assembled a small pile of objects in front of you. Sorted by color. He looks proud.",
    "He brings you his favorite treasure and sets it in your hand. Then takes it back. Then gives it again.",
  ],

  // ── Fatigue ──
  "fatigue:abandoned": [
    "{name}'s eyes keep closing. His head droops, then snaps up, then droops.",
    "He's curled tight on the lowest perch. He looks smaller than usual.",
  ],
  "fatigue:wary": [
    "{name} blinks slowly. His feathers are slightly puffed. He fights sleep because he doesn't trust the room.",
    "He's on the perch but barely. His eyes close and his head tips, then he startles awake.",
  ],
  "fatigue:cautious": [
    "{name} settles on the perch nearest you and fluffs up. He's choosing to be tired near you.",
    "His eyes half-close. He preens once, slowly, then stops mid-stroke. Sleep is winning.",
  ],
  "fatigue:warming": [
    "{name} is asleep on the perch next to you. His feathers are puffed out. He feels safe enough to close his eyes.",
    "He settles against your side. Within seconds, his breathing slows.",
  ],
  "fatigue:bonded": [
    "{name} is on your shoulder. His eyes close and his head tucks against your neck.",
    "He yawns — beak wide, tongue visible — then settles into that fluffed sleep posture. Completely at ease.",
  ],

  // ── Stress ──
  "stress:abandoned": [
    "{name}'s feathers are flat against his body. He's trying to be invisible.",
    "He presses into the corner. Every sound makes him flinch.",
  ],
  "stress:wary": [
    "{name}'s pupils are blown wide. He tracks every movement in the room.",
    "He's rigid on the perch. Ready to bolt. Nothing is okay.",
  ],
  "stress:cautious": [
    "{name} is restless — hopping from perch to perch, never settling.",
    "His crest feathers are slightly raised. He keeps looking at the door.",
  ],
  "stress:warming": [
    "{name} lands near you and seems to settle slightly. Your presence is a partial anchor.",
    "He's agitated but he's agitated *near* you.",
  ],
};

// ── Mood modifiers ─────────────────────────────────────────────────────

const HAPPY_ADDITIONS = [
  "He does a small head-bob — the corvid happy dance.",
  "There's a brightness to his movements. Lighter. Faster.",
  "He chirps to himself. Not for you. Just because.",
  "His feathers catch the light differently when he's like this.",
  "He stretches one wing fully extended, then the other.",
];

const CURIOSITY_ADDITIONS = [
  "His head tilts completely sideways. He's investigating with his whole skull.",
  "He hops closer to whatever caught his eye. Pecks it once. Backs away. Pecks again.",
  "His rapid side-to-side head motion means he's encoding something new.",
  "He picks up the object, drops it, picks it up again. Testing its properties.",
];

// ─── Main API ──────────────────────────────────────────────────────────

function isHangry(drives: DriveState): boolean {
  return drives.hunger > 0.5 && (1 - drives.energy) > 0.5;
}

function isNeglected(drives: DriveState): boolean {
  return drives.hunger > 0.7 && drives.loneliness > 0.7 &&
    drives.boredom > 0.7 && drives.trust < 0.2;
}

function getDominantDrive(drives: DriveState): [string, number] {
  // Low trust always dominates
  if (drives.trust < 0.30) return ["trust_deficit", 1 - drives.trust];

  const fatigue = 1 - drives.energy;
  const map: Record<string, number> = {
    hunger: drives.hunger,
    loneliness: drives.loneliness,
    boredom: drives.boredom,
    fatigue,
    stress: drives.stress,
  };

  // Happy suppresses negative drives
  if (drives.happiness > 0.7) {
    for (const k of Object.keys(map)) map[k] *= 0.5;
  }

  let dominant = "boredom";
  let max = 0;
  for (const [k, v] of Object.entries(map)) {
    if (v > max) { max = v; dominant = k; }
  }
  return [dominant, max];
}

export function getBehavior(drives: DriveState, name: string = "Scrit"): string {
  const trust = drives.trust;
  const tier = getTrustTier(trust);

  // Check special conditions
  let driveKey: string;
  if (isNeglected(drives)) {
    driveKey = `trust_deficit:${tier.name}`;
  } else if (isHangry(drives)) {
    driveKey = `hunger+fatigue:${tier.name}`;
  } else {
    const [dominant] = getDominantDrive(drives);
    driveKey = `${dominant}:${tier.name}`;
  }

  // Look up behavior, fallback to nearest tier
  let candidates = BEHAVIORS[driveKey];
  if (!candidates) {
    // Try dominant drive with fallback tiers
    const [dominant] = getDominantDrive(drives);
    for (const fallbackTier of ["warming", "cautious", "wary", "abandoned"]) {
      const fallbackKey = `${dominant}:${fallbackTier}`;
      if (BEHAVIORS[fallbackKey]) {
        candidates = BEHAVIORS[fallbackKey];
        break;
      }
    }
  }

  if (!candidates) return `${name} is ${tier.style}.`;

  let text = candidates[Math.floor(Math.random() * candidates.length)];

  // Add mood modifiers
  if (drives.happiness > 0.6 && ["warming", "bonded", "devoted"].includes(tier.name)) {
    text += " " + HAPPY_ADDITIONS[Math.floor(Math.random() * HAPPY_ADDITIONS.length)];
  }
  if (drives.boredom > 0.5 && ["cautious", "warming", "bonded", "devoted"].includes(tier.name)) {
    text += " " + CURIOSITY_ADDITIONS[Math.floor(Math.random() * CURIOSITY_ADDITIONS.length)];
  }

  return text.replace(/{name}/g, name);
}

export function getTrustTierName(trust: number): string {
  return getTrustTier(trust).name;
}

export function getBehaviorSummary(drives: DriveState, name: string = "Scrit"): {
  behavior: string;
  trustTier: string;
  dominantDrive: string;
} {
  const tier = getTrustTier(drives.trust);
  const [dominant] = getDominantDrive(drives);
  return {
    behavior: getBehavior(drives, name),
    trustTier: tier.name,
    dominantDrive: dominant,
  };
}
