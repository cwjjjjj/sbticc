import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

function sumToLevel(score: number): string {
  if (score <= 12) return 'A';
  return 'B';
}

export const workConfig: TestConfig = {
  id: 'work',
  name: '打工人鉴定',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'work_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'work_gate',
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
  fallbackTypeCode: 'HSGJI',
  hiddenTypeCode: '996',
  similarityThreshold: 60,
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/work',
  localHistoryKey: 'work_history',
  localStatsKey: 'work_local_stats',
  apiTestParam: 'work',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '30',
};
