import { Router } from 'express';
import { getProfile, updateProfile, handleOnboarding, resetData } from '../controllers/profileController.js';
import { getRoadmap, updateRoadmapNode, addRoadmapNode, handleRecommendationAction } from '../controllers/roadmapController.js';
import { getChatHistory, sendMessage, clearChat } from '../controllers/chatController.js';
import { generateQuiz, submitQuiz } from '../controllers/quizController.js';
import { getDocuments, analyzeTextDocument, mergeDocumentToRoadmap } from '../controllers/documentController.js';
import { getAnalytics, updateAIConfig, getAIStatus } from '../controllers/analyticsController.js';

const router = Router();

// Health & System
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'Synapse AI Engine v1.0' });
});

// Profile & Onboarding
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/onboarding', handleOnboarding);
router.post('/reset', resetData);

// Roadmap
router.get('/roadmap', getRoadmap);
router.patch('/roadmap/nodes/:id', updateRoadmapNode);
router.post('/roadmap/nodes', addRoadmapNode);
router.post('/recommendations/action', handleRecommendationAction);

// Chat & AI Companion
router.get('/chat', getChatHistory);
router.post('/chat', sendMessage);
router.delete('/chat', clearChat);

// Quiz System
router.post('/quiz/generate', generateQuiz);
router.post('/quiz/submit', submitQuiz);

// Document Analysis
router.get('/documents', getDocuments);
router.post('/documents/analyze', analyzeTextDocument);
router.post('/documents/:docId/merge', mergeDocumentToRoadmap);

// Analytics & Config
router.get('/analytics', getAnalytics);
router.get('/config/ai', getAIStatus);
router.post('/config/ai', updateAIConfig);

export default router;
