---
name: ZHTI TypeImages · 17 条 ChatHub/GPT Image prompts
description: 批量生成甄嬛传人格测试全部 17 个类型的插画卡（含隐藏太后）
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-23
---

# ZHTI 类型卡·生图 Prompt 库

## 用法

批量运行（需 Chrome 9222 已开，ChatHub 已登录）：
```bash
node tmp/chathub-batch.mjs zhti --model "GPT Image 1" --date 2026-04-23
```

单张测试：
```bash
node tmp/chathub-generate.mjs generate "GPT Image 1" src/data/zhti/images/ZHENHUAN.png "<prompt>"
```

## 全局风格基底

- **主题**：甄嬛传 / 清宫古风 personality test avatar
- **风格**：全身卡通人格角色，干净矢量感，圆润比例，小图可识别
- **背景**：深色（深宫夜色 / 深靛蓝 / 深黑），单一简洁
- **颜色**：每个角色配对应的主题色调
- **要求**：No text, no letters, no watermark，1:1 square

---

## 17 张 Prompts

### 1. `ZHENHUAN` 重生之我是甄嬛
```
A young Chinese noblewoman in pale blue silk palace robes with subtle embroidery, standing alone in a moonlit snowy courtyard, one hand holding a red plum blossom branch, the other clenched into a determined fist, expression showing resilience and quiet sorrow, tears glinting but chin held high, dark midnight blue background with falling snow, personality test avatar illustration, Qing dynasty imperial court style, full-body stylized mascot, clean vector-like shapes, bold silhouette, no text no letters no watermark, 1:1 square
```

### 2. `HUAFEI` 贱人就是矫情
```
A fierce and glamorous Chinese imperial concubine in dramatic crimson and gold phoenix robes with elaborate phoenix crown hairpiece, hands on hips, chest thrust forward, eyes blazing with passion and jealousy, exaggerated fierce beauty makeup with red lips and winged liner, dynamic red flames swirling behind her like wings, deep black background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, bold dramatic silhouette, no text no letters no watermark, 1:1 square
```

### 3. `HUANGHOU` 慈眉善目皇后娘娘
```
A composed Chinese empress in pristine white and jade green phoenix robes with the highest ceremonial crown, hands folded serenely in front, wearing a perfect gentle sweet smile that hides cold calculating eyes, one sleeve subtly concealing a slender dagger hilt, chrysanthemum motifs on robe, cool pale background with subtle palace columns, personality test avatar illustration, Qing dynasty imperial court style, full-body stylized mascot, elegant silhouette, no text no letters no watermark, 1:1 square
```

### 4. `EMPEROR` 普天之下莫非朕土
```
A Chinese emperor in imperial yellow dragon robes with elaborate golden embroidery, seated on a throne with one arm extended in a commanding gesture, holding an imperial jade seal in the other hand, expression showing absolute power mixed with subtle emptiness, golden dragon coiling above him, deep imperial red background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, imposing silhouette, no text no letters no watermark, 1:1 square
```

### 5. `MEIZHUANG` 我的骨气不是你能踩的
```
A dignified Chinese noblewoman in elegant purple silk palace robes with orchid embroidery, standing tall with perfect posture, holding a white orchid flower in one hand, chin slightly raised in quiet pride, expression serene and unbending, simple deep indigo background with ink-wash orchid shadows, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, noble upright silhouette, no text no letters no watermark, 1:1 square
```

### 6. `ANLINGRONG` 我也只是想被好好对待
```
A young meek Chinese palace woman in plain modest yellow-green robes, hunched shoulders, large sad earnest eyes trying to form a hopeful smile, holding a small cracked hand mirror reflecting a fractured image, surrounding shadows suggesting isolation, simple muted background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, fragile delicate silhouette, no text no letters no watermark, 1:1 square
```

### 7. `DUANFEI` 沉默是我的刀
```
A Chinese imperial concubine in deep navy and teal robes sitting perfectly still in meditation posture, eyes closed, holding a white lotus flower with both hands like an offering, utterly serene and impenetrable, smooth dark teal background with rippling water reflections below, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, still composed silhouette, no text no letters no watermark, 1:1 square
```

