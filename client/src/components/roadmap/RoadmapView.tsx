import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { RoadmapNodeCard } from './RoadmapNodeCard.js';
import { AddTopicModal } from './AddTopicModal.js';
import { 
  Compass, 
  Plus, 
  Sparkles, 
  Layers, 
  Filter, 
  CheckCircle2, 
  Info,
  ArrowDown
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { roadmap, profile } = useLearning();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const stages = [
    'all',
    'Foundations',
    'Core Engineering',
    'Advanced Algorithms',
    'Real-World Projects',
    'Specialization',
    'Interview & Job Ready',
  ];

  const filteredRoadmap =
    selectedStage === 'all'
      ? roadmap
      : roadmap.filter((n) => n.stage.toLowerCase() === selectedStage.toLowerCase());

  const completedCount = roadmap.filter((n) => n.status === 'completed').length;
  const totalHours = roadmap.reduce((sum, n) => sum + (n.estimatedHours || 0), 0);
  const progressPercent = Math.round((completedCount / (roadmap.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel bg-surface-100/90 border border-white/10 p-6 sm:p-8 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-mono font-semibold uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>Target Role: {profile?.careerGoal || 'Software Engineer'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            A living, adaptive curriculum that continuously self-tunes based on your quiz results, uploaded documents, and skill progression.
          </p>
        </div>

        {/* Progress & Add button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-surface-200/80 border border-white/10 text-xs font-mono">
            <div className="text-slate-400">Total Curriculum</div>
            <div className="text-base font-bold text-white mt-0.5">
              {completedCount}/{roadmap.length} <span className="text-cyan-400">({progressPercent}%)</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{totalHours} estimated hours</div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-3 rounded-2xl font-semibold text-xs bg-brand-500 text-white hover:bg-brand-600 shadow-glow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Topic</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Stages Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-surface-200/50 border border-white/5 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Pipeline:</span>
          {['Target Goal', 'Foundations', 'Core Skills', 'DSA & Algos', 'Projects', 'Specialization', 'Job Ready'].map(
            (stageName, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    idx <= 3
                      ? 'bg-brand-500/15 text-brand-300 border-brand-500/30'
                      : 'bg-surface-300 text-slate-400 border-white/5'
                  }`}
                >
                  {stageName}
                </div>
                {idx < 6 && <span className="text-slate-600 font-bold">→</span>}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Filter / Stage Selector Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                selectedStage === st
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-surface-200/60 text-slate-400 hover:text-slate-200 hover:bg-surface-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click "Why this?" on any card to review or modify AI rationale</span>
        </div>
      </div>

      {/* Roadmap Nodes List */}
      <div className="space-y-4">
        {filteredRoadmap.map((node, index) => (
          <RoadmapNodeCard key={node.id} node={node} index={index} />
        ))}
      </div>

      <AddTopicModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
