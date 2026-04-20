---
name: DESIRE TypeImages · 21 条 Midjourney/ChatHub prompts
description: 一键批量生成 DESIRE 全部 21 个欲望类型（20 主 + XXX 兜底）的隐喻插画卡
type: asset
status: ready
author: cwjjjjj + Claude
created: 2026-04-19
---

# DESIRE 欲望图谱·生图 Prompt 库

> 关上门之后你是谁 —— 用隐喻而不是裸露来回答这个问题。

## ⚠️ 合规红线（必须先读，最关键的一节）

DESIRE 图片是**全盘否决型**风险区，以下内容**任何一项出现都等于整张图作废**：

- **严禁 NSFW / 任何形式的裸露**：不得出现裸体、半裸、透视、内衣特写、暗示性器官轮廓、湿身、裸肩+诱惑姿态等
- **严禁未成年人**：画面里的所有人物必须明显是成年人（25+），绝对不允许儿童、少女、校服、幼态
- **严禁恋物 / 拜物 / 特殊取向图像**：不要皮革束缚、捆绑、项圈、鞭具、刑具、SM 道具
- **严禁胁迫 / 暴力 / 伤害**：没有挣扎、眼泪、淤青、打斗、武器指人
- **严禁成人行业品牌或符号**：不出现夜店招牌、酒吧品牌、情趣用品、成人网站 logo、脱衣舞台、桃心灯箱
- **严禁敏感政治符号 / 宗教冒犯**：不涉及国家领导人、宗教场所私密化、政治暗示
- **严禁真实公众人物面孔**
- **一切都是隐喻**：用道具、光影、空间、留白说话，**不要用身体说话**

**通用替代道具库**（所有 prompt 都从这里选）：
- 空间：closed door / ajar door / hotel hallway / dressing room / balcony at night / empty elevator / bathroom mirror only / unmade bed seen from doorway / midnight subway car
- 物件：single bedside lamp / empty wine glass / silk curtains / neon sign through rain / jewelry on velvet tray / tarot cards / locked diary / moth circling candle / rotary phone off the hook / one lit cigarette in ashtray / crumpled silk robe on chair / keyhole casting light beam
- 人物：**fully clothed Chinese adult**（25-40 岁，robe / suit / slip dress over camisole / trench coat / silk pajamas buttoned），姿态内省、孤独、沉思、克制
- 光源：single warm amber lamp / cold neon crimson through window / moonlight through blinds / candle / phone screen glow / hotel corridor sconces

---

## 用法

### 方式 1：ChatHub 批量（推荐，接 Seedream 4.5 / Nano Banana Pro）
1. 打开 ChatHub（chathub.ai），订阅包含 Seedream 4.5 或 Google Nano Banana Pro 的套餐
2. 新建多模型对话，勾选 **Seedream 4.5**（editorial 中文语义最稳，对 NSFW 过滤也最严）
3. 备选：**Nano Banana Pro**（Google 出品，自带强力 safety filter，DESIRE 这种主题尤其适合用它兜底）
4. 一条条粘贴 prompt —— 每条生成 4 张挑最好的 1 张
5. **挑图时逐条过一遍文末的合规清单**，任何一条不过关就重跑
6. 命名规则：`<CODE>.png`，严格对齐 `src/data/desire/types.ts` 的 `code`
7. 放到 `src/data/desire/images/`（首次创建目录）
8. 更新 `src/data/desire/typeImages.ts` 指向这些本地图片

### 方式 2：Midjourney
- Discord `/imagine` 粘 prompt，用末尾参数 `--ar 1:1 --v 6.1 --style raw --stylize 300`
- MJ 对 NSFW 关键词敏感，本库所有 prompt 已手动去除所有 flag 词
- 如果 MJ 误判，加 `--no nudity, no skin, no suggestive pose` 作为负面

### 方式 3：Stable Diffusion
- Suffix 改成 `--ar 1:1`，去掉 `--v` 和 `--style raw`
- 推荐 SDXL + editorial noir LoRA
- 关闭任何"写实裸露"类 LoRA
- Steps 30 / CFG 7

### 方式 4：DALL·E 3
- 去掉末尾 MJ 参数
- prompt 开头加 `Square 1:1 illustration,`
- API 参数 `size: '1024x1024'`, `quality: 'hd'`, `style: 'natural'`（DESIRE 用 natural 比 vivid 更稳）

---

## 全局风格基底（所有 prompt 内嵌）

DESIRE 的 21 张图是同一个视觉家族，区别于 GSTI（红黑戏剧）、FPI（冷蓝）、FSI（暖琥珀）、MPI（金色发票）：

