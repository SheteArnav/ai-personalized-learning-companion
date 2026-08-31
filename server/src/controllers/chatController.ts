import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { aiService } from '../services/aiService.js';
import { ChatMessage } from '../types/index.js';

export const getChatHistory = (req: Request, res: Response) => {
  try {
    const history = db.getChatHistory();
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, actionType, relatedTopic } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const userMsg: ChatMessage = {
      id: `msg_usr_${Date.now()}`,
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      metadata: { actionType, relatedTopic },
    };

    db.addChatMessage(userMsg);

    const profile = db.getProfile();
    const skills = db.getSkills();
    const weakSkills = skills.filter((s) => s.status === 'Critical Gap').map((s) => s.name);

    // Call AI Service (Gemini/OpenAI or Demo Mock Engine)
    const replyText = await aiService.generateText(message, {
      careerGoal: profile.careerGoal,
      experienceLevel: profile.experienceLevel,
      topic: relatedTopic,
      weaknesses: weakSkills,
      systemInstruction: `You are Synapse, an empathetic, hyper-competent AI learning companion and career mentor for an aspiring ${profile.careerGoal}. Provide actionable, clear, encouraging guidance with code examples or intuitive mental models.`,
    });

    const assistantMsg: ChatMessage = {
      id: `msg_ai_${Date.now()}`,
      sender: 'assistant',
      content: replyText,
      timestamp: new Date().toISOString(),
      metadata: { actionType, relatedTopic },
    };

    db.addChatMessage(assistantMsg);

    res.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      aiStatus: aiService.getStatus(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearChat = (req: Request, res: Response) => {
  try {
    db.clearChatHistory();
    res.json({ message: 'Chat history cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
