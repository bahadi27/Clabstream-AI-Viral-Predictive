import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Brain, 
  Sparkles, 
  Scale, 
  HelpCircle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Video, 
  Flame, 
  Compass, 
  BarChart3,
  Lightbulb,
  MousePointerClick
} from "lucide-react";

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: "overview" | "report" | "upload" | "samples" | "glossary" | "trends") => void;
  onToggleCompare?: () => void;
}

interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  bullets: string[];
  actionLabel?: string;
  targetTab?: "overview" | "report" | "upload" | "samples" | "glossary" | "trends";
  isCompareAction?: boolean;
  keyFeatureLabel: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "upload",
    title: "1. Multi-Modal Video Analysis",
    subtitle: "Deep Video Frame & Spoken Audio Extraction",
    badge: "Input Stage",
    icon: <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    description: "Upload any MP4, MOV, or WEBM short video clip (up to 100MB). Our engine extracts keyframe density, spoken dialogue, narrative cadence, and visual motion velocity automatically.",
    bullets: [
      "Keyframe Extraction at 92 FPS intervals for precise cut analysis",
      "Multilingual Dialogue & Accent Recognition (Malay, English, Spanish, etc.)",
      "Custom Prompt Directives to steer analysis toward your niche",
      "Automatic file name sanitization for professional reporting"
    ],
    actionLabel: "Try Uploading a Clip",
    targetTab: "upload",
    keyFeatureLabel: "Upload Zone & Directives"
  },
  {
    id: "scoring",
    title: "2. 3-Pillar Predictive Virality Engine",
    subtitle: "Perceptual, Neural & Behavioral Intelligence",
    badge: "Core Scoring",
    icon: <Brain className="w-6 h-6 text-amber-500" />,
    description: "Evaluate your video against 3 distinct cognitive pillars modeled after high-retention short-form video algorithms on TikTok, Instagram Reels, and YouTube Shorts.",
    bullets: [
      "Perceptual Engine: Spoken language, audio clarity, and narrative tone",
      "Neural Engine: First-second hook drop, visual pacing, and cut rhythm",
      "Behavioral Engine: Virality score (0-100), engagement velocity, and retention lift",
      "Mathematical confidence intervals and benchmark rankings"
    ],
    actionLabel: "View Active Report",
    targetTab: "report",
    keyFeatureLabel: "Report Dashboard"
  },
  {
    id: "hooks",
    title: "3. Content-Aware Viral Hook Rewriter",
    subtitle: "5 Script-Matched TikTok/Reels Alternative Openings",
    badge: "AI Optimization",
    icon: <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    description: "Never lose viewers in second #1. The rewriter comprehends your exact spoken transcript and visual context to generate 5 viral creator hooks in the exact spoken language of your video.",
    bullets: [
      "Language & Dialect Preservation: Spoken Bahasa Melayu stays natural Malay, English stays English",
      "Strictly File-Name Free: Uses real spoken script, not file labels",
      "Focus Modes: Target Script Dialogue, Audio Vocal Cadence, or Visual Keyframe Cuts",
      "Predicted Lift: View expected virality score boosts per alternative hook"
    ],
    actionLabel: "Explore Hook Rewriter",
    targetTab: "report",
    keyFeatureLabel: "Hook Studio"
  },
  {
    id: "compare",
    title: "4. A/B Duel Benchmarking",
    subtitle: "Side-by-Side Video Asset Head-to-Head Comparison",
    badge: "A/B Testing",
    icon: <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    description: "Unsure which edit or thumbnail hook performs better? Select two video analyses from your history or preset vault to battle them out side-by-side.",
    bullets: [
      "Head-to-head Virality, Hook, and Retention score comparison",
      "Delta badges highlighting winner metrics in green (+12% lift)",
      "Comparative emotional arc timeline overlay",
      "Exportable side-by-side performance summary"
    ],
    actionLabel: "Toggle A/B Duel",
    isCompareAction: true,
    keyFeatureLabel: "A/B Duel Mode"
  },
  {
    id: "vault",
    title: "5. Preset Vault & Grounded Trends",
    subtitle: "Instant Industry Benchmarks & Search Grounding",
    badge: "Research Vault",
    icon: <Flame className="w-6 h-6 text-rose-500" />,
    description: "Test drive the system with pre-analyzed benchmark clips across Fitness, Tech, Lifestyle, and E-commerce, or query live TikTok viral search trends.",
    bullets: [
      "Instant loading sample videos with full 3-pillar breakdown",
      "Google Search grounded trend analysis for real-time TikTok topics",
      "Interactive glossary explaining SLA, confidence metrics, and virality science",
      "Dark / Light high-contrast design optimized for creator workflow"
    ],
    actionLabel: "Explore Preset Vault",
    targetTab: "samples",
    keyFeatureLabel: "Preset Vault & Trends"
  }
];

export const DashboardTour: React.FC<DashboardTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToggleCompare,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Handle keyboard shortcuts (Arrow keys & Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("neuroviral_tour_completed", "true");
    onClose();
  };

  const handleStepAction = () => {
    if (step.isCompareAction && onToggleCompare) {
      onToggleCompare();
      onClose();
    } else if (step.targetTab && onNavigateTab) {
      onNavigateTab(step.targetTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        id="tour-modal-container"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {step.badge}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white font-display tracking-tight leading-tight mt-0.5">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title="Close Tour (Esc)"
            aria-label="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
            {step.description}
          </p>

          {/* Key Features Bullet List */}
          <div className="p-4 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2.5">
            <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Core Capabilities</span>
            </div>
            <ul className="space-y-2">
              {step.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action shortcut banner */}
          <div className="flex items-center justify-between p-3 rounded-md bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                Want to jump straight to this feature?
              </span>
            </div>
            <button
              onClick={handleStepAction}
              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>{step.actionLabel || "Go to Feature"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 flex items-center justify-between">
          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "bg-neutral-900 dark:bg-white w-6"
                    : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
                }`}
                title={`Go to step ${idx + 1}: ${s.title}`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3.5 py-2 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < TOUR_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-black dark:hover:bg-white transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Next Feature</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TourTriggerBannerProps {
  onStartTour: () => void;
}

export const TourTriggerBanner: React.FC<TourTriggerBannerProps> = ({ onStartTour }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isCompleted = localStorage.getItem("neuroviral_tour_completed");
    if (isCompleted === "true") {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl p-4 flex items-start gap-3 animate-slide-up">
      <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 shrink-0">
        <Compass className="w-5 h-5 animate-spin-slow" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
          New to NeuroViral?
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-snug">
          Take a 45-second guided tour of our multi-modal virality scoring & hook rewriter.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            onClick={onStartTour}
            className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-black dark:hover:bg-white transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span>Start Guided Tour</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              localStorage.setItem("neuroviral_tour_completed", "true");
              setDismissed(true);
            }}
            className="px-2 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
          >
            Dismiss
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          localStorage.setItem("neuroviral_tour_completed", "true");
          setDismissed(true);
        }}
        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
