/**
 * Corvid Brain — simple neural network with REINFORCE learning.
 * Ported from Python brain.py.
 * 
 * 14 inputs (chemistry) → 16 hidden → 8 outputs (actions)
 * Learns via REINFORCE: actions that improve wellbeing get reinforced.
 */

export const ACTIONS = [
  "approach", "explore", "collect", "gift", "preen", "sleep", "caw", "ignore"
];

const NUM_INPUTS = 14;
const NUM_HIDDEN = 16;
const NUM_OUTPUTS = 8;
const LEARNING_RATE = 0.01;

function randn(): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1 + 1e-10)) * Math.cos(2.0 * Math.PI * u2);
}

function sigmoid(x: number): number {
  return 1.0 / (1.0 + Math.exp(-x));
}

export class CrowBrain {
  weightsIH: number[][];  // input → hidden
  weightsHO: number[][];  // hidden → output
  lastActionIndex: number;
  lastProbs: number[];

  constructor() {
    // Xavier initialization
    this.weightsIH = Array.from({ length: NUM_HIDDEN }, () =>
      Array.from({ length: NUM_INPUTS }, () => randn() * 0.5)
    );
    this.weightsHO = Array.from({ length: NUM_OUTPUTS }, () =>
      Array.from({ length: NUM_HIDDEN }, () => randn() * 0.5)
    );
    this.lastActionIndex = 0;
    this.lastProbs = [];
  }

  private forward(inputs: number[]): number[] {
    // Input → hidden
    const hidden = this.weightsIH.map(row => {
      let sum = 0;
      for (let i = 0; i < row.length; i++) sum += row[i] * inputs[i];
      return sigmoid(sum);
    });

    // Hidden → output (raw logits)
    const raw = this.weightsHO.map(row => {
      let sum = 0;
      for (let i = 0; i < row.length; i++) sum += row[i] * hidden[i];
      return sum;
    });

    // Softmax
    const maxVal = Math.max(...raw);
    const exps = raw.map(x => Math.exp(x - maxVal));
    const total = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / total);
  }

  decide(chemState: Record<string, number>, stimulus: string = ""): [string, number[]] {
    const chemNames = [
      "glucose", "melatonin", "cortisol", "adrenaline",
      "dopamine", "oxytocin", "serotonin", "hunger",
      "boredom", "loneliness", "fatigue", "trust",
      "wariness", "curiosity_trait",
    ];
    const inputs = chemNames.map(n => chemState[n] ?? 0);

    const probs = this.forward(inputs);

    // Stimulus bias
    if (stimulus === "poke") {
      probs[6] += 0.3; // caw
      probs[7] += 0.2; // ignore
    } else if (stimulus === "feed") {
      probs[0] += 0.3; // approach
      probs[4] += 0.2; // preen
    } else if (stimulus === "play") {
      probs[1] += 0.2; // explore
      probs[2] += 0.2; // collect
    } else if (stimulus === "tick") {
      probs[5] += 0.1; // sleep (bias toward rest during ticks)
    }

    // Re-normalize
    const total = probs.reduce((a, b) => a + b, 0);
    for (let i = 0; i < probs.length; i++) probs[i] /= total;

    // Sample action
    let r = Math.random();
    let actionIndex = 0;
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) { actionIndex = i; break; }
    }

    this.lastActionIndex = actionIndex;
    this.lastProbs = probs;
    return [ACTIONS[actionIndex], probs];
  }

  learn(reward: number): void {
    // REINFORCE: adjust weights based on reward
    const gradScale = reward * LEARNING_RATE;

    for (let o = 0; o < NUM_OUTPUTS; o++) {
      for (let h = 0; h < NUM_HIDDEN; h++) {
        const advantage = (o === this.lastActionIndex ? 1 : 0) - this.lastProbs[o];
        this.weightsHO[o][h] += gradScale * advantage;
      }
    }

    for (let h = 0; h < NUM_HIDDEN; h++) {
      for (let i = 0; i < NUM_INPUTS; i++) {
        this.weightsIH[h][i] += gradScale * 0.1 * randn();
      }
    }
  }

  getWeights(): { weightsIH: number[][]; weightsHO: number[][] } {
    return {
      weightsIH: this.weightsIH,
      weightsHO: this.weightsHO,
    };
  }

  loadWeights(data: { weightsIH: number[][]; weightsHO: number[][] }): void {
    if (data.weightsIH) this.weightsIH = data.weightsIH;
    if (data.weightsHO) this.weightsHO = data.weightsHO;
  }
}
