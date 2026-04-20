import type { DimensionInfo } from '../testConfig';

export const dimensionOrder = ['EI', 'SN', 'TF', 'JP', 'AT'] as const;

export const dimensionMeta: Record<string, DimensionInfo> = {
  EI: { name: '\u80fd\u91cf\u65b9\u5411', model: 'MBTI' },
  SN: { name: '\u4fe1\u606f\u5904\u7406', model: 'MBTI' },
  TF: { name: '\u51b3\u7b56\u4f9d\u636e', model: 'MBTI' },
  JP: { name: '\u751f\u6d3b\u65b9\u5f0f', model: 'MBTI' },
  AT: { name: '\u8eab\u4efd\u8ba4\u540c', model: 'NERIS' },
};

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  EI: { I: '\u5185\u5411', E: '\u5916\u5411' },
  SN: { N: '\u76f4\u89c9', S: '\u5b9e\u611f' },
  TF: { T: '\u601d\u8003', F: '\u60c5\u611f' },
  JP: { J: '\u5224\u65ad', P: '\u611f\u77e5' },
  AT: { A: '\u81ea\u4fe1\u578b', T: '\u52a8\u8361\u578b' },
};
