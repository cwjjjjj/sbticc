---
name: MPI TypeImages · 20 条 Midjourney/SD prompts
description: 一键批量生成 MPI 全部 20 个消费人格类型（18 主 + ZERO$ 隐藏 + MIXDR 兜底）的插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-18
---

# MPI 消费人格图鉴·生图 Prompt 库

## ⚠️ 合规红线（必须先读）

MPI 图片**严禁**出现以下内容：

- **真实平台/品牌 logo 或名称**：淘宝 / 天猫 / 京东 / 拼多多 / 抖音 / 小红书 / 快手 / 得物 / 闲鱼 / SHEIN / LV / Gucci / Chanel / Hermès / Rolex / Apple 等
- **金融关键词文字**：分期 / 信用卡 / 花呗 / 借呗 / 白条 / 借贷 / 网贷 / 贷款 / 套现 / 逾期
- **真实公众人物 / 主播 / 明星面孔**

通用替代：`generic e-commerce interface` / `livestream UI without logos` / `blurred generic credit card` / `shopping bag with no brand` / `QR code pattern` / `Chinese text stickers reading generic words only`。

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai）订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5** 作为主模型（真人插画+中文语义最稳）
3. 备选：**Nano Banana Pro**（Google 出品，editorial 风格更克制）
4. 把下面的 prompt 一条条粘进去 —— **每条生成 4 张挑最好的 1 张**
5. 命名规则：`LIVE!.png` / `2HAND.png` / `ZERO$.png` … 与 `src/data/mpi/types.ts` 中的 `code` 严格匹配（注意 `!` 和 `$` 要 URL-encode 或改文件名为 `LIVE.png` / `ZERO.png` 然后在 typeImages.ts 里 map）
6. 放到 `src/data/mpi/images/` 下（首次创建目录）
7. 更新 `src/data/mpi/typeImages.ts` 指向这些本地图片

### 方式 2：Midjourney
- Discord 进 MJ bot 或官方 web，把 prompt 粘进 `/imagine`
- 用下方 prompt 的末尾参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）
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

MPI 的 20 张图放一起必须是同一个 family，区别于 GSTI（红黑）、FPI（蓝）、FSI（暖琥珀）：

- **人物**：Chinese urban consumers（中国都市消费者），20-40 岁，区分于学生气的"青年"
- **调色**：deep black background（#0a0a0a）+ **metallic gold accents（#d4af37 / #c9a961 系）** —— 金色发票 / 收据美学
- **道具库**：generic paper receipts（白色收据纸 + 金色字）、kraft shopping bags（无 logo）、gold coins / gold bars、blurred generic credit cards、QR code patterns、generic livestream UI overlays（带 "321" 字样但不带平台名）、paper coupons、express delivery boxes（棕色瓦楞纸，无 logo）
- **风格**：editorial satirical illustration / 第一财经 × 新周刊 杂志内页风 / slight cyberpunk / consumer-culture critique
- **光影**：cinematic moody lighting / gold spotlight / deep shadows / occasional warm amber glow from phone screens
- **比例**：1:1 正方形

> 每条 prompt 在人物描述后都会显式带上 `deep black background with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text`。

---

## 18 张主类型

