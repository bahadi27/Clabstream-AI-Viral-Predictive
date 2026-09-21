import { ViralityAnalysis, ViralityTier } from "../types";

export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") return text || "";

  let cleaned = text;

  // 1. Cut off at known LLM meta-talk, validation noise, or delimiter markers
  const cutOffMarkers = [
    "filter_none",
    "PERFECT PAYLOAD COMPLIANCE",
    "JSON PARSE VALIDATED",
    "context validation parameters",
    "format validated JSON",
    "controls context clarity",
    "ENJOY!",
    "payload payload",
    "audio cues audio cues tone structure",
    "verification checks completed successfully",
    "payload",
  ];

  for (const marker of cutOffMarkers) {
    const index = cleaned.indexOf(marker);
    if (index !== -1) {
      cleaned = cleaned.substring(0, index);
    }
  }

  // 2. Remove any repetitive words that repeat 3 or more times (e.g. "payload payload payload", "cues cues cues")
  cleaned = cleaned.replace(/\b(\w+)(?:\s+\1){2,}\b/gi, "");

  // 3. Remove standalone leftover meta tokens
  cleaned = cleaned.replace(/\b(payload|filter_none)\b/gi, "");

  // 4. Clean up trailing punctuation / whitespace
  cleaned = cleaned.trim().replace(/[\s,;:-]+$/, "");

  // 5. If ending sentence is incomplete due to cutoff, add a period if necessary
  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned += ".";
  }

  return cleaned;
}

export function cleanViralityTier(tier: string, viralityScore?: number): ViralityTier {
  if (!tier || typeof tier !== "string") {
    return getTierFromScore(viralityScore ?? 75);
  }

  const trimmed = tier.trim();

  // If tier is a valid ViralityTier string, return as is
  if (["Explosive", "High", "Moderate", "Low"].includes(trimmed)) {
    return trimmed as ViralityTier;
  }

  // If tier contains "Explosive" or "High" or "Moderate" or "Low"
  if (/explosive/i.test(trimmed)) return "Explosive";
  if (/high/i.test(trimmed)) return "High";
  if (/moderate/i.test(trimmed)) return "Moderate";
  if (/low/i.test(trimmed)) return "Low";

  // Fall back to mapping viralityScore
  return getTierFromScore(viralityScore ?? 75);
}

function getTierFromScore(score: number): ViralityTier {
  if (score >= 85) return "Explosive";
  if (score >= 65) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

export function sanitizeAnalysisData(analysis: ViralityAnalysis): ViralityAnalysis {
  if (!analysis) return analysis;

  const score = analysis.virality_score ?? 75;

  const isGenericTitleString = (s?: string) => {
    if (!s || typeof s !== "string") return true;
    const l = s.trim().toLowerCase();
    return (
      l === "uploaded video" ||
      l === "uploaded video analysis" ||
      l === "uploaded short video analysis" ||
      l.startsWith("uploaded video") ||
      l.startsWith("uploaded short")
    );
  };

  let cleanTitle = analysis.title;
  let cleanInferredTitle = analysis.inferred_title;

  if (isGenericTitleString(cleanTitle)) {
    cleanTitle = !isGenericTitleString(cleanInferredTitle)
      ? cleanInferredTitle!
      : "Short-Form Video Performance Analysis";
  }
  if (isGenericTitleString(cleanInferredTitle)) {
    cleanInferredTitle = cleanTitle;
  }

  return {
    ...analysis,
    title: cleanTitle,
    inferred_title: cleanInferredTitle,
    virality_tier: cleanViralityTier(analysis.virality_tier, score),
    executive_summary: sanitizeText(analysis.executive_summary),
    top_recommendation: sanitizeText(analysis.top_recommendation),
    hook_analysis: sanitizeText(analysis.hook_analysis),
    transcript_summary: sanitizeText(analysis.transcript_summary),
    verbatim_transcript: sanitizeText(analysis.verbatim_transcript),
    pacing_notes: sanitizeText(analysis.pacing_notes),
    novelty_signals: sanitizeText(analysis.novelty_signals),
    factors: Array.isArray(analysis.factors)
      ? analysis.factors.map((f) => ({
          ...f,
          name: sanitizeText(f.name),
          explanation: sanitizeText(f.explanation),
          journal_reference: sanitizeText(f.journal_reference),
        }))
      : [],
    hook_alternatives: Array.isArray(analysis.hook_alternatives)
      ? analysis.hook_alternatives.map((h) => ({
          ...h,
          hook: sanitizeText(h.hook),
          rationale: sanitizeText(h.rationale),
          content_refinement: sanitizeText(h.content_refinement),
          pacing_alignment: sanitizeText(h.pacing_alignment),
          tone_alignment: sanitizeText(h.tone_alignment),
        }))
      : [],
  };
}
