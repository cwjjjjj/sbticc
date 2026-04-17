// src/data/gsti/compatibility.ts
// MVP 阶段 GSTI 不启用 compat tab（类型是反串梗，compat 语义不合理）
// 保留占位，后续版本可基于男池 × 女池设计"异性相吸"compat
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两人相处模式没有特别的化学反应，也没有明显的冲突。' };
}
