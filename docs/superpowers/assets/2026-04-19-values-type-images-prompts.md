---
name: VALUES TypeImages · 21 条 Midjourney/ChatHub prompts
description: 一键批量生成 VALUES 全部 21 个活法类型（20 主 + MLC 兜底）的插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-19
---

# VALUES 活法图鉴·生图 Prompt 库

## ⚠️ 合规红线（必须先读）

VALUES 图片**严禁**出现以下内容：

- **真实政治人物 / 政党符号 / 国家领导人面孔**；任何政治口号、标语、党徽、国旗做主体
- **真实宗教人物 / 宗教神像 / 宗教仪式**（佛像、十字架、麦加、达赖等）—— "佛系"只能用抽象禅意符号（蒲团、一杯茶、一束光），不出现真实宗教造像
- **真实品牌 logo 或名称**：星巴克 / 蔚来 / 抖音 / 小红书 / Airbnb / Nike / Patagonia / Apple / Tesla / Supreme 等
- **真实公众人物 / 网红 / 明星面孔**
- **极端地缘政治指涉**：不要出现具体的边境线、签证章上的真实国旗、军警画面
- MLC（中年危机）是**隐藏兜底类型**，必须用"镜子里自己不敢看的那个眼神"这种心理隐喻表达，不出现任何真实政治/社会事件文字

通用替代：`generic passport on a table without flags` / `unbranded laptop` / `plain white coffee cup` / `abstract meditation cushion` / `unmarked hiking boots` / `plain linen shirt` / `generic apartment balcony`。

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai）订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5** 作为主模型（真人插画+中文语义最稳）
3. 备选：**Nano Banana Pro**（editorial 风格更克制）
4. 把下面的 prompt 一条条粘进去 —— **每条生成 4 张挑最好的 1 张**
5. 命名规则：`CHUANG.png` / `NOREUR.png` / `MLC.png` …… 与 `src/data/values/types.ts` 中的 `code` 严格匹配
6. 放到 `src/data/values/images/` 下（首次创建目录）
7. 更新 `src/data/values/typeImages.ts` 指向这些本地图片

### 方式 2：Midjourney
- Discord 进 MJ bot 或官方 web，把 prompt 粘进 `/imagine`
- 保留末尾参数 `--ar 1:1 --v 6.1 --style raw --stylize 300`
- Basic 套餐 20 张够跑一轮，建议升 Standard 留冗余

### 方式 3：Stable Diffusion（自托管）
- Suffix 改成：`--ar 1:1` 去掉 `--v 6.1` 和 `--style raw`
- 推荐：SDXL base + editorial illustration LoRA
- Steps 30 / CFG 7

### 方式 4：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数
- prompt 开头加 `Square 1:1 illustration,`
- API 参数 `size: '1024x1024'`, `quality: 'hd'`, `style: 'vivid'`

---

## 全局风格基底（所有 prompt 内嵌）

VALUES 的 21 张图放一起必须是同一个 family，区别于 GSTI（红黑）、FPI（蓝）、FSI（暖琥珀）、MPI（金黑）：

- **人物**：Chinese young and middle-aged adults（20-45 岁），LIFESTYLE 场景为主——阳台、书店、山野、独居公寓、机场、咖啡馆、高层窗前、郊外帐篷
- **调色**：**muted sage green（#8ea68a / #a4b89a）+ mustard yellow（#c9a147 / #d8b866）+ warm terracotta（#b86f5a / #a85a44）** 三色，铺在 **dark olive / forest background（#1e2a1c / #27331f）** 上 —— 哑光杂志封面美学
- **道具库**：generic passport without flags, unbranded linen shirt, enamel mug, hiking backpack, potted snake plant, bonsai, reading lamp, paperback books, wool throw, balcony tomato plant, ceramic teapot, cheap folding stool, office paperwork pile, open laptop showing abstract spreadsheet, generic ID photo, unmarked suitcase, empty notebook
- **风格**：editorial satirical Chinese magazine illustration / 单向街 × 新周刊 × 人物杂志 内页风 / quiet critique of life philosophy / slight grain texture
- **光影**：soft diffused daylight / single warm terracotta spotlight / muted shadow / occasional mustard lamp glow / matte film grain finish
- **比例**：1:1 正方形

