import type { Question } from '../testConfig';

export const questions: Question[] = [
  // D1 — 工作驱动: P(热爱/A=1) vs G(利益/B=3)
  { id: 'wq1', dim: 'D1', text: '周日晚上你会因为什么失眠？', options: [{ label: '明天有个项目特别想推进，兴奋得睡不着', value: 1 }, { label: '想想工作也想想工资，心情复杂', value: 2 }, { label: '想到房贷/房租就睡不着，明天又要卖命了', value: 3 }] },
  { id: 'wq2', dim: 'D1', text: '如果中了500万彩票，你会？', options: [{ label: '继续上班，我是真的喜欢现在做的事', value: 1 }, { label: '先请个长假想想，然后大概还是会找点事做', value: 2 }, { label: '当天辞职，明天开始环游世界', value: 3 }] },
  { id: 'wq3', dim: 'D1', text: '跳槽的时候你最看重什么？', options: [{ label: '做的事有没有意义、能不能学到东西', value: 1 }, { label: '综合看吧，钱和成长都要考虑', value: 2 }, { label: '涨薪幅度，其他都是虚的', value: 3 }] },
  { id: 'wq4', dim: 'D1', text: '有人说"如果不用上班你最想做什么"，你的回答是？', options: [{ label: '说实话……可能还是在做现在类似的事', value: 1 }, { label: '做点自己感兴趣的副业吧', value: 2 }, { label: '躺着。什么都不做。这还用问？', value: 3 }] },

  // D2 — 协作模式: S(独狼/A=1) vs T(团队/B=3)
  { id: 'wq5', dim: 'D2', text: '你最高效的工作状态是？', options: [{ label: '戴上耳机一个人闷头干，别来烦我', value: 1 }, { label: '看情况，有些事需要讨论有些不需要', value: 2 }, { label: '和团队一起头脑风暴，越聊越有灵感', value: 3 }] },
  { id: 'wq6', dim: 'D2', text: '领导说"这个项目组队做"，你的第一反应是？', options: [{ label: '内心OS：又来了，不如我一个人干完', value: 1 }, { label: '行吧，看看队友是谁再说', value: 2 }, { label: '太好了！一个人干多无聊啊', value: 3 }] },
  { id: 'wq7', dim: 'D2', text: '工作群有人@所有人讨论方案，你会？', options: [{ label: '私聊相关人，群里太吵了效率低', value: 1 }, { label: '看看讨论内容再决定要不要参与', value: 2 }, { label: '立刻加入讨论，这种氛围我喜欢', value: 3 }] },
  { id: 'wq8', dim: 'D2', text: '你理想的办公环境是？', options: [{ label: '独立隔间/远程办公，清净最重要', value: 1 }, { label: '开放工位也行，只要别太吵', value: 2 }, { label: '开放式办公，随时能找人聊两句', value: 3 }] },

  // D3 — 决策风格: R(速决/A=1) vs C(谨慎/B=3)
  { id: 'wq9', dim: 'D3', text: '老板让你明天给个方案，你会？', options: [{ label: '今晚就给，先干了再说', value: 1 }, { label: '今晚出初稿明天再打磨一下', value: 2 }, { label: '跟老板说能不能多给两天，我想做得更完善', value: 3 }] },
  { id: 'wq10', dim: 'D3', text: '开会讨论了30分钟还没结论，你会？', options: [{ label: '直接拍板："就这么干吧，有问题再调"', value: 1 }, { label: '再听听各方意见，但别拖太久', value: 2 }, { label: '提议下次会议继续讨论，重大决定不能草率', value: 3 }] },
  { id: 'wq11', dim: 'D3', text: '面对一个有风险但可能回报很大的项目，你会？', options: [{ label: '冲了！不冲永远不知道结果', value: 1 }, { label: '评估一下风险再决定，给我点时间', value: 2 }, { label: '先做详细的可行性分析，数据说了算', value: 3 }] },
  { id: 'wq12', dim: 'D3', text: '你发了一封重要邮件后发现有个小错误，你会？', options: [{ label: '算了，又不影响理解，往前看', value: 1 }, { label: '看严不严重，严重就补一封更正', value: 2 }, { label: '立刻补发更正邮件并道歉，细节决定成败', value: 3 }] },

  // D4 — 职场信念: H(内卷/A=1) vs B(平衡/B=3)
  { id: 'wq13', dim: 'D4', text: '下班时间到了但工作没做完，你会？', options: [{ label: '加班做完，走的时候心里才踏实', value: 1 }, { label: '看紧不紧急，紧急就加班', value: 2 }, { label: '明天再说，命比工作重要', value: 3 }] },
  { id: 'wq14', dim: 'D4', text: '周末领导发了一条工作消息，你会？', options: [{ label: '秒回并开始处理，领导看到我的态度', value: 1 }, { label: '看一眼内容再决定回不回', value: 2 }, { label: '什么消息？我周末不看工作群', value: 3 }] },
  { id: 'wq15', dim: 'D4', text: '同事天天加班到很晚，你会？', options: [{ label: '焦虑，我是不是也该加班？别被比下去了', value: 1 }, { label: '偶尔焦虑一下但还是按自己节奏来', value: 2 }, { label: '关我什么事？TA卷TA的我躺我的', value: 3 }] },
  { id: 'wq16', dim: 'D4', text: '关于"35岁危机"，你的态度是？', options: [{ label: '所以我现在就得拼命积累，不能松懈', value: 1 }, { label: '有点焦虑但也不至于为此牺牲生活', value: 2 }, { label: '到时候再说呗，焦虑也改变不了什么', value: 3 }] },
];

export const specialQuestions: Question[] = [
  {
    id: 'work_gate',
    text: '你上一次连续加班超过一周是什么感受？',
    options: [
      { label: '累是累，但有成就感', value: 1 },
      { label: '身体扛不住，再也不想了', value: 2 },
      { label: '加班使我快乐！停下来反而不习惯', value: 3 },
    ],
    special: true,
  },
];

export const WORK_GATE_QUESTION_ID = 'work_gate';
