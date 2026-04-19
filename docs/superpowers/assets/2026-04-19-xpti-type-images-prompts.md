---
name: XPTI TypeImages · 43 条 Midjourney/ChatHub prompts
description: 一键批量生成 XPTI 全部 43 个性别人格类型（20 男 + MSHADOW + 20 女 + FSHADOW + XFREAK 跨性别隐藏）的黑金肖像插画
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-19
---

# XPTI 性别人格图鉴·生图 Prompt 库

## ⚠️ 合规红线（必须先读）

XPTI 图片**严禁**出现以下内容：

- **真实公众人物面孔 / 明星 / 网红 likeness**：任何具象可识别的名人脸都不行
- **真实品牌 logo 或名称**：LV / Gucci / Chanel / Hermès / Rolex / Apple / Nike / Supreme / 任何奢侈品或快消品牌
- **裸露 / 露骨性暗示**：人物必须 fully clothed；"气质"靠光影和姿态，不靠身体
- **政治敏感内容**：国旗、军装、政治符号、敏感历史场景
- **物化 / 性化 pose**：不要 dating-app 姿势、不要 K-pop 表演、不要 cleavage-forward、不要挑逗性眼神
- **刻板印象强化**：不美化"男强女弱"、不贬低任何性别气质；visualize "气质 (aura)"，不是 body

通用替代：`editorial portrait pose` / `chiaroscuro lighting` / `architectural silhouette` / `fabric and texture as metaphor` / `gold-and-black magazine cover aesthetic` / `no facial resemblance to any real person`。

> XPTI 的整个图像库不是在画"一个性别的样子"——是在画"一个 8 维人格向量投影到外在气质的样子"。每张图都应该像一本中文时尚杂志的内页人物专题。

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai）订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5** 作为主模型（editorial 人像最稳）
3. 备选：**Nano Banana Pro**（Google 出品，黑金对比更克制）
4. 把下面的 prompt 一条条粘进去 —— **每条生成 4 张挑最好的 1 张**
5. 命名规则：`<CODE>.png`（严格对齐 `src/data/xpti/types.ts` 中的 `code`），例如 `MDOMIN.png` / `FMOONG.png` / `XFREAK.png`
6. 放到 `src/data/xpti/images/` 下（首次创建目录）
7. 跑完 `node scripts/convert-images-to-webp.mjs`（PNG → WebP 压缩）
8. 跑 `node tmp/gen-typeimages.mjs xpti` 生成 `src/data/xpti/typeImages.ts`

### 方式 2：Midjourney
- Discord 进 MJ bot 或官方 web，把 prompt 粘进 `/imagine`
- 用下方 prompt 的末尾参数（`--ar 1:1 --v 6.1 --style raw --stylize 300`）
- Basic 套餐 200 GPU 分钟够跑两轮 43 张有冗余

### 方式 3：Stable Diffusion（自托管）
- Suffix 改成：`--ar 1:1` 去掉 `--v 6.1` 和 `--style raw`
- 推荐：SDXL base + editorial portrait LoRA + chiaroscuro LoRA
- Steps 30 / CFG 7 / Sampler: DPM++ 2M Karras

### 方式 4：DALL·E 3（OpenAI API）
- 去掉末尾的 MJ 参数
- prompt 开头加 `Square 1:1 editorial portrait illustration,`
- API 参数 `size: '1024x1024'`, `quality: 'hd'`, `style: 'vivid'`

---

## 全局风格基底（所有 prompt 内嵌）

XPTI 的 43 张图放一起必须是同一个 family，区别于 GSTI（红黑）、FPI（蓝）、FSI（暖琥珀）、MPI（金色发票）：

