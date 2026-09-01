/**
 * Shared source-of-truth answer evaluation function
 * Used for both immediate client-side UI feedback and final quiz grading
 */
export function isAnswerCorrect(userAnswer?: string, correctAnswer?: string): boolean {
  if (!userAnswer || !correctAnswer) return false;
  const cleanUser = userAnswer.trim().toLowerCase().replace(/^["']|["']$/g, '');
  const cleanCorrect = correctAnswer.trim().toLowerCase().replace(/^["']|["']$/g, '');
  return cleanUser === cleanCorrect;
}
