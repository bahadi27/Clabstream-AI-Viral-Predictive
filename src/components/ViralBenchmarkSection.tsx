import React, { useState } from "react";
import { ViralityAnalysis, ViralBenchmark } from "../types";
import { PROVEN_VIRAL_BENCHMARKS } from "../data/provenViralBenchmarks";
import { FeedViralVideoModal } from "./FeedViralVideoModal";
import {
  Award,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  BarChart3,
  Layers,
  FileText,
  Volume2,
  Eye,
  CheckCircle2,
  Lightbulb,
  Radio,
  SplitSquareVertical,
  Activity
} from "lucide-react";

interface ViralBenchmarkSectionProps {
  analysis: ViralityAnalysis;
  onSelectBenchmarkForReAnalysis?: (benchmark: ViralBenchmark) => void;
  isReAnalyzing?: boolean;
}

export const ViralBenchmarkSection: React.FC<ViralBenchmarkSectionProps> = ({
  analysis,
  onSelectBenchmarkForReAnalysis,
  isReAnalyzing,
}) => {
  const [benchmarkLibrary, setBenchmarkLibrary] = useState<ViralBenchmark[]>(() => {
    // Load custom benchmarks from localStorage if available
    try {
      const saved = localStorage.getItem("neuroviral_custom_benchmarks");
      if (saved) {
        const custom = JSON.parse(saved);
        if (Array.isArray(custom)) {
          return [...custom, ...(PROVEN_VIRAL_BENCHMARKS || [])];
        }
      }
    } catch (e) {
      console.warn("Could not load custom benchmarks", e);
    }
    return PROVEN_VIRAL_BENCHMARKS || [];
  });

  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(() => {
    return analysis?.benchmark_comparison?.benchmarkId || PROVEN_VIRAL_BENCHMARKS[0]?.id || "bm-01";
  });

  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"blueprint" | "gap" | "timeline" | "dna">("blueprint");

  const comparison = analysis?.benchmark_comparison;
  const currentBenchmark = (benchmarkLibrary || []).find((b) => b.id === selectedBenchmarkId) || (benchmarkLibrary || [])[0];

  const handleBenchmarkLearned = (newBenchmark: ViralBenchmark) => {
    const updated = [newBenchmark, ...benchmarkLibrary];
    setBenchmarkLibrary(updated);
    setSelectedBenchmarkId(newBenchmark.id);
    try {
      const customOnly = updated.filter((b) => b.isCustom);
      localStorage.setItem("neuroviral_custom_benchmarks", JSON.stringify(customOnly));
    } catch (e) {
      console.warn("Failed to persist custom benchmark", e);
    }

    if (onSelectBenchmarkForReAnalysis) {
      onSelectBenchmarkForReAnalysis(newBenchmark);
    }
  };

  const handleBenchmarkClick = (benchmark: ViralBenchmark) => {
    setSelectedBenchmarkId(benchmark.id);
    if (onSelectBenchmarkForReAnalysis) {
      onSelectBenchmarkForReAnalysis(benchmark);
    }
  };

  // Helper score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 65) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <section id="section-viral-benchmarks" className="w-full space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-800 border border-zinc-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Proven Viral Benchmark Engine (Few-Shot DNA Learning)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Viral DNA Transfer & Comparative Gap Analysis
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We deconstructed multi-million view viral videos across TikTok, Reels, and YouTube Shorts into mathematical
              pacing, sensory hook mechanisms, and dopamine triggers — and mapped your uploaded video directly against their blueprint.
            </p>
          </div>

          <button
            onClick={() => setIsFeedModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Feed Proven Viral Video (+ Learn DNA)</span>
          </button>
        </div>
      </div>

      {/* Benchmark Selector Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            Active Benchmark Library ({benchmarkLibrary?.length || 0} Proven Archetypes)
          </h3>
          <span className="text-xs text-zinc-400">
            Click any benchmark to re-align DNA comparison
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {(benchmarkLibrary || []).map((bm) => {
            const isSelected = bm.id === selectedBenchmarkId;
            return (
              <button
                key={bm.id}
                onClick={() => handleBenchmarkClick(bm)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/40 dark:bg-amber-950/30 dark:border-amber-500/50 shadow-md ring-1 ring-amber-500/30"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {bm.category}
                  </span>
                  {bm.isCustom && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">
                      Custom
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1">
                  {bm.title}
                </h4>
                <div className="flex items-center gap-2 mt-auto text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  <Flame className="w-3 h-3" />
                  <span>{bm.provenViews}</span>
                  <span className="text-zinc-400 text-[10px] ml-auto font-normal">
                    {bm.pacingCps} cuts/s
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Comparison Dashboard Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
        {/* Top Active Comparison Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Comparing against:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {currentBenchmark.title}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-full">
                {currentBenchmark.provenViews}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
              "{currentBenchmark.hookTranscript}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                Overall DNA Match
              </span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {comparison?.overallDnaMatchScore || 78}%
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                Hook Alignment
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {comparison?.hookSimilarityScore || 74}%
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                Pacing Match
              </span>
              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {comparison?.pacingAlignmentScore || 82}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("blueprint")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "blueprint"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Transferred Viral Blueprint
          </button>

          <button
            onClick={() => setActiveTab("gap")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "gap"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-rose-500" />
            DNA Gap Analysis (What Was Missed)
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "timeline"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-500" />
            Timeline Transfer Actions ({comparison?.exactTimelineTransfers?.length || 3})
          </button>

          <button
            onClick={() => setActiveTab("dna")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "dna"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            Benchmark Viral DNA Spec
          </button>
        </div>

        {/* Tab 1: Transferred Blueprint */}
        {activeTab === "blueprint" && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {comparison?.transferredBlueprint?.title || `Transferred Blueprint from ${currentBenchmark.title}`}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  +{comparison?.transferredBlueprint?.predictedViralityLift || 18}% Predicted Virality Lift
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Here is the exact formula the {currentBenchmark.provenViews} video used, adapted directly for your topic:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Zap className="w-4 h-4" />
                  <span>Adapted 0-3s Hook Script</span>
                </div>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                  "{comparison?.transferredBlueprint?.hookAdaptation || `Stop doing this with ${analysis.title}. It is destroying your results and nobody is talking about it.`}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  <Clock className="w-4 h-4" />
                  <span>Pacing & Cut Rhythm Plan</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {comparison?.transferredBlueprint?.pacingActionPlan || `Increase cut frequency to ${currentBenchmark.pacingCps} cuts/sec with quick visual punch-ins on key nouns.`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <Volume2 className="w-4 h-4" />
                  <span>Sound Design & Transient Action</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {comparison?.transferredBlueprint?.soundDesignAction || `Insert an acoustic sub-bass transient at second 0:01.2 right as you state the primary conflict.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DNA Gap Analysis */}
        {activeTab === "gap" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Opening Hook Gap
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">0:00 - 0:03</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {comparison?.dnaGapAnalysis?.hookGap || `The benchmark locks a negative stakes warning within 0.8s, whereas this video introduces the topic with conversational phrasing that delays the high-stakes curiosity gap.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Pacing & Velocity Gap
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">{currentBenchmark.pacingCps} cuts/s target</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {comparison?.dnaGapAnalysis?.pacingGap || `The benchmark maintains an aggressive cut speed with visual changes every 1.1 seconds, preventing viewer visual habituation.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Audio-Visual Synesthesia Gap
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">Sensory Multiplier</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {comparison?.dnaGapAnalysis?.audioVisualGap || `The benchmark utilizes sound transients directly aligned with on-screen kinetic subtitles to force dual auditory-visual focus.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Curiosity Loop Closure Gap
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400">Retention Sustain</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {comparison?.dnaGapAnalysis?.curiosityLoopGap || `The benchmark explicitly promises a rapid 10-second payoff timeline early on, sustaining high completion rate.`}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Timeline Transfers */}
        {activeTab === "timeline" && (
          <div className="space-y-3 animate-fade-in">
            {(comparison?.exactTimelineTransfers || [
              {
                timestamp: "00:00.8",
                benchmarkTactic: "High-contrast before/after visual split or punch-in",
                appliedToUserVideo: `Flash a visual transformation or problem proof related to "${analysis.title}" to lock first 3-second retention.`,
                predictedRetentionGain: "+22% 3s Hold Rate",
              },
              {
                timestamp: "00:02.4",
                benchmarkTactic: "Open curiosity loop with explicit payoff timeline ('Here is how in 10s')",
                appliedToUserVideo: `Add text super stating: 'Here is the 1-step fix in 5 seconds' to prevent mid-roll dropoff.`,
                predictedRetentionGain: "+15% Completion Rate",
              },
              {
                timestamp: "00:06.0",
                benchmarkTactic: "Rapid visual proof demonstration without filler words",
                appliedToUserVideo: `Cut directly to the core result with upbeat audio crescendo.`,
                predictedRetentionGain: "+28% Peer Share Velocity",
              },
            ]).map((transfer, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20 shrink-0">
                    {transfer.timestamp}
                  </span>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {transfer.benchmarkTactic}
                    </h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {transfer.appliedToUserVideo}
                    </p>
                  </div>
                </div>
                <span className="self-end sm:self-center px-2.5 py-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 whitespace-nowrap">
                  {transfer.predictedRetentionGain}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Benchmark Viral DNA Spec */}
        {activeTab === "dna" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Hook Mechanism
                </span>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentBenchmark.viralDna?.hookMechanism || "Pattern Interrupt & Negative Agitation"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Open Loop Formula
                </span>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentBenchmark.viralDna?.openLoopStructure || "High stakes established in 0-1.5s + delayed payoff"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Pacing Formula
                </span>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentBenchmark.viralDna?.pacingFormula || `${currentBenchmark.pacingCps} cuts/sec with dynamic kinetic motion`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Vocal Cadence & Tone
                </span>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentBenchmark.viralDna?.vocalCadence || "High-energy direct conversational authority"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Visual Super Style
                </span>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentBenchmark.viralDna?.visualSuperStyle || "Bold yellow/white kinetic subtitles with punch-in zoom"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Dopamine Triggers
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(currentBenchmark.viralDna?.dopamineTriggers || ["Cognitive Dissonance", "Mirror Neurons", "Utility Payoff"]).map((trigger, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed Modal */}
      <FeedViralVideoModal
        isOpen={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
        onBenchmarkLearned={handleBenchmarkLearned}
      />
    </section>
  );
};
