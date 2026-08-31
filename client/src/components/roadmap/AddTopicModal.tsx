import React, { useState } from 'react';
import { Modal } from '../common/Modal.js';
import { api } from '../../api/client.js';
import { useLearning } from '../../context/LearningContext.js';
import { Plus } from 'lucide-react';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({ isOpen, onClose }) => {
  const { refreshData, addToast } = useLearning();
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState('Core Engineering');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [skillsCovered, setSkillsCovered] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.addRoadmapNode({
        title,
        stage: stage as any,
        description,
        estimatedHours: Number(estimatedHours),
        skillsCovered: skillsCovered.split(',').map((s) => s.trim()).filter(Boolean),
      });

      await refreshData();
      addToast('success', 'Topic Added', `"${title}" has been inserted into your roadmap.`);
      onClose();
      setTitle('');
      setDescription('');
    } catch (err: any) {
      addToast('error', 'Error', err.message || 'Could not add topic.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Custom Learning Topic" subtitle="Insert your own topic into the AI roadmap">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Topic Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Consensus (Raft & Paxos)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Roadmap Stage</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
          >
            <option value="Foundations">Foundations</option>
            <option value="Core Engineering">Core Engineering</option>
            <option value="Advanced Algorithms">Advanced Algorithms</option>
            <option value="Real-World Projects">Real-World Projects</option>
            <option value="Specialization">Specialization</option>
            <option value="Interview & Job Ready">Interview & Job Ready</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description & Learning Objectives</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key concepts, implementation goals, and references..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Hours</label>
            <input
              type="number"
              min="1"
              max="50"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skillsCovered}
              onChange={(e) => setSkillsCovered(e.target.value)}
              placeholder="e.g. Distributed Systems, Go"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-glow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Roadmap</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
