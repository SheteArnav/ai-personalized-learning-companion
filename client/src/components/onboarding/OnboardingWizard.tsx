import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { api } from '../../api/client.js';
import { CareerGoalType, ExperienceLevel, LearningStyle } from '../../types/index.js';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Target, 
  GraduationCap, 
  Sliders, 
  Clock, 
  UploadCloud, 
  Check, 
  Cpu, 
  Zap, 
  FileText,
  Layers,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingWizard: React.FC = () => {
  const { setActiveTab, refreshData, addToast } = useLearning();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@example.com');
  const [careerGoal, setCareerGoal] = useState<CareerGoalType>('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [skillsSelected, setSkillsSelected] = useState<string[]>(['Python Basics', 'Git / GitHub', 'Basic SQL']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('Interactive Code-First');
  const [weeklyHours, setWeeklyHours] = useState<number>(12);
  const [uploadedFileName, setUploadedFileName] = useState<string>('MIT_Algorithms_Syllabus.pdf');
  const [uploadedFileText, setUploadedFileText] = useState<string>(
    'Course Syllabus: MIT 6.006 Introduction to Algorithms. Topics: Asymptotic Complexity, Binary Search Trees, AVL Trees, Hashing, Graph Traversals (BFS, DFS), Shortest Paths (Dijkstra, Bellman-Ford), Dynamic Programming.'
  );

  // Analysis / Loading screen state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(0);

  const careerOptions: { id: CareerGoalType; title: string; desc: string; icon: string }[] = [
    { id: 'Software Engineer', title: 'Software Engineer', desc: 'Core CS, DSA, OOP, Systems, and Backend Mastery', icon: '💻' },
    { id: 'AI / Machine Learning Engineer', title: 'AI / ML Engineer', desc: 'PyTorch, Transformers, Tensor Math, MLOps, and RAG', icon: '🤖' },
    { id: 'Data Scientist', title: 'Data Scientist', desc: 'Applied Statistics, Advanced SQL, EDA, and A/B Testing', icon: '📊' },
    { id: 'Full Stack Web Developer', title: 'Full Stack Developer', desc: 'React, Node.js, Database Architecture, and Cloud APIs', icon: '🌐' },
    { id: 'Cybersecurity Analyst', title: 'Cybersecurity Analyst', desc: 'Network Security, Cryptography, and Threat Detection', icon: '🛡️' },
    { id: 'Cloud & DevOps Architect', title: 'Cloud & DevOps Architect', desc: 'Kubernetes, Terraform, CI/CD, and Distributed Systems', icon: '☁️' },
  ];

  const suggestedSkills = [
    'Python Basics', 'JavaScript/TS', 'Data Structures', 'SQL & Databases',
    'HTML/CSS', 'Git / GitHub', 'REST APIs', 'Docker', 'Linux CLI', 'React', 'Calculus/Stats'
  ];

  const toggleSkill = (skill: string) => {
    if (skillsSelected.includes(skill)) {
      setSkillsSelected(skillsSelected.filter((s) => s !== skill));
    } else {
      setSkillsSelected([...skillsSelected, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !skillsSelected.includes(customSkillInput.trim())) {
      setSkillsSelected([...skillsSelected, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setUploadedFileText(text || `Uploaded file ${file.name} content with prerequisite topics and concepts.`);
      };
      reader.readAsText(file);
    }
  };

  const handleFinalSubmit = async () => {
    setIsAnalyzing(true);

    const phases = [
      'Extracting student baseline knowledge & career requirements...',
      'Deconstructing uploaded study materials and prerequisite hierarchy...',
      'Synthesizing personalized milestone roadmap & skill gap vectors...',
      'Calibrating AI companion tutor persona...',
    ];

    for (let i = 0; i < phases.length; i++) {
      setAnalysisPhase(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      // 1. Submit onboarding profile
      await api.submitOnboarding({
        name,
        email,
        careerGoal,
        experienceLevel,
        skills: skillsSelected,
        learningStyle,
        weeklyHours,
      });

      // 2. If study material provided, analyze it
      if (uploadedFileText) {
        await api.analyzeDocumentText(uploadedFileName, uploadedFileText, uploadedFileText.length);
      }

      await refreshData();

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      addToast('success', 'Cognitive Profile Ready', `Your personalized learning path for ${careerGoal} is generated!`);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Onboarding Failed', err.message || 'Could not complete onboarding.');
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    const phases = [
      'Extracting student baseline knowledge & career requirements...',
      'Deconstructing uploaded study materials and prerequisite hierarchy...',
      'Synthesizing personalized milestone roadmap & skill gap vectors...',
      'Calibrating AI companion tutor persona...',
    ];

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        {/* Animated Scanner Visual */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-400/40 animate-pulse" />
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-glow">
            <Cpu className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold mb-2">
          Cognitive AI Engine Active
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Analyzing Your Learning Profile...
        </h2>
        <p className="text-sm text-slate-400 mt-2 h-10 transition-all font-medium">
          {phases[analysisPhase]}
        </p>

        {/* Multi-step progress bar */}
        <div className="w-full bg-surface-200 h-2 rounded-full mt-6 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${((analysisPhase + 1) / phases.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span className="font-mono text-brand-400">{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-surface-200 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container */}
      <div className="glass-panel bg-surface-100/90 rounded-2xl border border-white/10 p-6 sm:p-10 shadow-glass animate-slide-up">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 1</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Let's setup your learner profile
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Synapse will address you and personalize all explanations to your profile.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-white/10 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface-200 border border-white/10 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Career Goal */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 2</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                What is your target career goal?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                The AI benchmarks required industry competencies against this role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {careerOptions.map((opt) => {
                const isSelected = careerGoal === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setCareerGoal(opt.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-white shadow-glow'
                        : 'bg-surface-200/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-surface-200'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{opt.title}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Current Knowledge Level */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 3</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                What is your current overall experience level?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Determines the pacing and initial complexity of generated modules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'Beginner', title: 'Beginner', desc: 'Starting from scratch or know basic syntax only.' },
                { id: 'Intermediate', title: 'Intermediate', desc: 'Built a few projects, know linear data structures.' },
                { id: 'Advanced', title: 'Advanced', desc: 'Experienced builder looking to master system design & edge cases.' },
              ].map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setExperienceLevel(lvl.id as ExperienceLevel)}
                    className={`p-5 rounded-xl cursor-pointer border transition-all text-center flex flex-col justify-between ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-white shadow-glow'
                        : 'bg-surface-200/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-base font-bold text-white">{lvl.title}</div>
                      <div className="text-xs text-slate-400 mt-2 leading-relaxed">{lvl.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="mt-4 flex justify-center">
                        <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Existing Skills */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 4</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Select your existing skills
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We will mark these as mastered or in-progress to prevent redundant roadmap milestones.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((sk) => {
                const isSelected = skillsSelected.includes(sk);
                return (
                  <button
                    key={sk}
                    onClick={() => toggleSkill(sk)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-500/20 text-brand-200 border-brand-500/40 shadow-sm'
                        : 'bg-surface-200/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-brand-400" />}
                    <span>{sk}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom skill adder */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                placeholder="Add other skill (e.g. Pandas, Redis, Next.js)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={addCustomSkill}
                className="px-4 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-white/10 text-xs text-slate-200"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Learning Style */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 5</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                What is your preferred learning style?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                The AI Companion customizes its code explanations and visual diagrams accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: 'Interactive Code-First', title: 'Interactive Code-First', desc: 'Dive directly into executable code snippets and immediate hands-on labs.' },
                { id: 'Visual & Project-Based', title: 'Visual & Project-Based', desc: 'Mental models, flowcharts, architecture diagrams, and real-world apps.' },
                { id: 'Theoretical & Deep-Dive', title: 'Theoretical & Deep-Dive', desc: 'First principles, mathematical proofs, time complexity invariants.' },
                { id: 'Fast-Paced Crash Course', title: 'Fast-Paced Crash Course', desc: 'High-density summaries focused on interview patterns and quick recall.' },
              ].map((style) => {
                const isSelected = learningStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setLearningStyle(style.id as LearningStyle)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-white shadow-glow'
                        : 'bg-surface-200/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm font-semibold text-white">{style.title}</div>
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{style.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Available Study Time */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 6</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                How many hours can you study weekly?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Used to schedule reasonable daily milestones without burnout.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center py-6 bg-surface-200/50 rounded-2xl border border-white/5">
                <span className="text-5xl font-bold font-mono text-cyan-400">{weeklyHours}</span>
                <span className="text-slate-400 text-sm ml-2">hours / week</span>
                <div className="text-xs text-slate-500 mt-1">
                  ~{(weeklyHours / 7).toFixed(1)} hours per day
                </div>
              </div>

              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>4 hrs (Casual)</span>
                <span>12-16 hrs (Recommended)</span>
                <span>40 hrs (Full-time Bootcamp)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Upload Study Material */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-mono text-brand-400 font-semibold">Step 7</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Upload your study material or syllabus
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Attach a PDF, DOCX, TXT syllabus or sample lecture notes. AI will extract concepts and prerequisite gaps.
              </p>
            </div>

            <div className="border-2 border-dashed border-white/10 hover:border-brand-500/40 rounded-2xl p-8 text-center transition-colors bg-surface-200/30">
              <UploadCloud className="w-10 h-10 text-brand-400 mx-auto mb-3" />
              <div className="text-sm font-semibold text-white">
                Drag and drop your study files here
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, TXT notes (Pre-loaded with sample Algorithms syllabus)
              </div>

              <label className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 cursor-pointer transition-colors">
                Browse Files
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedFileName && (
                <div className="mt-4 p-3 rounded-xl bg-surface-200 border border-white/10 flex items-center justify-between text-xs text-left">
                  <div className="flex items-center gap-2 text-white">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>{uploadedFileName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Ready to analyze
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-glow transition-all flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-7 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 text-white shadow-glow hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Learning Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
