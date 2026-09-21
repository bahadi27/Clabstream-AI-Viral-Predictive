import { BrainRegionKey } from "../types";

export interface BrainRegionNeuroDetails {
  key: BrainRegionKey;
  name: string;
  sublabel: string;
  anatomicalLocation: string;
  primaryNeurotransmitter: string;
  neuralCircuit: string;
  biologicalFunction: string;
  viralityRole: {
    primaryMetric: string; // e.g., "Share Velocity (Forward Rate)"
    algorithmicImpact: string; // How recommendation algorithms react
    neuroMechanism: string; // The step-by-step cognitive trigger
    highActivationEffect: string; // What happens when score > 75
    lowActivationRisk: string; // What happens when score < 40
  };
  creativeApplication: {
    howToTrigger: string[];
    commonPitfalls: string[];
    viralExamples: string;
  };
  researchPaper: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    keyFinding: string;
  };
}

export const NEUROSCIENCE_EXPLANATIONS: Record<BrainRegionKey, BrainRegionNeuroDetails> = {
  prefrontal: {
    key: "prefrontal",
    name: "Medial Prefrontal Cortex (mPFC)",
    sublabel: "Self-Relevance & Value Valuation Network",
    anatomicalLocation: "Anterior frontal lobe along the midline sagittal plane (Brodmann Areas 10, 24, 32)",
    primaryNeurotransmitter: "Dopamine & Serotonin modulation",
    neuralCircuit: "Cortico-Striatal-Thalamic Loop & Default Social Brain",
    biologicalFunction: "Computes self-identity integration, personal relevance, mentalizing, and subjective social utility of incoming information.",
    viralityRole: {
      primaryMetric: "Share-to-View Ratio & Direct Message (DM) Forwards",
      algorithmicImpact: "When mPFC fires strongly, viewers experience high identity resonance ('This is literally me' or 'My friend needs to see this'). Recommendation algorithms weigh DM shares 3–5x heavier than simple passive views.",
      neuroMechanism: "The mPFC performs an instantaneous social calculation: 'Does sharing this video increase my perceived social status, reinforce my identity, or provide value to my tribe?' If yes, the motor intention to tap 'Share' is unlocked.",
      highActivationEffect: "Viral cascade triggered via dark social (WhatsApp, iMessage, Instagram DMs) and reposts.",
      lowActivationRisk: "Viewers find the content interesting in isolation, but have zero motivation to share it with anyone.",
    },
    creativeApplication: {
      howToTrigger: [
        "Use second-person relatable callouts ('If you do this every morning...', 'Tell me you're not the only one')",
        "Address specific niche tribal identities ('React developers', 'Gym beginners', 'Budget travelers')",
        "Provide high-utility insider tips that make the sharer look smart or helpful",
      ],
      commonPitfalls: [
        "Generic corporate voice that speaks to 'everyone' but resonates with no one",
        "Self-centered creator monologues with no listener payoff or identity mirror",
      ],
      viralExamples: "'3 hidden smartphone settings creators rarely talk about' or 'POV: You work in corporate finance'",
    },
    researchPaper: {
      title: "Creating Social Contagion: An fMRI Study of Information Transmission",
      authors: "Falk, E. B., Berkman, E. T., & Lieberman, M. D.",
      year: 2012,
      journal: "Psychological Science, 23(5), 437-442",
      keyFinding: "mPFC neural activation during initial message exposure directly predicts whether that idea will successfully spread virally across independent social networks.",
    },
  },

  reward_circuit: {
    key: "reward_circuit",
    name: "Reward Circuit (VTA & Nucleus Accumbens)",
    sublabel: "Mesolimbic Dopaminergic Prediction Engine",
    anatomicalLocation: "Ventral Tegmental Area (VTA) in midbrain projecting to Nucleus Accumbens (NAcc) in ventral striatum",
    primaryNeurotransmitter: "Dopamine (Phasic bursts)",
    neuralCircuit: "Mesolimbic Dopamine Pathway & Frontostriatal Reward Loop",
    biologicalFunction: "Calculates Reward Prediction Error (RPE)—the difference between expected and received sensory/cognitive rewards.",
    viralityRole: {
      primaryMetric: "Completion Rate, Loop Rate & Re-watch Velocity",
      algorithmicImpact: "TikTok and Reels algorithms prioritize Average Watch Percentage above 85%. Sustained NAcc activation prevents swiping away by generating continuous anticipatory curiosity.",
      neuroMechanism: "Dopamine is the molecule of anticipation, not satisfaction. By withholding the conclusion or teasing an unexpected transformation ('Wait for the end...'), the brain enters a dopamine-fueled state of urgent anticipation.",
      highActivationEffect: "Viewers watch until the final second and re-loop the clip multiple times to process the visual payoff.",
      lowActivationRisk: "Viewers predict the ending within 2 seconds and immediately swipe to the next video.",
    },
    creativeApplication: {
      howToTrigger: [
        "Deploy the 'Curiosity Gap' in the first 1.5 seconds: pose a question or show the messy before-state",
        "Insert micro-payoffs every 3 to 4 seconds to refresh the dopamine cycle",
        "Design seamless infinite loops where the ending sentence flows directly into the opening hook",
      ],
      commonPitfalls: [
        "Revealing the climax or answer too early in the script",
        "Monotonous pacing with no dynamic contrast or unexpected twists",
      ],
      viralExamples: "Restoration videos, satisfying slime/pressure-washing cuts, 'You won't believe what happened next'",
    },
    researchPaper: {
      title: "Dopamine Reward Prediction Error Dynamics in Decision Making",
      authors: "Schultz, W.",
      year: 2015,
      journal: "Nature Reviews Neuroscience, 17(3), 183-195",
      keyFinding: "Dopamine neurons fire strongest when a reward arrives unexpectedly, establishing intense behavioral reinforcement that drives compulsive media consumption.",
    },
  },

  amygdala: {
    key: "amygdala",
    name: "Amygdala",
    sublabel: "Arousal, Threat & Awe Vigilance Center",
    anatomicalLocation: "Medial temporal lobe anterior to the hippocampus (bilateral almond-shaped nuclei)",
    primaryNeurotransmitter: "Norepinephrine & Glutamate",
    neuralCircuit: "Salience Network & Hypothalamic-Pituitary-Adrenal (HPA) Axis",
    biologicalFunction: "Rapid subconscious appraisal of emotionally salient stimuli, danger signals, high awe, and urgent sensory events.",
    viralityRole: {
      primaryMetric: "First 1-Second Hook Hold Rate & Instant Thumb Stop",
      algorithmicImpact: "The first 1.2 seconds decide whether a viewer swipes away. Amygdala-triggered arousal halts the instinctive thumb-swipe reflex by flooding attention networks with norepinephrine.",
      neuroMechanism: "The amygdala processes visual/auditory threats via the subcortical 'low road' (tectopulvinar pathway) in under 80ms—far faster than conscious cortical thought. Visceral movements or sudden loud auditory spikes seize full attentional bandwidth.",
      highActivationEffect: "Ultra-low drop-off in seconds 0–3, locking the viewer into the narrative funnel.",
      lowActivationRisk: "Slow, gentle introductions are casually swiped past before the viewer even realizes what the video is about.",
    },
    creativeApplication: {
      howToTrigger: [
        "High-contrast motion in frame 1 (rapid zoom-in, object thrown toward camera, sudden unexpected gesture)",
        "Stakes-driven hook: 'Stop doing this or you will lose your data...'",
        "Jaw-dropping visual scale or awe-inspiring landscapes",
      ],
      commonPitfalls: [
        "Slow title cards, brand logos, or 3-second animated intros in second zero",
        "Low emotional energy that fails to elevate viewer physiological arousal",
      ],
      viralExamples: "Near-miss extreme sports clips, urgent breaking-news style alerts, mind-bending visual illusions",
    },
    researchPaper: {
      title: "What Makes Online Content Go Viral?",
      authors: "Berger, J., & Milkman, K. L.",
      year: 2012,
      journal: "Journal of Marketing Research, 49(2), 192-205",
      keyFinding: "High-physiological-arousal emotions (awe, anger, amusement, anxiety) drive massive viral transmission, whereas low-arousal emotions (sadness, contentment) stunt sharing.",
    },
  },

  mirror_neurons: {
    key: "mirror_neurons",
    name: "Mirror Neuron System (MNS)",
    sublabel: "Premotor & Inferior Parietal Resonators",
    anatomicalLocation: "Ventral premotor cortex (F5/BA 44) and rostral inferior parietal lobule (IPL)",
    primaryNeurotransmitter: "Acetylcholine & GABA",
    neuralCircuit: "Action-Observation-Execution Network & Somatomotor Empathy",
    biologicalFunction: "Fires both when executing a motor action and when observing another human perform that same action, enabling physical empathy and parasocial connection.",
    viralityRole: {
      primaryMetric: "User Engagement, Duet/Remix Rate & Parasocial Attachment",
      algorithmicImpact: "Platform algorithms heavily favor UGC formats and direct-to-camera eye contact because human faces and hands create immediate somatic synchronization.",
      neuroMechanism: "When a viewer sees someone tasting sour food, doing a dance step, or showing an intense facial reaction, their own premotor cortex internally simulates that sensation. This turns passive observation into an active bodily experience.",
      highActivationEffect: "Deep empathy and mimicry; viewers comment on creator micro-expressions and create response/duet videos.",
      lowActivationRisk: "Faceless AI voiceover or static slide presentations feel distant, sterile, and unengaging.",
    },
    creativeApplication: {
      howToTrigger: [
        "Direct-to-camera eye contact within 18 inches of the lens",
        "Pronounced facial reactions (shock, delight, skepticism) paired with expressive hand gestures",
        "Tangible hands-on demonstrations (unboxing, cutting, touching textures)",
      ],
      commonPitfalls: [
        "Looking off-camera or reading a teleprompter with flat, robotic eyes",
        "Covering hands or standing stiffly without natural bodily motion",
      ],
      viralExamples: "Taste-test reactions, 'Try not to flinch' challenges, ASMR finger-tapping on objects",
    },
    researchPaper: {
      title: "The Mirror-Neuron System and Social Interaction",
      authors: "Rizzolatti, G., & Sinigaglia, C.",
      year: 2010,
      journal: "Physiological Reviews, 90(3), 981-1012",
      keyFinding: "Observation of biological motion and facial expressions triggers involuntary motor resonance in the observer, forming the biological bedrock of social contagion.",
    },
  },

  tpj: {
    key: "tpj",
    name: "Temporoparietal Junction (TPJ)",
    sublabel: "Theory of Mind & Social Mentalizing Network",
    anatomicalLocation: "Convergence zone of the posterior temporal lobe and inferior parietal lobule",
    primaryNeurotransmitter: "Serotonin & Glutamate",
    neuralCircuit: "Theory of Mind (ToM) / Mentalizing Circuit",
    biologicalFunction: "Infers the mental states, beliefs, desires, and intentions of others; decodes irony, satire, and social relational context.",
    viralityRole: {
      primaryMetric: "Comment Section Velocity & Debate Ratio",
      algorithmicImpact: "Videos that spark spirited discussion or mutual inside jokes generate hundreds of comments, signaling to the algorithm that the video has high conversational depth.",
      neuroMechanism: "The TPJ lights up when viewers try to guess: 'Why did they say that?', 'Are they joking or serious?', or 'Who is the villain in this story?'. Ambiguity and deliberate minor errors stimulate viewers to correct the creator in the comments.",
      highActivationEffect: "Explosive comment thread battles, high comment-to-view ratios (>5%), and meme remixes.",
      lowActivationRisk: "Objective facts delivered neutrally leave no room for interpretation or conversational debate.",
    },
    creativeApplication: {
      howToTrigger: [
        "Include a subtle deliberate flaw (e.g. slight mispronunciation or quirky background detail) that viewers rush to comment on",
        "Present a moral dilemma or relational conflict ('Who was in the wrong here?')",
        "Use multi-character skits where different personalities collide",
      ],
      commonPitfalls: [
        "Over-explaining every joke until no mentalizing effort is required by the audience",
        "Leaving the topic completely closed without inviting community perspective",
      ],
      viralExamples: "Am I The A**hole (AITA) storytimes, relatable workplace skits, 'Couples debate who takes longer to get ready'",
    },
    researchPaper: {
      title: "Theory of Mind and the Temporoparietal Junction: Functional Specialization for Social Cognition",
      authors: "Saxe, R., & Kanwisher, N.",
      year: 2003,
      journal: "NeuroImage, 19(4), 1835-1842",
      keyFinding: "TPJ specifically activates when attributing thoughts to other minds, acting as the gateway for empathetic resonance and communal cultural memes.",
    },
  },

  visual_cortex: {
    key: "visual_cortex",
    name: "Primary Visual Cortex (V1–V4)",
    sublabel: "Occipital Motion & Chromatic Processing Matrix",
    anatomicalLocation: "Posterior occipital lobe surrounding the calcarine fissure (Brodmann Areas 17, 18, 19)",
    primaryNeurotransmitter: "GABA & Glutamate (High temporal resolution)",
    neuralCircuit: "Dorsal (Where/How) and Ventral (What) Visual Streams",
    biologicalFunction: "Deconstructs edges, motion vectors, spatial orientation, color contrast, and luminance shifts across 60 frames per second.",
    viralityRole: {
      primaryMetric: "Visual Pacing, Micro-Dropoff Mitigation & Feed Contrast",
      algorithmicImpact: "High visual variety prevents sensory habituation. If retinal inputs remain static for >2.5 seconds, cognitive boredom triggers an automatic swipe.",
      neuroMechanism: "The visual cortex is tuned for change detection. Fast cut rates, kinetic typography, and motion graphics force V1–V4 to continuously re-orient, maintaining active neural alertness.",
      highActivationEffect: "Maximum visual density, seamless transitions, and zero dead frames.",
      lowActivationRisk: "Static 'talking head' shots with uniform flat lighting cause optical fatigue and rapid swipe-aways.",
    },
    creativeApplication: {
      howToTrigger: [
        "Switch camera angle, zoom level, or b-roll every 1.8 to 2.5 seconds",
        "Use high-contrast bold captions with color-changing karaoke word highlights",
        "Incorporate visual depth (foreground objects moving past the lens)",
      ],
      commonPitfalls: [
        "Single continuous unedited wide shot without jump cuts or zooms",
        "Cluttered low-contrast text that strains reading comprehension",
      ],
      viralExamples: "MrBeast rapid-cut style, motion graphics explainers, satisfying kinetic color transitions",
    },
    researchPaper: {
      title: "Motion Processing in Human Visual Cortex: An fMRI Investigation",
      authors: "Tootell, R. B., et al.",
      year: 1995,
      journal: "Journal of Neuroscience, 15(4), 3215-3230",
      keyFinding: "Dynamic visual transitions stimulate motion-sensitive cortical area MT/V5, resetting visual attention before habituation can occur.",
    },
  },

  auditory_cortex: {
    key: "auditory_cortex",
    name: "Auditory Cortex (A1 & Superior Temporal Gyrus)",
    sublabel: "Acoustic Cadence & Musical Transient Decoder",
    anatomicalLocation: "Heschl's gyrus (BA 41/42) on the superior temporal plane",
    primaryNeurotransmitter: "Glutamate & Acetylcholine",
    neuralCircuit: "Ascending Auditory Pathway & Superior Temporal Phonological Loop",
    biologicalFunction: "Decodes pitch, timber, vocal cadences, musical harmony, rhythmic transients, and spatial sound localization.",
    viralityRole: {
      primaryMetric: "Sound-On Retention & Audio Trend Propagation",
      algorithmicImpact: "Over 85% of viral TikTok and Reels videos leverage trending audio or dynamic voiceover cadence. Videos paired with viral sounds gain algorithmic boost in the audio discovery feed.",
      neuroMechanism: "Acoustic beat drops and voice pitch fluctuations synchronize brainwave oscillations (auditory-motor entrainment), making speech feel punchy, rhythmic, and impossible to tune out.",
      highActivationEffect: "Immediate sound-on engagement, rhythmic head nodding, and search for the underlying audio track.",
      lowActivationRisk: "Muffled audio, flat monotone voiceover, or royalty-free generic elevator music that drains energy.",
    },
    creativeApplication: {
      howToTrigger: [
        "Pair voiceover cuts exactly to the transient beat of the background music",
        "Use crisp microphone audio with subtle vocal compression and bright presence (3–5 kHz boost)",
        "Insert strategic SFX (wooshes, pops, risers) on every key point",
      ],
      commonPitfalls: [
        "Background music overpowering the voiceover",
        "Monotone vocal delivery with zero melodic inflection or dynamic range",
      ],
      viralExamples: "Trending TikTok sound remixes, phonk-synced transformation edits, punchy podcast audio clips",
    },
    researchPaper: {
      title: "Auditory-Motor Entrainment and the Neural Basis of Beat Perception",
      authors: "Patel, A. D., & Iversen, J. R.",
      year: 2014,
      journal: "Annals of the New York Academy of Sciences, 1337(1), 1-10",
      keyFinding: "Synchronized auditory transients trigger involuntary premotor cortex firing, increasing attention and memory retention.",
    },
  },

  hippocampus: {
    key: "hippocampus",
    name: "Hippocampus",
    sublabel: "Long-Term Memory Encoding & Associative Retrieval Matrix",
    anatomicalLocation: "Medial temporal lobe beneath the cortical surface (hippocampal formation CA1-CA3 & dentate gyrus)",
    primaryNeurotransmitter: "Acetylcholine & Glutamate (Long-Term Potentiation / LTP)",
    neuralCircuit: "Papez Circuit & Entorhinal-Hippocampal Memory Loop",
    biologicalFunction: "Encodes new declarative knowledge, consolidates episodic memories, and binds multisensory signals into long-term mental hooks.",
    viralityRole: {
      primaryMetric: "Save/Bookmark Rate & Brand Recall",
      algorithmicImpact: "Saves are the highest-value conversion metric on modern short-form platforms. When a viewer bookmarks a video to revisit later, the algorithm interprets the content as evergreen high-value education.",
      neuroMechanism: "The hippocampus activates when incoming data connects to existing mental schemas or delivers a structured 'Aha!' insight worth retaining. Long-Term Potentiation (LTP) is triggered by high informational density.",
      highActivationEffect: "Massive save-to-view ratios (>8%), evergreen discovery shelf-life lasting weeks after publication.",
      lowActivationRisk: "Ephemeral empty entertainment that is forgotten 10 seconds after watching.",
    },
    creativeApplication: {
      howToTrigger: [
        "Deliver structured, step-by-step checklists or resource lists ('Save this for your next trip')",
        "Connect modern topics to nostalgic memories (childhood games, 90s aesthetic, retro tech)",
        "Reveal a counter-intuitive mental model that changes how the viewer thinks",
      ],
      commonPitfalls: [
        "Information is too vague to be practically useful",
        "No clear call-to-save prompt or reference asset provided",
      ],
      viralExamples: "'5 Google Docs shortcuts that save 10 hours a week', 'Ultimate 3-day Tokyo itinerary'",
    },
    researchPaper: {
      title: "Memory and the Hippocampus: A Synthesis from Findings with Rats, Monkeys, and Humans",
      authors: "Squire, L. R., & Wixted, J. T.",
      year: 2011,
      journal: "Philosophical Transactions of the Royal Society B, 366(1563), 259-270",
      keyFinding: "Content that sparks structural novelty combined with emotional resonance creates immediate synaptic potentiation in the hippocampus.",
    },
  },

  insula: {
    key: "insula",
    name: "Insular Cortex (Insula)",
    sublabel: "Interoception & Somatic Marker Hub",
    anatomicalLocation: "Deep within the lateral sulcus separating temporal from frontal/parietal lobes",
    primaryNeurotransmitter: "Substance P, Opioid Peptides & Noradrenaline",
    neuralCircuit: "Salience Network & Interoceptive Visceral Relay",
    biologicalFunction: "Maps internal bodily states, physical visceral sensations (gut feelings, nausea, aesthetic chills, tactile goosebumps), and emotional disgust or delight.",
    viralityRole: {
      primaryMetric: "Physical Reaction Rate & Visceral Shares",
      algorithmicImpact: "Content that induces genuine physical sensations (cringe, chills, mouth-watering craving, ASMR tingles) triggers immediate emotional sharing with captions like 'I can feel this in my soul'.",
      neuroMechanism: "Damasio's Somatic Marker Hypothesis proves that human decisions to share or comment originate in visceral gut feelings mapped by the anterior insula before conscious reasoning occurs.",
      highActivationEffect: "Physical vocal out-loud reactions, laughing out loud, facial grimacing, or aesthetic shivers.",
      lowActivationRisk: "Intellectualized, clinical content that fails to make the viewer feel anything in their body.",
    },
    creativeApplication: {
      howToTrigger: [
        "Sensory-rich food cinematography (cheese pulls, sizzling crusts, crisp crunch sounds)",
        "Relatable physical cringe moments (stubbing a toe, awkward social handshake)",
        "ASMR crisp tactile close-ups with binaural audio",
      ],
      commonPitfalls: [
        "Sterile graphics with no tactile or sensory textures",
        "Uncalibrated disgust that pushes viewers past the threshold into repulsion",
      ],
      viralExamples: "Street food cooking ASMR, ultra-satisfying tactile kinetic sand, high-tension stunt videos",
    },
    researchPaper: {
      title: "The Somatic Marker Hypothesis: A Neural Theory of Economic and Social Decision",
      authors: "Damasio, A. R.",
      year: 1996,
      journal: "Philosophical Transactions of the Royal Society of London B, 351(1346), 1413-1420",
      keyFinding: "The insula integrates bodily somatic states into rapid intuitive decisions, driving viral actions before conscious deliberation.",
    },
  },

  limbic: {
    key: "limbic",
    name: "Limbic System (Cingulate Cortex & Hypothalamus)",
    sublabel: "Core Emotional Valency & Relatability Nexus",
    anatomicalLocation: "Ring of structures bordering the corpus callosum and diencephalon",
    primaryNeurotransmitter: "Oxytocin, Endorphins & Serotonin",
    neuralCircuit: "Limbic Circuit & Anterior Cingulate Salience Network",
    biologicalFunction: "Regulates emotional intensity, social bonding, empathy, moral indignation, and heartwarming connection.",
    viralityRole: {
      primaryMetric: "Heartwarming Viral Spreads & Community Cohesion",
      algorithmicImpact: "Emotional extremes (intense joy, empathy, or moral outrage) generate viral coefficient multipliers as viewers seek to share their emotional state with friends.",
      neuroMechanism: "Emotional contagion occurs when mirror-limbic projections evoke shared affective states. When viewers experience emotional elevation, they instinctively forward the content to validate their feelings.",
      highActivationEffect: "Wholesome organic spread across family group chats, high like-to-view ratios (>12%).",
      lowActivationRisk: "Cold, purely transactional content that leaves the audience emotionally indifferent.",
    },
    creativeApplication: {
      howToTrigger: [
        "Wholesome human acts of kindness and authentic vulnerability",
        "Reunions, unexpected surprises, or heartwarming pet interactions",
        "Hero's journey underdog transformations",
      ],
      commonPitfalls: [
        "Manipulative, overly manufactured melodrama that feels fake or insincere",
        "Lack of genuine emotional release at the narrative climax",
      ],
      viralExamples: "Rescuing a shelter puppy, surprised family homecomings, heartwarming community tips",
    },
    researchPaper: {
      title: "Emotional Contagion and the Neural Basis of Shared Affect",
      authors: "Singer, T., et al.",
      year: 2004,
      journal: "Science, 303(5661), 1157-1162",
      keyFinding: "Anterior cingulate cortex and insular activations mirror the emotional suffering or joy of others, driving communal sharing behavior.",
    },
  },

  left_brain: {
    key: "left_brain",
    name: "Left Hemispheric Language Network (Broca & Wernicke)",
    sublabel: "Narrative Logic, Semantic Decoding & Verbal Density",
    anatomicalLocation: "Left inferior frontal gyrus (Broca's BA 44/45) and left posterior superior temporal gyrus (Wernicke's BA 22)",
    primaryNeurotransmitter: "Acetylcholine & Glutamate",
    neuralCircuit: "Arcuate Fasciculus & Left Peri-Sylvian Language Stream",
    biologicalFunction: "Processes syntax, phonetic clarity, vocabulary comprehension, narrative sequence, and logical argument structure.",
    viralityRole: {
      primaryMetric: "Comprehension Speed & Cognitive Friction Minimization",
      algorithmicImpact: "If a viewer must re-read a confusing caption or struggle to understand muddy speech, cognitive overload causes immediate drop-off. Crystal-clear semantic delivery keeps attention frictionless.",
      neuroMechanism: "Broca's area decodes speech syntax in real time. Optimized short-form scripts use short Anglo-Saxon words, punchy active verbs, and simple sentences that require under 100ms of cognitive processing.",
      highActivationEffect: "Effortless comprehension; complex ideas feel instantly obvious and intuitive.",
      lowActivationRisk: "Jargon-heavy, rambling, or convoluted sentences that lose the audience mid-sentence.",
    },
    creativeApplication: {
      howToTrigger: [
        "Speak in punchy 5-to-7 word sentences with active verbs ('Do this', 'Never buy that')",
        "Synchronize spoken keywords with high-contrast text overlays",
        "Strip filler words (um, ah, like, so) with razor-sharp jump cuts",
      ],
      commonPitfalls: [
        "Academic jargon, acronyms without definitions, or run-on sentences",
        "Mismatched captions that lag behind the spoken voiceover",
      ],
      viralExamples: "Quick financial tips, 60-second history breakdowns, life hack tutorials",
    },
    researchPaper: {
      title: "The Neural Architecture of Language Comprehension",
      authors: "Friederici, A. D.",
      year: 2011,
      journal: "Physiological Reviews, 91(4), 1357-1392",
      keyFinding: "Rapid hierarchical syntactic parsing in Broca's area dictates the ease of informational transmission and viral concept adoption.",
    },
  },

  right_brain: {
    key: "right_brain",
    name: "Right Hemispheric Association Cortex",
    sublabel: "Visual Novelty, Spatial Metaphors & Pattern Breaks",
    anatomicalLocation: "Right lateral prefrontal, parietal, and temporal associative regions",
    primaryNeurotransmitter: "Dopamine & Norepinephrine",
    neuralCircuit: "Ventral Attention / Salience Orientation Network",
    biologicalFunction: "Processes non-verbal humor, spatial analogies, unexpected contextual leaps, creative metaphors, and sudden pattern disruptions.",
    viralityRole: {
      primaryMetric: "Novelty Index & Pattern-Interrupt Success",
      algorithmicImpact: "Social media feeds are flooded with repetitive templates. The right hemisphere is uniquely tuned to spot novel visual twists that break the hypnotic scrolling trance.",
      neuroMechanism: "When expected patterns are broken (e.g. unexpected visual juxtaposition or comedic twist), the right hemisphere generates a cognitive realignment spark, experienced as delightful humor or fascination.",
      highActivationEffect: "High memeability, screenshot sharing, and viral reposting across Twitter/X and Threads.",
      lowActivationRisk: "Predictable, generic stock-video aesthetics that blend into feed wallpaper.",
    },
    creativeApplication: {
      howToTrigger: [
        "Invert common tropes or visual expectations in the opening frame",
        "Use creative metaphors (e.g. visualizing code bugs as physical cartoon creatures)",
        "Combine two unrelated cultural concepts into a hilarious single premise",
      ],
      commonPitfalls: [
        "Using overused stock footage and clichéd viral sound effects that viewers have seen 1,000 times",
        "Jokes that are too esoteric for mainstream audiences to parse",
      ],
      viralExamples: "Absurdist Gen-Z humor, bizarre CGI unexpected endings, creative product stress-tests",
    },
    researchPaper: {
      title: "Right Hemisphere Contributions to Metaphor and Non-Literal Language Comprehension",
      authors: "Faust, M., & Mashal, N.",
      year: 2007,
      journal: "Neuropsychologia, 45(4), 860-870",
      keyFinding: "Right hemispheric association cortex excels at novel semantic combinations, acting as the primary engine for comedic and visual viral spread.",
    },
  },

  cerebellum: {
    key: "cerebellum",
    name: "Cerebellum",
    sublabel: "Rhythmic Timing & Temporal Prediction Engine",
    anatomicalLocation: "Infratentorial structure at the base of the skull posterior to the brainstem",
    primaryNeurotransmitter: "GABA (Purkinje cells) & Glutamate (Granule cells)",
    neuralCircuit: "Cerebello-Thalamo-Cortical Loop & Motor Timing Network",
    biologicalFunction: "Calibrates sub-second millisecond timing, temporal prediction errors, rhythmic beat tracking, and physical motion fluidity.",
    viralityRole: {
      primaryMetric: "Flow State Pacing & Hypnotic Watch Rhythm",
      algorithmicImpact: "Videos with hypnotic temporal flow keep viewers watching in a semi-trance state. If edit cuts hit slightly off-beat, the cerebellum detects micro-glitches that break viewer immersion.",
      neuroMechanism: "The cerebellum constantly predicts the exact millisecond when the next audio transient or video transition will land. When edits lock perfectly onto musical cadence, the brain experiences a state of effortless cognitive flow.",
      highActivationEffect: "Hypnotic viewing loops; users replay 3–5 times without even realizing they are re-watching.",
      lowActivationRisk: "Awkward pauses, clunky cuts, or off-beat audio sync that feels jarring to watch.",
    },
    creativeApplication: {
      howToTrigger: [
        "Cut every video splice exactly on the musical beat or transient waveform spike",
        "Match the speed of physical on-screen motion to the vocal tempo",
        "Use speed ramps (fast-slow-fast motion) to emphasize key impact moments",
      ],
      commonPitfalls: [
        "Leaving 0.5s of dead silent air at the start or end of a clip",
        "Edit cuts that clash chaotically against the background soundtrack rhythm",
      ],
      viralExamples: "Phonk drift car edits, beat-synced dance transitions, fast-paced culinary slicing montage",
    },
    researchPaper: {
      title: "The Cerebellum and Internal Models of Temporal Motor Prediction",
      authors: "Wolpert, D. M., Miall, R. C., & Kawato, M.",
      year: 1998,
      journal: "Trends in Cognitive Sciences, 2(9), 338-347",
      keyFinding: "Internal forward models in the cerebellum anticipate millisecond temporal trajectories, forming the foundation of cinematic rhythm and hypnotic media pacing.",
    },
  },

  dmn: {
    key: "dmn",
    name: "Default Mode Network (DMN)",
    sublabel: "Introspective Storytelling & Philosophical Meaning Engine",
    anatomicalLocation: "Precuneus / Posterior Cingulate Cortex (PCC), Medial Prefrontal, and Angular Gyrus",
    primaryNeurotransmitter: "Serotonin & GABA",
    neuralCircuit: "Default Mode Interconnected Hubs & Autobiographical Memory Network",
    biologicalFunction: "Governs introspective self-reflection, autobiographical daydreaming, moral philosophy, and existential storytelling.",
    viralityRole: {
      primaryMetric: "Deep Resonance, Long-Form Discussion & Long-Term Loyalty",
      algorithmicImpact: "DMN activation transforms a superficial short-form clip into a profound narrative experience. Videos that activate the DMN generate passionate community following, creator loyalty, and podcast shares.",
      neuroMechanism: "When a video moves past fast visual gimmicks into deep storytelling, the DMN activates to synthesize: 'What does this mean for my own life journey?'. This shifts consumption from passive amusement to meaningful existential reflection.",
      highActivationEffect: "Heartfelt long comments sharing personal life stories, deep creator brand loyalty.",
      lowActivationRisk: "Overly slow pacing can cause impatient viewers to swipe away if not anchored by an early narrative hook.",
    },
    creativeApplication: {
      howToTrigger: [
        "Incorporate reflective storytelling with vulnerable personal life lessons",
        "Use gentle cinematic music swells behind philosophical conclusions",
        "Frame the topic around universal human experiences (grief, triumph, aging, purpose)",
      ],
      commonPitfalls: [
        "Preachy, condescending moralizing without authentic personal vulnerability",
        "Failing to hook the viewer in seconds 0–3 before introducing deeper storytelling",
      ],
      viralExamples: "Long-form essay TikToks, documentary story retrospectives, 'Advice I wish I knew at 20'",
    },
    researchPaper: {
      title: "The Brain's Default Network: Anatomy, Function, and Relevance to Disease",
      authors: "Buckner, R. L., Andrews-Hanna, J. R., & Schacter, D. L.",
      year: 2008,
      journal: "Annals of the New York Academy of Sciences, 1124(1), 1-38",
      keyFinding: "The default mode network acts as the core substrate for constructing personal meaning and autobiographical narrative integration from external media.",
    },
  },
};
