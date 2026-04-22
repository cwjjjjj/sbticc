import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1: 城府 =====
  { id: 'sq1', dim: 'D1', text: '你得知有人在皇上面前诋毁你，你会怎么做？', options: [
    { label: '暗中查清来源，等时机精准反击', value: 1 },
    { label: '先按兵不动，观察对方下一步再说', value: 2 },
    { label: '找到那人，当面质问清楚', value: 3 },
    { label: '直接去皇上那里坦白澄清', value: 4 },
  ]},
  { id: 'sq2', dim: 'D1', text: '你想要一件很重要的东西（名分、恩宠），但正面争取希望渺茫，你会？', options: [
    { label: '找准时机设局，让局势自然倒向你', value: 1 },
    { label: '找可靠的盟友，借力打力', value: 2 },
    { label: '主动表明心意，坦诚相告', value: 3 },
    { label: '耐心等待，缘分到了自然来', value: 4 },
  ]},
  { id: 'sq3', dim: 'D1', text: '你在复杂的权力环境中，处世信条是？', options: [
    { label: '每步棋都提前三步想好，步步为营', value: 1 },
    { label: '广结善缘，铺路不走绝路', value: 2 },
    { label: '凭实力说话，对人真诚', value: 3 },
    { label: '不争不抢，随遇而安', value: 4 },
  ]},

  // ===== D2: 情感 =====
  { id: 'eq1', dim: 'D2', text: '你暗恋一人已久，终于有机会靠近，你会？', options: [
    { label: '情难自控，主动表白，爱要说出口', value: 1 },
    { label: '旁敲侧击，释放暗示，等对方有所感知', value: 2 },
    { label: '保持端庄，等待对方先开口', value: 3 },
    { label: '什么都不做，感情藏在心底就好', value: 4 },
  ]},
  { id: 'eq2', dim: 'D2', text: '密友向你倾诉了一件非常痛苦的事，你通常？', options: [
    { label: '完全与之共情，哭了也很正常', value: 1 },
    { label: '认真倾听，感同身受地宽慰她', value: 2 },
    { label: '冷静倾听，帮她理性分析如何应对', value: 3 },
    { label: '表面体贴，内心保持距离，不轻易被带入情绪', value: 4 },
  ]},
  { id: 'eq3', dim: 'D2', text: '对你而言，感情是什么？', options: [
    { label: '是此生最重要的事，不惜一切', value: 1 },
    { label: '很重要，但不能让它蒙蔽理智', value: 2 },
    { label: '是锦上添花，不是非有不可', value: 3 },
    { label: '是一种风险，要小心防范', value: 4 },
  ]},

  // ===== D3: 权力 =====
  { id: 'pq1', dim: 'D3', text: '若有机会晋升位份、获得更大权势，你会？', options: [
    { label: '当然要争，我本就不该屈居人下', value: 1 },
    { label: '时机合适就出手，不会主动放弃', value: 2 },
    { label: '顺其自然，有机会也不强求', value: 3 },
    { label: '不感兴趣，安稳度日比地位更重要', value: 4 },
  ]},
  { id: 'pq2', dim: 'D3', text: '你认为拥有权势，最重要的意义是？', options: [
    { label: '掌控自己和身边人的命运', value: 1 },
    { label: '保护自己在乎的人不受欺负', value: 2 },
    { label: '多一些选择，少受人摆布', value: 3 },
    { label: '不是我的追求，平安是福', value: 4 },
  ]},
  { id: 'pq3', dim: 'D3', text: '"权势滔天"和"岁月静好"，你选哪个？', options: [
    { label: '要权势，我生来就该站在最高处', value: 1 },
    { label: '先站稳脚跟，再谋安稳', value: 2 },
    { label: '安稳更重要，踩着别人往上爬不值得', value: 3 },
    { label: '只求平安，什么都不要也行', value: 4 },
  ]},

  // ===== D4: 理想 =====
  { id: 'iq1', dim: 'D4', text: '你相信在深宫中能遇到真心以待的人吗？', options: [
    { label: '相信，哪怕万分之一的可能也值得坚守', value: 1 },
    { label: '相信，但也会多留一个心眼', value: 2 },
    { label: '不太信，这里的感情都带着利益考量', value: 3 },
    { label: '完全不信，讲感情的人都是傻的', value: 4 },
  ]},
  { id: 'iq2', dim: 'D4', text: '遇到不公之事，你会怎么做？', options: [
    { label: '坚决反抗，哪怕付出代价', value: 1 },
    { label: '想办法在规则内慢慢改变它', value: 2 },
    { label: '接受现实，在规则内活下去', value: 3 },
    { label: '算了，强者的规则弱者无法撼动', value: 4 },
  ]},
  { id: 'iq3', dim: 'D4', text: '对你来说，什么是最重要的？', options: [
    { label: '一个值得为之奋斗的理想或真情', value: 1 },
    { label: '几个真心人，平安一生', value: 2 },
    { label: '把眼前的日子过好，活在当下', value: 3 },
    { label: '安全感和稳定，其他都是虚的', value: 4 },
  ]},

  // ===== D5: 主动 =====
  { id: 'aq1', dim: 'D5', text: '察觉危险即将来临，你的第一反应是？', options: [
    { label: '立刻采取行动，先发制人，不让对方喘息', value: 1 },
    { label: '迅速判断，找到最优解后果断出手', value: 2 },
    { label: '先稳住，等局势更明朗再说', value: 3 },
    { label: '隐忍，等对方先动再见机行事', value: 4 },
  ]},
  { id: 'aq2', dim: 'D5', text: '在感情或人际关系中，你通常扮演什么角色？', options: [
    { label: '主动付出、主动推进的那一方', value: 1 },
    { label: '互动对等，你来我往', value: 2 },
    { label: '被动接受，等待对方靠近', value: 3 },
    { label: '保持距离，进退有据', value: 4 },
  ]},
  { id: 'aq3', dim: 'D5', text: '如果你不喜欢当前的处境，你会？', options: [
    { label: '立刻着手改变，我不愿意忍', value: 1 },
    { label: '一步步推动，慢慢改变它', value: 2 },
    { label: '先适应，再从长计议', value: 3 },
    { label: '沉住气，等最好的时机再动', value: 4 },
  ]},

  // ===== D6: 情义 =====
  { id: 'lq1', dim: 'D6', text: '最好的姐妹在宫斗中被冤枉，帮她需要你承担很大风险，你会？', options: [
    { label: '义无反顾，姐妹有难怎能袖手旁观', value: 1 },
    { label: '尽力相助，但也考虑自己的限度', value: 2 },
    { label: '暗中出主意，不敢明面站出来', value: 3 },
    { label: '爱莫能助，先保全自己要紧', value: 4 },
  ]},
  { id: 'lq2', dim: 'D6', text: '曾经帮过你的人正陷于困境，你会？', options: [
    { label: '第一时间出手，知恩图报', value: 1 },
    { label: '尽力回报，量力而行', value: 2 },
    { label: '想帮，但先评估风险', value: 3 },
    { label: '各人自扫门前雪，不掺和麻烦', value: 4 },
  ]},
  { id: 'lq3', dim: 'D6', text: '对你来说，"忠诚"意味着什么？', options: [
    { label: '是最高原则，不可辜负，哪怕付出生命', value: 1 },
    { label: '很重要，前提是对方也值得', value: 2 },
    { label: '在不损害自己的前提下可以讲义气', value: 3 },
    { label: '这年头谁对谁忠诚？都是利益关系', value: 4 },
  ]},
];

export const specialQuestions: Question[] = [
  {
    id: 'hh_gate',
    text: '最后一题：你是哪种程度的甄嬛传观众？',
    options: [
      { label: '甄学家，每集逐帧分析，台词倒背如流', value: 1 },
      { label: '追过一遍，记得主要剧情和人物', value: 2 },
      { label: '看过几集，印象有些模糊', value: 3 },
      { label: '从没看过，对这部剧完全不了解', value: 4 },
    ],
    special: true,
  },
];
