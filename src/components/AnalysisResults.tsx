import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ViralityAnalysis, BrainRegionKey, VideoKeyframe, ViralBenchmark } from "../types";
import { ViralityScore } from "./ViralityScore";
import { CoreMetrics } from "./CoreMetrics";
import { BrainMap3D } from "./BrainMap3D";
import { SpatialRetention3D } from "./SpatialRetention3D";
import { RetentionCurve } from "./RetentionCurve";
import { PlatformScores } from "./PlatformScores";
import { FactorBreakdown } from "./FactorBreakdown";
import { StrategicSection } from "./StrategicSection";
import { HookRewriter } from "./HookRewriter";
import { KeyframeBreakdown } from "./KeyframeBreakdown";
import { KeyframeInsightModal } from "./KeyframeInsightModal";
import { PlatformBestPractices } from "./PlatformBestPractices";
import { ViralTrendsRadar } from "./ViralTrendsRadar";
import { ViralBenchmarkSection } from "./ViralBenchmarkSection";
import { NarrativeStressTestSection } from "./NarrativeStressTestSection";
import { ProductPromotionAudit } from "./ProductPromotionAudit";
import { ShareModal } from "./ShareModal";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { ViewGrowthForecast } from "./ViewGrowthForecast";
import { MiniVideoPlayer, parseTimestampToSeconds } from "./MiniVideoPlayer";
import {
  Sparkles,
  Film,
  ArrowUpRight,
  Camera,
  RefreshCw,
  Share2,
  Brain,
  TrendingUp,
  Sliders,
  Zap,
  Globe,
  Radio,
  BarChart2,
  Compass,
  Activity,
  Award,
  BrainCircuit,
  ShieldAlert,
  Play,
  ShoppingBag,
  Printer,
  Copy,
  Check
} from "lucide-react";

