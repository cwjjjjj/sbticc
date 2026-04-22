import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // 灵魂配对
  'ZHENHUAN+GUOJUNWANG': { type: 'soulmate', say: '深情遇上深情——一个用城府保护柔软，一个用温柔抵挡黑暗，你们都不该属于那个地方，却都在那里相遇了' },
  'WENSHICHU+MEIZHUANG': { type: 'soulmate', say: '骨气遇上温柔——你站着，他守着，谁也不算计谁，是这个故事里最干净的两个人' },
  'JINXI+SUPEISHENG':    { type: 'soulmate', say: '幕后遇上幕后——两个从不站在台前的人，在侧翼互相看懂了彼此' },
  'DUANFEI+JINGFEI':     { type: 'soulmate', say: '沉默遇上沉默——都看透了却选择不说，共同活过了所有风浪，是彼此最可靠的港湾' },
  'HUAFEI+HUANBI':       { type: 'soulmate', say: '烟火遇上执念——都是爱到极致的人，都不会算计，都付出了全部，只是遇到的人辜负了她们' },

  // 天敌组合
  'ZHENHUAN+HUANGHOU':   { type: 'rival', say: '真情遇上算计——一个在学会城府之前还相信真情，一个永远不信真情，注定是对方最难缠的对手' },
  'HUAFEI+ANLINGRONG':   { type: 'rival', say: '明牌遇上暗刃——一个什么都写在脸上，一个把刀藏得最深，偏偏被命运绑在了一起' },
  'EMPEROR+MEIZHUANG':   { type: 'rival', say: '权力遇上骨气——一个以为什么都能拥有，一个偏偏不愿被拥有，谁也说服不了谁' },
  'GUOJUNWANG+NIANGENGYAO': { type: 'rival', say: '理想遇上野心——一个不想下棋，一个恨不得掀翻棋盘，同处一局，命运完全相反' },
  'JINGFEI+CAOGUI':      { type: 'rival', say: '明哲保身遇上冷血算计——一个知道什么不该做，一个什么都敢做，两种生存逻辑水火不容' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一个人——在深宫里对镜自照，有时候是惺惺相惜，有时候是照出了自己最不想承认的那一面。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们的人格没有特别强的化学反应，但同处一部剧总算是某种缘分。' };
}
