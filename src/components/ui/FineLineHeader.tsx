import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

export type FineLineVariant = "underline" | "strikethrough" | "horizon" | "both";

interface FineLineHeaderProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "div" | "span";
  variant?: FineLineVariant;
  className?: string;
  lineClassName?: string;
  tag?: string;
  secondaryTag?: string;
  delay?: number;
  duration?: number;
  lineColor?: string;
  interactive?: boolean;
}

/**
 * Editorial Fine-Line Header
 * Implements high-end minimalist studio typography with scroll-triggered
 * hairline underlines, strikethroughs, and architectural horizon rules.
 */
export const FineLineHeader: React.FC<FineLineHeaderProps> = ({
  children,
  as: Component = "h2",
  variant = "underline",
  className = "",
  lineClassName = "",
  tag,
  secondaryTag,
  delay = 0.1,
  duration = 0.85,
  lineColor = "rgba(255, 255, 255, 0.25)",
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-12% 0px -12% 0px" });

  const easeBezier = [0.16, 1, 0.3, 1] as const;

  return (
    <div ref={containerRef} className="relative group/fineline select-none">
      {/* Optional Editorial Technical Metadata Top Bar */}
      {(tag || secondaryTag) && (
        <div className="flex items-center justify-between gap-3 mb-2 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
          {tag && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.5, ease: easeBezier, delay }}
              className="inline-flex items-center gap-1.5 text-neutral-300"
            >
              <span className="w-1.5 h-1.5 bg-[#00F5D4]" />
              <span>{tag}</span>
            </motion.span>
          )}
          {secondaryTag && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
              transition={{ duration: 0.5, ease: easeBezier, delay: delay + 0.1 }}
              className="text-neutral-500"
            >
              {secondaryTag}
            </motion.span>
          )}
        </div>
      )}

      {/* Main Heading Text with Strikethrough / Underline / Horizon */}
      <div className="relative inline-flex items-center flex-wrap gap-4 w-full">
        <div className="relative inline-block">
          {/* Main Title Component */}
          <Component className={`relative z-10 ${className}`}>
            {children}
          </Component>

          {/* Strikethrough Fine-Line */}
          {(variant === "strikethrough" || variant === "both") && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration, ease: easeBezier, delay: delay + 0.15 }}
              style={{ originX: 0, backgroundColor: lineColor }}
              className={`absolute top-1/2 left-0 right-0 h-[1px] pointer-events-none z-20 ${
                interactive ? "group-hover/fineline:bg-[#00F5D4] transition-colors duration-500" : ""
              } ${lineClassName}`}
            />
          )}

          {/* Underline Fine-Line */}
          {(variant === "underline" || variant === "both") && (
            <div className="absolute -bottom-1.5 left-0 right-0 h-[1px] overflow-hidden pointer-events-none z-20">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration, ease: easeBezier, delay }}
                style={{ originX: 0, backgroundColor: lineColor }}
                className={`w-full h-full ${
                  interactive ? "group-hover/fineline:bg-[#00F5D4] transition-colors duration-500" : ""
                } ${lineClassName}`}
              />
            </div>
          )}
        </div>

        {/* Horizon Line (Full-width trailing architectural rule) */}
        {(variant === "horizon" || variant === "both") && (
          <div className="relative flex-1 hidden sm:flex items-center min-w-[60px] h-[1px] overflow-visible">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: duration * 1.15, ease: easeBezier, delay: delay + 0.1 }}
              style={{ originX: 0, backgroundColor: lineColor }}
              className={`w-full h-[1px] relative ${
                interactive ? "group-hover/fineline:bg-[#00F5D4] transition-colors duration-500" : ""
              }`}
            >
              {/* Terminal Crosshair / Pip */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: delay + duration }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/40 border border-white/60"
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Editorial StrikeText
 * A localized span component that strikes a hairline across a specific word or phrase on scroll
 */
export const StrikeText: React.FC<{
  children: React.ReactNode;
  className?: string;
  activeColor?: string;
}> = ({ children, className = "", activeColor = "#00F5D4" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ originX: 0 }}
        className="absolute top-[52%] left-0 right-0 h-[1px] bg-current opacity-70 pointer-events-none"
      />
    </span>
  );
};
