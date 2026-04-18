# FPI 朋友圈人设诊断 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增第二阶段低风险接续测试 FPI（Feed Persona Index · 朋友圈人设诊断）。用户答 24 题覆盖 6 维度（POST/POLI/MASK/EMOT/ECHO/GATE），匹配到 20 个"朋友圈物种"之一，触发条件下还可命中隐藏类型 `0POST`（朋友圈坟墓）。主打"你以为你在记录生活，其实你在经营人设"的自嘲钩子，结果页可直接截图发朋友圈。

**Architecture:** 作为第 8 个测试加入现有多入口架构（`fpi.html` + `src/FpiApp.tsx` + `src/data/fpi/`）。**没有性别锁定**——`genderLocked` 字段留空，不弹 GenderPicker，`computeResult` 走稳定的 4 参调用（`answers, hiddenTriggered, config, debugForceType`），第 5 参 `gender` 省略。其余核心组件（ResultPage / QuizOverlay / Interstitial / RankingPage / CompatTable / ShareModal）100% 复用。仅在 FpiApp 结果页顶部加入轻量 `FPIHeroBadge`（模拟朋友圈截图贴纸视觉）。

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion，沿用现有 Redis 排行榜与分享海报管线。

**Spec:** `docs/superpowers/specs/2026-04-17-fpi-feed-persona-design.md`

---

## File Structure

### 新建文件
| File | Purpose |
|------|---------|
| `fpi.html` | Vite 入口 HTML（内联 import `FpiApp`，参考 `cyber.html` / `gsti.html`） |
| `src/FpiApp.tsx` | 顶层 App，`TestConfigProvider + AppInner` 模式（仿 `LoveApp.tsx`，无 GenderPicker） |
| `src/data/fpi/dimensions.ts` | 6 维度定义 POST / POLI / MASK / EMOT / ECHO / GATE |
| `src/data/fpi/questions.ts` | 24 主题目（每维 4 题）+ 1 gate 题 `fpi_gate` |
| `src/data/fpi/types.ts` | 20 常规类型 + `0POST` 隐藏 + `FEED?` 兜底 + NORMAL_TYPES + TYPE_RARITY |
| `src/data/fpi/typeImages.ts` | 占位空 Record（首版走 CSS 生成卡片） |
| `src/data/fpi/compatibility.ts` | 占位 stub（与 GSTI 首版策略一致，MVP 不启用 compat tab） |
| `src/data/fpi/config.ts` | FPI TestConfig 实例，`id='fpi'`，`basePath='/new/fpi'` |
| `src/components/FPIHeroBadge.tsx` | 结果页顶部"朋友圈截图贴纸"徽章（仅 FPI 渲染） |

### 修改文件
| File | Change |
|------|--------|
| `src/components/ResultPage.tsx` | 增加可选 prop `testBadge?: ReactNode` 插槽（或用 `config.id === 'fpi'` 条件分支），不破坏现有 7 个测试 |
| `vite.config.ts` | `rollupOptions.input` 新增 `fpi: 'fpi.html'` |
| `build.sh` | 测试产物复制循环追加 `fpi` |
| `index.html` | Hub 首页新增 FPI 卡片（8 个卡片 + 动画 delay + `tests` 数组追加 `'fpi'`） |
| `api/record.js` | `VALID_TYPES_BY_TEST.fpi` 新增 22 个 code（20 + `0POST` + `FEED?`） |
| `api/ranking.js` | `MOCK_TYPES_BY_TEST.fpi` 与 `HIDDEN_TYPE_BY_TEST.fpi='0POST'` |

> **`matching.ts` 不需要改**：FPI 不使用 `genderLocked`，走 `computeResult` 既有路径即可。调用签名保持 4 参：`computeResult(answers, hiddenTriggered, config, debugForceType)`。

---

## Dimension Conventions

FPI 采用 6 维，每维 `L/M/H` 三档，与 GSTI 校准后同构。24 题平均覆盖，每维 4 题。

| 维度 | Code | 高分含义 | 低分含义 | 说明 |
|------|------|----------|----------|------|
| D1 | POST | H=高频更新、生活随手上架 | L=极少发布、动态长期停尸 | 发布密度 |
| D2 | POLI | H=图文精修、排版、滤镜 | L=随手发、粗糙但真实 | 精修强度 |
| D3 | MASK | H=明确经营形象 | L=想到什么发什么 | 人设意识 |
| D4 | EMOT | H=情绪外放 | L=情绪收纳 | 情绪电压 |
| D5 | ECHO | H=在意点赞评论、擅抛钩子 | L=发完就走、不等反馈 | 互动渴望 |
| D6 | GATE | H=分组/三天可见/屏蔽熟练 | L=边界松、谁看都一样 | 边界控制 |

题目 `value` 映射：
- `1` = 强指向低分（L 极）
- `2` = 偏 L
- `3` = 偏 H
- `4` = 强指向高分（H 极）

每维度 raw score = 该维度 4 题 value 之和（范围 4-16）。用 `sumToLevel` 换算成 `L` / `M` / `H`：
- `score ≤ 8` → `L`（平均 ≤ 2）
- `9 ≤ score ≤ 12` → `M`（平均 2.25-3）
- `score ≥ 13` → `H`（平均 ≥ 3.25）

用户向量 = 6 维 L/M/H → levelNum 数组 `[1/2/3, ..., 1/2/3]`。

Pattern 字符串 6 字符 `L`/`M`/`H`（对齐 GSTI 三档校准），matching 里 `levelNum` 把 L→1、M→2、H→3，最小 Hamming/Manhattan 距离即最匹配。`maxDistance = 12`（6 维 × 最大差 2）。

**Pattern 去重承诺**：20 个 normal pattern 全部 unique（已设计为两两最小 Hamming distance ≥ 2），避免 GSTI v1 的"半数 pattern 撞车"问题。

### 隐藏触发（`0POST` 朋友圈坟墓）

- `fpi_gate` 题目：`你上一次认真发朋友圈是什么时候？`
- 选项：
  - A `value=1` 这周
  - B `value=2` 这个月
  - C `value=3` 半年内
  - D `value=4` 我已经不记得朋友圈入口长什么样
- 选 D → `hiddenTriggered=true` → 强制结果为 `0POST`。
- 即使触发也继续答完 24 题，因为维度雷达图仍可正常展示（`ResultPage` 不受影响）。

### 兜底类型 `FEED?`（内容乱码人）

当用户最佳匹配 similarity < 55 时由 `matching.ts` 的现有 fallback 分支接管，返回 `FEED?`。

---

## Task 1：创建 fpi.html 入口

**Files:**
- Create: `fpi.html`

- [ ] **Step 1: 创建 fpi.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>朋友圈人设诊断 — 你在朋友圈是什么物种 | 免费测试</title>
  <meta name="description" content="24 道灵魂拷问，6 个维度，20 种朋友圈物种。九宫格暴君 vs 三天可见教主 vs 朋友圈坟墓，测测你的 Feed Persona。" />
  <meta name="keywords" content="朋友圈测试,人设测试,社交媒体测试,FPI,朋友圈物种" />
  <link rel="canonical" href="https://sbti.jiligulu.xyz/new/fpi" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="朋友圈人设诊断 — 你在朋友圈是什么物种" />
  <meta property="og:description" content="你不是在记录生活，你是在给生活做商业精修。测出你的朋友圈物种。" />
  <meta property="og:url" content="https://sbti.jiligulu.xyz/new/fpi" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="朋友圈人设诊断 — 你在朋友圈是什么物种" />
  <meta name="twitter:description" content="你不是在记录生活，你是在给生活做商业精修。测出你的朋友圈物种。" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "FPI 朋友圈人设诊断",
    "description": "24 题 6 维度，20 种朋友圈物种，测出你的 Feed Persona。",
    "educationalLevel": "entertainment"
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import FpiApp from './src/FpiApp.tsx'
    import './src/index.css'

    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(React.StrictMode, null,
        React.createElement(FpiApp)
      )
    )
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run: `ls fpi.html && head -1 fpi.html`
Expected: 文件存在，首行 `<!DOCTYPE html>`。

- [ ] **Step 3: Commit**

```bash
git add fpi.html
git commit -m "feat(fpi): add fpi.html vite entry"
```

---

## Task 2：创建 dimensions.ts

**Files:**
- Create: `src/data/fpi/dimensions.ts`

- [ ] **Step 1: 创建文件**

