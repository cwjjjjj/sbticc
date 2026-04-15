import type { Question } from '../testConfig';

export const questions: Question[] = [
  // =============================================
  // D1 — 工作驱动: P(热爱Passion/A=低分) vs G(利益Gain/B=高分)
  // =============================================
  {
    id: 'wq1', dim: 'D1',
    text: '如果中了500万彩票，你第二天会？',
    options: [
      { label: '继续上班，我是真喜欢现在做的事', value: 1 },
      { label: '请个长假想想，但大概还会找点事做', value: 2 },
      { label: '辞职去做自己一直想做的事，不一定赚钱', value: 2 },
      { label: '当天辞职，再也不想看到工位', value: 4 },
    ],
  },
  {
    id: 'wq2', dim: 'D1',
    text: '年薪翻倍但要去你讨厌的城市，去不去？',
    options: [
      { label: '不去，我现在做的事比钱重要', value: 1 },
      { label: '看看具体什么岗位，有成长空间可以考虑', value: 2 },
      { label: '去，忍两年攒够钱再跳回来', value: 3 },
      { label: '双倍薪资还犹豫什么？马上签合同', value: 4 },
    ],
  },
  {
    id: 'wq3', dim: 'D1',
    text: '跳槽的时候你最看重什么？（可多选）',
    multiSelect: true,
    options: [
      { label: '做的事有没有意义，能不能学到东西', value: 1 },
      { label: '团队氛围好不好，leader靠不靠谱', value: 2 },
      { label: '涨薪幅度，低于30%免谈', value: 3 },
      { label: '股票期权有没有，套现预期怎么样', value: 4 },
    ],
  },
  {
    id: 'wq4', dim: 'D1',
    text: '周日晚上你失眠的原因是什么？',
    options: [
      { label: '明天有个项目方案特别想推进', value: 1 },
      { label: '想想工作想想存款，心情复杂', value: 2 },
      { label: '算了一下花呗账单，焦虑到天亮', value: 3 },
      { label: '想到明天要上班就想死', value: 4 },
    ],
  },
  {
    id: 'wq5', dim: 'D1',
    text: '你觉得"有钱但做自己讨厌的工作"和"没钱但做自己热爱的事"，哪个更可怕？',
    options: [
      { label: '有钱但做讨厌的事更可怕，人生太短了', value: 1 },
      { label: '两个都挺可怕的，最好又有钱又喜欢', value: 2 },
      { label: '没钱更可怕，贫穷限制的不止是想象力', value: 3 },
      { label: '这有什么好比的？没钱就是地狱', value: 4 },
    ],
  },

  // =============================================
  // D2 — 协作模式: S(独狼Solo/A=低分) vs T(团队Team/B=高分)
  // =============================================
  {
    id: 'wq6', dim: 'D2',
    text: '领导说"这个项目组队做"，你第一反应是？',
    options: [
      { label: '内心OS：又来了，不如我一个人搞完', value: 1 },
      { label: '行吧，看看队友是谁先', value: 2 },
      { label: '挺好的，有人分摊工作量', value: 3 },
      { label: '太好了！一个人干活多孤独啊', value: 4 },
    ],
  },
  {
    id: 'wq7', dim: 'D2',
    text: '同事发起了一个跨部门头脑风暴会议，你会？（可多选）',
    multiSelect: true,
    options: [
      { label: '找借口不去，这种会99%是浪费时间', value: 1 },
      { label: '去了但全程沉默，会后发邮件说我的想法', value: 1 },
      { label: '去看看情况，有干货就参与', value: 3 },
      { label: '积极发言，这种碰撞最出灵感了', value: 4 },
    ],
  },
  {
    id: 'wq8', dim: 'D2',
    text: '你理想的办公环境是？',
    options: [
      { label: '远程办公，最好连视频会议都别开', value: 1 },
      { label: '独立隔间，需要交流再找人', value: 2 },
      { label: '开放工位，随时能搭话但也有安静时间', value: 3 },
      { label: '咖啡吧式办公，随时能找人头脑风暴', value: 4 },
    ],
  },
  {
    id: 'wq9', dim: 'D2',
    text: '团建活动你通常什么态度？',
    options: [
      { label: '能逃就逃，逃不了就坐角落玩手机', value: 1 },
      { label: '去但不投入，当做完成社交任务', value: 2 },
      { label: '看活动内容，有趣的会参加', value: 3 },
      { label: '积极组织！团队感情就是靠这种活动建立的', value: 4 },
    ],
  },
  {
    id: 'wq10', dim: 'D2',
    text: '一个复杂项目你会怎么推进？',
    options: [
      { label: '自己拆解任务一个人扛，快且可控', value: 1 },
      { label: '核心部分自己做，边缘的分出去', value: 2 },
      { label: '拉个小团队分工，定期同步', value: 3 },
      { label: '全员参与，充分讨论每个环节', value: 4 },
    ],
  },

  // =============================================
  // D3 — 决策风格: R(速决Rush/A=低分) vs C(谨慎Careful/B=高分)
  // =============================================
  {
    id: 'wq11', dim: 'D3',
    text: '老板让你明天给个方案，你会？',
    options: [
      { label: '今晚就给，先干了再说', value: 1 },
      { label: '今晚出初稿，明天早上打磨一下', value: 2 },
      { label: '跟老板说明天下午给，我想做得更完善', value: 3 },
      { label: '先做竞品分析和数据调研，申请多要两天', value: 4 },
    ],
  },
  {
    id: 'wq12', dim: 'D3',
    text: '开会讨论了30分钟还没结论，你会？（可多选）',
    multiSelect: true,
    options: [
      { label: '直接拍板："就这么干，有问题再调"', value: 1 },
      { label: '提出折中方案，先推进再迭代', value: 2 },
      { label: '建议各方回去再想想，下次会议继续', value: 3 },
      { label: '要求补充数据支撑，不能拍脑袋决定', value: 4 },
    ],
  },
  {
    id: 'wq13', dim: 'D3',
    text: '面对一个有风险但回报可能很大的机会，你会？',
    options: [
      { label: '冲了！不冲永远不知道行不行', value: 1 },
      { label: '快速评估核心风险，可控就上', value: 2 },
      { label: '详细做一轮风险分析再决定', value: 3 },
      { label: '风险太大就算了，稳妥比什么都重要', value: 4 },
    ],
  },
  {
    id: 'wq14', dim: 'D3',
    text: '你发了一封重要邮件后发现有个错别字，你会？',
    options: [
      { label: '算了，又不影响理解', value: 1 },
      { label: '看发给谁的，发给老板就补更正', value: 2 },
      { label: '立刻补发更正邮件', value: 3 },
      { label: '更正邮件+口头道歉+反思怎么避免下次', value: 4 },
    ],
  },
  {
    id: 'wq15', dim: 'D3',
    text: '接到一个全新领域的任务，你的第一步是？',
    options: [
      { label: '先动手试，边做边学最快', value: 1 },
      { label: '花半天了解基本情况然后开干', value: 2 },
      { label: '系统学习相关知识，列出详细计划再动手', value: 3 },
      { label: '找这个领域的专家请教，确保方向对再开始', value: 4 },
    ],
  },

  // =============================================
  // D4 — 职场信念: H(内卷Hustle/A=低分) vs B(平衡Balance/B=高分)
  // =============================================
  {
    id: 'wq16', dim: 'D4',
    text: '领导在群里@你让你周末加班，你？',
    options: [
      { label: '秒回"收到"，周末本来也没什么事', value: 1 },
      { label: '回复"好的"，心里骂但还是去', value: 2 },
      { label: '问清楚是不是真的很紧急，不紧急就委婉拒绝', value: 3 },
      { label: '假装没看到，周一再说', value: 4 },
    ],
  },
  {
    id: 'wq17', dim: 'D4',
    text: '同事天天加班到十点你准点下班，你什么感受？（可多选）',
    multiSelect: true,
    options: [
      { label: '焦虑，我是不是也该加班？', value: 1 },
      { label: '有点心虚但还是走了', value: 2 },
      { label: '心安理得，我效率高活都干完了', value: 3 },
      { label: '同情TA，不是我不卷是TA被PUA了', value: 4 },
    ],
  },
  {
    id: 'wq18', dim: 'D4',
    text: '公司搞了个"奋斗者协议"——自愿放弃年假和加班费换优先晋升，你签不签？',
    options: [
      { label: '签！晋升机会比年假重要多了', value: 1 },
      { label: '纠结，先看看别人签不签', value: 2 },
      { label: '不签，休息是我的权利，不拿来交易', value: 3 },
      { label: '不签还要举报，这玩意合法吗？', value: 4 },
    ],
  },
  {
    id: 'wq19', dim: 'D4',
    text: '关于"35岁危机"，你的态度是？',
    options: [
      { label: '所以我现在就得拼命积累技能和人脉', value: 1 },
      { label: '有点焦虑但不至于为此牺牲生活质量', value: 2 },
      { label: '到时候再说，焦虑解决不了任何问题', value: 3 },
      { label: '这就是资本制造的焦虑，我拒绝被收割', value: 4 },
    ],
  },
  {
    id: 'wq20', dim: 'D4',
    text: '你上班摸鱼吗？',
    options: [
      { label: '从不，每分钟都要产出价值', value: 1 },
      { label: '偶尔，但会心虚', value: 2 },
      { label: '每天固定摸鱼时间，这是精神保健', value: 3 },
      { label: '工作才是我摸鱼的间隙', value: 4 },
    ],
  },

  // =============================================
  // D5 — 权力欲: U(向上爬Up/A=低分) vs F(无所谓Flat/B=高分)
  // =============================================
  {
    id: 'wq21', dim: 'D5',
    text: '公司有个管理岗空缺，你的第一反应是？（可多选）',
    multiSelect: true,
    options: [
      { label: '立刻准备竞聘材料', value: 1 },
      { label: '私下找领导表达意愿', value: 1 },
      { label: '看看要求，符合就试试', value: 3 },
      { label: '管人？谢谢，我光管自己就够累了', value: 4 },
    ],
  },
  {
    id: 'wq22', dim: 'D5',
    text: '同事把你的方案署了他的名字，你怎么办？',
    options: [
      { label: '直接找领导把功劳要回来，该是我的就是我的', value: 1 },
      { label: '找那个同事私下谈，以后别这样', value: 2 },
      { label: '算了，知道的人自然知道是谁做的', value: 3 },
      { label: '无所谓，活是干完了就行', value: 4 },
    ],
  },
  {
    id: 'wq23', dim: 'D5',
    text: '领导让你在会上汇报工作成果，你会？',
    options: [
      { label: '精心准备，这是展示自己的黄金机会', value: 1 },
      { label: '准备充分一点，展示能力也是职业素养', value: 2 },
      { label: '简单说说就行，不喜欢出风头', value: 3 },
      { label: '能推就推，讨厌被人盯着看', value: 4 },
    ],
  },
  {
    id: 'wq24', dim: 'D5',
    text: '你对"向上管理"这件事的态度是？（可多选）',
    multiSelect: true,
    options: [
      { label: '必修课，管理好老板才能管理好前途', value: 1 },
      { label: '适度维护关系，但不会刻意讨好', value: 2 },
      { label: '做好自己的事就行，不想花精力在人际上', value: 3 },
      { label: '向上管理就是高级拍马屁，不屑', value: 4 },
    ],
  },
  {
    id: 'wq25', dim: 'D5',
    text: '如果你当了领导，最让你兴奋的是什么？',
    options: [
      { label: '终于能按自己的想法做决定了', value: 1 },
      { label: '带团队做出成绩的成就感', value: 2 },
      { label: '大概就是工资高一点吧', value: 3 },
      { label: '兴奋？光想想那些破事就头疼', value: 4 },
    ],
  },

  // =============================================
  // D6 — 忠诚度: L(忠于公司Loyal/A=低分) vs J(忠于自己Jump/B=高分)
  // =============================================
  {
    id: 'wq26', dim: 'D6',
    text: '你在一家公司待过最长多久？你觉得合理的跳槽频率是？',
    options: [
      { label: '至少三年起步，频繁跳槽是大忌', value: 1 },
      { label: '两年左右，学到东西就可以考虑了', value: 2 },
      { label: '一年，市场在变我也在变', value: 3 },
      { label: '有更好的offer今天就走', value: 4 },
    ],
  },
  {
    id: 'wq27', dim: 'D6',
    text: '公司裁员名单上有你最好的朋友/最亲密的同事，你会告诉TA吗？（可多选）',
    multiSelect: true,
    options: [
      { label: '不会，公司机密不能泄露', value: 1 },
      { label: '暗示TA更新简历，但不说具体的', value: 2 },
      { label: '私下告诉TA，朋友比公司重要', value: 3 },
      { label: '告诉TA还帮TA内推新公司', value: 4 },
    ],
  },
  {
    id: 'wq28', dim: 'D6',
    text: '竞争对手挖你，薪资涨50%但要签竞业协议，你怎么选？',
    options: [
      { label: '不去，对现在的公司有感情', value: 1 },
      { label: '跟现在公司谈谈，看能不能match', value: 2 },
      { label: '研究竞业条款，风险可控就跳', value: 3 },
      { label: '50%算什么？要翻倍我就签', value: 4 },
    ],
  },
  {
    id: 'wq29', dim: 'D6',
    text: '你离职的时候会怎么交接？',
    options: [
      { label: '写详细的交接文档+带新人到完全上手', value: 1 },
      { label: '该交接的交接好，负责到最后一天', value: 2 },
      { label: '把核心的交接了就行，细节让他们自己摸索', value: 3 },
      { label: '法定交接期一天都不多待', value: 4 },
    ],
  },
  {
    id: 'wq30', dim: 'D6',
    text: '你怎么看"公司忠诚度"这件事？（可多选）',
    multiSelect: true,
    options: [
      { label: '忠诚是双向的，公司对我好我就留', value: 1 },
      { label: '一个好平台值得你投入几年', value: 2 },
      { label: '在这个时代谈忠诚太天真了', value: 3 },
      { label: '打工人对公司讲忠诚就像韭菜对镰刀讲感情', value: 4 },
      { label: '忠于自己的成长就够了', value: 3 },
    ],
  },
];

export const specialQuestions: Question[] = [
  {
    id: 'work_gate',
    text: '深夜12点你还在工位上，你的真实感受是？',
    options: [
      { label: '累得想哭，明天必须请假', value: 1 },
      { label: '只要这个月能拿到奖金就行', value: 2 },
      { label: '习惯了，回家也不知道干嘛', value: 3 },
      { label: '兴奋！就喜欢这种全力以赴的状态，一点都不想停下来', value: 4 },
    ],
    special: true,
  },
];

export const WORK_GATE_QUESTION_ID = 'work_gate';
