import React, { useState } from "react";
import { ViralBenchmark } from "../types";
import { Sparkles, X, Upload, Video, Link2, CheckCircle2, AlertCircle, Loader2, Award, Zap } from "lucide-react";

interface FeedViralVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBenchmarkLearned: (benchmark: ViralBenchmark) => void;
}

export const FeedViralVideoModal: React.FC<FeedViralVideoModalProps> = ({
  isOpen,
  onClose,
  onBenchmarkLearned,
}) => {
  const [feedMode, setFeedMode] = useState<"video" | "link">("video");
  const [title, setTitle] = useState("");
  const [provenViews, setProvenViews] = useState("14.2M Views");
  const [category, setCategory] = useState("Education / Tech");
  const [platform, setPlatform] = useState<"tiktok" | "instagram" | "youtube">("tiktok");
  const [transcript, setTranscript] = useState("");
  const [whyItBlewUp, setWhyItBlewUp] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleLearnDna = async () => {
    setIsExtracting(true);
    setErrorMsg(null);

    try {
      let videoBase64 = "";
      let mimeType = "video/mp4";

      if (videoFile && videoFile.size < 20 * 1024 * 1024) {
        mimeType = videoFile.type || "video/mp4";
        videoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(videoFile);
        });
      }

      const res = await fetch("/api/benchmark/extract-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Proven Viral Video",
          provenViews: provenViews || "10M+ Views",
          category,
          platform,
          transcript,
          description: whyItBlewUp,
          videoBase64,
          mimeType,
        }),
      });

      const data = await res.json();
      if (data.success && data.benchmark) {
        onBenchmarkLearned(data.benchmark);
        onClose();
      } else {
        setErrorMsg(data.error || "Failed to extract DNA. Please try again.");
      }
    } catch (err: any) {
      console.error("Extraction error:", err);
      setErrorMsg("Network error extracting viral DNA. Using learned profile fallback.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        id="feed-viral-video-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Feed Proven Viral Benchmark
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-full">
                  AI DNA Extraction
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Teach the system from high-performing viral videos to unlock custom DNA benchmarks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mode Switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
            <button
              onClick={() => setFeedMode("video")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                feedMode === "video"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Video className="w-4 h-4 text-rose-500" />
              Upload Viral Video File
            </button>
            <button
              onClick={() => setFeedMode("link")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                feedMode === "link"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Link2 className="w-4 h-4 text-cyan-500" />
              Dialogue & Concept Profile
            </button>
          </div>

          {feedMode === "video" ? (
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 dark:hover:border-amber-500/50 rounded-xl p-6 text-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-800/20">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {videoFile ? videoFile.name : "Select proven viral video file"}
                  </span>
                  <span className="text-xs text-zinc-500 mt-1">
                    {videoFile
                      ? `${(((videoFile?.size || 0) / (1024 * 1024))).toFixed(1)} MB selected`
                      : "MP4, MOV, WebM up to 50MB (Gemini Vision extracts hook & pacing)"}
                  </span>
                </div>
              </label>
            </div>
          ) : null}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Viral Benchmark Title / Nickname
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Editing Mistakes Hook (21M Views)"
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Proven View Count / Reach
              </label>
              <input
                type="text"
                value={provenViews}
                onChange={(e) => setProvenViews(e.target.value)}
                placeholder="e.g. 14.5M Views, 850k Shares"
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Content Niche / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="Education / Tech">Education / Tech</option>
                <option value="Food & ASMR">Food & ASMR</option>
                <option value="Fitness & Transformation">Fitness & Transformation</option>
                <option value="E-Commerce & DTC">E-Commerce & DTC</option>
                <option value="Storytelling & Vlog">Storytelling & Vlog</option>
                <option value="Comedy & Skit">Comedy & Skit</option>
                <option value="Finance & Business">Finance & Business</option>
                <option value="Custom / User Upload">Custom / General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Primary Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="tiktok">TikTok FYP</option>
                <option value="instagram">Instagram Reels</option>
                <option value="youtube">YouTube Shorts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Opening Hook Words or Full Dialogue (Optional if video uploaded)
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={2}
              placeholder="e.g. Stop scrolling! If you're still doing [X], here is why you're losing [Y]..."
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Why did this video blow up? (Contextual notes)
            </label>
            <input
              type="text"
              value={whyItBlewUp}
              onChange={(e) => setWhyItBlewUp(e.target.value)}
              placeholder="e.g. Extreme audio crunch on the first bite + fast 0.8s zooms created addictive watch-through."
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLearnDna}
            disabled={isExtracting || (!videoFile && !title && !transcript)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deconstructing Viral DNA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Viral DNA & Learn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
