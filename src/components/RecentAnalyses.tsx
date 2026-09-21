import React, { useState, useMemo } from "react";
import { ViralityAnalysis } from "../types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, type Variants } from "motion/react";
import {
  Scale,
  Eye,
  Tag,
  Plus,
  X,
  Search,
  Filter,
  Hash,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { FineLineHeader } from "./ui/FineLineHeader";

interface RecentAnalysesProps {
  history: ViralityAnalysis[];
  onSelectAnalysis: (analysis: ViralityAnalysis) => void;
  activeAnalysisId?: string;
  selectedForCompare: string[];
  onToggleCompareSelect: (id: string) => void;
  onUpdateTags?: (analysisId: string, tags: string[]) => void;
  onDeleteAnalysis?: (id: string) => void;
  onDeleteMultipleAnalyses?: (ids: string[]) => void;
  onClearHistory?: () => void;
  onRestoreSampleAnalyses?: () => void;
}

const PRESET_TAGS = [
  "#educational",
  "#entertainment",
  "#tech",
  "#fitness",
  "#lifestyle",
  "#gaming",
  "#ecommerce",
  "#finance",
  "#storytelling",
];

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const gridItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 260,
      mass: 0.8,
    },
  },
};

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  history,
  onSelectAnalysis,
  activeAnalysisId,
  selectedForCompare,
  onToggleCompareSelect,
  onUpdateTags,
  onDeleteAnalysis,
  onDeleteMultipleAnalyses,
  onClearHistory,
  onRestoreSampleAnalyses,
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTagsItemId, setEditingTagsItemId] = useState<string | null>(null);
  const [customTagInput, setCustomTagInput] = useState("");

  // Selection & Deletion mode states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDeleteIds, setSelectedDeleteIds] = useState<string[]>([]);
  const [confirmingSingleDeleteId, setConfirmingSingleDeleteId] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Extract all unique tags present in history with their occurrence counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (history || []).forEach((item) => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          const formatted = tag.startsWith("#") ? tag.toLowerCase() : `#${tag.toLowerCase()}`;
          counts[formatted] = (counts[formatted] || 0) + 1;
        });
      }
    });
    return counts;
  }, [history]);

  // Unique list of tags found in active history
  const historyTags = Object.keys(tagCounts);

  // Filter history based on search query and selected tag
  const filteredHistory = useMemo(() => {
    return (history || []).filter((item) => {
      // 1. Tag filter matching
      if (selectedTagFilter) {
        const itemTags = (item.tags || []).map((t) => (t.startsWith("#") ? t.toLowerCase() : `#${t.toLowerCase()}`));
        if (!itemTags.includes(selectedTagFilter.toLowerCase())) {
          return false;
        }
      }

      // 2. Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [history, selectedTagFilter, searchQuery]);

  // Chart data built from current filtered list (or full history)
  const chartData = [...((filteredHistory?.length || 0) >= 2 ? filteredHistory : (history || []))]
    .reverse()
    .map((item, idx) => ({
      name: `#${idx + 1}`,
      score: item.virality_score,
      hook: item.hook_score,
      title: item.title || "Video",
    }));

  const handleAddTagToItem = (itemId: string, newTagRaw: string) => {
    let clean = newTagRaw.trim();
    if (!clean) return;
    if (!clean.startsWith("#")) {
      clean = `#${clean}`;
    }
    clean = clean.toLowerCase();

    const targetItem = history.find((i) => i.id === itemId);
    if (!targetItem) return;

    const currentTags = targetItem.tags || [];
    if (!currentTags.includes(clean)) {
      const updated = [...currentTags, clean];
      onUpdateTags?.(itemId, updated);
    }
    setCustomTagInput("");
  };

  const handleRemoveTagFromItem = (itemId: string, tagToRemove: string) => {
    const targetItem = history.find((i) => i.id === itemId);
    if (!targetItem) return;

    const currentTags = targetItem.tags || [];
    const updated = currentTags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase());
    onUpdateTags?.(itemId, updated);
  };

  // Selection handlers
  const handleToggleSelectDelete = (id: string) => {
    setSelectedDeleteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedDeleteIds.length === filteredHistory.length) {
      setSelectedDeleteIds([]);
    } else {
      setSelectedDeleteIds(filteredHistory.map((item) => item.id));
    }
  };

  const handleExecuteBulkDelete = () => {
    if (selectedDeleteIds.length === 0) return;
    if (onDeleteMultipleAnalyses) {
      onDeleteMultipleAnalyses(selectedDeleteIds);
    } else if (onDeleteAnalysis) {
      selectedDeleteIds.forEach((id) => onDeleteAnalysis(id));
    }
    setSelectedDeleteIds([]);
    setShowBulkDeleteConfirm(false);
    setIsSelectionMode(false);
  };

  const handleExecuteSingleDelete = (id: string) => {
    onDeleteAnalysis?.(id);
    setConfirmingSingleDeleteId(null);
    setSelectedDeleteIds((prev) => prev.filter((item) => item !== id));
  };

  const handleExecuteClearAll = () => {
    onClearHistory?.();
    setShowClearAllConfirm(false);
    setSelectedDeleteIds([]);
    setIsSelectionMode(false);
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-[#E5E5E5] dark:border-neutral-800 rounded-sm p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-[#111111] dark:text-white">
            Historical Vault is Empty
          </h3>
          <p className="text-xs font-mono text-[#666666] dark:text-neutral-400 mt-1 max-w-md mx-auto">
            All previous video analyses have been deleted. You can restore the sample analyses or upload new clips to build your vault.
          </p>
        </div>
        {onRestoreSampleAnalyses && (
          <button
            id="btn-restore-samples"
            onClick={onRestoreSampleAnalyses}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold bg-[#111111] dark:bg-white text-white dark:text-black rounded-xs hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Preset Sample Datasets</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="studio-panel border border-white/10 rounded-xs p-6 space-y-6 shadow-2xl transition-colors">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex flex-wrap justify-between items-center gap-3">
        <div className="min-w-[280px]">
          <FineLineHeader
            as="h2"
            variant="horizon"
            tag="[HISTORY VAULT // CATEGORIZATION]"
            secondaryTag={`ACTIVE ENTRIES: ${history.length}`}
            className="font-display font-extrabold text-2xl text-white tracking-tight uppercase"
            lineColor="rgba(0, 245, 212, 0.45)"
          >
            Recent Analyses ({history.length})
          </FineLineHeader>
        </div>

        {/* Top Management Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isSelectionMode ? (
            <>
              <button
                id="btn-select-all-history"
                onClick={handleSelectAllFiltered}
                className="px-3 py-1.5 text-xs font-mono font-semibold rounded-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition flex items-center gap-1.5"
              >
                {selectedDeleteIds.length === filteredHistory.length && filteredHistory.length > 0 ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-[#00F5D4]" />
                    <span>Deselect All</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Select All ({filteredHistory.length})</span>
                  </>
                )}
              </button>

              <button
                id="btn-delete-selected-history"
                disabled={selectedDeleteIds.length === 0}
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="px-3 py-1.5 text-xs font-mono font-bold rounded-xs bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedDeleteIds.length})</span>
              </button>

              <button
                id="btn-cancel-history-selection"
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedDeleteIds([]);
                }}
                className="px-2.5 py-1.5 text-xs font-mono rounded-xs border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                id="btn-toggle-history-selection-mode"
                onClick={() => setIsSelectionMode(true)}
                className="px-3 py-1.5 text-xs font-mono font-semibold rounded-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 transition flex items-center gap-1.5 shadow-2xs"
                title="Select multiple historical analytics to delete"
              >
                <CheckSquare className="w-3.5 h-3.5 text-rose-500" />
                <span>Select & Delete</span>
              </button>

              <button
                id="btn-clear-all-history-trigger"
                onClick={() => setShowClearAllConfirm(true)}
                className="px-2.5 py-1.5 text-xs font-mono font-semibold rounded-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition flex items-center gap-1"
                title="Clear all saved analytics"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal / Banner */}
      {showBulkDeleteConfirm && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <h4 className="text-xs font-mono font-bold text-rose-900 dark:text-rose-200">
                Confirm Deletion of {selectedDeleteIds.length} Analyses?
              </h4>
              <p className="text-[11px] font-mono text-rose-700 dark:text-rose-300 mt-0.5">
                This will permanently remove the selected historical reports from your session and vault.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setShowBulkDeleteConfirm(false)}
              className="px-3 py-1 text-xs font-mono rounded-xs border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-bulk-delete"
              onClick={handleExecuteBulkDelete}
              className="px-3 py-1 text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xs transition shadow-xs"
            >
              Yes, Delete {selectedDeleteIds.length} Items
            </button>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal / Banner */}
      {showClearAllConfirm && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <h4 className="text-xs font-mono font-bold text-rose-900 dark:text-rose-200">
                Clear Entire History Vault ({history.length} Analyses)?
              </h4>
              <p className="text-[11px] font-mono text-rose-700 dark:text-rose-300 mt-0.5">
                All saved historical analytics will be deleted. You can restore default samples anytime.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setShowClearAllConfirm(false)}
              className="px-3 py-1 text-xs font-mono rounded-xs border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-clear-all"
              onClick={handleExecuteClearAll}
              className="px-3 py-1 text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xs transition shadow-xs"
            >
              Clear All ({history.length})
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-[#F8F9FA] dark:bg-neutral-800/40 p-4 border border-[#E5E5E5] dark:border-neutral-800 rounded-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, description, or #tag..."
              className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-white dark:bg-neutral-900 border border-[#E5E5E5] dark:border-neutral-700 rounded-xs text-[#111111] dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-[#111111] dark:focus:border-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Active Filter Indicator */}
          {(selectedTagFilter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTagFilter(null);
                setSearchQuery("");
              }}
              className="px-3 py-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter ({filteredHistory.length} matches)</span>
            </button>
          )}
        </div>

        {/* Tag Pill Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter by Tag:
          </span>

          {/* "All" Tag Pill */}
          <button
            onClick={() => setSelectedTagFilter(null)}
            className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition-colors ${
              selectedTagFilter === null
                ? "bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black font-bold"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-[#E5E5E5] dark:border-neutral-700 hover:border-neutral-400"
            }`}
          >
            All ({history.length})
          </button>

          {/* Tags actively used in history */}
          {historyTags.map((tag) => {
            const isSelected = selectedTagFilter?.toLowerCase() === tag.toLowerCase();
            const count = tagCounts[tag] || 0;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(isSelected ? null : tag)}
                className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition-colors flex items-center gap-1 ${
                  isSelected
                    ? "bg-amber-500 text-black border-amber-500 font-bold shadow-2xs"
                    : "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-[#E5E5E5] dark:border-neutral-700 hover:border-neutral-400"
                }`}
              >
                <span>{tag}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}

          {/* Preset Suggestions if not yet used */}
          {PRESET_TAGS.filter((pt) => !historyTags.includes(pt)).map((pt) => (
            <button
              key={pt}
              onClick={() => setSelectedTagFilter(pt)}
              className="px-2.5 py-1 text-xs font-mono rounded-xs border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors opacity-75 hover:opacity-100"
            >
              {pt}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Trend Chart */}
      {filteredHistory.length >= 2 && (
        <div className="bg-[#F4F4F4] dark:bg-neutral-800/60 border border-[#E5E5E5] dark:border-neutral-800 p-5 rounded-sm">
          <span className="font-mono text-xs font-bold text-[#111111] dark:text-white uppercase block mb-3">
            Virality Score Trend ({filteredHistory.length} Reports)
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" stroke="#666666" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#666666" fontSize={10} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-neutral-900 border border-[#E5E5E5] dark:border-neutral-700 p-2.5 text-xs font-mono rounded-sm shadow-md">
                          <p className="font-bold text-[#111111] dark:text-white">{payload[0].payload.title}</p>
                          <p className="text-[#111111] dark:text-neutral-300">Virality: {payload[0].value}/100</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#111111"
                  strokeWidth={2}
                  fill="#111111"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty State when filter yields 0 matches */}
      {filteredHistory.length === 0 && (
        <div className="py-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-sm p-6 bg-neutral-50 dark:bg-neutral-800/20">
          <Tag className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 uppercase">
            No Reports Found
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
            No analyses match the active tag filter "{selectedTagFilter}" or search "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSelectedTagFilter(null);
              setSearchQuery("");
            }}
            className="px-3 py-1.5 text-xs font-bold font-mono text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-xs hover:bg-black transition-colors"
          >
            Show All Reports ({history?.length || 0})
          </button>
        </div>
      )}

      {/* Grid of Past Analyses */}
      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredHistory.map((item) => {
          const isSelectedForComp = selectedForCompare.includes(item.id);
          const isSelectedForDelete = selectedDeleteIds.includes(item.id);
          const isActive = item.id === activeAnalysisId;
          const isEditingTags = editingTagsItemId === item.id;
          const isConfirmingDelete = confirmingSingleDeleteId === item.id;
          const itemTags = item.tags || [];

          return (
            <motion.div
              key={item.id}
              variants={gridItemVariants}
              onClick={() => {
                if (isSelectionMode) {
                  handleToggleSelectDelete(item.id);
                }
              }}
              className={`border rounded-sm p-4 flex flex-col justify-between transition-all relative ${
                isSelectionMode ? "cursor-pointer" : ""
              } ${
                isSelectedForDelete
                  ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500"
                  : isActive
                  ? "border-[#111111] dark:border-neutral-400 bg-[#F4F4F4] dark:bg-neutral-800/80 shadow-xs"
                  : "border-[#E5E5E5] dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-[#111111] dark:hover:border-neutral-600"
              }`}
            >
              <div>
                {/* Top Row: Checkbox / Badge & Score / Delete Button */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    {isSelectionMode && (
                      <input
                        type="checkbox"
                        checked={isSelectedForDelete}
                        onChange={() => handleToggleSelectDelete(item.id)}
                        className="w-4 h-4 accent-rose-600 rounded-xs cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <span className="font-mono text-[10px] font-bold bg-[#111111] text-white dark:bg-neutral-100 dark:text-neutral-900 px-2 py-0.5 rounded-xs">
                      {item.virality_tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-xl text-[#111111] dark:text-white">
                      {item.virality_score}{" "}
                      <span className="text-xs font-mono text-[#555555] dark:text-neutral-400">/100</span>
                    </span>

                    {!isSelectionMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingSingleDeleteId(isConfirmingDelete ? null : item.id);
                        }}
                        className={`p-1 rounded-xs transition ${
                          isConfirmingDelete
                            ? "bg-rose-600 text-white"
                            : "text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                        title="Delete this analysis report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Single Delete Confirmation Pill */}
                {isConfirmingDelete && !isSelectionMode && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mb-2 p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 rounded-xs flex items-center justify-between gap-2 animate-fadeIn"
                  >
                    <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-300">
                      Delete this report?
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setConfirmingSingleDeleteId(null)}
                        className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleExecuteSingleDelete(item.id)}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xs"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                {/* Title & Date */}
                <h3 className="font-display font-bold text-base text-[#111111] dark:text-white line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-[#555555] dark:text-neutral-400 font-medium mb-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                {/* Tags Pill Display */}
                <div className="mb-3 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {itemTags.length > 0 ? (
                      itemTags.map((t) => {
                        const formatted = t.startsWith("#") ? t : `#${t}`;
                        return (
                          <span
                            key={t}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTagFilter(formatted);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 rounded-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
                            title={`Filter by ${formatted}`}
                          >
                            <Hash className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                            <span>{formatted.replace("#", "")}</span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-400 italic">No tags yet</span>
                    )}

                    {/* Tag Editor Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTagsItemId(isEditingTags ? null : item.id);
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 rounded-xs transition-colors ml-auto"
                      title="Add or edit categories for this report"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{isEditingTags ? "Done" : "Tag"}</span>
                    </button>
                  </div>

                  {/* Inline Tag Management Panel */}
                  {isEditingTags && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xs space-y-2.5 animate-fade-in mt-2"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">
                        <span>Edit Categories</span>
                        <button
                          onClick={() => setEditingTagsItemId(null)}
                          className="text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Current Editable Badges with Remove 'x' */}
                      {itemTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {itemTags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xs"
                            >
                              <span>{t.startsWith("#") ? t : `#${t}`}</span>
                              <button
                                onClick={() => handleRemoveTagFromItem(item.id, t)}
                                className="text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                                title="Remove Tag"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Custom Tag Input */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddTagToItem(item.id, customTagInput);
                        }}
                        className="flex items-center gap-1.5"
                      >
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          placeholder="e.g. tech, educational..."
                          className="flex-1 text-xs font-mono px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-black dark:focus:border-white"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1 text-xs font-mono font-bold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-xs hover:bg-black transition-colors"
                        >
                          Add
                        </button>
                      </form>

                      {/* Quick Presets Selection */}
                      <div className="pt-1 border-t border-neutral-200 dark:border-neutral-700">
                        <span className="text-[9px] font-mono text-neutral-500 block mb-1">Quick Add Presets:</span>
                        <div className="flex flex-wrap gap-1">
                          {PRESET_TAGS.map((pt) => {
                            const isAdded = itemTags.some((t) => t.toLowerCase() === pt.toLowerCase());
                            return (
                              <button
                                key={pt}
                                type="button"
                                disabled={isAdded}
                                onClick={() => handleAddTagToItem(item.id, pt)}
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs border transition-colors ${
                                  isAdded
                                    ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 border-transparent cursor-default"
                                    : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                                }`}
                              >
                                {isAdded ? `✓ ${pt}` : pt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#E5E5E5] dark:border-neutral-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAnalysis(item);
                  }}
                  className="flex-1 bg-[#111111] dark:bg-white text-white dark:text-black py-1.5 px-3 text-xs font-semibold rounded-xs hover:bg-black dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompareSelect(item.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors flex items-center justify-center gap-1.5 ${
                    isSelectedForComp
                      ? "bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white"
                      : "bg-white dark:bg-neutral-900 text-[#111111] dark:text-white border-[#E5E5E5] dark:border-neutral-700 hover:border-[#111111] dark:hover:border-neutral-400"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isSelectedForComp ? "Selected" : "Compare"}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
