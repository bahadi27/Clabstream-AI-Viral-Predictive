import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Film,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crown,
  Lock,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Radio,
  X,
  Check,
} from "lucide-react";
import { TrimDialog } from "./TrimDialog";
import { extractKeyframesFromVideo } from "../utils/frameExtractor";
import { VideoKeyframe } from "../types";
import { FineLineHeader } from "./ui/FineLineHeader";

export function formatFilenameToTitle(fileName: string, fallbackTopic?: string): string {
  if (!fileName || typeof fileName !== "string") {
    return fallbackTopic?.trim() || "";
  }

  // Strip extension
  let base = fileName.replace(/\.[^/.]+$/, "").trim();

  // If empty
  if (!base) return fallbackTopic?.trim() || "";

  // Remove common generic camera, screen-recorder, or default upload prefixes
  const strippedPrefix = base.replace(
    /^(IMG|VID|RPReplay|Screen[-_ ]Recording|Clip|Video|Recording|Trim|Asset|Media|Draft|vlog)[-_ \d]+/i,
    ""
  ).trim();

  const workingName = strippedPrefix.length >= 2 ? strippedPrefix : base;

  // Replace underscores, hyphens, pluses, dots with spaces
  const spaced = workingName.replace(/[-_+.]+/g, " ").replace(/\s+/g, " ").trim();

  // Check if what remains is just random hex/digits or too short
  const isPureGibberish = /^[0-9a-f]{6,}$/i.test(spaced) || /^\d+$/.test(spaced) || spaced.length < 2;

  if (isPureGibberish) {
    if (fallbackTopic && fallbackTopic.trim().length > 3) {
      return fallbackTopic.trim().slice(0, 50);
    }
    return "";
  }

  // Capitalize words nicely
  const titleCased = spaced
    .split(" ")
    .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");

  return titleCased;
}

