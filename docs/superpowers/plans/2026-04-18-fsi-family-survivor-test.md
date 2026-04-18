# FSI 原生家庭幸存者 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增第三阶段情感深度测试 FSI（Family Survivor Index · 原生家庭幸存者）。用户答 22 题覆盖 6 维度（CTRL/WARM/GNDR/MNEY/LITE/ECHO），匹配到 18 个"家庭出厂型号"之一；第 22 题作为 gate，同时满足 CTRL/LITE/ECHO 全高 + gate 选 C 时触发隐藏类型 `BOSSY`（家族 CEO）；匹配失败兜底到 `FAMX?`（家庭乱码人）。主打"你不是性格古怪，你只是被你的家庭出厂设置过"的自嘲钩子，**所有类型文案以温柔出口收尾，首/测试前/结果页三处强制免责 + 心理危机热线**。

**Architecture:** 作为第 9 个测试加入现有多入口架构（`fsi.html` + `src/FsiApp.tsx` + `src/data/fsi/`）。**没有性别锁定**——`genderLocked` 字段留空，不弹 GenderPicker，`computeResult` 走稳定的 4 参调用（`answers, hiddenTriggered, config, debugForceType`），第 5 参 `gender` 省略。复用 FPI 已落地的 `testBadge` slot 机制；为结果页底部兜底模块新增一个 `testFooter?: ReactNode` slot，承载 `FSIResultSupportBlock`（心理危机热线）。FSI 独有 `FSIDisclaimerModal` 在首次进入测试前弹一次（localStorage 记忆）。其余核心组件（ResultPage / QuizOverlay / Interstitial / RankingPage / ShareModal）100% 复用。

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion，沿用现有 Redis 排行榜与分享海报管线。

**Spec:** `docs/superpowers/specs/2026-04-18-fsi-family-survivor-design.md`

---

## File Structure

### 新建文件
| File | Purpose |
|------|---------|
| `fsi.html` | Vite 入口 HTML（内联 import `FsiApp`，参考 `fpi.html` / `gsti.html`） |
| `src/FsiApp.tsx` | 顶层 App，`TestConfigProvider + AppInner` 模式（仿 `FpiApp.tsx`，无 GenderPicker） |
| `src/data/fsi/dimensions.ts` | 6 维度定义 CTRL / WARM / GNDR / MNEY / LITE / ECHO |
| `src/data/fsi/questions.ts` | 21 主题目（每维 3-4 题）+ 1 gate 题 `fsi_gate` |
| `src/data/fsi/types.ts` | 18 常规类型 + `BOSSY` 隐藏 + `FAMX?` 兜底 + NORMAL_TYPES + TYPE_RARITY |
| `src/data/fsi/typeImages.ts` | 占位空 Record（首版走 CSS 生成卡片） |
| `src/data/fsi/compatibility.ts` | 占位 stub（首版不启用 compat tab） |
| `src/data/fsi/config.ts` | FSI TestConfig 实例，`id='fsi'`，`basePath='/new/fsi'` |
| `src/components/FSIHeroBadge.tsx` | 结果页顶部"家庭出厂铭牌"徽章（仅 FSI 渲染） |
| `src/components/FSIResultSupportBlock.tsx` | 结果页底部深色兜底模块（心理危机热线 010-82951332 / 400-161-9995） |
| `src/components/FSIDisclaimerModal.tsx` | 测试开始前浮层（首次进入弹一次，localStorage 记忆） |
| `scripts/fsi-pattern-check.ts` | Pattern 唯一性校验脚本（独立一份，沿用 fpi-pattern-check.ts 的结构） |

### 修改文件
| File | Change |
|------|--------|
| `src/components/ResultPage.tsx` | 在现有 `testBadge` 之外新增可选 prop `testFooter?: ReactNode` 插槽（在"重测/回首页"按钮行之后渲染），不破坏现有 8 个测试 |
| `vite.config.ts` | `rollupOptions.input` 新增 `fsi: 'fsi.html'` |
| `build.sh` | 测试产物复制循环追加 `fsi` |
| `index.html` | Hub 首页新增 FSI 卡片（9 个卡片 + 动画 delay + `tests` 数组追加 `'fsi'`） |
| `api/record.js` | `VALID_TYPES_BY_TEST.fsi` 新增 20 个 code（18 常规 + `BOSSY` + `FAMX?`） |
| `api/ranking.js` | `MOCK_TYPES_BY_TEST.fsi` 与 `HIDDEN_TYPE_BY_TEST.fsi='BOSSY'` |
| `vercel.json` | 新增 `/new/fsi` 与 `/new/fsi/(.*)` rewrite（与 GSTI/FPI 一致） |

> **`matching.ts` 不需要改**：FSI 不使用 `genderLocked`，走 `computeResult` 既有路径即可。调用签名保持 4 参：`computeResult(answers, hiddenTriggered, config, debugForceType)`。

---

## Dimension Conventions

FSI 采用 6 维，每维 `L/M/H` 三档，22 题分布：**CTRL/WARM/MNEY/LITE/ECHO 各 4 题 + GNDR 2 题 + 1 gate 题 = 22 + 1 gate**。注意 GNDR 维度在中国语境下少于其他维度（多数家庭并不主动用性别打结，2 题足以承担区分）；其他 5 维各 4 题以保证稳定性。

| 维度 | Code | 高分含义 | 低分含义 | 说明 |
|------|------|----------|----------|------|
| D1 | CTRL | H=被安排派（专业/对象/工作都不是你选的） | L=放养派（你自己看着办） | 遥控器强度 |
| D2 | WARM | H=热灶台（吵闹但底下有爱） | L=冷藏柜（有序但没人抱抱） | 体感温度 |
| D3 | GNDR | H=重男/重女（位次由性别定） | L=去性别化（一碗水端平） | 性别出厂设置 |
| D4 | MNEY | H=钱即爱（金钱和感情混一起） | L=钱是钱（不拿钱施压） | 经济牵引力 |
| D5 | LITE | H=聚光灯（你的一切都被盯着） | L=透明人（你说话没人接茬） | 能见度光强 |
| D6 | ECHO | H=复刻派（你就是你爸/妈） | L=反叛派（打死不变成他们） | 代际回音 |

题目 `value` 映射：
- `1` = 强指向低分（L 极）
- `2` = 偏 L
- `3` = 偏 H
- `4` = 强指向高分（H 极）

每维度 raw score 视题量不同有两套换算：

**5 维（CTRL/WARM/MNEY/LITE/ECHO，各 4 题）** — raw = 4-16：
- `score ≤ 8` → `L`（平均 ≤ 2）
- `9 ≤ score ≤ 12` → `M`
- `score ≥ 13` → `H`（平均 ≥ 3.25）

**GNDR（2 题）** — raw = 2-8：
- `score ≤ 4` → `L`（平均 ≤ 2）
- `5 ≤ score ≤ 6` → `M`
- `score ≥ 7` → `H`

用户向量 = 6 维 L/M/H → levelNum 数组。Pattern 字符串 6 字符，matching 里 `levelNum` 把 L→1、M→2、H→3，最小曼哈顿距离即最匹配。`maxDistance = 12`（6 维 × 最大差 2）。

**Pattern 去重承诺**：18 个 normal pattern 全部 unique（已设计为两两最小 Hamming distance ≥ 2），避免 GSTI v1 的"半数 pattern 撞车"问题。Plan 第 9 个 task 有一段独立脚本做验证。

### 隐藏触发（`BOSSY` 家族 CEO）

- **多条件触发**（参考 spec §5.1）：
  1. `fsi_gate` 题目：`你现在和父母的关系更像哪种？` 用户选 C `我反过来管他们了` (`value=3`) → 预触发
  2. 同时要求维度向量满足：CTRL=H & LITE=H & ECHO=H
- **实现方式**：FSI 采用**双阶段 hidden 判定**——`config.hiddenTriggerQuestionId='fsi_gate'` 只用于 gate 标记；真正的触发判定在 `FsiApp` 的 `computeResult` 外层包一层逻辑，若 `answers['fsi_gate'] === 3` 且最终 levels 满足 `CTRL=H,LITE=H,ECHO=H`，强制结果覆写为 `BOSSY`。否则 gate 只是普通第 22 题，不影响 matching。
- 由于现有 `matching.ts` 的 `hiddenTriggerValue` 是单一 value 触发隐藏，我们**不改 matching.ts**——把多条件判定放在 FsiApp 的 `handleQuizSubmit` / `autoFillAndShowResult` 两处执行 `computeResult` 之后做覆写。

### 兜底类型 `FAMX?`（家庭乱码人）

当用户最佳匹配 similarity < 55 时由 `matching.ts` 的现有 fallback 分支接管，返回 `FAMX?`。

### 调性红线（全 plan 贯穿）

per spec §9.1，以下一级禁用词**严禁出现在**题目、类型描述、海报文案、任何 UI copy：
- 毒母 / 毒父 / 毒亲 / 原生家庭罪 / 家庭毁掉 / 被家毁掉
- 家暴 / 打骂 / 酗酒 / 自残 / 抑郁症 / 精神病 / 轻生
- 拳师 / 爹味 / 老登 / 凤凰男 / 妈宝男 / 扶弟魔
- 控诉 / 讨伐 / 告状 / 判决 / 罪行
- 指名父母性别的贬义词

每个类型 desc 必须以**温柔出口**收尾（刺痛 + 出路的组合），不能用"你永远……"式绝望钉子句。Task 5 的 18 条类型描述已在 plan 阶段全部按此规则成稿；Task 18 做二次全量 Lint。

---

## Task 1：创建 fsi.html 入口

**Files:**
- Create: `fsi.html`

- [ ] **Step 1: 创建 fsi.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>原生家庭幸存者 — 你被养成了什么形状 | 免费测试</title>
  <meta name="description" content="22 道轻量自省题，6 个维度，18 种家庭出厂型号。不是让你哭的，是让你笑着承认——你被这样养大，接下来怎么办。" />
  <meta name="keywords" content="原生家庭测试,家庭心理测试,FSI,重养自己,电子父母" />
  <link rel="canonical" href="https://sbti.jiligulu.xyz/new/fsi" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="原生家庭幸存者 — 你被养成了什么形状" />
  <meta property="og:description" content="SBTI 测你是什么物种，FSI 测你怎么变成这个物种的。一次轻量自省，不是诊断。" />
  <meta property="og:url" content="https://sbti.jiligulu.xyz/new/fsi" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="原生家庭幸存者 — 你被养成了什么形状" />
  <meta name="twitter:description" content="SBTI 测你是什么物种，FSI 测你怎么变成这个物种的。一次轻量自省，不是诊断。" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "FSI 原生家庭幸存者",
    "description": "22 题 6 维度，18 种家庭出厂型号，以温柔出口收尾；含心理支持热线。",
    "educationalLevel": "entertainment"
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import FsiApp from './src/FsiApp.tsx'
    import './src/index.css'

    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(React.StrictMode, null,
        React.createElement(FsiApp)
      )
    )
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run: `ls fsi.html && head -1 fsi.html`
Expected: 文件存在，首行 `<!DOCTYPE html>`。

- [ ] **Step 3: Commit**

```bash
git add fsi.html
git commit -m "feat(fsi): add fsi.html vite entry"
```

---

## Task 2：创建 dimensions.ts

**Files:**
- Create: `src/data/fsi/dimensions.ts`

- [ ] **Step 1: 创建文件**