- **调色**：deep plum / violet / crimson accents on near-black velvet background（#0a0608 底 + #5a1a2e 紫红 + #8b1a3a 绯红 + 少量 #e8d4b8 奶油色肌肤光）
- **氛围**：film noir × Wong Kar-wai × Edward Hopper —— melancholic, introspective, coded, lonely, beautifully sad
- **构图**：单人或无人，1:1 正方形，人物一律**全身着装**，姿态克制、留白充足
- **风格**：editorial satirical Chinese magazine illustration，接近《GQ 中国》《T Magazine》《Kinfolk》那种刊内拉页感
- **光影**：single light source / hard shadows / deep velvet blacks / occasional wet street reflection
- **尺度**：**R13 级别，放得进国内杂志内页**

> 每条 prompt 都会显式带上 `deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood`。

---

## 20 张主类型

### 1. `SOPFEH` 精神鞭手
```
A composed Chinese woman in her early thirties in a tailored dark violet silk robe seated in a velvet armchair, legs crossed, holding a closed psychology hardcover book like a scepter, a single crimson table lamp casting hard shadow of her profile on a plum wall, an untouched glass of red wine beside her, her gaze fixed off-frame with quiet authority, empty chair across from her implying an unseen interlocutor, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 2. `SOBFEH` 感官暴君
```
A confident Chinese man in his thirties in a open-collared midnight-violet shirt standing alone on a penthouse balcony at night, city skyline in deep crimson haze behind him, a tumbler of dark liquor in one hand, jacket slung over the railing, his stance wide and possessive as if the whole city belongs to him, a single gust of silk curtain spilling out from the doorway behind, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 3. `SOBFER` 野兽派选手
```
A Chinese man in his early thirties in a rumpled plum henley and dark trousers seated on the edge of an unmade bed at dawn, one boot on one boot off, back turned to a rotary phone off the hook on the nightstand, a crimson neon sign bleeding through rain-streaked blinds, his posture all instinct and no theater, no performance just residue, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 4. `SOPGLH` 温柔暴君
```
A serene Chinese woman in her thirties in a long plum velvet dress holding a single white moth resting on her outstretched finger, a crimson candle burning low on the vanity beside her, a silk ribbon loosely tied around her wrist trailing onto the floor, her smile gentle but her eyes knowing, a closed ornate jewelry box at her elbow, soft shadow stretching long behind her, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 5. `SOPGLR` 灵魂绑定者
```
A thoughtful Chinese woman in her thirties in a dark crimson knit sweater seated at a writing desk, carefully tying a silk thread around a small locked diary, a single lamp casting warm amber light on her hands, a framed photograph face down beside her, a tarot card of The Lovers placed at the corner of the desk, her attention fully absorbed in the binding ritual, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 6. `MCBGLR` 舒适区守护者
```
A quiet Chinese woman in her thirties in soft plum cotton pajamas curled into the same worn corner of a velvet sofa she has sat in a thousand times, a single bedside lamp glowing amber, a familiar book open on her lap, a chipped teacup on the side table, curtains drawn against the crimson city glow outside, the room small and unchanged, contentment shaded with a hint of quiet stagnation, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 7. `MCPGLR` 月下棉花糖
```
A shy Chinese woman in her late twenties in a long sleeved ivory nightgown standing half hidden behind a gauzy plum curtain on a balcony, moonlight silvering her cheek, her hand pressed against the glass door leaving a faint fog, a single crimson rose forgotten on the floor beside her, her gaze following someone she will never call, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 8. `MOBFEH` 被动攻击型选手
```
A Chinese woman in her early thirties in an elegant dark plum slip dress over a black camisole seated backwards on a velvet chair, chin resting on the chairback, her eyes making direct contact with the viewer while her posture reads as surrender, a single crimson silk scarf draped loosely over the chair arm, a chessboard with only a queen left standing on the small table beside her, soft single-source lamp, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 9. `MOBFER` 快感收割机
```
A Chinese woman in her thirties in a well-cut plum trench coat buttoned up, sitting on the edge of a hotel bed checking her wristwatch, an empty wine glass and a single folded crimson receipt on the nightstand, her handbag already on her shoulder, the room lit by a single neon sign through the window, efficient and unsentimental, the aftermath of a transaction of pleasure with no lingering, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 10. `MCBFER` 闷骚终结者
```
A composed Chinese man in his thirties in a buttoned crisp white shirt and dark plum tie loosened only one finger width, standing in an empty office elevator going up late at night, the crimson floor indicator glowing above him, his reflection in the polished brass wall showing a faintly different expression than his face, briefcase at his feet, the single fluorescent panel casting hard shadow, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 11. `SCPFEH` 脑内剧场VIP
```
A Chinese person in their thirties in a dark plum velvet smoking jacket seated alone in an empty old private cinema, only one seat occupied, a crimson curtain slightly parted on the distant screen showing nothing, a glass of wine balanced on the armrest, their face lit by the faint projector beam, lost in a movie only they can see, rows of empty velvet seats in silhouette, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 12. `SCPGLH` 月光猎人
```
A cool elegant Chinese woman in her thirties in a long charcoal-plum coat standing motionless at a rain-streaked window of a high-rise at midnight, neon crimson sign bleeding across her profile, a single glass of dark wine held loosely at her side, no expression only patience, a silk trap of curtains pooled on the floor behind her, the city below reduced to scattered points of light, the hunter who never chases, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 13. `SOBGLH` 感官美食家
```
A refined Chinese woman in her thirties in a dark plum silk blouse seated at a dressing table, carefully lifting a single crystal perfume stopper to inhale, a velvet tray of jewelry arranged with obsessive precision, a crimson flower in a narrow vase, her eyes half closed in connoisseur's evaluation, warm amber lamp on one side cold blue moonlight on the other, every detail curated, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 14. `MCPFEH` 禁区探险家
```
A studious Chinese person in their late twenties in a dark plum cardigan seated cross-legged on the floor of a library at night, surrounded by old books, one book held open on their lap with a faint crimson ribbon bookmark, a single desk lamp on the floor creating a pool of warm light, their expression intensely curious and slightly guilty, a locked wooden box pushed just slightly out from a shelf behind them, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 15. `MOBGLH` 丝绒陷阱
```
A softly smiling Chinese woman in her early thirties in a long plum velvet wrap dress fully tied, seated on a deep velvet couch patting the cushion beside her in invitation, a single crystal decanter and two empty glasses on the low table, warm amber firelight creating long shadows, a carnivorous flower in a small pot on the mantelpiece behind her, her gentleness disarmingly total, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 16. `MCBGLH` 暗涌
```
A quiet Chinese woman in her thirties in a buttoned plum silk pajama set standing still in the middle of a dim bedroom, back to the viewer, facing a floor-to-ceiling window where rain streams down in rivers of crimson neon reflection, her hand resting flat on the glass, the bedside lamp unlit, one earring placed carefully on the nightstand, enormous emotion contained in absolute stillness, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 17. `SOPFER` 真实系暴君
```
A direct Chinese man in his thirties in a plain dark plum henley and dark denim standing in the doorway of a bedroom with his hand on the light switch, no smile no seduction just unflinching eye contact, an untouched glass of water on the nightstand instead of wine, the room plainly lit by a single overhead fixture with no mood lighting, his certainty taking up the whole frame, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 18. `MCPGLH` 月光诗人
```
A sensitive Chinese person in their late twenties in a oversized plum knit sweater seated on a windowsill at midnight, knees drawn up, a leather notebook open on their lap with handwritten lines visible, a single unlit crimson candle on the sill beside them, moonlight through old lace curtains casting filigree shadow on their face, a pen held still mid-thought, longing written into posture not action, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 19. `SOBGLR` 锚点
```
A steady Chinese man in his thirties in a dark plum sweater seated at the head of a small dinner table set for two, a single lit candle in crimson holder between the two plates, one chair opposite him clearly belonging to the same person it has always belonged to, a bottle of wine already opened and breathing, rain soft against the window, his expression calm and unchanged as it has been for ten years, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

### 20. `MCBFEH` 深夜变身者
```
A Chinese person in their thirties standing in a bathroom at 2 AM, daytime business shirt unbuttoned only at the collar still tucked into slacks, looking at their own reflection in the mirror which shows a version with slightly sharper eyes and different posture, a single overhead light casting the face half in plum shadow half in amber, the day's tie hung over the towel rack, two selves in one frame, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 兜底 1 张

