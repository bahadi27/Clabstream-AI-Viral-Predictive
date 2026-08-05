import React, { useState } from "react";
import { VideoKeyframe } from "../types";
import { Camera, Eye, Zap, Sparkles, Maximize2, X, Brain } from "lucide-react";

interface KeyframeBreakdownProps {
  keyframes?: VideoKeyframe[];
  onOpenKeyframeInsight?: (keyframe: VideoKeyframe) => void;
}

export const KeyframeBreakdown: React.FC<KeyframeBreakdownProps> = ({
  keyframes,
  onOpenKeyframeInsight,
}) => {
  const [selectedFrame, setSelectedFrame] = useState<VideoKeyframe | null>(null);

  const handleFrameClick = (kf: VideoKeyframe) => {
    setSelectedFrame(kf);
    if (onOpenKeyframeInsight) {
      onOpenKeyframeInsight(kf);
    }
  };

  if (!keyframes || keyframes.length === 0) return null;

  const getTypeStyle = (type: VideoKeyframe["type"]) => {
    switch (type) {
      case "hook":
        return {
          bg: "bg-[#111111] text-white",
          label: "0-3s HOOK FRAME",
          borderColor: "border-[#111111]",
        };
      case "pattern_break":
        return {
          bg: "bg-neutral-800 text-white",
          label: "PATTERN BREAK",
          borderColor: "border-neutral-800",
        };
      case "emotional_peak":
        return {
          bg: "bg-neutral-900 text-white",
          label: "EMOTIONAL PEAK",
          borderColor: "border-neutral-900",
        };
      case "payoff":
      default:
        return {
          bg: "bg-neutral-700 text-white",
          label: "FINAL PAYOFF / CTA",
          borderColor: "border-neutral-700",
        };
    }
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 space-y-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
              Multimodal Frame Screenshots
            </span>
            <span className="bg-[#111111] text-white text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold uppercase">
              Gemini 3.6 Visual Perception
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Keyframe Screenshot & Hook Breakdown
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#333333] font-medium bg-[#F4F4F4] px-3 py-1.5 rounded-sm border border-[#E5E5E5]">
          <Camera className="w-4 h-4 text-[#111111]" />
          <span>{keyframes.length} Analysis Keyframes Captured</span>
        </div>
      </div>

      {/* Grid of Keyframe Screenshots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {keyframes.map((kf, idx) => {
          const style = getTypeStyle(kf.type);

          return (
            <div
              key={idx}
              onClick={() => handleFrameClick(kf)}
              className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#111111] transition-all cursor-pointer group shadow-xs"
            >
              {/* Frame Thumbnail Container */}
              <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                {kf.imageData ? (
                  <img
                    src={kf.imageData}
                    alt={kf.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  /* Stylized fallback frame visual */
                  <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black flex flex-col items-center justify-center p-4 text-center">
                    <Camera className="w-8 h-8 text-white/40 mb-2" />
                    <span className="font-mono text-[10px] text-white/60 font-bold uppercase">
                      {kf.timestamp} • {kf.label}
                    </span>
                  </div>
                )}

                {/* Overlaid Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold bg-black/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-xs border border-white/20">
                    {kf.timestamp}
                  </span>
                  <span className={`font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-xs uppercase ${style.bg}`}>
                    {style.label}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5 font-mono text-xs font-extrabold bg-white text-[#111111] px-2 py-0.5 rounded-xs shadow-xs border border-[#E5E5E5]">
                  {kf.score} <span className="text-[9px] text-[#555555] font-semibold">/100</span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-bold">
                  <Maximize2 className="w-4 h-4" />
                  <span>Inspect Frame</span>
                </div>
              </div>

              {/* Text Meta Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#111111] mb-1 line-clamp-1">
                    {kf.label}
                  </h3>

                  <p className="text-xs font-sans text-[#333333] font-normal leading-relaxed mb-3 line-clamp-2">
                    {kf.note}
                  </p>
                </div>

                {kf.brainActivation && (
                  <div className="pt-2 border-t border-[#E5E5E5] flex items-center gap-1.5 font-mono text-[10px] text-[#111111] font-bold">
                    <Brain className="w-3.5 h-3.5 shrink-0 text-[#111111]" />
                    <span className="truncate">{kf.brainActivation}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frame Detail Modal */}
      {selectedFrame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-sm border border-[#E5E5E5] shadow-2xl overflow-hidden relative animate-fadeIn">
            <button
              onClick={() => setSelectedFrame(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-white border border-[#E5E5E5] rounded-xs text-[#111111] hover:border-[#111111] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image View */}
            <div className="bg-black relative aspect-video flex items-center justify-center border-b border-[#E5E5E5]">
              {selectedFrame.imageData ? (
                <img
                  src={selectedFrame.imageData}
                  alt={selectedFrame.label}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-white/60 font-mono text-sm">
                  Full Resolution Keyframe Screenshot
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs border border-white/20 p-2.5 rounded-xs text-white font-mono text-xs flex items-center gap-3">
                <span className="font-bold text-white">{selectedFrame.timestamp}</span>
                <span>•</span>
                <span className="font-semibold">{selectedFrame.label}</span>
              </div>
            </div>

            {/* Modal Content Details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Neural Keyframe Diagnosis
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-[#111111] mt-0.5">
                    {selectedFrame.label}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs text-[#444444] uppercase block font-bold">
                    Salience Score
                  </span>
                  <span className="font-display font-extrabold text-3xl text-[#111111]">
                    {selectedFrame.score} / 100
                  </span>
                </div>
              </div>

              <div className="bg-[#F4F4F4] border border-[#E5E5E5] p-4 rounded-xs text-xs font-sans text-[#333333] leading-relaxed">
                <span className="font-mono font-bold text-[#111111] block mb-1">
                  QUALITATIVE PERCEPTUAL DIAGNOSIS:
                </span>
                {selectedFrame.note}
              </div>

              {selectedFrame.brainActivation && (
                <div className="bg-[#111111] text-white p-3.5 rounded-xs font-mono text-xs flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-white shrink-0" />
                  <span>
                    <strong className="text-white">Target Brain Activation:</strong>{" "}
                    {selectedFrame.brainActivation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
