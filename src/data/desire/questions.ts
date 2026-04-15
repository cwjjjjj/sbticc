import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1: 主导倾向 (S vs M) =====
  {
    id: 'dq1', dim: 'D1',
    text: '亲密关系中你更像？',
    options: [
      { label: '导演——场景、台词、走位全部我来定', value: 1 },
      { label: '制片人——大方向我说了算，细节随意', value: 2 },
      { label: '演员——给我剧本我就能入戏', value: 3 },
      { label: '观众——我只想被好好安排', value: 4 },
    ],
  },
  {
    id: 'dq2', dim: 'D1',
    text: '你更享受？',
    options: [
      { label: '掌控节奏，看对方跟着你的指挥走', value: 1 },
      { label: '互相切换，今天你来明天我来', value: 2 },
      { label: '被牵着走，不用思考只管感受', value: 3 },
    ],
  },
  {
    id: 'dq3', dim: 'D1',
    text: '你觉得"疼"是一种？',
    options: [
      { label: '惩罚——我施予的', value: 1 },
      { label: '调味料——关系里少不了的', value: 2 },
      { label: '奖励——痛但快乐着', value: 3 },
      { label: '禁区——碰都别碰', value: 4 },
    ],
  },
  {
    id: 'dq4', dim: 'D1',
    text: '"听话"这个词让你联想到什么？',
    options: [
      { label: '我说这两个字的时候很有成就感', value: 1 },
      { label: '无感，取决于语境', value: 2 },
      { label: '被这么说的时候有点上头', value: 3 },
    ],
  },
  {
    id: 'dq5', dim: 'D1',
    text: '如果亲密关系是一场游戏，你更想当？',
    options: [
      { label: '游戏设计者——规则我来定', value: 1 },
      { label: '玩家——我很会玩，但不写规则', value: 2 },
      { label: 'NPC——安排好的剧情我走就行', value: 3 },
    ],
  },

  // ===== D2: 表达方式 (O vs C) =====
  {
    id: 'dq6', dim: 'D2',
    text: '灯关了之后你是什么样的人？',
    options: [
      { label: '话更多了——灯一关嘴就开', value: 1 },
      { label: '和开灯时差不多', value: 2 },
      { label: '沉默是金——让动作替我说话', value: 3 },
    ],
  },
  {
    id: 'dq7', dim: 'D2',
    text: '你对"说出来"这件事的态度？',
    options: [
      { label: '想要什么就大声说，闷在心里算什么', value: 1 },
      { label: '看情况，有些话可以说有些不行', value: 2 },
      { label: '开不了口，宁愿暗示十次也不直说一次', value: 3 },
    ],
  },
  {
    id: 'dq8', dim: 'D2',
    text: '亲密时你觉得最"加分"的是？',
    multiSelect: true,
    options: [
      { label: '低声耳语——声音本身就是触感', value: 1 },
      { label: '直接表达需求——"我想要你____"', value: 1 },
      { label: '沉默对视——无声胜有声', value: 3 },
      { label: '用肢体回应——语言太笨拙了', value: 3 },
    ],
  },
  {
    id: 'dq9', dim: 'D2',
    text: '你的伴侣突然问"你喜欢我哪里"，你的反应？',
    options: [
      { label: '滔滔不绝讲半小时，从灵魂到肉体全方位夸', value: 1 },
      { label: '想一下然后说几句重点', value: 2 },
      { label: '不说了直接用行动证明', value: 3 },
    ],
  },
  {
    id: 'dq10', dim: 'D2',
    text: '你会把亲密关系中的需求主动告诉对方吗？',
    options: [
      { label: '当然，明确沟通是效率之王', value: 1 },
      { label: '大部分会说，有些比较害羞的保留', value: 2 },
      { label: '不太会说……懂我的人自然懂', value: 3 },
    ],
  },

  // ===== D3: 感官偏好 (P vs B) =====
  {
    id: 'dq11', dim: 'D3',
    text: '哪种场景更让你"上头"？',
    options: [
      { label: '一场深夜长谈，聊到灵魂共振', value: 1 },
      { label: '两者都要，缺一不可', value: 2 },
      { label: '一次完美的肢体默契', value: 3 },
    ],
  },
  {
    id: 'dq12', dim: 'D3',
    text: '你对"氛围感"的定义是？',
    multiSelect: true,
    options: [
      { label: '精神契合——彼此一个眼神就懂了', value: 1 },
      { label: '音乐和灯光——感官调到最优频率', value: 3 },
      { label: '气味——体香或香水让人失去理智', value: 3 },
      { label: '深度对话——思想碰撞的火花最迷人', value: 1 },
    ],
  },
  {
    id: 'dq13', dim: 'D3',
    text: '如果亲密关系是一道菜，你觉得最重要的是？',
    options: [
      { label: '灵魂是主料——心灵相通才是正菜', value: 1 },
      { label: '两者都得有，缺了哪个都不行', value: 2 },
      { label: '感官是主料——好吃好看好闻才是王道', value: 3 },
    ],
  },
  {
    id: 'dq14', dim: 'D3',
    text: '你更容易因为什么而心动？',
    options: [
      { label: '对方说了一句直击灵魂的话', value: 1 },
      { label: '说不清，综合感觉', value: 2 },
      { label: '对方不经意的一个动作或触碰', value: 3 },
    ],
  },
  {
    id: 'dq15', dim: 'D3',
    text: '关于"精神出轨"和"肉体出轨"哪个更不能接受？',
    options: [
      { label: '精神出轨——灵魂背叛才是真正的背叛', value: 1 },
      { label: '一样不能接受', value: 2 },
      { label: '肉体出轨——身体的底线不容突破', value: 3 },
    ],
  },

  // ===== D4: 节奏偏好 (F vs G) =====
  {
    id: 'dq16', dim: 'D4',
    text: '你理想的亲密节奏是？',
    options: [
      { label: '暴风雨——来就来猛的，犹豫都是浪费', value: 1 },
      { label: '看心情切换', value: 2 },
      { label: '细水长流——慢慢升温才有意思', value: 3 },
    ],
  },
  {
    id: 'dq17', dim: 'D4',
    text: '你觉得"前戏"是？',
    options: [
      { label: '浪费时间——直奔主题更过瘾', value: 1 },
      { label: '有时候需要，有时候不需要', value: 2 },
      { label: '最精华的部分——铺垫比正片更迷人', value: 3 },
    ],
  },
  {
    id: 'dq18', dim: 'D4',
    text: '如果亲密关系是音乐，你选哪种？',
    multiSelect: true,
    options: [
      { label: '电子乐——节拍猛烈到心跳加速', value: 1 },
      { label: '摇滚——嘶吼到失控的快感', value: 1 },
      { label: '爵士——慵懒暧昧的慢节奏', value: 3 },
      { label: 'R&B——丝滑到骨子里的温柔', value: 3 },
    ],
  },
  {
    id: 'dq19', dim: 'D4',
    text: '你更喜欢哪种"结束方式"？',
    options: [
      { label: '戛然而止——在最高潮的时候结束才刻骨铭心', value: 1 },
      { label: '看情况', value: 2 },
      { label: '余韵绵长——慢慢降落，舍不得结束', value: 3 },
    ],
  },
  {
    id: 'dq20', dim: 'D4',
    text: '你对"温柔"怎么看？',
    options: [
      { label: '无聊的代名词——我要的是冲击力', value: 1 },
      { label: '偶尔可以，但不能一直温柔', value: 2 },
      { label: '最高级的武器——温柔比粗暴更致命', value: 3 },
    ],
  },

  // ===== D5: 探索欲 (E vs L) =====
  {
    id: 'dq21', dim: 'D5',
    text: '你对"试试新花样"的态度？',
    options: [
      { label: '来啊！新花样就是生命力', value: 1 },
      { label: '不排斥，但要看具体是什么', value: 2 },
      { label: '现在这样就很好，为什么要变？', value: 3 },
    ],
  },
  {
    id: 'dq22', dim: 'D5',
    text: '如果你的伴侣提出一个你从没试过的亲密方式，你会？',
    multiSelect: true,
    options: [
      { label: '眼前一亮——终于有人跟得上我了', value: 1 },
      { label: '好奇但需要先了解一下再决定', value: 2 },
      { label: '有点排斥但可以商量', value: 3 },
      { label: '委婉拒绝——我有我的舒适区', value: 4 },
    ],
  },
  {
    id: 'dq23', dim: 'D5',
    text: '关于"禁忌"这个词？',
    options: [
      { label: '禁忌就是用来打破的——越禁止越想试', value: 1 },
      { label: '有些可以试，有些确实不行', value: 2 },
      { label: '禁忌存在自有道理，不碰为妙', value: 3 },
    ],
  },
  {
    id: 'dq24', dim: 'D5',
    text: '你的"亲密清单"大概有多长？',
    options: [
      { label: '长到需要分章节——人生苦短，体验为王', value: 1 },
      { label: '有几样想尝试的，但不多', value: 2 },
      { label: '没有清单——顺其自然就好', value: 3 },
    ],
  },
  {
    id: 'dq25', dim: 'D5',
    text: '你觉得"一成不变"的亲密关系？',
    multiSelect: true,
    options: [
      { label: '是一种慢性死亡', value: 1 },
      { label: '需要主动注入新鲜感', value: 1 },
      { label: '稳定也是一种幸福', value: 3 },
      { label: '深度比广度更让我满足', value: 3 },
    ],
  },

  // ===== D6: 幻想值 (H vs R) =====
  {
    id: 'dq26', dim: 'D6',
    text: '你脑子里的"私密剧场"播放频率是？',
    options: [
      { label: '24/7循环播放——脑子比身体忙', value: 1 },
      { label: '偶尔放一场——有灵感的时候', value: 2 },
      { label: '基本停业——我更关注现实', value: 3 },
    ],
  },
  {
    id: 'dq27', dim: 'D6',
    text: '你有没有过这样的体验：现实里不敢做的事，在脑子里演了无数遍？',
    options: [
      { label: '太多了——脑内版的我比真人版大胆一百倍', value: 1 },
      { label: '有过几次，谁没有呢', value: 2 },
      { label: '很少，我想什么就做什么，不用脑补', value: 3 },
    ],
  },
  {
    id: 'dq28', dim: 'D6',
    text: '你的幻想通常是？',
    multiSelect: true,
    options: [
      { label: '有完整剧情——场景、对白、起承转合都有', value: 1 },
      { label: '角色扮演型——我在里面不是"我"', value: 1 },
      { label: '画面感很强但没什么剧情', value: 2 },
      { label: '我很少幻想这些', value: 4 },
    ],
  },
  {
    id: 'dq29', dim: 'D6',
    text: '如果有人能看到你脑子里想的画面，你会？',
    options: [
      { label: '社会性死亡——我的脑内剧场太劲爆了', value: 1 },
      { label: '有点尴尬但也不至于太离谱', value: 2 },
      { label: '无所谓，我脑子里跟现实差不多', value: 3 },
    ],
  },
  {
    id: 'dq30', dim: 'D6',
    text: '你觉得"幻想"和"现实"的关系是？',
    multiSelect: true,
    options: [
      { label: '幻想是现实的预告片——迟早要实现', value: 1 },
      { label: '幻想比现实更精彩——因为没有限制', value: 1 },
      { label: '幻想归幻想，现实归现实，别搞混', value: 3 },
      { label: '现实就已经够刺激了，不需要幻想加持', value: 3 },
    ],
  },
];

export const specialQuestions: Question[] = [
  {
    id: 'kink_gate',
    text: '你有没有一个从来没告诉过任何人的秘密幻想？',
    options: [
      { label: '没有，我挺坦荡的', value: 1 },
      { label: '有，但不算太出格', value: 2 },
      { label: '有，而且我觉得说出来会被评判', value: 3 },
      { label: '有。如果你知道了会重新认识我这个人。', value: 4 },
    ],
    special: true,
  },
];
