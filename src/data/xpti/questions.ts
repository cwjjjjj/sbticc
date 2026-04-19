// src/data/xpti/questions.ts
import type { Question } from '../testConfig';

/**
 * XPTI 共 24 题 —— 8 维 × 3 题。
 * 题材配比：约 40% 恋爱/亲密关系，30% 自我人设/审美，30% 情绪/能量。
 * 每题 4 选项，value 1-4 对应该维度的强度（1 低、4 高）。
 * 品牌声音：毒舌 / 平视 / 反讽性别气质刻板标签。
 */
export const questions: Question[] = [
  // ========== D 支配（3 题：1 亲密关系 + 1 自我 + 1 日常能量） ==========
  {
    id: 'xpti_d_1', dim: 'D', text: '新关系第一个月，吃饭、行程、见家长谁先开口：',
    options: [
      { label: '我从不主动，TA 不提我就不动', value: 1 },
      { label: '半推半就，TA 提了我再跟上', value: 2 },
      { label: '大部分我先开口，但留余地让 TA 决定', value: 3 },
      { label: '全程我拍板，不拍板关系推不动', value: 4 },
    ],
  },
  {
    id: 'xpti_d_2', dim: 'D', text: '公司团建选地方，你的参与方式是：',
    options: [
      { label: '随大流，谁选我都行', value: 1 },
      { label: '觉得不合适会私下吐槽，但不会站出来', value: 2 },
      { label: '直接在群里提两个替代方案', value: 3 },
      { label: '我不开口没人敢开口，我定了就是定了', value: 4 },
    ],
  },
  {
    id: 'xpti_d_3', dim: 'D', text: '被别人"安排"——比如被临时拉去凑局——你的第一反应：',
    options: [
      { label: '去就去，反正也没别的事', value: 1 },
      { label: '嘴上答应，心里不爽', value: 2 },
      { label: '反问"为什么是我"然后再决定', value: 3 },
      { label: '直接拒绝并且反向安排 TA', value: 4 },
    ],
  },

  // ========== V 视觉（3 题：自我审美为主） ==========
  {
    id: 'xpti_v_1', dim: 'V', text: '临时下楼取外卖 10 分钟，你会：',
    options: [
      { label: '随便套个睡衣拖鞋直接冲', value: 1 },
      { label: '套件外套，起码领口像样', value: 2 },
      { label: '顺手扎头发、换身便装', value: 3 },
      { label: '至少涂口红/喷香水才敢见人', value: 4 },
    ],
  },
  {
    id: 'xpti_v_2', dim: 'V', text: '和暧昧对象约饭前，你花多少时间打扮：',
    options: [
      { label: '零准备，本来怎样就怎样', value: 1 },
      { label: '洗个头、穿件干净衣服就够了', value: 2 },
      { label: '提前一小时对镜子搭 2 套', value: 3 },
      { label: '提前一周开始准备造型', value: 4 },
    ],
  },
  {
    id: 'xpti_v_3', dim: 'V', text: '朋友圈/小红书发图，你对图片的要求是：',
    options: [
      { label: '原图直出，糊就糊了', value: 1 },
      { label: '稍微调个色不太丑就行', value: 2 },
      { label: '滤镜、裁切、文案要过三审', value: 3 },
      { label: '色系统一、九宫格排版、不满意就删', value: 4 },
    ],
  },

  // ========== P 纯爱（3 题：恋爱观） ==========
  {
    id: 'xpti_p_1', dim: 'P', text: '看到"为爱奔赴"这种剧情，你的真实想法是：',
    options: [
      { label: '编剧真闲，现实谁会这么蠢', value: 1 },
      { label: '好看归好看，我自己不会这样', value: 2 },
      { label: '羡慕，希望有一天自己也能这样', value: 3 },
      { label: '我本人就是这种剧情的主角', value: 4 },
    ],
  },
  {
    id: 'xpti_p_2', dim: 'P', text: '选伴侣最看重：',
    options: [
      { label: '收入、稳定、履历，能过日子就行', value: 1 },
      { label: '三观契合、能聊到一起', value: 2 },
      { label: '心动感——没电就没必要', value: 3 },
      { label: '灵魂对上，哪怕其他什么都没有', value: 4 },
    ],
  },
  {
    id: 'xpti_p_3', dim: 'P', text: '纪念日这件事：',
    options: [
      { label: '纪念什么？一起过日子就行', value: 1 },
      { label: '记得的话会过一下，忘了也不介意', value: 2 },
      { label: '重要日子一定要有仪式感', value: 3 },
      { label: '从第一次约会起每个月都要纪念', value: 4 },
    ],
  },

  // ========== F 幻想（3 题：自我内心世界 + 情绪） ==========
  {
    id: 'xpti_f_1', dim: 'F', text: '看到陌生人你会：',
    options: [
      { label: '没任何想法，过路人而已', value: 1 },
      { label: '偶尔好奇一下 TA 的穿搭', value: 2 },
      { label: '脑补 TA 的职业、家庭、此刻心情', value: 3 },
      { label: '我脑内已经给 TA 写了三集剧', value: 4 },
    ],
  },
  {
    id: 'xpti_f_2', dim: 'F', text: '和心动对象还没开始，你脑内的故事进展到：',
    options: [
      { label: '我不脑补，事情发生再说', value: 1 },
      { label: '大概想过几次聊天场景', value: 2 },
      { label: '我们已经在我脑里谈了半年了', value: 3 },
      { label: '我们都结婚生二胎了（在我脑里）', value: 4 },
    ],
  },
  {
    id: 'xpti_f_3', dim: 'F', text: '你独处的时候多数在：',
    options: [
      { label: '处理事情、刷信息、不让自己闲着', value: 1 },
      { label: '刷剧、玩手机、打发时间', value: 2 },
      { label: '脑内跑剧情、开小会、自导自演', value: 3 },
      { label: '整个人住进幻想世界，很难出来', value: 4 },
    ],
  },

  // ========== S 顺从（3 题：亲密关系 + 社会角色） ==========
  {
    id: 'xpti_s_1', dim: 'S', text: '对象说"今晚这样吧"，但你其实不太想：',
    options: [
      { label: '直接说不，理由也不给', value: 1 },
      { label: '找借口婉拒', value: 2 },
      { label: '算了就这样吧，不值得吵', value: 3 },
      { label: '完全听 TA 的，我自己都没想法', value: 4 },
    ],
  },
  {
    id: 'xpti_s_2', dim: 'S', text: '被对象/朋友"推"着改变某个习惯（作息、穿搭、吃饭）：',
    options: [
      { label: '绝对不改，我的边界', value: 1 },
      { label: '嘴上答应背地里我行我素', value: 2 },
      { label: '试试看，真有道理就改', value: 3 },
      { label: '乖乖照做，TA 比我更懂', value: 4 },
    ],
  },
  {
    id: 'xpti_s_3', dim: 'S', text: '权威（老板、长辈、大佬）的意见：',
    options: [
      { label: '听是听，照做看心情', value: 1 },
      { label: '参考但保留自己判断', value: 2 },
      { label: '大部分会照做，少数反抗', value: 3 },
      { label: '权威说的就是对的，照办', value: 4 },
    ],
  },

  // ========== E 情感（3 题：情绪) ==========
  {
    id: 'xpti_e_1', dim: 'E', text: '看到朋友发一条很难过的动态，你的第一反应：',
    options: [
      { label: '滑过去了，每个人情绪自己处理', value: 1 },
      { label: '点个赞表示看到了', value: 2 },
      { label: '私信问候一下', value: 3 },
      { label: '立刻打电话，恨不得飞去 TA 身边', value: 4 },
    ],
  },
  {
    id: 'xpti_e_2', dim: 'E', text: '和对象/朋友吵架，你更常见的反应：',
    options: [
      { label: '冷静分析问题，不上头', value: 1 },
      { label: '心里不爽但嘴上不多说', value: 2 },
      { label: '当场挂脸/哭出来', value: 3 },
      { label: '情绪炸开一发不可收拾', value: 4 },
    ],
  },
  {
    id: 'xpti_e_3', dim: 'E', text: '一部电影让你哭的概率：',
    options: [
      { label: '几乎不哭，我对这些免疫', value: 1 },
      { label: '偶尔会湿眼眶', value: 2 },
      { label: '经常哭，甚至预告片就开始哭', value: 3 },
      { label: '我是电影院里最吵的那个', value: 4 },
    ],
  },

  // ========== N 混沌（3 题：能量 + 生活方式） ==========
  {
    id: 'xpti_n_1', dim: 'N', text: '周末的理想状态：',
    options: [
      { label: '早就排好两天的详细日程', value: 1 },
      { label: '大概有个计划，但会微调', value: 2 },
      { label: '不做计划，看当天心情', value: 3 },
      { label: '能多乱有多乱，越没秩序我越爽', value: 4 },
    ],
  },
  {
    id: 'xpti_n_2', dim: 'N', text: '你的 to-do list 通常是：',
    options: [
      { label: '每一条都打对勾才舒心', value: 1 },
      { label: '写一写但不一定每条做完', value: 2 },
      { label: '从来不写，脑子里有就行', value: 3 },
      { label: 'to-do list 是什么，能吃吗', value: 4 },
    ],
  },
  {
    id: 'xpti_n_3', dim: 'N', text: '对象/朋友临时 cancel 约好的事：',
    options: [
      { label: '我接受不了，必须给解释', value: 1 },
      { label: '有点失望但理解', value: 2 },
      { label: '正好我也不想出门，省了', value: 3 },
      { label: '我其实更喜欢被 cancel，计划本来就是拿来破的', value: 4 },
    ],
  },

  // ========== R 现实（3 题：恋爱物质观 + 人生观） ==========
  {
    id: 'xpti_r_1', dim: 'R', text: '对象收入跟你差 2 倍，方向是 TA 低：',
    options: [
      { label: '完全不影响，我看人不看卡', value: 1 },
      { label: '略有顾虑，但喜欢能过', value: 2 },
      { label: '会介意，得看 TA 有没有潜力', value: 3 },
      { label: '不行，差距大我过不下去', value: 4 },
    ],
  },
  {
    id: 'xpti_r_2', dim: 'R', text: '你对"为爱裸辞去外地"这种操作：',
    options: [
      { label: '这是我要干的事', value: 1 },
      { label: '真的爱可以考虑一下', value: 2 },
      { label: '不太能接受，先把 offer 谈好', value: 3 },
      { label: '我打死也不干，太蠢了', value: 4 },
    ],
  },
  {
    id: 'xpti_r_3', dim: 'R', text: '"我们先别谈钱，先谈感情" —— 你怎么看这句话：',
    options: [
      { label: '对，感情最重要，钱是俗物', value: 1 },
      { label: '部分同意，但也得谈', value: 2 },
      { label: '先把钱聊清楚，感情才走得远', value: 3 },
      { label: '听到这句话我直接拉黑', value: 4 },
    ],
  },
];

/**
 * 隐藏触发题：某一选项（value=4）会触发隐藏类型 XFREAK。
 * 跨性别可触发，不限于男/女池。
 */
export const specialQuestions: Question[] = [
  {
    id: 'xpti_trigger_q1', special: true, kind: 'gate',
    text: '所有题答完了，最后一个 bug 用的小问题：以上所有选项里，你最不想承认的真相是哪种？',
    options: [
      { label: '我其实就是个典型人格，不需要测', value: 1 },
      { label: '某几道题我是乱选的', value: 2 },
      { label: '我选的全是想让 TA 看到的版本，不是真我', value: 3 },
      { label: '以上都不是 · 你们这些工具都不配扫描我', value: 4 },
    ],
  },
];
