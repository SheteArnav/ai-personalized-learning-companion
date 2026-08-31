import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { RecommendationService } from '../services/recommendationService.js';
import { RoadmapNode } from '../types/index.js';

export const getRoadmap = (req: Request, res: Response) => {
  try {
    const roadmap = db.getRoadmap();
    res.json({ roadmap });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoadmapNode = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateRoadmapNode(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Roadmap node not found' });
    }

    // If node was marked completed, update user stats
    if (updates.status === 'completed') {
      const profile = db.getProfile();
      db.updateProfile({
        completedTopicsCount: profile.completedTopicsCount + 1,
        totalStudyHours: profile.totalStudyHours + (updated.estimatedHours || 2),
        overallScore: Math.min(100, profile.overallScore + 2),
      });
    }

    res.json({ node: updated, roadmap: db.getRoadmap() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addRoadmapNode = (req: Request, res: Response) => {
  try {
    const { title, stage, description, estimatedHours, prerequisites, skillsCovered } = req.body;
    const currentRoadmap = db.getRoadmap();

    const newNode: RoadmapNode = {
      id: `node_custom_${Date.now()}`,
      title: title || 'Custom Learning Topic',
      stage: stage || 'Specialization',
      description: description || 'User-defined study focus module.',
      estimatedHours: Number(estimatedHours) || 3,
      status: 'available',
      orderIndex: currentRoadmap.length + 1,
      prerequisites: prerequisites || ['Foundations'],
      skillsCovered: skillsCovered || ['Specialized Domain'],
      whyRecommended: 'Manually added by student to align with bespoke project or career focus.',
      confidenceScore: 100,
      recommendationState: 'accepted',
    };

    db.addRoadmapNode(newNode);
    res.json({ node: newNode, roadmap: db.getRoadmap(), message: 'Topic added to roadmap.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleRecommendationAction = (req: Request, res: Response) => {
  try {
    const { nodeId, action, customData } = req.body;
    const result = RecommendationService.handleRecommendationAction(nodeId, action, customData);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
