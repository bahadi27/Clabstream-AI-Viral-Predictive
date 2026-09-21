import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import { ArrowUp, Compass, MoveDown } from "lucide-react";

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      lock?: boolean;
    }
  ) => void;
  pause: () => void;
  resume: () => void;
  velocity: number;
  progress: number;
  isScrolling: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  pause: () => {},
  resume: () => {},
  velocity: 0,
  progress: 0,
  isScrolling: false,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  activeTab?: string;
  isModalOpen?: boolean;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  activeTab,
  isModalOpen = false,
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [velocity, setVelocity] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize Lenis with cinematic inertia calibrated for 3D parallax
    const lenis = new Lenis({
      duration: 1.25,
      // Smooth exponential decay easing curve
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.25,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Attach scroll listener to track velocity and spatial metrics
    const handleScroll = (e: any) => {
      const currentVelocity = Math.round(Math.abs(e.velocity || 0) * 10) / 10;
      const currentProgress = Math.min(1, Math.max(0, e.progress || 0));

      setVelocity(currentVelocity);
      setProgress(currentProgress);
      setIsScrolling(true);
      setShowScrollTop((e.scroll || 0) > 420);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        setVelocity(0);
      }, 180);
    };

    lenis.on("scroll", handleScroll);

    // RAF Loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose lenis globally for debugging & fine-tuned script access
    (window as any).lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).lenis;
    };
  }, []);

  // Sync modal open state: stop or resume Lenis
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isModalOpen]);

  // Smooth scroll to top when active tab changes
  useEffect(() => {
    if (lenisRef.current && activeTab) {
      lenisRef.current.scrollTo(0, {
        duration: 0.9,
        immediate: false,
      });
    }
  }, [activeTab]);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        duration?: number;
        immediate?: boolean;
        lock?: boolean;
      }
    ) => {
      if (!lenisRef.current) return;
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
        lock: options?.lock ?? false,
      });
    },
    []
  );

  const pause = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const resume = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollTo,
        pause,
        resume,
        velocity,
        progress,
        isScrolling,
      }}
    >
      {children}

      {/* Floating Spatial Inertia HUD & Smooth Glide-to-Top Controller */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 flex items-center gap-2 pointer-events-none ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Dynamic Velocity Telemetry Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#07070b]/90 border border-white/10 backdrop-blur-xl shadow-lg text-[10px] font-mono text-neutral-300 pointer-events-auto select-none">
          <Compass className={`w-3 h-3 text-[#00F5D4] ${isScrolling ? "animate-spin" : ""}`} />
          <span className="text-neutral-500">FLOW</span>
          <span className="text-white font-bold">{Math.round(progress * 100)}%</span>
          <span className="text-neutral-600">|</span>
          <span className="text-[#00F5D4] font-semibold">{velocity} px/ms</span>
        </div>

        {/* Buttery Back to Top Action */}
        <button
          onClick={() => scrollTo(0, { duration: 1.2 })}
          aria-label="Scroll to top with Lenis fluid inertia"
          className="pointer-events-auto p-3 rounded-full bg-[#0a0a0f] hover:bg-neutral-900 border border-white/15 hover:border-[#00F5D4]/60 text-white hover:text-[#00F5D4] shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </SmoothScrollContext.Provider>
  );
};
