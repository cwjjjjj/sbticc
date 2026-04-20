---
name: FSI TypeImages · 20 条 Midjourney/ChatHub prompts
description: 一键批量生成 FSI 全部 20 个类型（18 主类型 + BOSSY 隐藏 + FAMX? 兜底）的插画卡，统一暖色系、温柔调性
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-18
---

# FSI 类型卡·生图 Prompt 库

> **FSI（Family Survivor Index / 原生家庭幸存者）**：18 主 + 1 隐藏(BOSSY) + 1 兜底(FAMX?) = 20 张图

## ⚠️ 调性警告（最重要）

**FSI images must stay warm and gentle — this test addresses family trauma. Avoid any mockery, sharp-red accents, or visual gags. Dignity over satire.**

- FSI 不是 GSTI / SBTI 的荒诞搞笑路线；它触碰的是"原生家庭创伤"这种敏感议题
- 画面里出现的是"正在长大的人"和"家"，不是"物种标本"
- 面孔要**有尊严**：不要丑化、不要夸张表情、不要把人物画成反面角色
- **禁止的红色 accent / 霓虹 / 赛博朋克 / 讽刺漫画面部变形** —— 那是 GSTI 的语言，不是 FSI 的
- 有疑问时默认：**更暖一点、更轻一点、更安静一点**

## 用法

### 方式 1：ChatHub / Midjourney（推荐）
1. ChatHub 付费版同时调 MJ / DALL-E 3 / Stable Diffusion，一次 prompt 多模型对比出图
2. 或直接 MJ（Discord / 官方 web），把下面每条 prompt 粘贴到 `/imagine`
3. 每条 prompt 跑 4 变体，挑最温柔、最有"家的温度"的那张
4. 命名规则：保存为 `COPYX.png` / `BOSSY.png` / `FAMX_.png`（`?` 不能做文件名，用 `_` 代替）
5. 图片放到 `src/data/fsi/images/`
6. 在 `src/data/fsi/typeImages.ts` 里 `import` 进来

### 方式 2：Seedream 4.5 / Nano Banana Pro（中文脸推荐）
- 这两个模型对**中国面孔 + 东亚居家场景**理解更准（MJ 的脸偶尔会欧化）
- 去掉末尾 MJ 参数 `--ar 1:1 --v 6.1 --style raw --stylize 250`
- 自己的 prompt 开头加 `1:1 square illustration,`
- 分辨率拉到 1024×1024 或 1536×1536

### 方式 3：DALL·E 3（OpenAI API）
- 去掉末尾 MJ 参数
- Prompt 开头加 `Square 1:1 warm illustration,`
- API 请求 `size: '1024x1024'`, `quality: 'hd'`, `style: 'natural'`（**注意是 natural 不是 vivid**——FSI 要自然不要浓艳）

## 全局风格基底（所有 prompt 内嵌）

统一视觉语言保证 20 张图并排时像一本家庭摄影册：

- **人物**：Chinese young adults or families（中国青年/家庭成员），真诚、有尊严的表情，不丑化
- **调色**：soft amber / warm sepia / muted gold / cream beige（#f5e6d3 / #d4a574 / #8b6f47 系）——**严禁红色 accent 和霓虹**
- **光影**：golden-hour sunlight / warm home interior light / soft window glow / afternoon sunbeams
- **场景**：Chinese family living rooms, kitchens, old family photos, childhood bedrooms, balconies, train windows
- **风格**：warm editorial illustration / Chinese magazine 家 feature / childhood memory aesthetic / gentle watercolor feel
- **比例**：1:1 正方形
- **尾参数**：`--ar 1:1 --v 6.1 --style raw --stylize 250`（stylize 从 GSTI 的 300 降到 250，更写实更柔）

---

## 20 张 prompts

