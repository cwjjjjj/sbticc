import type { CompatInfo } from '../types'

export const COMPATIBILITY: Record<string, CompatInfo> = {
  'BOSS+IMFW': { type: 'soulmate', say: '领导者带着废物飞，废物终于有靠山了' },
  'BOSS+CTRL': { type: 'rival', say: '两个都想掌控全局，遥控器只有一个' },
  'SHIT+THAN-K': { type: 'rival', say: '一个骂世界是屎，一个感谢世界的恩赐' },
  'CTRL+IMFW': { type: 'soulmate', say: '拿捏者遇到废物，完美的操控与被操控' },
  'SEXY+Dior-s': { type: 'rival', say: '尤物和屌丝，偶像剧和现实的碰撞' },
  'LOVE-R+MONK': { type: 'rival', say: '多情者遇上僧人，一个要爱一个要空' },
  'GOGO+ZZZZ': { type: 'rival', say: '行者冲冲冲，装死者睡睡睡，节奏完全对不上' },
  'GOGO+BOSS': { type: 'soulmate', say: '一个说冲，一个说我来带路，黄金搭档' },
  'MUM+SOLO': { type: 'soulmate', say: '妈妈人格治愈孤儿，最温暖的组合' },
  'MUM+FUCK': { type: 'rival', say: '妈妈想照顾你，草者说别管老子' },
  'JOKE-R+DEAD': { type: 'rival', say: '小丑拼命搞笑，死者纹丝不动' },
  'JOKE-R+MALO': { type: 'soulmate', say: '小丑和吗喽，快乐二人组，谁也不嫌谁' },
  'OJBK+THIN-K': { type: 'rival', say: '无所谓人说都行，思考者说等等我还没分析完' },
  'FAKE+IMSB': { type: 'soulmate', say: '伪人的面具恰好保护了傻者的玻璃心' },
  'FUCK+MONK': { type: 'rival', say: '草者要释放，僧人要清净，寺庙要炸了' },
  'OH-NO+GOGO': { type: 'rival', say: '哦不人还在评估风险，行者已经出发了' },
  'ATM-er+POOR': { type: 'soulmate', say: '送钱者遇到贫困者，资源精准对接' },
  'THAN-K+MUM': { type: 'soulmate', say: '感恩者和妈妈，互相温暖的正能量循环' },
  'DRUNK+GOGO': { type: 'soulmate', say: '酒鬼和行者，喝完就冲，冲完再喝' },
  'DRUNK+THIN-K': { type: 'rival', say: '酒鬼要喝断片，思考者要保持清醒' },
  'CTRL+OJBK': { type: 'rival', say: '拿捏者使出浑身解数，无所谓人毫无波澜' },
  'SEXY+LOVE-R': { type: 'soulmate', say: '尤物和多情者，一个值得爱一个拼命爱' },
  'SHIT+DEAD': { type: 'soulmate', say: '愤世者骂完世界，死者说：确实没意思' },
  'HHHH+JOKE-R': { type: 'soulmate', say: '傻乐者和小丑，笑到最后谁也分不清谁' },
  'WOC!+OH-NO': { type: 'soulmate', say: '一个喊卧槽一个喊哦不，惊叹二重奏' },
  'SOLO+DEAD': { type: 'soulmate', say: '孤儿和死者，两个人安静地待在各自的世界里' },
  'IMSB+SEXY': { type: 'rival', say: '傻者看到尤物直接宕机，社恐对上社牛' },
  'ZZZZ+SHIT': { type: 'rival', say: '装死者躺平不动，愤世者气得跳脚' },
  'FAKE+MONK': { type: 'rival', say: '伪人戴着面具社交，僧人根本不想社交' },
  'MALO+Dior-s': { type: 'soulmate', say: '吗喽和屌丝，社会底层互助联盟' },
  'POOR+THIN-K': { type: 'soulmate', say: '贫困者专注一件事，思考者把那件事想透' },
  'BOSS+DEAD': { type: 'rival', say: '领导者要你冲，死者说我已经超脱了' },
  'IMFW+LOVE-R': { type: 'soulmate', say: '废物需要被爱，多情者最会给爱' },
  'FUCK+SEXY': { type: 'soulmate', say: '草者和尤物，荷尔蒙直接爆表' },
  'CTRL+MALO': { type: 'rival', say: '拿捏者想管住吗喽，吗喽在树上冲你做鬼脸' },
  'WOC!+FUCK': { type: 'soulmate', say: '握草人和草者，国粹文化传承二人组' },
}

export function getCompatibility(
  codeA: string,
  codeB: string,
): { type: 'soulmate' | 'rival' | 'mirror' | 'normal'; say: string } {
  if (codeA === codeB) return { type: 'mirror', say: '同类相遇，要么惺惺相惜，要么互相嫌弃' }
  const key1 = `${codeA}+${codeB}`
  const key2 = `${codeB}+${codeA}`
  return COMPATIBILITY[key1] || COMPATIBILITY[key2] || { type: 'normal', say: '普通关系，相安无事' }
}
