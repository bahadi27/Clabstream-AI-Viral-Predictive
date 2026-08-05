import React from "react";
import { ViralityAnalysis } from "../types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { History, Scale, Trash2, Eye, Calendar, Sparkles } from "lucide-react";

interface RecentAnalysesProps {
  history: ViralityAnalysis[];
  onSelectAnalysis: (analysis: ViralityAnalysis) => void;
  activeAnalysisId?: string;
  selectedForCompare: string[];
  onToggleCompareSelect: (id: string) => void;
  onClearHistory?: () => void;
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  history,
  onSelectAnalysis,
  activeAnalysisId,
  selectedForCompare,
  onToggleCompareSelect,
  onClearHistory,
}) => {
  if (!history || history.length === 0) return null;

  // Chart data
  const chartData = [...history]
    .reverse()
    .map((item, idx) => ({
      name: `#${idx + 1}`,
      score: item.virality_score,
      hook: item.hook_score,
      title: item.title || "Video",
    }));

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 space-y-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
            History & Performance Vault
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            Recent Analyses ({history.length})
          </h2>
        </div>

        <p className="text-xs font-mono text-[#444444] font-medium hidden sm:block">
          Select any 2 items to compare in A/B Duel
        </p>
      </div>

      {/* Performance Trend Chart */}
      {history.length >= 2 && (
        <div className="bg-[#F4F4F4] border border-[#E5E5E5] p-5 rounded-sm">
          <span className="font-mono text-xs font-bold text-[#111111] uppercase block mb-3">
            Virality Score Trend Across History
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" stroke="#444444" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#444444" fontSize={10} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-[#E5E5E5] p-2.5 text-xs font-mono rounded-sm shadow-md">
                          <p className="font-bold text-[#111111]">{payload[0].payload.title}</p>
                          <p className="text-[#111111]">Virality: {payload[0].value}/100</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#111111"
                  strokeWidth={2}
                  fill="#111111"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Grid of Past Analyses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => {
          const isSelectedForComp = selectedForCompare.includes(item.id);
          const isActive = item.id === activeAnalysisId;

          return (
            <div
              key={item.id}
              className={`border rounded-sm p-4 flex flex-col justify-between transition-all ${
                isActive
                  ? "border-[#111111] bg-[#F4F4F4] shadow-xs"
                  : "border-[#E5E5E5] bg-white hover:border-[#111111]"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-xs">
                    {item.virality_tier}
                  </span>
                  <span className="font-display font-extrabold text-xl text-[#111111]">
                    {item.virality_score} <span className="text-xs font-mono text-[#555555]">/100</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-[#111111] line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-[#555555] font-medium mb-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#E5E5E5]">
                <button
                  onClick={() => onSelectAnalysis(item)}
                  className="flex-1 bg-[#111111] text-white py-1.5 px-3 text-xs font-semibold rounded-xs hover:bg-black transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => onToggleCompareSelect(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors flex items-center justify-center gap-1.5 ${
                    isSelectedForComp
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111]"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isSelectedForComp ? "Selected" : "Compare"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
