---
name: CaTI TypeImages · 16 条 Nano Banana 2 prompts
description: 一键批量生成 CaTI 全部 16 个猫咪品种的像素风头像卡，视觉风格对齐 DogTI（像素猫狗同门）
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-21
---

# CaTI 猫猫品种图鉴·生图 Prompt 库

## 目标

生成 16 张像素风全身猫咪 PNG，与现有 DogTI 16 张狗狗像素图**视觉完全同系**：粗像素 + 纯白背景 + 深色描边 + 可爱 SD 身材（小型萌化 chibi sprite），像 16-bit 复古游戏贴图。

## 全局风格基底（每条 prompt 内嵌）

> **必含基底**：
> `16-bit pixel art, chibi full-body cat sprite, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, no gradient, pure pixels, clearly visible large blocky pixels`

- **风格**：16-bit pixel art / SNES-era sprite / 粗像素 / dithering 阴影
- **构图**：单只猫居中，全身可见，四肢 / 尾巴清晰
- **背景**：pure white（#ffffff），与 DogTI 的 white bg 对齐
- **输出**：1024×1024 或 1:1，后面会缩到 ~600×468 展示

## 用法（ChatHub · Nano Banana 2）

1. 打开 `https://app.chathub.gg/image-generator`
2. 模型选 **Nano Banana 2**，Size 选 **1:1 Square**
3. 每条 prompt 一次，生成 → 右键保存为 `{英文品种}.png`
4. 统一放进 `src/data/cati/images/`
5. 文件名要与 `src/data/cati/content.ts` 的 `cat` 字段完全匹配

## 16 条 prompts

