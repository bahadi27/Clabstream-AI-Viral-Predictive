import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Flame, X, PartyPopper } from "lucide-react";

interface BalloonItem {
  id: number;
  x: number; // percentage across screen 5% - 95%
  size: number; // in pixels
  color: string;
  glow: string;
  speed: number; // duration in seconds
  delay: number; // delay in seconds
  label?: string;
  popped: boolean;
}

interface CelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  viralityScore?: number;
  title?: string;
}

const BALLOON_PALETTES = [
  { color: "#00F5D4", glow: "rgba(0, 245, 212, 0.6)", label: "VIRAL 95%" },
  { color: "#FF0055", glow: "rgba(255, 0, 85, 0.6)", label: "EXPLOSIVE" },
  { color: "#7B2CBF", glow: "rgba(123, 44, 191, 0.6)", label: "FYP PUSH" },
  { color: "#FFB703", glow: "rgba(255, 183, 3, 0.6)", label: "100k+ VIEWS" },
  { color: "#818CF8", glow: "rgba(129, 140, 248, 0.6)", label: "TOP 1%" },
];

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isOpen,
  onClose,
  viralityScore = 88,
  title = "Viral Breakthrough Achieved!",
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [popCount, setPopCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Generate 18 floating physics balloons
      const newBalloons: BalloonItem[] = Array.from({ length: 18 }).map((_, i) => {
        const palette = BALLOON_PALETTES[i % BALLOON_PALETTES.length];
        return {
          id: i,
          x: 5 + Math.random() * 88,
          size: 55 + Math.random() * 45,
          color: palette.color,
          glow: palette.glow,
          speed: 4.5 + Math.random() * 4.5,
          delay: Math.random() * 2.5,
          label: palette.label,
          popped: false,
        };
      });
      setBalloons(newBalloons);
      setPopCount(0);
    }
  }, [isOpen]);

  const handlePopBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setPopCount((c) => c + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center overflow-hidden bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Background Floating Balloons with Physics Upward Motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-auto">
        {balloons.map((b) => {
          if (b.popped) return null;
          return (
            <motion.div
              key={b.id}
              initial={{ y: "115vh", x: `${b.x}vw`, opacity: 0, scale: 0.8 }}
              animate={{
                y: "-25vh",
                x: [`${b.x}vw`, `${b.x + (Math.random() * 8 - 4)}vw`, `${b.x}vw`],
                opacity: [0, 0.95, 0.95, 0],
                scale: 1,
              }}
              transition={{
                duration: b.speed,
                delay: b.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={() => handlePopBalloon(b.id)}
              className="absolute cursor-pointer select-none group"
              style={{
                width: b.size,
                height: b.size * 1.25,
              }}
            >
              {/* Balloon Body */}
              <div
                className="w-full h-full rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] relative flex flex-col items-center justify-center p-2 shadow-2xl transition-transform group-hover:scale-110 active:scale-95"
                style={{
                  background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${b.color} 45%, #050505 100%)`,
                  boxShadow: `0 0 30px ${b.glow}, inset 0 2px 4px rgba(255,255,255,0.7)`,
                  border: `1px solid ${b.color}`,
                }}
              >
                {/* Specular Highlight Gloss Dot */}
                <div className="absolute top-2 left-2.5 w-3 h-2 rounded-full bg-white/70 rotate-[-30deg]" />

                {/* Micro Label inside balloon */}
                {b.label && (
                  <span className="font-mono text-[9px] font-extrabold text-black bg-white/80 px-1 rounded-xs shadow-xs uppercase tracking-tighter">
                    {b.label}
                  </span>
                )}

                {/* Balloon Knot & String */}
                <div
                  className="absolute -bottom-1.5 w-2 h-1.5 rounded-xs"
                  style={{ backgroundColor: b.color }}
                />
                <div className="absolute -bottom-7 w-[1px] h-6 bg-white/40 skew-x-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center Modal Dialogue */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative z-50 max-w-lg w-full mx-4 cyber-glass bg-[#080a0f]/95 border-2 border-[#00F5D4]/60 p-6 md:p-8 rounded-xs shadow-[0_0_60px_rgba(0,245,212,0.25)] text-white text-center"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-[#00F5D4]/20 to-[#FF0055]/20 border border-[#00F5D4]/50 mb-4 shadow-lg shadow-[#00F5D4]/20">
          <PartyPopper className="w-8 h-8 text-[#00F5D4] animate-bounce" />
        </div>

        <div className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Algorithmic Breakthrough</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight mb-2">
          {title}
        </h2>

        <p className="text-xs md:text-sm text-neutral-300 mb-6 leading-relaxed">
          Your video scored in the top percentile with a <strong className="text-[#00F5D4] font-mono text-base">{viralityScore}/100</strong> virality index. High retention hold & share velocity trigger priority algorithmic distribution!
        </p>

        {/* Score & Stats Pill */}
        <div className="grid grid-cols-3 gap-3 bg-white/5 border border-white/10 p-3 rounded-xs mb-6 font-mono">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase">Virality</div>
            <div className="text-lg font-black text-[#00F5D4]">{viralityScore}/100</div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase">FYP Tier</div>
            <div className="text-lg font-black text-amber-400">Tier 1 Push</div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase">Popped</div>
            <div className="text-lg font-black text-purple-400">{popCount} 🎈</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#00F5D4] hover:bg-teal-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs shadow-lg shadow-[#00F5D4]/30 transition-all hover:scale-105"
          >
            Explore Full Intelligence Report
          </button>
        </div>

        <p className="text-[10px] font-mono text-neutral-400 mt-4">
          Tip: Tap any floating balloon on screen to pop it! 🎈
        </p>
      </motion.div>
    </div>
  );
};
