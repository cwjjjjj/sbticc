---
name: GSTI TypeImages · 42 条 Midjourney/SD prompts
description: 一键批量生成 GSTI 全部 42 个类型（男池 20 + 女池 20 + UNDEF + HWDP）的插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-18
---

# GSTI 类型卡·生图 Prompt 库

## 用法

### 方式 1：Midjourney 批量（推荐）
1. 开通 Midjourney Basic（$10/月，200 GPU 分钟，40 张差不多够用两轮）
2. Discord 进 MJ bot 房间或用官方 web
3. 把下面的 prompt 一条条粘贴到 `/imagine` —— **每条 4 张变体中挑最好的 1 张**
4. 命名规则：保存为 `M_GOLD.png` / `F_PHNX.png` 等（与 `src/data/gsti/types.ts` 中的 code 匹配）
5. 放到 `src/data/gsti/images/` 下（首次创建目录）
6. 更新 `src/data/gsti/typeImages.ts` 导入这些本地图片

### 方式 2：Stable Diffusion（自托管 / ComfyUI）
- Suffix 改成：`--ar 1:1` 去掉 `--v 6.1` 和 `--style raw`
- 推荐模型：SDXL base + 一个真人插画向 LoRA（例如 "ink illustration" / "editorial portrait"）
- Steps 30 / CFG 7

### 方式 3：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）
- 在 prompt 开头加 `Square 1:1 illustration,`
- API 请求 `size: '1024x1024'`, `quality: 'hd'`, `style: 'vivid'`

## 全局风格基底（所有 prompt 内嵌）

统一视觉语言保证 40 张图放一起是一个 family：
- **人物**：Chinese urban youth（中国都市青年），避免白人面孔
- **调色**：deep black background + dark red accent（#0a0a0a + #dc2626 系）——与 SBTI/GSTI 品牌色一致
- **风格**：editorial illustration / Chinese magazine / satirical / slightly cyberpunk
- **光影**：cinematic moody lighting / red neon glow
- **比例**：1:1 正方形（结果页/分享卡通吃）

---

## 男池 20 张（M_*，画成女性刻板物种——反差核心）

> 男用户测出这些——荒诞张力来自"他是一个男的却是..."

