import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { aiService } from '../services/aiService.js';

export const getAnalytics = (req: Request, res: Response) => {
  try {
    const analytics = db.getAnalytics();
    const profile = db.getProfile();
    const skills = db.getSkills();

    // Dynamically update skill radar from live skills
    const skillRadar = skills.map((s) => ({
      skill: s.name.length > 15 ? s.name.slice(0, 14) + '..' : s.name,
      current: s.currentLevel,
      target: s.targetLevel,
      fullMark: 100,
    }));

    res.json({
      analytics: {
        ...analytics,
        skillRadar,
      },
      profile,
      skills,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAIConfig = (req: Request, res: Response) => {
  try {
    const { provider, apiKey } = req.body;
    aiService.setProvider(provider, apiKey);
    res.json({
      status: aiService.getStatus(),
      message: `AI Provider updated to ${provider}.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAIStatus = (req: Request, res: Response) => {
  try {
    res.json({ status: aiService.getStatus() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
