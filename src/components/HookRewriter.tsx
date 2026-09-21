import React, { useState, useEffect } from "react";
import { HookAlternative, ViralityAnalysis } from "../types";
import {
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Globe,
  MessageSquare,
  Zap,
  Flame,
  Filter,
  FileCode2,
  HelpCircle,
  X,
  Bot,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface HookRewriterProps {
  hooks: HookAlternative[];
  analysis: ViralityAnalysis;
  onHooksRegenerated?: (newHooks: HookAlternative[]) => void;
  selectedLanguage?: string;
}

export const HookRewriter: React.FC<HookRewriterProps> = ({
  hooks,
  analysis,
  onHooksRegenerated,
  selectedLanguage,
}) => {
  const [currentHooks, setCurrentHooks] = useState<HookAlternative[]>(hooks || []);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState<"all" | "script" | "audio" | "visual">("all");
  const [showPromptGuidelineModal, setShowPromptGuidelineModal] = useState(false);
  const [copiedPromptType, setCopiedPromptType] = useState<string | null>(null);

  // Thumbs up / down user rating preferences
  const [ratings, setRatings] = useState<Record<string, "up" | "down">>(() => {
    try {
      const saved = localStorage.getItem("neuroviral_hook_ratings");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Sync state if incoming hooks prop changes
  useEffect(() => {
    if (hooks && hooks.length > 0) {
      setCurrentHooks(hooks);
    }
  }, [hooks]);

  const handleRateHook = (hookText: string, rating: "up" | "down", item: HookAlternative, hookIndex: number) => {
    const current = ratings[hookText];
    const newRating = current === rating ? undefined : rating;

    const nextRatings = { ...ratings };
    if (newRating) {
      nextRatings[hookText] = newRating;
      setFeedbackNotice(`Hook #${hookIndex + 1}: ${newRating === "up" ? "👍 Positive rating saved" : "👎 Improvement feedback recorded"} for AI calibration.`);
    } else {
      delete nextRatings[hookText];
      setFeedbackNotice(`Hook #${hookIndex + 1} rating cleared.`);
    }

    setRatings(nextRatings);
    try {
      localStorage.setItem("neuroviral_hook_ratings", JSON.stringify(nextRatings));
    } catch (err) {
      console.warn("Failed to persist ratings:", err);
    }

    setTimeout(() => setFeedbackNotice(null), 3500);

    // Transmit telemetry to engine backend
    if (newRating) {
      fetch("/api/feedback/hook-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hookText,
          rating: newRating,
          alignmentSource: item.alignment_source,
          language: item.original_language || analysis.detected_language,
          topic: analysis.title,
        }),
      }).catch((e) => console.debug("Feedback telemetry notice:", e));
    }
  };

  const detectedLang = analysis.detected_language || "Auto-detected";

  const compactPromptTemplate = `# ROLE: Neuro-Virality Hook & On-Screen Super Generator
Generate 5 high-retention video hooks (0–3s) + on-screen text supers based on behavioral psychology.

### HOOK ARCHETYPES & FORMULAS:
1. Negative / Loss Aversion (Fear of mistake): "Jangan pernah [X] kalau nggak mau [Y]..." / "Stop lakukan kesalahan ini di [Topik]..."
2. Pattern Interrupt (Bongkar mitos): "Semua orang salah kira tentang [X]..." / "[Kebiasaan umum] sebenarnya merusak [Hasil] kamu."
3. Curiosity Gap / Secret: "1 trik rahasia [Topik] yang jarang dibahas..." / "Kenapa nggak ada yang ngomongin [Hal mengejutkan] ini?"
4. Tribal / Identity Callout: "Khusus buat kamu yang lagi [Kondisi spesifik]..." / "Kalau kamu [Profesi/Tipe], tonton ini sampai habis."
5. Urgent Warning / High Stakes: "Tolong jangan coba [X] sebelum tahu ini..." / "Simpan video ini sebelum kamu [Lakukan X]."

### RULES:
- No Fluff: Dilarang salam/pembukaan ("Halo guys", "Di video kali ini"). Langsung ke poin.
- Spoken Hook: Maksimal 6–12 kata (durasi bicara < 2.5 detik).
- On-Screen Super: Maksimal 3–5 kata huruf kapital (punchy & kontras).
- Visual Cue: 1 kalimat aksi kamera/gerakan fisik di detik ke-0.

### INPUT:
- Topik: "${analysis.title || "Video Content"}"
- Transkrip / Konteks: "${(analysis.voiceover_draft || analysis.verbatim_transcript || analysis.transcript_summary || "").slice(0, 180)}"
- Target Language: "${selectedLanguage && selectedLanguage !== "auto" ? selectedLanguage : detectedLang}"

### OUTPUT FORMAT (Hasilkan 5 opsi):
1. [Nama Archetype]
   - 🎙️ Spoken: "[Kalimat yang diucapkan]"
   - 📱 Screen Super: "[TEKS SINGKAT DI LAYAR]"
   - 🎬 Visual Cue: [Aksi fisik / shot camera di detik 0]
   - 🧠 Trigger: [Alasan psikologisnya singkat]`;

  const copyPromptToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptType(type);
    setTimeout(() => setCopiedPromptType(null), 2500);
  };

  const handleRegenerate = async (selectedMode?: "all" | "script" | "audio" | "visual") => {
    const activeMode = selectedMode || focusMode;
    setIsRegenerating(true);
    try {
      const response = await fetch("/api/regenerate-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          focusMode: activeMode,
          targetLanguage: selectedLanguage,
        }),
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

  const handleRegenerateSingle = async (targetIdx: number) => {
    setRegeneratingIdx(targetIdx);
    try {
      const response = await fetch("/api/regenerate-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          focusMode,
          targetLanguage: selectedLanguage,
        }),
      });
      const responseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.warn("Single hook rewriter returned non-JSON response:", responseText.slice(0, 100));
      }
      if (data && data.hooks && data.hooks.length > 0) {
        // Find a fresh hook that isn't already used
        const existingHookTexts = new Set(currentHooks.map((h) => h.hook));
        const newCandidate =
          data.hooks.find((h: HookAlternative) => !existingHookTexts.has(h.hook)) ||
          data.hooks[targetIdx % data.hooks.length] ||
          data.hooks[0];

        setCurrentHooks((prev) => {
          const updated = [...prev];
          updated[targetIdx] = newCandidate;
          return updated;
        });

        if (onHooksRegenerated) {
          const updated = [...currentHooks];
          updated[targetIdx] = newCandidate;
          onHooksRegenerated(updated);
        }
      }
    } catch (err) {
      console.error("Failed to regenerate single hook:", err);
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const handleModeChange = (mode: "all" | "script" | "audio" | "visual") => {
    setFocusMode(mode);
    handleRegenerate(mode);
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Script Optimizer
            </span>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-900 border border-neutral-300 px-2 py-0.5 rounded-xs font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-neutral-900" />
              Language: {detectedLang}
            </span>
            {analysis.language_confidence !== undefined && (
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-700" />
                Confidence: {analysis.language_confidence}%
              </span>
            )}
            {analysis.is_non_english && (
              <span className="text-[10px] font-mono bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-xs font-bold">
                🌏 Native Multilingual Virality Engine
              </span>
            )}
            <span className="text-[10px] font-mono bg-[#111111] text-white px-2 py-0.5 rounded-xs font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> TikTok Trend Formats
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Native & Localized Opening Hooks
          </h2>
          <p className="text-xs text-[#555555] font-sans mt-0.5 max-w-2xl">
            Proposed hooks are formulated in the video's original spoken dialect ({detectedLang}) with tailored cultural triggers and verified English translations for global marketing strategy.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setShowPromptGuidelineModal(true)}
            className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 px-3.5 py-2.5 rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Export Prompt Formula for ChatGPT, Claude, and Gemini"
          >
            <Bot className="w-3.5 h-3.5 text-purple-700" />
            <span>Export Master Hook Prompt</span>
          </button>

          <button
            onClick={() => handleRegenerate()}
            disabled={isRegenerating}
            className="bg-[#111111] text-white px-4 py-2.5 rounded-sm text-xs font-semibold flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50 shadow-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>{isRegenerating ? "Generating Hooks..." : "Generate Fresh Localized Hooks"}</span>
          </button>
        </div>
      </div>

      {/* Focus Mode Selector Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#E5E5E5] pb-4">
        <span className="text-xs font-mono font-bold text-[#555555] flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Trend Style Focus:
        </span>
        {[
          { id: "all", label: "🔥 All Viral Formats" },
          { id: "script", label: "🗣️ Casual Story & Dialogue" },
          { id: "audio", label: "🎵 TikTok Voiceover & Beats" },
          { id: "visual", label: "👁️ Visual Action & Keyframe" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleModeChange(tab.id as any)}
            disabled={isRegenerating}
            className={`px-3 py-1.5 rounded-xs text-xs font-mono font-bold transition-all border ${
              focusMode === tab.id
                ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                : "bg-[#F8F9FA] text-[#555555] border-[#E2E8F0] hover:border-[#111111] hover:text-[#111111]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transcript & Context Bar */}
      <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-sm p-3.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[#333333]">
          <MessageSquare className="w-4 h-4 text-[#111111] shrink-0" />
          <span className="font-bold">Original Spoken Dialogue:</span>
          <span className="text-[#111111] font-sans italic bg-white px-2 py-0.5 border border-[#E2E8F0] rounded-xs max-w-md truncate">
            "{analysis.voiceover_draft || analysis.verbatim_transcript || analysis.transcript_summary || analysis.title || "Original spoken video script"}"
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
          {analysis.localized_market_fit && (
            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-xs font-semibold flex items-center gap-1">
              <span>🎯 Market: {analysis.localized_market_fit}</span>
            </span>
          )}
          {analysis.voiceover_draft && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-xs font-semibold flex items-center gap-1">
              <span>🎙️ Voiceover Draft Ingested</span>
            </span>
          )}
          <span className="bg-neutral-100 text-neutral-900 border border-neutral-300 px-2 py-0.5 rounded-xs font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-neutral-900" />
            {analysis.narrative_tone || "Direct & Casual"} Voice
          </span>
        </div>
      </div>

      {/* Feedback Notification Toast / Banner */}
      {feedbackNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-xs text-xs font-mono font-semibold flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{feedbackNotice}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hooks List */}
      <div className="space-y-4">
        {currentHooks.map((item, idx) => (
          <div
            key={idx}
            className={`bg-[#F8F9FA] border rounded-sm p-4 transition-all space-y-3 ${
              ratings[item.hook] === "up"
                ? "border-emerald-300 bg-emerald-50/20 shadow-xs"
                : ratings[item.hook] === "down"
                ? "border-rose-200 bg-rose-50/20 opacity-80"
                : "border-[#E2E8F0] hover:border-[#111111]"
            }`}
          >
            {/* Top row: Badge & Source */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-xs">
                  HOOK #{idx + 1}
                </span>
                {item.alignment_source && (
                  <span className="font-mono text-[10px] font-bold bg-white text-[#333333] border border-[#E2E8F0] px-2 py-0.5 rounded-xs">
                    Aligned with: {item.alignment_source}
                  </span>
                )}
                {item.original_language && item.original_language !== "English" && (
                  <span className="font-mono text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-xs">
                    🗣️ {item.original_language}
                  </span>
                )}
                {item.cultural_trigger && (
                  <span className="font-mono text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-xs">
                    ⚡ {item.cultural_trigger}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {ratings[item.hook] === "up" && (
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    <ThumbsUp className="w-2.5 h-2.5 fill-current" /> Rated Helpful
                  </span>
                )}
                {ratings[item.hook] === "down" && (
                  <span className="font-mono text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    <ThumbsDown className="w-2.5 h-2.5 fill-current" /> Flagged for Engine Tuning
                  </span>
                )}
                <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-xs">
                  +{item.predicted_lift || 12}% Virality Lift
                </span>
              </div>
            </div>

            {/* Main Hook & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 space-y-1.5">
                <p className="font-display font-bold text-base md:text-lg text-[#111111] leading-snug">
                  "{item.hook}"
                </p>
                {item.hook_english_translation && item.hook_english_translation !== item.hook && (
                  <div className="bg-white/80 border border-neutral-200 rounded-xs p-2 text-xs font-sans text-neutral-600 flex items-start gap-1.5">
                    <span className="font-mono font-bold text-neutral-800 text-[10px] uppercase bg-neutral-100 px-1.5 py-0.5 rounded-xs shrink-0">
                      EN Translation
                    </span>
                    <span className="italic">"{item.hook_english_translation}"</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Rating Widget directly next to each suggested hook */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                {/* Thumbs Up / Down Rating Widget */}
                <div
                  className="flex items-center bg-white border border-[#E2E8F0] rounded-xs p-0.5 shadow-2xs"
                  role="group"
                  aria-label="Rate hook alternative quality"
                >
                  <button
                    onClick={() => handleRateHook(item.hook, "up", item, idx)}
                    className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                      ratings[item.hook] === "up"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50/80"
                    }`}
                    title="Thumbs up: High quality hook (+1 preference for engine refinement)"
                    aria-pressed={ratings[item.hook] === "up"}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${ratings[item.hook] === "up" ? "fill-current text-white" : "text-neutral-500 hover:text-emerald-600"}`} />
                    <span className="hidden xs:inline text-[11px]">{ratings[item.hook] === "up" ? "Helpful" : "Up"}</span>
                  </button>

                  <div className="w-[1px] h-4 bg-[#E2E8F0] mx-0.5" />

                  <button
                    onClick={() => handleRateHook(item.hook, "down", item, idx)}
                    className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                      ratings[item.hook] === "down"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-neutral-600 hover:text-rose-700 hover:bg-rose-50/80"
                    }`}
                    title="Thumbs down: Poor fit / unnatural (-1 preference for engine refinement)"
                    aria-pressed={ratings[item.hook] === "down"}
                  >
                    <ThumbsDown className={`w-3.5 h-3.5 ${ratings[item.hook] === "down" ? "fill-current text-white" : "text-neutral-500 hover:text-rose-600"}`} />
                    <span className="hidden xs:inline text-[11px]">{ratings[item.hook] === "down" ? "Poor Fit" : "Down"}</span>
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(item.hook, idx)}
                  className="bg-white border border-[#E2E8F0] text-[#111111] px-3 py-1.5 text-xs font-bold rounded-xs flex items-center justify-center gap-1.5 hover:border-[#111111] hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
                  title="Copy Native Hook to Clipboard"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Copy Hook</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleRegenerateSingle(idx)}
                  disabled={isRegenerating || regeneratingIdx === idx}
                  className="bg-white border border-[#E2E8F0] text-[#111111] px-3 py-1.5 text-xs font-bold rounded-xs flex items-center justify-center gap-1.5 hover:border-[#111111] hover:bg-neutral-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                  title="Regenerate this specific hook"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#111111] ${regeneratingIdx === idx ? "animate-spin text-emerald-600" : ""}`} />
                  <span>{regeneratingIdx === idx ? "Regenerating..." : "Regenerate"}</span>
                </button>
              </div>
            </div>

            {/* Explanations */}
            <div className="space-y-1.5 border-t border-[#E2E8F0] pt-2.5 text-xs text-[#555555] font-sans">
              {item.content_refinement && (
                <p>
                  <strong className="text-[#111111] font-semibold">Content Connection:</strong> {item.content_refinement}
                </p>
              )}
              {item.rationale && (
                <p>
                  <strong className="text-[#111111] font-semibold">Viral Mechanism:</strong> {item.rationale}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* LLM Master Hook Prompt Modal */}
      {showPromptGuidelineModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#050508] border border-white/20 rounded-md max-w-3xl w-full p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Master Neuro-Virality Hook Prompt
                  </h3>
                  <p className="text-xs font-sans text-neutral-400">
                    Pre-configured cognitive neuroscience prompt ready to paste into ChatGPT, Gemini, or Claude.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPromptGuidelineModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> Ready-To-Use System Prompt
                </span>
                <button
                  onClick={() => copyPromptToClipboard(compactPromptTemplate, "compact")}
                  className="bg-gradient-to-r from-[#00F5D4] to-teal-400 text-black px-4 py-1.5 rounded-xs text-xs font-mono font-bold flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md shadow-[#00F5D4]/20"
                >
                  {copiedPromptType === "compact" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-black/90 border border-white/15 p-4 rounded-xs text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed overflow-x-auto select-all">
                {compactPromptTemplate}
              </pre>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xs p-3 text-xs text-neutral-300 font-sans flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#00F5D4] shrink-0 mt-0.5" />
              <p>
                <strong>Pro-Tip:</strong> You can paste this prompt directly into any LLM with your custom topic or video script to generate 5 high-converting hook archetypes (Loss Aversion, Pattern Interrupt, Curiosity Gap, Tribal Callout, and Warning Trigger).
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPromptGuidelineModal(false)}
                className="px-5 py-2 rounded-xs border border-white/20 bg-white/10 text-white font-mono text-xs font-bold hover:bg-white/20 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



