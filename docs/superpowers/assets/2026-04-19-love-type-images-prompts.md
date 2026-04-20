---
name: LOVE TypeImages · 21 条 Midjourney/ChatHub prompts
description: 一键批量生成 LOVE 全部 21 个恋爱人格类型（20 主 + EX 兜底）的插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-19
---

# LOVE 恋爱人格图鉴·生图 Prompt 库

## ⚠️ 合规红线（必须先读）

LOVE 图片**严禁**出现以下内容：

- **真实平台/品牌 logo 或名称**：微信 / QQ / Soul / 探探 / Tinder / Bumble / 陌陌 / 小红书 / 抖音 / Instagram / TikTok / LV / Chanel / Tiffany / Cartier 等
- **真实公众人物 / 演员 / 明星 / 偶像面孔**
- **NSFW 内容**：任何裸露、性暗示、挑逗性构图（包括 `EX` 类型——走忧郁而非情色路线）
- **政治敏感画面**：国旗、党徽、红头文件、会议合影、军警制服、时政讽刺等

通用替代：`generic chat bubble UI without logos` / `blurred generic dating app interface` / `unbranded jewelry box` / `plain paper love letter` / `generic bouquet` / `Chinese handwritten love letters with illegible generic text`。

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai）订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5** 作为主模型（真人插画 + 中文情绪语义最稳）
3. 备选：**Nano Banana Pro**（editorial 风更克制，适合忧郁系）
4. 把下面的 prompt 一条条粘进去 —— **每条生成 4 张挑最好的 1 张**
5. 命名规则：`HAMRLC.png` / `BWDPFV.png` / `EX.png` … 与 `src/data/love/types.ts` 中的 `code` **严格匹配**（全大写，6 位字母；`EX` 为 2 位）
6. 放到 `src/data/love/images/` 下（首次创建目录）
7. 更新 `src/data/love/typeImages.ts` 指向这些本地图片

### 方式 2：Midjourney
- Discord 进 MJ bot 或官方 web，把 prompt 粘进 `/imagine`
- 保留末尾参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）
- Basic 套餐 20 张 GPU 额度够跑一轮，建议 Standard 留冗余给 EX 和重抽

### 方式 3：Stable Diffusion（自托管）
- Suffix 改成：`--ar 1:1`，去掉 `--v 6.1` 和 `--style raw`
- 推荐：SDXL base + editorial illustration LoRA + 一个 burgundy palette LoRA
- Steps 30 / CFG 7 / sampler DPM++ 2M Karras

### 方式 4：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数
- prompt 开头加 `Square 1:1 illustration,`
- API 参数 `size: '1024x1024'`, `quality: 'hd'`, `style: 'vivid'`

---

## 全局风格基底（所有 prompt 内嵌）

LOVE 的 21 张图放一起必须是同一个 family，区别于 GSTI（红黑）、FPI（冷蓝）、FSI（暖琥珀）、MPI（黑金）：

- **人物**：Chinese young adults（中国都市青年），22-35 岁，恋爱叙事主体
- **调色**：**deep wine red / burgundy / maroon** 背景（#4a0e0e / #5c1a1a 系） + **dusty pink 粉雾**（#d4a5a5 / #c98a8a）+ **cream 乳白 accents**（#f5e6d3 / #e8d4bf）—— 旧式情书美学 / 90 年代港式罗曼史海报
- **道具库**：unbranded handwritten love letters（可读但内容 generic）、withered roses（干枯玫瑰）、cracked porcelain hearts（裂开的瓷心）、red thread（红线）、blurred polaroids（褪色拍立得，人脸朦胧不可辨）、unbranded engagement ring boxes、empty wine glasses、lipstick marks on paper、taxi headlights in rain、neon "OPEN" signs with generic Chinese characters
- **风格**：editorial satirical Chinese magazine illustration / 《看理想》× 《ELLE》杂志内页风 / Wong Kar-wai 色调 / 诗意 + 反讽 + 荒诞 / 毒舌不卖鸡汤
- **光影**：cinematic moody lighting / warm pink-amber glow / deep burgundy shadows / occasional cream halo / rain-slicked reflections
- **比例**：1:1 正方形

