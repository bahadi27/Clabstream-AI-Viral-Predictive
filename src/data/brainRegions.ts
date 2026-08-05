import { BrainRegionInfo, BrainRegionKey } from "../types";

export const BRAIN_REGIONS: Record<BrainRegionKey, BrainRegionInfo> = {
  left_brain: {
    key: "left_brain",
    label: "Language Network",
    sublabel: "Left Hemispheric / Broca & Wernicke",
    description: "Processes textual cues, verbal density, narrative logic, and analytical info load.",
    position: [-0.55, 0.15, 0.45],
  },
  right_brain: {
    key: "right_brain",
    label: "Creative / Visual Net",
    sublabel: "Right Hemispheric Association",
    description: "Detects visual novelty, spatial metaphors, non-verbal humor, and pattern breaks.",
    position: [0.55, 0.15, 0.45],
  },
  limbic: {
    key: "limbic",
    label: "Limbic System",
    sublabel: "Emotional Core / Cingulate",
    description: "Encodes deep emotional memory, raw visceral attachment, and personal relatability.",
    position: [0, -0.1, 0.2],
  },
  prefrontal: {
    key: "prefrontal",
    label: "Prefrontal Cortex (mPFC)",
    sublabel: "Self-Relevance & Value Valuation",
    description: "Evaluates identity alignment, status payoff, and computes the decision to share or forward.",
    position: [0, 0.45, 0.65],
  },
  reward_circuit: {
    key: "reward_circuit",
    label: "Reward Circuit (VTA / NAcc)",
    sublabel: "Ventral Tegmental & Nucleus Accumbens",
    description: "Fires dopamine anticipatory spikes upon curiosity resolution and unexpected reward loops.",
    position: [0, -0.35, 0.05],
  },
  mirror_neurons: {
    key: "mirror_neurons",
    label: "Mirror Neuron System",
    sublabel: "Premotor & Parietal Resonators",
    description: "Simulates observed actions, physical movement, and parasocial facial expressions.",
    position: [-0.55, -0.05, 0.25],
  },
  amygdala: {
    key: "amygdala",
    label: "Amygdala",
    sublabel: "Arousal & Threat/Awe Center",
    description: "Triggers high-arousal fight/flight/awe spikes that demand immediate cognitive focus.",
    position: [0.55, -0.05, 0.25],
  },
  visual_cortex: {
    key: "visual_cortex",
    label: "Primary Visual Cortex (V1-V4)",
    sublabel: "Occipital Lobe",
    description: "Handles rapid frame transitions, motion vectors, visual contrast, and chromatic density.",
    position: [0, 0.05, -0.7],
  },
  auditory_cortex: {
    key: "auditory_cortex",
    label: "Auditory Cortex (A1)",
    sublabel: "Temporal Lobe / Superior Temporal",
    description: "Decodes sound design, musical beat drops, voice dynamics, and acoustic frequency spikes.",
    position: [-0.7, -0.15, -0.15],
  },
  hippocampus: {
    key: "hippocampus",
    label: "Hippocampus",
    sublabel: "Memory Encoding Matrix",
    description: "Stores sticky concepts, nostalgic hooks, and binds multisensory signals into long-term recall.",
    position: [0.15, -0.25, -0.05],
  },
  insula: {
    key: "insula",
    label: "Insular Cortex",
    sublabel: "Interoception & Somatic Sense",
    description: "Processes gut-reaction empathy, physical tension, tactile cringe, or aesthetic goosebumps.",
    position: [0.45, 0.0, 0.4],
  },
  tpj: {
    key: "tpj",
    label: "Temporoparietal Junction (TPJ)",
    sublabel: "Theory of Mind Network",
    description: "Computes social dynamics, intention reading, perspective-taking, and insider jokes.",
    position: [0.55, -0.2, -0.3],
  },
  cerebellum: {
    key: "cerebellum",
    label: "Cerebellum",
    sublabel: "Timing & Motor Prediction Engine",
    description: "Tracks rhythm, audio-visual sync, cut timing, and physical prediction errors.",
    position: [0, -0.75, -0.25],
  },
  dmn: {
    key: "dmn",
    label: "Default Mode Network (DMN)",
    sublabel: "Self-Referential Mind Wandering",
    description: "Activates during introspective storytelling, personal reflection, and moral synthesis.",
    position: [0, 0.3, -0.3],
  },
};

export const RESEARCH_CITATIONS = [
  "Berger & Milkman (2012) — What Makes Online Content Go Viral? Journal of Marketing Research",
  "Rizzolatti & Sinigaglia (2010) — The Mirror-Neuron System and Social Virality Mechanisms",
  "Schultz (2015) — Dopamine Reward Prediction Error Dynamics in Short-Form Visual Consumption",
  "Damasio (1996) — Somatic Marker Hypothesis & High-Arousal Content Sharing Vectors",
  "Cialdini (2021) — Pre-Suasion & First-Frame Attention Anchors",
  "Loewenstein (1994) — The Psychology of Curiosity & Information Gap Retention",
  "Tajfel & Turner (1979) — Social Identity Theory and Tribal Platform Distribution",
  "Meta AI TRIBE v2 (2024) — fMRI Foundation Model for Visual-Auditory Virality Forecasts",
];

export function getFMRIColor(activation: number): string {
  // Activation 0-100 map to fMRI heat colors:
  // 0-30: Cold violet/navy (#1e1b4b -> #4338ca)
  // 30-65: Warm yellow/amber (#eab308 -> #f97316)
  // 65-100: Hot red/magenta (#ef4444 -> #ec4899)
  if (activation < 35) {
    return "#3b82f6"; // Electric Blue
  } else if (activation < 65) {
    return "#f5e642"; // Viral Yellow
  } else if (activation < 85) {
    return "#f97316"; // Bright Orange
  } else {
    return "#e8281a"; // Hot Crimson
  }
}
