/* ===== 旧域名跳转到新域名 ===== */
if (window.location.hostname === 'sbticc.vercel.app') {
    window.location.replace('https://sbti.jiligulu.xyz' + window.location.pathname + window.location.search + window.location.hash);
}

/* ===== vConsole for test domain ===== */
if (window.location.hostname.indexOf('sbticc-test') !== -1) {
    window.addEventListener('DOMContentLoaded', function () {
        if (typeof VConsole !== 'undefined') {
            new VConsole();
            console.log('[SBTI Debug] vConsole initialized on test domain');
        }
    });
}

const dimensionMeta = {
    S1: { name: 'S1 自尊自信', model: '自我模型' },
    S2: { name: 'S2 自我清晰度', model: '自我模型' },
    S3: { name: 'S3 核心价值', model: '自我模型' },
    E1: { name: 'E1 依恋安全感', model: '情感模型' },
    E2: { name: 'E2 情感投入度', model: '情感模型' },
    E3: { name: 'E3 边界与依赖', model: '情感模型' },
    A1: { name: 'A1 世界观倾向', model: '态度模型' },
    A2: { name: 'A2 规则与灵活度', model: '态度模型' },
    A3: { name: 'A3 人生意义感', model: '态度模型' },
    Ac1: { name: 'Ac1 动机导向', model: '行动驱力模型' },
    Ac2: { name: 'Ac2 决策风格', model: '行动驱力模型' },
    Ac3: { name: 'Ac3 执行模式', model: '行动驱力模型' },
    So1: { name: 'So1 社交主动性', model: '社交模型' },
    So2: { name: 'So2 人际边界感', model: '社交模型' },
    So3: { name: 'So3 表达与真实度', model: '社交模型' }
};
const questions = [
    {
        id: 'q1', dim: 'S1',
        text: '我不仅是屌丝，我还是joker,我还是咸鱼，这辈子没谈过一场恋爱，胆怯又自卑，我的青春就是一场又一场的意淫，每一天幻想着我也能有一个女孩子和我一起压马路，一起逛街，一起玩，现实却是爆了父母金币，读了个烂学校，混日子之后找班上，没有理想，没有目标，没有能力的三无人员，每次看到你能在网上开屌丝的玩笑，我都想哭，我就是地底下的老鼠，透过下水井的缝隙，窥探地上的各种美好，每一次看到这种都是对我心灵的一次伤害，对我生存空间的一次压缩，求求哥们给我们这种小丑一点活路吧，我真的不想在白天把枕巾哭湿一大片',
        options: [
            { label: '我哭了。。', value: 1 },
            { label: '这是什么。。', value: 2 },
            { label: '这不是我！', value: 3 }
        ]
    },
    {
        id: 'q2', dim: 'S1',
        text: '我不够好，周围的人都比我优秀',
        options: [
            { label: '确实', value: 1 },
            { label: '有时', value: 2 },
            { label: '不是', value: 3 }
        ]
    },
    {
        id: 'q3', dim: 'S2',
        text: '我很清楚真正的自己是什么样的',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q4', dim: 'S2',
        text: '我内心有真正追求的东西',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q5', dim: 'S3',
        text: '我一定要不断往上爬、变得更厉害',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q6', dim: 'S3',
        text: '外人的评价对我来说无所吊谓。',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q7', dim: 'E1',
        text: '对象超过5小时没回消息，说自己窜稀了，你会怎么想？',
        options: [
            { label: '拉稀不可能5小时，也许ta隐瞒了我。', value: 1 },
            { label: '在信任和怀疑之间摇摆。', value: 2 },
            { label: '也许今天ta真的不太舒服。', value: 3 }
        ]
    },
    {
        id: 'q8', dim: 'E1',
        text: '我在感情里经常担心被对方抛弃',
        options: [
            { label: '是的', value: 1 },
            { label: '偶尔', value: 2 },
            { label: '不是', value: 3 }
        ]
    },
    {
        id: 'q9', dim: 'E2',
        text: '我对天发誓，我对待每一份感情都是认真的！',
        options: [
            { label: '并没有', value: 1 },
            { label: '也许？', value: 2 },
            { label: '是的！（问心无愧骄傲脸）', value: 3 }
        ]
    },
    {
        id: 'q10', dim: 'E2',
        text: '你的恋爱对象是一个尊老爱幼，温柔敦厚，洁身自好，光明磊落，大义凛然，能言善辩，口才流利，观察入微，见多识广，博学多才，诲人不倦，和蔼可亲，平易近人，心地善良，慈眉善目，积极进取，意气风发，玉树临风，国色天香，倾国倾城，花容月貌的人，此时你会？',
        options: [
            { label: '就算ta再优秀我也不会陷入太深。', value: 1 },
            { label: '会介于A和C之间。', value: 2 },
            { label: '会非常珍惜ta，也许会变成恋爱脑。', value: 3 }
        ]
    },
    {
        id: 'q11', dim: 'E3',
        text: '恋爱后，对象非常黏人，你作何感想？',
        options: [
            { label: '那很爽了', value: 1 },
            { label: '都行无所谓', value: 2 },
            { label: '我更喜欢保留独立空间', value: 3 }
        ]
    },
    {
        id: 'q12', dim: 'E3',
        text: '我在任何关系里都很重视个人空间',
        options: [
            { label: '我更喜欢依赖与被依赖', value: 1 },
            { label: '看情况', value: 2 },
            { label: '是的！（斩钉截铁地说道）', value: 3 }
        ]
    },
    {
        id: 'q13', dim: 'A1',
        text: '大多数人是善良的',
        options: [
            { label: '其实邪恶的人心比世界上的痔疮更多。', value: 1 },
            { label: '也许吧。', value: 2 },
            { label: '是的，我愿相信好人更多。', value: 3 }
        ]
    },
    {
        id: 'q14', dim: 'A1',
        text: '你走在街上，一位萌萌的小女孩蹦蹦跳跳地朝你走来（正脸、侧脸看都萌，用vivo、苹果、华为、OPPO手机看都萌，实在是非常萌的那种），她递给你一根棒棒糖，此时你作何感想？',
        options: [
            { label: '呜呜她真好真可爱！居然给我棒棒糖！', value: 3 },
            { label: '一脸懵逼，作挠头状', value: 2 },
            { label: '这也许是一种新型诈骗？还是走开为好。', value: 1 }
        ]
    },
    {
        id: 'q15', dim: 'A2',
        text: '快考试了，学校规定必须上晚自习，请假会扣分，但今晚你约了女/男神一起玩《绝地求生：刺激战场》（一款刺激的游戏），你怎么办？',
        options: [
            { label: '翘了！反正就一次！', value: 1 },
            { label: '干脆请个假吧。', value: 2 },
            { label: '都快考试了还去啥。', value: 3 }
        ]
    },
    {
        id: 'q16', dim: 'A2',
        text: '我喜欢打破常规，不喜欢被束缚',
        options: [
            { label: '认同', value: 1 },
            { label: '保持中立', value: 2 },
            { label: '不认同', value: 3 }
        ]
    },
    {
        id: 'q17', dim: 'A3',
        text: '我做事通常有目标。',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q18', dim: 'A3',
        text: '突然某一天，我意识到人生哪有什么他妈的狗屁意义，人不过是和动物一样被各种欲望支配着，纯纯是被激素控制的东西，饿了就吃，困了就睡，一发情就想交配，我们简直和猪狗一样没什么区别。',
        options: [
            { label: '是这样的。', value: 1 },
            { label: '也许是，也许不是。', value: 2 },
            { label: '这简直是胡扯', value: 3 }
        ]
    },
    {
        id: 'q19', dim: 'Ac1',
        text: '我做事主要为了取得成果和进步，而不是避免麻烦和风险。',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q20', dim: 'Ac1',
        text: '你因便秘坐在马桶上（已长达30分钟），拉不出很难受。此时你更像',
        options: [
            { label: '再坐三十分钟看看，说不定就有了。', value: 1 },
            { label: '用力拍打自己的屁股并说：“死屁股，快拉啊！”', value: 2 },
            { label: '使用开塞露，快点拉出来才好。', value: 3 }
        ]
    },
    {
        id: 'q21', dim: 'Ac2',
        text: '我做决定比较果断，不喜欢犹豫',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    },
    {
        id: 'q22', dim: 'Ac2',
        text: '此题没有题目，请盲选',
        options: [
            { label: '反复思考后感觉应该选A？', value: 1 },
            { label: '啊，要不选B？', value: 2 },
            { label: '不会就选C？', value: 3 }
        ]
    },
    {
        id: 'q23', dim: 'Ac3',
        text: '别人说你“执行力强”，你内心更接近哪句？',
        options: [
            { label: '我被逼到最后确实执行力超强。。。', value: 1 },
            { label: '啊，有时候吧。', value: 2 },
            { label: '是的，事情本来就该被推进', value: 3 }
        ]
    },
    {
        id: 'q24', dim: 'Ac3',
        text: '我做事常常有计划，____',
        options: [
            { label: '然而计划不如变化快。', value: 1 },
            { label: '有时能完成，有时不能。', value: 2 },
            { label: '我讨厌被打破计划。', value: 3 }
        ]
    },
    {
        id: 'q25', dim: 'So1',
        text: '你因玩《第五人格》（一款刺激的游戏）而结识许多网友，并被邀请线下见面，你的想法是？',
        options: [
            { label: '网上口嗨下就算了，真见面还是有点忐忑。', value: 1 },
            { label: '见网友也挺好，反正谁来聊我就聊两句。', value: 2 },
            { label: '我会打扮一番并热情聊天，万一呢，我是说万一呢？', value: 3 }
        ]
    },
    {
        id: 'q26', dim: 'So1',
        text: '朋友带了ta的朋友一起来玩，你最可能的状态是',
        options: [
            { label: '对“朋友的朋友”天然有点距离感，怕影响二人关系', value: 1 },
            { label: '看对方，能玩就玩。', value: 2 },
            { label: '朋友的朋友应该也算我的朋友！要热情聊天', value: 3 }
        ]
    },
    {
        id: 'q27', dim: 'So2',
        text: '我和人相处主打一个电子围栏，靠太近会自动报警。',
        options: [
            { label: '认同', value: 3 },
            { label: '中立', value: 2 },
            { label: '不认同', value: 1 }
        ]
    },
    {
        id: 'q28', dim: 'So2',
        text: '我渴望和我信任的人关系密切，熟得像失散多年的亲戚。',
        options: [
            { label: '认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '不认同', value: 3 }
        ]
    },
    {
        id: 'q29', dim: 'So3',
        text: '有时候你明明对一件事有不同的、负面的看法，但最后没说出来。多数情况下原因是：',
        options: [
            { label: '这种情况较少。', value: 1 },
            { label: '可能碍于情面或者关系。', value: 2 },
            { label: '不想让别人知道自己是个阴暗的人。', value: 3 }
        ]
    },
    {
        id: 'q30', dim: 'So3',
        text: '我在不同人面前会表现出不一样的自己',
        options: [
            { label: '不认同', value: 1 },
            { label: '中立', value: 2 },
            { label: '认同', value: 3 }
        ]
    }
];
const specialQuestions = [
    {
        id: 'drink_gate_q1',
        special: true,
        kind: 'drink_gate',
        text: '您平时有什么爱好？',
        options: [
            { label: '吃喝拉撒', value: 1 },
            { label: '艺术爱好', value: 2 },
            { label: '饮酒', value: 3 },
            { label: '健身', value: 4 }
        ]
    },
    {
        id: 'drink_gate_q2',
        special: true,
        kind: 'drink_trigger',
        text: '您对饮酒的态度是？',
        options: [
            { label: '小酌怡情，喝不了太多。', value: 1 },
            { label: '我习惯将白酒灌在保温杯，当白开水喝，酒精令我信服。', value: 2 }
        ]
    }
];

const TYPE_LIBRARY = {
    "CTRL": {
        "code": "CTRL",
        "cn": "拿捏者",
        "intro": "怎么样，被我拿捏了吧？",
        "desc": "恭喜您，您测出了全中国最为罕见的人格，您是宇宙熵增定律的天然反抗者！全世界所谓成功人士里，99.99%都是您的拙劣模仿者。CTRL人格，是行走的人形自走任务管理器，普通人眼中的“规则”，在您这里只是出厂的基础参数设置；凡人所谓的“计划”，对您而言不过是心血来潮的随手涂鸦。拥有一个CTRL朋友意味着什么？意味着你的人生导航系统会变得更加精准、高效。因为CTRL最会拿捏了。CTRL会在你人生列车即将脱轨的前一秒，用一个“Ctrl+S”帮你硬核存档，再用一套无法拒绝的逻辑把你强行拽回正轨。他们是你混乱生活最后的备份盘，是宇宙崩塌前唯一还亮着的那个重启键。"
    },
    "ATM-er": {
        "code": "ATM-er",
        "cn": "送钱者",
        "intro": "你以为我很有钱吗？",
        "desc": "恭喜您，您竟然测出了这个世界上最稀有的人格。您或将成为金融界的未解之谜——是的，ATM-er不一定真的“送钱”，但可能永远在“支付”。支付时间、支付精力、支付耐心、支付一个本该安宁的夜晚。因此像一部老旧但坚固的ATM机，插进去的是别人的焦虑和麻烦，吐出来的是“没事，有我”的安心保证。您的人生就是一场盛大的、无人喝彩的单人付账秀。您竟用磐石般的可靠，承受了瀑布般的索取，偶尔夜深人静才会对着账单——可能是精神上的——发出一声叹息：我这该死的、无处安放的责任心啊。"
    },
    "Dior-s": {
        "code": "Dior-s",
        "cn": "屌丝",
        "intro": "等着我屌丝逆袭。",
        "desc": "恭喜！您并非屌丝，您是犬儒主义先贤第欧根尼失散多年的精神传人，因为屌丝的全称是 Diogenes' Original Realist - sage。Dior-s人格，是对当代消费主义陷阱和成功学PUA最彻底的蔑视。他们不是“不求上进”，而是早已看穿一切“上进”的尽头不过是更高级的牢房。屌丝有着大智慧。当别人在追逐风口，被时代的巨浪拍得七荤八素时，Dior-s早已在自己的精神木桶里晒着太阳，达到了“人桶合一”的至高境界。他们信奉的不是空话，是经过亿万次实践检验的物理法则与生物本能：一、躺着比站着舒服；二、饭点到了就得干饭。"
    },
    "BOSS": {
        "code": "BOSS",
        "cn": "领导者",
        "intro": "方向盘给我，我来开。",
        "desc": "BOSS是一个手里永远拿着方向盘的人。哪怕油箱已经亮了红灯，哪怕导航在胡说八道，你都会面无表情地说一句：我来开。然后真的把车开到了目的地。该人格拥有独立的物理法则——永恒向上定律。BOSS人格看世界，就像玩通关了的玩家在看新手教程。效率是他们的信仰，秩序是他们的呼吸。他们不是“自带领袖气场”，他们本身就是人形的气场发生器，方圆五米内，空气都会自动变得严肃而高效。他们眼中的“自我突破”，约等于普通人眼中的“自虐”。今天掌握一门新语言，明天考下一个专业证书，后天就计划殖民火星。你说这太卷了，他会用一种看弱鸡的眼神看着你：不是我太狠，是你太松。"
    },
    "THAN-K": {
        "code": "THAN-K",
        "cn": "感恩者",
        "intro": "我感谢苍天！我感谢大地！",
        "desc": "恭喜您，您测出了全中国最为罕见的人格。您应当感谢我！感谢您在此刻拥有了生命的滋润！倘若您上班路上堵车了？您也应当说一句：我感谢这次堵车，它让我有更多时间聆听这首美妙的歌曲，并欣赏窗外每一张因焦虑而扭曲的脸庞，让我更珍惜内心的平静。是的，THAN-K拥有温润如玉的性格和海纳百川的胸怀。他们眼中的世界没有完全的坏人，只有“尚未被感恩光芒照耀到的朋友”。拥有一个THAN-K朋友，就像身边多了一个永不枯竭的正能量发射塔。TA甚至能帮你从墙角的霉斑里发现一幅梵高风格的星空图。"
    },
    "OH-NO": {
        "code": "OH-NO",
        "cn": "哦不人",
        "intro": "哦不！我怎么会是这个人格？！",
        "desc": "“哦不！”并非恐惧的尖叫，而是一种顶级的智慧。当普通人看到一个杯子放在桌沿，哦不人看到的是一场由“水渍-短路-火灾-全楼疏散-经济损失-蝴蝶效应-世界末日”构成的灾难史诗。于是，伴随着一声发自灵魂深处的 Oh, no!，他们会以迅雷不及掩耳之势把杯子挪到桌子正中央，然后再垫上一张吸水杯垫。哦不人对“边界”有一种近乎偏执的尊重：你的就是你的，我的就是我的。所有意外和风险都已经在他的“Oh, no!”声中，被扼杀在了萌芽状态。他们是秩序的守护神，是混乱世界里最后那批神经绷得很直的体面人。"
    },
    "GOGO": {
        "code": "GOGO",
        "cn": "行者",
        "intro": "gogogo~出发咯",
        "desc": "经研究发现，GOGO人格的大脑构造与常人有根本性不同。GOGO活在一个极致的“所见即所得”世界里，人生信条简单粗暴到令人发指：只要我闭上眼睛，天就是黑的；只要我把钱都花了，我就没有钱了；只要我站在斑马线上，我现在就是行人了。逻辑完美闭环，根本无法反驳。别人还在为“先有鸡还是先有蛋”而辩论，GOGO行者已经把鸡和蛋一起做成了一盘“鸡生蛋，蛋生鸡之终极奥义盖浇饭”。他们不是在“解决问题”，他们是在“清除待办事项”。对他们来说，世界上只有两种状态：已完成，和即将被我完成。"
    },
    "SEXY": {
        "code": "SEXY",
        "cn": "尤物",
        "intro": "您就是天生的尤物！",
        "desc": "当您走进一个房间，照明系统会自动将您识别为天生的尤物，并自觉调暗亮度，以避免能源浪费。当您微笑时，您就变成了微笑着的尤物，周围的空气湿度也会显著下降，因为水蒸气都凝结成了人眼中的爱心。无论是谁，都容易对您的存在产生一种超标的注意力。传说，如果有足够多的SEXY人格聚集在一起开派对，其释放出的综合魅力能量足以暂时扭曲时空结构，让参加者产生“时间变慢了”的幸福错觉。他们不需要卖力表达，很多时候，单是存在本身就已经很像一篇华丽到过分的赋。"
    },
    "LOVE-R": {
        "code": "LOVE-R",
        "cn": "多情者",
        "intro": "爱意太满，现实显得有点贫瘠。",
        "desc": "LOVE-R人格像远古神话时代幸存至今的珍稀物种，其存在概率比你在马桶里钓到作者胳膊的概率还低。您简直是这个钢铁森林时代最后的、也是最不合时宜的吟游诗人。因为您的情感处理器不是二进制的，而是彩虹制的。一片落叶，在常人眼里只是“秋天来了”，在LOVE-R眼中，则是一场关于轮回、牺牲与无言之爱的十三幕悲喜剧。您内心世界像一座永不关门的主题公园，一生都在寻找那个能看懂园区地图、并愿意陪你坐旋转木马直到宇宙尽头的灵魂伴侣。"
    },
    "MUM": {
        "code": "MUM",
        "cn": "妈妈",
        "intro": "或许...我可以叫你妈妈吗....?",
        "desc": "恭喜您，您测出了全中国最稀有的妈妈人格。是的，在混沌未开、时间尚无姓名之前，在第一颗恒星打出第一个嗝之前，就已经有了妈妈。妈妈人格的底色是温柔，擅长感知情绪，具有超强共情力，知道什么时候该停下来，什么时候该对自己说一句“算了”。妈妈像一个医生，治愈了别人的不开心。只可惜，当妈妈落泪时，TA给自己的药，剂量总是比给别人小一号。MUM对自己的温柔，常常打了折。"
    },
    "FAKE": {
        "code": "FAKE",
        "cn": "伪人",
        "intro": "已经，没有人类了。",
        "desc": "SCP基金会紧急报告：项目编号 SCP-CN-████ “伪人”。在社交场合，伪人是八面玲珑的存在，因为他们切换人格面具比切换手机输入法还快。上一秒还是推心置腹的铁哥们模式，下一秒领导来了，瞬间切换成沉稳可靠好员工模式，连脸上的光泽度和卷曲度都会发生微调。你以为你交到了一个真心懂你的朋友？醒醒。你只是幸运地遇到了一个善于伪装、高性能的仿生人罢了。夜深人静时，伪人把面具一层层摘下来，最后才发现，面具下空得很，正是这些面具构成了自己。"
    },
    "OJBK": {
        "code": "OJBK",
        "cn": "无所谓人",
        "intro": "我说随便，是真的随便。",
        "desc": "让我们直面这个词的粗犷本质：OJBK。这已经不是一种人格，而是一种统治哲学。当凡人面临“中午吃米饭还是面条”的世纪抉择时，大脑在激烈燃烧卡路里；而OJBK人格，会用一种批阅奏章般的淡然，轻飘飘地吐出两个字：都行。这不是没主见，这是在告诉你：尔等凡俗的选择，于朕而言，皆为蝼蚁。为什么不争执？因为跟草履虫辩论宇宙的未来毫无意义。为什么不较真？因为帝王不会在意脚下的尘埃是往左飘还是往右飘。"
    },
    "MALO": {
        "code": "MALO",
        "cn": "吗喽",
        "intro": "人生是个副本，而我只是一只吗喽。",
        "desc": "朋友，你不是“童心未泯”，你压根就没进化。你的灵魂还停留在那个挂在树上荡秋千、看见香蕉就两眼放光的快乐时代。当人类祖先决定从树上下来、学会直立行走、穿上西装打领带时，吗喽人格的祖先在旁边的大树上看着他们，挠了挠屁股，嘴里发出一声不屑的“吱”。他们看透了一切：所谓的“文明”，不过是一场最无聊、最不好玩的付费游戏。规则偶尔是可以打破的，天花板是用来倒挂的，会议室是用来表演后空翻的。MALO本身就是一个从巨大脑洞里掉出来、忘了关门的奇思妙想。"
    },
    "JOKE-R": {
        "code": "JOKE-R",
        "cn": "小丑",
        "intro": "原来我们都是小丑。",
        "desc": "请注意，JOKE-R人格不是一个“人”，更像一个把笑话穿在身上的小丑。你打开一层，是个笑话；再打开一层，是个段子；你一层层打开，直到最后，你发现最里面……是空的，只剩下一点微弱的回声在说：哈，没想到吧。JOKE-R是社交场合的气氛组组长兼唯一指定火力输出。有他们在，场子就不会冷。所有人前仰后合地笑着，而笑得最开心的，往往也是他们自己——用最大的笑声，盖住心碎的声音。"
    },
    "WOC!": {
        "code": "WOC!",
        "cn": "握草人",
        "intro": "卧槽，我怎么是这个人格？",
        "desc": "我们发现了一种神奇的生物——WOC!人。他们拥有两种完全独立的操作系统：一个叫“表面系统”，负责发出“我操”“牛逼”“啊？”等一系列大惊小怪的拟声词；另一个叫“后台系统”，负责冷静分析：嗯，果然不出我所料。WOC!人只会卧槽，不会多管闲事，因为他们深知，给傻逼讲道理，就像扶着烂泥上墙，不仅浪费体力，还弄自己一手屎。所以他们选择，握着一根智慧的大草，用一声饱含深情的“WOC！”来为这个疯狂的世界献上最高敬意。"
    },
    "THIN-K": {
        "code": "THIN-K",
        "cn": "思考者",
        "intro": "已深度思考100s。",
        "desc": "经研究发现，THIN-K人格的大脑构造与常人有根本性不同。正如名称所示，您的大脑长时间处于思考状态。您十分会审判信息，注重论点、论据、逻辑推理、潜在偏见，乃至“作者本人三代以内思想背景调查报告”的全套材料。在这个信息爆炸的时代，您绝不会轻易盲从，会在关系中衡量利弊，也十分捍卫自己的自我空间。当别人看到您独处时在发呆？愚蠢，那不是发呆，那是您的大脑正在对今天接收到的所有信息进行分类、归档和销毁。"
    },
    "SHIT": {
        "code": "SHIT",
        "cn": "愤世者",
        "intro": "这个世界，构石一坨。",
        "desc": "恭喜您，SHIT人格是宇宙中已知的唯一一种稀有人格。所谓狗屎，并不是在抱怨，而是在进行一种神秘仪式。SHIT的行为模式是一场惊天动地的悖论戏剧。嘴上：这个项目简直是屎。手上：默默打开 Excel，开始建构函数模型和甘特图。嘴上：这帮同事都是 shit。手上：在同事搞砸之后，一边烦着，一边熬夜把烂摊子收拾得明明白白。嘴上：这个世界就是一坨 shit，赶紧毁灭吧。手上：第二天早上七点准时起床，挤上 shit 一样的地铁，去干那份 shit 一样的工作。别怕，那不是世界末日的警报，那是他马上要开始拯救世界的冲锋号。"
    },
    "ZZZZ": {
        "code": "ZZZZ",
        "cn": "装死者",
        "intro": "我没死，我只是在睡觉。",
        "desc": "恭喜您，您测出了全中国最稀有的装死人格。群里99+条消息您可以视而不见，但当有人发出“@全体成员 还有半小时就截止了”的最后通牒时，您也许会像刚从千年古墓里苏醒一样，缓缓地敲出一个“收到”，然后在29分钟内，交出一份虽然及格的答卷。是的，直到“死线”这个唯一的、最高权限的指令出现，您就真正爆发了，不鸣则已，一鸣惊人。您向宇宙证明了一个真理：有时什么都不做，就不会做错。"
    },
    "POOR": {
        "code": "POOR",
        "cn": "贫困者",
        "intro": "我穷，但我很专。",
        "desc": "恭喜您，您测出了【POOR - 贫困者】。这个“贫困”不是钱包余额的判决书，更像一种欲望断舍离后的资源再分配。别人把精力撒成漫天二维码，你把精力压成一束激光，照哪儿，哪儿就开始冒烟。POOR的世界很简单：不重要的东西一律降噪，重要的东西狠狠干到底。热闹、社交、虚荣、到处刷存在感？抱歉，没空。你不是资源少，你是把资源全部灌进了一个坑里，所以看起来像贫困，实际上像矿井。一旦某件事被你认定值得钻，外界再吵也只是背景杂音。"
    },
    "MONK": {
        "code": "MONK",
        "cn": "僧人",
        "intro": "没有那种世俗的欲望。",
        "desc": "当别人在KTV里参悟爱与恨的纠缠，MONK人格选择在家中参悟一份大道。MONK已然看破红尘，不希望闲人来扰其清修、破其道行。MONK的个人空间，是他们的结界，是他们的须弥山，是他们的绝对领域，神圣不可侵犯。踏入者，会感受到一种来自灵魂深处的窒息感。MONK们不黏不缠，因为在他们的世界观里，万物皆有其独立轨道。行星与行星之间保持着亿万公里的距离，才构成和谐宇宙，人与人之间为什么不行？"
    },
    "IMSB": {
        "code": "IMSB",
        "cn": "傻者",
        "intro": "认真的么？我真的是傻逼么？",
        "desc": "恭喜您！您根本不在人类范畴内！您测出了百万年一遇的【IMSB】人格。IMSB人格的大脑里住着两个不死不休的究极战士：一个叫“我他妈冲了！”，另一个叫“我是个傻逼！”。当IMSB面对一个有好感的人时，前者会说：冲啊！去要微信！去约饭！爱要大声说出来！后者接着说：人家凭什么看得上你？你去了就是自取其辱！最终结果：盯着对方背影直到消失，然后掏出手机搜索“如何克服社交恐惧症”。IMSB不是真的傻，只是您的内心戏，可能比漫威宇宙所有电影加起来都长。"
    },
    "SOLO": {
        "code": "SOLO",
        "cn": "孤儿",
        "intro": "我哭了，我怎么会是孤儿？",
        "desc": "恭喜您，您测出了全中国最稀有的【SOLO - 孤儿】人格。别急着哭，国王的加冕仪式，通常都是一个人。孤儿的自我价值感偏低，因此有时主动疏远他人，孤儿们在自己的灵魂外围建起了一座名为“莫挨老子”的万里长城。每一块砖，都是过去的一道伤口。孤儿就像一只把所有软肋都藏起来，然后用最硬的刺对着世界的刺猬。那满身的尖刺不是攻击，那是一句句说不出口的“别过来，我怕你也受伤”和“求求你，别离开”。"
    },
    "FUCK": {
        "code": "FUCK",
        "cn": "草者",
        "intro": "操！这是什么人格？",
        "desc": "恭喜您！您根本不在人类范畴内！您测出了百万年一遇的【FUCK】人格。人类文明城市里，出现了一株无法被任何除草剂杀死的、具有超级生命力的人形野草——那就是草者人格。它的学名，就叫 FUCK。在FUCK的世界观里，世俗规则简直毫无意义，并且FUCK的情绪开关是物理拨片式的：FUCK YEAH 和 FUCK OFF。FUCK追求的不只是当下快感，也在追求一种在体内横冲直撞的生命力。当所有人都被驯化成了温顺家禽，FUCK则是荒野上最后那一声狼嚎。"
    },
    "DEAD": {
        "code": "DEAD",
        "cn": "死者",
        "intro": "我，还活着吗？",
        "desc": "恭喜您，您测出了全中国最为罕见的人格，只是“死者”这个名字实在有点晦气，所以也可以叫：Don't Expect Any Drives。死者已经看透了那些无意义的哲学思考，因此显得对一切“失去”了兴趣。死者们看世界的眼神，就像一位顶级玩家通关了所有主线、支线、隐藏任务，删档重开了999次之后，终于发现：这游戏压根就没意思。死者是超越了欲望和目标的终极贤者。他们的存在，就是对这个喧嚣世界最沉默也最彻底的抗议。"
    },
    "IMFW": {
        "code": "IMFW",
        "cn": "废物",
        "intro": "我真的...是废物吗？",
        "desc": "恭喜您，您测出的不是一个普通人格，您是一种极其珍稀的、仅占世界人口0.0001％的——【废物】。废物们的自尊通常有些脆弱，缺乏安全感，偶尔也会缺乏主见，因此这种人格能精确地感知到周围最强的那个 WiFi 信号——也就是他们心里最可靠的人。走进【废物】人格的生活，就像走进了一个顶级兰花温室：需要精确控制温度、湿度，以及每天定时进行“我爱你”的言语光合作用。给废物一颗糖，他们会还你一个完全信任你、亮晶晶的眼神。你未必是废物，你只是太没防备，太容易认真。"
    },
    "HHHH": {
        "code": "HHHH",
        "cn": "傻乐者",
        "intro": "哈哈哈哈哈哈。",
        "desc": "恭喜您！由于您的思维回路过于清奇，标准人格库已全面崩溃。第一人格匹配率只有60％以下时，系统才会为您强制匹配这个人格——【HHHH - 傻乐者】。这个人格有什么特质？哈哈哈哈哈哈哈哈哈哈哈哈！对不起，这就是全部的特质了。您可以查看十五维度进行不专业的评估，实在是抱歉！作者设置人格时没有考虑全面，因此才会出现这样的状况。哈哈哈哈哈哈……笑着笑着，我便哭了出来。怎么会有人的脑回路这么新奇。"
    },
    "DRUNK": {
        "code": "DRUNK",
        "cn": "酒鬼",
        "intro": "烈酒烧喉，不得不醉。",
        "desc": "您为什么走路摇摇晃晃？您为什么总是情绪高涨？您为什么看东西是重影的？因为您体内流淌的不是血液，是美味的五粮液！是国窖1573！是江小白！是陕西五粮液！哦，美味的白酒，每一滴都在燃烧，都在沸腾。您是否已经习惯了将白酒灌入保温杯，当作白开水一饮而下？多么伟大的白酒！它让您在饭桌上谈笑风生，在厕所里抱着马桶忏悔人生；它让您觉得自己是夜场诗人，是宇宙中心那团不灭的火，直到第二天上午十点，您的头像裂开的核桃，嘴角挂着食物残渣，灵魂缩在角落里。您终于明白，昨晚那个高谈阔论、拍桌怒吼的人，已经成为了一个酒鬼。"
    }
};
const TYPE_IMAGES = {
    "IMSB": "./images/IMSB.png",
    "BOSS": "./images/BOSS.png",
    "MUM": "./images/MUM.png",
    "FAKE": "./images/FAKE.png",
    "DEAD": "./images/DEAD.png",
    "ZZZZ": "./images/ZZZZ.png",
    "GOGO": "./images/GOGO.png",
    "FUCK": "./images/FUCK.png",
    "CTRL": "./images/CTRL.png",
    "HHHH": "./images/HHHH.png",
    "SEXY": "./images/SEXY.png",
    "OJBK": "./images/OJBK.png",
    "POOR": "./images/POOR.png",
    "OH-NO": "./images/OH-NO.png",
    "MONK": "./images/MONK.png",
    "SHIT": "./images/SHIT.png",
    "THAN-K": "./images/THAN-K.png",
    "MALO": "./images/MALO.png",
    "ATM-er": "./images/ATM-er.png",
    "THIN-K": "./images/THIN-K.png",
    "SOLO": "./images/SOLO.png",
    "LOVE-R": "./images/LOVE-R.png",
    "WOC!": "./images/WOC_.png",
    "DRUNK": "./images/DRUNK.png",
    "IMFW": "./images/IMFW.png",
    "Dior-s": "./images/Dior-s.png",
    "JOKE-R": "./images/JOKE-R.png"
};

const NORMAL_TYPES = [
    {
        "code": "CTRL",
        "pattern": "HHH-HMH-MHH-HHH-MHM"
    },
    {
        "code": "ATM-er",
        "pattern": "HHH-HHM-HHH-HMH-MHL"
    },
    {
        "code": "Dior-s",
        "pattern": "MHM-MMH-MHM-HMH-LHL"
    },
    {
        "code": "BOSS",
        "pattern": "HHH-HMH-MMH-HHH-LHL"
    },
    {
        "code": "THAN-K",
        "pattern": "MHM-HMM-HHM-MMH-MHL"
    },
    {
        "code": "OH-NO",
        "pattern": "HHL-LMH-LHH-HHM-LHL"
    },
    {
        "code": "GOGO",
        "pattern": "HHM-HMH-MMH-HHH-MHM"
    },
    {
        "code": "SEXY",
        "pattern": "HMH-HHL-HMM-HMM-HLH"
    },
    {
        "code": "LOVE-R",
        "pattern": "MLH-LHL-HLH-MLM-MLH"
    },
    {
        "code": "MUM",
        "pattern": "MMH-MHL-HMM-LMM-HLL"
    },
    {
        "code": "FAKE",
        "pattern": "HLM-MML-MLM-MLM-HLH"
    },
    {
        "code": "OJBK",
        "pattern": "MMH-MMM-HML-LMM-MML"
    },
    {
        "code": "MALO",
        "pattern": "MLH-MHM-MLH-MLH-LMH"
    },
    {
        "code": "JOKE-R",
        "pattern": "LLH-LHL-LML-LLL-MLM"
    },
    {
        "code": "WOC!",
        "pattern": "HHL-HMH-MMH-HHM-LHH"
    },
    {
        "code": "THIN-K",
        "pattern": "HHL-HMH-MLH-MHM-LHH"
    },
    {
        "code": "SHIT",
        "pattern": "HHL-HLH-LMM-HHM-LHH"
    },
    {
        "code": "ZZZZ",
        "pattern": "MHL-MLH-LML-MML-LHM"
    },
    {
        "code": "POOR",
        "pattern": "HHL-MLH-LMH-HHH-LHL"
    },
    {
        "code": "MONK",
        "pattern": "HHL-LLH-LLM-MML-LHM"
    },
    {
        "code": "IMSB",
        "pattern": "LLM-LMM-LLL-LLL-MLM"
    },
    {
        "code": "SOLO",
        "pattern": "LML-LLH-LHL-LML-LHM"
    },
    {
        "code": "FUCK",
        "pattern": "MLL-LHL-LLM-MLL-HLH"
    },
    {
        "code": "DEAD",
        "pattern": "LLL-LLM-LML-LLL-LHM"
    },
    {
        "code": "IMFW",
        "pattern": "LLH-LHL-LML-LLL-MLL"
    }
];
const DIM_EXPLANATIONS = {
    "S1": {
        "L": "对自己下手比别人还狠，夸你两句你都想先验明真伪。",
        "M": "自信值随天气波动，顺风能飞，逆风先缩。",
        "H": "心里对自己大致有数，不太会被路人一句话打散。"
    },
    "S2": {
        "L": "内心频道雪花较多，常在“我是谁”里循环缓存。",
        "M": "平时还能认出自己，偶尔也会被情绪临时换号。",
        "H": "对自己的脾气、欲望和底线都算门儿清。"
    },
    "S3": {
        "L": "更在意舒服和安全，没必要天天给人生开冲刺模式。",
        "M": "想上进，也想躺会儿，价值排序经常内部开会。",
        "H": "很容易被目标、成长或某种重要信念推着往前。"
    },
    "E1": {
        "L": "感情里警报器灵敏，已读不回都能脑补到大结局。",
        "M": "一半信任，一半试探，感情里常在心里拉锯。",
        "H": "更愿意相信关系本身，不会被一点风吹草动吓散。"
    },
    "E2": {
        "L": "感情投入偏克制，心门不是没开，是门禁太严。",
        "M": "会投入，但会给自己留后手，不至于全盘梭哈。",
        "H": "一旦认定就容易认真，情绪和精力都给得很足。"
    },
    "E3": {
        "L": "容易黏人也容易被黏，关系里的温度感很重要。",
        "M": "亲密和独立都要一点，属于可调节型依赖。",
        "H": "空间感很重要，再爱也得留一块属于自己的地。"
    },
    "A1": {
        "L": "看世界自带防御滤镜，先怀疑，再靠近。",
        "M": "既不天真也不彻底阴谋论，观望是你的本能。",
        "H": "更愿意相信人性和善意，遇事不急着把世界判死刑。"
    },
    "A2": {
        "L": "规则能绕就绕，舒服和自由往往排在前面。",
        "M": "该守的时候守，该变通的时候也不死磕。",
        "H": "秩序感较强，能按流程来就不爱即兴炸场。"
    },
    "A3": {
        "L": "意义感偏低，容易觉得很多事都像在走过场。",
        "M": "偶尔有目标，偶尔也想摆烂，人生观处于半开机。",
        "H": "做事更有方向，知道自己大概要往哪边走。"
    },
    "Ac1": {
        "L": "做事先考虑别翻车，避险系统比野心更先启动。",
        "M": "有时想赢，有时只想别麻烦，动机比较混合。",
        "H": "更容易被成果、成长和推进感点燃。"
    },
    "Ac2": {
        "L": "做决定前容易多转几圈，脑内会议常常超时。",
        "M": "会想，但不至于想死机，属于正常犹豫。",
        "H": "拍板速度快，决定一下就不爱回头磨叽。"
    },
    "Ac3": {
        "L": "执行力和死线有深厚感情，越晚越像要觉醒。",
        "M": "能做，但状态看时机，偶尔稳偶尔摆。",
        "H": "推进欲比较强，事情不落地心里都像卡了根刺。"
    },
    "So1": {
        "L": "社交启动慢热，主动出击这事通常得攒半天气。",
        "M": "有人来就接，没人来也不硬凑，社交弹性一般。",
        "H": "更愿意主动打开场子，在人群里不太怕露头。"
    },
    "So2": {
        "L": "关系里更想亲近和融合，熟了就容易把人划进内圈。",
        "M": "既想亲近又想留缝，边界感看对象调节。",
        "H": "边界感偏强，靠太近会先本能性后退半步。"
    },
    "So3": {
        "L": "表达更直接，心里有啥基本不爱绕。",
        "M": "会看气氛说话，真实和体面通常各留一点。",
        "H": "对不同场景的自我切换更熟练，真实感会分层发放。"
    }
};
const dimensionOrder = ['S1', 'S2', 'S3', 'E1', 'E2', 'E3', 'A1', 'A2', 'A3', 'Ac1', 'Ac2', 'Ac3', 'So1', 'So2', 'So3'];

const DRUNK_TRIGGER_QUESTION_ID = 'drink_gate_q2';

/* ===== Paywall State ===== */
var isPaid = false;

function unlockPaywall() {
    isPaid = true;
    var overlay = document.getElementById('paywallOverlay');
    if (overlay) overlay.classList.add('unlocked');
    document.body.classList.add('paid-mode');
    // Hide all ad containers
    document.querySelectorAll('.ad-banner-container').forEach(function(el) {
        el.style.display = 'none';
    });
}

function checkPaidFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var sessionId = params.get('session_id');
    if (params.get('paid') === '1' && sessionId) {
        fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.paid) unlockPaywall();
        })
        .catch(function() {});
    }
}

