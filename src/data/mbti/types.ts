import type { TypeDef, NormalType, RarityInfo } from '../testConfig';

// Main type -> { cn: 中文名, archetype: 原型, rarityPct: 理论占比 % }
const MAIN_TYPES = {
  INTJ: { cn: '\u5efa\u7b51\u5e08',   archetype: 'Architect',   rarityPct: 2.1 },
  INTP: { cn: '\u903b\u8f91\u5b66\u5bb6', archetype: 'Logician',    rarityPct: 3.3 },
  ENTJ: { cn: '\u6307\u6325\u5b98',   archetype: 'Commander',   rarityPct: 1.8 },
  ENTP: { cn: '\u8fa9\u8bba\u5bb6',   archetype: 'Debater',     rarityPct: 3.2 },
  INFJ: { cn: '\u63d0\u5021\u8005',   archetype: 'Advocate',    rarityPct: 1.5 },
  INFP: { cn: '\u8c03\u505c\u8005',   archetype: 'Mediator',    rarityPct: 4.4 },
  ENFJ: { cn: '\u4e3b\u4eba\u516c',   archetype: 'Protagonist', rarityPct: 2.5 },
  ENFP: { cn: '\u7ade\u9009\u8005',   archetype: 'Campaigner',  rarityPct: 8.1 },
  ISTJ: { cn: '\u7269\u6d41\u5e08',   archetype: 'Logistician', rarityPct: 11.6 },
  ISFJ: { cn: '\u5b88\u536b\u8005',   archetype: 'Defender',    rarityPct: 13.8 },
  ESTJ: { cn: '\u603b\u7ecf\u7406',   archetype: 'Executive',   rarityPct: 8.7 },
  ESFJ: { cn: '\u6267\u653f\u5b98',   archetype: 'Consul',      rarityPct: 12.0 },
  ISTP: { cn: '\u9274\u8d4f\u5bb6',   archetype: 'Virtuoso',    rarityPct: 5.4 },
  ISFP: { cn: '\u63a2\u9669\u5bb6',   archetype: 'Adventurer',  rarityPct: 8.8 },
  ESTP: { cn: '\u4f01\u4e1a\u5bb6',   archetype: 'Entrepreneur',rarityPct: 4.3 },
  ESFP: { cn: '\u8868\u6f14\u8005',   archetype: 'Entertainer', rarityPct: 8.5 },
} as const;

export const TYPE_LIBRARY: Record<string, TypeDef> = (() => {
  const lib: Record<string, TypeDef> = {};
  (Object.keys(MAIN_TYPES) as Array<keyof typeof MAIN_TYPES>).forEach((main) => {
    const meta = MAIN_TYPES[main];
    (['A', 'T'] as const).forEach((suffix) => {
      const code = `${main}-${suffix}`;
      lib[code] = {
        code,
        cn: `${meta.cn} \u00b7 ${suffix === 'A' ? '\u81ea\u4fe1\u578b' : '\u52a8\u8361\u578b'}`,
        intro: '',
        desc: '',
      };
    });
  });
  return lib;
})();

export const NORMAL_TYPES: NormalType[] = Object.keys(TYPE_LIBRARY).map((code) => ({
  code,
  pattern: code,
}));

function starsFor(pct: number): number {
  if (pct < 1) return 5;
  if (pct < 3) return 4;
  if (pct < 8) return 3;
  if (pct < 15) return 2;
  return 1;
}

function rarityLabel(pct: number): string {
  if (pct < 1) return '\u7a00\u6709';
  if (pct < 3) return '\u5c11\u89c1';
  if (pct < 8) return '\u666e\u901a';
  if (pct < 15) return '\u5e38\u89c1';
  return '\u5f88\u5e38\u89c1';
}

export const TYPE_RARITY: Record<string, RarityInfo> = (() => {
  const map: Record<string, RarityInfo> = {};
  (Object.keys(MAIN_TYPES) as Array<keyof typeof MAIN_TYPES>).forEach((main) => {
    const meta = MAIN_TYPES[main];
    const splitPct = meta.rarityPct / 2;
    (['A', 'T'] as const).forEach((suffix) => {
      const code = `${main}-${suffix}`;
      map[code] = {
        pct: splitPct,
        stars: starsFor(splitPct),
        label: rarityLabel(splitPct),
      };
    });
  });
  return map;
})();
