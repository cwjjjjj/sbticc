import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RarityData } from '../hooks/useRarity';

interface RevealOverlayProps {
  rarity: RarityData;
  typeCn: string;
  typeCode: string;
  onComplete: () => void;
}

const TIER_CFG: Record<string, { cn: string; color: string }> = {
  legendary: { cn: '稀世',   color: '#ffd700' },
  rare:      { cn: '罕见',   color: '#ff3b3b' },
  uncommon:  { cn: '少见',   color: '#c0c0c0' },
  common:    { cn: '普通',   color: '#aaaaaa' },
};

export default function RevealOverlay({ rarity, typeCn, typeCode, onComplete }: RevealOverlayProps) {
  const [stage, setStage] = useState<'intro' | 'reveal' | 'done'>('intro');

  useEffect(() => {
    // Use a hard timeout so overlay always progresses even if rarity fails to load quickly.
    const t1 = setTimeout(() => setStage('reveal'), 1500);
    const t2 = setTimeout(() => setStage('done'), 4000);
    const t3 = setTimeout(() => onComplete(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const cfg = rarity.tier ? TIER_CFG[rarity.tier] : TIER_CFG.common;
  const hasRarity = rarity.loaded && !rarity.error && rarity.totalTests > 0;
  const percentStr = rarity.percentile < 1 ? '< 1' : rarity.percentile.toFixed(1);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[400] bg-bg flex flex-col items-center justify-center px-6"
        >
          {stage === 'intro' && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-lg text-[#aaa] mb-8"
              >
                你属于...
              </motion.p>
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-3 h-3 rounded-full bg-accent"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </>
          )}

          {stage === 'reveal' && (
            <>
              {hasRarity ? (
                <>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm font-mono text-[#888] mb-3 tracking-widest"
                  >
                    稀有度评定
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="text-7xl sm:text-8xl font-extrabold font-mono mb-2 text-center"
                    style={{ color: cfg.color, textShadow: `0 0 40px ${cfg.color}66` }}
                  >
                    前 {percentStr}%
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl sm:text-4xl font-extrabold tracking-[0.3em] mb-8"
                    style={{ color: cfg.color }}
                  >
                    {cfg.cn}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <p className="text-base text-[#aaa]">你的类型：</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {typeCn} <span className="font-mono text-accent ml-2">{typeCode}</span>
                    </p>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-sm font-mono text-[#888] mb-3 tracking-widest">你的类型</p>
                  <p className="text-5xl font-extrabold text-white mb-2">{typeCn}</p>
                  <p className="font-mono text-2xl text-accent">{typeCode}</p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
