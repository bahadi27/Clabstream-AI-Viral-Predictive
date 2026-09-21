import React from "react";
import { RESEARCH_CITATIONS } from "../data/brainRegions";
import { Brain, BookOpen, ShieldCheck, Sparkles } from "lucide-react";

export const DeveloperFooter: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16 mt-auto border-t border-white/20 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-12">
        {/* Marquee Citation Strip */}
        <div className="marquee-container bg-black border border-white/20 py-3 px-4 font-mono text-xs text-white">
          <div className="marquee-content font-medium">
            {RESEARCH_CITATIONS.join("  •  ")}  •  {RESEARCH_CITATIONS.join("  •  ")}
          </div>
        </div>

        {/* Developed By Clabstream Agency Banner */}
        <div className="bg-black border border-white/20 p-8 md:p-10 rounded-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Accent Light Beam in Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 border border-white/20 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">
              DEVELOPED & ENGINEERED BY CLABSTREAM AGENCY
            </span>
            <span className="text-[10px] font-mono text-white/80 font-medium">• AGENCY SUITE</span>
          </div>

          {/* Centered Clabstream Agency Container with Official Brand Image */}
          <div className="mb-6 p-4 md:p-5 bg-white rounded-sm shadow-md border border-white/20 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md w-full">
            <img
              src="https://images.glints.com/unsafe/1200x0/glints-dashboard.oss-ap-southeast-1-internal.aliyuncs.com/company-logo/9a8b8496cde4c7c28571b7c676819468.png"
              alt="Clabstream Agency Logo"
              referrerPolicy="no-referrer"
              className="h-10 md:h-12 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col text-center sm:text-left border-t sm:border-t-0 sm:border-l border-neutral-200 pt-2 sm:pt-0 sm:pl-4">
              <span className="font-display font-extrabold text-lg tracking-tight text-[#111111]">
                CLABSTREAM
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-neutral-800 uppercase">
                CREATIVE & DIGITAL AGENCY
              </span>
            </div>
          </div>

          <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight max-w-xl mb-3">
            Predictive Content Velocity Powered by <span className="font-extrabold text-white">Clabstream Agency</span>
          </h3>

          <p className="text-xs md:text-sm font-sans text-neutral-200 max-w-2xl font-normal leading-relaxed mb-6">
            Engineered by Clabstream Agency for high-leverage digital creators, communication teams, and media partners requiring empirical fMRI neural validation over creative guesswork.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-white">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 border border-white/20 rounded-sm text-white font-medium">
              <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Next-Gen Agency Intelligence</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 border border-white/20 rounded-sm text-white font-medium">
              <Brain className="w-3.5 h-3.5 text-white shrink-0" />
              <span>14-Region fMRI Predictive Codex</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/20 pb-12">
          <div>
            <div className="font-display font-extrabold text-2xl tracking-tighter text-white mb-3 flex items-center gap-1.5">
              <span>NeuroViral</span>
              <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-normal">
              Computational neuroscience evaluation model powered by Gemini 3.8 multimodal reasoning. Developed by Clabstream Agency to predict fMRI activation across 14 cortical networks and forecast short-form video velocity.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs text-white uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              <span>Academic Foundations</span>
            </h4>
            <ul className="text-xs font-mono text-neutral-200 space-y-2">
              <li>• TRIBE v2 fMRI Foundation Model</li>
              <li>• Berger & Milkman (2012) Social Transmission</li>
              <li>• Schultz Dopamine Reward Error Mechanics</li>
              <li>• Damasio Somatic Marker Hypothesis</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs text-white uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>System Architecture</span>
            </h4>
            <div className="bg-black border border-white/20 p-4 text-xs font-mono text-white space-y-1.5 rounded-sm">
              <p>• Server: Express Node.js Engine</p>
              <p>• Multimodal AI: @google/genai Gemini 3.8</p>
              <p>• 3D Render Engine: Three.js WebGL</p>
              <p>• Agency & Engineering: Clabstream</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-white">
          <p>© 2026 NeuroViral Systems. Developed by Clabstream Agency.</p>
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4]"></span>
            <span>Clabstream Agency v3.8</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


