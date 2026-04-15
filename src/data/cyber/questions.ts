import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1: 内容角色 (C=Creator vs V=Viewer) =====
  { id: 'cq1', dim: 'D1', text: '你发朋友圈之前会P图/修文多久？', options: [
    { label: '不修，拍完直接发，爱看不看', value: 1 },
    { label: '简单调个色加个滤镜，三分钟搞定', value: 2 },
    { label: '精修半小时起步，文案还要改三遍', value: 3 },
    { label: '我已经半年没发过朋友圈了', value: 4 },
  ]},
  { id: 'cq2', dim: 'D1', text: '你有没有认真想过做自媒体/当博主这件事？', options: [
    { label: '已经在做了，而且不止一个号', value: 1 },
    { label: '注册过账号、拍过几条，但没坚持', value: 2 },
    { label: '想过，但觉得自己没什么好分享的', value: 3 },
    { label: '从没想过，我就是来看别人表演的', value: 4 },
  ]},
  { id: 'cq3', dim: 'D1', text: '刷到一个超好笑/超离谱的事，你的第一反应？', options: [
    { label: '自己也拍一条/写一条蹭一下热度', value: 1 },
    { label: '转发到群里并附上自己的神评', value: 2 },
    { label: '截图存手机，也不知道以后会不会发', value: 3 },
    { label: '笑完/震惊完继续刷下一条', value: 4 },
  ]},
  { id: 'cq4', dim: 'D1', text: '你手机里有多少条"拍了但没发出去"的视频/图片？', multiSelect: true, options: [
    { label: '几乎没有，我拍了就发，绝不浪费素材', value: 1 },
    { label: '有一些，偶尔会翻出来补发', value: 2 },
    { label: '超多，相册就是我的内容坟场', value: 3 },
    { label: '我根本不拍，手机相册干净得像刚买的', value: 4 },
  ]},
  { id: 'cq5', dim: 'D1', text: '"经历了但没发到网上"对你来说意味着什么？', options: [
    { label: '等于白经历了，不发等于没去', value: 1 },
    { label: '有点遗憾，但也不是非发不可', value: 2 },
    { label: '无所谓，生活是给自己过的', value: 3 },
    { label: '巴不得什么都不发，社交媒体是负担', value: 4 },
  ]},

  // ===== D2: 社交风格 (L=Loud vs Q=Quiet) =====
  { id: 'cq6', dim: 'D2', text: '你在群聊里属于哪种人？', options: [
    { label: '话题发起者+气氛担当，没我群就冷了', value: 1 },
    { label: '活跃分子，有梗必接有架必劝', value: 2 },
    { label: '偶尔冒泡，大部分时间潜水', value: 3 },
    { label: '设置了消息免打扰，半年没点开过', value: 4 },
  ]},
  { id: 'cq7', dim: 'D2', text: '你大概有几个经常互动的网友（不含现实朋友）？', options: [
    { label: '十几个以上，有些比现实朋友还亲', value: 1 },
    { label: '三五个，聊得来的不需要多', value: 2 },
    { label: '一两个，而且联系频率堪比年抛', value: 3 },
    { label: '零个，网友是什么概念', value: 4 },
  ]},
  { id: 'cq8', dim: 'D2', text: '有人在你的帖子下面评论了，你通常？', options: [
    { label: '秒回，还能聊起来变成新朋友', value: 1 },
    { label: '看心情回，回复质量取决于我当时忙不忙', value: 2 },
    { label: '点个赞算回复了', value: 3 },
    { label: '我不发帖所以没有这个问题', value: 4 },
  ]},
  { id: 'cq9', dim: 'D2', text: '以下哪些你经常干？', multiSelect: true, options: [
    { label: '在评论区跟陌生人聊天/互动', value: 1 },
    { label: '给认识的人的每条动态点赞', value: 2 },
    { label: '潜水看完所有人的动态但不留痕迹', value: 3 },
    { label: '连别人的动态都懒得看', value: 4 },
  ]},
  { id: 'cq10', dim: 'D2', text: '你觉得"网络社交"和"现实社交"比起来？', options: [
    { label: '网络社交更舒服，打字比说话轻松', value: 1 },
    { label: '各有各的好，我两边都能行', value: 2 },
    { label: '现实社交更真实，网上都是表演', value: 3 },
    { label: '两种都累，我只想一个人待着', value: 4 },
  ]},

  // ===== D3: 信息模式 (D=Deep vs S=Skim) =====
  { id: 'cq11', dim: 'D3', text: '朋友给你分享了一篇五千字的深度长文，你会？', options: [
    { label: '从头读到尾，读完还想找相关文章继续看', value: 1 },
    { label: '认真读完，但不会延伸阅读', value: 2 },
    { label: '扫一遍标题和加粗内容，抓住结论就够了', value: 3 },
    { label: '直接问朋友"说重点，三句话总结"', value: 4 },
  ]},
  { id: 'cq12', dim: 'D3', text: '你的短视频使用习惯？', options: [
    { label: '基本不刷，觉得是浪费时间', value: 1 },
    { label: '偶尔刷，但更喜欢长视频/文章', value: 2 },
    { label: '每天都刷，是我获取信息的主要方式', value: 3 },
    { label: '一打开就停不下来，经常一刷两三个小时', value: 4 },
  ]},
  { id: 'cq13', dim: 'D3', text: '你的"收藏夹/稍后再看"列表是什么状态？', multiSelect: true, options: [
    { label: '定期清理，收藏的基本都会看', value: 1 },
    { label: '偶尔翻翻，大概看了一半', value: 2 },
    { label: '收藏了几百条但看过的不到十分之一', value: 3 },
    { label: '收藏=已阅，我从来不会回头看', value: 4 },
  ]},
  { id: 'cq14', dim: 'D3', text: '关于"信息茧房"这件事你怎么看？', options: [
    { label: '很警惕，会主动看不同立场的内容', value: 1 },
    { label: '知道但没怎么管，算法推什么我看什么', value: 2 },
    { label: '无所谓，看自己喜欢的有什么错', value: 3 },
    { label: '信息茧房是什么？', value: 4 },
  ]},
  { id: 'cq15', dim: 'D3', text: '以下哪个最接近你获取新闻/热点的方式？', options: [
    { label: '订阅专业媒体/RSS/Newsletter，主动获取', value: 1 },
    { label: '看到热搜会点进去看原文和各方分析', value: 2 },
    { label: '看热搜标题+热评就够了，懒得点进原文', value: 3 },
    { label: '等朋友在群里说我才知道发生了什么', value: 4 },
  ]},

  // ===== D4: 网络依赖 (A=Addict vs O=Offline) =====
  { id: 'cq16', dim: 'D4', text: '手机电量到5%而且没有充电器，你的心理状态？', options: [
    { label: '焦虑到手心出汗，满世界找充电宝', value: 1 },
    { label: '有点慌，赶紧把省电模式打开', value: 2 },
    { label: '无所谓，关机就关机呗', value: 3 },
    { label: '解放了！终于有理由不看手机了', value: 4 },
  ]},
  { id: 'cq17', dim: 'D4', text: '你每天的屏幕使用时间大概是？', options: [
    { label: '10小时以上，醒着的时候基本都在看屏幕', value: 1 },
    { label: '6-9小时，工作+娱乐加起来差不多这个数', value: 2 },
    { label: '3-5小时，该用就用', value: 3 },
    { label: '3小时以下，能不看就不看', value: 4 },
  ]},
  { id: 'cq18', dim: 'D4', text: '让你完全断网三天，会怎样？', multiSelect: true, options: [
    { label: '光想想就心慌，这跟坐牢有什么区别', value: 1 },
    { label: '前几个小时会不习惯，但慢慢能适应', value: 2 },
    { label: '没什么感觉，该干嘛干嘛', value: 3 },
    { label: '求之不得，我正好需要一个理由戒网', value: 4 },
  ]},
  { id: 'cq19', dim: 'D4', text: '你有没有过这种体验：拿起手机想做一件事，结果刷了半小时别的，最后忘了原来想做什么？', options: [
    { label: '天天如此，这就是我的日常', value: 1 },
    { label: '经常，但我已经习惯了', value: 2 },
    { label: '偶尔会，但我能意识到并且拉回来', value: 3 },
    { label: '从来没有，我用手机很有目的性', value: 4 },
  ]},
  { id: 'cq20', dim: 'D4', text: '睡觉前你通常？', multiSelect: true, options: [
    { label: '手机刷到眼睛睁不开才放下', value: 1 },
    { label: '设了闹钟提醒自己放下手机，但经常无视', value: 2 },
    { label: '看十几分钟就放下了', value: 3 },
    { label: '手机放在客厅/远离床头的地方充电', value: 4 },
  ]},

  // ===== D5: 键盘倾向 (K=Keyboard warrior vs P=Peace dove) =====
  { id: 'cq21', dim: 'D5', text: '看到热搜上有争议的话题你？', options: [
    { label: '直接评论区下场，表态、输出、战斗', value: 1 },
    { label: '看完各方观点，忍不住发条自己的看法', value: 2 },
    { label: '吃瓜看热闹，绝不掺和', value: 3 },
    { label: '看都不想看，热搜跟我有什么关系', value: 4 },
  ]},
  { id: 'cq22', dim: 'D5', text: '你会因为网上一个陌生人的评论气一整天吗？', options: [
    { label: '会，而且我必须回怼到对方闭嘴才罢休', value: 1 },
    { label: '会生气，但忍住不回复，在心里骂三遍', value: 2 },
    { label: '偶尔会不爽，但很快就忘了', value: 3 },
    { label: '从来不会，陌生人的看法关我什么事', value: 4 },
  ]},
  { id: 'cq23', dim: 'D5', text: '关于"网暴"这件事你的态度？', multiSelect: true, options: [
    { label: '看到不公的事我会跟着骂，这叫正义', value: 1 },
    { label: '反对网暴但有时候也忍不住跟风', value: 2 },
    { label: '旁观，不参与不评价', value: 3 },
    { label: '非常抵制，看到就举报', value: 4 },
  ]},
  { id: 'cq24', dim: 'D5', text: '你在网上跟人"吵过架"吗？', options: [
    { label: '经常，而且我从来不认输', value: 1 },
    { label: '吵过几次，事后觉得没必要', value: 2 },
    { label: '极少，除非对方实在太过分', value: 3 },
    { label: '从来没有，看到争吵我就跑', value: 4 },
  ]},
  { id: 'cq25', dim: 'D5', text: '饭圈骂战/键政辩论/热点站队，你参与过哪些？', multiSelect: true, options: [
    { label: '都参与过，网络就是我的擂台', value: 1 },
    { label: '参与过一两种，偶尔忍不住', value: 2 },
    { label: '看过热闹但从不下场', value: 3 },
    { label: '这些话题我连看都不看', value: 4 },
  ]},

  // ===== D6: 网络人设 (R=Real vs M=Mask) =====
  { id: 'cq26', dim: 'D6', text: '你在社交平台上展示的生活和真实生活差多少？', options: [
    { label: '完全一致，甚至比真实的还惨', value: 1 },
    { label: '基本一致，只是挑了比较好的部分发', value: 2 },
    { label: '差挺多的，网上的我比真实的我精致不少', value: 3 },
    { label: '网上的我和现实的我基本是两个人', value: 4 },
  ]},
  { id: 'cq27', dim: 'D6', text: '你有几个微信号/社交媒体小号？', options: [
    { label: '就一个号，我活得很统一', value: 1 },
    { label: '有一个小号但很少用', value: 2 },
    { label: '两三个，不同号给不同的人看', value: 3 },
    { label: '三个以上，每个号都是我的不同分身', value: 4 },
  ]},
  { id: 'cq28', dim: 'D6', text: '以下哪些你干过？', multiSelect: true, options: [
    { label: '发完朋友圈后反复检查别人的反应', value: 1 },
    { label: '删掉了点赞/评论不够多的动态', value: 2 },
    { label: '精心编辑了一段文案让自己看起来很快乐/很酷', value: 3 },
    { label: '以上都没有，我不在乎别人怎么看', value: 4 },
  ]},
  { id: 'cq29', dim: 'D6', text: '如果有人把你所有的搜索记录和浏览历史公开，你？', options: [
    { label: '无所谓，我又没什么见不得人的', value: 1 },
    { label: '有点尴尬但不至于社死', value: 2 },
    { label: '会非常紧张，有些东西绝对不能被看到', value: 3 },
    { label: '直接社死，搜索记录是我最大的秘密', value: 4 },
  ]},
  { id: 'cq30', dim: 'D6', text: '你觉得"在网上做真实的自己"这件事？', options: [
    { label: '完全做得到，我网上网下一个样', value: 1 },
    { label: '大部分时候是真实的，偶尔会包装一下', value: 2 },
    { label: '很难，网上不包装根本活不下去', value: 3 },
    { label: '没想过这个问题，网上本来就不需要真实', value: 4 },
  ]},
];

export const specialQuestions: Question[] = [
  {
    id: 'bot_gate',
    text: '你的日均屏幕使用时间是多少？（诚实回答，你的手机比你更清楚真相）',
    options: [
      { label: '4小时以下，我有现实生活', value: 1 },
      { label: '4-8小时，正常水平吧……吧？', value: 2 },
      { label: '8-12小时，别骂了别骂了', value: 3 },
      { label: '12小时以上，我和手机已经是共生关系了', value: 4 },
    ],
    special: true,
  },
];

export const BOT_TRIGGER_QUESTION_ID = 'bot_gate';
