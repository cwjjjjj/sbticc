// src/components/GenderPicker.tsx
import { motion } from 'framer-motion';
import type { Gender } from '../data/testConfig';

interface GenderPickerProps {
  onPick: (g: Gender) => void;
  onClose?: () => void;
}

export default function GenderPicker({ onPick, onClose }: GenderPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-bg flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-3">先说说你的性别</h2>
        <p className="text-sm text-muted mb-2">
          这不是给你贴标签——
        </p>
        <p className="text-sm text-muted mb-10">
          这是决定系统用<strong className="text-white">反串</strong>的哪一套词扣在你头上。
        </p>

        <div className="space-y-3">
          <GenderButton label="我是男生" hint="测出的全是女性物种（捞女 / 娇妻 / 绿茶 / 扶妹魔…）"
            onClick={() => onPick('male')} />
          <GenderButton label="我是女生" hint="测出的全是男性物种（凤凰男 / 妈宝男 / 普信男 / 舔狗…）"
            onClick={() => onPick('female')} />
          <GenderButton label="不告诉你" hint="两池通吃，结果更不可预测"
            onClick={() => onPick('unspecified')} />
        </div>

        <p className="text-xs text-[#666] mt-10 leading-relaxed px-4">
          本测试是对性别标签的戏谑反串，所有结果都是娱乐段子，不代表对任何人的真实评价。
        </p>

        {onClose && (
          <button onClick={onClose} className="mt-6 text-muted underline text-sm">
            再想想
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function GenderButton({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-left hover:border-accent/60 hover:bg-surface/80 transition-colors group cursor-pointer"
    >
      <div className="text-white font-semibold mb-1 group-hover:text-accent transition-colors">
        {label}
      </div>
      <div className="text-xs text-muted leading-relaxed">{hint}</div>
    </button>
  );
}
