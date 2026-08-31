import { RoadmapNode, SkillItem, CareerGoalType, ExperienceLevel, LearningStyle } from '../types/index.js';
import { db } from '../db/database.js';

export class LearningPathService {
  public static generateRoadmapForGoal(
    careerGoal: CareerGoalType,
    experienceLevel: ExperienceLevel,
    learningStyle: LearningStyle
  ): { roadmap: RoadmapNode[]; skills: SkillItem[] } {
    let roadmap: RoadmapNode[] = [];
    let skills: SkillItem[] = [];

    if (careerGoal === 'AI / Machine Learning Engineer') {
      skills = [
        {
          id: 'sk_py_ml',
          name: 'Python & NumPy / Pandas',
          category: 'Data Core',
          currentLevel: experienceLevel === 'Beginner' ? 30 : experienceLevel === 'Intermediate' ? 75 : 90,
          targetLevel: 95,
          status: 'Proficient',
          gapReason: 'Vectorized tensor operations and matrix manipulations require hands-on benchmarking.',
        },
        {
          id: 'sk_math',
          name: 'Linear Algebra & Calculus',
          category: 'Mathematics',
          currentLevel: 40,
          targetLevel: 85,
          status: 'In Progress',
          gapReason: 'Eigenvectors, gradient descent partial derivatives, and covariance matrices.',
        },
        {
          id: 'sk_pytorch',
          name: 'PyTorch & Deep Learning',
          category: 'Model Architecture',
          currentLevel: 25,
          targetLevel: 90,
          status: 'Critical Gap',
          gapReason: 'Requires custom autograd functions, loss customization, and CNN/Transformer architectures.',
        },
        {
          id: 'sk_llm',
          name: 'LLM Fine-Tuning & RAG Systems',
          category: 'Generative AI',
          currentLevel: 20,
          targetLevel: 85,
          status: 'Critical Gap',
          gapReason: 'Vector database indexing (Qdrant/Pinecone), embedding models, and LoRA fine-tuning.',
        },
        {
          id: 'sk_mlops',
          name: 'MLOps, Docker & Serving',
          category: 'Deployment',
          currentLevel: 30,
          targetLevel: 80,
          status: 'Critical Gap',
          gapReason: 'Model quantization (GGUF/AWQ), Triton inference server, and automated drift evaluation.',
        },
      ];

      roadmap = [
        {
          id: 'node_ml_1',
          title: 'Matrix Mathematics & Vectorized Tensor Algebra',
          stage: 'Foundations',
          description: 'Master multi-dimensional broadcasting, SVD decomposition, and vectorized optimization with NumPy.',
          estimatedHours: 5.0,
          status: 'completed',
          orderIndex: 1,
          prerequisites: ['Python Basics'],
          skillsCovered: ['Linear Algebra & Calculus', 'Python & NumPy / Pandas'],
          whyRecommended: 'Fundamental mathematical foundation prerequisite for understanding backpropagation and neural activations.',
          confidenceScore: 98,
          recommendationState: 'active',
        },
        {
          id: 'node_ml_2',
          title: 'Classical Machine Learning: Scikit-Learn & Feature Engineering',
          stage: 'Core Engineering',
          description: 'Build robust pipelines for regression, gradient boosted trees (XGBoost), and cross-validation schemes.',
          estimatedHours: 6.0,
          status: 'in_progress',
          orderIndex: 2,
          prerequisites: ['Matrix Mathematics'],
          skillsCovered: ['Python & NumPy / Pandas'],
          whyRecommended: '80% of real-world tabular data challenges are solved via gradient boosted decision trees rather than deep networks.',
          confidenceScore: 95,
          recommendationState: 'active',
        },
        {
          id: 'node_ml_3',
          title: 'PyTorch Deep Learning & Neural Network Backprop',
          stage: 'Core Engineering',
          description: 'Construct custom PyTorch modules, train loop telemetry, learning rate schedulers, and regularization (Dropout/BatchNorm).',
          estimatedHours: 8.0,
          status: 'available',
          orderIndex: 3,
          prerequisites: ['Classical Machine Learning'],
          skillsCovered: ['PyTorch & Deep Learning'],
          whyRecommended: 'Core deep learning framework standard used throughout modern AI industry and research.',
          confidenceScore: 96,
          recommendationState: 'active',
        },
        {
          id: 'node_ml_4',
          title: 'Transformer Architectures & Attention Mechanisms',
          stage: 'Advanced Algorithms',
          description: 'Implement Scaled Dot-Product Multi-Head Self-Attention from scratch and inspect positional encodings.',
          estimatedHours: 9.0,
          status: 'available',
          orderIndex: 4,
          prerequisites: ['PyTorch Deep Learning'],
          skillsCovered: ['PyTorch & Deep Learning', 'LLM Fine-Tuning & RAG Systems'],
          whyRecommended: 'The backbone of all state-of-the-art vision, audio, and language models.',
          confidenceScore: 94,
          recommendationState: 'active',
        },
        {
          id: 'node_ml_5',
          title: 'Production RAG Architecture with Vector Databases',
          stage: 'Real-World Projects',
          description: 'Build a production multi-tenant RAG system with hybrid semantic search, re-ranking, and hallucination guardrails.',
          estimatedHours: 10.0,
          status: 'locked',
          orderIndex: 5,
          prerequisites: ['Transformer Architectures'],
          skillsCovered: ['LLM Fine-Tuning & RAG Systems'],
          whyRecommended: 'Most demanded practical GenAI skill in contemporary AI enterprise engineering.',
          confidenceScore: 97,
          recommendationState: 'active',
        },
        {
          id: 'node_ml_6',
          title: 'MLOps Pipeline: Model Serving, Quantization & Monitoring',
          stage: 'Interview & Job Ready',
          description: 'Deploy quantized models via vLLM/Triton with Prometheus metrics, Docker containers, and CI/CD evaluation.',
          estimatedHours: 8.0,
          status: 'locked',
          orderIndex: 6,
          prerequisites: ['Production RAG Architecture'],
          skillsCovered: ['MLOps, Docker & Serving'],
          whyRecommended: 'Demonstrates end-to-end operational mastery to hiring managers during final project defenses.',
          confidenceScore: 92,
          recommendationState: 'active',
        },
      ];
    } else if (careerGoal === 'Data Scientist') {
      skills = [
        {
          id: 'sk_ds_stats',
          name: 'Applied Statistics & A/B Testing',
          category: 'Statistics',
          currentLevel: 45,
          targetLevel: 90,
          status: 'In Progress',
          gapReason: 'Hypothesis testing, p-value correction, sample sizing, and causal inference.',
        },
        {
          id: 'sk_ds_sql',
          name: 'Advanced SQL & Data Warehousing',
          category: 'Data Ops',
          currentLevel: 50,
          targetLevel: 85,
          status: 'In Progress',
          gapReason: 'Window functions, CTE recursion, and Snowflake/BigQuery partitioning.',
        },
        {
          id: 'sk_ds_viz',
          name: 'Data Storytelling & Visualization',
          category: 'BI & Presentation',
          currentLevel: 60,
          targetLevel: 80,
          status: 'Proficient',
          gapReason: 'Interactive dashboarding with Plotly/Streamlit and executive summarization.',
        },
      ];

      roadmap = [
        {
          id: 'node_ds_1',
          title: 'Exploratory Data Analysis & Statistical Rigor',
          stage: 'Foundations',
          description: 'Univariate/bivariate distribution analysis, outlier imputation, and confidence intervals.',
          estimatedHours: 4.5,
          status: 'completed',
          orderIndex: 1,
          prerequisites: ['Python Data Basics'],
          skillsCovered: ['Applied Statistics & A/B Testing'],
          whyRecommended: 'Essential for unbiased signal discovery across noisy commercial datasets.',
          confidenceScore: 96,
          recommendationState: 'active',
        },
        {
          id: 'node_ds_2',
          title: 'Advanced SQL Window Functions & Aggregations',
          stage: 'Core Engineering',
          description: 'Master PARTITION BY, LEAD/LAG, running totals, and cohort retention matrices.',
          estimatedHours: 5.0,
          status: 'in_progress',
          orderIndex: 2,
          prerequisites: ['Exploratory Data Analysis'],
          skillsCovered: ['Advanced SQL & Data Warehousing'],
          whyRecommended: 'Primary tool for extraction and transformation in production analytical teams.',
          confidenceScore: 98,
          recommendationState: 'active',
        },
        {
          id: 'node_ds_3',
          title: 'Rigorous A/B Experimentation & Causal Inference',
          stage: 'Specialization',
          description: 'Design randomized control trials, power analysis, and synthetic control experiments.',
          estimatedHours: 6.0,
          status: 'available',
          orderIndex: 3,
          prerequisites: ['Advanced SQL'],
          skillsCovered: ['Applied Statistics & A/B Testing'],
          whyRecommended: 'High-frequency question theme in Senior Data Science product rounds.',
          confidenceScore: 93,
          recommendationState: 'active',
        },
      ];
    } else {
      // Default: Software Engineer / Full Stack
      const defaultState = db.getRoadmap();
      const defaultSkills = db.getSkills();
      return { roadmap: defaultState, skills: defaultSkills };
    }

    return { roadmap, skills };
  }

