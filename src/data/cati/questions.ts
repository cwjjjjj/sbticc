import type { Question } from '../testConfig';

/**
 * CaTI 12 题 — 围绕猫的典型行为。
 * 与 DogTI 同样的选项级 dim / score 约定：
 *   - E/S/T/J → score +1
 *   - I/N/F/P → score -1
 */

function opt(
  value: number,
  label: string,
  letter: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P',
) {
  const dimMap: Record<string, string> = { E: 'EI', I: 'EI', S: 'SN', N: 'SN', T: 'TF', F: 'TF', J: 'JP', P: 'JP' };
  const positive = ['E', 'S', 'T', 'J'].includes(letter);
  return { label, value, dim: dimMap[letter], score: positive ? 1 : -1 };
}

export const questions: Question[] = [
  {
    id: 'cati_q1',
    kind: 'single',
    text: '家里来了客人，你会？',
    options: [
      opt(1, '凑过去看，朝人家脚边一坐蹭两下', 'E'),
      opt(2, '钻到沙发底下，确认没问题再探头', 'I'),
      opt(3, '直接消失，今晚都不出来了', 'I'),
    ],
  },
  {
    id: 'cati_q2',
    kind: 'single',
    text: '阳台飘进来一根羽毛，你的反应是',
    options: [
      opt(1, '先用爪子戳戳看它会不会动', 'S'),
      opt(2, '盯着看了半天，在脑子里推演它要飞哪', 'N'),
      opt(3, '凑过去闻一下就走了，没啥意思', 'S'),
    ],
  },
  {
    id: 'cati_q3',
    kind: 'single',
    text: '你的饭盆空了，旁边的猫还在吃，你？',
    options: [
      opt(1, '直接挤过去，先到先得这个规则不适用', 'T'),
      opt(2, '在旁边坐下，用眼神示意对方让一点', 'F'),
      opt(3, '走到对方背后，等它自己意识到', 'S'),
    ],
  },
  {
    id: 'cati_q4',
    kind: 'single',
    text: '凌晨 4 点，你突然醒了，你会做什么？',
    options: [
      opt(1, '跳上跳下，把能弄响的东西都弄响一遍', 'P'),
      opt(2, '凑到铲屎官脸边，轻轻拍一下看 TA 醒不醒', 'F'),
      opt(3, '在脑子里规划今天要去哪个窗台晒太阳', 'N'),
    ],
  },
  {
    id: 'cati_q5',
    kind: 'single',
    text: '有人想摸你的肚子，你的第一反应是',
    options: [
      opt(1, '翻过去任摸，顺便蹭两下', 'E'),
      opt(2, '让摸了一下，然后突然翻身咬一口', 'S'),
      opt(3, '站起来走掉，私人领地不对外', 'I'),
    ],
  },
  {
    id: 'cati_q6',
    kind: 'single',
    text: '一个新的纸箱出现在客厅，你？',
    options: [
      opt(1, '立刻跳进去，管它装过什么', 'P'),
      opt(2, '先绕三圈，闻一遍再决定进不进', 'J'),
      opt(3, '在脑子里想：这个箱子如果倒了会是什么角度', 'N'),
    ],
  },
  {
    id: 'cati_q7',
    kind: 'single',
    text: '铲屎官今天特别忙，没怎么理你，你会？',
    options: [
      opt(1, '蹲在 TA 脚边不走，等 TA 注意到', 'F'),
      opt(2, '自己去睡觉，没事别打扰我', 'I'),
      opt(3, '在 TA 桌上走两圈再下来，做过就行', 'T'),
    ],
  },
  {
    id: 'cati_q8',
    kind: 'single',
    text: '一个人在家的下午，你在？',
    options: [
      opt(1, '一个窗台一个窗台巡视，看有没有新情况', 'E'),
      opt(2, '趴在最暖的角落睡觉', 'I'),
      opt(3, '盯着墙角发呆，脑子里在想一些很远的事', 'N'),
    ],
  },
  {
    id: 'cati_q9',
    kind: 'single',
    text: '同屋的猫突然想玩扑咬游戏，你？',
    options: [
      opt(1, '现在就上，谁怕谁', 'P'),
      opt(2, '先评估一下是不是真的想玩，还是想挑事', 'J'),
      opt(3, '陪两下，不太想但不能扫兴', 'S'),
    ],
  },
  {
    id: 'cati_q10',
    kind: 'single',
    text: '你刚抓到了一只虫子，铲屎官在叫你，你？',
    options: [
      opt(1, '叼过去炫耀，看，我厉害吧', 'E'),
      opt(2, '自己悄悄吃掉，不分享这件事', 'I'),
      opt(3, '扔在一边，已经不感兴趣了', 'T'),
    ],
  },
  {
    id: 'cati_q11',
    kind: 'single',
    text: '今天饭换成新牌子了，你的反应是',
    options: [
      opt(1, '闻一口就走，意思是「你这是什么东西」', 'P'),
      opt(2, '一口口认真尝，决定留不留', 'J'),
      opt(3, '一直看着饭盆出神，在思考铲屎官是不是不爱我了', 'N'),
    ],
  },
  {
    id: 'cati_q12',
    kind: 'single',
    text: '最后一题：如果可以选，你最想过哪种猫生？',
    options: [
      opt(1, '每天都有人陪我说话，永远不缺一个能蹭的腿', 'E'),
      opt(2, '有一扇永远开着的窗，一个人呆着也完全够了', 'I'),
      opt(3, '没有开关门的人类，想去哪就跳去哪', 'P'),
    ],
  },
];

export const specialQuestions: Question[] = [];
