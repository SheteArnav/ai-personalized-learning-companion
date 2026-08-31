import { QuizQuestion, QuizSubmission, QuizResult } from '../types/index.js';
import { db } from '../db/database.js';
import { LearningPathService } from './learningPathService.js';

export class QuizService {
  public static getQuizForTopic(topic: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate'): QuizQuestion[] {
    const t = topic.toLowerCase();

    if (t.includes('tree') || t.includes('binary') || t.includes('recursion') || t.includes('dsa')) {
      return [
        {
          id: 'q_dsa_1',
          type: 'multiple_choice',
          topic: 'Binary Trees & Traversals',
          difficulty,
          question: 'What is the time complexity of searching for an element in an unbalanced (degenerate) Binary Search Tree of N nodes?',
          options: ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
          correctAnswer: 'O(N)',
          explanation: 'In the worst-case scenario where the tree becomes a skewed linear chain (like a linked list), searching requires visiting all N nodes, yielding O(N) time.',
        },
        {
          id: 'q_dsa_2',
          type: 'multiple_choice',
          topic: 'Tree Traversal Order',
          difficulty,
          question: 'Which traversal method visits nodes in the order: Left Subtree -> Root -> Right Subtree?',
          options: ['Pre-order', 'In-order', 'Post-order', 'Level-order (BFS)'],
          correctAnswer: 'In-order',
          explanation: 'In-order traversal visits Left -> Root -> Right. For a Binary Search Tree, In-order traversal yields elements in strictly sorted ascending order.',
        },
        {
          id: 'q_dsa_3',
          type: 'true_false',
          topic: 'Recursion Call Stack',
          difficulty,
          question: 'A recursive tree traversal always consumes O(1) auxiliary space regardless of tree depth.',
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'False. Recursive calls utilize the runtime call stack. The auxiliary space complexity is O(H), where H is the height of the tree (up to O(N) for degenerate trees).',
        },
        {
          id: 'q_dsa_4',
          type: 'multiple_choice',
          topic: 'Breadth-First Search (BFS)',
          difficulty,
          question: 'Which auxiliary data structure is fundamentally required to perform Level-Order Traversal on a binary tree iteratively?',
          options: ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Heap', 'Hash Set'],
          correctAnswer: 'Queue (FIFO)',
          explanation: 'A FIFO (First-In, First-Out) Queue is necessary to process nodes row-by-row in the exact order they were discovered.',
        },
        {
          id: 'q_dsa_5',
          type: 'short_answer',
          topic: 'Balanced BST Invariant',
          difficulty,
          question: 'In an AVL Tree, what is the maximum permissible difference in height between the left and right subtrees of any node?',
          correctAnswer: '1',
          explanation: 'The balance factor in an AVL tree is defined as |Height(Left) - Height(Right)| <= 1.',
        },
      ];
    }

    if (t.includes('sql') || t.includes('database') || t.includes('schema')) {
      return [
        {
          id: 'q_sql_1',
          type: 'multiple_choice',
          topic: 'SQL Indexing',
          difficulty,
          question: 'Which index structure is the default and most widely used for range-based queries in relational databases like PostgreSQL and MySQL InnoDB?',
          options: ['Hash Index', 'B-Tree Index', 'Bitmap Index', 'GiST Index'],
          correctAnswer: 'B-Tree Index',
          explanation: 'B-Trees maintain sorted order, allowing logarithmic time complexity O(log N) for point lookups, range scans, and prefix matches.',
        },
        {
          id: 'q_sql_2',
          type: 'multiple_choice',
          topic: 'Database Normalization',
          difficulty,
          question: 'A relational table is in Third Normal Form (3NF) if it is in 2NF and has no:',
          options: ['Foreign Keys', 'Transitive Functional Dependencies', 'Primary Keys', 'Null values'],
          correctAnswer: 'Transitive Functional Dependencies',
          explanation: '3NF requires that every non-prime attribute is non-transitively dependent on every candidate key (X -> Y and Y -> Z where Z is non-prime is disallowed).',
        },
        {
          id: 'q_sql_3',
          type: 'true_false',
          topic: 'Transaction ACID Properties',
          difficulty,
          question: 'The "Isolation" property in ACID guarantees that concurrently executing transactions will not interfere with each other according to the configured isolation level.',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'True. Isolation ensures transaction integrity across concurrent executions, mitigating dirty reads, non-repeatable reads, and phantom reads.',
        },
        {
          id: 'q_sql_4',
          type: 'multiple_choice',
          topic: 'SQL Joins & Performance',
          difficulty,
          question: 'Which JOIN type returns all rows from the left table and matched rows from the right table, filling with NULL where there is no match?',
          options: ['INNER JOIN', 'LEFT OUTER JOIN', 'CROSS JOIN', 'RIGHT JOIN'],
          correctAnswer: 'LEFT OUTER JOIN',
          explanation: 'A LEFT OUTER JOIN preserves all records from the primary (left) relation, populating NULLs for absent corresponding foreign records.',
        },
      ];
    }

    // Default General Software Engineering / Python Quiz
    return [
      {
        id: 'q_gen_1',
        type: 'multiple_choice',
        topic: 'Python Memory & Object Model',
        difficulty,
        question: 'In Python, how are default mutable arguments (e.g. `def append_item(x, target=[]):`) evaluated?',
        options: [
          'Evaluated once at function definition time and shared across all calls',
          'A new instance is instantiated on every function invocation',
          'Raises a runtime TypeError immediately',
          'Garbage collected after each call',
        ],
        correctAnswer: 'Evaluated once at function definition time and shared across all calls',
        explanation: 'Default parameter expressions are evaluated once when the `def` statement executes. Using mutable defaults causes shared persistent state across invocations.',
      },
      {
        id: 'q_gen_2',
        type: 'true_false',
        topic: 'Python Concurrency & GIL',
        difficulty,
        question: 'Python Global Interpreter Lock (GIL) prevents multiple CPU-bound native OS threads from executing bytecode simultaneously in CPython.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. CPython mutex GIL restricts execution to one native thread at a time for bytecode execution, requiring multiprocessing for CPU parallelism.',
      },
      {
        id: 'q_gen_3',
        type: 'multiple_choice',
        topic: 'Data Structure Complexity',
        difficulty,
        question: 'What is the average time complexity of key lookup in a Python dictionary (hash table)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctAnswer: 'O(1)',
        explanation: 'Python dictionaries use open addressing with quadratic probing hash tables, providing average amortized O(1) key lookups.',
      },
    ];
  }

