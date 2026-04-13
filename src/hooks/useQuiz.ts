import { useState, useMemo, useCallback } from 'react';
import type { Question } from '../data/testConfig';
import { useTestConfig } from '../data/testConfig';
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
  const config = useTestConfig();
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [debugForceType, setDebugForceType] = useState<string | null>(null);

  // Love test: gate and trigger are the same question (ex_gate, value 3)
  // SBTI: gate is drink_gate_q1 (value 3), trigger is drink_gate_q2 (value 2)
  const hasFollowUp = config.gateQuestionId !== config.hiddenTriggerQuestionId;

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
  const answeredCount = visibleQuestions.filter(q => answers[q.id] !== undefined).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const progress = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const currentQuestion = visibleQuestions[currentQ];

  const hiddenTriggered = answers[config.hiddenTriggerQuestionId] === config.hiddenTriggerValue;

  /* actions */
  const startQuiz = useCallback((preview = false) => {
    setPreviewMode(preview);
    setAnswers({});
    setCurrentQ(0);
    setDebugForceType(null);
    setShuffledQuestions(
      buildShuffledQuestions(config.questions, config.specialQuestions[0]),
    );
  }, [config]);

  const answer = useCallback((qId: string, value: number) => {
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
    (): ComputeResultOutput => computeResult(answers, hiddenTriggered, config, debugForceType),
    [answers, hiddenTriggered, config, debugForceType],
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
