---
name: FPI TypeImages · 22 条 Midjourney/ChatHub prompts
description: 一键批量生成 FPI 全部 22 个类型（20 主池 + 0POST 隐藏 + FEED? 兜底）的朋友圈人设诊断插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-18
---

# FPI 类型卡·生图 Prompt 库

**FPI = 朋友圈人设诊断（Feed Persona Index）**。本库 22 条 prompt 覆盖全部类型，统一电蓝/青色调，与 GSTI（深红）、SBTI（其他色）区隔开，构成 SBTICC 多测试矩阵的视觉辨识度。

## 用法

### 方式 1：ChatHub / Midjourney 批量（推荐）
1. 开通 Midjourney Basic（$10/月，200 GPU 分钟，22 张两轮够用）
2. Discord 进 MJ bot 房间或用官方 web
3. 把下面的 prompt 一条条粘贴到 `/imagine` —— **每条 4 张变体中挑最好的 1 张**
4. 命名规则：保存为 `FILTR.png` / `9PIC.png`（去掉 `!`）/ `EMO-R.png` 等（与 `src/data/fpi/types.ts` 的 code 对齐；`!` `?` 这种不合法文件名字符，在文件名里去掉）
5. 放到 `src/data/fpi/images/` 下（首次创建目录）
6. 更新 `src/data/fpi/typeImages.ts` 导入这些本地图片

### 方式 2：Seedream 4.5 / Nano Banana Pro（中国脸首选）
- **重要**：Midjourney 的中国脸偶尔会 drift 成日韩风或西化，如果追求"一眼中国城市青年"，推荐用 **Seedream 4.5** 或 **Nano Banana Pro** 跑。
- 把 prompt 的英文主体保留，`Chinese urban youth in his/her 20s-30s` 放到 prompt 前段并加权；
- 去掉末尾的 MJ 参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）；
- 分辨率选 1024×1024 或 2048×2048；
- 每条 prompt 跑 4 张选最好的。

### 方式 3：Stable Diffusion（自托管 / ComfyUI）
- Suffix 改成：`--ar 1:1`，去掉 `--v 6.1` 和 `--style raw`
- 推荐模型：SDXL base + 一个真人插画向 LoRA（例如 "ink illustration" / "editorial portrait" / "east asian face"）
- Steps 30 / CFG 7

### 方式 4：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数
- 在 prompt 开头加 `Square 1:1 illustration,`
- API 请求 `size: '1024x1024'`, `quality: 'hd'`, `style: 'vivid'`

## 全局风格基底（所有 prompt 内嵌）

统一视觉语言保证 22 张图放一起是一个 family：
- **人物**：Chinese urban youth in their 20s-30s（中国都市青年），几乎都握着手机 / 看屏幕 / 举自拍杆
- **调色**：dark editorial base + **electric blue / teal accent**（#0a1424 深空蓝 + #00d4ff 电蓝 + #14b8a6 青色）—— FPI "朋友圈 sky blue" 品牌色
- **道具**：smartphone / selfie stick / ring light / camera / social feed UI / 九宫格 grid（严禁复刻微信绿白气泡，遵守 §7.1 规范）
- **风格**：editorial illustration / satirical East Asian magazine cover / cinematic moody lighting
- **比例**：1:1 正方形（结果页/分享卡通吃）
- **氛围**：cyan neon glow、phone screen light on face、late night blue hour

**后缀统一**：`--ar 1:1 --v 6.1 --style raw --stylize 300`

---

## 主池 20 张（朋友圈人设）