### 1. `COPYX` 复印机娃
```
A young Chinese adult standing in a warm kitchen with their mother, both making the exact same hand gesture while talking, same posture, same head tilt, soft afternoon sunlight through window, reflection showing the subtle realization on the young person's face, amber and cream palette, gentle editorial illustration, Chinese family magazine style, warm and tender mood --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 2. `REBEL` 反叛军
```
A young Chinese person walking away down a sunlit alley with a small bag over their shoulder, head half-turned back with a tender complicated expression, warm late-afternoon golden light, childhood home blurred in the soft background, muted sepia and honey palette, editorial illustration, warm memory aesthetic, dignified not angry --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 3. `SAINT` 在逃孝子
```
A young Chinese adult carefully carrying grocery bags and holding an elderly parent's arm up the stairs of an old residential building, both slightly tired but smiling, warm evening sunset light, faded green-painted walls typical of Chinese old apartments, sepia and amber palette, tender editorial illustration, Chinese family life --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 4. `LEAVE` 断亲先锋
```
A quiet suitcase standing by a wooden apartment door with warm afternoon light falling through, a young Chinese person's hand gently on the handle, their silhouette soft and contemplative, family photos on the hallway wall behind, muted beige and honey palette, warm editorial illustration, dignified departure, no drama --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 5. `CURE!` 重养自己
```
A young Chinese adult sitting cross-legged on a sunlit bedroom floor, gently holding a translucent ghostly image of their own child self in their arms, eyes closed with a tender peaceful expression, soft golden-hour light streaming through a window, cream and warm gold palette, gentle editorial illustration, healing aesthetic --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 6. `SILNT` 假装没事人
```
A young Chinese person on a video call with family, softly smiling at the laptop screen while their shoulders are subtly tense and one hand clenches the edge of the desk out of frame, warm lamp light in a small apartment bedroom, muted sepia and cream palette, empathetic editorial illustration, quiet emotional honesty --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 7. `DADY+` 缺爹选手
```
A young Chinese adult sitting at a kitchen table with a bowl of warm soup, an empty chair across from them with soft golden window light falling on its seat suggesting absence, an old framed photo of a father figure slightly out of focus on the wall, muted amber and honey palette, warm editorial illustration, gentle melancholy --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 8. `MAMY+` 过量母爱
```
A young Chinese adult wrapped in a very big affectionate hug from a mother figure, the embrace both loving and slightly suffocating, the young person's hands lifted slightly as if asking for a little room to breathe, warm living room with tea cups and fruit on the table, sepia and amber palette, tender editorial illustration, love and boundary --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 9. `PICKR` 挑剔型
```
A young Chinese person standing in front of a bathroom mirror in warm morning light, gently adjusting their own collar while their reflection shows a critical concerned expression, hand slightly raised to check a detail on their face, cream and honey palette, soft editorial illustration, introspective not harsh --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 10. `PLEASE` 讨好系
```
A young Chinese person at a family dinner table smoothing over a small awkward moment, pouring tea for others with a gentle smile, shoulders slightly curved inward, warm round table filled with dishes, soft pendant lamp light overhead, amber and cream palette, empathetic editorial illustration --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 11. `GOLD+` 别人家小孩
```
A young Chinese adult in neat clothes standing in front of a wall of old family photos and school merit certificates, a slight tender emptiness in their eyes, warm living room lamp light behind them, muted sepia and gold palette, editorial illustration, the weight of being the good one, gentle --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 12. `GHOST` 家庭隐身术
```
A young Chinese person sitting quietly on the edge of a family sofa while relatives chat animatedly around them, their figure soft and slightly translucent as if blending into the beige wallpaper, warm afternoon light, honey and cream palette, tender editorial illustration, quiet presence --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 13. `SOS!` 家庭灭火员
```
A young Chinese person standing between two family members having a quiet tension at a kitchen table, calmly pouring tea for both, warm pendant lamp light overhead, everyone's faces soft and human not angry, sepia and amber palette, editorial illustration, the peacemaker in warm tones --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 14. `BANK!` 家庭 ATM 候选人
```
A young Chinese adult at a small desk in a tiny apartment transferring money on their phone while an instant noodle cup sits beside them, a family photo on the desk where their smile matches everyone else's, warm desk lamp glow, muted amber and cream palette, tender editorial illustration, dutiful not bitter --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 15. `PRNS+` 公主/王子病
```
A young Chinese adult sitting gracefully on a sunlit sofa in a carefully decorated family living room, parents in the soft background attentively bringing fruit and tea, the young person's expression innocent and a little unaware, delicate porcelain cups and lace curtains, cream and pale gold palette, warm editorial illustration, loved and slightly sheltered --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 16. `TOOLX` 家庭工具人
```
A young Chinese adult fixing a lamp in a family living room while also holding a phone answering a sibling's call, a toolbox and a bill pile nearby, warm evening light from the repaired lamp itself, muted sepia and honey palette, empathetic editorial illustration, quietly useful, dignified not mocking --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 17. `BRAG+` 幸运幸存者
```
A warm Chinese family of four relaxed on a sofa and floor cushions laughing together over tea and fruit, golden-hour sunlight through the window, healthy happy atmosphere without being saccharine, soft amber and cream palette, editorial illustration, Chinese family magazine 家 feature style, the lucky ones --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 18. `DUAL!` 切换人格
```
Diptych-style portrait of the same young Chinese adult: left half at a family dinner in a cozy home wearing a softer polite expression, right half at a rooftop with friends laughing more freely, warm golden light unifying both halves, sepia and honey palette, empathetic editorial illustration, the two versions of one person, both real --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 19. `BOSSY` 家族 CEO  *(hidden)*
```
A young Chinese adult calmly seated at the head of a large family dining table during a New Year reunion, relatives of different generations attentively listening, red envelopes neatly arranged in front of them, the young person's expression composed and slightly weary, warm pendant lamp light, amber and muted gold palette, editorial illustration, the one who took the wheel, dignified complexity --ar 1:1 --v 6.1 --style raw --stylize 250
```

