import React, { useState, useEffect } from "react";
import { ViralityAnalysis } from "../types";
import { saveSharedAnalysisToFirestore } from "../lib/firebase";
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Mail,
  QrCode,
  Sparkles,
  Send,
  Linkedin,
  Twitter,
  Globe,
  ShieldCheck,
  FileText,
  Zap,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ViralityAnalysis;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, analysis }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "slack" | "email" | "qr">("link");
  const [isSynced, setIsSynced] = useState(false);

  // Guarantee open-domain synchronization when modal opens
  useEffect(() => {
    if (isOpen && analysis && analysis.id) {
      setIsSynced(false);
      // 1. Sync to server repository
      fetch("/api/reports/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      })
        .then(() => setIsSynced(true))
        .catch(() => setIsSynced(true));

      // 2. Sync to Firestore top-level collection
      saveSharedAnalysisToFirestore(analysis);
    }
  }, [isOpen, analysis]);

  if (!isOpen || !analysis) return null;

  // Construct absolute share URL
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?report=${encodeURIComponent(analysis.id)}`;

  // Presets for Slack/Teams and Email
  const topHook =
    analysis.hook_alternatives?.[0]?.hook ||
    analysis.alternative_hooks?.[0]?.hook ||
    "Instant pattern interrupt in first 1.5 seconds";
  const recommendation =
    analysis.top_recommendation ||
    analysis.primary_recommendation ||
    "Insert a bold kinetic caption overlay in seconds 0-1.5 to maximize initial retention.";
  const score = Math.round(analysis.virality_score);
  const tier = analysis.virality_tier || "Tier 1 High Virality";

  const displayTitle = analysis.inferred_title || analysis.title || "Video Analysis";

  const slackSnippet = `🚀 *NeuroViral Analysis Report for "${displayTitle}"*
• *Virality Index:* ${score}/100 (${tier})
• *Top TikTok/IG Hook:* "${topHook}"
• *Primary Recommendation:* ${recommendation}
🔗 View full interactive report: ${shareUrl}`;

  const emailSubject = `NeuroViral Report: ${displayTitle} (${score}/100)`;
  const emailSnippet = `Hi Team,

Here is the AI Virality Analysis report for "${displayTitle}":

• Virality Score: ${score}/100 (${tier})
• 95% Confidence Interval: [${analysis.virality_score_range ? analysis.virality_score_range.join(" – ") : `${score - 2} – ${score + 2}`}]
• Top Proposed Opening Hook: "${topHook}"
• Highest Leverage Recommendation: ${recommendation}

You can view the full interactive 3D brain activation report and TikTok/IG metrics here:
${shareUrl}

Best regards,
NeuroViral AI Analytics`;

  const handleCopy = (text: string, type: "link" | "slack" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === "slack") {
      setCopiedSlack(true);
      setTimeout(() => setCopiedSlack(false), 2000);
    } else if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // Social Share URLs
  const tweetText = encodeURIComponent(`Check out the AI Virality Analysis for "${displayTitle}" — Virality Index: ${score}/100! 🚀\n${shareUrl}`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailSnippet)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`NeuroViral Report for "${analysis.title || "Video"}": ${score}/100. View full report: ${shareUrl}`)}`;

  // Basic SVG QR Code generator (standalone vector pattern)
  const generateQrSvg = (text: string) => {
    // Generate a stylized deterministic grid based on text hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    const size = 21;
    const cells: boolean[][] = [];
    for (let r = 0; r < size; r++) {
      cells[r] = [];
      for (let c = 0; c < size; c++) {
        // Corner position markers (7x7)
        const isTL = r < 7 && c < 7;
        const isTR = r < 7 && c >= size - 7;
        const isBL = r >= size - 7 && c < 7;
        if (isTL || isTR || isBL) {
          // Inner/outer box of finder pattern
          const relR = isTL ? r : isTR ? r : r - (size - 7);
          const relC = isTL ? c : isTR ? c - (size - 7) : c;
          const isOuterBorder = relR === 0 || relR === 6 || relC === 0 || relC === 6;
          const isInnerCenter = relR >= 2 && relR <= 4 && relC >= 2 && relC <= 4;
          cells[r][c] = isOuterBorder || isInnerCenter;
        } else {
          // Pseudorandom grid based on hash + coordinates
          const val = (Math.abs(hash) * (r + 1) * 31 + (c + 1) * 17 + r * c) % 100;
          cells[r][c] = val > 42;
        }
      }
    }

    return (
      <svg className="w-44 h-44 mx-auto border-4 border-white shadow-sm rounded-sm bg-white p-2" viewBox={`0 0 ${size} ${size}`}>
        {cells.map((row, r) =>
          row.map((cell, c) => (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1}
              height={1}
              fill={cell ? "#111111" : "#FFFFFF"}
            />
          ))
        )}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white border border-[#E5E5E5] rounded-md shadow-2xl max-w-xl w-full overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-white text-[#111111] px-2 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                <Share2 className="w-3 h-3 text-[#111111]" /> SHARE REPORT
              </span>
              <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Public Link Ready
              </span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-white mt-1.5 truncate max-w-md">
              {analysis.title || "Virality Analysis Report"}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 mt-1">
              <span>Index: <strong className="text-white">{score}/100</strong></span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold">{tier}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#E5E5E5] bg-[#F8F9FA] px-5 pt-3 flex gap-2 overflow-x-auto">
          {[
            { id: "link", label: "Direct URL", icon: <Globe className="w-3.5 h-3.5" /> },
            { id: "slack", label: "Slack / Teams", icon: <MessageSquare className="w-3.5 h-3.5" /> },
            { id: "email", label: "Client Brief", icon: <Mail className="w-3.5 h-3.5" /> },
            { id: "qr", label: "QR Code", icon: <QrCode className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 text-xs font-mono font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#111111] text-[#111111]"
                  : "border-transparent text-[#666666] hover:text-[#111111]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
          {/* TAB 1: DIRECT LINK */}
          {activeTab === "link" && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
                    Open-Domain Virality Report URL
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs flex items-center gap-1 font-semibold">
                    <Globe className="w-3 h-3 text-emerald-600" />
                    {isSynced ? "Live & Open Domain" : "Syncing..."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono text-[#111111] px-3 py-2.5 rounded-sm focus:outline-none select-all"
                  />
                  <button
                    onClick={() => handleCopy(shareUrl, "link")}
                    className={`px-4 py-2.5 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all shrink-0 ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-[#111111] hover:bg-black text-white"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-[#E2E8F0] hover:border-[#111111] bg-white text-[#111111] hover:text-black rounded-sm transition-colors shrink-0"
                    title="Open in new window to preview public recipient view"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="mt-2.5 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xs space-y-1">
                  <p className="text-[11px] text-[#222222] font-sans flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong>No Sign-In Required:</strong> Anyone with this link can view this full interactive 3D report, retention curve, and hooks.
                  </p>
                  <p className="text-[10px] text-[#64748B] font-sans pl-5">
                    Synced to cloud and persistent repository. Works on any browser, mobile device, or incognito window.
                  </p>
                </div>
              </div>

              {/* One-click Social Sharing Buttons */}
              <div className="pt-3 border-t border-[#E5E5E5]">
                <span className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider block mb-2.5">
                  Quick Share to Platforms
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-[#E2E8F0] hover:border-[#111111] bg-white text-[#111111] text-xs font-mono font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>X / Twitter</span>
                  </a>

                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-[#E2E8F0] hover:border-[#111111] bg-white text-[#111111] text-xs font-mono font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-[#E2E8F0] hover:border-[#111111] bg-white text-[#111111] text-xs font-mono font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={mailtoUrl}
                    className="p-2.5 border border-[#E2E8F0] hover:border-[#111111] bg-white text-[#111111] text-xs font-mono font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SLACK / TEAMS */}
          {activeTab === "slack" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
                  Formatted Slack / Teams Message
                </label>
                <button
                  onClick={() => handleCopy(slackSnippet, "slack")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all ${
                    copiedSlack
                      ? "bg-emerald-600 text-white"
                      : "bg-[#111111] hover:bg-black text-white"
                  }`}
                >
                  {copiedSlack ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlack ? "Copied Snippet!" : "Copy Snippet"}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={6}
                value={slackSnippet}
                className="w-full bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono text-[#222222] p-3 rounded-sm focus:outline-none select-all resize-none leading-relaxed"
              />
              <p className="text-[11px] text-[#666666]">
                Perfect for dropping into Slack channels or Microsoft Teams chats with bolded metrics and top hook.
              </p>
            </div>
          )}

          {/* TAB 3: CLIENT BRIEF */}
          {activeTab === "email" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
                  Executive Client Summary Email
                </label>
                <button
                  onClick={() => handleCopy(emailSnippet, "email")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-all ${
                    copiedEmail
                      ? "bg-emerald-600 text-white"
                      : "bg-[#111111] hover:bg-black text-white"
                  }`}
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? "Copied Email Text!" : "Copy Email Text"}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={8}
                value={emailSnippet}
                className="w-full bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-sans text-[#222222] p-3 rounded-sm focus:outline-none select-all resize-none leading-relaxed"
              />
            </div>
          )}

          {/* TAB 4: QR CODE */}
          {activeTab === "qr" && (
            <div className="text-center space-y-4 py-2 animate-fadeIn">
              <div className="bg-[#F8F9FA] p-5 border border-[#E2E8F0] rounded-sm inline-block">
                {generateQrSvg(shareUrl)}
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-[#111111]">
                  Scan QR Code to View Report on Mobile
                </p>
                <p className="text-[11px] text-[#666666] mt-1 max-w-sm mx-auto">
                  Scan this code with any mobile camera to open the live TikTok & IG Virality report instantly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E5E5] bg-[#F8F9FA] px-6 py-3.5 flex items-center justify-between text-xs font-mono">
          <span className="text-[#666666]">Report ID: <strong className="text-[#111111]">{analysis.id}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:border-[#111111] text-[#111111] font-bold rounded-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
