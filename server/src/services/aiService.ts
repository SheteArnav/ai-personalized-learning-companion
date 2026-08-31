import { CONFIG } from '../config/env.js';

export interface PromptContext {
  careerGoal?: string;
  experienceLevel?: string;
  topic?: string;
  weaknesses?: string[];
  systemInstruction?: string;
}

export class AIService {
  private static instance: AIService;
  private provider: 'gemini' | 'openai' | 'demo';
  private apiKey: string;

  private constructor() {
    this.provider = CONFIG.AI_PROVIDER;
    this.apiKey = CONFIG.AI_API_KEY;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setProvider(provider: 'gemini' | 'openai' | 'demo', apiKey?: string) {
    this.provider = provider;
    if (apiKey !== undefined) this.apiKey = apiKey;
  }

  public getStatus() {
    return {
      provider: this.provider,
      hasApiKey: Boolean(this.apiKey && this.apiKey.length > 5),
      isDemoMode: this.provider === 'demo' || !this.apiKey || CONFIG.DEMO_MODE_FORCED,
    };
  }

  public async generateText(prompt: string, context?: PromptContext): Promise<string> {
    if (this.getStatus().isDemoMode) {
      return this.generateMockResponse(prompt, context);
    }

    try {
      if (this.provider === 'gemini' || (this.apiKey && !this.apiKey.startsWith('sk-'))) {
        return await this.callGeminiAPI(prompt, context);
      } else if (this.provider === 'openai' || this.apiKey.startsWith('sk-')) {
        return await this.callOpenAIAPI(prompt, context);
      }
    } catch (error) {
      console.warn('[AIService] External API failed, falling back gracefully to Demo AI Engine:', error);
    }

    return this.generateMockResponse(prompt, context);
  }

  private async callGeminiAPI(prompt: string, context?: PromptContext): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent?key=${this.apiKey}`;
    const systemPrompt = context?.systemInstruction || 'You are Synapse, an elite AI personalized tutor and career mentor.';
    
    const body = {
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nUser Context:\nGoal: ${context?.careerGoal || 'Software Engineer'}\nLevel: ${context?.experienceLevel || 'Intermediate'}\n\nTask:\n${prompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${err}`);
    }

    const data: any = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateMockResponse(prompt, context);
  }

  private async callOpenAIAPI(prompt: string, context?: PromptContext): Promise<string> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const systemPrompt = context?.systemInstruction || 'You are Synapse, an elite AI personalized tutor and career mentor.';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `${systemPrompt}\nGoal: ${context?.careerGoal || 'Software Engineer'}` },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${err}`);
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || this.generateMockResponse(prompt, context);
  }

  public generateMockResponse(prompt: string, context?: PromptContext): string {
    const p = prompt.toLowerCase();
    const targetGoal = context?.careerGoal || 'Software Engineer';

    if (p.includes('explain') || p.includes('simply') || p.includes('what is')) {
      if (p.includes('tree') || p.includes('binary') || p.includes('dsa')) {
        return [
          '### 🌲 Binary Search Trees (Simplified)',
          '',
          'A **Binary Search Tree (BST)** is a hierarchical data structure where every node follows an invariant rule:',
          '1. **Left child** values are *strictly less* than the parent node.',
          '2. **Right child** values are *strictly greater* than the parent node.',
          '',
          '```python',
          'class TreeNode:',
          '    def __init__(self, val=0, left=None, right=None):',
          '        self.val = val',
          '        self.left = left',
          '        self.right = right',
          '',
          'def search_bst(root, target):',
          '    # Base case: Found target or reached end of leaf',
          '    if not root or root.val == target:',
          '        return root',
          '    # Target is smaller -> search left subtree',
          '    if target < root.val:',
          '        return search_bst(root.left, target)',
          '    # Target is larger -> search right subtree',
          '    return search_bst(root.right, target)',
          '```',
          '',
          '#### 💡 Real-World Mental Model:',
          'Think of flipping open a dictionary at letter "M". If your word starts with "S", you discard the left half ("A"-"M") and only search the right half.',
          '',
          '**Time Complexity**: Average O(log N), Worst-case O(N) (unbalanced).'
        ].join('\n');
      }

      if (p.includes('sql') || p.includes('index') || p.includes('join')) {
        return [
          '### ⚡ SQL Indexing & Query Optimization',
          '',
          'A **B-Tree Index** in PostgreSQL/MySQL functions like an indexed catalog at the back of a textbook. Without an index, the database engine must execute a **Full Table Scan** (O(N)).',
          '',
          '```sql',
          '-- Creating a composite index for high-cardinality lookups',
          'CREATE INDEX idx_orders_customer_date',
          'ON orders(customer_id, order_date DESC);',
          '',
          '-- Query utilizing the composite index',
          'EXPLAIN ANALYZE',
          'SELECT order_id, total_amount',
          'FROM orders',
          'WHERE customer_id = 4920',
          'ORDER BY order_date DESC',
          'LIMIT 10;',
          '```',
          '',
          '#### 🎯 Key Takeaways:',
          '- **Index Selectivity**: Place high-cardinality columns first.',
          '- **Write Overhead**: Each INSERT/UPDATE incurs small cost to rebalance the B-Tree.'
        ].join('\n');
      }

      return [
        `### 🧠 Core Concept Breakdown: ${context?.topic || targetGoal}`,
        '',
        'Here is an intuitive, structured breakdown:',
        '',
        '1. **The Problem It Solves**: Eliminates redundant computation and organizes state systematically.',
        '2. **The Mechanism**: Deconstructs complex inputs into isolated, testable modules.',
        '3. **Common Pitfall**: Over-engineering before profiling actual bottlenecks.',
        '',
        '> **Pro Tip**: In production systems, prioritize readability and cache locality before micro-optimizations.'
      ].join('\n');
    }

    if (p.includes('example') || p.includes('give me an example') || p.includes('code')) {
      return [
        '### 💻 Production-Grade Example: Resilient Worker Queue',
        '',
        'Here is a clean implementation of an asynchronous worker queue in TypeScript:',
        '',
        '```typescript',
        'interface Task<T> {',
        '  id: string;',
        '  payload: T;',
        '  execute: () => Promise<void>;',
        '}',
        '',
        'class ResilientWorkerPool {',
        '  private queue: Task<any>[] = [];',
        '  private activeWorkers = 0;',
        '',
        '  constructor(private readonly concurrencyLimit: number = 3) {}',
        '',
        '  public enqueue<T>(task: Task<T>): void {',
        '    this.queue.push(task);',
        '    this.processNext();',
        '  }',
        '',
        '  private async processNext(): Promise<void> {',
        '    if (this.activeWorkers >= this.concurrencyLimit || this.queue.length === 0) {',
        '      return;',
        '    }',
        '',
        '    const task = this.queue.shift();',
        '    if (!task) return;',
        '',
        '    this.activeWorkers++;',
        '    try {',
        '      await task.execute();',
        '    } catch (err) {',
        '      console.error("Task failed:", task.id, err);',
        '    } finally {',
        '      this.activeWorkers--;',
        '      this.processNext();',
        '    }',
        '  }',
        '}',
        '```',
        '',
        'This pattern prevents event-loop starvation and bounds concurrent memory utilization.'
      ].join('\n');
    }

    if (p.includes('weak') || p.includes('why am i weak') || p.includes('gap')) {
      return [
        '### 🔍 Cognitive Diagnostic: Skill Gap Analysis',
        '',
        'Based on your recent assessment and quiz telemetry:',
        '',
        '1. **Identified Weakness**: *Recursive Backtracking & Tree Traversals* (Accuracy: **52%**)',
        '2. **Root Cause**: You excel at iterative state loops, but recursive frame stacks and return-value bubbling are causing edge-case off-by-one errors.',
        '3. **Prescription**:',
        '   - Practice drawing recursive call trees on paper before coding.',
        '   - Solve 3 classic problems: *Max Depth of Binary Tree*, *Invert Binary Tree*, and *Path Sum II*.',
        '   - Re-test in 48 hours to lock in spaced repetition.'
      ].join('\n');
    }

    if (p.includes('next') || p.includes('what should i learn')) {
      return [
        '### 🚀 Recommended Next Step',
        '',
        `For your goal as a **${targetGoal}**:`,
        '',
        '👉 **Next Topic**: *Non-Linear Structures: Trees & Binary Search*',
        '⏱ **Estimated Time**: 45 mins',
        '🎯 **Why**: You have 100% completed linear lists and need tree mastery before advancing to graph traversal algorithms (BFS/DFS).'
      ].join('\n');
    }

    return [
      '### 🎯 Synapse AI Insights',
      '',
      `I have analyzed your learning path for **${targetGoal}**.`,
      '',
      'Here is how you can optimize your retention today:',
      '- **Active Recall**: Test yourself every 20 minutes instead of passively re-reading documentation.',
      '- **Project Application**: Build a mini-service integrating your newly acquired skills.',
      '- **Next Milestone**: Advance your DSA rating by completing today scheduled Tree Traversal quiz.',
      '',
      'Feel free to ask for a custom quiz, a simplified analogy, or code debug help!'
    ].join('\n');
  }
}

export const aiService = AIService.getInstance();
