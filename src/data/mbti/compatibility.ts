import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {
  // ── 16 SOULMATE ──────────────────────────────────────────────────────────
  'INTJ+ENFP': {
    type: 'soulmate',
    say: '你列了一张五年计划表，对方拿过去在背面画了只猫，然后认真问：计划里有没有养猫这件事？你想了三秒说：可以加进去。',
  },
  'INTP+ENTJ': {
    type: 'soulmate',
    say: '一个把模型跑通就满足了，一个非要把模型打包成产品卖出去。两人一起的时候，脑子和拳头都有了。',
  },
  'ENTP+INFJ': {
    type: 'soulmate',
    say: '对方深夜发来一段话，字数超过五百，全是对人性的困惑。你非但没有撤退，还回了八百字。两人就这样聊到天亮。',
  },
  'INFP+ENFJ': {
    type: 'soulmate',
    say: '你写了半首诗搁着不知道怎么结尾，对方读完自然地接了后半段，一个字也没问你意思。你第一次觉得被人读懂了。',
  },
  'ENFJ+ISFP': {
    type: 'soulmate',
    say: '领路人总想把人推向舞台，艺术家只想安静做自己的事。但对方做的那件事太好看，领路人变成了第一个鼓掌的人。',
  },
  'ISTJ+ESFP': {
    type: 'soulmate',
    say: '你把周末行程排满了备选方案，对方说直接出发吧。你愣了两秒，关掉电子表格，跟着走了。那天是近年来最好玩的一天。',
  },
  'ISFJ+ESTP': {
    type: 'soulmate',
    say: '你默默记住了对方爱喝什么咖啡、雨天会不带伞，对方冲进便利店替你抢到最后一把折叠伞。两人都不说谢谢，都记住了。',
  },
  'ESTJ+ISFP': {
    type: 'soulmate',
    say: '你坚持会议要准时开始，对方迟到两分钟带了两杯咖啡进来，你还没开口批评，就先接过了自己那杯。',
  },
  'ESFJ+ISTP': {
    type: 'soulmate',
    say: '你问对方最近怎么样，对方说还行。你却从"还行"两个字里听出了七种细节，默默帮他安排好了所有麻烦。',
  },
  'ESTP+INFJ': {
    type: 'soulmate',
    say: '一个永远活在今晚，一个永远活在十年后。但每次讨论同一件事，两人给出的答案刚好拼成了完整的地图。',
  },
  'ESFP+INTJ': {
    type: 'soulmate',
    say: '你花三天研究了最优路线，对方在出发前两小时说要去另一个城市。你破天荒地没反对，因为对方笑起来的时候你突然觉得计划可以改。',
  },
  'ENFP+ISTJ': {
    type: 'soulmate',
    say: '你每隔一段时间就会有新想法，对方每次都帮你把想法落成可执行的步骤。有一天你发现，你们俩合起来才是一个完整的人。',
  },
  'ENTJ+INFP': {
    type: 'soulmate',
    say: '你推进项目像坦克，对方问了一句"这样做对大家真的好吗"，你停下来想了整整一个晚上。后来方案改了，结果比原来好。',
  },
  'INFJ+ENFP': {
    type: 'soulmate',
    say: '你很少对人敞开，但对方一开口说话你就觉得这个人懂你。后来发现对方对所有人都这么说，但只有你们两个聊了整整一夜。',
  },
  'ISTP+ENFJ': {
    type: 'soulmate',
    say: '你不喜欢被人安排，对方也知道，从不逼你。但每次你陷入困境，对方早就悄悄在旁边候着了，工具箱和咖啡都准备好了。',
  },
  'ISFP+ENTJ': {
    type: 'soulmate',
    say: '你只想把一件事做到极致，对方非要你告诉他这件事能赚多少钱。你说：不知道。对方说：那我来算，你继续做。',
  },

  // ── 16 RIVAL ─────────────────────────────────────────────────────────────
  'INTP+ESFJ': {
    type: 'rival',
    say: '你觉得把道理讲清楚就够了，对方觉得你连招呼都不打就开讲，简直没礼貌。两人说的不是同一种语言。',
  },
  'ENTP+ISFJ': {
    type: 'rival',
    say: '你提出第七个颠覆性方案，对方轻声说：上次那个还没试完呢。你想反驳，但想不到好理由。',
  },
  'INFP+ESTJ': {
    type: 'rival',
    say: '你要求周五前交报告，对方说灵感还没到。你说没有灵感也要交，对方说交了也是糊弄人。两人都觉得对方很奇怪。',
  },
  'ENFJ+INTP': {
    type: 'rival',
    say: '你试图激励对方，对方说谢谢但没什么感觉。你再努力，对方说逻辑上你说的不一定对。你累了。',
  },
  'ISTP+ENFP': {
    type: 'rival',
    say: '你一个人拆了半天机器，对方过来说"我有个超棒的点子！"你看了对方一眼，继续拆，没说话。',
  },
  'ESTP+INFP': {
    type: 'rival',
    say: '你说这件事做了再说，对方说要先想清楚意义在哪里。你做完了，对方还在想。你们俩各自成功，但没有在一起成功过。',
  },
  'ESFP+INFJ': {
    type: 'rival',
    say: '你把聚会氛围搞得很热，对方在角落端着酒杯看着你，表情像是在分析一种现象。你走过去问怎么了，对方说在思考。',
  },
  'ENTJ+ISFJ': {
    type: 'rival',
    say: '你宣布新策略，要求明天开始执行，对方说大家还没准备好。你说没时间准备了。对方沉默，然后默默把所有人提前叫来培训。你后来才知道。',
  },
  'INTJ+ESTJ': {
    type: 'rival',
    say: '两人都觉得自己方案是最优解，谁也不肯先退。会议室里静了三分钟，最后用硬币决定，谁输谁写会议纪要。',
  },
  'INTP+ISFP': {
    type: 'rival',
    say: '你说要从底层原理推导，对方说感觉这样不太对。你问哪里不对，对方说就是感觉。你沉默，然后重新打开文档。',
  },
  'INFJ+INTJ': {
    type: 'rival',
    say: '两个人都相信自己看透了世界，但看到的版本完全不同。讨论一件事能从下午三点谈到晚上十一点，谁也没有说服谁。',
  },
  'ENFP+ESFJ': {
    type: 'rival',
    say: '你想打破所有规矩，对方想维持所有传统。你说改变才有意思，对方说稳定才有安全感。聚会座位排到一起，大家都捏把汗。',
  },
  'ISTP+INTP': {
    type: 'rival',
    say: '两人都是话少的类型，坐一起能沉默四十分钟。但一旦开口就会争谁的方法更高效，争到最后各自回去单独做。',
  },
  'ESTP+ESFP': {
    type: 'rival',
    say: '两个人同时想主导局面，争着讲话、争着带节奏。热闹是真热闹，但总有一种感觉：这场聚会有两个主持人，没有观众。',
  },
  'ENTJ+ESTJ': {
    type: 'rival',
    say: '你要创新，对方要守规。你说流程要变，对方说流程刚刚稳定。两人都没有错，但会议总是超时，因为谁都不愿意先让步。',
  },
  'ISTJ+ISFJ': {
    type: 'rival',
    say: '同样的事两人都想管，谁也不信任对方会记得细节。最后把同一件事做了两遍，都做得很认真，都没告诉对方。',
  },
};

export function getCompatibility(a: string, b: string): CompatResult {
  // Strip A/T suffix and look up by main type
  const mainA = a.split('-')[0];
  const mainB = b.split('-')[0];
  const key = `${mainA}+${mainB}`;
  const reverseKey = `${mainB}+${mainA}`;
  const entry = COMPATIBILITY[key] ?? COMPATIBILITY[reverseKey];
  if (entry) return { type: entry.type, say: entry.say };
  if (mainA === mainB) return { type: 'mirror', say: '\u540c\u7c7b\u578b\u955c\u50cf\u3002' };
  return { type: 'normal', say: '\u666e\u901a\u7684\u5173\u7cfb\u3002' };
}
