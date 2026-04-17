// src/data/fpi/compatibility.ts
// MVP 阶段 FPI 不启用 compat tab。FPI 主打"朋友圈物种"梗，双人相性不如单人自嘲有传播力。
// 后续迭代可以做"谁最看懂你的朋友圈 / 谁会把你屏蔽"CP 表（spec 6.1/P2）。
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两个朋友圈物种彼此出现在对方列表里，互不打扰，偶尔点个赞。' };
}
