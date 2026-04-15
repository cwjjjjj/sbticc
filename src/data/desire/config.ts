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

export const desireConfig: TestConfig = {
  id: 'desire',
  name: '欲望图谱',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'kink_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'kink_gate',
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
  fallbackTypeCode: 'MCBGLR',
  hiddenTypeCode: 'XXX',
  similarityThreshold: 60,
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/desire',
  localHistoryKey: 'desire_history',
  localStatsKey: 'desire_local_stats',
  apiTestParam: 'desire',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '30',
};
