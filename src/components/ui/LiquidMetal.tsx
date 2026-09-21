import React, { useRef, useState, MouseEvent } from "react";
import { motion } from "motion/react";

interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "cyan" | "chrome" | "violet" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
}

export const LiquidMetalButton: React.FC<LiquidMetalButtonProps> = ({
  children,
  variant = "cyan",
  size = "md",
  className = "",
  glow = true,
  onClick,
  ...props
}) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "cyan":
        return {
          baseBg: "bg-gradient-to-b from-[#0a1917] via-[#050c0b] to-[#020505]",
          borderGradient: "from-[#00F5D4] via-[#059669] to-[#00F5D4]",
          sheenGradient: "radial-gradient(circle at " + mousePos.x + "% " + mousePos.y + "%, rgba(0, 245, 212, 0.45) 0%, rgba(0, 245, 212, 0.1) 40%, transparent 70%)",
          glowColor: "rgba(0, 245, 212, 0.3)",
          textColor: "text-[#00F5D4]",
          borderColor: "rgba(0, 245, 212, 0.5)",
        };
      case "violet":
        return {
          baseBg: "bg-gradient-to-b from-[#1a0f26] via-[#0d0714] to-[#040207]",
          borderGradient: "from-[#c084fc] via-[#7e22ce] to-[#c084fc]",
          sheenGradient: "radial-gradient(circle at " + mousePos.x + "% " + mousePos.y + "%, rgba(192, 132, 252, 0.45) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 70%)",
          glowColor: "rgba(168, 85, 247, 0.3)",
          textColor: "text-purple-300",
          borderColor: "rgba(192, 132, 252, 0.5)",
        };
      case "gold":
        return {
          baseBg: "bg-gradient-to-b from-[#241a08] via-[#120d03] to-[#060401]",
          borderGradient: "from-[#fbbf24] via-[#b45309] to-[#fbbf24]",
          sheenGradient: "radial-gradient(circle at " + mousePos.x + "% " + mousePos.y + "%, rgba(251, 191, 36, 0.45) 0%, rgba(217, 119, 6, 0.1) 40%, transparent 70%)",
          glowColor: "rgba(245, 158, 11, 0.3)",
          textColor: "text-amber-300",
          borderColor: "rgba(251, 191, 36, 0.5)",
        };
      case "chrome":
      default:
        return {
          baseBg: "bg-gradient-to-b from-[#222730] via-[#14171d] to-[#0a0c0f]",
          borderGradient: "from-neutral-200 via-neutral-500 to-neutral-200",
          sheenGradient: "radial-gradient(circle at " + mousePos.x + "% " + mousePos.y + "%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)",
          glowColor: "rgba(255, 255, 255, 0.2)",
          textColor: "text-white",
          borderColor: "rgba(255, 255, 255, 0.4)",
        };
    }
  };

  const v = getVariantStyles();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-mono gap-1.5",
    md: "px-4 py-2.5 text-xs font-mono font-bold tracking-wider gap-2",
    lg: "px-6 py-3.5 text-sm font-mono font-bold tracking-wider gap-2.5",
  }[size];

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-xs overflow-hidden transition-all duration-300 select-none cursor-pointer group ${sizeClasses} ${className}`}
      style={{
        boxShadow: glow && isHovered ? `0 0 25px ${v.glowColor}, inset 0 1px 1px rgba(255,255,255,0.3)` : "inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
      {...(props as any)}
    >
      {/* Outer Metallic Bevel Gradient Border */}
      <div
        className="absolute inset-0 p-[1px] rounded-xs pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${v.borderColor} 0%, rgba(255,255,255,0.05) 50%, ${v.borderColor} 100%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Deep Metallic Base Container */}
      <div className={`absolute inset-[1px] rounded-xs ${v.baseBg} z-0`} />

      {/* Brushed Texture Lines */}
      <div
        className="absolute inset-[1px] opacity-25 z-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Specular Liquid Light Sheen Following Mouse */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: v.sheenGradient,
          opacity: isHovered ? 1 : 0.25,
        }}
      />

      {/* Sweeping Linear Highlight on Hover */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="w-[40%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-25deg] transform -translate-x-[200%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Button Content */}
      <span className={`relative z-20 flex items-center justify-center ${v.textColor}`}>
        {children}
      </span>
    </motion.button>
  );
};

export const MetalBadge: React.FC<{
  children: React.ReactNode;
  variant?: "cyan" | "chrome" | "gold" | "violet";
  className?: string;
  icon?: React.ReactNode;
}> = ({ children, variant = "cyan", className = "", icon }) => {
  const getBadgeColors = () => {
    switch (variant) {
      case "cyan":
        return "bg-gradient-to-b from-[#00F5D4]/20 to-[#00F5D4]/5 border-[#00F5D4]/40 text-[#00F5D4]";
      case "gold":
        return "bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-300";
      case "violet":
        return "bg-gradient-to-b from-purple-500/20 to-purple-500/5 border-purple-500/40 text-purple-300";
      case "chrome":
      default:
        return "bg-gradient-to-b from-white/15 to-white/5 border-white/25 text-neutral-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs font-mono text-[11px] font-bold border shadow-xs tracking-wider uppercase select-none ${getBadgeColors()} ${className}`}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