### 1. `FILTR` 滤镜代工厂
```
A Chinese young woman in her late 20s sitting at a cluttered desk late at night surrounded by a ring light and three monitors, obsessively adjusting color curves on a single selfie for the third hour, twelve rejected versions of the same photo floating like ghost duplicates around her, empty coffee cups and pantone swatches scattered, editorial portrait, dark navy background with electric blue accent and cyan screen glow illuminating her face, satirical East Asian magazine cover style, cinematic moody lighting --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `9PIC!` 九宫格暴君
```
A Chinese urban young man in his 20s kneeling on the floor of a minimalist apartment, arranging nine printed photos into a perfect 3x3 grid with a ruler and measuring tape, a giant floating nine-grid Instagram-style frame hovering above him glowing in electric blue, discarded non-conforming photos crumpled around like rejected applicants, obsessive art-director energy, dark teal background with cyan accent, editorial illustration, satirical curator aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `EMO-R` 深夜 emo 发电机
```
A Chinese young woman in an oversized hoodie sitting alone on a bed at 2 AM, phone screen glowing cold blue on her tear-streaked face as she types a very long melancholic post, a wall clock showing 02:17, empty wine glass and a half-eaten instant noodle cup beside her, rainy window behind, dark indigo room with electric blue phone-light halo, editorial late-night illustration, cinematic sadcore mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `FLEXR` Offer 展柜
```
A Chinese young man in a crisp white shirt photographing his framed diploma, an offer letter, a trophy and business cards laid out on a marble table like an auction catalog, smartphone on a tripod capturing the still-life, hidden subtle sweat on his forehead, glass museum display case aesthetic, dark navy walls with spotlight and electric blue accent on the documents, editorial resume-as-art illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `CKIN!` 打卡 KPI
```
A Chinese urban young woman standing in front of a just-opened pastel cafe holding up her phone for a check-in shot, a giant transparent city map floating behind her dense with dozens of glowing blue location pins she has already tagged, exhausted excited expression, coffee in one hand and phone in the other, teal blue sky evening, editorial illustration of productivity-as-leisure, satirical urban lifestyle --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `3DAYS` 三天可见教主
```
A Chinese young woman holding her smartphone vertically, the screen showing a feed with posts older than three days visually locked behind a glowing electric blue padlock and chain mechanism, a ghostly trail of her own past selves fading away behind her like a disappearing history, mysterious serene expression, dark background with cyan digital lock glow, editorial illustration about curated self-erasure --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `SUBMR` 朋友圈潜水员
```
A Chinese young man wearing an old-school brass diving helmet that fully covers his head, sitting underwater in a deep ocean of glowing smartphone screens floating above him like jellyfish each showing other people's posts, he scrolls calmly with zero bubbles rising, no output only input, deep navy and teal palette, editorial surrealist illustration, cinematic underwater lighting --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `LIKER` 手滑点赞奴
```
A Chinese urban young woman lying flat on a couch at night, thumb bandaged and visibly exhausted, a trail of thousands of tiny electric-blue heart icons flying from her phone into the void, her eyes glazed over in autopilot, empty chip bag beside her, the phone screen is an infinite feed, editorial illustration of thumb-as-robot, cyan glow on face, satirical social media fatigue --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `GHOST` 已读不回幽灵
```
A translucent ghost-like Chinese young man silhouette hovering behind someone's phone reading a message with glowing blue "已读" mark visible, his figure semi-transparent and fading, no reply bubble ever appearing, dark void background with electric blue read-receipt glow, editorial supernatural illustration, lonely haunting mood, satirical social ghosting aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `COPYR` 情感转发器
```
A Chinese young woman sitting cross-legged on the floor surrounded by floating speech bubbles containing quotes from articles, song lyrics, viral posts, and other people's wisdom, she is copy-pasting them into her own phone with a blank expression, her own mouth sewn shut with a thin silver thread as metaphor, teal and cyan color blocks, editorial illustration about outsourcing emotions, satirical introspective mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `SELLR` 人形广告位
```
A Chinese young man walking down a street wearing a sandwich board covered entirely in QR codes, brand logos, product links and "限时特惠" tags, his phone in one hand already scrolling to the next pitch, friends on the sidewalk stepping aside awkwardly, dark urban night with electric blue neon signage reflecting off the QR codes, editorial satirical billboard-person illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `BABY!` 娃娃直播员
```
A Chinese young mother in her early 30s holding a phone streaming a tiny infant, every wall of the nursery plastered with hundreds of framed baby photos from birth to toddler, a ring light pointed at the crib, the mother's own face partially out of frame behind the phone, warm pastel nursery with cool electric blue phone-screen light, editorial family-livestream illustration, satirical mommy-blog aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `FURRY` 毛孩家长
```
A fluffy corgi or ragdoll cat sitting enthroned on a luxurious velvet cushion center-frame as the absolute main character, a Chinese young woman kneeling off to the side holding up snacks and a smartphone to capture the pet's perfect angle, her own face half out of frame as a servant, dark navy background with teal spotlight on the pet, editorial illustration of human-as-attendant, satirical pet-parent dynamics --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `MUKBG` 吃播显眼包
```
A Chinese young man seated at a restaurant table holding his phone in a top-down shot pose over an elaborate hotpot spread, steam rising, his chopsticks held back waiting until the photo is taken while his dining friend across looks starving, ring light clipped to the edge of the table, dark restaurant ambience with electric blue phone-screen reflection on the dishes, editorial food-first illustration, satirical mukbang aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `TRVL9` 国旗收集家
```
A Chinese urban young woman standing with a rolling suitcase in front of a giant 3x3 grid collage of nine different country landmarks each tagged with a small national flag emoji, a paper passport in one hand with many visa stamps, airport terminal blurred behind, cyan sky gradient, editorial travel-as-trophy illustration, satirical globetrotter aesthetic, electric blue accent on the flag emojis --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `BLOCK` 屏蔽狙击手
```
A Chinese young man crouched behind a desk like a sniper, one eye looking through a scope made of a smartphone camera lens, a floating panel beside him lists dozens of names being crossed off a "不给他看" block list, tactical gear replaced with a hoodie, dark war-room ambience with cyan target-reticle glow on his face, editorial privacy-warfare illustration, satirical surveillance aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `REDBK` 小红书代打
```
A Chinese young woman at a cafe typing furiously on her phone, a Xiaohongshu-style red-book-esque note template hovering in front of her with perfect tags "人均 ¥80 / 避雷提示 / 出片机位", she is copy-pasting its structure into a WeChat Moments draft, cross-platform arrow graphics, teal and electric blue palette with a subtle red accent being filtered out, editorial content-operator illustration, satirical platform-laundering mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `JUDGE` 三观广播台
```
A Chinese young man standing on a tiny podium in his living room holding a retro megaphone shaped like a smartphone, strong confident posture delivering an opinion, floating comment bubbles around him mostly empty, his cat yawning in the background unimpressed, dark backdrop with electric blue spotlight beam, editorial op-ed illustration, satirical social-pundit aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `QSLIF` 精神中产
```
A Chinese young woman in a linen dress practicing pour-over coffee beside a sunlit window with a vinyl record playing, a leather-bound book and a ceramic plate on a wooden table, the staged perfection subtly giving away its own rehearsal as she double-checks the composition on a phone tripod, muted navy and teal tones with electric blue cold morning light, editorial quality-life illustration, satirical curated-lifestyle aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `NPC-F` 朋友圈 NPC
```
A Chinese young person of ambiguous vibe standing in the middle of a crowded street, their figure rendered slightly grey and blurred as if de-prioritized by an algorithm, surrounding people rendered in sharp electric blue focus, a small system label floating above the NPC head reading "一般好友", their phone held limply at their side, editorial background-character illustration, satirical anonymous-user mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 隐藏 / 兜底 2 张

