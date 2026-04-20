// src/components/GSTIHeroBadge.tsx
import type { Gender } from '../data/testConfig';

interface GSTIHeroBadgeProps {
  gender: Gender;
  typeCode: string;    // e.g. "M_GOLD" or "F_PHNX"
  typeCn: string;       // 中文别名
}

const GENDER_LABEL: Record<Gender, string> = {
  male: '男',
  female: '女',
  unspecified: '?',
};

const POOL_LABEL: Record<string, string> = {
  M: '女性物种',
  F: '男性物种',
  U: '无池',
};

export default function GSTIHeroBadge({ gender, typeCode, typeCn }: GSTIHeroBadgeProps) {
  const poolKey = typeCode.startsWith('M_') ? 'M' : typeCode.startsWith('F_') ? 'F' : 'U';
  const poolLabel = POOL_LABEL[poolKey];

  return (
    <div className="inline-flex items-center gap-3 bg-surface/60 backdrop-blur-md border border-border rounded-full px-4 py-2 mb-4">
      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold tracking-wider">
        GSTI · SWAP
      </span>
      <span className="text-sm text-white font-mono">
        {GENDER_LABEL[gender]}
      </span>
      <span className="text-muted text-xs">→</span>
      <span className="text-sm text-white">
        {poolLabel}
      </span>
    </div>
  );
}
