import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // Soulmate pairs (8)
  'CLDA+VQDO': { type: 'soulmate', say: '流量核弹遇到赛博隐士——一个疯狂输出，一个深度吸收，互联网世界的完美供需关系' },
  'CQDA+VLDA': { type: 'soulmate', say: '深夜写手遇到评论区判官——一个默默写，一个认真读，灵魂在凌晨两点的评论区相遇' },
  'CLSO+VQSA': { type: 'soulmate', say: '社交蝴蝶遇到僵尸号——一个负责说话一个负责听，最省心的网络关系' },
  'CQDO+VQDA': { type: 'soulmate', say: '隐士匠人遇到信息黑洞——两个深夜独自上网的灵魂，在某个冷门论坛里认出了彼此' },
  'CLSA+VLSO': { type: 'soulmate', say: '热搜制造机遇到快乐水母——一个制造快乐一个消费快乐，互联网快乐循环的闭环' },
  'CLDO+VQSO': { type: 'soulmate', say: '文艺复兴人遇到路人甲——一个活得太用力一个活得太随意，互相中和刚刚好' },
  'CQSA+VLSA': { type: 'soulmate', say: '赛博仓鼠遇到吃瓜群众——一个囤内容一个刷内容，在算法推荐的废墟里找到了同类' },
  'CQSO+VLDO': { type: 'soulmate', say: '佛系博主遇到理想网民——两个互联网清流，在垃圾信息的洪流中互相确认了眼神' },

  // Rival pairs (8)
  'CLDA+VQSO': { type: 'rival', say: '流量核弹遇到路人甲——一个恨不得全世界看到自己，一个根本不看，能把对方气到注销账号' },
  'CQDA+CLSA': { type: 'rival', say: '深夜写手遇到热搜制造机——一个追求深度一个追求流量，审美差异大到可以打架' },
  'VLDA+VLSA': { type: 'rival', say: '评论区判官遇到吃瓜群众——一个写三百字分析一个只看标题，评论区的阶级斗争' },
  'CQDO+CLSA': { type: 'rival', say: '隐士匠人遇到热搜制造机——一篇文章改二十遍 vs 一天发二十条，创作理念水火不容' },
  'CLDO+VQSA': { type: 'rival', say: '文艺复兴人遇到僵尸号——一个用网络提升自己一个被网络消耗自己，互相看不顺眼' },
  'VLDO+VLSA': { type: 'rival', say: '理想网民遇到吃瓜群众——一个辟谣一个传谣，互联网生态链的天敌' },
  'CQSO+CQDA': { type: 'rival', say: '佛系博主遇到深夜写手——一个随便发发一个字字斟酌，创作态度的极端对立' },
  'VQDO+VQSA': { type: 'rival', say: '赛博隐士遇到僵尸号——都不社交但原因完全不同，一个是清醒一个是麻木' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种赛博人格——要么在同一个角落里惺惺相惜，要么互相照出最不想承认的网瘾真相。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们的赛博人格没有特别强的化学反应，但同处一个互联网也算是某种缘分吧。' };
}
