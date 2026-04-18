// src/data/mpi/compatibility.ts
// MVP 阶段 MPI 不启用 compat tab。MPI 主打"单人自嘲"，双人相性（"谁最容易拐你花钱 / 谁和你一起攒钱"）留作 P2。
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两个消费人格在一起，要么一起剁手到破产，要么一起抠门到财富自由。' };
}
