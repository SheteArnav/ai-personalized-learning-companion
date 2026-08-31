import React from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { 
  Target, 
  Flame, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Award,
  Zap
} from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { profile, roadmap } = useLearning();

  const totalNodes = roadmap.length || 8;
  const completedNodes = roadmap.filter((n) => n.status === 'completed').length;
  const progressPercent = Math.round((completedNodes / totalNodes) * 100);

  const stats = [
    {
      title: 'Readiness Score',
      value: `${profile?.overallScore || 78}%`,
      subtitle: '+4.2% this week',
      icon: Award,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Current Target',
      value: profile?.careerGoal || 'Software Engineer',
      subtitle: `${profile?.experienceLevel || 'Intermediate'} Level`,
      icon: Target,
      color: 'text-brand-400',
      bgColor: 'bg-brand-500/10 border-brand-500/20',
      isText: true,
    },
    {
      title: 'Learning Streak',
      value: `${profile?.streakDays || 6} Days`,
      subtitle: '🔥 Active consistency',
      icon: Flame,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Study Hours',
      value: `${profile?.totalStudyHours || 42.5}h`,
      subtitle: `${profile?.weeklyHours || 12}h target / week`,
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Completed Topics',
      value: `${completedNodes} / ${totalNodes}`,
      subtitle: `${progressPercent}% roadmap covered`,
      icon: CheckCircle,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl border ${item.bgColor}`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>

            <div className="mt-3">
              <div
                className={`font-bold tracking-tight text-white ${
                  item.isText ? 'text-sm sm:text-base truncate' : 'text-xl sm:text-2xl font-mono'
                }`}
              >
                {item.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                {item.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
