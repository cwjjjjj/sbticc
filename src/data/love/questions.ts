import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1: 恋爱驱动 H(心动) vs B(条件) =====
  {
    id: 'lq1', dim: 'D1', text: '男朋友月薪5000说要给你最好的，你信吗？',
    options: [
      { label: '信啊，心意比钱重要', value: 1 },
      { label: '感动但也担心现实问题', value: 2 },
      { label: '先感动三秒，然后打开房价网站', value: 3 },
      { label: '别画饼了，先把五险一金交齐', value: 4 },
    ],
  },
  {
    id: 'lq2', dim: 'D1', text: '相亲对象各方面条件完美，但你见面毫无感觉。第二次还去吗？',
    options: [
      { label: '不去了，没感觉就是没感觉', value: 1 },
      { label: '再见一次，也许是自己没放开', value: 2 },
      { label: '去啊，感觉可以培养，条件不能', value: 3 },
      { label: '不但去，还要加快推进——这种条件错过就没了', value: 4 },
    ],
  },
  {
    id: 'lq3', dim: 'D1', text: '让你选：A是穷但让你心动到失眠的人，B是有钱但你只觉得"还行"。',
    options: [
      { label: '选A，没有心动的人生有什么意义', value: 1 },
      { label: '倾向A，但希望TA有上进心', value: 2 },
      { label: '倾向B，心动会消退，钱不会', value: 3 },
      { label: '选B，醒醒吧穷怎么心动', value: 4 },
    ],
  },
  {
    id: 'lq4', dim: 'D1', text: '结婚前你会查对方征信吗？', multiSelect: true,
    options: [
      { label: '不会，查这个太伤感情了', value: 1 },
      { label: '会稍微打听一下但不会正式查', value: 2 },
      { label: '会查，这是对自己负责', value: 3 },
      { label: '不但查征信，还要查房产、车辆、前任数量', value: 4 },
    ],
  },
  {
    id: 'lq5', dim: 'D1', text: '你回忆一下，历史上让你真正心动的人，有什么共同点？', multiSelect: true,
    options: [
      { label: '说不上来，就是某个瞬间被击中了', value: 1 },
      { label: '长得好看或者气质独特', value: 2 },
      { label: '聪明、有能力、事业心强', value: 3 },
      { label: '家庭背景好、经济条件优', value: 4 },
    ],
  },

  // ===== D2: 恋爱姿态 A(主动) vs W(被动) =====
  {
    id: 'lq6', dim: 'D2', text: '你在酒吧/派对上看到一个让你心跳加速的人，你会？',
    options: [
      { label: '直接走过去，"我觉得你很好看，能认识一下吗"', value: 1 },
      { label: '想办法制造偶遇，比如去旁边点酒', value: 2 },
      { label: '频繁往那边看，等TA注意到我', value: 3 },
      { label: '发个朋友圈定位，缘分到了TA会来找我', value: 4 },
    ],
  },
  {
    id: 'lq7', dim: 'D2', text: '暧昧期你发消息对方两小时没回，你会？',
    options: [
      { label: '再发一条，"你是不是在忙？没事我就是想你了"', value: 1 },
      { label: '等一等，但心里已经开始编剧本了', value: 2 },
      { label: '放下手机，TA想回自然会回', value: 3 },
      { label: '删掉对话框假装无事发生', value: 4 },
    ],
  },
  {
    id: 'lq8', dim: 'D2', text: '你觉得"追人"这件事，谁应该更主动？', multiSelect: true,
    options: [
      { label: '喜欢就冲，不分男女', value: 1 },
      { label: '谁先动心谁先表白', value: 2 },
      { label: '男生应该主动，这是基本诚意', value: 3 },
      { label: '我从不主动，被追才有安全感', value: 4 },
    ],
  },
  {
    id: 'lq9', dim: 'D2', text: '表白被拒绝了，你的下一步是？',
    options: [
      { label: '没关系，再试一次，真心总会被看到', value: 1 },
      { label: '退一步做朋友，找机会再进攻', value: 2 },
      { label: '尊重对方的选择，但心里难过很久', value: 3 },
      { label: '立刻抽离，被拒绝一次就够了', value: 4 },
    ],
  },
  {
    id: 'lq10', dim: 'D2', text: '如果你和对方同时对彼此有好感，你希望？',
    options: [
      { label: '我来告白！我要掌握主动权', value: 1 },
      { label: '谁先说都行，重要的是在一起', value: 2 },
      { label: '希望对方先说，我再回应', value: 3 },
      { label: '谁也别说破，暧昧才是最美的', value: 4 },
    ],
  },

  // ===== D3: 亲密边界 M(融合) vs D(独立) =====
  {
    id: 'lq11', dim: 'D3', text: '你的伴侣半夜收到异性消息说"在吗"，你觉得？',
    options: [
      { label: '我要看聊天记录，现在就看', value: 1 },
      { label: '有点不舒服，但先问问怎么回事', value: 2 },
      { label: '可能就是普通朋友吧，不至于', value: 3 },
      { label: '人家的社交你管不着', value: 4 },
    ],
  },
  {
    id: 'lq12', dim: 'D3', text: '关于情侣之间的手机密码，你的态度是？', multiSelect: true,
    options: [
      { label: '必须互相知道，不给看就是有鬼', value: 1 },
      { label: '知道密码但不会主动翻', value: 2 },
      { label: '各自保留，信任不需要密码来证明', value: 3 },
      { label: '提这个要求的人本身就有问题', value: 4 },
    ],
  },
  {
    id: 'lq13', dim: 'D3', text: '你理想中和伴侣的日常相处模式是？',
    options: [
      { label: '恨不得24小时黏在一起，上厕所都要报备', value: 1 },
      { label: '每天要见面/视频，保持高频联系', value: 2 },
      { label: '各有各的生活，约了再见', value: 3 },
      { label: '一周见一两次刚刚好，多了窒息', value: 4 },
    ],
  },
  {
    id: 'lq14', dim: 'D3', text: '伴侣说"我需要一个人待一会"，你的反应是？',
    options: [
      { label: '是不是我做错什么了？？？', value: 1 },
      { label: '好吧，但你要告诉我大概多久', value: 2 },
      { label: '没问题，我也正好有自己的事', value: 3 },
      { label: '太好了，终于可以清净一下', value: 4 },
    ],
  },
  {
    id: 'lq15', dim: 'D3', text: '你能接受伴侣有一个关系很好的异性闺蜜/兄弟吗？', multiSelect: true,
    options: [
      { label: '绝对不行，异性之间没有纯友谊', value: 1 },
      { label: '可以有但要让我认识，不能私下频繁联系', value: 2 },
      { label: '可以，我相信TA的分寸', value: 3 },
      { label: '当然可以，我自己也有异性朋友', value: 4 },
    ],
  },

  // ===== D4: 爱情信念 R(浪漫) vs P(现实) =====
  {
    id: 'lq16', dim: 'D4', text: '你相信一见钟情吗？',
    options: [
      { label: '绝对相信，我就经历过', value: 1 },
      { label: '相信，但觉得很少见', value: 2 },
      { label: '那叫见色起意不叫一见钟情', value: 3 },
      { label: '不信，所有的一见钟情都是荷尔蒙', value: 4 },
    ],
  },
  {
    id: 'lq17', dim: 'D4', text: '恋爱三年激情消退了，你怎么看？',
    options: [
      { label: '说明不是真爱，真爱永远心动', value: 1 },
      { label: '有点失落但能接受，想办法找回来', value: 2 },
      { label: '正常，感情本来就从激情变亲情', value: 3 },
      { label: '早就预料到了，所以要提前做好物质基础', value: 4 },
    ],
  },
  {
    id: 'lq18', dim: 'D4', text: '"嫁给爱情"和"嫁给生活"，你选哪个？',
    options: [
      { label: '当然嫁给爱情，没有爱的婚姻是坟墓', value: 1 },
      { label: '希望两者兼得，但爱情优先', value: 2 },
      { label: '希望两者兼得，但生活质量优先', value: 3 },
      { label: '嫁给生活，爱情不能当饭吃', value: 4 },
    ],
  },
  {
    id: 'lq19', dim: 'D4', text: '伴侣在你生日送了一束999朵玫瑰但忘了你说过想要的那本书，你？', multiSelect: true,
    options: [
      { label: '好浪漫！999朵玫瑰诶！！', value: 1 },
      { label: '感动，但会委婉提醒那本书的事', value: 2 },
      { label: '花会枯但书不会，TA根本没听进去我说的话', value: 3 },
      { label: '999朵玫瑰多少钱？这钱还不如交房租', value: 4 },
    ],
  },
  {
    id: 'lq20', dim: 'D4', text: '你对婚前协议的态度是？',
    options: [
      { label: '签这个太伤感情了，真爱不需要协议', value: 1 },
      { label: '能理解但自己不太想签', value: 2 },
      { label: '应该签，保护双方', value: 3 },
      { label: '必须签，而且要请律师逐条审核', value: 4 },
    ],
  },

  // ===== D5: 忠诚观 L(绝对忠诚) vs F(灵活) =====
  {
    id: 'lq21', dim: 'D5', text: '你的伴侣在抖音给美女/帅哥点赞，你的反应？',
    options: [
      { label: '点赞就是精神出轨，不可接受', value: 1 },
      { label: '心里不舒服，要跟TA谈一谈', value: 2 },
      { label: '看看就看看，点赞而已', value: 3 },
      { label: '我自己也点赞啊，人之常情', value: 4 },
    ],
  },
  {
    id: 'lq22', dim: 'D5', text: '你能接受伴侣和前任保持联系吗？',
    options: [
      { label: '绝对不行，分了就断干净', value: 1 },
      { label: '不太能接受但不会明说', value: 2 },
      { label: '只要是正常社交可以接受', value: 3 },
      { label: '前任又怎样，TA选的是我', value: 4 },
    ],
  },
  {
    id: 'lq23', dim: 'D5', text: '你发现伴侣跟别人聊天暧昧但没有实质出轨，你怎么处理？', multiSelect: true,
    options: [
      { label: '暧昧就是出轨，直接摊牌', value: 1 },
      { label: '先收集证据，等想好了再对质', value: 2 },
      { label: '有点介意但先观察，也许是自己想多了', value: 3 },
      { label: '只要没实质出轨就不算事', value: 4 },
      { label: '去跟别人暧昧回来——公平竞争', value: 4 },
    ],
  },
  {
    id: 'lq24', dim: 'D5', text: '关于"灵魂伴侣只能有一个"这件事，你的看法？',
    options: [
      { label: '当然，专一是底线', value: 1 },
      { label: '理想中是一个，但现实很难说', value: 2 },
      { label: '人这一生可能会有不同阶段的灵魂伴侣', value: 3 },
      { label: '灵魂伴侣本来就是伪命题', value: 4 },
    ],
  },
  {
    id: 'lq25', dim: 'D5', text: '如果有一个比你的现任各方面更好的人追你，你会动摇吗？',
    options: [
      { label: '不会，选了就是选了', value: 1 },
      { label: '心里会有一瞬间的波动，但不会行动', value: 2 },
      { label: '会认真考虑——感情也讲性价比', value: 3 },
      { label: '人往高处走，不动摇才傻', value: 4 },
    ],
  },

  // ===== D6: 冲突风格 C(正面刚) vs V(冷处理) =====
  {
    id: 'lq26', dim: 'D6', text: '你和伴侣因为家务分配吵起来了，你的风格是？',
    options: [
      { label: '直接开吵，有什么说什么，说完就好了', value: 1 },
      { label: '据理力争但控制音量', value: 2 },
      { label: '说两句觉得没意思就不想吵了', value: 3 },
      { label: '不说话，冷处理，等对方先来找我', value: 4 },
    ],
  },
  {
    id: 'lq27', dim: 'D6', text: '吵完架之后，你一般是怎么和好的？', multiSelect: true,
    options: [
      { label: '我先道歉/认错，不管是不是我的错', value: 1 },
      { label: '等气消了主动找对方聊', value: 2 },
      { label: '各自冷静一两天自然就好了', value: 3 },
      { label: '等对方来找我，我不会主动', value: 4 },
    ],
  },
  {
    id: 'lq28', dim: 'D6', text: '你的伴侣做了一件让你很不爽的事，你会？',
    options: [
      { label: '当场说出来——不舒服就是不舒服', value: 1 },
      { label: '找个合适的时机认真谈', value: 2 },
      { label: '自己消化一下，不是什么大事', value: 3 },
      { label: '不说，但记在心里了', value: 4 },
    ],
  },
  {
    id: 'lq29', dim: 'D6', text: '你们正在冷战，对方发来一个台阶（比如分享了个搞笑视频），你？',
    options: [
      { label: '立刻接住！问题之后再说，先和好', value: 1 },
      { label: '回复了但还是要把之前的事说清楚', value: 2 },
      { label: '看了但没回复，还没消气呢', value: 3 },
      { label: '已读不回，什么时候道歉什么时候算', value: 4 },
    ],
  },
  {
    id: 'lq30', dim: 'D6', text: '你觉得感情中更伤人的是？', multiSelect: true,
    options: [
      { label: '把话说得很重——吵架时口不择言', value: 1 },
      { label: '翻旧账——吵着吵着把以前的事都拉出来', value: 2 },
      { label: '冷暴力——就是不说话不理你', value: 3 },
      { label: '消失——不吵不闹直接人间蒸发', value: 4 },
    ],
  },
];

export const specialQuestions: Question[] = [
  {
    id: 'ex_gate',
    text: '深夜emo的时候，你有没有偷偷翻过前任的朋友圈？',
    options: [
      { label: '早删了拉黑了，看不到', value: 1 },
      { label: '偶尔手滑点进去但马上退出来', value: 2 },
      { label: '翻过……不止一次', value: 3 },
      { label: '不但翻，还截图保存了一些照片', value: 4 },
    ],
    special: true,
  },
];

export const EX_TRIGGER_QUESTION_ID = 'ex_gate';
