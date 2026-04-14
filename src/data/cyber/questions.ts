import type { Question } from '../testConfig';

export const questions: Question[] = [
  // D1: 内容角色 (C=Creator vs V=Viewer)
  { id: 'cq1', dim: 'D1', text: '刷到一个超好笑的段子，你的第一反应是？', options: [{ label: '自己也编一个更好笑的发出去', value: 1 }, { label: '哈哈哈转发到群里', value: 2 }, { label: '笑完继续刷下一条', value: 3 }] },
  { id: 'cq2', dim: 'D1', text: '朋友圈/微博，你的发布频率是？', options: [{ label: '日更选手，不发就难受', value: 1 }, { label: '偶尔发发，心情好的时候', value: 2 }, { label: '上一条动态考古都找不到了', value: 3 }] },
  { id: 'cq3', dim: 'D1', text: '有人说"在网上不发声就等于不存在"，你觉得？', options: [{ label: '完全同意，我必须让世界听到我的声音', value: 1 }, { label: '有道理但也没那么绝对', value: 2 }, { label: '不存在就不存在呗，我又不靠这活', value: 3 }] },
  { id: 'cq4', dim: 'D1', text: '你对"做自媒体/开账号"这件事的态度？', options: [{ label: '已经在做了/随时准备开干', value: 1 }, { label: '想过但没行动', value: 2 }, { label: '完全没兴趣，当观众挺好', value: 3 }] },

  // D2: 社交风格 (L=Loud vs Q=Quiet)
  { id: 'cq5', dim: 'D2', text: '你在群聊里通常扮演什么角色？', options: [{ label: '话题发起者，没我冷场', value: 1 }, { label: '偶尔冒泡，接个梗', value: 2 }, { label: '潜水冠军，只看不说', value: 3 }] },
  { id: 'cq6', dim: 'D2', text: '刷到一条你不同意的观点，你会？', options: [{ label: '直接评论区开怼', value: 1 }, { label: '在心里反驳一遍然后划走', value: 2 }, { label: '看都不想多看一眼', value: 3 }] },
  { id: 'cq7', dim: 'D2', text: '你的网友数量和互动频率？', options: [{ label: '网友比现实朋友还多，天天聊', value: 1 }, { label: '有几个聊得来的，偶尔联系', value: 2 }, { label: '网友？不存在的', value: 3 }] },
  { id: 'cq8', dim: 'D2', text: '有人在评论区@你，你的反应是？', options: [{ label: '秒回！在线社交我最积极', value: 1 }, { label: '看心情，有空就回', value: 2 }, { label: '假装没看到', value: 3 }] },

  // D3: 信息模式 (D=Deep vs S=Skim)
  { id: 'cq9', dim: 'D3', text: '遇到感兴趣的话题，你的阅读方式是？', options: [{ label: '从头看到尾，还要翻评论区和引用源', value: 1 }, { label: '看个大概，抓住重点就行', value: 2 }, { label: '标题看完基本就够了', value: 3 }] },
  { id: 'cq10', dim: 'D3', text: '你的短视频观看习惯是？', options: [{ label: '很少刷短视频，更喜欢长内容', value: 1 }, { label: '都看，长短不限', value: 2 }, { label: '三十秒以上的都嫌长', value: 3 }] },
  { id: 'cq11', dim: 'D3', text: '你的收藏夹/稍后再看列表？', options: [{ label: '定期整理，收藏的都会看完', value: 1 }, { label: '收藏了一堆但看了不到一半', value: 2 }, { label: '收藏等于看过，点完就忘', value: 3 }] },
  { id: 'cq12', dim: 'D3', text: '朋友给你分享了一篇五千字的深度长文，你会？', options: [{ label: '认真读完还写读后感', value: 1 }, { label: '扫一遍，记住结论', value: 2 }, { label: '太长不看，直接问朋友结论是啥', value: 3 }] },

  // D4: 网络依赖 (A=Addict vs O=Offline)
  { id: 'cq13', dim: 'D4', text: '手机电量到10%而且没有充电器，你的心理状态？', options: [{ label: '焦虑到手心出汗，满世界找充电宝', value: 1 }, { label: '有点慌但还能忍', value: 2 }, { label: '关机就关机呗，又不是活不了', value: 3 }] },
  { id: 'cq14', dim: 'D4', text: '你每天的屏幕使用时间大概是？', options: [{ label: '8小时以上，手机就是我的器官', value: 1 }, { label: '4-7小时，正常水平吧', value: 2 }, { label: '4小时以下，有更重要的事做', value: 3 }] },
  { id: 'cq15', dim: 'D4', text: '让你完全断网一周，你能接受吗？', options: [{ label: '想都不敢想，会死', value: 1 }, { label: '痛苦但能活', value: 2 }, { label: '求之不得，终于清静了', value: 3 }] },
  { id: 'cq16', dim: 'D4', text: '睡前最后一个动作和醒来第一个动作？', options: [{ label: '都是看手机，手机是我的安眠药和闹钟', value: 1 }, { label: '睡前会刷一会儿但尽量控制', value: 2 }, { label: '手机放客厅充电，卧室不带电子设备', value: 3 }] },
];

export const specialQuestions: Question[] = [
  {
    id: 'bot_gate',
    text: '凌晨三点你还在刷手机，突然意识到明天要早起，你会？',
    options: [
      { label: '放下手机乖乖睡觉', value: 1 },
      { label: '再刷十分钟就睡……然后又过了一小时', value: 2 },
      { label: '早起是不可能早起的，继续刷到天亮', value: 3 },
    ],
    special: true,
  },
];

export const BOT_TRIGGER_QUESTION_ID = 'bot_gate';