### 1. `LIVE!` 直播间人质
```
A young Chinese urban woman in pajamas sitting cross-legged on a bed at 2 AM, face illuminated in gold by a phone screen showing a generic livestream interface with large "321" countdown text and no brand logos, her thumb auto-tapping a payment button, glazed hypnotized eyes, empty snack wrappers around her, deep black bedroom with metallic gold accents from screen glow, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `2HAND` 二奢鉴定师
```
A sharp-eyed Chinese urban young woman in a minimalist studio at a black velvet table, holding a magnifying loupe to inspect the stitching and hardware of a generic luxury leather handbag with no visible logo, gold-tinted inspection lamp, scattered authentication certificates with gold seals and generic text, a second bag waiting in a dust bag beside her, deep black background with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `HAULX` 剁手永动机
```
An exhausted Chinese urban young person standing in the doorway of an apartment completely blocked by a mountain of brown generic cardboard delivery boxes stacked to the ceiling, packing tape and kraft shopping bags overflowing, a single gold receipt floating down like a falling leaf, overwhelmed expression, deep black hallway with metallic gold accents from apartment lights, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `CHEAP` 省钱大师
```
A focused Chinese urban young man hunched over a desk covered with three phones and a laptop all showing generic price-comparison grids, a calculator with a very long gold tape of numbers curling onto the floor, a wall collage of paper coupons pinned with gold thumbtacks, wire-rim glasses reflecting gold digits, deep black room with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `GOLDN` 黄金囤户
```
A Chinese urban middle-aged woman in a silk robe kneeling in front of an open safe filled with stacked gold bars and traditional Chinese gold bracelets and pendants, caressing one bar like a pet, a live gold price chart projected on the wall behind her glowing gold, anxious reverent expression, deep black vault room with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `SETUP` 消费降级打工人
```
A tired Chinese urban office worker in a cheap button-down shirt sitting at a cubicle desk, carefully unpacking a homemade lunch from a scratched stainless steel tiffin box, a gold-tinted price tag reading 9.9 floating above a coffee thermos, a colleague's luxury takeout bag blurred in background, resigned but steady expression, deep black office with metallic gold accents from desk lamp, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `NUBOY` 无用好物收藏家
```
A Chinese urban young woman sitting cross-legged on a wood floor surrounded by a shelf of beautifully useless objects — brass animal figurines, unlit designer candles, a film camera with no film, handmade ceramic cups, a tiny gold-plated fan — all covered in a thin gold layer of dust, her chin resting on her hand admiring them, deep black apartment with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `LUXUR` 精致中产
```
A meticulously styled Chinese urban young woman in a linen outfit sitting at a marble cafe table, perfect latte with gold foam art in front of her, a tote bag of groceries from a boutique market, but a cracked gold eggshell under the chair revealing her fragile balance, one eye glancing anxiously at a glowing gold bill receipt on the table, deep black cafe with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `BILIB` 比价大师
```
A Chinese urban young person in a hoodie at a cluttered desk with seven browser tabs open on a laptop all showing generic product listings with prices highlighted in gold, a spreadsheet printout with gold-highlighted rows taped to the wall, two phones in hand, a cup of instant noodles cooling forgotten, intense analytical expression, deep black room with metallic gold accents from multiple screens, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `FOMO+` 双11赌徒
```
A wild-eyed Chinese urban young woman in an oversized t-shirt at midnight, surrounded by a tornado of generic paper receipts and shopping cart icons, a clock on the wall showing 00:00 with gold hands, an empty cart suddenly "full" on the laptop screen, adrenaline-flushed face lit gold by the monitor, empty energy drink cans on the desk, deep black bedroom with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `GIFTR` 纪念日焦虑
```
An anxious Chinese urban young man in a jacket at a generic jewelry counter after hours, sweating under the gold spotlight, an Excel-style calendar floating behind him with multiple anniversary dates circled in gold, a saleswoman's gloved hand presenting a velvet tray of rings, his phone showing a "last year's gift" photo with a gold dotted line leading to a bigger gift this year, deep black jewelry store with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `RETRN` 退货专家
```
A matter-of-fact Chinese urban young woman in a parka dragging a cart piled with brown generic return boxes into a generic postal service counter, a gold-tinted "returns" stamp hovering mid-air, the clerk's eyebrow raised in recognition, a long paper tape of tracking numbers curling out of her pocket, deep black post office with metallic gold accents from ceiling lights, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `STEAL` 羊毛党
```
A gleeful Chinese urban young man crouched at a small desk stacked with dozens of cheap unbranded smartphones, each screen showing a generic coupon or sign-up reward interface, gold coin icons popping out of the screens, a wall grid of paper vouchers arranged like trophies, gold confetti falling around him, deep black bedroom with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `PREMM` 会员狂魔
```
A proud Chinese urban young woman standing in front of a wall completely papered with generic membership cards arranged in a grid, each card blank or with abstract gold geometric patterns, she wears them as a cape fanning out behind her, a scepter made of stacked cards in hand, regal but trapped posture, deep black room with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `FLIPR` 闲鱼倒爷
```
A shrewd Chinese urban young man in a warehouse-like bedroom half packing boxes half unboxing new arrivals, a flowchart on the wall with gold arrows showing "buy low → sell high", generic limited-edition sneakers in clear plastic sleeves stacked like inventory, he holds a gold tape dispenser like a weapon, deep black storage room with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `INSTA` 小众买手
```
A cooly detached Chinese urban young woman in an avant-garde unbranded outfit in a minimalist gallery-like apartment, holding up a strange-shaped unbranded object with reverence, a single gold nameplate on the shelf reading "你没听过" in generic hand-lettering, background shelves lined with niche imported goods in raw kraft packaging, deep black interior with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `CHAR0` 慈善式消费
```
A soft-hearted Chinese urban young woman walking home carrying three kraft bags of unwanted handmade goods from street stalls and friends' side hustles, a gold halo tilted slightly over her head, an apologetic smile, behind her a small street vendor under warm gold string lights waving thank you, her own wallet visibly emptier with a gold dust trail, deep black evening street with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `BOSSX` 老板式挥霍
```
A commanding Chinese urban woman in a tailored suit at the head of a long restaurant table gesturing "all on me", a stack of generic paper receipts piling up next to a glass of champagne, blurred generic credit card on the tray, entourage of friends clinking glasses, a gold chandelier overhead with one bulb flickering ominously, confident but slightly strained smile, deep black private dining room with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 隐藏 / 兜底 2 张

