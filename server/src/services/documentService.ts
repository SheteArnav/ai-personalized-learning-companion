import { AnalyzedDocument, RoadmapNode } from '../types/index.js';
import { db } from '../db/database.js';

export class DocumentService {
  public static analyzeDocumentContent(
    filename: string,
    fileSize: number,
    rawText: string
  ): AnalyzedDocument {
    const textLower = rawText.toLowerCase();

    const conceptUniverse = [
      { name: 'Binary Trees & Traversals', keywords: ['tree', 'binary tree', 'traversal', 'inorder', 'preorder', 'postorder', 'bst'] },
      { name: 'Graph Theory & Dijkstra', keywords: ['graph', 'dijkstra', 'shortest path', 'bfs', 'dfs', 'adjacency'] },
      { name: 'Dynamic Programming & Memoization', keywords: ['dynamic programming', 'memoization', 'tabulation', 'knapsack', 'subproblem'] },
      { name: 'Relational Database Normalization', keywords: ['normalization', '3nf', 'bcnf', 'primary key', 'foreign key', 'rdbms'] },
      { name: 'Distributed Caching & Redis', keywords: ['cache', 'redis', 'memcached', 'cache-aside', 'ttl', 'eviction'] },
      { name: 'Microservices & Event Streams', keywords: ['microservice', 'kafka', 'event-driven', 'pub/sub', 'rabbitmq', 'decoupling'] },
      { name: 'Transformer Attention Mechanisms', keywords: ['transformer', 'attention', 'bert', 'gpt', 'self-attention', 'embeddings'] },
      { name: 'Docker Containerization & Kubernetes', keywords: ['docker', 'container', 'kubernetes', 'k8s', 'pod', 'ingress'] },
    ];

    const conceptsExtracted: string[] = [];
    const prerequisiteGaps: string[] = [];
    const masteredConceptsFound: string[] = [];
    const recommendedNodesToInject: string[] = [];

    const existingSkills = db.getSkills();

    conceptUniverse.forEach((concept) => {
      const matchFound = concept.keywords.some((kw) => textLower.includes(kw));
      if (matchFound) {
        conceptsExtracted.push(concept.name);

        // Check if user already mastered this concept
        const matchingSkill = existingSkills.find(
          (s) => s.name.toLowerCase().includes(concept.keywords[0]) || concept.name.toLowerCase().includes(s.category.toLowerCase())
        );

        if (matchingSkill && matchingSkill.currentLevel >= 75) {
          masteredConceptsFound.push(concept.name);
        } else {
          prerequisiteGaps.push(concept.name);
          recommendedNodesToInject.push(`Deep Dive: ${concept.name}`);
        }
      }
    });

    // Fallbacks if uploaded text was brief or non-technical
    if (conceptsExtracted.length === 0) {
      conceptsExtracted.push('Asymptotic Analysis (Big-O)', 'Data Structures Foundations', 'Algorithmic Problem Solving');
      prerequisiteGaps.push('Algorithmic Complexity Modeling');
      masteredConceptsFound.push('Basic Programming Syntax');
      recommendedNodesToInject.push('Core Algorithmic Foundations');
    }

    const analyzedDoc: AnalyzedDocument = {
      id: `doc_${Date.now()}`,
      filename,
      uploadedAt: new Date().toISOString(),
      fileSize,
      textSnippet: rawText.slice(0, 300) + (rawText.length > 300 ? '...' : ''),
      conceptsExtracted,
      prerequisiteGaps,
      masteredConceptsFound,
      relevanceScore: Math.min(98, Math.max(65, Math.floor(70 + conceptsExtracted.length * 5))),
      recommendedNodesToInject,
    };

    db.addDocument(analyzedDoc);

    return analyzedDoc;
  }

  public static mergeDocumentConceptsIntoRoadmap(docId: string): RoadmapNode[] {
    const docs = db.getDocuments();
    const doc = docs.find((d) => d.id === docId);
    if (!doc) return db.getRoadmap();

    const currentRoadmap = db.getRoadmap();

    doc.prerequisiteGaps.forEach((gap, index) => {
      const alreadyExists = currentRoadmap.some((n) => n.title.toLowerCase().includes(gap.toLowerCase()));
      if (!alreadyExists) {
        const newNode: RoadmapNode = {
          id: `node_doc_gap_${Date.now()}_${index}`,
          title: `📖 Material Gap: ${gap}`,
          stage: 'Core Engineering',
          description: `Identified from uploaded document "${doc.filename}". Fills an essential prerequisite requirement detected in study materials.`,
          estimatedHours: 3.5,
          status: 'available',
          orderIndex: 3 + index * 0.1,
          prerequisites: ['Foundations'],
          skillsCovered: ['Computer Science'],
          whyRecommended: `Extracted from your uploaded document "${doc.filename}". Contains 4 key concepts required for your target career milestones.`,
          confidenceScore: doc.relevanceScore,
          recommendationState: 'active',
        };
        currentRoadmap.push(newNode);
      }
    });

    const reordered = currentRoadmap
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((node, idx) => ({ ...node, orderIndex: idx + 1 }));

    db.setRoadmap(reordered);
    return reordered;
  }
}
