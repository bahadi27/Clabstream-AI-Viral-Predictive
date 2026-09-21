import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainRegionKey,
  BrainRegionsActivation,
  ViralityAnalysis,
} from "../types";
import { BRAIN_REGIONS, getFMRIColor } from "../data/brainRegions";
import {
  NEUROSCIENCE_EXPLANATIONS,
  BrainRegionNeuroDetails,
} from "../data/neuroscienceExplanations";
import { getRegionCorrelation } from "../utils/brainCorrelation";
import {
  X,
  Brain,
  Zap,
  TrendingUp,
  Share2,
  BookOpen,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Flame,
  Target,
  ExternalLink,
} from "lucide-react";

interface BrainRegionNeuroModalProps {
  isOpen: boolean;
  regionKey: BrainRegionKey | null;
  activations?: BrainRegionsActivation;
  analysis?: ViralityAnalysis;
  onClose: () => void;
  onSelectRegion?: (key: BrainRegionKey) => void;
  onOpenKeyframeInsight?: (key: BrainRegionKey) => void;
}

const REGION_KEYS: BrainRegionKey[] = [
  "prefrontal",
  "reward_circuit",
  "amygdala",
  "mirror_neurons",
  "tpj",
  "visual_cortex",
  "auditory_cortex",
  "hippocampus",
  "insula",
  "limbic",
  "left_brain",
  "right_brain",
  "cerebellum",
  "dmn",
];

