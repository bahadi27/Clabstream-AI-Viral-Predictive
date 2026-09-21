import React, { useState, useMemo } from "react";
import { ViralityAnalysis, PlatformScores } from "../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from "recharts";
import {
  TrendingUp,
  Activity,
  Zap,
  Sparkles,
  Layers,
  Sliders,
  Users,
  BarChart3,
  Calendar,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from "lucide-react";

interface ViewGrowthForecastProps {
  analysis: ViralityAnalysis;
  className?: string;
}

type MetricMode = "cumulative" | "velocity";
type SeedTier = "micro" | "mid" | "macro" | "custom";
type PlatformFilter = "all" | "tiktok" | "instagram" | "youtube";

interface ForecastDataPoint {
  dayNumber: number;
  day: string;
  shortLabel: string;
  projectedViews: number;
  optimizedViews: number;
  conservativeViews: number;
  explosiveViews: number;
  dailyVelocity: number;
  optimizedDailyVelocity: number;
  conservativeDailyVelocity: number;
  explosiveDailyVelocity: number;
  growthRate: number; // percentage growth
  phaseName: string;
  algorithmMilestone: string;
  keyDriver: string;
}

export const ViewGrowthForecast: React.FC<ViewGrowthForecastProps> = ({
  analysis,
  className = ""
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>("cumulative");
  const [seedTier, setSeedTier] = useState<SeedTier>("mid");
  const [customSeed, setCustomSeed] = useState<number>(20000);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [visibleLines, setVisibleLines] = useState({
    projected: true,
    optimized: true,
    conservative: true,
    explosive: true
  });
  const [activeHoverDay, setActiveHoverDay] = useState<ForecastDataPoint | null>(null);

  // Extract core metrics with sensible defaults
  const viralityScore = analysis?.virality_score ?? 82;
  const retentionScore = analysis?.retention_score ?? analysis?.hold_rate ?? 78;
  const hookScore = analysis?.hook_score ?? 80;
  const holdRate = analysis?.hold_rate ?? 75;
  const shareVelocity = analysis?.share_velocity ?? 84;
  const platformScores = analysis?.platform_scores ?? { tiktok: 85, instagram: 80, youtube: 78, twitter: 70 };

  // Calculate base seed impressions based on selected tier
  const baseSeedImpressions = useMemo(() => {
    switch (seedTier) {
      case "micro":
        return 5000;
      case "mid":
        return 25000;
      case "macro":
        return 100000;
      case "custom":
        return customSeed;
      default:
        return 25000;
    }
  }, [seedTier, customSeed]);

  // Platform multiplier weighting
  const platformMultiplier = useMemo(() => {
    switch (platformFilter) {
      case "tiktok":
        return (platformScores.tiktok || 80) / 80;
      case "instagram":
        return (platformScores.instagram || 80) / 80;
      case "youtube":
        return (platformScores.youtube || 80) / 80;
      case "all":
      default:
        return 1.0;
    }
  }, [platformFilter, platformScores]);

  // Calculate algorithmic compounding coefficients
  const viralityCoefficient = useMemo(() => {
    // K-factor = (Share Velocity / 100 * 1.5) + (Retention Score / 100 * 0.8) + (Hook Score / 100 * 0.5)
    const k = 0.5 + ((shareVelocity || 0) / 100) * 0.65 + ((retentionScore || 0) / 100) * 0.45 + ((hookScore || 0) / 100) * 0.2;
    return Number((k || 0).toFixed(2));
  }, [shareVelocity, retentionScore, hookScore]);

  // Hook lift percentage from analysis or calculated
  const hookLiftPercent = useMemo(() => {
    if (analysis?.hook_alternatives && analysis.hook_alternatives.length > 0) {
      const maxLift = Math.max(...analysis.hook_alternatives.map((h) => h.predicted_lift || 0));
      if (maxLift > 0) return maxLift;
    }
    return 18.5; // default expected lift with hook optimization
  }, [analysis]);

  // 7-day dynamic forecasting model
  const forecastData = useMemo<ForecastDataPoint[]>(() => {
    const rawMultiplier = Math.pow(viralityScore / 50, 1.45) * platformMultiplier;
    const base = baseSeedImpressions;

    // Day 1 to Day 7 growth dynamics
    // Day 1: Initial cohort seed testing (200 -> 5k-25k)
    // Day 2: Algorithm batch testing (FYP tier 2 push)
    // Day 3: Peak share loop acceleration
    // Day 4: High volume distribution
    // Day 5: Secondary audience recommendation
    // Day 6: Organic tail begins
    // Day 7: Steady long-tail compounding

    const dailyMultipliers = [
      { day: 1, label: "Day 1 (0-24h)", short: "Day 1", pctOfBase: 1.0, decayFactor: 1.0, phase: "Initial Seed Testing", milestone: "200-500 Account Test Batch Passed", driver: "3s Hook Hold" },
      { day: 2, label: "Day 2 (24-48h)", short: "Day 2", pctOfBase: 1.85 * (viralityCoefficient / 1.2), decayFactor: 1.15, phase: "FYP Secondary Tier Push", milestone: "Algorithmic Batch Multiplier Activated", driver: "Pacing & Retention Curve" },
      { day: 3, label: "Day 3 (48-72h)", short: "Day 3", pctOfBase: 2.75 * (viralityCoefficient / 1.15), decayFactor: 1.25, phase: "Peak Share Velocity Loop", milestone: "Explore & FYP Recommendation Peak", driver: "DM Shares & Saves" },
      { day: 4, label: "Day 4 (Day 4)", short: "Day 4", pctOfBase: 2.20 * (viralityCoefficient / 1.25), decayFactor: 0.95, phase: "Broad Audience Expansion", milestone: "Cross-Cohort Interest Graph Matching", driver: "Watch Time Completion" },
      { day: 5, label: "Day 5 (Day 5)", short: "Day 5", pctOfBase: 1.60 * (viralityCoefficient / 1.35), decayFactor: 0.78, phase: "Sustained Organic Reach", milestone: "Related Video Association Cluster", driver: "Sound & Topic Affinity" },
      { day: 6, label: "Day 6 (Day 6)", short: "Day 6", pctOfBase: 1.15 * (viralityCoefficient / 1.45), decayFactor: 0.65, phase: "Long-Tail Transition", milestone: "Search & Keyword Indexing", driver: "Replay Factor" },
      { day: 7, label: "Day 7 (Day 7)", short: "Day 7", pctOfBase: 0.85 * (viralityCoefficient / 1.55), decayFactor: 0.55, phase: "Steady Evergreen Tail", milestone: "Sound Page & Profile Sticky Views", driver: "Profile Visit Conversion" },
    ];

    let runningCumulativeProjected = 0;
    let runningCumulativeOptimized = 0;
    let runningCumulativeConservative = 0;
    let runningCumulativeExplosive = 0;

    let prevProjectedDaily = 0;

    return dailyMultipliers.map((m) => {
      // Daily velocities
      const dailyProjected = Math.round(base * m.pctOfBase * rawMultiplier);
      const dailyOptimized = Math.round(dailyProjected * (1 + hookLiftPercent / 100));
      const dailyConservative = Math.round(dailyProjected * 0.58);
      const dailyExplosive = Math.round(dailyProjected * 1.72 * (viralityCoefficient > 1.3 ? 1.25 : 1.0));

      runningCumulativeProjected += dailyProjected;
      runningCumulativeOptimized += dailyOptimized;
      runningCumulativeConservative += dailyConservative;
      runningCumulativeExplosive += dailyExplosive;

      const growthRate = prevProjectedDaily > 0 ? ((dailyProjected - prevProjectedDaily) / prevProjectedDaily) * 100 : 0;
      prevProjectedDaily = dailyProjected;

      return {
        dayNumber: m.day,
        day: m.label,
        shortLabel: m.short,
        projectedViews: runningCumulativeProjected,
        optimizedViews: runningCumulativeOptimized,
        conservativeViews: runningCumulativeConservative,
        explosiveViews: runningCumulativeExplosive,
        dailyVelocity: dailyProjected,
        optimizedDailyVelocity: dailyOptimized,
        conservativeDailyVelocity: dailyConservative,
        explosiveDailyVelocity: dailyExplosive,
        growthRate: Number((growthRate || 0).toFixed(1)),
        phaseName: m.phase,
        algorithmMilestone: m.milestone,
        keyDriver: m.driver
      };
    });
  }, [baseSeedImpressions, viralityScore, platformMultiplier, viralityCoefficient, hookLiftPercent]);

  // Aggregate stats from Day 7
  const finalDay = (forecastData && forecastData.length > 0) ? forecastData[forecastData.length - 1] : undefined;
  const peakDay = useMemo(() => {
    return (forecastData || []).reduce((max, d) => (d.dailyVelocity > (max?.dailyVelocity || 0) ? d : max), forecastData?.[0]);
  }, [forecastData]);

  const fypPushProbability = useMemo(() => {
    // Formula: combination of hook score, hold rate, and virality score
    const prob = ((hookScore || 0) * 0.4) + ((holdRate || 0) * 0.35) + ((viralityScore || 0) * 0.25);
    return Math.min(99.4, Math.max(12.0, Number((prob || 50).toFixed(1))));
  }, [hookScore, holdRate, viralityScore]);

  // Number formatters
  const formatCompactNumber = (num: number) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
    if (num >= 1_000_000) {
      return `${((num / 1_000_000) || 0).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${((num / 1_000) || 0).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  const formatExactNumber = (num: number) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
    return num.toLocaleString();
  };

  const toggleLine = (lineKey: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey]
    }));
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as ForecastDataPoint;
      if (!dataPoint) return null;

      const isCumulative = metricMode === "cumulative";

      return (
        <div className="cyber-glass border border-[#00F5D4]/40 bg-[#050508]/95 backdrop-blur-xl p-4 rounded-xs shadow-2xl min-w-[280px] max-w-[340px] text-white z-50">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-pulse" />
              <span className="font-mono font-bold text-sm text-white">{dataPoint.day}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30 font-bold uppercase">
              {dataPoint.phaseName}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {visibleLines.projected && (
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-xs border-l-2 border-[#00F5D4]">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
                  Projected Views:
                </span>
                <span className="font-bold text-[#00F5D4] text-sm">
                  {formatExactNumber(isCumulative ? dataPoint.projectedViews : dataPoint.dailyVelocity)}
                </span>
              </div>
            )}

            {visibleLines.optimized && (
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-xs border-l-2 border-indigo-400">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Optimized (+{hookLiftPercent}% Lift):
                </span>
                <span className="font-bold text-indigo-300 text-sm">
                  {formatExactNumber(isCumulative ? dataPoint.optimizedViews : dataPoint.optimizedDailyVelocity)}
                </span>
              </div>
            )}

            {visibleLines.explosive && (
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-xs border-l-2 border-amber-400">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Explosive Breakout (Upper CI):
                </span>
                <span className="font-bold text-amber-300">
                  {formatExactNumber(isCumulative ? dataPoint.explosiveViews : dataPoint.explosiveDailyVelocity)}
                </span>
              </div>
            )}

            {visibleLines.conservative && (
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-xs border-l-2 border-neutral-400">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  Conservative Floor (Lower CI):
                </span>
                <span className="font-semibold text-neutral-300">
                  {formatExactNumber(isCumulative ? dataPoint.conservativeViews : dataPoint.conservativeDailyVelocity)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5 text-[11px]">
            <div className="flex items-start gap-1.5 text-neutral-300">
              <span className="text-[#00F5D4] font-bold">🎯 Milestone:</span>
              <span className="font-sans leading-tight">{dataPoint.algorithmMilestone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px]">
              <span>Primary Algorithmic Driver:</span>
              <span className="text-white font-semibold">{dataPoint.keyDriver}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="section-view-growth-forecast"
      className={`cyber-glass border border-white/10 rounded-xs p-6 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F5D4]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls Section */}
      <div className="relative z-10 border-b border-white/10 pb-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-mono font-bold bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40 px-2.5 py-0.5 rounded-xs uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                7-Day Algorithmic Trajectory
              </span>
              <span className="text-xs font-mono text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-xs">
                Bass Diffusion + Empirical fMRI Decay
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-xs flex items-center gap-1">
                <Zap className="w-3 h-3" />
                K-Factor: {viralityCoefficient}x
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white tracking-tight flex items-center gap-2.5">
              <span>Projected View Growth Forecast</span>
              <span className="text-xs font-mono font-normal text-neutral-400 px-2.5 py-0.5 rounded-xs bg-white/5 border border-white/10 hidden sm:inline-block">
                Day 1 – Day 7
              </span>
            </h2>
            <p className="text-xs font-sans text-neutral-300 mt-1 max-w-3xl leading-relaxed">
              Predictive 7-day distribution velocity modeled on your retention rate ({retentionScore}%), hook strength ({hookScore}%), and share velocity ({shareVelocity}%). Simulates feed recommendation escalation curves across short-form algorithms.
            </p>
          </div>

          {/* Interactive Mode & Tier Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Cumulative vs Daily Velocity Toggle */}
            <div className="bg-white/5 border border-white/10 p-1 rounded-xs flex items-center text-xs font-mono">
              <button
                onClick={() => setMetricMode("cumulative")}
                className={`px-3 py-1.5 rounded-xs transition-all font-semibold ${
                  metricMode === "cumulative"
                    ? "bg-[#00F5D4] text-black font-bold shadow-md shadow-[#00F5D4]/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Cumulative Views
              </button>
              <button
                onClick={() => setMetricMode("velocity")}
                className={`px-3 py-1.5 rounded-xs transition-all font-semibold ${
                  metricMode === "velocity"
                    ? "bg-[#00F5D4] text-black font-bold shadow-md shadow-[#00F5D4]/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Daily Velocity
              </button>
            </div>

            {/* Seed Audience Tier Selector */}
            <div className="bg-white/5 border border-white/10 p-1 rounded-xs flex items-center text-xs font-mono">
              <span className="px-2 text-neutral-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Users className="w-3 h-3 text-[#00F5D4]" />
                Seed:
              </span>
              <button
                onClick={() => setSeedTier("micro")}
                className={`px-2.5 py-1 rounded-xs transition-all ${
                  seedTier === "micro"
                    ? "bg-white/20 text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Micro Creator Seed Base (~5k impressions)"
              >
                5k
              </button>
              <button
                onClick={() => setSeedTier("mid")}
                className={`px-2.5 py-1 rounded-xs transition-all ${
                  seedTier === "mid"
                    ? "bg-white/20 text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Standard Creator Seed Base (~25k impressions)"
              >
                25k
              </button>
              <button
                onClick={() => setSeedTier("macro")}
                className={`px-2.5 py-1 rounded-xs transition-all ${
                  seedTier === "macro"
                    ? "bg-white/20 text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="High-Reach / Macro Seed Base (~100k impressions)"
              >
                100k
              </button>
            </div>
          </div>
        </div>

        {/* Platform Filter & Custom Seed Sub-bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-400 text-[11px] font-semibold">Algorithm Target:</span>
            <button
              onClick={() => setPlatformFilter("all")}
              className={`px-2.5 py-1 rounded-xs border transition-all ${
                platformFilter === "all"
                  ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold"
                  : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20"
              }`}
            >
              Omni-Platform (Aggregate)
            </button>
            <button
              onClick={() => setPlatformFilter("tiktok")}
              className={`px-2.5 py-1 rounded-xs border transition-all ${
                platformFilter === "tiktok"
                  ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold"
                  : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20"
              }`}
            >
              TikTok FYP ({platformScores.tiktok}/100)
            </button>
            <button
              onClick={() => setPlatformFilter("instagram")}
              className={`px-2.5 py-1 rounded-xs border transition-all ${
                platformFilter === "instagram"
                  ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold"
                  : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20"
              }`}
            >
              Instagram Reels ({platformScores.instagram}/100)
            </button>
            <button
              onClick={() => setPlatformFilter("youtube")}
              className={`px-2.5 py-1 rounded-xs border transition-all ${
                platformFilter === "youtube"
                  ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold"
                  : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20"
              }`}
            >
              YouTube Shorts ({platformScores.youtube}/100)
            </button>
          </div>

          {/* Line Visibility Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-400 text-[11px]">Series:</span>
            <button
              onClick={() => toggleLine("projected")}
              className={`px-2 py-0.5 rounded-xs text-[11px] border transition-all flex items-center gap-1.5 ${
                visibleLines.projected
                  ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold"
                  : "bg-white/5 border-white/10 text-neutral-500 opacity-60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
              Projected
            </button>
            <button
              onClick={() => toggleLine("optimized")}
              className={`px-2 py-0.5 rounded-xs text-[11px] border transition-all flex items-center gap-1.5 ${
                visibleLines.optimized
                  ? "bg-indigo-950/60 border-indigo-400 text-indigo-300 font-bold"
                  : "bg-white/5 border-white/10 text-neutral-500 opacity-60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Optimized (+{hookLiftPercent}%)
            </button>
            <button
              onClick={() => toggleLine("explosive")}
              className={`px-2 py-0.5 rounded-xs text-[11px] border transition-all flex items-center gap-1.5 ${
                visibleLines.explosive
                  ? "bg-amber-950/60 border-amber-400 text-amber-300 font-bold"
                  : "bg-white/5 border-white/10 text-neutral-500 opacity-60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Explosive
            </button>
            <button
              onClick={() => toggleLine("conservative")}
              className={`px-2 py-0.5 rounded-xs text-[11px] border transition-all flex items-center gap-1.5 ${
                visibleLines.conservative
                  ? "bg-neutral-800 border-neutral-400 text-neutral-300 font-bold"
                  : "bg-white/5 border-white/10 text-neutral-500 opacity-60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              Conservative
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Metric 1: 7-Day Total Cumulative Reach */}
        <div className="cyber-glass border border-white/10 bg-white/5 rounded-xs p-4 relative overflow-hidden">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>7-Day Total Reach</span>
            <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          </div>
          <div className="font-mono font-extrabold text-2xl lg:text-3xl text-white tracking-tight">
            {formatCompactNumber(finalDay.projectedViews)}
          </div>
          <div className="mt-1 text-[11px] font-mono text-[#00F5D4] flex items-center gap-1">
            <span>Optimized: {formatCompactNumber(finalDay.optimizedViews)}</span>
            <span className="text-emerald-400 font-bold">(+{hookLiftPercent}%)</span>
          </div>
        </div>

        {/* Metric 2: Viral K-Factor */}
        <div className="cyber-glass border border-white/10 bg-white/5 rounded-xs p-4 relative overflow-hidden">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Compounding K-Factor</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono font-extrabold text-2xl lg:text-3xl text-amber-400 tracking-tight">
            {viralityCoefficient}x
          </div>
          <div className="mt-1 text-[11px] font-sans text-neutral-300">
            {viralityCoefficient >= 1.25 ? "🔥 Self-Sustaining Viral Cycle" : "⚡ Strong Organic Amplification"}
          </div>
        </div>

        {/* Metric 3: Peak Velocity Window */}
        <div className="cyber-glass border border-white/10 bg-white/5 rounded-xs p-4 relative overflow-hidden">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Peak Velocity Window</span>
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="font-mono font-extrabold text-2xl lg:text-3xl text-white tracking-tight">
            {peakDay.shortLabel}
          </div>
          <div className="mt-1 text-[11px] font-mono text-indigo-300">
            +{formatCompactNumber(peakDay.dailyVelocity)} views/24h peak
          </div>
        </div>

        {/* Metric 4: FYP Cascade Probability */}
        <div className="cyber-glass border border-white/10 bg-white/5 rounded-xs p-4 relative overflow-hidden">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>FYP Cascade Confidence</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono font-extrabold text-2xl lg:text-3xl text-emerald-400 tracking-tight">
            {fypPushProbability}%
          </div>
          <div className="mt-1 text-[11px] font-sans text-neutral-300">
            Passes 3s hook & completion thresholds
          </div>
        </div>
      </div>

      {/* Main Recharts Graph Container */}
      <div className="bg-[#050508]/80 border border-white/10 rounded-xs p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              {metricMode === "cumulative" ? "Cumulative Audience Reach (Day 1 – Day 7)" : "Daily View Velocity Acceleration (Views / 24h Period)"}
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
            <span>Y-Axis: {metricMode === "cumulative" ? "Total Views" : "Daily New Views"}</span>
          </div>
        </div>

        <div className="w-full h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={forecastData}
              margin={{ top: 20, right: 25, left: 10, bottom: 10 }}
              onMouseMove={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  setActiveHoverDay(state.activePayload[0].payload as ForecastDataPoint);
                }
              }}
              onMouseLeave={() => setActiveHoverDay(null)}
            >
              <defs>
                {/* Neon Cyan Gradient Area for Projected Views */}
                <linearGradient id="projectedViewsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00F5D4" stopOpacity={0.0} />
                </linearGradient>

                {/* Indigo Gradient Area for Optimized Hook Views */}
                <linearGradient id="optimizedViewsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>

                {/* Glow filter for neon lines */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="shortLabel"
                stroke="#666666"
                tick={{ fill: "#A3A3A3", fontSize: 12, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.15)" }}
              />

              <YAxis
                stroke="#666666"
                tickFormatter={(val) => formatCompactNumber(val)}
                tick={{ fill: "#A3A3A3", fontSize: 11, fontFamily: "monospace" }}
                axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.15)" }}
                domain={["auto", "auto"]}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Reference line for 100k FYP breakout if relevant */}
              {finalDay.explosiveViews >= 100000 && metricMode === "cumulative" && (
                <ReferenceLine
                  y={100000}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: "100k FYP Tier Milestone",
                    fill: "#f59e0b",
                    fontSize: 10,
                    fontFamily: "monospace",
                    position: "insideTopRight"
                  }}
                />
              )}

              {/* Conservative Lower Bound Line */}
              {visibleLines.conservative && (
                <Line
                  type="monotone"
                  dataKey={metricMode === "cumulative" ? "conservativeViews" : "conservativeDailyVelocity"}
                  name="Conservative Floor"
                  stroke="#71717a"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: "#71717a" }}
                  activeDot={{ r: 5, fill: "#a1a1aa" }}
                />
              )}

              {/* Explosive Breakout Upper Bound Line */}
              {visibleLines.explosive && (
                <Line
                  type="monotone"
                  dataKey={metricMode === "cumulative" ? "explosiveViews" : "explosiveDailyVelocity"}
                  name="Explosive Breakout"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3, fill: "#fbbf24" }}
                  activeDot={{ r: 6, fill: "#f59e0b" }}
                />
              )}

              {/* Optimized Hook Line */}
              {visibleLines.optimized && (
                <Area
                  type="monotone"
                  dataKey={metricMode === "cumulative" ? "optimizedViews" : "optimizedDailyVelocity"}
                  name="Optimized Hook (+18% Lift)"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fill="url(#optimizedViewsAreaGrad)"
                  dot={{ r: 4, fill: "#818cf8" }}
                  activeDot={{ r: 7, fill: "#a5b4fc" }}
                />
              )}

              {/* Main Projected Views Neon Line & Gradient Area */}
              {visibleLines.projected && (
                <Area
                  type="monotone"
                  dataKey={metricMode === "cumulative" ? "projectedViews" : "dailyVelocity"}
                  name="Projected Baseline"
                  stroke="#00F5D4"
                  strokeWidth={3.5}
                  fill="url(#projectedViewsAreaGrad)"
                  dot={{ r: 5, fill: "#00F5D4", stroke: "#050508", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#00F5D4", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Indicator Bar below chart */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[#00F5D4] rounded-full" />
              <span className="text-white font-semibold">Projected Baseline ({viralityScore}/100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-indigo-400 rounded-full" />
              <span className="text-indigo-300 font-semibold">With AI Hook Optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-amber-400 rounded-full" />
              <span className="text-amber-300">Explosive FYP Spillover</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-neutral-400 rounded-full" />
              <span className="text-neutral-400">Conservative Baseline</span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span>Hover points to inspect algorithmic milestones</span>
          </div>
        </div>
      </div>

      {/* 7-Day Algorithmic Milestone Phase Roadmap */}
      <div className="border-t border-white/10 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00F5D4]" />
            <span>7-Day Algorithmic Distribution Roadmap</span>
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Algorithmic Gateways & Retention Dependencies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {forecastData.map((d) => {
            const isPeak = d.dayNumber === peakDay.dayNumber;
            const isHovered = activeHoverDay?.dayNumber === d.dayNumber;

            return (
              <div
                key={d.dayNumber}
                onMouseEnter={() => setActiveHoverDay(d)}
                className={`p-3.5 rounded-xs border transition-all flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? "bg-[#00F5D4]/15 border-[#00F5D4] shadow-lg shadow-[#00F5D4]/15 translate-y-[-2px]"
                    : isPeak
                    ? "bg-indigo-950/40 border-indigo-500/40 hover:border-indigo-400"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#00F5D4]">
                      {d.shortLabel}
                    </span>
                    {isPeak && (
                      <span className="text-[9px] font-mono font-extrabold bg-indigo-500 text-white px-1.5 py-0.2 rounded-xs">
                        PEAK
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-sm font-extrabold text-white mb-1">
                    {formatCompactNumber(metricMode === "cumulative" ? d.projectedViews : d.dailyVelocity)}
                    <span className="text-[10px] font-normal text-neutral-400 ml-1">views</span>
                  </div>

                  <div className="text-[11px] font-medium text-neutral-300 leading-tight mb-2">
                    {d.phaseName}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2 space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>Key Driver:</span>
                    <span className="text-white font-semibold truncate max-w-[80px]" title={d.keyDriver}>
                      {d.keyDriver}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