- **调色**：deep black background（#0a0a0a）+ **metallic gold（#d4af37）** + **silver-grey（#a8a8a8）** —— editorial 黑金杂志封面美学
- **人物**：single-subject Chinese portrait，1:1 正方形，半身或特写；**不是 dating-app / 不是 K-pop / 不是 anime**
- **光影**：chiaroscuro lighting / cinematic single-source light / deep shadows / gold rim light / negative space 占一半画面
- **风格**：editorial satirical Chinese magazine illustration / 中国版 Vanity Fair × 新周刊 × 单读 人物专题内页
- **男性类型 tone**：sharper edges, starker lighting, architectural composition, harder shadows, matte textures
- **女性类型 tone**：softer chiaroscuro, fabric and silk textures, gold highlights on skin, velvet shadow depth
- **XFREAK（跨性别隐藏）**：ambiguous silhouette / mirror-shattered / androgynous / negative-space 主导
- **Shadow types（MSHADOW / FSHADOW）**：literal shadow / silhouette character / faceless

> 每条 prompt 都会显式带上 `editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette`。

---

## 男性池 20 主

### 1. `MDOMIN` 支配型总裁
```
A Chinese urban man in his early thirties photographed in sharp three-quarter profile against a pure deep black backdrop, wearing a black tailored suit with a single gold lapel pin, jaw set, eyes forward with cold executive calm, one hand resting flat on a black marble desk with a gold pen placed at a perfect right angle, harsh overhead single-source chiaroscuro light carving architectural shadows across his face, silver-grey wisps of smoke rising behind him, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `MBRUTE` 猛男钝感
```
A broad-shouldered Chinese man in his late twenties in a plain black t-shirt standing against a concrete wall washed in deep black, expression completely flat, eyes looking past the camera like a wall listening to poetry, a tiny gold-rimmed cup of tea held loosely in one enormous hand, silver-grey dust motes hanging in harsh side light, chiseled shadows carving his features into a stone relief, chiaroscuro lighting, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `MREALT` 现实派大哥
```
A Chinese urban man in his thirties in a charcoal grey overcoat seated at a black desk, a gold-plated calculator in front of him with a long curling receipt of numbers, a small gold-framed photo turned face-down, eyes scanning a spreadsheet projected as gold-lit rows in the air, no smile, expression of precise detached arithmetic, harsh desk-lamp side light throwing a sharp silver-grey shadow on the wall, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `MCHAOS` 浪男混沌
```
A rakish Chinese man in his late twenties mid-stride in an unbuttoned black shirt, jacket slung over one shoulder, a lit cigarette ember glowing gold between his fingers, background a blurred deep black cityscape with streaks of silver-grey motion, his face half-lit half-in-shadow, a crooked half-smile with no commitment behind it, untidy hair catching a gold rim light, harsh off-angle lighting, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `MFOGGY` 迷之佛系
```
A Chinese urban man in his thirties in a loose black linen mandarin-collar shirt, seated cross-legged on a black wooden floor, eyes half-closed, a single gold incense stick trailing silver-grey smoke in front of him, expression serene and slightly absent, a blank rice-paper scroll hanging behind him catching soft gold light, chiaroscuro fading him into the dark corners of the frame, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `MSILNT` 沉默操作员
```
A Chinese man in his thirties in a black turtleneck, face mostly swallowed by shadow with only a thin gold edge of light tracing the bridge of his nose and one eyebrow, eyes dark and watchful, hands clasped out of view, background pure deep black with a single silver-grey vertical line suggesting a doorframe, completely unreadable expression, sharp architectural chiaroscuro, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `MVISAL` 精致男模
```
A meticulously groomed Chinese urban man in his late twenties in a black satin shirt and tailored trousers, sculpted hair catching a gold key light, a single gold ring on his finger, posed in front of a black backdrop with one silver-grey mirror fragment reflecting half of his face, cool detached gaze, every edge too perfect, the polished surface of his cheekbone picking up a harsh gold highlight, editorial fashion chiaroscuro, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `MPUREX` 纯爱型男
```
A Chinese urban man in his late twenties in a plain black knit sweater, seated on a black wooden chair holding a folded handwritten letter with gold-embossed edges, expression soft and earnest, eyes looking at something off-frame with quiet devotion, a single faded gold paper crane on the table beside him, chiaroscuro light falling warm on his face while the background sinks into deep black, silver-grey steam rising from a forgotten tea cup, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `MSOFTG` 软蛋男孩
```
A gentle Chinese urban man in his mid twenties in an oversized black hoodie, shoulders slightly collapsed, hands folded in his lap, a pale gold halo of light catching only the top of his hair, eyes lowered with a small apologetic half-smile, silver-grey cushion sinking under his weight, background deep black with the faint outline of a door someone else has just walked through, soft chiaroscuro melting his edges away, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `MSIMPX` 舔狗升级版
```
A Chinese urban man in his late twenties kneeling on a polished black floor offering up a gold-wrapped gift box with both hands, eyes lifted in hopeful devotion toward someone standing out of frame, a long silver-grey leash loosely looped around his own wrist with the handle lying on the ground unheld, harsh gold spotlight only on the gift box leaving his face half in shadow, a faint scattering of receipts around his knees, chiaroscuro theatrics, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `MMOOND` 月光男孩
```
A quiet Chinese urban man in his late twenties in a long black coat standing by a tall window at night, moonlight rendered as a single cold silver-grey shaft cutting across his face, a gold pocket watch held half-open in his palm showing a time that has already passed, eyes looking at the window reflection instead of outside, expression of polite regret, deep black interior, chiaroscuro almost monochrome with a thin gold edge on his collar, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `MSCHME` 心机型男
```
A Chinese urban man in his thirties seated at a black lacquer table with a Go board in front of him, black stones arranged in a tight architectural pattern, a single gold-capped stone held between his thumb and forefinger, half-lidded eyes calculating three moves ahead, a faint smile that does not reach his eyes, silver-grey smoke drifting up from an unseen cigarette, harsh overhead light carving precise shadows around the board, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `MGRIND` 拼命型男
```
A Chinese urban man in his late twenties in a black dress shirt with sleeves rolled up, tie loosened, dark circles under his eyes but jaw clenched, seated at a black desk piled with paperwork edged in gold, a cold gold-lit laptop screen illuminating half his face, a cup of instant coffee gone cold, silver-grey city lights blurred through a window behind him at 2 AM, hard desk-lamp chiaroscuro, exhausted but still driving forward, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `MEMOCR` 情绪化男
```
A Chinese urban man in his late twenties in a rumpled black button-down, hair slightly disheveled, seated on the edge of a black bed with his head tilted back, a single gold tear-like streak of light running down his cheek, one hand gripping a silver-grey phone face-down, background deep black with a half-empty glass catching a sharp gold reflection, expression visibly overwhelmed, chiaroscuro pressing in from all sides, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `MBROSK` 兄弟义气型
```
A Chinese urban man in his late twenties in a black bomber jacket, one arm thrown around an empty space where a friend should be (silhouette of another figure suggested only in silver-grey shadow), a gold liquor glass raised in toast, broad loyal grin, scuffed knuckles, background a deep black alley with one gold streetlamp flaring off-frame, harsh side light giving him a sculpted brotherhood-portrait feel, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `MNEETX` 躺平型
```
A Chinese urban man in his late twenties fully reclined on a low black couch in a plain black t-shirt and shorts, eyes peacefully closed, one arm thrown over his forehead, a gold-rimmed cheap bowl of instant noodles balanced on his stomach, silver-grey daylight filtering through half-closed blinds, deep black room with dust floating in soft gold beams, expression of chosen surrender, flat architectural chiaroscuro, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `MPEACK` 孔雀型男
```
A vain Chinese urban man in his late twenties in an open black silk shirt revealing a gold chain, standing in front of a full-length mirror framed in silver-grey metal, one hand adjusting his collar with obvious satisfaction, mirror reflection slightly more perfect than the real man, harsh gold spotlight hitting only his side of the frame, his shadow fanning out behind him like peacock tail feathers in deep black, theatrical chiaroscuro, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `MDRIFT` 漂泊者
```
A Chinese urban man in his thirties in a weathered black trench coat standing on an empty train platform at night, a single canvas duffel bag at his feet, a gold ticket stub held between his fingers with the destination blank, silver-grey railway lights stretching into deep black distance, collar turned up, eyes unfocused on any specific horizon, a half-finished cigarette trailing silver smoke, cold harsh lighting from one overhead lamp, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `MSTONE` 石头心大叔
```
A Chinese urban man in his late thirties in a plain black wool sweater, face carved like unpolished stone, completely still, deep-set eyes without visible emotion, a gold-framed old photograph lying face-down on a black stone table beside him, harsh top-down key light turning his features into architecture, silver-grey beard stubble catching the edge of the light, background deep black void, minimalist chiaroscuro portrait, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `MWHIMS` 奶油王子
```
A pampered Chinese urban man in his late twenties in a cream-and-black silk robe seated on a velvet armchair, a small tilted gold paper crown resting on his head, holding a gold teacup in both hands with an affected pout, hair styled like a young prince who has never made his own breakfast, silver-grey cushions embroidered with faint gold threads, deep black background with one soft spotlight, theatrical but slightly ridiculous chiaroscuro, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 男性池 兜底

