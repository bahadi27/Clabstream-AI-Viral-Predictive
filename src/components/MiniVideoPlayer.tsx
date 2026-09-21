import React, { useRef, useState, useEffect } from "react";
import { VideoKeyframe } from "../types";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Camera,
  Film,
  Zap,
  Clock,
  Sparkles,
  Maximize2,
  ChevronRight,
  Eye
} from "lucide-react";

interface MiniVideoPlayerProps {
  videoUrl?: string;
  title?: string;
  keyframes?: VideoKeyframe[];
  videoDurationSeconds?: number;
  seekTime?: number | null;
  onKeyframeClick?: (keyframe: VideoKeyframe) => void;
}

export function parseTimestampToSeconds(ts: string | number | undefined): number {
  if (typeof ts === "number") return ts;
  if (!ts) return 0;
  const str = String(ts);
  if (str.includes(":")) {
    const parts = str.split(":");
    if (parts.length === 2) {
      return (parseFloat(parts[0]) || 0) * 60 + (parseFloat(parts[1]) || 0);
    }
  }
  return parseFloat(str.replace(/[^\d.]/g, "")) || 0;
}

export const MiniVideoPlayer: React.FC<MiniVideoPlayerProps> = ({
  videoUrl,
  title = "Video Asset",
  keyframes = [],
  videoDurationSeconds = 15,
  seekTime,
  onKeyframeClick,
}) => {
  const safeKeyframes = Array.isArray(keyframes) ? keyframes : [];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoDurationSeconds);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [activeKeyframe, setActiveKeyframe] = useState<VideoKeyframe | null>(
    safeKeyframes[0] || null
  );

  // Sync external seek requests
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined) {
      handleSeek(seekTime);
    }
  }, [seekTime]);

  // Update active keyframe based on current time
  useEffect(() => {
    if (safeKeyframes.length === 0) return;
    let closest = safeKeyframes[0];
    let minDiff = Math.abs(currentTime - parseTimestampToSeconds(closest.timeInSeconds ?? closest.timestamp));

    for (let i = 1; i < safeKeyframes.length; i++) {
      const kfTime = parseTimestampToSeconds(safeKeyframes[i].timeInSeconds ?? safeKeyframes[i].timestamp);
      const diff = Math.abs(currentTime - kfTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = safeKeyframes[i];
      }
    }
    setActiveKeyframe(closest);
  }, [currentTime, safeKeyframes]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // Fallback or autoplay block
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (timeInSec: number) => {
    const target = Math.max(0, Math.min(duration || 60, timeInSec));
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || videoDurationSeconds);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`;
  };

  const handleJumpToKeyframe = (kf: VideoKeyframe) => {
    const sec = parseTimestampToSeconds(kf.timeInSeconds ?? kf.timestamp);
    handleSeek(sec);
    setActiveKeyframe(kf);
    if (onKeyframeClick) {
      onKeyframeClick(kf);
    }
  };

  return (
    <div className="bg-[#0B0C0E] border border-neutral-800 rounded-sm p-4 text-white shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Interactive Keyframe Player
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{formatSeconds(currentTime)} / {formatSeconds(duration)}</span>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="relative aspect-video bg-black rounded-xs overflow-hidden border border-neutral-800 group shadow-inner">
        {videoUrl && !hasVideoError ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setHasVideoError(true)}
            playsInline
            muted={isMuted}
          />
        ) : (
          /* Fallback Keyframe Image Viewer if video URL is not present or errs */
          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
            {activeKeyframe?.imageData ? (
              <img
                src={activeKeyframe.imageData}
                alt={activeKeyframe.label}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                <Film className="w-10 h-10 mb-2 text-neutral-600 animate-pulse" />
                <span className="text-xs font-mono text-neutral-400">
                  Multimodal Frame Simulation
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Active Keyframe Overlay Tag */}
        {activeKeyframe && (
          <div className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-md border border-neutral-700 px-2.5 py-1 rounded-xs flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-amber-300">
                @{activeKeyframe.timestamp || `${activeKeyframe.timeInSeconds}s`} • {activeKeyframe.label}
              </span>
              <span className="text-[9px] font-mono text-neutral-300 truncate max-w-[220px]">
                {activeKeyframe.brainActivation || activeKeyframe.note}
              </span>
            </div>
          </div>
        )}

        {/* Play / Pause Big Center Trigger */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </div>
        </button>

        {/* Floating Bottom Quick Controls */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
          {videoUrl && (
            <button
              onClick={toggleMute}
              className="p-1.5 bg-black/70 hover:bg-black text-white rounded-xs border border-neutral-700 text-xs font-mono"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => handleSeek(0)}
            className="p-1.5 bg-black/70 hover:bg-black text-white rounded-xs border border-neutral-700 text-xs font-mono"
            title="Restart from 0.0s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Timeline Scrubber with Keyframe Pins */}
      <div className="mt-3 space-y-2">
        <div className="relative w-full h-3 bg-neutral-800 rounded-xs overflow-hidden cursor-pointer group"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const clickX = e.clientX - rect.left;
               const pct = clickX / rect.width;
               handleSeek(pct * (duration || 15));
             }}>
          {/* Progress bar fill */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-100"
            style={{ width: `${Math.min(100, ((currentTime / (duration || 15)) * 100))}%` }}
          />

          {/* Keyframe Pin Markers on Timeline Scrubber */}
          {safeKeyframes.map((kf, idx) => {
            const kfSec = parseTimestampToSeconds(kf.timeInSeconds ?? kf.timestamp);
            const pct = Math.min(100, Math.max(0, (kfSec / (duration || 15)) * 100));
            const isActive = activeKeyframe?.timestamp === kf.timestamp || activeKeyframe?.label === kf.label;

            return (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJumpToKeyframe(kf);
                }}
                className={`absolute top-0 bottom-0 w-1.5 transform -translate-x-1/2 cursor-pointer transition-all ${
                  isActive
                    ? "bg-amber-300 ring-2 ring-amber-400 z-20 scale-y-125"
                    : "bg-white/70 hover:bg-white z-10"
                }`}
                style={{ left: `${pct}%` }}
                title={`Jump to ${kf.label} (@${kf.timestamp})`}
              />
            );
          })}
        </div>

        {/* Keyframe Jump Pills Row */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
            <span className="font-bold uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Keyframe Jump Points:
            </span>
            <span>Click pin to seek video frame</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
            {keyframes.map((kf, idx) => {
              const kfSec = parseTimestampToSeconds(kf.timeInSeconds ?? kf.timestamp);
              const isActive = activeKeyframe?.timestamp === kf.timestamp || activeKeyframe?.label === kf.label;

              return (
                <button
                  key={idx}
                  onClick={() => handleJumpToKeyframe(kf)}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-mono transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? "bg-amber-400 text-black border-amber-300 font-bold shadow-md scale-102"
                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700"
                  }`}
                >
                  <Camera className="w-3 h-3 shrink-0" />
                  <span>@{kf.timestamp || `${kfSec}s`}</span>
                  <span className="text-[9px] opacity-80 truncate max-w-[100px]">{kf.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
