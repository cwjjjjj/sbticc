import { dimensionOrder } from '../data/dimensions';

const levelToNum: Record<string, number> = { L: 0, M: 1, H: 2 };
const numToLevel: string[] = ['L', 'M', 'H'];

export interface DecodedCompare {
  code: string;
  levels: Record<string, string>;
  similarity: number;
}

/**
 * Encode personality data into a base64 string for URL sharing.
 */
export function encodeCompare(
  code: string,
  levels: Record<string, string>,
  similarity: number,
): string {
  const dimStr = dimensionOrder
    .map(d => levelToNum[levels[d]])
    .join('');
  return btoa(JSON.stringify({ c: code, d: dimStr, s: similarity }));
}

/**
 * Decode a base64 share string back into personality data.
 * Returns null if parsing fails.
 */
export function decodeCompare(b64: string): DecodedCompare | null {
  try {
    const obj = JSON.parse(atob(b64));
    const levels: Record<string, string> = {};
    dimensionOrder.forEach((d, i) => {
      levels[d] = numToLevel[parseInt(obj.d[i])];
    });
    return { code: obj.c, levels, similarity: obj.s };
  } catch {
    return null;
  }
}