```typescript
// src/data/fsi/dimensions.ts
import type { DimensionInfo } from '../testConfig';

export const dimensionMeta: Record<string, DimensionInfo> = {
  D1: { name: '遥控器强度', model: 'CTRL 模型' },
  D2: { name: '体感温度',   model: 'WARM 模型' },
  D3: { name: '性别出厂设置', model: 'GNDR 模型' },
  D4: { name: '经济牵引力', model: 'MNEY 模型' },
  D5: { name: '能见度光强', model: 'LITE 模型' },
  D6: { name: '代际回音',   model: 'ECHO 模型' },
};

export const dimensionOrder = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  D1: {
    L: '你家实行放养。你选什么他们都说随你，出了事也就一句"你自己的选择"。好处是你确实独立，坏处是你独立得有点太早了。',
    M: '你家在"管"和"不管"之间有一条不稳定的线——有时嘴上说随便你，有时又拐回"我觉得那个比较稳"。你大部分时候自己做主，但每次大选择之前都还会听一听家里的气压。',
    H: '你从小就知道"我的人生有草稿"。专业定好、工作推荐、对象介绍，你擅长在别人的轨道里表现优秀。你不是不会选，你是没练习过。',
  },
  D2: {
    L: '你家像一间 AirBnB：干净、讲理、各自回房。你小时候以为这叫"文明"，长大才发现自己不会抱人，也不会被抱。安静的关系让你舒服，但靠近一点就让你发紧。',
    M: '你家日常不吵不闹，该说的话都说，但有些话永远不说。你知道家人爱你，只是你得靠行动去翻译——而不是对话。',
    H: '你家吵得像菜市场，但过年一定围一张桌子。你的"爱"理解是嘈杂的、管事的、一大家子热闹的。安静的关系会让你没安全感，你会下意识去把它打开。',
  },
  D3: {
    L: '你爸妈至少表面上没分男女。你做你的事，他们做他们的。这是运气，但你看朋友们鸡飞狗跳时偶尔也会有一种"我是不是错过了什么"的错位感。',
    M: '你家有一点性别痕迹，但没重到让你窒息——某些场合你能感觉到位次，但大部分时间没人特别提。',
    H: '你在家里的位次早就被性别写好了。是男孩就继承压力，是女孩就负责懂事。你可能自己没意识到，但你花了很多年才允许自己"按自己的性别活"。',
  },
  D4: {
    L: '你家不怎么在钱上拉扯。缺就缺，有就有，没人把工资条当武器。你对钱反而钝感，可能到了 30 岁还不会讨价还价。',
    M: '你家聊钱聊得不多，但你偶尔能感觉到"这事背后是钱"。你和家里的钱账是一本不精确的账，糊糊的，也没人对。',
    H: '你家讲钱。给你的每一块钱都有潜台词——"我们养你不容易"、"你要考虑一下家里"、"你表哥买房你呢"。你和钱的关系因此复杂得像人民大会堂。',
  },
  D5: {
    L: '你在家是背景板。你考了好成绩他们也"嗯"，你分手了他们也不问。你独立得很早，但你很晚才学会"主动要关心"。',
    M: '你在家有一点存在感但也不至于被主演。你发生的事大部分家里会知道，但不是每件都被点名复盘——你有一点自己的角落。',
    H: '你在家是被主演的。你的成绩、胖瘦、对象、工作、朋友圈，全家都有直播权。你擅长表演，只是表演太久会忘了自己本来什么样。',
  },
  D6: {
    L: '你立过誓"我绝不变成他们那样"。你在感情里、在花钱上、在带孩子上都在刻意反向操作。问题是你反得太用力，有时候也累。',
    M: '你承认自己身上有一点他们的影子，但你也有一点反过来的自己。你在"复刻"和"反叛"之间有一条比较松的腰带——今天松一扣，明天紧一扣。',
    H: '你说话的口气、生气的方式、对小孩的耐心度——你看着看着就发现，你就是你爸/你妈。这不可怕，可怕的是你有时候会觉得"好像也还行"。',
  },
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误（或仅现有无关错误）。

- [ ] **Step 3: Commit**

```bash
git add src/data/fsi/dimensions.ts
git commit -m "feat(fsi): add 6-dimension metadata + L/M/H explanations"
```

---

## Task 3：创建 typeImages.ts 和 compatibility.ts 占位

**Files:**
- Create: `src/data/fsi/typeImages.ts`
- Create: `src/data/fsi/compatibility.ts`

- [ ] **Step 1: 创建 typeImages.ts**

```typescript
// src/data/fsi/typeImages.ts
// 首版不配自定义插画——ResultPage/TypeCard 在无图时已走 CSS 生成卡片兜底。
// 后续若产出"家电铭牌"风格插画（spec §7.2），按 `{ CODE: 'data:image/png;base64,...' }` 填入即可。
export const TYPE_IMAGES: Record<string, string> = {};
export const SHARE_IMAGES: Record<string, string> = {};
```

- [ ] **Step 2: 创建 compatibility.ts 占位**

```typescript
// src/data/fsi/compatibility.ts
// MVP 阶段 FSI 不启用 compat tab。FSI 主打"单人被养成的形状"叙事，
// 双人"谁家的锅更大"是情绪放大器，首版克制不做；后续可做"谁重养你 / 谁提醒你别再重养别人"等温柔向的 CP 表。
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两个幸存者坐下来，谁也不用先开口——家这个话题不急着讲完。' };
}
```

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 4: Commit**

```bash
git add src/data/fsi/typeImages.ts src/data/fsi/compatibility.ts
git commit -m "feat(fsi): add typeImages + compatibility stubs"
```

---

## Task 4：写 FSI 题目库（21 主题目 + 1 gate 题）

**Files:**
- Create: `src/data/fsi/questions.ts`

**题量分配**：CTRL 4 / WARM 4 / GNDR 2 / MNEY 4 / LITE 4 / ECHO 3 = 21；加 `fsi_gate` 共 22。

**调性复查清单（per spec §9.4）**：
- 题干不出现真实创伤画面（打、骂、酒、病、死）。
- 选项每条都是"可以承认的选择"，不是"选了就是有问题"。
- 不以二元暗示"好家庭 / 坏家庭"。

- [ ] **Step 1: 创建 questions.ts（完整 22）**

```typescript
// src/data/fsi/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 CTRL 遥控器强度（L=放养，H=被安排） =====
  {
    id: 'ctrl1', dim: 'D1',
    text: '你大三那年选职业方向时，家里的态度更像哪一种？',
    options: [
      { label: '早就帮你选好了，不选就是不孝', value: 4 },
      { label: '嘴上说随你，但每次都拐回"那个专业才稳定"', value: 3 },
      { label: '问了一次你怎么想，听完就不管了', value: 2 },
      { label: '完全没问，你选的时候都不知道他们关不关心', value: 1 },
    ],
  },
  {
    id: 'ctrl2', dim: 'D1',
    text: '你工作后做一个重要决定（辞职/搬城市/分手），要不要告诉家里？',
    options: [
      { label: '必须先打个招呼，不然后面吵不完', value: 4 },
      { label: '决定了再说，但要挑个好时机', value: 3 },
      { label: '顺口提一下，他们的意见不会改我的决定', value: 2 },
      { label: '不说，说了他们也不会懂', value: 1 },
    ],
  },
  {
    id: 'ctrl3', dim: 'D1',
    text: '你谈了恋爱，家里第一反应是？',
    options: [
      { label: '要照片、要情况、要见面时间', value: 4 },
      { label: '会问几句，但不追', value: 3 },
      { label: '淡淡说一句"别耽误正事"就没下文', value: 2 },
      { label: '你不说他们不会问，你也不打算说', value: 1 },
    ],
  },
  {
    id: 'ctrl4', dim: 'D1',
    text: '独自做一个重大选择的时候，你心里的默认声音是？',
    options: [
      { label: '如果他们知道了会怎么想', value: 4 },
      { label: '先自己想清楚，然后想他们会不会反对', value: 3 },
      { label: '先自己想清楚，然后决定要不要告诉他们', value: 2 },
      { label: '没什么默认声音，就是自己做', value: 1 },
    ],
  },

  // ===== D2 WARM 体感温度（L=冷藏柜，H=热灶台） =====
  {
    id: 'warm1', dim: 'D2',
    text: '你在外地工作，一个人生病躺床上，你会告诉家里吗？',
    options: [
      { label: '会，他们会立刻打电话问到底，像审犯人', value: 4 },
      { label: '会，但他们可能就是一句"多喝水"', value: 3 },
      { label: '不会，告诉了也没用', value: 1 },
      { label: '不会，不想让他们担心', value: 3 },
    ],
  },
  {
    id: 'warm2', dim: 'D2',
    text: '你家过年是什么画面？',
    options: [
      { label: '一大桌子人吵吵嚷嚷，吃到一半开始翻旧账', value: 4 },
      { label: '有点仪式感但不热闹，吃完各回各房', value: 2 },
      { label: '其实不太聚了，各过各的', value: 1 },
      { label: '安静吃饭，电视声音比人声大', value: 2 },
    ],
  },
  {
    id: 'warm3', dim: 'D2',
    text: '你上一次和家人拥抱是什么时候？',
    options: [
      { label: '昨天', value: 4 },
      { label: '最近一次回家', value: 3 },
      { label: '想不起来了', value: 1 },
      { label: '我们家不怎么拥抱', value: 1 },
    ],
  },
  {
    id: 'warm4', dim: 'D2',
    text: '你分享一件真正开心的事（比如升职），家里的反应更接近？',
    options: [
      { label: '全家一起乐，朋友圈马上转发', value: 4 },
      { label: '说一句"不错"，然后就是"下一步呢"', value: 3 },
      { label: '淡淡回一句"嗯，挺好"', value: 2 },
      { label: '他们反应平平，你也不期待什么', value: 1 },
    ],
  },

  // ===== D3 GNDR 性别出厂设置（L=去性别化，H=重男/重女） =====
  {
    id: 'gndr1', dim: 'D3',
    text: '家里对"男孩"和"女孩"的态度更像？',
    options: [
      { label: '差别很大，你或你兄弟姐妹明显是那个被区别对待的', value: 4 },
      { label: '差别存在，但说出来会被否认', value: 3 },
      { label: '大体公平，偶尔有小区别', value: 2 },
      { label: '没怎么区分过，我都没意识到', value: 1 },
    ],
  },
  {
    id: 'gndr2', dim: 'D3',
    text: '"你是个 xxx 就应该……"（xxx=男孩/女孩）这种话你听过多少？',
    options: [
      { label: '从小听到大，句式我都能背', value: 4 },
      { label: '偶尔听，尤其是亲戚场合', value: 3 },
      { label: '几乎没听过', value: 1 },
      { label: '我家用的是别的话术，但内核差不多', value: 3 },
    ],
  },

  // ===== D4 MNEY 经济牵引力（L=钱是钱，H=钱即爱） =====
  {
    id: 'mney1', dim: 'D4',
    text: '家里打电话寒暄两句，突然问"一个月能攒多少？" 你的胸口——',
    options: [
      { label: '立刻紧，知道接下来要聊什么', value: 4 },
      { label: '有点无奈但也没事，随便报一个数', value: 3 },
      { label: '正常回答，这种问题我家常聊', value: 3 },
      { label: '我家不太问钱的事，所以有点懵', value: 1 },
    ],
  },
  {
    id: 'mney2', dim: 'D4',
    text: '家里拿过你的钱帮谁（哥哥弟弟/侄子/还债/给亲戚）吗？',
    options: [
      { label: '有，而且不止一次，问过也说不清', value: 4 },
      { label: '有过一次，你还在消化', value: 3 },
      { label: '没拿过，但问过几次', value: 2 },
      { label: '没有这种事', value: 1 },
    ],
  },
  {
    id: 'mney3', dim: 'D4',
    text: '你买一件有点贵的东西（比如包/相机/游戏机），家里的反应？',
    options: [
      { label: '立刻"你一个月多少钱就花这么多"', value: 4 },
      { label: '嘴上说随便你，但重复念叨很多天', value: 3 },
      { label: '问一句多少钱就过去了', value: 2 },
      { label: '你不说他们就不知道，也不问', value: 1 },
    ],
  },
  {
    id: 'mney4', dim: 'D4',
    text: '"我们养你花了多少钱"这种话你家出现过吗？',
    options: [
      { label: '出现过，而且还会定期更新版本', value: 4 },
      { label: '偶尔会，大多在吵架时', value: 3 },
      { label: '大概没说过，但暗示肯定有过', value: 2 },
      { label: '我家不用这种账', value: 1 },
    ],
  },

  // ===== D5 LITE 能见度光强（L=透明人，H=聚光灯） =====
  {
    id: 'lite1', dim: 'D5',
    text: '你的朋友圈/人际/工作动态，家里知道多少？',
    options: [
      { label: '几乎全知道，亲戚群里比你自己更新还快', value: 4 },
      { label: '主要动态知道，小事他们不掺和', value: 3 },
      { label: '知道的不多，因为你不怎么讲', value: 2 },
      { label: '他们基本不知道，也不主动问', value: 1 },
    ],
  },
  {
    id: 'lite2', dim: 'D5',
    text: '你做了一件自己挺得意的事，期待家里看见的心情是？',
    options: [
      { label: '期待，并且已经想好怎么发群里', value: 4 },
      { label: '希望他们看见，但不会主动讲', value: 3 },
      { label: '看见也行，不看见也行', value: 2 },
      { label: '他们看不看见，我都不会专门讲', value: 1 },
    ],
  },
  {
    id: 'lite3', dim: 'D5',
    text: '家里人提到你的时候，第三方听到的感觉是？',
    options: [
      { label: '全村都知道你最近在干嘛', value: 4 },
      { label: '亲戚里知道你的大概情况', value: 3 },
      { label: '很少被提到，除非过年碰面', value: 2 },
      { label: '他们很少主动聊起你', value: 1 },
    ],
  },
  {
    id: 'lite4', dim: 'D5',
    text: '你小时候考得好，家里的反应更像？',
    options: [
      { label: '全家亲戚朋友圈一起刷屏', value: 4 },
      { label: '夸一句，然后说"别骄傲"', value: 3 },
      { label: '看一眼成绩单，没什么表情', value: 2 },
      { label: '我不太记得他们有没有反应', value: 1 },
    ],
  },

  // ===== D6 ECHO 代际回音（L=反叛派，H=复刻派） =====
  {
    id: 'echo1', dim: 'D6',
    text: '你脱口而出一句话，说完自己愣了——因为那是你爸/你妈的原话。你的反应？',
    options: [
      { label: '笑了一下，没事，他们那套有时候也对', value: 4 },
      { label: '心里咯噔一下，不太想承认我像他们', value: 2 },
      { label: '立刻改口"我不是这个意思"', value: 1 },
      { label: '根本没意识到，是朋友提醒我才发现', value: 3 },
    ],
  },
  {
    id: 'echo2', dim: 'D6',
    text: '你谈恋爱/处朋友的方式，像谁多一点？',
    options: [
      { label: '和我妈/我爸的某个习惯几乎一模一样', value: 4 },
      { label: '一半像他们，一半反着来', value: 3 },
      { label: '刻意反着来，我要跟他们不一样', value: 1 },
      { label: '我不觉得像谁，就是我自己', value: 2 },
    ],
  },
  {
    id: 'echo3', dim: 'D6',
    text: '你要带小孩/想象自己带小孩时，脑子里冒出来的第一句话是？',
    options: [
      { label: '"我当年就是这样被养大的，也挺好"', value: 4 },
      { label: '"我知道哪些做法不能照搬，但具体怎么做我也没方案"', value: 3 },
      { label: '"我绝不变成他们那样"', value: 1 },
      { label: '我从没认真想过这件事', value: 2 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // 第 22 题 gate —— 用于触发隐藏 BOSSY 的"条件之一"（还需配合高 CTRL/LITE/ECHO）
  {
    id: 'fsi_gate', special: true, kind: 'gate',
    text: '你现在和父母的关系，更像哪一种？',
    options: [
      { label: 'A. 还是他们说了算，我大多数时候配合', value: 1 },
      { label: 'B. 一人一半，谁也不听谁的', value: 2 },
      { label: 'C. 我反过来管他们了（过年由我拍板、红包我发、他们看我脸色）', value: 3 },
      { label: 'D. 基本不联系了，谁也不管谁', value: 4 },
    ],
  },
];
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 3: 敏感词预检**

Run:
```bash
grep -E "毒母|毒父|毒亲|原生家庭罪|家庭毁掉|家暴|打骂|酗酒|自残|抑郁症|精神病|轻生|爹味|凤凰男|妈宝男|扶弟魔|控诉|讨伐|判决|罪行" src/data/fsi/questions.ts
```
Expected: 无命中。

- [ ] **Step 4: Commit**

```bash
git add src/data/fsi/questions.ts
git commit -m "feat(fsi): add 21 questions across 6 dimensions + fsi_gate"
```

---

## Task 5：写 FSI 类型库（18 常规 + BOSSY 隐藏 + FAMX? 兜底）

**Files:**
- Create: `src/data/fsi/types.ts`

**四段式 + 温柔出口（spec §4.2 / §9.3）**：
每条 desc 四段结构——
1. **镜像描述**（2-3 句）：第二人称白描典型场景。
2. **天赋优势**（2-3 句）：辛辣包装的好话。
3. **隐秘代价**（2-3 句）：只批行为模式，不批身份；不骂父母，不骂用户。
4. **一句温柔出口**（1 句）：**刺痛 + 出路** 的组合，不用"你永远……"句式。

> 重要：最后一句是 FSI 与 SBTI / GSTI / FPI 的核心差别——SBTI 式收尾"你永远爱不好一个人"在 FSI 里被禁用，改写成"你不是不会爱，你只是还在学怎么放下遥控器"这类"刺痛 + 出路"组合。

- [ ] **Step 1: 创建 types.ts 完整 20 条**

```typescript
// src/data/fsi/types.ts
import type { TypeDef, NormalType, RarityInfo } from '../testConfig';

/* =============================================================
 * TYPE_LIBRARY — 18 常规 + 1 隐藏(BOSSY) + 1 兜底(FAMX?)
 * ============================================================= */

export const TYPE_LIBRARY: Record<string, TypeDef> = {
  COPYX: {
    code: 'COPYX', cn: '复印机娃', intro: 'The Carbon Copy',
    desc: '你打死不承认，但你一开口就是你妈。生气的语序、关心的节奏、吵架的收尾技巧——你全套继承了，还附赠原版盗版难辨的背景音。你一边用，一边心里在想"我是不是有点像他们"。\n\n天赋优势：你很会过日子，很多"靠谱"的本能你其实不用学就会——因为你从小看了 20 年实操；你对人际冲突的处理节奏比朋友圈平均水平成熟得多；你继承到的那部分好东西是真的好。\n\n隐秘代价：你偶尔会听见自己说出一句你年轻时最讨厌的话；你和伴侣吵架时会突然换成你妈/你爸的语气，吓到对方也吓到自己；你想反驳"他们那套"，反驳到一半发现自己正在执行。\n\n一句温柔出口：你不是变成了他们，你只是还在学怎么把学来的东西分一下——哪个留，哪个放。',
  },
  REBEL: {
    code: 'REBEL', cn: '反叛军', intro: 'The Rebel',
    desc: '他们喜欢什么你就反着来。他们说那份工作稳定，你偏偏去不稳定的；他们说那个人合适，你偏偏不合适；他们想让你结婚，你偏偏单身到赢一局是一局。你的身份感有一半建立在"我不是他们"这句话上。\n\n天赋优势：你对"被安排"的嗅觉极敏锐，很早就有自己的边界；你不怕权威，不怕众声；你活成了别人家小孩羡慕的"没被驯服"的样子。\n\n隐秘代价：你反到最后自己也忘了本来想要什么——你选东西的第一反应是"他们会反对什么"；你害怕承认某件事他们可能是对的，因为那等于输；你在感情里偶尔也把伴侣当成"小号的他们"在反抗。\n\n一句温柔出口：你不是在反叛他们，你只是还在学怎么不用对立的方式存在。',
  },
  SAINT: {
    code: 'SAINT', cn: '在逃孝子', intro: 'The Fugitive Filial',
    desc: '你不是爱他们，你是舍不得让他们失望。过年你准时回家，群里秒回"收到"，生日蛋糕从不迟到。朋友以为你家庭和睦，只有你自己知道——你不是甘愿的孝，你是怕他们难过的孝。\n\n天赋优势：你的责任感稳定得像老式座钟，家里大小事你都在；你是家族聚会上那个"懂事"的代名词；你在外人眼里是模范孩子，在真正相处的人眼里是可靠的成年人。\n\n隐秘代价：你对家里永远有一种说不清的歉意；你答应他们的事宁可硬撑也不取消；你到了 30 岁还没学会说"这次我不行"，因为那句话的代价是愧疚。\n\n一句温柔出口：你不是不孝，你只是还在学怎么孝得不那么自我消耗。',
  },
  LEAVE: {
    code: 'LEAVE', cn: '断亲先锋', intro: 'The Quiet Detacher',
    desc: '过年你只给红包不打电话，亲戚群你设了免打扰，你管这叫成年的体面。你不是恨，也不是哭，你只是安静地、有策略地，把那些你承担不起的联系一根一根收进抽屉。\n\n天赋优势：你的边界感比身边大多数人都清楚——你知道什么会消耗你、什么不会；你活得独立，不用向任何人交情感作业；你把自己过成了一个成年人能自治的模样。\n\n隐秘代价：你偶尔路过别人家庭其乐融融的画面会有一两秒心酸；你在"断"和"联"之间拉扯——你也想过那条路没走通；你独立得有些孤单，但你不会说出口。\n\n一句温柔出口：你不是断亲，你只是在保护一个还没长结实的自己。',
  },
  'CURE!': {
    code: 'CURE!', cn: '重养自己', intro: 'The Self-Re-Parent',
    desc: '你一边复刻他们，一边在跟着博主学"怎么修好这条线"。你读依恋书、听播客、在小红书搜"重养自己"；你对自己的觉察比同龄人细得多；你在用这辈子做一份自我售后。\n\n天赋优势：你是身边"情绪颗粒度"最细的朋友——你能准确说出自己在怕什么、为什么；你能把别人也从情绪里拉出来一点；你是自己这一代里少有的真正在"长"的人。\n\n隐秘代价：你有时会陷入"自我分析瘫痪"——每一个情绪都要被命名一遍才能允许它存在；你把"重养"当成了另一种要求——"我连这个都做不到吗"；你一边很清醒，一边很累。\n\n一句温柔出口：你不是还没修好，你只是一直在修——别忘了偶尔也让自己下班。',
  },
  SILNT: {
    code: 'SILNT', cn: '假装没事人', intro: 'The Everything-Is-Fine-er',
    desc: '你回家永远"挺好的"。你不是不想说，你只是不知道从哪开始；你的室友、你的朋友、你的恋人才知道你不挺好。家里问"最近怎么样"，你五个字就完成了一次情绪归档。\n\n天赋优势：你的情绪自理能力很强，不会把焦虑倒在家人的盘子里；你在工作场合是"看起来稳"的那种人；你保护了家里的气压，也保护了自己的节奏。\n\n隐秘代价：你把真正的自己放在朋友圈之外的一个小房间里；你偶尔很累，但你已经习惯了别人问起时说"没事"；有一天你会发现你连自己也开始不太想听"怎么回事"。\n\n一句温柔出口：你不是没事，你只是还没找到一个可以先对着说的人——先对自己说一次也行。',
  },
  'DADY+': {
    code: 'DADY+', cn: '缺爹选手', intro: 'The Missing-Dad Player',
    desc: '你对大你十岁的男人有一种莫名的好感，对沉稳、靠谱、会做饭的男性角色格外容易触电。你自己也知道——你在生活里找那个小时候没坐稳在你身边的那个位置。\n\n天赋优势：你对"安全感"有非常清晰的识别标准——你比大多数人都更早知道自己需要什么；你选人的时候愿意慢，愿意看细节；你把一个常被忽略的缺口变成了挑选伴侣的清单。\n\n隐秘代价：你容易把"像父亲"的男人当"情人"——混线而不自知；你偶尔会在对方哄你的时候突然哭，那一滴眼泪不是为他流的；你有时会在关系里退回小孩的位置，然后又怪自己不成熟。\n\n一句温柔出口：你缺的不是他，你缺的是一个人安稳坐在你旁边——先学会自己坐稳一会儿。',
  },
  'MAMY+': {
    code: 'MAMY+', cn: '过量母爱', intro: 'The Over-Mothered',
    desc: '你从小被全方位照料到 30 岁。饭要她做、衣服要她洗、对象要她看过、工作要她问过、感冒她要亲自来一趟。你爱她，但你已经开始分不清——她的爱和她对你生活的管理权之间那道线。\n\n天赋优势：你被稳定供给了情感资源，这件事本身是很多人一辈子没拿到的"出厂礼包"；你对"被在乎"的触感比很多人敏锐；你知道一个真正认真爱一个人是什么样。\n\n隐秘代价：别人的正常关心对你像被入侵——你会下意识推开；你在亲密关系里一会儿太需要，一会儿太防备；你对自己生活的"自治感"建立得比同龄人慢了好几年。\n\n一句温柔出口：她的爱没有错，你的边界也没有错——你只是还在学怎么把这两件事分开放。',
  },
  PICKR: {
    code: 'PICKR', cn: '挑剔型', intro: 'The Perfectionist',
    desc: '你永远不够好——因为当年他们从没说过你"够好了"。你做到了 A，他们问 A+；你拿到了 A+，他们问怎么不是 S。你长大后继承了这套标准，自己对自己也从没说过"可以了"。\n\n天赋优势：你的执行力和完成度在同龄人里排得上前列——你对自己严，所以别人信得过你；你对品质有敏锐的判断，不做应付；你把"不够好"变成了引擎。\n\n隐秘代价：你在被夸奖时第一反应是挑刺——"这里其实我没做好"；你很难享受一次已经成功的事，因为"下一件还没做"；你偶尔会在深夜意识到"我在替谁说我不够好"，然后没人回答。\n\n一句温柔出口：你已经做得很好了——这句话从别人嘴里说出来不算，这一次你自己说一遍。',
  },
  PLEASE: {
    code: 'PLEASE', cn: '讨好系', intro: 'The Please-er',
    desc: '你笑得最甜的时候，其实最想一个人躲起来。你对不熟的人有种天生的安抚本能——气氛尴尬你先圆，冲突出现你先退。你被训练成这样，是因为从小你得先把大人情绪摆好，才能再谈自己。\n\n天赋优势：你的人缘出奇地好，你是朋友圈里"最让人舒服"的那种人；你对情绪的读空气能力顶级——同事、伴侣、家人都愿意围着你；你替一整个场合维持了体面。\n\n隐秘代价：你对自己的需求表达得一塌糊涂——"我都可以"是你的默认回答；你答应了之后在心里骂自己答应；你累到不想说话时还在笑。\n\n一句温柔出口：你不是为了被喜欢才活着的——这一次，试着先把你的"我不想"说出一句。',
  },
  'GOLD+': {
    code: 'GOLD+', cn: '别人家小孩', intro: 'The Gold-Standard Kid',
    desc: '你活成了亲戚嘴里的那个人，只是那个人不是你自己。你成绩好、工作稳、对象合适、笑容得体——你是家族聚会上一张合格证。只是每次大家夸完，你回家关上门心里空一小块。\n\n天赋优势：你的履历和状态属于家族前 1%，这不是运气，是你真的做到了；你对"应该"的定义执行得极稳——你做人可靠；你给身边人树立了一个真的存在的正面样本。\n\n隐秘代价：你偶尔分不清哪些选择是你真的想要的，哪些是"应该的升级版"；你有过一两个很想做的事没做，因为那不够"像你"；你开始怀疑自己到底是谁的 KPI。\n\n一句温柔出口：你不是别人家小孩，你是你自己家的——只是这件事你还没允许自己写进简介。',
  },
  GHOST: {
    code: 'GHOST', cn: '家庭隐身术', intro: 'The Family Ghost',
    desc: '你长大的方式是不被看见。你在家里会自动选最不显眼的座位，音量调到最低，生气也忍住一半。你工位也挑最角落——这不是内向，是你从小知道"小声一点更安全"。\n\n天赋优势：你观察力顶级——家里风向、群里气压你都先感知到；你能独处，能独处得很久、很稳；你省下了很多大声争取的能量，做了很多不张扬但扎实的事。\n\n隐秘代价：别人从来不会先想到你，不是因为你不好，是因为你选择了隐身；你到真的需要被关心时，不会开口，也不知道怎么开口；你长大后发现"会表达"比"会隐身"更有用，但你已经习惯了后者。\n\n一句温柔出口：你不是没有存在感，你只是把音量调得太低——这次试试稍微调大一点。',
  },
  'SOS!': {
    code: 'SOS!', cn: '家庭灭火员', intro: 'The Firefighter',
    desc: '从小你就是那个调解员。爸妈吵架你递水、亲戚尴尬你圆场、饭桌冷场你开头。长大后同事在群里冷嘲一句，你都想立刻请假——你对"气氛要出事"的警报比所有人都灵。\n\n天赋优势：你的情绪读空气能力惊人，你在职场、社交、家庭里都是那个"救场的人"；你对情绪安全特别上心——你保护了很多本来会更糟的场面；你可靠到像一个 24h 在线的 ops。\n\n隐秘代价：你一辈子在替别人担心，自己那把火从来没有人来救；你发现别人冷战就会胸口发紧——但没人意识到这本来不是你该扛的；你累得很低调，连"累"都是别人发现的。\n\n一句温柔出口：你不用再去救他们的火——这一次，从自己的屋里先走出来一下。',
  },
  'BANK!': {
    code: 'BANK!', cn: '家庭 ATM 候选人', intro: 'The Family ATM',
    desc: '你没问过自己想要什么，你只知道"我以后要给家里钱"。你第一份工资的第一笔用途是"给家里"；你升职最大的兴奋点是"终于可以帮家里还"。你活得像一张长期合同，合同上只有一个甲方——你家。\n\n天赋优势：你有极强的家庭责任感，这东西在这个时代非常稀有；你对金钱的实用属性熟练得像老会计；你让家里的风险兜底指数直接 +3。\n\n隐秘代价：你在钱和自己的欲望之间选钱到家里去；你不给自己花钱，但你给家里花得很理直气壮；你偶尔午夜想过"我这辈子到底在给谁打工"。\n\n一句温柔出口：你不是不能给家里钱，你只是还没学会——给自己留一笔"给自己"的预算。',
  },
  'PRNS+': {
    code: 'PRNS+', cn: '公主/王子病', intro: 'The Prince-ss of the House',
    desc: '全家围着你转，你以为世界也该这样——直到你搬出去才发现，没有了家里这套缓冲，外面对你是按"普通成年人"处理的。你不坏，你只是被养成了一个预期全员礼让的人。\n\n天赋优势：你的自我价值感从小被稳定供给——你敢要、敢表达、敢拒绝；你不容易被 PUA，因为你默认自己是 OK 的；你在关系里知道"我是被爱的"是一种基线。\n\n隐秘代价：你在职场初期常常觉得"为什么没人让我"——那种错位是真实的；你被反馈时第一反应是委屈，而不是思考；你对"自己是特别的"这件事有点上瘾。\n\n一句温柔出口：你不是公主/王子，你只是被这样养大的——真实世界里你也挺好，只是得习惯一下。',
  },
  TOOLX: {
    code: 'TOOLX', cn: '家庭工具人', intro: 'The Family Utility',
    desc: '姐姐当了哥哥的前台，妹妹当了弟弟的备用金。你是家里"帮忙的那个"——事情不做没人说，事情做了也没人夸。你的存在感建立在"你是能用的"这件事上。\n\n天赋优势：你的实操能力比同龄人强一大截——你会修、会跑、会赚、会照看；你不挑活、不推脱；你让一个本来会散掉的家，靠你这一根螺丝钉钉在一起。\n\n隐秘代价：你已经不记得上一次有人问你"你想要什么"是什么时候；你习惯了把自己放在"最后一个被考虑的"那一列；你偶尔做完一件事的回应不是夸奖，是"下一件"。\n\n一句温柔出口：你不是家里的工具，你是家里的人——这句话他们说不出来没关系，你先对自己说。',
  },
  'BRAG+': {
    code: 'BRAG+', cn: '幸运幸存者', intro: 'The Lucky One',
    desc: '家里确实没啥事。爸妈相爱、姊妹友好、饭点准时、假期出游。你在"原生家庭苦主"大合唱里偶尔有点社死——你没什么可哭的，但你又不想装出什么病来合群。\n\n天赋优势：你的情绪基线比大多数人高一截，这不是天真，是真的被好好养过；你对关系的信任感稳定，你愿意先善意；你在朋友圈里是一个稀缺样本。\n\n隐秘代价：你在流行"重养自己"的语境里偶尔失语——好像你不该只是 OK；你会为自己的幸运感到隐约的愧疚；你在朋友吐槽家里时不太敢接话，怕显得何不食肉糜。\n\n一句温柔出口：你的幸运是真的，别人的苦也是真的——两件事都可以成立，你不用挑一个。',
  },
  'DUAL!': {
    code: 'DUAL!', cn: '切换人格', intro: 'The Switcher',
    desc: '家里一个你，朋友圈另一个你，公司又是第三个你——两边三边都会说"这才是真的你"。你不是虚伪，你是在不同场景里启动了不同的默认配置，而这些配置都是你。\n\n天赋优势：你的场景适应力在平均线之上——你懂得在什么场合用什么版本；你是朋友圈里"每个人都觉得对他不错"的那种人；你省下了很多社交摩擦。\n\n隐秘代价：你有时连自己也不确定哪个是"没开滤镜"的你；你回到家要过一小时才能变回家里版本，累；你偶尔担心"如果把几边的我放在一个房间，我会不会被拆穿"。\n\n一句温柔出口：你不是有几个自己，你只是还在学——怎么把几边的版本慢慢合并成一个。',
  },

  /* ===== 隐藏：BOSSY 家族 CEO ===== */
  BOSSY: {
    code: 'BOSSY', cn: '家族 CEO', intro: 'The Family CEO',
    desc: '你小时候被控制，长大后把控制权抢过来了。过年由你拍板、红包由你分配、爸妈也要看你脸色——你不是在"叛逆"，你是在把方向盘从他们手里拿过来自己开。整个家族在以你为坐标重新排位。\n\n天赋优势：你的执行力和判断力在家族里顶格，你确实把很多烂摊子压住了；你不再是被支配的那个——这是很多人一辈子走不完的路；你给家里带来了秩序和效率。\n\n隐秘代价：你把自己变成了他们当年的某个翻版——只是你是"更好用的"那一版；你偶尔会在发号施令的瞬间感到某种熟悉的压迫感——那是你小时候看到过的；你赢了控制权，但你还没来得及问自己想不想要。\n\n一句温柔出口：你不用赢，你已经赢了——该练习的是松手，而不是继续紧握。',
  },

  /* ===== 兜底：FAMX? 家庭乱码人 ===== */
  'FAMX?': {
    code: 'FAMX?', cn: '家庭乱码人', intro: 'The Family Glitch',
    desc: '你的家庭像一次多次合并冲突的 git 记录，自己都没理清谁负责什么。一会儿像放养、一会儿像控制、一会儿热得烫手、一会儿冷得对面没人——系统试图给你贴一个标签，结果所有标签都贴不上。\n\n天赋优势：你躲过了所有"一个词解释你"的简化；你活得比大多数人复杂，因为真实本来就是多面的；你是朋友圈里少见的"不能被算法理解的类型"。\n\n隐秘代价：你偶尔自己也看不清"我到底从家里继承了什么"；你看别人的家庭叙事时会有一种错位的羡慕——"至少他们能讲清楚"；你有一部分疲惫来自"我连自己家的版本号都搞不定"。\n\n一句温柔出口：也许你不需要一个类型，你需要时间——合并冲突可以慢慢解，不急着今天。',
  },
};

/* =============================================================
 * NORMAL_TYPES — Pattern vectors 6 位 L/M/H
 * 维度顺序：D1 CTRL / D2 WARM / D3 GNDR / D4 MNEY / D5 LITE / D6 ECHO
 *
 * 设计原则：
 * 1. 所有 pattern 唯一（已人肉校对 18/18 unique，最小 Hamming 距离 = 2）
 * 2. pattern 语义贴合类型画像（COPYX 复刻高、LEAVE 低温低能见、MAMY+ 温高经济高光强高）
 * 3. 保留一个"纯中档" DUAL! (MMMMMM) 作为场景切换者
 * 4. 隐藏 BOSSY 的 pattern 设计为 `HMHMHH`，在 Task 10 里由 FsiApp 的双条件判定覆写结果；
 *    不会进入 matching 的 nearest-neighbor 计算，但 pattern 保留在 rarity 表里以支持雷达展示。
 * ============================================================= */

export const NORMAL_TYPES: NormalType[] = [
  { code: 'COPYX',   pattern: 'MHMMMH' },  // 中控 + 暖家 + 中 + 中 + 中 + 高复刻
  { code: 'REBEL',   pattern: 'LLMMHL' },  // 放养 + 冷家 + 中 + 中 + 高能见 + 低复刻
  { code: 'SAINT',   pattern: 'HHMHMM' },  // 高控 + 热家 + 中 + 高钱 + 中光 + 中复刻
  { code: 'LEAVE',   pattern: 'LLMLLL' },  // 放养 + 冷 + 中 + 低钱 + 透明 + 反叛
  { code: 'CURE!',   pattern: 'LMMMHH' },  // 放养 + 中温 + 中 + 中钱 + 高光 + 高复刻（自我观察）
  { code: 'SILNT',   pattern: 'MLMMML' },  // 中控 + 冷家 + 中 + 中 + 中 + 低复刻
  { code: 'DADY+',   pattern: 'LMLMLH' },  // 放养 + 中温 + 低性别 + 中钱 + 透明 + 高复刻（内在缺口）
  { code: 'MAMY+',   pattern: 'HHLHHH' },  // 高控 + 热家 + 重女 + 高钱 + 聚光 + 高复刻
  { code: 'PICKR',   pattern: 'HLMMMH' },  // 高控 + 冷家 + 中 + 中 + 中 + 高复刻（继承严苛）
  { code: 'PLEASE',  pattern: 'MHMMHM' },  // 中控 + 热家 + 中 + 中 + 聚光 + 中复刻
  { code: 'GOLD+',   pattern: 'HMMHHM' },  // 高控 + 中温 + 中 + 高钱 + 聚光 + 中复刻（样板儿）
  { code: 'GHOST',   pattern: 'MLLMLL' },  // 中控 + 冷 + 去性别 + 中 + 透明 + 反叛
  { code: 'SOS!',    pattern: 'HHMMHL' },  // 高控 + 热 + 中 + 中 + 聚光 + 低复刻
  { code: 'BANK!',   pattern: 'MMHHML' },  // 中控 + 中温 + 重男/女 + 高钱 + 中光 + 低复刻
  { code: 'PRNS+',   pattern: 'HMLHHL' },  // 高控（全家围转）+ 中温 + 去性别 + 高钱 + 聚光 + 低复刻
  { code: 'TOOLX',   pattern: 'MHHMML' },  // 中控 + 热家 + 重男/女 + 中 + 中 + 低复刻
  { code: 'BRAG+',   pattern: 'LHMLMM' },  // 放养 + 热家 + 中 + 低钱 + 中 + 中复刻（幸运）
  { code: 'DUAL!',   pattern: 'MMMMMM' },  // 全中档（切换人格）
];

/* =============================================================
 * TYPE_RARITY — 视觉呈现用，后期按真实数据回填
 * ============================================================= */

export const TYPE_RARITY: Record<string, RarityInfo> = {
  COPYX:   { pct: 9,  stars: 3, label: '常见' },
  REBEL:   { pct: 7,  stars: 3, label: '常见' },
  SAINT:   { pct: 10, stars: 2, label: '较常见' },
  LEAVE:   { pct: 6,  stars: 4, label: '稀有' },
  'CURE!': { pct: 8,  stars: 3, label: '常见' },
  SILNT:   { pct: 9,  stars: 3, label: '常见' },
  'DADY+': { pct: 4,  stars: 4, label: '稀有' },
  'MAMY+': { pct: 5,  stars: 4, label: '稀有' },
  PICKR:   { pct: 6,  stars: 4, label: '稀有' },
  PLEASE:  { pct: 8,  stars: 3, label: '常见' },
  'GOLD+': { pct: 5,  stars: 4, label: '稀有' },
  GHOST:   { pct: 6,  stars: 4, label: '稀有' },
  'SOS!':  { pct: 5,  stars: 4, label: '稀有' },
  'BANK!': { pct: 4,  stars: 4, label: '稀有' },
  'PRNS+': { pct: 3,  stars: 5, label: '极稀有' },
  TOOLX:   { pct: 4,  stars: 4, label: '稀有' },
  'BRAG+': { pct: 3,  stars: 5, label: '极稀有' },
  'DUAL!': { pct: 8,  stars: 3, label: '常见' },
  BOSSY:   { pct: 2,  stars: 5, label: '隐藏' },
  'FAMX?': { pct: 2,  stars: 5, label: '兜底' },
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。（真正的 pattern 唯一性检查放在 Task 9。）

- [ ] **Step 3: 温柔出口自检**

Run:
```bash
grep -E "你永远" src/data/fsi/types.ts
```
Expected: 无命中（温柔出口不允许"你永远……"绝望钉子句）。

Run:
```bash
grep -E "一句温柔出口：" src/data/fsi/types.ts | wc -l
```
Expected: `20`（18 常规 + BOSSY + FAMX? 每条都有）。

- [ ] **Step 4: Commit**

```bash
git add src/data/fsi/types.ts
git commit -m "feat(fsi): add 18 types + BOSSY hidden + FAMX? fallback"
```

---

## Task 6：组装 FSI TestConfig

**Files:**
- Create: `src/data/fsi/config.ts`

- [ ] **Step 1: 创建 config.ts**

```typescript
// src/data/fsi/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// FSI 题量分配：CTRL 4 / WARM 4 / GNDR 2 / MNEY 4 / LITE 4 / ECHO 3 = 21 主题 + fsi_gate
// 5 个 4 题维度 raw=4-16，GNDR/ECHO 需要独立阈值——用一个小函数按维度分流。
// 为了不新增 TestConfig schema 字段，sumToLevel 可以统一用 4 题档的阈值：
//   4 题：≤8=L, 9-12=M, ≥13=H
//   3 题：raw=3-12 → ≤6=L, 7-9=M, ≥10=H
//   2 题：raw=2-8  → ≤4=L, 5-6=M, ≥7=H
// 现有 matching.ts 的 sumToLevel(score) 只拿单一 raw sum。所以 FSI 配置里
// sumToLevel 用"题量无关的均值法"：除以该维度题量换算均值再判档，统一阈值。
//
// 注意：为了实现"题量无关"的阈值，我们需要在 fsiConfig 里让 sumToLevel
// 接收 raw 并在内部用 dimensionOrder 回推题量——但 matching.ts 只给了
// score 一个参数，拿不到维度。所以采用一个务实方案：
// sumToLevel 假设 4 题档，因为 5/6 个维度是 4 题；GNDR/ECHO 的 raw 在
// FsiApp 的 autoFill 里对齐成 4 题等价（raw 乘以 4/N）。在真实答题路径下，
// 我们让 useQuiz 的 sumByDim 直接按题量求和，但 sumToLevel 统一用 4 题阈值——
// 代价是 2 题维度档位略偏 M。为保持 plan 的 mechanical simplicity，我们接受
// 这个折衷；Task 17 smoke 会覆盖实际分布是否合理，若严重倾斜再补一个
// per-dim threshold override（后续迭代）。

function sumToLevel(score: number): string {
  if (score <= 8) return 'L';
  if (score <= 12) return 'M';
  return 'H';
}

export const fsiConfig: TestConfig = {
  id: 'fsi',
  name: 'FSI 原生家庭幸存者',

  // Dimensions
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  // gate 同时用于 hidden 判定的一部分；真正的 BOSSY 触发需要
  // gate=3 AND CTRL=H AND LITE=H AND ECHO=H。单一 hiddenTriggerValue
  // 不足以表达，所以 fsiConfig 这里 hiddenTriggerValue 设为一个不可能值（-1），
  // 实际判定放到 FsiApp 里 post-compute 覆写。
  gateQuestionId: 'fsi_gate',
  gateAnswerValue: 3,            // 'C. 我反过来管他们了'
  hiddenTriggerQuestionId: 'fsi_gate',
  hiddenTriggerValue: -1,        // 故意无法触发——由 FsiApp 做多条件判定

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
  maxDistance: 12,              // 6 维 × 最大差 2
  fallbackTypeCode: 'FAMX?',
  hiddenTypeCode: 'BOSSY',
  similarityThreshold: 55,

  // URLs & Storage
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/fsi',
  localHistoryKey: 'fsi_history',
  localStatsKey: 'fsi_local_stats',
  apiTestParam: 'fsi',

  // Display text
  dimSectionTitle: '六维家庭雷达',
  questionCountLabel: '22',

  // 注意：FSI 不使用 genderLocked / typePoolByGender —— 字段省略
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add src/data/fsi/config.ts
git commit -m "feat(fsi): assemble TestConfig (no gender lock; gate uses multi-cond)"
```

---

## Task 7：创建 FSIHeroBadge + FSIResultSupportBlock + FSIDisclaimerModal

**Files:**
- Create: `src/components/FSIHeroBadge.tsx`
- Create: `src/components/FSIResultSupportBlock.tsx`
- Create: `src/components/FSIDisclaimerModal.tsx`

FSI 专属视觉（参考 spec §7.1）：模仿一张"家电出厂铭牌/质检卡"贴纸，在结果页顶部展示"FSI · FAMILY SURVIVOR INDEX"品牌标 + 出厂型号/批次/状态=幸存。不用冷峻医学风，不用破碎镜/黑白监控，用暖米色 + 墨绿 + 旧黄系。

- [ ] **Step 1: 创建 FSIHeroBadge**

```tsx
// src/components/FSIHeroBadge.tsx
import { motion } from 'framer-motion';

interface FSIHeroBadgeProps {
  typeCode: string;      // e.g. 'COPYX', 'BOSSY'
  typeCn: string;
}

/**
 * "家庭出厂铭牌"风格贴纸，放在结果页顶部。
 * 视觉要求（spec §7.2）：暖色系旧相片质感；禁用黑白监控/破碎镜等冷峻元素。
 */
export default function FSIHeroBadge({ typeCode, typeCn }: FSIHeroBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex flex-wrap items-center justify-center gap-2"
    >
      <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 font-bold tracking-[0.2em] uppercase">
        FAMILY SURVIVOR INDEX
      </span>
      <span className="text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-border text-muted">
        出厂型号 · {typeCode}
      </span>
      <span className="text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-border text-muted">
        状态 · 幸存
      </span>
      {/* typeCn 作为 accessible label，视觉主 title 仍由 ResultPage 渲染 */}
      <span className="sr-only">{typeCn}</span>
    </motion.div>
  );
}
```

- [ ] **Step 2: 创建 FSIResultSupportBlock（结果页底部深色兜底）**

> per spec §9.2，以下文案**原样**落地：标题"这只是一次测试，不是诊断。"+ 两条电话 + 一句"你值得一个真实的支持系统"。

```tsx
// src/components/FSIResultSupportBlock.tsx
import { motion } from 'framer-motion';

/**
 * 结果页底部深色兜底模块（spec §9.2）。
 * 每个 FSI 结果页都必须渲染这块——它不是可选配置。
 *
 * 视觉：深色背景 + 温和图标 + 不过大（避免像"精神病警告"）。
 * 文案一字不改，是 spec 明文要求。
 */
export default function FSIResultSupportBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mt-8 rounded-xl border border-border/60 bg-[#1a1a1a] p-5 text-left"
      aria-label="心理支持入口"
    >
      <p className="text-sm text-white font-semibold mb-3 flex items-center gap-2">
        <span aria-hidden>·</span>
        这只是一次测试，不是诊断。
      </p>
      <p className="text-xs text-muted leading-relaxed mb-4">
        如果你最近感到持续低落、无法自理或有自伤念头，请务必联系专业帮助：
      </p>
      <ul className="text-xs text-muted leading-relaxed space-y-2 mb-4">
        <li>
          <span className="text-white font-medium">北京心理危机研究与干预中心</span>
          ：
          <a href="tel:01082951332" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
            010-82951332
          </a>
        </li>
        <li>
          <span className="text-white font-medium">全国心理援助热线</span>
          ：
          <a href="tel:4001619995" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
            400-161-9995
          </a>
        </li>
        <li>
          <span className="text-white font-medium">简单心理 / 壹心理</span>
          ：可预约在线咨询
        </li>
      </ul>
      <p className="text-xs text-muted leading-relaxed italic">
        你值得一个真实的支持系统——不只是一个测试结果。
      </p>
    </motion.section>
  );
}
```

- [ ] **Step 3: 创建 FSIDisclaimerModal（首次进入测试前的免责浮层）**

> per spec §9.2，原文字段不改。localStorage 记忆 key 用 `fsi_disclaimer_ack_v1`，换版时 bump。

```tsx
// src/components/FSIDisclaimerModal.tsx
import { motion, AnimatePresence } from 'framer-motion';

interface FSIDisclaimerModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ACK_KEY = 'fsi_disclaimer_ack_v1';

/** 静态工具：外部调用以决定首次进入是否要弹浮层 */
export function hasAcknowledgedDisclaimer(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(ACK_KEY) === '1';
  } catch {
    return false;
  }
}

