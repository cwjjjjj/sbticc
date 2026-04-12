import { useState, useMemo, useCallback } from 'react';
import { type Question, DRUNK_TRIGGER_QUESTION_ID } from '../data/questions';
import { buildShuffledQuestions, getVisibleQuestions } from '../utils/quiz';
import { computeResult, type ComputeResultOutput } from '../utils/matching';

export interface UseQuizReturn {
  /* state */
  shuffledQuestions: Question[];
  answers: Record<string, number>;
  currentQ: number;
  previewMode: boolean;
  debugForceType: string | null;

  /* derived */
  visibleQuestions: Question[];
  totalQuestions: number;
  answeredCount: number;
  allAnswered: boolean;
  progress: number;
  currentQuestion: Question | undefined;

  /* actions */
  startQuiz: (preview?: boolean) => void;
  answer: (qId: string, value: number) => void;
  goNext: () => void;
  goPrev: () => void;
  setDebugForceType: (code: string | null) => void;
  getResult: () => ComputeResultOutput;
}

export function useQuiz(): UseQuizReturn {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [debugForceType, setDebugForceType] = useState<string | null>(null);

  /* derived */
  const visibleQuestions = useMemo(
    () => getVisibleQuestions(shuffledQuestions, answers),
    [shuffledQuestions, answers],
  );

  const totalQuestions = visibleQuestions.length;
  const answeredCount = visibleQuestions.filter(q => answers[q.id] !== undefined).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const currentQuestion = visibleQuestions[currentQ];

  const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2;

  /* actions */
  const startQuiz = useCallback((preview = false) => {
    setPreviewMode(preview);
    setAnswers({});
    setCurrentQ(0);
    setDebugForceType(null);
    setShuffledQuestions(buildShuffledQuestions());
  }, []);

  const answer = useCallback((qId: string, value: number) => {
    setAnswers(prev => {
      const next = { ...prev, [qId]: value };
      // If drink_gate_q1 is not "drinking" (3), remove drink_gate_q2 answer
      if (qId === 'drink_gate_q1' && value !== 3) {
        delete next['drink_gate_q2'];
      }
      return next;
    });
  }, []);

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
    (): ComputeResultOutput => computeResult(answers, drunkTriggered, debugForceType),
    [answers, drunkTriggered, debugForceType],
  );

  return {
    shuffledQuestions,
    answers,
    currentQ,
    previewMode,
    debugForceType,

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
