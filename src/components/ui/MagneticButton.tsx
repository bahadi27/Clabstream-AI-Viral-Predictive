import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // magnetic pull strength multiplier
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.35,
  className = "",
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.1 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export const TextShimmer: React.FC<{
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-block bg-[linear-gradient(110deg,#ffffff,45%,#00F5D4,55%,#ffffff)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shimmer ${className}`}
    >
      {children}
    </span>
  );
};
