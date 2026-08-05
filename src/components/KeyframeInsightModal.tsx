import React, { useState, useEffect } from "react";
import { ViralityAnalysis, VideoKeyframe, BrainRegionKey } from "../types";
import { BRAIN_REGIONS, getFMRIColor } from "../data/brainRegions";
import {
  X,
  Camera,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Eye,
  Film,
  Activity,
  Layers,
} from "lucide-react";

interface KeyframeInsightModalProps {
  analysis: ViralityAnalysis;
  isOpen: boolean;
  onClose: () => void;
  initialKeyframe?: VideoKeyframe | null;
  initialRegionKey?: BrainRegionKey | null;
}

export const KeyframeInsightModal: React.FC<KeyframeInsightModalProps> = ({
  analysis,
  isOpen,
  onClose,
  initialKeyframe,
  initialRegionKey,
}) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const keyframes = analysis.keyframes || [];

  // Sync active frame when modal opens or props change
  useEffect(() => {
    if (!isOpen) return;

    if (initialKeyframe) {
      const idx = keyframes.findIndex(
        (k) => k.timestamp === initialKeyframe.timestamp || k.label === initialKeyframe.label
      );
      if (idx !== -1) {
        setActiveFrameIndex(idx);
        return;
      }
    }

    if (initialRegionKey) {
      // Find keyframe with matching brain activation keyword
      const regionInfo = BRAIN_REGIONS[initialRegionKey];
      const searchWord = regionInfo?.label.toLowerCase().split(" ")[0] || "";
      
      const matchedIdx = keyframes.findIndex((k) =>
        k.brainActivation?.toLowerCase().includes(searchWord) ||
        k.note.toLowerCase().includes(searchWord)
      );
      if (matchedIdx !== -1) {
        setActiveFrameIndex(matchedIdx);
        return;
      }
    }

    setActiveFrameIndex(0);
  }, [isOpen, initialKeyframe, initialRegionKey, keyframes]);

  if (!isOpen || keyframes.length === 0) return null;

  const currentFrame = keyframes[activeFrameIndex] || keyframes[0];

  // Helper to get brain region associated with current frame
  const getAssociatedBrainRegion = () => {
    if (!currentFrame) return null;
    
    // Check if brainActivation string matches any region
    const actStr = currentFrame.brainActivation?.toLowerCase() || "";
    for (const [key, info] of Object.entries(BRAIN_REGIONS)) {
      const firstWord = info.label.toLowerCase().split(" ")[0];
      if (actStr.includes(firstWord) || currentFrame.note.toLowerCase().includes(firstWord)) {
        return {
          key: key as BrainRegionKey,
          info,
          score: analysis.brain_regions[key as BrainRegionKey] ?? 75,
        };
      }
    }

    // Default fallback region if no direct text match
    const primaryRegionKey = initialRegionKey || "prefrontal";
    return {
      key: primaryRegionKey,
      info: BRAIN_REGIONS[primaryRegionKey],
      score: analysis.brain_regions[primaryRegionKey] ?? 85,
    };
  };

  const associatedRegion = getAssociatedBrainRegion();
  const regionHeatColor = associatedRegion ? getFMRIColor(associatedRegion.score) : "#111111";

  const handlePrev = () => {
    setActiveFrameIndex((prev) => (prev > 0 ? prev - 1 : keyframes.length - 1));
  };

  const handleNext = () => {
    setActiveFrameIndex((prev) => (prev < keyframes.length - 1 ? prev + 1 : 0));
  };

  const handleCopyRationale = () => {
    if (!currentFrame) return;
    const textToCopy = `[Keyframe ${currentFrame.timestamp}] ${currentFrame.label}\nBrain Activation: ${currentFrame.brainActivation || "N/A"}\nGemini 3.6 Rationale: ${currentFrame.note}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white border border-[#E5E5E5] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slideUp">
        {/* Header Bar */}
        <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#333333] rounded-xs text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                  Keyframe Insight Overlay
                </span>
                <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded-xs">
                  Gemini 3.6 Multimodal
                </span>
              </div>
              <h2 className="font-display font-bold text-lg md:text-xl text-white tracking-tight">
                Frame Screenshot & Neural Activation Analysis
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
            title="Close Overlay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Keyframe Screen & Inspection Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Visual Frame Screenshot Display (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video bg-black rounded-sm border border-[#E5E5E5] overflow-hidden group shadow-md">
                {currentFrame.imageData ? (
                  <img
                    src={currentFrame.imageData}
                    alt={currentFrame.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Stylized Fallback Frame Canvas */
                  <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold bg-[#111111] px-2.5 py-1 rounded-xs uppercase">
                        {currentFrame.type.replace("_", " ")}
                      </span>
                      <span className="font-mono text-xs text-white/60">
                        FPS 30 • 1080x1920
                      </span>
                    </div>

                    <div className="text-center my-auto space-y-2">
                      <Camera className="w-12 h-12 text-white/30 mx-auto" />
                      <p className="font-display font-extrabold text-lg text-white">
                        {currentFrame.label}
                      </p>
                      <p className="font-mono text-xs text-white/60">
                        Timestamp: {currentFrame.timestamp} ({currentFrame.timeInSeconds}s)
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-white/50 border-t border-white/10 pt-2">
                      <span>Gemini 3.6 Direct Vision Ingestion</span>
                      <span>fMRI Neural Match Score: {currentFrame.score}/100</span>
                    </div>
                  </div>
                )}

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-black/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xs border border-white/20">
                    ⏱ {currentFrame.timestamp}
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#111111] text-white px-2.5 py-1 rounded-xs uppercase">
                    {currentFrame.type.replace("_", " ")}
                  </span>
                </div>

                {/* Navigation Chevron Overlay */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  title="Previous Frame"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  title="Next Frame"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Thumbnails Slider Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {keyframes.map((kf, idx) => {
                  const isSel = idx === activeFrameIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveFrameIndex(idx)}
                      className={`flex-1 min-w-[100px] p-2 text-left rounded-sm border text-xs font-mono transition-all ${
                        isSel
                          ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                          : "bg-[#F4F4F4] text-[#111111] border-[#E5E5E5] hover:bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">{kf.timestamp}</span>
                        <span className="text-[10px] opacity-75">{kf.score}</span>
                      </div>
                      <p className="truncate text-[10px] opacity-90">{kf.label.split(" ")[1] || kf.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Neural Rationale & Brain Region Mapping (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 bg-[#F4F4F4] p-5 rounded-sm border border-[#E5E5E5]">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold bg-[#111111] text-white px-2.5 py-0.5 rounded-xs uppercase">
                    FRAME PERCEPTION INSIGHT
                  </span>
                  <span className="text-xl font-display font-extrabold text-[#111111]">
                    {currentFrame.score} <span className="text-xs font-mono text-[#555555]">/100</span>
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#111111]">
                  {currentFrame.label}
                </h3>
              </div>

              {/* Associated Brain Region Card */}
              {associatedRegion && (
                <div className="bg-white border border-[#E5E5E5] rounded-xs p-3.5 space-y-2 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-[#444444] uppercase flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-[#111111]" /> Correlated Brain Region
                    </span>
                    <span
                      className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-xs text-white"
                      style={{ backgroundColor: regionHeatColor }}
                    >
                      {associatedRegion.score}/100
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-[#111111]">
                      {associatedRegion.info.label}
                    </h4>
                    <p className="font-mono text-[11px] text-[#444444] font-medium">
                      {associatedRegion.info.sublabel}
                    </p>
                  </div>
                  <p className="text-xs text-[#333333] font-normal leading-relaxed">
                    {associatedRegion.info.description}
                  </p>
                </div>
              )}

              {/* Gemini 3.6 Neural Rationale Note */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#444444] uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#111111]" /> Gemini 3.6 Multimodal Rationale:
                </span>
                <div className="bg-white border border-[#E5E5E5] rounded-xs p-3.5 text-xs text-[#111111] font-sans leading-relaxed">
                  {currentFrame.note}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleCopyRationale}
                  className="flex-1 bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#111111] px-3 py-2 text-xs font-mono font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Copy Frame Rationale</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F4F4F4] border-t border-[#E5E5E5] px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#333333] font-medium">
            <Layers className="w-4 h-4 text-[#111111]" />
            <span>Frame {activeFrameIndex + 1} of {keyframes.length} Captured Keyframes</span>
          </div>

          <button
            onClick={onClose}
            className="bg-[#111111] text-white hover:bg-black px-5 py-2 text-xs font-semibold rounded-xs transition-colors"
          >
            Close Insight
          </button>
        </div>
      </div>
    </div>
  );
};
