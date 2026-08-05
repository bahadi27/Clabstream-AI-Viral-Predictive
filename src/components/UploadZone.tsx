import React, { useState, useRef } from "react";
import { Upload, Film, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { TrimDialog } from "./TrimDialog";
import { extractKeyframesFromVideo } from "../utils/frameExtractor";
import { VideoKeyframe } from "../types";

interface UploadZoneProps {
  onStartAnalysis: (payload: {
    file: File;
    videoBase64: string;
    description: string;
    title: string;
    keyframes?: VideoKeyframe[];
  }) => void;
  isAnalyzing: boolean;
  currentStageText: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onStartAnalysis,
  isAnalyzing,
  currentStageText,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [showTrimModal, setShowTrimModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid MP4 or WebM video file.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Check duration via HTML5 Video element
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(tempVideo.src);
      const dur = tempVideo.duration;
      setVideoDuration(dur);
      if (dur > 15.5) {
        setShowTrimModal(true);
      }
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessAndSubmit = async (fileToUse: File) => {
    // Extract keyframe frame screenshots at key analysis timestamps
    const capturedKeyframes = await extractKeyframesFromVideo(fileToUse, 92);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1] || result;
      onStartAnalysis({
        file: fileToUse,
        videoBase64: base64Data,
        description,
        title: fileToUse.name.replace(/\.[^/.]+$/, ""),
        keyframes: capturedKeyframes,
      });
    };
    reader.readAsDataURL(fileToUse);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (videoDuration > 15.5) {
      setShowTrimModal(true);
      return;
    }

    handleProcessAndSubmit(selectedFile);
  };

  const handleTrimConfirmed = (_start: number, _end: number) => {
    setShowTrimModal(false);
    if (selectedFile) {
      handleProcessAndSubmit(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white border border-[#E5E5E5] rounded-sm p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-6 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
              Multimodal Ingestion
            </span>
            <h2 className="font-display font-extrabold text-3xl text-[#111111] mt-1 tracking-tight">
              Upload Video Asset (≤15s)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#555555] hidden sm:block">
            Gemini 3.6 Multimodal Perception
          </span>
        </div>

        {isAnalyzing ? (
          /* Analysis Stage Progress Indicator */
          <div className="py-16 px-8 bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm text-center space-y-8">
            <div className="w-16 h-16 bg-[#111111] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase font-bold text-[#111111] tracking-widest block mb-2">
                6-Stage Reasoning Pipeline (Gemini 3.6 Engine)
              </span>
              <h3 className="font-display font-bold text-2xl text-[#111111]">
                {currentStageText || "Initializing Gemini 3.6 fMRI Perception Pipeline..."}
              </h3>
            </div>

            <div className="max-w-md mx-auto bg-white border border-[#E5E5E5] p-5 rounded-sm text-xs font-mono text-left space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2.5 text-[#111111] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Stage 1: Multi-Part File Ingestion to Gemini 3.6</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111111] font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Stage 2: Gemini 3.6 Audio Vocal & Waveform Extraction</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111111] font-bold animate-pulse">
                <Sparkles className="w-4 h-4 text-[#111111] shrink-0" />
                <span>Stage 3-6: Gemini 3.6 Neural Synthesis & Strategic Pipeline</span>
              </div>
            </div>
          </div>
        ) : (
          /* Dropzone Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-10 md:p-14 text-center cursor-pointer rounded-sm transition-all ${
                dragActive
                  ? "border-[#111111] bg-neutral-100 scale-[0.99]"
                  : "border-[#E5E5E5] bg-[#F4F4F4] hover:bg-white hover:border-[#111111]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              <div className="w-14 h-14 bg-white border border-[#E5E5E5] rounded-full mx-auto mb-4 flex items-center justify-center shadow-xs">
                <Film className="w-6 h-6 text-[#111111]" />
              </div>

              {selectedFile ? (
                <div>
                  <span className="bg-[#111111] text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider inline-block mb-2">
                    Selected Asset
                  </span>
                  <p className="font-display font-bold text-xl text-[#111111]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs font-mono text-[#555555] font-medium mt-1.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Duration:{" "}
                    {videoDuration > 0 ? `${videoDuration.toFixed(1)}s` : "Checking..."}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-display font-bold text-xl text-[#111111] mb-1">
                    Drag & Drop Short-Form Video Asset
                  </p>
                  <p className="text-xs font-mono text-[#555555] font-medium mb-4">
                    Supports MP4, WebM (Recommended: max 15 seconds, 1080p)
                  </p>
                  <span className="bg-white border border-[#E5E5E5] text-[#111111] px-4 py-2 text-xs font-semibold rounded-sm hover:border-[#111111] transition-all inline-block shadow-xs">
                    Browse Local File
                  </span>
                </div>
              )}
            </div>

            {/* Optional Creator Description Input */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#111111] mb-2 tracking-wider">
                Campaign Intent / Creator Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Gen-Z fitness motivation reel targeting TikTok with high-tempo beat drop..."
                rows={3}
                className="w-full bg-white border border-[#E5E5E5] p-4 text-sm font-sans text-[#111111] rounded-sm focus:outline-hidden focus:border-[#111111] transition-colors placeholder:text-[#555555]"
              />
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!selectedFile}
                className="bg-[#111111] hover:bg-black text-white px-8 py-3.5 text-sm font-semibold rounded-sm transition-all flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Execute 6-Stage Analysis</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Trim Modal */}
      {selectedFile && (
        <TrimDialog
          isOpen={showTrimModal}
          videoUrl={videoPreviewUrl}
          duration={videoDuration}
          onClose={() => setShowTrimModal(false)}
          onConfirmTrim={handleTrimConfirmed}
        />
      )}
    </div>
  );
};
