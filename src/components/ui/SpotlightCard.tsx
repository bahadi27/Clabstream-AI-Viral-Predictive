import React, { useRef, useState, MouseEvent } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
  withBorderBeam?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(0, 245, 212, 0.15)",
  borderColor = "rgba(255, 255, 255, 0.1)",
  withBorderBeam = false,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xs bg-[#0c0e14]/80 backdrop-blur-xl border transition-all duration-300 ${className}`}
      style={{
        borderColor: borderColor,
        ...props.style,
      }}
      {...props}
    >
      {/* Interactive Radial Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Subtle Specular Border Highlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.25), transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Animated Border Beam if enabled */}
      {withBorderBeam && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xs">
          <div className="border-beam-line" />
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};
