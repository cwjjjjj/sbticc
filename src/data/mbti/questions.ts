import type { Question } from '../testConfig';

export const LIKERT_OPTIONS = [
  { label: '\u5b8c\u5168\u540c\u610f', value: 3 },
  { label: '\u540c\u610f', value: 2 },
  { label: '\u7565\u540c\u610f', value: 1 },
  { label: '\u4e2d\u7acb', value: 0 },
  { label: '\u7565\u4e0d\u540c\u610f', value: -1 },
  { label: '\u4e0d\u540c\u610f', value: -2 },
  { label: '\u5b8c\u5168\u4e0d\u540c\u610f', value: -3 },
] as const;

// Populated in Phase 3 tasks. All 72 questions share LIKERT_OPTIONS.
export const questions: Question[] = [];

export const specialQuestions: Question[] = [];
