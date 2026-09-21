import { BrainRegionKey, ViralityAnalysis } from "../types";

export interface RegionCorrelation {
  correlationSummary: string;
  primaryCatalyst: string;
  optimizationTip: string;
  keyframeTimestamp?: string;
  keyframeNote?: string;
}

export function getRegionCorrelation(
  regionKey: BrainRegionKey,
  score: number,
  analysis?: ViralityAnalysis
): RegionCorrelation {
  const videoTitle = analysis?.title ? `"${analysis.title}"` : "the uploaded clip";
  const keyframes = analysis?.keyframes || [];

  // Find relevant keyframe if any matches
  const matchingKeyframe = keyframes.find((k) => {
    if (!k.brainActivation) return false;
    const lower = k.brainActivation.toLowerCase();
    if (regionKey === "visual_cortex" && (lower.includes("visual") || lower.includes("occipital"))) return true;
    if (regionKey === "amygdala" && lower.includes("amygdala")) return true;
    if (regionKey === "auditory_cortex" && (lower.includes("auditory") || lower.includes("temporal"))) return true;
    if (regionKey === "prefrontal" && (lower.includes("prefrontal") || lower.includes("mpfc"))) return true;
    if (regionKey === "reward_circuit" && (lower.includes("vta") || lower.includes("accumbens") || lower.includes("dopamine"))) return true;
    if (regionKey === "tpj" && lower.includes("tpj")) return true;
    return false;
  }) || keyframes[0];

  const timestamp = matchingKeyframe?.timestamp || "00:00.5";
  const frameNote = matchingKeyframe?.note;

  switch (regionKey) {
    case "prefrontal":
      return {
        correlationSummary: `Evaluates identity alignment and personal utility in ${videoTitle}. ${
          score >= 70
            ? "Strong value proposition and self-relevance generate high forward/share impulse."
            : "Moderate value framing; viewer may consume without actively sharing."
        }`,
        primaryCatalyst: `Payoff framing & value proposition in ${videoTitle}`,
        optimizationTip: "Enhance clear personal benefit or relatable takeaway in the final 3 seconds to boost mPFC share activation.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "visual_cortex":
      return {
        correlationSummary: `Directly processes visual contrast, motion vectors, and frame density in ${videoTitle}. ${
          score >= 70
            ? "High initial visual contrast at " + timestamp + " locks ocular saccades instantly."
            : "Visual energy is balanced; could benefit from sharper visual contrast shifts."
        }`,
        primaryCatalyst: `First-frame visual contrast & motion keyframe @ ${timestamp}`,
        optimizationTip: "Increase brightness contrast or add rapid motion vector in the first 0.5s to maximize visual cortex activation.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "amygdala":
      return {
        correlationSummary: `Triggers arousal and surprise spikes from visual/narrative pattern breaks in ${videoTitle}. ${
          score >= 75
            ? "Strong emotional arousal peak detected around " + timestamp + ", preventing viewer drop-off."
            : "Steady emotional tone; an unexpected visual or vocal pattern interrupt will boost arousal."
        }`,
        primaryCatalyst: `Pattern-break & emotional crescendo @ ${timestamp}`,
        optimizationTip: "Introduce an unexpected visual cut or abrupt vocal pitch drop at ~3s to spark an Amygdala arousal spike.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "reward_circuit":
      return {
        correlationSummary: `Fires dopamine expectancy loops based on curiosity gaps setup in ${videoTitle}. ${
          score >= 70
            ? "Curiosity hook effectively promises a high-value reveal, holding viewer attention."
            : "Curiosity loop can be tightened by posing a clearer mystery in the opening frame."
        }`,
        primaryCatalyst: `Curiosity gap setup & expected payoff loop`,
        optimizationTip: "Ask a high-stakes question or display an incomplete visual result at 0.5s to heighten dopamine prediction errors.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "auditory_cortex":
      return {
        correlationSummary: `Decodes voiceover dynamics, sound design, and acoustic frequency spikes in ${videoTitle}. ${
          score >= 70
            ? "Crisp voice cadence and dynamic audio cues drive high temporal lobe engagement."
            : "Audio track is steady; adding subtle sound effects or speech pacing changes will elevate response."
        }`,
        primaryCatalyst: `Vocal cadence & acoustic transitions in audio stream`,
        optimizationTip: "Sync audio pops or music beat drops precisely with key visual transitions to boost auditory-cortex resonance.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "left_brain":
      return {
        correlationSummary: `Processes on-screen text captions, dialogue density, and narrative logic in ${videoTitle}. ${
          score >= 70
            ? "High subtitle readability and structured verbal pacing allow effortless information absorption."
            : "Text captions or verbal pacing could be emphasized to lower cognitive reading friction."
        }`,
        primaryCatalyst: `On-screen caption typography & verbal dialogue density`,
        optimizationTip: "Use high-contrast 1-3 word animated text captions aligned with speech to maximize Broca/Wernicke throughput.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "right_brain":
      return {
        correlationSummary: `Detects spatial metaphors, visual novelty, and creative pattern breaks in ${videoTitle}. ${
          score >= 70
            ? "Creative visual composition and novel camera angles stimulate right-hemispheric curiosity."
            : "Standard camera framing; introducing novel spatial transitions will elevate visual surprise."
        }`,
        primaryCatalyst: `Visual novelty & non-linear spatial transitions`,
        optimizationTip: "Incorporate a zoom transition or unexpected visual angle shift to stimulate right-brain novelty processing.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "mirror_neurons":
      return {
        correlationSummary: `Simulates observed human actions, facial micro-expressions, and physical gestures in ${videoTitle}. ${
          score >= 70
            ? "Prominent human facial contact or physical action triggers strong empathetic neural mirroring."
            : "Subtle physical presence; framing closer facial shots increases mirror-neuron firing."
        }`,
        primaryCatalyst: `On-screen human facial expression & physical gestures`,
        optimizationTip: "Ensure direct eye contact and expressive facial reactions in the first 1.5 seconds to trigger parasocial mirroring.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "limbic":
      return {
        correlationSummary: `Encodes deep emotional attachment, personal relatability, and visceral empathy in ${videoTitle}. ${
          score >= 70
            ? "Resonant narrative arc creates genuine emotional warmth and viewer bonding."
            : "Emotional connection is mild; adding a vulnerable or highly relatable personal hook will deepen impact."
        }`,
        primaryCatalyst: `Emotional story arc & relatable personal vulnerability`,
        optimizationTip: "Lead with an authentic personal struggle or relatable situation to anchor limbic emotional resonance.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "hippocampus":
      return {
        correlationSummary: `Encodes sticky concepts and multisensory visual anchors into long-term memory in ${videoTitle}. ${
          score >= 70
            ? "Distinct visual metaphor and core lesson create an enduring memory trace."
            : "Content is digestible but needs a unique visual or verbal 'sticky anchor' for long-term recall."
        }`,
        primaryCatalyst: `Multisensory visual anchor & memorable core concept`,
        optimizationTip: "Repeat a signature phrase or iconic visual symbol at the hook and payoff to seal hippocampal memory encoding.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "insula":
      return {
        correlationSummary: `Processes somatic gut reactions, physical tension, and visceral aesthetic texture in ${videoTitle}. ${
          score >= 70
            ? "Strong visceral texture or physical tension evokes immediate somatic empathy."
            : "Somatic response is calm; adding tactile close-ups or visceral audio cues will heighten insular response."
        }`,
        primaryCatalyst: `Somatic tension & visceral visual/tactile cues`,
        optimizationTip: "Use close-up macro shots or tactile sound design to trigger visceral gut-reaction engagement.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "tpj":
      return {
        correlationSummary: `Computes social context, intention reading, and audience meme/tribe relatability in ${videoTitle}. ${
          score >= 70
            ? "High social relevance and insider cultural alignment stimulate Theory of Mind networking."
            : "Broad messaging; tailoring to a specific niche or community insider context will raise TPJ activation."
        }`,
        primaryCatalyst: `Social tribal context & community-specific relevance`,
        optimizationTip: "Frame dialogue or text overlays around shared community experiences or niche insider observations.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "cerebellum":
      return {
        correlationSummary: `Tracks rhythm, audio-visual sync, cut timing, and motor prediction in ${videoTitle}. ${
          score >= 70
            ? "Seamless audio-visual cut synchronization matches viewer motor expectation perfectly."
            : "Editing pace is relaxed; snappy sync between visual cuts and audio beats will sharpen cerebellar tracking."
        }`,
        primaryCatalyst: `Audio-visual sync & rhythmic cut timing`,
        optimizationTip: "Trim silent gaps between spoken phrases and snap visual cuts precisely onto audio transients.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    case "dmn":
      return {
        correlationSummary: `Activates during introspective reflection, personal moral synthesis, and deep narrative absorption in ${videoTitle}. ${
          score >= 70
            ? "Thought-provoking takeaway sparks self-referential mind-wandering and internal reflection."
            : "Fast-paced delivery; a brief 0.5s pause after key points allows DMN introspection to take hold."
        }`,
        primaryCatalyst: `Introspective narrative pause & philosophical takeaway`,
        optimizationTip: "Leave a brief visual linger on the final takeaway frame to allow viewers to internalize the core message.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };

    default:
      return {
        correlationSummary: `Monitors general cognitive processing and engagement across ${videoTitle}.`,
        primaryCatalyst: `Multimodal video signals`,
        optimizationTip: "Optimize hook pacing and visual contrast.",
        keyframeTimestamp: timestamp,
        keyframeNote: frameNote,
      };
  }
}