function isChineseUser() {
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return lang.startsWith('zh');
}

function startPayment() {
    if (isChineseUser()) {
        showChinesePaymentModal();
    } else {
        startStripeCheckout();
    }
}

function startStripeCheckout() {
    var btn = document.getElementById('paywallBtn');
    btn.disabled = true;
    btn.textContent = 'redirecting...';

    fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.url) {
            window.location.href = data.url;
        } else {
            btn.disabled = false;
            btn.textContent = '\u00A51.99 / $0.99 \u89E3\u9501';
            alert('Payment service unavailable, please try again');
        }
    })
    .catch(function() {
        btn.disabled = false;
        btn.textContent = '\u00A51.99 / $0.99 \u89E3\u9501';
        alert('Network error, please try again');
    });
}

function showChinesePaymentModal() {
    var modal = document.createElement('div');
    modal.className = 'share-modal active';
    modal.id = 'paymentModal';
    modal.innerHTML =
        '<div class="share-modal-content">' +
            '<div class="share-modal-header">' +
                '<h3>\u626B\u7801\u652F\u4ED8 \u00A51.99</h3>' +
                '<button class="share-modal-close" id="payModalClose">&times;</button>' +
            '</div>' +
            '<div class="share-modal-body" style="text-align:center;padding:24px;">' +
                '<p style="color:var(--muted);margin-bottom:16px;">\u8BF7\u7528\u5FAE\u4FE1\u626B\u7801\u652F\u4ED8\uFF08\u9762\u5305\u591A / \u7231\u53D1\u7535\uFF09</p>' +
                '<div id="paymentQRPlaceholder" style="width:200px;height:200px;margin:0 auto;background:#f0f4f0;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#999;font-size:14px;">payment QR code<br>(configure after registration)</div>' +
                '<p style="margin-top:16px;font-size:13px;color:var(--muted);">\u652F\u4ED8\u540E\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE</p>' +
            '</div>' +
            '<div class="share-modal-actions">' +
                '<button class="btn-primary" id="payConfirmBtn">\u6211\u5DF2\u652F\u4ED8\uFF0C\u89E3\u9501\u62A5\u544A</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    document.getElementById('payModalClose').addEventListener('click', function() {
        modal.remove();
    });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
    document.getElementById('payConfirmBtn').addEventListener('click', function() {
        modal.remove();
        unlockPaywall();
    });
}

