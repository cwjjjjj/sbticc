import type { Question } from '../testConfig';

export const questions: Question[] = [
  { id: 'vq1', dim: 'D1', text: '30岁了还没有稳定的职业方向，你怎么看？', options: [{ label: '很正常啊，人生又不是只有一条路', value: 1 }, { label: '有点焦虑，但还来得及', value: 2 }, { label: '说实话确实有点晚了，该认真规划了', value: 3 }] },
  { id: 'vq2', dim: 'D1', text: '你对"努力就会有回报"这句话怎么看？', options: [{ label: '相信，方向对了努力一定有意义', value: 1 }, { label: '有时候信有时候不信，看心情', value: 2 }, { label: '不信。努力只是入场券，结果看运气和资源', value: 3 }] },
  { id: 'vq3', dim: 'D1', text: '刷到同龄人晒offer/买房/结婚，你的第一反应是？', options: [{ label: '真好，替他们开心，自己也会有的', value: 1 }, { label: '酸了一秒，然后继续刷下一条', value: 2 }, { label: '焦虑，感觉自己被同龄人甩开了', value: 3 }] },
  { id: 'vq4', dim: 'D1', text: '如果可以预知自己的未来，你会选择看吗？', options: [{ label: '不看，未知才有惊喜', value: 1 }, { label: '看一眼大方向就好', value: 2 }, { label: '当然看，这样我才能提前做准备', value: 3 }] },
  { id: 'vq5', dim: 'D2', text: '你有了一个创业的想法，接下来你会？', options: [{ label: '先干起来，边做边调整', value: 1 }, { label: '找几个朋友聊聊，合理就行动', value: 2 }, { label: '先做市场调研、写商业计划书、评估风险', value: 3 }] },
  { id: 'vq6', dim: 'D2', text: '你对"裸辞"这件事怎么看？', options: [{ label: '想好了就辞，人生苦短别委屈自己', value: 1 }, { label: '有一定存款的情况下可以考虑', value: 2 }, { label: '不可能，必须找好下家才能辞', value: 3 }] },
  { id: 'vq7', dim: 'D2', text: '周末突然有个好活动但需要马上报名，你会？', options: [{ label: '冲！有趣比计划重要', value: 1 }, { label: '看看时间安排，不冲突就报', value: 2 }, { label: '算了吧，临时改计划让我很不舒服', value: 3 }] },
  { id: 'vq8', dim: 'D2', text: '面对一个50%概率赚10万、50%概率亏5万的机会，你选？', options: [{ label: '冲！期望值是正的', value: 1 }, { label: '纠结，但可能会试试', value: 2 }, { label: '不赌，我接受不了亏损的可能', value: 3 }] },
  { id: 'vq9', dim: 'D3', text: '你的理想周末是怎样的？', options: [{ label: '约一堆朋友出去浪', value: 1 }, { label: '跟一两个好朋友吃顿饭', value: 2 }, { label: '一个人窝在家里，谁也别来烦我', value: 3 }] },
  { id: 'vq10', dim: 'D3', text: '公司团建你的态度是？', options: [{ label: '太好了！认识新朋友的机会', value: 1 }, { label: '去可以，但别太久', value: 2 }, { label: '能不去就不去，社恐的噩梦', value: 3 }] },
  { id: 'vq11', dim: 'D3', text: '遇到困难的时候你会？', options: [{ label: '找朋友倾诉，说出来就好多了', value: 1 }, { label: '看情况，有些事可以说有些不行', value: 2 }, { label: '自己扛，我不喜欢让别人看到我脆弱', value: 3 }] },
  { id: 'vq12', dim: 'D3', text: '关于朋友数量vs质量，你更看重？', options: [{ label: '多多益善，人脉就是资源', value: 1 }, { label: '不多不少，精力有限但也不能太封闭', value: 2 }, { label: '三五知己足矣，泛泛之交浪费时间', value: 3 }] },
  { id: 'vq13', dim: 'D4', text: '如果经济条件允许，你会选择gap year吗？', options: [{ label: '必须的！人生不只有工作', value: 1 }, { label: '挺想的，但怕回来跟不上节奏', value: 2 }, { label: '不会，空白期会让简历很难看', value: 3 }] },
  { id: 'vq14', dim: 'D4', text: '关于买房这件事你怎么看？', options: [{ label: '租房也挺好，自由最重要', value: 1 }, { label: '有条件就买，但不会为了买房牺牲太多', value: 2 }, { label: '必须买，有房子才有安全感', value: 3 }] },
  { id: 'vq15', dim: 'D4', text: '你对考公/进体制怎么看？', options: [{ label: '打死不去，我受不了那种一眼望到头的生活', value: 1 }, { label: '各有利弊吧，看个人选择', value: 2 }, { label: '挺好的，稳定是真正的奢侈品', value: 3 }] },
  { id: 'vq16', dim: 'D4', text: '你存款的主要动力是？', options: [{ label: '存钱是为了有底气随时说走就走', value: 1 }, { label: '有点存款心里踏实，但也要享受当下', value: 2 }, { label: '存钱就是安全感，越多越好', value: 3 }] },
];

export const specialQuestions: Question[] = [
  {
    id: 'mlc_gate',
    text: '最近有没有突然觉得自己这辈子好像就这样了？',
    options: [
      { label: '没有，我觉得好戏还在后头', value: 1 },
      { label: '偶尔会这么想，但很快就过去了', value: 2 },
      { label: '经常。越想越觉得什么都来不及了', value: 3 },
    ],
    special: true,
  },
];

export const MLC_TRIGGER_QUESTION_ID = 'mlc_gate';