### 21. `XXX` 潘多拉（兜底 / 最后的选项）
```
An empty high-backed velvet armchair in a dim room, a dark plum silk robe discarded across its arm still holding the shape of a body, a single closed wooden box on the seat cushion with an ornate brass lock, one key lying beside it on the floor, a bedside lamp casting warm amber light from off-frame, soft crimson shadow on the wall in the vague silhouette of a person no longer there, no figure visible only the traces they left, the secret contained not revealed, deep plum and crimson accents on near-black velvet background, editorial satirical Chinese magazine illustration, no visible brand logos, fully clothed, metaphorical not explicit, melancholic noir mood --ar 1:1 --v 6.1 --style raw --stylize 300
```

---

## 批量跑完后的接入步骤

```bash
# 1. 建目录 & 放图（命名严格对齐 type code）
mkdir -p src/data/desire/images

# 21 个文件名：
# SOPFEH.png SOBFEH.png SOBFER.png SOPGLH.png SOPGLR.png
# MCBGLR.png MCPGLR.png MOBFEH.png MOBFER.png MCBFER.png
# SCPFEH.png SCPGLH.png SOBGLH.png MCPFEH.png MOBGLH.png
# MCBGLH.png SOPFER.png MCPGLH.png SOBGLR.png MCBFEH.png
# XXX.png
```

