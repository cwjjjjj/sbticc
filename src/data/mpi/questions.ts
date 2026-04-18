// src/data/mpi/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 HOARD 囤货欲（L=极简，H=囤货本能） 4 题 =====
  {
    id: 'hoard1', dim: 'D1',
    text: '打开购物车，你的常态是？',
    options: [
      { label: '塞了 30 多件，打算某天清空但永远没那天', value: 4 },
      { label: '5 件左右，最近想买的才会放', value: 3 },
      { label: '基本是空的，要买就直接付款', value: 2 },
      { label: '我没有购物车，买完就走', value: 1 },
    ],
  },
  {
    id: 'hoard2', dim: 'D1',
    text: '家里的纸巾/洗衣液/日用品常备量是？',
    options: [
      { label: '够用三年的那种，仓储级', value: 4 },
      { label: '多备几件，免得临时没', value: 3 },
      { label: '一包备用就够，用完再买', value: 2 },
      { label: '用完才买，"备着"对我是多余', value: 1 },
    ],
  },
  {
    id: 'hoard3', dim: 'D1',
    text: '看到"买二送一/第二件半价"，你的反应？',
    options: [
      { label: '立刻凑单，不买就亏', value: 4 },
      { label: '本来要买一件，就顺手凑个单', value: 3 },
      { label: '看是不是真的需要两件，再决定', value: 2 },
      { label: '这种套路我从不接招', value: 1 },
    ],
  },
  {
    id: 'hoard4', dim: 'D1',
    text: '刚搬家，家里空荡荡，你的反应？',
    options: [
      { label: '按博主清单一口气配齐氛围感', value: 4 },
      { label: '每周添一两样，慢慢有家的味道', value: 3 },
      { label: '先去二手平台淘，能省一半', value: 2 },
      { label: '一张床一张桌子，够用就行', value: 1 },
    ],
  },

  // ===== D2 FLAUNT 炫耀欲（L=消费黑户，H=晒货磁场） 3 题 =====
  {
    id: 'flaunt1', dim: 'D2',
    text: '刚入手一件心仪很久的大件（包/鞋/装备），你的反应？',
    options: [
      { label: '立刻发朋友圈，不发等于白买', value: 4 },
      { label: '拍照留念，偶尔分享给懂的人', value: 3 },
      { label: '发给对象或闺蜜看一眼就行', value: 2 },
      { label: '低调藏起来，怕被借怕被议论', value: 1 },
    ],
  },
  {
    id: 'flaunt2', dim: 'D2',
    text: '朋友问你"这件多少钱"，你会？',
    options: [
      { label: '大方说出真实价格，甚至会加个"还挺值"', value: 4 },
      { label: '说个大致范围，留一点模糊', value: 3 },
      { label: '往低里说，怕显得张扬', value: 2 },
      { label: '含糊过去，"不贵/随便买的"', value: 1 },
    ],
  },
  {
    id: 'flaunt3', dim: 'D2',
    text: '一顿不错的饭，你会？',
    options: [
      { label: '拍图修图发三条平台，定位精确到门店', value: 4 },
      { label: '拍一张发朋友圈', value: 3 },
      { label: '吃就是吃，拍照留给朋友', value: 2 },
      { label: '从不拍吃的，吃完就走', value: 1 },
    ],
  },

  // ===== D3 FRUGAL 省钱欲（L=贵感依赖，H=比价机器） 4 题 =====
  {
    id: 'frugal1', dim: 'D3',
    text: '同一件东西，三个平台价格有差，你会？',
    options: [
      { label: '三家交叉比到凌晨，必须买到最低', value: 4 },
      { label: '比两家，差不了太多就下单', value: 3 },
      { label: '顺手选一家就付了', value: 2 },
      { label: '懒得比，贵就贵一点我信品牌', value: 1 },
    ],
  },
  {
    id: 'frugal2', dim: 'D3',
    text: '一件 100 块的东西打折变成 60 块，你的反应？',
    options: [
      { label: '立刻下单，不买就错过一个亿', value: 4 },
      { label: '看看本来要不要，要的话就买', value: 3 },
      { label: '犹豫一下，便宜有便宜的理由吧', value: 2 },
      { label: '反而不敢买了，怕是库存尾货/有问题', value: 1 },
    ],
  },
  {
    id: 'frugal3', dim: 'D3',
    text: '超市里同一款商品，临期打 5 折，你会？',
    options: [
      { label: '立刻拿两份，省一半爽翻', value: 4 },
      { label: '拿一份，吃完再说', value: 3 },
      { label: '偶尔会，看心情', value: 2 },
      { label: '不会，临期的总觉得不新鲜', value: 1 },
    ],
  },
  {
    id: 'frugal4', dim: 'D3',
    text: '凑满减你的常规操作？',
    options: [
      { label: '精算到小数点，凑到一分不差', value: 4 },
      { label: '简单凑一下，不强求最优', value: 3 },
      { label: '能凑就凑，凑不上就算', value: 2 },
      { label: '不玩这种套路，直接付', value: 1 },
    ],
  },

  // ===== D4 SUSCEPT 易种草度（L=抗种草，H=种草即下单） 4 题 =====
  {
    id: 'suscept1', dim: 'D4',
    text: '刷到一条"真的巨好用"的种草笔记，你的反应？',
    options: [
      { label: '已经在付款页面了', value: 4 },
      { label: '先加购物车观察两天', value: 3 },
      { label: '存个图，有空再说', value: 2 },
      { label: '越说好我越怀疑，滑走', value: 1 },
    ],
  },
  {
    id: 'suscept2', dim: 'D4',
    text: '博主真诚推荐的"平价替代"，你会？',
    options: [
      { label: '立刻买来试，博主不会骗我', value: 4 },
      { label: '搜一下评价再决定', value: 3 },
      { label: '看看就好，自用的我有信任款', value: 2 },
      { label: '这类广告我一眼就能识破', value: 1 },
    ],
  },
  {
    id: 'suscept3', dim: 'D4',
    text: '双 11 凌晨你通常在做什么？',
    options: [
      { label: '盯表跨零点，购物车已预演三遍', value: 4 },
      { label: '刷直播间抢满减', value: 3 },
      { label: '简单加两件想了很久的必需品', value: 2 },
      { label: '睡觉，双 11 已经连续骗我七年了', value: 1 },
    ],
  },
  {
    id: 'suscept4', dim: 'D4',
    text: '一条只有 30 秒的短视频，种了一件小玩意儿的草，你会？',
    options: [
      { label: '立刻下单，"不贵就试一下"', value: 4 },
      { label: '想想有点冲动，先冷静一天', value: 3 },
      { label: '截个图留着，大多数后来就忘了', value: 2 },
      { label: '这种东西买回来就是积灰', value: 1 },
    ],
  },

  // ===== D5 SECONDHAND 二手偏好（L=新品洁癖，H=二手信仰） 3 题 =====
  {
    id: 'secondhand1', dim: 'D5',
    text: '想买一件原价 3000 的大件，二手平台有 1500 的九五新，你会？',
    options: [
      { label: '立刻下单，原价就是交智商税', value: 4 },
      { label: '研究一下成色，没问题就买', value: 3 },
      { label: '有点犹豫，二手到底靠不靠谱', value: 2 },
      { label: '不考虑，别人用过的我不想要', value: 1 },
    ],
  },
  {
    id: 'secondhand2', dim: 'D5',
    text: '你对二手奢侈品的态度？',
    options: [
      { label: '常驻客户，鉴定师级别', value: 4 },
      { label: '偶尔淘，鉴定完再下单', value: 3 },
      { label: '不太了解，有点好奇但不敢买', value: 2 },
      { label: '坚决原价新品，二手即膈应', value: 1 },
    ],
  },
  {
    id: 'secondhand3', dim: 'D5',
    text: '你自己不用的东西，处理方式是？',
    options: [
      { label: '挂闲鱼回血，我是倒爷', value: 4 },
      { label: '送人/捐掉，不愿意收二手钱', value: 2 },
      { label: '扔了省心', value: 1 },
      { label: '囤着以防万一再用', value: 3 },
    ],
  },

  // ===== D6 LIVESTREAM 直播沉迷度（L=绝缘体，H=人质） 3 主题 + gate 共 4 题 =====
  {
    id: 'live1', dim: 'D6',
    text: '你刷到"最后三分钟上链接"的直播时，本能反应是？',
    options: [
      { label: '手已经在屏幕上了，反正可以退', value: 4 },
      { label: '看一眼价格，比外面便宜才下', value: 3 },
      { label: '听他 PUA 完我反而冷静', value: 2 },
      { label: '直接划走，我不吃这套', value: 1 },
    ],
  },
  {
    id: 'live2', dim: 'D6',
    text: '"家人们""宝贝们"这套话术对你？',
    options: [
      { label: '听着很亲切，真的会下单', value: 4 },
      { label: '听多了有点麻，偶尔还是会买', value: 3 },
      { label: '觉得油腻但不影响判断', value: 2 },
      { label: '听到就想退出，生理反感', value: 1 },
    ],
  },
  {
    id: 'live3', dim: 'D6',
    text: '直播间的购物节奏让你？',
    options: [
      { label: '肾上腺素飙升，错过就是亏', value: 4 },
      { label: '会紧张一下，但会先冷静两秒', value: 3 },
      { label: '没感觉，该买就买', value: 2 },
      { label: '反感这种焦虑贩卖', value: 1 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // Gate 题同时兼 LIVESTREAM 维度计分（spec §6 注明 LIVESTREAM 3 题 + gate 1 题）
  // 选 D (value=1) + FRUGAL 为 L → 触发 ZERO$
  {
    id: 'mpi_gate', special: true, kind: 'gate', dim: 'D6',
    text: '上一次认真买点什么给自己是什么时候？',
    options: [
      { label: '就是刚才/今天', value: 4 },
      { label: '这周/这个月', value: 3 },
      { label: '三个月前，想不起来具体什么', value: 2 },
      { label: '我真的想不起来了', value: 1 },
    ],
  },
];
