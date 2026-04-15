import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // Soulmate pairs
  'SOPFEH+MCPGLR': { type: 'soulmate', say: '精神鞭手遇到月下棉花糖——一个掌控灵魂，一个渴望被掌控。你们是锁和钥匙的关系。' },
  'SOBFEH+MCBGLR': { type: 'soulmate', say: '感官暴君遇到舒适区守护者——一个带来风暴，一个提供港湾。暴风雨过后的宁静是你们的甜蜜点。' },
  'SOPGLH+MOBFEH': { type: 'soulmate', say: '温柔暴君遇到被动攻击型选手——两个高段位玩家终于棋逢对手。你们的关系是一场精彩的心理博弈。' },
  'SCPGLH+MCPGLH': { type: 'soulmate', say: '月光猎人遇到月光诗人——两个人在月光下互相凝视，无需多言，灵魂已经在对话了。' },
  'SOBGLH+MCBGLH': { type: 'soulmate', say: '感官美食家遇到暗涌——一个懂得品味，一个藏着宝藏。你们的深度匹配度是最高的。' },
  'SOPFER+MOBFER': { type: 'soulmate', say: '真实系暴君遇到快感收割机——两个最坦诚的人碰到一起，零废话全干货。' },
  'SOPGLR+MCPFEH': { type: 'soulmate', say: '灵魂绑定者遇到禁区探险家——一个要深度，一个想突破。你们能一起走到大多数人到不了的地方。' },
  'SOBGLR+MCBFER': { type: 'soulmate', say: '锚点遇到闷骚终结者——一个稳定输出，一个安静但炽热。你们是最默契的长期搭档。' },
  'SOBFER+MOBGLH': { type: 'soulmate', say: '野兽派选手遇到丝绒陷阱——一个直来直去，一个以柔克刚。你们的化学反应是爆炸级的。' },
  'MCBFEH+SCPFEH': { type: 'soulmate', say: '深夜变身者遇到脑内剧场VIP——两个人白天装正经，晚上一起进入平行宇宙。' },

  // Rival pairs
  'SOPFEH+SOPGLH': { type: 'rival', say: '精神鞭手遇到温柔暴君——两个掌控者撞到一起，谁也不肯先低头。权力斗争永无止境。' },
  'SOBFEH+MCPGLH': { type: 'rival', say: '感官暴君遇到月光诗人——一个要肉体的真实，一个要灵魂的诗意。频道完全对不上。' },
  'SOPFER+MCPGLR': { type: 'rival', say: '真实系暴君遇到月下棉花糖——一个太直接，一个太含蓄。你们之间的距离不是鸿沟，是次元壁。' },
  'SOBFER+SCPGLH': { type: 'rival', say: '野兽派选手遇到月光猎人——一个嫌对方太慢，一个嫌对方太粗。审美差异不可调和。' },
  'MOBFEH+MCBGLR': { type: 'rival', say: '被动攻击型选手遇到舒适区守护者——一个需要激烈博弈，一个只想安安静静。能把对方逼疯。' },
  'SOBFEH+SOPGLR': { type: 'rival', say: '感官暴君遇到灵魂绑定者——一个要感官的广度，一个要灵魂的深度。你们吵架的时候连频道都不一样。' },
  'MCBFEH+SOBGLR': { type: 'rival', say: '深夜变身者遇到锚点——一个想探索新大陆，一个只想深耕一亩田。方向性分歧太大了。' },
  'MOBFER+MCPGLH': { type: 'rival', say: '快感收割机遇到月光诗人——一个"少废话直接来"，一个"我们能先聊聊灵魂吗"。世纪对话。' },
  'SCPFEH+MCBGLR': { type: 'rival', say: '脑内剧场VIP遇到舒适区守护者——一个满脑子新剧情，一个只想重播经典。创意分歧。' },
  'SOPFEH+MCBFER': { type: 'rival', say: '精神鞭手遇到闷骚终结者——一个想玩心理游戏，一个拒绝任何精神层面的套路。鸡同鸭讲。' },
};

export function getCompatibility(codeA: string, codeB: string): CompatResult {
  if (codeA === codeB) {
    return { type: 'mirror', say: '你们是同一种欲望人格——要么深夜对视心照不宣，要么互相照出最不想面对的自己。' };
  }
  const entry = COMPATIBILITY[`${codeA}+${codeB}`] || COMPATIBILITY[`${codeB}+${codeA}`];
  if (entry) {
    return { type: entry.type, say: entry.say };
  }
  return { type: 'normal', say: '你们之间没有强烈的化学反应，也没有致命冲突。暗处的默契需要时间来发现。' };
}
