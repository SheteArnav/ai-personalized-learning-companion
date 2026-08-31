import { 
  UserProfile, 
  SkillItem, 
  RoadmapNode, 
  AnalyzedDocument, 
  AnalyticsData, 
  ChatMessage, 
  QuizQuestion, 
  QuizResult 
} from '../types/index.js';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Profile & Onboarding
  getProfile: () => request<{ profile: UserProfile; skills: SkillItem[] }>('/profile'),
  updateProfile: (updates: Partial<UserProfile>) =>
    request<{ profile: UserProfile; message: string }>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  submitOnboarding: (data: any) =>
    request<{ profile: UserProfile; skills: SkillItem[]; roadmap: RoadmapNode[]; message: string }>('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resetData: () =>
    request<{ profile: UserProfile; skills: SkillItem[]; roadmap: RoadmapNode[]; message: string }>('/reset', {
      method: 'POST',
    }),

  // Roadmap
  getRoadmap: () => request<{ roadmap: RoadmapNode[] }>('/roadmap'),
  updateRoadmapNode: (id: string, updates: Partial<RoadmapNode>) =>
    request<{ node: RoadmapNode; roadmap: RoadmapNode[] }>(`/roadmap/nodes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  addRoadmapNode: (nodeData: Partial<RoadmapNode>) =>
    request<{ node: RoadmapNode; roadmap: RoadmapNode[]; message: string }>('/roadmap/nodes', {
      method: 'POST',
      body: JSON.stringify(nodeData),
    }),
  handleRecommendationAction: (
    nodeId: string,
    action: 'accept' | 'modify' | 'reject' | 'regenerate',
    customData?: { newTitle?: string; newDescription?: string; estimatedHours?: number }
  ) =>
    request<{ success: boolean; message: string; updatedRoadmap: RoadmapNode[] }>('/recommendations/action', {
      method: 'POST',
      body: JSON.stringify({ nodeId, action, customData }),
    }),

  // Chat / AI Tutor
  getChatHistory: () => request<{ history: ChatMessage[] }>('/chat'),
  sendMessage: (message: string, actionType?: string, relatedTopic?: string) =>
    request<{ userMessage: ChatMessage; assistantMessage: ChatMessage; aiStatus: any }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, actionType, relatedTopic }),
    }),
  clearChat: () => request<{ message: string }>('/chat', { method: 'DELETE' }),

  // Quiz
  generateQuiz: (topic?: string, difficulty?: string) =>
    request<{ quizId: string; topic: string; difficulty: string; questions: QuizQuestion[] }>('/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty }),
    }),
  submitQuiz: (quizId: string, topic: string, answers: { questionId: string; selectedAnswer: string }[]) =>
    request<{
      result: QuizResult;
      updatedRoadmap: RoadmapNode[];
      updatedSkills: SkillItem[];
      updatedAnalytics: AnalyticsData;
      message: string;
    }>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ quizId, topic, answers }),
    }),

  // Documents
  getDocuments: () => request<{ documents: AnalyzedDocument[] }>('/documents'),
  analyzeDocumentText: (filename: string, rawText: string, fileSize?: number) =>
    request<{ document: AnalyzedDocument; allDocuments: AnalyzedDocument[]; message: string }>('/documents/analyze', {
      method: 'POST',
      body: JSON.stringify({ filename, rawText, fileSize }),
    }),
  mergeDocumentToRoadmap: (docId: string) =>
    request<{ roadmap: RoadmapNode[]; message: string }>(`/documents/${docId}/merge`, {
      method: 'POST',
    }),

  // Analytics & AI Config
  getAnalytics: () => request<{ analytics: AnalyticsData; profile: UserProfile; skills: SkillItem[] }>('/analytics'),
  getAIStatus: () => request<{ status: { provider: string; hasApiKey: boolean; isDemoMode: boolean } }>('/config/ai'),
  updateAIConfig: (provider: string, apiKey?: string) =>
    request<{ status: any; message: string }>('/config/ai', {
      method: 'POST',
      body: JSON.stringify({ provider, apiKey }),
    }),
};
