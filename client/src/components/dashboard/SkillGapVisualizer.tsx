import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { SkillItem } from '../../types/index.js';
import { 
  TrendingUp, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SkillGapVisualizer: React.FC = () => {
  const { skills, startQuizForTopic, startTutorWithTopic } = useLearning();
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSkillId(expandedSkillId === id ? null : id);
  };

  const getStatusBadge = (status: SkillItem['status']) => {
    switch (status) {
      case 'Critical Gap':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Proficient':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Mastered':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-white/10 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass">
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Skill Gap Analysis</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Live Vector Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time delta between your current proficiency and industry benchmark requirements.
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/5 mt-4 space-y-4">
        {skills.map((skill) => {
          const gap = Math.max(0, skill.targetLevel - skill.currentLevel);
          const isExpanded = expandedSkillId === skill.id;

          return (
            <div key={skill.id} className="pt-3 first:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{skill.name}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getStatusBadge(
                      skill.status
                    )}`}
                  >
                    {skill.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">
                    Current: <strong className="text-cyan-400">{skill.currentLevel}%</strong>
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-400">
                    Target: <strong className="text-brand-300">{skill.targetLevel}%</strong>
                  </span>
                  <button
                    onClick={() => toggleExpand(skill.id)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                    title="Explain WHY this gap exists"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Progress Bar comparison */}
              <div className="relative w-full h-3 bg-surface-300 rounded-full overflow-hidden border border-white/5">
                {/* Target marker background */}
                <div
                  className="absolute top-0 bottom-0 bg-white/10 rounded-full"
                  style={{ width: `${skill.targetLevel}%` }}
                />
                {/* Current level fill */}
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    skill.status === 'Critical Gap'
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                      : 'bg-gradient-to-r from-brand-500 to-cyan-400'
                  }`}
                  style={{ width: `${skill.currentLevel}%` }}
                />
              </div>

              {/* Expandable Explanation Drawer ("WHY each gap exists") */}
              {isExpanded && (
                <div className="mt-3 p-3.5 rounded-xl bg-surface-200/70 border border-white/10 text-xs space-y-2 animate-slide-up">
                  <div className="flex items-center gap-1.5 text-brand-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>Why this {gap}% gap exists:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{skill.gapReason}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => startQuizForTopic(skill.name)}
                      className="px-2.5 py-1 rounded-md bg-brand-500/20 text-brand-200 border border-brand-500/30 hover:bg-brand-500/30 text-[11px] font-medium transition-colors"
                    >
                      Take Diagnostic Quiz
                    </button>
                    <button
                      onClick={() =>
                        startTutorWithTopic(
                          skill.name,
                          `Explain the core gaps in my understanding of ${skill.name} and provide a practice roadmap.`
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-surface-300 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
                    >
                      Ask AI Tutor
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
