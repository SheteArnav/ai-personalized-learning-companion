import React from 'react';
import { useLearning, AppTab } from '../../context/LearningContext.js';
import { 
  Sparkles, 
  Flame, 
  Target, 
  Cpu, 
  MessageSquare, 
  HelpCircle, 
  Menu,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { profile, activeTab, setActiveTab, aiStatus, startQuizForTopic, refreshData, addToast } = useLearning();

  const handleResetData = async () => {
    if (confirm('Reset learning progress and restore hackathon demo baseline?')) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          await refreshData();
          addToast('info', 'Demo Reset', 'Restored pristine baseline data.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel bg-surface-400/80 border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow">
              <div className="w-full h-full bg-surface-400 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-brand-300 transition-colors">
                  SYNAPSE
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider -mt-1 hidden sm:inline">
                Adaptive Learning Engine
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Stats Pill */}
        {profile && activeTab !== 'landing' && activeTab !== 'onboarding' && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/90 border border-white/10 text-xs">
            <div className="flex items-center gap-1 text-slate-300">
              <Target className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-medium text-white">{profile.careerGoal}</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
              <span>{profile.streakDays}d Streak</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1 text-cyan-400 font-medium">
              <span>{profile.overallScore}% Readiness</span>
            </div>
          </div>
        )}

        {/* Right: Mode & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Mode Indicator */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-surface-100/80 border border-white/10 text-slate-300 hover:border-brand-500/40 cursor-pointer transition-colors"
            title="Click to configure AI Provider"
          >
            <span className={`w-2 h-2 rounded-full ${aiStatus.isDemoMode ? 'bg-emerald-400 animate-pulse' : 'bg-brand-400 animate-pulse'}`} />
            <span className="hidden sm:inline">{aiStatus.isDemoMode ? 'Demo Mode' : 'AI Active'}</span>
          </div>

          {/* Quick Quiz trigger */}
          {activeTab !== 'landing' && activeTab !== 'onboarding' && (
            <button
              onClick={() => startQuizForTopic('Binary Trees & Recursion')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-all shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Practice Quiz</span>
            </button>
          )}

          {/* Ask Tutor shortcut */}
          {activeTab !== 'landing' && activeTab !== 'onboarding' && (
            <button
              onClick={() => setActiveTab('tutor')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Companion</span>
            </button>
          )}

          {/* Reset button for testing */}
          <button
            onClick={handleResetData}
            title="Reset to initial Demo baseline"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
