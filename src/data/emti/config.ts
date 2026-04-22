import type { TestConfig } from '../testConfig';
import { COMPATIBILITY, getCompatibility } from './compatibility';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { NORMAL_TYPES, TYPE_LIBRARY, TYPE_RARITY } from './types';

function sumToLevel(score: number): string {
  if (score <= 8) return 'L';
  if (score <= 12) return 'M';
  return 'H';
}

function sumToLevelByDim(score: number, dim: string): string | undefined {
  if (dim !== 'YIN') return undefined;
  if (score <= 10) return 'L';
  if (score <= 15) return 'M';
  return 'H';
}

export const emtiConfig: TestConfig = {
  id: 'emti',
  name: 'EMTI 东方 MBTI',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'emti_none',
  gateAnswerValue: -1,
  hiddenTriggerQuestionId: 'emti_none',
  hiddenTriggerValue: -1,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  sumToLevelByDim,
  maxDistance: 12,
  fallbackTypeCode: 'XIN',
  hiddenTypeCode: 'XIN',
  similarityThreshold: 0,
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/emti',
  localHistoryKey: 'emti_history',
  localStatsKey: 'emti_local_stats',
  apiTestParam: 'emti',
  dimSectionTitle: '五行气质雷达',
  questionCountLabel: '25',
};
