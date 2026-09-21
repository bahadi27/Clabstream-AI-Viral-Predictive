import React, { useState, useEffect } from "react";

interface DotMatrixDisplayProps {
  label?: string;
  statusText?: string;
  score?: number;
  rows?: number;
  cols?: number;
  color?: "cyan" | "amber" | "violet" | "emerald";
  className?: string;
  animated?: boolean;
}

export const DotMatrixDisplay: React.FC<DotMatrixDisplayProps> = ({
  label = "SYSTEM STATUS",
  statusText = "NEURAL COGNITIVE SCAN ACTIVE",
  score = 85,
  rows = 5,
  cols = 28,
  color = "cyan",
  className = "",
  animated = true,
}) => {
  const [pulseFrame, setPulseFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setPulseFrame((prev) => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, [animated]);

  const getColorConfig = () => {
    switch (color) {
      case "amber":
        return {
          activeDot: "bg-amber-400 shadow-[0_0_6px_#f59e0b]",
          dimDot: "bg-amber-950/40",
          textColor: "text-amber-400",
          borderColor: "border-amber-500/30",
        };
      case "violet":
        return {
          activeDot: "bg-purple-400 shadow-[0_0_6px_#c084fc]",
          dimDot: "bg-purple-950/40",
          textColor: "text-purple-400",
          borderColor: "border-purple-500/30",
        };
      case "emerald":
        return {
          activeDot: "bg-emerald-400 shadow-[0_0_6px_#10b981]",
          dimDot: "bg-emerald-950/40",
          textColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
        };
      case "cyan":
      default:
        return {
          activeDot: "bg-[#00F5D4] shadow-[0_0_6px_#00F5D4]",
          dimDot: "bg-[#00F5D4]/10",
          textColor: "text-[#00F5D4]",
          borderColor: "border-[#00F5D4]/30",
        };
    }
  };

  const c = getColorConfig();

  // Determine which dots in the matrix are illuminated
  const isDotLit = (r: number, col: number) => {
    // Wave pattern traveling across cols
    const wave1 = Math.sin((col * 0.35) + pulseFrame * 0.25) * 1.8 + 2;
    const wave2 = Math.cos((col * 0.5) - pulseFrame * 0.15) * 1.2 + 2;

    // Score gauge filling left-to-right on bottom row
    if (r === rows - 1) {
      const activeThreshold = Math.floor((score / 100) * cols);
      return col <= activeThreshold;
    }

    // Soundwave / signal analyzer pattern on middle rows
    if (Math.abs(r - wave1) < 0.85 || Math.abs(r - wave2) < 0.65) {
      return true;
    }

    // Random sparkle dots
    if ((col + r * 7 + pulseFrame) % 19 === 0) {
      return true;
    }

    return false;
  };

  return (
    <div
      className={`bg-[#05070a] border ${c.borderColor} rounded-xs p-3 font-mono select-none relative overflow-hidden shadow-inner ${className}`}
      style={{
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${c.activeDot} animate-ping`} />
          <span className="text-neutral-400 font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${c.textColor}`}>{statusText}</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-xs bg-white/10 text-neutral-300">
            {score}/100
          </span>
        </div>
      </div>

      {/* LED Dot Matrix Grid Container */}
      <div className="flex flex-col gap-[3px] py-1 bg-[#020305] p-2 rounded-xs border border-white/5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-[3px] justify-between items-center">
            {Array.from({ length: cols }).map((_, col) => {
              const lit = isDotLit(r, col);
              return (
                <div
                  key={col}
                  className={`w-[4.5px] h-[4.5px] rounded-full transition-colors duration-150 ${
                    lit ? c.activeDot : c.dimDot
                  }`}
                  style={{
                    opacity: lit ? 1 : 0.35,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Sub-Telemetry readout */}
      <div className="flex justify-between items-center mt-2 text-[9px] text-neutral-400 pt-1 border-t border-white/5">
        <span className="tracking-widest">DOT_MATRIX_RENDER::V2.4</span>
        <span className="text-neutral-300 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
          MULTIMODAL SYNC 60FPS
        </span>
      </div>
    </div>
  );
};
