import type { Question } from '../testConfig';

export const questions: Question[] = [
  { id: 'lq1', dim: 'D1', text: '有人给你介绍对象，你第一反应是？', options: [{ label: '先看照片，有feel再说', value: 1 }, { label: '照片条件都看看，综合判断', value: 2 }, { label: '先问职业学历收入，数据合格再见', value: 3 }] },
  { id: 'lq2', dim: 'D1', text: '你对"门当户对"怎么看？', options: [{ label: '爱情面前一切条件都是浮云', value: 1 }, { label: '有道理但不是决定性的', value: 2 }, { label: '不门当户对的关系迟早出问题', value: 3 }] },
  { id: 'lq3', dim: 'D1', text: '朋友劝你"TA条件很好别错过"，但你就是没感觉。你会？', options: [{ label: '没心动就是没心动，条件再好也白搭', value: 1 }, { label: '犹豫一下，先接触看看能不能培养感觉', value: 2 }, { label: '试试呗，感觉这东西可以慢慢来', value: 3 }] },
  { id: 'lq4', dim: 'D1', text: '回忆你历史上的心动瞬间，让你上头的通常是？', options: [{ label: '一个眼神、一句话、某个瞬间的氛围', value: 1 }, { label: '相处久了发现对方各方面都不错', value: 2 }, { label: '了解到对方的实力和人品后才真正动心', value: 3 }] },
  { id: 'lq5', dim: 'D2', text: '你在聚会上看到一个让你心动的陌生人，你会？', options: [{ label: '直接走过去搭话，机会稍纵即逝', value: 1 }, { label: '找朋友帮忙引荐，给自己留点余地', value: 2 }, { label: '偷看两眼，然后等TA来找你', value: 3 }] },
  { id: 'lq6', dim: 'D2', text: '暧昧期你发了条消息对方两小时没回，你会？', options: [{ label: '再发一条，不玩猜心游戏', value: 1 }, { label: '等等看，但心里开始胡思乱想了', value: 2 }, { label: '放下手机做自己的事，TA想回自然会回', value: 3 }] },
  { id: 'lq7', dim: 'D2', text: '关于表白这件事，你的态度是？', options: [{ label: '喜欢就说，被拒了也比不说好', value: 1 }, { label: '等关系更近一些、确定对方也有意思再说', value: 2 }, { label: '从不主动表白，如果对方也喜欢TA会来找我', value: 3 }] },
  { id: 'lq8', dim: 'D2', text: '在感情中你更像？', options: [{ label: '追光者——看到目标就冲', value: 1 }, { label: '看情况，有时主动有时被动', value: 2 }, { label: '磁铁——吸引对方来找我', value: 3 }] },
  { id: 'lq9', dim: 'D3', text: '你理想的情侣日常是？', options: [{ label: '每天腻在一起，干什么都一起', value: 1 }, { label: '有各自的空间，但每天要联系', value: 2 }, { label: '各过各的，约了再见面', value: 3 }] },
  { id: 'lq10', dim: 'D3', text: '对方想看你的手机，你的反应是？', options: [{ label: '随便看，我没什么好藏的', value: 1 }, { label: '可以看，但你这个行为让我有点不舒服', value: 2 }, { label: '不行。手机是我的私人领地', value: 3 }] },
  { id: 'lq11', dim: 'D3', text: '你们吵架冷战了一天，你会？', options: [{ label: '受不了，立刻打电话求和', value: 1 }, { label: '等到晚上，主动发条消息缓和一下', value: 2 }, { label: '各自冷静，想通了再聊', value: 3 }] },
  { id: 'lq12', dim: 'D3', text: '关于"交出所有社交账号密码"，你觉得？', options: [{ label: '这是信任的表现，我愿意', value: 1 }, { label: '没必要但如果对方需要可以给', value: 2 }, { label: '绝对不行，爱情不等于放弃隐私', value: 3 }] },
  { id: 'lq13', dim: 'D4', text: '你相信"命中注定的另一半"这回事吗？', options: [{ label: '绝对相信，TA在某个地方等我', value: 1 }, { label: '半信半疑，缘分和努力各占一半吧', value: 2 }, { label: '不信。合适的人是选出来和磨合出来的', value: 3 }] },
  { id: 'lq14', dim: 'D4', text: '恋爱三年，激情褪去了，你怎么看？', options: [{ label: '说明不是真爱，真爱应该永远心动', value: 1 }, { label: '正常，但要想办法保持新鲜感', value: 2 }, { label: '太正常了，感情本来就会从激情变成亲情', value: 3 }] },
  { id: 'lq15', dim: 'D4', text: '伴侣各方面都好，但你就是没有怦然心动的感觉。你会？', options: [{ label: '没有心动的感觉我做不到，对不起', value: 1 }, { label: '纠结很久，可能先处着看', value: 2 }, { label: '心动不心动不重要，合适最重要', value: 3 }] },
  { id: 'lq16', dim: 'D4', text: '你对"爱情片/恋爱小说"的态度是？', options: [{ label: '超爱看！看完相信世界上真的有那样的爱情', value: 1 }, { label: '偶尔看看当消遣，看完也就看完了', value: 2 }, { label: '很少看，太不真实了看着尴尬', value: 3 }] },
];

export const specialQuestions: Question[] = [
  {
    id: 'ex_gate',
    text: '你手机里还有前任的聊天记录吗？',
    options: [
      { label: '早删了，眼不见心不烦', value: 1 },
      { label: '还在但基本不看了', value: 2 },
      { label: '还在……偶尔会翻一翻', value: 3 },
    ],
    special: true,
  },
];

export const EX_TRIGGER_QUESTION_ID = 'ex_gate';
