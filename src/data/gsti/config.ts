// src/data/gsti/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY, MALE_POOL_CODES, FEMALE_POOL_CODES } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// GSTI 共 22 题，每维 3-4 题；raw score 范围需与题数匹配
function sumToLevel(score: number): string {
  // 每维 3 题场景下的平均阈值（3.5-4.5 中 ≈ 4 附近为中）；与 SBTI 保持一致
  if (score <= 6) return 'L';      // 平均 <= 2
  if (score <= 10) return 'M';     // 平均 2.25-3.25
  return 'H';                       // 平均 >= 3.5
}

export const gstiConfig: TestConfig = {
  id: 'gsti',
  name: 'GSTI 性转人格测试',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  // 保留 gate 字段结构（复用 SBTI hiddenTrigger 机制）—UNDEF 的触发在 matching 里二次判定
  gateQuestionId: 'gsti_gate',
  gateAnswerValue: 4,            // 选"不告诉你"
  hiddenTriggerQuestionId: 'gsti_gate',
  hiddenTriggerValue: 4,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  maxDistance: 12,               // 6 维 × 最大差 2 = 12
  fallbackTypeCode: 'HWDP',
  hiddenTypeCode: 'UNDEF',
  similarityThreshold: 55,
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/gsti',
  localHistoryKey: 'gsti_history',
  localStatsKey: 'gsti_local_stats',
  apiTestParam: 'gsti',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '22',
  // 性别锁定字段
  genderLocked: true,
  typePoolByGender: {
    male: MALE_POOL_CODES,
    female: FEMALE_POOL_CODES,
    both: [...MALE_POOL_CODES, ...FEMALE_POOL_CODES],
  },
};
