import React from "react";
import { motion } from "motion/react";
import { PlatformScores as PlatformScoresType } from "../types";
import { Video, Instagram } from "lucide-react";

interface PlatformScoresProps {
  scores: PlatformScoresType;
}

export const PlatformScores: React.FC<PlatformScoresProps> = ({ scores }) => {
  if (!scores) return null;

  const platforms = [
    {
      key: "tiktok",
      name: "TikTok FYP",
      score: scores.tiktok,
      icon: <Video className="w-4 h-4 text-white" />,
      bg: "bg-[#111111] text-white",
      notes: "Weighted on novelty, 1st-frame pattern interrupts, viral sound usage & 3s hold rate.",
    },
    {
      key: "instagram",
      name: "Instagram Reels",
      score: scores.instagram,
      icon: <Instagram className="w-4 h-4 text-white" />,
      bg: "bg-neutral-900 text-white",
      notes: "Weighted on visual aesthetic density, trending audio match & DM story shareability.",
    },
  ];

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="border-b border-[#E5E5E5] pb-4 mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
              Algorithm Fit Forecast
            </span>
            <h2 className="font-display font-bold text-xl text-[#111111] mt-1">
              TikTok & Instagram Distribution Index
            </h2>
          </div>
          <span className="text-[10px] font-mono bg-[#111111] text-white px-2 py-1 rounded-xs font-bold uppercase">
            TikTok & IG Specialized
          </span>
        </div>

        <div className="space-y-4">
          {platforms.map((p, idx) => (
            <div key={p.key} className="bg-[#F4F4F4] border border-[#E5E5E5] p-4 rounded-sm space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xs ${p.bg}`}>
                    {p.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-[#111111] uppercase tracking-wider">
                    {p.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-lg text-[#111111]">
                  {p.score} <span className="text-xs text-[#555555] font-normal">/100</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-white border border-[#E5E5E5] overflow-hidden">
                <motion.div
                  className="data-bar h-full bg-[#111111] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, Math.max(0, p.score))}%` }}
                  transition={{
                    duration: 1.0,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 + idx * 0.15,
                  }}
                />
              </div>

              <p className="text-[11px] font-sans text-[#555555] pt-1">
                {p.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#E5E5E5] text-xs font-mono text-[#444444] font-medium flex justify-between items-center">
        <span>TOP PLATFORM ALGORITHM FIT:</span>
        <span className="font-bold text-[#111111] uppercase">
          {platforms.reduce((max, p) => (p.score > max.score ? p : max), platforms[0]).name}
        </span>
      </div>
    </div>
  );
};