### 8. `JINGFEI` 识时务者为俊杰
```
A gentle approachable Chinese palace woman in soft sage green robes crouching down in a courtyard garden, tending to flowering plants with care, a small sparrow perched on her outstretched finger, warm peaceful expression, minimal garden background with a few bamboo stalks, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, gentle grounded silhouette, no text no letters no watermark, 1:1 square
```

### 9. `QIPIN` 就知道气我
```
A young frustrated Chinese palace maid in simple pink maid uniform, round chubby cheeks puffed out in a cartoonish pout, hands raised in exasperation, sweat drop on forehead, empty food tray dropped at her feet, exaggerated comic expression, bright simple background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, cute expressive silhouette, no text no letters no watermark, 1:1 square
```

### 10. `CAOGUI` 算盘打到骨子里
```
A sharp-eyed Chinese palace woman in patterned amber and brown palace robes, sitting with an old wooden abacus in her lap, fingers poised on the beads mid-calculation, a thin satisfied smirk on her lips, eyes gleaming with calculation, small gold coins scattered around her, dark amber background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, shrewd composed silhouette, no text no letters no watermark, 1:1 square
```

### 11. `HUANBI` 我的心意从不藏着掖着
```
A vivid passionate Chinese young woman in bright coral and turquoise palace robes, leaning forward impulsively with both arms outstretched as if running toward someone, heart-shaped hairpin in her hair, eyes shining with intense adoration, robe fluttering dramatically, warm glowing background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, bold expressive silhouette, no text no letters no watermark, 1:1 square
```

### 12. `GUOJUNWANG` 世间若无此遗憾
```
A handsome melancholy Chinese nobleman in deep blue-grey scholar-noble robes, standing alone in winter snow holding a withered plum blossom in his lowered hand, looking away into the distance with an expression of profound bittersweet longing, snowflakes falling, cold blue-grey background, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, elegant sorrowful silhouette, no text no letters no watermark, 1:1 square
```

### 13. `WENSHICHU` 我的爱不问回报
```
A kind gentle Chinese physician in white and grey scholar robes with a medicine box strapped on his back, holding a bundle of herbal medicine with both hands extended as an offering, warm compassionate eyes, faint smile of selfless devotion, soft white background with subtle herb illustrations, personality test avatar illustration, Qing dynasty imperial China style, full-body stylized mascot, gentle warm silhouette, no text no letters no watermark, 1:1 square
```

### 14. `SUPEISHENG` 打工最高境界
```
A Chinese court eunuch official in dark teal official court servant robes with a court hat, expertly balancing an ornate serving tray on one hand with practiced ease, bowing at the perfect angle with a subtle knowing half-smile, eyes slightly downcast yet aware of everything, minimal palace corridor background, personality test avatar illustration, Qing dynasty imperial court style, full-body stylized mascot, precise subservient silhouette, no text no letters no watermark, 1:1 square
```

### 15. `JINXI` 棋手从不坐在棋盘上
```
A composed perceptive Chinese palace maid in dark charcoal practical robes, standing slightly in shadow at the side, holding a single black chess piece between two fingers, watching everything with calm sharp observant eyes, subtle smile suggesting she knows far more than she reveals, dark background with faint chess board pattern, personality test avatar illustration, Qing dynasty palace drama style, full-body stylized mascot, watchful shadowed silhouette, no text no letters no watermark, 1:1 square
```

### 16. `NIANGENGYAO` 功高震主这种事
```
A Chinese military general in imposing elaborate battle armor with exaggerated decorative shoulder pauldrons, arms crossed with supreme arrogance, head thrown back in a contemptuous smirk, battlefield flames blazing dramatically behind him, military banners in the background, bold red and black color scheme, personality test avatar illustration, Qing dynasty imperial China style, full-body stylized mascot, domineering overconfident silhouette, no text no letters no watermark, 1:1 square
```

### 17. `TAIHOU` 局外人的最高段位
```
A supremely powerful Chinese empress dowager in the most elaborate gold-black ceremonial robes adorned with phoenix and dragon motifs, seated regally on an elevated throne far above everything, looking down with an all-knowing serene gaze, the most ornate hairpiece of all with long golden tassels, hands resting calmly on throne armrests, suggesting she has seen and outlasted everything, deep black background with subtle golden aura, personality test avatar illustration, Qing dynasty imperial China style, full-body stylized mascot, supreme transcendent silhouette, no text no letters no watermark, 1:1 square
```