### 1. `maine` 缅因猫（ENTJ · 全家都归我管的缅因猫）
```
16-bit pixel art, chibi full-body Maine Coon cat sprite with a huge fluffy brown-and-black tabby coat, massive fluffy tail, tufted lynx-like ears, thick mane around the neck, proud confident stance one paw forward, amber eyes, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 2. `bengal` 孟加拉豹猫（ENTP · 跳上桌子推倒所有东西的孟加拉豹猫）
```
16-bit pixel art, chibi full-body Bengal cat sprite with golden-orange coat covered in black rosette spots, lean athletic body mid-pounce pose, one paw raised swatting, bright green eyes wide with mischief, short coat, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 3. `ragdoll` 布偶猫（ENFJ · 认得所有家人情绪的布偶猫）
```
16-bit pixel art, chibi full-body Ragdoll cat sprite with long fluffy creamy-white coat, dark chocolate color-point face mask, matching dark ears and paws and tail tip, big round blue eyes, soft gentle smile, sitting posture one paw tucked under, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 4. `abyssinian` 阿比西尼亚（ENFP · 谁都不想放过的阿比西尼亚）
```
16-bit pixel art, chibi full-body Abyssinian cat sprite with short warm ruddy-brown ticked coat, slender elegant body, large pointed ears, almond-shaped amber eyes looking sideways with curiosity, one front paw raised batting at an invisible target, lively pose, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 5. `russianblue` 俄罗斯蓝猫（ESTJ · 规矩比你还多的俄罗斯蓝猫）
```
16-bit pixel art, chibi full-body Russian Blue cat sprite with short plush solid slate-gray coat, elegant upright sitting posture with front paws neatly together, brilliant emerald-green eyes staring forward serious, slight mona-lisa smile expression, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 6. `siamese` 暹罗猫（ESTP · 从窗户跳出去追鸟的暹罗猫）
```
16-bit pixel art, chibi full-body Siamese cat sprite with sleek cream body and seal-point dark face mask ears paws and tail, slender lean build, mid-leap pose all four paws off the ground, striking bright blue almond eyes wide open, mouth slightly open meowing, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 7. `goldenchinchilla` 金渐层（ESFJ · 客人来了就蹭腿的金渐层）
```
16-bit pixel art, chibi full-body Golden Chinchilla Persian cat sprite with fluffy pale golden coat with dark tipped fur, round flat face flat nose, huge round copper-orange eyes, short legs sitting upright friendly posture, tail curled forward, soft friendly expression, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 8. `persian` 波斯猫（ESFP · 出门必须好看的波斯猫）
```
16-bit pixel art, chibi full-body Persian cat sprite with extremely fluffy long white coat, round flat face with squished nose, huge round blue eyes, short stubby legs, ornate pose head tilted slightly showing off, tail fluffy curved, glamorous confident expression, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 9. `britishshorthair` 英国短毛猫（INTJ · 冷眼观察你的英国短毛猫）
```
16-bit pixel art, chibi full-body British Shorthair cat sprite with round chunky body, dense plush solid blue-gray coat, famous round broad face with full cheeks, big round copper-gold eyes with flat cold expression, sitting upright very still, short sturdy legs, thick tail wrapped around, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 10. `scottishfold` 苏格兰折耳（INTP · 思考了三个小时没动的苏格兰折耳）
```
16-bit pixel art, chibi full-body Scottish Fold cat sprite with round chubby body, soft gray tabby coat, famous tiny folded forward-bent ears flat against head, huge round gold eyes wide open staring off into space blankly lost in thought, sitting in meatloaf pose, dreamy dazed expression, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 11. `tuxedo` 奶牛猫（INFJ · 永远在高处看你的奶牛猫）
```
16-bit pixel art, chibi full-body tuxedo cat sprite with glossy black-and-white bicolor coat, classic white chest and white paws socks and white muzzle with black everywhere else, slender build sitting tall with upright elegant posture on a high perch, piercing yellow-green eyes calmly observing, slight knowing smirk, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 12. `silvertabby` 银渐层（INFP · 活在自己宇宙的银渐层）
```
16-bit pixel art, chibi full-body Silver Tabby British Shorthair cat sprite with shimmering silver coat with soft black tabby stripes, round face, huge bright green eyes gazing upward dreamily at something only it can see, sitting gently, tail curled like a soft crescent, soft melancholy poetic expression, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 13. `americanshorthair` 美国短毛猫（ISTJ · 每顿饭准时出现的美国短毛猫）
```
16-bit pixel art, chibi full-body American Shorthair cat sprite with classic silver-gray coat with bold black tabby swirl pattern on sides, medium build standing at attention four paws squared neatly on the ground, bright gold-green eyes focused ahead serious reliable expression, tail straight down, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 14. `liHua` 狸花猫（ISTP · 一个人拆家高手的狸花猫）
```
16-bit pixel art, chibi full-body Chinese Li Hua cat sprite with muscular short-haired body, warm brown mackerel tabby coat with dark stripes, lean athletic build, alert low crouching pose ready to pounce, sharp yellow-green eyes with cold focused silent expression, one paw slightly raised, tail tip twitching, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 15. `orangetabby` 虎斑橘猫（ISFJ · 记得每个习惯的虎斑橘猫）
```
16-bit pixel art, chibi full-body orange tabby cat sprite with bright orange coat with warm darker orange tabby stripes, slightly plump round body, white belly and paws, sitting with tail wrapped around front paws cozy pose, big amber eyes with warm caring gentle expression, soft smile, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

### 16. `exoticshorthair` 异国短毛猫（ISFP · 躺在阳光里就满足的异短）
```
16-bit pixel art, chibi full-body Exotic Shorthair cat sprite with short plush cream-white coat, flat squished Persian face, huge round copper eyes half closed blissfully content, body completely flopped on its side relaxed loaf pose, soft tummy exposed, serene satisfied tiny smile, single cat centered, bold black pixel outline, pure white background, flat colors with dithering shading, square 1:1 composition, retro video-game sprite, no text, no watermark, clearly visible large blocky pixels
```

## 文件命名清单

| MBTI | cat 字段 | 保存文件名 |
|------|---------|-----------|
| ENTJ | maine | `maine.png` |
| ENTP | bengal | `bengal.png` |
| ENFJ | ragdoll | `ragdoll.png` |
| ENFP | abyssinian | `abyssinian.png` |
| ESTJ | russianblue | `russianblue.png` |
| ESTP | siamese | `siamese.png` |
| ESFJ | goldenchinchilla | `goldenchinchilla.png` |
| ESFP | persian | `persian.png` |
| INTJ | britishshorthair | `britishshorthair.png` |
| INTP | scottishfold | `scottishfold.png` |
| INFJ | tuxedo | `tuxedo.png` |
| INFP | silvertabby | `silvertabby.png` |
| ISTJ | americanshorthair | `americanshorthair.png` |
| ISTP | liHua | `liHua.png` |
| ISFJ | orangetabby | `orangetabby.png` |
| ISFP | exoticshorthair | `exoticshorthair.png` |

## 提交后需更新的文件

1. `src/data/cati/images/` — 放 16 张 PNG
2. `src/data/cati/typeImages.ts` — 改成和 DogTI 同款 import 映射