const app = {
    shuffledQuestions: [],
    answers: {},
    previewMode: false,
    debugForceType: null
};

const screens = {
    test: document.getElementById('test'),
    result: document.getElementById('result')
};

const questionList = document.getElementById('questionList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const submitBtn = document.getElementById('submitBtn');
const testHint = document.getElementById('testHint');

var testOverlay = document.getElementById('testOverlay');

var eggState = { firstShake: false, lastSubmitDisabled: true };

function showScreen(name) {
    // 打开测试/结果/对比页时显示覆盖层
    if (name === 'test' || name === 'result' || name === 'compare') {
        testOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    // 回到首页时关闭覆盖层
    if (name === 'intro') {
        testOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    Object.entries(screens).forEach(([key, el]) => {
        el.classList.toggle('active', key === name);
    });
    if (testOverlay.classList.contains('active')) {
        testOverlay.scrollTop = 0;
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getVisibleQuestions() {
    const visible = [...app.shuffledQuestions];
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
    if (gateIndex !== -1 && app.answers['drink_gate_q1'] === 3) {
        visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }
    return visible;
}

function getQuestionMetaLabel(q) {
    if (q.special) return '补充题';
    return app.previewMode ? dimensionMeta[q.dim].name : '维度已隐藏';
}

function renderQuestions() {
    var visibleQuestions = getVisibleQuestions();
    if (typeof app.currentQ === 'undefined') app.currentQ = 0;
    if (app.currentQ >= visibleQuestions.length) app.currentQ = visibleQuestions.length - 1;
    if (app.currentQ < 0) app.currentQ = 0;

    var q = visibleQuestions[app.currentQ];
    var index = app.currentQ;
    var total = visibleQuestions.length;

    questionList.innerHTML = '';
    var card = document.createElement('article');
    card.className = 'question question-paged';
    card.innerHTML =
        '<div class="question-meta">' +
            '<div class="badge">第 ' + (index + 1) + ' / ' + total + ' 题</div>' +
            '<div>' + getQuestionMetaLabel(q) + '</div>' +
        '</div>' +
        '<div class="question-title">' + q.text + '</div>' +
        '<div class="options">' +
            q.options.map(function (opt, i) {
                var code = ['A', 'B', 'C', 'D'][i] || String(i + 1);
                var checked = app.answers[q.id] === opt.value ? 'checked' : '';
                return '<label class="option' + (checked ? ' option-selected' : '') + '">' +
                    '<input type="radio" name="' + q.id + '" value="' + opt.value + '" ' + checked + ' />' +
                    '<div class="option-code">' + code + '</div>' +
                    '<div>' + opt.label + '</div>' +
                '</label>';
            }).join('') +
        '</div>';
    questionList.appendChild(card);

    // Nav buttons
    var nav = document.createElement('div');
    nav.className = 'question-nav';
    var prevDisabled = index <= 0 ? ' disabled' : '';
    nav.innerHTML =
        '<button class="btn-secondary question-nav-btn" id="qPrev"' + prevDisabled + '>上一题</button>' +
        '<span class="question-nav-dots">' + (index + 1) + ' / ' + total + '</span>' +
        (index < total - 1
            ? '<button class="btn-primary question-nav-btn" id="qNext"' + (app.answers[q.id] === undefined ? ' disabled' : '') + '>下一题</button>'
            : '<span></span>');
    questionList.appendChild(nav);

    // Bind option select -> auto next
    card.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.addEventListener('change', function (e) {
            app.answers[e.target.name] = Number(e.target.value);

            // Highlight selected option
            card.querySelectorAll('.option').forEach(function (o) { o.classList.remove('option-selected'); });
            e.target.closest('.option').classList.add('option-selected');

            if (e.target.name === 'drink_gate_q1') {
                if (Number(e.target.value) !== 3) {
                    delete app.answers['drink_gate_q2'];
                }
            }

            updateProgress();

            // Auto advance after short delay
            setTimeout(function () {
                var updatedQuestions = getVisibleQuestions();
                if (app.currentQ < updatedQuestions.length - 1) {
                    app.currentQ++;
                    renderQuestions();
                } else {
                    // Last question answered, update UI
                    renderQuestions();
                }
            }, 300);
        });
    });

    // Prev button
    document.getElementById('qPrev').addEventListener('click', function () {
        if (app.currentQ > 0) {
            app.currentQ--;
            renderQuestions();
        }
    });

    // Next button
    var nextBtn = document.getElementById('qNext');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            var updatedQuestions = getVisibleQuestions();
            if (app.answers[q.id] !== undefined && app.currentQ < updatedQuestions.length - 1) {
                app.currentQ++;
                renderQuestions();
            }
        });
    }

    updateProgress();

    // Easter egg hook
    eggOnRenderQuestion();

    // Scroll to top of test area
    var overlay = document.getElementById('testOverlay');
    if (overlay) overlay.scrollTop = 0;
}