> 每条 prompt 在人物描述后都会显式带上 `muted sage green, mustard yellow and warm terracotta palette on dark olive forest background, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery`。

---

## 20 张主类型

### 1. `CHUANG` 创业永动机
```
An over-caffeinated Chinese man in his early 30s in a wrinkled linen shirt pacing in front of a sage green whiteboard covered with mustard yellow sticky notes of failed project names crossed out and a fresh terracotta marker circle labeled "IDEA #4" with exclamation marks, three empty enamel coffee mugs on the floor, an unbranded laptop open on a folding stool, bloodshot eyes shining with irrational optimism, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `NOREUR` 精神北欧人
```
A relaxed Chinese young woman in a mustard yellow cable-knit sweater lying in a sage green hammock on a rooftop balcony with potted plants, holding a ceramic mug of tea steaming in soft diffused light, a paperback of generic Scandinavian poetry face-down on her stomach, airpods-like earbuds unbranded, feet bare, a small mustard lamp glowing on a side table, content untroubled half-smile, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `SHOUHU` 守护者
```
A warm reliable Chinese woman in her 30s in a terracotta apron standing at the center of a cozy home kitchen holding a bowl of soup while on her phone wedged between ear and shoulder, behind her a sage green fridge covered with sticky-note reminders for aging parents medical appointments and kids school events, a mustard yellow to-do list taped to the cabinet stretching onto the floor, tired but uncomplaining smile, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `MOMAHU` 差不多先生
```
A placid Chinese office worker in his 30s in a slightly wrinkled mustard yellow shirt sitting on a sage green sofa at home, eating instant noodles from a plain bowl while a generic variety show plays on a muted TV, a half-finished book and half-completed model kit on the coffee table, a terracotta mug with a chip, comfortable expression that says "good enough", soft everyday diffused light, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `XIAOSA` 数字游民
```
A Chinese young woman in loose linen clothes sitting cross-legged on a wooden deck of a tropical bungalow, an unbranded laptop on her knees showing abstract code, a coconut with a mustard yellow paper straw beside her, a sage green backpack leaning against the bamboo wall, terracotta hammock in the blurred background, sun-bleached hair and a tan, looking content but a single passport without flag sticking out of the bag, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `GAOFEI` 高级废物
```
A stylish Chinese young man in his late 20s in an expensive unbranded terracotta cardigan sprawled on a sage green velvet sofa in a tastefully decorated apartment lined with bookshelves of philosophy and art books, a glass of natural wine in hand, a chess set half-played, an abandoned easel in the corner, looking up at the ceiling with the expression of someone who read too much to bother doing anything, mustard yellow reading lamp glowing softly, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `JIZHUA` 精神中产
```
A meticulously groomed Chinese woman in her early 30s in a sage green trench coat taking a carefully framed selfie on a trendy cafe terrace, a mustard yellow latte with generic foam art in front of her, a stack of unbranded art magazines beside her, a tote bag of farmers market vegetables, but if you look closely a terracotta credit card bill peeking out of her wallet on the table, performative poise, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `KUAIFE` 快乐废物
```
A blissed-out Chinese young person in oversized terracotta pajamas sprawled face-up on a single bed in a small messy apartment, holding a paper cup of cheap milk tea with a mustard yellow straw, a phone above the face playing a generic sitcom, empty snack wrappers scattered on a sage green blanket, a potted plant drooping happily on the windowsill, genuine unbothered grin, soft lazy afternoon light, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `JIUPIN` 极简主义者
```
A composed Chinese figure in undyed sage green linen sitting on a bare wooden floor of an almost empty apartment, one folded wool throw, one ceramic cup of water, one potted snake plant, one mustard yellow paperback on the floor, white walls, a single terracotta cushion as the only color accent, soft window light casting long rectangular shadows, serene but slightly austere expression, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `WENZHU` 稳住老哥
```
A prematurely mature Chinese man around 25 in a plain sage green sweater at a tidy home desk with a mustard yellow reading lamp, carefully writing in a ledger-style notebook with columns labeled "retirement" and "index funds" in generic handwriting, a terracotta mug of plain water, a small indoor bonsai, a wall calendar with dates circled in neat grid, wire-rim glasses and the serious expression of a 55-year-old, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `MOGUI` 搞钱魔鬼
```
A sharp-suited Chinese woman in her early 30s wearing a terracotta blazer over a sage green shirt sitting at a window of a high-rise apartment at dusk, three phones fanned on the desk showing generic spreadsheets with mustard yellow growth arrows, an unbranded laptop open on abstract charts, WeChat-style chat bubbles blurred, her jaw tight calculating ROI on everything including her relationships, city skyline at golden hour behind her, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `JUANZH` 卷王之王
```
An exhausted but wired Chinese young man in a sweaty sage green workout shirt in a cluttered studio apartment doing three things at once — headphones playing a podcast, an unbranded laptop open on a spreadsheet, a textbook on the floor, a mustard yellow thermos of cold coffee, a wall clock showing 5 AM, resistance bands on the desk, a terracotta analog timer halfway through another pomodoro, dark circles under wide-open driven eyes, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `RUNXUE` 润学家
```
A resolute Chinese young woman in a sage green trench coat standing alone in a generic airport terminal at dawn, pulling an unmarked mustard yellow suitcase, a plain passport without flag in hand, a terracotta boarding pass tucked into the cover, departure board behind her showing abstract unlabeled city codes, glancing back once over her shoulder with a complicated mix of relief and homesickness, soft morning light through tall windows, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `DULANR` 独狼
```
A solitary Chinese figure in a terracotta windbreaker hiking alone on a foggy mountain trail at dawn, an unmarked sage green backpack on shoulders, a mustard yellow enamel mug clipped to the strap, no phone, no earphones, just the weight of their own thoughts, self-sufficient posture showing neither loneliness nor longing for company, the trail stretching into mist ahead, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `QINGXN` 人间清醒
```
A quietly observant Chinese person in their late 20s in a plain sage green shirt sitting alone at a corner table of a neighborhood teahouse, a ceramic teapot with mustard yellow chrysanthemum tea, a paperback left face-down, watching other tables of arguing couples and loud drunks with detached analytical eyes but saying nothing, a terracotta teacup halfway to the lips, the half-smile of someone who figured it all out at 25 and has nothing to add, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `GANGJN` 杠精之王
```
A verbally combative Chinese young man in a terracotta plaid shirt at a hotpot dinner table mid-argument, one hand raised in the classic "actually" gesture, his mouth open mid-rebuttal, the six friends around the table rolling their eyes or looking down at phones, a half-eaten plate of food and a mustard yellow beer bottle in front of him, a thought bubble of logical fallacy diagrams floating above his head, sage green restaurant walls, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `FOXIAN` 佛系真人
```
A genuinely unbothered Chinese person in their late 20s in a loose sage green linen tunic sitting in lotus position on a plain mustard yellow cushion on a wooden balcony overlooking generic rooftops, a single bonsai tree and a ceramic teacup beside them, eyes half closed not in sleep but in actual equanimity, no religious statues or symbols anywhere, just a terracotta incense holder with a single curl of smoke, morning sunlight warming the face, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `CUNGOU` 存够就跑
```
A stoic Chinese office worker in a plain sage green shirt at a beige cubicle desk, punching numbers into a calculator with a very long mustard yellow paper tape curling onto the floor, a pinned handwritten target number on a sticky note shielded with a hand from colleagues, an unbranded lunchbox of cold rice, a terracotta envelope marked "escape fund" tucked in the desk drawer, expression of someone counting down the days, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `KAOGON` 考公战士
```
A determined Chinese young woman in a plain sage green sweatshirt at a bare study desk at 1 AM, stacks of thick generic exam-prep textbooks in mustard yellow covers beside her, a wall behind her covered in handwritten vocabulary and logic problems on white paper, a terracotta thermos of strong tea, a generic unmarked ID photo on the desk for a future application, dark circles under her eyes but disciplined posture, single desk lamp carving out the only lit spot in a dark apartment, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `JIAOQI` 焦虑制造机
```
A sleepless Chinese person in their 30s in a wrinkled terracotta t-shirt sitting up in bed at 3 AM, an unbranded laptop open on abstract retirement-calculator spreadsheets, a phone in the other hand showing a generic real-estate price chart, a mustard yellow lamp glowing, sage green sheets twisted from tossing, a notebook full of worry lists on the blanket, forehead lined with the arithmetic of "is this enough", dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 隐藏 / 兜底 1 张

