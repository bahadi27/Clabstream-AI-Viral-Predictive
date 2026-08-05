import React, { useState } from "react";
import {
  Play,
  Zap,
  Cpu,
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface HeroSectionProps {
  onStartUpload: () => void;
  onSelectPreset: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartUpload,
  onSelectPreset,
}) => {
  const [terminalLogs, setTerminalLogs] = useState<
    { text: string; color: string }[]
  >([
    { text: "> SYSTEM CONNECTION SECURED. API: GEMINI-3.6-FLASH", color: "text-neutral-200 font-semibold" },
    { text: "# Awaiting payload initialization from Key Opinion Leader campaign draft...", color: "text-neutral-300 italic" },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const runTerminalSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationComplete(false);
    setTerminalLogs([
      { text: "> SYSTEM CONNECTION SECURED. API: GEMINI-3.6-FLASH", color: "text-neutral-200 font-semibold" },
    ]);

    const sequence = [
      { text: "> UPLOADING CREATOR ASSET: Q3_Campaign_Draft.mp4 ... [OK]", color: "text-white font-bold" },
      { text: "> EXECUTING WHISPER TRANSCRIPTION...", color: "text-neutral-300" },
      { text: "  [TRANSCRIPT] 'This one hack changed my workflow completely...'", color: "text-neutral-300 italic" },
      { text: "> INITIALIZING PERCEPTUAL CODEX...", color: "text-white font-bold" },
      { text: "  [INFO] Analyzing visual density & edit rhythm...", color: "text-neutral-300" },
      { text: "  [ALERT] Major pattern interrupt detected at T+02.4s", color: "text-white font-bold" },
      { text: "> MAPPING TRIBE V2 NEURAL SYNTHETICS...", color: "text-white font-bold" },
      { text: "  [CALC] Reward Circuit mapping complete.", color: "text-neutral-300" },
      { text: "  [CALC] Amygdala arousal calculated.", color: "text-neutral-300" },
      { text: "> EVALUATING PLATFORM FIT AGAINST SLA THRESHOLDS...", color: "text-white font-bold" },
      { text: "> ANALYSIS COMPLETE. GENERATING REPORT.", color: "text-white font-bold" }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < sequence.length) {
        setTerminalLogs((prev) => [...prev, sequence[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationComplete(true);
      }
    }, 400);
  };

  return (
    <div className="space-y-16">
      {/* OMC Omni Hero Typography Section */}
      <section className="pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="font-display text-huge font-extrabold text-[#111111] mb-6 tracking-tight">
              Predict Content Velocity.<br />
              <span className="text-gradient">Before Deployment.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                onClick={onStartUpload}
                className="bg-[#111111] text-white px-8 py-3.5 text-sm font-semibold rounded-sm shadow-md hover:bg-black transition-all hover:-translate-y-0.5 flex items-center gap-2.5"
              >
                <Zap className="w-4 h-4 fill-current text-white" />
                <span>Upload Video Asset</span>
              </button>

              <button
                onClick={onSelectPreset}
                className="bg-neutral-800 text-white px-8 py-3.5 text-sm font-semibold rounded-sm hover:bg-neutral-900 transition-all flex items-center gap-2.5"
              >
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Explore Preset Vault</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-4 lg:pt-4">
            <p className="text-[#333333] text-lg leading-relaxed font-normal mb-8">
              A computational neuroscience model designed for media monitoring and creator management. We map 14 cognitive pathways to quantify hook retention, audience resonance, and share velocity against strict agency SLAs.
            </p>
            <div className="flex flex-col gap-4 border-l border-[#E5E5E5] pl-6 font-mono text-xs text-[#111111]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-sans font-medium text-[#333333]">Model Engine</span>
                <span className="font-mono text-xs font-semibold text-[#111111]">TRIBE v2 / Gemini 3.6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-sans font-medium text-[#333333]">Ingestion</span>
                <span className="font-mono text-xs font-semibold text-[#111111]">Multimodal Native MP4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-sans font-medium text-[#333333]">Validation Target</span>
                <span className="font-mono text-xs font-bold text-[#111111]">≥ 78% 3s Hook Hold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Processing Console Section */}
      <section className="bg-[#F4F4F4] p-6 md:p-12 rounded-sm border border-[#E5E5E5]">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#111111] tracking-tight">
              Processing Console
            </h2>
            <p className="text-[#333333] text-sm font-normal mt-1">
              Execute neuro-virality pipelines on pending short-form video assets.
            </p>
          </div>
          <button
            onClick={runTerminalSimulation}
            disabled={isSimulating}
            className="bg-[#111111] text-white px-8 py-3 text-sm font-semibold rounded-sm shadow-md hover:bg-black transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isSimulating ? "Processing Signal..." : simulationComplete ? "Re-Run Diagnostic" : "Run Analysis Pipeline"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:h-[520px] bg-omni-black rounded-sm overflow-hidden shadow-2xl border border-white/10">
          {/* Terminal View (Left) */}
          <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 relative min-h-[320px]">
            {/* Terminal Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-6 justify-between bg-white/5">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
              </div>
              <span className="font-mono text-xs text-white/50">live_execution.log</span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs md:text-sm space-y-2">
              {(terminalLogs || []).map((log, idx) => (
                <div key={idx} className={log?.color || "text-neutral-300"}>
                  {log?.text || ""}
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-t from-black to-transparent h-16 pointer-events-none"></div>
          </div>

          {/* Data Output (Right) */}
          <div className="lg:col-span-4 bg-[#0a0a0a] flex flex-col relative p-6">
            {!simulationComplete && !isSimulating && (
              <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity duration-500 p-6 text-center">
                <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest animate-pulse mb-3 font-semibold">Awaiting Signal</span>
                <p className="text-xs text-neutral-300 max-w-xs leading-relaxed font-normal">Click "Run Analysis Pipeline" above or upload your clip to initiate neural evaluation.</p>
              </div>
            )}

            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                Neural Synthetics Map
              </h3>
            </div>

            <div className="space-y-6 flex-1">
              {/* Main Score */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-neutral-200 text-xs font-mono font-medium">Virality Index</span>
                  <span className="font-display text-4xl font-extrabold text-white">
                    {simulationComplete ? "88" : "--"}
                    <span className="text-base text-neutral-300 font-normal">/100</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white data-bar transition-all duration-1000"
                    style={{ width: simulationComplete ? "88%" : "0%" }}
                  ></div>
                </div>
                <p className="font-mono text-xs text-white mt-2.5 font-bold">
                  STATUS: {simulationComplete ? "EXPLOSIVE ALGORITHMIC FIT" : "AWAITING DIAGNOSTIC"}
                </p>
              </div>

              {/* Regional Metrics */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white font-medium">Reward Circuit (Dopamine)</span>
                    <span className="text-neutral-300 font-semibold">{simulationComplete ? "92%" : "0%"}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white data-bar transition-all duration-1000"
                      style={{ width: simulationComplete ? "92%" : "0%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white font-medium">Amygdala (Arousal)</span>
                    <span className="text-neutral-300 font-semibold">{simulationComplete ? "85%" : "0%"}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/80 data-bar transition-all duration-1000"
                      style={{ width: simulationComplete ? "85%" : "0%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white font-medium">Prefrontal Cortex (Identity)</span>
                    <span className="text-neutral-300 font-semibold">{simulationComplete ? "71%" : "0%"}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/50 data-bar transition-all duration-1000"
                      style={{ width: simulationComplete ? "71%" : "0%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white font-medium">Mirror Neurons (Empathy)</span>
                    <span className="text-neutral-300 font-semibold">{simulationComplete ? "42%" : "0%"}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/30 data-bar transition-all duration-1000"
                      style={{ width: simulationComplete ? "42%" : "0%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Stage Reasoning Architecture */}
      <div>
        <div className="mb-8 border-b border-[#E5E5E5] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-widest">
              Methodology Pipeline
            </span>
            <h2 className="font-display font-bold text-3xl text-[#111111] mt-1 tracking-tight">
              The 6-Stage Reasoning Chain
            </h2>
          </div>
          <p className="text-sm text-[#444444] font-normal max-w-md">
            How TRIBE v2 combines multimodal AI and fMRI BOLD blood-oxygen modeling to evaluate media content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-[#E5E5E5] rounded-sm flex flex-col justify-between hover:border-[#111111] transition-colors">
            <div>
              <div className="font-mono text-3xl font-extrabold text-[#E5E5E5] mb-3">01</div>
              <h3 className="font-display text-lg font-bold text-[#111111] mb-2">Multimodal Ingestion</h3>
              <p className="text-sm text-[#333333] font-normal leading-relaxed">
                Gemini-3.6 multimodal ingestion processes video frames and audio transcripts directly without lossy compression or frame clipping.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E5E5E5] text-xs font-mono text-[#111111] flex justify-between font-medium">
              <span>INPUT</span>
              <span className="text-[#111111] font-bold">NATIVE_MP4_AUDIO</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] rounded-sm flex flex-col justify-between hover:border-[#111111] transition-colors">
            <div>
              <div className="font-mono text-3xl font-extrabold text-[#E5E5E5] mb-3">02</div>
              <h3 className="font-display text-lg font-bold text-[#111111] mb-2">Perceptual Codex</h3>
              <p className="text-sm text-[#333333] font-normal leading-relaxed">
                Deconstructs shot-by-shot visual elements: frame visual density, color contrast, motion velocity, and pattern interrupts.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E5E5E5] text-xs font-mono text-[#111111] flex justify-between font-medium">
              <span>METRIC</span>
              <span>DENSITY_INDEX</span>
            </div>
          </div>

          <div className="bg-[#111111] text-white p-6 rounded-sm flex flex-col justify-between shadow-xl">
            <div>
              <div className="font-mono text-3xl font-extrabold text-white/20 mb-3">03</div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Neural Synthesis</h3>
              <p className="text-sm text-neutral-200 font-normal leading-relaxed">
                Maps perceptual data to predict fMRI BOLD activation across 14 cortical networks including VTA, Nucleus Accumbens, and Amygdala.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 text-xs font-mono text-white flex justify-between font-medium">
              <span>OUTPUT</span>
              <span>14_REGION_MAPPING</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] rounded-sm flex flex-col justify-between hover:border-[#111111] transition-colors">
            <div>
              <div className="font-mono text-3xl font-extrabold text-[#E5E5E5] mb-3">04</div>
              <h3 className="font-display text-lg font-bold text-[#111111] mb-2">Behavioral Engine</h3>
              <p className="text-sm text-[#333333] font-normal leading-relaxed">
                Translates cognitive arousal into actionable behavioral metrics: 3-second hook rate, 11-point retention curve, and share velocity.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E5E5E5] text-xs font-mono text-[#111111] flex justify-between font-medium">
              <span>OUTPUT</span>
              <span className="text-[#111111] font-bold">RETENTION_CURVE</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] rounded-sm flex flex-col justify-between hover:border-[#111111] transition-colors">
            <div>
              <div className="font-mono text-3xl font-extrabold text-[#E5E5E5] mb-3">05</div>
              <h3 className="font-display text-lg font-bold text-[#111111] mb-2">Strategic Synthesis</h3>
              <p className="text-sm text-[#333333] font-normal leading-relaxed">
                Maps emotional valence arc (high vs low tension) and formulates the single highest-leverage edit recommendation.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E5E5E5] text-xs font-mono text-[#111111] flex justify-between font-medium">
              <span>OUTPUT</span>
              <span>EDIT_DIAGNOSTIC</span>
            </div>
          </div>

          <div className="bg-[#111111] text-white p-6 rounded-sm flex flex-col justify-between shadow-lg">
            <div>
              <div className="font-mono text-3xl font-extrabold text-white/30 mb-3">06</div>
              <h3 className="font-display text-lg font-bold text-white mb-2">AI Hook Rewriter</h3>
              <p className="text-sm text-white/90 font-light leading-relaxed">
                Generates 3 optimized viral hook scripts (Curiosity Gap, High Stakes, Pattern Interrupt) with predicted lift percentages.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/20 text-xs font-mono text-white flex justify-between font-semibold">
              <span>DELIVERABLE</span>
              <span>3X_HOOK_SCRIPTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


