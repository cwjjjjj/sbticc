// src/data/fpi/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 POST 发布密度（L=极少发，H=高频发） =====
  {
    id: 'post1', dim: 'D1',
    text: '你看到一件很想分享的小事，第一反应是？',
    options: [
      { label: '立刻拍照发出去，不然情绪过期', value: 4 },
      { label: '先存着，晚上统一整理发', value: 3 },
      { label: '想想算了，别人应该也不关心', value: 2 },
      { label: '我一般只发给具体的人', value: 1 },
    ],
  },
  {
    id: 'post2', dim: 'D1',
    text: '你的朋友圈更新频率更像？',
    options: [
      { label: '连载小说', value: 4 },
      { label: '周报', value: 3 },
      { label: '节气提醒', value: 2 },
      { label: '年度遗迹', value: 1 },
    ],
  },
  {
    id: 'post3', dim: 'D1',
    text: '旅行途中你更可能？',
    options: [
      { label: '边走边发，观众实时跟进', value: 4 },
      { label: '回酒店修图发精选', value: 3 },
      { label: '回来后发一条总结', value: 2 },
      { label: '不发，去过就行', value: 1 },
    ],
  },
  {
    id: 'post4', dim: 'D1',
    text: '你删掉一条已发动态的常见原因是？',
    options: [
      { label: '发太多了，怕刷屏', value: 4 },
      { label: '图不够好看', value: 3 },
      { label: '情绪冷了', value: 2 },
      { label: '想起不该给某些人看', value: 1 },
    ],
  },

  // ===== D2 POLI 精修强度（L=原图直出，H=精修展览） =====
  {
    id: 'poli1', dim: 'D2',
    text: '发图前你会修到什么程度？',
    options: [
      { label: '滤镜、裁切、亮度、顺序都要管', value: 4 },
      { label: '简单调一下别太丑', value: 3 },
      { label: '原图直出，糊也是真实', value: 1 },
      { label: '我根本懒得发图', value: 1 },
    ],
  },
  {
    id: 'poli2', dim: 'D2',
    text: '九宫格里有一张颜色不协调，你会？',
    options: [
      { label: '换掉，不允许破坏整体气质', value: 4 },
      { label: '调一下让它别太突兀', value: 3 },
      { label: '无所谓，内容更重要', value: 2 },
      { label: '九宫格是什么大型工程', value: 1 },
    ],
  },
  {
    id: 'poli3', dim: 'D2',
    text: '你写朋友圈文案时更像？',
    options: [
      { label: '广告公司结案', value: 4 },
      { label: '小红书标题优化', value: 3 },
      { label: '随手一句人话', value: 2 },
      { label: '只发图，不配字', value: 1 },
    ],
  },
  {
    id: 'poli4', dim: 'D2',
    text: '别人夸你朋友圈好看，你内心会？',
    options: [
      { label: '暗爽，因为确实运营过', value: 4 },
      { label: '有点开心，但装作随便发的', value: 3 },
      { label: '觉得他们想多了', value: 2 },
      { label: '想不起上次被夸是什么时候', value: 1 },
    ],
  },

  // ===== D3 MASK 人设意识（L=不经营，H=经营形象） =====
  {
    id: 'mask1', dim: 'D3',
    text: '你发朋友圈时会想"别人会怎么看我"吗？',
    options: [
      { label: '会，而且这就是重点', value: 4 },
      { label: '偶尔会，尤其是重要动态', value: 3 },
      { label: '不太会，我只是表达', value: 2 },
      { label: '我会想谁不能看', value: 3 },
    ],
  },
  {
    id: 'mask2', dim: 'D3',
    text: '你更希望朋友圈呈现出的自己是？',
    options: [
      { label: '生活有质感', value: 4 },
      { label: '有趣又不费力', value: 3 },
      { label: '真实但别太狼狈', value: 2 },
      { label: '最好什么都别被解读', value: 1 },
    ],
  },
  {
    id: 'mask3', dim: 'D3',
    text: '如果朋友圈被新同事翻到，你希望他觉得你？',
    options: [
      { label: '很会生活', value: 4 },
      { label: '很靠谱', value: 3 },
      { label: '很好相处', value: 2 },
      { label: '翻不到，谢谢', value: 1 },
    ],
  },
  {
    id: 'mask4', dim: 'D3',
    text: '你最受不了自己朋友圈出现哪种感觉？',
    options: [
      { label: '土', value: 4 },
      { label: '装', value: 3 },
      { label: '负能量', value: 2 },
      { label: '暴露太多', value: 3 },
    ],
  },

  // ===== D4 EMOT 情绪电压（L=情绪收纳，H=情绪外放） =====
  {
    id: 'emot1', dim: 'D4',
    text: '情绪很满的时候，你会？',
    options: [
      { label: '发一条只有懂的人懂', value: 4 },
      { label: '写小作文，但可能设分组', value: 3 },
      { label: '找朋友私聊', value: 2 },
      { label: '睡一觉，当没事', value: 1 },
    ],
  },
  {
    id: 'emot2', dim: 'D4',
    text: '深夜朋友圈对你来说是？',
    options: [
      { label: '精神急诊室', value: 4 },
      { label: '灵感收容所', value: 3 },
      { label: '别人的迷惑行为观察窗', value: 2 },
      { label: '我已经睡了', value: 1 },
    ],
  },
  {
    id: 'emot3', dim: 'D4',
    text: '你会转发情绪类文章/歌/视频吗？',
    options: [
      { label: '会，那就是我的嘴替', value: 4 },
      { label: '偶尔，真的被击中才会', value: 3 },
      { label: '很少，怕显得太用力', value: 2 },
      { label: '不会，我不想公开情绪', value: 1 },
    ],
  },
  {
    id: 'emot4', dim: 'D4',
    text: '别人在你动态下问"怎么了"，你会？',
    options: [
      { label: '等的就是这句', value: 4 },
      { label: '私聊解释', value: 3 },
      { label: '回一句没事', value: 2 },
      { label: '立刻后悔发了', value: 1 },
    ],
  },

  // ===== D5 ECHO 互动渴望（L=发完就走，H=在意反馈） =====
  {
    id: 'echo1', dim: 'D5',
    text: '发完朋友圈后，你会看点赞评论吗？',
    options: [
      { label: '会，甚至刷新', value: 4 },
      { label: '会看，但不承认在等', value: 3 },
      { label: '随缘', value: 2 },
      { label: '通知都关了', value: 1 },
    ],
  },
  {
    id: 'echo2', dim: 'D5',
    text: '你最喜欢哪种评论？',
    options: [
      { label: '接梗', value: 4 },
      { label: '夸我', value: 3 },
      { label: '问细节', value: 3 },
      { label: '别评论也行', value: 1 },
    ],
  },
  {
    id: 'echo3', dim: 'D5',
    text: '你给别人点赞通常是？',
    options: [
      { label: '维持关系的基础礼仪', value: 4 },
      { label: '真的觉得不错', value: 3 },
      { label: '手滑或顺手', value: 2 },
      { label: '我很少点赞', value: 1 },
    ],
  },
  {
    id: 'echo4', dim: 'D5',
    text: '如果一条精心动态没人理，你会？',
    options: [
      { label: '怀疑人生和发布时间', value: 4 },
      { label: '有点尴尬但不删', value: 3 },
      { label: '无所谓', value: 2 },
      { label: '下次更不想发', value: 1 },
    ],
  },

  // ===== D6 GATE 边界控制（L=谁看都差不多，H=权限管理员） =====
  {
    id: 'gate1', dim: 'D6',
    text: '你使用分组/屏蔽的熟练度？',
    options: [
      { label: '像后台权限管理员', value: 4 },
      { label: '关键人会管', value: 3 },
      { label: '很少用', value: 2 },
      { label: '不会用，也不想学', value: 1 },
    ],
  },
  {
    id: 'gate2', dim: 'D6',
    text: '你对"三天可见"的态度是？',
    options: [
      { label: '必须开，互联网不配拥有我的过去', value: 4 },
      { label: '看阶段，心情不好就开', value: 3 },
      { label: '不开，发了就发了', value: 2 },
      { label: '我不发，所以无所谓', value: 2 },
    ],
  },
  {
    id: 'gate3', dim: 'D6',
    text: '哪类人最影响你发朋友圈？',
    options: [
      { label: '同事/领导', value: 4 },
      { label: '亲戚/父母', value: 3 },
      { label: '前任/暧昧对象', value: 3 },
      { label: '没人影响我', value: 1 },
    ],
  },
  {
    id: 'gate4', dim: 'D6',
    text: '你会为不同平台调整同一件事的表达吗？',
    options: [
      { label: '会，朋友圈一版，小红书一版，抖音一版', value: 4 },
      { label: '会略微调整', value: 3 },
      { label: '基本复制粘贴', value: 2 },
      { label: '不跨平台发', value: 1 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // 隐藏触发：选 D 直接触发 0POST，但仍继续答题以展示维度雷达
  {
    id: 'fpi_gate', special: true, kind: 'gate',
    text: '你上一次认真发朋友圈是什么时候？',
    options: [
      { label: '这周', value: 1 },
      { label: '这个月', value: 2 },
      { label: '半年内', value: 3 },
      { label: '我已经不记得朋友圈入口长什么样', value: 4 },
    ],
  },
];
