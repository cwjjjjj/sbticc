import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1: 世界观 (O乐天 vs R现实) =====
  // low(1-2) = Optimist(A), high(3-4) = Realist(B)
  {
    id: 'vq1', dim: 'D1',
    text: '35岁被裁，你觉得是谁的问题？',
    options: [
      { label: '是公司的损失，我肯定能找到更好的', value: 1 },
      { label: '大环境不好，谁都可能摊上', value: 2 },
      { label: '说到底还是自己没有不可替代性', value: 3 },
      { label: '这就是资本主义的本质，打工人都是耗材', value: 4 },
    ],
  },
  {
    id: 'vq2', dim: 'D1',
    text: '你对"努力就会有回报"这句话怎么看？',
    options: [
      { label: '信。方向对了，努力一定有意义', value: 1 },
      { label: '大概率有用，但也要看运气', value: 2 },
      { label: '努力只是入场券，结果看出身和资源', value: 3 },
      { label: '纯扯淡。这是既得利益者编出来安慰穷人的', value: 4 },
    ],
  },
  {
    id: 'vq3', dim: 'D1',
    text: '刷到同龄人晒买房/结婚/升职，你的第一反应？',
    options: [
      { label: '真好，替他们开心，自己迟早也会有', value: 1 },
      { label: '酸了一秒，但各有各的活法', value: 2 },
      { label: '焦虑，感觉被同龄人越甩越远', value: 3 },
      { label: '呵呵，不知道背后欠了多少贷款', value: 4 },
    ],
  },
  {
    id: 'vq4', dim: 'D1',
    text: '你觉得下一代人的日子会比我们好吗？',
    multiSelect: true,
    options: [
      { label: '会啊，技术进步社会总在变好的', value: 1 },
      { label: '至少某些方面会更好吧', value: 2 },
      { label: '不好说，可能更卷更焦虑', value: 3 },
      { label: '铁定更惨，所以我选择不生', value: 4 },
    ],
  },
  {
    id: 'vq5', dim: 'D1',
    text: '朋友创业失败欠了一屁股债来找你倾诉，你心里真实想法是？',
    options: [
      { label: '没事，重来就是了，失败是成功之母', value: 1 },
      { label: '安慰他，但心里觉得创业确实风险大', value: 2 },
      { label: '早说了不要创业吧，现在知道了', value: 3 },
      { label: '借钱别找我，我自己都顾不上', value: 4 },
    ],
  },

  // ===== D2: 行动力 (D行动 vs T思考) =====
  // low(1-2) = Doer(A), high(3-4) = Thinker(B)
  {
    id: 'vq6', dim: 'D2',
    text: '你有了一个创业想法，接下来你会？',
    options: [
      { label: '直接干，边做边调整', value: 1 },
      { label: '找几个朋友聊聊，可行就开始', value: 2 },
      { label: '先做市场调研、写商业计划书', value: 3 },
      { label: '想了三年了，还在评估可行性', value: 4 },
    ],
  },
  {
    id: 'vq7', dim: 'D2',
    text: '在北上广月薪2万 vs 回老家月薪8000，你选？',
    options: [
      { label: '当然留大城市，不试怎么知道极限在哪', value: 1 },
      { label: '先待几年看看，不行再回', value: 2 },
      { label: '算清楚两边的生活成本再决定', value: 3 },
      { label: '回老家，性价比吊打大城市', value: 4 },
    ],
  },
  {
    id: 'vq8', dim: 'D2',
    text: '面前有个50%赚10万、50%亏5万的机会，你？',
    multiSelect: true,
    options: [
      { label: '冲！期望值是正的', value: 1 },
      { label: '小赌一把，控制仓位', value: 2 },
      { label: '算了，亏5万我接受不了', value: 3 },
      { label: '我从不赌，确定性才是王道', value: 4 },
    ],
  },
  {
    id: 'vq9', dim: 'D2',
    text: '领导让你负责一个你完全没经验的项目，你？',
    options: [
      { label: '接了！不会就学，干中学最快', value: 1 },
      { label: '先答应下来，私下赶紧补课', value: 2 },
      { label: '想清楚自己能不能搞定再答应', value: 3 },
      { label: '坦白说不行，接了搞砸更丢人', value: 4 },
    ],
  },
  {
    id: 'vq10', dim: 'D2',
    text: '你对"裸辞"这件事怎么看？',
    options: [
      { label: '人生苦短，干不开心就走', value: 1 },
      { label: '有半年存款的话可以考虑', value: 2 },
      { label: '必须找好下家才能辞', value: 3 },
      { label: '不可能裸辞，除非家里有矿', value: 4 },
    ],
  },

  // ===== D3: 社交倾向 (E外放 vs I内收) =====
  // low(1-2) = Extro(A), high(3-4) = Intro(B)
  {
    id: 'vq11', dim: 'D3',
    text: '父母催婚，你怎么看？',
    options: [
      { label: '理解，多聊聊就好，他们也是关心', value: 1 },
      { label: '烦但能忍，过年应付一下就行', value: 2 },
      { label: '直接摊牌，我的人生我做主', value: 3 },
      { label: '已读不回，这种对话没有意义', value: 4 },
    ],
  },
  {
    id: 'vq12', dim: 'D3',
    text: '公司团建你的态度是？',
    multiSelect: true,
    options: [
      { label: '太好了！终于不用加班了', value: 1 },
      { label: '去可以，但别超过半天', value: 2 },
      { label: '能不去就不去', value: 3 },
      { label: '团建应该算加班，发加班费我就去', value: 4 },
    ],
  },
  {
    id: 'vq13', dim: 'D3',
    text: '朋友借钱不还，你？',
    options: [
      { label: '直接开口要，朋友归朋友钱归钱', value: 1 },
      { label: '旁敲侧击暗示一下', value: 2 },
      { label: '算了，就当花钱买教训', value: 3 },
      { label: '默默拉黑，从此不来往', value: 4 },
    ],
  },
  {
    id: 'vq14', dim: 'D3',
    text: '遇到不开心的事你会？',
    options: [
      { label: '马上找朋友倾诉，说出来就好了', value: 1 },
      { label: '挑一两个信得过的人聊聊', value: 2 },
      { label: '自己消化，不想给别人添麻烦', value: 3 },
      { label: '谁也别来烦我，独处才能恢复', value: 4 },
    ],
  },
  {
    id: 'vq15', dim: 'D3',
    text: '微信好友500+，真正能聊天的有几个？',
    multiSelect: true,
    options: [
      { label: '挺多的，我跟谁都能聊', value: 1 },
      { label: '十来个吧，够用了', value: 2 },
      { label: '两三个，多了维护不过来', value: 3 },
      { label: '零个。有事说事，没事别找我', value: 4 },
    ],
  },

  // ===== D4: 人生追求 (F自由 vs S安稳) =====
  // low(1-2) = Freedom(A), high(3-4) = Stability(B)
  {
    id: 'vq16', dim: 'D4',
    text: '你觉得结婚是必须的吗？',
    options: [
      { label: '不是。一个人也能过得很好', value: 1 },
      { label: '遇到对的人才结，不为结而结', value: 2 },
      { label: '到了年龄还是该结，这是人生大事', value: 3 },
      { label: '必须的。没家庭的人生不完整', value: 4 },
    ],
  },
  {
    id: 'vq17', dim: 'D4',
    text: '买房 vs 租房，你的立场？',
    multiSelect: true,
    options: [
      { label: '一辈子租房也没问题，自由最重要', value: 1 },
      { label: '有条件买，但不会为了买房牺牲生活', value: 2 },
      { label: '必须买，租房永远是帮房东还贷', value: 3 },
      { label: '有房才有家，这是中国人的根', value: 4 },
    ],
  },
  {
    id: 'vq18', dim: 'D4',
    text: '考公 vs 创业，你更倾向？',
    options: [
      { label: '创业。打死不去体制内，一眼望到头的人生是坟墓', value: 1 },
      { label: '看情况，有好机会可以闯一闯', value: 2 },
      { label: '体制内真香，稳定才是真正的奢侈品', value: 3 },
      { label: '考公上岸是这个时代最正确的选择', value: 4 },
    ],
  },
  {
    id: 'vq19', dim: 'D4',
    text: '经济条件允许的话你会gap year吗？',
    options: [
      { label: '必须的！人生不只有工作', value: 1 },
      { label: '挺想的，但怕回来跟不上节奏', value: 2 },
      { label: '不会，空白期让简历很难看', value: 3 },
      { label: '疯了吧，有这钱不如拿去投资', value: 4 },
    ],
  },
  {
    id: 'vq20', dim: 'D4',
    text: '你存钱的主要动力是什么？',
    options: [
      { label: '有底气随时炒掉老板', value: 1 },
      { label: '有点存款心里踏实，但也不能太抠', value: 2 },
      { label: '安全感，必须有至少半年的应急资金', value: 3 },
      { label: '不存钱的人没有未来', value: 4 },
    ],
  },

  // ===== D5: 消费观 (X享乐 vs J节俭) =====
  // low(1-2) = eXperience(A), high(3-4) = frugaL(B)
  {
    id: 'vq21', dim: 'D5',
    text: '月薪一万，你愿意花多少在"非必需品"上（奶茶/演出/旅行/潮牌）？',
    options: [
      { label: '三四千，人活着不就图个开心吗', value: 1 },
      { label: '一两千，偶尔犒劳一下自己', value: 2 },
      { label: '几百块意思意思就行', value: 3 },
      { label: '零。所有钱都应该拿去存起来或投资', value: 4 },
    ],
  },
  {
    id: 'vq22', dim: 'D5',
    text: '有人说"该花的钱一定要花"，你同意吗？',
    multiSelect: true,
    options: [
      { label: '太同意了，人生就是一场体验', value: 1 },
      { label: '同意，但对"该花"的定义要清楚', value: 2 },
      { label: '不太同意，大部分"该花"都是消费主义陷阱', value: 3 },
      { label: '钱存着才是你的，花了就是别人的', value: 4 },
    ],
  },
  {
    id: 'vq23', dim: 'D5',
    text: '朋友约你去人均500的餐厅吃饭，你的反应？',
    options: [
      { label: '冲！好吃的东西值得', value: 1 },
      { label: '偶尔一次可以，当犒劳自己', value: 2 },
      { label: '太贵了，换个实惠的地方吧', value: 3 },
      { label: '500块够我吃一周了，疯了吧', value: 4 },
    ],
  },
  {
    id: 'vq24', dim: 'D5',
    text: '双十一/大促你的状态是？',
    multiSelect: true,
    options: [
      { label: '疯狂下单，一年就等这一天', value: 1 },
      { label: '买几样真正需要的东西', value: 2 },
      { label: '看看就好，大部分都是套路', value: 3 },
      { label: '不参与，平时什么价现在什么价', value: 4 },
    ],
  },
  {
    id: 'vq25', dim: 'D5',
    text: '你对"提前消费"（信用卡/花呗/分期）怎么看？',
    options: [
      { label: '合理利用，年轻人不应该被钱限制想象力', value: 1 },
      { label: '小额可以，大额还是算了', value: 2 },
      { label: '能不用就不用，欠钱的感觉很不好', value: 3 },
      { label: '绝不负债，这是金融机构收割年轻人的镰刀', value: 4 },
    ],
  },

  // ===== D6: 生存态度 (A积极卷 vs N佛系) =====
  // low(1-2) = Active(A), high(3-4) = Neutral(B)
  {
    id: 'vq26', dim: 'D6',
    text: '你怎么看"内卷"？',
    options: [
      { label: '与其抱怨不如加入，抱怨的都是卷不动的', value: 1 },
      { label: '适度竞争有好处，但别太过', value: 2 },
      { label: '很反感但没办法，大环境逼的', value: 3 },
      { label: '坚决不卷，卷赢了又怎样', value: 4 },
    ],
  },
  {
    id: 'vq27', dim: 'D6',
    text: '关于"阶层固化"你怎么看？',
    multiSelect: true,
    options: [
      { label: '不信，机会永远留给有准备的人', value: 1 },
      { label: '有这个趋势，但个人努力依然重要', value: 2 },
      { label: '基本固化了，普通人机会越来越少', value: 3 },
      { label: '早就固化了，认命吧', value: 4 },
    ],
  },
  {
    id: 'vq28', dim: 'D6',
    text: '关于生孩子你的真实想法是？',
    options: [
      { label: '想生，培养下一代是人生最有意义的事', value: 1 },
      { label: '条件好了可以考虑，但不急', value: 2 },
      { label: '不太想，养自己都够累了', value: 3 },
      { label: '坚决不生，不想让孩子来这个世界受苦', value: 4 },
    ],
  },
  {
    id: 'vq29', dim: 'D6',
    text: '你的养老计划是？',
    options: [
      { label: '现在就开始布局，越早越好', value: 1 },
      { label: '有在想但还没具体行动', value: 2 },
      { label: '到时候再说吧，想那么远没用', value: 3 },
      { label: '能活到退休再说吧，先活过今天', value: 4 },
    ],
  },
  {
    id: 'vq30', dim: 'D6',
    text: '如果明天世界末日，你今天会做什么？',
    options: [
      { label: '把想做的事全做一遍，死也死得精彩', value: 1 },
      { label: '跟最重要的人待在一起', value: 2 },
      { label: '跟平时一样吧，反正也改变不了什么', value: 3 },
      { label: '终于可以不用上班了，反而松了口气', value: 4 },
    ],
  },
];

export const specialQuestions: Question[] = [
  {
    id: 'mlc_gate',
    text: '最近有没有突然觉得：这辈子好像就这样了？',
    options: [
      { label: '没有，好戏还在后头呢', value: 1 },
      { label: '偶尔闪过这个念头，但很快就过去了', value: 2 },
      { label: '经常这么想，尤其是半夜睡不着的时候', value: 3 },
      { label: '每天都这么觉得，而且越来越确定', value: 4 },
    ],
    special: true,
  },
];

export const MLC_TRIGGER_QUESTION_ID = 'mlc_gate';