  public static evaluateQuiz(submission: QuizSubmission, questions: QuizQuestion[]): QuizResult {
    let correctCount = 0;
    const strongAreas: string[] = [];
    const weakAreas: string[] = [];

    const answerMap = new Map(submission.answers.map((a) => [a.questionId, a.selectedAnswer.trim().toLowerCase()]));

    questions.forEach((q) => {
      const userAnswer = answerMap.get(q.id) || '';
      const isCorrect = userAnswer === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        correctCount++;
        if (!strongAreas.includes(q.topic)) strongAreas.push(q.topic);
      } else {
        if (!weakAreas.includes(q.topic)) weakAreas.push(q.topic);
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 75;

    let recommendedAction = '';
    let adaptationTriggered = false;
    let adaptationSummary: string | undefined = undefined;

    if (!passed && weakAreas.length > 0) {
      adaptationTriggered = true;
      const primaryWeakness = weakAreas[0];
      const adaptResult = LearningPathService.adaptRoadmapAfterQuizFailure(
        primaryWeakness,
        score,
        `Student answered ${correctCount}/${questions.length} questions correctly.`
      );
      adaptationSummary = adaptResult.adaptationSummary;
      recommendedAction = `Review the newly inserted remediation node for "${primaryWeakness}" before proceeding to advanced milestones.`;
    } else {
      recommendedAction = `Great mastery demonstrated (${score}%)! You are clear to proceed to the next roadmap milestone.`;
    }

    const feedbackSummary = passed
      ? `Outstanding performance! You showed strong mastery across ${strongAreas.join(', ')}.`
      : `Diagnostic threshold unmet (${score}%). Knowledge gaps detected in: ${weakAreas.join(', ')}.`;

    // Record quiz attempt in analytics
    const analytics = db.getAnalytics();
    analytics.quizPerformance.push({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      topic: submission.topic,
      score,
    });
    db.updateAnalytics(analytics);

    return {
      quizId: submission.quizId,
      topic: submission.topic,
      score,
      totalQuestions: questions.length,
      correctCount,
      strongAreas,
      weakAreas,
      recommendedAction,
      feedbackSummary,
      roadmapAdaptationTriggered: adaptationTriggered,
      adaptationSummary,
    };
  }
}
