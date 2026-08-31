import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { LearningPathService } from '../services/learningPathService.js';
import { CareerGoalType, ExperienceLevel, LearningStyle } from '../types/index.js';

export const getProfile = (req: Request, res: Response) => {
  try {
    const profile = db.getProfile();
    const skills = db.getSkills();
    res.json({ profile, skills });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const profile = db.updateProfile(updates);
    res.json({ profile, message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleOnboarding = (req: Request, res: Response) => {
  try {
    const { name, careerGoal, experienceLevel, skills, learningStyle, weeklyHours } = req.body;

    const updatedProfile = db.updateProfile({
      name: name || 'Learner',
      careerGoal: (careerGoal as CareerGoalType) || 'Software Engineer',
      experienceLevel: (experienceLevel as ExperienceLevel) || 'Intermediate',
      learningStyle: (learningStyle as LearningStyle) || 'Interactive Code-First',
      weeklyHours: Number(weeklyHours) || 10,
    });

    const generated = LearningPathService.generateRoadmapForGoal(
      updatedProfile.careerGoal,
      updatedProfile.experienceLevel,
      updatedProfile.learningStyle
    );

    db.setRoadmap(generated.roadmap);
    db.setSkills(generated.skills);

    res.json({
      profile: updatedProfile,
      skills: generated.skills,
      roadmap: generated.roadmap,
      message: 'Onboarding completed and personalized roadmap created.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const resetData = (req: Request, res: Response) => {
  try {
    db.resetToSeeds();
    res.json({
      profile: db.getProfile(),
      skills: db.getSkills(),
      roadmap: db.getRoadmap(),
      message: 'Data successfully restored to demo baseline.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
