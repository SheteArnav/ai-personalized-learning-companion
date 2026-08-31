import React from 'react';
import { RoadmapNode } from '../../types/index.js';
import { useLearning } from '../../context/LearningContext.js';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  SkipForward,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ExplainabilityBadge } from '../common/ExplainabilityBadge.js';

interface RoadmapNodeCardProps {
  node: RoadmapNode;
  index: number;
}

export const RoadmapNodeCard: React.FC<RoadmapNodeCardProps> = ({ node, index }) => {
  const { 
    updateRoadmapNodeStatus, 
    startQuizForTopic, 
    startTutorWithTopic 
  } = useLearning();

  const isCompleted = node.status === 'completed';
  const isInProgress = node.status === 'in_progress';
  const isLocked = node.status === 'locked';
  const isSkipped = node.status === 'skipped';

  const getStatusColor = () => {
    if (isCompleted) return 'border-emerald-500/40 bg-emerald-500/5';
    if (isInProgress) return 'border-brand-500/50 bg-brand-500/10 shadow-glow';
    if (isSkipped) return 'border-white/5 bg-surface-200/20 opacity-50';
    if (isLocked) return 'border-white/5 bg-surface-200/40 opacity-70';
    return 'border-white/10 bg-surface-100/90 hover:border-white/20';
  };

  const getStatusBadge = () => {
    if (isCompleted) return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">COMPLETED</span>;
    if (isInProgress) return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">IN PROGRESS</span>;
    if (isSkipped) return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-700 text-slate-400">SKIPPED</span>;
    if (isLocked) return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-slate-400 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> LOCKED</span>;
    return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">AVAILABLE</span>;
  };

  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all glass-panel ${getStatusColor()} group`}
    >
      {/* Dynamic Adaptation Tag */}
      {node.adaptedFromQuiz && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/30 text-[11px] text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold">AI Remediation:</span>
          <span>Auto-inserted after diagnostic quiz</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() =>
              updateRoadmapNodeStatus(
                node.id,
                isCompleted ? 'in_progress' : isInProgress ? 'completed' : 'in_progress'
              )
            }
            className="mt-1 flex-shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
            title="Toggle Status (Completed / In Progress)"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-slate-600 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 hover:text-brand-400" />
            )}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-400">
                #{node.orderIndex || index + 1}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-300 text-slate-300 border border-white/5">
                {node.stage}
              </span>
              {getStatusBadge()}
            </div>

            <h3
              className={`text-base font-bold transition-colors ${
                isCompleted ? 'line-through text-slate-400' : 'text-white'
              }`}
            >
              {node.title}
            </h3>
          </div>
        </div>

        {/* Explainability Badge Button */}
        <div className="self-start">
          <ExplainabilityBadge node={node} variant="button" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
        {node.description}
      </p>

      {/* Meta tags: Prerequisites, Skills, Duration */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {node.estimatedHours} hrs
          </span>

          {node.prerequisites && node.prerequisites.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="text-slate-500">Prereq:</span>
              <span className="text-slate-300">{node.prerequisites.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Interactive Action Pills */}
        <div className="flex items-center gap-2">
          {!isCompleted && !isSkipped && (
            <button
              onClick={() => updateRoadmapNodeStatus(node.id, 'skipped')}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1"
              title="Skip this milestone"
            >
              <SkipForward className="w-3 h-3" />
              <span>Skip</span>
            </button>
          )}

          <button
            onClick={() => startTutorWithTopic(node.title)}
            className="px-3 py-1 text-xs font-medium bg-surface-200 text-slate-200 hover:text-white rounded-lg border border-white/5 hover:bg-surface-300 transition-colors flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
            <span>Explain</span>
          </button>

          <button
            onClick={() => startQuizForTopic(node.title)}
            className="px-3 py-1 text-xs font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 rounded-lg border border-brand-500/30 transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
