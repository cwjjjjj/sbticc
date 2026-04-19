// src/data/xpti/config.ts
import type { TestConfig, CompatEntry, CompatResult } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY, MALE_POOL_CODES, FEMALE_POOL_CODES } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';

/**
 * XPTI · 性别人格画像
 * 24 题（8 维 × 3 题）。每维 raw score 范围 3-12。
 *   score ≤ 6   → L（平均 ≤ 2，低）
 *   7-9         → M（平均 2.33-3，中）
 *   score ≥ 10  → H（平均 ≥ 3.33，高）
 */
function sumToLevel(score: number): string {
  if (score <= 6) return 'L';
  if (score <= 9) return 'M';
  return 'H';
}

/**
 * XPTI 首版不启用 compatibility tab；提供空实现以满足 TestConfig 结构。
 */
const COMPATIBILITY: Record<string, CompatEntry> = {};

function getCompatibility(a: string, b: string): CompatResult {
  if (a === b) {
    return { type: 'mirror', say: '跟自己的同类在一起，省事但也没惊喜。' };
  }
  return { type: 'normal', say: '两种不同的性别画像正好撞在一起——关系怎么走，全看你们愿不愿意相互翻译。' };
}

export const xptiConfig: TestConfig = {
  id: 'xpti',
  name: 'XPTI · 性别人格画像',

  // Dimensions
  dimensionOrder: dimensionOrder as string[],
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  gateQuestionId: 'xpti_trigger_q1',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'xpti_trigger_q1',
  hiddenTriggerValue: 4,

  // Types
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,

  // Compatibility（首版占位，不启用 compat tab）
  compatibility: COMPATIBILITY,
  getCompatibility,

  // Matching params
  sumToLevel,
  maxDistance: 16,               // 8 维 × 最大差 2 = 16
  fallbackTypeCode: 'MSHADOW',
  hiddenTypeCode: 'XFREAK',
  similarityThreshold: 55,       // 8 维更稀疏，比 SBTI 的 60 略低

  // URLs & Storage
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/xpti',
  localHistoryKey: 'xpti_history',
  localStatsKey: 'xpti_local_stats',
  apiTestParam: 'xpti',

  // Display text
  dimSectionTitle: '八维性别画像雷达',
  questionCountLabel: '24',

  // 性别锁定
  genderLocked: true,
  typePoolByGender: {
    male: [...MALE_POOL_CODES],
    female: [...FEMALE_POOL_CODES],
    both: [...MALE_POOL_CODES, ...FEMALE_POOL_CODES],
  },
};
