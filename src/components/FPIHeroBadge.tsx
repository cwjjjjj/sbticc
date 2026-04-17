import { motion } from 'framer-motion';

interface FPIHeroBadgeProps {
  typeCode: string;      // e.g. '3DAYS', 'BLOCK', '0POST'
  typeCn: string;
}

/**
 * Show 1-2 contextual "朋友圈截图贴纸" based on type semantics.
 * We DON'T mimic WeChat UI (spec 7.1 — avoid trademark confusion).
 */
function stickersForType(code: string): string[] {
  const base = ['FEED PERSONA INDEX'];
  if (code === '0POST') return [...base, '朋友圈坟墓', '暂未营业'];
  if (code === '3DAYS') return [...base, '仅三天可见'];
  if (code === 'BLOCK') return [...base, '分组可见'];
  if (code === 'GHOST' || code === 'SUBMR' || code === 'LIKER') return [...base, '已读不回'];
  if (code === 'FILTR' || code === 'QSLIF' || code === 'REDBK') return [...base, '精修投稿'];
  if (code === 'EMO-R') return [...base, '深夜发表'];
  if (code === 'SELLR') return [...base, '广告位 · 长期招租'];
  return [...base, '刚刚 · 已发布'];
}

export default function FPIHeroBadge({ typeCode, typeCn }: FPIHeroBadgeProps) {
  const stickers = stickersForType(typeCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex flex-wrap items-center justify-center gap-2"
    >
      {stickers.map((label, i) => (
        <span
          key={`${typeCode}-sticker-${i}`}
          className={
            i === 0
              ? 'text-[10px] px-2 py-1 rounded-full bg-accent/20 text-accent font-bold tracking-[0.2em] uppercase'
              : 'text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-border text-muted'
          }
        >
          {label}
        </span>
      ))}
      {/* 保留 typeCn 作为 accessible label（视觉上不重复，交给主 title 块） */}
      <span className="sr-only">{typeCn}</span>
    </motion.div>
  );
}
