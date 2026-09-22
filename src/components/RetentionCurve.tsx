import React, { useState, useMemo } from "react";
import { RetentionPoint, VideoKeyframe } from "../types";
import { SpatialRetention3D } from "./SpatialRetention3D";
import {
  TrendingDown,
  TrendingUp,
  Sparkles,
  Activity,
  Clock,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Layers,
  Eye,
  Camera,
  Volume2,
  Scissors,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Lightbulb,
  MousePointer
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from "recharts";

import { parseTimestampToSeconds } from "./MiniVideoPlayer";

interface RetentionCurveProps {
  curve: RetentionPoint[];
  keyframes?: VideoKeyframe[];
  videoDurationSeconds?: number;
  onOpenKeyframeInsight?: (keyframe: VideoKeyframe) => void;
  onSeekToKeyframe?: (timeInSeconds: number) => void;
}

interface ShortFormAdvice {
  visualImpactAdvice: string;
  audioImpactAdvice: string;
}

export const RetentionCurve: React.FC<RetentionCurveProps> = ({
  curve,
  keyframes = [],
  videoDurationSeconds = 30,
  onOpenKeyframeInsight,
  onSeekToKeyframe,
}) => {
  const [viewEngine, setViewEngine] = useState<"3d" | "2d">("3d");
  const [selectedDuration, setSelectedDuration] = useState<number>(videoDurationSeconds);
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [highlightDropZones, setHighlightDropZones] = useState<boolean>(true);
  const [selectedKeyframe, setSelectedKeyframe] = useState<VideoKeyframe | null>(null);

  const handleSelectKeyframe = (kf: VideoKeyframe) => {
    setSelectedKeyframe(kf);
    if (onSeekToKeyframe) {
      const sec = parseTimestampToSeconds(kf.timeInSeconds ?? kf.timestamp);
      onSeekToKeyframe(sec);
    }
  };

  // Helper to format seconds into mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to generate specific, short-form actionable advice for visual and audio impact
  const getFrameAdvice = (kf: VideoKeyframe): ShortFormAdvice => {
    const type = kf.type;
    const score = kf.score || 85;

    let visualImpactAdvice = "";
    let audioImpactAdvice = "";

    if (type === "hook") {
      visualImpactAdvice = score >= 90
        ? "Center 3-word kinetic caption in top-third viewport with +15% visual contrast to lock first-frame attention."
        : "Trim 150ms leading dead-space & add a +15% optical zoom punch-in to prevent immediate scroll drop-off.";
      audioImpactAdvice = "Layer a punchy 0.1s pop or swoosh audio sting on frame 0 to trigger immediate auditory focus.";
    } else if (type === "pattern_break") {
      visualImpactAdvice = "Execute a rapid jump cut or camera angle shift to disrupt visual monotony and arrest scroll fatigue.";
      audioImpactAdvice = "Duck background music track by -6dB for 0.3s during the cut to heighten vocal clarity and punch.";
    } else if (type === "emotional_peak") {
      visualImpactAdvice = "Tighten framing on subject's facial expression (+10% warmth) to maximize mirror neuron engagement.";
      audioImpactAdvice = "Boost 2kHz–4kHz vocal presence and pair with a subtle rising sub-bass riser for peak emotional arousal.";
    } else if (type === "payoff") {
      visualImpactAdvice = "Display key result in center viewport with bold summary text overlay before looping.";
      audioImpactAdvice = "Fade audio with a smooth 0.3s riser sweep into a seamless loop restart sound buffer.";
    } else {
      visualImpactAdvice = "Maintain dynamic subject motion and sharp foreground optical contrast against background elements.";
      audioImpactAdvice = "Keep vocal cadence brisk and eliminate trailing audio silence gaps longer than 150ms.";
    }

    // If custom note contains specific advice, prefer or refine
    if (kf.note && kf.note.length > 10) {
      if (kf.note.toLowerCase().includes("visual") || kf.note.toLowerCase().includes("contrast")) {
        visualImpactAdvice = kf.note;
      }
    }

    return { visualImpactAdvice, audioImpactAdvice };
  };

  // Effective keyframes array (use passed keyframes or synthesize standard keyframe indicators)
  const effectiveKeyframes: VideoKeyframe[] = useMemo(() => {
    if (keyframes && keyframes.length > 0) {
      return keyframes;
    }
    // Default keyframe indicators matched to short-form timeline
    return [
      {
        timestamp: "00:00.5",
        timeInSeconds: 0.5,
        label: "0.5s Initial Visual Hook",
        type: "hook",
        score: 95,
        note: "High visual contrast & facial salience detected in frame 1",
        brainActivation: "Visual Cortex + Amygdala Peak",
      },
      {
        timestamp: "00:03.0",
        timeInSeconds: 3.0,
        label: "3.0s Pattern Break",
        type: "pattern_break",
        score: 88,
        note: "Secondary visual transition & kinetic caption shift",
        brainActivation: "Prefrontal Cortex + TPJ Alignment",
      },
      {
        timestamp: "00:15.0",
        timeInSeconds: 15.0,
        label: "15.0s Midpoint Emotional Peak",
        type: "emotional_peak",
        score: 92,
        note: "Peak emotional arousal & narrative curiosity buildup",
        brainActivation: "Limbic System + Mirror Neurons",
      },
      {
        timestamp: "00:27.0",
        timeInSeconds: 27.0,
        label: "27.0s Payoff & Loop Buffer",
        type: "payoff",
        score: 86,
        note: "Core value delivery and seamless loop transition point",
        brainActivation: "Reward Circuit + Hippocampus",
      },
    ];
  }, [keyframes]);

  // Process retention curve points with matched keyframes and benchmarks
  const chartData = useMemo(() => {
    const safeCurve = Array.isArray(curve) && curve.length > 0
      ? curve
      : [
          { t: 0, retention: 100 },
          { t: 25, retention: 92 },
          { t: 50, retention: 85 },
          { t: 75, retention: 78 },
          { t: 100, retention: 70 },
        ];

    return safeCurve.map((point) => {
      const safeT = typeof point?.t === "number" ? point.t : 0;
      const safeRetention = typeof point?.retention === "number" ? point.retention : 80;
      const timeInSec = (safeT / 100) * (selectedDuration || 30);
      const formattedTime = formatTime(timeInSec);

      // Benchmark curve (Top 5% Viral Benchmark)
      const benchmarkRetention = Math.max(
        55,
        100 - Math.pow(safeT / 100, 0.65) * 38
      );

      // Phase identification
      let phase = "Hook Phase";
      let phaseNote = "Critical 3s hook window. Viewers decide whether to stay or scroll.";
      if (safeT > 10 && safeT <= 30) {
        phase = "Setup Phase";
        phaseNote = "Context establishment. Keep visual rhythm dynamic.";
      } else if (safeT > 30 && safeT <= 70) {
        phase = "Core Narrative";
        phaseNote = "Value delivery. Maintain high audio-visual density to prevent drop-off.";
      } else if (safeT > 70 && safeT <= 90) {
        phase = "Climax / Payoff";
        phaseNote = "Peak emotional payoff or main takeaway reveal.";
      } else if (safeT > 90) {
        phase = "CTA & Outro";
        phaseNote = "Call to action or seamless loop transition point.";
      }

      // Delta compared to benchmark
      const delta = safeRetention - benchmarkRetention;

      // Find closest keyframe matching this time mark
      const matchedKeyframe = effectiveKeyframes.find((kf) => {
        const kfTimePct = (kf.timeInSeconds / (selectedDuration || 30)) * 100;
        return Math.abs(kfTimePct - safeT) <= 6; // within 6% timeline proximity
      });

      const frameAdvice = matchedKeyframe ? getFrameAdvice(matchedKeyframe) : null;

      return {
        t: safeT,
        timeSec: Number((timeInSec ?? 0).toFixed(1)),
        formattedTime,
        retention: Number((safeRetention ?? 0).toFixed(1)),
        benchmark: Number((benchmarkRetention ?? 0).toFixed(1)),
        delta: Number((delta ?? 0).toFixed(1)),
        phase,
        phaseNote,
        isDropRisk: safeRetention < 70,
        keyframe: matchedKeyframe || null,
        frameAdvice,
      };
    });
  }, [curve, selectedDuration, effectiveKeyframes]);

  // Derived Key Metrics
  const hookRetention = chartData.find((d) => d.t >= 10)?.retention ?? chartData[1]?.retention ?? 90;
  const midpointRetention = chartData.find((d) => d.t >= 50)?.retention ?? 80;
  const completionRate = chartData[chartData.length - 1]?.retention ?? 70;

  // Calculate Average Watch Time
  const avgWatchPercentage = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + (curr.retention || 0), 0);
    return sum / chartData.length;
  }, [chartData]);

  const avgWatchSeconds = (((avgWatchPercentage || 0) / 100) * (selectedDuration || 30)).toFixed(1);
  const firstRetention = chartData[0]?.retention ?? 100;
  const netDropOff = (firstRetention - completionRate).toFixed(1);

  if (!curve || curve.length === 0) return null;

  // Active highlighted keyframe (defaults to first keyframe if none selected)
  const activeDisplayKeyframe = selectedKeyframe || effectiveKeyframes[0] || null;
  const activeKeyframeAdvice = activeDisplayKeyframe ? getFrameAdvice(activeDisplayKeyframe) : null;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const kf = data.keyframe as VideoKeyframe | null;
      const advice = data.frameAdvice as ShortFormAdvice | null;

      return (
        <div className="bg-[#111111] text-white p-4 rounded-xs border border-neutral-700 shadow-2xl font-mono text-xs max-w-sm space-y-3 z-50">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {data.formattedTime} ({data.t}%)
            </span>
            <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-xs text-neutral-300 font-semibold uppercase">
              {data.phase}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Predicted Retention:</span>
              <span className="font-extrabold text-base text-white">{data.retention}%</span>
            </div>

            {showBenchmark && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-neutral-400">Top 5% Benchmark:</span>
                <span className="text-neutral-300 font-semibold">{data.benchmark}%</span>
              </div>
            )}
          </div>

          {/* Interactive Keyframe Analysis Indicator Badge inside Tooltip */}
          {kf && advice ? (
            <div className="bg-neutral-900 border border-amber-500/40 p-3 rounded-xs space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold border-b border-neutral-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  KEYFRAME INDICATOR: {kf.timestamp}
                </span>
                <span className="bg-amber-400 text-neutral-950 text-[10px] px-1.5 py-0.2 rounded-2xs font-extrabold uppercase">
                  {kf.type}
                </span>
              </div>

              {kf.imageData && (
                <div className="w-full h-24 rounded-2xs overflow-hidden border border-neutral-700 bg-neutral-950">
                  <img
                    src={kf.imageData}
                    alt={kf.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Specific Actionable Advice for Visual & Audio Impact */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-2xs space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1 text-[10px] uppercase">
                    <Eye className="w-3 h-3 text-amber-400" /> Visual Impact Advice
                  </span>
                  <p className="text-neutral-200 text-[11px] leading-snug">
                    {advice.visualImpactAdvice}
                  </p>
                </div>

                <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-2xs space-y-1">
                  <span className="font-bold text-indigo-300 flex items-center gap-1 text-[10px] uppercase">
                    <Volume2 className="w-3 h-3 text-indigo-400" /> Audio Impact Advice
                  </span>
                  <p className="text-neutral-200 text-[11px] leading-snug">
                    {advice.audioImpactAdvice}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-neutral-300 bg-neutral-900 p-2 rounded-xs border border-neutral-800 leading-snug">
              {data.phaseNote}
            </p>
          )}

          <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono pt-1">
            <MousePointer className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Click keyframe indicator below for deep-dive frame controls</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom keyframe dot renderer for Recharts
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;

    const hasKf = !!payload.keyframe;
    const isSelected = selectedKeyframe && payload.keyframe?.timestamp === selectedKeyframe.timestamp;

    if (hasKf) {
      return (
        <g
          key={`dot-kf-${payload.t}`}
          className="cursor-pointer"
          onClick={() => setSelectedKeyframe(payload.keyframe)}
        >
          {/* Glowing outer aura for keyframe indicator */}
          <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 10 : 7}
            className={`${isSelected ? "fill-amber-400 stroke-amber-600 animate-pulse" : "fill-[#111111] stroke-amber-400 hover:fill-amber-500"} transition-all`}
            strokeWidth={2}
          />
          {/* Center visual indicator dot */}
          <circle cx={cx} cy={cy} r={2.5} fill="#FFFFFF" />
        </g>
      );
    }

    return <circle cx={cx} cy={cy} r={3} fill="#111111" stroke="#FFFFFF" strokeWidth={2} />;
  };

  return (
    <div className="cyber-glass border border-white/10 rounded-xs p-6 shadow-2xl space-y-6">
      {/* Module Header */}
      <div className="border-b border-white/10 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#00F5D4] text-black text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
              AI Retention Physics
            </span>
            <span className="text-xs font-mono text-neutral-400">
              Interactive Keyframe Impact Model
            </span>
          </div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
            Predicted Audience Retention Curve
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Simulated viewer drop-off trajectory with interactive keyframe analysis indicators & visual/audio directives.
          </p>
        </div>

        {/* Duration & Engine Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* 3D vs 2D Toggle */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/15 p-1 rounded-xs text-xs font-mono">
            <button
              onClick={() => setViewEngine("3d")}
              className={`px-3 py-1 rounded-xs font-bold transition-all flex items-center gap-1.5 ${
                viewEngine === "3d"
                  ? "bg-[#00F5D4] text-black shadow-md shadow-[#00F5D4]/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Spatial Lab ⚡</span>
            </button>
            <button
              onClick={() => setViewEngine("2d")}
              className={`px-3 py-1 rounded-xs font-bold transition-all flex items-center gap-1.5 ${
                viewEngine === "2d"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>2D Precision Chart</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xs text-xs font-mono">
            <span className="text-neutral-400 px-1.5 font-semibold text-[10px] uppercase">Duration:</span>
            {[15, 30, 60, 90].map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`px-2 py-1 rounded-xs font-bold transition-all ${
                  selectedDuration === dur
                    ? "bg-[#00F5D4] text-black shadow-md font-bold"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Milestone Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 font-bold">
            <span>3s HOOK HOLD</span>
            <Zap className="w-3.5 h-3.5 text-[#00F5D4]" />
          </div>
          <div className="text-2xl font-display font-extrabold text-[#00F5D4]">
            {hookRetention}%
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            {hookRetention >= 85 ? "🔥 Strong Hook Retention" : "⚠️ High Early Scroll Risk"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 font-bold">
            <span>MIDPOINT HOLD</span>
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-indigo-400">
            {midpointRetention}%
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            At {formatTime(selectedDuration * 0.5)} ({selectedDuration * 0.5}s mark)
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 font-bold">
            <span>AVG WATCH TIME</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-400">
            {avgWatchSeconds}s
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            {(avgWatchPercentage ?? 0).toFixed(1)}% Avg Watch Duration
          </p>
        </div>

        <div className="bg-[#F8F9FA] border border-[#E5E5E5] p-3.5 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-600 font-bold">
            <span>COMPLETION RATE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-display font-extrabold text-[#111111]">
            {completionRate}%
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">
            Net Drop-off: -{netDropOff}%
          </p>
        </div>
      </div>

      {/* Main Plot Container: 3D Spatial Lab or 2D Precision Plot */}
      {viewEngine === "3d" ? (
        <SpatialRetention3D
          curve={curve}
          keyframes={effectiveKeyframes}
          videoDurationSeconds={selectedDuration}
          onOpenKeyframeInsight={onOpenKeyframeInsight}
          onSeekToKeyframe={onSeekToKeyframe}
        />
      ) : (
        /* Main Recharts Plot Container */
        <div className="bg-[#FAFBFD] border border-[#E5E5E5] rounded-sm p-4 relative space-y-4">
        {/* Toggle Overlay Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showBenchmark}
                onChange={(e) => setShowBenchmark(e.target.checked)}
                className="accent-[#111111] rounded-xs w-3.5 h-3.5"
              />
              <span className="font-semibold text-neutral-800">Show Top 5% Viral Benchmark</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highlightDropZones}
                onChange={(e) => setHighlightDropZones(e.target.checked)}
                className="accent-rose-600 rounded-xs w-3.5 h-3.5"
              />
              <span className="font-semibold text-neutral-800">Highlight 70% Drop Threshold</span>
            </label>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-full border border-amber-600 inline-block"></span>
              <span className="font-bold text-neutral-900">Keyframe Analysis Indicator</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#111111] rounded-xs inline-block"></span>
              <span className="font-bold">Predicted Retention</span>
            </span>
            {showBenchmark && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-neutral-400 border-t border-dashed border-neutral-600 inline-block"></span>
                <span className="text-neutral-600">Top 5% Benchmark</span>
              </span>
            )}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <defs>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F5D4" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />

              <XAxis
                dataKey="timeSec"
                stroke="#666666"
                tickLine={false}
                fontSize={11}
                fontFamily="Space Mono, monospace"
                tickFormatter={(value) => `${value}s`}
                dy={8}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                stroke="#666666"
                tickLine={false}
                fontSize={11}
                fontFamily="Space Mono, monospace"
                tickFormatter={(value) => `${value}%`}
                dx={-4}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* 70% Critical Retention Benchmark Line */}
              {highlightDropZones && (
                <ReferenceLine
                  y={70}
                  stroke="#E11D48"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "70% Critical Retention Threshold",
                    fill: "#E11D48",
                    fontSize: 10,
                    fontFamily: "Space Mono, monospace",
                    position: "insideTopRight",
                    dy: -12,
                  }}
                />
              )}

              {/* 3 Seconds Hook Boundary Line */}
              <ReferenceLine
                x={3}
                stroke="#D97706"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: "3s Hook Window Boundary",
                  fill: "#D97706",
                  fontSize: 10,
                  fontFamily: "Space Mono, monospace",
                  position: "insideTopLeft",
                  dy: -12,
                }}
              />

              {/* Industry Benchmark Dashed Line */}
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#888888"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                />
              )}

              {/* Predicted Video Retention Main Area Curve */}
              <Area
                type="monotone"
                dataKey="retention"
                stroke="#111111"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#predictedGradient)"
                dot={renderCustomDot}
                activeDot={{ r: 7, fill: "#D97706", stroke: "#FFFFFF", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Phase Annotations Footer */}
        <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#E5E5E5] text-[11px] font-mono text-center">
          <div className="p-1.5 rounded-xs bg-amber-50 border border-amber-200 text-amber-900 font-bold">
            0-10% (0-3s)
            <div className="font-normal text-[10px] text-amber-800">Visual Hook</div>
          </div>
          <div className="p-1.5 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold">
            10-30%
            <div className="font-normal text-[10px] text-neutral-600">Setup & Context</div>
          </div>
          <div className="p-1.5 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold">
            30-70%
            <div className="font-normal text-[10px] text-neutral-600">Core Payload</div>
          </div>
          <div className="p-1.5 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold">
            70-90%
            <div className="font-normal text-[10px] text-neutral-600">Climax Peak</div>
          </div>
          <div className="p-1.5 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold">
            90-100%
            <div className="font-normal text-[10px] text-neutral-600">Outro / Loop CTA</div>
          </div>
        </div>
      </div>
    )}

      {/* Interactive Keyframe Analysis Indicators Ribbon */}
      <div className="bg-[#111111] text-white p-5 rounded-sm border border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="font-mono text-xs font-bold uppercase text-white tracking-wider">
              Interactive Keyframe Impact Directives
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Select a frame indicator to reveal short-form visual & audio directives
          </span>
        </div>

        {/* Keyframe Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {effectiveKeyframes.map((kf, idx) => {
            const isSelected = activeDisplayKeyframe?.timestamp === kf.timestamp;
            return (
              <button
                key={idx}
                onClick={() => handleSelectKeyframe(kf)}
                className={`p-2.5 rounded-xs border text-left transition-all font-mono text-xs space-y-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md scale-[1.02]"
                    : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-850"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-2xs ${
                    isSelected ? "bg-neutral-950 text-amber-400" : "bg-neutral-800 text-amber-300"
                  }`}>
                    {kf.timestamp}
                  </span>
                  <span className={`text-[10px] font-bold ${isSelected ? "text-neutral-900" : "text-neutral-400"}`}>
                    Score: {kf.score || 85}
                  </span>
                </div>
                <div className="truncate text-[11px] font-semibold">
                  {kf.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actionable Visual & Audio Impact Directives Card */}
        {activeDisplayKeyframe && activeKeyframeAdvice && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xs p-4 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                {activeDisplayKeyframe.imageData && (
                  <img
                    src={activeDisplayKeyframe.imageData}
                    alt={activeDisplayKeyframe.label}
                    className="w-12 h-12 rounded-2xs object-cover border border-neutral-700 bg-black shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-amber-400">
                      {activeDisplayKeyframe.timestamp}
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-500/30 font-mono px-2 py-0.5 rounded-2xs uppercase font-bold">
                      {activeDisplayKeyframe.type}
                    </span>
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-white mt-0.5">
                    {activeDisplayKeyframe.label}
                  </h4>
                </div>
              </div>

              {onOpenKeyframeInsight && (
                <button
                  onClick={() => onOpenKeyframeInsight(activeDisplayKeyframe)}
                  className="bg-white hover:bg-neutral-200 text-neutral-950 px-3 py-1.5 text-xs font-mono font-bold rounded-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-2xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Inspect Screenshot & Brain Map</span>
                </button>
              )}
            </div>

            {/* Actionable Visual & Audio Guidance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-black/60 border border-amber-500/30 p-3 rounded-2xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px] uppercase">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    VISUAL IMPACT DIRECTIVE
                  </span>
                  <span className="text-[9px] text-neutral-400">FPS / OPTICAL</span>
                </div>
                <p className="text-neutral-200 text-xs leading-relaxed">
                  {activeKeyframeAdvice.visualImpactAdvice}
                </p>
              </div>

              <div className="bg-black/60 border border-indigo-500/30 p-3 rounded-2xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    AUDIO IMPACT DIRECTIVE
                  </span>
                  <span className="text-[9px] text-neutral-400">AUDIO CADENCE</span>
                </div>
                <p className="text-neutral-200 text-xs leading-relaxed">
                  {activeKeyframeAdvice.audioImpactAdvice}
                </p>
              </div>
            </div>

            {activeDisplayKeyframe.brainActivation && (
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Neural Signal Correlate: <strong className="text-amber-300">{activeDisplayKeyframe.brainActivation}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Retention Diagnostic Note */}
      <div className="bg-[#F4F4F4] border border-[#E5E5E5] p-4 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-[#111111]">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] block text-neutral-800">
              Retention Optimization Directive:
            </span>
            <p className="text-[#333333] text-xs leading-relaxed">
              {hookRetention < 85
                ? "Early drop-off predicted in the first 3 seconds. Inject an immediate visual pattern break, bold text overlay, or audio impact within 0.5s to increase initial retention by +12-18%."
                : "Strong hook hold detected! To maintain this momentum past 50% timeline, introduce a secondary narrative curiosity loop or keyframe shift at the midpoint."}
            </p>
          </div>
        </div>

        <div className="shrink-0 font-bold bg-white border border-[#E5E5E5] px-3 py-1.5 rounded-xs shadow-2xs text-[11px]">
          SIMULATED FYP AUDIENCE REACH: <span className="text-emerald-700">{avgWatchPercentage > 70 ? "HIGH (TOP 10%)" : "MODERATE"}</span>
        </div>
      </div>
    </div>
  );
};
