// src/data/fpi/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// FPI 共 24 题，每维 4 题。
// raw score 范围 4-16，sumToLevel 阈值：
//   score ≤ 8  → L（平均 ≤ 2.0）
//   9-12       → M
//   score ≥ 13 → H（平均 ≥ 3.25）
function sumToLevel(score: number): string {
  if (score <= 8) return 'L';
  if (score <= 12) return 'M';
  return 'H';
}

export const fpiConfig: TestConfig = {
  id: 'fpi',
  name: 'FPI 朋友圈人设诊断',

  // Dimensions
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  // gate & hiddenTrigger 用同一题同一答案：fpi_gate value=4 → 0POST
  gateQuestionId: 'fpi_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'fpi_gate',
  hiddenTriggerValue: 4,

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
  maxDistance: 12,             // 6 维 × 最大差 2 = 12
  fallbackTypeCode: 'FEED?',
  hiddenTypeCode: '0POST',
  similarityThreshold: 55,

  // URLs & Storage
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/fpi',
  localHistoryKey: 'fpi_history',
  localStatsKey: 'fpi_local_stats',
  apiTestParam: 'fpi',

  // Display text
  dimSectionTitle: '六维人设雷达',
  questionCountLabel: '24',

  // 注意：FPI 不使用 genderLocked / typePoolByGender —— 字段省略
};
