import React from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { Sparkles, Calendar, Zap, ArrowUpRight } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  const { profile, roadmap, setActiveTab, startQuizForTopic } = useLearning();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const activeTopic = roadmap.find((n) => n.status === 'in_progress') || roadmap[0];

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel bg-gradient-to-r from-surface-100/90 via-surface-200/90 to-brand-950/40 p-6 sm:p-8 border border-white/10 shadow-glass">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-mono font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Learning Copilot Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {profile?.name || 'Alex'}
          </h1>

          <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            Here's what you should focus on today. You are <strong className="text-cyan-400">{profile?.overallScore || 78}%</strong> ready for your target role as a <strong className="text-white">{profile?.careerGoal || 'Software Engineer'}</strong>.
          </p>
        </div>

        {/* Priority recommendation quick action */}
        {activeTopic && (
          <div className="flex-shrink-0 p-4 rounded-2xl bg-surface-300/80 border border-brand-500/30 max-w-sm w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="text-brand-300 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-brand-400" />
                Active Focus
              </span>
              <span className="font-mono text-[10px] text-slate-400">{activeTopic.estimatedHours} hrs</span>
            </div>
            <div className="text-sm font-bold text-white truncate">{activeTopic.title}</div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('roadmap')}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors text-center"
              >
                Continue Topic
              </button>
              <button
                onClick={() => startQuizForTopic(activeTopic.title)}
                className="py-1.5 px-3 rounded-lg text-xs font-medium bg-surface-200 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
              >
                <span>Quiz</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
