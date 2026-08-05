import React, { useState } from "react";
import { ViralityAnalysis, BrainRegionKey, VideoKeyframe } from "../types";
import { ViralityScore } from "./ViralityScore";
import { CoreMetrics } from "./CoreMetrics";
import { BrainMap3D } from "./BrainMap3D";
import { RetentionCurve } from "./RetentionCurve";
import { PlatformScores } from "./PlatformScores";
import { FactorBreakdown } from "./FactorBreakdown";
import { StrategicSection } from "./StrategicSection";
import { HookRewriter } from "./HookRewriter";
import { KeyframeBreakdown } from "./KeyframeBreakdown";
import { KeyframeInsightModal } from "./KeyframeInsightModal";
import { Sparkles, Film, ArrowUpRight, Camera, RefreshCw } from "lucide-react";

interface AnalysisResultsProps {
  analysis: ViralityAnalysis;
  onRunReAnalysisPass?: () => void;
  isReAnalyzing?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  onRunReAnalysisPass,
  isReAnalyzing,
}) => {
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [selectedInsightRegion, setSelectedInsightRegion] = useState<BrainRegionKey | null>(null);
  const [selectedInsightKeyframe, setSelectedInsightKeyframe] = useState<VideoKeyframe | null>(null);

  if (!analysis) return null;

  const handleOpenRegionInsight = (regionKey?: BrainRegionKey) => {
    setSelectedInsightRegion(regionKey || "prefrontal");
    setSelectedInsightKeyframe(null);
    setIsInsightModalOpen(true);
  };

  const handleOpenKeyframeInsight = (keyframe: VideoKeyframe) => {
    setSelectedInsightKeyframe(keyframe);
    setSelectedInsightRegion(null);
    setIsInsightModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Bento Grid Top Header Bar */}
      <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#111111] text-white rounded-sm shadow-md">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold bg-[#111111] text-white px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                ACTIVE REPORT
              </span>
              <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded-xs">
                95% CI Range: [{analysis.virality_score_range ? `${analysis.virality_score_range[0]} – ${analysis.virality_score_range[1]}` : `${analysis.confidence_interval?.lower ?? Math.round(analysis.virality_score - 2)} – ${analysis.confidence_interval?.upper ?? Math.round(analysis.virality_score + 2)}`}]
              </span>
              <span className="text-xs font-mono text-[#555555] hidden lg:inline">
                TRIBE_fMRI_MODEL_V2 • GEMINI_3.6
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111111] mt-1 tracking-tight">
              {analysis.title || "Video Analysis Report"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {onRunReAnalysisPass && (
            <button
              onClick={onRunReAnalysisPass}
              disabled={isReAnalyzing}
              className="bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#111111] px-3.5 py-2 text-xs font-mono font-semibold rounded-sm flex items-center gap-2 transition-colors shadow-2xs disabled:opacity-50"
              title="Re-analyze this clip to produce a multi-pass empirical confidence interval range"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReAnalyzing ? "animate-spin text-black" : "text-[#111111]"}`} />
              <span>{isReAnalyzing ? "Running Pass..." : `Re-Analyze (Run Pass #${(analysis.analysis_pass_count || 1) + 1})`}</span>
            </button>
          )}

          {analysis.keyframes && analysis.keyframes.length > 0 && (
            <button
              onClick={() => handleOpenRegionInsight("prefrontal")}
              className="bg-[#111111] hover:bg-black text-white px-4 py-2 text-xs font-mono font-semibold rounded-sm flex items-center gap-2 transition-colors shadow-xs"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>Keyframe Insights</span>
            </button>
          )}

          <div className="text-right font-mono text-xs hidden md:block">
            <span className="font-bold text-[#111111] uppercase block">ANALYSIS TIMESTAMP</span>
            <span className="text-[#111111] font-semibold">
              {new Date(analysis.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Cell 1: Core Virality Score (col-span-12 lg:col-span-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <ViralityScore
            score={analysis.virality_score}
            tier={analysis.virality_tier}
            title={analysis.title}
            confidenceInterval={analysis.confidence_interval}
            confidenceIntervalPercentage={analysis.confidence_interval_percentage}
            scoreRange={analysis.virality_score_range}
            historicalRuns={analysis.historical_runs}
            passCount={analysis.analysis_pass_count}
          />
        </div>

        {/* Bento Cell 2: 3D Brain Activation Map (col-span-12 lg:col-span-8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <BrainMap3D
            activations={analysis.brain_regions}
            onOpenKeyframeInsight={handleOpenRegionInsight}
          />
        </div>

        {/* Bento Cell 3: Platform Predictions (col-span-12 md:col-span-6 lg:col-span-5) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col">
          <PlatformScores scores={analysis.platform_scores} />
        </div>

        {/* Bento Cell 4: Retention Curve Model (col-span-12 md:col-span-6 lg:col-span-7) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col">
          <RetentionCurve curve={analysis.retention_curve} />
        </div>

        {/* Bento Cell 5: Core Drivers & Expanded Metrics (col-span-12) */}
        <div className="col-span-12">
          <CoreMetrics
            hookScore={analysis.hook_score}
            holdRate={analysis.hold_rate}
            shareVelocity={analysis.share_velocity}
            retentionScore={analysis.retention_score}
            emotionArousal={analysis.emotion_arousal}
            noveltyIndex={analysis.novelty_index}
            clarityScore={analysis.clarity_score}
            pacingScore={analysis.pacing_score}
            audioEngagement={analysis.audio_engagement}
            visualDensity={analysis.visual_density}
          />
        </div>

        {/* Bento Cell 5B: Multimodal Keyframe Screenshot Analysis */}
        {analysis.keyframes && analysis.keyframes.length > 0 && (
          <div className="col-span-12">
            <KeyframeBreakdown
              keyframes={analysis.keyframes}
              onOpenKeyframeInsight={handleOpenKeyframeInsight}
            />
          </div>
        )}

        {/* Bento Cell 6: Emotional Arc & Strategic Recommendation (col-span-12 lg:col-span-6) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col">
          <StrategicSection
            hookAnalysis={analysis.hook_analysis}
            emotionalArc={analysis.emotional_arc}
            emotionalValence={analysis.emotional_valence}
            topRecommendation={analysis.top_recommendation}
          />
        </div>

        {/* Bento Cell 7: AI Hook Rewriter (col-span-12 lg:col-span-6) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col">
          <HookRewriter hooks={analysis.hook_alternatives} analysis={analysis} />
        </div>

        {/* Bento Cell 8: Behavioral Factors Breakdown (col-span-12) */}
        <div className="col-span-12">
          <FactorBreakdown factors={analysis.factors} />
        </div>
      </div>

      {/* Keyframe Insight Overlay Modal */}
      <KeyframeInsightModal
        analysis={analysis}
        isOpen={isInsightModalOpen}
        onClose={() => setIsInsightModalOpen(false)}
        initialKeyframe={selectedInsightKeyframe}
        initialRegionKey={selectedInsightRegion}
      />
    </div>
  );
};
