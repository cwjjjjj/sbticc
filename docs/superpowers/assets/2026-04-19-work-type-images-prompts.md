---
name: WORK TypeImages · 21 条 Midjourney/ChatHub prompts
description: 一键批量生成 WORK 全部 21 个打工人类型（20 主 + 996 兜底）的插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-19
---

# WORK 打工人图鉴·生图 Prompt 库

## ⚠️ 合规红线（必须先读）

WORK 图片**严禁**出现以下内容：

- **真实中国科技/互联网公司 logo 或名称**：阿里 / 淘宝 / 天猫 / 腾讯 / 微信 / 美团 / 字节 / 抖音 / 头条 / 小米 / 华为 / 京东 / 拼多多 / 小红书 / B站 / 快手 / 滴滴 / 百度 / 网易 / 蚂蚁 / 支付宝 / 钉钉 / 飞书 等
- **真实境外科技品牌 logo**：Apple / Google / Microsoft / Meta / Amazon / Slack / Notion / Zoom / GitHub 等
- **996 加班文化标语化美化**：不要把"奋斗是福报 / 加班光荣 / 狼性文化"等字样作为正面装饰
- **政治敏感内容**：领导人 / 国旗 / 政府建筑 / 政治口号 / 地图边界等
- **真实公众人物 / 企业家 / 高管面孔**：马云 / 马化腾 / 雷军 / 张一鸣 / 黄峥 / 刘强东等
- **涉及自残、自杀、精神崩溃血腥化的画面**

通用替代：`generic tech company office` / `blurred logo wall` / `unbranded laptop` / `generic Slack-style chat interface with no logo` / `anonymous company badge lanyard` / `generic white board covered with sticky notes`。

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai）订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5** 作主模型（真人 + 中文办公场景最稳）
3. 备选：**Nano Banana Pro**（editorial 风格更克制，适合冷色调）
4. 把下面 prompt 一条条粘进去 —— **每条生成 4 张挑最好的 1 张**
5. 命名规则：`<CODE>.png`（严格对齐 `src/data/work/types.ts` 中的 `code`），例如 `NJYDJ.png` / `MYZSN.png` / `BGXIA.png` / … / `996.png`
6. 放到 `src/data/work/images/` 下（首次创建目录）
7. 更新 `src/data/work/typeImages.ts`，用相对路径 import 映射 21 个 code 到本地图

### 方式 2：Midjourney
- Discord MJ bot 或官方 web，`/imagine` 粘 prompt
- 保留 prompt 末尾参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）
- Basic 套餐 21 张够一轮，建议 Standard 留冗余

### 方式 3：Stable Diffusion（自托管）
- Suffix 改成：`--ar 1:1` 去掉 `--v 6.1` 和 `--style raw`
- 推荐：SDXL base + editorial illustration LoRA + cool-tone LoRA
- Steps 30 / CFG 7

### 方式 4：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数
- prompt 开头加 `Square 1:1 illustration,`
- API 参数 `size: '1024x1024'`, `quality: 'hd'`, `style: 'natural'`（WORK 要冷静感，不要 vivid）

---

## 全局风格基底（所有 prompt 内嵌）

WORK 的 21 张图放一起必须是同一个 family，明确区别于 GSTI（红黑）、FPI（深蓝）、FSI（暖琥珀）、MPI（金黑）：

- **人物**：Chinese urban office workers（中国都市打工人），22-40 岁，性别按类型调
- **调色**：deep charcoal / slate background（#1a2029 系）+ **steel blue accents（#4a6b82）** + **muted fluorescent green highlights（#8faa6e / 显示器荧光绿）** + 冷灰金属感
- **道具库**：fluorescent ceiling tubes（办公室条形日光灯）、unbranded mechanical keyboards、generic ceramic thermos / stainless tumblers、laminated badge lanyard（无 logo）、unbranded laptops with blurred sticker wall、sticky-note covered whiteboards、glass meeting-room partitions、empty elevator lobbies、late-night CBD skyline through window、cluttered cubicle partitions、stacked paper cups, unopened energy drink cans
- **风格**：editorial satirical Chinese magazine illustration / 三联生活周刊 × 人物杂志 内页风 / 冷感 observational 不卡通 / 参考纽约客内页插画的克制感
- **光影**：cool fluorescent overhead lighting + occasional green/blue screen glow on face + long cubicle shadows；晚班场景加一点冷蓝月光或窗外城市霓虹
- **比例**：1:1 正方形

