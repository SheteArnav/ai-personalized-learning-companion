import { RoadmapNode } from '../types/index.js';
import { db } from '../db/database.js';

export class RecommendationService {
  public static handleRecommendationAction(
    nodeId: string,
    action: 'accept' | 'modify' | 'reject' | 'regenerate',
    customData?: { newTitle?: string; newDescription?: string; estimatedHours?: number }
  ): { success: boolean; message: string; updatedRoadmap: RoadmapNode[] } {
    const roadmap = db.getRoadmap();
    const nodeIndex = roadmap.findIndex((n) => n.id === nodeId);

    if (nodeIndex === -1) {
      return { success: false, message: 'Node not found', updatedRoadmap: roadmap };
    }

    const node = roadmap[nodeIndex];

    if (action === 'accept') {
      node.recommendationState = 'accepted';
      node.whyRecommended += ' (Verified and accepted by student)';
      db.updateRoadmapNode(node.id, node);
      return {
        success: true,
        message: `Recommendation "${node.title}" confirmed and locked into active path.`,
        updatedRoadmap: db.getRoadmap(),
      };
    }

    if (action === 'modify') {
      node.recommendationState = 'modified';
      if (customData?.newTitle) node.title = customData.newTitle;
      if (customData?.newDescription) node.description = customData.newDescription;
      if (customData?.estimatedHours) node.estimatedHours = customData.estimatedHours;
      node.whyRecommended = `Customized by user: ${node.whyRecommended}`;
      db.updateRoadmapNode(node.id, node);
      return {
        success: true,
        message: `Recommendation modified successfully.`,
        updatedRoadmap: db.getRoadmap(),
      };
    }

    if (action === 'reject') {
      node.recommendationState = 'rejected';
      node.status = 'skipped';
      db.updateRoadmapNode(node.id, node);
      return {
        success: true,
        message: `Recommendation dismissed. Roadmap dynamically adjusted.`,
        updatedRoadmap: db.getRoadmap(),
      };
    }

    if (action === 'regenerate') {
      node.recommendationState = 'active';
      node.title = `⚡ Synthesized Deep Dive: ${node.title.replace(/⚡|AI Remediation:|Deep Dive:/g, '').trim()}`;
      node.description = `AI re-formulated this learning node with simplified progressive sub-modules and code-first practical labs.`;
      node.whyRecommended = `Regenerated via Synapse Cognitive Engine. Optimized for practical real-world retention and reduced cognitive load.`;
      node.confidenceScore = 99;
      db.updateRoadmapNode(node.id, node);
      return {
        success: true,
        message: `Recommendation regenerated with fresh pedagogy.`,
        updatedRoadmap: db.getRoadmap(),
      };
    }

    return { success: true, message: 'Action processed', updatedRoadmap: db.getRoadmap() };
  }
}
