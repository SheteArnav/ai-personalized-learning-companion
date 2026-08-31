import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  SkillItem, 
  RoadmapNode, 
  AnalyzedDocument, 
  AnalyticsData, 
  ChatMessage, 
  ToastMessage 
} from '../types/index.js';
import { api } from '../api/client.js';

export type AppTab = 'landing' | 'onboarding' | 'dashboard' | 'roadmap' | 'tutor' | 'documents' | 'quiz' | 'analytics' | 'settings';

interface LearningContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  profile: UserProfile | null;
  skills: SkillItem[];
  roadmap: RoadmapNode[];
  documents: AnalyzedDocument[];
  analytics: AnalyticsData | null;
  chatHistory: ChatMessage[];
  aiStatus: { provider: string; hasApiKey: boolean; isDemoMode: boolean };
  isLoading: boolean;
  toasts: ToastMessage[];
  quizTargetTopic: string | null;
  setQuizTargetTopic: (topic: string | null) => void;
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  updateRoadmapNodeStatus: (nodeId: string, status: RoadmapNode['status']) => Promise<void>;
  handleRecommendationAction: (
    nodeId: string,
    action: 'accept' | 'modify' | 'reject' | 'regenerate',
    customData?: { newTitle?: string; newDescription?: string; estimatedHours?: number }
  ) => Promise<void>;
  startQuizForTopic: (topic: string) => void;
  startTutorWithTopic: (topic: string, prompt?: string) => void;
  prefillTutorPrompt: string | null;
  setPrefillTutorPrompt: (p: string | null) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>([]);
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiStatus, setAIStatus] = useState({ provider: 'demo', hasApiKey: false, isDemoMode: true });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quizTargetTopic, setQuizTargetTopic] = useState<string | null>(null);
  const [prefillTutorPrompt, setPrefillTutorPrompt] = useState<string | null>(null);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, roadmapRes, docsRes, analyticsRes, chatRes, aiRes] = await Promise.allSettled([
        api.getProfile(),
        api.getRoadmap(),
        api.getDocuments(),
        api.getAnalytics(),
        api.getChatHistory(),
        api.getAIStatus(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.profile);
        setSkills(profileRes.value.skills);
      }
      if (roadmapRes.status === 'fulfilled') {
        setRoadmap(roadmapRes.value.roadmap);
      }
      if (docsRes.status === 'fulfilled') {
        setDocuments(docsRes.value.documents);
      }
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.analytics);
      }
      if (chatRes.status === 'fulfilled') {
        setChatHistory(chatRes.value.history);
      }
      if (aiRes.status === 'fulfilled') {
        setAIStatus(aiRes.value.status);
      }
    } catch (err) {
      console.error('Error refreshing learning data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateRoadmapNodeStatus = async (nodeId: string, status: RoadmapNode['status']) => {
    try {
      const res = await api.updateRoadmapNode(nodeId, { status });
      setRoadmap(res.roadmap);
      addToast('success', 'Status Updated', `Milestone marked as ${status.replace('_', ' ')}.`);
      // Refresh analytics in background
      api.getAnalytics().then((a) => {
        setAnalytics(a.analytics);
        if (a.profile) setProfile(a.profile);
      });
    } catch (error: any) {
      addToast('error', 'Update Failed', error.message || 'Could not update node status.');
    }
  };

  const handleRecommendationAction = async (
    nodeId: string,
    action: 'accept' | 'modify' | 'reject' | 'regenerate',
    customData?: { newTitle?: string; newDescription?: string; estimatedHours?: number }
  ) => {
    try {
      const res = await api.handleRecommendationAction(nodeId, action, customData);
      setRoadmap(res.updatedRoadmap);
      addToast('info', 'Recommendation Updated', res.message);
    } catch (error: any) {
      addToast('error', 'Action Failed', error.message || 'Failed to update recommendation.');
    }
  };

  const startQuizForTopic = (topic: string) => {
    setQuizTargetTopic(topic);
    setActiveTab('quiz');
  };

  const startTutorWithTopic = (topic: string, prompt?: string) => {
    if (prompt) {
      setPrefillTutorPrompt(prompt);
    } else {
      setPrefillTutorPrompt(`Please explain "${topic}" in depth with a real-world engineering analogy.`);
    }
    setActiveTab('tutor');
  };

  return (
    <LearningContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        skills,
        roadmap,
        documents,
        analytics,
        chatHistory,
        aiStatus,
        isLoading,
        toasts,
        quizTargetTopic,
        setQuizTargetTopic,
        addToast,
        removeToast,
        refreshData,
        updateRoadmapNodeStatus,
        handleRecommendationAction,
        startQuizForTopic,
        startTutorWithTopic,
        prefillTutorPrompt,
        setPrefillTutorPrompt,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
