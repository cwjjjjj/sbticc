// src/data/mpi/config.ts
import type { TestConfig } from '../testConfig';
import {
  dimensionMeta,
  dimensionOrder,
  DIM_EXPLANATIONS,
} from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// MPI 题量分配（含 gate 计入 D6）：
//   D1 HOARD       4 题
//   D2 FLAUNT      3 题
//   D3 FRUGAL      4 题
//   D4 SUSCEPT     4 题
//   D5 SECONDHAND  3 题
//   D6 LIVESTREAM  3 主题 + 1 gate = 4 题
//
// 4 题档 raw=4-16 → ≤8=L, 9-12=M, ≥13=H（= FPI 基线）。
// 3 题档 raw=3-12 需单独线性缩放到 ≤6=L, 7-9=M, ≥10=H，否则 D2/D5 永远无法
// 触达 H，会导致需要 FLAUNT=H 或 SECONDHAND=H 的类型（如 BOSSX/2HAND/FLIPR
// 等）事实上不可命中。
//
// 架构使用 FSI Task 17 落地的双函数方案：flat `sumToLevel` 作为 4 题默认，
// `sumToLevelByDim` 对 3 题维度返回覆写；matching.ts 会优先调 by-dim，
// undefined 时回退到 flat。详见 src/utils/matching.ts。
function sumToLevel(score: number): string {
  // 4 题档默认（D1/D3/D4/D6）
  if (score <= 8) return 'L';
  if (score <= 12) return 'M';
  return 'H';
}

// 按 4 题基线线性缩放到 3 题档：
//   4 题 raw 4-16 → ≤8=L,  9-12=M, ≥13=H
//   3 题 raw 3-12 → ≤6=L,  7-9=M,  ≥10=H
// 仅 D2 FLAUNT / D5 SECONDHAND 是 3 题维度；其余返回 undefined 回退到 flat。
function sumToLevelByDim(score: number, dim: string): string | undefined {
  if (dim === 'D2' || dim === 'D5') {
    if (score <= 6) return 'L';
    if (score <= 9) return 'M';
    return 'H';
  }
  return undefined;
}

export const mpiConfig: TestConfig = {
  id: 'mpi',
  name: 'MPI 消费人格图鉴',

  // Dimensions
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  // gate 用于前置判断（mpi_gate value=1 = "我真的想不起来了"→ ZERO$ 候选）。
  // 真正的 ZERO$ 判定还需 FRUGAL (D3) 为 L，单一 hiddenTriggerValue 表达不了
  // 多条件组合，所以 hiddenTriggerValue 设为不可能值（-1），实际判定放到
  // MpiApp 里 post-compute 覆写（与 FSI 的 BOSSY 多条件判定模式一致）。
  gateQuestionId: 'mpi_gate',
  gateAnswerValue: 1,             // 'D. 我真的想不起来了'
  hiddenTriggerQuestionId: 'mpi_gate',
  hiddenTriggerValue: -1,         // 故意无法触发——由 MpiApp 做多条件判定

  // Types
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,

  // Compatibility（首版 stub，不启用 compat tab）
  compatibility: COMPATIBILITY,
  getCompatibility,

  // Matching params
  sumToLevel,
  sumToLevelByDim,
  maxDistance: 12,              // 6 维 × 最大差 2 = 12
  fallbackTypeCode: 'MIXDR',
  hiddenTypeCode: 'ZERO$',
  similarityThreshold: 55,

  // URLs & Storage
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/mpi',
  localHistoryKey: 'mpi_history',
  localStatsKey: 'mpi_local_stats',
  apiTestParam: 'mpi',

  // Display text
  dimSectionTitle: '六维消费雷达',
  questionCountLabel: '22',

  // 注意：MPI 不使用 genderLocked / typePoolByGender —— 字段省略
};
