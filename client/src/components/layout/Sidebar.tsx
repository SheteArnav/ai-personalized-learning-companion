import React from 'react';
import { useLearning, AppTab } from '../../context/LearningContext.js';
import { 
  LayoutDashboard, 
  Map, 
  Bot, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, profile, roadmap } = useLearning();

  const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'roadmap', 
      label: 'Learning Roadmap', 
      icon: Map, 
      badge: `${roadmap.filter(n => n.status === 'completed').length}/${roadmap.length}` 
    },
    { id: 'tutor', label: 'AI Companion', icon: Bot },
    { id: 'documents', label: 'Document Analyzer', icon: FileText },
    { id: 'quiz', label: 'Quiz Arena', icon: CheckSquare },
    { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: AppTab) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 z-40 lg:z-10 h-[calc(100vh-4rem)] w-64 glass-panel bg-surface-400/95 lg:bg-surface-400/50 border-r border-white/5 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation List */}
        <div className="space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-brand-500/30 text-brand-200' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Card */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          {/* Quick AI Proactive Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-900/40 via-surface-100/60 to-cyan-950/30 border border-brand-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-brand-300 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              <span>Adaptive Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto-adapting roadmap based on quiz accuracy & study materials.
            </p>
          </div>

          {profile && (
            <div
              onClick={() => handleNavClick('settings')}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-200/50 hover:bg-surface-200 border border-white/5 cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{profile.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{profile.careerGoal}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
