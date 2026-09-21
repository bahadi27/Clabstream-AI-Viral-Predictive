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
  hook_english_translation?: string;
  original_language?: string;
  language_code?: string;
  cultural_trigger?: string;
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
  inferred_title?: string;
  created_at: string;
  tags?: string[];
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
  executive_summary?: string;
  hook_analysis: string;
  emotional_arc: string;
  emotional_valence: string;
  top_recommendation: string;

  // Proven Viral DNA Benchmark comparison & learning
  benchmark_comparison?: ViralDnaComparison;
  active_benchmarks?: ViralBenchmark[];

  // Gemini Narrative Stress Test (5-second audience simulation)
  narrative_stress_test?: NarrativeStressTestResult;

  // AI hook alternatives
  hook_alternatives: HookAlternative[];

  // Advanced Backend Engine Vectors & Telemetry
  cognitive_load_index?: {
    index: number;
    status: "Optimal High Retention" | "Moderate Cognitive Friction" | "Severe Cognitive Overload" | "Under-Stimulating Boredom Hazard";
    recommendation: string;
  };
  dopamine_decay_vectors?: Array<{
    second: number;
    dopamineLevel: number;
    attentionHold: number;
    swipeHazardRate: number;
  }>;
  algorithmic_platform_vector?: {
    tiktok: { score: number; algorithmicTier: string; completionThresholdMet?: boolean; recommendedCutRhythm?: string };
    instagramReels: { score: number; algorithmicTier: string; savePropensityRank?: string };
    youtubeShorts: { score: number; algorithmicTier: string; vsaRatioPredicted?: string };
    linkedinVideo: { score: number; algorithmicTier: string; practicalUtilityRank?: string };
  };
  engine_telemetry?: {
    executionLatencyMs: number;
    modelUsed: string;
    cacheStatus: string;
    timestamp: string;
  };
  _cached?: boolean;
  _cacheLatencyMs?: number;

  // Pipeline metadata & Multi-lingual virality reporting
  detected_language?: string;
  language_code?: string;
  language_confidence?: number; // 0 to 100 confidence percentage (e.g. 98)
  is_non_english?: boolean;
  language_notes?: string;
  localized_market_fit?: string;
  transcript_summary?: string;
  verbatim_transcript?: string;
  voiceover_draft?: string;
  has_voiceover_recording?: boolean;
  narrative_tone?: string;
  visual_pacing_speed?: string;
  shot_by_shot?: ShotByShotItem[];
  visual_elements?: string[];
  audio_elements?: string[];
  pacing_notes?: string;
  emotional_beats?: string[];
  pattern_interrupts?: string[];
  novelty_signals?: string;

  // Direct-Response Product Promotion & Hard-Selling Audit
  is_product_promotion?: boolean;
  is_hardselling?: boolean;
  product_promotion_audit?: ProductPromotionAuditData;
}

export interface ProductPillarSuggestion {
  pillarNumber: 1 | 2 | 3 | 4 | 5;
  pillarTitle: string;
  category: "Rhythm & Intro" | "Production Quality" | "Storytelling & Showcasing" | "0-3s Climax/Value" | "3s Shot Pacing";
  status: "CRITICAL FIX" | "OPTIMIZATION" | "ALIGNED";
  corePrinciple: string;
  diagnosis: string;
  actionableStep: string;
  beforeExample: string;
  afterExample: string;
  expectedMetricLift: string;
}

export interface ProductQualityCheck {
  item: string;
  category: "Visual Definition" | "Audio Track" | "Camera Stability" | "Screen Recording / Letterbox" | "Feed Aspect Ratio";
  status: "PASS" | "WARNING" | "FAIL";
  recommendation: string;
}

