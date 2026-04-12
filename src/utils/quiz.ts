import { questions, specialQuestions, type Question } from '../data/questions';

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
 * Shuffle regular questions and insert specialQuestions[0] at a random
 * position (never at index 0).
 */
export function buildShuffledQuestions(): Question[] {
  const shuffledRegular = shuffle(questions);
  const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
  return [
    ...shuffledRegular.slice(0, insertIndex),
    specialQuestions[0],
    ...shuffledRegular.slice(insertIndex),
  ];
}

/**
 * Build the list of visible questions.
 * If the user chose "drink_gate_q1" answer 3 (drinking), splice
 * specialQuestions[1] (drink_gate_q2) right after it.
 */
export function getVisibleQuestions(
  shuffledQuestions: Question[],
  answers: Record<string, number>,
): Question[] {
  const visible = [...shuffledQuestions];
  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
  if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1]);
  }
  return visible;
}