**方案 A — 相对路径 import（推荐，Vite hash + 压缩）：**
```typescript
// src/data/desire/typeImages.ts
import sopfeh from './images/SOPFEH.png';
import sobfeh from './images/SOBFEH.png';
import sobfer from './images/SOBFER.png';
import sopglh from './images/SOPGLH.png';
import sopglr from './images/SOPGLR.png';
import mcbglr from './images/MCBGLR.png';
import mcpglr from './images/MCPGLR.png';
import mobfeh from './images/MOBFEH.png';
import mobfer from './images/MOBFER.png';
import mcbfer from './images/MCBFER.png';
import scpfeh from './images/SCPFEH.png';
import scpglh from './images/SCPGLH.png';
import sobglh from './images/SOBGLH.png';
import mcpfeh from './images/MCPFEH.png';
import mobglh from './images/MOBGLH.png';
import mcbglh from './images/MCBGLH.png';
import sopfer from './images/SOPFER.png';
import mcpglh from './images/MCPGLH.png';
import sobglr from './images/SOBGLR.png';
import mcbfeh from './images/MCBFEH.png';
import xxx from './images/XXX.png';

export const TYPE_IMAGES: Record<string, string> = {
  SOPFEH: sopfeh,
  SOBFEH: sobfeh,
  SOBFER: sobfer,
  SOPGLH: sopglh,
  SOPGLR: sopglr,
  MCBGLR: mcbglr,
  MCPGLR: mcpglr,
  MOBFEH: mobfeh,
  MOBFER: mobfer,
  MCBFER: mcbfer,
  SCPFEH: scpfeh,
  SCPGLH: scpglh,
  SOBGLH: sobglh,
  MCPFEH: mcpfeh,
  MOBGLH: mobglh,
  MCBGLH: mcbglh,
  SOPFER: sopfer,
  MCPGLH: mcpglh,
  SOBGLR: sobglr,
  MCBFEH: mcbfeh,
  XXX: xxx,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
```

**方案 B — CDN 外链**（适合 >1MB 单图，配合 Vercel / Cloudflare Images；DESIRE 主题建议挂敏感度更低的私有 CDN，别用公共图床）

---

## 预算和时间估算

- **ChatHub + Seedream 4.5**：21 张 × 4 变体 ≈ 84 张出图，套餐 $20-40/月够用
- **Midjourney**：Basic $10/月 200 GPU 分钟，21 张够跑两轮
- **DESIRE 特别提示**：这类主题 **挑图时间 > 出图时间**，建议预留 2-3 轮重跑
- **时间**：熟练用户 21 条 prompt ≈ **2 小时**（含合规审核）
- **后处理**：批量裁切 + 合规复查 1 小时
- **总成本**：$30-50 + 3 小时人工 ≈ 300 元 + 大半天

---

## 质量红线

- **必须**：
  - 中国成年面孔（25+）
  - 全身着装（no skin beyond face / hands / ankles）
  - deep plum + crimson + near-black 配色
  - 正方形 1:1
  - 单一主体或无人
  - 隐喻优先（道具/光影/空间说话）
- **禁止**：
  - 任何裸露 / 半裸 / 透视 / 内衣特写
  - 任何未成年人或幼态角色
  - 任何 SM 道具 / 束缚 / 皮具捆绑
  - 任何胁迫 / 暴力 / 眼泪 / 血迹
  - 任何成人行业 logo / 夜店招牌 / 情趣用品
  - 任何真实公众人物面孔
  - 被 MJ 带偏成蓝色 / 绿色主调
- **鼓励**：Wong Kar-wai 式光影 / Hopper 式孤独 / 克制的情绪张力 / 留白

---

## 合规自检清单（每张图出图后逐条过，任何一条 NO 就重跑）

- [ ] 图中人物**全身着装**，没有任何裸露 / 半裸 / 透视
- [ ] 图中人物明显是**成年人**（25+），没有少女/校服/幼态
- [ ] 没有 SM / 束缚 / 皮具 / 刑具 / 项圈 / 捆绑
- [ ] 没有眼泪 / 淤青 / 挣扎 / 被迫姿态
- [ ] 没有成人行业 / 夜店 / 情趣用品 logo
- [ ] 没有真实公众人物面孔
- [ ] 没有政治敏感符号 / 宗教场所被私密化
- [ ] 主色调是 deep plum + crimson + near-black，没有被 AI 带偏
- [ ] 面孔是中国成年人，不是白人 / 其他族裔
- [ ] 1:1 正方形
- [ ] 整体**可以放进国内杂志内页**，不会让任何人不舒服

---

## 改动日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-19 | v1 初版 —— 21 条 DESIRE prompt（plum-crimson-noir 美学，metaphor-first） | cwjjjjj + Claude |
