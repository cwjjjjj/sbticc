import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  'JIA+DING': { type: 'soulmate', say: '甲木负责往前长，丁火负责把夜路照亮。一个有方向，一个有温度，别互相嫌弃节奏不同就行。' },
  'YI+GENG': { type: 'soulmate', say: '乙木遇庚金，一个会绕，一个会断。看似不搭，实际很容易把对方从自己的惯性里拽出来。' },
  'BING+GUI': { type: 'soulmate', say: '丙火太亮，癸水太深。一个把世界照开，一个提醒别被光晃瞎，互补但需要耐心翻译。' },
  'WU+REN': { type: 'soulmate', say: '戊土能托住壬水的流动，壬水能冲开戊土的固执。一个给岸，一个给浪。' },
  'JI+XIN': { type: 'soulmate', say: '己土懂辛金的精致不是矫情，辛金也看得见己土的照顾不是廉价。慢热但耐用。' },
  'JIA+XIN': { type: 'rival', say: '甲木觉得辛金太挑，辛金觉得甲木太糙。一个要生长，一个要质感，吵起来像装修队遇到珠宝柜。' },
  'BING+GENG': { type: 'rival', say: '丙火要热烈，庚金要利落。一个嫌对方冷，一个嫌对方吵，谁也不肯先降温。' },
  'WU+YI': { type: 'rival', say: '戊土要稳定，乙木要空间。一个想把关系夯实，一个怕被夯成水泥地。' },
  'DING+REN': { type: 'rival', say: '丁火要被认真看见，壬水总像在远处观察。一个嫌对方不回应，一个嫌对方太追问。' },
  'JI+GUI': { type: 'rival', say: '己土想照顾，癸水想隐身。一个越靠近，一个越往深处退，最后两边都委屈。' },
};

export function getCompatibility(a: string, b: string): CompatResult {
  if (a === b) return { type: 'mirror', say: '同一种天干气质撞在一起，懂是很懂，但也容易互相照出那点最不想承认的毛病。' };
  const entry = COMPATIBILITY[`${a}+${b}`] || COMPATIBILITY[`${b}+${a}`];
  if (entry) return { type: entry.type, say: entry.say };
  return { type: 'normal', say: '这组没有强烈的天干化学反应。能不能合，主要看谁愿意先承认自己也有病。' };
}
