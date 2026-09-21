import React, { useState } from "react";
import { ViralityAnalysis, ProductPromotionAuditData, ProductPillarSuggestion } from "../types";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Clock,
  Video,
  Volume2,
  Tv,
  Layers,
  Copy,
  Check,
  Zap,
  HelpCircle,
  TrendingUp,
  FileCode2,
  Maximize2
} from "lucide-react";

interface ProductPromotionAuditProps {
  analysis: ViralityAnalysis;
  onApplyHook?: (hookText: string) => void;
}

export const ProductPromotionAudit: React.FC<ProductPromotionAuditProps> = ({
  analysis,
  onApplyHook,
}) => {
  const [selectedPillarTab, setSelectedPillarTab] = useState<number | "all">("all");
  const [copiedFramework, setCopiedFramework] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isForceEnabled, setIsForceEnabled] = useState(false);

  // Check if this video has product promotion data or if user explicitly enabled it
  const audit: ProductPromotionAuditData | undefined = analysis.product_promotion_audit;
  const isDetected = !!(analysis.is_product_promotion || analysis.is_hardselling || audit?.isPromotional || audit?.isHardSelling);
  const shouldShow = isDetected || isForceEnabled;

  const cleanTopic = analysis.inferred_title || analysis.title || "Featured Product";
  const detectedLang = analysis.detected_language || "English";

  // Fallback default pillars if not present in custom audit object
  const defaultPillars: ProductPillarSuggestion[] = [
    {
      pillarNumber: 1,
      pillarTitle: "Introduction Hook & Rhythm Optimization",
      category: "Rhythm & Intro",
      status: audit?.isHardSelling ? "CRITICAL FIX" : "OPTIMIZATION",
      corePrinciple: "Eliminate introductory fluff, greetings, and sales pitches. Accelerate rhythm in 0–5s with zero dead air.",
      diagnosis: audit?.isHardSelling
        ? "Video introduces the product immediately as a commercial, causing viewers to trigger their subconscious ad-skip reflex."
        : "Video opening can be made 30% faster by removing breathing pauses and jumping straight into the visceral problem state.",
      actionableStep: "Cut the first 2 seconds of pleasantries. Replace with an immediate negative hook + punchy on-screen caption super.",
      beforeExample: `“Hi guys! Welcome back, today I want to share this amazing ${cleanTopic} with you...”`,
      afterExample: `“Stop doing this mistake with ${cleanTopic} if you want real results.” [ZOOM-IN + TEXT SUPER]`,
      expectedMetricLift: "+38% 3-Second Hold Rate",
    },
    {
      pillarNumber: 2,
      pillarTitle: "Quality & Feed Compliance (Prevent Algorithmic Suppression)",
      category: "Production Quality",
      status: "OPTIMIZATION",
      corePrinciple: "Ensure 1080x1920 9:16 vertical resolution, stabilized camera, speech clarity (-14 LUFS), and no watermarks or screen-recording artifacts.",
      diagnosis: "Platform algorithms heavily demote videos containing low bitrate, screen jitter, black borders, or muffled audio tracks.",
      actionableStep: "Export cleanly in native 9:16 vertical. Keep voice levels clear over subtle background music and avoid screen-recorded UI clips.",
      beforeExample: "Handheld jittery camera recording a phone screen with low lighting and quiet audio.",
      afterExample: "Native 1080p vertical video, tripod-stabilized close-up demo with crisp normalized voiceover.",
      expectedMetricLift: "Full FYP Reach (Prevents Shadow-Demotion)",
    },
    {
      pillarNumber: 3,
      pillarTitle: "Anti-Hard-Sell Storytelling & Capability Showcasing",
      category: "Storytelling & Showcasing",
      status: audit?.isHardSelling ? "CRITICAL FIX" : "OPTIMIZATION",
      corePrinciple: "Avoid solely focusing on product features. Tell a story highlighting real pain-point relief and demonstrate capabilities in action.",
      diagnosis: audit?.isHardSelling
        ? "Over-indexing on listing specs or discount prices turns the content into an infomercial that viewers immediately swipe past."
        : "The capability demonstration can be strengthened by showing the tangible 'Before vs. After' emotional transformation.",
      actionableStep: "Use the PASP Framework (Problem → Agitate → Solution → Irrefutable Proof). Frame the product as an accidental discovery.",
      beforeExample: `“This ${cleanTopic} has 5 speed modes, lightweight design, and is only $29 today...”`,
      afterExample: `“I was ready to give up on [Frustration] until I tried this 1 step... Look at what happened in 10 seconds.”`,
      expectedMetricLift: "+45% Completion Rate & Organic Saves",
    },
    {
      pillarNumber: 4,
      pillarTitle: "0–3s Climax Preview & Intriguing Questions",
      category: "0-3s Climax/Value",
      status: "CRITICAL FIX",
      corePrinciple: "Preview the climax/end transformation in the first 0–3 seconds or lead with a high-stakes question to slash the swipe rate.",
      diagnosis: "Viewers decide whether to stay or swipe within 1.8 seconds. Hiding the payoff until the end causes 65%+ viewer drop-off.",
      actionableStep: "Flash the finished result in frame 0.0s for 0.8 seconds before cutting back to the problem agitation.",
      beforeExample: "Showing the product packaging slowly opening for the first 4 seconds.",
      afterExample: `“Is this viral ${cleanTopic} actually worth the hype or a complete waste of money?” [Flash 0.5s Climax Result]`,
      expectedMetricLift: "+52% Drop-off Reduction (Sub-2s)",
    },
    {
      pillarNumber: 5,
      pillarTitle: "3-Second Shot Pacing & Multi-Angle B-Roll",
      category: "3s Shot Pacing",
      status: "OPTIMIZATION",
      corePrinciple: "Change shot angle, zoom level, or visual material every 2–3 seconds to maintain Reticular Activating System (RAS) stimulation.",
      diagnosis: "Static talking head shots longer than 3.5 seconds trigger sensory habituation and boredom drop-off.",
      actionableStep: "Alternate between Talking Head → Macro Product Texture → Split-Screen Comparison → On-Screen Dynamic Supers.",
      beforeExample: "Single static front-camera angle talking for 15 seconds uninterrupted.",
      afterExample: "Angle 1 (0-3s Hook) → Angle 2 (3-6s Macro Demo) → Angle 3 (6-9s Side-by-Side Proof) → Angle 4 (9-12s Reaction).",
      expectedMetricLift: "+28% Average Watch Time (AWT)",
    },
  ];

  const rawPillars = audit?.pillars && audit.pillars.length > 0 ? audit.pillars : defaultPillars;
  const pillars: ProductPillarSuggestion[] = rawPillars.map((p: any, idx: number) => ({
    pillarNumber: p.pillarNumber ?? p.pillar_id ?? idx + 1,
    pillarTitle: p.pillarTitle ?? p.title ?? `Pillar ${idx + 1}`,
    category: p.category ?? "Optimization",
    status: (p.status === "critical_issue" || p.status === "CRITICAL FIX") ? "CRITICAL FIX" : (p.status === "needs_improvement" ? "OPTIMIZATION" : (p.status || "OPTIMIZATION")),
    corePrinciple: p.corePrinciple ?? p.user_rule ?? "Follow short-form high retention direct-response best practices.",
    diagnosis: p.diagnosis ?? p.current_critique ?? "Evaluated against TikTok Shop and Meta Reels algorithmic retention signals.",
    actionableStep: p.actionableStep ?? p.actionable_recommendation ?? "Apply high-impact hook, rapid pacing, and tangible transformation proof.",
    beforeExample: p.beforeExample ?? `Overly slow or direct hard-sell introduction for ${cleanTopic}.`,
    afterExample: p.afterExample ?? p.concrete_example ?? `Immediate hook + 0-3s dynamic payoff demonstrating ${cleanTopic}.`,
    expectedMetricLift: p.expectedMetricLift ?? (p.score ? `Score: ${p.score}/100` : "+30% Retention Lift"),
  }));

  const filteredPillars =
    selectedPillarTab === "all"
      ? pillars
      : pillars.filter((p) => p.pillarNumber === selectedPillarTab);

  const productPromptTemplate = `# ROLE: High-Converting Direct-Response Product Ad & E-Commerce UGC Director
You are an elite TikTok Shop and Meta Reels direct-response creative strategist. Re-engineer the following product promotion into a high-retention video script following the 5 Core Conversion Pillars.

### THE 5 CORE PRODUCT OPTIMIZATION PILLARS:
1. PUNCHY INTRO & RHYTHM (0–3s): Cut all greetings/fluff. Start immediately in the middle of the pain point or problem. Zero dead air.
2. PRODUCTION QUALITY & COMPLIANCE: Native 9:16 vertical 1080p, stabilized camera, crisp voiceover (-14 LUFS), zero screen recording or black borders.
3. ANTI-HARD-SELL STORYTELLING (PASP): Frame the product as the solution to a visceral daily struggle rather than reciting specs.
4. 0–3s CLIMAX PREVIEW: Flash the finished transformation/result in frame 0.0s or ask a polarizing high-stakes question.
5. 3-SECOND CUT RHYTHM: Switch visual angles (Talking Head → Macro Demo → Split Screen → Reaction) every 2.5–3.0 seconds.

### PRODUCT / VIDEO CONTEXT:
- Product/Topic: "${cleanTopic}"
- Transcript Context: "${(analysis.verbatim_transcript || analysis.transcript_summary || analysis.description || "").slice(0, 200)}"
- Target Spoken Language: "${detectedLang}"

### DESIRED SCRIPT OUTPUT:
Generate a timestamped 20-30s UGC Video Script with:
- 0:00 - 0:03 [The Climax Hook & Screen Super]
- 0:03 - 0:08 [The Agitation / Struggle Story]
- 0:08 - 0:16 [The Capability Showcase & Macro Action Demo]
- 0:16 - 0:22 [Irrefutable Before/After Proof]
- 0:22 - 0:27 [Frictionless Native Call-To-Action]`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(productPromptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const copyStoryFramework = () => {
    const text = `PASP STORYTELLING FRAMEWORK FOR: ${cleanTopic}
1. Opening Hook (0-3s): ${audit?.storytellingFramework?.openingHook || defaultPillars[3].afterExample}
2. Agitation (3-8s): ${audit?.storytellingFramework?.agitationSegment || "Highlight the everyday frustration that everyone hates."}
3. Capability Demo (8-16s): ${audit?.storytellingFramework?.capabilityDemo || "Show the product in high-definition macro action solving the frustration in seconds."}
4. Irrefutable Proof (16-22s): ${audit?.storytellingFramework?.irrefutableProof || "Side-by-side comparison proving instant results."}
5. Frictionless CTA (22-26s): ${audit?.storytellingFramework?.frictionlessCallToAction || "Check the link below while the current batch is still in stock."}`;
    navigator.clipboard.writeText(text);
    setCopiedFramework(true);
    setTimeout(() => setCopiedFramework(false), 2500);
  };

  return (
    <div id="section-product-promotion" className="space-y-6">
      {/* Banner / Mode Switcher */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black border border-amber-500/30 rounded-xs p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xs shrink-0 mt-0.5">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-xs uppercase tracking-wider">
                  {audit?.isHardSelling ? "🚨 HARD-SELLING DETECTED" : "🛍️ E-COMMERCE & PRODUCT PROMOTION AUDIT"}
                </span>
                <span className="text-xs font-mono text-neutral-300">
                  Direct-Response Algorithm & Quality Verification
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl text-white mt-1">
                5 Golden Pillars of High-Converting Product Videos
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-3xl leading-relaxed">
                Evaluated against official TikTok Shop & Reels algorithm suppression signals. Convert hard-selling pitches into high-retention story-driven showcases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={copyPromptToClipboard}
              className="bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-2 rounded-xs text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <FileCode2 className="w-3.5 h-3.5 text-black" />
                  <span>Export Product Ad Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Commercial Health & Metrics Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="bg-black/40 border border-white/10 p-3 rounded-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Commercial Intrusion</div>
              <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                {audit?.commercialIntrusivenessScore ?? (audit?.isHardSelling ? "High (Needs Softening)" : "Balanced")}
              </div>
            </div>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase">3s Retention Protection</div>
              <div className="text-sm font-mono font-bold text-[#00F5D4] mt-0.5">
                {audit?.retentionProtectionScore ? `${audit.retentionProtectionScore}/100` : "Optimized with 0-3s Climax"}
              </div>
            </div>
            <Zap className="w-4 h-4 text-[#00F5D4]" />
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Shot Pacing Rhythm</div>
              <div className="text-sm font-mono font-bold text-purple-300 mt-0.5">
                Every 2.8s Cut Cycle
              </div>
            </div>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Pillar Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setSelectedPillarTab("all")}
          className={`px-3 py-1.5 rounded-xs font-bold transition-all shrink-0 ${
            selectedPillarTab === "all"
              ? "bg-white text-black shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          View All 5 Pillars
        </button>
        {pillars.map((p, idx) => (
          <button
            key={`pillar-tab-${p.pillarNumber ?? idx}`}
            onClick={() => setSelectedPillarTab(p.pillarNumber)}
            className={`px-3 py-1.5 rounded-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedPillarTab === p.pillarNumber
                ? "bg-amber-400 text-black font-bold"
                : "text-neutral-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
              {p.pillarNumber}
            </span>
            <span>{(p.pillarTitle || "").split(" ")[0] || "Pillar"} {(p.pillarTitle || "").split(" ")[1] || ""}</span>
          </button>
        ))}
      </div>

      {/* Pillars Breakdown Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPillars.map((p, idx) => (
          <div
            key={`pillar-card-${p.pillarNumber ?? idx}`}
            className="cyber-glass border border-white/10 rounded-xs p-5 hover:border-amber-500/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-extrabold text-xs flex items-center justify-center">
                  #{p.pillarNumber}
                </span>
                <h3 className="font-display font-extrabold text-base text-white">
                  {p.pillarTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs uppercase ${
                    p.status === "CRITICAL FIX"
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {p.status}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/20 px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#00F5D4]" />
                  {p.expectedMetricLift}
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Core Principle:</strong> {p.corePrinciple}
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xs p-3 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Algorithmic Diagnosis:</strong> {p.diagnosis}
              </div>
            </div>

            {/* Before vs. After Transformation Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-red-950/20 border border-red-500/20 rounded-xs p-3.5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-red-400 uppercase flex items-center gap-1">
                  <span>❌ Hard-Selling Mistake (High Drop-off)</span>
                </div>
                <p className="text-xs font-sans text-neutral-300 italic">
                  {p.beforeExample}
                </p>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xs p-3.5 space-y-1.5 relative">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <span>✅ Optimized Direct-Response Solution</span>
                </div>
                <p className="text-xs font-sans text-white font-medium">
                  {p.afterExample}
                </p>
                {onApplyHook && p.pillarNumber === 1 && (
                  <button
                    onClick={() => onApplyHook(p.afterExample)}
                    className="mt-2 text-[10px] font-mono font-bold bg-emerald-500 text-black px-2.5 py-1 rounded-xs flex items-center gap-1 hover:brightness-110 transition-all"
                  >
                    <span>Use This Hook In Script</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xs p-3 text-xs text-neutral-300 font-mono flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span><strong className="text-white">Actionable Edit Step:</strong> {p.actionableStep}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Quality & Anti-Suppression Checklist */}
      <div className="cyber-glass border border-white/10 rounded-xs p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xs">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-white">
                Platform Quality & Anti-Suppression Technical Checklist
              </h3>
              <p className="text-xs text-neutral-400">
                Automated computer vision compliance checks to avoid shadow-demotion on TikTok Shop & Reels.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-xs uppercase">
            Passes Quality Filter
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-black/50 border border-white/10 p-3 rounded-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-emerald-400" /> Resolution & Ratio
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-2xs">
                1080x1920 (9:16)
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Native vertical full-screen. No horizontal black letterbox bars or blurry screen recordings.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 p-3 rounded-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Audio Normalization
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-2xs">
                -14 LUFS Vocal
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Clear front-and-center dialogue. Background music docked 12dB lower to prevent muffled audio.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 p-3 rounded-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> Dynamic 3s Cuts
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-2xs">
                B-Roll Every 2-3s
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Alternate talking head with macro close-up demo and before/after split screens to hold attention.
            </p>
          </div>
        </div>
      </div>

      {/* Storytelling Framework (PASP) Deep Dive */}
      <div className="cyber-glass border border-white/10 rounded-xs p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-white">
                Anti-Hard-Sell Storytelling Blueprint (PASP Framework)
              </h3>
              <p className="text-xs text-neutral-400">
                Problem $\rightarrow$ Agitate $\rightarrow$ Solution $\rightarrow$ Irrefutable Proof
              </p>
            </div>
          </div>

          <button
            onClick={copyStoryFramework}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-xs text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            {copiedFramework ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFramework ? "Framework Copied!" : "Copy Full PASP Story"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-black/50 border border-white/10 p-3.5 rounded-xs space-y-2">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              1. 0–3s Problem Hook
            </div>
            <p className="text-xs text-neutral-300">
              Address the exact painful mistake or struggle without mentioning brand name or price upfront.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 p-3.5 rounded-xs space-y-2">
            <div className="text-[10px] font-mono font-bold text-purple-400 uppercase">
              2. 3–8s Agitate Pain
            </div>
            <p className="text-xs text-neutral-300">
              Show how frustrating traditional solutions are and how much time/money was wasted before.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 p-3.5 rounded-xs space-y-2">
            <div className="text-[10px] font-mono font-bold text-[#00F5D4] uppercase">
              3. 8–16s Macro Action Demo
            </div>
            <p className="text-xs text-neutral-300">
              Demonstrate the mechanism of action with macro close-ups, ASMR textures, or 1-touch demo.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 p-3.5 rounded-xs space-y-2">
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
              4. 16–25s Proof & Native CTA
            </div>
            <p className="text-xs text-neutral-300">
              Uncut side-by-side comparison followed by a frictionless link/yellow cart direction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
