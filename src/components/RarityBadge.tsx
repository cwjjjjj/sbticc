import { motion } from 'framer-motion';
import type { RarityData } from '../hooks/useRarity';

interface RarityBadgeProps {
  rarity: RarityData;
  onClick?: () => void;
}

const TIER_LABEL: Record<string, { cn: string; color: string; glow: string }> = {
  legendary: { cn: '稀世', color: '#ffd700', glow: '0 0 20px rgba(255, 215, 0, 0.6)' },
  rare:      { cn: '罕见', color: '#ff3b3b', glow: '0 0 16px rgba(255, 59, 59, 0.5)' },
  uncommon:  { cn: '少见', color: '#c0c0c0', glow: '0 0 12px rgba(192, 192, 192, 0.4)' },
  common:    { cn: '普通', color: '#888888', glow: 'none' },
};

export default function RarityBadge({ rarity, onClick }: RarityBadgeProps) {
  if (!rarity.loaded) {
    return (
      <div className="inline-block px-3 py-1.5 rounded-lg bg-surface-2 text-muted text-xs font-mono animate-pulse">
        计算稀有度...
      </div>
    );
  }
  if (rarity.error || rarity.totalTests === 0) {
    return null;
  }

  const cfg = TIER_LABEL[rarity.tier];
  const percentStr = rarity.percentile < 1 ? '< 1' : rarity.percentile.toFixed(1);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm cursor-pointer transition-transform hover:scale-105"
      style={{
        borderColor: cfg.color + '66',
        background: cfg.color + '11',
        color: cfg.color,
        boxShadow: cfg.glow,
      }}
      aria-label={`稀有度 ${cfg.cn}: 前 ${percentStr}% 稀有`}
    >
      <span className="font-bold">前 {percentStr}%</span>
      <span className="opacity-70">·</span>
      <span className="font-extrabold tracking-widest">{cfg.cn}</span>
    </motion.button>
  );
}