> 每条 prompt 在人物描述后都会显式带上 `deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos`。

---

## 20 张主类型

### 1. `HAMRLC` 恋爱脑晚期
```
A young Chinese woman in a thin cream silk slip dress kneeling on a hardwood floor surrounded by dozens of scattered handwritten love letters and wilted dusty pink roses, one bare hand pressed against a cracked porcelain heart glowing wine red from within, her eyes wide and feverish like an addict mid-high, a half-dried tear streak on her cheek catching pink lamplight, a single thread of red string tied too tight around her ring finger turning the skin white, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `BWDPFV` 孤岛
```
A composed Chinese young woman in a cream cashmere sweater sitting alone on a burgundy velvet armchair inside a pristine apartment that resembles a fortress, a thick invisible glass wall in front of her with faint dusty pink fingerprints from visitors who gave up, her own wine glass half full on a side table with a single withered rose petal floating in it, warm amber city lights blurred outside the window but her posture turned inward, serene but unreachable expression, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `HAMRFC` 中央空调
```
A charming Chinese young man in a cream linen shirt standing at the center of a burgundy lounge surrounded by six faceless silhouettes of admirers leaning toward him from every direction, each admirer holding a different dusty pink rose with a tag, he is warmly handing a cup of tea to one while his other hand rests on another's shoulder and his eyes linger on a third in the mirror, a subtle halo of warm cream light making everyone feel chosen, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `BAMPFV` 操盘手
```
A sharp-eyed Chinese young woman in a burgundy silk blazer seated behind a large dark wood desk in a dim study, an antique chessboard in front of her with dusty pink and cream pieces mid-game, a crystal wine glass in one hand and a single unsigned love letter pinned under a brass paperweight, a wall of framed polaroids behind her showing blurred former lovers arranged like trophies, confident smirk but eyes hollow, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `HWMRLV` 暗恋教主
```
A dreamy Chinese young woman in a cream knit cardigan sitting alone by a rain-streaked window at dusk, a half-written love letter in her lap that has been started and crumpled seventeen times — crumpled paper balls scattered at her feet in dusty pink and cream — her phone face down on the table showing a generic chat interface where the draft reads only "在吗" with no send, her imagined lover appearing as a translucent silhouette sitting across from her that only she can see, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `BADPLC` 审计官
```
A meticulous Chinese young woman in a cream trench coat seated at a marble cafe table across from a blurred date silhouette, a clipboard in her hand listing generic categories like "family / finance / past" with tiny cream checkmarks and wine red crosses, a pair of reading glasses low on her nose, her untouched dusty pink rose lying flat beside an open notebook, expression polite and forensic like a bank loan officer, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `HADRPC` 清醒骑士
```
A resolute Chinese young man in a cream turtleneck and wine red coat standing in a narrow burgundy alley under a rain-soaked streetlamp, one hand holding a bouquet of dusty pink roses and the other holding a small ledger with handwritten generic notes, his eyes fixed on a distant lit apartment window but his feet rooted in place as he silently calculates, a single withered petal falling between the roses and the ledger, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `HWDPLV` 漂流瓶
```
A quietly detached Chinese young man in a loose cream linen shirt floating in a small wooden rowboat on a calm wine red lake at dusk, an unopened dusty pink glass bottle with a rolled love letter inside drifting beside him that he barely glances at, one hand trailing in the water, a gentle but uninvested smile, distant shore lights blurred in pink and cream, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `BAMRLV` 猎头
```
A decisive Chinese young woman in a structured cream coat striding across a burgundy lobby with a slim folder under her arm labeled in generic handwriting, a single dusty pink rose tucked behind her ear more like a pinned specimen than a gift, three blurred male silhouettes in the background each holding a differently colored folder waiting for her verdict, her phone in hand showing a generic contact list with cream checkmarks next to select names, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `HWMRFC` 恋爱圣体
```
A soft-eyed Chinese young woman in a flowing cream dress kneeling in a small dusty pink garden pouring water from a cracked porcelain pitcher onto wilted roses that are clearly beyond saving, her own sleeves soaked at the hem with wine red stains like old wounds, a halo of warm cream light over her head slightly tilted and dimming, a small pile of unanswered love letters beside her that she keeps writing replies to, endlessly forgiving expression, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `BADRLC` 精神洁癖
```
A poised Chinese young woman in an immaculate cream high-collared blouse standing alone in a sparse gallery-like room before a single empty pedestal labeled with a generic handwritten sign reading "the one", surrounding her on the walls are dozens of dusty pink portrait frames each crossed out with a thin wine red line, a white glove on one hand and a magnifying lens in the other, proud but isolated expression, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `HWDRLC` 猫
```
A slender Chinese young woman curled elegantly on a burgundy velvet couch in an oversized cream knit sweater, her posture feline and indifferent, a half-drunk cup of warm tea beside her and an unread love letter slid under the door behind her that she has noticed but pretends not to, a single dusty pink rose petal stuck to her bare foot like a detail she refuses to acknowledge, one eye half open watching the door, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `HAMPLC` 恋爱特种兵
```
A determined Chinese young woman in a cream blazer seated cross-legged on a burgundy hotel bed with a half-eaten wedding cake slice on one side and an open laptop on the other showing a generic spreadsheet of pink and cream cells, a dusty pink rose in her hair slightly askew, she is on a phone call mid-air-kissing her absent partner through the screen while simultaneously circling a number on a printed budget, passionate and pragmatic at once, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `BWMRFC` 恋爱海王
```
A charming Chinese young man seated at the head of a long burgundy banquet table in a cream shirt unbuttoned at the collar, three different generic phone screens glowing dusty pink in front of him with three parallel unread chat drafts, three empty chairs set for three different dates all arriving soon, a single withered rose at his own plate untouched, his smile warm to every direction yet none of it lands anywhere, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `HADPFC` 赌徒
```
A reckless Chinese young man in a wine red leather jacket over a cream t-shirt standing at a neon-lit rain-soaked street crossroads at 3 AM, a dusty pink rose in his teeth and a half-empty bottle in one hand, a blurred taxi with warm cream headlights pulling up while a different lover waits under a different lamp post, his grin pure live-in-the-moment thrill, a trail of discarded rose petals behind him marking every past stop, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `BWDRLV` 理想型收藏家
```
A quiet Chinese young man in a cream cable-knit sweater sitting alone on the edge of a burgundy bed at night, his phone in hand open to a private photo album of dozens of generic faceless silhouettes tagged with small dusty pink heart icons, a shelf above him lined with pressed flowers and ticket stubs from moments he only witnessed, never participated in, his own face lit pink by the screen with a tender but haunted look, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `HAMDLC` 占有狂
```
An intense Chinese young woman in a wine red velvet dress clutching a cream ribbon tied around her lover's blurred silhouette's wrist so tightly that the ribbon is cutting into the skin, a bouquet of dusty pink roses crushed against her chest, her eyes burning with devotion and panic simultaneously, a generic chat window floating nearby flooded with "你在哪" messages all marked unread, a broken lock and key pair at her feet, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `BWMPLC` 门当户对信徒
```
A composed Chinese young woman in a tailored cream qipao-inspired dress standing beside her fiance's blurred silhouette in front of a matching burgundy apartment door, a generic property deed scroll in her hand tied with dusty pink ribbon, a checklist of compatible categories pinned to the wall behind her with every box ticked in cream, her smile correct and measured but her pulse flat, a single unopened love letter abandoned at the doormat, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `HAWRLC` 恋爱理想主义者
```
A dreamy Chinese young woman in a flowing cream dress standing on a small burgundy balcony at dusk holding a single perfect dusty pink rose, a worn paperback romance novel open in her other hand, waiting with luminous patience for a destined lover who exists only in screenplay form, the empty street below her reflecting soft pink neon rain, a faint halo of cream light around her entirely self-generated, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `HADRLV` 独行侠
```
A solitary Chinese young man in a long wine red coat over a cream shirt walking away from a lit burgundy apartment window into the fog, a dusty pink rose dropped on the wet pavement behind him still fresh, his silhouette half dissolved into the mist, one hand in his pocket clutching an unsent goodbye note, the window behind him showing a blurred lover still waiting, moonlight catching the cream of his collar, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 兜底 1 张

