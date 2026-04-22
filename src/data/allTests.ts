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
    path: '/sbti',
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
  {
    id: 'fpi',
    name: '朋友圈人设诊断',
    tagline: '朋友圈里的你是几个人',
    path: '/fpi',
    emoji: '📸',
  },
  {
    id: 'fsi',
    name: '原生家庭幸存者',
    tagline: '你是哪种家庭叙事里的角色',
    path: '/fsi',
    emoji: '🏠',
  },
  {
    id: 'mpi',
    name: '消费人格图鉴',
    tagline: '你花钱的姿势很难看',
    path: '/mpi',
    emoji: '💳',
  },
  {
    id: 'xpti',
    name: 'XPTI 性别人格画像',
    tagline: '你作为性别化主体是什么气质',
    path: '/xpti',
    emoji: '🎭',
  },
  {
    id: 'emti',
    name: 'EMTI 东方 MBTI',
    tagline: '测你是哪种十天干人格',
    path: '/emti',
    emoji: '🪷',
  },
  {
    id: 'mbti',
    name: 'MBTI 16 型人格测试 · 完整版',
    tagline: '72 题完整版 · 16 种人格 × A/T 亚型',
    path: '/mbti',
    emoji: '🧬',
  },
  {
    id: 'dogti',
    name: 'DogTI 狗狗人格测试',
    tagline: '12 题测出你是什么狗 · 16 种狗狗人格',
    path: '/dogti',
    emoji: '🐕',
  },
  {
    id: 'cati',
    name: 'CaTI 猫猫人格测试',
    tagline: '12 题测出你是什么猫 · 16 种猫咪人格',
    path: '/cati',
    emoji: '🐈',
  },
];
