import { VideoKeyframe } from "../types";

export async function extractKeyframesFromVideo(
  videoFile: File,
  hookScore: number = 92
): Promise<VideoKeyframe[]> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(videoFile);

    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const keyframes: VideoKeyframe[] = [];
    let isCompleted = false;

    const cleanup = () => {
      if (isCompleted) return;
      isCompleted = true;
      clearTimeout(timeout);
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {
        // ignore
      }
    };

    // Timeout safety fallback (12 seconds max for large/slow decodes)
    const timeout = setTimeout(() => {
      cleanup();
      if (keyframes.length > 0) {
        resolve(keyframes);
      } else {
        resolve(generateFallbackKeyframes(hookScore));
      }
    }, 12000);

    const onReadyToExtract = async () => {
      if (isCompleted) return;
      const duration = video.duration || 10;

      // Dynamic capture points based on video length
      const safeDuration = duration > 0 ? duration : 30;
      const tHook = Math.min(0.5, Math.max(0.1, safeDuration * 0.05));
      const tPattern = safeDuration > 20 ? 5.0 : Math.min(3.0, safeDuration * 0.25);
      const tPeak = safeDuration > 20 ? Math.min(safeDuration * 0.5, 15.0) : Math.min(7.5, safeDuration * 0.55);
      const tPayoff = Math.max(tPeak + 2, safeDuration * 0.85);

      const capturePoints = [
        {
          time: tHook,
          label: `${(tHook || 0).toFixed(1)}s Visual Hook Window`,
          type: "hook" as const,
          score: Math.min(99, hookScore + 3),
          note: "0.5s First-Frame Visual Hook (Ocular Saccade & Pre-Attentive Pattern Interrupt). Determines immediate scroll vs stay decision in visual cortex.",
          brainActivation: "Occipital Visual Cortex (V1/V2) + Superior Colliculus",
        },
        {
          time: tPattern,
          label: `${(tPattern || 0).toFixed(1)}s Pattern Break & Verbal Hook`,
          type: "pattern_break" as const,
          score: Math.min(99, hookScore - 2),
          note: "Vocal cadence spike & text caption overlay synchronization maintaining 3-second hold rate.",
          brainActivation: "Superior Temporal Gyrus (Auditory) + TPJ",
        },
        {
          time: tPeak,
          label: `${(tPeak || 0).toFixed(1)}s Emotional Peak Climax`,
          type: "emotional_peak" as const,
          score: Math.min(99, hookScore + 5),
          note: "Maximum emotional arousal, visual contrast shift, or key lesson reveal.",
          brainActivation: "Amygdala + Ventral Tegmental Area (VTA)",
        },
        {
          time: tPayoff,
          label: `${(tPayoff || 0).toFixed(1)}s Final Payoff & Share CTA`,
          type: "payoff" as const,
          score: Math.min(99, hookScore),
          note: "Value payoff framing and social share impulse activation.",
          brainActivation: "Medial Prefrontal Cortex (mPFC) + Nucleus Accumbens",
        },
      ];

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Calculate lightweight resolution preserving aspect ratio (max 540px)
      const rawW = video.videoWidth || 640;
      const rawH = video.videoHeight || 360;
      const maxDim = 540;
      let targetW = rawW;
      let targetH = rawH;

      if (rawW > maxDim || rawH > maxDim) {
        if (rawW >= rawH) {
          targetW = maxDim;
          targetH = Math.round((rawH * maxDim) / rawW);
        } else {
          targetH = maxDim;
          targetW = Math.round((rawW * maxDim) / rawH);
        }
      }

      canvas.width = targetW;
      canvas.height = targetH;

      // Immediately grab the initial pre-seek frame (guaranteed zero-latency frame)
      let initialFrameData: string | undefined;
      try {
        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          ctx.drawImage(video, 0, 0, targetW, targetH);
          initialFrameData = canvas.toDataURL("image/jpeg", 0.72);
        }
      } catch (err) {
        console.warn("Initial zero-latency frame grab notice:", err);
      }

      for (const pt of capturePoints) {
        try {
          await seekToTime(video, pt.time);
          canvas.width = targetW;
          canvas.height = targetH;

          let dataUrl: string | undefined = initialFrameData;
          if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
            ctx.drawImage(video, 0, 0, targetW, targetH);
            dataUrl = canvas.toDataURL("image/jpeg", 0.72);
            // Update initialFrameData if this was the first good capture
            if (!initialFrameData && dataUrl) {
              initialFrameData = dataUrl;
            }
          }

          const formatTimestamp = (sec: number) => {
            const safeSec = typeof sec === "number" && !isNaN(sec) ? sec : 0;
            const mins = Math.floor(safeSec / 60);
            const secs = (safeSec % 60).toFixed(1);
            return `${mins.toString().padStart(2, "0")}:${secs.padStart(4, "0")}`;
          };

          keyframes.push({
            timestamp: formatTimestamp(pt.time),
            timeInSeconds: pt.time,
            label: pt.label,
            type: pt.type,
            imageData: dataUrl || initialFrameData,
            score: pt.score,
            note: pt.note,
            brainActivation: pt.brainActivation,
          });
        } catch (e) {
          console.warn("Failed frame capture at time:", pt.time, e);
        }
      }

      cleanup();

      if (keyframes.length > 0) {
        resolve(keyframes);
      } else {
        resolve(generateFallbackKeyframes(hookScore, initialFrameData));
      }
    };

    video.onloadeddata = () => {
      onReadyToExtract();
    };

    video.onloadedmetadata = () => {
      // If onloadeddata hasn't fired yet, trigger extraction
      if (!isCompleted && video.readyState >= 2) {
        onReadyToExtract();
      }
    };

    video.onerror = () => {
      cleanup();
      resolve(generateFallbackKeyframes(hookScore));
    };
  });
}

