import { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedValue: number | undefined;
  previewMode: boolean;
  onAnswer: (questionId: string, value: number) => void;
  direction: number; // 1 = forward (slide left), -1 = back (slide right)
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function QuestionCard({
  question,
  questionIndex,
  selectedValue,
  previewMode,
  onAnswer,
  direction,
}: QuestionCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = useCallback(
    (value: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onAnswer(question.id, value);
    },
    [onAnswer, question.id],
  );

  const badgeText = previewMode
    ? `# ${questionIndex + 1} · ${question.dim ?? '特殊题'}`
    : `# ${questionIndex + 1} · 维度已隐藏`;

  const optionCodes = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={questionIndex}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <p className="font-mono text-xs text-accent mb-3">{badgeText}</p>
        <p className="text-lg font-semibold text-gray-200 leading-relaxed mb-6">
          {question.text}
        </p>
        <div className="grid gap-2.5">
          {question.options.map((opt, i) => {
            const isSelected = selectedValue === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-colors cursor-pointer
                  ${
                    isSelected
                      ? 'border-accent bg-accent/[0.08] text-white'
                      : 'bg-surface-2 border-border text-gray-400 hover:border-[#444] hover:text-white'
                  }`}
              >
                <span
                  className={`font-mono text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0
                    ${isSelected ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent'}`}
                >
                  {optionCodes[i]}
                </span>
                <span className="text-sm leading-relaxed">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
