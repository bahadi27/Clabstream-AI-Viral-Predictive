import React, { useState } from "react";
import { HookAlternative, ViralityAnalysis } from "../types";
import { RefreshCw, Copy, Check, Sparkles, Globe, MessageSquare, Zap } from "lucide-react";

interface HookRewriterProps {
  hooks: HookAlternative[];
  analysis: ViralityAnalysis;
  onHooksRegenerated?: (newHooks: HookAlternative[]) => void;
}

export const HookRewriter: React.FC<HookRewriterProps> = ({
  hooks,
  analysis,
  onHooksRegenerated,
}) => {
  const [currentHooks, setCurrentHooks] = useState<HookAlternative[]>(hooks || []);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const detectedLang = analysis.detected_language || "Auto-detected";

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch("/api/regenerate-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.warn("Hook rewriter returned non-JSON response:", responseText.slice(0, 100));
      }
      if (data && data.hooks && data.hooks.length > 0) {
        setCurrentHooks(data.hooks);
        if (onHooksRegenerated) onHooksRegenerated(data.hooks);
      }
    } catch (err) {
      console.error("Failed to regenerate hooks:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs space-y-6">
      {/* Header section */}
      <div className="border-b border-[#E5E5E5] pb-5 flex flex-wrap justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Script Optimizer
            </span>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-900 border border-neutral-300 px-2 py-0.5 rounded-xs font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-neutral-900" />
              Language: {detectedLang}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Optimized Opening Hooks
          </h2>
          <p className="text-xs text-[#555555] font-sans mt-0.5 max-w-2xl">
            Generated hooks are rewritten in the exact language, voice, and narrative tone of your video for maximum viewer retention in the first 3 seconds.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="bg-[#111111] text-white px-4 py-2.5 rounded-sm text-xs font-semibold flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
          <span>{isRegenerating ? "Generating Hooks..." : "Generate Fresh Hooks"}</span>
        </button>
      </div>

      {/* Transcript & Language Summary */}
      <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-sm p-3.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[#333333]">
          <MessageSquare className="w-4 h-4 text-[#111111] shrink-0" />
          <span className="font-bold">Spoken Script / Voiceover:</span>
          <span className="text-[#111111] font-sans italic bg-white px-2 py-0.5 border border-[#E2E8F0] rounded-xs max-w-md truncate">
            "{analysis.verbatim_transcript || analysis.transcript_summary || "Original voiceover dialogue"}"
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="bg-neutral-100 text-neutral-900 border border-neutral-300 px-2 py-0.5 rounded-xs font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-neutral-900" />
            {analysis.narrative_tone || "Direct & Engaging"} Tone
          </span>
        </div>
      </div>

      {/* Clean Hooks List */}
      <div className="space-y-4">
        {currentHooks.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-sm p-4 hover:border-[#111111] transition-all space-y-3"
          >
            {/* Top row: Badge & Lift */}
            <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
              <span className="font-mono text-[10px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-xs">
                HOOK #{idx + 1}
              </span>
              <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-xs">
                +{item.predicted_lift || 12}% Virality Lift
              </span>
            </div>

            {/* Main Hook & Copy Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-display font-bold text-base md:text-lg text-[#111111] leading-snug">
                "{item.hook}"
              </p>

              <button
                onClick={() => copyToClipboard(item.hook, idx)}
                className="bg-white border border-[#E2E8F0] text-[#111111] px-3.5 py-2 text-xs font-bold rounded-sm flex items-center justify-center gap-1.5 shrink-0 hover:border-[#111111] hover:bg-neutral-50 transition-colors shadow-2xs self-start sm:self-center"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#111111]" />
                    <span className="text-[#111111]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hook</span>
                  </>
                )}
              </button>
            </div>

            {/* Simple explanation */}
            {item.rationale && (
              <p className="text-xs text-[#555555] font-sans border-t border-[#E2E8F0] pt-2">
                <strong className="text-[#222222]">Why it works:</strong> {item.rationale}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


