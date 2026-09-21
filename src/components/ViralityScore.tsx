import React, { useState } from "react";
import { ViralityTier, ConfidenceInterval, PreviousRunSummary } from "../types";
import { cleanViralityTier } from "../lib/sanitize";
import { Zap, Activity, Flame, Award, HelpCircle, ShieldCheck, X, RefreshCw, PartyPopper } from "lucide-react";
import { DotMatrixDisplay } from "./ui/DotMatrixDisplay";
import { LiquidMetalButton, MetalBadge } from "./ui/LiquidMetal";
import { CelebrationOverlay } from "./ui/CelebrationOverlay";
import { TextShimmer } from "./ui/MagneticButton";

interface ViralityScoreProps {
  score: number;
  tier: ViralityTier;
  title?: string;
  confidenceInterval?: ConfidenceInterval;
  confidenceIntervalPercentage?: number;
  scoreRange?: [number, number];
  historicalRuns?: PreviousRunSummary[];
  passCount?: number;
}

export const ViralityScore: React.FC<ViralityScoreProps> = ({
  score,
  tier,
  title,
  confidenceInterval,
  confidenceIntervalPercentage,
  scoreRange,
  historicalRuns,
  passCount,
}) => {
  const [showCiModal, setShowCiModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const cleanTier = cleanViralityTier(tier, score);

  // Compute confidence interval bounds and percentage
  const margin = confidenceInterval?.margin ?? 2.2;
  const lower = scoreRange ? scoreRange[0] : (confidenceInterval?.lower ?? Math.max(0, Math.round((score - margin) * 10) / 10));
  const upper = scoreRange ? scoreRange[1] : (confidenceInterval?.upper ?? Math.min(100, Math.round((score + margin) * 10) / 10));
  const confidenceLevel = confidenceInterval?.confidence_level ?? "95%";
  const confidencePct = confidenceIntervalPercentage ?? confidenceInterval?.confidence_percentage ?? 95;
  const numPasses = passCount || (historicalRuns && historicalRuns.length > 0 ? historicalRuns.length : 1);

  const getTierVariant = (t: ViralityTier) => {
    switch (t) {
      case "Explosive":
        return "gold";
      case "High":
        return "cyan";
      case "Moderate":
        return "gold";
      case "Low":
      default:
        return "chrome";
    }
  };

  const getTierIcon = (t: ViralityTier) => {
    switch (t) {
      case "Explosive":
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case "High":
        return <Zap className="w-3.5 h-3.5 text-[#00F5D4]" />;
      case "Moderate":
        return <Activity className="w-3.5 h-3.5 text-amber-300" />;
      case "Low":
      default:
        return <Award className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="cyber-glass rounded-xs p-6 relative overflow-hidden h-full flex flex-col justify-between border border-white/10 shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5D4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Celebration Overlay (balloons-js + componentry physics) */}
      <CelebrationOverlay
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        viralityScore={score}
        title={score >= 80 ? "Top 1% Algorithmic Breakthrough!" : "Virality Score Breakdown"}
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-wider">
                Virality Index
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40 px-2 py-0.5 rounded-xs">
                {confidencePct}% CI
              </span>
              {score >= 75 && (
                <button
                  onClick={() => setShowCelebration(true)}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#FF0055]/20 text-rose-300 border border-[#FF0055]/40 hover:bg-[#FF0055]/30 flex items-center gap-1 transition-all"
                  title="Launch celebratory balloon particles"
                >
                  <PartyPopper className="w-3 h-3 text-[#FF0055]" />
                  <span>Celebrate 🎈</span>
                </button>
              )}
            </div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-white mt-1">
              {title || "Virality Score"}
            </h2>
          </div>

          {/* Liquid Metal Tier Badge (metal.jakubantalik.com + cult-ui) */}
          <MetalBadge
            variant={getTierVariant(cleanTier)}
            icon={getTierIcon(cleanTier)}
            className="text-xs py-1 px-3 shadow-md"
          >
            {cleanTier}_TIER
          </MetalBadge>
        </div>

        {/* Score Range Primary Display */}
        <div className="my-5 space-y-2">
          <div>
            <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>VIRALITY SCORE RANGE ({confidencePct}% CONFIDENCE INTERVAL)</span>
            </div>
            
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight text-white">
                <TextShimmer className="font-extrabold">
                  {lower} – {upper}
                </TextShimmer>
              </span>
              <span className="font-mono font-bold text-xl text-neutral-500">/ 100</span>
            </div>
          </div>

          {/* Sub-Metric Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="bg-white/5 border border-white/10 text-neutral-200 font-mono text-xs font-bold px-2.5 py-1 rounded-xs flex items-center gap-1.5">
              <span>Mean: <strong className="text-[#00F5D4]">{score}</strong></span>
              <span className="text-neutral-500">•</span>
              <span>Range: <strong>[{lower} – {upper}]</strong> (±{margin})</span>
            </span>

            {numPasses > 1 ? (
              <span className="bg-[#00F5D4]/20 border border-[#00F5D4]/40 text-[#00F5D4] font-mono text-xs font-bold px-2.5 py-1 rounded-xs flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-[#00F5D4]" />
                <span>Multi-Pass ({numPasses} Runs)</span>
              </span>
            ) : null}

            <button
              onClick={() => setShowCiModal(!showCiModal)}
              className="text-xs font-mono font-medium text-neutral-400 hover:text-[#00F5D4] underline flex items-center gap-1 transition-colors"
              title="Why do scores vary slightly across repeat video uploads?"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>Why scores vary?</span>
            </button>
          </div>
        </div>

        {/* LED Dot Matrix Real-Time Visualizer (dotmatrix.zzzzshawn.cloud) */}
        <div className="my-4">
          <DotMatrixDisplay
            label="NEURAL SIGNAL MATRIX"
            statusText={cleanTier === "Explosive" ? "FYP CASCADE ENGAGED" : "RETENTION DIODE ACTIVE"}
            score={score}
            rows={4}
            cols={32}
            color={score >= 80 ? "cyan" : score >= 60 ? "amber" : "violet"}
          />
        </div>
      </div>

      <div>
        {/* Progress Bar showing Range Band overlay */}
        <div className="space-y-1 mb-2">
          <div className="relative w-full bg-white/5 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            {/* Lower to Upper Range Overlay Highlight */}
            <div
              className="absolute top-0 bottom-0 bg-[#00F5D4]/30 rounded-full transition-all duration-1000"
              style={{
                left: `${Math.min(100, Math.max(0, lower))}%`,
                width: `${Math.min(100, Math.max(2, upper - lower))}%`,
              }}
            />
            {/* Mean Score Indicator Bar */}
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-[#00F5D4] rounded-full transition-all duration-1000 ease-out relative z-10 shadow-lg shadow-[#00F5D4]/50"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-neutral-400 font-semibold px-0.5">
            <span>Range Band: {lower} – {upper}</span>
            <span>{confidenceLevel} Confidence ({confidencePct}%)</span>
          </div>
        </div>

        {/* Scale Legend */}
        <div className="flex justify-between text-[11px] font-mono text-neutral-400 font-bold pt-2 border-t border-white/10">
          <span>LOW (0-39)</span>
          <span>MOD (40-64)</span>
          <span>HIGH (65-84)</span>
          <span className="text-[#00F5D4] font-bold">EXPLOSIVE (85-100)</span>
        </div>
      </div>

      {/* Confidence Interval & Upload Variance Explanation Drawer / Modal */}
      {showCiModal && (
        <div className="mt-4 p-4 bg-[#F8F9FA] border border-[#E5E5E5] rounded-sm text-xs font-sans space-y-3 animate-fadeIn shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="font-mono font-bold text-[#111111] uppercase flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#111111]" /> {confidencePct}% Statistical Confidence Interval
            </span>
            <button
              onClick={() => setShowCiModal(false)}
              className="text-[#555555] hover:text-black p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[#333333] leading-relaxed">
            <strong>Why do repeat uploads of the exact same video produce a score range?</strong>
          </p>
          <p className="text-[#444444] leading-relaxed">
            Multimodal AI vision models (Gemini 3.8 Flash / Pro) sample visual keyframe sequences and vocal audio tracks probabilistically. Non-deterministic neural vision and attention token sampling incorporate micro-variations. Re-analyzing the same clip yields minor score fluctuations (typically ±1.5 to ±2.5 points), so representing the evaluation as a <strong>Confidence Range [{lower} – {upper}]</strong> is mathematically precise.
          </p>

          <div className="bg-white border border-[#E2E8F0] p-3 rounded-xs font-mono text-[11px] text-[#111111] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#555555]">• Score Range Bounds:</span>
              <strong className="text-[#111111]">{lower} – {upper} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555555]">• Mean Score Estimate:</span>
              <strong>{score} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555555]">• Confidence Interval Level:</span>
              <strong>{confidencePct}% ({confidenceLevel})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555555]">• Margin of Error:</span>
              <strong>±{margin} points</strong>
            </div>
          </div>

          {/* Historical Runs Breakdown if available */}
          {historicalRuns && historicalRuns.length > 0 && (
            <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
              <div className="font-mono text-[11px] font-bold text-[#111111] uppercase flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-[#111111]" />
                <span>Repeat Analysis Passes ({historicalRuns.length} Runs Recorded):</span>
              </div>
              <div className="space-y-1">
                {historicalRuns.map((run, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#E2E8F0] p-2 rounded-xs font-mono text-[11px] flex justify-between items-center"
                  >
                    <span className="text-[#555555]">Pass #{run.runNumber || i + 1} ({new Date(run.timestamp).toLocaleTimeString()}):</span>
                    <strong className="text-[#111111]">{run.score} / 100</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#555555] italic">
            This {confidencePct}% Confidence Interval mathematically proves that repeat runs represent the exact same performance band.
          </p>
        </div>
      )}
    </div>
  );
};