```typescript
// src/data/fpi/dimensions.ts
import type { DimensionInfo } from '../testConfig';

export const dimensionMeta: Record<string, DimensionInfo> = {
  D1: { name: '发布密度', model: 'POST 模型' },
  D2: { name: '精修强度', model: 'POLI 模型' },
  D3: { name: '人设意识', model: 'MASK 模型' },
  D4: { name: '情绪电压', model: 'EMOT 模型' },
  D5: { name: '互动渴望', model: 'ECHO 模型' },
  D6: { name: '边界控制', model: 'GATE 模型' },
};

export const dimensionOrder = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  D1: {
    L: '你属于朋友圈低产出党——动态停更好几个月都不算奇怪。你不是没生活，你是觉得"生活不必分享"。优点是朋友对你偶尔发一条充满好奇，缺点是时间一长，别人都快忘了你长什么样。',
    M: '你发朋友圈的频率属于"健康活人"档——心情来了发一条，心情没了停半个月，不刷屏也不停尸。你把朋友圈当成生活备忘录，用得住但不依赖。',
    H: '你是朋友圈高密度用户——一天三条起步，餐前仪式感、窗外光线、地铁人群都能变成素材。你不是在记录生活，你是在日更一本关于自己的轻小说。',
  },
  D2: {
    L: '你发东西不修图、不排版、不配文案，糊了就糊了。你的朋友圈主打"原图直出派"，真实是真的真实，但刷到的人有时会觉得"你这审美是对朋友的一种考验"。',
    M: '你会简单调调色、裁个图，但不会花半小时磨皮。你的朋友圈精致度在线，也不至于让人看出你私下研究了三套 VSCO 预设。',
    H: '你是朋友圈视觉总监——滤镜统一、九宫格排版、文案反复润色，每一条都像在为下一次回忆整理展览。优点是好看，缺点是你对自己的朋友圈像对甲方交稿。',
  },
  D3: {
    L: '你发朋友圈很少想"别人会怎么看我"。你想表达就表达，素颜就素颜，狼狈就狼狈。你觉得朋友圈是给自己留的记号，不是给观众看的发行物。',
    M: '你偶尔会想"这条发出去像什么感觉"，但不会为了这个删改三遍。你在真实和人设之间有一个稳定的平衡点——既不完全放开，也不完全经营。',
    H: '你对朋友圈的"对外形象"有一套清晰的经营思路——哪条要发、哪条不能发、什么时候发、艾特谁、配什么图，你心里有一张策划表。你把朋友圈当成个人品牌的前台。',
  },
  D4: {
    L: '你的朋友圈几乎不承载情绪——不发 emo、不转"正好被这段话击中"的推送、不吐槽天气。情绪你自己消化，动态留给信息。你觉得"公开情绪"是对他人的消耗。',
    M: '你偶尔会发情绪类内容，但不会把朋友圈当成精神出口——心情很重时你会写小作文，大部分时候一句 meme 化的吐槽就够了。',
    H: '你的朋友圈是你情绪的主要出口——开心要发、难过要发、emo 要发、愤怒更要发。别人刷你朋友圈就像在看一档不按集数播放的情绪连续剧。',
  },
  D5: {
    L: '你发完朋友圈基本不回头看——点赞多少、谁评论、热度如何，你都不太在意。你发它是为了发，不是为了收到什么。',
    M: '你会偶尔刷新看一眼，看见好朋友点赞和评论会开心，但不会因为冷场就删帖。你对互动的态度是"有就爽，没有就算"。',
    H: '你是朋友圈"互动体质"——发完不停刷新，数点赞、看评论、回每一条。没人互动你会怀疑人生、怀疑发布时间、怀疑文案、甚至怀疑自己。',
  },
  D6: {
    L: '你几乎不用分组、不屏蔽、不三天可见。你的朋友圈对所有人都是同一份——同事能看见你半夜 emo，父母能看见你夜店打卡。你管这叫坦诚，朋友圈的观众席管这叫"没有边界"。',
    M: '你有基础的边界感——亲戚群组会屏蔽一点，前任大概拉黑了，但日常不至于每发一条都精心分组。',
    H: '你是朋友圈权限管理员——同事分组、家人分组、前任分组、路人分组、"不想被点赞"分组都齐活。三天可见是默认配置，权限颗粒度比公司 OA 还细。',
  },
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误（或仅现有无关错误）。

- [ ] **Step 3: Commit**

```bash
git add src/data/fpi/dimensions.ts
git commit -m "feat(fpi): add 6-dimension metadata + L/M/H explanations"
```

---

## Task 3：创建 typeImages.ts 和 compatibility.ts 占位

**Files:**
- Create: `src/data/fpi/typeImages.ts`
- Create: `src/data/fpi/compatibility.ts`

- [ ] **Step 1: 创建 typeImages.ts**

```typescript
// src/data/fpi/typeImages.ts
// 首版不配自定义插画——ResultPage/TypeCard 在无图时已走 CSS 生成卡片兜底。
// 后续若产出插画，按 `{ CODE: 'data:image/png;base64,...' }` 填入即可。
export const TYPE_IMAGES: Record<string, string> = {};
export const SHARE_IMAGES: Record<string, string> = {};
```

- [ ] **Step 2: 创建 compatibility.ts 占位**

```typescript
// src/data/fpi/compatibility.ts
// MVP 阶段 FPI 不启用 compat tab。FPI 主打"朋友圈物种"梗，双人相性不如单人自嘲有传播力。
// 后续迭代可以做"谁最看懂你的朋友圈 / 谁会把你屏蔽"CP 表（spec 6.1/P2）。
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两个朋友圈物种彼此出现在对方列表里，互不打扰，偶尔点个赞。' };
}
```

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 4: Commit**

```bash
git add src/data/fpi/typeImages.ts src/data/fpi/compatibility.ts
git commit -m "feat(fpi): add typeImages + compatibility stubs"
```

---

## Task 4：写 FPI 题目库（24 主题目 + 1 gate 题）

**Files:**
- Create: `src/data/fpi/questions.ts`

- [ ] **Step 1: 创建 questions.ts（完整 24 + 1）**

```typescript
// src/data/fpi/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 POST 发布密度（L=极少发，H=高频发） =====
  {
    id: 'post1', dim: 'D1',
    text: '你看到一件很想分享的小事，第一反应是？',
    options: [
      { label: '立刻拍照发出去，不然情绪过期', value: 4 },
      { label: '先存着，晚上统一整理发', value: 3 },
      { label: '想想算了，别人应该也不关心', value: 2 },
      { label: '我一般只发给具体的人', value: 1 },
    ],
  },
  {
    id: 'post2', dim: 'D1',
    text: '你的朋友圈更新频率更像？',
    options: [
      { label: '连载小说', value: 4 },
      { label: '周报', value: 3 },
      { label: '节气提醒', value: 2 },
      { label: '年度遗迹', value: 1 },
    ],
  },
  {
    id: 'post3', dim: 'D1',
    text: '旅行途中你更可能？',
    options: [
      { label: '边走边发，观众实时跟进', value: 4 },
      { label: '回酒店修图发精选', value: 3 },
      { label: '回来后发一条总结', value: 2 },
      { label: '不发，去过就行', value: 1 },
    ],
  },
  {
    id: 'post4', dim: 'D1',
    text: '你删掉一条已发动态的常见原因是？',
    options: [
      { label: '发太多了，怕刷屏', value: 4 },
      { label: '图不够好看', value: 3 },
      { label: '情绪冷了', value: 2 },
      { label: '想起不该给某些人看', value: 1 },
    ],
  },

  // ===== D2 POLI 精修强度（L=原图直出，H=精修展览） =====
  {
    id: 'poli1', dim: 'D2',
    text: '发图前你会修到什么程度？',
    options: [
      { label: '滤镜、裁切、亮度、顺序都要管', value: 4 },
      { label: '简单调一下别太丑', value: 3 },
      { label: '原图直出，糊也是真实', value: 1 },
      { label: '我根本懒得发图', value: 1 },
    ],
  },
  {
    id: 'poli2', dim: 'D2',
    text: '九宫格里有一张颜色不协调，你会？',
    options: [
      { label: '换掉，不允许破坏整体气质', value: 4 },
      { label: '调一下让它别太突兀', value: 3 },
      { label: '无所谓，内容更重要', value: 2 },
      { label: '九宫格是什么大型工程', value: 1 },
    ],
  },
  {
    id: 'poli3', dim: 'D2',
    text: '你写朋友圈文案时更像？',
    options: [
      { label: '广告公司结案', value: 4 },
      { label: '小红书标题优化', value: 3 },
      { label: '随手一句人话', value: 2 },
      { label: '只发图，不配字', value: 1 },
    ],
  },
  {
    id: 'poli4', dim: 'D2',
    text: '别人夸你朋友圈好看，你内心会？',
    options: [
      { label: '暗爽，因为确实运营过', value: 4 },
      { label: '有点开心，但装作随便发的', value: 3 },
      { label: '觉得他们想多了', value: 2 },
      { label: '想不起上次被夸是什么时候', value: 1 },
    ],
  },

  // ===== D3 MASK 人设意识（L=不经营，H=经营形象） =====
  {
    id: 'mask1', dim: 'D3',
    text: '你发朋友圈时会想"别人会怎么看我"吗？',
    options: [
      { label: '会，而且这就是重点', value: 4 },
      { label: '偶尔会，尤其是重要动态', value: 3 },
      { label: '不太会，我只是表达', value: 2 },
      { label: '我会想谁不能看', value: 3 },
    ],
  },
  {
    id: 'mask2', dim: 'D3',
    text: '你更希望朋友圈呈现出的自己是？',
    options: [
      { label: '生活有质感', value: 4 },
      { label: '有趣又不费力', value: 3 },
      { label: '真实但别太狼狈', value: 2 },
      { label: '最好什么都别被解读', value: 1 },
    ],
  },
  {
    id: 'mask3', dim: 'D3',
    text: '如果朋友圈被新同事翻到，你希望他觉得你？',
    options: [
      { label: '很会生活', value: 4 },
      { label: '很靠谱', value: 3 },
      { label: '很好相处', value: 2 },
      { label: '翻不到，谢谢', value: 1 },
    ],
  },
  {
    id: 'mask4', dim: 'D3',
    text: '你最受不了自己朋友圈出现哪种感觉？',
    options: [
      { label: '土', value: 4 },
      { label: '装', value: 3 },
      { label: '负能量', value: 2 },
      { label: '暴露太多', value: 3 },
    ],
  },

  // ===== D4 EMOT 情绪电压（L=情绪收纳，H=情绪外放） =====
  {
    id: 'emot1', dim: 'D4',
    text: '情绪很满的时候，你会？',
    options: [
      { label: '发一条只有懂的人懂', value: 4 },
      { label: '写小作文，但可能设分组', value: 3 },
      { label: '找朋友私聊', value: 2 },
      { label: '睡一觉，当没事', value: 1 },
    ],
  },
  {
    id: 'emot2', dim: 'D4',
    text: '深夜朋友圈对你来说是？',
    options: [
      { label: '精神急诊室', value: 4 },
      { label: '灵感收容所', value: 3 },
      { label: '别人的迷惑行为观察窗', value: 2 },
      { label: '我已经睡了', value: 1 },
    ],
  },
  {
    id: 'emot3', dim: 'D4',
    text: '你会转发情绪类文章/歌/视频吗？',
    options: [
      { label: '会，那就是我的嘴替', value: 4 },
      { label: '偶尔，真的被击中才会', value: 3 },
      { label: '很少，怕显得太用力', value: 2 },
      { label: '不会，我不想公开情绪', value: 1 },
    ],
  },
  {
    id: 'emot4', dim: 'D4',
    text: '别人在你动态下问"怎么了"，你会？',
    options: [
      { label: '等的就是这句', value: 4 },
      { label: '私聊解释', value: 3 },
      { label: '回一句没事', value: 2 },
      { label: '立刻后悔发了', value: 1 },
    ],
  },

  // ===== D5 ECHO 互动渴望（L=发完就走，H=在意反馈） =====
  {
    id: 'echo1', dim: 'D5',
    text: '发完朋友圈后，你会看点赞评论吗？',
    options: [
      { label: '会，甚至刷新', value: 4 },
      { label: '会看，但不承认在等', value: 3 },
      { label: '随缘', value: 2 },
      { label: '通知都关了', value: 1 },
    ],
  },
  {
    id: 'echo2', dim: 'D5',
    text: '你最喜欢哪种评论？',
    options: [
      { label: '接梗', value: 4 },
      { label: '夸我', value: 3 },
      { label: '问细节', value: 3 },
      { label: '别评论也行', value: 1 },
    ],
  },
  {
    id: 'echo3', dim: 'D5',
    text: '你给别人点赞通常是？',
    options: [
      { label: '维持关系的基础礼仪', value: 4 },
      { label: '真的觉得不错', value: 3 },
      { label: '手滑或顺手', value: 2 },
      { label: '我很少点赞', value: 1 },
    ],
  },
  {
    id: 'echo4', dim: 'D5',
    text: '如果一条精心动态没人理，你会？',
    options: [
      { label: '怀疑人生和发布时间', value: 4 },
      { label: '有点尴尬但不删', value: 3 },
      { label: '无所谓', value: 2 },
      { label: '下次更不想发', value: 1 },
    ],
  },

  // ===== D6 GATE 边界控制（L=谁看都差不多，H=权限管理员） =====
  {
    id: 'gate1', dim: 'D6',
    text: '你使用分组/屏蔽的熟练度？',
    options: [
      { label: '像后台权限管理员', value: 4 },
      { label: '关键人会管', value: 3 },
      { label: '很少用', value: 2 },
      { label: '不会用，也不想学', value: 1 },
    ],
  },
  {
    id: 'gate2', dim: 'D6',
    text: '你对"三天可见"的态度是？',
    options: [
      { label: '必须开，互联网不配拥有我的过去', value: 4 },
      { label: '看阶段，心情不好就开', value: 3 },
      { label: '不开，发了就发了', value: 2 },
      { label: '我不发，所以无所谓', value: 2 },
    ],
  },
  {
    id: 'gate3', dim: 'D6',
    text: '哪类人最影响你发朋友圈？',
    options: [
      { label: '同事/领导', value: 4 },
      { label: '亲戚/父母', value: 3 },
      { label: '前任/暧昧对象', value: 3 },
      { label: '没人影响我', value: 1 },
    ],
  },
  {
    id: 'gate4', dim: 'D6',
    text: '你会为不同平台调整同一件事的表达吗？',
    options: [
      { label: '会，朋友圈一版，小红书一版，抖音一版', value: 4 },
      { label: '会略微调整', value: 3 },
      { label: '基本复制粘贴', value: 2 },
      { label: '不跨平台发', value: 1 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // 隐藏触发：选 D 直接触发 0POST，但仍继续答题以展示维度雷达
  {
    id: 'fpi_gate', special: true, kind: 'gate',
    text: '你上一次认真发朋友圈是什么时候？',
    options: [
      { label: '这周', value: 1 },
      { label: '这个月', value: 2 },
      { label: '半年内', value: 3 },
      { label: '我已经不记得朋友圈入口长什么样', value: 4 },
    ],
  },
];
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add src/data/fpi/questions.ts
git commit -m "feat(fpi): add 24 questions across 6 dimensions + fpi_gate"
```

---

## Task 5：写 FPI 类型库（20 常规 + 0POST 隐藏 + FEED? 兜底）

**Files:**
- Create: `src/data/fpi/types.ts`

- [ ] **Step 1: 创建 types.ts 完整 22 条**

> 四段式：**开场定位 / 天赋优势 / 隐秘代价 / 一句刺痛你的话**，与 SBTI/GSTI 保持一致风格。"刺痛"只刺行为，不刺身份。

```typescript
// src/data/fpi/types.ts
import type { TypeDef, NormalType, RarityInfo } from '../testConfig';

/* =============================================================
 * TYPE_LIBRARY — 20 常规 + 1 隐藏(0POST) + 1 兜底(FEED?)
 * ============================================================= */

export const TYPE_LIBRARY: Record<string, TypeDef> = {
  FILTR: {
    code: 'FILTR', cn: '滤镜代工厂', intro: 'The Filter Factory',
    desc: '你不是在记录生活，你是在给生活做商业精修。你每张图要过三道滤镜、两轮裁切、一次排版审核，九宫格里多一张不协调的都浑身难受。你把朋友圈当成了个人视觉作品集，朋友们当成了免费甲方。\n\n天赋优势：审美碾压平均水平，你手机里的朋友圈刷下来像在逛小型杂志；配色、构图、节奏你都有自己的语法；朋友圈给你的美学奖项如果存在，你应该在领奖台上。\n\n隐秘代价：你花在修一张图上的时间够别人过完一个下午；你对自己朋友圈的要求越来越像在对付甲方，不满意就删；你已经开始羡慕那些"原图直出也敢发"的人，却一次都做不到。\n\n一句刺痛你的话：你修得起每一张图，修不起自己朋友圈一次塌方。',
  },
  '9PIC!': {
    code: '9PIC!', cn: '九宫格暴君', intro: 'The Nine-Grid Tyrant',
    desc: '你发一条动态，别人要滑完一个小型展览。三张说不清楚的事你能扩成九张，配上首尾呼应的文案，仿佛策划了一场没有开幕式的个展。你把朋友圈当成 Keynote，每一页都是你今天的情绪节选。\n\n天赋优势：信息密度高，朋友刷一条就能 get 你一天；叙事结构完整，故事有开头、发展、转折、收尾；哪怕内容平平，版式就足够撑起体面。\n\n隐秘代价：朋友之间开始流传一个共识——"看 TA 的朋友圈要留五分钟"；你对单图动态有一种天然的不屑，觉得那太敷衍；你为九宫格精心挑图的时间，够你多睡一觉、多回复一个真正重要的人。\n\n一句刺痛你的话：你的朋友圈像策展，可惜观众不一定买门票。',
  },
  'EMO-R': {
    code: 'EMO-R', cn: '深夜 emo 发电机', intro: 'The Midnight Broadcaster',
    desc: '白天正常营业，深夜准时给朋友圈供电。你十二点前发布的都是日常，十二点后发的全是小作文、深夜伤感歌、只有懂的人懂的截图。你把朋友圈当成了一个夜班开张的情绪收容所。\n\n天赋优势：表达能力在深夜加倍——你能把一点情绪写成一段值得收藏的文字；真正听懂的朋友会因为你的夜动态对你刮目相看；你让朋友圈在凌晨两点有了一点温度。\n\n隐秘代价：第二天早上你常常想删昨晚发的那条，但删得比发得还犹豫；同事刷到你的深夜动态会在下午茶时小声议论；你以为自己在释放情绪，其实你在等一个永远不会出现的回复。\n\n一句刺痛你的话：你深夜发的每一条都在等一个人，但那个人从来没有深夜打开朋友圈。',
  },
  FLEXR: {
    code: 'FLEXR', cn: 'Offer 展柜', intro: 'The Offer Showroom',
    desc: '你的朋友圈像一份公开简历，连崩溃都能被你写成"绩效亮点"。offer、升职、奖学金、项目复盘、竞赛奖杯——你的人生节点没有一个会缺席朋友圈。你不是在分享喜悦，你在给自己的履历打实时更新补丁。\n\n天赋优势：成就感管理一流，每一个努力都留下可查阅的证据；自驱力超强，连告别都能写成一次成长总结；你的朋友圈刷一遍就能看完你的职业规划书。\n\n隐秘代价：朋友私下给你起了个外号叫"活简历"；你的低谷期从来不会出现在朋友圈，因为你已经默认那里是展柜；你对"无事发生的一天"开始感到恐慌——好像没成就就等于没活过。\n\n一句刺痛你的话：你把人生整理得像 PPT，只是没人报名你的 roadshow。',
  },
  'CKIN!': {
    code: 'CKIN!', cn: '打卡 KPI', intro: 'The Check-In Achiever',
    desc: '你不是去过，你是必须证明自己去过。新开业的咖啡馆、网红展、米其林、艺术节、演唱会——每一站都必须拍、必须发、必须定位。你不是玩，你是在完成一份名为"我的生活"的 KPI。\n\n天赋优势：执行力超强，别人还在犹豫要不要去你已经买票；信息搜集能力惊人，哪里新开哪里有趣你比小红书算法还先知道；你的朋友圈是一份活的城市指南。\n\n隐秘代价：你去每一个地方的快乐一半用来拍照一半用来担心照片不好看；朋友邀你玩你会下意识先问"这个点能出片吗"；你开始分不清自己是去享受的还是去交作业的。\n\n一句刺痛你的话：你打了一辈子卡，唯独没打自己真正想去的那一站。',
  },
  '3DAYS': {
    code: '3DAYS', cn: '三天可见教主', intro: 'The 72h-Visibility Cult',
    desc: '你热爱表达，也热爱把表达火速销毁。你今天发的动态，三天后自动进棺材——你管这叫"互联网留白美学"。你不希望陌生人翻到你过去，但你又忍不住不断发出新的过去。你就是这个矛盾本身。\n\n天赋优势：自我更新意识强，"今天的我不代表过去的我"这句话你活得最透；对隐私有一套洁癖级的管理；你的朋友圈永远是最新的你，没有历史包袱。\n\n隐秘代价：新朋友想了解你只能看三天内的碎片，难以真正靠近；你删的比发的还多，情绪流水账留不下任何沉淀；你越来越擅长"发出去然后等它消失"这件事——像对待自己一样。\n\n一句刺痛你的话：你让朋友圈三天可见，但你拒绝的其实是被完整看见。',
  },
  SUBMR: {
    code: 'SUBMR', cn: '朋友圈潜水员', intro: 'The Feed Submariner',
    desc: '你什么都看，什么都不说。你每天刷朋友圈像在巡视自己潜伏的领地——谁谈恋爱了、谁去旅行了、谁升职了、谁出国了——你全都知道。但你半年没发过一条动态，别人甚至开始怀疑你是不是把他们拉黑了。\n\n天赋优势：观察力惊人，朋友圈人际关系你有一张活地图；情绪稳定到不动声色，别人发什么你都能看得云淡风轻；你的沉默让你很神秘，主动找你的人都觉得你"深藏不露"。\n\n隐秘代价：你对别人的生活了如指掌，但没有人知道你最近过得如何；你习惯了做观众，真轮到你主动分享时会突然不知道说什么；你其实想参与，只是不知道怎么破冰。\n\n一句刺痛你的话：你看完了所有人的生活，却没有一条属于自己的动态。',
  },
  LIKER: {
    code: 'LIKER', cn: '手滑点赞奴', intro: 'The Compulsive Liker',
    desc: '你的存在感主要体现在别人动态下面的小红心。你几乎不发，但每条别人的动态都有你的赞——不管是自拍、菜谱、还是讣告。你管这叫"维持关系的基础礼仪"，朋友管这叫"这人是不是开机器人了"。\n\n天赋优势：社交维护成本低，一键点赞就能覆盖一整条关系链；你几乎从不得罪人，因为你对谁都点；你的好友列表稳如 Excel 表。\n\n隐秘代价：你的赞已经贬值到了 0 成本——别人知道你点赞不代表看过；你真正想表达时反而不会用文字了，因为你已经习惯用红心代替；你越来越像朋友圈里那种"人人都认识但谁都不熟"的熟人。\n\n一句刺痛你的话：你给所有人点了赞，但没有一个人记得你最近发了什么。',
  },
  GHOST: {
    code: 'GHOST', cn: '已读不回幽灵', intro: 'The Ghost',
    desc: '你看见了，理解了，消失了。你刷朋友圈从来不点赞、不评论、不留痕，像一个悄悄滑过雪地不留脚印的幽灵。别人甚至不确定你有没有在用微信——你只是偶尔在某个群里冒出一句话，然后又沉下去。\n\n天赋优势：隐私保护做得极好，谁也查不到你的动态；社交电量永远满格，因为你几乎不消耗；你不被任何朋友圈算法捕获，保持了一种难得的自由。\n\n隐秘代价：别人会在某一天突然意识到"好像很久没看到 TA 了"；你不主动社交，关系一条条自动变淡，你没发现也没挽留；你以为这叫自由，其实是一种缓慢的断联。\n\n一句刺痛你的话：你滑过所有人的生活，但没有人记得滑过你的。',
  },
  COPYR: {
    code: 'COPYR', cn: '情感转发器', intro: 'The Forwarder',
    desc: '你用转发替自己说话。一段文案、一篇公众号、一首歌、一条短视频——你把心事外包给这些东西。你不写原创，但你的朋友圈永远在讲故事，只是故事都是别人写的。\n\n天赋优势：审美和收集能力一流，你转的东西总能击中一部分人；你省下了表达的时间成本，用最少的话说出最满的情绪；你是朋友圈的"情绪精选集"。\n\n隐秘代价：别人看你的朋友圈久了会发现："你到底在想什么自己从来不说"；你把自己的感受藏在借来的句子背后，朋友想靠近都没有入口；你转发了一千条"懂我"的内容，却没有一条是你自己的。\n\n一句刺痛你的话：你转发了全世界的心事，唯独没发过一条真正的自己。',
  },
  SELLR: {
    code: 'SELLR', cn: '人形广告位', intro: 'The Human Billboard',
    desc: '你的朋友圈一半是生活，一半像招商手册。代购、课程、保险、微商、自家小店、同学众筹——你永远有东西在推。你不是没朋友，你只是朋友们先认识了你的链接。\n\n天赋优势：商业嗅觉敏锐，转化率永远比别人高；社交关系的商业化能力拉满；你的朋友圈是一条能自给自足的小型商业街。\n\n隐秘代价：新朋友加你前要先考虑"这个人会不会一直推销给我"；家里长辈已经开始怀疑你在做传销；你发一条纯生活动态都不习惯了——因为总觉得要附带一个二维码。\n\n一句刺痛你的话：你把朋友圈变成了门面，朋友只好变成路人。',
  },
  'BABY!': {
    code: 'BABY!', cn: '娃娃直播员', intro: 'The Baby Streamer',
    desc: '你不是晒娃，你是在做家庭真人秀周播。从胎动到百天照，从第一次走路到幼儿园毕业——你的孩子每个瞬间都有朋友圈记录。你把朋友圈当成了一个永远不会关闭的育儿博客。\n\n天赋优势：家庭情感浓度极高，孩子每个成长节点你都不愿错过；记录意识强，将来孩子长大了有一整部朋友圈回忆录；你是群里最会晒又最不招人烦的那种父母（大部分时候）。\n\n隐秘代价：单身朋友开始悄悄屏蔽你，没孩子的朋友慢慢和你共同语言变少；你在朋友圈输出的"完美家庭"压力开始反过来压你；有一天你会发现——你发的都是孩子，你自己呢？\n\n一句刺痛你的话：你记录了孩子的每一天，但朋友圈里没有一天是完整的你。',
  },
  FURRY: {
    code: 'FURRY', cn: '毛孩家长', intro: 'The Pet Parent',
    desc: '你的人类生活很少露面，宠物倒是稳定出镜。狗狗睡姿、猫咪翻肚、仓鼠鼓腮、乌龟洗澡——你的朋友圈是一本毛孩写真年鉴。你自己上一次出镜是什么时候你都记不清了。\n\n天赋优势：情感投注点清晰，宠物让你的生活有了持续的叙事主角；你的朋友圈永远是好友列表里最治愈的那一份；你不用担心朋友圈形象——毛孩替你营业。\n\n隐秘代价：朋友之间流传一个梗："TA 还活着吗？最近只看到猫"；你对人类社交的投入在被毛孩替代，你自己可能都没意识到；有一天宠物走了，你会发现朋友圈一下子失去了主角。\n\n一句刺痛你的话：你拍了毛孩的每一天，却把自己的人生活成了背景板。',
  },
  MUKBG: {
    code: 'MUKBG', cn: '吃播显眼包', intro: 'The Food Streamer',
    desc: '你的朋友圈像附近美食榜，只是缺个排队取号。今天火锅、明天日料、大后天小众私房菜——你的朋友圈刷一遍肚子就饿了。你不是吃货，你是朋友圈官方认证的美食外联大使。\n\n天赋优势：对城市吃喝情报把握精准，每家新店你比点评早一步；你的朋友圈对忙碌的朋友是一种实用服务——照着吃就行；你用食物完成了一种独特的自我叙事。\n\n隐秘代价：你的朋友圈变成了某种固定栏目，朋友甚至开始只在饿的时候才点开你；你发的照片一条没变：俯拍、暖光、半杯饮料——模板感开始明显；你吃得越来越像"为了发朋友圈去吃"而不是"真想吃"。\n\n一句刺痛你的话：你给朋友圈喂饱了，但你自己真想吃的东西是什么，你已经忘了。',
  },
  TRVL9: {
    code: 'TRVL9', cn: '国旗收集家', intro: 'The Flag Collector',
    desc: '你每次出门都像在给地图解锁皮肤。东京、首尔、曼谷、巴厘岛、冰岛、摩洛哥——每次机票落地你都要发一条"新皮肤已获得"。你的朋友圈是一份会行走的护照。\n\n天赋优势：行动力和规划力顶级，说走就走别人还在查签证；审美和内容产出都高——旅行是你天然的素材源；你是朋友里"生活方式最让人羡慕"的那个标杆。\n\n隐秘代价：你在一个城市待不到 48 小时就要下一站，你其实记不清去过的那些地方的细节；你的朋友圈越来越像一份成就清单而不是旅行笔记；深夜你偶尔会想：我到底是在旅行，还是在收集？\n\n一句刺痛你的话：你去过一百个城市，但没有一个让你不想走。',
  },
  BLOCK: {
    code: 'BLOCK', cn: '屏蔽狙击手', intro: 'The Block Sniper',
    desc: '你不是社恐，你只是把观众席管理得很细。同事不能看、父母不能看、前任不能看、某组客户不能看、今天心情不好不想让 A 看、昨天那条得把 B 排除——你发一条朋友圈比公司审稿流程还复杂。\n\n天赋优势：边界感超强，你明确知道哪部分自我给谁看；隐私保护到位，你的朋友圈没有"不小心被翻到"这种事故；你在社交上是一个成熟的 ops。\n\n隐秘代价：你发一条动态花在"分组"上的时间比写文案还久；你偶尔会点错分组引发小型社交事故；你把朋友圈治理得像政府机关，真正的亲密开始被这层层权限挡住。\n\n一句刺痛你的话：你屏蔽了所有人，但也屏蔽了自己被完整看见的可能。',
  },
  REDBK: {
    code: 'REDBK', cn: '小红书代打', intro: 'The Xiaohongshu Ghost',
    desc: '你的朋友圈已经不像朋友圈，像一篇可收藏攻略。人均消费、避雷提示、打卡路线、穿搭链接、最佳拍照机位——你的每一条动态都是一份完整的消费指南。朋友刷到你的内容都会下意识想"截图保存"。\n\n天赋优势：信息整理能力顶级，你发的每一条都能被当作参考资料；你对"有用"的追求拉满，你不浪费任何一条动态；你是朋友圈里最像一个内容运营的活人。\n\n隐秘代价：朋友私下说你发的东西"干净是干净，就是有点像代打"；你发的原创含量越来越低，开始失去"个人叙事"；你对自己真实情绪的表达已经被 SEO 式写作替代了。\n\n一句刺痛你的话：你把朋友圈写成了攻略，代价是没有一条写的是你自己。',
  },
  JUDGE: {
    code: 'JUDGE', cn: '三观广播台', intro: 'The Broadcasting Judge',
    desc: '你不常发生活，但一开口就像在主持圆桌论坛。社会事件、热搜话题、行业动态、亲密关系建议——你发动态时总能让人明确你的立场和道理。你不是在分享生活，你是在发社论。\n\n天赋优势：逻辑和表达能力都很强，你发出来的观点有条理；你对价值观有清晰判断，不人云亦云；朋友中总有人把你当"能聊深度话题的人"。\n\n隐秘代价：大部分时候评论区冷清——因为你的观点让朋友没兴趣回应；新朋友加你会先看有没有"三观投合"，不合立刻距离；你发一条生活细节会被朋友说"今天你不严肃啊"。\n\n一句刺痛你的话：你发了一辈子社论，没人敢在你的社论下留言。',
  },
  QSLIF: {
    code: 'QSLIF', cn: '精神中产', intro: 'The Quality-Life Curator',
    desc: '你把平凡日子过成质感样片。冬日阳光里的手冲、周末书店一角、陶艺课的手作、音乐节的慢摇——你的朋友圈是一本厚厚的"生活值得认真过"手册。别人觉得你活得像样板间。\n\n天赋优势：生活美学拉满，你把有限预算和时间经营到了极致；你让朋友圈"还有活人在正经生活"这件事成立；你的审美、品味、节奏感都可以写成书。\n\n隐秘代价：你在每一个质感瞬间背后都有一份隐形的疲惫；你开始为朋友圈"需要保持这种调性"而选餐厅、选衣服、选朋友；你以为你在活自己的人生，其实你在扮演一个朋友圈里的你。\n\n一句刺痛你的话：你把平凡日子过成质感样片，也把自己活成了道具。',
  },
  'NPC-F': {
    code: 'NPC-F', cn: '朋友圈 NPC', intro: 'The Feed NPC',
    desc: '你什么都沾一点，像系统随机生成的普通好友。偶尔发一条吃的，偶尔发一条风景，偶尔转一条新闻，偶尔放一张自拍——你没有明显的朋友圈人设。刷到你的动态，朋友想不起你是哪一类。\n\n天赋优势：稳定、可预测、不惹人烦，你是朋友圈里最安全的存在；你不被任何标签绑住，自由度极高；你一条普通动态反而是朋友圈的一个喘息位。\n\n隐秘代价：你很少成为朋友圈话题主角，存在感在慢慢被忽略；新朋友记不住你的特点，旧朋友回忆你也只剩"人不错"；你可能正因为太怕特别，最后选择了最模糊的版本。\n\n一句刺痛你的话：你把自己活成朋友圈 NPC，连系统都没给你台词。',
  },

  /* ===== 隐藏：0POST 朋友圈坟墓 ===== */
  '0POST': {
    code: '0POST', cn: '朋友圈坟墓', intro: 'The Dead Feed',
    desc: '你的朋友圈没有人设，因为你已经把展厅关灯了。上一次认真发朋友圈是哪年的事你都记不清了——可能是一张毕业合照、可能是一条搬家告别、可能是某次出差的飞机窗外。之后再没有动态。你主页上的最后一条定格在那里，像一座墓碑。\n\n天赋优势：你在社交媒体面前保持了最稀有的清醒——不经营、不演出、不广播；你的生活细节只和真正进到你生活里的人共享；你没有被点赞机制绑架，这是这个时代的奢侈。\n\n隐秘代价：新朋友加你看一眼主页默认你"应该是个无趣的人"；旧朋友偶尔想起你会被你长期的静默暂停一下；你主动选择了沉默，但沉默时间长了，想开口也开不了了。\n\n一句刺痛你的话：你关上了朋友圈的灯，也就关上了大部分人认识你的入口。',
  },

  /* ===== 兜底：FEED? 内容乱码人 ===== */
  'FEED?': {
    code: 'FEED?', cn: '内容乱码人', intro: 'The Feed Glitch',
    desc: '你的动态像多平台同步失败：什么都有一点，什么都不像你。今天像九宫格暴君，明天像潜水员，后天突然 emo，下周又转起了代购。系统试图给你贴一个标签，结果所有标签都贴不上。\n\n天赋优势：你躲过了所有朋友圈刻板印象，没人能用一句话概括你；你活得比大多数人真实——因为真实本来就是多面的；你是朋友圈里少见的"不能被算法理解的用户"。\n\n隐秘代价：新朋友加你后大概率 get 不到你的核心；你自己偶尔也会迷惑"我到底在朋友圈想输出什么"；算法都放弃你了，朋友偶尔也会悄悄把你调成"不看他的朋友圈"——不是讨厌，是实在理解不了。\n\n一句刺痛你的话：你什么都沾一点，可没有人能完整看见你。',
  },
};

/* =============================================================
 * NORMAL_TYPES — Pattern vectors 6 位 L/M/H
 * 维度顺序：D1 POST / D2 POLI / D3 MASK / D4 EMOT / D5 ECHO / D6 GATE
 *
 * 设计原则：
 * 1. 所有 pattern 唯一（已人肉校对 20/20 unique，最小 Hamming 距离 ≥ 2）
 * 2. pattern 语义贴合类型画像（FILTR 精修高、SUBMR 发布低、EMO-R 情绪高...）
 * 3. 保留一个"纯中档" NPC-F (MMMMMM) 作为语义上的系统生成普通好友
 * ============================================================= */

export const NORMAL_TYPES: NormalType[] = [
  { code: 'FILTR', pattern: 'HHHLLM' },  // 高产 + 精修 + 强人设 + 情绪低 + 互动低 + 中边界
  { code: '9PIC!', pattern: 'HHMLHM' },  // 高产 + 精修 + 中人设 + 情绪低 + 互动高 + 中边界
  { code: 'EMO-R', pattern: 'MLLHHL' },  // 中产 + 不精修 + 不经营 + 情绪爆 + 互动高 + 无边界
  { code: 'FLEXR', pattern: 'HMHMLM' },  // 高产 + 中精修 + 强人设 + 中情绪 + 互动低 + 中边界
  { code: 'CKIN!', pattern: 'HHMMLL' },  // 高产 + 精修 + 中人设 + 中情绪 + 互动低 + 低边界
  { code: '3DAYS', pattern: 'LMHHMH' },  // 低产 + 中精修 + 强人设 + 情绪高 + 中互动 + 强边界
  { code: 'SUBMR', pattern: 'LLLLLL' },  // 低产 + 不精修 + 不经营 + 情绪低 + 互动低 + 低边界（真正的潜水员）
  { code: 'LIKER', pattern: 'LLMMHL' },  // 低产 + 不精修 + 中人设 + 中情绪 + 互动高 + 低边界
  { code: 'GHOST', pattern: 'LLLMHM' },  // 低产 + 不精修 + 不经营 + 中情绪 + 互动高(点赞) + 中边界
  { code: 'COPYR', pattern: 'MLMHLL' },  // 中产 + 不精修 + 中人设 + 情绪高(借他人的) + 互动低 + 低边界
  { code: 'SELLR', pattern: 'HMMMHM' },  // 高产 + 中精修 + 中人设 + 中情绪 + 互动高 + 中边界
  { code: 'BABY!', pattern: 'HMLHMM' },  // 高产 + 中精修 + 低人设 + 情绪高(亲情) + 中互动 + 中边界
  { code: 'FURRY', pattern: 'MMLHML' },  // 中产 + 中精修 + 低人设 + 情绪高 + 中互动 + 低边界
  { code: 'MUKBG', pattern: 'HHLMML' },  // 高产 + 精修 + 低人设（吃就是吃）+ 中情绪 + 中互动 + 低边界
  { code: 'TRVL9', pattern: 'HHHLMH' },  // 高产 + 精修 + 强人设 + 情绪低(纯展示) + 中互动 + 强边界(会分组)
  { code: 'BLOCK', pattern: 'LMLMLH' },  // 低产 + 中精修 + 不经营 + 中情绪 + 互动低 + 强边界
  { code: 'REDBK', pattern: 'HHHMHM' },  // 高产 + 精修 + 强人设 + 中情绪 + 互动高 + 中边界
  { code: 'JUDGE', pattern: 'MMLMLL' },  // 中产 + 中精修 + 不经营 + 中情绪 + 互动低 + 低边界
  { code: 'QSLIF', pattern: 'HHHHMM' },  // 高产 + 精修 + 强人设 + 情绪高 + 中互动 + 中边界
  { code: 'NPC-F', pattern: 'MMMMMM' },  // 全中档（系统随机生成）
];

/* =============================================================
 * TYPE_RARITY — 视觉呈现用，后期按真实数据回填
 * ============================================================= */

export const TYPE_RARITY: Record<string, RarityInfo> = {
  FILTR:   { pct: 6,  stars: 4, label: '稀有' },
  '9PIC!': { pct: 7,  stars: 3, label: '常见' },
  'EMO-R': { pct: 9,  stars: 3, label: '常见' },
  FLEXR:   { pct: 5,  stars: 4, label: '稀有' },
  'CKIN!': { pct: 8,  stars: 3, label: '常见' },
  '3DAYS': { pct: 6,  stars: 4, label: '稀有' },
  SUBMR:   { pct: 11, stars: 2, label: '较常见' },
  LIKER:   { pct: 9,  stars: 3, label: '常见' },
  GHOST:   { pct: 7,  stars: 3, label: '常见' },
  COPYR:   { pct: 6,  stars: 4, label: '稀有' },
  SELLR:   { pct: 5,  stars: 4, label: '稀有' },
  'BABY!': { pct: 4,  stars: 4, label: '稀有' },
  FURRY:   { pct: 4,  stars: 4, label: '稀有' },
  MUKBG:   { pct: 5,  stars: 4, label: '稀有' },
  TRVL9:   { pct: 4,  stars: 4, label: '稀有' },
  BLOCK:   { pct: 5,  stars: 4, label: '稀有' },
  REDBK:   { pct: 3,  stars: 5, label: '极稀有' },
  JUDGE:   { pct: 4,  stars: 4, label: '稀有' },
  QSLIF:   { pct: 3,  stars: 5, label: '极稀有' },
  'NPC-F': { pct: 10, stars: 2, label: '较常见' },
  '0POST': { pct: 2,  stars: 5, label: '隐藏' },
  'FEED?': { pct: 2,  stars: 5, label: '兜底' },
};
```

- [ ] **Step 2: Verify compile + unique pattern self-check**

Run:
```bash
npx tsc --noEmit 2>&1 | head -20
node -e "const m = require('./src/data/fpi/types.ts'.replace('.ts','.js')); /* pattern unique check in Task 9 */"
```
Expected: TS 无错误。（真正的 pattern 重复检查放在 Task 9 用一段 node 脚本统一做。）

- [ ] **Step 3: Commit**

```bash
git add src/data/fpi/types.ts
git commit -m "feat(fpi): add 20 types + 0POST hidden + FEED? fallback"
```

---

## Task 6：组装 FPI TestConfig

**Files:**
- Create: `src/data/fpi/config.ts`

- [ ] **Step 1: 创建 config.ts**

```typescript
// src/data/fpi/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// FPI 共 24 题，每维 4 题。
// raw score 范围 4-16，sumToLevel 阈值：
//   score ≤ 8  → L（平均 ≤ 2.0）
//   9-12       → M
//   score ≥ 13 → H（平均 ≥ 3.25）
function sumToLevel(score: number): string {
  if (score <= 8) return 'L';
  if (score <= 12) return 'M';
  return 'H';
}

export const fpiConfig: TestConfig = {
  id: 'fpi',
  name: 'FPI 朋友圈人设诊断',

  // Dimensions
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  // gate & hiddenTrigger 用同一题同一答案：fpi_gate value=4 → 0POST
  gateQuestionId: 'fpi_gate',
  gateAnswerValue: 4,
  hiddenTriggerQuestionId: 'fpi_gate',
  hiddenTriggerValue: 4,

  // Types
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,

  // Compatibility（首版 stub，不启用 compat tab）
  compatibility: COMPATIBILITY,
  getCompatibility,

  // Matching params
  sumToLevel,
  maxDistance: 12,             // 6 维 × 最大差 2 = 12
  fallbackTypeCode: 'FEED?',
  hiddenTypeCode: '0POST',
  similarityThreshold: 55,

  // URLs & Storage
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/fpi',
  localHistoryKey: 'fpi_history',
  localStatsKey: 'fpi_local_stats',
  apiTestParam: 'fpi',

  // Display text
  dimSectionTitle: '六维人设雷达',
  questionCountLabel: '24',

  // 注意：FPI 不使用 genderLocked / typePoolByGender —— 字段省略
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add src/data/fpi/config.ts
git commit -m "feat(fpi): assemble TestConfig (no gender lock)"
```

---

## Task 7：创建 FPIHeroBadge 组件

**Files:**
- Create: `src/components/FPIHeroBadge.tsx`

FPI 专属视觉：模仿一张"朋友圈截图贴纸"，在结果页顶部展示"FPI · FEED PERSONA"品牌标 + "仅三天可见 / 分组可见 / 已读不回"等状态贴纸。视觉不要仿微信 UI 以避免合规风险（spec 7.1），用通用图形语言。

- [ ] **Step 1: 创建组件**

```tsx
// src/components/FPIHeroBadge.tsx
import { motion } from 'framer-motion';

interface FPIHeroBadgeProps {
  typeCode: string;      // e.g. '3DAYS', 'BLOCK', '0POST'
  typeCn: string;
}

/**
 * Show 1-2 contextual "朋友圈截图贴纸" based on type semantics.
 * We DON'T mimic WeChat UI (spec 7.1 — avoid trademark confusion).
 */
function stickersForType(code: string): string[] {
  const base = ['FEED PERSONA INDEX'];
  if (code === '0POST') return [...base, '朋友圈坟墓', '暂未营业'];
  if (code === '3DAYS') return [...base, '仅三天可见'];
  if (code === 'BLOCK') return [...base, '分组可见'];
  if (code === 'GHOST' || code === 'SUBMR' || code === 'LIKER') return [...base, '已读不回'];
  if (code === 'FILTR' || code === 'QSLIF' || code === 'REDBK') return [...base, '精修投稿'];
  if (code === 'EMO-R') return [...base, '深夜发表'];
  if (code === 'SELLR') return [...base, '广告位 · 长期招租'];
  return [...base, '刚刚 · 已发布'];
}

export default function FPIHeroBadge({ typeCode, typeCn }: FPIHeroBadgeProps) {
  const stickers = stickersForType(typeCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex flex-wrap items-center justify-center gap-2"
    >
      {stickers.map((label, i) => (
        <span
          key={`${typeCode}-sticker-${i}`}
          className={
            i === 0
              ? 'text-[10px] px-2 py-1 rounded-full bg-accent/20 text-accent font-bold tracking-[0.2em] uppercase'
              : 'text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-border text-muted'
          }
        >
          {label}
        </span>
      ))}
      {/* 保留 typeCn 作为 accessible label（视觉上不重复，交给主 title 块） */}
      <span className="sr-only">{typeCn}</span>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add src/components/FPIHeroBadge.tsx
git commit -m "feat(fpi): add FPIHeroBadge with feed-sticker visual"
```

---

## Task 8：ResultPage 接入 FPI 专属徽章（可选 prop）

**Files:**
- Modify: `src/components/ResultPage.tsx`

方案：给 `ResultPage` 新增可选 prop `testBadge?: ReactNode` —— 上游（FpiApp）自行渲染 `FPIHeroBadge` 后通过 prop 注入。这样不用引入 FPI 专属 import 到通用组件里，**其他 6 个测试完全不受影响**。

> **注意**：GSTI 已经用了不同的方案（`gender?: Gender` prop 内部直接 import `GSTIHeroBadge`）。FPI 换用"slot"方式更干净，未来扩展成本更低。两套方案并存不冲突。

- [ ] **Step 1: 阅读 ResultPage 当前 props 定义**

Run: `grep -n "interface ResultPageProps\|function ResultPage" src/components/ResultPage.tsx | head -5`
Expected: 看到 `ResultPageProps` 的声明位置（应在文件前 50 行内）。

- [ ] **Step 2: 增加 testBadge prop**

打开 `src/components/ResultPage.tsx`，在 `ResultPageProps` 接口中追加：

```tsx
// src/components/ResultPage.tsx — 在 ResultPageProps interface 内追加：

  /** Optional test-specific badge shown above the main type title (e.g. FPI feed stickers). */
  testBadge?: React.ReactNode;
```

在函数签名中解构：

```tsx
export default function ResultPage({
  result,
  onShare,
  onInviteCompare,
  onRestart,
  onHome,
  onDebugReroll,
  onDebugForceType,
  gender,          // existing (GSTI)
  testBadge,       // new (FPI)
}: ResultPageProps) {
```

- [ ] **Step 3: 在类型大名渲染前插入 testBadge 插槽**

找到渲染类型中文名（通常是 `text-4xl` / `text-5xl` 块）之上的位置（GSTI 的 `GSTIHeroBadge` 条件已经在这附近），插入：

```tsx
{/* FPI 专属贴纸（如果传入） — 与 GSTIHeroBadge 并列，但只渲染一个 */}
{testBadge && !config.genderLocked && testBadge}

{/* GSTI HeroBadge（现有代码，保持不变） */}
{config.genderLocked && gender && (
  <GSTIHeroBadge
    gender={gender}
    typeCode={result.finalType.code}
    typeCn={result.finalType.cn}
  />
)}
```

> **并列原则**：`testBadge` 和 `GSTIHeroBadge` 永远不会同时出现——FPI 没有 `genderLocked`，GSTI 不传 `testBadge`。互斥保障清晰。

- [ ] **Step 4: 如果 ResultPage 还没 import `React`（为了 `React.ReactNode` 类型），补上**

Run: `grep -n "import React\|from 'react'" src/components/ResultPage.tsx | head -3`
如果没 import `React`，在顶部加：

```tsx
import type { ReactNode } from 'react';
```

然后把 interface 里的 `React.ReactNode` 改为 `ReactNode`。

- [ ] **Step 5: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 6: Commit**

```bash
git add src/components/ResultPage.tsx
git commit -m "feat(ResultPage): add optional testBadge slot for per-test visuals"
```

---

## Task 9：Pattern 唯一性自检脚本

**Files:**
- (无文件修改；仅验证)

- [ ] **Step 1: 写一个一次性校验脚本**

在 repo 根目录写一个临时校验（也可用 `node --input-type=module -e ...` 内联）：

```bash
node --input-type=module -e "
import('./src/data/fpi/types.ts').then(({ NORMAL_TYPES }) => {
  const seen = new Map();
  const dupes = [];
  for (const t of NORMAL_TYPES) {
    if (seen.has(t.pattern)) dupes.push([seen.get(t.pattern), t.code, t.pattern]);
    else seen.set(t.pattern, t.code);
  }
  console.log('total:', NORMAL_TYPES.length, 'unique:', seen.size, 'dupes:', dupes);
  // Hamming distance check
  let minDist = 999;
  for (let i = 0; i < NORMAL_TYPES.length; i++) {
    for (let j = i+1; j < NORMAL_TYPES.length; j++) {
      let d = 0;
      for (let k = 0; k < 6; k++) {
        const a = NORMAL_TYPES[i].pattern[k], b = NORMAL_TYPES[j].pattern[k];
        if (a !== b) d++;
      }
      if (d < minDist) minDist = d;
    }
  }
  console.log('min hamming distance:', minDist);
});
" 2>&1 || echo 'Fallback: tsx/ts-node not installed — skip. Run it mentally.'
```

Expected: `total: 20, unique: 20, dupes: [], min hamming distance: >= 2`。

若 node 无法直接 import TS，可用 TypeScript 编译 + node 运行，或把 `NORMAL_TYPES` 内容人肉列在一个 txt 里数一遍。

- [ ] **Step 2: 人肉校验（兜底）**

若 Step 1 环境不支持，在本地复制 20 个 pattern 到一张表里，ctrl+F 检查无重复。Plan 设计时已保证 20/20 unique。

- [ ] **Step 3: Commit（若 Step 1 的校验产物想保留，可放到 docs；否则跳过 commit）**

```bash
# 若无文件变更
git commit --allow-empty -m "verify: fpi 20 normal-type patterns are unique (min hamming 2)"
```

---

## Task 10：创建 FpiApp 顶层组件

**Files:**
- Create: `src/FpiApp.tsx`

基于现有 `src/LoveApp.tsx` 结构 copy + 改造。核心差异：
1. 不走 GenderPicker；`handleStartTest` 直接 `quiz.startQuiz()`。
2. 结果页传 `testBadge={<FPIHeroBadge ... />}`。
3. `computeResult` 调用保持 4 参（不传 gender）。

- [ ] **Step 1: 创建组件**

```tsx
// src/FpiApp.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import Nav, { type TabId } from './components/Nav';
import QuizOverlay from './components/QuizOverlay';
import Interstitial from './components/Interstitial';
import ResultPage from './components/ResultPage';
import ComparePage from './components/ComparePage';
import ShareModal from './components/ShareModal';
import RankingPage from './components/RankingPage';
import FPIHeroBadge from './components/FPIHeroBadge';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { fpiConfig } from './data/fpi/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

const isTestDomain = window.location.hostname.includes('sbticc-test');

/* ---------- FPI-specific Hero ---------- */

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

const heroGlow = css`
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(255, 59, 59, 0.06) 0%,
    transparent 70%
  );
`;

function FpiHero({ onStartTest, totalTests }: { onStartTest: () => void; totalTests: number }) {
  const displayTotal = totalTests > 0 ? totalTests.toLocaleString() : '---';

  return (
    <section
      css={heroGlow}
      className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[90vh]"
    >
      <motion.p
        {...fadeInUp(0)}
        className="text-accent font-mono font-bold text-sm tracking-widest uppercase mb-4"
      >
        FPI · FEED PERSONA INDEX
      </motion.p>

      <motion.h1
        {...fadeInUp(0.1)}
        className="font-extrabold text-white leading-tight select-none text-4xl sm:text-5xl mb-4"
      >
        朋友圈人设诊断
      </motion.h1>

      <motion.div
        {...fadeInUp(0.15)}
        className="mb-6 rounded-full"
        style={{
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #ff3b3b, #ffaa00)',
        }}
      />

      <motion.p
        {...fadeInUp(0.2)}
        className="text-sm sm:text-base text-muted mb-3 max-w-md"
      >
        24 题 &times; 6 维度 &times; 20 种朋友圈物种
      </motion.p>

      <motion.p
        {...fadeInUp(0.25)}
        className="text-sm text-muted mb-8 max-w-md"
      >
        你不是在记录生活，你是在给生活做商业精修。
      </motion.p>

      <motion.div
        {...fadeInUp(0.3)}
        className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-surface border border-border"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-sm text-muted">
          已有 <span className="text-white font-mono font-bold">{displayTotal}</span> 人完成测试
        </span>
      </motion.div>

      <motion.button
        {...fadeInUp(0.4)}
        onClick={onStartTest}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.97 }}
        className="bg-white text-black py-4 px-12 rounded-xl font-extrabold text-lg transition-colors cursor-pointer"
      >
        开始测试
      </motion.button>

      <motion.a
        {...fadeInUp(0.5)}
        href="/new"
        className="mt-6 text-sm text-muted hover:text-white transition-colors"
      >
        &larr; 回到人格实验室
      </motion.a>
    </section>
  );
}

/* ---------- FPI Nav (home + ranking; no compat MVP) ---------- */

type FpiTabId = 'home' | 'ranking';

function FpiAppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<FpiTabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('fpi-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  useEffect(() => {
    ranking.fetchRanking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const autoFillAndShowResult = useCallback(() => {
    const allQs = [...config.questions, ...config.specialQuestions];
    const answers: Record<string, number | number[]> = {};
    allQs.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    const res = computeResult(answers, false, config, null);
    setResult(res);
    setScreen('result');
  }, [config]);

  // Hash routing
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#test' || isTestDomain) {
      autoFillAndShowResult();
    } else if (hash.startsWith('#compare=')) {
      const b64 = hash.slice('#compare='.length);
      const decoded = decodeCompare(b64, config.dimensionOrder);
      if (decoded) {
        setCompareData(decoded);
        setScreen('compare');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartTest = useCallback(() => {
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz]);

  const handleQuizSubmit = useCallback(() => {
    const res = quiz.getResult();
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory]);

  const handleInterstitialComplete = useCallback(() => {
    if (compareData) setScreen('compare');
    else setScreen('result');
  }, [compareData]);

  const handleBackToHome = useCallback(() => {
    setScreen('home');
    setResult(null);
    setCompareData(null);
    window.location.hash = '';
  }, []);

  const handleRestart = useCallback(() => {
    quiz.startQuiz();
    setResult(null);
    setScreen('quiz');
  }, [quiz]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const pageUrl = `${config.prodBaseUrl}${config.basePath}`;
    const qrDataUrl = generateQR(pageUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'share', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-${typeCode}.png`);
      setShareModalUrl(pageUrl);
      setShowShareModal(true);
    } catch {
      alert('分享图生成失败');
    }
  }, [result, config]);

  const handleInviteCompare = useCallback(async () => {
    if (!result) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(
      result.finalType.code,
      result.levels,
      similarity,
      config.dimensionOrder,
    );
    const compareUrl = `${config.prodBaseUrl}${config.basePath}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-invite-${typeCode}.png`);
      setShareModalUrl(compareUrl);
      setShowShareModal(true);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(compareUrl).then(() => {
          alert('对比链接已复制到剪贴板！');
        });
      }
    }
  }, [result, config]);

  const handleDebugReroll = useCallback(() => {
    autoFillAndShowResult();
  }, [autoFillAndShowResult]);

  const handleDebugForceType = useCallback((code: string) => {
    const allQs = [...config.questions, ...config.specialQuestions];
    const answers: Record<string, number | number[]> = {};
    allQs.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    const res = computeResult(answers, false, config, code);
    setResult(res);
    setScreen('result');
  }, [config]);

  const handleShareCompare = useCallback(async () => {
    if (!result || !compareData) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity = 'similarity' in result.finalType
      ? (result.finalType as { similarity: number }).similarity
      : 0;
    const encoded = encodeCompare(
      result.finalType.code,
      result.levels,
      similarity,
      config.dimensionOrder,
    );
    const compareUrl = `${config.prodBaseUrl}${config.basePath}#compare=${encoded}`;
    const qrDataUrl = generateQR(compareUrl);
    try {
      const canvas = await drawShareCard(typeDef, result, qrDataUrl, 'invite', config);
      const blob = await canvasToBlob(canvas);
      setShareModalBlob(blob);
      setShareModalFileName(`${config.id}-compare-${typeCode}.png`);
      setShareModalUrl(compareUrl);
      setShowShareModal(true);
    } catch {
      alert('分享图生成失败');
    }
  }, [result, compareData, config]);

  const handleTabChange = useCallback((tab: TabId) => {
    if (tab === 'home' || tab === 'ranking') setActiveTab(tab as FpiTabId);
  }, []);

  const totalTests = ranking.data?.total ?? 0;
  const showOverlay = screen !== 'home';

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {!showOverlay && (
        <Nav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onStartTest={handleStartTest}
        />
      )}

      {!showOverlay && (
        <main>
          {activeTab === 'home' && (
            <>
              <FpiHero onStartTest={handleStartTest} totalTests={totalTests} />
              <div className="mx-auto max-w-2xl -mt-8 mb-14 px-5 py-3 bg-surface/40 border border-border/50 rounded-lg">
                <p className="text-xs text-muted leading-relaxed text-center">
                  <strong className="text-white">免责：</strong>
                  FPI 所有类型描述都是朋友圈梗，仅供娱乐，不构成对任何真实好友的评价。请对号入座前先对自己入座。
                </p>
              </div>
            </>
          )}
          {activeTab === 'ranking' && (
            <RankingPage
              ranking={ranking}
              localHistory={localHistory}
              onStartTest={handleStartTest}
            />
          )}
        </main>
      )}

      {screen === 'quiz' && (
        <QuizOverlay
          quiz={quiz}
          onSubmit={handleQuizSubmit}
          onBack={handleBackToHome}
        />
      )}

      {screen === 'interstitial' && (
        <Interstitial onComplete={handleInterstitialComplete} />
      )}

      {screen === 'result' && result && (
        <ResultPage
          result={result}
          testBadge={
            <FPIHeroBadge
              typeCode={result.finalType.code}
              typeCn={result.finalType.cn}
            />
          }
          onShare={handleShare}
          onInviteCompare={handleInviteCompare}
          onRestart={handleRestart}
          onHome={handleBackToHome}
          onDebugReroll={handleDebugReroll}
          onDebugForceType={handleDebugForceType}
        />
      )}

      {showShareModal && (
        <ShareModal
          imageBlob={shareModalBlob}
          fileName={shareModalFileName}
          shareUrl={shareModalUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {screen === 'compare' && compareData && result && (
        <ComparePage
          myData={{
            code: result.finalType.code,
            levels: result.levels,
            similarity: 'similarity' in result.finalType
              ? (result.finalType as { similarity: number }).similarity
              : 0,
          }}
          theirData={compareData}
          onStartTest={handleRestart}
          onShareCompare={handleShareCompare}
        />
      )}

      {screen === 'compare' && compareData && !result && (
        <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center px-4">
          <p className="text-lg text-muted mb-2">对方人格：</p>
          <p className="text-white font-mono font-bold text-3xl mb-1">
            {compareData.code}
          </p>
          <p className="text-sm text-muted mb-6">
            {config.typeLibrary[compareData.code]?.cn || ''}
          </p>
          <p className="text-sm text-[#999] mb-6">
            先完成测试，才能查看你们的人格对比
          </p>
          <button
            onClick={handleStartTest}
            className="bg-accent text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
          >
            开始测试
          </button>
          <button
            onClick={handleBackToHome}
            className="mt-3 text-muted underline text-sm cursor-pointer"
          >
            返回首页
          </button>
        </div>
      )}
    </div>
  );
}

export default function FpiApp() {
  return (
    <TestConfigProvider config={fpiConfig}>
      <FpiAppInner />
    </TestConfigProvider>
  );
}
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add src/FpiApp.tsx
git commit -m "feat(fpi): add FpiApp top-level component"
```

---

## Task 11：vite.config.ts 新增 fpi 入口

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 在 rollupOptions.input 加 fpi**

编辑 `vite.config.ts`，在 `input` 对象里 gsti 条目后追加 `fpi`：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
  })],
  base: '/new/',
  build: {
    rollupOptions: {
      input: {
        main: 'new.html',
        love: 'love.html',
        work: 'work.html',
        values: 'values.html',
        cyber: 'cyber.html',
        desire: 'desire.html',
        gsti: 'gsti.html',
        fpi: 'fpi.html',      // 新增
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

- [ ] **Step 2: Verify build**

Run: `npx vite build --outDir dist-task11 --emptyOutDir 2>&1 | tail -30`
Expected: 构建成功，输出 `dist-task11/fpi.html` 和 FPI 相关 chunk。

- [ ] **Step 3: 清理临时产物**

Run: `rm -rf dist-task11`

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "feat(fpi): add fpi vite entry"
```

---

## Task 12：build.sh 复制 fpi 产物到 /new/fpi/

**Files:**
- Modify: `build.sh`

- [ ] **Step 1: 在测试复制循环里加入 `fpi`**

编辑 `build.sh`，修改第 20 行附近的循环：

```bash
#!/bin/bash
set -e

# 1. Type-check
npx tsc --noEmit

# 2. Build React app to temp directory
npx vite build --outDir dist-temp

# 3. Prepare final dist directory
rm -rf dist
mkdir -p dist/new

# 4. Copy React build into /new/
cp dist-temp/new.html dist/new/index.html
cp -r dist-temp/assets dist/new/assets

# 5. Copy test builds into /new/<test>/
for test in love work values cyber desire gsti fpi; do     # ← 追加 fpi
  mkdir -p dist/new/$test
  cp dist-temp/$test.html dist/new/$test/index.html
done

# 6. Copy hub landing page + PWA manifest
cp index.html dist/index.html
cp manifest.json dist/manifest.json

# 7. Copy shared static assets
cp -r images dist/images
test -f sw.js && cp sw.js dist/sw.js

# 8. Cleanup
rm -rf dist-temp

echo "Build complete: old at /, SBTI at /new/, love/work/values/cyber/desire/gsti/fpi at /new/<test>/"
```

- [ ] **Step 2: Syntax check build.sh**

Run: `bash -n build.sh && echo OK`
Expected: `OK`。

- [ ] **Step 3: 跑一次完整 build 验证产物**

Run: `./build.sh 2>&1 | tail -10`
Expected: 最后行看到 `dist/new/fpi/index.html` 存在。

Run: `ls dist/new/fpi/`
Expected: `index.html`。

- [ ] **Step 4: Commit**

```bash
git add build.sh
git commit -m "feat(fpi): copy fpi build artefact to /new/fpi/"
```

---

## Task 13：hub 首页（index.html）新增 FPI 卡片

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 更新 hero title & subtitle（7 → 8 个测试）**

打开 `index.html`，修改 head 和 hero 区域的文案：

```html
<!-- title 和 meta description 更新 -->
<title>人格实验室 — 8个测试，N种人格，0个正确答案</title>
<meta name="description" content="人格实验室：8款趣味人格测试，从恋爱脑到打工人，从赛博基因到朋友圈人设，测出你从未认识的自己。" />

<!-- hero 副标题 -->
<p class="hero-subtitle">8个测试，N种人格，0个正确答案</p>
```

- [ ] **Step 2: 在 tests-grid 末尾加一张 FPI 卡**

在 gsti 卡（`<a class="test-card fade-in-up" href="/new/gsti">`）之后追加：

```html
      <a class="test-card fade-in-up" href="/new/fpi">
        <div class="card-emoji">📸</div>
        <div class="card-name">朋友圈人设诊断</div>
        <div class="card-tagline">你在朋友圈是什么物种</div>
        <div class="card-cta">开始测试 &rarr;</div>
      </a>
```

- [ ] **Step 3: 在 CSS 动画 delay 新增第 8 张**

找到 `@keyframes fadeInUp` 下面的 `.test-card:nth-child(N)` 列表，加上：

```css
    .test-card:nth-child(8) { animation-delay: 0.40s; }
```

- [ ] **Step 4: 更新底部 JS 的 tests 数组**

找到底部的 `var tests = ['', 'love', 'work', 'values', 'cyber', 'desire', 'gsti'];`，改为：

```js
      var tests = ['', 'love', 'work', 'values', 'cyber', 'desire', 'gsti', 'fpi'];
```

- [ ] **Step 5: 手动快速 sanity check**

Run: `grep -c "test-card fade-in-up" index.html`
Expected: `8`。

Run: `grep -n "/new/fpi" index.html`
Expected: 至少 1 行。

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(fpi): add FPI card to hub page (8 tests total)"
```

---

## Task 14：api/record.js 支持 fpi 命名空间

**Files:**
- Modify: `api/record.js`

- [ ] **Step 1: 在 VALID_TYPES_BY_TEST 加入 fpi**

编辑 `api/record.js`，在 `gsti` 之后追加 `fpi`：

```javascript
  'fpi': new Set([
    'FILTR','9PIC!','EMO-R','FLEXR','CKIN!','3DAYS','SUBMR','LIKER',
    'GHOST','COPYR','SELLR','BABY!','FURRY','MUKBG','TRVL9','BLOCK',
    'REDBK','JUDGE','QSLIF','NPC-F',
    '0POST','FEED?'
  ]),
```

- [ ] **Step 2: Syntax check**

Run: `node --check api/record.js && echo OK`
Expected: `OK`。

- [ ] **Step 3: Commit**

```bash
git add api/record.js
git commit -m "feat(fpi): whitelist fpi type codes in record API"
```

---

## Task 15：api/ranking.js 支持 fpi（mock + hidden）

**Files:**
- Modify: `api/ranking.js`

- [ ] **Step 1: 在 MOCK_TYPES_BY_TEST 加入 fpi**

在 `gsti:` 之后追加：

```javascript
  fpi: [
    'FILTR','9PIC!','EMO-R','FLEXR','CKIN!','3DAYS','SUBMR','LIKER',
    'GHOST','COPYR','SELLR','BABY!','FURRY','MUKBG','TRVL9','BLOCK',
    'REDBK','JUDGE','QSLIF','NPC-F',
    '0POST','FEED?',
  ],
```

- [ ] **Step 2: 在 HIDDEN_TYPE_BY_TEST 加入 fpi**

```javascript
const HIDDEN_TYPE_BY_TEST = {
  '': 'DRUNK',
  love: 'EX',
  work: '996',
  values: 'MLC',
  cyber: 'BOT',
  desire: 'XXX',
  gsti: 'UNDEF',
  fpi: '0POST',      // 新增
};
```

- [ ] **Step 3: Syntax check**

Run: `node --check api/ranking.js && echo OK`
Expected: `OK`。

- [ ] **Step 4: Commit**

```bash
git add api/ranking.js
git commit -m "feat(fpi): add fpi to ranking mock types + hidden type map"
```

---

## Task 16：App.tsx（SBTI 主站）加 FPI 跨测试引流卡

**Files:**
- Modify: `src/App.tsx`

> GSTI 任务 15 已经在 SBTI 主站加了一张 GSTI 导流卡。FPI 不强制也加一张——相比 GSTI 的"性转反差"强钩子，FPI 的钩子是"自嘲朋友圈人设"，主要导流来自 hub 首页和朋友圈冷启动，SBTI 主站不再加卡以免页面过长。

- [ ] **Step 1: 决策：跳过不加**

本任务作为"不做"记录——不修改 `src/App.tsx`。若后期 FPI 数据好，再回来补。

- [ ] **Step 2: Commit empty record**

```bash
git commit --allow-empty -m "decide: skip FPI cross-promo card on SBTI main site for MVP"
```

---

## Task 17：Pattern + 答题 smoke（用 #test 自动填答）

**Files:**
- (无文件修改，仅验证)

- [ ] **Step 1: dev 启动**

Run: `npm run dev`

- [ ] **Step 2: 浏览器访问 `#test` auto-fill**

打开：`http://localhost:5173/fpi.html#test`
Expected: 直接跳到结果页，类型为 20 个常规之一（大概率不是 `0POST`/`FEED?`，因为 `#test` 走 `autoFillAndShowResult` 不触发 hidden，且 similarity 通常 ≥ 55）。

- [ ] **Step 3: 多 reload 10 次**

每次刷新查看 result type，记录结果分布。
Expected: 多样的类型都能命中，不集中在某一个 code。

- [ ] **Step 4: 手动走一次 0POST 路径**

关闭 `#test`，正常走入 `quiz` overlay → 第一题（fpi_gate）选 "我已经不记得朋友圈入口长什么样"（value=4）→ 继续答完 24 题 → 结果应为 `0POST`。

- [ ] **Step 5: 检查海报生成**

结果页点"分享"，应能生成一张 PNG（`html2canvas` 捕获 ResultPage）。
Expected: 海报包含类型中文名 + 雷达图 + QR。无乱码。

- [ ] **Step 6: Commit**

```bash
git commit --allow-empty -m "verify: fpi #test smoke + hidden path + share card"
```

---

## Task 18：敏感词 & 合规自检

**Files:**
- Modify（可能）: `src/data/fpi/types.ts`, `src/data/fpi/questions.ts`

- [ ] **Step 1: 跑一次禁用词扫描**

参考 spec 7.1 的禁止项列表，扫描：

```bash
grep -E "穷酸|低端|底层|老登|小仙女|妓|娼|婊|贱|日你|草你" src/data/fpi/types.ts src/data/fpi/questions.ts
```

Expected: 无命中。（本 plan 类型文案已预先避开所有禁用词，应为空。）

- [ ] **Step 2: 仿微信 UI 检查**

打开 `src/components/FPIHeroBadge.tsx` + 分享海报模板，确认：
- 没有绿色+白色对话框模仿微信 bubble
- 没有假头像/假昵称占位（"张三 · 两分钟前"这类）
- 没有仿微信 logo

Expected: 本 plan 的 `FPIHeroBadge` 用通用 pill/chip 样式，不涉及微信 UI。

- [ ] **Step 3: 群体对立审计**

通读 20 条 type desc，确认没有写：
- 阶层标签（底层/贫困/精英专属）
- 职业污名（小镇做题家/互联网民工）
- 地域歧视
- 性别对立（FPI 本身不涉及性别）
- 年龄污名（Z 世代/00 后/老年人）

Expected: 全部通过。本 plan 的 20 类型 desc 已预先审过；若后续改写仍要重扫。

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "chore(fpi): sensitive word + compliance audit pass"
```

---

## Task 19：TypeScript 全量 + 生产构建

**Files:**
- (无文件修改，仅验证)

- [ ] **Step 1: 全量 type check**

Run: `npx tsc --noEmit 2>&1 | head -50`
Expected: 无错误。

- [ ] **Step 2: 全量 build**

Run: `./build.sh 2>&1 | tail -20`
Expected: 构建成功；`dist/new/fpi/index.html` 存在；`dist/new/assets/fpi-*.js` chunk 存在。

- [ ] **Step 3: `npm run preview` smoke**

Run: `npm run preview &`
打开: `http://localhost:4173/new/fpi.html`

完整走一遍：
- [ ] 首页 → 开始测试
- [ ] 走完 24 + gate 题（不触发 0POST）→ 结果为 20 常规之一
- [ ] 重测 → gate 选 D → 结果为 `0POST`
- [ ] 分享卡 → FPIHeroBadge 的 stickers 正确显示
- [ ] 排行榜 tab → 无崩溃、显示 mock 数据

- [ ] **Step 4: 关闭 preview**

Run: `pkill -f 'vite preview'`

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "verify: fpi build + preview smoke pass"
```

---

## Task 20：部署前最后清单

**Files:**
- (无文件修改；清单)

- [ ] **Step 1: 人工清单**

- [ ] `fpi.html` 的 title / OG tags 不含占位文字（已在 Task 1 填写）
- [ ] 20 个类型 desc 无错别字、无敏感词（Task 18 已过）
- [ ] 24 题目无 typo（Task 4 完整写入）
- [ ] Gate 触发 `0POST` 路径走通（Task 17 已过）
- [ ] 分享海报 + FPIHeroBadge 正确渲染（Task 19 已过）
- [ ] Hub 首页 FPI 卡可点（Task 13 已过）
- [ ] API record / ranking 对 `fpi` 命名空间生效（Task 14/15）
- [ ] `./build.sh` 成功产出 `dist/new/fpi/index.html`（Task 19）

- [ ] **Step 2: 推送部署**

```bash
git push origin feat/gsti-gender-swap       # 当前 branch（user 会 cherry-pick/merge）
# 或 user 已手动切到 main 之后：
# git push origin main
```

- [ ] **Step 3: Vercel 侧**

- 等 Vercel 自动构建完成
- 访问 `https://sbti.jiligulu.xyz/new/fpi` 确认 HTML 正确 render
- 若 rewrite 规则没命中（参考 GSTI Task 20 的 `vercel.json` 修复经验），在 `vercel.json` 中为 `/new/fpi` 和 `/new/fpi/(.*)` 各加一条 rewrite 到 `/new/fpi/index.html`

- [ ] **Step 4: API smoke（线上）**

```bash
curl -X POST https://sbti.jiligulu.xyz/api/record \
  -H 'Content-Type: application/json' \
  -d '{"type":"FILTR","test":"fpi"}'
# Expected: {"ok":true,"total":...}

curl "https://sbti.jiligulu.xyz/api/ranking?test=fpi"
# Expected: 含 FILTR / 9PIC! 等 fpi 命名空间的 mock ranking
```

- [ ] **Step 5: 24h 监控**

- 访问量、QPS、Upstash 写入速率
- 评论区话术是否出现"屏蔽 XX""围攻 XX"类负面引导——如有立刻发"测试是梗，别当真"的温馨提示

- [ ] **Step 6: Commit empty record**

```bash
git commit --allow-empty -m "ship(fpi): deploy + smoke checklist done"
```

---

## 自审检查点

- 20 个任务覆盖 FPI spec 第 2-8 章所有 P0 / P1 项。
- 每个任务含绝对文件路径、完整代码（无 placeholder）、verification、commit message。
- 20 个 pattern 在 plan 阶段已人肉校对为 unique（6 位 L/M/H，最小 Hamming ≥ 2）—— Task 9 验证兜底。
- FPI 不用 `genderLocked`，`computeResult` 走 4 参稳定签名，不破坏其他 7 个测试。
- `FPIHeroBadge` 用通用 pill/chip 视觉，规避微信 UI 仿冒（spec 7.1）。
- 禁用词列表在 plan 阶段已预防性避开，Task 18 做二次扫描。

---

## 上线后未覆盖的改进点（供后续 session 跟进）

- [ ] 自定义 `typeImages`（20 张朋友圈截图风格封面，可以用 Midjourney prompt "screenshot of feed"）
- [ ] `compatibility` 表：主题 "谁最看懂你的朋友圈 / 谁会把你屏蔽"（spec P2）
- [ ] 多平台结果页文案差异版：朋友圈 vs 小红书 vs 抖音（spec P3）
- [ ] FPI 独立子域名（若数据表现好）
- [ ] 分享海报 "朋友圈截图"视觉升级（Canvas 绘制朋友圈风格但不仿微信 UI，spec 6.2）

---

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 | cwjjjjj + Claude |

---

## 执行进度日志（Execution Log）

> **目的：** 每完成一个 task 追加一条，记录 commit SHA、review 发现、关键决策。

### 已完成

**Task 1 — fpi.html 入口** ✅
- Commit: `15718d3` — `feat(fpi): add fpi.html entry`
- 48 行。内联 `<script type="module">` import `FpiApp`，Chinese meta + OG + JSON-LD。

**Task 2 — dimensions.ts** ✅
- Commit: `7057e6e` — `feat(fpi): add dimensions.ts with 6 feed-axis model`
- 46 行。6 维 D1-D6（POST/POLI/MASK/EMOT/ECHO/GATE）+ L/M/H 三档 `DIM_EXPLANATIONS`（对齐 MPI/FSI 风格，非 GSTI 的 A/B）。

**Task 3 — typeImages.ts + compatibility.ts 占位** ✅
- Commit: `90acce0` — `feat(fpi): add typeImages + compatibility stubs`
- 空 Record 占位 + `getCompatibility` stub 返回 normal。

**Task 4 — questions.ts（24 题 + 1 gate）** ✅
- Commit: `8ab1062` — `feat(fpi): add 24 feed-behavior questions + gate`
- 270 行。4-4-4-4-4-4 分布覆盖 D1-D6 + `fpi_gate`（special / kind:'gate'）。
- 注意：部分题目选项 value 非单调递增（mask1/mask4/echo2 等）是 spec 刻意，**Task 17 smoke 由此暴露 randomAnswerForQuestion bug**（详见 Task 17）。

**Task 5 — types.ts（20+2）** ✅
- Commit: `8e37f79` — `feat(fpi): add 20 feed persona types + 0POST hidden + FEED? fallback`
- 163 行。20 常规类型（FILTR/9PIC!/EMO-R/FLEXR/CKIN!/3DAYS/SUBMR/LIKER/GHOST/COPYR/SELLR/BABY!/FURRY/MUKBG/TRVL9/BLOCK/REDBK/JUDGE/QSLIF/NPC-F）+ 隐藏 `0POST` + 兜底 `FEED?`。每个 desc 4 段式（开场定位/天赋优势/隐秘代价/一句刺痛）。
- **Pattern 质量显著优于 GSTI 首版：** 20/20 unique，min Hamming=2（最近：FILTR HHHLLM vs 9PIC! HHMLHM）。

**Task 6 — config.ts** ✅
- Commit: `fd1551c` — `feat(fpi): assemble TestConfig`
- 68 行。`fpiConfig.id='fpi'`, `basePath='/new/fpi'`, `apiTestParam='fpi'`, `gateQuestionId='fpi_gate'`, `fallbackTypeCode='FEED?'`, `hiddenTypeCode='0POST'`, `maxDistance=12`, `similarityThreshold=55`。**不含 `genderLocked`**（FPI 不做性别锁定）。

**Task 7 — FPIHeroBadge 组件** ✅
- Commit: `b775720` — `feat(fpi): add FPIHeroBadge component`
- 50 行。"Feed sticker"视觉（非微信 UI 仿冒 per spec §7.1），按 typeCode 分 9 种 sticker + default。

**Task 8 — ResultPage 加 testBadge slot** ✅
- Commit: `1596380` — `feat(fpi): add optional testBadge slot to ResultPage`
- ResultPage 新增可选 `testBadge?: ReactNode`。FPI 走 slot，GSTI 继续走 `config.genderLocked + gender` 内联（互斥条件 `testBadge && !config.genderLocked && testBadge`）。7 个现有 App 不传 testBadge 无影响。

**Task 9 — Pattern 唯一性自检脚本** ✅
- Commit: `0a03cdb` — `verify: fpi 20 normal-type patterns are unique (min hamming 2)`
- 新建 `scripts/fpi-pattern-check.ts` + `package.json` 加 `fpi:pattern-check` 脚本。输出确认 20/20 unique，min Hamming=2。

**Task 10 — FpiApp 顶层组件** ✅
- Commit: `dba1bce` — `feat(fpi): add FpiApp top-level component`
- 424 行。`ScreenId` 无 `'picker'`；`computeResult` 4 参调用（无 gender）；`<ResultPage testBadge={<FPIHeroBadge typeCode=... typeCn=... />} ...>`；默认导出 `TestConfigProvider config={fpiConfig}` 包裹。

**Task 11 — vite.config.ts** ✅
- Commit: `62458fe` — `feat(fpi): add fpi vite entry`

**Task 12 — build.sh** ✅
- Commit: `fe6c84a` — `feat(fpi): copy fpi build output to /new/fpi/`

**Task 13 — hub 首页 FPI 卡** ✅
- Commit: `4fcd022` — `feat(fpi): add FPI card to hub page (8 tests total)`
- `index.html` meta + 卡片 + JS tests 数组都加 FPI（总卡片 7 → 8）。

**Task 14 — api/record.js** ✅
- Commit: `ae02b55` — `feat(fpi): whitelist fpi type codes in record API`
- `VALID_TYPES_BY_TEST.fpi` 新增 22 码 Set。

**Task 15 — api/ranking.js** ✅
- Commit: `2c44b9a` — `feat(fpi): add fpi to ranking mock types + hidden type map`

**Task 16 — SBTI 交叉引流（跳过）** ✅
- Commit: `2388a8d` — `decide: skip FPI cross-promo card on SBTI main site for MVP`
- 按 plan 原决策跳过，避免 SBTI 主页堆积过多 promo 卡。

**Task 17 — Smoke + bug 修复** ✅
- Commit: `2472a2f` — `fix(fpi): randomAnswerForQuestion uses max option value, not last`
- **关键发现：** 200 轮 smoke 脚本暴露 `src/utils/quiz.ts` 的 `randomAnswerForQuestion` bug：假设 options 按 value 升序，用 `options[last].value` 当随机上限；FPI 若干题用 H→L 降序，导致随机上限=1，结果全塌陷到 SUBMR（LLLLLL）。
- **修复：** `Math.max(...options.map(o => o.value))` 取所有 value 最大值，不依赖顺序。其他 7 个测试（升序）行为不变。
- 新增 `scripts/fpi-smoke-dist.ts` + `scripts/fpi-smoke-hidden.ts`。修复后 20/20 可达，hidden 正常 → `0POST`。

---

### 关键架构纠正（继承自 GSTI plan）

**多入口机制真相：** 项目**不用** `main.tsx` 做路由。Vite 的 `rollupOptions.input` 指定多 HTML 入口，**每个 HTML 直接内联 `<script type="module">` import 对应的 App 组件**。`main.tsx` 只服务于 `new.html`（SBTI 主站）。

- 参考：`cyber.html` / `gsti.html` 底部 inline script
- FPI 的 `fpi.html` 同样 inline import `FpiApp`，**不改 `main.tsx`**

---

### 续接指令（给下一个 AI 或开发者）

```
# 1. 切到开发分支
cd /Users/jike/Desktop/Developer/sbticc
git checkout feat/gsti-gender-swap
git log --oneline | head -15

# 2. 确认当前 HEAD 的 commit 对应 plan 哪个 task

# 3. 从下一个 [ ] Task N 开始。Plan 里每个 task 含完整代码块、verification、commit message。

# 4. 完成后：
#    - 追加"已完成"条目到本 md（commit SHA、改动摘要、review 发现）
#    - 在"关键决策记录"记录新决策（如果有）

# 5. 推荐模式：Subagent-Driven Development（或手动执行）。
#    参考 skill: superpowers:subagent-driven-development
```
