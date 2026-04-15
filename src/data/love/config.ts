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

export const loveConfig: TestConfig = {
  id: 'love',
  name: '恋爱脑浓度检测',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'ex_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'ex_gate',
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
  fallbackTypeCode: 'HWDPLV',
  hiddenTypeCode: 'EX',
  similarityThreshold: 60,
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/love',
  localHistoryKey: 'love_history',
  localStatsKey: 'love_local_stats',
  apiTestParam: 'love',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '30',
};
