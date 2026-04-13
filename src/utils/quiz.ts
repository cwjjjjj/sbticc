import type { Question } from '../data/testConfig';

/** Fisher-Yates shuffle (returns new array) */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffle regular questions and insert gateQuestion at a random
 * position (never at index 0).
 */
export function buildShuffledQuestions(
  regularQuestions: Question[],
  gateQuestion?: Question,
): Question[] {
  const shuffledRegular = shuffle(regularQuestions);
  if (!gateQuestion) return shuffledRegular;
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
  return [
    ...shuffledRegular.slice(0, insertIndex),
    gateQuestion,
    ...shuffledRegular.slice(insertIndex),
  ];
}

/**
 * Build the list of visible questions.
 * If the user chose the gate question with the trigger value,
 * splice the follow-up question right after it.
 */
export function getVisibleQuestions(
  shuffledQuestions: Question[],
  answers: Record<string, number>,
  gateQuestionId: string,
  gateAnswerValue: number,
  followUpQuestion?: Question,
): Question[] {
  const visible = [...shuffledQuestions];
  if (!followUpQuestion) return visible;
  const gateIndex = visible.findIndex(q => q.id === gateQuestionId);
  if (gateIndex !== -1 && answers[gateQuestionId] === gateAnswerValue) {
    visible.splice(gateIndex + 1, 0, followUpQuestion);
  }
  return visible;
}
