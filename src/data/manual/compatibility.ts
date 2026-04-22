import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // ===== 灵魂配对 =====
  'BOOM+SAFE':  { type: 'soulmate', say: '易燃易爆炸遇到全天候稳定——一个需要被接住，一个刚好能接住。你的焦虑在TA的稳定面前慢慢有了落脚点，TA的平静在你的热烈里开始有了温度。但记住：TA的稳定不是无限容量，你要学会让TA知道它被需要。' },
  'MUTE+FREE':  { type: 'soulmate', say: '永久静音遇到断网照常运行——两个都不说，但两个都靠行动。你们是那种可以一起沉默一整晚、但都知道对方在的类型。风险是沉默开始有了误解——你们需要偶尔打破它，哪怕只是一句话。' },
  'LEAK+DARK':  { type: 'soulmate', say: '防水不防泪遇到深层运行——你在等人来问，TA在等时机说。表面上你们都很淡定，但彼此都需要被看见。关键是：谁先开口？如果是你，你会发现TA其实装了很多。' },
  'CORE+SAFE':  { type: 'soulmate', say: '内核过热遇到全天候稳定——你压着的东西需要一个不会崩溃的接收端，TA刚好是。TA的稳定让你的内核慢慢降温，而你的深度让TA知道"稳定"不等于"没感情"。' },
  'PING+FREE':  { type: 'soulmate', say: '缓慢充能中遇到断网照常运行——你慢热，TA不催；你需要语言确认，TA虽然不多说但会在关键时刻说。这是最接近"刚刚好"的节奏组合。' },
  'HOLD+LONE':  { type: 'soulmate', say: '静默储蓄遇到独立运行中——两个都不粘，都靠行动，都不焦虑。你们可能会在某天回头发现：原来我们一直在彼此的轨道里，只是都没说出口。' },
  'GLTH+FLOW':  { type: 'soulmate', say: '信号时好时坏遇到优雅输出——你的矛盾需要一个能接住情绪又不被淹没的人，TA刚好清醒到可以给你空间又能说出来"我还在这"。你们需要耐心，但值得。' },
  'HALT+SAFE':  { type: 'soulmate', say: '过热保护遇到全天候稳定——你的时好时坏需要一个不会因为你关机就离开的人。TA的稳定是你最需要的"系统托管"，让你可以关机，也知道开机了TA还在。' },

  // ===== 互相消耗 =====
  'BOOM+BOOM':  { type: 'rival', say: '两个易燃易爆炸在一起——火遇到火不是温暖，是爆炸。你们都需要被安抚，都需要先被确认，都在等对方先说"没事的"。谁来稳定谁？答案是：没有人。' },
  'MUTE+MUTE':  { type: 'rival', say: '两个永久静音在一起——你们都把话藏着，都等对方先来，都靠行动来猜。这段关系会在两个人各自的沉默里慢慢失去温度，然后某天都不知道发生了什么。' },
  'BOOM+VOID':  { type: 'rival', say: '易燃易爆炸遇到真·孤岛系统——一个高频轰炸，一个需要静默。你的每次靠近都在消耗TA的电量，TA的每次"我需要空间"都在触发你的焦虑警报。核弹级配置不匹配。' },
  'GOST+LEAK':  { type: 'rival', say: '随时离线遇到防水不防泪——一个随时消失，一个等着被找到。你们都需要对方先开口，但谁也不会先开口。这段感情会在相互等待里消耗光，最后谁也不知道是谁先走的。' },
  'HALT+BOOM':  { type: 'rival', say: '过热保护遇到易燃易爆炸——一个需要空间，一个会解读空间为"不爱了"。你们的相处模式是：HALT关机→BOOM焦虑→BOOM轰炸→HALT再关机。一个永动机，方向是消耗。' },
  'CORE+DRFT':  { type: 'rival', say: '内核过热遇到草稿箱已满——你们都把话藏着，都在等，都在焦虑。两个草稿箱碰在一起，什么都没发出去，但两个人的焦虑在同一个空间里越堆越高。' },
  'FREE+BOOM':  { type: 'rival', say: '断网照常运行遇到易燃易爆炸——一个不需要你在，一个需要你一直在。你的"我没事"让对方觉得你根本不在乎，对方的"你还好吗"让你觉得快窒息了。频道永远对不上。' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return {
      type: 'mirror',
      say: '你们是同一种说明书——要么读懂了彼此，要么两台机器都在找同一个接口但都没有。同类相遇，不是镜像就是盲区，取决于你们有没有愿意开口说"我也是"。',
    };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return {
    type: 'normal',
    say: '你们之间没有特别强的化学冲突，也没有特别明显的互补，需要靠相处去磨合接口。大多数感情都是这样——说明书上没写，但可以试着去读懂对方的那本。',
  };
}
