export type ViralityTier = "Low" | "Moderate" | "High" | "Explosive";

export type BrainRegionKey =
  | "left_brain"
  | "right_brain"
  | "limbic"
  | "prefrontal"
  | "reward_circuit"
  | "mirror_neurons"
  | "amygdala"
  | "visual_cortex"
  | "auditory_cortex"
  | "hippocampus"
  | "insula"
  | "tpj"
  | "cerebellum"
  | "dmn";

export interface BrainRegionInfo {
  key: BrainRegionKey;
  label: string;
  sublabel: string;
  description: string;
  position: [number, number, number]; // x, y, z
}

export type BrainRegionsActivation = Record<BrainRegionKey, number>;

export interface PlatformScores {
  tiktok: number;
  youtube: number;
  instagram: number;
  twitter: number;
}

export interface RetentionPoint {
  t: number; // 0 to 100 percentage of timeline
  retention: number; // 0 to 100 retention percentage
}

export interface FactorMechanic {
  name: string;
  score: number;
  explanation: string;
  journal_reference: string;
}

export interface HookAlternative {
  hook: string;
  predicted_lift: number;
  rationale: string;
  alignment_source?: "Script / Dialogue" | "Audio / Vocal Cadence" | "Visual / Motion Keyframe";
  content_refinement?: string;
  pacing_alignment?: string;
  tone_alignment?: string;
}

export interface ShotByShotItem {
  second_range: string;
  visual_action: string;
  audio_cue: string;
  on_screen: string;
}

export interface VideoKeyframe {
  timestamp: string; // e.g. "00:00.5"
  timeInSeconds: number; // e.g. 0.5
  label: string; // e.g. "0.5s Initial Visual Hook"
  type: "hook" | "pattern_break" | "emotional_peak" | "payoff" | "custom";
  imageData?: string; // base64 or URL
  score: number; // e.g. 95
  note: string; // e.g. "High visual contrast & facial emotion salience detected"
  brainActivation?: string; // e.g. "Amygdala + Visual Cortex Peak"
}

export interface ConfidenceInterval {
  margin: number; // e.g. 2.2
  lower: number;  // e.g. 89.8
  upper: number;  // e.g. 94.2
  confidence_level: string; // e.g. "95%"
  confidence_percentage?: number; // e.g. 95
}

export interface PreviousRunSummary {
  runNumber: number;
  timestamp: string;
  score: number;
}

export interface ViralityAnalysis {
  id: string;
  title?: string;
  created_at: string;
  video_url?: string;
  description?: string;
  status: "analyzing" | "complete" | "error";

  // Composite scores
  virality_score: number;
  virality_tier: ViralityTier;
  confidence_interval?: ConfidenceInterval;
  confidence_interval_percentage?: number; // e.g. 95
  virality_score_range?: [number, number]; // [lower, upper] e.g. [88.8, 93.2]
  historical_runs?: PreviousRunSummary[];
  analysis_pass_count?: number;
  hook_score: number;
  hold_rate: number;
  share_velocity: number;

  // Keyframe frame screenshots
  keyframes?: VideoKeyframe[];

  // Expanded neural metrics (7)
  retention_score: number;
  emotion_arousal: number;
  novelty_index: number;
  clarity_score: number;
  pacing_score: number;
  audio_engagement: number;
  visual_density: number;

  // 14 brain-region activations
  brain_regions: BrainRegionsActivation;

  // Platform predictions
  platform_scores: PlatformScores;

  // Retention curve (11 points)
  retention_curve: RetentionPoint[];

  // 10-12 viral mechanics
  factors: FactorMechanic[];

  // Strategy text
  hook_analysis: string;
  emotional_arc: string;
  emotional_valence: string;
  top_recommendation: string;

  // AI hook alternatives
  hook_alternatives: HookAlternative[];

  // Pipeline metadata
  detected_language?: string;
  language_code?: string;
  transcript_summary?: string;
  verbatim_transcript?: string;
  narrative_tone?: string;
  visual_pacing_speed?: string;
  shot_by_shot?: ShotByShotItem[];
  visual_elements?: string[];
  audio_elements?: string[];
  pacing_notes?: string;
  emotional_beats?: string[];
  pattern_interrupts?: string[];
  novelty_signals?: string;
}