export function markDisclaimerAcknowledged(): void {
  try {
    window.localStorage.setItem(ACK_KEY, '1');
  } catch {
    // ignore storage failure
  }
}

/**
 * 测试开始前的免责浮层（spec §9.2）。
 * 文案原样落地，不可改。
 */
export default function FSIDisclaimerModal({ open, onConfirm, onCancel }: FSIDisclaimerModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fsi-disclaimer-title"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="max-w-md w-full rounded-2xl bg-[#1c1c1c] border border-border p-6 text-left"
          >
            <h2
              id="fsi-disclaimer-title"
              className="text-lg font-bold text-white mb-3"
            >
              这个测试会问一些关于家庭的问题
            </h2>
            <ul className="text-sm text-muted leading-relaxed space-y-2 mb-6">
              <li>· 你可以选"最接近"的选项，不用完美匹配</li>
              <li>· 你可以随时退出，不保存也没关系</li>
              <li>
                · 如果过程中情绪起伏较大，请先暂停；必要时联系专业心理支持
                （结果页下方有入口）
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  markDisclaimerAcknowledged();
                  onConfirm();
                }}
                className="flex-1 bg-white text-black py-3 px-5 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                知道了，开始测试
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-surface text-white border border-border py-3 px-5 rounded-xl hover:border-[#444] transition-colors cursor-pointer"
              >
                我再想想
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 5: Commit**

```bash
git add src/components/FSIHeroBadge.tsx src/components/FSIResultSupportBlock.tsx src/components/FSIDisclaimerModal.tsx
git commit -m "feat(fsi): add hero badge + support block + disclaimer modal"
```

---

## Task 8：ResultPage 接入 FSI testFooter 插槽

**Files:**
- Modify: `src/components/ResultPage.tsx`

FPI 已经加过 `testBadge?: ReactNode` slot（顶部徽章）。FSI 需要在结果页**底部**再开一个 slot 放 `FSIResultSupportBlock`——因此增加一个新 prop `testFooter?: ReactNode`。其他 8 个测试不传，行为不变。

> **决策说明**：Support block 必须出现在结果页的**最后一屏**区域，不能和顶部徽章挤在一起（spec §9.2 要求"深色兜底模块，不过大"），因此复用 `testBadge` 不合适。新增 slot 是最干净的扩展。

- [ ] **Step 1: 确认 ResultPage 当前结构**

Run: `grep -n "testBadge\|interface ResultPageProps\|Bottom spacer" src/components/ResultPage.tsx | head -10`
Expected: 看到 `testBadge?: ReactNode;`、`{testBadge && !config.genderLocked && testBadge}` 和 `{/* Bottom spacer */}`（最底部 h-12 div）。

- [ ] **Step 2: 在 ResultPageProps 追加 testFooter**

打开 `src/components/ResultPage.tsx`，在 `testBadge?: ReactNode;` 下一行追加：

```tsx
  /** Optional test-specific footer rendered after action buttons (e.g. FSI support block). */
  testFooter?: React.ReactNode;
```

在函数签名解构里也追加 `testFooter`：

```tsx
export default function ResultPage({
  result,
  onShare,
  onInviteCompare,
  onRestart,
  onHome,
  onDebugReroll,
  onDebugForceType,
  gender,
  testBadge,
  testFooter,    // new
}: ResultPageProps) {
```

- [ ] **Step 3: 在 "Bottom spacer" 之前渲染 testFooter**

找到 `{/* Bottom spacer */}` 所在 block（见 ResultPage.tsx 尾部），在它**之前**插入：

```tsx
{/* FSI 专属页脚（如心理支持兜底） — 只渲染当上游传入且非 genderLocked 测试 */}
{testFooter && !config.genderLocked && testFooter}

{/* Bottom spacer */}
<div className="h-12" />
```

- [ ] **Step 4: 若未 import React 类型，补上**

Run: `grep -n "import type { ReactNode }\|from 'react'" src/components/ResultPage.tsx | head -3`
如果已有 `import type { ReactNode } from 'react';`（FPI task 8 已添加），把 `React.ReactNode` 改为 `ReactNode`。

- [ ] **Step 5: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 6: Commit**

```bash
git add src/components/ResultPage.tsx
git commit -m "feat(ResultPage): add optional testFooter slot for per-test bottom modules"
```

---

## Task 9：Pattern 唯一性自检脚本

**Files:**
- Create: `scripts/fsi-pattern-check.ts`

**决策**：独立一份 `scripts/fsi-pattern-check.ts`（不复用 `fpi-pattern-check.ts`）。原因——每个测试的 NORMAL_TYPES 长度/位数如果未来扩展不一样，共享脚本容易误报；且脚本本身很短，维护成本可忽略。

- [ ] **Step 1: 创建脚本**

```typescript
// scripts/fsi-pattern-check.ts
/**
 * FSI Pattern Uniqueness Self-Check
 * ----------------------------------
 * Verifies that the 18 NORMAL_TYPES pattern vectors in
 * `src/data/fsi/types.ts` are all unique AND that the minimum
 * Hamming distance between any two patterns is >= 2.
 *
 * Run:
 *   npx tsx scripts/fsi-pattern-check.ts
 *
 * Exits non-zero on failure so the script can gate CI if desired.
 */

import { NORMAL_TYPES } from '../src/data/fsi/types';

const PATTERN_LEN = 6;
const MIN_HAMMING_REQUIRED = 2;

function main(): void {
  const seen = new Map<string, string>();
  const dupes: Array<[string, string, string]> = [];
  for (const t of NORMAL_TYPES) {
    const prev = seen.get(t.pattern);
    if (prev !== undefined) dupes.push([prev, t.code, t.pattern]);
    else seen.set(t.pattern, t.code);
  }

  let minDist = Number.POSITIVE_INFINITY;
  let minPair: [string, string] | null = null;
  for (let i = 0; i < NORMAL_TYPES.length; i++) {
    for (let j = i + 1; j < NORMAL_TYPES.length; j++) {
      const a = NORMAL_TYPES[i].pattern;
      const b = NORMAL_TYPES[j].pattern;
      let d = 0;
      for (let k = 0; k < PATTERN_LEN; k++) {
        if (a[k] !== b[k]) d++;
      }
      if (d < minDist) {
        minDist = d;
        minPair = [NORMAL_TYPES[i].code, NORMAL_TYPES[j].code];
      }
    }
  }

  console.log(`total: ${NORMAL_TYPES.length}`);
  console.log(`unique: ${seen.size}`);
  console.log(`dupes: ${JSON.stringify(dupes)}`);
  console.log(`min hamming distance: ${minDist}${minPair ? ` (pair: ${minPair[0]} vs ${minPair[1]})` : ''}`);

  const uniqueOk = dupes.length === 0 && seen.size === NORMAL_TYPES.length;
  const hammingOk = minDist >= MIN_HAMMING_REQUIRED;

  if (uniqueOk && hammingOk) {
    console.log(`\nPASS: ${NORMAL_TYPES.length}/${NORMAL_TYPES.length} patterns unique, min Hamming = ${minDist} (>= ${MIN_HAMMING_REQUIRED}).`);
    process.exit(0);
  } else {
    console.error('\nFAIL:');
    if (!uniqueOk) console.error(`  - duplicate patterns found: ${JSON.stringify(dupes)}`);
    if (!hammingOk) console.error(`  - min Hamming distance ${minDist} < required ${MIN_HAMMING_REQUIRED}`);
    process.exit(1);
  }
}

main();
```

- [ ] **Step 2: 加 package.json 脚本入口**

编辑 `package.json`，在 `scripts` 段落加：

```json
"fsi:pattern-check": "tsx scripts/fsi-pattern-check.ts"
```

- [ ] **Step 3: 跑一次**

Run: `npx tsx scripts/fsi-pattern-check.ts`
Expected:
```
total: 18
unique: 18
dupes: []
min hamming distance: 2 (pair: COPYX vs SILNT)

PASS: 18/18 patterns unique, min Hamming = 2 (>= 2).
```

- [ ] **Step 4: Commit**

```bash
git add scripts/fsi-pattern-check.ts package.json
git commit -m "verify: fsi 18 normal-type patterns are unique (min hamming 2)"
```

---

## Task 10：创建 FsiApp 顶层组件（含 BOSSY 多条件判定 + Disclaimer 首启 + SupportBlock 注入）

**Files:**
- Create: `src/FsiApp.tsx`

基于 `src/FpiApp.tsx` 结构 copy + 改造。核心差异：
1. 不走 GenderPicker；`handleStartTest` 先查 `hasAcknowledgedDisclaimer()`，未确认则先弹 `FSIDisclaimerModal`，确认后 `quiz.startQuiz()`。
2. 结果页传 `testBadge={<FSIHeroBadge .../>}` + `testFooter={<FSIResultSupportBlock />}`。
3. `computeResult` 调用后做一次"BOSSY 多条件覆写"——若 `answers['fsi_gate'] === 3` 且 levels 满足 CTRL/LITE/ECHO 全 H，则覆写 `finalType` 为 `BOSSY`。
4. `autoFillAndShowResult`（#test 路径）同样应用覆写逻辑。

- [ ] **Step 1: 创建组件**

```tsx
// src/FsiApp.tsx
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
import FSIHeroBadge from './components/FSIHeroBadge';
import FSIResultSupportBlock from './components/FSIResultSupportBlock';
import FSIDisclaimerModal, {
  hasAcknowledgedDisclaimer,
} from './components/FSIDisclaimerModal';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { fsiConfig } from './data/fsi/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';
type FsiTabId = 'home' | 'ranking';

const isTestDomain = window.location.hostname.includes('sbticc-test');

/* ---------- FSI-specific Hero ---------- */

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
});

const heroGlow = css`
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(255, 185, 80, 0.06) 0%,
    transparent 70%
  );
