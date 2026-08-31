import React, { useState } from 'react';
import { Sparkles, Check, Edit3, X, RefreshCw, ChevronRight, ShieldCheck } from 'lucide-react';
import { RoadmapNode } from '../../types/index.js';
import { useLearning } from '../../context/LearningContext.js';

interface ExplainabilityBadgeProps {
  node: RoadmapNode;
  variant?: 'inline' | 'button' | 'card';
}

export const ExplainabilityBadge: React.FC<ExplainabilityBadgeProps> = ({ node, variant = 'button' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [editHours, setEditHours] = useState(node.estimatedHours);

  const { handleRecommendationAction } = useLearning();

  const handleAction = async (action: 'accept' | 'modify' | 'reject' | 'regenerate') => {
    if (action === 'modify') {
      await handleRecommendationAction(node.id, 'modify', {
        newTitle: editTitle,
        estimatedHours: Number(editHours),
      });
      setIsEditing(false);
    } else {
      await handleRecommendationAction(node.id, action);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {variant === 'button' && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Why this?</span>
          <span className="text-[10px] text-brand-400/70 font-mono bg-brand-500/20 px-1 rounded">
            {node.confidenceScore}% match
          </span>
        </button>
      )}

      {variant === 'inline' && (
        <span
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 cursor-pointer underline underline-offset-2"
        >
          <Sparkles className="w-3 h-3" />
          <span>Explain AI Rationale</span>
        </span>
      )}

      {/* Popover / Drawer */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel bg-surface-100/98 p-5 shadow-2xl border border-white/10 z-50 animate-slide-up text-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-400">AI Recommendation Engine</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">Confidence:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{node.confidenceScore}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation Content */}
            <div className="py-3.5 space-y-3">
              {node.adaptationReason && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                  <span className="font-semibold text-amber-200 block mb-0.5">⚡ Dynamic Adaptation Trigger:</span>
                  {node.adaptationReason}
                </div>
              )}

              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Why this was recommended:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-surface-200/50 p-3 rounded-xl border border-white/5">
                  {node.whyRecommended}
                </p>
              </div>

              {node.skillsCovered && node.skillsCovered.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {node.skillsCovered.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 text-slate-300 border border-white/5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Editing Mode */}
              {isEditing && (
                <div className="pt-2 space-y-2 border-t border-white/5">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase">Topic Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-surface-300 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase">Estimated Hours</label>
                    <input
                      type="number"
                      value={editHours}
                      onChange={(e) => setEditHours(Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-surface-300 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar (Explainability Requirement) */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction('modify')}
                    className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAction('accept')}
                    title="Accept recommendation and lock into active path"
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    title="Modify topic details or time commitment"
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-surface-200 text-slate-300 hover:text-white border border-white/10 hover:bg-surface-300 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modify</span>
                  </button>
                  <button
                    onClick={() => handleAction('regenerate')}
                    title="Ask AI to rethink this recommendation"
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium rounded-lg bg-surface-200 text-brand-300 hover:text-brand-200 border border-white/10 hover:bg-surface-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regen</span>
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    title="Dismiss this recommendation"
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
