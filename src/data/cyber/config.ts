import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

function sumToLevel(score: number): string {
  if (score <= 6) return 'A';
  return 'B';
}

export const cyberConfig: TestConfig = {
  id: 'cyber',
  name: 'CQ16 赛博人格矩阵',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: 'bot_gate',
  gateAnswerValue: 3,
  hiddenTriggerQuestionId: 'bot_gate',
  hiddenTriggerValue: 3,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  maxDistance: 8,
  fallbackTypeCode: 'ZOMBIE',
  hiddenTypeCode: 'BOT',
  similarityThreshold: 60,
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/cyber',
  localHistoryKey: 'cyber_history',
  localStatsKey: 'cyber_local_stats',
  apiTestParam: 'cyber',
  dimSectionTitle: '六维度评分',
  questionCountLabel: '30',
};
