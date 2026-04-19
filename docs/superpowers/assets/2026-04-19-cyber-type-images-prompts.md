---
name: CYBER TypeImages · 21 条 Midjourney/ChatHub prompts
description: 一键批量生成 CYBER 全部 21 个网民类型（20 主 + BOT 兜底）的插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-19
---

# CYBER 赛博基因图鉴·生图 Prompt 库

## ⚠️ 合规红线（必须先读）

CYBER 图片**严禁**出现以下内容：

- **真实中国平台 UI / logo / 名称**：微博 / 知乎 / 豆瓣 / 抖音 / B站 / 小红书 / 微信 / QQ / 贴吧 / 快手 / 淘宝 / 闲鱼 / Bilibili / WeChat / Weibo / Douyin / Xiaohongshu 等
- **真实海外平台 UI / logo**：Twitter/X / Facebook / Instagram / TikTok / YouTube / Reddit / Discord 等（也要避免，防止 MJ 把它们作为默认参考）
- **真实公众人物 / 网红 / 主播 / 明星 / KOL 面孔**
- **真实表情包 / 梗图**（熊猫人、金馆长、蘑菇头、小黄脸原版等都不要出现）
- **政治相关符号 / 人物 / 事件**：任何国家领导人、政治标语、敏感地名、旗帜等
- **骚扰 / 威胁 / 暴力恐吓的视觉语言**：TROLLX / KBKING 要画成"自嘲式、喜剧式"，不要画成真的在伤害别人

通用替代：`generic dark-mode social media feed`（抽象深色信息流卡片）/ `blurred comment bubbles with illegible text`（模糊的气泡）/ `abstract emoji glyphs`（抽象表情符号，非真实 emoji）/ `generic chat UI with placeholder avatars`（灰色占位头像）/ `floating like/heart icons made of neon glow`（纯霓虹图标）。

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai）订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5** 作为主模型（对"屏幕光 + 中国面孔 + 深色夜景"最稳）
3. 备选：**Nano Banana Pro**（editorial 质感克制，不会太游戏 CG）
4. 把下面的 prompt 一条条粘进去 —— **每条生成 4 张挑最好的 1 张**
5. 命名规则：`KBKING.png` / `COCOON.png` / `HERMIT.png` … 与 `src/data/cyber/types.ts` 中的 `code` 严格匹配，全部 6 字母无特殊符号，直接存盘即可
6. 放到 `src/data/cyber/images/` 下（首次创建目录）
7. 更新 `src/data/cyber/typeImages.ts` 指向这些本地图片

### 方式 2：Midjourney
- Discord 进 MJ bot 或官方 web，把 prompt 粘进 `/imagine`
- 用下方 prompt 的末尾参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）
- Basic 套餐 20 张够跑一轮，建议升 Standard 留冗余

### 方式 3：Stable Diffusion（自托管）
- Suffix 改成：`--ar 1:1` 去掉 `--v 6.1` 和 `--style raw`
- 推荐：SDXL base + cyberpunk / editorial illustration LoRA
- Steps 30 / CFG 7，negative prompt 加 `anime, game CG, cel shading, 3D render`

### 方式 4：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数
- prompt 开头加 `Square 1:1 illustration,`
- API 参数 `size: '1024x1024'`, `quality: 'hd'`, `style: 'vivid'`

---

## 全局风格基底（所有 prompt 内嵌）

CYBER 的 21 张图放一起必须是同一个 family，与 GSTI（红黑）、FPI（冷蓝）、FSI（暖琥珀）、MPI（金黑）明确区分：

- **人物**：Chinese young adults（中国年轻人），18-35 岁，面部有一半被屏幕冷光打亮、一半淹没在黑暗里；区别于 MPI 的"都市消费者"，这一组更偏"宅在家/独处/夜间上网"的氛围
- **调色**：pure black background（#000000）+ **neon cyan（#00e5ff）+ magenta（#ff2bd6）+ acid green（#b6ff3c）** 三色霓虹，可混入少量紫 #7a2bff；禁止再出现金色或暖琥珀
- **视觉效果库**：CRT scanlines（CRT 扫描线）、screen glare / bloom（屏幕眩光）、chromatic aberration（色差边）、glitch bars、pixel noise、RGB keyboard glow、cable nests（线材缠绕）、floating neon emoji/heart/like glyphs（纯霓虹符号，非真实 emoji）、generic dark-mode feed boxes（抽象信息流卡片，文字不可辨认）、holographic HUD overlays（HUD 叠层）、fan-cooled PC light leaks
- **道具库**：dual/triple monitor setups、gaming keyboard with RGB underglow、smartphone propped on face cream jar、mechanical mouse、tangled USB cables、energy drink cans、instant noodle bowls、blackout curtains、single gooseneck desk lamp、hoodie / oversized tee / pajama
- **风格**：editorial satirical Chinese magazine illustration（新周刊 / 三联生活周刊 电子特刊内页感）+ subtle cyberpunk glow；**不是 anime、不是 game CG、不是 pixel art、不是 3D render**
- **光影**：low-key cinematic lighting, single-source screen glow on face, deep black negative space, subtle neon rim light on shoulders and fingers
- **比例**：1:1 正方形，人物半身或中景为主