export interface ProductPromotionAuditData {
  isPromotional: boolean;
  isHardSelling: boolean;
  productTitleOrCategory: string;
  commercialIntrusivenessScore: number; // 0-100 (high = too hard-selling)
  retentionProtectionScore: number; // 0-100
  overallProductScore: number; // 0-100
  executiveVerdict: string;
  pillars: ProductPillarSuggestion[];
  qualityChecks: ProductQualityCheck[];
  storytellingFramework: {
    frameworkName: string; // e.g. "Problem → Agitate → Solution → Irrefutable Proof (PASP)"
    openingHook: string;
    agitationSegment: string;
    capabilityDemo: string;
    irrefutableProof: string;
    frictionlessCallToAction: string;
  };
  shotPacingGuideline: Array<{
    timeframe: string; // e.g. "0:00 - 0:03"
    shotType: string;  // e.g. "End Climax Preview / Problem Extreme Close-Up"
    visualAction: string;
    superText: string;
    retentionTactic: string;
  }>;
}

export interface TrendingHashtag {
  hashtag: string;
  platform: "tiktok" | "instagram" | "both";
  growthVelocity: string;
  viewVolume: string;
  relevanceScore: number;
  matchExplanation: string;
}

export interface TrendingAudio {
  title: string;
  artist: string;
  platform: "tiktok" | "instagram" | "both";
  bpmCategory: string;
  viralStatus: string;
  usageTip: string;
  matchExplanation: string;
}

export interface ViralFormatTrend {
  formatTitle: string;
  platform: "tiktok" | "instagram" | "both";
  description: string;
  whyItWorks: string;
}

