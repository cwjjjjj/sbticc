import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

function sumToLevel(score: number): string {
  if (score <= 10) return 'A';
  return 'B';
}

export const manualConfig: TestConfig = {
  id: 'manual',
  name: '我的使用说明书',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'manual_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'manual_gate',
  hiddenTriggerValue: 4,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  maxDistance: 12,
  fallbackTypeCode: 'SAFE',
  hiddenTypeCode: 'CRASH',
  similarityThreshold: 60,
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/manual',
  localHistoryKey: 'manual_history',
  localStatsKey: 'manual_local_stats',
  apiTestParam: 'manual',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '25',
};
