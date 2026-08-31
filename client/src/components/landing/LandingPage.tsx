import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Compass, 
  FileSearch, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Layers, 
  Bot,
  Flame,
  ChevronRight,
  Code2,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useLearning();
  const [activePreviewTab, setActivePreviewTab] = useState<'roadmap' | 'quiz' | 'tutor'>('roadmap');

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-brand-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center flex flex-col items-center">
        {/* Release / Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-surface-100/90 border border-brand-500/30 text-xs text-brand-300 mb-8 animate-fade-in shadow-glow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">Next-Gen Cognitive Learning Architecture</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono text-[11px]">v1.0 Hackathon Release</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Your learning path <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400">
            shouldn't be generic.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
          An AI-powered learning companion that transforms your career goals, current skills, and uploaded study materials into an adaptive, explainable path to mastery.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button
            onClick={() => setActiveTab('onboarding')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 text-white shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Personalized Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-base glass-card bg-surface-100/80 hover:bg-surface-100 text-slate-200 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Live Prototype</span>
            <Sparkles className="w-4 h-4 text-brand-400" />
          </button>
        </div>

        {/* Metric proof bar */}
        <div className="mt-14 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-left w-full max-w-3xl">
          <div>
            <div className="text-2xl font-bold font-mono text-white">4.2x</div>
            <div className="text-xs text-slate-400 mt-0.5">Faster Concept Retention</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Explainable AI Decisions</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">Dynamic</div>
            <div className="text-xs text-slate-400 mt-0.5">Quiz-Driven Adaptation</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-brand-400">Multi-Doc</div>
            <div className="text-xs text-slate-400 mt-0.5">PDF / DOCX Syllabus Ingestion</div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Demo Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Serious Mastery
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Experience how the cognitive engine seamlessly integrates assessment, roadmap, and companion tutoring.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { id: 'roadmap', label: 'Adaptive Visual Roadmap', icon: Compass },
            { id: 'quiz', label: 'Diagnostic Quiz Engine', icon: CheckCircle2 },
            { id: 'tutor', label: 'Contextual AI Companion', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activePreviewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreviewTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Frame */}
        <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden relative">
          {activePreviewTab === 'roadmap' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase font-semibold text-brand-400">Target Career</span>
                  <h3 className="text-lg font-bold text-white">Full Stack & AI Engineer Roadmap</h3>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Continuous Adaptation Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface-200/60 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-400">Completed</span>
                    <span className="text-[10px] text-slate-400">3.5 hrs</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Python Closures & Metaclasses</h4>
                  <p className="text-xs text-slate-400 mt-1">First-class functions, lexical scopes, and decorators.</p>
                </div>

                <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 ring-1 ring-brand-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Today's Focus</span>
                    <span className="text-[10px] text-brand-300">5.0 hrs</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Trees & Binary Search Traversals</h4>
                  <p className="text-xs text-slate-300 mt-1">DFS, BFS, and recursive tree balanced height invariants.</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-200/40 border border-white/5 opacity-70">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Up Next</span>
                    <span className="text-[10px] text-slate-400">6.5 hrs</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Graph Traversals & Dijkstra</h4>
                  <p className="text-xs text-slate-400 mt-1">Shortest path algorithms and topological sorting.</p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'quiz' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-xs font-semibold text-cyan-400">Diagnostic Question 1 of 5</span>
                <span className="text-xs font-mono text-slate-400">Topic: Binary Search Trees</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-white">
                What is the worst-case time complexity of finding a value in an unbalanced binary search tree?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {['O(log N)', 'O(1)', 'O(N) - (Correct)', 'O(N log N)'].map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs font-medium border ${
                      i === 2
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        : 'bg-surface-200/50 border-white/5 text-slate-300'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePreviewTab === 'tutor' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 rounded-xl bg-surface-200/70 border border-white/5 text-xs text-slate-300">
                <span className="font-semibold text-brand-400 block mb-1">Student:</span>
                "Can you explain why dynamic arrays have an amortized O(1) append time?"
              </div>
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-200 space-y-2">
                <span className="font-semibold text-cyan-300 block">Synapse AI Companion:</span>
                <p>
                  When the internal buffer reaches capacity, the array allocates a new buffer of double size and copies elements (costing \\(O(N)\\)). However, doubling happens exponentially less often, distributing the cost so that \\(N\\) appends take \\(2N\\) operations total, averaging to \\(O(1)\\) amortized per append!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4-Step How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full border-t border-white/5">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-semibold">
            Seamless Workflow
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
            How Synapse Delivers Hyper-Personalization
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Cognitive Profiling',
              desc: 'Select your target career, input existing competencies, and set realistic weekly time commitments.',
              icon: Brain,
            },
            {
              step: '02',
              title: 'Document Ingestion',
              desc: 'Upload lecture slides, book chapters, or syllabi (PDF/DOCX/TXT). AI automatically extracts concepts.',
              icon: FileSearch,
            },
            {
              step: '03',
              title: 'Dynamic Roadmap',
              desc: 'Get an explainable milestone graph prioritizing your biggest skill deficits first.',
              icon: Compass,
            },
            {
              step: '04',
              title: 'Active Adaptation',
              desc: 'Take diagnostic quizzes. Struggling with a topic automatically injects remediation nodes.',
              icon: Zap,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                      {item.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-950/80 to-surface-200 border border-brand-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to master your dream career?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Build your personalized learning roadmap in less than 2 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-white text-slate-950 hover:bg-slate-100 shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-slate-300">Synapse AI</span>
            <span>— The Adaptive Learning Companion</span>
          </div>
          <div>Built with React, TypeScript, Tailwind CSS, Express & Modular AI</div>
        </div>
      </footer>
    </div>
  );
};
