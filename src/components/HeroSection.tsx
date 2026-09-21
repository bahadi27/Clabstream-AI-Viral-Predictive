import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
import {
  Play,
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Crown,
  Check,
  X,
  LogIn,
  Lock,
  Layers,
  Activity,
  Gauge,
  Move3d,
  Compass,
} from "lucide-react";
import { SpotlightCard } from "./ui/SpotlightCard";
import { LiquidMetalButton, MetalBadge } from "./ui/LiquidMetal";
import { MagneticButton, TextShimmer } from "./ui/MagneticButton";
import { DotMatrixDisplay } from "./ui/DotMatrixDisplay";
import { FineLineHeader } from "./ui/FineLineHeader";
import neuralLandscapeImg from "../assets/images/neural_landscape_1789819359396.jpg";

interface HeroSectionProps {
  onStartUpload: () => void;
  onSelectPreset: () => void;
  onOpenPromptStudio?: () => void;
  onOpenPricing?: (reason?: string) => void;
  planTier?: "free" | "pro" | "agency";
  usageCount?: number;
  maxLimit?: number | null;
  onUpgradePlan?: (tier: "pro" | "agency") => void;
  onSignIn?: () => void;
  isGuest?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartUpload,
  onSelectPreset,
  onOpenPromptStudio,
  onOpenPricing,
  planTier = "free",
  usageCount = 0,
  maxLimit = 1,
  onUpgradePlan,
  onSignIn,
  isGuest = true,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [isProcessingTier, setIsProcessingTier] = useState<string | null>(null);

  // References for 3D scroll-triggered parallax tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const methodologyRef = useRef<HTMLDivElement>(null);