> 每条 prompt 在人物描述后都会显式带上 `pure black background with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures`。

---

## 20 张主类型

### 1. `KBKING` 键盘侠本侠
```
A hunched Chinese young man in a stretched-out hoodie at 1 AM pounding a neon-cyan-backlit mechanical keyboard, face half-lit magenta by a monitor showing a generic dark-mode comment thread with illegible blurred text, veins on his typing knuckles, a cartoon neon-green speech bubble shaped like a tiny fist floating up, empty energy drink cans ringing the desk, self-parodic comedic framing not menacing, pure black background with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `COCOON` 信息茧房VIP
```
A Chinese young woman curled inside a thick blanket on a couch, phone in hand, her face wrapped in a glowing magenta-and-cyan cocoon of translucent feed cards orbiting her head like a bubble shell, each card a blurred generic dark-mode post, the outside world beyond the cocoon faded to near-invisible dark gray silhouettes, pure black background with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `HERMIT` 赛博隐士
```
A calm Chinese young man in simple cotton tee reading a long-form generic article on a single dim e-ink-style screen in an otherwise nearly dark room, a cup of tea beside the monitor, no phone visible, no notifications, a single thin cyan line of text reflecting in his glasses, monastic tidy desk, pure black background with restrained neon cyan accents and minimal magenta, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `ACTRES` 朋友圈影帝
```
A Chinese young woman in a ring-light-lit corner of a dim bedroom posing for a selfie with a perfect smile, her reflection in the phone screen showing a completely exhausted tearful version of herself, the ring light glows neon cyan and magenta, a floating HUD of retouching sliders drifts around her face, staged props — a half-eaten perfect breakfast, a prop book — visible on the bed, pure black background with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `MELONX` 吃瓜专业户
```
A Chinese young person in pajamas slouched on a sofa with a bowl of watermelon slices in lap, thumb endlessly scrolling a phone, face passively lit magenta and cyan by a stream of generic dark-mode gossip feed cards flying past the screen trail, tiny abstract neon emoji glyphs of eyes and popcorn floating around their head, absolute zero expression, pure black living room with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `MOUTHX` 互联网嘴替
```
A fired-up Chinese young woman standing and typing furiously on a laptop, a neon-cyan megaphone-shaped glow erupts from the screen projecting abstract speech-bubble glyphs outward, a crowd of tiny faceless silhouette avatars in the background nodding silently, her own mouth half-open mid-shout, self-righteous but comedic framing, pure black room with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `PICKLE` 电子榨菜依赖症
```
A Chinese young man sitting on a toilet with pants down and a rice bowl balanced on his knee while watching a phone propped against the wall, generic vertical short-video feed glowing cyan on the screen, another phone on the sink also playing something, chopsticks hovering forgotten mid-air, face blankly lit magenta, pure black bathroom with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `BOMBER` 流量核弹
```
A wild-haired Chinese young creator in a hoodie at a three-monitor setup all flashing generic dark-mode dashboards with skyrocketing abstract line charts in acid green, a ring light overhead, dozens of neon comment bubbles exploding outward from the central screen like a blast wave, keyboard and mic setup glowing, manic triumphant grin, pure black studio with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `ZOMBIE` 僵尸号
```
A Chinese young person lying flat on a bed in the dark, arm raised vertical holding a phone above their face, completely vacant dead-eyed stare, phone glow painting the face half cyan half magenta, a trail of scrolled-past generic feed cards fading upward into the darkness, slack jaw, drool-like highlight on chin, pure black bedroom with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `NPCNPC` 路人甲
```
A plain-featured Chinese young adult standing in the center of a dark room holding a phone at chest height with the screen off, no notifications, no glow, surrounded by blurred ghostly silhouettes of other people who are all hunched over glowing phones, they are the only one whose face is not lit by any screen, a single overhead cool white bulb, pure black background with distant neon cyan and magenta glow from other people's devices, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `ZENZEN` 佛系博主
```
A relaxed Chinese young person in an oversized tee sitting cross-legged on the floor with a laptop on lap, typing lazily with one hand, the other hand holding a tangerine, a single post composed on screen reading abstract generic characters about to be published with zero concern, no analytics open, a cat dozing beside them, pure black room with soft neon cyan and hint of magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `WRITER` 深夜写手
```
A solitary Chinese young writer at 3 AM at a desk with a single gooseneck lamp pooling warm light, typing into a generic minimalist text editor full of dense blurred paragraphs, a half-drunk mug of coffee, a tower of closed notebooks, the window behind them shows a dark skyline with only a few lit windows, their eyes reflect a faint cyan cursor, the publish button on screen glows magenta untouched, pure black background with restrained neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `JUDGEX` 评论区判官
```
A stern Chinese young man in a home-office chair leaning forward toward a monitor, arms crossed, a floating holographic HUD of an oversized comment box on the screen with a long essay-length reply being drafted in blurred abstract text, a tiny neon-cyan gavel glyph hovering above the send button, a wall of color-coded sticky notes behind him, pure black room with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `HOARDE` 赛博仓鼠
```
A frantic Chinese young creator surrounded by a swirling cloud of floating screenshots, half-written generic document cards, and memo bubbles, each card blurred and abstract, they are grabbing them mid-air like a hamster stuffing cheeks, desk buried under scattered tablets and sticky notes, a folder icon on the main screen labeled with generic symbols and overflowing, pure black workspace with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `TROLLX` 高级钓鱼佬
```
A mischievous Chinese young person in a hoodie with the hood up, sitting cross-legged on a gaming chair typing with a sly playful grin, a neon-cyan fishing rod glyph extends from their keyboard with a glowing magenta hook dangling into a generic dark-mode comment box below, silly cartoon framing — self-parodic prankster not menacing, tiny ripple effects spreading out of the screen, pure black room with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `BLACKH` 信息黑洞
```
A quiet Chinese young man at a desk wearing noise-canceling headphones, face half-lit cyan by a massive vertical monitor filled with densely packed blurred long-form generic text columns, a spiraling black-hole vortex glyph made of cyan and magenta light pulling floating article cards into his forehead, he never types, his hands rest still on the desk, pure black study with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `IDEALI` 理想网民
```
A composed Chinese young woman in soft-tone clothes at a tidy desk, typing a thoughtful long comment into a generic dark-mode thread, a small neon-cyan checkmark halo hovers above her screen as if fact-checking, a cup of herbal tea and an open paper book beside the laptop, the window behind her shows real daylight not darkness, balanced healthy posture, pure black room with gentle neon cyan and minimal magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `FENCER` 赛博击剑手
```
A sharp-eyed Chinese young person standing in a dark study with a laptop held like a shield, a neon-cyan rapier of light extending from the trackpad, the screen shows a dense generic rebuttal essay in blurred paragraphs with highlighted magenta quote blocks stacked as citations, books open beside them dog-eared with tabs, en-garde duelist posture, pure black room with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `JELLYF` 快乐水母
```
A cheerful Chinese young person floating weightless in a dim room as if underwater, surrounded by translucent drifting neon jellyfish-shaped chat bubbles glowing cyan and magenta, each bubble blurred with an abstract laugh glyph, they tap hearts in the air with a relaxed smile, no depth no stress, phone floats nearby playing a generic feed, pure black aquatic space with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `RENASC` 文艺复兴人
```
A multi-talented Chinese young person at a clean desk with a tablet showing a generic drawing canvas, a laptop showing blurred article text, and a paper notebook open — all balanced in frame, a pair of hiking boots sit ready by the door, a window with actual daylight behind them, confident relaxed expression, able to close the laptop at any moment, pure black interior with neon cyan and magenta glow concentrated only on the screens, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 兜底 1 张

