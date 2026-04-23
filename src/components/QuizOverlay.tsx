import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import GoogleAd from './GoogleAd';
import type { UseQuizReturn } from '../hooks/useQuiz';
import { useTestConfig } from '../data/testConfig';
import { trackEvent } from '../hooks/useAnalytics';

const SEGMENT_CHECKPOINTS = [
  { ratio: 1 / 3, label: '基础画像完成' },
  { ratio: 2 / 3, label: '深水区清关' },
] as const;

interface QuizOverlayProps {
  quiz: UseQuizReturn;
  onSubmit: () => void;
  onBack: () => void;
}

export default function QuizOverlay({ quiz, onSubmit, onBack }: QuizOverlayProps) {
  const config = useTestConfig();
  const [direction, setDirection] = useState(1);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevQRef = useRef(quiz.currentQ);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownCheckpoints = useRef<Set<number>>(new Set());

  const {
    visibleQuestions,
    answers,
    currentQ,
    totalQuestions,
    answeredCount,
    allAnswered,
    previewMode,
    currentQuestion,
    answer,
    goNext,
    goPrev,
  } = quiz;

  const handleAnswer = useCallback(
    (qId: string, value: number | number[]) => {
      // Guard: ignore stale clicks. Framer-motion's AnimatePresence keeps the
      // exiting QuestionCard mounted during its exit animation (~250ms), so a
      // rapid click lands on the OLD question's options. Without this guard,
      // the stale answer would reset the auto-advance timer and cause the
      // current question to be skipped. See BUG1 (2026-04-19).
      if (currentQuestion && qId !== currentQuestion.id) return;

      answer(qId, value);
      trackEvent('quiz_q', { testId: config.id, qIndex: currentQ });
      // Auto-advance after 500ms for single-select only, not on last question.
      const isMulti = currentQuestion?.multiSelect;
      if (!isMulti) {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        if (currentQ < totalQuestions - 1) {
          autoAdvanceTimer.current = setTimeout(() => {
            setDirection(1);
            goNext();
          }, 500);
        }
      }
    },
    [answer, goNext, currentQ, totalQuestions, currentQuestion, config.id],
  );

  const handlePrev = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setDirection(-1);
    goPrev();
  }, [goPrev]);

  const handleNext = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setDirection(1);
    goNext();
  }, [goNext]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // Track direction from external currentQ changes
  useEffect(() => {
    if (currentQ > prevQRef.current) setDirection(1);
    else if (currentQ < prevQRef.current) setDirection(-1);
    prevQRef.current = currentQ;
  }, [currentQ]);

  // Segment milestone toast: fire when answeredCount first crosses 1/3 or 2/3
  useEffect(() => {
    if (totalQuestions < 6) return; // too short to bother segmenting
    const ratio = answeredCount / totalQuestions;
    for (let i = 0; i < SEGMENT_CHECKPOINTS.length; i++) {
      const cp = SEGMENT_CHECKPOINTS[i];
      if (ratio >= cp.ratio && !shownCheckpoints.current.has(i)) {
        shownCheckpoints.current.add(i);
        setToast(cp.label);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 1800);
      }
    }
  }, [answeredCount, totalQuestions]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const isCurrentAnswered = currentQuestion
    ? (() => {
        const a = answers[currentQuestion.id];
        if (a === undefined) return false;
        if (Array.isArray(a)) return a.length > 0;
        return true;
      })()
    : false;
  const isFirstQuestion = currentQ === 0;
  const isLastQuestion = currentQ === totalQuestions - 1;

  const hintText = allAnswered
    ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
    : '全选完才会放行。世界已经够乱了，起码把题做完整。';

  return (
    <div className="fixed inset-0 z-[200] bg-bg overflow-y-auto">
      {/* Segment milestone toast (non-blocking, 1.8s) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[250] px-4 py-2 rounded-full bg-accent text-white text-xs font-bold shadow-lg pointer-events-none"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[680px] mx-auto px-4 py-6">
        {/* Top bar: back button + progress */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="text-sm text-muted hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            ← 返回首页
          </button>
          <div className="flex-1">
            <ProgressBar current={answeredCount} total={totalQuestions} />
          </div>
        </div>

        {/* Question */}
        <div className="mt-6 min-h-[300px]">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQ}
              totalQuestions={totalQuestions}
              selectedValue={answers[currentQuestion.id]}
              previewMode={previewMode}
              onAnswer={handleAnswer}
              direction={direction}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrev}
            disabled={isFirstQuestion}
            className={`px-5 py-2.5 rounded-xl text-sm border transition-colors
              ${
                isFirstQuestion
                  ? 'bg-surface-2 text-muted/40 border-border cursor-not-allowed'
                  : 'bg-surface-2 text-muted border-border hover:text-white hover:border-[#444] cursor-pointer'
              }`}
          >
            上一题
          </button>

          <span className="font-mono text-sm text-muted">
            {currentQ + 1} / {totalQuestions}
          </span>

          {!isLastQuestion && (
            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${
                  isCurrentAnswered
                    ? 'bg-accent text-white hover:bg-accent/90 cursor-pointer'
                    : 'bg-accent/40 text-white/40 cursor-not-allowed'
                }`}
            >
              下一题
            </button>
          )}

          {isLastQuestion && (
            <div className="w-[72px]" /> /* spacer to keep layout balanced */
          )}
        </div>

        {/* Submit area */}
        {isLastQuestion && (
          <div className="mt-10 text-center">
            <p className="text-sm text-muted mb-5">{hintText}</p>
            <button
              onClick={onSubmit}
              disabled={!allAnswered}
              className={`px-8 py-3.5 rounded-xl text-sm font-extrabold transition-colors mb-3
                ${
                  allAnswered
                    ? 'bg-white text-black hover:bg-gray-100 cursor-pointer'
                    : 'bg-white/20 text-white/30 cursor-not-allowed'
                }`}
            >
              提交并查看结果
            </button>
          </div>
        )}

        {/* Google AdSense — quiz bottom */}
        <div className="mt-6">
          <GoogleAd slot="2663671441" />
        </div>
      </div>
    </div>
  );
}
