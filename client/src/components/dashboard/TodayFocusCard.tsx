import React from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  PlayCircle, 
  HelpCircle,
  MessageSquare,
  Flame
} from 'lucide-react';
import { ExplainabilityBadge } from '../common/ExplainabilityBadge.js';

export const TodayFocusCard: React.FC = () => {
  const { 
    roadmap, 
    updateRoadmapNodeStatus, 
    startQuizForTopic, 
    startTutorWithTopic,
    setActiveTab 
  } = useLearning();

  // Take the first 4 active/relevant nodes
  const todayNodes = roadmap.slice(0, 4);

  return (
    <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Today's Learning Path</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              AI Optimized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalized sequence calibrated to your available time and current skill gaps.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('roadmap')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          <span>View Full Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-white/5 mt-2">
        {todayNodes.map((node, index) => {
          const isDone = node.status === 'completed';
          const isInProgress = node.status === 'in_progress';

          return (
            <div
              key={node.id}
              className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isInProgress ? 'bg-brand-500/5 -mx-2 px-2 rounded-xl border border-brand-500/20' : ''
              }`}
            >
              {/* Left: Sequence index + Title */}
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() =>
                    updateRoadmapNodeStatus(node.id, isDone ? 'in_progress' : 'completed')
                  }
                  className="mt-0.5 flex-shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
                  title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-brand-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{index + 1}.
                    </span>
                    <h4
                      className={`text-sm font-semibold transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {node.title}
                    </h4>

                    {/* Status Pill */}
                    {isInProgress && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        In Progress
                      </span>
                    )}
                    {node.adaptedFromQuiz && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Quiz Adapted
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-1">
                    {node.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {node.estimatedHours} hrs
                    </span>

                    {/* Explainability badge */}
                    <ExplainabilityBadge node={node} variant="button" />
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 sm:self-center">
                <button
                  onClick={() => startTutorWithTopic(node.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-200 text-slate-200 hover:text-white hover:bg-surface-300 border border-white/5 transition-colors flex items-center gap-1.5"
                  title="Ask AI Companion about this topic"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                  <span>Explain</span>
                </button>

                <button
                  onClick={() => startQuizForTopic(node.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border border-brand-500/30 transition-colors flex items-center gap-1.5"
                  title="Test knowledge on this topic"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