export const BrainRegionNeuroModal: React.FC<BrainRegionNeuroModalProps> = ({
  isOpen,
  regionKey,
  activations,
  analysis,
  onClose,
  onSelectRegion,
  onOpenKeyframeInsight,
}) => {
  const [activeTab, setActiveTab] = useState<"virality" | "video_diagnosis" | "playbook" | "research">("virality");

  if (!isOpen || !regionKey) return null;

  const currentKey = regionKey;
  const regionInfo = BRAIN_REGIONS[currentKey];
  const neuro = NEUROSCIENCE_EXPLANATIONS[currentKey];
  const score = activations?.[currentKey] ?? 75;
  const heatColor = getFMRIColor(score);
  const correlation = getRegionCorrelation(currentKey, score, analysis);

  const currentIndex = REGION_KEYS.indexOf(currentKey);

  const handlePrev = () => {
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : REGION_KEYS.length - 1;
    const nextKey = REGION_KEYS[nextIdx];
    if (onSelectRegion) onSelectRegion(nextKey);
  };

  const handleNext = () => {
    const nextIdx = currentIndex < REGION_KEYS.length - 1 ? currentIndex + 1 : 0;
    const nextKey = REGION_KEYS[nextIdx];
    if (onSelectRegion) onSelectRegion(nextKey);
  };

  const getScoreTier = (val: number) => {
    if (val >= 85) return { label: "Hyper-Activated (Top 5% Resonance)", bg: "bg-red-50 text-red-700 border-red-200" };
    if (val >= 65) return { label: "Optimal Viral Range (High Activation)", bg: "bg-amber-50 text-amber-800 border-amber-200" };
    if (val >= 40) return { label: "Moderate Baseline (Standard Response)", bg: "bg-blue-50 text-blue-700 border-blue-200" };
    return { label: "Under-Stimulated (Low Cognitive Load)", bg: "bg-neutral-100 text-neutral-600 border-neutral-200" };
  };

  const tier = getScoreTier(score);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="bg-white rounded-sm border border-[#E5E5E5] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-neutral-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="bg-[#111111] text-white p-5 md:p-6 border-b border-black/20 shrink-0 relative overflow-hidden">
            {/* Background Pattern Elements */}
            <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-emerald-400 to-transparent pointer-events-none" />

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold bg-white/15 text-white px-2 py-0.5 rounded-xs tracking-wider uppercase flex items-center gap-1">
                    <Brain className="w-3 h-3 text-amber-400" />
                    Neuroscience Virality Engine
                  </span>
                  <span className="text-[10px] font-mono text-neutral-300">
                    Region {currentIndex + 1} of 14
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-xs">
                    {neuro.primaryNeurotransmitter}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                    {neuro.name}
                  </h2>
                  <span className="text-xs font-mono font-semibold text-neutral-300">
                    ({neuro.sublabel})
                  </span>
                </div>

                <p className="text-xs font-sans text-neutral-300 line-clamp-1 max-w-2xl">
                  {neuro.anatomicalLocation}
                </p>
              </div>

              {/* Score Badge & Close */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                    Video fMRI Activation
                  </span>
                  <div className="flex items-center justify-end gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: heatColor }}
                    />
                    <span className="font-display font-black text-2xl text-white">
                      {score}
                      <span className="text-xs font-mono text-neutral-400 font-normal">
                        /100
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors cursor-pointer"
                    title="Previous Region"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors cursor-pointer"
                    title="Next Region"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors ml-1 cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 14-Region Switcher Pill Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-2 border-t border-white/10 pb-0.5 scrollbar-none">
              {REGION_KEYS.map((k, idx) => {
                const isSelected = k === currentKey;
                const rVal = activations?.[k] ?? 0;
                const rInfo = BRAIN_REGIONS[k];
                return (
                  <button
                    key={k}
                    onClick={() => onSelectRegion && onSelectRegion(k)}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-white text-black font-bold shadow-xs scale-105"
                        : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: getFMRIColor(rVal) }}
                    />
                    <span>{(rInfo?.label || k).split(" ")[0]}</span>
                    <span className="opacity-70 text-[9px]">({rVal})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-[#F8F9FA] border-b border-[#E5E5E5] px-6 py-2 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("virality")}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "virality"
                    ? "bg-[#111111] text-white"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Role in Virality Prediction</span>
              </button>

              <button
                onClick={() => setActiveTab("video_diagnosis")}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "video_diagnosis"
                    ? "bg-[#111111] text-white"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Video Diagnostic & Keyframe</span>
              </button>

              <button
                onClick={() => setActiveTab("playbook")}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "playbook"
                    ? "bg-[#111111] text-white"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator Playbook & Triggers</span>
              </button>

              <button
                onClick={() => setActiveTab("research")}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "research"
                    ? "bg-[#111111] text-white"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Neuroscience Research & Citations</span>
              </button>
            </div>

            {/* Score pill */}
            <div className={`px-2.5 py-1 text-[11px] font-mono font-bold border rounded-xs shrink-0 ${tier.bg}`}>
              {tier.label}
            </div>
          </div>

          {/* Body Content - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: ROLE IN VIRALITY PREDICTION */}
            {activeTab === "virality" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Primary Metric Card */}
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xs p-5 shadow-sm border border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-300" />
                      Primary Algorithmic Prediction Factor:
                    </span>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-xs text-neutral-300">
                      Neural Circuit: {neuro.neuralCircuit}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mb-2">
                    {neuro.viralityRole.primaryMetric}
                  </h3>
                  <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                    {neuro.viralityRole.algorithmicImpact}
                  </p>
                </div>

                {/* Step-by-Step Cognitive Mechanism */}
                <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xs p-5">
                  <h4 className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-emerald-600" />
                    Cognitive & Biological Virality Mechanism:
                  </h4>
                  <p className="text-xs font-sans text-[#333333] leading-relaxed mb-4">
                    {neuro.viralityRole.neuroMechanism}
                  </p>

                  <div className="pt-3 border-t border-[#E5E5E5] text-xs font-sans text-[#555555]">
                    <span className="font-mono font-bold text-neutral-700 block mb-1">
                      Biological Core Function:
                    </span>
                    <p>{neuro.biologicalFunction}</p>
                  </div>
                </div>

                {/* High vs Low Activation Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xs p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <h4 className="font-mono text-xs font-bold text-emerald-900 uppercase">
                        High Activation Effect (Score &gt; 75)
                      </h4>
                    </div>
                    <p className="text-xs font-sans text-emerald-950 leading-relaxed">
                      {neuro.viralityRole.highActivationEffect}
                    </p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 rounded-xs p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="font-mono text-xs font-bold text-amber-900 uppercase">
                        Low Activation Risk (Score &lt; 45)
                      </h4>
                    </div>
                    <p className="text-xs font-sans text-amber-950 leading-relaxed">
                      {neuro.viralityRole.lowActivationRisk}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VIDEO DIAGNOSTIC & KEYFRAME */}
            {activeTab === "video_diagnosis" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white border border-[#E5E5E5] rounded-xs p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                        Uploaded Video Evaluation
                      </span>
                      <h3 className="font-display font-bold text-lg text-[#111111]">
                        {regionInfo.label} Diagnostic
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">
                          Neural Salience
                        </span>
                        <span className="font-display font-black text-2xl text-[#111111]">
                          {score} / 100
                        </span>
                      </div>
                      <div
                        className="w-4 h-10 rounded-xs"
                        style={{ backgroundColor: heatColor }}
                      />
                    </div>
                  </div>

                  {/* Correlation summary */}
                  <div>
                    <span className="font-mono text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1 mb-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      Observed Neural Trigger in Uploaded Clip:
                    </span>
                    <p className="text-xs font-sans text-neutral-800 leading-relaxed bg-[#F8F9FA] p-3.5 rounded-xs border border-[#E5E5E5]">
                      {correlation.correlationSummary}
                    </p>
                  </div>

                  {/* Optimization tip */}
                  <div>
                    <span className="font-mono text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Direct Optimization Recommendation:
                    </span>
                    <p className="text-xs font-mono text-neutral-800 leading-relaxed bg-emerald-50/70 p-3.5 rounded-xs border border-emerald-200">
                      💡 {correlation.optimizationTip}
                    </p>
                  </div>

                  {/* Inspect keyframe button */}
                  {onOpenKeyframeInsight && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E5E5]">
                      <span className="text-xs font-mono text-neutral-600">
                        Peak activation aligned with frame timestamp:{" "}
                        <strong className="text-neutral-900">
                          {correlation.keyframeTimestamp || "00:00.8"}
                        </strong>
                      </span>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenKeyframeInsight(currentKey);
                        }}
                        className="w-full sm:w-auto bg-[#111111] hover:bg-black text-white px-4 py-2.5 text-xs font-mono font-bold rounded-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <span>Inspect Frame Screenshot & Dialogue</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CREATOR PLAYBOOK & VIRAL TRIGGERS */}
            {activeTab === "playbook" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* How to Trigger */}
                  <div className="bg-white border border-[#E5E5E5] rounded-xs p-5 shadow-xs space-y-3">
                    <h4 className="font-mono text-xs font-bold text-emerald-900 uppercase flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tactical Editing Playbook (How to Trigger):
                    </h4>
                    <ul className="space-y-2 text-xs font-sans text-[#333333]">
                      {neuro.creativeApplication.howToTrigger.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono font-bold text-emerald-600 shrink-0">
                            {idx + 1}.
                          </span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Pitfalls */}
                  <div className="bg-white border border-[#E5E5E5] rounded-xs p-5 shadow-xs space-y-3">
                    <h4 className="font-mono text-xs font-bold text-red-900 uppercase flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Editing Pitfalls to Eliminate:
                    </h4>
                    <ul className="space-y-2 text-xs font-sans text-[#333333]">
                      {neuro.creativeApplication.commonPitfalls.map((pitfall, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono font-bold text-red-500 shrink-0">
                            ✕
                          </span>
                          <span className="leading-relaxed">{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Viral Examples Banner */}
                <div className="bg-[#F8F9FA] border border-amber-300 rounded-xs p-4 flex items-start gap-3">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-neutral-900 uppercase block mb-1">
                      Viral Content Benchmarks for {neuro.name}:
                    </span>
                    <p className="text-xs font-sans text-neutral-700 italic">
                      "{neuro.creativeApplication.viralExamples}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RESEARCH & CITATIONS */}
            {activeTab === "research" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white border border-[#E5E5E5] rounded-xs p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-neutral-700" />
                      Peer-Reviewed Cognitive Neuroscience Literature
                    </span>
                    <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-xs border border-neutral-200">
                      {neuro.researchPaper.year}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#111111] mb-1">
                      {neuro.researchPaper.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-600 mb-1">
                      {neuro.researchPaper.authors}
                    </p>
                    <p className="text-xs font-serif italic text-neutral-500">
                      {neuro.researchPaper.journal}
                    </p>
                  </div>

                  <div className="bg-[#F8F9FA] border-l-4 border-neutral-900 p-4 rounded-xs">
                    <span className="font-mono text-[10px] font-bold text-neutral-700 uppercase block mb-1">
                      Scientific Finding & Virality Correlation:
                    </span>
                    <p className="text-xs font-sans text-neutral-800 leading-relaxed">
                      "{neuro.researchPaper.keyFinding}"
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-neutral-500 flex items-center gap-2">
                    <span>Model Calibration:</span>
                    <span className="text-neutral-900 font-bold">
                      Meta AI TRIBE fMRI Foundation Model v2 & Gemini 3.8 Flash
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-[#F8F9FA] border-t border-[#E5E5E5] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
              <Brain className="w-3.5 h-3.5 text-neutral-800" />
              <span>
                Inspecting: <strong className="text-neutral-900">{neuro.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 border border-[#E5E5E5] bg-white hover:bg-neutral-100 text-[#111111] text-xs font-mono font-semibold rounded-xs transition-colors cursor-pointer"
              >
                ← Prev Region
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1.5 border border-[#E5E5E5] bg-white hover:bg-neutral-100 text-[#111111] text-xs font-mono font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Next Region →
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-mono font-bold rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
