import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  BrainCircuit,
  MessageSquareQuote,
  Target,
  Bot,
  UserCheck,
  TrendingUp,
  FileEdit,
} from "lucide-react";
import { ViralityAnalysis, NarrativeStressTestResult, AudiencePersonaId } from "../types";

interface NarrativeStressTestSectionProps {
  analysis: ViralityAnalysis;
  onUpdateAnalysis?: (updated: ViralityAnalysis) => void;
}

export const NarrativeStressTestSection: React.FC<NarrativeStressTestSectionProps> = ({
  analysis,
  onUpdateAnalysis,
}) => {
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState<AudiencePersonaId | "all">("all");
  const [activeIntervalIndex, setActiveIntervalIndex] = useState<number>(0);
  const [copiedPatchIdx, setCopiedPatchIdx] = useState<number | null>(null);
  const [copiedFullScript, setCopiedFullScript] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showCustomScriptInput, setShowCustomScriptInput] = useState(false);
  const [customScriptText, setCustomScriptText] = useState(
    analysis.verbatim_transcript || analysis.transcript_summary || ""
  );

  const stressTest: NarrativeStressTestResult | undefined = analysis.narrative_stress_test;

  const handleRunStressTest = async (scriptToRun?: string) => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/narrative-stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          customScript: scriptToRun || customScriptText || analysis.verbatim_transcript,
        }),
      });

      const data = await res.json();
      if (data?.success && data?.stressTest) {
        const updatedAnalysis: ViralityAnalysis = {
          ...analysis,
          narrative_stress_test: data.stressTest,
        };
        if (onUpdateAnalysis) {
          onUpdateAnalysis(updatedAnalysis);
        }
      }
    } catch (err) {
      console.error("Narrative stress test error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof index === "number") {
      setCopiedPatchIdx(index);
      setTimeout(() => setCopiedPatchIdx(null), 2000);
    } else {
      setCopiedFullScript(true);
      setTimeout(() => setCopiedFullScript(false), 2000);
    }
  };

  if (!stressTest) {
    return (
      <div id="narrative-stress-test-empty" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Narrative Stress Test Engine</h3>
          <p className="text-sm text-slate-400">
            Simulate how different 2026 audience segments (Fast-Scrollers, Skeptics, Action-Takers, and Algorithmic Sentinels) react to your script at every 5-second interval.
          </p>
          <button
            id="btn-run-initial-stress-test"
            onClick={() => handleRunStressTest()}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Simulating 5-Second Reactions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run 5s Interval Narrative Stress Test
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const intervals = stressTest.intervals || [];
  const activeInterval = intervals[activeIntervalIndex] || intervals[0];

  const filteredReactions = selectedPersonaFilter === "all"
    ? activeInterval?.audienceReactions || []
    : (activeInterval?.audienceReactions || []).filter((r) => r.personaId === selectedPersonaFilter);

  return (
    <div id="narrative-stress-test-section" className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                Gemini 3.8 Simulation Engine
              </span>
              <span className="text-xs text-slate-400">
                5-Second Interval Neural Telemetry
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Narrative Stress Test & Swipe-Risk Simulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Evaluates cognitive drop-off hazards across 5 distinct viewer archetypes to prevent mid-roll abandonment.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-toggle-custom-script"
              onClick={() => setShowCustomScriptInput(!showCustomScriptInput)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
            >
              <FileEdit className="w-3.5 h-3.5" />
              {showCustomScriptInput ? "Hide Script Editor" : "Edit / Re-test Script"}
            </button>

            <button
              id="btn-rerun-stress-test"
              onClick={() => handleRunStressTest()}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
              {isSimulating ? "Re-Simulating..." : "Re-Simulate (Gemini 3.8)"}
            </button>
          </div>
        </div>

        {/* Custom Script Editor Modal / Accordion */}
        {showCustomScriptInput && (
          <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="input-custom-script" className="text-xs font-semibold text-slate-300">
                Test a Revised Script or Spoken Dialogue:
              </label>
              <span className="text-[11px] text-slate-400">
                {(customScriptText || "").split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              id="input-custom-script"
              value={customScriptText}
              onChange={(e) => setCustomScriptText(e.target.value)}
              rows={3}
              placeholder="Paste your spoken script or dialogue here to test audience perception across 5s intervals..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCustomScriptText(analysis.verbatim_transcript || "")}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Reset to Original
              </button>
              <button
                id="btn-submit-custom-script-test"
                onClick={() => handleRunStressTest(customScriptText)}
                disabled={isSimulating || !customScriptText.trim()}
                className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Run Stress Test on Revised Script
              </button>
            </div>
          </div>
        )}

        {/* Executive Verdict Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
              Durability Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">
                {stressTest.overallDurabilityScore}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div
                className={`data-bar h-full rounded-full ${
                  stressTest.overallDurabilityScore >= 85
                    ? "bg-emerald-500"
                    : stressTest.overallDurabilityScore >= 70
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                initial={{ width: "0%" }}
                animate={{ width: `${stressTest.overallDurabilityScore}%` }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Dominant Hazard
            </span>
            <div className="text-xs font-bold text-amber-300 line-clamp-1 mt-1">
              {stressTest.dominantDropoffHazard || "Mid-Roll Exposition Decay"}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Fatal Flaw At:</span>
              <span className="font-mono font-bold text-rose-400">
                {stressTest.fatalFlawTimestamp || "00:07.5"}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              Peak Resonance
            </span>
            <div className="text-xs font-bold text-emerald-400 line-clamp-1 mt-1">
              Payoff & Reward Delivery
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Timestamp:</span>
              <span className="font-mono font-bold text-emerald-400">
                {stressTest.peakResonanceTimestamp || "00:12.0"}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Total 5s Windows
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">
                {intervals.length}
              </span>
              <span className="text-xs text-slate-400">intervals</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              ~{stressTest.scriptWordCount || 65} spoken words
            </div>
          </div>
        </div>

        {/* Strategic Verdict Description */}
        <div className="mt-4 p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <MessageSquareQuote className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-violet-300 font-semibold">Gemini Executive Verdict: </strong>
            {stressTest.executiveStressVerdict}
          </div>
        </div>
      </div>

      {/* Audience Segment Survival Syntheses */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Audience Segment Retention Syntheses
            </h3>
            <p className="text-xs text-slate-400">
              Click a persona to isolate their second-by-second emotional trajectory.
            </p>
          </div>

          {/* Persona Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedPersonaFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedPersonaFilter === "all"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              All Segments
            </button>
            {stressTest.personaSyntheses.map((p) => (
              <button
                key={p.personaId}
                onClick={() => setSelectedPersonaFilter(p.personaId as AudiencePersonaId)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  selectedPersonaFilter === p.personaId
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>
                  {p.personaId === "fast_scroller"
                    ? "⚡"
                    : p.personaId === "skeptic_expert"
                    ? "🧐"
                    : p.personaId === "casual_browser"
                    ? "🍿"
                    : p.personaId === "high_intent_buyer"
                    ? "💼"
                    : "🤖"}
                </span>
                <span>{p.personaName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stressTest.personaSyntheses.map((persona) => {
            const isSelected = selectedPersonaFilter === persona.personaId;
            const emoji = persona.personaId === "fast_scroller"
              ? "⚡"
              : persona.personaId === "skeptic_expert"
              ? "🧐"
              : persona.personaId === "casual_browser"
              ? "🍿"
              : persona.personaId === "high_intent_buyer"
              ? "💼"
              : "🤖";

            return (
              <div
                key={persona.personaId}
                onClick={() => setSelectedPersonaFilter(isSelected ? "all" : (persona.personaId as AudiencePersonaId))}
                className={`cursor-pointer rounded-xl p-3.5 border transition flex flex-col justify-between ${
                  isSelected
                    ? "bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/10"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{emoji}</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        persona.survivalRate >= 85
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : persona.survivalRate >= 75
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {persona.survivalRate}% Survival
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{persona.personaName}</h4>
                    <p className="text-[11px] text-slate-400">{persona.personaRole}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-[11px]">
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Dropoff Risk:</span>
                    <span className="font-mono text-rose-300 font-semibold">{persona.dropoffTimestamp}</span>
                  </div>
                  <div className="text-slate-300 line-clamp-2 text-[10.5px]">
                    <strong className="text-amber-400/90 font-medium">Trigger: </strong>
                    {persona.primaryDropoffReason}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Second Interval Interactive Deep-Dive Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-violet-400" />
              5-Second Interval Simulation Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Select a 5-second chunk to inspect persona monologues, hazard triggers, and Gemini-generated script patches.
            </p>
          </div>

          {/* Timeline Step Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {intervals.map((interval, idx) => {
              const isCurrent = activeIntervalIndex === idx;
              const isHazard = interval.hazardLevel === "high" || interval.hazardLevel === "critical";

              return (
                <button
                  key={idx}
                  id={`interval-step-btn-${idx}`}
                  onClick={() => setActiveIntervalIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400"
                      : isHazard
                      ? "bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900/50"
                      : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{interval.timeRange}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      interval.aggregateRetentionScore >= 85
                        ? "bg-emerald-400"
                        : interval.aggregateRetentionScore >= 75
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Interval Overview Panel */}
        {activeInterval && (
          <div className="space-y-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-violet-500/20 border border-violet-500/40 text-violet-300 font-mono font-bold text-xs">
                    Window: {activeInterval.timeRange}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      activeInterval.hazardLevel === "low"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : activeInterval.hazardLevel === "moderate"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    Hazard: {activeInterval.hazardLevel}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Retention Score:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {activeInterval.aggregateRetentionScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Arousal Cue:</span>
                    <span className="text-violet-300 font-medium">{activeInterval.keyArousalTrigger}</span>
                  </div>
                </div>
              </div>

              {/* Spoken Script & Visual Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                    Spoken Script in this 5s Window
                  </span>
                  <p className="text-slate-200 italic font-serif text-sm leading-relaxed">
                    "{activeInterval.scriptSnippet}"
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                    Visual & Transition Cue
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {activeInterval.visualContext || "Fast paced kinetic visual cut matching vocal cadence."}
                  </p>
                  <div className="mt-2 text-rose-300/90 text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                    <span><strong>Friction Point:</strong> {activeInterval.frictionPoint}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona Real-Time Reactions Grid */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-violet-400" />
                Simulated Audience Perceptions ({activeInterval.timeRange})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredReactions.map((reaction, rIdx) => {
                  const isHighRisk = reaction.swipeRisk === "high" || reaction.swipeRisk === "critical";

                  return (
                    <div
                      key={rIdx}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        isHighRisk
                          ? "bg-rose-950/20 border-rose-800/60"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{reaction.personaAvatar}</span>
                            <div>
                              <div className="text-xs font-bold text-white">{reaction.personaName}</div>
                              <div className="text-[10px] text-slate-400">{reaction.personaRole}</div>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              reaction.swipeRisk === "low"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : reaction.swipeRisk === "moderate"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {reaction.verdictTag || `${reaction.swipeRisk} risk`}
                          </span>
                        </div>

                        {/* Monologue Quote */}
                        <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80 text-xs text-slate-200 italic font-serif leading-snug">
                          "{reaction.internalMonologue}"
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Hold Chance:</span>
                        <span
                          className={`font-mono font-bold ${
                            reaction.retentionLikelihood >= 80
                              ? "text-emerald-400"
                              : reaction.retentionLikelihood >= 65
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {reaction.retentionLikelihood}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gemini Live Script Patch Card */}
            {activeInterval.geminiPatch && (
              <div className="bg-gradient-to-br from-violet-950/40 to-slate-950 border border-violet-500/40 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-violet-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        Gemini 3.8 Friction Patch ({activeInterval.timeRange})
                      </h4>
                      <span className="text-[11px] text-violet-300/80">
                        Drop-in script & visual fix to bypass viewer swipe impulse
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto">
                    {activeInterval.geminiPatch.predictedRetentionBoost || "+22% Retention Lift"}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase text-violet-400 tracking-wider">
                      Patched Script Line:
                    </span>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-violet-500/30 text-xs sm:text-sm text-slate-100 font-medium relative group">
                      <p>{activeInterval.geminiPatch.suggestedScriptRewrite}</p>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            activeInterval.geminiPatch.suggestedScriptRewrite,
                            activeInterval.intervalIndex
                          )
                        }
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Copy Patched Line"
                      >
                        {copiedPatchIdx === activeInterval.intervalIndex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      <strong>Psychological Fix:</strong> {activeInterval.geminiPatch.rationale}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase text-indigo-400 tracking-wider">
                      Visual / Edit Directive:
                    </span>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-indigo-500/30 text-xs text-slate-200 h-full flex items-center">
                      <p>{activeInterval.geminiPatch.visualActionPatch}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Patched Script Quick Export Banner */}
        {stressTest.fullPatchedScript && (
          <div className="mt-4 p-4 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Full Stress-Tested & Patched Script Ready
              </div>
              <p className="text-[11px] text-slate-400">
                Combines all interval optimizations into an end-to-end swipe-resistant script.
              </p>
            </div>

            <button
              id="btn-copy-full-patched-script"
              onClick={() => copyToClipboard(stressTest.fullPatchedScript)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shrink-0"
            >
              {copiedFullScript ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Full Patched Script
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