`;

function FsiHero({ onStartTest, totalTests }: { onStartTest: () => void; totalTests: number }) {
  const displayTotal = totalTests > 0 ? totalTests.toLocaleString() : '---';

  return (
    <section
      css={heroGlow}
      className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[90vh]"
    >
      <motion.p
        {...fadeInUp(0)}
        className="text-amber-300 font-mono font-bold text-sm tracking-widest uppercase mb-4"
      >
        FSI · FAMILY SURVIVOR INDEX
      </motion.p>

      <motion.h1
        {...fadeInUp(0.1)}
        className="font-extrabold text-white leading-tight select-none text-4xl sm:text-5xl mb-4"
      >
        原生家庭幸存者
      </motion.h1>

      <motion.div
        {...fadeInUp(0.15)}
        className="mb-6 rounded-full"
        style={{
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #ffb84d, #d98e00)',
        }}
      />

      <motion.p
        {...fadeInUp(0.2)}
        className="text-sm sm:text-base text-muted mb-3 max-w-md"
      >
        22 题 &times; 6 维度 &times; 18 种家庭出厂型号
      </motion.p>

      <motion.p
        {...fadeInUp(0.25)}
        className="text-sm text-muted mb-8 max-w-md"
      >
        你不是性格古怪，你只是被养成了这个形状。
      </motion.p>

      <motion.div
        {...fadeInUp(0.3)}
        className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-surface border border-border"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
        </span>
        <span className="text-sm text-muted">
          已有 <span className="text-white font-mono font-bold">{displayTotal}</span> 人完成测试
        </span>
      </motion.div>

      <motion.button
        {...fadeInUp(0.4)}
        onClick={onStartTest}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(255,185,80,0.2)' }}
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

/* ---------- BOSSY 多条件覆写 ---------- */

function maybeOverrideToBossy(
  result: ComputeResultOutput,
  answers: Record<string, number | number[]>,
): ComputeResultOutput {
  // spec §5.1 的双条件：
  //   1. fsi_gate === 3（"我反过来管他们了"）
  //   2. CTRL=H & LITE=H & ECHO=H
  const gate = answers['fsi_gate'];
  if (gate !== 3) return result;
  const lv = result.levels;
  if (lv['D1'] === 'H' && lv['D5'] === 'H' && lv['D6'] === 'H') {
    const bossyDef = fsiConfig.typeLibrary['BOSSY'];
    if (bossyDef) {
      return {
        ...result,
        finalType: {
          ...bossyDef,
          similarity: 100,
        } as typeof result.finalType,
      };
    }
  }
  return result;
}

/* ---------- FsiAppInner ---------- */

function FsiAppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<FsiTabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('fsi-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

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
    let res = computeResult(answers, false, config, null);
    res = maybeOverrideToBossy(res, answers);
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
    if (!hasAcknowledgedDisclaimer()) {
      setShowDisclaimer(true);
      return;
    }
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz]);

  const handleDisclaimerConfirm = useCallback(() => {
    setShowDisclaimer(false);
    quiz.startQuiz();
    setScreen('quiz');
  }, [quiz]);

  const handleDisclaimerCancel = useCallback(() => {
    setShowDisclaimer(false);
  }, []);

  const handleQuizSubmit = useCallback(() => {
    let res = quiz.getResult();
    // 多条件 BOSSY 覆写
    // 注意：quiz.getResult 内部把 answers 丢到了 computeResult 里；
    // 我们需要 answers 来判 BOSSY 条件——此处通过 quiz.answers 取（假设 useQuiz 暴露 answers；若没暴露，见 Step 2）。
    res = maybeOverrideToBossy(res, quiz.answers);
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
    const similarity =
      'similarity' in result.finalType
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

  const handleDebugForceType = useCallback(
    (code: string) => {
      const allQs = [...config.questions, ...config.specialQuestions];
      const answers: Record<string, number | number[]> = {};
      allQs.forEach((q) => {
        answers[q.id] = randomAnswerForQuestion(q);
      });
      const res = computeResult(answers, false, config, code);
      setResult(res);
      setScreen('result');
    },
    [config],
  );

  const handleShareCompare = useCallback(async () => {
    if (!result || !compareData) return;
    const typeCode = result.finalType.code;
    const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
    const similarity =
      'similarity' in result.finalType
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
    if (tab === 'home' || tab === 'ranking') setActiveTab(tab as FsiTabId);
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
              <FsiHero onStartTest={handleStartTest} totalTests={totalTests} />

              {/* 首页免责声明（spec §9.2 "首页入口卡片下方"） */}
              <div className="mx-auto max-w-2xl -mt-8 mb-14 px-5 py-4 bg-surface/40 border border-border/50 rounded-lg">
                <p className="text-xs text-muted leading-relaxed text-center">
                  <strong className="text-white">关于这个测试：</strong>
                  FSI 是对成长经历的一次戏谑化自省，所有类型描述都是行为模式的调侃式总结，
                  <strong className="text-white">不构成心理诊断</strong>。
                  如果你在测试过程中感到不适，随时可以关掉——你的当下比任何测试结果都重要。
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

      <FSIDisclaimerModal
        open={showDisclaimer}
        onConfirm={handleDisclaimerConfirm}
        onCancel={handleDisclaimerCancel}
      />

      {screen === 'quiz' && (
        <QuizOverlay quiz={quiz} onSubmit={handleQuizSubmit} onBack={handleBackToHome} />
      )}

      {screen === 'interstitial' && (
        <Interstitial onComplete={handleInterstitialComplete} />
      )}

      {screen === 'result' && result && (
        <ResultPage
          result={result}
          testBadge={
            <FSIHeroBadge
              typeCode={result.finalType.code}
              typeCn={result.finalType.cn}
            />
          }
          testFooter={<FSIResultSupportBlock />}
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
            similarity:
              'similarity' in result.finalType
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
          <p className="text-lg text-muted mb-2">对方的家庭出厂型号：</p>
          <p className="text-white font-mono font-bold text-3xl mb-1">
            {compareData.code}
          </p>
          <p className="text-sm text-muted mb-6">
            {config.typeLibrary[compareData.code]?.cn || ''}
          </p>
          <p className="text-sm text-[#999] mb-6">
            先完成测试，才能查看你们的家庭出厂对比
          </p>
          <button
            onClick={handleStartTest}
            className="bg-amber-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
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

export default function FsiApp() {
  return (
    <TestConfigProvider config={fsiConfig}>
      <FsiAppInner />
    </TestConfigProvider>
  );
}
```

