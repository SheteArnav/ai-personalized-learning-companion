import React from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  Area, 
  AreaChart 
} from 'recharts';
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { analytics, profile, skills, setActiveTab, startTutorWithTopic } = useLearning();

  const weeklyData = analytics?.weeklyActivity || [
    { day: 'Mon', hours: 2.5, target: 2.0 },
    { day: 'Tue', hours: 1.8, target: 2.0 },
    { day: 'Wed', hours: 3.2, target: 2.0 },
    { day: 'Thu', hours: 2.0, target: 2.0 },
    { day: 'Fri', hours: 0.8, target: 2.0 },
    { day: 'Sat', hours: 3.5, target: 2.0 },
    { day: 'Sun', hours: 2.2, target: 2.0 },
  ];

  const radarData =
    analytics?.skillRadar ||
    skills.map((s) => ({
      skill: s.name.length > 14 ? s.name.slice(0, 13) + '..' : s.name,
      current: s.currentLevel,
      target: s.targetLevel,
      fullMark: 100,
    }));

  const quizTrendData = analytics?.quizPerformance || [
    { date: 'Aug 24', topic: 'Python OOP', score: 88 },
    { date: 'Aug 26', topic: 'Linear DSA', score: 76 },
    { date: 'Aug 29', topic: 'Binary Trees', score: 62 },
    { date: 'Aug 31', topic: 'SQL Queries', score: 45 },
  ];

  const aiInsights = analytics?.aiInsights || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel bg-surface-100/90 border border-white/10 p-6 sm:p-8 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-mono font-semibold uppercase mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry & Cognitive Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Progress & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live evaluation of concept retention, study consistency, and skill vector progression toward <strong className="text-white">{profile?.careerGoal || 'Software Engineer'}</strong>.
          </p>
        </div>
      </div>

      {/* Charts Grid: Skill Radar + Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Radar (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Skill Competency Radar
              </h3>
              <p className="text-xs text-slate-400">Current proficiency vs target benchmark</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Current
              </span>
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Target
              </span>
            </div>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.2)" />
                <Radar
                  name="Target Benchmark"
                  dataKey="target"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Current Mastery"
                  dataKey="current"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11141d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Study Activity (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Weekly Study Consistency
              </h3>
              <p className="text-xs text-slate-400">Daily hours logged vs weekly commitment</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Total: 16.0 hrs
            </span>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11141d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" name="Logged Hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Daily Target" fill="rgba(255, 255, 255, 0.1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quiz Progression Timeline */}
      <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Diagnostic Quiz Progression Timeline
            </h3>
            <p className="text-xs text-slate-400">Historical performance across technical assessments</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Passing: 75%</span>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={quizTrendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#11141d',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Score %"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#scoreGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Proactive Insights Section */}
      <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Cognitive Insights & Recommendations
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((ins) => (
            <div
              key={ins.id}
              className={`p-4 rounded-xl border text-xs flex flex-col justify-between ${
                ins.type === 'positive'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                  : ins.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                  : 'bg-brand-500/10 border-brand-500/20 text-brand-200'
              }`}
            >
              <div>
                <div className="font-semibold text-white mb-1">{ins.title}</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{ins.message}</p>
              </div>

              {ins.actionLabel && (
                <button
                  onClick={() => {
                    if (ins.actionTarget?.startsWith('node_')) {
                      setActiveTab('roadmap');
                    } else {
                      startTutorWithTopic(ins.title, ins.message);
                    }
                  }}
                  className="mt-3 inline-flex items-center gap-1 font-semibold text-brand-300 hover:text-brand-200 text-[11px]"
                >
                  <span>{ins.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
