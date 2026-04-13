import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  'HAMR+BADP': { type: 'soulmate', say: '飞蛾遇到审计官——一个需要被兜底，一个需要被点燃' },
  'HWMR+HAMP': { type: 'soulmate', say: '月光信徒遇到纵火犯——一个满脑子剧本，一个专门把剧本变现' },
  'BWDP+HAMR': { type: 'soulmate', say: '孤岛遇到飞蛾——孤岛终于让一个人登陆了，飞蛾终于有了不烫手的家' },
  'HADR+HWDR': { type: 'soulmate', say: '骑士遇到猫——骑士默默守护，猫偶尔施舍一个靠近' },
  'BAMR+HWMP': { type: 'soulmate', say: '猎头遇到暗恋教主——一个狂追不舍，一个终于被人看到' },
  'BWMR+HADP': { type: 'soulmate', say: '完美主义者遇到赌徒——一个要确定性，一个带来所有的不确定' },
  'BAMP+HWMR': { type: 'soulmate', say: '操盘手遇到月光信徒——一个绝对理性，一个绝对感性，彼此是解药' },
  'BADR+HWDP': { type: 'soulmate', say: '策展人遇到漂流瓶——一个精心策划，一个随遇而安，互相中和' },
  'HAMR+HAMP': { type: 'rival', say: '飞蛾遇到纵火犯——一个越烧越旺一个烧完就跑，核弹级灾难' },
  'BWDP+HWMR': { type: 'rival', say: '孤岛遇到月光信徒——一个永远靠不近，一个永远在等，两条平行线' },
  'BADP+HADP': { type: 'rival', say: '审计官遇到赌徒——一个要风控一个要all in，能吵到天荒地老' },
  'BAMR+HWDR': { type: 'rival', say: '猎头遇到猫——猎头的攻势让猫窒息，猫的冷淡让猎头崩溃' },
  'BWMP+HAMR': { type: 'rival', say: '局外人遇到飞蛾——一个冷眼旁观一个烈火烹油，温差能冻死人' },
  'BAMP+HADR': { type: 'rival', say: '操盘手遇到骑士——一个算计一个奉献，骑士被算计到心寒' },
  'BWMR+HWDP': { type: 'rival', say: '完美主义者遇到漂流瓶——一个要求100分一个连卷子都懒得看' },
  'BADR+HAMP': { type: 'rival', say: '策展人遇到纵火犯——一个求精致一个搞破坏，审美冲突不可调和' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种恋爱人格——要么惺惺相惜，要么互相照出最不想看到的自己。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们之间没有特别强的化学反应，但也没有致命冲突。一切看缘分和经营。' };
}