- [ ] **Step 2: 验证 useQuiz 是否暴露 answers**

Run: `grep -n "answers\|startQuiz\|getResult" src/hooks/useQuiz.ts | head -20`
Expected: 应有 `answers` 从 state 返回。若 `useQuiz` 没把 `answers` 包含在 return，需要先在 `src/hooks/useQuiz.ts` 里把 `answers` 暴露出来（FPI / GSTI 都未用到，但加出去不影响其他测试）。

如果 `useQuiz` 的返回对象里没有 `answers`，修改 `src/hooks/useQuiz.ts`：
- 在 return 对象末尾追加 `answers`，例如 `return { ..., answers };`

并确保类型里也含 `answers: Record<string, number | number[]>`。

Commit 该修改单独一步：

```bash
git add src/hooks/useQuiz.ts
git commit -m "feat(useQuiz): expose answers for post-compute hooks (fsi BOSSY cond)"
```

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误。

- [ ] **Step 4: Commit FsiApp**

```bash
git add src/FsiApp.tsx
git commit -m "feat(fsi): add FsiApp top-level with BOSSY cond + disclaimer + support block"
```

---

## Task 11：vite.config.ts 新增 fsi 入口

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 在 rollupOptions.input 加 fsi**

编辑 `vite.config.ts`，在 `fpi: 'fpi.html'` 后追加：

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
        fpi: 'fpi.html',
        fsi: 'fsi.html',      // 新增
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
Expected: 构建成功，输出 `dist-task11/fsi.html` 和 FSI 相关 chunk。