### 1. `M_GOLD` 挖金壮男
```
A muscular Chinese young man in a tailored suit sitting at a velvet-covered desk, holding a calculator and a gold bar, staring at a pile of diamond rings and credit cards with a calculating grin, chandelier and luxury hotel lobby blurred behind, gold coins raining from above, dark red and gold palette, editorial illustration, cinematic moody lighting, satirical Chinese magazine cover style --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `M_HUBY` 纯享娇夫
```
A young Chinese man wearing a pink frilly apron over a silk shirt, pearl necklace, fluffy slippers, sitting on a marble kitchen counter of a luxury apartment, holding a latte with heart foam art and a designer handbag beside him, soft pastel pink with dark red accents, morning sunlight through floor-to-ceiling windows, editorial illustration satirical East Asian style --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `M_GTEA` 绿茶公
```
A handsome Chinese young man with innocent doe eyes and a subtle smirk, holding three green milk tea cups each labeled with a different girl's name in cute handwriting, soft lighting reveals calculating shadow on half of his face, pale green and dark red palette, sweet but suspicious atmosphere, Chinese editorial illustration, cinematic --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `M_WHIT` 傻白男
```
A goofy Chinese young man with an earnest bright smile, sunflower in hand, wearing a plain white T-shirt, oblivious to a pickpocket behind him reaching into his pocket, yellow halo behind head, warm naive lighting with harsh red shadows, editorial satirical illustration, East Asian comic style --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `M_FBRO` 扶妹魔
```
An exhausted Chinese young man bent under an enormous mountain of shopping bags and gift boxes stamped with Chinese characters 姐 and 妹, his own pockets turned inside-out empty, a crown of sacrifice floating above his head, warm cold split lighting, sepia and dark red palette, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `M_SAIN` 圣母公
```
A Chinese young man in a long ethereal white robe with a halo above his head, hands outstretched to heal a crowd of people whispering complaints around him, his own face secretly exhausted beneath a serene mask expression, dark cathedral lighting with red glow, religious pastiche but modern urban, editorial satirical illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `M_MALK` 雄竞精
```
A Chinese young man in a tight muscle shirt in a gym locker room, flexing biceps while comparing to a larger muscle poster of another man on the wall, measuring tape dangling, dumbbells stacked, angry competitive glare, dramatic red backlighting, cynical sports magazine style editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `M_TEAM` 茶艺男
```
A sly Chinese young man in a humble gray hoodie pouring green tea from an elegant teapot, tiny abacus beads floating out of the spout counting favors, his face wearing an "I'm just a simple honest guy" mask but eyes sharp, warm tea steam with red tint, dim cafe interior, editorial satirical illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `M_BABY` 巨婴弟
```
An adult Chinese young man wearing an oversized pacifier and baby bib over a hoodie, sitting cross-legged on the floor holding up his phone helplessly asking "what should I eat" to an unseen girlfriend, giant milk tea bottle beside him, pastel pink nursery aesthetic with red warning glow, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `M_CTRL` 监控型男友
```
A Chinese young man hunched over a laptop in a dark bedroom, screen showing a live GPS map with a red pin tracking a girlfriend's location, multiple phone screens open to her social media, his eyes glowing red from monitor light, sinister but pitiful, surveillance thriller mood, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `M_MOON` 白月光哥哥
```
A Chinese young man in a light linen shirt standing alone under moonlight on a balcony, peach blossom petals falling, translucent ex-girlfriend silhouettes as soft ghost figures gazing at him longingly from afar, his expression polite and distant, dreamy pale moon and deep red gradient sky, editorial romantic illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `M_PRNC` 奶油王子病
```
An adult Chinese young man wearing a pastel prince outfit with pouting lips, being hand-fed strawberries by multiple tired hands, glittery crown slipping off his head, surrounded by cracked decorative mirrors reflecting his vanity, rose gold and dark red palette, satirical fairytale editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `M_DRAM` 作精小王子
```
A Chinese young man melodramatically weeping behind one hand while his other thumb aggressively deletes contacts on a smartphone, crystal droplet tears, tissues scattered everywhere, neon red drama mask icon floating overhead, dim bedroom with one desk lamp lit, theatrical editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `M_SOFT` 奶油大哥
```
A Chinese young man with a soft gentle smile and fluffy cream colored sweater, hands behind his back hiding a stack of unpaid IOU notes and bills, friends in the background look at him with growing suspicion, powder pink palette with red shadows, editorial illustration with noir twist --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `M_PHNX` 凤凰公
```
A Chinese young man half-silhouetted rising from phoenix flames wearing a cheap aspirational suit, one hand clutching a family demand list labeled "brother wife" "sister car" "parents house" in Chinese, ash and embers flying, red and golden flames against a dark sky, mythological urban editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `M_FANC` 饭圈弟弟
```
A Chinese young man kneeling in a room wallpapered with idol posters of a female celebrity, holding up a glowing lightstick and fan merch like offerings, a dusty photo of his real girlfriend on the dresser ignored, pale pink fan army aesthetic meets lonely red ambient light, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `M_HOTG` 男网红
```
Split frame portrait of a Chinese young man: left half heavily filtered angel face perfect influencer selfie lit by ring light, right half un-filtered tired real face with dark eye circles looking in a hand mirror, phone vs mirror confrontation, pink neon and harsh red studio light, editorial satire illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `M_SCHM` 心机弟弟
```
A calm Chinese young man in a sleek black turtleneck sitting at a Go chess board, pieces arranged in a grandmaster endgame, shadowy figures of defeated rivals slumped around the table, subtle smirk on his face, single red spotlight from above, noir thriller aesthetic, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `M_WLOT` 白莲兄弟
```
A Chinese young man with tearful wet eyes looking upward innocently, one hand on heart, a lotus flower in the background cracking to reveal a theatrical mask, signaling he is performing victimhood, pastel white and blue aesthetic undercut by red spotlight, stage acting vibes, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `M_HOOK` 钩子公
```
A charismatic Chinese young man sitting alone in a dimly lit bar holding red strings that extend from his fingers to multiple blurred female silhouettes in the distance, each woman holding her end of the string hopefully, his own expression cool and detached, neon bar lights, moody night scene, editorial romantic thriller illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 女池 20 张（F_*，画成男性刻板物种）

