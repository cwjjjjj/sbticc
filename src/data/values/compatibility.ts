import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // Soulmate pairs (8)
  'ODEF+RTIS': { type: 'soulmate', say: '冒险王遇到社畜之王——一个带对方出去疯，一个把对方拽回地面，互为解药' },
  'ODES+RTIF': { type: 'soulmate', say: '人生赢家遇到虚无主义者——一个证明人生有意义，一个证明不需要意义也能活' },
  'ODIF+RDES': { type: 'soulmate', say: '独行侠遇到体制之王——一个自由得令人羡慕，一个稳定得令人安心，彼此填补最大的缺口' },
  'OTEF+RDIS': { type: 'soulmate', say: '嘴替遇到人间清醒——一个负责输出观点，一个负责落地执行，天生的搭档' },
  'OTIF+RDES': { type: 'soulmate', say: '世外高人遇到体制之王——一个看透了世界还觉得有趣，一个改造着世界还保持清醒' },
  'OTES+RDIF': { type: 'soulmate', say: '国民教师遇到野生动物——一个把规则研究透了，一个把规则打破了，互相看对方都觉得不可思议' },
  'ODIS+RTEF': { type: 'soulmate', say: '基建狂魔遇到杠精之王——一个默默建造，一个疯狂解构，碰在一起反而能造出最坚固的东西' },
  'OTIS+RDEF': { type: 'soulmate', say: '老干部遇到搞钱战神——一个提供智慧，一个提供行动力，合在一起能干大事' },

  // Rival pairs (8)
  'ODEF+RTIF': { type: 'rival', say: '冒险王遇到虚无主义者——一个觉得什么都值得一试，一个觉得什么都没意义，能把对方逼疯' },
  'ODIF+RTES': { type: 'rival', say: '独行侠遇到精算师——一个拿命换自由，一个拿自由换安全，三观核爆级冲突' },
  'OTEF+RTIS': { type: 'rival', say: '嘴替遇到社畜之王——一个天天喊着改变世界，一个天天只想活到下班，互相看不顺眼' },
  'ODES+RDIF': { type: 'rival', say: '人生赢家遇到野生动物——一个按部就班拿满分，一个撕碎试卷去创业，价值观完全对立' },
  'OTIF+RDIS': { type: 'rival', say: '世外高人遇到人间清醒——一个出世一个入世，都觉得自己看透了对方没看透' },
  'OTES+RDEF': { type: 'rival', say: '国民教师遇到搞钱战神——一个觉得钱不是最重要的，一个觉得说这话的人是没赚到钱' },
  'ODIS+RTES': { type: 'rival', say: '基建狂魔遇到精算师——两个都太算了，算到最后发现彼此都是自己最不想成为的那种人' },
  'OTIS+RTEF': { type: 'rival', say: '老干部遇到杠精之王——一个岁月静好，一个偏要掀桌，同一张饭桌坐不到第二次' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种三观人格——要么惺惺相惜组成同温层，要么互相照出最不想承认的自己。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们之间没有特别强的三观冲突，但也没有灵魂共鸣。一切看缘分和经营。' };
}
