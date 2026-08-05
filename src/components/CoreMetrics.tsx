import React from "react";
import { Zap, Eye, Share2, Sparkles, ShieldCheck } from "lucide-react";

interface CoreMetricsProps {
  hookScore: number;
  holdRate: number;
  shareVelocity: number;

  retentionScore: number;
  emotionArousal: number;
  noveltyIndex: number;
  clarityScore: number;
  pacingScore: number;
  audioEngagement: number;
  visualDensity: number;
}

export const CoreMetrics: React.FC<CoreMetricsProps> = ({
  hookScore,
  holdRate,
  shareVelocity,
  retentionScore,
  emotionArousal,
  noveltyIndex,
  clarityScore,
  pacingScore,
  audioEngagement,
  visualDensity,
}) => {
  const topMetrics = [
    {
      label: "HOOK SCORE",
      sublabel: "First 1-3s Attention Salience",
      value: hookScore,
      margin: 2.1,
      icon: <Zap className="w-5 h-5 text-white" />,
      bg: "bg-[#111111] text-white",
    },
    {
      label: "HOLD RATE",
      sublabel: "Sustained Watch-Through",
      value: holdRate,
      margin: 2.3,
      icon: <Eye className="w-5 h-5 text-white" />,
      bg: "bg-neutral-800 text-white",
    },
    {
      label: "SHARE VELOCITY",
      sublabel: "Social Forwarding Impulse",
      value: shareVelocity,
      margin: 2.0,
      icon: <Share2 className="w-5 h-5 text-white" />,
      bg: "bg-neutral-900 text-white",
    },
  ];

  const expandedMetrics = [
    { label: "Retention Score", val: retentionScore },
    { label: "Emotion Arousal", val: emotionArousal },
    { label: "Novelty Index", val: noveltyIndex },
    { label: "Clarity Score", val: clarityScore },
    { label: "Pacing Rhythm", val: pacingScore },
    { label: "Audio Engagement", val: audioEngagement },
    { label: "Visual Density", val: visualDensity },
  ];

  return (
    <div className="space-y-6">
      {/* 3 Core Virality Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topMetrics.map((m, idx) => {
          const lower = Math.max(0, Math.round((m.value - m.margin) * 10) / 10);
          const upper = Math.min(100, Math.round((m.value + m.margin) * 10) / 10);

          return (
            <div key={idx} className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs hover:border-[#111111] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono text-xs uppercase font-bold text-[#111111] tracking-wider block">
                    {m.sublabel}
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-[#111111] mt-1">{m.label}</h3>
                </div>
                <div className={`p-2.5 rounded-sm ${m.bg}`}>
                  {m.icon}
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-5xl text-[#111111]">{m.value}</span>
                  <span className="font-mono text-xs font-semibold text-[#555555]">/ 100</span>
                </div>

                <div className="bg-neutral-100 border border-neutral-300 text-neutral-900 font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-neutral-900" />
                  <span>±{m.margin} (CI: {lower}–{upper})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7 Expanded Neural Metrics */}
      <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs">
        <div className="border-b border-[#E5E5E5] pb-4 mb-6 flex justify-between items-center">
          <div>
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
              Expanded Neural Signal Metrics
            </span>
            <h3 className="font-display font-bold text-xl text-[#111111] mt-1">
              Cognitive Signal Profile (95% Confidence Band)
            </h3>
          </div>
          <Sparkles className="w-5 h-5 text-[#111111]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {expandedMetrics.map((m, idx) => (
            <div key={idx} className="bg-[#F4F4F4] border border-[#E5E5E5] p-3.5 rounded-sm text-center">
              <span className="font-mono text-[10px] text-[#444444] uppercase font-bold block mb-1 truncate">
                {m.label}
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-display font-extrabold text-2xl text-[#111111]">
                  {m.val}
                </span>
                <span className="font-mono text-[10px] text-neutral-800 font-semibold">
                  ±2.0
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
