import type { CompatEntry, CompatResult } from '../testConfig';
import { CAT_CONTENT } from './content';

function lettersDiff(a: string, b: string): number {
  let diff = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) diff += 1;
  return diff;
}

export const COMPATIBILITY: Record<string, CompatEntry> = (() => {
  const out: Record<string, CompatEntry> = {};
  const codes = Object.keys(CAT_CONTENT);
  for (let i = 0; i < codes.length; i++) {
    for (let j = i + 1; j < codes.length; j++) {
      const a = codes[i];
      const b = codes[j];
      const diff = lettersDiff(a, b);
      if (diff === 1) {
        out[`${a}+${b}`] = {
          type: 'soulmate',
          say: '只差一个字母，天然能睡在同一个纸箱里。',
        };
      } else if (diff === 4) {
        out[`${a}+${b}`] = {
          type: 'rival',
          say: '四维全反，看见彼此就想拱起背。',
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
      say: '同款猫咪——两只一样的猫能互相陪伴，也能互相嫌弃。',
    };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) return { type: entry.type, say: entry.say };

  const diff = lettersDiff(codeA, codeB);
  if (diff === 2 || diff === 3) {
    return {
      type: 'normal',
      say: '互不打扰地住一个屋，就是最高评价。',
    };
  }
  return { type: 'normal', say: '两只猫能共处一室，已经是关系很好了。' };
}
