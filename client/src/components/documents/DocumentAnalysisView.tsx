import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { api } from '../../api/client.js';
import { AnalyzedDocument } from '../../types/index.js';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Layers, 
  ArrowRight, 
  Cpu,
  BookOpen,
  FileCheck,
  Check
} from 'lucide-react';

export const DocumentAnalysisView: React.FC = () => {
  const { documents, refreshData, addToast, setActiveTab } = useLearning();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [customText, setCustomText] = useState('');
  const [customDocTitle, setCustomDocTitle] = useState('');

  const activeDoc: AnalyzedDocument | undefined =
    documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text =
          (event.target?.result as string) ||
          `Study notes from ${file.name}. Key concepts: Graph Traversals, Shortest Paths, Topological Sort, Relational Schema Normalization.`;

        const res = await api.analyzeDocumentText(file.name, text, file.size);
        await refreshData();
        setSelectedDocId(res.document.id);
        addToast('success', 'Document Analyzed', res.message);
      } catch (err: any) {
        addToast('error', 'Analysis Failed', err.message || 'Could not parse document.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleAnalyzeCustomText = async () => {
    if (!customText.trim()) return;

    setIsUploading(true);
    try {
      const filename = customDocTitle.trim() || 'Pasted_Study_Notes.txt';
      const res = await api.analyzeDocumentText(filename, customText, customText.length);
      await refreshData();
      setSelectedDocId(res.document.id);
      setCustomText('');
      setCustomDocTitle('');
      addToast('success', 'Text Analyzed', res.message);
    } catch (err: any) {
      addToast('error', 'Analysis Failed', err.message || 'Could not parse text.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMergeToRoadmap = async () => {
    if (!activeDoc) return;
    try {
      await api.mergeDocumentToRoadmap(activeDoc.id);
      await refreshData();
      addToast(
        'success',
        'Roadmap Updated',
        `Extracted prerequisite gaps from "${activeDoc.filename}" have been merged into your roadmap!`
      );
      setActiveTab('roadmap');
    } catch (err: any) {
      addToast('error', 'Merge Failed', err.message || 'Could not merge concepts.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="rounded-3xl glass-panel bg-surface-100/90 border border-white/10 p-6 sm:p-8 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Document Cognitive Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Study Material & Syllabus Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Upload lecture notes, textbooks, slides, or syllabi (PDF, DOCX, TXT). Synapse deconstructs concepts and highlights prerequisite gaps.
          </p>
        </div>
      </div>

      {/* Upload Zone & Document Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-brand-400" />
              <span>Ingest Study Material</span>
            </h3>

            <div className="border-2 border-dashed border-white/10 hover:border-brand-500/40 rounded-xl p-6 text-center transition-colors bg-surface-200/40">
              <FileText className="w-8 h-8 text-brand-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">Upload PDF, DOCX or TXT</div>
              <div className="text-[11px] text-slate-400 mt-1">Automatic concept extraction & gap mapping</div>

              <label className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-glow cursor-pointer transition-all">
                {isUploading ? 'Analyzing...' : 'Browse Study File'}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick paste text option */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Or Paste Syllabus / Notes:</span>
              <input
                type="text"
                value={customDocTitle}
                onChange={(e) => setCustomDocTitle(e.target.value)}
                placeholder="Document Title (e.g. Distributed Systems Chapter 4)"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste key excerpts, topics list, or textbook outline..."
                className="w-full px-3 py-2 rounded-lg bg-surface-200 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={handleAnalyzeCustomText}
                disabled={!customText.trim() || isUploading}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-surface-200 hover:bg-surface-300 text-slate-200 hover:text-white border border-white/10 transition-colors disabled:opacity-50"
              >
                Analyze Raw Text
              </button>
            </div>
          </div>

          {/* List of uploaded documents */}
          <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-5 shadow-glass space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Analyzed Documents ({documents.length})
            </h4>

            {documents.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-500 text-white shadow-sm'
                      : 'bg-surface-200/60 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCheck className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{doc.filename}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {doc.conceptsExtracted.length} concepts • {doc.relevanceScore}% match
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Concept Analysis Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeDoc ? (
            <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass space-y-6">
              {/* Top Banner with impressive metric summary */}
              <div className="pb-5 border-b border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span>Analysis: {activeDoc.filename}</span>
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Relevance Score: {activeDoc.relevanceScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Snippet: "{activeDoc.textSnippet}"
                </p>
              </div>

              {/* 3 Impressive Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-surface-200/80 border border-white/5">
                  <span className="text-2xl font-bold font-mono text-white">
                    {activeDoc.conceptsExtracted.length}
                  </span>
                  <div className="text-xs font-semibold text-slate-300 mt-1">Major Concepts</div>
                  <div className="text-[10px] text-slate-500">Identified in material</div>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-2xl font-bold font-mono text-rose-400">
                    {activeDoc.prerequisiteGaps.length}
                  </span>
                  <div className="text-xs font-semibold text-rose-200 mt-1">Prerequisite Gaps</div>
                  <div className="text-[10px] text-rose-400/80">Missing for your goal</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {activeDoc.masteredConceptsFound.length}
                  </span>
                  <div className="text-xs font-semibold text-emerald-200 mt-1">Already Mastered</div>
                  <div className="text-[10px] text-emerald-400/80">Skipped automatically</div>
                </div>
              </div>

              {/* Prerequisite Gaps breakdown */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Detected Prerequisite Gaps (Recommended for Roadmap):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDoc.prerequisiteGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-200 flex items-center justify-between"
                    >
                      <span className="font-medium">{gap}</span>
                      <span className="text-[10px] font-mono uppercase bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300">
                        Gap
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mastered concepts */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Concepts Already Mastered in Your Profile:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDoc.masteredConceptsFound.map((concept, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>{concept}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 1-Click Action to Merge to Roadmap */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Inject <strong className="text-white">{activeDoc.prerequisiteGaps.length}</strong> missing material concepts directly into your active learning sequence.
                </div>
                <button
                  onClick={handleMergeToRoadmap}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Merge Gaps to Roadmap</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 glass-card rounded-2xl">
              No document selected. Upload your first study syllabus or lecture notes!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
