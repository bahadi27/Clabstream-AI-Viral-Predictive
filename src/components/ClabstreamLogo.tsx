import React from "react";

interface ClabstreamLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "dark" | "light";
}

export const ClabstreamLogo: React.FC<ClabstreamLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  variant = "dark",
}) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Clabstream Agency Logo Image */}
      <img
        src="https://images.glints.com/unsafe/1200x0/glints-dashboard.oss-ap-southeast-1-internal.aliyuncs.com/company-logo/9a8b8496cde4c7c28571b7c676819468.png"
        alt="Clabstream Agency Logo"
        referrerPolicy="no-referrer"
        className={`${sizeClasses[size]} w-auto object-contain shrink-0`}
      />
      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-display font-extrabold tracking-tight leading-none ${
              variant === "light" ? "text-neutral-900 text-sm" : "text-white text-sm"
            }`}
          >
            CLABSTREAM
          </span>
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#00F5D4] uppercase">
            CREATIVE AGENCY
          </span>
        </div>
      )}
    </div>
  );
};
