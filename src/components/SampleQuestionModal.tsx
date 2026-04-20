import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../data/testConfig';

interface SampleQuestionModalProps {
  question: Question;
  onClose: () => void;
  onProceed: (qId: string, value: number | number[]) => void;
}

const optionCodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function SampleQuestionModal({
  question,
  onClose,
  onProceed,
}: SampleQuestionModalProps) {
  const isMulti = !!question.multiSelect;
  const [singleValue, setSingleValue] = useState<number | null>(null);
  const [multiSelected, setMultiSelected] = useState<number[]>([]);

  const selectedValue: number | number[] | null = isMulti ? multiSelected : singleValue;
  const canProceed = isMulti
    ? multiSelected.length > 0
    : singleValue !== null;

  const handleProceed = () => {
    if (!canProceed || selectedValue === null) return;
    onProceed(question.id, selectedValue as number | number[]);
  };

  const toggleMulti = (i: number) => {
    setMultiSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-surface border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
                  SAMPLE
                </span>
                <span className="text-xs text-muted">先试一题，不保存</span>
              </div>
              <button
                onClick={onClose}
                className="text-muted hover:text-white cursor-pointer text-lg leading-none"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>

            <p className="text-lg font-semibold text-white leading-relaxed mb-5">
              {question.text}
            </p>

            <div className="grid gap-2 mb-6">
              {question.options.map((opt, i) => {
                const isSelected = isMulti
                  ? multiSelected.includes(i)
                  : singleValue === opt.value;
                return (
                  <button
                    key={`${i}-${opt.value}`}
                    onClick={() =>
                      isMulti ? toggleMulti(i) : setSingleValue(opt.value)
                    }
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer
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
                      {isMulti ? (isSelected ? '✓' : optionCodes[i]) : optionCodes[i]}
                    </span>
                    <span className="text-sm leading-relaxed">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleProceed}
              disabled={!canProceed}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-colors
                ${
                  canProceed
                    ? 'bg-white text-black hover:bg-gray-100 cursor-pointer'
                    : 'bg-white/20 text-white/30 cursor-not-allowed'
                }`}
            >
              {canProceed ? '这答案我认，开始正式测试 →' : '先选一个答案'}
            </button>
            <p className="text-center text-xs text-muted mt-3">
              剩下的题会直接接上，刚选的答案已经记下了
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
