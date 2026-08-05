import React from "react";
import { PlatformScores as PlatformScoresType } from "../types";
import { Video, Youtube, Instagram, Twitter } from "lucide-react";

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
      notes: "Weighted on novelty, 1st-frame pattern interrupts & sound-on acoustic engagement.",
    },
    {
      key: "youtube",
      name: "YouTube Shorts",
      score: scores.youtube,
      icon: <Youtube className="w-4 h-4 text-white" />,
      bg: "bg-neutral-800 text-white",
      notes: "Weighted on narrative clarity, hold-through rate & search/title relevance.",
    },
    {
      key: "instagram",
      name: "Instagram Reels",
      score: scores.instagram,
      icon: <Instagram className="w-4 h-4 text-white" />,
      bg: "bg-neutral-900 text-white",
      notes: "Weighted on aesthetic density, audio trend match & DM story shareability.",
    },
    {
      key: "twitter",
      name: "X / Twitter Video",
      score: scores.twitter,
      icon: <Twitter className="w-4 h-4 text-white" />,
      bg: "bg-black text-white",
      notes: "Weighted on debate polarization, identity status threat & text density.",
    },
  ];

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="border-b border-[#E5E5E5] pb-4 mb-5">
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
            Algorithm Fit Forecast
          </span>
          <h2 className="font-display font-bold text-xl text-[#111111] mt-1">
            Platform Distribution Index
          </h2>
        </div>

        <div className="space-y-3.5">
          {platforms.map((p) => (
            <div key={p.key} className="bg-[#F4F4F4] border border-[#E5E5E5] p-3.5 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xs ${p.bg}`}>
                    {p.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider">
                    {p.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-base text-[#111111]">
                  {p.score} <span className="text-xs text-[#555555] font-normal">/100</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white border border-[#E5E5E5] overflow-hidden">
                <div
                  className="h-full bg-[#111111] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, p.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#E5E5E5] text-xs font-mono text-[#444444] font-medium flex justify-between items-center">
        <span>TOP ALGORITHM FIT:</span>
        <span className="font-bold text-[#111111] uppercase">
          {platforms.reduce((max, p) => (p.score > max.score ? p : max), platforms[0]).name}
        </span>
      </div>
    </div>
  );
};
