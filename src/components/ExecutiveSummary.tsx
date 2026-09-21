import React, { useState } from "react";
import { ViralityAnalysis } from "../types";
import { Sparkles, Copy, Check, RefreshCw, Zap, TrendingUp, Share2, BrainCircuit } from "lucide-react";
import { FineLineHeader } from "./ui/FineLineHeader";

interface ExecutiveSummaryProps {
  analysis: ViralityAnalysis;
  onSummaryUpdated?: (newSummary: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  analysis,
  onSummaryUpdated,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string>(
    analysis.executive_summary ||
      `This video is predicted to achieve strong viral performance with a ${Math.round(
        analysis.virality_score
      )}/100 virality score because its opening hook immediately secures cognitive focus within the first 1.5 seconds. The rhythmic pacing and high auditory clarity sustain an impressive ${Math.round(
        analysis.hold_rate
      )}% hold rate across key narrative beats without viewer drop-off. Strong psychological resonance and actionable value drive high forward-sharing velocity, positioning the video for algorithmic amplification on TikTok FYP and Instagram Reels.`
  );

  // Sync if prop updates from parent
  React.useEffect(() => {
    if (analysis.executive_summary) {
      setCurrentSummary(analysis.executive_summary);
    }
  }, [analysis.executive_summary]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });

      const data = await res.json();
      if (data && data.success && data.summary) {
        setCurrentSummary(data.summary);
        if (onSummaryUpdated) {
          onSummaryUpdated(data.summary);
        }
      }
    } catch (err) {
      console.warn("Failed to regenerate summary:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Split into individual sentences if 3 sentences exist for visual styling
  const sentences = (currentSummary || "")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  return (
    <div
      id="section-executive-summary"
      className="studio-panel border border-white/10 p-6 md:p-8 relative overflow-hidden shadow-2xl space-y-6 scroll-mt-24 studio-crosshair"
    >
      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/5 border border-white/15 text-[#00F5D4] shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <FineLineHeader
              as="h3"
              variant="underline"
              tag="[EXECUTIVE SUMMARY // GEMINI 3.8]"
              secondaryTag="3-SENTENCE COGNITIVE SYNTHESIS"
              className="font-display font-bold text-lg md:text-xl text-white tracking-tight"
              lineColor="rgba(0, 245, 212, 0.4)"
            >
              Why This Video Is Predicted To Perform Well
            </FineLineHeader>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="bg-white/5 border border-white/15 hover:bg-white hover:text-black text-neutral-200 px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            title="Re-run Gemini AI strategic synthesis for this video"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isGenerating ? "animate-spin text-[#00F5D4]" : ""
              }`}
            />
            <span>{isGenerating ? "SYNTHESIZING..." : "REGENERATE"}</span>
          </button>

          <button
            onClick={handleCopy}
            className="bg-white/5 border border-white/15 hover:bg-white hover:text-black text-neutral-200 px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Copy 3-sentence summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 3-Sentence Narrative Display */}
      <div className="relative z-10 space-y-4">
        {isGenerating ? (
          <div className="p-6 bg-[#08080A] border border-white/10 flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white animate-spin" />
            <p className="text-xs font-mono text-neutral-300">
              Gemini 3.8 is synthesizing cognitive, auditory, and behavioral signals into an executive prediction...
            </p>
          </div>
        ) : sentences.length >= 2 ? (
          <div className="space-y-3">
            {sentences.map((sentence, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 bg-[#0A0A0E] border border-white/10 hover:border-white/25 transition-all"
              >
                <div className="shrink-0 mt-0.5">
                  <span className="text-[10px] font-mono font-bold w-6 h-6 bg-white/10 text-white border border-white/20 flex items-center justify-center">
                    0{idx + 1}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    {idx === 0
                      ? "[COGNITIVE INGRESS // HOOK CAPTURE]"
                      : idx === 1
                      ? "[SENSORY PACING // NARRATIVE RETENTION]"
                      : "[ALGORITHMIC LIFT // FORWARD-SHARE IMPULSE]"}
                  </span>
                  <p className="text-sm md:text-[15px] leading-relaxed text-neutral-100 font-sans">
                    {sentence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#0A0A0E] border border-white/10">
            <p className="text-sm md:text-base leading-relaxed text-neutral-100 font-sans">
              {currentSummary}
            </p>
          </div>
        )}
      </div>

      {/* 3 Core Virality Drivers Summary Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 bg-[#08080A] border border-white/10 flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 text-emerald-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              Hook Strength
            </div>
            <div className="text-sm font-display font-bold text-white flex items-center gap-1.5">
              <span>{Math.round(analysis.hook_score)}/100</span>
              <span className="text-[10px] font-mono font-normal text-emerald-400">
                (Sub-3s Anchor)
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-[#08080A] border border-white/10 flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 text-[#00F5D4] shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              Hold Rate
            </div>
            <div className="text-sm font-display font-bold text-white flex items-center gap-1.5">
              <span>{Math.round(analysis.hold_rate)}%</span>
              <span className="text-[10px] font-mono font-normal text-[#00F5D4]">
                (Mid-Video Hold)
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-[#08080A] border border-white/10 flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 text-purple-400 shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
              Share Velocity
            </div>
            <div className="text-sm font-display font-bold text-white flex items-center gap-1.5">
              <span>{Math.round(analysis.share_velocity)}/100</span>
              <span className="text-[10px] font-mono font-normal text-purple-400">
                (FYP / Explore Lift)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
