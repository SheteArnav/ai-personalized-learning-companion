import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { QuizService } from '../services/quizService.js';
import { QuizQuestion } from '../types/index.js';

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { topic, difficulty } = req.body;
    const resolvedTopic = topic || 'Binary Trees & Traversals';
    const resolvedDifficulty = difficulty || 'Intermediate';

    const questions: QuizQuestion[] = await QuizService.getQuizForTopic(resolvedTopic, resolvedDifficulty);
    db.saveQuizQuestions(resolvedTopic, questions);

    res.json({
      quizId: `quiz_${Date.now()}`,
      topic: resolvedTopic,
      difficulty: resolvedDifficulty,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, topic, answers } = req.body;

    const resolvedTopic = topic || 'Binary Trees & Traversals';
    let storedQuestions = db.getQuizQuestions(resolvedTopic);

    if (!storedQuestions) {
      storedQuestions = await QuizService.getQuizForTopic(resolvedTopic);
    }

    const result = QuizService.evaluateQuiz({ quizId, topic: resolvedTopic, answers }, storedQuestions);

    res.json({
      result,
      updatedRoadmap: db.getRoadmap(),
      updatedSkills: db.getSkills(),
      updatedAnalytics: db.getAnalytics(),
      message: result.roadmapAdaptationTriggered
        ? 'Quiz graded. AI detected learning gaps and automatically updated your roadmap.'
        : 'Quiz completed with mastery! Roadmap updated.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
