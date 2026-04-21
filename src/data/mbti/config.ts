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
  // sumToLevel never fires — sumToLevelByDim below takes precedence in matching.ts
  sumToLevel: () => 'A',
  // Map per-dim score to MBTI letter (matching.ts uses this BEFORE
  // directTypeResolver to build the levels map, which directTypeResolver
  // then concatenates into the final 32-type code).
  sumToLevelByDim: (score: number, dim: string): string | undefined => {
    if (dim === 'EI') return score >= 0 ? 'E' : 'I';
    if (dim === 'SN') return score >= 0 ? 'S' : 'N';
    if (dim === 'TF') return score >= 0 ? 'F' : 'T';
    if (dim === 'JP') return score >= 0 ? 'P' : 'J';
    if (dim === 'AT') return score >= 0 ? 'T' : 'A';
    return undefined;
  },
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
