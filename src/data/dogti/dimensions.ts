import type { DimensionInfo } from '../testConfig';

export const dimensionOrder = ['EI', 'SN', 'TF', 'JP'] as const;

export const dimensionMeta: Record<string, DimensionInfo> = {
  EI: { name: '外向 / 内向', model: 'MBTI' },
  SN: { name: '实感 / 直觉', model: 'MBTI' },
  TF: { name: '思考 / 情感', model: 'MBTI' },
  JP: { name: '判断 / 感知', model: 'MBTI' },
};

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  EI: {
    E: '你冲在最前面闻新朋友',
    I: '你先观察，认得再靠近',
  },
  SN: {
    S: '你相信眼前的气味胜过脑补',
    N: '你总在想：如果推开那扇门会怎样',
  },
  TF: {
    T: '先解决问题，再谈感受',
    F: '先陪你，问题以后再说',
  },
  JP: {
    J: '计划好了再出门',
    P: '走到哪算哪，这叫自由',
  },
};
