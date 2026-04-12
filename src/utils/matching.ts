import { dimensionMeta, dimensionOrder } from '../data/dimensions';
import { questions, DRUNK_TRIGGER_QUESTION_ID } from '../data/questions';
import { TYPE_LIBRARY, NORMAL_TYPES, type TypeDef } from '../data/types';

/* ---------- helpers ---------- */

export function sumToLevel(score: number): string {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

export function levelNum(level: string): number {
  return ({ L: 1, M: 2, H: 3 } as Record<string, number>)[level] ?? 2;
}

export function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('');
}

/* ---------- result types ---------- */

export interface RankedType extends TypeDef {
  pattern: string;
  distance: number;
  exact: number;
  similarity: number;
}

export interface ComputeResultOutput {
  rawScores: Record<string, number>;
  levels: Record<string, string>;
  ranked: RankedType[];
  bestNormal: RankedType;
  finalType: RankedType | TypeDef;
  modeKicker: string;
  badge: string;
  sub: string;
  special: boolean;
  secondaryType: RankedType | null;
}

/* ---------- main algorithm ---------- */

export function computeResult(
  answers: Record<string, number>,
  drunkTriggered: boolean,
  debugForceType?: string | null,
): ComputeResultOutput {
  // 1. Sum raw scores per dimension
  const rawScores: Record<string, number> = {};
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0; });

  questions.forEach(q => {
    rawScores[q.dim!] += Number(answers[q.id] || 0);
  });

  // 2. Convert to L/M/H levels
  const levels: Record<string, string> = {};
  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score);
  });

  // 3. Build user vector (15 values)
  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));

  // 4. Compare against each NORMAL_TYPE pattern
  const ranked: RankedType[] = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum);
    let distance = 0;
    let exact = 0;
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i]);
      distance += diff;
      if (diff === 0) exact += 1;
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
    return {
      ...type,
      ...TYPE_LIBRARY[type.code],
      distance,
      exact,
      similarity,
    };
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.exact !== a.exact) return b.exact - a.exact;
    return b.similarity - a.similarity;
  });

  // 5. Pick best and apply special cases
  const bestNormal = ranked[0];

  let finalType: RankedType | TypeDef;
  let modeKicker = '\u4f60\u7684\u4e3b\u7c7b\u578b';
  let badge = `\u5339\u914d\u5ea6 ${bestNormal.similarity}% \u00b7 \u7cbe\u51c6\u547d\u4e2d ${bestNormal.exact}/15 \u7ef4`;
  let sub = '\u7ef4\u5ea6\u547d\u4e2d\u5ea6\u8f83\u9ad8\uff0c\u5f53\u524d\u7ed3\u679c\u53ef\u89c6\u4e3a\u4f60\u7684\u7b2c\u4e00\u4eba\u683c\u753b\u50cf\u3002';
  let special = false;
  let secondaryType: RankedType | null = null;

  if (debugForceType && TYPE_LIBRARY[debugForceType]) {
    finalType = { ...TYPE_LIBRARY[debugForceType], similarity: 100, exact: 15, distance: 0 } as RankedType;
    modeKicker = '\u8c03\u8bd5\u6307\u5b9a\u4eba\u683c';
    badge = '\u8c03\u8bd5\u6a21\u5f0f \u00b7 \u624b\u52a8\u6307\u5b9a';
    sub = '\u5f53\u524d\u7ed3\u679c\u7531\u8c03\u8bd5\u5de5\u5177\u680f\u624b\u52a8\u6307\u5b9a\uff0c\u975e\u7b54\u9898\u5339\u914d\u3002';
    special = true;
  } else if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK;
    secondaryType = bestNormal;
    modeKicker = '\u9690\u85cf\u4eba\u683c\u5df2\u6fc0\u6d3b';
    badge = '\u5339\u914d\u5ea6 100% \u00b7 \u9152\u7cbe\u5f02\u5e38\u56e0\u5b50\u5df2\u63a5\u7ba1';
    sub = '\u4e59\u9187\u4eb2\u548c\u6027\u8fc7\u5f3a\uff0c\u7cfb\u7edf\u5df2\u76f4\u63a5\u8df3\u8fc7\u5e38\u89c4\u4eba\u683c\u5ba1\u5224\u3002';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH;
    modeKicker = '\u7cfb\u7edf\u5f3a\u5236\u5156\u5e95';
    badge = `\u6807\u51c6\u4eba\u683c\u5e93\u6700\u9ad8\u5339\u914d\u4ec5 ${bestNormal.similarity}%`;
    sub = '\u6807\u51c6\u4eba\u683c\u5e93\u5bf9\u4f60\u7684\u8111\u56de\u8def\u96c6\u4f53\u7f62\u5de5\u4e86\uff0c\u4e8e\u662f\u7cfb\u7edf\u628a\u4f60\u5f3a\u5236\u5206\u914d\u7ed9\u4e86 HHHH\u3002';
    special = true;
  } else {
    finalType = bestNormal;
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType,
  };
}
