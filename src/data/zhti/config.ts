import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

function sumToLevel(score: number): string {
  if (score <= 7) return 'A';
  return 'B';
}

export const zhtiConfig: TestConfig = {
  id: 'zhti',
  name: '你是甄嬛传里的哪个人？',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'hh_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'hh_gate',
  hiddenTriggerValue: 4,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  maxDistance: 6,
  fallbackTypeCode: 'JINGFEI',
  hiddenTypeCode: 'TAIHOU',
  similarityThreshold: 50,
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/zhti',
  localHistoryKey: 'zhti_history',
  localStatsKey: 'zhti_local_stats',
  apiTestParam: 'zhti',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '18',
};