### 21. `BOT` 赛博幽灵（兜底 / 隐藏）
```
A semi-transparent uncanny-valley synthetic figure shaped like a Chinese young adult, body dissolving into streams of neon cyan and magenta data particles flowing back into a monitor, face a smooth featureless mask with faint scanlines, a tangled mass of glowing cables plugged into the back of the neck, multiple screens surround them all showing blurred generic feeds, the chair beneath them is empty — the figure itself is what remains, eerie but editorial not horror, pure black void with neon cyan and magenta glow, CRT scanlines and subtle screen glare, editorial satirical Chinese magazine illustration, no visible brand logos, no real platform UI, no real public figures --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code，全部 6 字母，无特殊符号）
mkdir -p src/data/cyber/images
# KBKING.png / COCOON.png / HERMIT.png / ACTRES.png / MELONX.png
# MOUTHX.png / PICKLE.png / BOMBER.png / ZOMBIE.png / NPCNPC.png
# ZENZEN.png / WRITER.png / JUDGEX.png / HOARDE.png / TROLLX.png
# BLACKH.png / IDEALI.png / FENCER.png / JELLYF.png / RENASC.png
# BOT.png
```

**方案 A — 相对路径 import（推荐，Vite hash + 压缩）：**
```typescript
// src/data/cyber/typeImages.ts
import kbking from './images/KBKING.png';
import cocoon from './images/COCOON.png';
import hermit from './images/HERMIT.png';
import actres from './images/ACTRES.png';
import melonx from './images/MELONX.png';
import mouthx from './images/MOUTHX.png';
import pickle from './images/PICKLE.png';
import bomber from './images/BOMBER.png';
import zombie from './images/ZOMBIE.png';
import npcnpc from './images/NPCNPC.png';
import zenzen from './images/ZENZEN.png';
import writer from './images/WRITER.png';
import judgex from './images/JUDGEX.png';
import hoarde from './images/HOARDE.png';
import trollx from './images/TROLLX.png';
import blackh from './images/BLACKH.png';
import ideali from './images/IDEALI.png';
import fencer from './images/FENCER.png';
import jellyf from './images/JELLYF.png';
import renasc from './images/RENASC.png';
import bot from './images/BOT.png';

export const TYPE_IMAGES: Record<string, string> = {
  KBKING: kbking,
  COCOON: cocoon,
  HERMIT: hermit,
  ACTRES: actres,
  MELONX: melonx,
  MOUTHX: mouthx,
  PICKLE: pickle,
  BOMBER: bomber,
  ZOMBIE: zombie,
  NPCNPC: npcnpc,
  ZENZEN: zenzen,
  WRITER: writer,
  JUDGEX: judgex,
  HOARDE: hoarde,
  TROLLX: trollx,
  BLACKH: blackh,
  IDEALI: ideali,
  FENCER: fencer,
  JELLYF: jellyf,
  RENASC: renasc,
  BOT: bot,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images）

---

## 预算和时间估算

- **ChatHub + Seedream 4.5**：21 张 × 4 变体 ≈ 84 张出图，按套餐 $20-40/月够用
- **Midjourney**：Basic $10/月 200 GPU 分钟，21 张够跑两轮有冗余
- **时间**：熟练用户 21 条 prompt 跑完约 **1-1.5 小时**（含挑图）
- **后处理**：批量裁切 + 合规复查 30 分钟（CYBER 合规复查比其他系列更重要 —— 特别注意平台 UI 和真实头像）
- **总成本**：$20-30 + 2 小时人工 ≈ 200 元 + 半天

---

## 质量红线

- **必须**：中国年轻面孔 / 纯黑底（#000000）/ 霓虹青 + 品红主色 + 少量酸绿 / 正方形 / 屏幕冷光单光源 / editorial 杂志插画质感
- **禁止**：
  - 任何真实平台 logo / UI（微博/知乎/豆瓣/抖音/B站/小红书/微信/Twitter/Instagram/TikTok/YouTube 等）
  - 任何真实公众人物 / 网红 / 主播 / 明星面孔
  - 任何真实表情包 / 梗图 / 知名吉祥物
  - 任何政治符号 / 标语 / 敏感议题
  - 任何 anime / game CG / 像素风 / 3D 渲染（CYBER 必须是杂志插画质感）
  - 任何骚扰 / 真实血腥 / 武器指向他人的画面（TROLLX / KBKING 务必保持自嘲喜剧感）
  - 暖色调（金色 / 琥珀色）—— 那是 MPI / FSI 的专属，CYBER 一旦出现就作废
- **鼓励**：CRT 扫描线、色差边、屏幕 bloom、线材缠绕、RGB 外设、抽象霓虹符号、"人被屏幕光吞没"的孤独感、"数字化生存"的反讽

---

## 合规自检清单（每张图出图后逐条过）

- [ ] 图中所有屏幕 UI 都是抽象 generic dark-mode 卡片，没有可识别的平台 logo
- [ ] 屏幕文字都是模糊不可辨认的，没有真实中文句子 / 真实英文品牌名
- [ ] 面孔不是真实公众人物 / 网红 / 明星
- [ ] 没有出现真实表情包（熊猫人 / 金馆长 / 蘑菇头等）
- [ ] 没有政治符号 / 领导人像 / 敏感地标
- [ ] TROLLX / KBKING / MOUTHX 是喜剧化自嘲式，不是真的在攻击他人
- [ ] 主色调是 pure black + neon cyan + magenta（+ 少量 acid green / purple），没有被 MJ 带偏成暖色
- [ ] 人物是 Chinese young adult，不是白人 / 日韩 anime 面孔
- [ ] 不是 anime / 游戏 CG / 3D 渲染 —— 保持 editorial magazine illustration 质感
- [ ] 正方形 1:1，人物为画面主体

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 —— 21 条 CYBER prompt（neon cyan/magenta 赛博霓虹美学） | cwjjjjj + Claude |