> 每条 prompt 在人物描述后都会显式带上 `industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos`。

---

## 20 张主类型

### 1. `NJYDJ` 内卷永动机
```
A wired Chinese urban man in his late 20s in a rumpled button-down at his open-plan cubicle past 11 PM, three monitors showing spreadsheets and Gantt charts, an unopened energy drink and a half-eaten instant noodle bowl beside an unbranded mechanical keyboard, self-drawn promotion roadmap pinned to the partition, cold fluorescent tubes buzzing overhead, reflection of endless task list glowing faintly green on his glasses, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `MYZSN` 摸鱼之神
```
A relaxed Chinese urban young woman in a hoodie reclining in her ergonomic chair, one generic Slack-style chat window open on the unbranded laptop screen while a side hustle dashboard and stock app fill the second monitor, a novel held just below desk level, feet up on a pulled-out drawer, a steel blue thermos beside a plant, colleagues blurred busily in background, faint smirk, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `BGXIA` 背锅侠
```
A weary Chinese urban man in his early 30s alone in a glass meeting room after everyone else has left, staring at a whiteboard covered in sticky notes all pointing arrows toward his name circled in fluorescent green marker, an unbranded laptop open to a long email thread, his tie slightly loose, a cold cup of tea, silhouettes of coworkers walking away outside the glass, resigned tired expression, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `HSGJI` 划水冠军
```
A casually confident Chinese urban young man floating in a swim ring shaped like an office chair through a cubicle aisle that is half drawn as rippling water, unbranded laptop balanced on his lap showing a near-empty task board, colleagues treading water frantically in the background with stacks of reports, he sips from a steel blue tumbler while forwarding an email, fluorescent tubes reflected on the fake water surface, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `PUASH` 职场PUA受害者
```
A shrunken Chinese urban young woman seated across from an empty oversized swivel chair in a small manager's office, her posture apologetic, hands clasped, her own shadow cast huge and distorted on the wall behind her, a framed inspirational generic poster with a blurred slogan above, a laptop on her lap showing a self-review doc full of red-underlined self-criticism, cool fluorescent light from above carving shadows under her eyes, tear barely held back, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `GUANX` 关系户
```
A smoothly dressed Chinese urban man in his 30s in a tailored navy suit in a private karaoke-style dining booth, leaning in to light a cigarette for an older executive figure whose face is turned away, three untouched business cards fanned on the glass table beside a bottle of baijiu, his other hand silently checking his phone under the table showing a contact tree diagram, knowing half-smile, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal private-room background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `TXDGR` 天选打工人
```
A focused Chinese urban woman in her late 20s in a clean minimalist t-shirt working alone at a standing desk by a large window at dusk, a single unbranded laptop and one mechanical keyboard, a neatly organized wall of printed project drafts arranged like an art gallery, headphones on, cityscape of a generic CBD glowing in cool blue through the glass, a subtle green code reflection on her glasses, calm intense concentration, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `CYFNG` 创业疯狗
```
A manic Chinese urban young man in a wrinkled hoodie in a tiny cluttered co-working space at 3 AM, seven empty coffee cups stacked into a tower, a whiteboard exploded with flowcharts and scribbled business ideas in fluorescent green marker, two unbranded laptops running pitch decks, a single mattress on the floor behind him, feverish bloodshot eyes, typing furiously, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal garage-office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `FXLYT` 佛系老油条
```
A placid Chinese urban man in his late 30s in a faded polo shirt seated at a worn cubicle he has clearly occupied for ten years, a small bonsai and a chipped ceramic thermos beside a slow unbranded desktop, a faded calendar with the same vacation days circled every year, feet up on a box of old printed files, reading a newspaper folded neatly in front of the screen, impassive zen expression, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `SGYSJ` 甩锅艺术家
```
A theatrically innocent Chinese urban man in a crisp shirt mid-gesture in a crowded meeting room, his hand elegantly passing a fluorescent-green-glowing pot-shaped blame icon toward a colleague while his other hand points at a clean email timeline on the projected screen, his name highlighted in steel blue as only a minor contributor, colleague's stunned face, fluorescent tubes casting long dramatic shadows, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal meeting-room background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `JWFDY` 卷王辅导员
```
A fiercely caring Chinese urban woman in her early 30s in a structured blazer leading a late-night team stand-up in front of a whiteboard densely packed with OKRs and sticky notes, her three young subordinates leaning in with tired but engaged faces, she holds a steel blue thermos in one hand and a marker in the other mid-explanation, fluorescent green highlight over a key KPI, her own eye bags carefully concealed, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `FWZZZ` 氛围组组长
```
A cheerful Chinese urban young woman in a bright knit sweater in a pantry area of an office holding up a tray of unbranded bubble tea cups for her colleagues, a handmade birthday banner taped crookedly across the cabinet, balloons tied to an ergonomic chair, coworkers smiling genuinely around her, fluorescent tubes softened by paper cutout decorations, her own quarterly review sheet folded and half-hidden in her back pocket, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal pantry background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `MSFCI` 闷声发财
```
A quietly sharp Chinese urban man in his mid 30s in an unremarkable grey shirt at a tidy cubicle, an unbranded laptop shows a plain spreadsheet while a second hidden phone on his lap displays an offer letter preview and a portfolio dashboard in fluorescent green, a paper planner opened to a ten-year career map drawn in pencil, face deliberately blank as a loud colleague passes behind him, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `ZCHLI` 职场老狐狸
```
A composed Chinese urban man in his 40s in a subtle grey suit standing at a crossroads of three office corridors, three different factional groups of coworkers visible down each hallway, he nods politely to one side while his eyes flick toward another, a fox-tail shadow suggested faintly behind his feet, an unbranded badge swings at his hip, knowing half-smile, steel blue lighting on one cheek and fluorescent green on the other, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `DGPSA` 打工菩萨
```
A serene Chinese urban woman in her late 20s in a soft grey cardigan sitting cross-legged on her cubicle chair, a faint halo glow behind her head rendered in fluorescent green, three coworkers have piled small requests on her desk — a printer jam note, a handover doc, a lunch order list — she accepts them with gentle patience, her own untouched task list peeks out underneath, tea going cold in a steel blue cup, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `ZQJQI` 赚钱机器
```
A cold-eyed Chinese urban woman in her early 30s in a minimalist black top at a sparse desk, a single unbranded laptop showing a multi-currency income dashboard, a printed salary-growth chart taped to the partition slanting aggressively upward in fluorescent green, an offer-letter envelope already half-drafted beside her, her face half-lit by steel blue screen glow, mechanical precision in her posture, no decoration no personal photos, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `KLXYU` 快乐咸鱼
```
A genuinely relaxed Chinese urban young woman in a linen shirt leaving the office at exactly 6 PM sharp, tote bag slung over shoulder, unbranded laptop already closed, she waves goodbye to still-working colleagues with a light smile, elevator doors opening ahead of her reflecting cool blue evening sky, a small potted plant she waters on her desk visible behind her, her posture buoyant and unhurried, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal elevator-lobby background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `ZDDSH` 站队大师
```
A calculating Chinese urban man in his early 30s in a subtle blazer standing on a chessboard-patterned office floor, three small toy figurines representing different executive factions arranged around his feet, his hand hovers mid-move, a phone in his other hand shows two open chat threads with different VIP names blurred, fluorescent green lines trace possible alliance paths on the floor, a poker-face barely concealing strategic calculation, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `TPXFG` 躺平先锋
```
A philosophically horizontal Chinese urban young man in a plain t-shirt lying flat on his back on a bench in the office smoking area, arms crossed over his chest like a resting stone figure, an unbranded laptop powered off beside him, a half-eaten bun in wax paper, an overheard work group chat glowing faintly green on his phone screen which he pointedly ignores, pigeons on the railing behind him, overcast cool grey sky, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal rooftop background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `ZCPNZ` 职场叛逆者
```
A coolly detached Chinese urban young person in a black band t-shirt under an open shirt exiting the office building at 6:02 PM with earbuds in, unbranded laptop bag slung casually, their side-project sketchbook sticking out, colleagues still grinding visible through the ground-floor window behind them, cool blue dusk street outside with a single fluorescent green neon sign from a noodle shop, their posture unapologetic and light, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal exterior background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 隐藏 / 兜底 1 张

