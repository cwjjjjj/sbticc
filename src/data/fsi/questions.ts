// src/data/fsi/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 CTRL 遥控器强度（L=放养，H=被安排） =====
  {
    id: 'ctrl1', dim: 'D1',
    text: '你大三那年选职业方向时，家里的态度更像哪一种？',
    options: [
      { label: '早就帮你选好了，不选就是不孝', value: 4 },
      { label: '嘴上说随你，但每次都拐回"那个专业才稳定"', value: 3 },
      { label: '问了一次你怎么想，听完就不管了', value: 2 },
      { label: '完全没问，你选的时候都不知道他们关不关心', value: 1 },
    ],
  },
  {
    id: 'ctrl2', dim: 'D1',
    text: '你工作后做一个重要决定（辞职/搬城市/分手），要不要告诉家里？',
    options: [
      { label: '必须先打个招呼，不然后面吵不完', value: 4 },
      { label: '决定了再说，但要挑个好时机', value: 3 },
      { label: '顺口提一下，他们的意见不会改我的决定', value: 2 },
      { label: '不说，说了他们也不会懂', value: 1 },
    ],
  },
  {
    id: 'ctrl3', dim: 'D1',
    text: '你谈了恋爱，家里第一反应是？',
    options: [
      { label: '要照片、要情况、要见面时间', value: 4 },
      { label: '会问几句，但不追', value: 3 },
      { label: '淡淡说一句"别耽误正事"就没下文', value: 2 },
      { label: '你不说他们不会问，你也不打算说', value: 1 },
    ],
  },
  {
    id: 'ctrl4', dim: 'D1',
    text: '独自做一个重大选择的时候，你心里的默认声音是？',
    options: [
      { label: '如果他们知道了会怎么想', value: 4 },
      { label: '先自己想清楚，然后想他们会不会反对', value: 3 },
      { label: '先自己想清楚，然后决定要不要告诉他们', value: 2 },
      { label: '没什么默认声音，就是自己做', value: 1 },
    ],
  },

  // ===== D2 WARM 体感温度（L=冷藏柜，H=热灶台） =====
  {
    id: 'warm1', dim: 'D2',
    text: '你在外地工作，一个人生病躺床上，你会告诉家里吗？',
    options: [
      { label: '会，他们会立刻打电话问到底，像审犯人', value: 4 },
      { label: '会，但他们可能就是一句"多喝水"', value: 3 },
      { label: '不会，告诉了也没用', value: 1 },
      { label: '不会，不想让他们担心', value: 3 },
    ],
  },
  {
    id: 'warm2', dim: 'D2',
    text: '你家过年是什么画面？',
    options: [
      { label: '一大桌子人吵吵嚷嚷，吃到一半开始翻旧账', value: 4 },
      { label: '有点仪式感但不热闹，吃完各回各房', value: 2 },
      { label: '其实不太聚了，各过各的', value: 1 },
      { label: '安静吃饭，电视声音比人声大', value: 2 },
    ],
  },
  {
    id: 'warm3', dim: 'D2',
    text: '你上一次和家人拥抱是什么时候？',
    options: [
      { label: '昨天', value: 4 },
      { label: '最近一次回家', value: 3 },
      { label: '想不起来了', value: 1 },
      { label: '我们家不怎么拥抱', value: 1 },
    ],
  },
  {
    id: 'warm4', dim: 'D2',
    text: '你分享一件真正开心的事（比如升职），家里的反应更接近？',
    options: [
      { label: '全家一起乐，朋友圈马上转发', value: 4 },
      { label: '说一句"不错"，然后就是"下一步呢"', value: 3 },
      { label: '淡淡回一句"嗯，挺好"', value: 2 },
      { label: '他们反应平平，你也不期待什么', value: 1 },
    ],
  },

  // ===== D3 GNDR 性别出厂设置（L=去性别化，H=重男/重女） =====
  {
    id: 'gndr1', dim: 'D3',
    text: '家里对"男孩"和"女孩"的态度更像？',
    options: [
      { label: '差别很大，你或你兄弟姐妹明显是那个被区别对待的', value: 4 },
      { label: '差别存在，但说出来会被否认', value: 3 },
      { label: '大体公平，偶尔有小区别', value: 2 },
      { label: '没怎么区分过，我都没意识到', value: 1 },
    ],
  },
  {
    id: 'gndr2', dim: 'D3',
    text: '"你是个 xxx 就应该……"（xxx=男孩/女孩）这种话你听过多少？',
    options: [
      { label: '从小听到大，句式我都能背', value: 4 },
      { label: '偶尔听，尤其是亲戚场合', value: 3 },
      { label: '几乎没听过', value: 1 },
      { label: '我家用的是别的话术，但内核差不多', value: 3 },
    ],
  },

  // ===== D4 MNEY 经济牵引力（L=钱是钱，H=钱即爱） =====
  {
    id: 'mney1', dim: 'D4',
    text: '家里打电话寒暄两句，突然问"一个月能攒多少？" 你的胸口——',
    options: [
      { label: '立刻紧，知道接下来要聊什么', value: 4 },
      { label: '有点无奈但也没事，随便报一个数', value: 3 },
      { label: '正常回答，这种问题我家常聊', value: 3 },
      { label: '我家不太问钱的事，所以有点懵', value: 1 },
    ],
  },
  {
    id: 'mney2', dim: 'D4',
    text: '家里拿过你的钱帮谁（哥哥弟弟/侄子/还债/给亲戚）吗？',
    options: [
      { label: '有，而且不止一次，问过也说不清', value: 4 },
      { label: '有过一次，你还在消化', value: 3 },
      { label: '没拿过，但问过几次', value: 2 },
      { label: '没有这种事', value: 1 },
    ],
  },
  {
    id: 'mney3', dim: 'D4',
    text: '你买一件有点贵的东西（比如包/相机/游戏机），家里的反应？',
    options: [
      { label: '立刻"你一个月多少钱就花这么多"', value: 4 },
      { label: '嘴上说随便你，但重复念叨很多天', value: 3 },
      { label: '问一句多少钱就过去了', value: 2 },
      { label: '你不说他们就不知道，也不问', value: 1 },
    ],
  },
  {
    id: 'mney4', dim: 'D4',
    text: '"我们养你花了多少钱"这种话你家出现过吗？',
    options: [
      { label: '出现过，而且还会定期更新版本', value: 4 },
      { label: '偶尔会，大多在吵架时', value: 3 },
      { label: '大概没说过，但暗示肯定有过', value: 2 },
      { label: '我家不用这种账', value: 1 },
    ],
  },

  // ===== D5 LITE 能见度光强（L=透明人，H=聚光灯） =====
  {
    id: 'lite1', dim: 'D5',
    text: '你的朋友圈/人际/工作动态，家里知道多少？',
    options: [
      { label: '几乎全知道，亲戚群里比你自己更新还快', value: 4 },
      { label: '主要动态知道，小事他们不掺和', value: 3 },
      { label: '知道的不多，因为你不怎么讲', value: 2 },
      { label: '他们基本不知道，也不主动问', value: 1 },
    ],
  },
  {
    id: 'lite2', dim: 'D5',
    text: '你做了一件自己挺得意的事，期待家里看见的心情是？',
    options: [
      { label: '期待，并且已经想好怎么发群里', value: 4 },
      { label: '希望他们看见，但不会主动讲', value: 3 },
      { label: '看见也行，不看见也行', value: 2 },
      { label: '他们看不看见，我都不会专门讲', value: 1 },
    ],
  },
  {
    id: 'lite3', dim: 'D5',
    text: '家里人提到你的时候，第三方听到的感觉是？',
    options: [
      { label: '全村都知道你最近在干嘛', value: 4 },
      { label: '亲戚里知道你的大概情况', value: 3 },
      { label: '很少被提到，除非过年碰面', value: 2 },
      { label: '他们很少主动聊起你', value: 1 },
    ],
  },
  {
    id: 'lite4', dim: 'D5',
    text: '你小时候考得好，家里的反应更像？',
    options: [
      { label: '全家亲戚朋友圈一起刷屏', value: 4 },
      { label: '夸一句，然后说"别骄傲"', value: 3 },
      { label: '看一眼成绩单，没什么表情', value: 2 },
      { label: '我不太记得他们有没有反应', value: 1 },
    ],
  },

  // ===== D6 ECHO 代际回音（L=反叛派，H=复刻派） =====
  {
    id: 'echo1', dim: 'D6',
    text: '你脱口而出一句话，说完自己愣了——因为那是你爸/你妈的原话。你的反应？',
    options: [
      { label: '笑了一下，没事，他们那套有时候也对', value: 4 },
      { label: '心里咯噔一下，不太想承认我像他们', value: 2 },
      { label: '立刻改口"我不是这个意思"', value: 1 },
      { label: '根本没意识到，是朋友提醒我才发现', value: 3 },
    ],
  },
  {
    id: 'echo2', dim: 'D6',
    text: '你谈恋爱/处朋友的方式，像谁多一点？',
    options: [
      { label: '和我妈/我爸的某个习惯几乎一模一样', value: 4 },
      { label: '一半像他们，一半反着来', value: 3 },
      { label: '刻意反着来，我要跟他们不一样', value: 1 },
      { label: '我不觉得像谁，就是我自己', value: 2 },
    ],
  },
  {
    id: 'echo3', dim: 'D6',
    text: '你要带小孩/想象自己带小孩时，脑子里冒出来的第一句话是？',
    options: [
      { label: '"我当年就是这样被养大的，也挺好"', value: 4 },
      { label: '"我知道哪些做法不能照搬，但具体怎么做我也没方案"', value: 3 },
      { label: '"我绝不变成他们那样"', value: 1 },
      { label: '我从没认真想过这件事', value: 2 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // 第 22 题 gate —— 用于触发隐藏 BOSSY 的"条件之一"（还需配合高 CTRL/LITE/ECHO）
  {
    id: 'fsi_gate', special: true, kind: 'gate',
    text: '你现在和父母的关系，更像哪一种？',
    options: [
      { label: 'A. 还是他们说了算，我大多数时候配合', value: 1 },
      { label: 'B. 一人一半，谁也不听谁的', value: 2 },
      { label: 'C. 我反过来管他们了（过年由我拍板、红包我发、他们看我脸色）', value: 3 },
      { label: 'D. 基本不联系了，谁也不管谁', value: 4 },
    ],
  },
];
