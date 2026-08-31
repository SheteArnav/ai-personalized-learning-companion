import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { api } from '../../api/client.js';
import { CareerGoalType, ExperienceLevel, LearningStyle } from '../../types/index.js';
import { 
  Settings, 
  User, 
  Target, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  Sparkles,
  Key,
  Check,
  Zap
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { profile, aiStatus, refreshData, addToast } = useLearning();

  const [name, setName] = useState(profile?.name || 'Alex Rivera');
  const [email, setEmail] = useState(profile?.email || 'alex@example.com');
  const [careerGoal, setCareerGoal] = useState<CareerGoalType>(profile?.careerGoal || 'Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile?.experienceLevel || 'Intermediate');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(profile?.learningStyle || 'Interactive Code-First');
  const [weeklyHours, setWeeklyHours] = useState<number>(profile?.weeklyHours || 12);

  // AI Config
  const [aiProvider, setAiProvider] = useState<'demo' | 'gemini' | 'openai'>((aiStatus.provider as any) || 'demo');
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile({
        name,
        email,
        careerGoal,
        experienceLevel,
        learningStyle,
        weeklyHours: Number(weeklyHours),
      });

      // Update AI config
      await api.updateAIConfig(aiProvider, apiKey || undefined);

      await refreshData();
      addToast('success', 'Settings Saved', 'Profile and AI preferences updated successfully.');
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Could not save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset all progress back to the demo baseline?')) {
      try {
        await api.resetData();
        await refreshData();
        addToast('info', 'Demo Baseline Restored', 'All progress, roadmap nodes, and quizzes reset.');
      } catch (err: any) {
        addToast('error', 'Reset Failed', err.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl glass-panel bg-surface-100/90 border border-white/10 p-6 sm:p-8 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-mono font-semibold uppercase mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & System Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & AI Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Configure your learner profile, target career trajectory, and AI intelligence provider.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-200 hover:bg-surface-300 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Details Card */}
        <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/10">
            <User className="w-4 h-4 text-brand-400" />
            <span>Learner Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Career & Pedagogy Card */}
        <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/10">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Career Goals & Pedagogy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Career Goal</label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value as CareerGoalType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Full Stack Web Developer">Full Stack Web Developer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Cloud & DevOps Architect">Cloud & DevOps Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Learning Style</label>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Interactive Code-First">Interactive Code-First</option>
                <option value="Visual & Project-Based">Visual & Project-Based</option>
                <option value="Theoretical & Deep-Dive">Theoretical & Deep-Dive</option>
                <option value="Fast-Paced Crash Course">Fast-Paced Crash Course</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Weekly Study Time: <strong className="text-cyan-400 font-mono">{weeklyHours} hrs</strong>
              </label>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full mt-2 accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Provider & Demo Mode Card */}
        <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>AI Provider & Intelligence Engine</span>
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                aiStatus.isDemoMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
              }`}
            >
              {aiStatus.isDemoMode ? 'Demo Mode Active (Zero Key Needed)' : 'Live AI Key Active'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'demo', title: 'High-Fidelity Demo Mode', desc: 'Zero API key required. Reliable mock AI responses.' },
                { id: 'gemini', title: 'Google Gemini AI', desc: 'Gemini 1.5 Flash API integration.' },
                { id: 'openai', title: 'OpenAI GPT-4o-mini', desc: 'OpenAI Chat Completions API integration.' },
              ].map((p) => {
                const isSelected = aiProvider === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setAiProvider(p.id as any)}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-white shadow-sm'
                        : 'bg-surface-200/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{p.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>
                  </div>
                );
              })}
            </div>

            {aiProvider !== 'demo' && (
              <div className="pt-2 animate-slide-up">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {aiProvider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Keys are stored locally in runtime session and never exposed to the frontend.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-glow hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
