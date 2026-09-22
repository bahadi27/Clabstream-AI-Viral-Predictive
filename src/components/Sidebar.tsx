import React from "react";
import { ViralityAnalysis } from "../types";
import {
  Brain,
  Sparkles,
  ChevronRight,
  Zap,
  Scale,
  Film,
  Crown,
  TrendingUp,
  X,
  BookOpen,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  history: ViralityAnalysis[];
  activeAnalysis: ViralityAnalysis | null;
  onSelectAnalysis: (analysis: ViralityAnalysis) => void;
  onNewAnalysis: () => void;
  onToggleCompare: () => void;
  isCompareMode: boolean;
  activeTab: string;
  onSelectTab: (tab: "overview" | "report" | "upload" | "samples" | "glossary" | "trends" | "prompt-studio") => void;
  planTier?: "free" | "pro" | "agency";
  onOpenPricing?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  history,
  activeAnalysis,
  onSelectAnalysis,
  onNewAnalysis,
  onToggleCompare,
  isCompareMode,
  activeTab,
  onSelectTab,
  planTier = "free",
  onOpenPricing,
}) => {
  return (
    <>
      {/* Backdrop Overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-fadeIn"
          onClick={onToggle}
        />
      )}

      {/* Main Sidebar Drawer Container */}
      <aside
        data-lenis-prevent
        className={`fixed top-20 bottom-0 left-0 z-50 bg-[#07070b]/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xs bg-gradient-to-br from-[#00F5D4] via-teal-500 to-indigo-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#050508] rounded-xs flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-[#00F5D4]" />
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white tracking-tight leading-none">
                Studio Hub
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                Virality & Intelligence
              </span>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-xs border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* QUICK ACTIONS & NAVIGATION */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 px-2">
              Fast Navigation
            </span>

            <button
              onClick={() => {
                onSelectTab("upload");
                onNewAnalysis();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-xs transition-colors ${
                activeTab === "upload"
                  ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
              title="Upload & Analyze New Video"
            >
              <Zap className="w-4 h-4 text-[#00F5D4] shrink-0" />
              <span>Upload & Analyze</span>
            </button>

            <button
              onClick={onToggleCompare}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-xs transition-colors ${
                isCompareMode
                  ? "bg-[#00F5D4] text-black font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
              title="A/B Comparison Duel"
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span>A/B Duel Mode</span>
            </button>

            <button
              onClick={() => onSelectTab("prompt-studio")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-xs transition-colors ${
                activeTab === "prompt-studio"
                  ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
              title="AI Prompt Studio"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>AI Prompt Studio</span>
            </button>

            <button
              onClick={() => onSelectTab("trends")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-xs transition-colors ${
                activeTab === "trends"
                  ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
              title="Viral Trends Radar"
            >
              <TrendingUp className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Trends & Radar</span>
            </button>

            <button
              onClick={() => onSelectTab("samples")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-xs transition-colors ${
                activeTab === "samples"
                  ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
              title="Preset Vault"
            >
              <Film className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Preset Vault</span>
            </button>

            <button
              onClick={() => onSelectTab("glossary")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-xs transition-colors ${
                activeTab === "glossary"
                  ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              }`}
              title="Methodology & Codex"
            >
              <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Methodology & SLA</span>
            </button>
          </div>

          {/* RECENT ANALYSES QUEUE */}
          {(history?.length || 0) > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                  Recent Queue ({history?.length || 0})
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Select to View
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {(history || []).slice(0, 6).map((item) => {
                  const isSelected = activeAnalysis?.id === item.id;
                  const score = item.virality_score || 80;
                  const scoreColor =
                    score >= 85
                      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                      : score >= 70
                      ? "text-[#00F5D4] border-[#00F5D4]/30 bg-[#00F5D4]/10"
                      : "text-amber-400 border-amber-500/30 bg-amber-500/10";

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectAnalysis(item);
                        onSelectTab("report");
                      }}
                      className={`w-full p-2 rounded-xs border text-left transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-white/10 border-[#00F5D4] shadow-xs"
                          : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white font-medium truncate">
                          {item.inferred_title || item.title || "Video Analysis"}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div
                        className={`px-1.5 py-0.5 rounded-xs border text-[10px] font-mono font-bold shrink-0 ${scoreColor}`}
                      >
                        {score}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Subscription Footer */}
        {onOpenPricing && (
          <div className="p-3 border-t border-white/10 bg-black/40">
            <button
              onClick={onOpenPricing}
              className="w-full p-2.5 rounded-xs bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 hover:border-amber-400 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                    <span>{planTier === "free" ? "Upgrade to Pro" : "Pro Plan Active"}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {planTier === "free" ? "Unlimited analyses & exports" : "Full access unlocked"}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
