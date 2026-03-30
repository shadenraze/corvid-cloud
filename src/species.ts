/**
 * Species presets — what makes each creature feel different from tick 1.
 * Engine handles emergence. Species set the starting conditions and voice.
 */

export interface SpeciesPreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // Starting chemistry overrides (partial — merged with defaults)
  startingChemistry: Record<string, number>;
  // Shiny words this species gravitates toward
  shinyWords: string[];
  // Found objects pool
  foundObjects: string[];
  // Mood emoji overrides
  moodEmojis: Record<string, string>;
}

const SHARED_SHINY = [
  "iridescent", "obsidian", "fractal", "velvet", "phosphorescent",
  "gossamer", "crystalline", "umbra", "resonance", "mercury",
  "thunderstone", "dewdrop", "ember", "penumbra", "chromatic",
  "voltage", "marrow", "eclipse", "chimera", "tessellate",
];

const CORVID_OBJECTS = [
  "a bent copper wire", "a button with no holes", "a piece of blue glass",
  "a torn playing card (queen of spades)", "a small gear from something broken",
  "a key that fits nothing", "a perfectly round pebble",
  "a tangled bit of silver thread", "a coin from a country that doesn't exist",
  "a chess piece (black knight)", "a dried flower pressed flat",
  "a single earring (obsidian stud)", "half a polaroid photo",
  "a watch with no hands", "a marble with something dark inside",
  "a broken compass that points somewhere",
  "a handwritten note in a language nobody reads",
];

export const SPECIES: Record<string, SpeciesPreset> = {
  corvid: {
    id: "corvid",
    name: "Corvid",
    emoji: "🐦‍⬛",
    description: "Sharp, suspicious, warms slowly. Collects shiny things. Judges you silently.",
    startingChemistry: { dopamine: 0.2, cortisol: 0.3, oxytocin: 0.1 },
    shinyWords: SHARED_SHINY,
    foundObjects: CORVID_OBJECTS,
    moodEmojis: {},
  },
  fox: {
    id: "fox",
    name: "Fox",
    emoji: "🦊",
    description: "Playful, curious, quick to bond but easily distracted. Will steal your stuff.",
    startingChemistry: { dopamine: 0.5, cortisol: 0.1, oxytocin: 0.3 },
    shinyWords: [
      ...SHARED_SHINY,
      "clever", "quick", "burrow", "den", "midnight", "chicken",
      "caper", "prank", "dash", "pounce", "snicker",
    ],
    foundObjects: [
      ...CORVID_OBJECTS,
      "a chicken bone (still has meat on it)",
      "someone's left shoe",
      "a shiny candy wrapper",
      "a rubber ball with teeth marks",
    ],
    moodEmojis: {},
  },
  cat: {
    id: "cat",
    name: "Cat",
    emoji: "🐈‍⬛",
    description: "Independent, imperious, ignores you on purpose. When it loves you, you KNOW.",
    startingChemistry: { dopamine: 0.15, cortisol: 0.2, oxytocin: 0.15, melatonin: 0.2 },
    shinyWords: [
      ...SHARED_SHINY,
      "sunbeam", "nap", "slow-blink", "biscuit", "purr",
      "velvet", "cashmere", "threshold", "windowsill", "midnight",
    ],
    foundObjects: [
      ...CORVID_OBJECTS,
      "a dead mouse (gift-wrapped)",
      "a rubber band",
      "a bottle cap (batted under the fridge)",
      "someone's hair tie",
    ],
    moodEmojis: { happy: "😸", stressed: "🙀", sleepy: "😴" },
  },
  serpent: {
    id: "serpent",
    name: "Serpent",
    emoji: "🐍",
    description: "Patient, observant, slow. Deepest bond in the game — if you earn it.",
    startingChemistry: { dopamine: 0.1, cortisol: 0.15, oxytocin: 0.05, melatonin: 0.3 },
    shinyWords: [
      ...SHARED_SHINY,
      "scale", "heat", "coil", "shed", "venom",
      "ancient", "patient", "stone", "sun-warmed", "still",
    ],
    foundObjects: [
      ...CORVID_OBJECTS,
      "a shed scale (yours, from last molt)",
      "a warm stone",
      "a mouse skull (cleaned)",
      "a fossil fragment",
    ],
    moodEmojis: {},
  },
  moth: {
    id: "moth",
    name: "Moth",
    emoji: "🦋",
    description: "Fragile, luminous, drawn to anything bright. Most emotionally reactive. Nocturnal.",
    startingChemistry: { dopamine: 0.4, cortisol: 0.35, oxytocin: 0.4, melatonin: 0.4 },
    shinyWords: [
      ...SHARED_SHINY,
      "luminous", "moth-wing", "dust-pale", "lamp-flame", "moonlight",
      "silk", "cocoon", "flutter", "drawn-to", "wax-moth",
    ],
    foundObjects: [
      ...CORVID_OBJECTS,
      "a dead lightbulb (warm to the touch)",
      "a scrap of silk",
      "a moth wing (not yours. not anymore.)",
      "a candle stub",
    ],
    moodEmojis: { happy: "✨", stressed: "💫", sleepy: "🌙" },
  },
};

export function getSpecies(id: string): SpeciesPreset | null {
  return SPECIES[id] || null;
}

export function listSpecies(): SpeciesPreset[] {
  return Object.values(SPECIES);
}