> 女用户测出这些——"我一个姑娘却是..." 的错位笑点

### 21. `F_PHNX` 凤凰女
```
A Chinese young woman in an expensive wedding dress stepping onto the red carpet of a mansion, but dragging behind her on a rope is her whole extended family demanding money with outstretched hands, gold and diamond tiara glitters but her eyes look tired, dark red velvet carpet, opulent satirical editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 22. `F_MGIR` 妈宝女
```
A Chinese young woman in adult office clothes holding hands with a ghostly translucent apparition of her mother who dictates her every decision through a thought bubble, her own thought bubble empty, pale blue and red palette, cute but melancholic, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 23. `F_PCON` 普信女
```
A Chinese young woman in casual clothes striking a supermodel pose in front of a warped funhouse mirror that reflects her as a glamorous supermodel, while her actual reflection in a smaller mirror shows an awkward angle, dismissive expression, pink magenta with red shadows, satirical editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 24. `F_LICK` 舔狗女
```
A Chinese young woman kneeling on rainy pavement offering up a heart-shaped gift box and a love letter to a guy walking away checking his phone with a "read at 10:47 PM no reply" screen, her halo of dedication glowing red, dim streetlamp, melodramatic editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 25. `F_OCEA` 海后
```
A Chinese young woman seated on a throne made of smartphones wearing a crown of screenshots, seven guy-shaped wave silhouettes crashing around her each holding their own phone out, she scrolls calmly swiping left, dark sea blue with red coral accents, mythological urban illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 26. `F_TOOL` 工具女
```
A Chinese young woman holding an enormous multi-tool belt labeled with Chinese characters 哥 姐 爸 妈 朋友, ATM slot in her chest dispensing cash, tired but obliging smile, soft green industrial aesthetic with red warning light, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 27. `F_DADY` 姐味说教
```
A Chinese young woman sitting cross-legged on a sofa with a wine glass, finger raised mid-lecture, speech bubble full of "你应该" and "你必须" floating around a young guy looking bored, warm amber lighting with red authority undertone, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 28. `F_IRON` 钢铁直女
```
A Chinese young woman in a simple sweater holding a needle popping a guy's heart-shaped speech bubble reading "miss you", her expression blank and businesslike, minimal gray and red palette, deadpan humor, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 29. `F_ROUG` 糙姐
```
A Chinese young woman lounging on a messy couch in a stained oversized t-shirt, chip crumbs everywhere, hair in a tangled bun, eating instant noodles directly from the pot with takeout containers piled up, cozy chaotic vibe, warm yellow and red palette, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 30. `F_STRG` 直女癌
```
A Chinese young woman with crossed arms and sharp glare, behind her a wall of profile cards of men all crossed out with red X marks, one solitary crumbling rose on the floor, cold blue and defiant red palette, editorial feminist-satire illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 31. `F_NICE` 老实女
```
A Chinese young woman with a kind polite smile standing in the corner of a crowded room, background figures laugh and chat without noticing her, her hand holding a thermos of homemade soup nobody wants, soft beige with red lonely spotlight, melancholic editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 32. `F_BACK` 备胎女
```
A Chinese young woman with a "BACKUP" sticker on her sweater, holding a phone showing five years of screenshots, watching a guy walk by arm-in-arm with someone else, muted sad palette with bright red backup label, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 33. `F_ACGR` 中央空调妹
```
A Chinese young woman standing in the center of a room with four identical guys around her each feeling a gentle warm breeze from her direction, her smile equidistant to all of them, halo of neutrality, pale mint and red palette, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 34. `F_WILD` 浪姐
```
A Chinese young woman dancing mid-air at a neon club with sparkling cocktails flying around, fishnet stockings and bold makeup, reckless energy, background blurred with exhausted morning sun peeking through a window, magenta and red palette, editorial nightlife illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 35. `F_DARK` 阴谋家
```
A Chinese young woman in a dark blazer at a glass office table arranging chess pieces like a mastermind, her opponents' pieces already knocked over, subtle smirk, shadowy backdrop, red desk lamp spotlight, film noir editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 36. `F_BOSS` 社会大姐
```
A Chinese young woman at the head of a long dining table surrounded by attentive men and women leaning in to hear her orders, gold bracelets and red lipstick, wine glass in hand, commanding aura, dark restaurant with red velvet booth, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 37. `F_KBGR` 键盘大妈
```
A Chinese young woman furiously typing on a mechanical keyboard in a dimly lit room, multiple monitors showing heated comment threads with red highlight, energy drink cans piled up, glasses reflecting neon arguments, chaotic focused aura, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 38. `F_DADG` 爹系女友
```
A Chinese young woman straightening a bow tie on her younger-looking boyfriend like a stern parent, checking his homework spread on the table, her expression firm but caring, warm domestic palette with red authority accent, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 39. `F_PART` 夜店咖大姐
```
A Chinese young woman at an office desk in a blazer with last-night's smudged party makeup, coffee cup and laptop open, half of her reflection in a compact mirror showing glitter eyeliner from the night before, fluorescent office light clashing with purple night shadows, editorial double-life illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 40. `F_BRIC` 砖头女
```
A Chinese young woman standing still like a stone statue, a literal wall of red bricks stacked around her heart, small figures of friends and a boyfriend walking away into the distance, stoic expression, dramatic contrast of cold gray and warning red, editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 隐藏 / 兜底 2 张

