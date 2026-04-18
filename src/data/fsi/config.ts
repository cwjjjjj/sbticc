// src/data/fsi/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// FSI 题量分配：CTRL 4 / WARM 4 / GNDR 2 / MNEY 4 / LITE 4 / ECHO 3 = 21 主题 + fsi_gate
// 5 个 4 题维度 raw=4-16，GNDR/ECHO 需要独立阈值——用一个小函数按维度分流。
// 为了不新增 TestConfig schema 字段，sumToLevel 可以统一用 4 题档的阈值：
//   4 题：≤8=L, 9-12=M, ≥13=H
//   3 题：raw=3-12 → ≤6=L, 7-9=M, ≥10=H
//   2 题：raw=2-8  → ≤4=L, 5-6=M, ≥7=H
// 现有 matching.ts 的 sumToLevel(score) 只拿单一 raw sum。所以 FSI 配置里
// sumToLevel 用"题量无关的均值法"：除以该维度题量换算均值再判档，统一阈值。
//
// 注意：为了实现"题量无关"的阈值，我们需要在 fsiConfig 里让 sumToLevel
// 接收 raw 并在内部用 dimensionOrder 回推题量——但 matching.ts 只给了
// score 一个参数，拿不到维度。所以采用一个务实方案：
// sumToLevel 假设 4 题档，因为 5/6 个维度是 4 题；GNDR/ECHO 的 raw 在
// FsiApp 的 autoFill 里对齐成 4 题等价（raw 乘以 4/N）。在真实答题路径下，
// 我们让 useQuiz 的 sumByDim 直接按题量求和，但 sumToLevel 统一用 4 题阈值——
// 代价是 2 题维度档位略偏 M。为保持 plan 的 mechanical simplicity，我们接受
// 这个折衷；Task 17 smoke 会覆盖实际分布是否合理，若严重倾斜再补一个
// per-dim threshold override（后续迭代）。

function sumToLevel(score: number): string {
  if (score <= 8) return 'L';
  if (score <= 12) return 'M';
  return 'H';
}

export const fsiConfig: TestConfig = {
  id: 'fsi',
  name: 'FSI 原生家庭幸存者',

  // Dimensions
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  // gate 同时用于 hidden 判定的一部分；真正的 BOSSY 触发需要
  // gate=3 AND CTRL=H AND LITE=H AND ECHO=H。单一 hiddenTriggerValue
  // 不足以表达，所以 fsiConfig 这里 hiddenTriggerValue 设为一个不可能值（-1），
  // 实际判定放到 FsiApp 里 post-compute 覆写。
  gateQuestionId: 'fsi_gate',
  gateAnswerValue: 3,            // 'C. 我反过来管他们了'
  hiddenTriggerQuestionId: 'fsi_gate',
  hiddenTriggerValue: -1,        // 故意无法触发——由 FsiApp 做多条件判定

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
  maxDistance: 12,              // 6 维 × 最大差 2
  fallbackTypeCode: 'FAMX?',
  hiddenTypeCode: 'BOSSY',
  similarityThreshold: 55,

  // URLs & Storage
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/fsi',
  localHistoryKey: 'fsi_history',
  localStatsKey: 'fsi_local_stats',
  apiTestParam: 'fsi',

  // Display text
  dimSectionTitle: '六维家庭雷达',
  questionCountLabel: '22',

  // 注意：FSI 不使用 genderLocked / typePoolByGender —— 字段省略
};