### 21. `996` 工贼（隐藏）
```
A hollowed-out Chinese urban office worker of indeterminate age slumped face-down over an unbranded keyboard in an otherwise empty open-plan office past 2 AM, a faint fluorescent green glow from the still-running code editor on the monitor washing over his cheek, a ghostly translucent silhouette of himself rising from his back still typing at a second laptop, stacks of takeout containers and crumpled drink cans around him, one fluorescent ceiling tube flickering dying, cool blue CBD skyline through the window, a single unread family message notification glowing on his phone, industrial cool grey and steel blue palette with muted fluorescent green accents, deep charcoal office background, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 建目录并放图（文件名严格对齐 type code）
mkdir -p src/data/work/images
# NJYDJ.png / MYZSN.png / BGXIA.png / HSGJI.png / PUASH.png
# GUANX.png / TXDGR.png / CYFNG.png / FXLYT.png / SGYSJ.png
# JWFDY.png / FWZZZ.png / MSFCI.png / ZCHLI.png / DGPSA.png
# ZQJQI.png / KLXYU.png / ZDDSH.png / TPXFG.png / ZCPNZ.png
# 996.png
```

**方案 A — 相对路径 import（推荐，Vite hash + 压缩）：**
```typescript
// src/data/work/typeImages.ts
import njydj from './images/NJYDJ.png';
import myzsn from './images/MYZSN.png';
import bgxia from './images/BGXIA.png';
// ... 21 条 import
import x996 from './images/996.png';

export const TYPE_IMAGES: Record<string, string> = {
  NJYDJ: njydj,
  MYZSN: myzsn,
  BGXIA: bgxia,
  // ...
  '996': x996,
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

- **必须**：中国办公室面孔 / 深炭灰底 / steel blue + 荧光绿 accent / 正方形 / 单人为主
- **禁止**：
  - 任何真实中国互联网/科技公司 logo（阿里/腾讯/美团/字节/小米/华为/京东/拼多多/小红书/抖音/微信/钉钉/飞书等）
  - 任何真实境外科技品牌 logo（Apple/Google/Microsoft/Meta/Slack/Notion 等）
  - 任何"奋斗是福报 / 加班光荣 / 狼性文化"等 996 正向标语文字
  - 任何政治敏感内容（领导人/国旗/政府建筑/政治口号）
  - 任何真实企业家/高管/公众人物面孔（马云/马化腾/雷军/张一鸣 等）
  - 任何自残/自杀/血腥画面
  - 主色被 MJ 带偏成红/暖黄/橘（WORK 必须是冷色系）
- **鼓励**：冷幽默、办公室道具戏剧化、"加班即荒诞"的隐喻、cool grey + 荧光绿的冷感对比

---

## 合规自检清单（每张图出图后逐条过）

- [ ] 图中所有 logo / UI 都是 generic（抽象符号、无品牌可识别）
- [ ] 没有任何真实科技公司名称可读出现
- [ ] 没有"奋斗 / 福报 / 狼性 / 加班光荣"等标语文字
- [ ] 面孔不是真实公众人物或企业家
- [ ] 主色调是 deep charcoal + steel blue + 荧光绿，没有被 MJ 带偏成暖色
- [ ] 人物是 Chinese urban office worker，不是白人面孔
- [ ] 正方形 1:1，单人为画面主体
- [ ] 与 GSTI/FPI/FSI/MPI 的家族色调有明显区分

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 —— 21 条 WORK prompt（cool-grey + steel-blue + fluorescent green 冷色办公室美学） | cwjjjjj + Claude |
