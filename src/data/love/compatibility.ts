import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // ===== Soulmates =====
  'HAMRLC+BADPLC': { type: 'soulmate', say: '恋爱脑晚期遇到审计官——一个需要被兜底，一个需要被点燃。你用感性填满TA的Excel，TA用理性拉住你的失控。' },
  'HWMRLV+HAMRFC': { type: 'soulmate', say: '暗恋教主遇到中央空调——你终于找到一个对所有人都好、但可以让你觉得自己特别的人。前提是你得先说出口。' },
  'BWDPFV+HAMRLC': { type: 'soulmate', say: '孤岛遇到恋爱脑晚期——孤岛终于让一个人登陆了，恋爱脑终于有了不烫手的家。你们是彼此的解药，也是彼此的毒。' },
  'HWDRLC+HADRPC': { type: 'soulmate', say: '猫遇到清醒骑士——猫偶尔施舍一个靠近，骑士默默守护不求回报。这是最接近"刚刚好"的距离。' },
  'BAMRLV+HWMRLV': { type: 'soulmate', say: '猎头遇到暗恋教主——一个狂追不舍，一个终于被人看到。你们的问题是一个太快一个太慢，但中间那段刚好是爱情。' },
  'BADRLC+HADPFC': { type: 'soulmate', say: '精神洁癖遇到赌徒——一个要确定性一个带来所有的不确定。你们互相恨又互相离不开。' },
  'BAMPFV+HWMRLV': { type: 'soulmate', say: '操盘手遇到暗恋教主——绝对理性遇上绝对感性，彼此是解药也是软肋。' },
  'BWDRLV+HWDPLV': { type: 'soulmate', say: '理想型收藏家遇到漂流瓶——两个旁观者终于对视了一眼。你们可能永远不会在一起，但那一眼够回忆一辈子。' },
  'HAWRLC+HAMPLC': { type: 'soulmate', say: '恋爱理想主义者遇到恋爱特种兵——一个写剧本一个负责执行，你们组合在一起是最强恋爱战队。' },
  'HAMDLC+BWMPLC': { type: 'soulmate', say: '占有狂遇到门当户对信徒——一个要人一个要条件，但你们都要忠诚到死。至少在这一点上，你们达成了共识。' },

  // ===== Rivals =====
  'HAMRLC+HAMRFC': { type: 'rival', say: '恋爱脑晚期遇到中央空调——一个all in一个雨露均沾，一个哭到崩溃一个不知道自己做错了什么。核弹级灾难。' },
  'BWDPFV+HWMRLV': { type: 'rival', say: '孤岛遇到暗恋教主——一个永远靠不近一个永远在等，两条平行线互相折磨到天荒地老。' },
  'BADPLC+HADPFC': { type: 'rival', say: '审计官遇到赌徒——一个要风控一个要all in，能吵到世界末日。' },
  'BAMRLV+HWDRLC': { type: 'rival', say: '猎头遇到猫——猎头的攻势让猫窒息，猫的冷淡让猎头崩溃。追与逃的无限循环。' },
  'BWMPLC+HAMRLC': { type: 'rival', say: '门当户对信徒遇到恋爱脑晚期——一个用计算器谈恋爱一个用心脏谈恋爱，频道永远对不上。' },
  'BAMPFV+HADRPC': { type: 'rival', say: '操盘手遇到清醒骑士——一个算计一个奉献，骑士被算计到心寒，操盘手被坦诚到害怕。' },
  'BADRLC+HAMRFC': { type: 'rival', say: '精神洁癖遇到中央空调——一个求纯粹一个广撒网，洁癖看空调的朋友圈能气到住院。' },
  'HAMDLC+HADRLV': { type: 'rival', say: '占有狂遇到独行侠——一个要锁死一个要自由，在一起约等于把猫和狗关进同一个笼子。' },
  'BWMRFC+HWDRLC': { type: 'rival', say: '恋爱海王遇到猫——两个都觉得对方应该先表态，结果谁也不动，暧昧到发霉。' },
  'HAWRLC+BWDPFV': { type: 'rival', say: '恋爱理想主义者遇到孤岛——一个在等童话一个在筑城墙，你们连吵架的频道都对不上。' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种恋爱人格——要么惺惺相惜，要么互相照出最不想看到的自己。同类相见，不是知己就是仇人。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们之间没有特别强的化学反应，但也没有致命冲突。平淡是真——或者只是无聊，取决于你怎么看。' };
}
