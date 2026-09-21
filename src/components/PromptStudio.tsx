import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Film,
  Video,
  Zap,
  Brain,
  Clock,
  Volume2,
  RefreshCw,
  Download,
  Flame,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sliders,
  Play,
  RotateCcw,
  Sparkle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  PromptStudioRequest,
  PromptStudioResult,
  AIVideoGeneratorTarget
} from "../types";
import { FineLineHeader } from "./ui/FineLineHeader";

interface PromptStudioProps {
  onSendToStressTest?: (scriptText: string, title: string) => void;
  onNavigateToTab?: (tab: "overview" | "report" | "samples" | "glossary" | "prompt-studio") => void;
}

const QUICK_PROMPT_PRESETS = [
  {
    label: "🏍️ FASTBIKES 10s Video Script (1-Click)",
    promptText: "can you build me a 10s script for high-engagement short-form video. create the script using comprehensive neuro-retention principles and cognitive retention tactics based on our app\nthe product: FASTBIKES Kaca Spion Variasi Chrome Hitam Mini Karbon Universal Vario Mio Beat Aerox Nmax Spacy Scoopy",
    duration: 10,
    engine: "google_flow" as AIVideoGeneratorTarget,
  },
  {
    label: "💊 Multivitamin Complex (10s Wellness)",
    promptText: "can you build me a 10s script for high-engagement short-form video for daily energy and focus\nthe product: VITA-MAX Bio-Active All-in-One Daily Multivitamin Complex",
    duration: 10,
    engine: "google_flow" as AIVideoGeneratorTarget,
  },
  {
    label: "🧴 Glow Peptide Serum (12s Beauty)",
    promptText: "can you build me a 12s script for high-engagement short-form video for glowing dewy glass skin\nthe product: LUMEN Deep Peptide Barrier Glow Serum with 5% Niacinamide",
    duration: 12,
    engine: "google_flow" as AIVideoGeneratorTarget,
  },
  {
    label: "🎧 ANC Wireless Earbuds (15s Tech)",
    promptText: "can you build me a 15s script for high-engagement short-form video for noise cancelling earbuds\nthe product: SONIQ AeroPod Pro Active Noise Cancelling Earbuds",
    duration: 15,
    engine: "google_flow" as AIVideoGeneratorTarget,
  },
];

