import { motion, AnimatePresence } from 'framer-motion';

interface FSIDisclaimerModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ACK_KEY = 'fsi_disclaimer_ack_v1';

/** 静态工具：外部调用以决定首次进入是否要弹浮层 */
export function hasAcknowledgedDisclaimer(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(ACK_KEY) === '1';
  } catch {
    return false;
  }
}

export function markDisclaimerAcknowledged(): void {
  try {
    window.localStorage.setItem(ACK_KEY, '1');
  } catch {
    // ignore storage failure
  }
}

/**
 * 测试开始前的免责浮层（spec §9.2）。
 * 文案原样落地，不可改。
 */
export default function FSIDisclaimerModal({ open, onConfirm, onCancel }: FSIDisclaimerModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fsi-disclaimer-title"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="max-w-md w-full rounded-2xl bg-[#1c1c1c] border border-border p-6 text-left"
          >
            <h2
              id="fsi-disclaimer-title"
              className="text-lg font-bold text-white mb-3"
            >
              这个测试会问一些关于家庭的问题
            </h2>
            <ul className="text-sm text-muted leading-relaxed space-y-2 mb-6">
              <li>· 你可以选"最接近"的选项，不用完美匹配</li>
              <li>· 你可以随时退出，不保存也没关系</li>
              <li>
                · 如果过程中情绪起伏较大，请先暂停；必要时联系专业心理支持
                （结果页下方有入口）
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  markDisclaimerAcknowledged();
                  onConfirm();
                }}
                className="flex-1 bg-white text-black py-3 px-5 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                知道了，开始测试
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-surface text-white border border-border py-3 px-5 rounded-xl hover:border-[#444] transition-colors cursor-pointer"
              >
                我再想想
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
