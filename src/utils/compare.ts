const levelToNum: Record<string, number> = { L: 0, M: 1, H: 2, A: 0, B: 1 };
const numToLevel: Record<number, string[]> = {
  15: ['L', 'M', 'H'],  // SBTI: 3 levels
  4: ['A', 'B'],          // Love: 2 levels
};

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
  dimensionOrder: string[],
): string {
  const dimStr = dimensionOrder
    .map(d => levelToNum[levels[d]] ?? 0)
    .join('');
  return btoa(JSON.stringify({ c: code, d: dimStr, s: similarity }));
}

/**
 * Decode a base64 share string back into personality data.
 * Returns null if parsing fails.
 */
export function decodeCompare(
  b64: string,
  dimensionOrder: string[],
): DecodedCompare | null {
  try {
    const obj = JSON.parse(atob(b64));
    const levelMap = numToLevel[dimensionOrder.length] || numToLevel[15];
    const levels: Record<string, string> = {};
    dimensionOrder.forEach((d, i) => {
      levels[d] = levelMap[parseInt(obj.d[i])] ?? levelMap[0];
    });
    return { code: obj.c, levels, similarity: obj.s };
  } catch {
    return null;
  }
}
