import React from "react";
import { RetentionPoint } from "../types";
import { TrendingDown, Sparkles, Activity } from "lucide-react";

interface RetentionCurveProps {
  curve: RetentionPoint[];
}

export const RetentionCurve: React.FC<RetentionCurveProps> = ({ curve }) => {
  if (!curve || curve.length === 0) return null;

  // SVG dimensions
  const width = 600;
  const height = 220;
  const padding = 35;

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  // Convert timeline points (0-100) and retention (0-100) to SVG coordinates
  const points = curve.map((p) => {
    const x = padding + (p.t / 100) * innerW;
    const y = height - padding - (p.retention / 100) * innerH;
    return { x, y, t: p.t, retention: p.retention };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }, "");

  // Area fill under curve
  const areaD = `${pathD} L ${(padding + innerW).toFixed(1)},${(height - padding).toFixed(
    1
  )} L ${padding.toFixed(1)},${(height - padding).toFixed(1)} Z`;

  // Calculate overall drop-off
  const startVal = curve[0]?.retention ?? 100;
  const endVal = curve[curve.length - 1]?.retention ?? 80;
  const dropOff = startVal - endVal;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 mb-6 flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
            Audience Retention & Hold Trajectory
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Retention Curve (11-Point Model)
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-[#F4F4F4] border border-[#E5E5E5] px-3.5 py-1.5 text-xs font-mono font-bold rounded-sm text-[#111111]">
          <TrendingDown className="w-4 h-4 text-[#111111]" />
          <span>NET DROP-OFF: {dropOff.toFixed(1)}%</span>
        </div>
      </div>

      <div className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm p-5 relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = height - padding - (val / 100) * innerH;
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#E5E5E5"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="Space Mono, monospace"
                  fill="#333333"
                  fontWeight="bold"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Timeline X-axis Labels */}
          {[0, 20, 40, 60, 80, 100].map((t) => {
            const x = padding + (t / 100) * innerW;
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={height - padding}
                  x2={x}
                  y2={height - padding + 5}
                  stroke="#444444"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding + 18}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Space Mono, monospace"
                  fill="#333333"
                  fontWeight="bold"
                >
                  {t}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="#111111" opacity="0.12" />

          {/* Main Curve Path */}
          <path d={pathD} fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" />

          {/* Point Nodes */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#111111"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-transform group-hover:scale-150"
              />
            </g>
          ))}
        </svg>

        <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs font-mono text-[#333333] bg-white border border-[#E5E5E5] p-3.5 rounded-xs">
          <div>
            <span className="font-bold text-[#111111]">FIRST 3s HOOK:</span>{" "}
            {curve[2]?.retention ?? 90}% Retention
          </div>
          <div>
            <span className="font-bold text-[#111111]">MIDPOINT HOLD:</span>{" "}
            {curve[5]?.retention ?? 85}% Retention
          </div>
          <div>
            <span className="font-bold text-[#111111]">COMPLETION:</span>{" "}
            {curve[10]?.retention ?? 80}% Completion Rate
          </div>
        </div>
      </div>
    </div>
  );
};
