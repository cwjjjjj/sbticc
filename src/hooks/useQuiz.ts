import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Question, Gender } from '../data/testConfig';
import { useTestConfig } from '../data/testConfig';
import { buildShuffledQuestions, getVisibleQuestions } from '../utils/quiz';
import { computeResult, type ComputeResultOutput } from '../utils/matching';

/** How long saved progress remains valid (2 hours). */
const PROGRESS_TTL_MS = 2 * 60 * 60 * 1000;

interface SavedProgress {
  answers: Record<string, number | number[]>;
  currentQ: number;
  shuffledQuestions: Question[];
  timestamp: number;
}

function getStorageKey(testId: string): string {
  return `${testId}_quiz_progress`;
}

function loadProgress(testId: string): SavedProgress | null {
  try {
    const raw = localStorage.getItem(getStorageKey(testId));
    if (!raw) return null;
    const parsed: SavedProgress = JSON.parse(raw);
    if (
      typeof parsed.timestamp !== 'number' ||
      Date.now() - parsed.timestamp > PROGRESS_TTL_MS
    ) {
      localStorage.removeItem(getStorageKey(testId));
      return null;
    }
    // Basic shape validation
    if (
      !parsed.answers ||
      typeof parsed.currentQ !== 'number' ||
      !Array.isArray(parsed.shuffledQuestions)
    ) {
      localStorage.removeItem(getStorageKey(testId));
      return null;
    }
    return parsed;
  } catch {
    // Corrupted data — discard
    try { localStorage.removeItem(getStorageKey(testId)); } catch { /* ignore */ }
    return null;
  }
}

