import type { DimensionInfo } from '../testConfig';

export const dimensionOrder = ['EI', 'SN', 'TF', 'JP'] as const;

export const dimensionMeta: Record<string, DimensionInfo> = {
  EI: { name: '社交 / 独处', model: 'MBTI' },
  SN: { name: '实感 / 直觉', model: 'MBTI' },
  TF: { name: '冷静 / 感性', model: 'MBTI' },
  JP: { name: '规律 / 随性', model: 'MBTI' },
};

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  EI: {
    E: '你喜欢有人在身边，哪怕只是坐着',
    I: '你一个人一整天也不觉得少点什么',
  },
  SN: {
    S: '先用肉垫踩一下看看是什么',
    N: '脑子里先把这东西怎么样转了三圈',
  },
  TF: {
    T: '不爽就起身走开，不解释',
    F: '蹭一下你的腿，意思就是我懂',
  },
  JP: {
    J: '吃饭必须准时，位置必须对',
    P: '想去哪就去哪，纸箱就是宇宙',
  },
};