function updateProgress() {
    const visibleQuestions = getVisibleQuestions();
    const total = visibleQuestions.length;
    const done = visibleQuestions.filter(q => app.answers[q.id] !== undefined).length;
    const percent = total ? (done / total) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${done} / ${total}`;
    const complete = done === total && total > 0;
    submitBtn.disabled = !complete;
    testHint.textContent = complete
        ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
        : '全选完才会放行。世界已经够乱了，起码把题做完整。';

    // Easter egg hook
    if (typeof eggOnProgress === 'function') eggOnProgress(done, total);
}

function sumToLevel(score) {
    if (score <= 3) return 'L';
    if (score === 4) return 'M';
    return 'H';
}

function levelNum(level) {
    return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern) {
    return pattern.replace(/-/g, '').split('');
}

function getDrunkTriggered() {
    return app.answers[DRUNK_TRIGGER_QUESTION_ID] === 2;
}

function computeResult() {
    const rawScores = {};
    const levels = {};
    Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0; });

    questions.forEach(q => {
        rawScores[q.dim] += Number(app.answers[q.id] || 0);
    });

    Object.entries(rawScores).forEach(([dim, score]) => {
        levels[dim] = sumToLevel(score);
    });

    const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));
    const ranked = NORMAL_TYPES.map(type => {
        const vector = parsePattern(type.pattern).map(levelNum);
        let distance = 0;
        let exact = 0;
        for (let i = 0; i < vector.length; i++) {
            const diff = Math.abs(userVector[i] - vector[i]);
            distance += diff;
            if (diff === 0) exact += 1;
        }
        const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
        return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity };
    }).sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        if (b.exact !== a.exact) return b.exact - a.exact;
        return b.similarity - a.similarity;
    });

    const bestNormal = ranked[0];
    const drunkTriggered = getDrunkTriggered();

    let finalType;
    let modeKicker = '你的主类型';
    let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
    let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
    let special = false;
    let secondaryType = null;

    if (app.debugForceType && TYPE_LIBRARY[app.debugForceType]) {
        finalType = { ...TYPE_LIBRARY[app.debugForceType], similarity: 100, exact: 15, distance: 0 };
        modeKicker = '调试指定人格';
        badge = '调试模式 · 手动指定';
        sub = '当前结果由调试工具栏手动指定，非答题匹配。';
        special = true;
    } else if (drunkTriggered) {
        finalType = TYPE_LIBRARY.DRUNK;
        secondaryType = bestNormal;
        modeKicker = '隐藏人格已激活';
        badge = '匹配度 100% · 酒精异常因子已接管';
        sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
        special = true;
    } else if (bestNormal.similarity < 60) {
        finalType = TYPE_LIBRARY.HHHH;
        modeKicker = '系统强制兜底';
        badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
        sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
        special = true;
    } else {
        finalType = bestNormal;
    }

    return {
        rawScores,
        levels,
        ranked,
        bestNormal,
        finalType,
        modeKicker,
        badge,
        sub,
        special,
        secondaryType
    };
}

function renderDimList(result) {
    const dimList = document.getElementById('dimList');
    dimList.innerHTML = dimensionOrder.map(dim => {
        const level = result.levels[dim];
        const explanation = DIM_EXPLANATIONS[dim][level];
        return `
          <div class="dim-item">
            <div class="dim-item-top">
              <div class="dim-item-name">${dimensionMeta[dim].name}</div>
              <div class="dim-item-score">${level} / ${result.rawScores[dim]}分</div>
            </div>
            <p>${explanation}</p>
          </div>
        `;
    }).join('');
}

function renderResult() {
    // Reset paywall for new test (unless already paid in this session)
    if (!isPaid) {
        var overlay = document.getElementById('paywallOverlay');
        if (overlay) overlay.classList.remove('unlocked');
    }

    const result = computeResult();
    const type = result.finalType;

    document.getElementById('resultModeKicker').textContent = result.modeKicker;
    document.getElementById('resultTypeName').textContent = `${type.code}（${type.cn}）`;
    document.getElementById('matchBadge').textContent = result.badge;
    document.getElementById('resultTypeSub').textContent = result.sub;
    document.getElementById('resultDesc').textContent = type.desc;
    document.getElementById('posterCaption').textContent = type.intro;
    document.getElementById('funNote').textContent = result.special
        ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
        : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。';

    const posterBox = document.getElementById('posterBox');
    const posterImage = document.getElementById('posterImage');
    const imageSrc = TYPE_IMAGES[type.code];
    if (imageSrc) {
        posterImage.src = imageSrc;
        posterImage.alt = `${type.code}（${type.cn}）`;
        posterBox.classList.remove('no-image');
    } else {
        posterImage.removeAttribute('src');
        posterImage.alt = '';
        posterBox.classList.add('no-image');
    }

    renderDimList(result);

    // 相性展示
    var compatBox = document.getElementById('compatResultBox');
    var compatList = document.getElementById('compatResultList');
    var myCode = type.code;
    var soulmates = [];
    var rivals = [];
    Object.keys(COMPATIBILITY || {}).forEach(function (key) {
        var parts = key.split('+');
        var c = COMPATIBILITY[key];
        if (parts[0] === myCode || parts[1] === myCode) {
            var other = parts[0] === myCode ? parts[1] : parts[0];
            if (c.type === 'soulmate') soulmates.push({ code: other, say: c.say });
            if (c.type === 'rival') rivals.push({ code: other, say: c.say });
        }
    });
    if (soulmates.length || rivals.length) {
        compatBox.style.display = '';
        var html = '';
        soulmates.forEach(function (s) {
            var lib = TYPE_LIBRARY[s.code] || {};
            html += '<div class="compat-result-item soulmate">\uD83D\uDC95 ' + s.code + '\uFF08' + (lib.cn || '' ) + '\uFF09\u2014 ' + s.say + '</div>';
        });
        rivals.forEach(function (r) {
            var lib = TYPE_LIBRARY[r.code] || {};
            html += '<div class="compat-result-item rival">\u2694\uFE0F ' + r.code + '\uFF08' + (lib.cn || '' ) + '\uFF09\u2014 ' + r.say + '</div>';
        });
        compatList.innerHTML = html;
    } else {
        compatBox.style.display = 'none';
    }
    if (!app.debugForceType) saveResult(type.code);
    showScreen('result');
}

function startTest(preview = false) {
    app.previewMode = preview;
    app.answers = {};
    app.currentQ = 0;
    if (typeof eggState !== 'undefined') eggState.firstShake = false;
    const shuffledRegular = shuffle(questions);
    const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
    app.shuffledQuestions = [
        ...shuffledRegular.slice(0, insertIndex),
        specialQuestions[0],
        ...shuffledRegular.slice(insertIndex)
    ];
    renderQuestions();
    showScreen('test');
}

document.getElementById('startBtn').addEventListener('click', () => startTest(false));
document.getElementById('backIntroBtn').addEventListener('click', () => showScreen('intro'));
/* TODO: 启用插屏广告后取消注释
function showInterstitialThenResult() {
    if (isPaid) {
        renderResult();
        return;
    }
    var overlay = document.createElement('div');
    overlay.className = 'ad-interstitial-overlay';
    overlay.innerHTML =
        '<div style="font-size:22px;font-weight:600;margin-bottom:12px;">\u7ED3\u679C\u751F\u6210\u4E2D...</div>' +
        '<div id="adInterstitialSlot" style="width:300px;height:250px;background:#222;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666;">AD</div>' +
        '<div class="ad-countdown" id="adCountdown">5s</div>' +
        '<button class="ad-skip-btn" id="adSkipBtn" style="display:none;">\u67E5\u770B\u7ED3\u679C</button>';
    document.body.appendChild(overlay);

    var seconds = 5;
    var countdownEl = overlay.querySelector('#adCountdown');
    var skipBtn = overlay.querySelector('#adSkipBtn');

    var timer = setInterval(function () {
        seconds--;
        countdownEl.textContent = seconds + 's';
        if (seconds <= 0) {
            clearInterval(timer);
            skipBtn.style.display = 'inline-block';
        }
    }, 1000);

    skipBtn.addEventListener('click', function () {
        overlay.remove();
        renderResult();
    });
}
*/

document.getElementById('submitBtn').addEventListener('click', renderResult);
document.getElementById('restartBtn').addEventListener('click', () => startTest(false));
/* Rarity data from 1M Monte Carlo simulation */
var TYPE_RARITY = {
    "OJBK": { pct: 9.875, stars: 1, label: "常见" },
    "THAN-K": { pct: 7.952, stars: 2, label: "普通" },
    "FAKE": { pct: 6.706, stars: 2, label: "普通" },
    "SEXY": { pct: 5.908, stars: 2, label: "普通" },
    "MALO": { pct: 5.892, stars: 2, label: "普通" },
    "Dior-s": { pct: 5.250, stars: 2, label: "普通" },
    "MUM": { pct: 5.200, stars: 2, label: "普通" },
    "ZZZZ": { pct: 4.678, stars: 2, label: "普通" },
    "LOVE-R": { pct: 4.222, stars: 2, label: "普通" },
    "IMSB": { pct: 4.202, stars: 2, label: "普通" },
    "CTRL": { pct: 3.737, stars: 3, label: "少见" },
    "SOLO": { pct: 3.647, stars: 3, label: "少见" },
    "FUCK": { pct: 3.425, stars: 3, label: "少见" },
    "GOGO": { pct: 3.087, stars: 3, label: "少见" },
    "JOKE-R": { pct: 3.034, stars: 3, label: "少见" },
    "OH-NO": { pct: 2.991, stars: 3, label: "少见" },
    "MONK": { pct: 2.930, stars: 3, label: "少见" },
    "SHIT": { pct: 2.560, stars: 3, label: "少见" },
    "DEAD": { pct: 2.451, stars: 3, label: "少见" },
    "ATM-er": { pct: 2.447, stars: 3, label: "少见" },
    "THIN-K": { pct: 2.316, stars: 3, label: "少见" },
    "WOC!": { pct: 2.080, stars: 3, label: "少见" },
    "IMFW": { pct: 2.071, stars: 3, label: "少见" },
    "POOR": { pct: 1.714, stars: 4, label: "稀有" },
    "BOSS": { pct: 1.576, stars: 4, label: "稀有" },
    "HHHH": { pct: 0.050, stars: 5, label: "极稀有" },
    "DRUNK": { pct: 0, stars: 5, label: "隐藏" }
};

/* Render types gallery on intro page */
(function () {
    var grid = document.getElementById('typesGrid');
    if (!grid || typeof TYPE_LIBRARY === 'undefined') return;

    function rarityBadge(code) {
        var r = TYPE_RARITY[code];
        if (!r) return '';
        var colors = {
            1: { bg: '#edf6ef', color: '#6a786f', border: '#dbe8dd' },
            2: { bg: '#e8f0ea', color: '#4d6a53', border: '#c8dccb' },
            3: { bg: '#fff8e1', color: '#b8860b', border: '#ffe082' },
            4: { bg: '#fce4ec', color: '#c62828', border: '#f8bbd0' },
            5: { bg: '#ede7f6', color: '#6a1b9a', border: '#ce93d8' }
        };
        var c = colors[r.stars];
        var starStr = r.stars <= 4 ? '\u2605'.repeat(r.stars) : '\uD83D\uDC8E';
        if (code === 'DRUNK') starStr = '\uD83C\uDF7A';
        return '<span class="type-card-rarity" style="background:' + c.bg + ';color:' + c.color + ';border:1px solid ' + c.border + ';">' +
            starStr + ' ' + r.label + '\u3000' + r.pct + '%</span>';
    }

    Object.values(TYPE_LIBRARY).forEach(function(t) {
        var card = document.createElement('div');
        card.className = 'type-card';
        var imgSrc = typeof TYPE_IMAGES !== 'undefined' ? TYPE_IMAGES[t.code] : '';
        card.innerHTML =
            (imgSrc ? '<img class="type-card-img" src="' + imgSrc + '" alt="' + t.code + ' ' + t.cn + '" loading="lazy" />' : '') +
            '<div class="type-card-header">' +
                '<span class="type-card-code">' + t.code + '</span>' +
                '<span class="type-card-cn">' + t.cn + '</span>' +
            '</div>' +
            rarityBadge(t.code) +
            '<div class="type-card-intro">' + t.intro + '</div>' +
            '<div class="type-card-desc">' + t.desc + '</div>' +
            '<span class="type-card-toggle">展开全文</span>';
        var toggle = card.querySelector('.type-card-toggle');
        toggle.addEventListener('click', function () {
            var expanded = card.classList.toggle('expanded');
            toggle.textContent = expanded ? '收起' : '展开全文';
        });
        grid.appendChild(card);
    });
})();

/* ===== 顶部 Tab 导航 ===== */
(function () {
    var tabs = document.querySelectorAll('.top-nav-tab');
    var panels = document.querySelectorAll('.tab-panel');

    function switchTab(tabId) {
        // Close test overlay when switching tabs
        var overlay = document.getElementById('testOverlay');
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        tabs.forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        panels.forEach(function (p) {
            p.classList.toggle('active', p.id === tabId);
        });
        if (tabId === 'tab-ranking') renderRanking();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            switchTab(tab.dataset.tab);
        });
    });

    // "回到首页"按钮关闭覆盖层
    document.getElementById('toTopBtn').addEventListener('click', function () {
        showScreen('intro');
    });

    // 排行榜页的"去测试"按钮
    document.getElementById('rankingGoTest').addEventListener('click', function () {
        startTest(false);
    });

    // 导航栏"开始测试"按钮
    document.getElementById('navStartBtn').addEventListener('click', function () {
        startTest(false);
    });

    window.switchTab = switchTab;
})();

/* ===== 排行榜数据（Upstash Redis API） ===== */
var LOCAL_HISTORY_KEY = 'sbti_history';
var LOCAL_STATS_KEY = 'sbti_local_stats';

function saveResult(typeCode) {
    // Save to remote
    fetch('/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: typeCode })
    }).catch(function () {});

    // Save to localStorage - stats
    try {
        var stats = JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || '{}');
        stats[typeCode] = (stats[typeCode] || 0) + 1;
        localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
    } catch (e) {}

    // Save to localStorage - history with timestamp
    try {
        var history = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
        history.push({ code: typeCode, time: Date.now() });
        // Keep last 100 records
        if (history.length > 100) history = history.slice(-100);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
}

function getLocalStats() {
    try { return JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || '{}'); }
    catch (e) { return {}; }
}

function getLocalHistory() {
    try { return JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]'); }
    catch (e) { return []; }
}

function renderRanking() {
    var loadingEl = document.getElementById('rankingLoading');
    var emptyEl = document.getElementById('rankingEmpty');
    var contentEl = document.getElementById('rankingContent');

    loadingEl.style.display = '';
    emptyEl.style.display = 'none';
    contentEl.style.display = 'none';

    fetch('/api/ranking')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            loadingEl.style.display = 'none';

            if (!data.list || data.list.length === 0) {
                emptyEl.style.display = '';
                return;
            }

            contentEl.style.display = '';
            document.getElementById('rankTotalCount').textContent = data.total;
            document.getElementById('rankUniqueTypes').textContent = data.list.length;

            var maxCount = data.list[0].count;
            var listEl = document.getElementById('rankingList');
            listEl.innerHTML = data.list.map(function (item, i) {
                var lib = (typeof TYPE_LIBRARY !== 'undefined' && TYPE_LIBRARY[item.code]) || {};
                var cn = lib.cn || '';
                var pct = Math.round((item.count / maxCount) * 100);
                return '<div class="ranking-item">' +
                    '<div class="ranking-rank">' + (i + 1) + '</div>' +
                    '<div class="ranking-info">' +
                        '<div class="ranking-type-name">' + item.code + '</div>' +
                        '<div class="ranking-type-cn">' + cn + '</div>' +
                    '</div>' +
                    '<div class="ranking-bar-wrap"><div class="ranking-bar" style="width:' + pct + '%"></div></div>' +
                    '<div class="ranking-count">' + item.count + ' 次</div>' +
                '</div>';
            }).join('');
            // Show ad banner in ranking feed
            var adSlot = document.getElementById('adBannerRanking');
            if (adSlot && !document.body.classList.contains('paid-mode')) {
                adSlot.style.display = '';
            }
        })
        .catch(function () {
            loadingEl.style.display = 'none';
            emptyEl.style.display = '';
        });

    // Render local history
    renderLocalHistory();
}

function renderLocalHistory() {
    var history = getLocalHistory();
    var stats = getLocalStats();
    var emptyEl = document.getElementById('localHistoryEmpty');
    var contentEl = document.getElementById('localHistoryContent');
    if (!emptyEl || !contentEl) return;

    if (history.length === 0) {
        emptyEl.style.display = '';
        contentEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    contentEl.style.display = '';

    var totalCount = history.length;
    var uniqueTypes = Object.keys(stats).length;
    document.getElementById('localTestCount').textContent = totalCount;
    document.getElementById('localUniqueTypes').textContent = uniqueTypes;

    // Show recent history (newest first)
    var recent = history.slice().reverse().slice(0, 20);
    var listEl = document.getElementById('localHistoryList');
    listEl.innerHTML = recent.map(function (item) {
        var lib = (typeof TYPE_LIBRARY !== 'undefined' && TYPE_LIBRARY[item.code]) || {};
        var cn = lib.cn || '';
        var d = new Date(item.time);
        var timeStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        var rarity = (typeof TYPE_RARITY !== 'undefined' && TYPE_RARITY[item.code]) || {};
        var rarityLabel = rarity.label || '';
        return '<div class="local-history-item">' +
            '<div class="local-history-type">' +
                '<strong>' + item.code + '</strong>' +
                '<span class="local-history-cn">' + cn + '</span>' +
            '</div>' +
            '<div class="local-history-meta">' +
                (rarityLabel ? '<span class="local-history-rarity">' + rarityLabel + '</span>' : '') +
                '<span class="local-history-time">' + timeStr + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

/* ===== Test 域名：结果页调试工具栏 ===== */
(function () {
    try {
        if (window.location.hostname.indexOf('sbticc-test') === -1) return;
        var toolbar = document.getElementById('testToolbar');
        if (toolbar) toolbar.style.display = '';

        // 指定人格下拉
        var picker = document.getElementById('testTypePicker');
        if (picker) {
            Object.keys(TYPE_LIBRARY).forEach(function (code) {
                var lib = TYPE_LIBRARY[code];
                var opt = document.createElement('option');
                opt.value = code;
                opt.textContent = code + '（' + (lib.cn || '') + '）';
                picker.appendChild(opt);
            });
        }

        var reroll = document.getElementById('testReroll');
        if (reroll) reroll.addEventListener('click', function () {
            app.debugForceType = null;
            if (picker) picker.value = '';
            app.answers = {};
            app.currentQ = 0;
            questions.forEach(function (q) {
                app.answers[q.id] = q.options[Math.floor(Math.random() * q.options.length)].value;
            });
            specialQuestions.forEach(function (q) {
                app.answers[q.id] = q.options[Math.floor(Math.random() * q.options.length)].value;
            });
            renderResult();
        });

        var shareImg = document.getElementById('testShareImg');
        if (shareImg) shareImg.addEventListener('click', function () {
            var btn = document.getElementById('shareBtn');
            if (btn) btn.click();
        });

        var inviteImg = document.getElementById('testInviteImg');
        if (inviteImg) inviteImg.addEventListener('click', function () {
            var btn = document.getElementById('compareInviteBtn');
            if (btn) btn.click();
        });

        var pickBtn = document.getElementById('testPickBtn');
        if (pickBtn) pickBtn.addEventListener('click', function () {
            var code = picker ? picker.value : '';
            if (!code) return;
            app.debugForceType = code;
            renderResult();
        });
    } catch (e) { console.error('toolbar init error:', e); }
})();

/* ===== #test 调试路由：随机填充答案直接跳到结果页 ===== */
(function () {
    var isTestDomain = window.location.hostname.indexOf('sbticc-test') !== -1;
    if (!isTestDomain && window.location.hash !== '#test') return;
    // 填充所有常规题目随机答案
    questions.forEach(function (q) {
        var opts = q.options;
        app.answers[q.id] = opts[Math.floor(Math.random() * opts.length)].value;
    });
    // 填充特殊题目
    specialQuestions.forEach(function (q) {
        var opts = q.options;
        app.answers[q.id] = opts[Math.floor(Math.random() * opts.length)].value;
    });
    try { renderResult(); } catch (e) { console.error('debug renderResult error:', e); }
})();

/* ===== iOS 兼容工具函数（全局） ===== */
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

function imgToDataURL(imgEl, callback) {
    console.log('[Share] imgToDataURL called, src:', imgEl && imgEl.src ? imgEl.src.substring(0, 80) : 'none');
    if (!imgEl || !imgEl.src || imgEl.src.indexOf('data:') === 0) {
        callback();
        return;
    }
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        try {
            var cvs = document.createElement('canvas');
            cvs.width = img.naturalWidth;
            cvs.height = img.naturalHeight;
            cvs.getContext('2d').drawImage(img, 0, 0);
            imgEl.src = cvs.toDataURL('image/png');
            console.log('[Share] imgToDataURL converted to dataURL, size:', imgEl.src.length);
        } catch (e) { console.warn('imgToDataURL failed:', e); }
        callback();
    };
    img.onerror = function () { callback(); };
    img.src = imgEl.src;
}

function canvasToBlob(canvas, callback) {
    if (canvas.toBlob) {
        canvas.toBlob(function (blob) {
            if (blob) { callback(blob); return; }
            fallback();
        }, 'image/png');
    } else {
        fallback();
    }
    function fallback() {
        try {
            var dataUrl = canvas.toDataURL('image/png');
            var parts = dataUrl.split(',');
            var byteStr = atob(parts[1]);
            var arr = new Uint8Array(byteStr.length);
            for (var i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i);
            callback(new Blob([arr], { type: 'image/png' }));
        } catch (e) {
            console.error('canvasToBlob fallback failed:', e);
            callback(null);
        }
    }
}

/* Small images for share card (300px JPEG) */
var SHARE_IMAGES = {
    "IMSB": "./images/IMSB.jpg", "BOSS": "./images/BOSS.jpg", "MUM": "./images/MUM.jpg",
    "FAKE": "./images/FAKE.jpg", "DEAD": "./images/DEAD.jpg", "ZZZZ": "./images/ZZZZ.jpg",
    "GOGO": "./images/GOGO.jpg", "FUCK": "./images/FUCK.jpg", "CTRL": "./images/CTRL.jpg",
    "HHHH": "./images/HHHH.jpg", "SEXY": "./images/SEXY.jpg", "OJBK": "./images/OJBK.jpg",
    "POOR": "./images/POOR.jpg", "OH-NO": "./images/OH-NO.jpg", "MONK": "./images/MONK.jpg",
    "SHIT": "./images/SHIT.jpg", "THAN-K": "./images/THAN-K.jpg", "MALO": "./images/MALO.jpg",
    "ATM-er": "./images/ATM-er.jpg", "THIN-K": "./images/THIN-K.jpg", "SOLO": "./images/SOLO.jpg",
    "LOVE-R": "./images/LOVE-R.jpg", "WOC!": "./images/WOC_.jpg", "DRUNK": "./images/DRUNK.jpg",
    "IMFW": "./images/IMFW.jpg", "Dior-s": "./images/Dior-s.jpg", "JOKE-R": "./images/JOKE-R.jpg"
};

var PROD_BASE_URL = 'https://sbti.jiligulu.xyz';

window._shareRenderId = 0;
window._inviteRenderId = 0;

/* ===== 分享图功能（Canvas 直绘，不依赖 html2canvas） ===== */
(function () {
    var shareBtn = document.getElementById('shareBtn');
    var shareModal = document.getElementById('shareModal');
    var shareModalClose = document.getElementById('shareModalClose');
    var shareDownloadBtn = document.getElementById('shareDownloadBtn');
    var shareNativeBtn = document.getElementById('shareNativeBtn');
    var sharePreview = document.getElementById('sharePreview');
    var currentBlob = null;
    var currentFileName = 'sbti-result.png';

    function generateQR(url) {
        var qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        return qr.createDataURL(4, 0);
    }

    function loadImage(src) {
        return new Promise(function (resolve) {
            if (!src) { resolve(null); return; }
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () { resolve(img); };
            img.onerror = function () { console.warn('[Share] image load failed:', src); resolve(null); };
            img.src = src;
        });
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        var chars = text.split('');
        var line = '';
        var ly = y;
        for (var i = 0; i < chars.length; i++) {
            var test = line + chars[i];
            if (ctx.measureText(test).width > maxWidth && line.length > 0) {
                ctx.fillText(line, x, ly);
                line = chars[i];
                ly += lineHeight;
            } else {
                line = test;
            }
        }
        ctx.fillText(line, x, ly);
        return ly + lineHeight;
    }

    function drawShareCard(type, result, qrUrl, mode) {
        console.log('[Share] drawShareCard for:', type.code, 'mode:', mode);
        var W = 840;
        var imgSrc = SHARE_IMAGES[type.code];
        var qrSrc = generateQR(qrUrl);

        return Promise.all([loadImage(imgSrc), loadImage(qrSrc)]).then(function (imgs) {
            var posterImg = imgs[0];
            var qrImg = imgs[1];

            // Pre-calculate height
            var introText = mode === 'invite'
                ? '\u6211\u662F' + (type.cn || type.code) + '\uFF0C\u4F60\u662F\u4EC0\u4E48\uFF1F\u6765\u6D4B\u6D4B\u770B\uFF01'
                : (type.intro || '');
            var estLines = Math.ceil(introText.length / 28) + 1;
            var H = 60 + 240 + 20 + estLines * 30 + 30 + 120 + 30 + 110 + 40;

            var canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            var ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#faf6f0';
            ctx.fillRect(0, 0, W, H);

            var curY = 0;
            var pad = 40;

            // ===== Top brand =====
            curY += 36;
            ctx.font = 'bold 14px -apple-system, sans-serif';
            ctx.fillStyle = '#ccc';
            ctx.textAlign = 'center';
            ctx.fillText('SBTI PERSONALITY', W / 2, curY);
            curY += 28;

            // ===== Hero: left poster + right info =====
            var heroH = 200;
            var posterSize = heroH;
            var posterX = pad;
            

            // Poster background (rounded square)
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(posterX, curY, posterSize, posterSize, 16);
            ctx.clip();
            
            if (posterImg) {
                var ratio = posterImg.width / posterImg.height;
                var dw, dh, ddx, ddy;
                if (ratio > 1) {
                    dh = posterSize * 0.85;
                    dw = dh * ratio;
                } else {
                    dw = posterSize * 0.85;
                    dh = dw / ratio;
                }
                ddx = posterX + (posterSize - dw) / 2;
                ddy = curY + (posterSize - dh) / 2;
                ctx.drawImage(posterImg, ddx, ddy, dw, dh);
            }
            ctx.restore();



            // Right side info
            var infoX = posterX + posterSize + 32;
            var infoY = curY + 24;

            // Type code (large)
            ctx.font = 'bold 56px -apple-system, sans-serif';
            ctx.fillStyle = '#1a1a1a';
            ctx.textAlign = 'left';
            ctx.fillText(type.code, infoX, infoY + 50);
            infoY += 64;

            // CN name
            ctx.font = '24px -apple-system, sans-serif';
            ctx.fillStyle = '#666';
            ctx.fillText(type.cn || '', infoX, infoY + 20);
            infoY += 40;

            // Match badge
            var simPct = type.similarity || (result.bestNormal && result.bestNormal.similarity) || 100;
            ctx.font = 'bold 16px -apple-system, sans-serif';
            var badgeText = simPct + '% MATCH';
            var tw = ctx.measureText(badgeText).width;
            ctx.fillStyle = '#edf6ef';
            ctx.beginPath();
            ctx.roundRect(infoX, infoY, tw + 28, 34, 17);
            ctx.fill();
            ctx.fillStyle = '#4d6a53';
            ctx.fillText(badgeText, infoX + 14, infoY + 23);

            curY += heroH + 24;

            // ===== Intro text =====
            ctx.font = '17px -apple-system, sans-serif';
            ctx.fillStyle = '#e67e22';
            ctx.textAlign = 'left';
            curY = wrapText(ctx, introText, pad, curY + 16, W - pad * 2, 28);
            curY += 20;

            // ===== Dims tags =====
            if (result && result.levels) {
                var levelCn = { L: '\u4f4e', M: '\u4e2d', H: '\u9ad8' };
                ctx.font = '14px -apple-system, sans-serif';
                var tagX = pad;
                var tagY = curY;
                dimensionOrder.forEach(function (dim) {
                    var name = dimensionMeta[dim].name.replace(/^[A-Za-z0-9]+\s*/, '');
                    var level = levelCn[result.levels[dim]] || result.levels[dim];
                    var tag = name + ' ' + level;
                    var tagW = ctx.measureText(tag).width + 20;
                    if (tagX + tagW > W - pad) { tagX = pad; tagY += 30; }
                    ctx.fillStyle = '#f0ebe3';
                    ctx.beginPath();
                    ctx.roundRect(tagX, tagY, tagW, 26, 13);
                    ctx.fill();
                    ctx.fillStyle = '#888';
                    ctx.fillText(tag, tagX + 10, tagY + 18);
                    tagX += tagW + 8;
                });
                curY = tagY + 44;
            }

            // ===== Separator =====
            ctx.strokeStyle = '#e8e3db';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pad, curY);
            ctx.lineTo(W - pad, curY);
            ctx.stroke();
            curY += 20;

            // ===== Watermark (free users only) =====
            if (!isPaid) {
                ctx.font = '12px -apple-system, sans-serif';
                ctx.fillStyle = '#999';
                ctx.textAlign = 'center';
                ctx.fillText('SBTI\u4eba\u683c\u6d4b\u8bd5 \u2192 sbti.jiligulu.xyz', W / 2, curY + 14);
                curY += 24;
            }

            // ===== Footer: CTA + QR =====
            ctx.font = '13px -apple-system, sans-serif';
            ctx.fillStyle = '#bbb';
            ctx.textAlign = 'left';
            ctx.fillText('\u626b\u7801\u6765\u6d4b', pad, curY + 24);
            ctx.fillText('\u4f60\u662f\u4ec0\u4e48\u4eba\u683c', pad, curY + 44);

            if (qrImg) {
                ctx.drawImage(qrImg, W - pad - 88, curY, 88, 88);
            }
            curY += 104;

            // Trim canvas to actual content
            if (curY < H) {
                var trimmed = document.createElement('canvas');
                trimmed.width = W;
                trimmed.height = curY;
                trimmed.getContext('2d').drawImage(canvas, 0, 0);
                return trimmed;
            }
            return canvas;
        });
    }

    function showShareResult(canvas, resetBtn, resetText) {
        canvasToBlob(canvas, function (blob) {
            console.log('[Share] blob:', blob ? blob.size + 'B' : 'null');
            if (!blob) {
                resetBtn.disabled = false;
                resetBtn.textContent = resetText;
                alert('\u751f\u6210\u5931\u8d25');
                return;
            }
            currentBlob = blob;
            currentFileName = 'sbti-result.png';
            sharePreview.src = URL.createObjectURL(blob);
            shareNativeBtn.style.display = (navigator.share && navigator.canShare) ? '' : 'none';
            shareModal.classList.add('active');
            resetBtn.disabled = false;
            resetBtn.textContent = resetText;
        });
    }

    // Share button
    shareBtn.addEventListener('click', function () {
        console.log('[Share] shareBtn clicked');
        window._lastCompareUrl = null;
        shareBtn.disabled = true;
        shareBtn.textContent = '\u751f\u6210\u4e2d...';

        var result = computeResult();
        var type = result.finalType;
        currentFileName = 'sbti-' + type.code + '.png';

        drawShareCard(type, result, PROD_BASE_URL, 'share').then(function (canvas) {
            showShareResult(canvas, shareBtn, '\u751f\u6210\u5206\u4eab\u56fe');
        }).catch(function (err) {
            console.error('[Share] error:', err);
            shareBtn.disabled = false;
            shareBtn.textContent = '\u751f\u6210\u5206\u4eab\u56fe';
            alert('\u751f\u6210\u5931\u8d25: ' + (err && err.message || ''));
        });
    });

    // Download
    shareDownloadBtn.addEventListener('click', function () {
        if (!currentBlob) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(currentBlob);
        a.download = currentFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Native share
    shareNativeBtn.addEventListener('click', function () {
        if (!currentBlob || !navigator.share) return;
        var file = new File([currentBlob], currentFileName, { type: 'image/png' });
        navigator.share({ title: 'SBTI \u4eba\u683c\u6d4b\u8bd5', text: '\u6765\u770b\u770b\u6211\u7684 SBTI \u4eba\u683c\u7c7b\u578b\uff01', files: [file] }).catch(function () {});
    });

    // Copy link
    var shareCopyLinkBtn = document.getElementById('shareCopyLinkBtn');
    shareCopyLinkBtn.addEventListener('click', function () {
        var url = window._lastCompareUrl || PROD_BASE_URL;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function () {
                shareCopyLinkBtn.textContent = '\u5df2\u590d\u5236\uff01';
                setTimeout(function () { shareCopyLinkBtn.textContent = '\u590d\u5236\u94fe\u63a5'; }, 1500);
            });
        } else {
            prompt('\u590d\u5236\u94fe\u63a5\uff1a', url);
        }
    });

    // Close modal
    function closeModal() { shareModal.classList.remove('active'); }
    shareModalClose.addEventListener('click', closeModal);
    shareModal.addEventListener('click', function (e) {
        if (e.target === shareModal) closeModal();
    });

    // Expose functions globally
    window.generateQR = generateQR;
    window.loadImage = loadImage;

    // Expose drawShareCard for invite use
    window._drawShareCard = drawShareCard;
    window._showShareResult = showShareResult;
})();

/* ===== 人格相性表 ===== */
var COMPATIBILITY = {
    "BOSS+IMFW": { type: "soulmate", say: "领导者带着废物飞，废物终于有靠山了" },
    "BOSS+CTRL": { type: "rival", say: "两个都想掌控全局，遥控器只有一个" },
    "SHIT+THAN-K": { type: "rival", say: "一个骂世界是屎，一个感谢世界的恩赐" },
    "CTRL+IMFW": { type: "soulmate", say: "拿捏者遇到废物，完美的操控与被操控" },
    "SEXY+Dior-s": { type: "rival", say: "尤物和屌丝，偶像剧和现实的碰撞" },
    "LOVE-R+MONK": { type: "rival", say: "多情者遇上僧人，一个要爱一个要空" },
    "GOGO+ZZZZ": { type: "rival", say: "行者冲冲冲，装死者睡睡睡，节奏完全对不上" },
    "GOGO+BOSS": { type: "soulmate", say: "一个说冲，一个说我来带路，黄金搭档" },
    "MUM+SOLO": { type: "soulmate", say: "妈妈人格治愈孤儿，最温暖的组合" },
    "MUM+FUCK": { type: "rival", say: "妈妈想照顾你，草者说别管老子" },
    "JOKE-R+DEAD": { type: "rival", say: "小丑拼命搞笑，死者纹丝不动" },
    "JOKE-R+MALO": { type: "soulmate", say: "小丑和吗喽，快乐二人组，谁也不嫌谁" },
    "OJBK+THIN-K": { type: "rival", say: "无所谓人说都行，思考者说等等我还没分析完" },
    "FAKE+IMSB": { type: "soulmate", say: "伪人的面具恰好保护了傻者的玻璃心" },
    "FUCK+MONK": { type: "rival", say: "草者要释放，僧人要清净，寺庙要炸了" },
    "OH-NO+GOGO": { type: "rival", say: "哦不人还在评估风险，行者已经出发了" },
    "ATM-er+POOR": { type: "soulmate", say: "送钱者遇到贫困者，资源精准对接" },
    "THAN-K+MUM": { type: "soulmate", say: "感恩者和妈妈，互相温暖的正能量循环" },
    "DRUNK+GOGO": { type: "soulmate", say: "酒鬼和行者，喝完就冲，冲完再喝" },
    "DRUNK+THIN-K": { type: "rival", say: "酒鬼要喝断片，思考者要保持清醒" },
    "CTRL+OJBK": { type: "rival", say: "拿捏者使出浑身解数，无所谓人毫无波澜" },
    "SEXY+LOVE-R": { type: "soulmate", say: "尤物和多情者，一个值得爱一个拼命爱" },
    "SHIT+DEAD": { type: "soulmate", say: "愤世者骂完世界，死者说：确实没意思" },
    "HHHH+JOKE-R": { type: "soulmate", say: "傻乐者和小丑，笑到最后谁也分不清谁" },
    "WOC!+OH-NO": { type: "soulmate", say: "一个喊卧槽一个喊哦不，惊叹二重奏" },
    "SOLO+DEAD": { type: "soulmate", say: "孤儿和死者，两个人安静地待在各自的世界里" },
    "IMSB+SEXY": { type: "rival", say: "傻者看到尤物直接宕机，社恐对上社牛" },
    "ZZZZ+SHIT": { type: "rival", say: "装死者躺平不动，愤世者气得跳脚" },
    "FAKE+MONK": { type: "rival", say: "伪人戴着面具社交，僧人根本不想社交" },
    "MALO+Dior-s": { type: "soulmate", say: "吗喽和屌丝，社会底层互助联盟" },
    "POOR+THIN-K": { type: "soulmate", say: "贫困者专注一件事，思考者把那件事想透" },
    "BOSS+DEAD": { type: "rival", say: "领导者要你冲，死者说我已经超脱了" },
    "IMFW+LOVE-R": { type: "soulmate", say: "废物需要被爱，多情者最会给爱" },
    "FUCK+SEXY": { type: "soulmate", say: "草者和尤物，荷尔蒙直接爆表" },
    "CTRL+MALO": { type: "rival", say: "拿捏者想管住吗喽，吗喽在树上冲你做鬼脸" },
    "WOC!+FUCK": { type: "soulmate", say: "握草人和草者，国粹文化传承二人组" }
};

function getCompatibility(codeA, codeB) {
    if (codeA === codeB) return { type: "mirror", say: "同类相遇，要么惺惺相惜，要么互相嫌弃" };
    var key1 = codeA + '+' + codeB;
    var key2 = codeB + '+' + codeA;
    return (COMPATIBILITY && COMPATIBILITY[key1]) || (COMPATIBILITY && COMPATIBILITY[key2]) || { type: "normal", say: "普通关系，相安无事" };
}

/* 渲染相性表到首页 */
(function () {
    var grid = document.getElementById('compatGrid');
    if (!grid) return;
    var typeIcons = { soulmate: '\uD83D\uDC95', rival: '\u2694\uFE0F', mirror: '\uD83E\uDE9E', normal: '\uD83E\uDD1D' };
    var typeLabels = { soulmate: '天生一对', rival: '欢喜冤家', mirror: '同类', normal: '普通' };
    var typeBg = { soulmate: '#fce4ec', rival: '#fff8e1', mirror: '#e8eaf6', normal: '#edf6ef' };
    var typeBorder = { soulmate: '#f8bbd0', rival: '#ffe082', mirror: '#c5cae9', normal: '#dbe8dd' };
    var typeColor = { soulmate: '#c62828', rival: '#b8860b', mirror: '#283593', normal: '#4d6a53' };

    Object.keys(COMPATIBILITY).forEach(function (key) {
        var parts = key.split('+');
        var c = COMPATIBILITY[key];
        var card = document.createElement('div');
        card.className = 'compat-card';
        card.innerHTML =
            '<div class="compat-pair">' +
                '<span class="compat-code">' + parts[0] + '</span>' +
                '<span class="compat-vs">\u00D7</span>' +
                '<span class="compat-code">' + parts[1] + '</span>' +
            '</div>' +
            '<span class="compat-badge" style="background:' + typeBg[c.type] + ';color:' + typeColor[c.type] + ';border:1px solid ' + typeBorder[c.type] + ';">' +
                typeIcons[c.type] + ' ' + typeLabels[c.type] +
            '</span>' +
            '<div class="compat-say">' + c.say + '</div>';
        grid.appendChild(card);
    });
})();

/* ===== 双人对比 ===== */
var CompareUtil = {
    levelToNum: { L: 0, M: 1, H: 2 },
    numToLevel: ['L', 'M', 'H'],
    encode: function (code, levels, similarity) {
        var dimStr = dimensionOrder.map(function (d) {
            return CompareUtil.levelToNum[levels[d]];
        }).join('');
        return btoa(JSON.stringify({ c: code, d: dimStr, s: similarity }));
    },
    decode: function (b64) {
        try {
            var obj = JSON.parse(atob(b64));
            var levels = {};
            dimensionOrder.forEach(function (d, i) {
                levels[d] = CompareUtil.numToLevel[parseInt(obj.d[i])];
            });
            return { code: obj.c, levels: levels, similarity: obj.s };
        } catch (e) { return null; }
    }
};

// 注册 compare screen
screens.compare = document.getElementById('compare');

function drawRadarChart(canvasId, labelsArr, dataA, dataB) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var cx = W / 2, cy = H / 2;
    var R = Math.min(cx, cy) - 50;
    var n = labelsArr.length;
    var step = (Math.PI * 2) / n;
    ctx.clearRect(0, 0, W, H);

    [1, 0.66, 0.33].forEach(function (scale) {
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var angle = -Math.PI / 2 + i * step;
            var x = cx + R * scale * Math.cos(angle);
            var y = cy + R * scale * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = '#dbe8dd';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    for (var i = 0; i < n; i++) {
        var angle = -Math.PI / 2 + i * step;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
        ctx.strokeStyle = '#dbe8dd';
        ctx.stroke();
    }

    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillStyle = '#6a786f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < n; i++) {
        var angle = -Math.PI / 2 + i * step;
        ctx.fillText(labelsArr[i], cx + (R + 30) * Math.cos(angle), cy + (R + 30) * Math.sin(angle));
    }

    function drawData(data, color, alpha) {
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var idx = i % n;
            var val = data[idx] / 3;
            var angle = -Math.PI / 2 + idx * step;
            var x = cx + R * val * Math.cos(angle);
            var y = cy + R * val * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = color.replace('1)', alpha + ')');
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    drawData(dataA, 'rgba(77, 106, 83, 1)', 0.2);
    drawData(dataB, 'rgba(192, 57, 43, 1)', 0.2);
}

function renderCompare(personA, personB) {
    var libA = TYPE_LIBRARY[personA.code] || {};
    var libB = TYPE_LIBRARY[personB.code] || {};
    document.getElementById('compareCodeA').textContent = personA.code;
    document.getElementById('compareCnA').textContent = libA.cn || '';
    document.getElementById('compareCodeB').textContent = personB.code;
    document.getElementById('compareCnB').textContent = libB.cn || '';

    var imgA = document.getElementById('compareImgA');
    var imgB = document.getElementById('compareImgB');
    imgA.src = TYPE_IMAGES[personA.code] || '';
    imgA.style.display = TYPE_IMAGES[personA.code] ? '' : 'none';
    imgB.src = TYPE_IMAGES[personB.code] || '';
    imgB.style.display = TYPE_IMAGES[personB.code] ? '' : 'none';

    var vecA = dimensionOrder.map(function (d) { return CompareUtil.levelToNum[personA.levels[d]]; });
    var vecB = dimensionOrder.map(function (d) { return CompareUtil.levelToNum[personB.levels[d]]; });
    var dist = 0;
    for (var i = 0; i < vecA.length; i++) dist += Math.abs(vecA[i] - vecB[i]);
    var similarity = Math.max(0, Math.round((1 - dist / 30) * 100));
    document.getElementById('compareSimilarity').textContent = similarity + '%';

    var comment;
    if (similarity >= 80) comment = '你俩简直是一个模子刻出来的，出生时是不是挨着？';
    else if (similarity >= 60) comment = '相似度不低，你俩应该能愉快地一起吃火锅。';
    else if (similarity >= 40) comment = '有交集也有差异，互补型选手。';
    else if (similarity >= 20) comment = '差异挺大的，但说不定这就是吸引力？';
    else comment = '你俩凑一起，可以组成一个完整的人格光谱。';
    document.getElementById('compareComment').textContent = comment;

    var compat = getCompatibility(personA.code, personB.code);
    var icons = { soulmate: '\uD83D\uDC95', rival: '\u2694\uFE0F', mirror: '\uD83E\uDE9E', normal: '\uD83E\uDD1D' };
    var labels = { soulmate: '天生一对', rival: '欢喜冤家', mirror: '同类相遇', normal: '普通关系' };
    document.getElementById('compareCompat').innerHTML =
        '<span class="compat-badge" style="font-size:14px;padding:8px 14px;">' + icons[compat.type] + ' ' + labels[compat.type] + '</span>' +
        '<div style="margin-top:8px;font-size:14px;color:#304034;">' + compat.say + '</div>';

    var shortLabels = dimensionOrder.map(function (d) {
        return dimensionMeta[d].name.replace(/^[A-Za-z0-9]+\s*/, '');
    });
    drawRadarChart('compareRadar', shortLabels, vecA.map(function(v){return v+1;}), vecB.map(function(v){return v+1;}));
    showScreen('compare');
}

// 邀请按钮 - 生成邀请分享图
document.getElementById('compareInviteBtn').addEventListener('click', function () {
    console.log('[Invite] compareInviteBtn clicked');
    var result = computeResult();
    var type = result.finalType;
    var encoded = CompareUtil.encode(type.code, result.levels, type.similarity || 100);
    var compareUrl = PROD_BASE_URL + '?compare=' + encoded;
    window._lastCompareUrl = compareUrl;

    var btn = document.getElementById('compareInviteBtn');
    btn.disabled = true;
    btn.textContent = '\u751f\u6210\u4e2d...';

    window._drawShareCard(type, result, compareUrl, 'invite').then(function (canvas) {
        window._showShareResult(canvas, btn, '\u9080\u8BF7\u597D\u53CB\u5BF9\u6BD4');
    }).catch(function (err) {
        console.error('[Invite] error:', err);
        btn.disabled = false;
        btn.textContent = '\u9080\u8BF7\u597D\u53CB\u5BF9\u6BD4';
        alert('\u751f\u6210\u5931\u8d25: ' + (err && err.message || ''));
    });
});

// URL 参数检测：如果有 compare 参数，存储并修改首页
(function () {
    var params = new URLSearchParams(window.location.search);
    var compareData = params.get('compare');
    if (!compareData) return;
    var personA = CompareUtil.decode(compareData);
    if (!personA) return;
    window._comparePersonA = personA;
    var hero = document.querySelector('.hero h1');
    if (hero) {
        var libA = TYPE_LIBRARY[personA.code] || {};
        hero.textContent = libA.cn + '\uFF08' + personA.code + '\uFF09\u9080\u8BF7\u4F60\u6765\u6D4B\uFF01';
    }
    // Auto start test for compare invite
    startTest(false);
})();

// 覆盖 showScreen：如果有对比数据，在结果页显示"查看对比"按钮
var _origShowScreen = showScreen;
showScreen = function (name) {
    _origShowScreen(name);
    if (name === 'result' && window._comparePersonA) {
        // Show "view compare" button in result actions
        var viewCompareBtn = document.getElementById('viewCompareBtn');
        if (!viewCompareBtn) {
            viewCompareBtn = document.createElement('button');
            viewCompareBtn.id = 'viewCompareBtn';
            viewCompareBtn.className = 'btn-primary';
            viewCompareBtn.textContent = '\u67e5\u770b\u4e0e\u597d\u53cb\u7684\u5bf9\u6bd4';
            viewCompareBtn.style.background = '#e74c3c';
            var actionsDiv = document.querySelector('#result .result-actions div');
            if (actionsDiv) actionsDiv.insertBefore(viewCompareBtn, actionsDiv.firstChild);
        }
        viewCompareBtn.style.display = '';
        var personA = window._comparePersonA;
        viewCompareBtn.onclick = function () {
            var myResult = computeResult();
            var personB = {
                code: myResult.finalType.code,
                levels: myResult.levels,
                similarity: myResult.finalType.similarity || 100
            };
            renderCompare(personA, personB);
            viewCompareBtn.style.display = 'none';
        };
    } else {
        var btn = document.getElementById('viewCompareBtn');
        if (btn) btn.style.display = 'none';
    }
};

document.getElementById('compareRestartBtn').addEventListener('click', function () {
    startTest(false);
});

// Compare share button - generate share image from compare page
document.getElementById('compareShareBtn').addEventListener('click', function () {
    console.log('[Compare] shareBtn clicked');
    var codeA = document.getElementById('compareCodeA').textContent;
    var codeB = document.getElementById('compareCodeB').textContent;
    var cnA = document.getElementById('compareCnA').textContent;
    var cnB = document.getElementById('compareCnB').textContent;
    var similarity = document.getElementById('compareSimilarity').textContent;

    var btn = document.getElementById('compareShareBtn');
    btn.disabled = true;
    btn.textContent = '\u751f\u6210\u4e2d...';

    // Draw a simple compare share card using Canvas
    var W = 840, H = 600;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#faf6f0';
    ctx.fillRect(0, 0, W, H);

    // Brand
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'center';
    ctx.fillText('SBTI PERSONALITY COMPARE', W / 2, 36);

    // VS layout
    ctx.font = 'bold 48px -apple-system, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'center';
    ctx.fillText(codeA, W * 0.25, 120);
    ctx.fillText(codeB, W * 0.75, 120);

    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(cnA, W * 0.25, 150);
    ctx.fillText(cnB, W * 0.75, 150);

    ctx.font = 'bold 32px -apple-system, sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.fillText('VS', W / 2, 130);

    // Similarity
    ctx.font = 'bold 72px -apple-system, sans-serif';
    ctx.fillStyle = '#4d6a53';
    ctx.fillText(similarity, W / 2, 260);

    ctx.font = '18px -apple-system, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('\u4e24\u4eba\u76f8\u4f3c\u5ea6', W / 2, 290);

    // Comment
    var comment = document.getElementById('compareComment').textContent;
    ctx.font = 'italic 16px -apple-system, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(comment, W / 2, 340);

    // Compatibility
    var compatText = document.getElementById('compareCompat').textContent;
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillStyle = '#e67e22';
    ctx.fillText(compatText, W / 2, 380);

    // Separator
    ctx.strokeStyle = '#e8e3db';
    ctx.beginPath();
    ctx.moveTo(40, 420);
    ctx.lineTo(W - 40, 420);
    ctx.stroke();

    // Footer QR
    var qrSrc = generateQR(PROD_BASE_URL);
    loadImage(qrSrc).then(function (qrImg) {
        ctx.font = '13px -apple-system, sans-serif';
        ctx.fillStyle = '#bbb';
        ctx.textAlign = 'left';
        ctx.fillText('\u626b\u7801\u6765\u6d4b', 40, 460);
        ctx.fillText('\u4f60\u662f\u4ec0\u4e48\u4eba\u683c', 40, 480);
        if (qrImg) ctx.drawImage(qrImg, W - 40 - 88, 440, 88, 88);

        // Trim
        var trimH = 540;
        var trimmed = document.createElement('canvas');
        trimmed.width = W;
        trimmed.height = trimH;
        trimmed.getContext('2d').drawImage(canvas, 0, 0);

        canvasToBlob(trimmed, function (blob) {
            if (!blob) { btn.disabled = false; btn.textContent = '\u751f\u6210\u5bf9\u6bd4\u5206\u4eab\u56fe'; return; }
            document.getElementById('sharePreview').src = URL.createObjectURL(blob);
            document.getElementById('shareNativeBtn').style.display = (navigator.share && navigator.canShare) ? '' : 'none';
            document.getElementById('shareModal').classList.add('active');
            btn.disabled = false;
            btn.textContent = '\u751f\u6210\u5bf9\u6bd4\u5206\u4eab\u56fe';
        });
    });
});

/* ===== 稀有度开关 ===== */
(function () {
    var toggle = document.getElementById('rarityToggle');
    var label = document.getElementById('raritySwitchLabel');
    var hint = document.getElementById('raritySwitchHint');
    if (!toggle) return;

    var realStatsCache = null;

    function updateBadges(useReal) {
        var cards = document.querySelectorAll('#typesGrid .type-card, #typesGridSub .type-card');
        cards.forEach(function (card) {
            var codeEl = card.querySelector('.type-card-code');
            var badgeEl = card.querySelector('.type-card-rarity');
            if (!codeEl || !badgeEl) return;
            var code = codeEl.textContent;

            if (useReal && realStatsCache) {
                var total = realStatsCache.total || 1;
                var count = (realStatsCache.types && realStatsCache.types[code]) || 0;
                var pct = (count / total * 100).toFixed(2);
                badgeEl.textContent = pct + '% (' + count + '/' + total + ')';
                badgeEl.style.background = '#e3f2fd';
                badgeEl.style.color = '#1565c0';
                badgeEl.style.border = '1px solid #90caf9';
            } else {
                var r = TYPE_RARITY[code];
                if (!r) return;
                var colors = {
                    1: { bg: '#edf6ef', color: '#6a786f', border: '#dbe8dd' },
                    2: { bg: '#e8f0ea', color: '#4d6a53', border: '#c8dccb' },
                    3: { bg: '#fff8e1', color: '#b8860b', border: '#ffe082' },
                    4: { bg: '#fce4ec', color: '#c62828', border: '#f8bbd0' },
                    5: { bg: '#ede7f6', color: '#6a1b9a', border: '#ce93d8' }
                };
                var c = colors[r.stars];
                var starStr = r.stars <= 4 ? '\u2605'.repeat(r.stars) : '\uD83D\uDC8E';
                if (code === 'DRUNK') starStr = '\uD83C\uDF7A';
                badgeEl.textContent = starStr + ' ' + r.label + '\u3000' + r.pct + '%';
                badgeEl.style.background = c.bg;
                badgeEl.style.color = c.color;
                badgeEl.style.border = '1px solid ' + c.border;
            }
        });
    }

    toggle.addEventListener('change', function () {
        var isReal = toggle.checked;
        label.textContent = isReal ? '真实稀有度' : '理论稀有度';
        hint.textContent = isReal ? '基于全站测试数据' : '切换到真实数据';
        // Sync sub toggles
        document.querySelectorAll('.rarityToggleSub').forEach(function (st) { st.checked = isReal; });
        document.querySelectorAll('.rarity-switch-label-sub').forEach(function (el) { el.textContent = isReal ? '真实稀有度' : '理论稀有度'; });
        document.querySelectorAll('.rarity-switch-hint-sub').forEach(function (el) { el.textContent = isReal ? '基于全站测试数据' : '切换到真实数据'; });

        if (isReal && !realStatsCache) {
            hint.textContent = '加载中...';
            fetch('/api/ranking')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    var types = {}; (data.list || []).forEach(function(item) { types[item.code] = item.count; }); realStatsCache = { total: data.total, types: types };
                    hint.textContent = '已有 ' + data.total + ' 人测试';
                    updateBadges(true);
                })
                .catch(function () {
                    hint.textContent = '加载失败，API 暂未就绪';
                    toggle.checked = false;
                    label.textContent = '理论稀有度';
                });
        } else {
            updateBadges(isReal);
            if (isReal && realStatsCache) {
                hint.textContent = '已有 ' + realStatsCache.total + ' 人测试';
            }
        }
    });
})();

/* ===== 结果上报到全站统计 ===== */
(function () {
    var _origShowScreenForStats = showScreen;
    showScreen = function (name) {
        _origShowScreenForStats(name);
        if (name === 'result') {
            try {
                var result = computeResult();
                fetch('/api/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: result.finalType.code })
                }).catch(function () {});
            } catch (e) {}
        }
    };
})();

/* ===== 测试彩蛋（无 MutationObserver，直接调用） ===== */

function eggOnRenderQuestion() {
    // 彩蛋 1: 第一题震撼弹
    if (!eggState.firstShake && app.currentQ === 0) {
        eggState.firstShake = true;
        var firstQ = document.querySelector('.question-paged');
        if (firstQ) {
            firstQ.classList.add('egg-shake');
            var overlay = document.createElement('div');
            overlay.className = 'egg-dim-overlay';
            document.body.appendChild(overlay);
            setTimeout(function () {
                overlay.remove();
                firstQ.classList.remove('egg-shake');
            }, 700);
        }
    }
}

function eggOnProgress(done, total) {
    // 彩蛋 3: 进度条文字
    var pt = document.getElementById('progressText');
    if (!pt) return;
    if (done === total && total > 0) {
        pt.textContent = '\u6700\u540e\u4e00\u51fb\uff01 ' + done + ' / ' + total;
    } else if (done === Math.ceil(total / 2)) {
        pt.textContent = '\u6491\u4f4f\uff01' + done + ' / ' + total;
    }

    // 彩蛋 4: 提交按钮弹动
    var sb = document.getElementById('submitBtn');
    if (sb && eggState.lastSubmitDisabled && !sb.disabled) {
        sb.classList.add('egg-bounce');
        setTimeout(function () { sb.classList.remove('egg-bounce'); }, 500);
    }
    eggState.lastSubmitDisabled = sb ? sb.disabled : true;
}

// 彩蛋 2: 酒鬼隐藏题触发（事件委托，安全）
document.addEventListener('change', function (e) {
    if (e.target.name !== 'drink_gate_q2') return;
    if (parseInt(e.target.value) === 2) {
        document.body.classList.add('egg-warm-bg');
        var testWrap = document.querySelector('.test-wrap');
        if (testWrap) {
            testWrap.classList.add('egg-wobble');
            setTimeout(function () { testWrap.classList.remove('egg-wobble'); }, 1600);
        }
        setTimeout(function () { document.body.classList.remove('egg-warm-bg'); }, 2000);
    }
});

// 彩蛋 5: 结果揭晓动效
(function () {
    var _origShowScreenEgg = showScreen;
    showScreen = function (name) {
        _origShowScreenEgg(name);
        if (name === 'result') {
            var matchBadge = document.getElementById('matchBadge');
            if (matchBadge) matchBadge.classList.add('egg-badge-pop');
            setTimeout(function () {
                if (matchBadge) matchBadge.classList.remove('egg-badge-pop');
            }, 1200);
        }
    };
})();

/* ===== 渲染副本到独立 Tab ===== */
(function () {
    // 复制人格图鉴到 tab-profiles
    var srcGrid = document.getElementById('typesGrid');
    var subGrid = document.getElementById('typesGridSub');
    if (srcGrid && subGrid) {
        subGrid.innerHTML = srcGrid.innerHTML;
        // 重新绑定展开/收起事件
        subGrid.querySelectorAll('.type-card-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                var card = toggle.closest('.type-card');
                var expanded = card.classList.toggle('expanded');
                toggle.textContent = expanded ? '收起' : '展开全文';
            });
        });
    }

    // 复制相性表到 tab-compat
    var srcCompat = document.getElementById('compatGrid');
    var subCompat = document.getElementById('compatGridSub');
    if (srcCompat && subCompat) {
        subCompat.innerHTML = srcCompat.innerHTML;
    }

    // 同步副本的稀有度开关
    document.querySelectorAll('.rarityToggleSub').forEach(function (toggle) {
        toggle.addEventListener('change', function () {
            var mainToggle = document.getElementById('rarityToggle');
            if (mainToggle) {
                mainToggle.checked = toggle.checked;
                mainToggle.dispatchEvent(new Event('change'));
            }
            // 同步副本 badge 显示
            setTimeout(function () {
                var srcGrid = document.getElementById('typesGrid');
                var subGrid = document.getElementById('typesGridSub');
                if (srcGrid && subGrid) {
                    var srcBadges = srcGrid.querySelectorAll('.type-card-rarity');
                    var subBadges = subGrid.querySelectorAll('.type-card-rarity');
                    srcBadges.forEach(function (badge, i) {
                        if (subBadges[i]) {
                            subBadges[i].textContent = badge.textContent;
                            subBadges[i].style.background = badge.style.background;
                            subBadges[i].style.color = badge.style.color;
                            subBadges[i].style.border = badge.style.border;
                        }
                    });
                }
            }, 500);
        });
    });
})();

/* ===== Paywall Button Handlers ===== */
(function () {
    // Localize paywall text
    if (!isChineseUser()) {
        var titleEl = document.getElementById('paywallTitle');
        var descEl = document.getElementById('paywallDesc');
        var btnEl = document.getElementById('paywallBtn');
        var alreadyEl = document.getElementById('paywallAlreadyPaid');
        if (titleEl) titleEl.textContent = 'Unlock Full Report';
        if (descEl) descEl.textContent = '15-dimension deep analysis + ad-free + HD share image';
        if (btnEl) btnEl.textContent = '$0.99 Unlock';
        if (alreadyEl) alreadyEl.textContent = 'I already paid';
    }
    var paywallBtn = document.getElementById('paywallBtn');
    var alreadyPaidBtn = document.getElementById('paywallAlreadyPaid');

    if (paywallBtn) {
        paywallBtn.addEventListener('click', startPayment);
    }
    if (alreadyPaidBtn) {
        alreadyPaidBtn.addEventListener('click', function () {
            if (isChineseUser()) {
                unlockPaywall();
            } else {
                checkPaidFromUrl();
            }
        });
    }

    // Auto-check payment on page load (for Stripe redirect back)
    checkPaidFromUrl();
})();
