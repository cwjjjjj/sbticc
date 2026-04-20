import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from '../dimensions';
import { questions, specialQuestions } from '../questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from '../types';
import { TYPE_IMAGES, SHARE_IMAGES } from '../typeImages';
import { COMPATIBILITY, getCompatibility } from '../compatibility';

function sumToLevel(score: number): string {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

export const sbtiConfig: TestConfig = {
  id: 'sbti',
  name: 'SBTI 人格测试',
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS as unknown as Record<string, Record<string, string>>,
  questions,
  specialQuestions,
  gateQuestionId: 'drink_gate_q1',
  gateAnswerValue: 3,
  hiddenTriggerQuestionId: 'drink_gate_q2',
  hiddenTriggerValue: 2,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel,
  maxDistance: 30,
  fallbackTypeCode: 'HHHH',
  hiddenTypeCode: 'DRUNK',
  similarityThreshold: 60,
  prodBaseUrl: 'https://test.jiligulu.xyz',
  basePath: '/sbti',
  localHistoryKey: 'sbti_history',
  localStatsKey: 'sbti_local_stats',
  apiTestParam: '',
  dimSectionTitle: '十五维度评分',
  questionCountLabel: '31',
};