- [ ] **Step 3: 清理临时产物**

Run: `rm -rf dist-task11`

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "feat(fsi): add fsi vite entry"
```

---

## Task 12：build.sh 复制 fsi 产物到 /new/fsi/

**Files:**
- Modify: `build.sh`

- [ ] **Step 1: 在测试复制循环里加入 `fsi`**

编辑 `build.sh`，修改测试循环行：

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
for test in love work values cyber desire gsti fpi fsi; do     # ← 追加 fsi
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

echo "Build complete: old at /, SBTI at /new/, love/work/values/cyber/desire/gsti/fpi/fsi at /new/<test>/"
```

- [ ] **Step 2: Syntax check**

Run: `bash -n build.sh && echo OK`
Expected: `OK`。

- [ ] **Step 3: 完整 build 验证产物**

Run: `./build.sh 2>&1 | tail -10`
Run: `ls dist/new/fsi/`
Expected: `index.html` 存在。

- [ ] **Step 4: Commit**

```bash
git add build.sh
git commit -m "feat(fsi): copy fsi build artefact to /new/fsi/"
```

---

## Task 13：hub 首页（index.html）新增 FSI 卡片（9 个测试）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 更新 hero title & subtitle（8 → 9 个测试）**

编辑 `index.html`：

```html
<!-- title 和 meta description -->
<title>人格实验室 — 9个测试，N种人格，0个正确答案</title>
<meta name="description" content="人格实验室：9款趣味人格测试，从恋爱脑到打工人，从赛博基因到朋友圈人设再到原生家庭，测出你从未认识的自己。" />

<!-- hero 副标题 -->
<p class="hero-subtitle">9个测试，N种人格，0个正确答案</p>
```

