import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

export const mbtiConfig: TestConfig = {
  id: 'mbti',
  name: 'MBTI 16 \u578b\u4eba\u683c\u6d4b\u8bd5 \u00b7 \u5b8c\u6574\u7248',
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
  sumToLevel: () => 'A', // stub - directTypeResolver short-circuits before this is used
  maxDistance: 5,
  fallbackTypeCode: 'INTJ-A',
  hiddenTypeCode: '',
  similarityThreshold: 0,
  directTypeResolver: (levels) =>
    `${levels.EI}${levels.SN}${levels.TF}${levels.JP}-${levels.AT}`,
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/mbti',
  localHistoryKey: 'mbti_history',
  localStatsKey: 'mbti_local_stats',
  apiTestParam: 'mbti',
  dimSectionTitle: '\u4e94\u7ef4\u5ea6\u8bc4\u5206',
  questionCountLabel: '72',
};