interface UploadZoneProps {
  onStartAnalysis: (payload: {
    file: File;
    videoBase64: string;
    description: string;
    title: string;
    keyframes?: VideoKeyframe[];
    voiceoverDraft?: string;
    voiceoverAudioBase64?: string;
  }) => void;
  isAnalyzing: boolean;
  currentStageText: string;
  planTier?: "free" | "pro" | "agency";
  usageCount?: number;
  maxLimit?: number | null;
  onOpenPricing?: (reason?: string) => void;
  isGuest?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onStartAnalysis,
  isAnalyzing,
  currentStageText,
  planTier = "free",
  usageCount = 0,
  maxLimit = 1,
  onOpenPricing,
  isGuest = true,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── MICROPHONE CAPTURE & VOICEOVER DRAFT STATE ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceoverDraft, setVoiceoverDraft] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolumeLevel, setAudioVolumeLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up media resources on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecordingCleanup();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const stopVoiceRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  const startVoiceRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone capture is not supported in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = stream;

      // Setup Web Audio Analyser for real-time visual meter
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(updateVolume);
            }
          };
          updateVolume();
        }
      } catch (audioCtxErr) {
        console.warn("Audio analyser setup notice:", audioCtxErr);
      }

      // Determine supported mimeType for MediaRecorder
      let mimeType = "audio/webm;codecs=opus";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg";
        } else {
          mimeType = "";
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert blob to base64 for Gemini ingestion
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = reader.result as string;
          if (resultStr && resultStr.includes(",")) {
            setAudioBase64(resultStr.split(",")[1]);
          }
        };
        reader.readAsDataURL(audioBlob);

        // Revoke old stream tracks
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((t) => t.stop());
          audioStreamRef.current = null;
        }
      };

      recorder.start(250); // Slice every 250ms
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start duration counter (max 60s)
      let sec = 0;
      timerIntervalRef.current = setInterval(() => {
        sec += 1;
        setRecordingSeconds(sec);
        if (sec >= 60) {
          stopVoiceRecording();
        }
      }, 1000);

      // Attempt live SpeechRecognition for real-time transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = navigator.language || "en-US";

          let finalTranscripts = voiceoverDraft ? `${voiceoverDraft} ` : "";

          recognition.onresult = (event: any) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscripts += event.results[i][0].transcript + " ";
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            setVoiceoverDraft((finalTranscripts + interimTranscript).trim());
          };

          recognition.onerror = (recErr: any) => {
            console.warn("Speech recognition notice:", recErr?.error || recErr);
            setIsLiveTranscribing(false);
          };

          recognition.onend = () => {
            setIsLiveTranscribing(false);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
          setIsLiveTranscribing(true);
        } catch (sttErr) {
          console.warn("Speech recognition initialization notice:", sttErr);
        }
      }
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setMicError(
        err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
          ? "Microphone access was denied. Please allow microphone permissions in your browser bar to record your voiceover draft."
          : `Unable to access microphone: ${err?.message || "Check device connection."}`
      );
      stopVoiceRecordingCleanup();
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    setAudioDuration(recordingSeconds);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    stopVoiceRecordingCleanup();
  };

  const cancelVoiceRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    stopVoiceRecordingCleanup();
  };

  const clearRecordedVoiceover = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBase64(null);
    setAudioDuration(0);
    setIsPlayingAudio(false);
  };

  const togglePlayAudioPreview = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().catch(() => setIsPlayingAudio(false));
      setIsPlayingAudio(true);
    }
  };

  const isVideoFile = (file: File) => {
    if (file.type && file.type.startsWith("video/")) return true;
    const extensionPattern = /\.(mp4|webm|mov|mkv|avi|m4v|3gp|flv|ts|wmv|ogv)$/i;
    return extensionPattern.test(file.name);
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!isVideoFile(file)) {
      setErrorMessage(
        `"${file.name}" does not appear to be a supported video file. Please select a video file (.mp4, .mov, .webm, .mkv, .avi, etc.).`
      );
      return;
    }

    // Size limit check (warn if > 250MB)
    if (file.size > 250 * 1024 * 1024) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a video under 250MB for optimal Gemini multimodal processing.`
      );
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Check duration via HTML5 Video element with fallback timeout
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = url;

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(tempVideo.src);
    }, 4000);

    tempVideo.onloadedmetadata = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(tempVideo.src);
      const dur = tempVideo.duration || 0;
      setVideoDuration(dur);
      if (dur > 15.5) {
        setShowTrimModal(true);
      }
    };

    tempVideo.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(tempVideo.src);
      setVideoDuration(0);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSampleClip = () => {
    // Create a sample representative video asset
    const sampleBlob = new Blob(["sample video asset data"], { type: "video/mp4" });
    const sampleFile = new File([sampleBlob], "cyber-glitch-dance-drop.mp4", { type: "video/mp4" });
    setSelectedFile(sampleFile);
    setTitle("Cyber-Glitch Micro Dance Drop (12s)");
    setDescription("Viral Gen-Z Cyberpunk Dance choreography with fast-cut bass drop and kinetic caption hook.");
    setVoiceoverDraft("Wait, if you're still doing normal dance transitions in 2025, watch this cyber-glitch frame drop...");
    setVideoDuration(12.0);
    setErrorMessage(null);
  };

  const handleProcessAndSubmit = async (fileToUse: File) => {
    try {
      // Support pre-production text/script-only submissions directly
      if (!fileToUse.type.startsWith("video/")) {
        onStartAnalysis({
          file: fileToUse,
          videoBase64: "",
          description: description.trim() || undefined,
          title: title.trim() || "Pre-Production Script Strategy",
          keyframes: [],
          voiceoverDraft: voiceoverDraft.trim() || undefined,
          voiceoverAudioBase64: audioBase64 || undefined,
        });
        return;
      }

      // Extract keyframe frame screenshots at key analysis timestamps with fallback safety
      let capturedKeyframes: VideoKeyframe[] = [];
      try {
        capturedKeyframes = await extractKeyframesFromVideo(fileToUse, 92);
      } catch (err) {
        console.warn("Keyframe extraction non-fatal warning:", err);
      }

      const derivedFileTitle = formatFilenameToTitle(
        fileToUse.name,
        voiceoverDraft.trim() || description.trim()
      );
      const cleanTitle =
        title.trim() ||
        derivedFileTitle ||
        (description.trim() ? description.trim().slice(0, 48) : "") ||
        "Short-Form Video Performance";

      // Always pass the extracted keyframes; for lightweight clips <= 2MB, also pass base64 if available
      if (fileToUse.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = (typeof result === "string" && result.includes(",")) ? result.split(",")[1] : (result || "");
          onStartAnalysis({
            file: fileToUse,
            videoBase64: base64Data,
            description,
            title: cleanTitle,
            keyframes: capturedKeyframes,
            voiceoverDraft: voiceoverDraft.trim() || undefined,
            voiceoverAudioBase64: audioBase64 || undefined,
          });
        };
        reader.onerror = () => {
          onStartAnalysis({
            file: fileToUse,
            videoBase64: "",
            description,
            title: cleanTitle,
            keyframes: capturedKeyframes,
            voiceoverDraft: voiceoverDraft.trim() || undefined,
            voiceoverAudioBase64: audioBase64 || undefined,
          });
        };
        reader.readAsDataURL(fileToUse);
      } else {
        // High-speed keyframe visual processing (sub-150KB total payload for instant perception)
        onStartAnalysis({
          file: fileToUse,
          videoBase64: "",
          description,
          title: cleanTitle,
          keyframes: capturedKeyframes,
          voiceoverDraft: voiceoverDraft.trim() || undefined,
          voiceoverAudioBase64: audioBase64 || undefined,
        });
      }
    } catch (submitErr: any) {
      setErrorMessage(submitErr?.message || "An error occurred while preparing the video for upload.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check tier usage limit before proceeding
    if (maxLimit !== null && usageCount >= maxLimit) {
      const reason = isGuest
        ? "Guest limit reached (1/1 free analysis used). Please sign in with Google to get 5 free monthly analyses, or upgrade to Pro Creator for unlimited analyses!"
        : "Free Plan monthly quota reached (5/5 free analyses used). Upgrade to Pro Creator for unlimited video virality analyses!";
      onOpenPricing?.(reason);
      return;
    }

    if (!selectedFile && !voiceoverDraft.trim() && !description.trim()) {
      setErrorMessage("Please select a video file or enter a voiceover/script draft to analyze.");
      return;
    }

    if (selectedFile) {
      if (videoDuration > 15.5) {
        setShowTrimModal(true);
        return;
      }
      handleProcessAndSubmit(selectedFile);
    } else {
      // Script-only / Pre-production mode
      const syntheticFile = new File(
        [voiceoverDraft || description || "Spoken script draft"],
        "pre-production-script.txt",
        { type: "text/plain" }
      );
      handleProcessAndSubmit(syntheticFile);
    }
  };

  const handleTrimConfirmed = (_start: number, _end: number) => {
    setShowTrimModal(false);
    if (selectedFile) {
      handleProcessAndSubmit(selectedFile);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="studio-panel p-6 sm:p-10 shadow-2xl relative studio-crosshair border border-white/10">
        <div className="border-b border-white/10 pb-6 mb-8">
          <FineLineHeader
            as="h2"
            variant="horizon"
            tag="[01 // MULTIMODAL INGESTION PIPELINE]"
            secondaryTag="GEMINI 3.8 // MULTIMODAL PERCEPTION"
            className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight uppercase"
            lineColor="rgba(0, 245, 212, 0.45)"
          >
            Ingest Video Asset (0.5s - 60s+)
          </FineLineHeader>
        </div>

        {/* Tier Usage Status Bar */}
        <div className="bg-[#08080A] border border-white/10 p-3.5 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <Crown className={`w-4 h-4 ${planTier !== "free" ? "text-[#00F5D4]" : "text-amber-400"}`} />
            <span className="text-neutral-300">
              Active Tier:{" "}
              <strong className="text-white uppercase">
                {planTier === "pro"
                  ? "Pro Creator (Unlimited)"
                  : planTier === "agency"
                  ? "Agency (Unlimited)"
                  : isGuest
                  ? "Guest Mode"
                  : "Free Account"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-400">
              Usage:{" "}
              <strong
                className={
                  maxLimit !== null && usageCount >= maxLimit
                    ? "text-amber-400 font-bold"
                    : "text-[#00F5D4]"
                }
              >
                {usageCount} / {maxLimit ?? "Unlimited"}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => onOpenPricing?.()}
              className="px-2.5 py-1 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black font-bold transition-all text-[11px]"
            >
              {maxLimit !== null && usageCount >= maxLimit ? "LIMIT REACHED - UPGRADE" : "VIEW TIERS"}
            </button>
          </div>
        </div>

        {/* Error Message Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-sm font-mono">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-white">Unable to process file</p>
              <p className="text-xs text-red-300 mt-0.5">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-mono text-red-400 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {isAnalyzing ? (
          /* Analysis Stage Progress Indicator */
          <div className="py-16 px-8 bg-[#08080A] border border-white/10 text-center space-y-8 relative studio-crosshair">
            <div className="w-16 h-16 bg-white text-black rounded-none mx-auto flex items-center justify-center shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase font-bold text-[#00F5D4] tracking-widest block mb-2">
                [6-STAGE REASONING PIPELINE // GEMINI 3.8 ENGINE]
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                {currentStageText || "Initializing Gemini 3.8 fMRI Perception Pipeline..."}
              </h3>
            </div>

            <div className="max-w-md mx-auto bg-[#0E0E12] border border-white/10 p-5 text-xs font-mono text-left space-y-2.5 shadow-2xl">
              <div className="flex items-center gap-2.5 text-white font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#00F5D4] shrink-0" />
                <span>Stage 1: Multi-Part File Ingestion to Gemini 3.8</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#00F5D4] shrink-0" />
                <span>Stage 2: Gemini 3.8 Audio Vocal & Waveform Extraction</span>
              </div>
              {voiceoverDraft && (
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Microphone Voiceover Draft Attached for Hook Precision</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-white font-bold animate-pulse">
                <Sparkles className="w-4 h-4 text-[#00F5D4] shrink-0" />
                <span>Stage 3-6: Neural Synthesis & Strategic Pipeline</span>
              </div>
            </div>
          </div>
        ) : (
          /* Dropzone Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Video File Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-all relative ${
                dragActive
                  ? "border-white bg-white/10 scale-[0.99]"
                  : "border-white/15 bg-[#0A0A0E] hover:bg-[#0E0E14] hover:border-white/40"
              }`}
            >
              {/* Viewfinder corner accents */}
              <span className="absolute top-2 left-2 text-neutral-600 font-mono text-xs">┌</span>
              <span className="absolute top-2 right-2 text-neutral-600 font-mono text-xs">┐</span>
              <span className="absolute bottom-2 left-2 text-neutral-600 font-mono text-xs">└</span>
              <span className="absolute bottom-2 right-2 text-neutral-600 font-mono text-xs">┘</span>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.mov,.webm,.mkv,.avi,.m4v,.3gp,.flv,.ts,.wmv,.ogv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                  e.target.value = "";
                }}
              />

              <div className="w-14 h-14 bg-white/5 border border-white/15 rounded-none mx-auto mb-4 flex items-center justify-center shadow-xs">
                <Film className="w-6 h-6 text-white" />
              </div>

              {selectedFile ? (
                <div>
                  <span className="bg-white text-black font-mono text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider inline-block mb-2">
                    [SELECTED ASSET]
                  </span>
                  <p className="font-display font-bold text-xl text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs font-mono text-neutral-400 font-medium mt-1.5">
                    {(((selectedFile?.size || 0) / (1024 * 1024))).toFixed(2)} MB • Duration:{" "}
                    {videoDuration > 0 ? `${(videoDuration || 0).toFixed(1)}s` : "Checking..."}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setVideoPreviewUrl("");
                      setVideoDuration(0);
                    }}
                    className="mt-3 text-xs font-mono text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Remove & choose another video
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-display font-bold text-xl text-white mb-1">
                    Drag & Drop Short-Form Video Asset
                  </p>
                  <p className="text-xs font-mono text-neutral-400 font-medium mb-4">
                    Supports MP4, MOV, WebM, MKV, AVI (Max 250MB)
                  </p>
                  <span className="bg-white text-black px-4 py-2 text-xs font-mono font-bold hover:bg-[#00F5D4] transition-all inline-block">
                    BROWSE LOCAL FILE
                  </span>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-500">or</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadSampleClip();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-white/10 hover:bg-white hover:text-black text-white border border-white/15 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
                      <span>TRY WITH SAMPLE VIDEO CLIP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── DEDICATED MICROPHONE CAPTURE & VOICEOVER DRAFT SECTION ── */}
            <div className="bg-[#0A0A0E] border border-white/10 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/10 text-white flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>Voiceover Draft & Microphone Ingestion</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30">
                        GEMINI HOOK OPTIMIZER
                      </span>
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Record or dictate spoken voiceover for higher accuracy AI hook generation.
                    </p>
                  </div>
                </div>

                {audioUrl && !isRecording && (
                  <button
                    type="button"
                    onClick={clearRecordedVoiceover}
                    className="text-xs font-mono text-neutral-400 hover:text-red-400 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Recording</span>
                  </button>
                )}
              </div>

              {/* Microphone Error Notice */}
              {micError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-white">Microphone Error</p>
                    <p className="text-[11px] text-red-300 mt-0.5">{micError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMicError(null)}
                    className="text-red-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Audio Player instance for playback */}
              {audioUrl && (
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  onPlay={() => setIsPlayingAudio(true)}
                  onPause={() => setIsPlayingAudio(false)}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
              )}

              {/* State 1: Active Recording in Progress */}
              {isRecording ? (
                <div className="bg-white dark:bg-neutral-900 border-2 border-rose-500/80 rounded-sm p-4 space-y-4 shadow-sm animate-pulse-border">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-600 tracking-wider">
                        RECORDING VOICEOVER · {formatTimer(recordingSeconds)} / 01:00
                      </span>
                      {isLiveTranscribing && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xs">
                          Live Dictation Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelVoiceRecording}
                        className="px-2.5 py-1 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-300 dark:border-neutral-700 rounded-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        id="btn-stop-voice-recording"
                        onClick={stopVoiceRecording}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs rounded-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>Stop & Attach Draft</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Audio Equalizer Waveform Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-10 bg-neutral-100 dark:bg-neutral-800/60 rounded-xs px-4">
                    {[18, 45, 75, 90, 60, 85, 40, 95, 65, 50, 80, 30].map((h, i) => {
                      const dynamicScale = Math.max(0.2, (audioVolumeLevel / 100) * (h / 100) + 0.15);
                      return (
                        <span
                          key={i}
                          className="w-1.5 bg-rose-500 rounded-full transition-all duration-75"
                          style={{
                            height: `${Math.max(6, Math.min(32, 32 * dynamicScale))}px`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Real-time speech transcript feedback */}
                  <div className="p-3 bg-[#0E0E12] border border-white/10">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      [LIVE SPOKEN VOICEOVER STREAM]:
                    </p>
                    <p className="text-xs font-mono text-neutral-200 min-h-[1.5rem] italic">
                      {voiceoverDraft || "Speak into your microphone now (e.g. your opening 3-second hook or narration)..."}
                    </p>
                  </div>
                </div>
              ) : audioUrl ? (
                /* State 2: Voiceover Audio Recorded & Attached */
                <div className="bg-[#0E0E12] border border-emerald-500/40 p-4 space-y-3 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        VOICEOVER CAPTURED ({audioDuration > 0 ? `${audioDuration}s` : "ATTACHED"})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio Playback Toggle */}
                      <button
                        type="button"
                        onClick={togglePlayAudioPreview}
                        className="px-3 py-1 text-xs font-mono font-bold bg-white text-black hover:bg-[#00F5D4] transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {isPlayingAudio ? (
                          <>
                            <Pause className="w-3 h-3 fill-current" />
                            <span>PAUSE</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>PLAY DRAFT</span>
                          </>
                        )}
                      </button>

                      {/* Re-record Trigger */}
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="px-2.5 py-1 text-xs font-mono border border-white/20 text-neutral-300 hover:border-white hover:text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>RE-RECORD</span>
                      </button>
                    </div>
                  </div>

                  {/* Transcribed / Editable Script Box */}
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                      Spoken Script / Voiceover Draft:
                    </label>
                    <textarea
                      value={voiceoverDraft}
                      onChange={(e) => setVoiceoverDraft(e.target.value)}
                      placeholder="Transcribed voiceover draft text..."
                      rows={2}
                      className="w-full bg-[#08080A] border border-white/15 p-2.5 text-xs font-mono text-white focus:outline-hidden focus:border-white transition-colors"
                    />
                  </div>
                </div>
              ) : (
                /* State 3: Idle Microphone Capture Trigger */
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-[#0E0E12] border border-white/10">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      id="btn-start-mic-voiceover-capture"
                      onClick={startVoiceRecording}
                      className="px-4 py-2 bg-white hover:bg-[#00F5D4] text-black font-mono font-bold text-xs transition flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Mic className="w-4 h-4 fill-current" />
                      <span>RECORD VOICEOVER DRAFT</span>
                    </button>
                    <div className="hidden md:block text-[10px] font-mono text-neutral-400">
                      <span>Click to dictate opening 3-second hook directly into microphone.</span>
                    </div>
                  </div>

                  {voiceoverDraft && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1 self-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Draft text attached</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Optional Title Input */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-white mb-2 tracking-wider">
                Video Title / Campaign Concept (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 15s High-Energy Fitness Hook or Glitch Transition Demo"
                className="w-full bg-[#08080A] border border-white/15 px-4 py-3 text-sm font-sans text-white focus:outline-hidden focus:border-white transition-colors placeholder:text-neutral-500"
              />
            </div>

            {/* Optional Creator Description Input */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-white mb-2 tracking-wider flex items-center justify-between">
                <span>Campaign Intent / Creator Notes (Optional)</span>
                {voiceoverDraft && (
                  <span className="text-[10px] font-mono text-emerald-400 font-normal">
                    ✓ Voiceover draft included
                  </span>
                )}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Gen-Z fitness motivation reel targeting TikTok with high-tempo beat drop..."
                rows={2}
                className="w-full bg-[#08080A] border border-white/15 p-4 text-sm font-sans text-white focus:outline-hidden focus:border-white transition-colors placeholder:text-neutral-500"
              />
            </div>

            {/* Limit Warning if quota is reached */}
            {maxLimit !== null && usageCount >= maxLimit && (
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-amber-200 font-medium">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isGuest
                      ? "Guest analysis limit reached (1/1 used). Sign in or upgrade to continue."
                      : "Free monthly quota reached (5/5 used). Upgrade for unlimited runs."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPricing?.()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold shrink-0 transition-colors"
                >
                  Unlock More
                </button>
              </div>
            )}

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="text-xs font-mono text-neutral-400">
                {selectedFile ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Video asset selected ({videoDuration > 0 ? `${(videoDuration || 0).toFixed(1)}s` : "Ready"})
                  </span>
                ) : voiceoverDraft.trim() || description.trim() ? (
                  <span className="text-[#00F5D4] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Pre-production script/voiceover mode active
                  </span>
                ) : (
                  <span>Select a video asset or draft a spoken hook/script above</span>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedFile && !voiceoverDraft.trim() && !description.trim()}
                className="studio-btn-primary px-8 py-3.5 text-xs tracking-wider uppercase font-mono font-bold justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>EXECUTE MULTIMODAL ANALYSIS →</span>
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
          onAnalyzeFullVideo={() => {
            setShowTrimModal(false);
            if (selectedFile) {
              handleProcessAndSubmit(selectedFile);
            }
          }}
        />
      )}
    </div>
  );
};