### 21. `0POST` 朋友圈坟墓
```
A quiet grey graveyard scene at dusk with a single weathered gravestone in the foreground engraved with the words "Last Post · 2021" and a small WeChat-Moments-esque icon carved into the stone, withered flowers and a dusty unused smartphone laid at the base, a Chinese young person's translucent silhouette standing far away looking at the grave, deep navy sky with faint electric blue twilight, editorial memorial illustration, satirical digital-silence aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 22. `FEED?` 内容乱码人
```
An androgynous Chinese young figure standing center-frame whose body is composed entirely of glitching emojis, broken pixels, mismatched UI icons, random food photos, scrolling text fragments and corrupt social media symbols, their face flickering between ten different personas at once, error dialog "classification failed" floating beside them, dark void background with electric blue and teal glitch glow, editorial surreal self-referential illustration, cyberpunk error aesthetic --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code，去掉 ! ? 这种非法字符）
mkdir -p src/data/fpi/images
# 把 FILTR.png / 9PIC.png / EMO-R.png / FLEXR.png / CKIN.png / 3DAYS.png
#    SUBMR.png / LIKER.png / GHOST.png / COPYR.png / SELLR.png / BABY.png
#    FURRY.png / MUKBG.png / TRVL9.png / BLOCK.png / REDBK.png / JUDGE.png
#    QSLIF.png / NPC-F.png / 0POST.png / FEED.png   共 22 张放进去
```

**方案 A — 相对路径 import（推荐，构建时 Vite 会 hash + 压缩）：**
```typescript
// src/data/fpi/typeImages.ts
import filtr from './images/FILTR.png';
import pic9  from './images/9PIC.png';
import emoR  from './images/EMO-R.png';
import flexr from './images/FLEXR.png';
import ckin  from './images/CKIN.png';
import d3days from './images/3DAYS.png';
import submr from './images/SUBMR.png';
import liker from './images/LIKER.png';
import ghost from './images/GHOST.png';
import copyr from './images/COPYR.png';
import sellr from './images/SELLR.png';
import baby  from './images/BABY.png';
import furry from './images/FURRY.png';
import mukbg from './images/MUKBG.png';
import trvl9 from './images/TRVL9.png';
import block from './images/BLOCK.png';
import redbk from './images/REDBK.png';
import judge from './images/JUDGE.png';
import qslif from './images/QSLIF.png';
import npcF  from './images/NPC-F.png';
import post0 from './images/0POST.png';
import feed  from './images/FEED.png';

