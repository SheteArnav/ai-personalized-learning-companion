import { 
  UserProfile, 
  SkillItem, 
  RoadmapNode, 
  AnalyzedDocument, 
  AnalyticsData, 
  ChatMessage, 
  QuizQuestion,
  CareerGoalType 
} from '../types/index.js';
import { 
  DEFAULT_USER_PROFILE, 
  DEFAULT_SKILLS, 
  DEFAULT_ROADMAP_NODES, 
  DEFAULT_DOCUMENTS, 
  DEFAULT_ANALYTICS 
} from './seeds.js';

interface DatabaseState {
  profile: UserProfile;
  skills: SkillItem[];
  roadmap: RoadmapNode[];
  documents: AnalyzedDocument[];
  analytics: AnalyticsData;
  chatHistory: ChatMessage[];
  quizzes: Record<string, QuizQuestion[]>;
}

class InDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): DatabaseState {
    return {
      profile: JSON.parse(JSON.stringify(DEFAULT_USER_PROFILE)),
      skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)),
      roadmap: JSON.parse(JSON.stringify(DEFAULT_ROADMAP_NODES)),
      documents: JSON.parse(JSON.stringify(DEFAULT_DOCUMENTS)),
      analytics: JSON.parse(JSON.stringify(DEFAULT_ANALYTICS)),
      chatHistory: [
        {
          id: 'msg_welcome',
          sender: 'assistant',
          content: 'Hello Alex! I am **Synapse**, your AI learning companion. I have reviewed your target goal (**Software Engineer**) and identified that mastering *Binary Trees* and *SQL Optimization* will accelerate your readiness by 40%. What would you like to explore or practice today?',
          timestamp: new Date().toISOString(),
        },
      ],
      quizzes: {},
    };
  }

  public resetToSeeds(): void {
    this.state = this.getInitialState();
  }

  // Profile Methods
  public getProfile(): UserProfile {
    return this.state.profile;
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.state.profile = { ...this.state.profile, ...updates };
    return this.state.profile;
  }

  // Skills Methods
  public getSkills(): SkillItem[] {
    return this.state.skills;
  }

  public updateSkill(skillId: string, updates: Partial<SkillItem>): SkillItem | null {
    const index = this.state.skills.findIndex((s) => s.id === skillId);
    if (index === -1) return null;
    this.state.skills[index] = { ...this.state.skills[index], ...updates };
    return this.state.skills[index];
  }

  public setSkills(skills: SkillItem[]): void {
    this.state.skills = skills;
  }

  // Roadmap Methods
  public getRoadmap(): RoadmapNode[] {
    return this.state.roadmap;
  }

  public setRoadmap(nodes: RoadmapNode[]): void {
    this.state.roadmap = nodes;
  }

  public updateRoadmapNode(nodeId: string, updates: Partial<RoadmapNode>): RoadmapNode | null {
    const index = this.state.roadmap.findIndex((n) => n.id === nodeId);
    if (index === -1) return null;
    this.state.roadmap[index] = { ...this.state.roadmap[index], ...updates };
    return this.state.roadmap[index];
  }

  public addRoadmapNode(node: RoadmapNode): RoadmapNode {
    this.state.roadmap.push(node);
    this.state.roadmap.sort((a, b) => a.orderIndex - b.orderIndex);
    return node;
  }

  // Documents Methods
  public getDocuments(): AnalyzedDocument[] {
    return this.state.documents;
  }

  public addDocument(doc: AnalyzedDocument): AnalyzedDocument {
    this.state.documents.unshift(doc);
    return doc;
  }

  // Chat Methods
  public getChatHistory(): ChatMessage[] {
    return this.state.chatHistory;
  }

  public addChatMessage(msg: ChatMessage): ChatMessage {
    this.state.chatHistory.push(msg);
    return msg;
  }

  public clearChatHistory(): void {
    this.state.chatHistory = [];
  }

  // Analytics Methods
  public getAnalytics(): AnalyticsData {
    return this.state.analytics;
  }

  public updateAnalytics(updates: Partial<AnalyticsData>): AnalyticsData {
    this.state.analytics = { ...this.state.analytics, ...updates };
    return this.state.analytics;
  }

  // Quizzes
  public saveQuizQuestions(topic: string, questions: QuizQuestion[]): void {
    this.state.quizzes[topic] = questions;
  }

  public getQuizQuestions(topic: string): QuizQuestion[] | null {
    return this.state.quizzes[topic] || null;
  }
}

export const db = new InDatabase();
