import React from "react";
import { ViralityAnalysis } from "../types";
import { Scale, Trophy, ArrowRight, X } from "lucide-react";

interface ComparisonViewProps {
  analysisA: ViralityAnalysis;
  analysisB: ViralityAnalysis;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  analysisA,
  analysisB,
  onClose,
}) => {
  if (!analysisA || !analysisB) return null;

  const compareMetric = (valA: number, valB: number) => {
    if (valA === valB) return { winner: "tie", diff: 0 };
    if (valA > valB) return { winner: "A", diff: valA - valB };
    return { winner: "B", diff: valB - valA };
  };

  const overallComp = compareMetric(analysisA.virality_score, analysisB.virality_score);

  const metricsList = [
    { label: "Virality Score", a: analysisA.virality_score, b: analysisB.virality_score },
    { label: "Hook Score (0-3s)", a: analysisA.hook_score, b: analysisB.hook_score },
    { label: "Hold Rate", a: analysisA.hold_rate, b: analysisB.hold_rate },
    { label: "Share Velocity", a: analysisA.share_velocity, b: analysisB.share_velocity },
    { label: "Retention Index", a: analysisA.retention_score, b: analysisB.retention_score },
    { label: "Emotion Arousal", a: analysisA.emotion_arousal, b: analysisB.emotion_arousal },
    { label: "Novelty Index", a: analysisA.novelty_index, b: analysisB.novelty_index },
    { label: "Clarity Score", a: analysisA.clarity_score, b: analysisB.clarity_score },
    { label: "Audio Engagement", a: analysisA.audio_engagement, b: analysisB.audio_engagement },
    { label: "Visual Density", a: analysisA.visual_density, b: analysisB.visual_density },
    { label: "TikTok FYP", a: analysisA.platform_scores?.tiktok || 0, b: analysisB.platform_scores?.tiktok || 0 },
    { label: "YouTube Shorts", a: analysisA.platform_scores?.youtube || 0, b: analysisB.platform_scores?.youtube || 0 },
    { label: "Instagram Reels", a: analysisA.platform_scores?.instagram || 0, b: analysisB.platform_scores?.instagram || 0 },
  ];

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 relative shadow-xs">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#111111] text-white rounded-sm">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
              A/B Neural Duel Comparison
            </span>
            <h2 className="font-display font-extrabold text-2xl text-[#111111]">
              Side-by-Side Performance Duel
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#111111] font-mono text-xs font-semibold rounded-sm transition-colors"
        >
          Exit Duel
        </button>
      </div>

      {/* Winner Banner */}
      <div className="bg-[#111111] text-white rounded-sm p-5 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-white fill-white" />
          <div>
            <span className="font-mono text-xs font-bold uppercase text-white/60">
              DUEL WINNER FORECAST
            </span>
            <h3 className="font-display font-extrabold text-xl text-white">
              {overallComp.winner === "A"
                ? `Variant A (${analysisA.title}) Wins by +${overallComp.diff} Points`
                : overallComp.winner === "B"
                ? `Variant B (${analysisB.title}) Wins by +${overallComp.diff} Points`
                : "Tie Result — Equal Virality Potential"}
            </h3>
          </div>
        </div>
      </div>

      {/* Variant Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#F4F4F4] border border-[#E5E5E5] p-5 rounded-sm">
          <span className="font-mono text-xs font-bold bg-[#111111] text-white px-2.5 py-0.5 rounded-xs">
            VARIANT A
          </span>
          <h3 className="font-display font-bold text-lg text-[#111111] mt-2">
            {analysisA.title || "Analysis A"}
          </h3>
          <p className="font-display font-extrabold text-4xl text-[#111111] mt-1">
            {analysisA.virality_score} <span className="text-xs font-mono text-[#555555]">/100</span>
          </p>
        </div>

        <div className="bg-[#F4F4F4] border border-[#E5E5E5] p-5 rounded-sm">
          <span className="font-mono text-xs font-bold bg-[#111111] text-white px-2.5 py-0.5 rounded-xs">
            VARIANT B
          </span>
          <h3 className="font-display font-bold text-lg text-[#111111] mt-2">
            {analysisB.title || "Analysis B"}
          </h3>
          <p className="font-display font-extrabold text-4xl text-[#111111] mt-1">
            {analysisB.virality_score} <span className="text-xs font-mono text-[#555555]">/100</span>
          </p>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="space-y-2">
        {metricsList.map((m, idx) => {
          const comp = compareMetric(m.a, m.b);
          return (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 items-center p-3 border-b border-[#E5E5E5] text-xs font-mono"
            >
              <div className="col-span-5 md:col-span-4 font-bold text-[#111111]">
                {m.label}
              </div>
              <div
                className={`col-span-3 md:col-span-3 text-center font-extrabold text-sm ${
                  comp.winner === "A" ? "text-black underline font-black" : "text-[#111111]"
                }`}
              >
                {m.a}
              </div>
              <div
                className={`col-span-3 md:col-span-3 text-center font-extrabold text-sm ${
                  comp.winner === "B" ? "text-black underline font-black" : "text-[#111111]"
                }`}
              >
                {m.b}
              </div>
              <div className="col-span-1 md:col-span-2 text-right text-[10px] text-[#444444] font-medium">
                {comp.winner === "tie" ? "EQUAL" : `+${comp.diff}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
