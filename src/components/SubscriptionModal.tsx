import React, { useState } from "react";
import {
  Zap,
  Check,
  Crown,
  Sparkles,
  X,
  Brain,
  ShieldCheck,
  TrendingUp,
  Layers,
  Star,
  Lock,
  ArrowRight,
  LogIn
} from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  planTier: "free" | "pro" | "agency";
  usageCount: number;
  maxLimit: number | null; // 1 for guest, 5 for free account, null for pro/agency
  onUpgrade: (tier: "pro" | "agency") => void;
  onSignIn?: () => void;
  limitReachedReason?: string | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  user,
  planTier,
  usageCount,
  maxLimit,
  onUpgrade,
  onSignIn,
  limitReachedReason,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!isOpen) return null;

  const isGuest = !user;
  const isFree = planTier === "free";
  const isPro = planTier === "pro";
  const isAgency = planTier === "agency";

  const handleSelectTier = (tier: "pro" | "agency") => {
    setIsProcessing(tier);
    setTimeout(() => {
      onUpgrade(tier);
      setIsProcessing(null);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      data-lenis-prevent
    >
      <div className="relative w-full max-w-5xl bg-[#0A0A0F] border border-white/10 rounded-lg shadow-2xl p-6 md:p-10 my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEUROVIRAL SUBSCRIPTION TIERS</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white">
            Supercharge Your Video Content Intelligence
          </h2>

          <p className="text-neutral-400 text-sm md:text-base font-sans">
            Predict virality, analyze 3D fMRI brain networks, and rewrite viral hooks before you hit publish.
          </p>

          {/* Usage Limit Banner Alert */}
          {limitReachedReason && typeof limitReachedReason === "string" && (
            <div className="mt-4 p-4 rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs md:text-sm font-mono flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{limitReachedReason}</span>
            </div>
          )}

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-mono font-bold ${billingCycle === "monthly" ? "text-white" : "text-neutral-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 bg-white/10 rounded-full p-1 transition-colors border border-white/15 focus:outline-none"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#00F5D4] shadow-md transform transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white" : "text-neutral-500"}`}>
              <span>Annual</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00F5D4]/20 text-[#00F5D4] text-[10px] uppercase tracking-wider border border-[#00F5D4]/30 font-extrabold">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* TIER 1: STARTER / GUEST & FREE */}
          <div className="cyber-glass border border-white/10 rounded-xs p-6 flex flex-col justify-between hover:border-white/20 transition-all relative">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Starter Free</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">Explore AI Content Analysis</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xs bg-white/5 border border-white/10 text-neutral-300 font-bold">
                  $0
                </span>
              </div>

              <div className="my-6 space-y-1">
                <div className="text-2xl font-black text-white font-mono">$0</div>
                <div className="text-[11px] font-mono text-neutral-400">Free Forever</div>
              </div>

              <div className="p-3 rounded-xs bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 mb-6 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Guest Limit:</span>
                  <span className="font-bold text-white">1 Analysis Total</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Free Signed-In:</span>
                  <span className="font-bold text-[#00F5D4]">5 Monthly Analyses</span>
                </div>
                <div className="mt-2 text-[10px] text-neutral-400 border-t border-white/10 pt-1.5">
                  Current Usage: <span className="font-bold text-white">{usageCount} / {maxLimit ?? "Unlimited"}</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs font-mono text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>Gemini 3.8 Multimodal Virality Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>Interactive 3D Brain fMRI Map</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>TikTok & Reels Retention Forecast</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-500">
                  <X className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span>Unlimited Analyses</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-500">
                  <X className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span>AI Hook Rewriter & Script Variations</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {isGuest ? (
                <button
                  onClick={() => {
                    onClose();
                    onSignIn?.();
                  }}
                  className="w-full py-2.5 rounded-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <LogIn className="w-4 h-4 text-[#00F5D4]" />
                  <span>Sign In for 5 Free Analyses</span>
                </button>
              ) : isFree ? (
                <div className="text-center py-2 text-xs font-mono text-neutral-400 border border-white/10 rounded-xs bg-white/5">
                  Current Active Plan ({usageCount}/5 Used)
                </div>
              ) : (
                <div className="text-center py-2 text-xs font-mono text-neutral-500">
                  Base Tier
                </div>
              )}
            </div>
          </div>

          {/* TIER 2: PRO CREATOR (POPULAR) */}
          <div className="cyber-glass border-2 border-[#00F5D4] rounded-xs p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(0,245,212,0.15)] transition-all relative bg-gradient-to-b from-[#00F5D4]/10 via-transparent to-transparent">
            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00F5D4] text-black font-mono font-extrabold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span>MOST POPULAR FOR CREATORS</span>
            </div>

            <div>
              <div className="flex justify-between items-start mb-4 pt-2">
                <div>
                  <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    Pro Creator
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">For Serious Creators & Growth Marketers</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xs bg-[#00F5D4]/20 border border-[#00F5D4]/40 text-[#00F5D4] font-bold">
                  UNLIMITED
                </span>
              </div>

              <div className="my-6 space-y-1">
                <div className="text-3xl font-black text-white font-mono">
                  {billingCycle === "yearly" ? "$23" : "$29"}
                  <span className="text-sm font-normal text-neutral-400"> / mo</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  {billingCycle === "yearly" ? "Billed $276 annually" : "Billed monthly"}
                </div>
              </div>

              <ul className="space-y-3 text-xs font-mono text-neutral-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span className="font-bold text-white">UNLIMITED Video Virality Analyses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>Multi-Pass Empirical Confidence Intervals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>AI Viral Hook Rewriter & Audio Prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>Real-Time Google Grounded Trends Radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>Keyframe Frame Analysis & Downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>A/B Duel Side-by-Side Video Comparator</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {isPro ? (
                <div className="text-center py-2.5 text-xs font-mono text-[#00F5D4] font-bold border border-[#00F5D4]/40 rounded-xs bg-[#00F5D4]/10">
                  Current Active Plan (Unlimited)
                </div>
              ) : (
                <button
                  onClick={() => handleSelectTier("pro")}
                  disabled={isProcessing !== null}
                  className="w-full py-3 rounded-xs bg-[#00F5D4] hover:brightness-110 text-black text-xs font-mono font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00F5D4]/25 disabled:opacity-50"
                >
                  {isProcessing === "pro" ? (
                    <span>Upgrading to Pro...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Upgrade to Pro Creator</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* TIER 3: AGENCY / TEAM */}
          <div className="cyber-glass border border-white/10 rounded-xs p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all relative">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Agency & Team</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">High-Volume Video Production</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xs bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 font-bold">
                  ENTERPRISE
                </span>
              </div>

              <div className="my-6 space-y-1">
                <div className="text-3xl font-black text-white font-mono">
                  {billingCycle === "yearly" ? "$79" : "$99"}
                  <span className="text-sm font-normal text-neutral-400"> / mo</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  {billingCycle === "yearly" ? "Billed $948 annually" : "Billed monthly"}
                </div>
              </div>

              <ul className="space-y-3 text-xs font-mono text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-bold text-white">Everything in Pro Creator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Batch Multi-Video Matrix Processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>White-Label Executive PDF Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom fMRI Brain Region Tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Dedicated Gemini 3.8 API Throughput</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Multi-User Team Seats & Sharing</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {isAgency ? (
                <div className="text-center py-2.5 text-xs font-mono text-indigo-400 font-bold border border-indigo-500/40 rounded-xs bg-indigo-500/10">
                  Current Active Plan (Agency)
                </div>
              ) : (
                <button
                  onClick={() => handleSelectTier("agency")}
                  disabled={isProcessing !== null}
                  className="w-full py-2.5 rounded-xs bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {isProcessing === "agency" ? (
                    <span>Upgrading to Agency...</span>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 text-indigo-300" />
                      <span>Upgrade to Agency ($99)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00F5D4]" />
            <span>Instant Activation • Cancel Anytime • 14-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-500">Need custom volume?</span>
            <button
              onClick={() => alert("Contact support at enterprise@neuroviral.studio")}
              className="text-white hover:underline font-bold"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