### 19. `ZERO$` 金钱绝缘体（隐藏）
```
A serene Chinese urban figure in simple undyed linen seated in lotus position on a bare wooden floor, an empty open wallet floating in front like a meditation object, a single gold coin spinning slowly above it, the room almost empty — one window, one cup of water, one gold-edged receipt blank and uncharged — monastic minimalism, soft gold dawn light, deep black background with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `MIXDR` 混合模式败家户（兜底）
```
A bewildered Chinese urban young person standing in the center of a chaotic collage of every consumer behavior at once — a livestream screen, a stack of gold bars, a pile of return boxes, a coupon wall, a luxury bag, a homemade lunchbox, a membership card fan, a niche object on a pedestal — all swirling around them in a vortex of gold receipts, arms spread in "I'm a little bit of everything" shrug, deep black background with metallic gold accents, editorial satirical Chinese magazine illustration, no visible brand logos, no financial keyword text --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code；含特殊符号的类型用 URL-safe 别名）
mkdir -p src/data/mpi/images
# LIVE!.png → LIVE.png
# 2HAND.png / HAULX.png / CHEAP.png / GOLDN.png / SETUP.png
# NUBOY.png / LUXUR.png / BILIB.png / FOMO+.png → FOMO.png
# GIFTR.png / RETRN.png / STEAL.png / PREMM.png / FLIPR.png / INSTA.png
# CHAR0.png / BOSSX.png / ZERO$.png → ZERO.png / MIXDR.png
```

**方案 A — 相对路径 import（推荐，Vite hash + 压缩）：**
```typescript
// src/data/mpi/typeImages.ts
import live from './images/LIVE.png';
import twohand from './images/2HAND.png';
import haulx from './images/HAULX.png';
// ... 20 条 import

export const TYPE_IMAGES: Record<string, string> = {
  'LIVE!': live,
  '2HAND': twohand,
  HAULX: haulx,
  // ...
  'ZERO$': zero,
  MIXDR: mixdr,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images）

---

## 预算和时间估算

- **ChatHub + Seedream 4.5**：20 张 × 4 变体 ≈ 80 张出图，按套餐 $20-40/月够用
- **Midjourney**：Basic $10/月 200 GPU 分钟，20 张够跑两轮有冗余
- **时间**：熟练用户 20 条 prompt 跑完约 **1-1.5 小时**（含挑图）
- **后处理**：批量裁切 + 合规复查 30 分钟
- **总成本**：$20-30 + 2 小时人工 ≈ 200 元 + 半天

---

## 质量红线

- **必须**：中国面孔 / 深色底 / 金色 accent（#d4af37 系）/ 正方形 / 人物为主
- **禁止**：
  - 任何真实品牌 logo（淘宝/京东/拼多多/抖音/小红书/SHEIN/LV/Gucci/Chanel/Hermès/Rolex/Apple 等）
  - 任何真实平台 UI 截图（直播间必须是 generic）
  - 任何金融关键词文字可读出现（分期/信用卡/花呗/借呗/白条/借贷/网贷/贷款/套现）
  - 任何真实公众人物 / 明星 / 主播面孔
  - 任何裸露 / 血腥 / 赌博台面文字
- **鼓励**：幽默夸张、道具戏剧化、"消费即表演"的隐喻、gold-on-black 的强对比美学

---

## 合规自检清单（每张图出图后逐条过）

- [ ] 图中所有文字/logo 都是 generic（抽象符号、无品牌可识别）
- [ ] 直播间/电商界面没有平台 LOGO 和真实 UI
- [ ] 没有"分期/信用卡/花呗/借贷/网贷"等文字
- [ ] 面孔不是真实公众人物
- [ ] 主色调是 deep black + metallic gold，没有被 MJ 带偏成红/蓝/绿
- [ ] 人物是 Chinese urban consumer，不是白人面孔
- [ ] 正方形 1:1，人物为画面主体

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 —— 20 条 MPI prompt（gold-invoice 美学） | cwjjjjj + Claude |