  // 1. Scroll-triggered parallax for Hero Section
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 95,
    damping: 26,
    restDelta: 0.001,
  });

  // 2. Zero-G Interactive Mouse Gyroscope (Physical Weightless Depth)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springMouseX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const springMouseY = useSpring(mouseY, { stiffness: 90, damping: 22 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- 3D Parallax Transformations for Hero ---
  // Deep Background Layer: ambient glow orbs & cyber grid (z ~ -150px)
  const orb1Y = useTransform(smoothHeroProgress, [0, 1], [0, 220]);
  const orb1X = useTransform(smoothHeroProgress, [0, 1], [0, -90]);
  const orb1Scale = useTransform(smoothHeroProgress, [0, 1], [1, 1.35]);

  const orb2Y = useTransform(smoothHeroProgress, [0, 1], [0, 280]);
  const orb2X = useTransform(smoothHeroProgress, [0, 1], [0, 110]);
  const orb2Scale = useTransform(smoothHeroProgress, [0, 1], [1, 1.5]);

  const gridY = useTransform(smoothHeroProgress, [0, 1], [0, 160]);
  const gridRotateX = useTransform(smoothHeroProgress, [0, 1], [58, 75]);
  const gridOpacity = useTransform(smoothHeroProgress, [0, 0.75], [0.22, 0.02]);

  // Midground Layer: Typography & CTA Buttons (z ~ 0 to 40px)
  const textY = useTransform(smoothHeroProgress, [0, 1], [0, -70]);
  const textZ = useTransform(smoothHeroProgress, [0, 1], [0, -45]);
  const textRotateX = useTransform(smoothHeroProgress, [0, 1], [0, 6]);
  const textOpacity = useTransform(smoothHeroProgress, [0, 0.85], [1, 0.25]);

  const badgesY = useTransform(smoothHeroProgress, [0, 1], [0, -35]);
  const ctaY = useTransform(smoothHeroProgress, [0, 1], [0, -50]);

  // Foreground Elevated 3D Telemetry Stage (z ~ 80px to 130px)
  const cardScrollY = useTransform(smoothHeroProgress, [0, 1], [0, -125]);
  const cardScrollZ = useTransform(smoothHeroProgress, [0, 1], [0, 120]);
  const cardScrollRotateX = useTransform(smoothHeroProgress, [0, 1], [2, -9]);
  const cardScrollRotateY = useTransform(smoothHeroProgress, [0, 1], [-4, 7]);
  const cardScale = useTransform(smoothHeroProgress, [0, 1], [1, 1.04]);

  // Combine scroll tilt + mouse tilt for organic weightless zero-gravity response
  const cardRotateX = useTransform(
    [cardScrollRotateX, springMouseY],
    ([rotX, mY]) => (rotX as number) + (mY as number) * -16
  );
  const cardRotateY = useTransform(
    [cardScrollRotateY, springMouseX],
    ([rotY, mX]) => (rotY as number) + (mX as number) * 16
  );

  // Weightless Floating Satellites & Holographic Depth Chips
  const sat1Y = useTransform(smoothHeroProgress, [0, 1], [0, -180]);
  const sat1X = useTransform(smoothHeroProgress, [0, 1], [0, 50]);
  const sat1Z = useTransform(smoothHeroProgress, [0, 1], [70, 160]);
  const sat1RotZ = useTransform(smoothHeroProgress, [0, 1], [-3, 14]);

  const sat2Y = useTransform(smoothHeroProgress, [0, 1], [0, -90]);
  const sat2X = useTransform(smoothHeroProgress, [0, 1], [0, -40]);
  const sat2Z = useTransform(smoothHeroProgress, [0, 1], [50, 110]);
  const sat2RotZ = useTransform(smoothHeroProgress, [0, 1], [4, -10]);

  const satHudY = useTransform(smoothHeroProgress, [0, 1], [0, -135]);

  // --- 3. Staggered Column Parallax for 6-Stage Reasoning Section ---
  const { scrollYProgress: methodScrollProgress } = useScroll({
    target: methodologyRef,
    offset: ["start end", "end start"],
  });

  const smoothMethodProgress = useSpring(methodScrollProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const col1Y = useTransform(smoothMethodProgress, [0, 1], [40, -40]);
  const col2Y = useTransform(smoothMethodProgress, [0, 1], [85, -85]);
  const col3Y = useTransform(smoothMethodProgress, [0, 1], [25, -25]);

  const col1RotX = useTransform(smoothMethodProgress, [0, 0.5, 1], [5, 0, -4]);
  const col2RotX = useTransform(smoothMethodProgress, [0, 0.5, 1], [7, 0, -6]);
  const col3RotX = useTransform(smoothMethodProgress, [0, 0.5, 1], [4, 0, -3]);

  const handleSelectTier = (tier: "pro" | "agency") => {
    setIsProcessingTier(tier);
    setTimeout(() => {
      onUpgradePlan?.(tier);
      setIsProcessingTier(null);
    }, 800);
  };

  return (
    <div className="space-y-16">
      {/* OMC Omni Hero Typography Section with 3D Parallax & Zero-G Tilt */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="pt-8 pb-4 relative spatial-perspective studio-grid-lines border-b border-white/10"
        style={{ perspective: 1200 }}
      >
        {/* Deep Background Layer: 3D Perspective Ground Grid */}
        <motion.div
          style={{
            y: gridY,
            rotateX: gridRotateX,
            opacity: gridOpacity,
            transformOrigin: "center top",
          }}
          className="absolute inset-x-0 -top-16 h-[520px] pointer-events-none overflow-hidden z-0"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 75% 65% at 50% 30%, black 20%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 30%, black 20%, transparent 85%)",
            }}
          />
        </motion.div>

        {/* Deep Parallax Layer: Ambient Spatial Glow Orbs */}
        <motion.div
          style={{
            y: orb1Y,
            x: orb1X,
            scale: orb1Scale,
          }}
          className="absolute -top-12 -left-12 w-72 h-72 bg-[#00F5D4]/12 rounded-full blur-3xl pointer-events-none antigravity-float"
        />
        <motion.div
          style={{
            y: orb2Y,
            x: orb2X,
            scale: orb2Scale,
          }}
          className="absolute top-1/2 -right-12 w-84 h-84 bg-indigo-500/12 rounded-full blur-3xl pointer-events-none antigravity-float-delayed"
        />

        {/* Main 3D Interactive Stage Grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Midground Layer: Typography & Action CTAs */}
          <motion.div
            className="lg:col-span-8"
            style={{
              y: textY,
              z: textZ,
              rotateX: textRotateX,
              opacity: textOpacity,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Studio Architectural Spatial HUD Coordinates */}
            <motion.div
              style={{ y: satHudY }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 mb-4"
            >
              <Move3d className="w-3.5 h-3.5 text-[#00F5D4] animate-pulse" />
              <span className="font-bold text-white tracking-widest">[00 // 3D SPATIAL PARALLAX]</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">ZERO-G WEIGHTLESS DEPTH</span>
              <span className="w-1.5 h-1.5 bg-[#00F5D4] animate-ping ml-0.5" />
            </motion.div>

            <motion.div
              style={{ y: badgesY }}
              className="flex items-center gap-2 flex-wrap mb-6 text-[10px] font-mono"
            >
              <span className="px-2.5 py-1 bg-white text-black font-bold uppercase tracking-wider">
                [GEMINI 3.8 // MULTIMODAL PERCEPTION]
              </span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/15 text-neutral-300 font-bold uppercase tracking-wider">
                [fMRI BOLD // 14 COGNITIVE NETWORKS]
              </span>
            </motion.div>

            <div className="mb-6">
              <FineLineHeader
                as="h1"
                variant="underline"
                tag="[00 // COMPUTATIONAL NEUROSCIENCE]"
                secondaryTag="LATENCY < 4.2s"
                className="font-display text-huge font-extrabold text-white tracking-tight leading-none uppercase"
                lineColor="rgba(0, 245, 212, 0.5)"
              >
                Predict Content Velocity.<br />
                <TextShimmer className="font-extrabold">Before Deployment.</TextShimmer>
              </FineLineHeader>
            </div>

            <motion.div
              style={{ y: ctaY }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <button
                onClick={onStartUpload}
                className="studio-btn-primary px-7 py-3.5 text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>[UPLOAD VIDEO ASSET →]</span>
              </button>

              <button
                onClick={onSelectPreset}
                className="bg-white/5 border border-white/20 hover:border-white hover:bg-white hover:text-black text-white font-mono font-bold px-6 py-3.5 text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>[EXPLORE PRESET VAULT]</span>
              </button>

              {onOpenPromptStudio && (
                <button
                  onClick={onOpenPromptStudio}
                  className="bg-white/5 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/30 text-purple-200 font-mono font-bold px-5 py-3.5 text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>[AI PROMPT STUDIO]</span>
                  <span className="text-[9px] bg-purple-400 text-black px-1.5 py-0.2 font-extrabold">NEW</span>
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Foreground Elevated 3D Telemetry Card Layer */}
          <motion.div
            className="lg:col-span-4 lg:pt-4 relative"
            style={{
              y: cardScrollY,
              z: cardScrollZ,
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              scale: cardScale,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Weightless Floating Satellite 1: Top-Right Neural Synapse */}
            <motion.div
              style={{
                y: sat1Y,
                x: sat1X,
                z: sat1Z,
                rotateZ: sat1RotZ,
                transformStyle: "preserve-3d",
              }}
              className="absolute -top-6 -right-3 md:-right-6 z-30 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050505]/90 border border-[#00F5D4]/50 backdrop-blur-xl shadow-[0_12px_30px_-6px_rgba(0,245,212,0.35)] text-[11px] font-mono text-[#00F5D4]"
            >
              <div className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping" />
              <span className="font-bold">fMRI BOLD SYNAPSE • 14 NETWORKS</span>
            </motion.div>

            {/* Weightless Floating Satellite 2: Bottom-Left Velocity Vector */}
            <motion.div
              style={{
                y: sat2Y,
                x: sat2X,
                z: sat2Z,
                rotateZ: sat2RotZ,
                transformStyle: "preserve-3d",
              }}
              className="absolute -bottom-5 -left-3 md:-left-6 z-30 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050505]/90 border border-indigo-400/50 backdrop-blur-xl shadow-[0_12px_30px_-6px_rgba(99,102,241,0.35)] text-[11px] font-mono text-indigo-300"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="font-bold">VELOCITY VECTOR: +34.8% LIFT</span>
            </motion.div>

            {/* Spotlight Card with dynamic cursor-following spotlight and Neural Render */}
            <SpotlightCard
              className="p-5 space-y-5 shadow-2xl studio-crosshair border border-white/10 relative"
              spotlightColor="rgba(0, 245, 212, 0.2)"
              withBorderBeam={true}
            >
              {/* Core Visual Anchor: Abstract 3D Architectural Neural Landscape */}
              <div className="relative group overflow-hidden border border-white/15 bg-black/60">
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2 py-0.5 bg-black/85 border border-white/20 text-[9px] font-mono font-bold text-white tracking-widest backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-[#00F5D4] animate-pulse" />
                  <span>[FIG 01 // NEURAL TOPOGRAPHY]</span>
                </div>
                <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 bg-black/85 border border-white/20 text-[8px] font-mono text-neutral-300 backdrop-blur-md">
                  <span>14 BOLD NETWORKS • 3D ISO</span>
                </div>
                <img
                  src={neuralLandscapeImg}
                  alt="Neural brain-map landscape abstract 3D architectural render"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 sm:h-48 object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/90 via-transparent to-transparent pointer-events-none" />
              </div>

              <p className="text-neutral-300 text-xs leading-relaxed font-mono">
                [SYS_INTEL] Computational neuroscience architecture mapping 14 cognitive pathways to quantify hook retention, audience resonance, and share velocity against strict agency SLAs.
              </p>

              {/* Live Dot Matrix Telemetry Readout (dotmatrix.zzzzshawn.cloud) */}
              <DotMatrixDisplay
                label="SYSTEM INGESTION"
                statusText="MULTIMODAL SYNC 60FPS"
                score={92}
                rows={3}
                cols={24}
                color="cyan"
              />

              <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4 font-mono text-xs text-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">[MODEL ENGINE]</span>
                  <span className="font-mono text-xs font-bold text-[#00F5D4]">TRIBE v2 / Gemini 3.8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">[INGESTION]</span>
                  <span className="font-mono text-xs font-semibold text-white">Multimodal Native MP4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">[TARGET]</span>
                  <span className="font-mono text-xs font-bold text-amber-400">≥ 78% 3s Hook Hold</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* 6-Stage Reasoning Architecture with Multi-Column Staggered Parallax */}
      <section ref={methodologyRef} className="relative">
        <div className="mb-8 border-b border-white/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="w-full max-w-xl">
            <FineLineHeader
              as="h2"
              variant="horizon"
              tag="[01 // METHODOLOGY PIPELINE]"
              secondaryTag="6-STAGE REASONING"
              className="font-display font-bold text-3xl text-white tracking-tight uppercase"
              lineColor="rgba(255, 255, 255, 0.3)"
            >
              The 6-Stage Reasoning Chain
            </FineLineHeader>
          </div>
          <p className="text-sm text-neutral-400 font-mono max-w-md">
            [SYS_INTELLIGENCE] TRIBE v2 combines multimodal AI and fMRI BOLD blood-oxygen modeling to evaluate media content with weightless spatial precision.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 spatial-perspective"
          style={{ perspective: 1000 }}
        >
          {/* Column 1: Parallax Layer A */}
          <motion.div
            style={{ y: col1Y, rotateX: col1RotX, transformStyle: "preserve-3d" }}
            className="space-y-6"
          >
            <SpotlightCard className="p-6 rounded-xs flex flex-col justify-between" spotlightColor="rgba(255,255,255,0.1)">
              <div>
                <div className="font-mono text-3xl font-extrabold text-white/20 mb-3">01</div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Multimodal Ingestion</h3>
                <p className="text-sm text-neutral-300 font-normal leading-relaxed">
                  Gemini-3.8 multimodal ingestion processes video frames and audio transcripts directly without lossy compression or frame clipping.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400 flex justify-between font-medium">
                <span>INPUT</span>
                <span className="text-[#00F5D4] font-bold">NATIVE_MP4_AUDIO</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-xs flex flex-col justify-between" spotlightColor="rgba(255,255,255,0.1)">
              <div>
                <div className="font-mono text-3xl font-extrabold text-white/20 mb-3">04</div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Behavioral Engine</h3>
                <p className="text-sm text-neutral-300 font-normal leading-relaxed">
                  Translates cognitive arousal into actionable behavioral metrics: 3-second hook rate, 11-point retention curve, and share velocity.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400 flex justify-between font-medium">
                <span>OUTPUT</span>
                <span className="text-[#00F5D4] font-bold">RETENTION_CURVE</span>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Column 2: Parallax Layer B (Deeper Offset) */}
          <motion.div
            style={{ y: col2Y, rotateX: col2RotX, transformStyle: "preserve-3d" }}
            className="space-y-6"
          >
            <SpotlightCard className="p-6 rounded-xs flex flex-col justify-between" spotlightColor="rgba(255,255,255,0.1)">
              <div>
                <div className="font-mono text-3xl font-extrabold text-white/20 mb-3">02</div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Perceptual Codex</h3>
                <p className="text-sm text-neutral-300 font-normal leading-relaxed">
                  Deconstructs shot-by-shot visual elements: frame visual density, color contrast, motion velocity, and pattern interrupts.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400 flex justify-between font-medium">
                <span>METRIC</span>
                <span className="text-white">DENSITY_INDEX</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-xs flex flex-col justify-between" spotlightColor="rgba(255,255,255,0.1)">
              <div>
                <div className="font-mono text-3xl font-extrabold text-white/20 mb-3">05</div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Strategic Synthesis</h3>
                <p className="text-sm text-neutral-300 font-normal leading-relaxed">
                  Maps emotional valence arc (high vs low tension) and formulates the single highest-leverage edit recommendation.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400 flex justify-between font-medium">
                <span>OUTPUT</span>
                <span className="text-white">EDIT_DIAGNOSTIC</span>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Column 3: Parallax Layer C (Hero Feature Highlights) */}
          <motion.div
            style={{ y: col3Y, rotateX: col3RotX, transformStyle: "preserve-3d" }}
            className="space-y-6"
          >
            <SpotlightCard className="p-6 rounded-xs flex flex-col justify-between border-[#00F5D4]/40 bg-[#00F5D4]/5" spotlightColor="rgba(0,245,212,0.25)" withBorderBeam={true}>
              <div>
                <div className="font-mono text-3xl font-extrabold text-[#00F5D4]/40 mb-3">03</div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Neural Synthesis</h3>
                <p className="text-sm text-neutral-200 font-normal leading-relaxed">
                  Maps perceptual data to predict fMRI BOLD activation across 14 cortical networks including VTA, Nucleus Accumbens, and Amygdala.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-white flex justify-between font-medium">
                <span>OUTPUT</span>
                <span className="text-[#00F5D4] font-bold">14_REGION_MAPPING</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-xs flex flex-col justify-between border-indigo-500/40 bg-indigo-500/5" spotlightColor="rgba(129,140,248,0.25)">
              <div>
                <div className="font-mono text-3xl font-extrabold text-indigo-400/40 mb-3">06</div>
                <h3 className="font-display text-lg font-bold text-white mb-2">AI Hook Rewriter</h3>
                <p className="text-sm text-neutral-200 font-normal leading-relaxed">
                  Generates 3 optimized viral hook scripts (Curiosity Gap, High Stakes, Pattern Interrupt) with predicted lift percentages.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-white flex justify-between font-semibold">
                <span>DELIVERABLE</span>
                <span className="text-indigo-400">3X_HOOK_SCRIPTS</span>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* Subscription & Pricing Section on Home */}
      <section className="studio-panel p-8 md:p-12 border border-white/10 shadow-2xl relative studio-crosshair">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <FineLineHeader
            as="h2"
            variant="both"
            tag="[02 // SUBSCRIPTION TIERS]"
            secondaryTag="AGENCY SLA COMPLIANT"
            className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase"
            lineColor="rgba(0, 245, 212, 0.4)"
          >
            Predict Virality at Scale
          </FineLineHeader>

          <p className="text-neutral-400 text-xs md:text-sm font-mono">
            [SYS_ACCESS] Guests receive 1 free analysis. Sign in for 5 free monthly analyses, or upgrade to Pro Creator for unlimited video viral predictions.
          </p>

          {/* Current Tier Usage Pill */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
              <span className="text-neutral-400">Current Plan:</span>
              <span className="text-[#00F5D4] font-bold uppercase">{planTier === "pro" ? "Pro Creator (Unlimited)" : planTier === "agency" ? "Agency (Unlimited)" : isGuest ? "Guest (1 Analysis)" : "Free Account (5/mo)"}</span>
              <span className="text-neutral-500">•</span>
              <span>Used: <strong className="text-white">{usageCount} / {maxLimit ?? "∞"}</strong></span>
            </div>
          </div>

          {/* Billing Cycle Selector */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-mono font-bold ${billingCycle === "monthly" ? "text-white" : "text-neutral-500"}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 bg-white/10 rounded-full p-1 transition-colors border border-white/15 focus:outline-none cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#00F5D4] shadow-md transform transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white" : "text-neutral-500"}`}>
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00F5D4]/20 text-[#00F5D4] text-[10px] uppercase tracking-wider border border-[#00F5D4]/30 font-extrabold">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch spatial-perspective">
          {/* TIER 1: STARTER FREE */}
          <div className="antigravity-card rounded-xs p-6 flex flex-col justify-between relative">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Starter Free</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">Explore AI Content Analysis</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xs bg-white/5 border border-white/10 text-neutral-300 font-bold">
                  FREE
                </span>
              </div>

              <div className="my-6 space-y-1">
                <div className="text-3xl font-black text-white font-mono">$0</div>
                <div className="text-[11px] font-mono text-neutral-400">Free Forever</div>
              </div>

              <div className="p-3 rounded-xs bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 mb-6 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Guest Limit:</span>
                  <span className="font-bold text-white">1 Analysis Total</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Signed-In Limit:</span>
                  <span className="font-bold text-[#00F5D4]">5 Monthly Analyses</span>
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
                  <span>AI Hook Rewriter & Audio Prompts</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {isGuest ? (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="w-full py-2.5 rounded-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#00F5D4]" />
                  <span>Sign In for 5 Free Analyses</span>
                </button>
              ) : planTier === "free" ? (
                <div className="text-center py-2 text-xs font-mono text-neutral-400 border border-white/10 rounded-xs bg-white/5">
                  Current Plan ({usageCount}/5 Used)
                </div>
              ) : (
                <div className="text-center py-2 text-xs font-mono text-neutral-500">
                  Base Tier
                </div>
              )}
            </div>
          </div>

          {/* TIER 2: PRO CREATOR */}
          <div className="antigravity-card rounded-xs p-6 flex flex-col justify-between relative border-2 border-[#00F5D4] bg-gradient-to-b from-[#00F5D4]/12 via-transparent to-transparent shadow-[0_20px_60px_-15px_rgba(0,245,212,0.25)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#00F5D4] text-black font-mono font-extrabold text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span>MOST POPULAR</span>
            </div>

            <div>
              <div className="flex justify-between items-start mb-4 pt-2">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Pro Creator</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">For Serious Creators & Marketers</p>
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
                  <span>Real-Time Grounded Trends Radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00F5D4] shrink-0" />
                  <span>A/B Duel Side-by-Side Video Comparator</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {planTier === "pro" ? (
                <div className="text-center py-2.5 text-xs font-mono text-[#00F5D4] font-bold border border-[#00F5D4]/40 rounded-xs bg-[#00F5D4]/10">
                  Active Plan (Unlimited)
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectTier("pro")}
                  disabled={isProcessingTier !== null}
                  className="w-full py-3 rounded-xs bg-[#00F5D4] hover:brightness-110 text-black text-xs font-mono font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00F5D4]/25 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessingTier === "pro" ? (
                    <span>Upgrading to Pro...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Upgrade to Pro Creator ($23)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* TIER 3: AGENCY */}
          <div className="antigravity-card rounded-xs p-6 flex flex-col justify-between relative border border-indigo-500/30 hover:border-indigo-500/60">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Agency & Team</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">High-Volume Production</p>
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
                  <span>Batch Multi-Video Processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>White-Label Executive PDF Reports</span>
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
              {planTier === "agency" ? (
                <div className="text-center py-2.5 text-xs font-mono text-indigo-400 font-bold border border-indigo-500/40 rounded-xs bg-indigo-500/10">
                  Active Plan (Agency)
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectTier("agency")}
                  disabled={isProcessingTier !== null}
                  className="w-full py-2.5 rounded-xs bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessingTier === "agency" ? (
                    <span>Upgrading to Agency...</span>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 text-indigo-300" />
                      <span>Upgrade to Agency ($79)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


