import React from "react";
import { motion } from "motion/react";
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
      icon: <Zap className="w-5 h-5 text-black" />,
      accentBg: "bg-gradient-to-br from-[#00F5D4] to-teal-400",
      barColor: "bg-[#00F5D4]",
      glowClass: "hover:border-[#00F5D4]/60 hover:shadow-lg hover:shadow-[#00F5D4]/10",
      numColor: "text-[#00F5D4]",
    },
    {
      label: "HOLD RATE",
      sublabel: "Sustained Watch-Through",
      value: holdRate,
      margin: 2.3,
      icon: <Eye className="w-5 h-5 text-white" />,
      accentBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
      barColor: "bg-indigo-400",
      glowClass: "hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/10",
      numColor: "text-indigo-400",
    },
    {
      label: "SHARE VELOCITY",
      sublabel: "Social Forwarding Impulse",
      value: shareVelocity,
      margin: 2.0,
      icon: <Share2 className="w-5 h-5 text-white" />,
      accentBg: "bg-gradient-to-br from-[#FF0055] to-rose-600",
      barColor: "bg-[#FF0055]",
      glowClass: "hover:border-[#FF0055]/60 hover:shadow-lg hover:shadow-[#FF0055]/10",
      numColor: "text-[#FF0055]",
    },
  ];

  const expandedMetrics = [
    { label: "Retention Score", val: retentionScore, color: "text-[#00F5D4]" },
    { label: "Emotion Arousal", val: emotionArousal, color: "text-[#FF0055]" },
    { label: "Novelty Index", val: noveltyIndex, color: "text-[#FFB703]" },
    { label: "Clarity Score", val: clarityScore, color: "text-[#00F5D4]" },
    { label: "Pacing Rhythm", val: pacingScore, color: "text-purple-400" },
    { label: "Audio Engagement", val: audioEngagement, color: "text-indigo-400" },
    { label: "Visual Density", val: visualDensity, color: "text-[#00F5D4]" },
  ];

  return (
    <div className="space-y-6">
      {/* 3 Core Virality Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topMetrics.map((m, idx) => {
          const lower = Math.max(0, Math.round((m.value - m.margin) * 10) / 10);
          const upper = Math.min(100, Math.round((m.value + m.margin) * 10) / 10);

          return (
            <div 
              key={idx} 
              className={`cyber-glass rounded-xs p-6 border border-white/10 transition-all duration-300 ${m.glowClass}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                    {m.sublabel}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-1">{m.label}</h3>
                </div>
                <div className={`p-2.5 rounded-xs shadow-md ${m.accentBg}`}>
                  {m.icon}
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className={`font-display font-extrabold text-5xl ${m.numColor}`}>{m.value}</span>
                  <span className="font-mono text-xs font-semibold text-neutral-500">/ 100</span>
                </div>

                <div className="bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00F5D4]" />
                  <span>±{m.margin} (CI: {lower}–{upper})</span>
                </div>
              </div>

              {/* Animated Progress Data-Bar */}
              <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden mt-4">
                <motion.div
                  className={`data-bar h-full ${m.barColor} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
                  transition={{
                    duration: 1.0,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2 + idx * 0.15,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 7 Expanded Neural Metrics */}
      <div className="cyber-glass rounded-xs p-6 border border-white/10 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center">
          <div>
            <span className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-wider">
              Expanded Neural Signal Metrics
            </span>
            <h3 className="font-display font-bold text-xl text-white mt-1">
              Cognitive Signal Profile (95% Confidence Band)
            </h3>
          </div>
          <Sparkles className="w-5 h-5 text-[#00F5D4]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {expandedMetrics.map((m, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-3.5 rounded-xs text-center hover:border-white/20 transition-colors flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold block mb-1 truncate">
                  {m.label}
                </span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`font-display font-extrabold text-2xl ${m.color}`}>
                    {m.val}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500 font-semibold">
                    ±2.0
                  </span>
                </div>
              </div>

              {/* Micro Animated Data-Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2.5">
                <motion.div
                  className="data-bar h-full bg-[#00F5D4] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, Math.max(0, m.val))}%` }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.3 + idx * 0.08,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
