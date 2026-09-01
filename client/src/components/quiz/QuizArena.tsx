import React, { useState, useEffect } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { api } from '../../api/client.js';
import { QuizQuestion, QuizResult } from '../../types/index.js';
import { isAnswerCorrect } from '../../utils/quizEvaluator.js';
import { 
  CheckSquare, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  Compass, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizArena: React.FC = () => {
  const { 
    quizTargetTopic, 
    setQuizTargetTopic, 
    refreshData, 
    addToast, 
    setActiveTab, 
    roadmap 
  } = useLearning();

  const [topic, setTopic] = useState<string>(quizTargetTopic || 'Binary Trees & Recursion');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Auto-generate if target topic was set
  useEffect(() => {
    if (quizTargetTopic) {
      setTopic(quizTargetTopic);
      handleGenerateQuiz(quizTargetTopic, difficulty);
      setQuizTargetTopic(null);
    }
  }, [quizTargetTopic]);

  const handleGenerateQuiz = async (overrideTopic?: string, overrideDiff?: string) => {
    const targetTopic = overrideTopic || topic;
    const targetDiff = overrideDiff || difficulty;

    setIsGenerating(true);
    setQuizResult(null);
    setSelectedAnswers({});
    setRevealedExplanations({});
    setCurrentIndex(0);

    try {
      const res = await api.generateQuiz(targetTopic, targetDiff);
      setQuizId(res.quizId);
      setQuestions(res.questions);
      addToast('info', 'Quiz Ready', `Generated ${res.questions.length} adaptive questions for "${targetTopic}".`);
    } catch (err: any) {
      addToast('error', 'Generation Failed', err.message || 'Could not generate quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    setRevealedExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizId) return;

    setIsSubmitting(true);
    try {
      const answerPayload = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id] || '',
      }));

      const activeTopic = questions[0]?.topic || topic;
      const res = await api.submitQuiz(quizId, activeTopic, answerPayload);
      setQuizResult(res.result);
      await refreshData();

      if (res.result.score >= 75) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
        addToast('success', 'Mastery Confirmed!', `You scored ${res.result.score}% on ${topic}.`);
      } else {
        addToast('warning', 'Roadmap Adapted', res.message);
      }
    } catch (err: any) {
      addToast('error', 'Submission Failed', err.message || 'Could not grade quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isAnswered = currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel bg-surface-100/90 border border-white/10 p-6 sm:p-8 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>AI Adaptive Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quiz & Assessment Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Test knowledge with instant feedback. Failing a topic automatically generates an explainable remediation node in your roadmap.
          </p>
        </div>
      </div>

      {/* Quiz Controls / Topic Selector */}
      {!questions.length || quizResult ? (
        <div className="rounded-2xl glass-panel bg-surface-100/90 border border-white/10 p-6 shadow-glass space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Configure Diagnostic Test
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Target Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="Python Programming">Python Programming</option>
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms & Graph Theory">Algorithms & Graph Theory</option>
                <option value="SQL & Database Design">SQL & Database Design</option>
                <option value="Machine Learning & AI">Machine Learning & AI</option>
                <option value="System Design & Scalability">System Design & Scalability</option>
                <option value="Binary Trees & Recursion">Binary Trees & Recursion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                      difficulty === diff
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-surface-200 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleGenerateQuiz()}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-glow hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Test Questions...' : 'Start Diagnostic Quiz'}</span>
          </button>
        </div>
      ) : null}

      {/* Active Question Player */}
      {questions.length > 0 && !quizResult && currentQuestion && (
        <div className="rounded-3xl glass-panel bg-surface-100/95 border border-white/10 p-6 sm:p-8 shadow-glass space-y-6 animate-slide-up">
          {/* Question progress and timer */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono font-bold text-cyan-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>•</span>
              <span className="font-mono">{currentQuestion.topic}</span>
            </div>

            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Title */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options (Multiple Choice or True/False) */}
          <div className="space-y-3">
            {currentQuestion.options?.map((option, idx) => {
              const selectedAnswer = selectedAnswers[currentQuestion.id];
              const isSelected = selectedAnswer === option;
              const hasAnswered = selectedAnswer !== undefined;
              const isThisOptionCorrect = isAnswerCorrect(option, currentQuestion.correctAnswer);
              const isUserSelectedCorrect = isAnswerCorrect(selectedAnswer, currentQuestion.correctAnswer);

              let optionStyle = 'bg-surface-200/70 border-white/10 hover:border-brand-500/40 text-slate-200';
              if (hasAnswered) {
                if (isThisOptionCorrect) {
                  optionStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-sm';
                } else if (isSelected && !isUserSelectedCorrect) {
                  optionStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-200 shadow-sm';
                } else {
                  optionStyle = 'bg-surface-300/50 border-white/5 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestion.id, option)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-mono text-xs text-slate-400 flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasAnswered && isThisOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isUserSelectedCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Short answer input if question type is short_answer */}
            {currentQuestion.type === 'short_answer' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Type your concise answer and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectOption(currentQuestion.id, (e.target as HTMLInputElement).value);
                    }
                  }}
                  disabled={isAnswered}
                  className="w-full p-4 rounded-xl bg-surface-200 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                />
                {isAnswered && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      isAnswerCorrect(selectedAnswers[currentQuestion.id], currentQuestion.correctAnswer)
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isAnswerCorrect(selectedAnswers[currentQuestion.id], currentQuestion.correctAnswer) ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span>
                        Your Answer: <strong>{selectedAnswers[currentQuestion.id]}</strong>
                        {!isAnswerCorrect(selectedAnswers[currentQuestion.id], currentQuestion.correctAnswer) && (
                          <span className="ml-2 text-slate-300">
                            (Correct Answer: <strong className="text-emerald-300">{currentQuestion.correctAnswer}</strong>)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instant Rationale & Explanation Card */}
          {revealedExplanations[currentQuestion.id] && currentQuestion.explanation && (
            <div className="p-4 rounded-2xl bg-surface-200/80 border border-white/10 text-xs space-y-1.5 animate-slide-up">
              <div className="flex items-center gap-1.5 text-brand-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>AI Rationale & Concept Invariant:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {isAnswered ? 'Answer registered. Proceed to continue.' : 'Select an option above.'}
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              <span>
                {currentIndex === questions.length - 1
                  ? isSubmitting
                    ? 'Submitting...'
                    : 'Finish & Grade Quiz'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* End-of-Quiz Knowledge Report Modal / View */}
      {quizResult && (
        <div className="rounded-3xl glass-panel bg-surface-100/95 border border-white/10 p-6 sm:p-8 shadow-glass space-y-6 animate-slide-up">
          {/* Top Score Banner */}
          <div className="text-center pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-[1px] shadow-glow mx-auto mb-3">
              <div className="w-full h-full bg-surface-400 rounded-[15px] flex items-center justify-center">
                <Award className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-semibold">
              Assessment Summary
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Diagnostic Knowledge Report
            </h2>
            <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-2">
              {quizResult.score}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {quizResult.correctCount} of {quizResult.totalQuestions} questions answered correctly.
            </p>
          </div>

          {/* Strong vs Weak Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Strong Mastery Areas:</span>
              </span>
              {quizResult.strongAreas.length > 0 ? (
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {quizResult.strongAreas.map((sa, i) => (
                    <li key={i}>{sa}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-400 italic">No areas scored above threshold.</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
              <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Needs Improvement / Remediation:</span>
              </span>
              {quizResult.weakAreas.length > 0 ? (
                <ul className="list-disc list-inside text-rose-200 space-y-1">
                  {quizResult.weakAreas.map((wa, i) => (
                    <li key={i}>{wa}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-400 italic">No significant weakness detected!</span>
              )}
            </div>
          </div>

          {/* Automatic Dynamic Roadmap Adaptation Alert */}
          {quizResult.roadmapAdaptationTriggered && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-900/40 via-surface-200/80 to-brand-950/40 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>⚡ Dynamic AI Roadmap Recalibration Triggered!</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {quizResult.adaptationSummary ||
                  'Because diagnostic score was below 75%, Synapse automatically inserted a targeted remediation node into your roadmap.'}
              </p>
            </div>
          )}

          {/* Recommended Next Step */}
          <div className="p-4 rounded-2xl bg-surface-200/60 border border-white/5 text-xs">
            <span className="font-semibold text-brand-300 block mb-1">Recommended Next Step:</span>
            <p className="text-slate-300">{quizResult.recommendedAction}</p>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => handleGenerateQuiz()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-surface-200 hover:bg-surface-300 text-slate-200 hover:text-white border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake / New Test</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Review Updated Roadmap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