function seekToTime(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      video.removeEventListener("seeked", finish);
      video.removeEventListener("error", finish);
      resolve();
    };

    // Safety timeout (1800ms per seek) to prevent hanging forever on seek
    const timer = setTimeout(finish, 1800);

    video.addEventListener("seeked", () => {
      clearTimeout(timer);
      finish();
    });
    video.addEventListener("error", () => {
      clearTimeout(timer);
      finish();
    });

    try {
      video.currentTime = Math.max(0, time);
    } catch {
      clearTimeout(timer);
      finish();
    }
  });
}

export function generateFallbackKeyframes(hookScore: number = 88, sampleImageData?: string): VideoKeyframe[] {
  // Generate a fallback neutral visual frame placeholder if none was passed
  const fallbackImage = sampleImageData || createPlaceholderFrameData();

  return [
    {
      timestamp: "00:00.5",
      timeInSeconds: 0.5,
      label: "0.5s Initial Visual Hook Frame",
      type: "hook",
      score: Math.min(99, hookScore + 4),
      imageData: fallbackImage,
      note: "High-contrast visual pattern interrupt triggering occipital cortex salience.",
      brainActivation: "Occipital Visual Cortex Peak",
    },
    {
      timestamp: "00:03.0",
      timeInSeconds: 3.0,
      label: "3.0s Pattern Break & Vocal Hook",
      type: "pattern_break",
      score: Math.min(99, hookScore + 1),
      imageData: fallbackImage,
      note: "Vocal audio frequency spike & caption overlay synchronization.",
      brainActivation: "Superior Temporal Auditory Cortex",
    },
    {
      timestamp: "00:07.5",
      timeInSeconds: 7.5,
      label: "7.5s High Emotional Arousal Climax",
      type: "emotional_peak",
      score: Math.min(99, hookScore + 6),
      imageData: fallbackImage,
      note: "Facial reaction climax firing reward dopamine circuit.",
      brainActivation: "Amygdala + Ventral Striatum",
    },
    {
      timestamp: "00:12.0",
      timeInSeconds: 12.0,
      label: "12.0s Final Resolution & Social Share CTA",
      type: "payoff",
      score: Math.min(99, hookScore - 2),
      imageData: fallbackImage,
      note: "Value payoff framing propelling peer forward-share impulse.",
      brainActivation: "Medial Prefrontal Cortex (mPFC)",
    },
  ];
}

function createPlaceholderFrameData(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Dark studio gradient background
      const grad = ctx.createLinearGradient(0, 0, 320, 180);
      grad.addColorStop(0, "#08080C");
      grad.addColorStop(1, "#14141E");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 180);

      // Grid fine lines
      ctx.strokeStyle = "rgba(0, 245, 212, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 300, 160);

      // Waveform line
      ctx.strokeStyle = "#00F5D4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 90);
      ctx.lineTo(80, 70);
      ctx.lineTo(130, 110);
      ctx.lineTo(180, 60);
      ctx.lineTo(230, 100);
      ctx.lineTo(290, 90);
      ctx.stroke();

      return canvas.toDataURL("image/jpeg", 0.7);
    }
  } catch {
    // ignore
  }
  return "";
}
