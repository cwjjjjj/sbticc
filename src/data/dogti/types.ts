import type { TypeDef, NormalType, RarityInfo } from '../testConfig';
import { DOG_CONTENT } from './content';

// 16 个 MBTI 主码，不带 A/T 后缀
const RARITY_PCT: Record<string, number> = {
  INTJ: 2.1, INTP: 3.3, ENTJ: 1.8, ENTP: 3.2,
  INFJ: 1.5, INFP: 4.4, ENFJ: 2.5, ENFP: 8.1,
  ISTJ: 11.6, ISFJ: 13.8, ESTJ: 8.7, ESFJ: 12.0,
  ISTP: 5.4, ISFP: 8.8, ESTP: 4.3, ESFP: 8.5,
};

function rarityLabel(pct: number): { stars: number; label: string } {
  if (pct < 2) return { stars: 5, label: '世间罕见' };
  if (pct < 4) return { stars: 4, label: '少数派' };
  if (pct < 7) return { stars: 3, label: '中坚' };
  if (pct < 10) return { stars: 2, label: '常见' };
  return { stars: 1, label: '主流人口' };
}

export const TYPE_LIBRARY: Record<string, TypeDef> = (() => {
  const lib: Record<string, TypeDef> = {};
  Object.entries(DOG_CONTENT).forEach(([code, c]) => {
    lib[code] = {
      code,
      cn: c.cn,
      intro: `${c.subname} — ${c.quote}`,
      desc: c.desc,
    };
  });
  return lib;
})();

// NORMAL_TYPES — 给 pattern 一个占位符，directTypeResolver 会绕过模式匹配。
// 保留数组是为了让 RankingPage / 其它组件能枚举完整类型清单。
export const NORMAL_TYPES: NormalType[] = Object.keys(DOG_CONTENT).map((code) => ({
  code,
  pattern: code,
}));

export const TYPE_RARITY: Record<string, RarityInfo> = (() => {
  const r: Record<string, RarityInfo> = {};
  Object.keys(DOG_CONTENT).forEach((code) => {
    const pct = RARITY_PCT[code] ?? 5;
    const meta = rarityLabel(pct);
    r[code] = { pct, stars: meta.stars, label: meta.label };
  });
  return r;
})();
