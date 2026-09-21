import React, { useState } from "react";
import { RealtimeTrendsData } from "../types";
import {
  TrendingUp,
  Hash,
  Music,
  Video,
  Globe,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Radio,
  Clock,
  Wrench,
  AlertTriangle,
  Zap,
  Bell,
  ArrowRight,
  Database,
  Layers,
  BarChart3
} from "lucide-react";

interface ViralTrendsRadarProps {
  initialTopic?: string;
  className?: string;
  compactMode?: boolean;
}

const CATEGORIES = [
  "All",
  "Health & Energy",
  "Office & Workplace",
  "Tech & Gadgets",
  "Beauty & Skincare",
  "Fitness & Lifestyle",
  "Comedy & Skits",
];

export const ViralTrendsRadar: React.FC<ViralTrendsRadarProps> = ({
  initialTopic = "Viral Video Content",
  className = "",
}) => {
  const [showLegacySandbox, setShowLegacySandbox] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // States for optional archived sandbox preview
  const [topic, setTopic] = useState(initialTopic);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [platformFilter, setPlatformFilter] = useState<"all" | "tiktok" | "instagram">("all");
  const [activeSubTab, setActiveSubTab] = useState<"hashtags" | "audio" | "formats">("hashtags");
  const [trendsData, setTrendsData] = useState<RealtimeTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubscribed(true);
  };

  const fetchTrends = async (
    targetTopic: string,
    targetCat: string,
    targetPlatform: "all" | "tiktok" | "instagram"
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic || "General Viral Content",
          category: targetCat,
          platform: targetPlatform,
        }),
      });
      const data = await res.json();
      if (data.success && data.trends) {
        setTrendsData(data.trends);
      }
    } catch (err) {
      console.error("Failed to fetch trends:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    fetchTrends(cat === "All" ? topic : `${topic} (${cat})`, cat, platformFilter);
  };

  const handleCopyAllHashtags = () => {
    if (!trendsData?.trendingHashtags) return;
    const tagString = trendsData.trendingHashtags.map((h) => h.hashtag).join(" ");
    navigator.clipboard.writeText(tagString);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopySingleHashtag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedSingleTag(tag);
    setTimeout(() => setCopiedSingleTag(null), 2000);
  };

  return (
    <div className={`cyber-glass rounded-xs p-6 border border-white/10 shadow-2xl space-y-6 ${className}`}>
      {/* Module Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="bg-[#00F5D4] text-black font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#00F5D4]/20">
              <Wrench className="w-3 h-3 text-black animate-bounce" />
              SYSTEM UPGRADE
            </span>
            <span className="bg-white/5 text-neutral-300 border border-white/10 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00F5D4]" />
              Engine v2.0 In Progress
            </span>
            <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-xs hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              Est. Restoration: Q3 2026
            </span>
          </div>

          <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight flex items-center gap-2">
            <span>Grounded Trends Intelligence</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time social trends indexing is currently undergoing scheduled maintenance & algorithmic recalibration.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              if (!showLegacySandbox && !trendsData) {
                fetchTrends(topic, selectedCategory, platformFilter);
              }
              setShowLegacySandbox(!showLegacySandbox);
            }}
            className="bg-white/5 border border-white/10 hover:border-[#00F5D4]/50 hover:bg-white/10 text-white px-4 py-2 text-xs font-mono font-bold rounded-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Database className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span>{showLegacySandbox ? "Hide v1.0 Sandbox" : "View v1.0 Read-Only Sandbox"}</span>
          </button>
        </div>
      </div>

      {/* Primary Under Maintenance Hero Display */}
      {!showLegacySandbox ? (
        <div className="space-y-6">
          {/* Maintenance Notification Callout Card */}
          <div className="bg-[#111111] text-white p-6 md:p-8 rounded-sm shadow-md border border-[#222222] relative overflow-hidden space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xs shrink-0">
                  <Wrench className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2.5 py-0.5 rounded-xs border border-amber-800/80">
                      SYSTEM UPGRADE IN PROGRESS
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-xl md:text-2xl text-white">
                    Grounded Trends Intelligence v2.0 Coming Soon
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                    We are rebuilding our Google Search Grounding pipelines to integrate direct TokChart audio velocity APIs and Snaplytics FYP hashtag indexing for higher prediction accuracy.
                  </p>
                </div>
              </div>

              {/* Engine Recalibration Meters */}
              <div className="w-full md:w-64 bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-2.5 text-xs font-mono shrink-0">
                <span className="text-[10px] text-amber-400 font-bold uppercase block border-b border-white/10 pb-1">
                  ⚙️ RECALIBRATION PROGRESS
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Search Grounding:</span>
                    <span className="font-bold text-emerald-400">92% Ready</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[92%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">TokChart Audio Index:</span>
                    <span className="font-bold text-amber-400">88% Synthesizing</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[88%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">FYP Velocity Schema:</span>
                    <span className="font-bold text-indigo-400">96% Completed</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full w-[96%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* What's Coming in v2.0 Grid */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Engine v2.0 Key Enhancements Roadmap</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1.5">
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                    <Zap className="w-3.5 h-3.5" /> 1. Live TokChart API
                  </span>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Direct integration with TikTok official audio chart data updated every 15 minutes.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1.5">
                  <span className="font-mono font-bold text-purple-400 flex items-center gap-1 text-[11px]">
                    <Music className="w-3.5 h-3.5" /> 2. Audio-Visual Sync
                  </span>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Automatic timestamp overlay recommendations matching video jump cuts with audio stings.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1.5">
                  <span className="font-mono font-bold text-amber-400 flex items-center gap-1 text-[11px]">
                    <Hash className="w-3.5 h-3.5" /> 3. Niche FYP Clustering
                  </span>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Hyper-targeted hashtag category models across 20+ viral short-form niches.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-xs space-y-1.5">
                  <span className="font-mono font-bold text-indigo-400 flex items-center gap-1 text-[11px]">
                    <BarChart3 className="w-3.5 h-3.5" /> 4. A/B Trend Simulation
                  </span>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Predictive hook retention curves based on real-time algorithm weighting changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification / Waitlist Bar */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Want an alert when Grounded Trends Intelligence Engine v2.0 goes live?</span>
              </div>

              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="creator@example.com"
                    className="bg-white/10 border border-white/20 focus:border-amber-400 focus:outline-none px-3 py-1.5 text-xs text-white rounded-xs placeholder-white/40 w-full sm:w-56"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors shrink-0"
                  >
                    Notify Me
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-3 py-1.5 text-xs font-mono font-bold rounded-xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Registered for Engine v2.0 Early Access!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Legacy v1.0 Sandbox Read-Only Mode */
        <div className="space-y-5 animate-fadeIn">
          {/* Archived Notice Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xs flex items-center justify-between gap-3 text-xs text-amber-950 font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Archived Snapshot Mode (v1.0):</strong> You are viewing read-only cached sample trend data while Engine v2.0 undergoes maintenance.
              </span>
            </div>
            <button
              onClick={() => setShowLegacySandbox(false)}
              className="bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-2.5 py-1 rounded-2xs text-[11px] shrink-0"
            >
              Exit Sandbox
            </button>
          </div>

          {/* Search Controls */}
          <div className="space-y-3 bg-neutral-50 border border-neutral-200 p-4 rounded-sm">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic..."
                className="w-full bg-white border border-[#E5E5E5] px-3.5 py-2 text-xs font-medium text-[#111111] rounded-sm"
              />
              <button
                onClick={() => fetchTrends(topic, selectedCategory, platformFilter)}
                disabled={isLoading}
                className="bg-[#111111] text-white px-5 py-2 text-xs font-semibold rounded-sm flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Fetch Cached Sample</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-200">
              <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase mr-1">NICHE:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-xs ${
                    selectedCategory === cat ? "bg-[#111111] text-white" : "bg-white text-neutral-700 border border-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Render Sample Cached Trends Grid if available */}
          {trendsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(trendsData.trendingHashtags || []).map((item, idx) => (
                <div key={idx} className="bg-white border border-[#E5E5E5] p-3.5 rounded-sm space-y-2 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="font-mono text-emerald-600">{item.hashtag}</span>
                    <span className="font-mono text-[10px] text-neutral-500">{item.growthVelocity}</span>
                  </div>
                  <p className="text-neutral-600 text-[11px]">{item.matchExplanation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-neutral-500 bg-neutral-50 border border-dashed border-neutral-300 rounded-sm">
              Click "Fetch Cached Sample" above to inspect v1.0 cached snapshot data.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
