import { motion } from 'framer-motion';

interface MPIHeroBadgeProps {
  typeCode: string;      // e.g. 'LIVE!', 'CHEAP', 'ZERO$'
  typeCn: string;
}

/**
 * Show 1-2 contextual "小票贴纸" based on type semantics.
 * Gold-on-dark aesthetic (spec §7.1), NOT mimicking any payment UI (spec §7.4).
 */
function stickersForType(code: string): string[] {
  const base = ['MONEY PERSONA INDEX'];
  if (code === 'ZERO$')  return [...base, '暂无交易', '账户休眠中'];
  if (code === 'LIVE!')  return [...base, '限时 3 分钟'];
  if (code === 'HAULX')  return [...base, '今日消费 N 笔'];
  if (code === 'CHEAP' || code === 'BILIB') return [...base, '已省 0.01 元'];
  if (code === 'STEAL')  return [...base, '已薅'];
  if (code === 'RETRN')  return [...base, '已退货'];
  if (code === '2HAND' || code === 'FLIPR') return [...base, '二级市场出货'];
  if (code === 'GOLDN')  return [...base, '按克计价'];
  if (code === 'PREMM')  return [...base, '会员权益生效中'];
  if (code === 'BOSSX')  return [...base, '账单稍后送达'];
  if (code === 'LUXUR')  return [...base, '分期有风险·此处不提供'];
  if (code === 'SETUP')  return [...base, '已开启消费降级模式'];
  if (code === 'FOMO+')  return [...base, '跨零点秒杀'];
  if (code === 'GIFTR')  return [...base, '纪念日自动提醒'];
  if (code === 'INSTA')  return [...base, '别人没有的'];
  if (code === 'CHAR0')  return [...base, '情分已到账'];
  if (code === 'NUBOY')  return [...base, '无用但美'];
  if (code === 'MIXDR')  return [...base, '杂项消费'];
  return [...base, '已结账'];
}

export default function MPIHeroBadge({ typeCode, typeCn }: MPIHeroBadgeProps) {
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
              ? 'text-[10px] px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-400 font-bold tracking-[0.2em] uppercase border border-yellow-500/30'
              : 'text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-yellow-500/20 text-yellow-200/80'
          }
        >
          {label}
        </span>
      ))}
      <span className="sr-only">{typeCn}</span>
    </motion.div>
  );
}
