import React, { useState, useRef, useEffect } from "react";
import { Scissors, X, Play, Pause } from "lucide-react";

interface TrimDialogProps {
  isOpen: boolean;
  videoUrl: string;
  duration: number;
  onClose: () => void;
  onConfirmTrim: (startTime: number, endTime: number) => void;
}

export const TrimDialog: React.FC<TrimDialogProps> = ({
  isOpen,
  videoUrl,
  duration,
  onClose,
  onConfirmTrim,
}) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(Math.min(15, duration));
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (duration > 0) {
      setStartTime(0);
      setEndTime(Math.min(15, duration));
    }
  }, [duration]);

  if (!isOpen) return null;

  const currentLength = Math.max(0, endTime - startTime);
  const isValidLength = currentLength > 0 && currentLength <= 15.5;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
        if (!isPlaying) {
          videoRef.current.pause();
        }
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-6 rounded-sm border border-[#E5E5E5] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border border-[#E5E5E5] bg-white hover:border-[#111111] rounded-xs transition-colors"
        >
          <X className="w-4 h-4 text-[#111111]" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#111111] text-white rounded-xs">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#111111]">
              TRIM TO ≤ 15 SECONDS
            </h3>
            <p className="text-xs font-mono text-[#555555]">
              Video is {duration.toFixed(1)}s. fMRI virality pipeline requires max 15s clip.
            </p>
          </div>
        </div>

        {/* Video Preview */}
        <div className="bg-black border border-[#E5E5E5] rounded-xs relative my-4 overflow-hidden aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-contain"
          />
          <button
            onClick={togglePlay}
            className="absolute bottom-3 left-3 bg-white text-[#111111] border border-[#E5E5E5] p-2 rounded-xs hover:border-[#111111] transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-[#111111]" />}
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-4 my-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-[#111111] mb-1 font-semibold">
              <span>Start Frame: {startTime.toFixed(1)}s</span>
              <span>End Frame: {endTime.toFixed(1)}s</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="range"
                min="0"
                max={Math.max(0, duration - 1)}
                step="0.1"
                value={startTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setStartTime(val);
                  if (endTime - val > 15) setEndTime(val + 15);
                }}
                className="w-full accent-[#111111]"
              />
              <input
                type="range"
                min={startTime + 1}
                max={duration}
                step="0.1"
                value={endTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setEndTime(val);
                  if (val - startTime > 15) setStartTime(val - 15);
                }}
                className="w-full accent-[#111111]"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono p-3 bg-[#F4F4F4] border border-[#E5E5E5] rounded-xs">
            <span className="text-[#333333] font-semibold">Clip Length:</span>
            <span
              className={`font-bold ${
                isValidLength ? "text-[#111111]" : "text-black underline font-extrabold"
              }`}
            >
              {currentLength.toFixed(1)}s {isValidLength ? "(Valid ≤ 15s)" : "(Too long)"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] rounded-xs hover:border-[#111111]"
          >
            Cancel
          </button>
          <button
            disabled={!isValidLength}
            onClick={() => onConfirmTrim(startTime, endTime)}
            className="px-5 py-2 bg-[#111111] text-white text-xs font-mono font-bold rounded-xs hover:bg-black disabled:opacity-40"
          >
            Confirm Trim & Process
          </button>
        </div>
      </div>
    </div>
  );
};