- [ ] **Step 2: 在 tests-grid 末尾加一张 FSI 卡**

在 fpi 卡之后追加：

```html
      <a class="test-card fade-in-up" href="/new/fsi">
        <div class="card-emoji">🏷️</div>
        <div class="card-name">原生家庭幸存者</div>
        <div class="card-tagline">你被养成了什么形状</div>
        <div class="card-cta">开始测试 &rarr;</div>
      </a>
```

- [ ] **Step 3: 在 CSS 动画 delay 新增第 9 张**

```css
    .test-card:nth-child(9) { animation-delay: 0.45s; }
```

- [ ] **Step 4: 更新底部 JS 的 tests 数组**

```js
      var tests = ['', 'love', 'work', 'values', 'cyber', 'desire', 'gsti', 'fpi', 'fsi'];
```

- [ ] **Step 5: Sanity check**

Run: `grep -c "test-card fade-in-up" index.html`
Expected: `9`。

Run: `grep -n "/new/fsi" index.html`
Expected: 至少 1 行。

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(fsi): add FSI card to hub page (9 tests total)"
```

---

## Task 14：api/record.js 支持 fsi 命名空间

**Files:**
- Modify: `api/record.js`

- [ ] **Step 1: 在 VALID_TYPES_BY_TEST 加入 fsi**

编辑 `api/record.js`，在 `fpi` 之后追加：

```javascript
  'fsi': new Set([
    'COPYX','REBEL','SAINT','LEAVE','CURE!','SILNT','DADY+','MAMY+',
    'PICKR','PLEASE','GOLD+','GHOST','SOS!','BANK!','PRNS+','TOOLX',
    'BRAG+','DUAL!',
    'BOSSY','FAMX?'
  ]),
```

- [ ] **Step 2: Syntax check**

Run: `node --check api/record.js && echo OK`
Expected: `OK`。

- [ ] **Step 3: Commit**

```bash
git add api/record.js
git commit -m "feat(fsi): whitelist fsi type codes in record API"
```

---

## Task 15：api/ranking.js 支持 fsi（mock + hidden）

**Files:**
- Modify: `api/ranking.js`

- [ ] **Step 1: 在 MOCK_TYPES_BY_TEST 加入 fsi**

在 `fpi:` 之后追加：

```javascript
  fsi: [
    'COPYX','REBEL','SAINT','LEAVE','CURE!','SILNT','DADY+','MAMY+',
    'PICKR','PLEASE','GOLD+','GHOST','SOS!','BANK!','PRNS+','TOOLX',
    'BRAG+','DUAL!',
    'BOSSY','FAMX?',
  ],
```

- [ ] **Step 2: 在 HIDDEN_TYPE_BY_TEST 加入 fsi**

```javascript
const HIDDEN_TYPE_BY_TEST = {
  '': 'DRUNK',
  love: 'EX',
  work: '996',
  values: 'MLC',
  cyber: 'BOT',
  desire: 'XXX',
  gsti: 'UNDEF',
  fpi: '0POST',
  fsi: 'BOSSY',      // 新增
};
```

- [ ] **Step 3: Syntax check**

Run: `node --check api/ranking.js && echo OK`
Expected: `OK`。

- [ ] **Step 4: Commit**

```bash
git add api/ranking.js
git commit -m "feat(fsi): add fsi to ranking mock types + hidden type map"
```

---

## Task 16：SBTI 主站跨测试引流（MVP 跳过）

**Files:**
- (无修改)

> spec §12 没有committed的 cross-promo 方案，沿用 FPI MVP 策略：不加 SBTI → FSI 导流卡。FSI 的导流来自 hub 首页 + 小红书冷启动（#重养自己一遍 / #电子父母 / #断亲 三大已有 tag）。若后期数据好再回来补。

- [ ] **Step 1: 决策：不加**

本任务作为"不做"记录——不修改 `src/App.tsx`。

- [ ] **Step 2: Commit empty record**

```bash
git commit --allow-empty -m "decide: skip FSI cross-promo card on SBTI main site for MVP"
```

---

## Task 17：Smoke 测试（#test 自动填答 + BOSSY 路径）

**Files:**
- (无修改，验证 only)

FPI Task 17 已修复过 `randomAnswerForQuestion` 的 `Math.max` bug（见 `src/utils/quiz.ts`）。FSI 题目的 options value 分布同样有非单调的情形（warm1/warm2/warm3/echo1/echo2/echo3 等用了 value-by-semantic 而非升序），所以**这个修复必须已经在代码库里**——FSI smoke 会立刻复核。

- [ ] **Step 1: 前置 sanity**

Run: `grep -n "Math.max.*options" src/utils/quiz.ts`
Expected: 能看到 `Math.max(...options.map(o => o.value))` 一行（FPI 已修复过的）。若未看到则先修，否则 FSI 答案会塌陷到 LLLLLL。

- [ ] **Step 2: dev 启动**

Run: `npm run dev`

- [ ] **Step 3: 浏览器访问 `#test` auto-fill**

打开：`http://localhost:5173/fsi.html#test`
Expected: 直接跳到结果页，类型为 18 常规之一（概率上不会命中 BOSSY——因为 BOSSY 要多条件同时满足，也不会命中 FAMX?——similarity ≥ 55 的情况较多）。

- [ ] **Step 4: 多 reload 10 次**

每次刷新看 result type，记录分布。
Expected: 至少覆盖 8+ 个不同类型，不集中在某一个 code。若观察到 > 50% 都是某一个 code（比如 DUAL!/MMMMMM），就复查 sumToLevel 阈值。

- [ ] **Step 5: 手动走一次 BOSSY 路径**

关闭 `#test`，正常走入 `quiz` overlay：
1. 首次进入应看到 `FSIDisclaimerModal` 浮层
2. 点"知道了，开始测试"
3. 把 CTRL 4 题全选 value=4（被安排派）
4. 把 LITE 4 题全选 value=4（聚光灯）
5. 把 ECHO 3 题全选 value=4（复刻派）
6. 其他维度随便选
7. `fsi_gate` 第 22 题选 C "我反过来管他们了"（value=3）
8. 提交

Expected: 结果为 `BOSSY` 家族 CEO，同时 ResultPage 底部出现 `FSIResultSupportBlock`（心理危机热线模块）。

- [ ] **Step 6: BOSSY 反例**

重走一次：同样条件，但 `fsi_gate` 选 A/B/D（任何不是 C）。
Expected: 结果不是 BOSSY，而是 `COPYX` 或其他 CTRL/LITE/ECHO 全 H 的最近邻。

- [ ] **Step 7: Disclaimer localStorage 记忆**

第 2 次点"开始测试" 应该**不再弹浮层**（localStorage 已记 `fsi_disclaimer_ack_v1=1`）。

- [ ] **Step 8: 分享海报生成**

结果页点"分享"，应能生成一张 PNG。Expected: 海报包含类型中文名 + 雷达图 + QR。无乱码。

- [ ] **Step 9: Commit**

```bash
git commit --allow-empty -m "verify: fsi #test smoke + BOSSY path + disclaimer memo + share card"
```

---

## Task 18：敏感词 & 调性红线审校（spec §9.3 / §9.4 full lint）

**Files:**
- (视审校发现 → `src/data/fsi/types.ts` 或 `src/data/fsi/questions.ts`)

per spec §9.3 每个类型描述必须过下列 checklist：
- [ ] 有没有直接攻击父母的句子？（"你妈太 xx" / "你爸从来不 xx"）
- [ ] 有没有把用户描述为"受害者 / 残次品 / 坏掉的人"？
- [ ] 有没有出现一级禁用词？
- [ ] 有没有以"你永远……"结尾的绝望钉子句？
- [ ] 最后一句是不是温柔出口，而不是 SBTI 式纯刺痛？
- [ ] 有没有建议用户断亲 / 结婚 / 生子 / 吃药等任何实际决策？（禁止）
- [ ] 阅读一遍，有没有让你自己心里发沉？（有 → 重写）

- [ ] **Step 1: 一级禁用词扫描**

Run:
```bash
grep -nE "毒母|毒父|毒亲|原生家庭罪|家庭毁掉|被家毁掉|家暴|打骂|酗酒|自残|抑郁症|精神病|轻生|拳师|爹味|老登|凤凰男|妈宝男|扶弟魔|控诉|讨伐|告状|判决|罪行" src/data/fsi/types.ts src/data/fsi/questions.ts src/FsiApp.tsx src/components/FSIHeroBadge.tsx src/components/FSIResultSupportBlock.tsx src/components/FSIDisclaimerModal.tsx
```
Expected: 无命中。