### 21. `MSHADOW` 男影子
```
A tall Chinese male figure rendered almost entirely as a silhouette against a deep black wall, only the faintest gold edge light tracing the outline of his shoulder and jaw, face unresolved into features, a silver-grey empty name tag pinned to his chest with no writing on it, the figure slightly translucent as if the viewer cannot quite fix him in their mind, architectural negative space occupying most of the frame, pure chiaroscuro with no midtones, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 女性池 20 主

### 22. `FDREAM` 做梦公主
```
A Chinese urban woman in her mid twenties in a flowing black silk slip dress seated on a velvet chaise, eyes slightly unfocused and turned upward as if watching an interior film, a small gold picture frame held in her lap containing only silver-grey mist instead of a photo, soft chiaroscuro wrapping around her in warm gold falling across one cheek, silver-grey rose petals scattered on the black floor, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 23. `FMOONG` 月光梦游者
```
A Chinese urban woman in her late twenties in a long pale silver-grey silk robe barefoot on a deep black wooden floor, moonlit from above by a single cold gold beam that catches on her collarbone and bare shoulder, eyes distant as though she is somewhere else, holding a small gold handheld mirror showing only the reflection of the moon, hair loose and soft, chiaroscuro melting her edges into the dark, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 24. `FEMOCR` 情绪浓度女王
```
A Chinese urban woman in her late twenties in a dramatic black velvet gown, hair slightly wild, tears glittering like gold beads along her lower lashes, mouth parted mid-sentence, one hand pressed against her chest, chiaroscuro key light turning the wet trails on her cheek into rivers of gold, silver-grey pearl earrings catching the light, deep black background absorbing everything around her, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 25. `FVISAG` 视觉女王
```
A meticulously styled Chinese urban woman in her late twenties in a structured black gown with gold piping, makeup flawless under a gold key light, posed slightly in three-quarter profile, a silver-grey mirror held in one hand reflecting only a perfect copy of her face, every edge too polished, deep black backdrop with a single gold vertical line behind her, chiaroscuro carefully controlled so no imperfection survives, editorial fashion portrait, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 26. `FPURES` 纯爱女孩
```
A Chinese urban woman in her mid twenties in a simple black cotton dress with a small gold heart-shaped locket, seated on a low black wooden bench holding a folded handwritten letter close to her chest, eyes lit by a warm gold candle glow, soft chiaroscuro falling gently across her face, silver-grey ribbon coming loose from her hair, expression earnest and unprotected, deep black background that never quite touches her, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 27. `FPOWER` 支配型女
```
A Chinese urban woman in her thirties in a sharply tailored black pantsuit with gold buttons, standing squarely in front of a deep black wall, one hand on a silver-grey chair back, jaw level, eyes leveled at the viewer without apology, a gold signet ring on her index finger catching a hard architectural key light, minimalist chiaroscuro with one crisp cast shadow slicing the floor, negative space amplifying her command of the frame, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 28. `FCHAOS` 混沌姐
```
A vibrant Chinese urban woman in her late twenties in a slightly rumpled black blouse with the buttons off by one, hair half up half down, gold hoop earrings swinging, a silver-grey handbag tipped over on the floor with lipsticks and receipts spilling out around her bare feet, laughing openly mid-motion, warm gold spotlight catching her from one side while the other fades into deep black, chiaroscuro alive with movement, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 29. `FREALT` 现实派姐姐
```
A composed Chinese urban woman in her early thirties in a black silk blouse, seated at a black lacquer table, a gold fountain pen poised over a neat ledger with tidy silver-grey grid lines, small gold calculator to her right, expression clear-eyed and measuring, not cold but not dreamy, one eyebrow very faintly raised, chiaroscuro key light from the left carving precise planes on her face, deep black background, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 30. `FSILNT` 沉默姐
```
A Chinese urban woman in her late twenties in a black high-neck knit, most of her face absorbed into shadow, only one eye and the corner of her mouth catching a thin silver-grey highlight, a small gold brooch at her throat, hands clasped out of view, deep black background with a single vertical gold thread of light behind her, completely unreadable expression, minimalist chiaroscuro, fabric texture soft against architectural darkness, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 31. `FDARKL` 暗黑系少女
```
A Chinese urban woman in her mid twenties in a black lace high-collared dress, dark lipstick, eyes heavily shadowed with deep kohl, a small gold crescent-moon pendant at her throat, holding a silver-grey tarot card face-down, lit from below by a cold gold candle flame that throws long shadows up her face, deep black background almost absorbing her silhouette, chiaroscuro theatrically gothic, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 32. `FGENTL` 温柔顺从型
```
A soft-featured Chinese urban woman in her mid twenties in a draped black chiffon blouse, head tilted slightly with a small understanding smile, a silver-grey teacup held in both hands with steam rising in thin gold wisps, warm chiaroscuro wrapping her face in gentle gold while her shoulders fade into deep black, expression accommodating and un-insistent, silk and fabric textures luminous, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 33. `FICEQN` 冰山女王
```
A Chinese urban woman in her early thirties in a severe black column dress, hair pulled back tight, gold earrings shaped like thin daggers, expression set to absolute zero, seated on a silver-grey stone throne-like chair, a hard gold key light turning her cheekbones into cliffs, deep black void behind her with a faint silver mist at the floor, chiaroscuro carved like ice sculpture, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 34. `FBRATY` 作精女王
```
A Chinese urban woman in her late twenties in a cropped black satin camisole and silk robe sliding off one shoulder, lips in a calculated pout, one gold earring dangling while the other is "missing", holding a silver-grey phone face-down with deliberate drama, lit from one side by a theatrical gold key light, her pose staged like a publicity still, deep black backdrop, chiaroscuro that almost winks at the viewer, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 35. `FWITCH` 女巫型
```
A Chinese urban woman in her late twenties in a black velvet hooded robe, three silver-grey tarot cards fanned in her hand, gold sigils faintly glowing along the fabric edges, lit from below by a floating gold flame so her eye sockets pool in shadow, small gold pendant of a crescent and eye at her throat, deep black background with faint silver smoke curling upward, chiaroscuro with an occult stillness, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 36. `FTRUTH` 真实派
```
A Chinese urban woman in her late twenties in a plain black cotton shirt, bare face, hair pulled back simply, no jewelry except a single silver-grey stud earring, seated against a deep black wall, eyes looking straight into the camera with calm unguarded honesty, chiaroscuro key light warm and honest on every pore and faint freckle, a small gold thread running loose from her hem as the only ornament, minimalist editorial portrait, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 37. `FSCHEM` 心机女王
```
A Chinese urban woman in her early thirties in a black silk qipao with gold piping, seated at a black lacquer table playing a slow game with gold coins arranged in a complicated pattern, a small knowing half-smile, one finger resting on a silver-grey coin about to be moved, eyes tracking an off-frame target, chiaroscuro deeply theatrical with a single gold overhead light illuminating the board, deep black background swallowing the rest, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 38. `FSAINT` 圣母型
```
A Chinese urban woman in her late twenties in a long flowing black robe, a faint gold halo suggested behind her head rendered with light and not drawn, hands open and slightly extended as if holding an invisible weight, expression compassionate but visibly tired, silver-grey threads of worry at her temples, warm gold chiaroscuro falling on her face while deep black shadow pools around her feet, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 39. `FANIME` 二次元少女
```
A Chinese urban woman in her mid twenties in an editorial painterly style (not anime aesthetic but an editorial interpretation of a dreamer) wearing a black pleated dress with a silver-grey ribbon, oversized gold-rimmed reading glasses reflecting tiny cinematic frames, clutching a closed black book with gold-edged pages, eyes soft-focused on a fantasy only she can see, deep black background, warm gold chiaroscuro wrapping her face, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 40. `FIRONX` 钢铁直女
```
A Chinese urban woman in her late twenties in a plain black oversized shirt and straight-leg trousers, hands in pockets, shoulders squared, no makeup, short practical haircut, expression direct and unsentimental, a small silver-grey watch on her wrist catching a flat gold light, deep black background, chiaroscuro minimalist and architectural with no soft curves in the composition, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 41. `FMESSY` 混乱大姐
```
A Chinese urban woman in her late twenties seated cross-legged on a deep black floor in an oversized black t-shirt, hair in a half-collapsed bun, a chaotic constellation of silver-grey receipts, loose gold bobby pins, lipstick tubes, a tipped-over black mug, all scattered around her in concentric rings, she shrugs with a loose open laugh, warm gold side light catching her and fading the mess into chiaroscuro, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 女性池 兜底

### 42. `FSHADOW` 女影子
```
A Chinese female figure rendered almost entirely as a soft silhouette against deep black, a gentle gold edge light tracing the curve of her shoulder and a single strand of loose hair, face unresolved into features, a silver-grey blank name tag floating near her chest with no writing, the figure slightly translucent as if the viewer cannot fix her in their mind, fabric edges fading into negative space, chiaroscuro without midtones, soft gold veil where a face should be, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 跨性别隐藏