### 21. `MLC` 中年危机（隐藏兜底）
```
A Chinese man in his mid-40s in a plain sage green shirt standing in front of a bathroom mirror late at night, shaving foam half-applied to one cheek, the razor lowered, locking eyes with his own reflection with the expression of someone who just realized he cannot remember why he chose this life, a mustard yellow light flickering overhead, a terracotta towel on the counter, a wedding ring on the sink, no sound, no tears, just the quiet devastation of an unspoken question, dark olive forest background with muted sage green mustard yellow and warm terracotta palette, editorial satirical Chinese magazine illustration, no visible brand logos, no political slogans, no religious imagery --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code）
mkdir -p src/data/values/images
# CHUANG.png NOREUR.png SHOUHU.png MOMAHU.png XIAOSA.png
# GAOFEI.png JIZHUA.png KUAIFE.png JIUPIN.png WENZHU.png
# MOGUI.png  JUANZH.png RUNXUE.png DULANR.png QINGXN.png
# GANGJN.png FOXIAN.png CUNGOU.png KAOGON.png JIAOQI.png
# MLC.png
```

**方案 A — 相对路径 import（推荐，Vite hash + 压缩）：**
```typescript
// src/data/values/typeImages.ts
import chuang from './images/CHUANG.png';
import noreur from './images/NOREUR.png';
import shouhu from './images/SHOUHU.png';
// ... 21 条 import

export const TYPE_IMAGES: Record<string, string> = {
  CHUANG: chuang,
  NOREUR: noreur,
  SHOUHU: shouhu,
  // ...
  MLC: mlc,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images）

---

## 预算和时间估算

- **ChatHub + Seedream 4.5**：21 张 × 4 变体 ≈ 84 张出图，按套餐 $20-40/月够用
- **Midjourney**：Basic $10/月 200 GPU 分钟，21 张够跑两轮有冗余
- **时间**：熟练用户 21 条 prompt 跑完约 **1-1.5 小时**（含挑图）
- **后处理**：批量裁切 + 合规复查 30 分钟
- **总成本**：$20-30 + 2 小时人工 ≈ 200 元 + 半天

---

## 质量红线

- **必须**：中国面孔 / 深橄榄背景 / sage+mustard+terracotta 三色 / 正方形 / 人物为主 / LIFESTYLE 场景（非工位）
- **禁止**：
  - 任何真实政治人物 / 政党符号 / 国家领导人
  - 任何真实宗教人物 / 宗教造像 / 宗教仪式（佛像、十字架、麦加、达赖、师父造型等）
  - 任何真实品牌 logo（星巴克/蔚来/抖音/小红书/Airbnb/Nike/Patagonia/Apple/Tesla/Supreme 等）
  - 任何真实公众人物 / 网红 / 明星面孔
  - 任何政治口号 / 标语 / 党徽 / 国旗做主体
  - 任何极端地缘政治符号、真实签证章的国旗
  - 裸露 / 血腥 / 赌博台面文字
- **鼓励**：安静的人生哲学戏剧化、LIFESTYLE 道具的隐喻（阳台植物、机场、蒲团、山路、账本）、sage + mustard + terracotta on dark olive 的哑光杂志美学

---

## 合规自检清单（每张图出图后逐条过）

- [ ] 图中所有文字/logo 都是 generic（抽象符号、无品牌可识别、无政治标语）
- [ ] 没有真实政治人物 / 党徽 / 国旗做主体 / 真实签证章
- [ ] 没有真实宗教造像（佛像、十字架等）—— 禅意用抽象符号替代
- [ ] 没有真实品牌 logo
- [ ] 面孔不是真实公众人物
- [ ] 主色调是 dark olive forest + sage green + mustard yellow + warm terracotta，没有被 MJ 带偏成红/蓝/金
- [ ] 人物是 Chinese young / middle-aged adult（20-45 岁），LIFESTYLE 场景
- [ ] 正方形 1:1，人物为画面主体
- [ ] MLC 这张是"镜子里自己"的心理隐喻，不是社会事件

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 —— 21 条 VALUES prompt（sage + mustard + terracotta 活法美学） | cwjjjjj + Claude |
