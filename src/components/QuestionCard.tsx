import { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../data/testConfig';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedValue: number | number[] | undefined;
  previewMode: boolean;
  onAnswer: (questionId: string, value: number | number[]) => void;
  direction: number;
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
  const isMulti = !!question.multiSelect;

  // For multi-select, selectedValue stores option indexes so equal score
  // values do not make multiple options look selected together.
  const selectedSet = new Set(
    isMulti
      ? (Array.isArray(selectedValue) ? selectedValue : [])
      : [],
  );

  const handleSingleSelect = useCallback(
    (value: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onAnswer(question.id, value);
    },
    [onAnswer, question.id],
  );

  const handleMultiToggle = useCallback(
    (optionIndex: number) => {
      const current = Array.isArray(selectedValue) ? [...selectedValue] : [];
      const idx = current.indexOf(optionIndex);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(optionIndex);
      }
      onAnswer(question.id, current);
    },
    [onAnswer, question.id, selectedValue],
  );

  const badgeText = previewMode
    ? `# ${questionIndex + 1} · ${question.dim ?? '特殊题'}`
    : `# ${questionIndex + 1}`;

  const optionCodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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
        <div className="flex items-center gap-2 mb-3">
          <p className="font-mono text-xs text-accent">{badgeText}</p>
          {isMulti && (
            <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded-md">
              可多选
            </span>
          )}
        </div>
        <p className="text-lg font-semibold text-gray-200 leading-relaxed mb-6">
          {question.text}
        </p>
        <div className="grid gap-2.5">
          {question.options.map((opt, i) => {
            const isSelected = isMulti
              ? selectedSet.has(i)
              : selectedValue === opt.value;

            return (
              <button
                key={`${i}-${opt.value}`}
                onClick={() =>
                  isMulti
                    ? handleMultiToggle(i)
                    : handleSingleSelect(opt.value)
                }
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
                  {isMulti
                    ? (isSelected ? '✓' : optionCodes[i])
                    : optionCodes[i]}
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
