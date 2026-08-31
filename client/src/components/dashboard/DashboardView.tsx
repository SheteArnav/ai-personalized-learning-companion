import React from 'react';
import { WelcomeBanner } from './WelcomeBanner.js';
import { StatsOverview } from './StatsOverview.js';
import { TodayFocusCard } from './TodayFocusCard.js';
import { SkillGapVisualizer } from './SkillGapVisualizer.js';
import { useLearning } from '../../context/LearningContext.js';
import { 
  Compass, 
  Bot, 
  FileText, 
  HelpCircle, 
  BarChart3, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setActiveTab, startQuizForTopic } = useLearning();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Personalized Greeting & Focus Banner */}
      <WelcomeBanner />

      {/* 2. Key Metrics & Streak Overview */}
      <StatsOverview />

      {/* 3. Main Grid: Today's Learning Path + Skill Gap Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Focus (7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          <TodayFocusCard />
        </div>

        {/* Skill Gap Analysis (5 cols on large screens) */}
        <div className="lg:col-span-5 space-y-6">
          <SkillGapVisualizer />
        </div>
      </div>

      {/* 4. Quick Action Accelerators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div
          onClick={() => setActiveTab('roadmap')}
          className="p-4 rounded-2xl glass-card border border-white/5 cursor-pointer hover:border-brand-500/30 group"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div className="text-sm font-semibold text-white">Full Visual Roadmap</div>
          <div className="text-xs text-slate-400 mt-1">Explore end-to-end milestone graph & prerequisites.</div>
        </div>

        <div
          onClick={() => setActiveTab('tutor')}
          className="p-4 rounded-2xl glass-card border border-white/5 cursor-pointer hover:border-cyan-500/30 group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-sm font-semibold text-white">Ask AI Companion</div>
          <div className="text-xs text-slate-400 mt-1">Get immediate simplified analogies or debug help.</div>
        </div>

        <div
          onClick={() => startQuizForTopic('Binary Trees & Algorithms')}
          className="p-4 rounded-2xl glass-card border border-white/5 cursor-pointer hover:border-emerald-500/30 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-sm font-semibold text-white">Take Diagnostic Quiz</div>
          <div className="text-xs text-slate-400 mt-1">Adaptive test with automatic roadmap recalibration.</div>
        </div>

        <div
          onClick={() => setActiveTab('documents')}
          className="p-4 rounded-2xl glass-card border border-white/5 cursor-pointer hover:border-amber-500/30 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-sm font-semibold text-white">Upload Study Materials</div>
          <div className="text-xs text-slate-400 mt-1">Extract concepts & detect prerequisite gaps.</div>
        </div>
      </div>
    </div>
  );
};
