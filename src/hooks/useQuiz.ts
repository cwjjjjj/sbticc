import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Question, TestConfig } from '../data/testConfig';
import { useTestConfig } from '../data/testConfig';
import { buildShuffledQuestions, getVisibleQuestions } from '../utils/quiz';
import { computeResult, type ComputeResultOutput } from '../utils/matching';

export interface UseQuizReturn {
  /* state */
  shuffledQuestions: Question[];
  answers: Record<string, number | number[]>;
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
  answer: (qId: string, value: number | number[]) => void;
  goNext: () => void;
  goPrev: () => void;
  setDebugForceType: (code: string | null) => void;
  getResult: () => ComputeResultOutput;

  /* draft */
  checkDraft: () => { exists: boolean; answered: number; total: number } | null;
  resumeDraft: (config: TestConfig) => boolean;
  clearDraft: () => void;
}

export function useQuiz(options?: { draftKey?: string }): UseQuizReturn {
  const draftKey = options?.draftKey;
  const config = useTestConfig();
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [debugForceType, setDebugForceType] = useState<string | null>(null);

  // -- Draft: debounced save effect
  useEffect(() => {
    if (!draftKey) return;
    const t = setTimeout(() => {
      const draft = {
        version: 1,
        answers,
        questionOrder: shuffledQuestions.map(q => q.id),
        currentIndex: currentQ,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [draftKey, answers, shuffledQuestions, currentQ]);

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
  const startQuiz = useCallback((preview = false) => {
    setPreviewMode(preview);
    setAnswers({});
    setCurrentQ(0);
    setDebugForceType(null);
    setShuffledQuestions(
      buildShuffledQuestions(config.questions, config.specialQuestions[0]),
    );
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
      const res = computeResult(answers, hiddenTriggered, config, debugForceType);
      // Clear draft on quiz completion
      if (draftKey) {
        try { localStorage.removeItem(draftKey); } catch {}
      }
      return res;
    },
    [answers, hiddenTriggered, config, debugForceType, draftKey],
  );

  // -- Draft helpers
  const checkDraft = useCallback((): { exists: boolean; answered: number; total: number } | null => {
    if (!draftKey) return null;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return null;
      const d = JSON.parse(raw);
      const ageMs = Date.now() - (d.savedAt || 0);
      if (ageMs > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(draftKey);
        return null;
      }
      return {
        exists: true,
        answered: Object.keys(d.answers || {}).length,
        total: (d.questionOrder || []).length,
      };
    } catch {
      return null;
    }
  }, [draftKey]);

  const resumeDraft = useCallback((cfg: TestConfig): boolean => {
    if (!draftKey) return false;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return false;
      const d = JSON.parse(raw);
      const allQs = [...cfg.questions, ...cfg.specialQuestions];
      const byId = Object.fromEntries(allQs.map(q => [q.id, q]));
      const restored = (d.questionOrder as string[]).map((id: string) => byId[id]).filter(Boolean);
      setShuffledQuestions(restored);
      setAnswers(d.answers || {});
      setCurrentQ(d.currentIndex || 0);
      return true;
    } catch {
      return false;
    }
  }, [draftKey]);

  const clearDraft = useCallback(() => {
    if (draftKey) {
      try { localStorage.removeItem(draftKey); } catch {}
    }
  }, [draftKey]);

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

    checkDraft,
    resumeDraft,
    clearDraft,
  };
}
