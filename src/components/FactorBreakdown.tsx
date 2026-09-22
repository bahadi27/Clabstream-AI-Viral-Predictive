import React from "react";
import { motion } from "motion/react";
import { FactorMechanic } from "../types";
import { BookOpen } from "lucide-react";

interface FactorBreakdownProps {
  factors: FactorMechanic[];
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ factors }) => {
  if (!factors || factors.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 mb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
            Neuroscience & Behavioral Mechanics
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Viral Mechanics Breakdown ({factors.length} Factors)
          </h2>
        </div>
        <BookOpen className="w-6 h-6 text-[#111111]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {factors.map((item, idx) => (
          <div key={idx} className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-2 mb-2.5">
                <h3 className="font-display font-bold text-base text-[#111111]">
                  {item.name}
                </h3>
                <span className="font-mono font-bold text-xs px-2.5 py-1 bg-[#111111] text-white rounded-xs shrink-0">
                  {item.score} / 100
                </span>
              </div>

              {/* Animated Progress Data-Bar */}
              <div className="w-full h-1.5 rounded-full bg-white border border-[#E5E5E5] overflow-hidden mb-3">
                <motion.div
                  className="data-bar h-full bg-[#111111] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                  transition={{
                    duration: 0.95,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 + idx * 0.1,
                  }}
                />
              </div>

              <p className="text-xs font-sans text-[#333333] font-normal mb-3 leading-relaxed">
                {item.explanation}
              </p>
            </div>

            {item.journal_reference && (
              <div className="bg-white border border-[#E5E5E5] p-2.5 rounded-xs text-[11px] font-mono text-[#444444] font-medium flex items-center gap-2 mt-2">
                <BookOpen className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span className="truncate">{item.journal_reference}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
