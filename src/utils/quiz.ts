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
  answers: Record<string, number | number[]>,
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

export function randomAnswerForQuestion(question: Question): number | number[] {
  if (question.multiSelect) {
    const maxCount = Math.min(3, question.options.length);
    const count = Math.floor(Math.random() * maxCount) + 1;
    return shuffle(question.options.map((_, index) => index))
      .slice(0, count)
      .sort((a, b) => a - b);
  }

  // Use max of all option values so question ordering (asc vs desc) doesn't
  // collapse the random range to 1 (e.g. FPI uses H→L ordering).
  const maxVal = Math.max(...question.options.map((o) => o.value));
  return Math.floor(Math.random() * maxVal) + 1;
}