### 43. `XFREAK` 跨界怪胎（隐藏）
```
An androgynous Chinese figure of ambiguous gender presentation rendered as a fractured mirror portrait against deep black, face composed of silver-grey mirror shards each reflecting a different partial expression, some shards showing gold light and some showing pure black void, one half of the body in a sharp masculine-coded tailored silhouette and the other half in a softer feminine-coded draped fabric, no two facial fragments agreeing on a single person, chiaroscuro fragmented into geometric planes, negative space occupying half the frame, editorial satirical Chinese magazine illustration, no visible brand logos, no visible text or letters, black and gold palette --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code）
mkdir -p src/data/xpti/images
# MDOMIN.png MBRUTE.png MREALT.png MCHAOS.png MFOGGY.png MSILNT.png
# MVISAL.png MPUREX.png MSOFTG.png MSIMPX.png MMOOND.png MSCHME.png
# MGRIND.png MEMOCR.png MBROSK.png MNEETX.png MPEACK.png MDRIFT.png
# MSTONE.png MWHIMS.png MSHADOW.png
# FDREAM.png FMOONG.png FEMOCR.png FVISAG.png FPURES.png FPOWER.png
# FCHAOS.png FREALT.png FSILNT.png FDARKL.png FGENTL.png FICEQN.png
# FBRATY.png FWITCH.png FTRUTH.png FSCHEM.png FSAINT.png FANIME.png
# FIRONX.png FMESSY.png FSHADOW.png
# XFREAK.png

# 2. PNG → WebP 压缩
node scripts/convert-images-to-webp.mjs

# 3. 生成 typeImages.ts（相对路径 import，Vite 会 hash + 压缩）
node tmp/gen-typeimages.mjs xpti
```