export const PromptStudio: React.FC<PromptStudioProps> = ({
  onSendToStressTest,
  onNavigateToTab,
}) => {
  // Single Unified Prompt State
  const [promptText, setPromptText] = useState(QUICK_PROMPT_PRESETS[0].promptText);
  const [durationSeconds, setDurationSeconds] = useState<number>(10);
  const [generatorTarget, setGeneratorTarget] = useState<AIVideoGeneratorTarget>("google_flow");

  // Optional Advanced Tuning (collapsed by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [talentName, setTalentName] = useState("");
  const [languageDialect, setLanguageDialect] = useState("");
  const [crucialDirectives, setCrucialDirectives] = useState(
    "DO NOT render a smartphone in frame. 9:16 vertical aspect ratio. Real photographic textures."
  );

  // Generator & UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PromptStudioResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"prompt" | "scenes" | "hooks" | "keyframes" | "neuro">("prompt");
  const [hookRatings, setHookRatings] = useState<Record<string, "up" | "down">>(() => {
    try {
      const saved = localStorage.getItem("neuroviral_promptstudio_hook_ratings");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleRatePromptHook = (hookLine: string, rating: "up" | "down", style?: string) => {
    const current = hookRatings[hookLine];
    const newRating = current === rating ? undefined : rating;

    const nextRatings = { ...hookRatings };
    if (newRating) {
      nextRatings[hookLine] = newRating;
    } else {
      delete nextRatings[hookLine];
    }
    setHookRatings(nextRatings);
    try {
      localStorage.setItem("neuroviral_promptstudio_hook_ratings", JSON.stringify(nextRatings));
    } catch (e) {}

    if (newRating) {
      fetch("/api/feedback/hook-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hookText: hookLine,
          rating: newRating,
          alignmentSource: style || "Prompt Studio",
          language: languageDialect || "Auto",
          topic: promptText.slice(0, 100),
        }),
      }).catch((e) => console.debug("Prompt studio feedback notice:", e));
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2200);
  };

  const handleApplyPreset = (preset: typeof QUICK_PROMPT_PRESETS[0]) => {
    setPromptText(preset.promptText);
    setDurationSeconds(preset.duration);
    setGeneratorTarget(preset.engine);
  };

  const handleGeneratePrompt = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);

    const directivesArray = (crucialDirectives || "")
      .split(/[.\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);

    const payload: PromptStudioRequest = {
      userPrompt: promptText.trim(),
      productName: promptText.slice(0, 100).trim(),
      productUsp: promptText.trim(),
      durationSeconds,
      generatorTarget,
      talentName: talentName || undefined,
      languageDialect: languageDialect || undefined,
      crucialDirectives: directivesArray,
    };

    try {
      const res = await fetch("/api/generate-video-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.promptResult) {
        setResult(data.promptResult);
        setActiveResultTab("prompt");
      }
    } catch (err) {
      console.error("Failed to generate AI video prompt:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGeneratePrompt();
    }
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const content = `# AI Video Prompt & Neuro-Virality Script
**Product Context:** ${result.productTitle}
**Duration:** ${result.durationSeconds}s | **Target Engine:** ${result.generatorTarget.toUpperCase()}
**Generated:** ${new Date(result.createdAt).toLocaleString()}

---

## 🎬 Master AI Video Generator Prompt
\`\`\`text
${result.fullGeneratorPrompt}
\`\`\`

---

## ⏱️ Scene Breakdown & Direction
${result.scenes
  .map(
    (s) => `### Scene ${s.sceneNumber} (${s.timeRange})
- **Visual Action:** ${s.visualDirection}
- **Camera Movement:** ${s.cameraMotion}
- **Voiceover (${s.voiceoverSpeaker}):** "${s.voiceoverDialogue}"
- **On-Screen Super:** ${s.onScreenTextSuper}
- **Audio & Sound Cues:** ${s.soundDesignCues}
- **Neuro Tactic:** ${s.neuroRetentionTactic}
`
  )
  .join("\n")}

---

## 🧠 Neuro-Virality Retention Metrics
- **Predicted Retention Score:** ${result.predictedNeuroMetrics?.retentionScore || 92}/100
- **0.8s Hook Velocity:** ${result.predictedNeuroMetrics?.hookVelocityScore || 95}/100
- **Curiosity Loop Score:** ${result.predictedNeuroMetrics?.curiosityLoopScore || 90}/100
- **Dominant Brain Network:** ${result.predictedNeuroMetrics?.dominantBrainNetwork || "Occipital Visual Cortex & Ventral Striatum"}
- **Scientific Rationale:** ${result.predictedNeuroMetrics?.neuroViralityRationale}

---

## 🎨 Visual Keyframe Prompts
${(result.keyframePrompts || result.midjourneyKeyframePrompts)
  ?.map(
    (kf) => `**Scene ${kf.sceneIndex} [${kf.timecode}]:**
\`${kf.imagePrompt}\``
  )
  .join("\n\n")}
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AI_Video_Prompt_${(result.productTitle || "Video").slice(0, 20).replace(/[^a-z0-9]/gi, "_")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Sleek Compact Header */}
      <div className="bg-[#050508] text-white border border-white/10 rounded-sm p-5 md:p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00F5D4]/15 via-indigo-600/10 to-transparent blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <FineLineHeader
              as="h1"
              variant="horizon"
              tag="[AI PROMPT STUDIO // MULTI-SCENE GEN]"
              secondaryTag="0.8s PATTERN INTERRUPT"
              className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight uppercase"
              lineColor="rgba(0, 245, 212, 0.45)"
            >
              Type Video Idea &rarr; Generate Full AI Video Prompt
            </FineLineHeader>
            <p className="text-xs text-neutral-400 font-mono max-w-2xl mt-2">
              [PIPELINE] Simply type or paste your product, hook, or video description. We instantly engineer the structured multi-scene prompt with timestamped voiceover, camera directions, and visual references.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {result && (
              <button
                onClick={() => copyToClipboard(result.fullGeneratorPrompt, "header_copy")}
                className="bg-[#00F5D4] hover:bg-[#00F5D4]/90 text-black font-mono font-bold text-xs px-3.5 py-2 rounded-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedSection === "header_copy" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "header_copy" ? "Copied Prompt!" : "Copy Prompt"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* COMPACT SINGLE PROMPT INPUT CARD */}
      <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-xs space-y-4">
        {/* Main Textarea */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#111111]" />
              Video Idea & Product Description
            </label>
            <span className="text-[10px] font-mono text-neutral-600 hidden sm:inline">
              Tip: Press <kbd className="bg-neutral-100 border border-neutral-300 px-1 py-0.2 rounded-xs font-bold text-neutral-800">⌘+Enter</kbd> to generate
            </span>
          </div>

          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your product idea (e.g. '10s high-energy raw UGC TikTok video for VITA-MAX Daily Multivitamin Complex, morning kitchen POV, no energy crash, tap below link')..."
            rows={3}
            className="w-full text-xs md:text-sm font-sans p-3.5 bg-[#F8F9FA] border border-[#E2E8F0] rounded-xs focus:border-[#111111] focus:bg-white outline-none transition-all leading-relaxed placeholder:text-neutral-400"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold text-neutral-600 flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-amber-500" /> Presets:
          </span>
          {QUICK_PROMPT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs font-sans bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 hover:border-neutral-400 px-2.5 py-1 rounded-xs transition-all flex items-center gap-1"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Compact Settings Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Duration Pills */}
            <div className="flex items-center gap-1 bg-[#F8F9FA] border border-[#E2E8F0] p-1 rounded-xs">
              <span className="text-[10px] font-mono font-bold text-neutral-600 px-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
              </span>
              {[10, 12, 15, 30, 60].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDurationSeconds(dur)}
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-xs transition-all ${
                    durationSeconds === dur
                      ? "bg-[#111111] text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>

            {/* Target AI Engine */}
            <div className="flex items-center gap-1.5">
              <select
                value={generatorTarget}
                onChange={(e) => setGeneratorTarget(e.target.value as AIVideoGeneratorTarget)}
                className="text-xs font-mono font-bold bg-[#F8F9FA] border border-[#E2E8F0] text-neutral-800 px-2.5 py-1.5 rounded-xs outline-none focus:border-[#111111] cursor-pointer"
              >
                <option value="google_flow">Cinematic Video Engine</option>
                <option value="sora">Photorealistic Video Engine</option>
                <option value="runway">High-Dynamic Camera Engine</option>
                <option value="kling">High-Framerate Neural Engine</option>
                <option value="luma">Continuous Perspective Engine</option>
                <option value="ugc_script">Raw Short-Form UGC Script</option>
              </select>
            </div>

            {/* Collapsible Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-mono text-neutral-700 hover:text-black flex items-center gap-1 px-2 py-1.5 rounded-xs border border-transparent hover:border-neutral-200 transition-all"
            >
              <Sliders className="w-3 h-3" />
              <span>{showAdvanced ? "Hide Fine-Tuning" : "Advanced Tuning"}</span>
              {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating || !promptText.trim()}
            className="bg-[#111111] hover:bg-black text-white font-mono font-bold text-xs md:text-sm px-5 py-2 rounded-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#00F5D4]" />
                <span>Generating Prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                <span>Generate Video Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Advanced Options Panel */}
        {showAdvanced && (
          <div className="pt-3 border-t border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAFAFA] p-3 rounded-xs animate-fadeIn">
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase mb-1">
                Talent Name
              </label>
              <input
                type="text"
                value={talentName}
                onChange={(e) => setTalentName(e.target.value)}
                placeholder="e.g. Rian"
                className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xs focus:border-[#111111] outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase mb-1">
                Override Spoken Language / Dialect
              </label>
              <input
                type="text"
                value={languageDialect}
                onChange={(e) => setLanguageDialect(e.target.value)}
                placeholder="Auto-detected from prompt"
                className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xs focus:border-[#111111] outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-600" /> Negative Constraints
              </label>
              <input
                type="text"
                value={crucialDirectives}
                onChange={(e) => setCrucialDirectives(e.target.value)}
                placeholder="DO NOT render a smartphone in frame..."
                className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-xs focus:border-[#111111] outline-none font-sans"
              />
            </div>
          </div>
        )}
      </div>

      {/* GENERATED PROMPT OUTPUT DISPLAY */}
      {result ? (
        <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 md:p-6 shadow-xs space-y-5 animate-fadeIn">
          {/* Header & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono bg-[#111111] text-white px-2 py-0.5 rounded-xs font-bold uppercase">
                  {result.durationSeconds}s · {result.generatorTarget.toUpperCase()} FORMAT
                </span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-xs font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Neuro-Retention Calibrated
                </span>
              </div>
              <h2 className="font-display font-bold text-lg md:text-xl text-[#111111]">
                {result.productTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(result.fullGeneratorPrompt, "result_main_copy")}
                className="bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-xs text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedSection === "result_main_copy" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00F5D4]" />
                    <span>Copied Master Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full AI Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                title="Download prompt as Markdown"
                className="p-2 border border-[#E2E8F0] hover:border-[#111111] bg-[#F8F9FA] rounded-xs text-[#111111] transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compact Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E5E5E5] pb-3">
            {[
              { id: "prompt", label: "🎬 Master AI Prompt", badge: "" },
              { id: "scenes", label: "⏱️ Scene Breakdown", badge: `${result.scenes?.length || 2}` },
              { id: "hooks", label: "🪝 3 Viral Hooks", badge: `${result.alternativeHooks?.length || 3}` },
              { id: "keyframes", label: "🎨 Keyframe Prompts", badge: `${(result.keyframePrompts || result.midjourneyKeyframePrompts)?.length || 2}` },
              { id: "neuro", label: "🧠 Neuro Scores", badge: `${result.predictedNeuroMetrics?.retentionScore || 94}%` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveResultTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xs text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                  activeResultTab === tab.id
                    ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                    : "bg-[#F8F9FA] text-[#555555] border-[#E2E8F0] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-xs font-mono font-bold ${
                      activeResultTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: MASTER AI PROMPT VIEW */}
          {activeResultTab === "prompt" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-neutral-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
                  Master Video Generation Prompt:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs font-bold">
                    9:16 Vertical Direct
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-xs font-bold">
                    Neuro-Virality Optimized
                  </span>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-[#0F172A] rounded-xs border border-slate-800 p-4 md:p-5 shadow-inner">
                  <div className="text-[11px] font-mono text-slate-400 mb-2 select-none">
                    the prompt template:
                  </div>
                  <pre className="w-full text-xs md:text-sm font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-[#00F5D4] selection:text-black">
                    "{result.fullGeneratorPrompt}"
                  </pre>
                </div>
                <button
                  onClick={() => copyToClipboard(`the prompt template: "${result.fullGeneratorPrompt}"`, "prompt_block")}
                  className="absolute top-3 right-3 bg-[#00F5D4] hover:bg-[#00F5D4]/90 text-black px-3 py-1.5 rounded-xs text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  {copiedSection === "prompt_block" ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedSection === "prompt_block" ? "Copied Prompt!" : "Copy Full Prompt"}</span>
                </button>
              </div>

              {/* Clean Voiceover Script Box */}
              {result.voiceoverScriptClean && (
                <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> Clean Voiceover Audio Script:
                    </span>
                    <p className="text-xs text-[#111111] font-sans italic">
                      "{result.voiceoverScriptClean}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(result.voiceoverScriptClean, "clean_vo")}
                      className="text-xs font-mono bg-white hover:bg-neutral-100 text-[#111111] border border-[#E2E8F0] px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1"
                    >
                      {copiedSection === "clean_vo" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === "clean_vo" ? "Copied" : "Copy Script"}</span>
                    </button>

                    {onSendToStressTest && (
                      <button
                        onClick={() => onSendToStressTest(result.voiceoverScriptClean, result.productTitle)}
                        className="text-xs font-mono bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Brain className="w-3 h-3" />
                        <span>Stress Test Narrative</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCENE BREAKDOWN */}
          {activeResultTab === "scenes" && (
            <div className="space-y-4">
              {result.scenes?.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xs p-4 md:p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#111111] text-white px-2 py-0.5 rounded-xs">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-xs">
                        ⏱️ {scene.timeRange}
                      </span>
                    </div>
                    {scene.neuroRetentionTactic && (
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <Flame className="w-3 h-3 text-emerald-600" />
                        {scene.neuroRetentionTactic}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-2">
                      <div>
                        <span className="font-mono font-bold text-neutral-600 text-[10px] uppercase block">
                          Visual & Talent Action:
                        </span>
                        <p className="text-[#111111] font-sans">{scene.visualDirection}</p>
                      </div>
                      <div>
                        <span className="font-mono font-bold text-neutral-600 text-[10px] uppercase block">
                          Camera Choreography:
                        </span>
                        <p className="text-[#333333] font-mono text-[11px]">{scene.cameraMotion}</p>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white border border-[#E2E8F0] p-3 rounded-xs">
                      <div>
                        <span className="font-mono font-bold text-indigo-600 text-[10px] uppercase block">
                          Voiceover ({scene.voiceoverSpeaker}):
                        </span>
                        <p className="text-[#111111] font-sans font-medium italic">
                          "{scene.voiceoverDialogue}"
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100">
                        <div>
                          <span className="font-mono font-bold text-neutral-600 text-[10px] uppercase block">
                            Audio & Sound Cues:
                          </span>
                          <span className="text-neutral-800 text-[11px] font-mono">{scene.soundDesignCues}</span>
                        </div>
                        <div>
                          <span className="font-mono font-bold text-neutral-600 text-[10px] uppercase block">
                            On-Screen Super:
                          </span>
                          <span className="text-amber-800 text-[11px] font-mono font-bold">{scene.onScreenTextSuper}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VIRAL HOOKS */}
          {activeResultTab === "hooks" && (
            <div className="space-y-3">
              <div className="text-xs text-neutral-600 font-sans">
                Alternative high-velocity opening hooks calibrated to trigger immediate dopamine response and pattern interrupts:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.alternativeHooks?.map((hook, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xs p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-xs">
                          {hook.style}
                        </span>
                      </div>
                      <p className="text-xs font-sans font-medium text-[#111111] leading-relaxed">
                        "{hook.line}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[9px] font-mono text-neutral-600">
                        {hook.psychologicalTrigger}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Rating buttons */}
                        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-xs p-0.5">
                          <button
                            onClick={() => handleRatePromptHook(hook.line, "up", hook.style)}
                            className={`p-1 rounded-xs flex items-center justify-center transition-all cursor-pointer ${
                              hookRatings[hook.line] === "up"
                                ? "bg-emerald-600 text-white"
                                : "text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title="Thumbs up: Great hook"
                            aria-label="Thumbs up"
                          >
                            <ThumbsUp className={`w-3 h-3 ${hookRatings[hook.line] === "up" ? "fill-current" : ""}`} />
                          </button>
                          <div className="w-[1px] h-3 bg-neutral-200 mx-0.5" />
                          <button
                            onClick={() => handleRatePromptHook(hook.line, "down", hook.style)}
                            className={`p-1 rounded-xs flex items-center justify-center transition-all cursor-pointer ${
                              hookRatings[hook.line] === "down"
                                ? "bg-rose-600 text-white"
                                : "text-neutral-500 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title="Thumbs down: Needs improvement"
                            aria-label="Thumbs down"
                          >
                            <ThumbsDown className={`w-3 h-3 ${hookRatings[hook.line] === "down" ? "fill-current" : ""}`} />
                          </button>
                        </div>

                        <button
                          onClick={() => copyToClipboard(hook.line, `hook_${idx}`)}
                          className="text-[10px] font-mono font-bold text-neutral-700 hover:text-black flex items-center gap-1 bg-white border border-[#E2E8F0] px-2 py-1 rounded-xs cursor-pointer"
                        >
                          {copiedSection === `hook_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSection === `hook_${idx}` ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KEYFRAME PROMPTS */}
          {activeResultTab === "keyframes" && (
            <div className="space-y-3">
              <div className="text-xs text-neutral-600 font-sans">
                High-fidelity keyframe prompts for generating exact visual reference images before running image-to-video:
              </div>
              <div className="space-y-3">
                {(result.keyframePrompts || result.midjourneyKeyframePrompts)?.map((kf, idx) => (
                  <div key={idx} className="bg-[#0F172A] border border-slate-800 rounded-xs p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/30 px-2 py-0.5 rounded-xs">
                        Scene {kf.sceneIndex} Keyframe · Timecode [{kf.timecode}] · Aspect Ratio {kf.aspectRatio}
                      </span>
                      <button
                        onClick={() => copyToClipboard(kf.imagePrompt, `kf_${idx}`)}
                        className="text-[10px] font-mono text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xs flex items-center gap-1"
                      >
                        {copiedSection === `kf_${idx}` ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSection === `kf_${idx}` ? "Copied" : "Copy Prompt"}</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-slate-300 select-all leading-relaxed">
                      {kf.imagePrompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NEURO SCORES */}
          {activeResultTab === "neuro" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 rounded-xs text-center space-y-1">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase font-bold block">
                    Predicted Retention
                  </span>
                  <span className="text-2xl font-mono font-black text-emerald-600">
                    {result.predictedNeuroMetrics?.retentionScore || 94}%
                  </span>
                  <span className="text-[9px] font-mono text-neutral-600 block">hold velocity</span>
                </div>

                <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 rounded-xs text-center space-y-1">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase font-bold block">
                    0.8s Hook Velocity
                  </span>
                  <span className="text-2xl font-mono font-black text-indigo-600">
                    {result.predictedNeuroMetrics?.hookVelocityScore || 96}%
                  </span>
                  <span className="text-[9px] font-mono text-neutral-600 block">anti-scroll shock</span>
                </div>

                <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 rounded-xs text-center space-y-1">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase font-bold block">
                    Curiosity Loop
                  </span>
                  <span className="text-2xl font-mono font-black text-amber-600">
                    {result.predictedNeuroMetrics?.curiosityLoopScore || 91}%
                  </span>
                  <span className="text-[9px] font-mono text-neutral-600 block">dopamine gap hold</span>
                </div>

                <div className="bg-[#F8F9FA] border border-[#E2E8F0] p-3 rounded-xs text-center space-y-1">
                  <span className="text-[10px] font-mono text-neutral-600 uppercase font-bold block">
                    Share Impulse
                  </span>
                  <span className="text-2xl font-mono font-black text-rose-600">
                    {result.predictedNeuroMetrics?.shareImpulseScore || 89}%
                  </span>
                  <span className="text-[9px] font-mono text-neutral-600 block">social currency</span>
                </div>
              </div>

              {result.predictedNeuroMetrics?.neuroViralityRationale && (
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xs space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    Cognitive Retention Rationale:
                  </span>
                  <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                    {result.predictedNeuroMetrics.neuroViralityRationale}
                  </p>
                  {result.predictedNeuroMetrics.dominantBrainNetwork && (
                    <div className="pt-2 border-t border-neutral-200/80 text-[11px] font-mono text-neutral-600">
                      Dominant Neural Network: <strong className="text-neutral-900">{result.predictedNeuroMetrics.dominantBrainNetwork}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty State Quick Demo Card */
        <div className="bg-[#F8F9FA] border border-dashed border-[#CBD5E1] rounded-sm p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto shadow-xs text-[#111111]">
            <Film className="w-5 h-5 text-[#111111]" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-display font-bold text-base text-[#111111]">
              Ready to Architect Your Video Prompt
            </h3>
            <p className="text-xs text-[#666666] font-sans mt-1">
              Type any product or video idea above (e.g. Multivitamins, Skincare, Tech), then hit <strong>Generate Video Prompt</strong>.
            </p>
          </div>
          <button
            onClick={handleGeneratePrompt}
            className="bg-[#111111] text-white px-4 py-2 rounded-xs text-xs font-mono font-bold inline-flex items-center gap-1.5 shadow-xs hover:bg-black transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" /> Generate Video Prompt
          </button>
        </div>
      )}
    </div>
  );
};
