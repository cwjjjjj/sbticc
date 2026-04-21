import type { CompatEntry, CompatResult } from '../testConfig';
import { DOG_CONTENT } from './content';

/**
 * DogTI 按 MBTI 字母距离生成兼容度 — 不手写 16×16 矩阵。
 * - 全 4 字母相反 → 欢喜冤家（rival）
 * - 3 个字母相同 → 灵魂伴侣（soulmate）
 * - 1 个相同     → 欢喜冤家（rival）
 * - 2 个相同     → 普通（normal）
 * - 完全一致     → 镜像（mirror）
 *
 * COMPATIBILITY 保持空字典 — ResultPage 会根据 getCompatibility 动态生成。
 * 为了兼容 ResultPage 里枚举 COMPATIBILITY keys 的分支，补一组显式的
 * soulmate/rival 对（每个主码各挑一个强组合）。
 */

function lettersDiff(a: string, b: string): number {
  let diff = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) diff += 1;
  return diff;
}

export const COMPATIBILITY: Record<string, CompatEntry> = (() => {
  const out: Record<string, CompatEntry> = {};
  const codes = Object.keys(DOG_CONTENT);
  for (let i = 0; i < codes.length; i++) {
    for (let j = i + 1; j < codes.length; j++) {
      const a = codes[i];
      const b = codes[j];
      const diff = lettersDiff(a, b);
      if (diff === 1) {
        out[`${a}+${b}`] = {
          type: 'soulmate',
          say: '只差一点点的默契，刚好补上彼此的缝。',
        };
      } else if (diff === 4) {
        out[`${a}+${b}`] = {
          type: 'rival',
          say: '四维全反，天生互相看不顺眼，但也可能被彼此勾住。',
        };
      }
    }
  }
  return out;
})();

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return {
      type: 'mirror',
      say: '同款狗狗——照镜子既可以惺惺相惜，也可以互相看穿。',
    };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) return { type: entry.type, say: entry.say };

  const diff = lettersDiff(codeA, codeB);
  if (diff === 2 || diff === 3) {
    return {
      type: 'normal',
      say: '有交集也有分歧，磨一磨也能处。',
    };
  }
  return { type: 'normal', say: '两只狗凑一起，就是普通朋友的样子。' };
}