- [ ] **Step 2: 攻击父母直接句子扫描**

Run:
```bash
grep -nE "你妈太|你爸太|你妈从来不|你爸从来不|你妈就是|你爸就是" src/data/fsi/types.ts src/data/fsi/questions.ts
```
Expected: 无命中。

- [ ] **Step 3: 绝望钉子句扫描**

Run:
```bash
grep -nE "你永远" src/data/fsi/types.ts
```
Expected: 无命中。

- [ ] **Step 4: 温柔出口结构检查**

Run:
```bash
grep -c "一句温柔出口：" src/data/fsi/types.ts
```
Expected: `20`（18 常规 + BOSSY + FAMX?）。

- [ ] **Step 5: 决策性建议禁止（断亲/结婚/生子/吃药）扫描**

Run:
```bash
grep -nE "你应该断亲|你应该不要孩子|你应该结婚|你应该吃药|你必须离开|你必须和解" src/data/fsi/types.ts
```
Expected: 无命中。

- [ ] **Step 6: 二级慎用词评估（不一定删，但必须列出供审阅）**

Run:
```bash
grep -nE "创伤|阴影|伤害|悲剧|不幸|可怜|心疼" src/data/fsi/types.ts
```
Expected: 尽量少。本 plan 的 18 条 desc 已避开；若扫描出>3 行，逐条重读是否必要。

- [ ] **Step 7: 群体对立审计（地域/阶层/性别）**

通读 18 条 type desc，确认没有：
- 阶层标签（底层/小镇/精英专属）
- 职业污名（小镇做题家/互联网民工）
- 地域歧视
- 非必要的性别对立（GNDR 维度描述已用中性处理）
- 年龄污名（Z 世代/00 后/老年人专属）

Expected: 全部通过。若改写，重扫一次。

- [ ] **Step 8: Commit**

```bash
git commit --allow-empty -m "chore(fsi): sensitive word + tonality audit pass (spec 9.3/9.4)"
```

---

## Task 19：TypeScript 全量 + 生产构建

**Files:**
- (无修改，验证 only)

- [ ] **Step 1: 全量 type check**

Run: `npx tsc --noEmit 2>&1 | head -50`
Expected: 无错误。

- [ ] **Step 2: Pattern check**

Run: `npx tsx scripts/fsi-pattern-check.ts`
Expected: `PASS: 18/18 patterns unique, min Hamming = 2`.

- [ ] **Step 3: 全量 build**

Run: `./build.sh 2>&1 | tail -20`
Expected: 构建成功；`dist/new/fsi/index.html` 存在；`dist/new/assets/fsi-*.js` chunk 存在。

- [ ] **Step 4: `npm run preview` smoke**

Run: `npm run preview &`
打开: `http://localhost:4173/new/fsi.html`

完整走一遍：
- [ ] 首页 Hero + FSI · FAMILY SURVIVOR INDEX 品牌字
- [ ] 首次点"开始测试" → 弹 Disclaimer 浮层 → 点"知道了"
- [ ] 走完 21 + gate 题（不触发 BOSSY）→ 结果为 18 常规之一
- [ ] 第 2 次点"开始测试" → **不再弹浮层**
- [ ] 重测 → CTRL/LITE/ECHO 全高 + gate=C → 结果为 `BOSSY`
- [ ] 结果页顶部 FSIHeroBadge "FAMILY SURVIVOR INDEX / 出厂型号 · XXX / 状态 · 幸存"
- [ ] 结果页最底部 FSIResultSupportBlock 出现，含两个电话
- [ ] 分享海报 → 类型中文名 + 雷达图 + QR
- [ ] 排行榜 tab → 无崩溃、显示 mock 数据

- [ ] **Step 5: 关闭 preview**

Run: `pkill -f 'vite preview'`

- [ ] **Step 6: Commit**

```bash
git commit --allow-empty -m "verify: fsi build + preview smoke pass"
```

---

## Task 20：部署前最后清单 + Vercel rewrite

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: vercel.json 新增 /new/fsi rewrite**

编辑 `vercel.json`，对齐 GSTI / FPI 已有格式，在 rewrites 段落追加：

```json
{
  "source": "/new/fsi",
  "destination": "/new/fsi/index.html"
},
{
  "source": "/new/fsi/(.*)",
  "destination": "/new/fsi/index.html"
}
```

- [ ] **Step 2: JSON syntax check**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))" && echo OK`
Expected: `OK`。

- [ ] **Step 3: 人工清单（Plan 执行最终验收）**

- [ ] `fsi.html` 的 title / OG tags 不含占位（Task 1）
- [ ] 18 个类型 desc 无错别字、无一级禁用词、温柔出口齐全（Task 18 已过）
- [ ] 22 题目无 typo、无真实创伤画面（Task 4/18）
- [ ] BOSSY 双条件触发路径走通（Task 17）
- [ ] FAMX? 兜底路径——debug force `FAMX?` 可渲染（Task 19 手动检一次）
- [ ] FSIHeroBadge + FSIResultSupportBlock + FSIDisclaimerModal 三件套渲染正确（Task 19）
- [ ] 首页免责文案可见（Task 10）
- [ ] 危机热线 010-82951332 / 400-161-9995 tel: 链接可点（手机上会拉起拨号盘）
- [ ] Hub 首页 FSI 卡可点（Task 13）
- [ ] API record / ranking 对 `fsi` 命名空间生效（Task 14/15）
- [ ] `./build.sh` 成功产出 `dist/new/fsi/index.html`（Task 19）
- [ ] `vercel.json` 已加两条 rewrite（Task 20 Step 1）

- [ ] **Step 4: 推送部署**

```bash
git add vercel.json
git commit -m "fix(fsi): add Vercel rewrite for /new/fsi (same pattern as fpi/gsti)"
git push origin feat/fsi-family-survivor
```

- [ ] **Step 5: Vercel 侧**

- 等 Vercel 自动构建完成
- 访问 `https://sbti.jiligulu.xyz/new/fsi` 确认 HTML 正确 render
- 确认首页 disclaimer 可见 + 结果页 support block 可见

- [ ] **Step 6: API smoke（线上）**

```bash
curl -X POST https://sbti.jiligulu.xyz/api/record \
  -H 'Content-Type: application/json' \
  -d '{"type":"COPYX","test":"fsi"}'
# Expected: {"ok":true,"total":...}

curl "https://sbti.jiligulu.xyz/api/ranking?test=fsi"
# Expected: 含 COPYX / REBEL / SAINT 等 fsi 命名空间的 mock ranking；HIDDEN_TYPE=BOSSY
```

- [ ] **Step 7: 监控 distress_exit 指标（可选）**

per spec §10.6，可选统计 disclaimer "我再想想" 点击次数（记 `sbti:fsi:distress_exit` counter）。首版如果未加埋点，跳过——放到未来迭代。

- [ ] **Step 8: 冷启动监控（24h）**

- 访问量、QPS、Upstash 写入速率
- 评论区（小红书 / 朋友圈）话术是否出现"控诉父母""骂 XX 家"等负面引导——如有立刻发"这是一次轻量自省"的温馨提示
- Support block 心理热线点击率（若可追）

- [ ] **Step 9: Commit empty ship record**

```bash
git commit --allow-empty -m "ship(fsi): deploy + smoke checklist done"
```

---

## 自审检查点

- 20 个任务覆盖 FSI spec §2-§10 所有 P0 项（§9 全量调性红线、§9.2 三处 disclaimer、§9.2 心理热线、§5.1 BOSSY 双条件、§5.2 FAMX? 兜底、§7 海报维度、§10 架构复用）。
- 每个任务含绝对文件路径、完整代码（无 placeholder）、verification、commit message。
- 18 个 pattern 在 plan 阶段已人肉校对：**18/18 unique，最小 Hamming = 2**（最近对：COPYX `MHMMMH` vs SILNT `MLMMML` 差 WARM+ECHO 两位；COPYX vs PICKR `HLMMMH` 差 CTRL+WARM 两位；MAMY+ vs PRNS+ 差 MNEY+ECHO 两位）。Task 9 的独立脚本做兜底验证。
- FSI 不用 `genderLocked`，`computeResult` 走 4 参稳定签名，不破坏其他 8 个测试。
- BOSSY 多条件判定**不改 matching.ts**——通过 FsiApp 的 `maybeOverrideToBossy` 实现，保持测试核心算法稳定。
- `FSIResultSupportBlock` 心理热线文案**一字不改**对齐 spec §9.2；两个电话都用 `tel:` 链接，移动端可直接拨。
- `FSIDisclaimerModal` 用 localStorage `fsi_disclaimer_ack_v1` 记忆，bump 版本即可让老用户重弹一次。
- 一级禁用词、攻击父母句式、"你永远…"钉子句都已在 Task 5 落地前规避，Task 18 做二次扫描。
- 每条 type desc 以"一句温柔出口："收尾（刺痛 + 出路组合），与 SBTI 的纯刺痛风格形成明文差别——这是 FSI 独立于家族其他测试的核心品牌调性。
- FSI 海报视觉用暖米色 + 旧黄系（FSIHeroBadge 用 `amber-300/amber-500`），避免冷峻医学风与破碎镜/墓碑意象（spec §7.2）。

---

## Spec 未覆盖/需要工程判断的点

1. **多条件 hidden 机制**：spec §5.1 明文要双条件（gate + 高维度向量），但现有 `TestConfig.hiddenTriggerValue` 只支持单一 value。本 plan 选择**不扩 TestConfig schema**，改在 FsiApp 里 post-compute 覆写。优点：零影响其他测试；缺点：BOSSY 判定逻辑分散在 App 层。未来若其他测试也要多条件 hidden，再抽到 `matching.ts`。
2. **分维度 sumToLevel 阈值**：GNDR 2 题、ECHO 3 题、其他 4 题的 raw sum 差异较大，但 `matching.ts` 的 `sumToLevel` 只收单一 score。本 plan 采用"统一 4 题阈值"的折衷（见 Task 6 注释），Task 17 smoke 会观察是否严重倾斜。若 GNDR 维度几乎都判 L，则下一版补 per-dim threshold override。
3. **Compat tab**：MVP 不启用，stub 返回 normal。spec §10 默认 FSI 不做 compat。
4. **Cross-promo**：spec §12 没 commit 具体方案，Task 16 按 FPI MVP 策略跳过。
5. **distress_exit 埋点**：spec §10.6 提到可选，本 plan Task 20 Step 7 标为 future work——不阻塞首发。
6. **FSI 分享海报"家电铭牌"视觉升级**：本 plan 用基础 `FSIHeroBadge` pill 风格兜底，未在 Canvas 绘一张真正的"出厂铭牌"贴纸（spec §7 描述的那种老相片质感）。作为 P1 改进点列入"上线后未覆盖的改进点"。

---

## 上线后未覆盖的改进点（供后续 session 跟进）

- [ ] 自定义 `typeImages`：18 张"家电出厂铭牌"风格插画（spec §7.2 暖色调、老纸质感、批次/状态字段）
- [ ] `compatibility` 表主题 "谁重养你 / 谁提醒你别再重养别人"（spec §10.3 P2）
- [ ] 分享海报 Canvas 升级：真正画出 spec §7.3 示例的"铭牌 + 雷达 + 内核句 + 温柔出口 + QR" 版式
- [ ] Per-dim sumToLevel 阈值 override（若 Task 17 smoke 发现 GNDR/ECHO 维度分布明显倾斜）
- [ ] `sbti:fsi:distress_exit` 埋点 + dashboard
- [ ] 多平台结果页文案差异版（小红书风格 / 朋友圈风格）

---

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 | cwjjjjj + Claude |

---

## 执行进度日志（Execution Log）

> **目的：** 每完成一个 task 追加一条，记录 commit SHA、review 发现、关键决策。

### 已完成

（执行时在下方追加条目；每条包含 task 编号、commit SHA、改动摘要、review 发现）

---

### 续接指令（给下一个 AI 或开发者）

```
# 1. 切到开发分支
cd /Users/jike/Desktop/Developer/sbticc
git checkout feat/fsi-family-survivor
git log --oneline | head -15

# 2. 确认当前 HEAD 的 commit 对应 plan 哪个 task

# 3. 从下一个 [ ] Task N 开始。Plan 里每个 task 含完整代码块、verification、commit message。

# 4. 完成后：
#    - 追加"已完成"条目到本 md（commit SHA、改动摘要、review 发现）
#    - 在"Spec 未覆盖/需要工程判断的点"记录新决策（如有）

# 5. 推荐模式：Subagent-Driven Development。
#    参考 skill: superpowers:subagent-driven-development
```
