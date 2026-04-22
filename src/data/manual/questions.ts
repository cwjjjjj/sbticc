import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1: 亲密需求 H(黏)=低分 vs L(疏)=高分 =====
  {
    id: 'mq1', dim: 'D1', text: '你和对方刚确认关系，你期待的日常联系频率是？',
    options: [
      { label: '最好从早到晚都知道对方在哪，线上线下都要在一起', value: 1 },
      { label: '每天至少聊一两个小时，有点联系心里才踏实', value: 2 },
      { label: '约好了就见，没事不必天天联系', value: 3 },
      { label: '两个人各有各的生活，需要见面提前约', value: 4 },
    ],
  },
  {
    id: 'mq2', dim: 'D1', text: '对方出差一周，你的状态是？',
    options: [
      { label: '每天发消息问TA有没有想我，想到影响睡眠', value: 1 },
      { label: '想念，但能正常生活，每天打个电话', value: 2 },
      { label: '难得清净，把积压的自己的事都干完了', value: 3 },
      { label: '反而睡得更好，不用每天协调对方的时间', value: 4 },
    ],
  },
  {
    id: 'mq3', dim: 'D1', text: '对方说"我需要一个人待一会"，你第一反应？',
    options: [
      { label: '是不是我做错什么了（开始回放最近所有的对话）', value: 1 },
      { label: '有点难受，但能理解，等TA主动联系我', value: 2 },
      { label: '没问题，我也正好有自己的事', value: 3 },
      { label: '太好了，我也需要独处时间', value: 4 },
    ],
  },
  {
    id: 'mq4', dim: 'D1', text: '情侣之间，你觉得"共享位置"这件事？',
    options: [
      { label: '必须开，这是基础安全感，不是监控', value: 1 },
      { label: '可以开，但不会盯着看，有了就放心', value: 2 },
      { label: '不用开，有事直接问就好', value: 3 },
      { label: '建议都别开，两个人需要各自的边界感', value: 4 },
    ],
  },

  // ===== D2: 焦虑体质 A(高焦虑)=低分 vs S(稳定)=高分 =====
  {
    id: 'mq5', dim: 'D2', text: '暧昧期对方两小时没回你消息，你会？',
    options: [
      { label: '已经发了第二条"在忙吗"，还把聊天记录重读了三遍', value: 1 },
      { label: '心里有点在意，强迫自己放下手机但没成功', value: 2 },
      { label: '觉得TA在忙，想起来才看一眼手机', value: 3 },
      { label: '什么？我忘了发过消息这件事了', value: 4 },
    ],
  },
  {
    id: 'mq6', dim: 'D2', text: '对方发来"……"，你脑子里第一反应是？',
    options: [
      { label: '完了TA在生气，开始回放最近有没有做错什么', value: 1 },
      { label: '有点困惑，等TA后续，但心里有点悬着', value: 2 },
      { label: '可能手滑，不太在意', value: 3 },
      { label: '我当时在刷视频，没太注意', value: 4 },
    ],
  },
  {
    id: 'mq7', dim: 'D2', text: '感情进入平稳期，联系频率比热恋时少了，你会？',
    options: [
      { label: '觉得对方没以前那么在乎我了，开始担心', value: 1 },
      { label: '有点失落，但告诉自己这是正常过渡', value: 2 },
      { label: '还好，激情期过了，稳定也挺舒服', value: 3 },
      { label: '终于，不用每天花那么多时间聊天了', value: 4 },
    ],
  },
  {
    id: 'mq8', dim: 'D2', text: '你上周给对方发了一句话，对方回了个语气词就没再说，你？',
    options: [
      { label: '当天晚上躺着想，是不是我说错了什么', value: 1 },
      { label: '注意到了，但强行说服自己没事', value: 2 },
      { label: '记住了，但不会放在心上', value: 3 },
      { label: '我已经忘了这件事了', value: 4 },
    ],
  },

  // ===== D3: 情绪表达 O(说出来)=低分 vs I(藏起来)=高分 =====
  {
    id: 'mq9', dim: 'D3', text: '对方做了件让你不开心的事，你会？',
    options: [
      { label: '当场说，不舒服就是不舒服，现在说清楚比憋着强', value: 1 },
      { label: '找个合适时机，认真谈一谈', value: 2 },
      { label: '自己消化一下，如果还放不下才说', value: 3 },
      { label: '自己消化，说了对方不一定理解，不如不说', value: 4 },
    ],
  },
  {
    id: 'mq10', dim: 'D3', text: '感情里委屈的时候，你怎么处理？',
    options: [
      { label: '直接说"你刚才那句话伤到我了"', value: 1 },
      { label: '表现出来，等对方来问，问了就说', value: 2 },
      { label: '说，但说得比较绕，对方经常没听懂', value: 3 },
      { label: '说"没事"，回去自己默默难受', value: 4 },
    ],
  },
  {
    id: 'mq11', dim: 'D3', text: '对方问你"最近有没有什么不开心"，你会？',
    options: [
      { label: '一口气说出来，说完轻松多了', value: 1 },
      { label: '说一部分，比较重要的那些', value: 2 },
      { label: '说"没事"，然后岔开话题', value: 3 },
      { label: '说"没事"，然后心里想刚才为什么没说', value: 4 },
    ],
  },
  {
    id: 'mq12', dim: 'D3', text: '喜欢对方的时候，你会主动说出来吗？',
    options: [
      { label: '会，喜欢就是喜欢，有什么不好意思的', value: 1 },
      { label: '会，但需要鼓起一些勇气才说得出口', value: 2 },
      { label: '用行动暗示，等对方来揭穿', value: 3 },
      { label: '不会，宁愿把这份心意带进棺材', value: 4 },
    ],
  },

  // ===== D4: 投入节奏 F(快热)=低分 vs C(慢热)=高分 =====
  {
    id: 'mq13', dim: 'D4', text: '遇到一个有好感的人，你一般多快确认"我喜欢TA"？',
    options: [
      { label: '一个眼神、一句话，瞬间确认，没有犹豫', value: 1 },
      { label: '见几面聊几周，感觉来了就知道', value: 2 },
      { label: '需要几个月，反复确认才投入', value: 3 },
      { label: '直到对方主动，我才发现自己好像也喜欢TA', value: 4 },
    ],
  },
  {
    id: 'mq14', dim: 'D4', text: '感情里你是哪种人？',
    options: [
      { label: '喜欢就冲，爱过才知道值不值', value: 1 },
      { label: '有感觉了就表达，不喜欢拖', value: 2 },
      { label: '宁愿晚一点，确认了再往前走', value: 3 },
      { label: '从来不是第一个动心的，都是被追那个', value: 4 },
    ],
  },
  {
    id: 'mq15', dim: 'D4', text: '和一个人见过三次，你对这段关系的判断？',
    options: [
      { label: '足够了，我能判断喜不喜欢', value: 1 },
      { label: '有大概感觉，但还需要多了解', value: 2 },
      { label: '才三次，太早了，还要再看看', value: 3 },
      { label: '三次？我朋友认识了十年还没搞清楚（推进速度极慢）', value: 4 },
    ],
  },
  {
    id: 'mq16', dim: 'D4', text: '对方跟你说"我们来正式在一起吧"，你的反应？',
    options: [
      { label: '喜欢就答应，不需要想太多', value: 1 },
      { label: '考虑了一下，觉得可以，同意', value: 2 },
      { label: '说我需要再想想（心里有感觉但要确认）', value: 3 },
      { label: '说"先这样慢慢相处吧"（继续观察期）', value: 4 },
    ],
  },

  // ===== D5: 安全感频道 V(言语)=低分 vs B(行动)=高分 =====
  {
    id: 'mq17', dim: 'D5', text: '感情里什么最让你有安全感？',
    options: [
      { label: '对方频繁发消息、主动说"我喜欢你"、语言上的确认', value: 1 },
      { label: '对方记住你说过的每个细节，偶尔也会用语言表达', value: 2 },
      { label: '对方在你需要的时候出现，行动比话语重要', value: 3 },
      { label: '对方给你足够的自由，不管束，行动说明一切', value: 4 },
    ],
  },
  {
    id: 'mq18', dim: 'D5', text: '对方一周没说"我喜欢你"或者类似的话，你会？',
    options: [
      { label: '开始怀疑对方是不是没以前那么在乎我了', value: 1 },
      { label: '有点在意，但不会当面问', value: 2 },
      { label: '无所谓，TA做的那些事我都看见了', value: 3 },
      { label: '我自己也没说过，我们就是不说这类话的组合', value: 4 },
    ],
  },
  {
    id: 'mq19', dim: 'D5', text: '对方表达爱意的方式是"默默做事但从不说"，你的感受？',
    options: [
      { label: '谢谢，但请直接告诉我你爱不爱我', value: 1 },
      { label: '能感受到，但偶尔还是希望TA说出来', value: 2 },
      { label: '这正好就是我需要的', value: 3 },
      { label: '我们是同款，彼此都不说但都懂', value: 4 },
    ],
  },
  {
    id: 'mq20', dim: 'D5', text: '对方说了一句"你对我很重要"，你的感受是？',
    options: [
      { label: '这句话我能回味一整周', value: 1 },
      { label: '很开心，但不是特别依赖这类话', value: 2 },
      { label: '好听，但我更想看到TA下次出现的行动', value: 3 },
      { label: '感谢，但说多了不值钱，还是看做的', value: 4 },
    ],
  },

  // ===== D6: 冲突修复 T(主动谈)=低分 vs W(等待/回避)=高分 =====
  {
    id: 'mq21', dim: 'D6', text: '你和对方吵架了，接下来你会？',
    options: [
      { label: '气消了马上找TA谈，把来龙去脉说清楚', value: 1 },
      { label: '等一两小时冷静了再找对方聊', value: 2 },
      { label: '等对方先来找我，我先不开口', value: 3 },
      { label: '如果对方不来，这件事就这么过去了', value: 4 },
    ],
  },
  {
    id: 'mq22', dim: 'D6', text: '吵架后一般谁先道歉？',
    options: [
      { label: '我，不管对不对，先道歉能早点和好', value: 1 },
      { label: '视情况，谁更有错谁先说', value: 2 },
      { label: '等对方，我不会先开口', value: 3 },
      { label: '没有正式道歉，时间一长自然就好了', value: 4 },
    ],
  },
  {
    id: 'mq23', dim: 'D6', text: '有个问题你一直没说出口，压了很久，你会？',
    options: [
      { label: '找个时间直接提出来，憋着太难受', value: 1 },
      { label: '等一个合适的机会再说', value: 2 },
      { label: '先等对方主动问，再说', value: 3 },
      { label: '可能就算了，开口太难', value: 4 },
    ],
  },
  {
    id: 'mq24', dim: 'D6', text: '感情里让你最受不了的是？',
    options: [
      { label: '冷战、不回消息、人间蒸发——这直接把我逼死', value: 1 },
      { label: '翻旧账，把以前的事全部翻出来算', value: 2 },
      { label: '口不择言，说完很快就好了，但伤口留着', value: 3 },
      { label: '有话不说，明明不开心还说"没事"', value: 4 },
    ],
  },
];

export const specialQuestions: Question[] = [
  {
    id: 'manual_gate',
    text: '打开这个测试的时候，脑子里有没有一个具体的人？',
    options: [
      { label: '没有，就是测着玩', value: 1 },
      { label: '有，是现任或正在追的人', value: 2 },
      { label: '有，说不清是谁', value: 3 },
      { label: '有，是已经不在了的人——而且我刚才还看过TA的朋友圈', value: 4 },
    ],
    special: true,
  },
];
