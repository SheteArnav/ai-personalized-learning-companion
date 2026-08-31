export type CareerGoalType = 
  | 'Software Engineer'
  | 'AI / Machine Learning Engineer'
  | 'Data Scientist'
  | 'Cybersecurity Analyst'
  | 'Full Stack Web Developer'
  | 'Cloud & DevOps Architect';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LearningStyle = 'Visual & Project-Based' | 'Theoretical & Deep-Dive' | 'Interactive Code-First' | 'Fast-Paced Crash Course';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  careerGoal: CareerGoalType;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  learningStyle: LearningStyle;
  streakDays: number;
  overallScore: number;
  completedTopicsCount: number;
  totalStudyHours: number;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  status: 'Critical Gap' | 'In Progress' | 'Proficient' | 'Mastered';
  gapReason: string;
}

export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped';

export interface RoadmapNode {
  id: string;
  title: string;
  stage: 'Foundations' | 'Core Engineering' | 'Advanced Algorithms' | 'Real-World Projects' | 'Specialization' | 'Interview & Job Ready';
  description: string;
  estimatedHours: number;
  status: NodeStatus;
  orderIndex: number;
  prerequisites: string[];
  skillsCovered: string[];
  whyRecommended: string;
  confidenceScore: number;
  adaptedFromQuiz?: boolean;
  adaptationReason?: string;
  recommendationState: 'active' | 'accepted' | 'modified' | 'rejected';
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizResult {
  quizId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  strongAreas: string[];
  weakAreas: string[];
  recommendedAction: string;
  feedbackSummary: string;
  roadmapAdaptationTriggered: boolean;
  adaptationSummary?: string;
}

export interface AnalyzedDocument {
  id: string;
  filename: string;
  uploadedAt: string;
  fileSize: number;
  textSnippet: string;
  conceptsExtracted: string[];
  prerequisiteGaps: string[];
  masteredConceptsFound: string[];
  relevanceScore: number;
  recommendedNodesToInject: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    actionType?: 'explain' | 'example' | 'quiz_prep' | 'debug' | 'gap_analysis';
    relatedTopic?: string;
  };
}

export interface AnalyticsData {
  weeklyActivity: { day: string; hours: number; target: number }[];
  skillRadar: { skill: string; current: number; target: number; fullMark: number }[];
  quizPerformance: { date: string; topic: string; score: number }[];
  aiInsights: {
    id: string;
    type: 'positive' | 'warning' | 'recommendation';
    title: string;
    message: string;
    actionLabel?: string;
    actionTarget?: string;
  }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
