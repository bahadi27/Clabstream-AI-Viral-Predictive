import React from "react";
import { Brain, Sparkles, Scale, Film, Zap, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onNewAnalysis: () => void;
  onOpenDemoVault: () => void;
  onToggleCompareMode: () => void;
  isCompareMode: boolean;
  historyCount: number;
  compareSelectedCount: number;
  activeTab?: string;
  onSelectTab?: (tab: "overview" | "report" | "upload" | "samples" | "glossary") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewAnalysis,
  onOpenDemoVault,
  onToggleCompareMode,
  isCompareMode,
  historyCount,
  compareSelectedCount,
  activeTab = "report",
  onSelectTab,
}) => {
  const { user, isSigningIn, signInWithGoogle, signOutUser } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-[#E5E5E5] transition-all">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand */}
        <div 
          className="font-display font-extrabold text-2xl tracking-tighter flex items-center gap-1.5 cursor-pointer text-[#111111]"
          onClick={() => onSelectTab && onSelectTab("overview")}
        >
          <span>NeuroViral</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#111111] inline-block"></span>
        </div>

        {/* Center Navigation Links */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button
              onClick={() => onSelectTab("overview")}
              className={`nav-link ${activeTab === "overview" && !isCompareMode ? "active font-semibold text-[#111111]" : ""}`}
            >
              Intelligence Platform
            </button>
            <button
              onClick={() => onSelectTab("report")}
              className={`nav-link ${activeTab === "report" && !isCompareMode ? "active font-semibold text-[#111111]" : ""}`}
            >
              Active Report
            </button>
            <button
              onClick={() => onSelectTab("samples")}
              className={`nav-link ${activeTab === "samples" && !isCompareMode ? "active font-semibold text-[#111111]" : ""}`}
            >
              Preset Vault
            </button>
            <button
              onClick={() => onSelectTab("glossary")}
              className={`nav-link ${activeTab === "glossary" && !isCompareMode ? "active font-semibold text-[#111111]" : ""}`}
            >
              Methodology & SLA
            </button>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleCompareMode}
            className={`px-3.5 py-2 text-xs font-semibold rounded-sm transition-all flex items-center gap-1.5 border ${
              isCompareMode
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-[#F4F4F4] text-[#111111] border-[#E5E5E5] hover:bg-[#EAEAEA]"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">A/B Duel</span>
            {compareSelectedCount > 0 && (
              <span className="bg-[#111111] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {compareSelectedCount}/2
              </span>
            )}
          </button>

          <button
            onClick={onNewAnalysis}
            className="bg-[#111111] text-white px-4 py-2 text-xs md:text-sm font-semibold rounded-sm hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm hover:shadow-md"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-white" />
            <span>Upload Asset</span>
          </button>

          {/* User Auth state button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E5E5]">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-7 h-7 rounded-full border border-neutral-300" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                  {user.email?.[0].toUpperCase() || "U"}
                </div>
              )}
              <button
                onClick={() => signOutUser()}
                title="Sign Out"
                className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              disabled={isSigningIn}
              className="bg-white border border-[#E5E5E5] text-[#111111] px-3 py-1.5 text-xs font-semibold rounded-sm hover:border-[#111111] hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 text-[#111111]" />
              <span className="hidden sm:inline">{isSigningIn ? "Signing In..." : "Sign In"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


