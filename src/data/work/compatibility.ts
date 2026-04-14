import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // ===== Soulmate pairs (8) =====
  'PSRH+GTCB': { type: 'soulmate', say: '创业疯狗遇到打工菩萨——一个拼命往前冲，一个稳稳兜住底' },
  'PSRB+PTCH': { type: 'soulmate', say: '自由侠客遇到卷王辅导员——一个教你放松，一个教你认真' },
  'PSCH+GTRB': { type: 'soulmate', say: '匠人强迫症遇到快乐咸鱼头——一个追求完美，一个教你"差不多得了"' },
  'PSCB+GSRH': { type: 'soulmate', say: '佛系手艺人遇到赚钱机器——一个有手艺一个有野心，互相补全' },
  'PTRH+GSCB': { type: 'soulmate', say: '鸡血队长遇到职场NPC——队长终于找到一个不会被他吓跑的队友' },
  'PTRB+GSCH': { type: 'soulmate', say: '氛围感搭子遇到闷声发财——一个负责快乐一个负责赚钱，完美分工' },
  'PTCB+GTCH': { type: 'soulmate', say: '养生型团宠遇到职场老狐狸——一个无欲则刚一个算无遗策，最安全的组合' },
  'GSRB+PTRH': { type: 'soulmate', say: '摸鱼之王遇到鸡血队长——摸鱼王终于被一个人点燃了' },

  // ===== Rival pairs (8) =====
  'PSRH+GSCB': { type: 'rival', say: '创业疯狗遇到职场NPC——一个觉得对方没追求，一个觉得对方有病' },
  'PSCH+GSRB': { type: 'rival', say: '匠人强迫症遇到摸鱼之王——一个改到凌晨三点，一个五点半准时关电脑' },
  'PTRH+PSCB': { type: 'rival', say: '鸡血队长遇到佛系手艺人——队长的热情在佛系面前全部石沉大海' },
  'GSRH+PTCB': { type: 'rival', say: '赚钱机器遇到养生型团宠——一个觉得浪费时间，一个觉得没有人味' },
  'GTRH+PSRB': { type: 'rival', say: '团建教父遇到自由侠客——教父想拉人入伙，侠客死活不进群' },
  'GTCH+PTRB': { type: 'rival', say: '职场老狐狸遇到氛围感搭子——一个全是心机，一个全是真心，互相看不懂' },
  'GSRH+GTCB': { type: 'rival', say: '赚钱机器遇到打工菩萨——一个只看利益一个只看人情，鸡同鸭讲' },
  'GSCH+PTRB': { type: 'rival', say: '闷声发财遇到氛围感搭子——一个嫌对方太吵，一个嫌对方太闷' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种职场人格——要么惺惺相惜组成最强搭档，要么互相照出对方最不想承认的缺点。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们之间没有特别强的化学反应，但也没有致命冲突。能不能配合好，看缘分也看磨合。' };
}
