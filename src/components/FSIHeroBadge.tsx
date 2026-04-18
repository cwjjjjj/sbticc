import { motion } from 'framer-motion';

interface FSIHeroBadgeProps {
  typeCode: string;      // e.g. 'COPYX', 'BOSSY'
  typeCn: string;
}

/**
 * "家庭出厂铭牌"风格贴纸，放在结果页顶部。
 * 视觉要求（spec §7.2）：暖色系旧相片质感；禁用黑白监控/破碎镜等冷峻元素。
 */
export default function FSIHeroBadge({ typeCode, typeCn }: FSIHeroBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex flex-wrap items-center justify-center gap-2"
    >
      <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 font-bold tracking-[0.2em] uppercase">
        FAMILY SURVIVOR INDEX
      </span>
      <span className="text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-border text-muted">
        出厂型号 · {typeCode}
      </span>
      <span className="text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-border text-muted">
        状态 · 幸存
      </span>
      {/* typeCn 作为 accessible label，视觉主 title 仍由 ResultPage 渲染 */}
      <span className="sr-only">{typeCn}</span>
    </motion.div>
  );
}
