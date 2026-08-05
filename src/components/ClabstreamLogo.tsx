import React from "react";

interface ClabstreamLogoProps {
  className?: string;
  variant?: "dark" | "light";
  showText?: boolean;
}

export const ClabstreamLogo: React.FC<ClabstreamLogoProps> = ({
  className = "h-9 w-auto",
  variant = "dark",
  showText = true,
}) => {
  const isLight = variant === "light";
  const textColor = isLight ? "#FFFFFF" : "#111111";
  const subTextColor = isLight ? "rgba(255,255,255,0.85)" : "#333333";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Clabstream Logo Image */}
      <img
        src="https://images.glints.com/unsafe/1200x0/glints-dashboard.oss-ap-southeast-1-internal.aliyuncs.com/company-logo/9a8b8496cde4c7c28571b7c676819468.png"
        alt="Clabstream Logo"
        referrerPolicy="no-referrer"
        className="h-9 w-auto max-w-[140px] object-contain rounded-xs bg-white p-0.5 border border-[#E5E5E5] shrink-0"
      />

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span
            className="font-display font-extrabold text-base tracking-tight"
            style={{ color: textColor }}
          >
            CLABSTREAM
          </span>
          <span
            className="font-mono text-[9px] font-bold tracking-widest uppercase mt-0.5"
            style={{ color: subTextColor }}
          >
            MEDIA LABS
          </span>
        </div>
      )}
    </div>
  );
};
