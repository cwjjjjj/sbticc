// src/data/fsi/compatibility.ts
// MVP 阶段 FSI 不启用 compat tab。FSI 主打"单人被养成的形状"叙事，
// 双人"谁家的锅更大"是情绪放大器，首版克制不做；后续可做"谁重养你 / 谁提醒你别再重养别人"等温柔向的 CP 表。
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两个幸存者坐下来，谁也不用先开口——家这个话题不急着讲完。' };
}