### 21. `EX` 前任幽灵
```
A melancholic Chinese young woman in a cream oversized shirt sitting on the floor of a burgundy bedroom surrounded by an open cardboard box of old keepsakes — a single faded polaroid with a blurred generic face, a pressed dusty pink rose, a ticket stub with generic characters, a half-burned handwritten letter — a translucent ghostly silhouette of a former lover sitting just behind her that she can feel but not see, her new phone glowing softly in her lap with an unsent message drafted to someone else, her eyes looking forward but her heart clearly two years back, deep wine red burgundy background with dusty pink and cream accents, editorial satirical Chinese magazine illustration, no visible brand logos --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code，全大写）
mkdir -p src/data/love/images
# HAMRLC.png / BWDPFV.png / HAMRFC.png / BAMPFV.png / HWMRLV.png
# BADPLC.png / HADRPC.png / HWDPLV.png / BAMRLV.png / HWMRFC.png
# BADRLC.png / HWDRLC.png / HAMPLC.png / BWMRFC.png / HADPFC.png
# BWDRLV.png / HAMDLC.png / BWMPLC.png / HAWRLC.png / HADRLV.png / EX.png
```

**方案 A — 相对路径 import（推荐，Vite hash + 压缩）：**
```typescript
// src/data/love/typeImages.ts
import hamrlc from './images/HAMRLC.png';
import bwdpfv from './images/BWDPFV.png';
import hamrfc from './images/HAMRFC.png';
// ... 21 条 import

export const TYPE_IMAGES: Record<string, string> = {
  HAMRLC: hamrlc,
  BWDPFV: bwdpfv,
  HAMRFC: hamrfc,
  // ...
  EX: ex,
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

- **必须**：中国面孔 / 酒红底 / 粉雾 + 乳白 accent（#d4a5a5 + #f5e6d3 系）/ 正方形 / 单人为主 / 诗意反讽
- **禁止**：
  - 任何真实品牌 logo（LV / Chanel / Tiffany / Cartier / 微信 / QQ / Soul / 探探 / 小红书 / 抖音 等）
  - 任何真实社交/约会平台 UI 截图（聊天界面必须是 generic）
  - 任何 NSFW 内容 —— 包括 `EX` 也只能走忧郁系不能走暧昧系
  - 任何真实公众人物 / 演员 / 偶像面孔
  - 任何政治符号 / 国旗 / 制服 / 会议场景
  - 任何带平台名或品牌名的中文文字（love letter 内容可以是 generic 手写字，但不能出现"淘宝""花呗""分手费"这种现实关键词）
- **鼓励**：王家卫式光影、干枯玫瑰与裂瓷的意象、旧情书 + 褪色拍立得、雨夜霓虹、"爱即表演"的荒诞感

---

## 合规自检清单（每张图出图后逐条过）

- [ ] 图中所有文字/logo 都是 generic（抽象符号、无品牌可识别）
- [ ] 聊天/约会 UI 没有平台 LOGO 和真实界面元素
- [ ] 没有 NSFW / 裸露 / 挑逗性构图（含 `EX`）
- [ ] 面孔不是真实公众人物
- [ ] 主色调是 deep wine red burgundy + dusty pink + cream，没有被 MJ 带偏成纯红或粉糖系
- [ ] 人物是 Chinese young adult（22-35），不是白人面孔或儿童
- [ ] 正方形 1:1，单人为画面主体
- [ ] 情绪走"诗意 + 反讽 + 荒诞"，不是甜宠风、不是鸡汤风

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 —— 21 条 LOVE prompt（wine red / dusty pink / cream 美学） | cwjjjjj + Claude |
