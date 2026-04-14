import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // ===== Soulmate pairs (10) =====
  'NJYDJ+ZCPNZ': { type: 'soulmate', say: '内卷永动机遇到职场叛逆者——一个教你拼命，一个教你放手，你们是彼此最需要的解药' },
  'MYZSN+JWFDY': { type: 'soulmate', say: '摸鱼之神遇到卷王辅导员——一个教你认真，一个教你放松，你们能把对方拉回人间' },
  'BGXIA+SGYSJ': { type: 'soulmate', say: '背锅侠遇到甩锅艺术家——一个接锅一个甩锅，效率拉满（虽然不太公平）' },
  'TXDGR+FXLYT': { type: 'soulmate', say: '天选打工人遇到佛系老油条——一个有能量一个有智慧，互相补全' },
  'CYFNG+DGPSA': { type: 'soulmate', say: '创业疯狗遇到打工菩萨——疯狗负责冲锋陷阵，菩萨负责收拾人心' },
  'PUASH+KLXYU': { type: 'soulmate', say: '职场PUA受害者遇到快乐咸鱼——咸鱼能教会你最重要的一课：工作没那么重要' },
  'FWZZZ+MSFCI': { type: 'soulmate', say: '氛围组组长遇到闷声发财——一个管气氛一个管钱，完美搭档' },
  'HSGJI+ZQJQI': { type: 'soulmate', say: '划水冠军遇到赚钱机器——机器负责打仗，冠军负责维稳，配合默契' },
  'GUANX+TPXFG': { type: 'soulmate', say: '关系户遇到躺平先锋——一个拉资源一个不抢资源，互不干扰' },
  'ZCHLI+FWZZZ': { type: 'soulmate', say: '职场老狐狸遇到氛围组组长——狐狸搞定利益，组长搞定人心，无敌组合' },

  // ===== Rival pairs (10) =====
  'NJYDJ+MYZSN': { type: 'rival', say: '内卷永动机遇到摸鱼之神——一个觉得对方浪费生命，一个觉得对方糟蹋生命' },
  'JWFDY+TPXFG': { type: 'rival', say: '卷王辅导员遇到躺平先锋——辅导员的每一句鸡汤都被先锋当成了催眠曲' },
  'CYFNG+FXLYT': { type: 'rival', say: '创业疯狗遇到佛系老油条——疯狗觉得油条在等死，油条觉得疯狗在找死' },
  'ZQJQI+DGPSA': { type: 'rival', say: '赚钱机器遇到打工菩萨——机器觉得菩萨傻，菩萨觉得机器没有人味' },
  'GUANX+TXDGR': { type: 'rival', say: '关系户遇到天选打工人——关系户想拉人入伙，打工人死活不进圈子' },
  'SGYSJ+BGXIA': { type: 'rival', say: '甩锅艺术家遇到背锅侠——一个专业甩锅一个专业接锅，看着配合其实是剥削' },
  'ZDDSH+ZCPNZ': { type: 'rival', say: '站队大师遇到职场叛逆者——大师拉人站队，叛逆者连队都不认' },
  'PUASH+ZCPNZ': { type: 'rival', say: '职场PUA受害者遇到职场叛逆者——受害者觉得叛逆者不负责任，叛逆者觉得受害者被公司驯化了' },
  'HSGJI+NJYDJ': { type: 'rival', say: '划水冠军遇到内卷永动机——永动机一个人干三个人的活，冠军在旁边鼓掌' },
  'MSFCI+FWZZZ': { type: 'rival', say: '闷声发财遇到氛围组组长——一个嫌对方太吵，一个嫌对方太闷' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种职场人格——要么惺惺相惜组成最强搭档，要么互相照出对方最不想承认的那面。两个同类相遇，不是抱团取暖就是互相伤害，没有中间地带。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们之间没有特别强的化学反应，也没有致命冲突。能不能搭档好，三分看性格七分看缘分。不过职场上最好的搭档往往不是最合拍的，而是最能互补的。' };
}
