import React, { useState, useRef, useEffect } from "react";
import {
  Scale,
  Zap,
  LogIn,
  LogOut,
  HelpCircle,
  Crown,
  Menu,
  ChevronDown,
  Check,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SUPPORTED_LANGUAGES, getLanguageByCode } from "../lib/languages";

interface NavbarProps {
  onNewAnalysis: () => void;
  onOpenDemoVault: () => void;
  onToggleCompareMode: () => void;
  isCompareMode: boolean;
  historyCount: number;
  compareSelectedCount: number;
  activeTab?: string;
  onSelectTab?: (tab: "overview" | "report" | "samples" | "glossary" | "trends" | "prompt-studio") => void;
  onStartTour?: () => void;
  onOpenPricing?: () => void;
  planTier?: "free" | "pro" | "agency";
  usageCount?: number;
  maxLimit?: number | null;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  selectedLanguage?: string;
  onSelectLanguage?: (langCode: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewAnalysis,
  onOpenDemoVault,
  onToggleCompareMode,
  isCompareMode,
  historyCount = 0,
  compareSelectedCount = 0,
  activeTab = "report",
  onSelectTab,
  onStartTour,
  onOpenPricing,
  planTier = "free",
  usageCount = 0,
  maxLimit = 1,
  onToggleSidebar,
  isSidebarOpen,
  selectedLanguage = "auto",
  onSelectLanguage,
}) => {
  const { user, isSigningIn, signInWithGoogle, signOutUser } = useAuth();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangObj = getLanguageByCode(selectedLanguage);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    if (!langSearch.trim()) return true;
    const q = langSearch.toLowerCase();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const navItems: { id: "overview" | "report" | "prompt-studio" | "samples" | "glossary"; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "report", label: "Report" },
    { id: "prompt-studio", label: "Prompt Studio" },
    { id: "samples", label: "Vault" },
    { id: "glossary", label: "Methodology" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-[#08080A]/85 backdrop-blur-xl z-50 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle & Clean Brand */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                isSidebarOpen
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.08]"
              }`}
              title="Toggle Sidebar Index"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => onSelectTab && onSelectTab("overview")}
          >
            <div className="w-2 h-2 rounded-full bg-[#00F5D4] shadow-[0_0_8px_#00F5D4]" />
            <span className="font-syne font-black text-lg tracking-tight text-white uppercase group-hover:text-[#00F5D4] transition-colors">
              NEUROVIRAL
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] font-bold text-neutral-300 bg-white/[0.08] border border-white/[0.12] px-2 py-0.5 rounded-full tracking-wider uppercase">
              BY CLABSTREAM
            </span>
          </div>
        </div>

        {/* Center: Breathable, Clean Navigation Tabs */}
        {onSelectTab && (
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id && !isCompareMode;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Consolidated, Airy Action Group */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => {
                setIsLangDropdownOpen((prev) => !prev);
                setLangSearch("");
              }}
              className={`h-9 px-2.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isLangDropdownOpen
                  ? "bg-white/[0.12] border-[#00F5D4]/60 text-[#00F5D4]"
                  : selectedLanguage !== "auto"
                  ? "bg-white/[0.06] border-white/20 text-white hover:bg-white/[0.1]"
                  : "bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]"
              }`}
              title="Change Language"
              aria-label="Language Selector"
            >
              <span className="text-sm leading-none">{currentLangObj.flag}</span>
              <span className="text-[11px] font-semibold tracking-wider">
                {currentLangObj.code === "auto" ? "AUTO" : currentLangObj.code.toUpperCase()}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
                  isLangDropdownOpen ? "rotate-180 text-[#00F5D4]" : ""
                }`}
              />
            </button>

            {/* Language Dropdown Floating Menu */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0C0C12] border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.75)] z-50 overflow-hidden animate-fadeIn">
                <div className="p-2.5 border-b border-white/[0.08]">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search language..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00F5D4]/50"
                      autoFocus
                    />
                    {langSearch && (
                      <button
                        onClick={() => setLangSearch("")}
                        className="absolute right-2 text-neutral-400 hover:text-white p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                  {filteredLanguages.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No language found
                    </div>
                  ) : (
                    filteredLanguages.map((lang) => {
                      const isSelected = selectedLanguage.toLowerCase() === lang.code.toLowerCase();
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            if (onSelectLanguage) {
                              onSelectLanguage(lang.code);
                            }
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#00F5D4]/15 text-[#00F5D4] font-semibold"
                              : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{lang.flag}</span>
                            <span className="text-xs">{lang.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00F5D4]" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tour Button */}
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="h-9 w-9 rounded-lg border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-white/[0.08] transition-colors flex items-center justify-center cursor-pointer"
              title="Feature Tour"
              aria-label="Feature Tour"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Pricing & Usage Status */}
          {onOpenPricing && (
            <button
              onClick={() => onOpenPricing()}
              className={`h-9 px-3 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                planTier === "pro" || planTier === "agency"
                  ? "bg-[#00F5D4]/10 border-[#00F5D4]/30 text-[#00F5D4] hover:bg-[#00F5D4]/20"
                  : "bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]"
              }`}
              title="View Plans & Usage"
            >
              <Crown className={`w-3.5 h-3.5 ${planTier !== "free" ? "text-[#00F5D4] fill-[#00F5D4]" : "text-neutral-400"}`} />
              <span className="text-[11px] font-semibold">
                {planTier === "pro" ? "PRO" : planTier === "agency" ? "AGENCY" : `${usageCount}/${maxLimit ?? "∞"}`}
              </span>
            </button>
          )}

          {/* Compare Mode Toggle */}
          <button
            onClick={onToggleCompareMode}
            className={`h-9 px-3 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
              isCompareMode
                ? "bg-[#00F5D4] text-black border-[#00F5D4] font-bold shadow-md shadow-[#00F5D4]/20"
                : "bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:text-white hover:bg-white/[0.08]"
            }`}
            title="A/B Compare Videos"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
            {compareSelectedCount > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isCompareMode ? "bg-black text-[#00F5D4]" : "bg-white/20 text-white"}`}>
                {compareSelectedCount}/2
              </span>
            )}
          </button>

          {/* Primary CTA: Upload */}
          <button
            onClick={onNewAnalysis}
            className="h-9 px-3.5 rounded-lg bg-white text-black hover:bg-[#00F5D4] hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] transition-all flex items-center gap-1.5 text-xs font-semibold font-sans cursor-pointer tracking-normal"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">New Analysis</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-white/[0.1] mx-0.5 hidden sm:block" />

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-7 h-7 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs font-bold font-mono">
                  {user.email?.[0].toUpperCase() || "U"}
                </div>
              )}
              <button
                onClick={() => signOutUser()}
                title="Sign Out"
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              disabled={isSigningIn}
              className="h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span className="hidden sm:inline">{isSigningIn ? "Signing In..." : "Sign In"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