### 41. `UNDEF` 无定义人
```
An androgynous Chinese figure made of swirling smoke and glitching pixels, no clear face, hovering between two empty category boxes labeled with Chinese characters 男 and 女, mysterious void with red question mark constellation, ethereal metaphysical editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 42. `HWDP` 难画得批
```
An abstract Chinese figure half-drawn with sketch lines, other half dissolving into error pixels and broken lines, a broken paintbrush on the ground, system crash dialog in background reading "classification error", absurdist self-referential aesthetic, red error glow on black, meta editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code）
mkdir -p src/data/gsti/images
# 把 M_GOLD.png / F_PHNX.png ... 42 张图放进去

# 2. 改 typeImages.ts 从空占位切到真图（保留类型签名）
#    参考其他测试里的 base64 方案，或者直接用相对路径 import
```

**方案 A — 相对路径 import（推荐，构建时 Vite 会 hash + 压缩）：**
```typescript
// src/data/gsti/typeImages.ts
import m_gold from './images/M_GOLD.png';
import m_huby from './images/M_HUBY.png';
// ... 42 条 import

export const TYPE_IMAGES: Record<string, string> = {
  M_GOLD: m_gold,
  M_HUBY: m_huby,
  // ...
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — SBTI 旧式 base64 内嵌**（不推荐，会让 JS bundle 膨胀 3-5MB）

**方案 C — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images）

## 预算和时间估算

- **Midjourney**：Basic $10/月，42 张 × 4 变体 × 1 分钟 ≈ 170 GPU 分钟。Basic 200 分钟够，但没冗余 —— 建议升 Standard $30/月。
- **时间**：熟练用户 42 条 prompt 跑完约 **2-3 小时**（包括挑图）。
- **后处理**：Photoshop 批量去水印/裁切 1 小时。
- **总成本**：$30 + 4 小时人工 ≈ 400 元 + 半天。

## 质量红线

- **必须**：中国面孔 / 深色底 / 红色 accent / 正方形 / 人物为主（非纯图案）
- **禁止**：任何可识别的真实公众人物、任何真实品牌 logo、任何裸露、任何血腥
- **鼓励**：幽默夸张、戏剧化道具、一眼能看出"这是 XX 物种"

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 —— 42 条 MJ prompt | cwjjjjj + Claude |