export const TYPE_IMAGES: Record<string, string> = {
  FILTR: filtr,
  '9PIC!': pic9,
  'EMO-R': emoR,
  FLEXR: flexr,
  'CKIN!': ckin,
  '3DAYS': d3days,
  SUBMR: submr,
  LIKER: liker,
  GHOST: ghost,
  COPYR: copyr,
  SELLR: sellr,
  'BABY!': baby,
  FURRY: furry,
  MUKBG: mukbg,
  TRVL9: trvl9,
  BLOCK: block,
  REDBK: redbk,
  JUDGE: judge,
  QSLIF: qslif,
  'NPC-F': npcF,
  '0POST': post0,
  'FEED?': feed,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — SBTI 旧式 base64 内嵌**（不推荐，会让 JS bundle 膨胀 3MB+）

**方案 C — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images）

## 预算和时间估算

- **Midjourney**：Basic $10/月，22 张 × 4 变体 × 1 分钟 ≈ 90 GPU 分钟。Basic 200 分钟充裕。
- **Seedream 4.5 / Nano Banana Pro**（推荐中国脸）：约 ¥0.3/张，22 × 4 ≈ ¥27，两位数人民币搞定。
- **时间**：熟练用户 22 条 prompt 跑完约 **1.5-2 小时**（包括挑图）。
- **后处理**：Photoshop 批量去水印/裁切 0.5 小时。
- **总成本**：$10 或 ¥30 + 2 小时人工 ≈ 200 元 + 半个下午。

## 质量红线

- **必须**：中国都市青年面孔 / 深色底 / 电蓝 · 青色 accent / 正方形 / 人物与智能手机 / 屏幕元素为主
- **禁止**：
  - 任何可识别的真实公众人物（明星/网红）
  - 任何真实品牌 logo（微信/小红书/Instagram 等）——**严禁复刻微信绿白气泡气质**（spec §7.1）
  - 任何裸露、血腥、歧视元素
- **鼓励**：
  - 幽默夸张、戏剧化道具（自拍杆、环形灯、九宫格、屏蔽列表）
  - 一眼能看出"这是朋友圈 XX 人设"
  - 与 GSTI（深红）形成色系反差，共同构成 SBTICC 测试矩阵的视觉族谱

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 —— 22 条 MJ/ChatHub prompt（20 主池 + 0POST + FEED?） | cwjjjjj + Claude |
