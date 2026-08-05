import React from "react";
import { SAMPLE_ANALYSES } from "../data/sampleAnalyses";
import { ViralityAnalysis } from "../types";
import { Sparkles, Play } from "lucide-react";

interface DemoPreviewProps {
  onSelectSample: (sample: ViralityAnalysis) => void;
}

export const DemoPreview: React.FC<DemoPreviewProps> = ({ onSelectSample }) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 space-y-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
            Pre-Analyzed Intelligence Reports
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Explore Preset Virality Reports
          </h2>
        </div>
        <Sparkles className="w-5 h-5 text-[#111111]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_ANALYSES.map((sample) => (
          <div
            key={sample.id}
            className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm p-5 flex flex-col justify-between hover:border-[#111111] transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-xs">
                  {sample.virality_tier} VIRALITY
                </span>
                <span className="font-display font-extrabold text-2xl text-[#111111]">
                  {sample.virality_score} <span className="text-xs font-mono text-[#555555]">/100</span>
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-[#111111] mb-2">
                {sample.title}
              </h3>

              <p className="text-xs font-sans text-[#555555] mb-4 line-clamp-2">
                {sample.description}
              </p>
            </div>

            <button
              onClick={() => onSelectSample(sample)}
              className="bg-[#111111] text-white px-4 py-2.5 text-xs font-semibold rounded-sm flex items-center justify-center gap-2 w-full hover:bg-black transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Load Full Report</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
