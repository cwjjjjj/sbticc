import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // ===== Soulmates: 反串互补 =====
  'M_GOLD+F_BOSS': { type: 'soulmate', say: '挖金壮男遇到霸总姐——一个会算账，一个会拍板。你们不像谈恋爱，更像合并报表，但离谱的是还真能盈利。' },
  'M_HUBY+F_DADY': { type: 'soulmate', say: '纯享娇夫遇到爹味姐——一个想被安排，一个天生爱安排。只要别把照顾演成管教，这组能过得很省心。' },
  'M_GTEA+F_LICK': { type: 'soulmate', say: '绿茶公遇到舔狗姐——一个递钩子，一个主动上钩。危险但丝滑，暧昧浓度高到空气都能拉丝。' },
  'M_WHIT+F_NICE': { type: 'soulmate', say: '傻白男遇到好好姐——两个人都愿意相信世界还有好人。缺点是容易一起被骗，优点是被骗完还会互相递纸。' },
  'M_CTRL+F_DADG': { type: 'soulmate', say: '监控型男友遇到爹味女友——双方都觉得亲密就是深度参与。别人看是互相窒息，你们看是双向负责。' },
  'M_MOON+F_BACK': { type: 'soulmate', say: '白月光哥哥遇到背锅女侠——一个克制到让人遗憾，一个能兜住所有烂摊子。她替你落地，你替她留白。' },
  'M_PRNC+F_MGIR': { type: 'soulmate', say: '奶油王子病遇到妈宝女——两个没完全长大的人互相确认：成年世界太累了，不如一起躲进舒适区。' },
  'M_DRAM+F_WILD': { type: 'soulmate', say: '作精小王子遇到野狗姐——一个负责制造剧情，一个负责把剧情推到高潮。日子不会平静，但绝对不无聊。' },
  'M_SCHM+F_DARK': { type: 'soulmate', say: '心机弟弟遇到阴暗姐——两个人都不相信表面话，却都听得懂潜台词。棋逢对手，危险但上头。' },
  'M_HOOK+F_OCEA': { type: 'soulmate', say: '钩子公遇到海王姐——一个会放线，一个会控潮。你们最好别谈承诺，谈拉扯就已经赢麻了。' },

  // ===== Rivals: 反串互殴 =====
  'M_GOLD+F_PHNX': { type: 'rival', say: '挖金壮男遇到凤凰女——两个人都在看对方能不能托举自己，最后发现谁都不想当对方的梯子。' },
  'M_HUBY+F_TOOL': { type: 'rival', say: '纯享娇夫遇到工具女——一个等人伺候，一个已经被生活榨干。她没有余力养你，你没有动力救她。' },
  'M_GTEA+F_KBGR': { type: 'rival', say: '绿茶公遇到键盘大妈——你刚开始泡茶，她已经把茶具掀了。一个装无辜，一个专治无辜。' },
  'M_FBRO+F_MGIR': { type: 'rival', say: '扶妹魔遇到妈宝女——双方背后都站着一个家庭军团。你们不是两个人谈恋爱，是两个群聊在开战。' },
  'M_MALK+F_STRG': { type: 'rival', say: '雄竞精遇到厌男斗士——一个非要赢同性，一个专门拆男性叙事。吵起来每句话都像辩论赛决赛。' },
  'M_CTRL+F_WILD': { type: 'rival', say: '监控型男友遇到野狗姐——你越想拴住，她越想翻墙。你以为是安全感问题，她觉得是人生自由问题。' },
  'M_SOFT+F_IRON': { type: 'rival', say: '奶油大哥遇到铁拳姐——你靠软糊过去的账，她会一条条钉回墙上。温柔壳碰到铁拳，直接露馅。' },
  'M_PHNX+F_BOSS': { type: 'rival', say: '凤凰公遇到霸总姐——你想向上借势，她只接受强强合作。她不是台阶，她是门槛。' },
  'M_FANC+F_PCON': { type: 'rival', say: '饭圈弟弟遇到普信女——一个只爱屏幕里的完美人设，一个坚信自己就是完美人设。互相都觉得对方不现实。' },
  'M_WLOT+F_ROUG': { type: 'rival', say: '白莲兄弟遇到流氓女——你刚摆出受害者姿态，她已经把剧本撕了。一个靠委屈，一个不吃委屈。' },
};

export function getCompatibility(_a: string, _b: string): CompatResult {
  if (_a === _b) {
    return { type: 'mirror', say: '你们是同一种反串人格——要么互相理解到想笑，要么互相照出最不想承认的那一面。' };
  }
  const entry = COMPATIBILITY[`${_a}+${_b}`] || COMPATIBILITY[`${_b}+${_a}`];
  if (entry) return { type: entry.type, say: entry.say };
  return { type: 'normal', say: '两人相处模式没有特别强的化学反应，也没有明显的冲突。能不能成，主要看你们愿不愿意少演一点。' };
}
