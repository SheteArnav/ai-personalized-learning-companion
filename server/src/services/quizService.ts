import { QuizQuestion, QuizSubmission, QuizResult } from '../types/index.js';
import { db } from '../db/database.js';
import { LearningPathService } from './learningPathService.js';
import { QUESTION_BANK, CategorizedQuestion } from '../db/questionBank.js';
import { aiService } from './aiService.js';

export function isAnswerCorrect(userAnswer?: string, correctAnswer?: string): boolean {
  if (!userAnswer || !correctAnswer) return false;
  const cleanUser = userAnswer.trim().toLowerCase().replace(/^["']|["']$/g, '');
  const cleanCorrect = correctAnswer.trim().toLowerCase().replace(/^["']|["']$/g, '');
  return cleanUser === cleanCorrect;
}

export class QuizService {
  public static isAnswerCorrect = isAnswerCorrect;

  // Track recent questions to avoid immediate repetition across consecutive attempts
  private static recentQuestionIds: Record<string, string[]> = {};

  /**
   * Intelligently resolves category from user-provided topic string
   */
  public static resolveCategory(topic: string): CategorizedQuestion['category'] {
    const t = topic.toLowerCase();

    if (t.includes('python') || t.includes('oop') || t.includes('function') || t.includes('closure') || t.includes('metaclass') || t.includes('gil')) {
      return 'python';
    }
    if (t.includes('sql') || t.includes('database') || t.includes('schema') || t.includes('query') || t.includes('index') || t.includes('join') || t.includes('normalization') || t.includes('acid') || t.includes('postgres')) {
      return 'sql';
    }
    if (t.includes('machine learning') || t.includes('ml') || t.includes('ai') || t.includes('pytorch') || t.includes('transformer') || t.includes('rag') || t.includes('deep learning') || t.includes('neural') || t.includes('tensor') || t.includes('llm')) {
      return 'machine_learning';
    }
    if (t.includes('system design') || t.includes('microservice') || t.includes('scale') || t.includes('cache') || t.includes('redis') || t.includes('kafka') || t.includes('load balancer') || t.includes('distributed')) {
      return 'system_design';
    }
    if (t.includes('security') || t.includes('auth') || t.includes('jwt') || t.includes('owasp') || t.includes('crypto')) {
      return 'cybersecurity';
    }
    if (t.includes('tree') || t.includes('binary') || t.includes('heap') || t.includes('linked list') || t.includes('stack') || t.includes('queue') || t.includes('hash') || t.includes('linear')) {
      return 'data_structures';
    }
    if (t.includes('algo') || t.includes('graph') || t.includes('dijkstra') || t.includes('bfs') || t.includes('dfs') || t.includes('dynamic programming') || t.includes('sort') || t.includes('recursion')) {
      return 'algorithms';
    }

    return 'data_structures';
  }

  /**
   * Generates or selects questions strictly matching requested topic and difficulty
   */
  public static async getQuizForTopic(
    topic: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate',
    count: number = 5
  ): Promise<QuizQuestion[]> {
    const category = QuizService.resolveCategory(topic);

    // If real AI is active and not in demo mode, attempt structured LLM quiz generation first
    if (!aiService.getStatus().isDemoMode) {
      try {
        const aiQuestions = await QuizService.generateQuestionsViaAI(topic, difficulty, count);
        if (aiQuestions && aiQuestions.length >= 3) {
          return aiQuestions;
        }
      } catch (err) {
        console.warn('[QuizService] AI question generation fallback to Question Bank:', err);
      }
    }

    // Filter question bank by resolved category
    const categoryQuestions = QUESTION_BANK.filter((q) => q.category === category);

    // Filter by exact requested difficulty
    const exactDifficultyQuestions = categoryQuestions.filter((q) => q.difficulty === difficulty);

    // Non-exact questions in same category as fallback pool
    const otherDifficultyQuestions = categoryQuestions.filter((q) => q.difficulty !== difficulty);

    const historyKey = `${category}_${difficulty}`;
    const recentIds = QuizService.recentQuestionIds[historyKey] || [];

    // Prioritize unserved questions from exact difficulty to prevent repetition
    const unservedExact = exactDifficultyQuestions.filter((q) => !recentIds.includes(q.id));
    const servedExact = exactDifficultyQuestions.filter((q) => recentIds.includes(q.id));

    // Shuffle helper (Fisher-Yates)
    const shuffle = <T>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const prioritizedPool = [
      ...shuffle(unservedExact),
      ...shuffle(servedExact),
      ...shuffle(otherDifficultyQuestions),
    ];

    // Select distinct questions up to count
    const selected: QuizQuestion[] = [];
    const seenIds = new Set<string>();

    for (const q of prioritizedPool) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        selected.push({
          id: q.id,
          type: q.type,
          topic: q.topic,
          difficulty: q.difficulty,
          question: q.question,
          options: q.options ? shuffle(q.options) : undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        });
        if (selected.length >= count) break;
      }
    }

    // Update repetition history
    QuizService.recentQuestionIds[historyKey] = selected.map((q) => q.id);

    return selected;
  }

  /**
   * Generates dynamic quiz questions with Google Gemini or OpenAI when available
   */
  private static async generateQuestionsViaAI(
    topic: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    count: number
  ): Promise<QuizQuestion[] | null> {
    const prompt = `Generate exactly ${count} multiple-choice or true/false technical quiz questions for topic "${topic}" at ${difficulty} difficulty level.
Respond ONLY with a valid JSON array of objects with the following schema:
[
  {
    "id": "ai_q_1",
    "type": "multiple_choice",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "question": "Clear technical question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact matching option text",
    "explanation": "Clear explanation of why this answer is correct and key engineering rationale"
  }
]`;

    const rawResponse = await aiService.generateText(prompt, {
      topic,
      experienceLevel: difficulty,
      systemInstruction: 'You are an elite technical assessment engine. Always output pure valid JSON without markdown fences if possible.',
    });

    try {
      const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any, idx: number) => ({
          id: `ai_${difficulty.toLowerCase()}_${Date.now()}_${idx}`,
          type: item.type || 'multiple_choice',
          topic: item.topic || topic,
          difficulty: (item.difficulty as any) || difficulty,
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
        }));
      }
    } catch (e) {
      console.warn('[QuizService] Failed to parse AI JSON:', e);
    }

    return null;
  }

  /**
   * Grades a quiz submission using the unified source-of-truth isAnswerCorrect evaluator
   */
  public static evaluateQuiz(submission: QuizSubmission, questions: QuizQuestion[]): QuizResult {
    let correctCount = 0;
    const strongAreas: string[] = [];
    const weakAreas: string[] = [];

    const answerMap = new Map(submission.answers.map((a) => [a.questionId, a.selectedAnswer]));

    questions.forEach((q) => {
      const userAnswer = answerMap.get(q.id);
      const isCorrect = isAnswerCorrect(userAnswer, q.correctAnswer);

      if (isCorrect) {
        correctCount++;
        if (!strongAreas.includes(q.topic)) strongAreas.push(q.topic);
      } else {
        if (!weakAreas.includes(q.topic)) weakAreas.push(q.topic);
      }
    });

    const score = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = score >= 75;

    let recommendedAction = '';
    let adaptationTriggered = false;
    let adaptationSummary: string | undefined = undefined;

    if (!passed && weakAreas.length > 0) {
      adaptationTriggered = true;
      const primaryWeakness = weakAreas[0];
      const adaptResult = LearningPathService.adaptRoadmapAfterQuizFailure(
        primaryWeakness,
        score,
        `Student answered ${correctCount}/${questions.length} questions correctly.`
      );
      adaptationSummary = adaptResult.adaptationSummary;
      recommendedAction = `Review the newly inserted remediation node for "${primaryWeakness}" before proceeding to advanced milestones.`;
    } else {
      recommendedAction = `Great mastery demonstrated (${score}%)! You are clear to proceed to the next roadmap milestone.`;
    }

    const feedbackSummary = passed
      ? `Outstanding performance! You showed strong mastery across ${strongAreas.join(', ')}.`
      : `Diagnostic threshold unmet (${score}%). Knowledge gaps detected in: ${weakAreas.join(', ')}.`;

    // Record quiz attempt in analytics
    const analytics = db.getAnalytics();
    analytics.quizPerformance.push({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      topic: submission.topic,
      score,
    });
    db.updateAnalytics(analytics);

    return {
      quizId: submission.quizId,
      topic: submission.topic,
      score,
      totalQuestions: questions.length,
      correctCount,
      strongAreas,
      weakAreas,
      recommendedAction,
      feedbackSummary,
      roadmapAdaptationTriggered: adaptationTriggered,
      adaptationSummary,
    };
  }
}
