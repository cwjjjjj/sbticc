/**
 * Registry of all available tests — used for cross-test navigation.
 * Each entry is a lightweight pointer; the actual TestConfig is loaded
 * only by the test's own App component.
 */
export interface TestLink {
  id: string;
  name: string;
  tagline: string;
  path: string;
  emoji: string;
}

export const ALL_TESTS: TestLink[] = [
  {
    id: 'sbti',
    name: 'SBTI 人格测试',
    tagline: '15维度深度人格扫描',
    path: '/new',
    emoji: '🧠',
  },
  {
    id: 'love',
    name: '恋爱脑浓度检测',
    tagline: '你谈恋爱是什么德性',
    path: '/love',
    emoji: '💘',
  },
  {
    id: 'work',
    name: '打工人鉴定',
    tagline: '你是哪种打工人',
    path: '/work',
    emoji: '💼',
  },
  {
    id: 'values',
    name: '活法检测报告',
    tagline: '你到底在活什么',
    path: '/values',
    emoji: '🌏',
  },
  {
    id: 'cyber',
    name: '赛博基因检测',
    tagline: '你是什么品种的网民',
    path: '/cyber',
    emoji: '📱',
  },
  {
    id: 'desire',
    name: '欲望图谱',
    tagline: '关上门之后你是谁',
    path: '/desire',
    emoji: '🔥',
  },
  {
    id: 'gsti',
    name: 'GSTI 性转人格',
    tagline: '性转后你是什么鬼',
    path: '/gsti',
    emoji: '🪞',
  },
];
