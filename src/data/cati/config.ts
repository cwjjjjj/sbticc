import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

export const catiConfig: TestConfig = {
  id: 'cati',
  name: 'CaTI 猫猫人格测试',

  dimensionOrder: [...dimensionOrder],
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  questions,
  specialQuestions,
  gateQuestionId: '',
  gateAnswerValue: 0,
  hiddenTriggerQuestionId: '',
  hiddenTriggerValue: 0,

  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,

  compatibility: COMPATIBILITY,
  getCompatibility,

  directTypeResolver: (levels) =>
    `${levels.EI}${levels.SN}${levels.TF}${levels.JP}`,

  sumToLevel: () => 'E',
  sumToLevelByDim: (score: number, dim: string): string | undefined => {
    if (dim === 'EI') return score >= 0 ? 'E' : 'I';
    if (dim === 'SN') return score >= 0 ? 'S' : 'N';
    if (dim === 'TF') return score >= 0 ? 'T' : 'F';
    if (dim === 'JP') return score >= 0 ? 'J' : 'P';
    return undefined;
  },

  maxDistance: 4,
  fallbackTypeCode: 'INTJ',
  hiddenTypeCode: '',
  similarityThreshold: 0,

  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/cati',
  localHistoryKey: 'cati_history',
  localStatsKey: 'cati_local_stats',
  apiTestParam: 'cati',

  dimSectionTitle: '四维度偏好',
  questionCountLabel: '12',
};
