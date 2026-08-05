import React from "react";
import { Lightbulb, Compass, HeartHandshake, Target } from "lucide-react";

interface StrategicSectionProps {
  hookAnalysis: string;
  emotionalArc: string;
  emotionalValence: string;
  topRecommendation: string;
}

export const StrategicSection: React.FC<StrategicSectionProps> = ({
  hookAnalysis,
  emotionalArc,
  emotionalValence,
  topRecommendation,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Intervention Callout */}
      {topRecommendation && (
        <div className="bg-[#111111] text-white p-6 rounded-sm shadow-md relative overflow-hidden border border-[#222222]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-white/80 uppercase tracking-wider">
              HIGHEST LEVERAGE INTERVENTION
            </span>
            <Target className="w-4 h-4 text-white" />
          </div>

          <h3 className="font-display font-bold text-xl md:text-2xl mb-3 text-white">
            Top Strategic Recommendation
          </h3>

          <p className="font-sans font-medium text-sm md:text-base leading-relaxed text-white/90 bg-white/10 border border-white/10 p-4 rounded-xs">
            {topRecommendation}
          </p>
        </div>
      )}

      {/* Strategic Synthesis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hook Analysis */}
        <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-[#E5E5E5] pb-2.5">
            <Lightbulb className="w-4 h-4 text-[#111111]" />
            <h4 className="font-display font-bold text-sm text-[#111111]">
              First-Seconds Hook Deconstruction
            </h4>
          </div>
          <p className="text-xs font-sans text-[#333333] leading-relaxed">
            {hookAnalysis || "Initial opening frames analyze visual salience and speech momentum."}
          </p>
        </div>

        {/* Emotional Arc */}
        <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-[#E5E5E5] pb-2.5">
            <Compass className="w-4 h-4 text-[#111111]" />
            <h4 className="font-display font-bold text-sm text-[#111111]">
              Neural Emotional Arc
            </h4>
          </div>
          <p className="text-xs font-mono font-semibold text-[#111111] bg-[#F4F4F4] p-3 rounded-xs border border-[#E5E5E5] leading-relaxed">
            {emotionalArc || "Novelty → Curiosity → Dopamine Spike → Share Urge"}
          </p>
        </div>

        {/* Emotional Valence */}
        <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-[#E5E5E5] pb-2.5">
            <HeartHandshake className="w-4 h-4 text-[#111111]" />
            <h4 className="font-display font-bold text-sm text-[#111111]">
              Emotional Valence & Arousal
            </h4>
          </div>
          <p className="text-sm font-display font-bold text-white bg-[#111111] p-3 rounded-xs text-center shadow-xs">
            {emotionalValence || "High-Arousal Positive Awe"}
          </p>
        </div>
      </div>
    </div>
  );
};