### 20. `FAMX?` 家庭乱码人  *(fallback)*
```
A soft silhouette of a young Chinese person assembled from overlapping translucent family photographs of different decades, photos of parents, grandparents, siblings, childhood homes all layered into their outline, warm sepia tones with gentle golden edges, muted amber and cream palette, contemplative editorial illustration, unresolved but tender, no sharp edges --ar 1:1 --v 6.1 --style raw --stylize 250
```

---

## 批量跑完后的接入步骤

```bash
# 1. 放图（命名严格对齐 type code；? 和 ! 在文件名用 _ 代替）
mkdir -p src/data/fsi/images
# 把 20 张图放进去：
#   COPYX.png  REBEL.png  SAINT.png  LEAVE.png  CURE_.png
#   SILNT.png  DADY_.png  MAMY_.png  PICKR.png  PLEASE.png
#   GOLD_.png  GHOST.png  SOS_.png   BANK_.png  PRNS_.png
#   TOOLX.png  BRAG_.png  DUAL_.png  BOSSY.png  FAMX_.png

# 2. 改 src/data/fsi/typeImages.ts 从占位切到真图
```

**方案 A — 相对路径 import（推荐，Vite 会 hash + 压缩）：**
```typescript
// src/data/fsi/typeImages.ts
import copyx from './images/COPYX.png';
import rebel from './images/REBEL.png';
import saint from './images/SAINT.png';
import leave from './images/LEAVE.png';
import cure  from './images/CURE_.png';
import silnt from './images/SILNT.png';
import dady  from './images/DADY_.png';
import mamy  from './images/MAMY_.png';
import pickr from './images/PICKR.png';
import please_ from './images/PLEASE.png';
import gold  from './images/GOLD_.png';
import ghost from './images/GHOST.png';
import sos   from './images/SOS_.png';
import bank  from './images/BANK_.png';
import prns  from './images/PRNS_.png';
import toolx from './images/TOOLX.png';
import brag  from './images/BRAG_.png';
import dual  from './images/DUAL_.png';
import bossy from './images/BOSSY.png';
import famx  from './images/FAMX_.png';

export const TYPE_IMAGES: Record<string, string> = {
  COPYX: copyx,
  REBEL: rebel,
  SAINT: saint,
  LEAVE: leave,
  'CURE!': cure,
  SILNT: silnt,
  'DADY+': dady,
  'MAMY+': mamy,
  PICKR: pickr,
  PLEASE: please_,
  'GOLD+': gold,
  GHOST: ghost,
  'SOS!': sos,
  'BANK!': bank,
  'PRNS+': prns,
  TOOLX: toolx,
  'BRAG+': brag,
  'DUAL!': dual,
  BOSSY: bossy,
  'FAMX?': famx,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — SBTI 旧式 base64 内嵌**（不推荐，会让 JS bundle 膨胀 1-2MB）
**方案 C — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images）

## 预算和时间估算

- **Midjourney**：Basic $10/月，20 张 × 4 变体 × 1 分钟 ≈ 80 GPU 分钟，Basic 200 分钟足够
- **ChatHub Plus**：$20/月同时调 MJ + DALL-E 3 + SD，对比出图最省时间
- **时间**：熟练用户 20 条 prompt 跑完约 **1.5-2 小时**（包括挑图，FSI 挑图要更慢一点——每一张都要确认"有没有伤人"）
- **后处理**：Photoshop 批量裁切 30 分钟
- **总成本**：$20-30 + 3 小时人工 ≈ 300 元 + 半天

## 质量红线（FSI 专属，比 GSTI 严格）

- **必须**：中国面孔 / 暖色调 / 正方形 / 人物有尊严 / 画面像"一家人的故事"而不是"物种鉴定"
- **禁止**：
  - 任何红色 accent / 霓虹 / 赛博朋克配色（那是 GSTI 的）
  - 任何面部丑化、夸张表情、讽刺漫画风格
  - 任何血腥、裸露、宗教符号恶搞
  - 任何可识别的真实公众人物、真实品牌 logo
  - 把"有创伤的人"画成受害者奇观——保持 dignified
- **鼓励**：
  - 金色夕阳光、老居民楼、旧相框、家常饭桌——唤起"中国家"的共同记忆
  - 人物眼神里有一点点未说出口的东西（不是笑得毫无心事）
  - 让看图的人觉得"这是一个正在长大的人，不是一个标签"

## 验收自检（出图后每张必过）

- [ ] 这张图放在 20 张里，色调是否和谐，有没有突兀的高饱和？
- [ ] 人物面孔有没有被丑化？是不是一个我愿意承认是"我自己"的形象？
- [ ] 画面里有没有偷偷用 GSTI 语言（红色、霓虹、讽刺）？有就重跑
- [ ] 如果一个正在和原生家庭较劲的用户看到，会觉得"被看见"还是"被嘲讽"？前者通过，后者重跑

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 —— 20 条 warm-tone prompt（18 主 + BOSSY + FAMX?） | cwjjjjj + Claude |