**生成结果：**
```typescript
// src/data/xpti/typeImages.ts
import mdomin from './images/MDOMIN.webp';
import mbrute from './images/MBRUTE.webp';
// ... 43 条 import
import xfreak from './images/XFREAK.webp';

export const TYPE_IMAGES: Record<string, string> = {
  MDOMIN: mdomin,
  MBRUTE: mbrute,
  // ...
  XFREAK: xfreak,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

---

## 预算和时间估算

- **ChatHub + Seedream 4.5**：43 张 × 4 变体 ≈ 172 张出图，按套餐 $30-50/月够用
- **Midjourney**：Standard $30/月 足够跑完一轮 43 条 + 二次迭代
- **时间**：熟练用户 43 条 prompt 跑完约 **2.5-3.5 小时**（含挑图）
- **后处理**：批量裁切 + 合规复查 1 小时
- **总成本**：$30-50 + 半天人工 ≈ 400 元 + 半天

---

## 质量红线

- **必须**：中国面孔（non-caucasian，non-korean-idol）/ 深黑底（#0a0a0a）/ 金色 accent（#d4af37）/ 银灰中间调（#a8a8a8）/ 1:1 正方形 / 单人肖像 / 气质为主
- **禁止**：
  - 任何真实公众人物 / 明星 / 网红面孔
  - 任何真实品牌 logo（LV / Gucci / Chanel / Hermès / Rolex / Apple / Nike / Supreme 等）
  - 任何露骨性暗示、cleavage-forward pose、dating-app 姿势、K-pop 表演姿态、anime 萌系
  - 任何政治敏感符号 / 国旗 / 军装 / 敏感场景
  - 任何固化性别刻板印象的视觉（男强女弱 / 贬低某种气质）
  - 中文或任何语种可读文字（抽象纹样、gold geometric pattern 替代）
- **鼓励**：chiaroscuro 强光影、editorial 杂志内页美学、metaphorical props（mirror / letter / coin / silhouette）、黑金冷峻对比、"气质" 靠光影和姿态而非身体

---

## 合规自检清单（每张图出图后逐条过）

- [ ] 面孔不是任何真实公众人物 / 明星 / 网红
- [ ] 没有可读中文 / 英文 / 任何语种文字
- [ ] 没有真实品牌 logo（哪怕轮廓相似也不行）
- [ ] 人物 fully clothed，没有露骨 pose，没有 cleavage-forward
- [ ] 主色调是 deep black + metallic gold + silver-grey，没有被 MJ 带偏成红/蓝/绿
- [ ] 人物是 Chinese，不是白人也不是 K-pop 脸
- [ ] 1:1 正方形，单人肖像，气质主导
- [ ] Male types 偏 architectural / sharp / hard light；Female types 偏 fabric / softer chiaroscuro / gold on skin
- [ ] XFREAK 必须 androgynous / mirror-shattered，不偏向任何单一性别
- [ ] Shadow types（MSHADOW / FSHADOW）必须是 silhouette，不解析面部

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 —— 43 条 XPTI prompt（黑金肖像杂志美学，20 男 + MSHADOW + 20 女 + FSHADOW + XFREAK） | cwjjjjj + Claude |