function saveProgress(testId: string, data: SavedProgress): void {
  try {
    localStorage.setItem(getStorageKey(testId), JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function clearProgress(testId: string): void {
  try {
    localStorage.removeItem(getStorageKey(testId));
  } catch {
    // ignore
  }
}

export interface UseQuizReturn {
  /* state */
  shuffledQuestions: Question[];
  answers: Record<string, number | number[]>;
  currentQ: number;
  previewMode: boolean;
  debugForceType: string | null;
  hasSavedProgress: boolean;

  /* gender (GSTI) */
  gender: Gender;
  setGender: (g: Gender) => void;

  /* derived */
  visibleQuestions: Question[];
  totalQuestions: number;
  answeredCount: number;
  allAnswered: boolean;
  progress: number;
  currentQuestion: Question | undefined;

  /* actions */
  startQuiz: (preview?: boolean, seedAnswers?: Record<string, number | number[]>) => void;
  answer: (qId: string, value: number | number[]) => void;
  goNext: () => void;
  goPrev: () => void;
  setDebugForceType: (code: string | null) => void;
  getResult: () => ComputeResultOutput;
}

export function useQuiz(): UseQuizReturn {
  const config = useTestConfig();
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [debugForceType, setDebugForceType] = useState<string | null>(null);

  /* GSTI: gender selection, persisted per-test to localStorage */
  const [gender, setGenderState] = useState<Gender>(() => {
    if (typeof window === 'undefined') return 'unspecified';
    try {
      const stored = window.localStorage.getItem(`${config.id}_gender`);
      if (stored === 'male' || stored === 'female' || stored === 'unspecified') {
        return stored;
      }
    } catch { /* ignore */ }
    return 'unspecified';
  });

  const setGender = useCallback((g: Gender) => {
    setGenderState(g);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`${config.id}_gender`, g);
      }
    } catch { /* ignore storage failures */ }
  }, [config.id]);

  // Whether there is valid saved progress the user could resume
  const [hasSavedProgress, setHasSavedProgress] = useState<boolean>(
    () => loadProgress(config.id) !== null,
  );

  // Track whether quiz is active so we only auto-save while in progress
  const quizActiveRef = useRef(false);

  // Love test: gate and trigger are the same question (ex_gate, value 3)
  // SBTI: gate is drink_gate_q1 (value 3), trigger is drink_gate_q2 (value 2)
  const hasFollowUp = config.gateQuestionId !== config.hiddenTriggerQuestionId;

  /* Auto-save progress whenever answers, currentQ, or shuffledQuestions change */
  useEffect(() => {
    if (!quizActiveRef.current || shuffledQuestions.length === 0) return;
    saveProgress(config.id, {
      answers,
      currentQ,
      shuffledQuestions,
      timestamp: Date.now(),
    });
  }, [answers, currentQ, shuffledQuestions, config.id]);

  /* derived */
  const visibleQuestions = useMemo(
    () => getVisibleQuestions(
      shuffledQuestions,
      answers,
      config.gateQuestionId,
      config.gateAnswerValue,
      hasFollowUp ? config.specialQuestions[1] : undefined,
    ),
    [shuffledQuestions, answers, config, hasFollowUp],
  );

  const totalQuestions = visibleQuestions.length;
  const answeredCount = visibleQuestions.filter(q => {
    const a = answers[q.id];
    if (a === undefined) return false;
    if (Array.isArray(a)) return a.length > 0;
    return true;
  }).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const currentQuestion = visibleQuestions[currentQ];

  const hiddenTriggered = answers[config.hiddenTriggerQuestionId] === config.hiddenTriggerValue;

  /* actions */
  const startQuiz = useCallback((preview = false, seedAnswers?: Record<string, number | number[]>) => {
    setPreviewMode(preview);
    setDebugForceType(null);

    // Seed mode (e.g., "先试一题" sample) takes precedence over saved progress.
    if (seedAnswers && !preview) {
      const seedIds = Object.keys(seedAnswers);
      const shuffled = buildShuffledQuestions(config.questions, config.specialQuestions[0]);
      // Move seeded questions to the front so currentQ lands on the next unanswered one.
      const seeded = shuffled.filter(q => seedIds.includes(q.id));
      const rest = shuffled.filter(q => !seedIds.includes(q.id));
      setAnswers(seedAnswers);
      setCurrentQ(seeded.length);
      setShuffledQuestions([...seeded, ...rest]);
      quizActiveRef.current = true;
      setHasSavedProgress(false);
      return;
    }

    // Attempt to restore saved progress
    const saved = loadProgress(config.id);
    if (saved && !preview) {
      setAnswers(saved.answers);
      setCurrentQ(saved.currentQ);
      setShuffledQuestions(saved.shuffledQuestions);
    } else {
      setAnswers({});
      setCurrentQ(0);
      setShuffledQuestions(
        buildShuffledQuestions(config.questions, config.specialQuestions[0]),
      );
    }

    quizActiveRef.current = true;
    setHasSavedProgress(false);
  }, [config]);

  const answer = useCallback((qId: string, value: number | number[]) => {
    setAnswers(prev => {
      const next = { ...prev, [qId]: value };
      // If gate question changed away from trigger value, remove follow-up answer
      if (hasFollowUp && qId === config.gateQuestionId && value !== config.gateAnswerValue) {
        delete next[config.hiddenTriggerQuestionId];
      }
      return next;
    });
  }, [config, hasFollowUp]);

  const goNext = useCallback(() => {
    setCurrentQ(prev => {
      const max = visibleQuestions.length - 1;
      return prev < max ? prev + 1 : prev;
    });
  }, [visibleQuestions.length]);

  const goPrev = useCallback(() => {
    setCurrentQ(prev => (prev > 0 ? prev - 1 : 0));
  }, []);

  const getResult = useCallback(
    (): ComputeResultOutput => {
      const result = computeResult(answers, hiddenTriggered, config, debugForceType, gender);
      // Quiz complete — clear saved progress
      clearProgress(config.id);
      quizActiveRef.current = false;
      return result;
    },
    [answers, hiddenTriggered, config, debugForceType, gender],
  );

  return {
    shuffledQuestions,
    answers,
    currentQ,
    previewMode,
    debugForceType,
    hasSavedProgress,

    gender,
    setGender,

    visibleQuestions,
    totalQuestions,
    answeredCount,
    allAnswered,
    progress,
    currentQuestion,

    startQuiz,
    answer,
    goNext,
    goPrev,
    setDebugForceType,
    getResult,
  };
}
