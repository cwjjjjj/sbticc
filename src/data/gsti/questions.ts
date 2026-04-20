// src/data/gsti/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 关系角色：Giver(A) vs Taker(B) =====
  {
    id: 'gt1', dim: 'D1', text: '和心动对象第一次约会，你倾向：',
    options: [
      { label: '我主动约，地点我选，账我买', value: 1 },
      { label: '我主动，但各付各的', value: 2 },
      { label: 'TA 约我，让 TA 决定去哪', value: 3 },
      { label: '等 TA 提一切，我负责出现', value: 4 },
    ],
  },
  {
    id: 'gt2', dim: 'D1', text: '记住对象生日、偏好、过敏信息这些事：',
    options: [
      { label: '我全记，细节到 TA 咖啡加几勺糖', value: 1 },
      { label: '重要的我记，细节靠 TA 提醒', value: 2 },
      { label: '记大概，细节靠猜', value: 3 },
      { label: 'TA 记我就行，我记了也会忘', value: 4 },
    ],
  },
  {
    id: 'gt3', dim: 'D1', text: '对象发烧了，你的第一反应：',
    options: [
      { label: '立刻买药送饭熬粥，通宵照顾', value: 1 },
      { label: '让 TA 好好休息，我来处理一切', value: 2 },
      { label: '发消息关心一下，TA 需要了再说', value: 3 },
      { label: '等 TA 主动叫我，不然我怕打扰', value: 4 },
    ],
  },

  // ===== D2 情感温度：Hot(A) vs Cold(B) =====
  {
    id: 'hc1', dim: 'D2', text: '喜欢一个人到"心痒"的程度，你会：',
    options: [
      { label: '当场表白，"我好喜欢你"', value: 1 },
      { label: '暗示到对方感受得到', value: 2 },
      { label: '憋住，等对方先说', value: 3 },
      { label: '不说，保持距离就好', value: 4 },
    ],
  },
  {
    id: 'hc2', dim: 'D2', text: '对象说"我爱你"，你最可能的反应：',
    options: [
      { label: '"我也爱你，爱得发疯"', value: 1 },
      { label: '"我也是"（微笑对视）', value: 2 },
      { label: '"嗯"（轻轻应一声）', value: 3 },
      { label: '尴尬地笑一下，转移话题', value: 4 },
    ],
  },
  {
    id: 'hc3', dim: 'D2', text: '吵架情绪上头，你最容易：',
    options: [
      { label: '当场大哭 / 大吼，发泄一切', value: 1 },
      { label: '强忍，但表情挂脸', value: 2 },
      { label: '冷淡下来，不想说话', value: 3 },
      { label: '彻底沉默，一句都不愿再说', value: 4 },
    ],
  },
  {
    id: 'hc4', dim: 'D2', text: '对象发给你一条很长的小作文：',
    options: [
      { label: '我立刻写一条更长的回过去', value: 1 },
      { label: '认真看完，回几句重点', value: 2 },
      { label: '回个"嗯""好"', value: 3 },
      { label: '看完不回，假装没看见', value: 4 },
    ],
  },

  // ===== D3 权力位置：Top(A) vs Bottom(B) =====
  {
    id: 'tb1', dim: 'D3', text: '和对象一起去吃饭，去哪里吃：',
    options: [
      { label: '我定，TA 听我的就好', value: 1 },
      { label: '我提 2-3 个选项 TA 挑', value: 2 },
      { label: '让 TA 定，我都可以', value: 3 },
      { label: '完全随 TA，我没什么意见', value: 4 },
    ],
  },
  {
    id: 'tb2', dim: 'D3', text: '关系走向（确定关系、同居、结婚）由谁推动：',
    options: [
      { label: '基本我推动，不然 TA 不动', value: 1 },
      { label: '大部分我主动开口', value: 2 },
      { label: '双方差不多，谁提都行', value: 3 },
      { label: '几乎全是 TA 在推，我跟着走', value: 4 },
    ],
  },
  {
    id: 'tb3', dim: 'D3', text: '吵架僵持时，谁先低头：',
    options: [
      { label: '绝对不是我，我宁可冷战', value: 1 },
      { label: '通常我会找台阶，但不直接道歉', value: 2 },
      { label: '各一半，看情况', value: 3 },
      { label: '我先低头，让 TA 舒服', value: 4 },
    ],
  },
  {
    id: 'tb4', dim: 'D3', text: '对象的大事（换工作、搬家、重要决定）你是否会干预：',
    options: [
      { label: '会，而且我的意见基本就是最终方案', value: 1 },
      { label: '会强烈表态，但最终 TA 决定', value: 2 },
      { label: '建议几句就不管了', value: 3 },
      { label: '完全 TA 自己定，我不插嘴', value: 4 },
    ],
  },

  // ===== D4 利益计算：Calc(A) vs Sincere(B) =====
  {
    id: 'ks1', dim: 'D4', text: '确定和一个人发展前，你会优先了解：',
    options: [
      { label: '家庭背景、收入、房产、资产状况', value: 1 },
      { label: '稳定性、工作、三观', value: 2 },
      { label: '有没有共同话题和感觉', value: 3 },
      { label: '只看心动，其他都是附加题', value: 4 },
    ],
  },
  {
    id: 'ks2', dim: 'D4', text: '对方家境一般、暂时穷，但你很喜欢 TA：',
    options: [
      { label: '对不起，我接受不了，不是爱不爱的问题', value: 1 },
      { label: '观察一阵，看 TA 能不能上进', value: 2 },
      { label: '爱了，经济问题一起扛', value: 3 },
      { label: '完全不在意，甚至会养 TA', value: 4 },
    ],
  },
  {
    id: 'ks3', dim: 'D4', text: '送对象礼物，你考虑最多的是：',
    options: [
      { label: '性价比——花多少值多少', value: 1 },
      { label: '品牌和场面——别让 TA 没面子', value: 2 },
      { label: 'TA 真的需要什么、会喜欢什么', value: 3 },
      { label: '我自己那一刻的心情，多少都行', value: 4 },
    ],
  },
  {
    id: 'ks4', dim: 'D4', text: '结婚前是否会要求看征信、存款、房产证：',
    options: [
      { label: '必须，这是对自己负责', value: 1 },
      { label: '会旁敲侧击，但不正式查', value: 2 },
      { label: '不会，相信 TA', value: 3 },
      { label: '想都没想过，这也能查？', value: 4 },
    ],
  },

  // ===== D5 展示方式：Perform(A) vs Real(B) =====
  {
    id: 'pr1', dim: 'D5', text: '纪念日，你会：',
    options: [
      { label: '精心策划布置+拍照+发朋友圈+艾特 TA', value: 1 },
      { label: '认真准备但不发朋友圈', value: 2 },
      { label: '简单过一下，吃顿饭就行', value: 3 },
      { label: '忘了都有可能，TA 提我才想起', value: 4 },
    ],
  },
  {
    id: 'pr2', dim: 'D5', text: '对象做了件让你不爽的事，你会：',
    options: [
      { label: '发一条意有所指的朋友圈，让 TA 看到', value: 1 },
      { label: '朋友圈不发，微信直接说', value: 2 },
      { label: '私下聊开，不让任何人知道', value: 3 },
      { label: '自己消化，很少告诉 TA', value: 4 },
    ],
  },
  {
    id: 'pr3', dim: 'D5', text: '发合照到朋友圈，你最在意：',
    options: [
      { label: '角度、滤镜、文案、艾特 TA 都要完美', value: 1 },
      { label: '我自己要好看，其他随意', value: 2 },
      { label: '记录一下就行，不精修', value: 3 },
      { label: '我不发朋友圈合照', value: 4 },
    ],
  },
  {
    id: 'pr4', dim: 'D5', text: 'TA 在你朋友面前形象"翻车"（糗事、口误），你：',
    options: [
      { label: '赶紧圆场，绝不能让 TA 被看扁', value: 1 },
      { label: '跟着笑两下转移话题', value: 2 },
      { label: '随 TA，糗就糗了不是啥大事', value: 3 },
      { label: '反而觉得可爱，直接吐槽 TA', value: 4 },
    ],
  },

  // ===== D6 关系忠诚：Loyal(A) vs Loose(B) =====
  {
    id: 'lo1', dim: 'D6', text: '谈恋爱期间，还和暧昧对象保持联系：',
    options: [
      { label: '绝对不行，一个都不留', value: 1 },
      { label: '老朋友可以，有暧昧痕迹的全删', value: 2 },
      { label: '保留联系但不越界', value: 3 },
      { label: '看心情，反正没越实质的线', value: 4 },
    ],
  },
  {
    id: 'lo2', dim: 'D6', text: '对方查你手机：',
    options: [
      { label: '随便查，我没有秘密', value: 1 },
      { label: '给 TA 看但我会先偷偷整理一下', value: 2 },
      { label: '不给看，隐私不能越界', value: 3 },
      { label: '想都别想，查就分手', value: 4 },
    ],
  },
  {
    id: 'lo3', dim: 'D6', text: '关系稳定一段时间后，你是否还会享受别人的追求：',
    options: [
      { label: '完全不，我眼里只有 TA', value: 1 },
      { label: '被追有点爽，但我会划清', value: 2 },
      { label: '享受那种被欣赏的感觉', value: 3 },
      { label: '我还是会保留几条暧昧备选', value: 4 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // 隐藏触发：选"不透露"性别 + 此题选最中立，才触发 UNDEF
  {
    id: 'gsti_gate', special: true, kind: 'gate',
    text: '最后一个测试 bug 用的小问题：把自己放进下面的盒子里，你属于哪种？',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
      { label: '非典型，没法贴标签', value: 3 },
      { label: '不告诉你', value: 4 },
    ],
  },
];
