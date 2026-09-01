import { QuizService, isAnswerCorrect } from './src/services/quizService.js';

async function runQuizValidation() {
  console.log('====================================================');
  console.log('🧪 RUNNING QUIZ QUESTION BANK & EVALUATION VALIDATION');
  console.log('====================================================');

  let allPassed = true;

  // Test 1: Python + Beginner
  console.log('\n▶ Test 1: Python + Beginner');
  const pyBeg = await QuizService.getQuizForTopic('Python Programming', 'Beginner', 5);
  console.log(`Generated ${pyBeg.length} questions:`);
  pyBeg.forEach((q, i) => console.log(`  [${i + 1}] (${q.difficulty}) ${q.question.substring(0, 70)}...`));
  const pyBegAllBeg = pyBeg.every((q) => q.difficulty === 'Beginner');
  const pyBegUnique = new Set(pyBeg.map((q) => q.id)).size === pyBeg.length;
  console.log(`  ✓ All Beginner: ${pyBegAllBeg} | No Duplicates: ${pyBegUnique}`);
  if (!pyBegAllBeg || !pyBegUnique) allPassed = false;

  // Test 2: Python + Advanced
  console.log('\n▶ Test 2: Python + Advanced');
  const pyAdv = await QuizService.getQuizForTopic('Python Programming', 'Advanced', 5);
  console.log(`Generated ${pyAdv.length} questions:`);
  pyAdv.forEach((q, i) => console.log(`  [${i + 1}] (${q.difficulty}) ${q.question.substring(0, 70)}...`));
  const pyAdvAllAdv = pyAdv.every((q) => q.difficulty === 'Advanced');
  const pyAdvUnique = new Set(pyAdv.map((q) => q.id)).size === pyAdv.length;
  // Verify that Python Advanced questions are disjoint from Python Beginner questions
  const pyOverlap = pyBeg.some((q1) => pyAdv.some((q2) => q1.id === q2.id));
  console.log(`  ✓ All Advanced: ${pyAdvAllAdv} | No Duplicates: ${pyAdvUnique} | Disjoint from Beginner: ${!pyOverlap}`);
  if (!pyAdvAllAdv || !pyAdvUnique || pyOverlap) allPassed = false;

  // Test 3: Data Structures + Beginner
  console.log('\n▶ Test 3: Data Structures + Beginner');
  const dsaBeg = await QuizService.getQuizForTopic('Data Structures', 'Beginner', 5);
  console.log(`Generated ${dsaBeg.length} questions:`);
  dsaBeg.forEach((q, i) => console.log(`  [${i + 1}] (${q.difficulty}) ${q.question.substring(0, 70)}...`));
  const dsaBegAllBeg = dsaBeg.every((q) => q.difficulty === 'Beginner');
  const dsaBegUnique = new Set(dsaBeg.map((q) => q.id)).size === dsaBeg.length;
  console.log(`  ✓ All Beginner: ${dsaBegAllBeg} | No Duplicates: ${dsaBegUnique}`);
  if (!dsaBegAllBeg || !dsaBegUnique) allPassed = false;

  // Test 4: Data Structures + Advanced
  console.log('\n▶ Test 4: Data Structures + Advanced');
  const dsaAdv = await QuizService.getQuizForTopic('Data Structures', 'Advanced', 5);
  console.log(`Generated ${dsaAdv.length} questions:`);
  dsaAdv.forEach((q, i) => console.log(`  [${i + 1}] (${q.difficulty}) ${q.question.substring(0, 70)}...`));
  const dsaAdvAllAdv = dsaAdv.every((q) => q.difficulty === 'Advanced');
  const dsaAdvUnique = new Set(dsaAdv.map((q) => q.id)).size === dsaAdv.length;
  const dsaOverlap = dsaBeg.some((q1) => dsaAdv.some((q2) => q1.id === q2.id));
  console.log(`  ✓ All Advanced: ${dsaAdvAllAdv} | No Duplicates: ${dsaAdvUnique} | Disjoint from Beginner: ${!dsaOverlap}`);
  if (!dsaAdvAllAdv || !dsaAdvUnique || dsaOverlap) allPassed = false;

  // Test 5: SQL + Intermediate
  console.log('\n▶ Test 5: SQL + Intermediate');
  const sqlInt = await QuizService.getQuizForTopic('SQL & Database Design', 'Intermediate', 4);
  console.log(`Generated ${sqlInt.length} questions:`);
  sqlInt.forEach((q, i) => console.log(`  [${i + 1}] (${q.difficulty}) ${q.question.substring(0, 70)}...`));
  const sqlUnique = new Set(sqlInt.map((q) => q.id)).size === sqlInt.length;
  console.log(`  ✓ No Duplicates: ${sqlUnique}`);
  if (!sqlUnique) allPassed = false;

  // Test 6: Machine Learning + Advanced
  console.log('\n▶ Test 6: Machine Learning + Advanced');
  const mlAdv = await QuizService.getQuizForTopic('Machine Learning & AI', 'Advanced', 3);
  console.log(`Generated ${mlAdv.length} questions:`);
  mlAdv.forEach((q, i) => console.log(`  [${i + 1}] (${q.difficulty}) ${q.question.substring(0, 70)}...`));
  const mlUnique = new Set(mlAdv.map((q) => q.id)).size === mlAdv.length;
  console.log(`  ✓ No Duplicates: ${mlUnique}`);
  if (!mlUnique) allPassed = false;

  // Test 7: Evaluation Source-of-Truth
  console.log('\n▶ Test 7: Answer Evaluation Verification');
  const eval1 = isAnswerCorrect('Tuple', 'Tuple'); // true
  const eval2 = isAnswerCorrect(' tuple ', 'Tuple'); // true (case & whitespace insensitive)
  const eval3 = isAnswerCorrect('"yth"', '"yth"'); // true
  const eval4 = isAnswerCorrect('List', 'Tuple'); // false
  console.log(`  ✓ Exact match: ${eval1 === true}`);
  console.log(`  ✓ Case/Whitespace normalized match: ${eval2 === true}`);
  console.log(`  ✓ Quoted string match: ${eval3 === true}`);
  console.log(`  ✓ Incorrect rejection: ${eval4 === false}`);

  if (!eval1 || !eval2 || !eval3 || eval4) allPassed = false;

  console.log('\n====================================================');
  console.log(allPassed ? '✅ ALL QUIZ VALIDATION SUITES PASSED (100% SUCCESS)' : '❌ VALIDATION FAILED');
  console.log('====================================================');

  if (!allPassed) process.exit(1);
}

runQuizValidation();