export interface TopicComparison {
  videoTopic: string;
  topicOverlapScore: number;
  alignedKeywords: string[];
  gapAnalysis: string;
  viralRecommendation: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface RealtimeTrendsData {
  topic: string;
  category: string;
  fetchedAt: string;
  isGroundedWithGoogle: boolean;
  groundingSources: GroundingSource[];
  topicComparison: TopicComparison;
  trendingHashtags: TrendingHashtag[];
  trendingAudio: TrendingAudio[];
  viralFormats: ViralFormatTrend[];
}

export interface ViralBenchmarkDna {
  hookMechanism: string;
  openLoopStructure: string;
  pacingFormula: string;
  audioSyncPattern: string;
  dopamineTriggers: string[];
  vocalCadence: string;
  visualSuperStyle?: string;
}

export interface ViralBenchmark {
  id: string;
  title: string;
  platform: "tiktok" | "reels" | "shorts" | "all";
  category:
    | "Education / Tech"
    | "Food & ASMR"
    | "Fitness & Transformation"
    | "E-Commerce & DTC"
    | "Storytelling & Vlog"
    | "Comedy & Skit"
    | "Finance & Business"
    | "Custom / User Upload";
  provenViews: string;
  provenMetrics: {
    retentionAt3s: number;
    avgWatchPercentage: number;
    sharesPer1k: number;
  };
  videoUrl?: string;
  thumbnailUrl?: string;
  transcript?: string;
  hookTranscript?: string;
  pacingCps: number;
  viralDna: ViralBenchmarkDna;
  whyItBlewUp: string;
  isCustom?: boolean;
  createdAt?: string;
  referenceKeyframes?: VideoKeyframe[];
}

export interface ExactTimelineTransfer {
  timestamp: string;
  benchmarkTactic: string;
  appliedToUserVideo: string;
  predictedRetentionGain: string;
}

export interface ViralDnaComparison {
  benchmarkId: string;
  benchmarkTitle: string;
  provenViews: string;
  category: string;
  overallDnaMatchScore: number;
  hookSimilarityScore: number;
  pacingAlignmentScore: number;
  retentionStructureMatch: number;
  dnaGapAnalysis: {
    hookGap: string;
    pacingGap: string;
    audioVisualGap: string;
    curiosityLoopGap: string;
  };
  transferredBlueprint: {
    title: string;
    hookAdaptation: string;
    pacingActionPlan: string;
    soundDesignAction: string;
    predictedViralityLift: number;
  };
  exactTimelineTransfers: ExactTimelineTransfer[];
  benchmarkHookTranscript?: string;
  benchmarkPacingCps?: number;
}

export type AudiencePersonaId =
  | "fast_scroller"
  | "skeptic_expert"
  | "casual_browser"
  | "high_intent_buyer"
  | "algorithm_sentinel";

export interface AudiencePersonaReaction {
  personaId: AudiencePersonaId;
  personaName: string;
  personaAvatar: string;
  personaRole: string;
  retentionLikelihood: number; // 0 - 100%
  swipeRisk: "low" | "moderate" | "high" | "critical";
  internalMonologue: string; // Simulated inner thoughts
  emotionalValence: "intrigued" | "bored" | "skeptical" | "entertained" | "confused" | "hooked" | "irritated";
  verdictTag: string;
  actionTaken: "watch_further" | "hesitating" | "scrolling_away" | "bookmarking" | "sharing";
}

export interface IntervalStressPoint {
  intervalIndex: number;
  timeRange: string; // e.g. "00:00 - 00:05"
  startSecond: number;
  endSecond: number;
  scriptSnippet: string;
  visualContext?: string;
  audienceReactions: AudiencePersonaReaction[];
  aggregateRetentionScore: number; // 0 - 100
  hazardLevel: "low" | "moderate" | "high" | "critical";
  frictionPoint?: string;
  keyArousalTrigger?: string;
  geminiPatch: {
    suggestedScriptRewrite: string;
    visualActionPatch: string;
    predictedRetentionBoost: string;
    rationale: string;
  };
}

export interface PersonaSurvivalStat {
  personaId: AudiencePersonaId;
  personaName: string;
  personaRole: string;
  survivalRate: number; // percentage making it to completion
  dropoffTimestamp?: string;
  primaryDropoffReason: string;
  resonanceHighlight: string;
  swipedCountEstimated: string;
}

export interface NarrativeStressTestResult {
  overallDurabilityScore: number; // 0 - 100
  scriptWordCount: number;
  totalIntervals: number;
  dominantDropoffHazard: string;
  fatalFlawTimestamp?: string;
  peakResonanceTimestamp?: string;
  personaSyntheses: PersonaSurvivalStat[];
  intervals: IntervalStressPoint[];
  executiveStressVerdict: string;
  fullPatchedScript?: string;
  testedAt?: string;
}

// ── AI Video Prompt Studio Types ───────────────────────────────────────
export type AIVideoGeneratorTarget =
  | "google_flow"
  | "sora"
  | "runway"
  | "kling"
  | "luma"
  | "ugc_script";

export interface PromptStudioRequest {
  userPrompt?: string;
  productName?: string;
  productUsp?: string;
  targetAudience?: string;
  durationSeconds?: number;
  povStyle?: string;
  setting?: string;
  languageDialect?: string;
  talentName?: string;
  generatorTarget?: AIVideoGeneratorTarget;
  crucialDirectives?: string[];
  pacingStyle?: string;
  additionalNotes?: string;
}

export interface PromptStudioScene {
  sceneNumber: number;
  timeRange: string;
  visualDirection: string;
  talentAction: string;
  cameraMotion: string;
  voiceoverSpeaker: string;
  voiceoverDialogue: string;
  soundDesignCues: string;
  onScreenTextSuper: string;
  neuroRetentionTactic: string;
}

export interface PromptStudioResult {
  id: string;
  createdAt: string;
  productTitle: string;
  durationSeconds: number;
  generatorTarget: AIVideoGeneratorTarget;
  fullGeneratorPrompt: string;
  scenes: PromptStudioScene[];
  voiceoverScriptClean: string;
  predictedNeuroMetrics: {
    retentionScore: number;
    hookVelocityScore: number;
    curiosityLoopScore: number;
    shareImpulseScore: number;
    dominantBrainNetwork: string;
    neuroViralityRationale: string;
  };
  keyframePrompts?: {
    sceneIndex: number;
    timecode: string;
    imagePrompt: string;
    aspectRatio: string;
  }[];
  midjourneyKeyframePrompts?: {
    sceneIndex: number;
    timecode: string;
    imagePrompt: string;
    aspectRatio: string;
  }[];
  alternativeHooks: {
    style: string;
    line: string;
    psychologicalTrigger: string;
  }[];
}



