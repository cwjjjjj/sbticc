import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterstitialProps {
  onComplete: () => void;
}

export default function Interstitial({ onComplete }: InterstitialProps) {
  const [countdown, setCountdown] = useState(5);
  const [showButton, setShowButton] = useState(false);

  // Trigger vignette ad on mount (natural transition point)
  useEffect(() => {
    try {
      const s = document.createElement('script');
      s.dataset.zone = '10876468';
      s.src = 'https://n6wxm.com/vignette.min.js';
      document.body.appendChild(s);
      return () => { try { document.body.removeChild(s); } catch {} };
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/90 flex flex-col items-center justify-center"
      >
        <span className="text-3xl mb-5">🔮</span>
        <p className="text-xl font-semibold mb-2">结果生成中...</p>
        <p className="text-sm text-[#aaa] mb-6">人格分析需要一点时间</p>

        {!showButton && (
          <motion.span
            key={countdown}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-accent font-mono"
          >
            {countdown}
          </motion.span>
        )}

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClick}
              className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              查看我的结果
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