interface AnalysisResultsProps {
  analysis: ViralityAnalysis;
  onRunReAnalysisPass?: () => void;
  onSelectBenchmarkForReAnalysis?: (benchmark: ViralBenchmark) => void;
  isReAnalyzing?: boolean;
  selectedLanguage?: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  onRunReAnalysisPass,
  onSelectBenchmarkForReAnalysis,
  isReAnalyzing,
  selectedLanguage,
}) => {
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedInsightRegion, setSelectedInsightRegion] = useState<BrainRegionKey | null>(null);
  const [selectedInsightKeyframe, setSelectedInsightKeyframe] = useState<VideoKeyframe | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "cognitive" | "drivers" | "strategy" | "benchmarks" | "stress-test" | "product-audit" | "all">("overview");
  const [activeNavSection, setActiveNavSection] = useState<string>("section-score");
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [copiedSummaryToast, setCopiedSummaryToast] = useState(false);

  const handleCopySummary = () => {
    const title = analysis.inferred_title || analysis.title || "Video Analysis";
    const score = Math.round(analysis.virality_score);
    const tier = analysis.virality_tier || "High Virality";
    const summary = analysis.executive_summary || "Multimodal fMRI virality evaluation complete.";
    const recommendation = analysis.top_recommendation || "Optimize opening 1-3 seconds.";
    const text = `🚀 NeuroViral Intelligence Report: "${title}"\n• Virality Score: ${score}/100 (${tier})\n• Executive Summary: ${summary}\n• Top Strategic Recommendation: ${recommendation}`;
    navigator.clipboard.writeText(text);
    setCopiedSummaryToast(true);
    setTimeout(() => setCopiedSummaryToast(false), 2500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  useEffect(() => {
    if (activeTab !== "all") return;

    const sectionIds = [
      "section-score",
      "section-executive-summary",
      "section-product-promotion",
      "section-narrative-stress-test",
      "section-viral-benchmarks",
      "section-brain-map",
      "section-viral-forecast",
      "section-view-growth",
      "section-key-metrics",
      "section-keyframes",
      "section-strategy-hooks",
      "section-platform-practices",
      "section-trends-intelligence",
      "section-factors",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveNavSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    setActiveNavSection(id);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!analysis) return null;

  const handleOpenRegionInsight = (regionKey?: BrainRegionKey) => {
    setSelectedInsightRegion(regionKey || "prefrontal");
    setSelectedInsightKeyframe(null);
    setIsInsightModalOpen(true);
  };

  const handleOpenKeyframeInsight = (keyframe: VideoKeyframe) => {
    setSelectedInsightKeyframe(keyframe);
    setSelectedInsightRegion(null);
    setIsInsightModalOpen(true);
    const sec = parseTimestampToSeconds(keyframe.timeInSeconds ?? keyframe.timestamp);
    setSeekTime(sec);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Top Header & Executive Metadata Bar */}
      <div className="studio-panel border border-white/10 p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xl studio-crosshair relative">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white text-black shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold bg-white text-black px-2 py-0.5 uppercase tracking-wider">
                [INTELLIGENCE DOSSIER]
              </span>
              <span className="text-xs font-mono font-bold text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5">
                95% CI Range: [{analysis.virality_score_range ? `${analysis.virality_score_range[0]} – ${analysis.virality_score_range[1]}` : `${analysis.confidence_interval?.lower ?? Math.round(analysis.virality_score - 2)} – ${analysis.confidence_interval?.upper ?? Math.round(analysis.virality_score + 2)}`}]
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                {analysis.detected_language || "English"} ({analysis.language_confidence ?? 98}%)
              </span>
              {analysis.is_non_english && (
                <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5">
                  Non-English Virality Mode
                </span>
              )}
              <span className="text-xs font-mono text-neutral-400 hidden lg:inline">
                TRIBE_fMRI_MODEL_V2 • GEMINI_3.8
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-1 tracking-tight">
              {analysis.inferred_title || analysis.title || "Video Analysis Report"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onRunReAnalysisPass && (
            <button
              onClick={onRunReAnalysisPass}
              disabled={isReAnalyzing}
              className="bg-white/5 border border-white/15 hover:bg-white hover:text-black text-white px-3.5 py-2 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              title="Re-analyze this clip to produce a multi-pass empirical confidence interval range"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReAnalyzing ? "animate-spin text-[#00F5D4]" : "text-[#00F5D4]"}`} />
              <span>{isReAnalyzing ? "Running Pass..." : `RE-ANALYZE (PASS #${(analysis.analysis_pass_count || 1) + 1})`}</span>
            </button>
          )}

          {analysis.keyframes && analysis.keyframes.length > 0 && (
            <button
              onClick={() => handleOpenRegionInsight("prefrontal")}
              className="bg-white/5 border border-white/15 hover:bg-white hover:text-black text-white px-3.5 py-2 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>KEYFRAMES</span>
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="bg-white/5 border border-white/15 hover:bg-white hover:text-black text-white px-3 py-2 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy Executive Summary to Clipboard"
          >
            {copiedSummaryToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>COPY SUMMARY</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrintReport}
            className="bg-white/5 border border-white/15 hover:bg-white hover:text-black text-white px-3 py-2 text-xs font-mono font-bold flex items-center gap-1.5 transition-all hidden sm:flex cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / PDF</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="studio-btn-primary px-4 py-2 text-xs font-mono font-bold tracking-wider cursor-pointer"
          >
            <Share2 className="w-4 h-4 fill-current" />
            <span>SHARE REPORT →</span>
          </button>
        </div>
      </div>

      {/* Main Analytics View Tabs Navigation Bar */}
      <div className="studio-panel border border-white/10 p-2 flex flex-wrap items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-mono w-full">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "overview"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [01] Overview
          </button>

          <button
            onClick={() => setActiveTab("cognitive")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "cognitive"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [02] Cognitive & Keyframes
          </button>

          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "drivers"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [03] Algorithmic Drivers
          </button>

          <button
            onClick={() => setActiveTab("strategy")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "strategy"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [04] Platform Strategy
          </button>

          <button
            onClick={() => setActiveTab("benchmarks")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "benchmarks"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [05] Viral DNA
          </button>

          <button
            id="tab-btn-stress-test"
            onClick={() => setActiveTab("stress-test")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "stress-test"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [06] Stress Test
          </button>

          <button
            id="tab-btn-product-audit"
            onClick={() => setActiveTab("product-audit")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "product-audit"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [07] Product Audit
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 transition-all shrink-0 font-bold ${
              activeTab === "all"
                ? "bg-[#00F5D4] text-black"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            [08] Complete Dossier
          </button>
        </div>

        <div className="text-[11px] font-mono text-neutral-400 hidden xl:flex items-center gap-2 pr-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>Select tab to focus metrics</span>
        </div>
      </div>

      {/* Optional Sticky Jump Anchor Bar for "All-in-One View" */}
      {activeTab === "all" && (
        <div className="sticky top-3 z-30 cyber-glass border border-white/10 rounded-xs p-2 shadow-xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 pl-2 pr-3 border-r border-white/10">
            <Compass className="w-4 h-4 text-[#00F5D4] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white hidden sm:inline">
              QUICK JUMP
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-mono">
            <button
              onClick={() => scrollToSection("section-score")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-score"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Score & Player</span>
            </button>

            <button
              onClick={() => scrollToSection("section-executive-summary")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-executive-summary"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>Executive Summary</span>
            </button>

            <button
              onClick={() => scrollToSection("section-product-promotion")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-product-promotion"
                  ? "bg-amber-400 text-black font-bold"
                  : "text-amber-300 hover:text-white hover:bg-amber-500/10"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>🛍️ Product Audit</span>
            </button>

            <button
              onClick={() => scrollToSection("section-narrative-stress-test")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-narrative-stress-test"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-violet-400" />
              <span>Stress Test (5s)</span>
            </button>

            <button
              onClick={() => scrollToSection("section-viral-benchmarks")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-viral-benchmarks"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Viral Benchmarks</span>
            </button>

            <button
              onClick={() => scrollToSection("section-brain-map")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-brain-map"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-pink-400" />
              <span>Brain Map</span>
            </button>

            <button
              onClick={() => scrollToSection("section-viral-forecast")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-viral-forecast"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Viral Forecast</span>
            </button>

            <button
              onClick={() => scrollToSection("section-view-growth")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-view-growth"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span>7-Day View Growth</span>
            </button>

            <button
              onClick={() => scrollToSection("section-key-metrics")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-key-metrics"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Drivers</span>
            </button>

            {analysis.keyframes && analysis.keyframes.length > 0 && (
              <button
                onClick={() => scrollToSection("section-keyframes")}
                className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                  activeNavSection === "section-keyframes"
                    ? "bg-[#00F5D4] text-black font-bold"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Keyframes</span>
              </button>
            )}

            <button
              onClick={() => scrollToSection("section-strategy-hooks")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-strategy-hooks"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Strategy & Hooks</span>
            </button>

            <button
              onClick={() => scrollToSection("section-platform-practices")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-platform-practices"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Best Practices</span>
            </button>

            <button
              onClick={() => scrollToSection("section-trends-intelligence")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-trends-intelligence"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Trends Radar</span>
            </button>

            <button
              onClick={() => scrollToSection("section-factors")}
              className={`px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 transition-all shrink-0 font-semibold ${
                activeNavSection === "section-factors"
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Behavioral Factors</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Multilingual Intelligence & Dialect Detection Banner */}
          <div className="cyber-glass border border-emerald-500/20 bg-emerald-950/20 rounded-xs p-5 md:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-emerald-400 text-black px-2.5 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    MULTILINGUAL VIRALITY ENGINE
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-xs">
                    Language: <span className="text-emerald-300 font-bold">{analysis.detected_language || "English"}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-xs">
                    Detection Confidence: {analysis.language_confidence ?? 98}%
                  </span>
                  {analysis.is_non_english && (
                    <span className="text-xs font-mono font-bold text-purple-300 bg-purple-900/50 border border-purple-400/30 px-2.5 py-0.5 rounded-xs">
                      ⚡ Non-English High Engagement Pattern
                    </span>
                  )}
                </div>

                <div className="text-sm font-sans text-neutral-200 leading-relaxed max-w-4xl">
                  {analysis.language_notes || (
                    analysis.is_non_english
                      ? `Native ${analysis.detected_language} colloquial cadence detected. Local dialect markers and cultural cues produce higher algorithm hold rates and organic peer shares in regional FYP feeds.`
                      : "Standard high-energy social video dialogue format optimized for global and regional short-form feeds."
                  )}
                </div>

                {analysis.localized_market_fit && (
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 pt-1">
                    <span className="text-neutral-400 font-bold">🎯 Optimal Market Fit:</span>
                    <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-xs border border-emerald-500/30">
                      {analysis.localized_market_fit}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab("strategy")}
                className="bg-emerald-400 hover:bg-emerald-300 text-black px-4 py-2 text-xs font-mono font-bold rounded-xs flex items-center gap-2 transition-all shadow-md shrink-0 self-start md:self-center"
              >
                <span>View Native Hooks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Top Row: Core Virality Score & Mini Player (Col-4) + Viral Forecast / Retention (Col-8) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ViralityScore
                score={analysis.virality_score}
                tier={analysis.virality_tier}
                title={analysis.title}
                confidenceInterval={analysis.confidence_interval}
                confidenceIntervalPercentage={analysis.confidence_interval_percentage}
                scoreRange={analysis.virality_score_range}
                historicalRuns={analysis.historical_runs}
                passCount={analysis.analysis_pass_count}
              />

              <MiniVideoPlayer
                videoUrl={analysis.video_url}
                title={analysis.title}
                keyframes={analysis.keyframes}
                videoDurationSeconds={30}
                seekTime={seekTime}
                onKeyframeClick={(kf) => {
                  const sec = parseTimestampToSeconds(kf.timeInSeconds ?? kf.timestamp);
                  setSeekTime(sec);
                }}
              />
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              <PlatformScores scores={analysis.platform_scores} />
              
              <RetentionCurve
                curve={analysis.retention_curve}
                keyframes={analysis.keyframes}
                videoDurationSeconds={30}
                onOpenKeyframeInsight={handleOpenKeyframeInsight}
                onSeekToKeyframe={(timeSec) => setSeekTime(timeSec)}
              />
            </div>
          </div>

          {/* 7-Day Projected View Growth Forecast */}
          <ViewGrowthForecast analysis={analysis} />

          {/* Middle Row: Executive Summary (3-Sentence High-Level Prediction) */}
          <ExecutiveSummary
            analysis={analysis}
            onSummaryUpdated={(newSummary) => {
              analysis.executive_summary = newSummary;
            }}
          />

          {/* 🛍️ Direct-Response Product Promotion & Hard-Selling Optimization Audit */}
          <ProductPromotionAudit analysis={analysis} />

          {/* Narrative Stress Test & 5-Second Audience Persona Simulation */}
          <NarrativeStressTestSection analysis={analysis} />

          {/* Proven Viral Benchmark Comparison & DNA Transfer Engine */}
          <ViralBenchmarkSection
            analysis={analysis}
            onSelectBenchmarkForReAnalysis={onSelectBenchmarkForReAnalysis}
            isReAnalyzing={isReAnalyzing}
          />

          {/* Bottom Row: Strategic Recommendations & AI Hook Alternatives */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 flex flex-col">
              <StrategicSection
                hookAnalysis={analysis.hook_analysis}
                emotionalArc={analysis.emotional_arc}
                emotionalValence={analysis.emotional_valence}
                topRecommendation={analysis.top_recommendation}
              />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <HookRewriter
                hooks={analysis.hook_alternatives}
                analysis={analysis}
                selectedLanguage={selectedLanguage}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COGNITIVE & KEYFRAMES */}
      {activeTab === "cognitive" && (
        <div className="space-y-6 animate-fadeIn">
          <BrainMap3D
            activations={analysis.brain_regions}
            analysis={analysis}
            onOpenKeyframeInsight={handleOpenRegionInsight}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                <h3 className="font-display font-bold text-lg text-white">
                  Spatiotemporal Retention Rollercoaster
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Interactive 3D Timeline Fly-Through
              </span>
            </div>
            <SpatialRetention3D
              curve={analysis.retention_curve}
              keyframes={analysis.keyframes}
              videoDurationSeconds={30}
              onOpenKeyframeInsight={handleOpenKeyframeInsight}
              onSeekToKeyframe={(timeSec) => setSeekTime(timeSec)}
            />
          </div>

          {analysis.keyframes && analysis.keyframes.length > 0 && (
            <KeyframeBreakdown
              keyframes={analysis.keyframes}
              onOpenKeyframeInsight={handleOpenKeyframeInsight}
              onSeekToKeyframe={(timeSec) => setSeekTime(timeSec)}
            />
          )}
        </div>
      )}

      {/* TAB 3: ALGORITHMIC DRIVERS */}
      {activeTab === "drivers" && (
        <div className="space-y-6 animate-fadeIn">
          <CoreMetrics
            hookScore={analysis.hook_score}
            holdRate={analysis.hold_rate}
            shareVelocity={analysis.share_velocity}
            retentionScore={analysis.retention_score}
            emotionArousal={analysis.emotion_arousal}
            noveltyIndex={analysis.novelty_index}
            clarityScore={analysis.clarity_score}
            pacingScore={analysis.pacing_score}
            audioEngagement={analysis.audio_engagement}
            visualDensity={analysis.visual_density}
          />

          <FactorBreakdown factors={analysis.factors} />
        </div>
      )}

      {/* TAB 4: PLATFORM STRATEGY */}
      {activeTab === "strategy" && (
        <div className="space-y-6 animate-fadeIn">
          <ViewGrowthForecast analysis={analysis} />
          <PlatformBestPractices analysis={analysis} />
          <ViralTrendsRadar initialTopic={analysis.title || analysis.description || "Short-form video"} />
        </div>
      )}

      {/* TAB 5: VIRAL BENCHMARKS & DNA */}
      {activeTab === "benchmarks" && (
        <div className="space-y-6 animate-fadeIn">
          <ViralBenchmarkSection
            analysis={analysis}
            onSelectBenchmarkForReAnalysis={onSelectBenchmarkForReAnalysis}
            isReAnalyzing={isReAnalyzing}
          />
        </div>
      )}

      {/* TAB 6: NARRATIVE STRESS TEST (5s INTERVAL SIMULATION) */}
      {activeTab === "stress-test" && (
        <div className="space-y-6 animate-fadeIn">
          <NarrativeStressTestSection analysis={analysis} />
        </div>
      )}

      {/* TAB 7: DIRECT-RESPONSE PRODUCT & HARD-SELL AUDIT */}
      {activeTab === "product-audit" && (
        <div className="space-y-6 animate-fadeIn">
          <ProductPromotionAudit analysis={analysis} />
        </div>
      )}

      {/* TAB 8: ALL-IN-ONE VIEW */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
          {/* Multilingual Intelligence Banner (col-span-12) */}
          <div className="col-span-12 cyber-glass border border-emerald-500/20 bg-emerald-950/20 rounded-xs p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-emerald-400 text-black px-2.5 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    MULTILINGUAL VIRALITY ENGINE
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-xs">
                    Language: <span className="text-emerald-300 font-bold">{analysis.detected_language || "English"}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-xs">
                    Detection Confidence: {analysis.language_confidence ?? 98}%
                  </span>
                  {analysis.is_non_english && (
                    <span className="text-xs font-mono font-bold text-purple-300 bg-purple-900/50 border border-purple-400/30 px-2.5 py-0.5 rounded-xs">
                      ⚡ Non-English Virality Active
                    </span>
                  )}
                </div>
                <p className="text-xs font-sans text-neutral-200">
                  {analysis.language_notes || `Video dialect detected with ${analysis.language_confidence ?? 98}% confidence. Hooks and algorithmic pacing are tailored to native ${analysis.detected_language} viral patterns.`}
                </p>
                {analysis.localized_market_fit && (
                  <p className="text-xs font-mono text-emerald-300">
                    🎯 Target Market Fit: {analysis.localized_market_fit}
                  </p>
                )}
              </div>
              <button
                onClick={() => scrollToSection("section-strategy-hooks")}
                className="bg-emerald-400 hover:bg-emerald-300 text-black px-3.5 py-2 text-xs font-mono font-bold rounded-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 self-start sm:self-center"
              >
                <span>Jump to Native Hooks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Cell 1: Core Virality Score & Mini Video Player (col-span-12 lg:col-span-4) */}
          <div id="section-score" className="col-span-12 lg:col-span-4 flex flex-col gap-6 scroll-mt-24">
            <ViralityScore
              score={analysis.virality_score}
              tier={analysis.virality_tier}
              title={analysis.title}
              confidenceInterval={analysis.confidence_interval}
              confidenceIntervalPercentage={analysis.confidence_interval_percentage}
              scoreRange={analysis.virality_score_range}
              historicalRuns={analysis.historical_runs}
              passCount={analysis.analysis_pass_count}
            />

            <MiniVideoPlayer
              videoUrl={analysis.video_url}
              title={analysis.title}
              keyframes={analysis.keyframes}
              videoDurationSeconds={30}
              seekTime={seekTime}
              onKeyframeClick={(kf) => {
                const sec = parseTimestampToSeconds(kf.timeInSeconds ?? kf.timestamp);
                setSeekTime(sec);
              }}
            />
          </div>

          {/* Bento Cell 1B: Executive Summary (3-Sentence High-Level Prediction) (col-span-12) */}
          <div id="section-executive-summary" className="col-span-12 scroll-mt-24">
            <ExecutiveSummary
              analysis={analysis}
              onSummaryUpdated={(newSummary) => {
                analysis.executive_summary = newSummary;
              }}
            />
          </div>

          {/* Bento Cell 1B2: 🛍️ Direct-Response Product Promotion & Hard-Selling Optimization Audit (col-span-12) */}
          <div id="section-product-promotion" className="col-span-12 scroll-mt-24">
            <ProductPromotionAudit analysis={analysis} />
          </div>

          {/* Bento Cell 1C: Narrative Stress Test & 5s Interval Persona Simulation (col-span-12) */}
          <div id="section-narrative-stress-test" className="col-span-12 scroll-mt-24">
            <NarrativeStressTestSection analysis={analysis} />
          </div>

          {/* Bento Cell 1D: Proven Viral Benchmark Comparison & DNA (col-span-12) */}
          <div id="section-viral-benchmarks" className="col-span-12 scroll-mt-24">
            <ViralBenchmarkSection
              analysis={analysis}
              onSelectBenchmarkForReAnalysis={onSelectBenchmarkForReAnalysis}
              isReAnalyzing={isReAnalyzing}
            />
          </div>

          {/* Bento Cell 2: 3D Brain Activation Map (col-span-12 lg:col-span-8) */}
          <div id="section-brain-map" className="col-span-12 lg:col-span-8 flex flex-col scroll-mt-24">
            <BrainMap3D
              activations={analysis.brain_regions}
              analysis={analysis}
              onOpenKeyframeInsight={handleOpenRegionInsight}
            />
          </div>

          {/* Bento Cell 3 & 4: Viral Forecast (Platform Predictions & Retention Curve) */}
          <div id="section-viral-forecast" className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 scroll-mt-24">
            <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col">
              <PlatformScores scores={analysis.platform_scores} />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col">
              <RetentionCurve
                curve={analysis.retention_curve}
                keyframes={analysis.keyframes}
                videoDurationSeconds={30}
                onOpenKeyframeInsight={handleOpenKeyframeInsight}
                onSeekToKeyframe={(timeSec) => setSeekTime(timeSec)}
              />
            </div>
          </div>

          {/* Bento Cell 4B: 7-Day Projected View Growth Forecast (col-span-12) */}
          <div id="section-view-growth" className="col-span-12 scroll-mt-24">
            <ViewGrowthForecast analysis={analysis} />
          </div>

          {/* Bento Cell 5: Core Drivers & Expanded Metrics (col-span-12) */}
          <div id="section-key-metrics" className="col-span-12 scroll-mt-24">
            <CoreMetrics
              hookScore={analysis.hook_score}
              holdRate={analysis.hold_rate}
              shareVelocity={analysis.share_velocity}
              retentionScore={analysis.retention_score}
              emotionArousal={analysis.emotion_arousal}
              noveltyIndex={analysis.novelty_index}
              clarityScore={analysis.clarity_score}
              pacingScore={analysis.pacing_score}
              audioEngagement={analysis.audio_engagement}
              visualDensity={analysis.visual_density}
            />
          </div>

          {/* Bento Cell 5B: Multimodal Keyframe Screenshot Analysis */}
          {analysis.keyframes && analysis.keyframes.length > 0 && (
            <div id="section-keyframes" className="col-span-12 scroll-mt-24">
              <KeyframeBreakdown
                keyframes={analysis.keyframes}
                onOpenKeyframeInsight={handleOpenKeyframeInsight}
                onSeekToKeyframe={(timeSec) => setSeekTime(timeSec)}
              />
            </div>
          )}

          {/* Bento Cell 6 & 7: Strategy & Hooks (Strategic Recommendation & AI Hook Rewriter) */}
          <div id="section-strategy-hooks" className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
            <div className="col-span-12 lg:col-span-6 flex flex-col">
              <StrategicSection
                hookAnalysis={analysis.hook_analysis}
                emotionalArc={analysis.emotional_arc}
                emotionalValence={analysis.emotional_valence}
                topRecommendation={analysis.top_recommendation}
              />
            </div>
            <div className="col-span-12 lg:col-span-6 flex flex-col">
              <HookRewriter
                hooks={analysis.hook_alternatives}
                analysis={analysis}
                selectedLanguage={selectedLanguage}
              />
            </div>
          </div>

          {/* Bento Cell 7B: Platform Best Practices (TikTok vs Instagram) */}
          <div id="section-platform-practices" className="col-span-12 scroll-mt-24">
            <PlatformBestPractices analysis={analysis} />
          </div>

          {/* Bento Cell 7C: Real-Time Viral Trends Radar */}
          <div id="section-trends-intelligence" className="col-span-12 scroll-mt-24">
            <ViralTrendsRadar initialTopic={analysis.title || analysis.description || "Short-form video"} />
          </div>

          {/* Bento Cell 8: Behavioral Factors Breakdown (col-span-12) */}
          <div id="section-factors" className="col-span-12 scroll-mt-24">
            <FactorBreakdown factors={analysis.factors} />
          </div>
        </div>
      )}

      {/* Keyframe Insight Overlay Modal */}
      <KeyframeInsightModal
        analysis={analysis}
        isOpen={isInsightModalOpen}
        onClose={() => setIsInsightModalOpen(false)}
        initialKeyframe={selectedInsightKeyframe}
        initialRegionKey={selectedInsightRegion}
        onSeekToKeyframe={(timeSec) => setSeekTime(timeSec)}
      />

      {/* Share Report Modal */}
      <ShareModal
        analysis={analysis}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </motion.div>
  );
};
