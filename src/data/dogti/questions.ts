import type { Question } from '../testConfig';

/**
 * DogTI 12 题 — 每个选项独立决定一个 MBTI 维度字母。
 * 约定：
 *   - E / S / T / J 方向 → score +1
 *   - I / N / F / P 方向 → score -1
 *   - option.value 取 1/2/3（仅用于 UI 唯一标识，不参与打分）
 *   - question.dim 留空 → matching.ts 走选项级 dim 分支
 */

// 简化选项构造：传入 label + 目标字母
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
    id: 'dogti_q1',
    kind: 'single',
    text: '在外面遇到了一条从没见过的陌生狗，你怎么做？',
    options: [
      opt(1, '直接冲上去，先闻为敬，交朋友这件事从不犹豫', 'E'),
      opt(2, '在旁边观望，确认对方没问题再慢慢靠近', 'I'),
      opt(3, '绕开走，今天不想社交', 'I'),
    ],
  },
  {
    id: 'dogti_q2',
    kind: 'single',
    text: '你发现了一条从没走过的新路，你会？',
    options: [
      opt(1, '立刻拐进去，不知道通向哪才更想走', 'N'),
      opt(2, '记下来，下次做好准备再来探', 'J'),
      opt(3, '走了两步，觉得原来那条路也挺好的，回去了', 'S'),
    ],
  },
  {
    id: 'dogti_q3',
    kind: 'single',
    text: '好朋狗被一条大狗欺负了，你怎么反应？',
    options: [
      opt(1, '直接上，先把那条狗挡住再说', 'T'),
      opt(2, '冲过去陪在好朋狗身边，紧紧贴着它', 'F'),
      opt(3, '先评估一下体型差距，再决定怎么出手', 'S'),
    ],
  },
  {
    id: 'dogti_q4',
    kind: 'single',
    text: '你正在睡觉，美美地做着梦，梦里你在干什么？',
    options: [
      opt(1, '在一片巨大的草地上疯狂奔跑，没有终点，跑到飞起来', 'P'),
      opt(2, '遇到了一只很好很好的朋友，依偎在一起，暖暖的', 'F'),
      opt(3, '发现了一扇从没见过的神秘门，里面是什么完全不知道，但忍不住要推开', 'N'),
    ],
  },
  {
    id: 'dogti_q5',
    kind: 'single',
    text: '你心情很好，在外面遇到一个陌生人，他想摸你，你的第一反应是',
    options: [
      opt(1, '直接往他身上靠，摸吧摸吧', 'E'),
      opt(2, '闻了一下，觉得还好，让他摸了两下', 'S'),
      opt(3, '后退一步，你跟我不熟', 'I'),
    ],
  },
  {
    id: 'dogti_q6',
    kind: 'single',
    text: '你正在睡午觉，突然外面有声响惊醒了你，你的第一个动作是',
    options: [
      opt(1, '立刻跳起来冲过去看，不搞清楚睡不着', 'P'),
      opt(2, '抬头确认了一下没有危险，继续睡', 'J'),
      opt(3, '睁眼盯着门的方向，在脑子里推演了一遍可能是什么', 'N'),
    ],
  },
  {
    id: 'dogti_q7',
    kind: 'single',
    text: '你今天特别累，但有人一直想跟你玩，你会怎么处理',
    options: [
      opt(1, '陪他玩了，虽然累，但看他开心也还好', 'F'),
      opt(2, '直接找个地方躺下，不理他', 'I'),
      opt(3, '陪了一会儿，然后走开了，意思到了就行', 'T'),
    ],
  },
  {
    id: 'dogti_q8',
    kind: 'single',
    text: '你在公园里独自待着，你在做什么？',
    options: [
      opt(1, '在人群里转，看看这个闻闻那个', 'E'),
      opt(2, '找了个安静的角落，看着远处发呆', 'I'),
      opt(3, '在脑子里想着一件最近一直没想通的事', 'N'),
    ],
  },
  {
    id: 'dogti_q9',
    kind: 'single',
    text: '你们一群狗在玩，有人提议去一个新地方，你？',
    options: [
      opt(1, '好啊！走！现在就去', 'P'),
      opt(2, '先问问是什么地方，大概多远', 'J'),
      opt(3, '无所谓，去哪都行，跟着走就是', 'S'),
    ],
  },
  {
    id: 'dogti_q10',
    kind: 'single',
    text: '你做了一件自己觉得很厉害的事，你的反应是？',
    options: [
      opt(1, '想让所有人都知道，在原地转了好几圈', 'E'),
      opt(2, '自己心里美了一下，没说出来', 'I'),
      opt(3, '已经开始想下一件要做的事了', 'T'),
    ],
  },
  {
    id: 'dogti_q11',
    kind: 'single',
    text: '今天不知道吃什么，你的反应是？',
    options: [
      opt(1, '随便，吃什么都行，纠结这个太浪费时间', 'P'),
      opt(2, '认真想了想，锁定了一个最想吃的', 'J'),
      opt(3, '越想越多，最后反而更不知道吃什么了', 'N'),
    ],
  },
  {
    id: 'dogti_q12',
    kind: 'single',
    text: '最后一题：如果可以选，你最想过哪种狗生？',
    options: [
      opt(1, '每天认识新朋友，去很多地方，把世界都闻一遍', 'E'),
      opt(2, '有一个最懂我的人，安安静静待在一起就够了', 'I'),
      opt(3, '自由自在，想去哪就去哪，没有牵绳没有规矩', 'P'),
    ],
  },
];

export const specialQuestions: Question[] = [];