  public static adaptRoadmapAfterQuizFailure(
    weakTopic: string,
    weakScore: number,
    explanation: string
  ): { adaptedNode: RoadmapNode; adaptationSummary: string } {
    const currentRoadmap = db.getRoadmap();
    const cleanTopic = weakTopic.trim();

    // Check if an adaptation node already exists
    const existingAdaptation = currentRoadmap.find(
      (n) => n.adaptedFromQuiz && n.title.toLowerCase().includes(cleanTopic.toLowerCase())
    );

    if (existingAdaptation) {
      existingAdaptation.status = 'in_progress';
      existingAdaptation.adaptationReason = `Updated post-quiz alert: Accuracy scored at ${weakScore}%. Prioritized refresher node.`;
      db.setRoadmap(currentRoadmap);
      return {
        adaptedNode: existingAdaptation,
        adaptationSummary: `Reinforced focus on existing remediation node: "${existingAdaptation.title}".`,
      };
    }

    // Insert an immediate remediation node before the next available advanced node
    const insertionIndex = 2; // Right after current progress
    const remediationNode: RoadmapNode = {
      id: `node_remed_${Date.now()}`,
      title: `⚡ AI Remediation: Targeted ${cleanTopic} Deep Dive`,
      stage: 'Core Engineering',
      description: `Precision review session automatically scheduled following diagnostic quiz performance (${weakScore}%). Includes step-by-step visual drills and edge-case dissection.`,
      estimatedHours: 2.5,
      status: 'in_progress',
      orderIndex: insertionIndex + 0.5,
      prerequisites: ['Linear Data Structures'],
      skillsCovered: ['Data Structures & Algorithms'],
      whyRecommended: `Dynamic AI Adaptation: You scored ${weakScore}% on ${cleanTopic}. Resolving this prerequisite now prevents compounding friction in downstream Graph and Dynamic Programming modules.`,
      confidenceScore: 99,
      adaptedFromQuiz: true,
      adaptationReason: `Triggered by quiz diagnostic score of ${weakScore}% on ${cleanTopic}. ${explanation}`,
      recommendationState: 'active',
    };

    // Re-index remaining nodes
    const updatedRoadmap = [...currentRoadmap, remediationNode]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((node, idx) => ({ ...node, orderIndex: idx + 1 }));

    db.setRoadmap(updatedRoadmap);

    // Update Skills to reflect new diagnostic gap
    const skills = db.getSkills();
    const targetSkill = skills.find((s) => s.name.toLowerCase().includes('data') || s.name.toLowerCase().includes('python'));
    if (targetSkill) {
      targetSkill.currentLevel = Math.max(20, targetSkill.currentLevel - 8);
      targetSkill.status = 'Critical Gap';
      targetSkill.gapReason = `Recent quiz detected vulnerability in ${cleanTopic} (${weakScore}%). Remediation node inserted.`;
      db.updateSkill(targetSkill.id, targetSkill);
    }

    // Update AI Insights
    const analytics = db.getAnalytics();
    analytics.aiInsights.unshift({
      id: `ins_auto_${Date.now()}`,
      type: 'warning',
      title: `Roadmap Adapted: ${cleanTopic} Refresher Added`,
      message: `Diagnostic quiz identified key knowledge gaps in ${cleanTopic} (${weakScore}%). Your learning path has been auto-recalibrated with a 2.5-hour targeted booster.`,
      actionLabel: 'Review Remediation Node',
      actionTarget: remediationNode.id,
    });
    db.updateAnalytics(analytics);

    return {
      adaptedNode: remediationNode,
      adaptationSummary: `AI detected a ${weakScore}% proficiency gap in ${cleanTopic}. Automatically inserted a targeted remediation node into your active roadmap.`,
    };
  }
}
