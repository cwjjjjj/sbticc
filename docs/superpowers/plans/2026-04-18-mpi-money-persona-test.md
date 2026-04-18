# MPI 消费人格图鉴 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增第四阶段低风险收官测试 MPI（Money Persona Index · 消费人格图鉴）。用户答 22 题覆盖 6 维度（HOARD / FLAUNT / FRUGAL / SUSCEPT / SECONDHAND / LIVESTREAM），匹配到 18 个"消费事故"类型之一，触发条件下还可命中隐藏类型 `ZERO$`（金钱绝缘体），无法归类时走 `MIXDR`（混合模式败家户）兜底。主打"你不是没钱，是你钱是怎么没的"自嘲钩子，结果页可直接截图发朋友圈/小红书。

**Architecture:** 作为第 9 个测试加入现有多入口架构（`mpi.html` + `src/MpiApp.tsx` + `src/data/mpi/`）。**没有性别锁定**——`genderLocked` 字段留空，不弹 GenderPicker，`computeResult` 走稳定的 4 参调用（`answers, hiddenTriggered, config, debugForceType`）。其余核心组件（ResultPage / QuizOverlay / Interstitial / RankingPage / ShareModal / ComparePage）100% 复用。结果页顶部可选挂载轻量 `MPIHeroBadge`（模拟"小票发票贴纸"视觉，呼应 spec §7 金色于黑的"发票体"方向）。

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion，沿用现有 Redis 排行榜与分享海报管线。

**Spec:** `docs/superpowers/specs/2026-04-18-mpi-money-persona-design.md`

---

## File Structure

### 新建文件
| File | Purpose |
|------|---------|
| `mpi.html` | Vite 入口 HTML（内联 import `MpiApp`，参考 `fpi.html`） |
| `src/MpiApp.tsx` | 顶层 App，`TestConfigProvider + AppInner` 模式（仿 `FpiApp.tsx`，无 GenderPicker） |
| `src/data/mpi/dimensions.ts` | 6 维度定义 HOARD / FLAUNT / FRUGAL / SUSCEPT / SECONDHAND / LIVESTREAM |
| `src/data/mpi/questions.ts` | 22 主题目（每维 3-4 题）+ 1 gate 题 `mpi_gate` |
| `src/data/mpi/types.ts` | 18 常规类型 + `ZERO$` 隐藏 + `MIXDR` 兜底 + NORMAL_TYPES + TYPE_RARITY |
| `src/data/mpi/typeImages.ts` | 占位空 Record（首版走 CSS 生成金色币符卡片） |
| `src/data/mpi/compatibility.ts` | 占位 stub（与 FPI 首版策略一致，MVP 不启用 compat tab） |
| `src/data/mpi/config.ts` | MPI TestConfig 实例，`id='mpi'`，`basePath='/new/mpi'` |
| `src/components/MPIHeroBadge.tsx` | 结果页顶部"小票/发票贴纸"徽章（仅 MPI 渲染，可选） |

### 修改文件
| File | Change |
|------|--------|
| `src/components/ResultPage.tsx` | 不需要再改（FPI 已加 `testBadge?: ReactNode` slot，MPI 直接复用） |
| `vite.config.ts` | `rollupOptions.input` 新增 `mpi: 'mpi.html'` |
| `build.sh` | 测试产物复制循环追加 `mpi` |
| `index.html` | Hub 首页新增 MPI 卡片（9 个卡片 + 动画 delay + `tests` 数组追加 `'mpi'`） |
| `api/record.js` | `VALID_TYPES_BY_TEST.mpi` 新增 20 个 code（18 + `ZERO$` + `MIXDR`） |
| `api/ranking.js` | `MOCK_TYPES_BY_TEST.mpi` 与 `HIDDEN_TYPE_BY_TEST.mpi='ZERO$'` |

> **`matching.ts` 不需要改**：MPI 不使用 `genderLocked`，走 `computeResult` 既有路径即可。调用签名保持 4 参：`computeResult(answers, hiddenTriggered, config, debugForceType)`。
>
> **`src/utils/quiz.ts` 的 `randomAnswerForQuestion`** 已在 FPI Task 17 修复为取 `max(options.map(o => o.value))`，MPI 若有非单调 options 也兼容。

---

## Dimension Conventions

MPI 采用 6 维，每维 `L/M/H` 三档，与 GSTI/FPI 校准后同构。22 题平均覆盖，每维 3-4 题（HOARD 4 / FLAUNT 3 / FRUGAL 4 / SUSCEPT 4 / SECONDHAND 3 / LIVESTREAM 3 + 1 gate 题 `mpi_gate`，gate 题同时兼 LIVESTREAM 维度计分）。

| 维度 | Code | 高分含义（H） | 低分含义（L） | 说明 |
|------|------|----------------|----------------|------|
| D1 | HOARD | H=购物车永远满、家里常备大宗囤货 | L=极简党、用完才买 | 囤货欲 |
| D2 | FLAUNT | H=买了必须晒、不发等于白买 | L=买了藏着、怕被借钱 | 炫耀欲 |
| D3 | FRUGAL | H=算优惠算到深夜、低价安全感 | L=贵才敢买、打折反而不安 | 省钱欲 |
| D4 | SUSCEPT | H=一条笔记就下单 | L=越推越冷笑、抗种草体质 | 易种草度 |
| D5 | SECONDHAND | H=二奢/闲鱼常驻 | L=新品洁癖、二手膈应 | 二手偏好 |
| D6 | LIVESTREAM | H=直播间 PUA 全吃、"321上链接"弹起 | L=直播间不看不停 | 直播沉迷度 |

题目 `value` 映射：
- `1` = 强指向低分（L 极）
- `2` = 偏 L
- `3` = 偏 H
- `4` = 强指向高分（H 极）

每维度 raw score = 该维度 题数 × value 之和。MPI 各维度题数不等，所以 `sumToLevel` 按"**平均每题 value**"换算，保持和 GSTI/FPI 同阈值语义一致：
- 平均 ≤ 2 → `L`
- 平均 2.01-3 → `M`
- 平均 ≥ 3.01 → `H`

实现上在 `config.ts` 里用 `sumToLevel(score, dim)` 两参版本（根据 `dim` 查出题数再除），或在 `matching.ts` 调用前先算平均。MVP 走更简单的路：**在 dimensions.ts 里给每个维度写 `questionCount`，config.ts 的 `sumToLevel` 直接算平均**（详见 Task 2 / Task 6）。

用户向量 = 6 维 L/M/H → levelNum 数组 `[1/2/3, ..., 1/2/3]`。

Pattern 字符串 6 字符 `L`/`M`/`H`（对齐 GSTI/FPI 三档校准），matching 里 `levelNum` 把 L→1、M→2、H→3，最小 Hamming/Manhattan 距离即最匹配。`maxDistance = 12`（6 维 × 最大差 2）。

**Pattern 去重承诺**：18 个 normal pattern 全部 unique（已在 plan 阶段人肉校对，最小 Hamming distance ≥ 2）。**与 spec §5.1 草案相比，plan 内做了 6 处 L/M/H 微调以拉开 Hamming-1 的近邻类型**（详见 Task 5 注释）。

### 隐藏触发（`ZERO$` 金钱绝缘体）

- `mpi_gate` 题目：`上一次认真买点什么给自己是什么时候？`
- 选项：
  - A `value=4` 就是刚才/今天
  - B `value=3` 这周/这个月
  - C `value=2` 三个月前，想不起来具体什么
  - D `value=1` 我真的想不起来了
- 选 D → `hiddenTriggered` 候选成立。
- **最终判定**：`hiddenTriggered = (mpi_gate === D) AND (FRUGAL 三题全选 value=1 或 value=2 的最低档)`。spec §5.2 原文要求"FRUGAL 三题全选最低档"，但 MPI FRUGAL 题实际有 4 题，plan 实现里**放宽为"FRUGAL 维度 level 落在 L 档"**（等价语义，更稳健，不把 3/4 题非最低档但仍是 L 的用户漏掉）。
- 隐藏触发成立时，仍继续答完 22 题——`ResultPage` 雷达图正常展示。

### 兜底类型 `MIXDR`（混合模式败家户）

当用户最佳匹配 similarity < 55 时由 `matching.ts` 的现有 fallback 分支接管，返回 `MIXDR`。

---

## Task 1：创建 mpi.html 入口

**Files:**
- Create: `mpi.html`

- [ ] **Step 1: 创建 mpi.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>消费人格图鉴 — 你是怎么把钱输给这个世界的 | 免费测试</title>
  <meta name="description" content="22 道灵魂拷问，6 个维度，18 种消费人格。直播间人质 vs 二奢鉴定师 vs 省钱大师，测测你的 Money Persona。" />
  <meta name="keywords" content="消费测试,人格测试,剁手测试,MPI,消费MBTI,破产MBTI,败家测试" />
  <link rel="canonical" href="https://sbti.jiligulu.xyz/new/mpi" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="消费人格图鉴 — 你是怎么把钱输给这个世界的" />
  <meta property="og:description" content="31 亿剁手党里总有一个和你一模一样的败家模式。测出你的消费事故类型。" />
  <meta property="og:url" content="https://sbti.jiligulu.xyz/new/mpi" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="消费人格图鉴 — 你是怎么把钱输给这个世界的" />
  <meta name="twitter:description" content="31 亿剁手党里总有一个和你一模一样的败家模式。测出你的消费事故类型。" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "MPI 消费人格图鉴",
    "description": "22 题 6 维度，18 种消费人格，测出你的 Money Persona。",
    "educationalLevel": "entertainment"
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import MpiApp from './src/MpiApp.tsx'
    import './src/index.css'

    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(React.StrictMode, null,
        React.createElement(MpiApp)
      )
    )
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Run: `ls mpi.html && head -1 mpi.html`
Expected: 文件存在，首行 `<!DOCTYPE html>`。

- [ ] **Step 3: Commit**

```bash
git add mpi.html
git commit -m "feat(mpi): add mpi.html vite entry"
```

---

## Task 2：创建 dimensions.ts

**Files:**
- Create: `src/data/mpi/dimensions.ts`

- [ ] **Step 1: 创建文件**

```typescript
// src/data/mpi/dimensions.ts
import type { DimensionInfo } from '../testConfig';

export const dimensionMeta: Record<string, DimensionInfo> = {
  D1: { name: '囤货欲', model: 'HOARD 模型' },
  D2: { name: '炫耀欲', model: 'FLAUNT 模型' },
  D3: { name: '省钱欲', model: 'FRUGAL 模型' },
  D4: { name: '易种草度', model: 'SUSCEPT 模型' },
  D5: { name: '二手偏好', model: 'SECONDHAND 模型' },
  D6: { name: '直播沉迷度', model: 'LIVESTREAM 模型' },
};

export const dimensionOrder = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

// 每维度实际题数（含 gate 题计入 D6）
export const dimensionQuestionCount: Record<string, number> = {
  D1: 4, // HOARD
  D2: 3, // FLAUNT
  D3: 4, // FRUGAL
  D4: 4, // SUSCEPT
  D5: 3, // SECONDHAND
  D6: 4, // LIVESTREAM（3 主题 + 1 gate 题兼计分）
};

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  D1: {
    L: '你是购物界的极简党——用完才买下一件，家里几乎看不到"以防万一"的备用货。家徒四壁不是落魄，是你亲手管理的秩序。别人囤纸巾你嫌占地方，别人囤零食你说到期再说。',
    M: '你有基础囤货意识——纸巾洗衣液之类的家庭快消品会适度备一点，但不会买到"三年都用不完"的程度。遇到大促会补货，不遇大促也不空慌。',
    H: '你是家庭仓储总监——冰箱关不上门，厕所叠着 18 卷纸巾，柜子里的洗衣液比一家超市还齐。"多件优惠"四个字能让你丢魂，买一送一是你的精神 DNA。',
  },
  D2: {
    L: '你花了钱不说——买了新包藏在柜子里、升级装备不发朋友圈、换了手机没人知道。你觉得高调消费等于招贼、招借钱、招被议论。你的消费账单是一档永不公开的连续剧。',
    M: '你会分享"值得分享的"——偶尔发一张咖啡、一次旅行、一件新装备，但不会把每笔开销都昭告天下。你在"完全藏"和"全部晒"之间保持了一个稳定的中间带。',
    H: '你是晒货磁场——没晒的包不是包，没晒的咖啡不是咖啡。每一笔开销都在等"发朋友圈"这个最后一道工序。别人消费是买东西，你消费是把买东西变成一场表演。',
  },
  D3: {
    L: '你笃信"便宜没好货"——打折反而让你怀疑品质，满减让你警惕是不是库存尾货。你花钱的逻辑是"贵才安心"，省钱对你来说不是美德，是对自己生活的降级。',
    M: '你对价格有基础敏感——该比价会比一比，该用优惠券会用，但不会为了三块钱杀死一个下午。你在"不冤大头"和"不算得累死"之间找到了平衡。',
    H: '你是比价机器——同一件东西你能在三个平台交叉比到凌晨两点，为了省 3 块钱多花 30 分钟也在所不惜。优惠券、满减、凑单、红包、分销返现，你的电子钱包是一份运筹学练习册。',
  },
  D4: {
    L: '你是抗种草体质——别人越推你越冷笑，推荐算法在你这里失灵。笔记再诚恳、博主再真心、评论区再轰炸，你都能滑走不回头。你买东西只听自己的。',
    M: '你会被种草，但有缓冲——一条笔记打动你后你会先加购物车观察几天，确认还想要才下单。你不是完全不信外界信息，但你不让外界信息直接变成付款。',
    H: '你是种草即下单体质——博主还没说完你已经在付款页面，一条笔记到下单全程不超过两分钟。第二天你常常怀疑"我昨晚是中了什么邪"，但下周同一个场景还会重演。',
  },
  D5: {
    L: '你是新品洁癖——别人用过的东西想想就全身发痒，二手市场在你这里约等于细菌市场。你宁愿多花钱买全新，也不愿意为了省下一半买一件"不知道经过谁的手"的东西。',
    M: '你对二手保持开放态度——书、游戏、家电这类非贴身物件你会考虑二手；但衣服、内衣、床品这类贴身物你还是坚持新的。你在价值和卫生之间有自己的分界线。',
    H: '你是二手信仰者——闲鱼常驻居民，二奢直播间蹲守者。新品是交智商税，二奢才是真爱。你相信"真正懂的人都在二级市场"，每一次以一半价格拿下一件原价货都是一次胜利仪式。',
  },
  D6: {
    L: '你是直播绝缘体——"家人们""最后三分钟""321上链接"这套节奏对你完全无效。你刷到直播弹幕一秒滑走，从不停留、从不点进购物车、从不被"限时优惠"绑架。',
    M: '你会偶尔看直播，但保持清醒——主要看那些做内容/试用为主的主播，不为 PUA 节奏买单。你看直播更像看一档节目，买不买取决于产品本身，不取决于主播的催促。',
    H: '你是直播间人质——主播一句"最后三分钟"能让你忘记自己几点睡，一句"家人们冲"能让你点三次支付密码。直播间的节奏对你来说不是销售话术，是你的生命节拍器。',
  },
};
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误（或仅现有无关错误）。

- [ ] **Step 3: Commit**

```bash
git add src/data/mpi/dimensions.ts
git commit -m "feat(mpi): add 6-dimension metadata + L/M/H explanations"
```

---

## Task 3：创建 typeImages.ts 和 compatibility.ts 占位

**Files:**
- Create: `src/data/mpi/typeImages.ts`
- Create: `src/data/mpi/compatibility.ts`

- [ ] **Step 1: 创建 typeImages.ts**

```typescript
// src/data/mpi/typeImages.ts
// 首版不配自定义插画——ResultPage/TypeCard 在无图时已走 CSS 生成卡片兜底（金色币符风）。
// 后续若产出插画，按 `{ CODE: 'data:image/png;base64,...' }` 填入即可。
export const TYPE_IMAGES: Record<string, string> = {};
export const SHARE_IMAGES: Record<string, string> = {};
```

- [ ] **Step 2: 创建 compatibility.ts 占位**

```typescript
// src/data/mpi/compatibility.ts
// MVP 阶段 MPI 不启用 compat tab。MPI 主打"单人自嘲"，双人相性（"谁最容易拐你花钱 / 谁和你一起攒钱"）留作 P2。
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(_a: string, _b: string): CompatResult {
  return { type: 'normal', say: '两个消费人格在一起，要么一起剁手到破产，要么一起抠门到财富自由。' };
}
```

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 4: Commit**

```bash
git add src/data/mpi/typeImages.ts src/data/mpi/compatibility.ts
git commit -m "feat(mpi): add typeImages + compatibility stubs"
```

---

## Task 4：写 MPI 题目库（22 主题目 + 1 gate 题）

**Files:**
- Create: `src/data/mpi/questions.ts`

- [ ] **Step 1: 创建 questions.ts（完整 22 + 1）**

> **设计原则**：每题 4 选项，value 分布 1/2/3/4，但**不强制单调递增**（为了贴近真实消费场景的自嘲感）。**禁用金融关键词**（信用卡/借贷/分期/花呗/白条/蚂蚁/京东金条），这些词已在 plan 文案里整体避开。

```typescript
// src/data/mpi/questions.ts
import type { Question } from '../testConfig';

export const questions: Question[] = [
  // ===== D1 HOARD 囤货欲（L=极简，H=囤货本能） 4 题 =====
  {
    id: 'hoard1', dim: 'D1',
    text: '打开购物车，你的常态是？',
    options: [
      { label: '塞了 30 多件，打算某天清空但永远没那天', value: 4 },
      { label: '5 件左右，最近想买的才会放', value: 3 },
      { label: '基本是空的，要买就直接付款', value: 2 },
      { label: '我没有购物车，买完就走', value: 1 },
    ],
  },
  {
    id: 'hoard2', dim: 'D1',
    text: '家里的纸巾/洗衣液/日用品常备量是？',
    options: [
      { label: '够用三年的那种，仓储级', value: 4 },
      { label: '多备几件，免得临时没', value: 3 },
      { label: '一包备用就够，用完再买', value: 2 },
      { label: '用完才买，"备着"对我是多余', value: 1 },
    ],
  },
  {
    id: 'hoard3', dim: 'D1',
    text: '看到"买二送一/第二件半价"，你的反应？',
    options: [
      { label: '立刻凑单，不买就亏', value: 4 },
      { label: '本来要买一件，就顺手凑个单', value: 3 },
      { label: '看是不是真的需要两件，再决定', value: 2 },
      { label: '这种套路我从不接招', value: 1 },
    ],
  },
  {
    id: 'hoard4', dim: 'D1',
    text: '刚搬家，家里空荡荡，你的反应？',
    options: [
      { label: '按博主清单一口气配齐氛围感', value: 4 },
      { label: '每周添一两样，慢慢有家的味道', value: 3 },
      { label: '先去二手平台淘，能省一半', value: 2 },
      { label: '一张床一张桌子，够用就行', value: 1 },
    ],
  },

  // ===== D2 FLAUNT 炫耀欲（L=消费黑户，H=晒货磁场） 3 题 =====
  {
    id: 'flaunt1', dim: 'D2',
    text: '刚入手一件心仪很久的大件（包/鞋/装备），你的反应？',
    options: [
      { label: '立刻发朋友圈，不发等于白买', value: 4 },
      { label: '拍照留念，偶尔分享给懂的人', value: 3 },
      { label: '发给对象或闺蜜看一眼就行', value: 2 },
      { label: '低调藏起来，怕被借怕被议论', value: 1 },
    ],
  },
  {
    id: 'flaunt2', dim: 'D2',
    text: '朋友问你"这件多少钱"，你会？',
    options: [
      { label: '大方说出真实价格，甚至会加个"还挺值"', value: 4 },
      { label: '说个大致范围，留一点模糊', value: 3 },
      { label: '往低里说，怕显得张扬', value: 2 },
      { label: '含糊过去，"不贵/随便买的"', value: 1 },
    ],
  },
  {
    id: 'flaunt3', dim: 'D2',
    text: '一顿不错的饭，你会？',
    options: [
      { label: '拍图修图发三条平台，定位精确到门店', value: 4 },
      { label: '拍一张发朋友圈', value: 3 },
      { label: '吃就是吃，拍照留给朋友', value: 2 },
      { label: '从不拍吃的，吃完就走', value: 1 },
    ],
  },

  // ===== D3 FRUGAL 省钱欲（L=贵感依赖，H=比价机器） 4 题 =====
  {
    id: 'frugal1', dim: 'D3',
    text: '同一件东西，三个平台价格有差，你会？',
    options: [
      { label: '三家交叉比到凌晨，必须买到最低', value: 4 },
      { label: '比两家，差不了太多就下单', value: 3 },
      { label: '顺手选一家就付了', value: 2 },
      { label: '懒得比，贵就贵一点我信品牌', value: 1 },
    ],
  },
  {
    id: 'frugal2', dim: 'D3',
    text: '一件 100 块的东西打折变成 60 块，你的反应？',
    options: [
      { label: '立刻下单，不买就错过一个亿', value: 4 },
      { label: '看看本来要不要，要的话就买', value: 3 },
      { label: '犹豫一下，便宜有便宜的理由吧', value: 2 },
      { label: '反而不敢买了，怕是库存尾货/有问题', value: 1 },
    ],
  },
  {
    id: 'frugal3', dim: 'D3',
    text: '超市里同一款商品，临期打 5 折，你会？',
    options: [
      { label: '立刻拿两份，省一半爽翻', value: 4 },
      { label: '拿一份，吃完再说', value: 3 },
      { label: '偶尔会，看心情', value: 2 },
      { label: '不会，临期的总觉得不新鲜', value: 1 },
    ],
  },
  {
    id: 'frugal4', dim: 'D3',
    text: '凑满减你的常规操作？',
    options: [
      { label: '精算到小数点，凑到一分不差', value: 4 },
      { label: '简单凑一下，不强求最优', value: 3 },
      { label: '能凑就凑，凑不上就算', value: 2 },
      { label: '不玩这种套路，直接付', value: 1 },
    ],
  },

  // ===== D4 SUSCEPT 易种草度（L=抗种草，H=种草即下单） 4 题 =====
  {
    id: 'suscept1', dim: 'D4',
    text: '刷到一条"真的巨好用"的种草笔记，你的反应？',
    options: [
      { label: '已经在付款页面了', value: 4 },
      { label: '先加购物车观察两天', value: 3 },
      { label: '存个图，有空再说', value: 2 },
      { label: '越说好我越怀疑，滑走', value: 1 },
    ],
  },
  {
    id: 'suscept2', dim: 'D4',
    text: '博主真诚推荐的"平价替代"，你会？',
    options: [
      { label: '立刻买来试，博主不会骗我', value: 4 },
      { label: '搜一下评价再决定', value: 3 },
      { label: '看看就好，自用的我有信任款', value: 2 },
      { label: '这类广告我一眼就能识破', value: 1 },
    ],
  },
  {
    id: 'suscept3', dim: 'D4',
    text: '双 11 凌晨你通常在做什么？',
    options: [
      { label: '盯表跨零点，购物车已预演三遍', value: 4 },
      { label: '刷直播间抢满减', value: 3 },
      { label: '简单加两件想了很久的必需品', value: 2 },
      { label: '睡觉，双 11 已经连续骗我七年了', value: 1 },
    ],
  },
  {
    id: 'suscept4', dim: 'D4',
    text: '一条只有 30 秒的短视频，种了一件小玩意儿的草，你会？',
    options: [
      { label: '立刻下单，"不贵就试一下"', value: 4 },
      { label: '想想有点冲动，先冷静一天', value: 3 },
      { label: '截个图留着，大多数后来就忘了', value: 2 },
      { label: '这种东西买回来就是积灰', value: 1 },
    ],
  },

  // ===== D5 SECONDHAND 二手偏好（L=新品洁癖，H=二手信仰） 3 题 =====
  {
    id: 'secondhand1', dim: 'D5',
    text: '想买一件原价 3000 的大件，二手平台有 1500 的九五新，你会？',
    options: [
      { label: '立刻下单，原价就是交智商税', value: 4 },
      { label: '研究一下成色，没问题就买', value: 3 },
      { label: '有点犹豫，二手到底靠不靠谱', value: 2 },
      { label: '不考虑，别人用过的我不想要', value: 1 },
    ],
  },
  {
    id: 'secondhand2', dim: 'D5',
    text: '你对二手奢侈品的态度？',
    options: [
      { label: '常驻客户，鉴定师级别', value: 4 },
      { label: '偶尔淘，鉴定完再下单', value: 3 },
      { label: '不太了解，有点好奇但不敢买', value: 2 },
      { label: '坚决原价新品，二手即膈应', value: 1 },
    ],
  },
  {
    id: 'secondhand3', dim: 'D5',
    text: '你自己不用的东西，处理方式是？',
    options: [
      { label: '挂闲鱼回血，我是倒爷', value: 4 },
      { label: '送人/捐掉，不愿意收二手钱', value: 2 },
      { label: '扔了省心', value: 1 },
      { label: '囤着以防万一再用', value: 3 },
    ],
  },

  // ===== D6 LIVESTREAM 直播沉迷度（L=绝缘体，H=人质） 3 主题 + gate 共 4 题 =====
  {
    id: 'live1', dim: 'D6',
    text: '你刷到"最后三分钟上链接"的直播时，本能反应是？',
    options: [
      { label: '手已经在屏幕上了，反正可以退', value: 4 },
      { label: '看一眼价格，比外面便宜才下', value: 3 },
      { label: '听他 PUA 完我反而冷静', value: 2 },
      { label: '直接划走，我不吃这套', value: 1 },
    ],
  },
  {
    id: 'live2', dim: 'D6',
    text: '"家人们""宝贝们"这套话术对你？',
    options: [
      { label: '听着很亲切，真的会下单', value: 4 },
      { label: '听多了有点麻，偶尔还是会买', value: 3 },
      { label: '觉得油腻但不影响判断', value: 2 },
      { label: '听到就想退出，生理反感', value: 1 },
    ],
  },
  {
    id: 'live3', dim: 'D6',
    text: '直播间的购物节奏让你？',
    options: [
      { label: '肾上腺素飙升，错过就是亏', value: 4 },
      { label: '会紧张一下，但会先冷静两秒', value: 3 },
      { label: '没感觉，该买就买', value: 2 },
      { label: '反感这种焦虑贩卖', value: 1 },
    ],
  },
];

export const specialQuestions: Question[] = [
  // Gate 题同时兼 LIVESTREAM 维度计分（spec §6 注明 LIVESTREAM 3 题 + gate 1 题）
  // 选 D (value=1) + FRUGAL 为 L → 触发 ZERO$
  {
    id: 'mpi_gate', special: true, kind: 'gate', dim: 'D6',
    text: '上一次认真买点什么给自己是什么时候？',
    options: [
      { label: '就是刚才/今天', value: 4 },
      { label: '这周/这个月', value: 3 },
      { label: '三个月前，想不起来具体什么', value: 2 },
      { label: '我真的想不起来了', value: 1 },
    ],
  },
];
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。

- [ ] **Step 3: Commit**

```bash
git add src/data/mpi/questions.ts
git commit -m "feat(mpi): add 22 money-behavior questions + mpi_gate"
```

---

## Task 5：写 MPI 类型库（18 常规 + ZERO$ 隐藏 + MIXDR 兜底）

**Files:**
- Create: `src/data/mpi/types.ts`

> **四段式**：**镜像吐槽 / 天赋优势 / 隐秘代价 / 一句刺痛你的话**（spec §5.4）。辛辣但只刺"行为"不刺"身份"——不写"你没钱"，写"你算得太细反而更累"。
>
> **禁用词清单（Task 18 扫描基准）**：信用卡/借贷/分期/花呗/白条/蚂蚁/京东金条/穷鬼（作身份标签）/底层/低端/破产（作身份标签）。

- [ ] **Step 1: 创建 types.ts 完整 20 条**

```typescript
// src/data/mpi/types.ts
import type { TypeDef, NormalType, RarityInfo } from '../testConfig';

/* =============================================================
 * TYPE_LIBRARY — 18 常规 + 1 隐藏(ZERO$) + 1 兜底(MIXDR)
 * ============================================================= */

export const TYPE_LIBRARY: Record<string, TypeDef> = {
  'LIVE!': {
    code: 'LIVE!', cn: '直播间人质', intro: 'The Livestream Hostage',
    desc: '你不是在看直播，你是被直播绑架了。主播一句"最后三分钟"能让你忘记自己几点睡；一句"家人们冲"能让你点三次支付密码。"321上链接"是你的生命节拍器，弹幕和满减券是你的多巴胺。你对"错过"两个字的恐惧超过对"多买"的警惕。\n\n天赋优势：你行动力惊人——别人还在犹豫，你已经付款；你对节奏和氛围极度敏感，这让你在其他场景里也容易被打动、被感染；你用"限时"换来的那一刻爽感是真实的，不需要被审判。\n\n隐秘代价：你的退货记录长得像一条河，快递员都认识你；真正想了很久的大件你反而一直没买，只有直播间的冲动购物填满了你的账单；你开始分不清"我真的需要这个"和"主播让我觉得需要这个"。\n\n一句刺痛你的话：321 上链接是你的生命节拍器，可惜那个节拍器从来不是你自己的心跳。',
  },
  '2HAND': {
    code: '2HAND', cn: '二奢鉴定师', intro: 'The Luxury Appraiser',
    desc: '你不是买包，你是给自己开了一个鉴宝栏目。闲鱼直播间蹲守、二奢鉴定证书研究、成色五金角磨痕迹分析——每一件二手包都是你的一场小型考古。你相信真正懂的人都在二级市场，原价对你来说等于"不懂行的税"。\n\n天赋优势：你的眼光被训练得惊人精准——一张图就能识别真假，一个对比就能判断溢价；你用一半价格拿到了别人全价的包，这种胜利感是任何新品开箱都给不了的；你在二级市场建立了自己的信息壁垒。\n\n隐秘代价：你花在"鉴定和比对"上的时间够你读完一本书；你对任何原价新品都条件反射地"不值"，开始错过"即时满足"这件事本身的价值；你积累的包多到开始需要一个独立柜子，但你永远说"我还差一只"。\n\n一句刺痛你的话：你鉴定了全世界的真假，唯独没鉴定一下自己到底需要几只包。',
  },
  HAULX: {
    code: 'HAULX', cn: '剁手永动机', intro: 'The Haul Machine',
    desc: '你不是在消费，你是在执行一个永不停机的 KPI。工作日小额高频，周末大额集中，节日全场清空购物车——你的付款记录像一份连续签到打卡表。你没有"不买"这个选项，只有"买什么"的选择题。\n\n天赋优势：你对新东西永远保持新鲜感，生活有一种持续的期待——下一个快递就是下一个惊喜；你消费决策极快，不纠结不拖延；你用源源不断的物品给自己的日常续命，哪怕大部分最后只是一次性的多巴胺。\n\n隐秘代价：你收到快递时的快乐比使用商品时还大——拆箱就是终点，之后它们大多闲置；你开始囤到"新的拆箱盖住旧的拆箱"，家里已经不需要更多东西了，但你停不下来；你每月对账时一身冷汗，下个月依然继续。\n\n一句刺痛你的话：你不是在消费，你是在用付款键续命，而续的不是生活，是那一秒钟的肾上腺素。',
  },
  CHEAP: {
    code: 'CHEAP', cn: '省钱大师', intro: 'The Frugal Maestro',
    desc: '你算优惠算到博士毕业——三家平台交叉比价 40 分钟，优惠券叠加到小数点后两位，凑单精算到一分不差。你相信"省下的就是赚到的"，哪怕为了省 3 块钱多花 30 分钟，你也觉得值。\n\n天赋优势：你对数字和规则的敏感度碾压平均水平，你的"价格雷达"永远在线；你不会被花哨文案打动，你只相信到手价；你在消费主义狂飙的时代保留了一份少见的算账能力，这是硬本事。\n\n隐秘代价：你花在"省钱"上的时间本身就是一份隐形成本，你自己的时薪其实远高于你省下的那几块钱；你开始害怕原价购物，哪怕真的急用也要强行等一波促销；你的消费决策越来越慢，直到有些想要的东西你自己都忘了为什么想要。\n\n一句刺痛你的话：你算优惠算到博士毕业，时间全搭进去，钱没省下多少，命倒搭进去了。',
  },
  GOLDN: {
    code: 'GOLDN', cn: '黄金囤户', intro: 'The Gold Hoarder',
    desc: '金价波动两毛都能让你心脏起搏器停一拍。你对黄金的研究深度远超对股票——金店门店每日价、古法工艺溢价、硬金工费差、按克还是按件——你心里有一张随时更新的黄金资产表。你把黄金当成了一种人格延伸。\n\n天赋优势：你对保值资产的敏感度极高，你在这个不确定的时代为自己找到了一种心理锚点；你的消费不是纯粹的消费，而是一种自我保护机制；你在这件事上的专注力可以说是一种认知优势。\n\n隐秘代价：你越买越焦虑——每次金价涨你想再买怕错过，每次金价跌你心疼刚买的；你把"资产增值"的逻辑套进了生活中其他消费，渐渐失去"为喜欢买单"的松弛；你抽屉里的金条越来越多，但你好像没有因此更安心，只是更紧张了。\n\n一句刺痛你的话：你囤的每一克黄金都在替你应对焦虑，可惜焦虑不会因为克数增加而减少。',
  },
  SETUP: {
    code: 'SETUP', cn: '消费降级打工人', intro: 'The Downshifter',
    desc: '你不是不想买，是一想到房租就默默关掉付款页。你在外卖 20 块档位反复选，在精品咖啡和速溶之间天人交战，在想要的和负担得起的之间自我调节。你把"降级"过成了一种成熟。\n\n天赋优势：你对真实需要和面子需求的分辨能力高于常人；你在有限预算里的创造力惊人——一碗面可以做出三种吃法，一件衣服可以穿出四个搭配；你对生活的掌控感来自"我能把钱花在刀刃上"这份踏实。\n\n隐秘代价：你偶尔会因为朋友的一句"你最近怎么不吃这家了"而尴尬；你开始对"想要"这件事自我审查，连一杯超出预算 5 块的咖啡都要在心里开会半小时；你用理性压住了欲望，但欲望不会消失，只是被推到了更深的地方。\n\n一句刺痛你的话：你降级的不是消费，是对自己说"我值得"的勇气。',
  },
  NUBOY: {
    code: 'NUBOY', cn: '无用好物收藏家', intro: 'The Curio Collector',
    desc: '家里的氛围感单品比你本人更有人生。香薰蜡烛、黄铜小摆件、手工陶杯、复古胶片相机、某设计师品牌的小风扇——你买的每一件都有故事，只是那些故事大多与实际功能无关。你把生活过成了一本精心布置的展览。\n\n天赋优势：你的审美在线，家里任何一个角落都能随手出片；你对"质感"的追求让你在消费主义泥沼里保持了一点仪式感；你相信氛围就是生活的一部分，这让你在平凡日子里为自己创造了许多微小的喘息。\n\n隐秘代价：你收的这些东西 80% 根本不用——蜡烛从没点过、相机从没装过胶卷、陶杯只用来摆着；你为了维持"氛围"开始为消费找理由；你家已经快装不下新一批"氛围感"了，但你还是会在下一次逛小店时带一个回家。\n\n一句刺痛你的话：你买了一屋子的氛围感，只是氛围感里那个真正生活的人一直缺席。',
  },
  LUXUR: {
    code: 'LUXUR', cn: '精致中产', intro: 'The Fragile Curator',
    desc: '你负担得起的一切都在摇摇欲坠的平衡上。轻奢包、健身房年卡、手冲咖啡豆、一年三次的短途旅行、一套还能打理的护肤仪式——你把日子过得像杂志内页，但每个月账单来的那一天你都会心跳加速三秒。\n\n天赋优势：你的生活品味在同龄人里明显高出一档，你对"体面"的定义清晰且稳定；你有极强的节奏管理能力——哪个月可以多花、哪个月要勒紧，你自己心里有表；你用有限资源经营出了一种让人羡慕的质感。\n\n隐秘代价：你的"体面"其实是一份全职工作——你每时每刻都在维持它，一旦松口就崩塌；你对突发开支（生病/家里急事/换工作）的心理耐受度其实很低；你开始为了维持朋友圈里的自己，而不是为了自己而消费。\n\n一句刺痛你的话：你负担得起的一切都在摇摇欲坠的平衡上，而你比谁都清楚——一阵风就能把它吹散。',
  },
  BILIB: {
    code: 'BILIB', cn: '比价大师', intro: 'The Price Comparator',
    desc: '一件 39.9 的东西你要从三个平台比到凌晨两点。淘宝、京东、拼多多、抖音、品牌小程序、会员店——你打开了 7 个页面就为了确认"这家真的是全网最低"。你不是抠门，你只是对"被坑"这件事有一种生理性不适。\n\n天赋优势：你的信息处理能力惊人，任何一件商品你都能在十分钟内扫清全网价；你从不冲动消费，你的每一笔支出都有数据支撑；你对"价格陷阱"的识别度高到一般商家在你面前不敢出招。\n\n隐秘代价：你比价比到的那几块钱差价，时薪算下来你其实倒贴；你对"即时决策"逐渐丧失能力——买一瓶水你都要先看一眼隔壁便利店；你享受的其实不是省下的钱，是"我没被宰"这份胜利感，而这份胜利感的代价是你每次消费都要打一场小仗。\n\n一句刺痛你的话：你为了证明自己没被宰，把每一次买东西都变成了一场没有奖品的胜利。',
  },
  'FOMO+': {
    code: 'FOMO+', cn: '双11赌徒', intro: 'The FOMO Gambler',
    desc: '每到购物节你就进入人生赌场模式，跨零点是你的走火入魔时刻。双 11、618、黑五、年货节、38 节、七夕专场——你对"限时"两个字的反应比对钱还敏感。购物车在节前三天被你演练了 N 遍，付款的那一秒你有一种小小的 all-in 快感。\n\n天赋优势：你对时机的敏感度很高，你在任何需要"窗口期决策"的场景下都反应极快；你擅长为"最大限度利用规则"做功课，优惠券叠加、限时折扣、跨店满减你都能组合出最优解；你的购物节都能讲出一段"战果汇报"。\n\n隐秘代价：你在非购物节期间会有一种奇怪的"戒断反应"——你不饿，但想付款；你买回来的东西一半在之后的一年里没拆封；你开始混淆"便宜"和"想要"——你分不清这一单究竟是因为你真的需要，还是因为你已经养成了"购物节必须下单"的仪式感。\n\n一句刺痛你的话：你在购物节里豪赌，可赌桌上没有赢家——只有下一场购物节。',
  },
  GIFTR: {
    code: 'GIFTR', cn: '纪念日焦虑患者', intro: 'The Anniversary Stresshead',
    desc: '谈恋爱最大支出不是饭钱，是"这次送什么才不会被骂"。情人节、七夕、圣诞、对方生日、在一起纪念日、认识纪念日、第一次约会纪念日——你对每一个需要送礼的节点都有一份 Excel。别人谈恋爱是快乐，你谈恋爱是项目管理。\n\n天赋优势：你的情感投入有形、有仪式、有留痕——你让对方感受到的爱是具体的、是可以拆包装的；你对时间节点和情绪时刻的敏感度极高，你是关系里那个"从不忘事"的人；你把"用心"变成了一种可以复现的流程。\n\n隐秘代价：你送的每一份礼物都带着"不能比去年差"的压力，礼物预算年年上涨；你开始担心"如果这次不够有心对方会怎么想"而不是"这次想送 TA 什么"；你把爱情过成了一份 KPI，浪漫被流程替代，你自己偶尔也觉得累。\n\n一句刺痛你的话：你每一份礼物都用心，可你心里装的不是对方，是"别出错"这三个字。',
  },
  RETRN: {
    code: 'RETRN', cn: '退货专家', intro: 'The Return Pro',
    desc: '你的收货地址常年挂着"退回寄件人"的艺术品气息。试穿、试用、试色、试手感——你把"七天无理由"用到了极致。下单对你来说不是结束，是试用期的开始；付款不代表拥有，退款才算定论。\n\n天赋优势：你对试错的成本把控极好，你敢下单是因为你敢退货；你对商品的真实触感和描述差异感有极高的识别度——你拒绝被"买家秀 vs 卖家秀"欺骗；你在消费里保留了一份罕见的"不将就"。\n\n隐秘代价：你退货的频率已经让部分商家开始标注你；你发出的每个包裹背后都有一次犹豫和一次懊悔；你开始为"退不退"自我纠结，每一次退货前都要做一次心理谈判——你以为你在筛选，其实你在消耗自己的决策力。\n\n一句刺痛你的话：你退了一屋子的东西，没退掉的是"下次还是会冲动下单"这件事。',
  },
  STEAL: {
    code: 'STEAL', cn: '羊毛党', intro: 'The Perk Hunter',
    desc: '你人生最大的乐趣不是买到，是"薅到了"的那一秒。新用户券、试用装、签到礼、邀请返现、拉新裂变、会员专属—— 你把平台当成了一个 24 小时开放的小金库，每一笔优惠到账都是一场小小的"赢了"。你对"薅"这个字的理解超过对"买"的理解。\n\n天赋优势：你对规则研究极透，任何平台的激励机制在你手里都能被拆解到每一个细节；你有一种独特的"游戏化"消费视角——薅羊毛对你来说不仅省钱，更是智力游戏；你在消费里永远处在主动进攻的一方。\n\n隐秘代价：你为了薅 5 块钱券花了 40 分钟填五个表格；你开始习惯性下载各种 APP 只为了新人券，装了 30 个又懒得注销；你的手机时间被这些"小利益"分割得支离破碎——你以为在赚，实则在把时间碎成渣。\n\n一句刺痛你的话：你薅了一辈子的羊毛，没发现被薅走的其实是你自己的时间。',
  },
  PREMM: {
    code: 'PREMM', cn: '会员狂魔', intro: 'The Member Addict',
    desc: '你的付款记录里一半是会员费，剩下一半是为了回本的消费。视频会员、电商 88 会员、外卖红包会员、奶茶月卡、健身房年卡、咖啡月卡、飞行航司里程、酒店金卡——你的每一项日常都被一张会员卡加了一层光环。\n\n天赋优势：你擅长找"长期回报型"的消费模式，不是一次性满足，而是一张卡用一年；你用会员身份给自己建立了一种"被善待"的心理锚点；你把消费规划得很像一个理财组合，这是一种生活治理能力。\n\n隐秘代价：你为了回本会员费，反过来制造了更多消费；你对"没有会员的价格"产生了生理性排斥，原价就像闯红灯；你开始分不清是你选了这些会员，还是这些会员在选你——你的周末行程表一半是由会员权益推着走的。\n\n一句刺痛你的话：你交的每一笔会员费都在承诺未来，可未来一到，你就发现自己只是在为昨天付钱。',
  },
  FLIPR: {
    code: 'FLIPR', cn: '闲鱼倒爷', intro: 'The Resell Champ',
    desc: '买得多，卖得更多，你朋友圈既是买家也是快递员。新款发售当天你在抢，第二天你在挂链接；限量联名你盯着黄牛价收，收回来再找高一档的接盘；周末你的时间一半是打包一半是对暗号。你活成了一个小型电商。\n\n天赋优势：你的商业嗅觉敏锐，你对"什么会涨""什么会砸"的判断力强过大部分买家；你在一件商品上能看到"买入"和"卖出"两个面；你把消费变成了现金流——别人是在花钱，你是在倒腾。\n\n隐秘代价：你开始为"能不能转手"决定要不要买，真正喜欢一件东西的直觉被弱化了；你的快递和发货堆在一起，家变成了半个仓库；你对自己消费的物品有一种奇怪的疏离——它们不是你的，它们只是暂时在你这里路过。\n\n一句刺痛你的话：你把每一次消费都变成生意，生意做得越来越大，属于自己的东西越来越少。',
  },
  INSTA: {
    code: 'INSTA', cn: '小众买手', intro: 'The Niche Buyer',
    desc: '你买的东西别人都没听过，这就是你买的全部理由。国内设计师品牌、独立工作室、海外小众线、大牌过气线、冷门工艺复兴款——你对"撞款"有生理性不适，你相信真正的品味在那些"你没听过"的地方。\n\n天赋优势：你的信息壁垒深厚，你知道的品牌和故事是大多数人根本接触不到的；你对潮流和反潮流都保持警惕，你不跟风也不反跟风，你有自己独立的审美轴；你是朋友里那个"真正懂"的人。\n\n隐秘代价：你开始为了"小众"而小众，一件东西一旦被热门推荐你就立刻放弃；你的预算里有一部分是在为"别人没有"的稀缺感付费，不是为了东西本身；你有时候会分不清——这件到底是我喜欢，还是因为"懂的人不多"让我觉得自己懂。\n\n一句刺痛你的话：你买的每一件都是小众，可你在意的其实不是小众，是"不要和别人一样"这件事本身。',
  },
  CHAR0: {
    code: 'CHAR0', cn: '慈善式消费', intro: 'The Sympathy Spender',
    desc: '你花的不是钱，是"对方不容易"四个字。楼下摆摊的小摊你买，路边新开的小店你进，朋友做副业发的链接你点，同事开微店你必须支持一下——你的消费账单一半是情分。你相信"我多买一点对他们很重要"。\n\n天赋优势：你有极强的共情能力，你看见的是人而不是商品；你在商业化冷漠的时代保留了一份罕见的温度；你的小额消费连接了很多微小的生计，你在做一种没有被计入经济数据的善意循环。\n\n隐秘代价：你家里囤着一堆你并不需要的东西——朋友的手作、同事的代购、楼下的手串；你开始为"拒绝会不会让人难过"而买单，而不是为"我需要"而买单；你把别人的处境背在自己身上，久了你分不清"我在帮 TA"还是"我在为自己的不忍心买单"。\n\n一句刺痛你的话：你花的每一笔"情分钱"都是善良的，只是你自己的需要永远排在队尾。',
  },
  BOSSX: {
    code: 'BOSSX', cn: '老板式挥霍', intro: 'The Boss Splurger',
    desc: '你点单从不看价，直到看账单那一刻人生定格。请客是你的默认模式，打车是最低交通工具，外卖永远点大份，酒店永远订套房——你活得像一个随时在开公司的老板，只是账户里没有公司账。"大方"是你的标签，也是你的账单。\n\n天赋优势：你在社交场合永远是最有分寸感的那一个，没人会因为 AA 问题和你闹尴尬；你对生活品质有明确的下限，你不愿意让自己苛刻；你相信"钱是赚来花的，不是攒来看的"——这份坦荡在一个充满焦虑的时代很珍贵。\n\n隐秘代价：你每个月月底都要经历一次"账单冲击"，每次都发誓下个月要稳一点，下个月依然继续；你把"阔气"过成了一种身份惯性，哪怕某段时间收入其实不匹配；你开始为了维持这份"老板感"而拒绝正视自己账户的真实水位。\n\n一句刺痛你的话：你点单从不看价，账单来的那一刻你看到的是自己正在被掏空的样子。',
  },

  /* ===== 隐藏：ZERO$ 金钱绝缘体 ===== */
  'ZERO$': {
    code: 'ZERO$', cn: '金钱绝缘体', intro: 'The Money-Immune',
    desc: '你已经跳出消费 MBTI 的游戏，因为你根本不进场。上一次认真给自己买点什么是什么时候你自己都记不清了——不是买不起，是那个"想买"的念头已经很久不出现了。购物车常年是空的，直播间划都懒得划，朋友圈里的"种草"你一条都看不进。\n\n天赋优势：你在消费主义狂轰滥炸的时代保留了一份罕见的清醒——不冲动、不跟风、不需要用付款来确认自我；你对"真实需要"有一种近乎本能的判断力；你把"少"活成了一种安稳，而不是一种匮乏。\n\n隐秘代价：你的生活可能开始缺少一些"让自己开心的小动作"——一杯咖啡、一本书、一件好看的小物——你连这些都觉得多余；你以为你在清醒，偶尔你也分不清是"真的不需要"还是"已经懒得为自己用力"；你对自己的一次"偏爱"可能比你想象中要稀少。\n\n一句刺痛你的话：你跳出了消费的游戏，只是跳得太远，连"为自己买一件开心"的那把钥匙也丢在了很远的地方。',
  },

  /* ===== 兜底：MIXDR 混合模式败家户 ===== */
  MIXDR: {
    code: 'MIXDR', cn: '混合模式败家户', intro: 'The Mixed Spender',
    desc: '你不是不爱花钱，只是每一种败家风格你都沾一点。直播间偶尔上头，二手闲鱼也逛两下，双 11 不算疯但也出手，比价能比但不执着，偶尔薅一下羊毛，偶尔也乱买一单——你是消费这门课上那种"每个知识点都懂一点，没一个能拿满分"的学生。\n\n天赋优势：你的消费风格足够松，不会被任何一种极端吞没；你的账单虽然杂但总体不失控，你对"冲动"和"理性"之间有一个稳定的来回摇摆；你在消费这件事上保持了一种自然的"活人气质"——不机械、不教条。\n\n隐秘代价：你想不起自己到底是"什么派"，算法拿你没办法，朋友问你爱好你也答不出所以然；你偶尔也会羡慕那些风格强烈的朋友——"羊毛党""精致中产""小众买手"——至少人家知道自己是谁；你在消费里保持了中庸，但中庸的代价是你没有一个能一眼辨认出你的标签。\n\n一句刺痛你的话：你什么都沾一点，可没有一种消费让你觉得"这就是我"。',
  },
};

/* =============================================================
 * NORMAL_TYPES — Pattern vectors 6 位 L/M/H
 * 维度顺序：D1 HOARD / D2 FLAUNT / D3 FRUGAL / D4 SUSCEPT / D5 SECONDHAND / D6 LIVESTREAM
 *
 * 设计原则：
 * 1. 所有 pattern 唯一（18/18 unique，plan 阶段 node 校验最小 Hamming 距离 ≥ 2）
 * 2. 相对 spec §5.1 草案，以下 6 处微调以拉开 Hamming-1 的近邻：
 *    - LIVE! 保持 HMLHLH；FOMO+ HMMHLH → MMMHLH（HOARD H→M，拉开 LIVE!）
 *    - HAULX HMLHML → HMMHLL（FRUGAL L→M + SECONDHAND M→L，拉开 RETRN）
 *    - CHEAP LLHLML → LLHLLL（SECONDHAND M→L）
 *    - BILIB LLHMML → MLHMLL（HOARD L→M + SECONDHAND M→L）
 *    - SETUP LLHLHL → LMHLHL（FLAUNT L→M）
 *    - LUXUR MHMMLM → MHMLLM（SUSCEPT M→L）
 *    - RETRN HMHHML → HLHHML（FLAUNT M→L）
 *    - STEAL MLHMML → MLHLML（SUSCEPT M→L）
 *    - PREMM HHMMLM → HHMMMM（SECONDHAND L→M）
 * 3. 保留 NUBOY HMMHMM 作为"偏中档"坐标，与 FOMO+/HAULX 拉开 2 位
 * ============================================================= */

export const NORMAL_TYPES: NormalType[] = [
  { code: 'LIVE!', pattern: 'HMLHLH' },
  { code: '2HAND', pattern: 'HHLMHL' },
  { code: 'HAULX', pattern: 'HMMHLL' },
  { code: 'CHEAP', pattern: 'LLHLLL' },
  { code: 'GOLDN', pattern: 'HHLLML' },
  { code: 'SETUP', pattern: 'LMHLHL' },
  { code: 'NUBOY', pattern: 'HMMHMM' },
  { code: 'LUXUR', pattern: 'MHMLLM' },
  { code: 'BILIB', pattern: 'MLHMLL' },
  { code: 'FOMO+', pattern: 'MMMHLH' },
  { code: 'GIFTR', pattern: 'MHMHLL' },
  { code: 'RETRN', pattern: 'HLHHML' },
  { code: 'STEAL', pattern: 'MLHLML' },
  { code: 'PREMM', pattern: 'HHMMMM' },
  { code: 'FLIPR', pattern: 'HMHMHL' },
  { code: 'INSTA', pattern: 'MHLHML' },
  { code: 'CHAR0', pattern: 'LHLHLM' },
  { code: 'BOSSX', pattern: 'HHLMLH' },
];

/* =============================================================
 * TYPE_RARITY — 视觉呈现用，后期按真实数据回填
 * ============================================================= */

export const TYPE_RARITY: Record<string, RarityInfo> = {
  'LIVE!': { pct: 9,  stars: 3, label: '常见' },
  '2HAND': { pct: 4,  stars: 4, label: '稀有' },
  HAULX:   { pct: 10, stars: 2, label: '较常见' },
  CHEAP:   { pct: 8,  stars: 3, label: '常见' },
  GOLDN:   { pct: 3,  stars: 5, label: '极稀有' },
  SETUP:   { pct: 9,  stars: 3, label: '常见' },
  NUBOY:   { pct: 6,  stars: 4, label: '稀有' },
  LUXUR:   { pct: 7,  stars: 3, label: '常见' },
  BILIB:   { pct: 8,  stars: 3, label: '常见' },
  'FOMO+': { pct: 7,  stars: 3, label: '常见' },
  GIFTR:   { pct: 5,  stars: 4, label: '稀有' },
  RETRN:   { pct: 6,  stars: 4, label: '稀有' },
  STEAL:   { pct: 6,  stars: 4, label: '稀有' },
  PREMM:   { pct: 5,  stars: 4, label: '稀有' },
  FLIPR:   { pct: 3,  stars: 5, label: '极稀有' },
  INSTA:   { pct: 3,  stars: 5, label: '极稀有' },
  CHAR0:   { pct: 4,  stars: 4, label: '稀有' },
  BOSSX:   { pct: 3,  stars: 5, label: '极稀有' },
  'ZERO$': { pct: 2,  stars: 5, label: '隐藏' },
  MIXDR:   { pct: 2,  stars: 5, label: '兜底' },
};
```

- [ ] **Step 2: Verify compile + unique pattern self-check（放到 Task 9）**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误。（真正的 pattern 重复检查在 Task 9 用 node 脚本统一做。）

- [ ] **Step 3: Commit**

```bash
git add src/data/mpi/types.ts
git commit -m "feat(mpi): add 18 types + ZERO\$ hidden + MIXDR fallback"
```

---

## Task 6：组装 MPI TestConfig

**Files:**
- Create: `src/data/mpi/config.ts`

> **关键差异**：MPI 每维度题数不等（3/4 题混合），`sumToLevel` 无法像 GSTI/FPI 那样固定阈值。解决方式：给 config 传入 `dimensionQuestionCount`，让 `matching.ts` 在算 level 时先除以该维度题数得到平均 value，再套 L/M/H。
>
> **若 `matching.ts` 当前 API 还不支持"按题数归一化"**：plan 保留两个实现路径——
> 1. **路径 A（最小改动）**：在 `config.ts` 自己实现 `sumToLevel(score, dim?)` 两参版本，并确保 `matching.ts` 在调用 `sumToLevel` 时传入 dim（若当前只传 1 参，需小改 matching.ts 一处签名）。
> 2. **路径 B（零 matching 改动）**：在 config 里按"总 score / 题数"预换算——即把 `computeResult` 入口的 `answers` 先按题数加总，然后直接比阈值。
>
> plan 采用**路径 A**：对 `matching.ts` 做最小侵入修改——把 `sumToLevel(sum)` 改为 `sumToLevel(sum, dim)`，其他 7 个测试的 config 里 `sumToLevel` 忽略第二个参数即可保持行为不变。改动点见 Task 6 Step 2。

- [ ] **Step 1: 创建 config.ts**

```typescript
// src/data/mpi/config.ts
import type { TestConfig } from '../testConfig';
import {
  dimensionMeta,
  dimensionOrder,
  dimensionQuestionCount,
  DIM_EXPLANATIONS,
} from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

// MPI 共 22 题，按维度 4/3/4/4/3/3+1(gate)。
// 按"平均每题 value"归一到 L/M/H：
//   avg ≤ 2.0      → L
//   2.0 < avg ≤ 3.0 → M
//   avg > 3.0      → H
function sumToLevel(score: number, dim?: string): string {
  const n = (dim && dimensionQuestionCount[dim]) || 4;
  const avg = score / n;
  if (avg <= 2.0) return 'L';
  if (avg <= 3.0) return 'M';
  return 'H';
}

export const mpiConfig: TestConfig = {
  id: 'mpi',
  name: 'MPI 消费人格图鉴',

  // Dimensions
  dimensionOrder,
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,

  // Questions
  questions,
  specialQuestions,
  // gate & hiddenTrigger 用同一题同一答案：mpi_gate value=1 → ZERO$ 候选
  // 最终 ZERO$ 判定还需 FRUGAL 维度为 L（由 matching.ts 的 hiddenGuard 扩展处理；
  // 若当前 matching.ts 只看 gate 单值，plan 阶段先接受"gate=D → 直接 ZERO$"的简化路径，
  // 在 Task 10 的 MpiApp 层额外做一次 FRUGAL-L 校验再确认 hiddenTriggered）
  gateQuestionId: 'mpi_gate',
  gateAnswerValue: 1,
  hiddenTriggerQuestionId: 'mpi_gate',
  hiddenTriggerValue: 1,

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
  fallbackTypeCode: 'MIXDR',
  hiddenTypeCode: 'ZERO$',
  similarityThreshold: 55,

  // URLs & Storage
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/mpi',
  localHistoryKey: 'mpi_history',
  localStatsKey: 'mpi_local_stats',
  apiTestParam: 'mpi',

  // Display text
  dimSectionTitle: '六维消费雷达',
  questionCountLabel: '22',

  // 注意：MPI 不使用 genderLocked / typePoolByGender —— 字段省略
};
```

- [ ] **Step 2: 验证 `matching.ts` `sumToLevel` 签名是否接受可选第二参**

Run: `grep -n "sumToLevel" src/utils/matching.ts | head -10`

- 如果已经是 `sumToLevel(score, dim)` → 直接跳过。
- 如果是 `sumToLevel(score)` 单参调用 → 小改一处：

```typescript
// src/utils/matching.ts — 只改一行调用
// 原：const level = config.sumToLevel(sum);
// 改为：
const level = config.sumToLevel(sum, dim);
```

同步更新 `TestConfig.sumToLevel` 类型定义（`src/data/testConfig.ts`）：

```typescript
// src/data/testConfig.ts
sumToLevel: (score: number, dim?: string) => string;
```

**其他 7 个测试的 config 里 `sumToLevel(score)` 自动忽略第二个 arg，行为不变**。

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误（含 love/work/values/cyber/desire/gsti/fpi 的 config 在新签名下兼容）。

- [ ] **Step 4: Commit**

```bash
git add src/data/mpi/config.ts src/utils/matching.ts src/data/testConfig.ts
git commit -m "feat(mpi): assemble TestConfig (no gender lock) + sumToLevel dim param"
```

---

## Task 7：创建 MPIHeroBadge 组件

**Files:**
- Create: `src/components/MPIHeroBadge.tsx`

MPI 专属视觉：模仿一张"小票/发票贴纸"，在结果页顶部展示"MPI · MONEY PERSONA" 品牌标 + 根据类型选择的 1-2 张氛围贴（"限时 3 分钟""已付款""已退货""已薅"等）。视觉走**金色 + 黑色** per spec §7.1，用通用小票符号（⁂、§、¥ 字型组合），**不模仿任何真实支付 APP UI**（spec §7.4）。

- [ ] **Step 1: 创建组件**

```tsx
// src/components/MPIHeroBadge.tsx
import { motion } from 'framer-motion';

interface MPIHeroBadgeProps {
  typeCode: string;      // e.g. 'LIVE!', 'CHEAP', 'ZERO$'
  typeCn: string;
}

/**
 * Show 1-2 contextual "小票贴纸" based on type semantics.
 * Gold-on-dark aesthetic (spec §7.1), NOT mimicking any payment UI (spec §7.4).
 */
function stickersForType(code: string): string[] {
  const base = ['MONEY PERSONA INDEX'];
  if (code === 'ZERO$')  return [...base, '暂无交易', '账户休眠中'];
  if (code === 'LIVE!')  return [...base, '限时 3 分钟'];
  if (code === 'HAULX')  return [...base, '今日消费 N 笔'];
  if (code === 'CHEAP' || code === 'BILIB') return [...base, '已省 0.01 元'];
  if (code === 'STEAL')  return [...base, '已薅'];
  if (code === 'RETRN')  return [...base, '已退货'];
  if (code === '2HAND' || code === 'FLIPR') return [...base, '二级市场出货'];
  if (code === 'GOLDN')  return [...base, '按克计价'];
  if (code === 'PREMM')  return [...base, '会员权益生效中'];
  if (code === 'BOSSX')  return [...base, '账单稍后送达'];
  if (code === 'LUXUR')  return [...base, '分期有风险·此处不提供'];
  if (code === 'SETUP')  return [...base, '已开启消费降级模式'];
  if (code === 'FOMO+')  return [...base, '跨零点秒杀'];
  if (code === 'GIFTR')  return [...base, '纪念日自动提醒'];
  if (code === 'INSTA')  return [...base, '别人没有的'];
  if (code === 'CHAR0')  return [...base, '情分已到账'];
  if (code === 'NUBOY')  return [...base, '无用但美'];
  if (code === 'MIXDR')  return [...base, '杂项消费'];
  return [...base, '已结账'];
}

export default function MPIHeroBadge({ typeCode, typeCn }: MPIHeroBadgeProps) {
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
              ? 'text-[10px] px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-400 font-bold tracking-[0.2em] uppercase border border-yellow-500/30'
              : 'text-[10px] px-2 py-1 rounded-full bg-surface/80 border border-yellow-500/20 text-yellow-200/80'
          }
        >
          {label}
        </span>
      ))}
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
git add src/components/MPIHeroBadge.tsx
git commit -m "feat(mpi): add MPIHeroBadge with invoice-sticker visual"
```

---

## Task 8：ResultPage 复用 testBadge slot（无需改动）

**Files:**
- (无文件修改；验证 FPI 已创建的 `testBadge?: ReactNode` slot 仍在)

- [ ] **Step 1: 确认 ResultPage 已支持 testBadge prop**

Run: `grep -n "testBadge" src/components/ResultPage.tsx | head -10`

Expected: 看到 `testBadge?:` 类型声明和 JSX 使用。若 FPI plan 已正确合并，MPI 直接透传即可。

若没找到（FPI 未合入主干），**fallback**：按 FPI plan Task 8 的步骤给 ResultPage 加 `testBadge` slot，不再赘述。

- [ ] **Step 2: Commit empty record**

```bash
git commit --allow-empty -m "verify: ResultPage testBadge slot reused from FPI"
```

---

## Task 9：Pattern 唯一性自检脚本

**Files:**
- Create (optional): `scripts/mpi-pattern-check.ts`

- [ ] **Step 1: 写一个一次性校验**

可直接用内联 node 脚本（需 tsx 或 ts-node），也可落盘到 `scripts/mpi-pattern-check.ts` 与 FPI 的 `fpi-pattern-check.ts` 并列。

```typescript
// scripts/mpi-pattern-check.ts
import { NORMAL_TYPES } from '../src/data/mpi/types';

const seen = new Map<string, string>();
const dupes: Array<[string, string, string]> = [];
for (const t of NORMAL_TYPES) {
  if (seen.has(t.pattern)) dupes.push([seen.get(t.pattern)!, t.code, t.pattern]);
  else seen.set(t.pattern, t.code);
}
console.log('total:', NORMAL_TYPES.length, 'unique:', seen.size, 'dupes:', dupes);

let minDist = 999;
let minPair: [string, string, number] | null = null;
for (let i = 0; i < NORMAL_TYPES.length; i++) {
  for (let j = i + 1; j < NORMAL_TYPES.length; j++) {
    let d = 0;
    for (let k = 0; k < 6; k++) {
      if (NORMAL_TYPES[i].pattern[k] !== NORMAL_TYPES[j].pattern[k]) d++;
    }
    if (d < minDist) {
      minDist = d;
      minPair = [NORMAL_TYPES[i].code, NORMAL_TYPES[j].code, d];
    }
  }
}
console.log('min hamming:', minDist, 'pair:', minPair);

if (dupes.length > 0 || minDist < 2) {
  console.error('FAIL: duplicates or hamming < 2');
  process.exit(1);
}
console.log('PASS: 18/18 unique, min hamming >= 2');
```

- [ ] **Step 2: 跑一次**

Run: `npx tsx scripts/mpi-pattern-check.ts`
Expected: `PASS: 18/18 unique, min hamming >= 2`。

**Plan 阶段已校验结果**：
- total: 18, unique: 18, dupes: []
- min hamming: 2（所有相邻对距离都 >= 2）

- [ ] **Step 3: Commit**

```bash
git add scripts/mpi-pattern-check.ts
git commit -m "verify: mpi 18 normal-type patterns are unique (min hamming 2)"
```

---

## Task 10：创建 MpiApp 顶层组件

**Files:**
- Create: `src/MpiApp.tsx`

基于现有 `src/FpiApp.tsx` 结构 copy + 改造。核心差异：
1. `computeResult` 调用前，**额外做一次 FRUGAL-L + mpi_gate=1 的联合校验**，成立则 `hiddenTriggered=true`。
2. 结果页传 `testBadge={<MPIHeroBadge ... />}`。
3. Hero 文案、免责、配色（金色渐变）。

- [ ] **Step 1: 创建组件**

```tsx
// src/MpiApp.tsx
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
import MPIHeroBadge from './components/MPIHeroBadge';
import { useQuiz } from './hooks/useQuiz';
import { useRanking } from './hooks/useRanking';
import { useLocalHistory } from './hooks/useLocalHistory';
import { encodeCompare, decodeCompare, type DecodedCompare } from './utils/compare';
import { generateQR } from './utils/qr';
import { drawShareCard, canvasToBlob } from './utils/shareCard';
import { TestConfigProvider, useTestConfig } from './data/testConfig';
import { mpiConfig } from './data/mpi/config';
import { computeResult, type ComputeResultOutput } from './utils/matching';
import { randomAnswerForQuestion } from './utils/quiz';

type ScreenId = 'home' | 'quiz' | 'interstitial' | 'result' | 'compare';

const isTestDomain = window.location.hostname.includes('sbticc-test');

/* ---------- MPI-specific Hero ---------- */

const fadeInUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

const heroGlow = css`
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(201, 162, 39, 0.08) 0%,
    transparent 70%
  );
`;

function MpiHero({ onStartTest, totalTests }: { onStartTest: () => void; totalTests: number }) {
  const displayTotal = totalTests > 0 ? totalTests.toLocaleString() : '---';

  return (
    <section
      css={heroGlow}
      className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[90vh]"
    >
      <motion.p
        {...fadeInUp(0)}
        className="text-yellow-400 font-mono font-bold text-sm tracking-widest uppercase mb-4"
      >
        MPI · MONEY PERSONA INDEX
      </motion.p>

      <motion.h1
        {...fadeInUp(0.1)}
        className="font-extrabold text-white leading-tight select-none text-4xl sm:text-5xl mb-4"
      >
        消费人格图鉴
      </motion.h1>

      <motion.div
        {...fadeInUp(0.15)}
        className="mb-6 rounded-full"
        style={{
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #c9a227, #ffd66b)',
        }}
      />

      <motion.p
        {...fadeInUp(0.2)}
        className="text-sm sm:text-base text-muted mb-3 max-w-md"
      >
        22 题 &times; 6 维度 &times; 18 种消费事故
      </motion.p>

      <motion.p
        {...fadeInUp(0.25)}
        className="text-sm text-muted mb-8 max-w-md"
      >
        你是怎么把钱输给这个世界的？
      </motion.p>

      <motion.div
        {...fadeInUp(0.3)}
        className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-surface border border-border"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
        </span>
        <span className="text-sm text-muted">
          已有 <span className="text-white font-mono font-bold">{displayTotal}</span> 人完成测试
        </span>
      </motion.div>

      <motion.button
        {...fadeInUp(0.4)}
        onClick={onStartTest}
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(201,162,39,0.25)' }}
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

/* ---------- MPI App (home + ranking; no compat MVP) ---------- */

type MpiTabId = 'home' | 'ranking';

function MpiAppInner() {
  const config = useTestConfig();
  const [activeTab, setActiveTab] = useState<MpiTabId>('home');
  const [screen, setScreen] = useState<ScreenId>('home');
  const [result, setResult] = useState<ComputeResultOutput | null>(null);
  const [compareData, setCompareData] = useState<DecodedCompare | null>(null);
  const [shareModalBlob, setShareModalBlob] = useState<Blob | null>(null);
  const [shareModalFileName, setShareModalFileName] = useState('mpi-share.png');
  const [shareModalUrl, setShareModalUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const quiz = useQuiz();
  const ranking = useRanking();
  const localHistory = useLocalHistory();

  useEffect(() => {
    ranking.fetchRanking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * MPI-specific hidden trigger guard:
   * ZERO$ requires (mpi_gate === value=1) AND (FRUGAL dim level === 'L')
   * spec §5.2 强制"FRUGAL 三题全低"，plan 层放宽为"FRUGAL 维度为 L"等价
   */
  const isHiddenTriggered = useCallback((answers: Record<string, number | number[]>): boolean => {
    const gateAns = answers['mpi_gate'];
    if (gateAns !== 1) return false;
    const frugalIds = ['frugal1', 'frugal2', 'frugal3', 'frugal4'];
    const sum = frugalIds.reduce((s, id) => {
      const v = answers[id];
      return s + (typeof v === 'number' ? v : 0);
    }, 0);
    // FRUGAL 4 题 → avg ≤ 2 即 L
    return sum / 4 <= 2.0;
  }, []);

  const autoFillAndShowResult = useCallback(() => {
    const allQs = [...config.questions, ...config.specialQuestions];
    const answers: Record<string, number | number[]> = {};
    allQs.forEach((q) => {
      answers[q.id] = randomAnswerForQuestion(q);
    });
    const res = computeResult(answers, isHiddenTriggered(answers), config, null);
    setResult(res);
    setScreen('result');
  }, [config, isHiddenTriggered]);

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
    // 调用 useQuiz 内部的 getResult 之前，先用当前 answers 重算 hidden
    // 如果 useQuiz.getResult 内部是固定走 config.hiddenTriggerQuestionId 匹配，
    // 而我们 MPI 额外需要 FRUGAL 守卫，则需要在这里手动重跑 computeResult。
    const answers = quiz.getAnswers();
    const hidden = isHiddenTriggered(answers);
    const res = computeResult(answers, hidden, config, null);
    setResult(res);
    localHistory.saveResult(res.finalType.code);
    setScreen('interstitial');
  }, [quiz, localHistory, config, isHiddenTriggered]);

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
    if (tab === 'home' || tab === 'ranking') setActiveTab(tab as MpiTabId);
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
              <MpiHero onStartTest={handleStartTest} totalTests={totalTests} />
              <div className="mx-auto max-w-2xl -mt-8 mb-14 px-5 py-3 bg-surface/40 border border-border/50 rounded-lg">
                <p className="text-xs text-muted leading-relaxed text-center">
                  <strong className="text-white">免责：</strong>
                  MPI 所有类型描述都是消费行为的戏谑梳理，仅供娱乐，不构成任何消费建议、投资建议或理财建议。请保持笑一笑就过的心态。
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
            <MPIHeroBadge
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
            className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer"
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

export default function MpiApp() {
  return (
    <TestConfigProvider config={mpiConfig}>
      <MpiAppInner />
    </TestConfigProvider>
  );
}
```

> **Note on `quiz.getAnswers()`**：FPI 的 `handleQuizSubmit` 直接调 `quiz.getResult()`。MPI 需要在 submit 时获取 raw answers 做 FRUGAL-L 守卫，因此调 `quiz.getAnswers()`（若 `useQuiz` 已暴露）或内联重跑 `computeResult`。若 `useQuiz` 尚未导出 `getAnswers`，在 `src/hooks/useQuiz.ts` 新增一行：
>
> ```typescript
> getAnswers: () => answersRef.current,
> ```
>
> 对其他 7 个测试无影响。

- [ ] **Step 2: Verify `useQuiz` 暴露 getAnswers**

Run: `grep -n "getAnswers\|getResult" src/hooks/useQuiz.ts | head -10`

- 若已有 → 跳过。
- 若无 → 在 `useQuiz` 返回对象里追加 `getAnswers: () => answers`（保持与 `getResult` 同一变量 scope）。

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误。

- [ ] **Step 4: Commit**

```bash
git add src/MpiApp.tsx src/hooks/useQuiz.ts
git commit -m "feat(mpi): add MpiApp top-level component with FRUGAL-L hidden guard"
```

---

## Task 11：vite.config.ts 新增 mpi 入口

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 在 rollupOptions.input 加 mpi**

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
        mpi: 'mpi.html',      // 新增
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
Expected: 构建成功，输出 `dist-task11/mpi.html` 和 MPI 相关 chunk。

- [ ] **Step 3: 清理临时产物**

Run: `rm -rf dist-task11`

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "feat(mpi): add mpi vite entry"
```

---

## Task 12：build.sh 复制 mpi 产物到 /new/mpi/

**Files:**
- Modify: `build.sh`

- [ ] **Step 1: 在测试复制循环里加入 `mpi`**

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
for test in love work values cyber desire gsti fpi mpi; do     # ← 追加 mpi
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

echo "Build complete: old at /, SBTI at /new/, love/work/values/cyber/desire/gsti/fpi/mpi at /new/<test>/"
```

- [ ] **Step 2: Syntax check build.sh**

Run: `bash -n build.sh && echo OK`
Expected: `OK`。

- [ ] **Step 3: 跑一次完整 build 验证产物**

Run: `./build.sh 2>&1 | tail -10`
Run: `ls dist/new/mpi/`
Expected: `index.html`。

- [ ] **Step 4: Commit**

```bash
git add build.sh
git commit -m "feat(mpi): copy mpi build artefact to /new/mpi/"
```

---

## Task 13：hub 首页（index.html）新增 MPI 卡片

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 更新 hero title & subtitle（8 → 9 个测试）**

```html
<title>人格实验室 — 9个测试，N种人格，0个正确答案</title>
<meta name="description" content="人格实验室：9款趣味人格测试，从恋爱脑到打工人，从赛博基因到朋友圈人设再到消费人格，测出你从未认识的自己。" />

<p class="hero-subtitle">9个测试，N种人格，0个正确答案</p>
```

- [ ] **Step 2: 在 tests-grid 末尾加一张 MPI 卡**

在 fpi 卡之后追加：

```html
      <a class="test-card fade-in-up" href="/new/mpi">
        <div class="card-emoji">💸</div>
        <div class="card-name">消费人格图鉴</div>
        <div class="card-tagline">你是怎么把钱输给这个世界的</div>
        <div class="card-cta">开始测试 &rarr;</div>
      </a>
```

- [ ] **Step 3: 在 CSS 动画 delay 新增第 9 张**

```css
    .test-card:nth-child(9) { animation-delay: 0.45s; }
```

- [ ] **Step 4: 更新底部 JS 的 tests 数组**

```js
      var tests = ['', 'love', 'work', 'values', 'cyber', 'desire', 'gsti', 'fpi', 'mpi'];
```

- [ ] **Step 5: 手动快速 sanity check**

Run: `grep -c "test-card fade-in-up" index.html`
Expected: `9`。

Run: `grep -n "/new/mpi" index.html`
Expected: 至少 1 行。

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(mpi): add MPI card to hub page (9 tests total)"
```

---

## Task 14：api/record.js 支持 mpi 命名空间

**Files:**
- Modify: `api/record.js`

- [ ] **Step 1: 在 VALID_TYPES_BY_TEST 加入 mpi**

```javascript
  'mpi': new Set([
    'LIVE!','2HAND','HAULX','CHEAP','GOLDN','SETUP','NUBOY','LUXUR',
    'BILIB','FOMO+','GIFTR','RETRN','STEAL','PREMM','FLIPR','INSTA',
    'CHAR0','BOSSX',
    'ZERO$','MIXDR'
  ]),
```

- [ ] **Step 2: Syntax check**

Run: `node --check api/record.js && echo OK`
Expected: `OK`。

- [ ] **Step 3: Commit**

```bash
git add api/record.js
git commit -m "feat(mpi): whitelist mpi type codes in record API"
```

---

## Task 15：api/ranking.js 支持 mpi（mock + hidden）

**Files:**
- Modify: `api/ranking.js`

- [ ] **Step 1: 在 MOCK_TYPES_BY_TEST 加入 mpi**

```javascript
  mpi: [
    'LIVE!','2HAND','HAULX','CHEAP','GOLDN','SETUP','NUBOY','LUXUR',
    'BILIB','FOMO+','GIFTR','RETRN','STEAL','PREMM','FLIPR','INSTA',
    'CHAR0','BOSSX',
    'ZERO$','MIXDR',
  ],
```

- [ ] **Step 2: 在 HIDDEN_TYPE_BY_TEST 加入 mpi**

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
  mpi: 'ZERO$',      // 新增
};
```

- [ ] **Step 3: Syntax check**

Run: `node --check api/ranking.js && echo OK`
Expected: `OK`。

- [ ] **Step 4: Commit**

```bash
git add api/ranking.js
git commit -m "feat(mpi): add mpi to ranking mock types + hidden type map"
```

---

## Task 16：App.tsx（SBTI 主站）加 MPI 跨测试引流卡（跳过）

**Files:**
- Modify: `src/App.tsx`（不做）

> 与 FPI plan 同样决策：SBTI 主站已有 GSTI 导流卡，再加 MPI 会让主页过长。MPI 的主要导流来自 hub 首页（/new）和朋友圈/小红书冷启动，不需要 SBTI 主站再开一张卡。

- [ ] **Step 1: 决策：跳过不加**

不修改 `src/App.tsx`。

- [ ] **Step 2: Commit empty record**

```bash
git commit --allow-empty -m "decide: skip MPI cross-promo card on SBTI main site for MVP"
```

---

## Task 17：Pattern + 答题 smoke（用 #test 自动填答）

**Files:**
- (无文件修改，仅验证)

- [ ] **Step 1: dev 启动**

Run: `npm run dev`

- [ ] **Step 2: 浏览器访问 `#test` auto-fill**

打开：`http://localhost:5173/mpi.html#test`
Expected: 直接跳到结果页，类型为 18 个常规之一（大概率不是 `ZERO$`/`MIXDR`）。

- [ ] **Step 3: 多 reload 10 次**

每次刷新查看 result type，记录结果分布。
Expected: 多样的类型都能命中，不集中在某一个 code。

> **注意**：FPI plan Task 17 暴露过 `randomAnswerForQuestion` bug（假设 options 单调递增导致全塌 SUBMR）。MPI plan 的 secondhand3 题是 `H-L-L-M` 非单调，若 FPI 修复（`Math.max(...options.map(o => o.value))`）未合并，需重做。

- [ ] **Step 4: 手动走一次 ZERO$ 路径**

关闭 `#test`，正常走入 `quiz` overlay：
1. 把 FRUGAL 四题（frugal1/2/3/4）**全选 D（value=1）**或 value≤2 的选项，保证 FRUGAL 维度落在 L 档。
2. mpi_gate 选 D（`我真的想不起来了`, value=1）。
3. 其他题随意。
4. Expected: 结果为 `ZERO$`。

再走一次对比测试：
1. FRUGAL 四题随便选，不全是低档。
2. mpi_gate 选 D。
3. Expected: 结果**不是** `ZERO$`（FRUGAL-L 守卫生效）——正常走 pattern 匹配。

- [ ] **Step 5: 检查海报生成**

结果页点"分享"，应能生成一张 PNG。
Expected: 海报包含类型中文名 + 金色雷达图 + QR。无乱码。

- [ ] **Step 6: Commit**

```bash
git commit --allow-empty -m "verify: mpi #test smoke + ZERO\$ hidden + FRUGAL guard + share card"
```

---

## Task 18：敏感词 & 合规自检（含金融关键词扫描）

**Files:**
- Modify（可能）: `src/data/mpi/types.ts`, `src/data/mpi/questions.ts`, `src/components/MPIHeroBadge.tsx`

- [ ] **Step 1: 金融关键词扫描（spec §10 平台限流金融广告线）**

```bash
grep -nE "信用卡|借贷|分期|花呗|白条|蚂蚁|京东金条|网贷|小额贷|信用分|芝麻信用|微粒贷" \
  src/data/mpi/types.ts src/data/mpi/questions.ts src/components/MPIHeroBadge.tsx src/MpiApp.tsx mpi.html
```

Expected: **完全无命中**。金融关键词对平台投放极度敏感，一经发现必须删除或改写。

**例外**：`MPIHeroBadge` 的 LUXUR 分支有一条 `'分期有风险·此处不提供'` sticker —— 这是反向声明（"不提供分期服务"），但仍命中"分期"关键词。**Task 18 要求改写**为：`'本测试不提供任何消费建议'` 或 `'仅供娱乐'`。

- [ ] **Step 2: 应用 Step 1 改动**

编辑 `src/components/MPIHeroBadge.tsx`，把 LUXUR 分支改为：

```tsx
if (code === 'LUXUR')  return [...base, '仅供娱乐，不提供消费建议'];
```

再跑一次扫描：

```bash
grep -nE "信用卡|借贷|分期|花呗|白条|蚂蚁|京东金条|网贷|小额贷|信用分|芝麻信用|微粒贷" \
  src/data/mpi/types.ts src/data/mpi/questions.ts src/components/MPIHeroBadge.tsx src/MpiApp.tsx mpi.html
```

Expected: 无命中。

- [ ] **Step 3: 一般性禁用词扫描（与 FPI 同套）**

```bash
grep -nE "穷鬼|低端|底层|老登|小仙女|妓|娼|婊|贱|日你|草你|傻逼|智障" \
  src/data/mpi/types.ts src/data/mpi/questions.ts
```

Expected: 无命中。（plan 阶段已避开，"穷鬼"作为 spec §8.2 例举的"小红书话术"时只出现在文档，不出现在代码。）

- [ ] **Step 4: 品牌/主播/平台实名扫描（spec §1.4 + §9）**

```bash
grep -nE "淘宝|京东|拼多多|抖音|快手|小红书|李佳琦|李子柒|薇娅|辛巴|罗永浩|东方甄选|与辉同行" \
  src/data/mpi/types.ts src/data/mpi/questions.ts
```

Expected: **完全无命中**。spec 明令全文禁止出现真实品牌/主播/平台名。plan 文案已避开。

> 例外说明：`suscept3` 题提到"双 11 凌晨"；"双 11" 是行业通用节日名词（非品牌），允许保留。

- [ ] **Step 5: 阶层对立审计（spec §9）**

通读 20 条 type desc，确认：
- 没写"穷人/有钱人"对立
- 没写"精致 vs 土"
- 没写"底层/上流/精英专属"
- 没写职业污名（打工人 作身份标签使用时允许，但必须是自嘲而非贬低；SETUP 的"消费降级打工人"沿用 spec 原词，自嘲式）
- 没写地域/年龄/性别歧视

Expected: 全部通过。

- [ ] **Step 6: 未成年人警示（spec §9.1 + §11）**

首页免责已在 Task 10 `MpiAppInner` 里写入："MPI 所有类型描述都是消费行为的戏谑梳理，仅供娱乐，不构成任何消费建议、投资建议或理财建议。"

视需要补一句显眼警示：

```tsx
// MpiAppInner 的免责 div 追加一句
<p className="text-xs text-yellow-400/80 mt-2 leading-relaxed text-center">
  本测试仅供成年人自嘲娱乐，不构成任何消费、理财、投资建议。
</p>
```

- [ ] **Step 7: 视觉合规（spec §7.4 禁止仿真实支付 APP UI）**

打开 `src/components/MPIHeroBadge.tsx` + 分享海报模板，确认：
- 没有模仿支付宝/微信支付的绿色勾选动画
- 没有仿真人民币 / 美元 / 支付成功 UI
- 金色 + 黑色是通用美学，不构成任何特定 APP 仿冒

Expected: `MPIHeroBadge` 用通用 pill/chip，金色边框无 logo。

- [ ] **Step 8: Commit**

```bash
git add src/components/MPIHeroBadge.tsx src/MpiApp.tsx
git commit -m "chore(mpi): sensitive word + financial keyword + brand audit pass"
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
Expected: 构建成功；`dist/new/mpi/index.html` 存在；`dist/new/assets/mpi-*.js` chunk 存在。

- [ ] **Step 3: `npm run preview` smoke**

Run: `npm run preview &`
打开: `http://localhost:4173/new/mpi.html`

完整走一遍：
- [ ] 首页 → 开始测试
- [ ] 走完 22 + gate 题（FRUGAL 不全低，gate 不选 D）→ 结果为 18 常规之一
- [ ] 重测 → FRUGAL 全低 + gate 选 D → 结果为 `ZERO$`
- [ ] 再重测 → 极端分布 → 偶发 `MIXDR`（similarity < 55 时）
- [ ] 分享卡 → MPIHeroBadge 的 stickers 正确显示，金色边框
- [ ] 排行榜 tab → 无崩溃、显示 mock 数据

- [ ] **Step 4: 关闭 preview**

Run: `pkill -f 'vite preview'`

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "verify: mpi build + preview smoke pass"
```

---

## Task 20：部署前最后清单

**Files:**
- (无文件修改；清单)

- [ ] **Step 1: 人工清单**

- [ ] `mpi.html` 的 title / OG tags 不含占位文字（Task 1）
- [ ] 18 个类型 desc 无错别字、无敏感词、无金融词（Task 18）
- [ ] 22 题目无 typo（Task 4）
- [ ] Gate 触发 `ZERO$` 路径走通（Task 17）
- [ ] FRUGAL-L 守卫生效（只有 gate=D 但 FRUGAL 不是 L 时不触发 ZERO$）
- [ ] 分享海报 + MPIHeroBadge 正确渲染（Task 19）
- [ ] Hub 首页 MPI 卡可点（Task 13）
- [ ] API record / ranking 对 `mpi` 命名空间生效（Task 14/15）
- [ ] `./build.sh` 成功产出 `dist/new/mpi/index.html`（Task 19）

- [ ] **Step 2: 推送部署**

```bash
git push origin feat/mpi-money-persona    # plan 预期所在分支
# 或 user 已 merge 到 main 后：
# git push origin main
```

- [ ] **Step 3: Vercel 侧**

- 等 Vercel 自动构建完成
- 访问 `https://sbti.jiligulu.xyz/new/mpi` 确认 HTML 正确 render
- 若 rewrite 规则没命中（参考 GSTI/FPI 的 `vercel.json` 修复经验），为 `/new/mpi` 和 `/new/mpi/(.*)` 各加一条 rewrite 到 `/new/mpi/index.html`

- [ ] **Step 4: API smoke（线上）**

```bash
curl -X POST https://sbti.jiligulu.xyz/api/record \
  -H 'Content-Type: application/json' \
  -d '{"type":"LIVE!","test":"mpi"}'
# Expected: {"ok":true,"total":...}

curl "https://sbti.jiligulu.xyz/api/ranking?test=mpi"
# Expected: 含 LIVE! / 2HAND / CHEAP 等 mpi 命名空间的 mock ranking
```

- [ ] **Step 5: 24h 监控**

- 访问量、QPS、Upstash 写入速率
- 评论区是否出现"炫富/羞辱穷人"负面引导——如有立刻发"测试是梗，别当真"温馨提示
- 是否被平台（抖音/小红书/微博）判定为金融广告违规——若有，立即下线并复查金融关键词

- [ ] **Step 6: Commit empty record**

```bash
git commit --allow-empty -m "ship(mpi): deploy + smoke checklist done"
```

---

## 自审检查点

- 20 个任务覆盖 MPI spec 第 1-10 章所有 P0 / P1 项。
- 每个任务含绝对文件路径、完整代码（无 placeholder）、verification、commit message。
- 18 个 pattern 在 plan 阶段已 node 脚本校验：**18/18 unique，min Hamming = 2**（相对 spec 草案微调 6 处）。
- MPI 不用 `genderLocked`，`computeResult` 走 4 参稳定签名，不破坏其他 8 个测试。
- **ZERO$ 触发守卫升级**：gate=D + FRUGAL-L 双条件，避免"随便一个 D 就变金钱绝缘体"误触。
- `MPIHeroBadge` 用金色 pill/chip 视觉，规避任何支付 APP 仿冒（spec §7.4）。
- **金融关键词**扫描（信用卡/借贷/分期/花呗/白条/蚂蚁/京东金条）在 Task 18 强制通过——平台限流红线。
- `sumToLevel` 支持 dim 参数（不等题数归一化），不破坏其他 8 个测试。

---

## 上线后未覆盖的改进点（供后续 session 跟进）

- [ ] **"败家指数"计算公式**（spec §7.3）——poster 右下角虚构的 `败家指数 87/100`，当前只是氛围装饰，未来可做成 6 维加权公式展示（P2）
- [ ] 自定义 `typeImages`（18 张金色币符风插画或 Midjourney prompt "receipt + gold foil + black"）
- [ ] `compatibility` 表：主题 "谁最容易拐你花钱 / 谁和你一起省钱"（spec P2）
- [ ] 结果页"富养自己 / 穷养自己 / 互相养活"副标签（spec §8.1，根据 FRUGAL+FLAUNT 自动生成）
- [ ] "古法黄金四姐妹编号"彩蛋（spec §8.1，GOLDN 类型附带）
- [ ] MPI × SBTI / FPI 联动身份卡（spec §12.1 四 code 拼接）
- [ ] MPI 独立子域名（若数据表现好）
- [ ] 分享海报"小票/发票"视觉升级（Canvas 绘制真小票字体 + 齿孔边，不显示任何真实金额）

---

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 | cwjjjjj + Claude |

---

## 执行进度日志（Execution Log）

> **目的：** 每完成一个 task 追加一条，记录 commit SHA、review 发现、关键决策。

### 已完成

> **分支：** `feat/mpi-money-persona`（基于 `origin/main` HEAD `3048e36` = FSI 完工后的 main）

**Task 1-3 — 数据骨架** ✅
- `08acb7a` feat(mpi): add mpi.html vite entry
- `47fcd4e` feat(mpi): add 6-dimension metadata + L/M/H explanations（HOARD/FLAUNT/FRUGAL/SUSCEPT/SECONDHAND/LIVESTREAM）
- `000abd5` feat(mpi): add typeImages + compatibility stubs

**Task 4 — 题库（21+1=22）** ✅
- `992f8e6` feat(mpi): add 22 money-behavior questions + mpi_gate
- 分布 4/3/4/4/3/3 + mpi_gate（也记入 D6 LIVESTREAM）
- `secondhand3` 非单调 value（H/L/L/M）—— `randomAnswerForQuestion` `Math.max` 修复已落位

**Task 5 — 类型库（18+2）** ✅
- `1ee3412` feat(mpi): add 18 types + ZERO$ hidden + MIXDR fallback
- 18/18 pattern unique min Hamming=2；每个 desc 4 段式以"一句刺痛你的话："收尾（SBTI/GSTI/FPI 调性，非 FSI 温柔出口）
- `ZERO$` / `LIVE!` / `2HAND` / `FOMO+` 特殊字符正确 quote

**Task 6 — TestConfig** ✅
- `207117b` feat(mpi): assemble TestConfig (no gender lock)
- **关键架构决策：** plan 原本要加 `sumToLevel(score, dim?)` 2 参签名，但 FSI Task 17 已落地 `sumToLevelByDim` 可选字段到 TestConfig + matching.ts。MPI 直接复用该 infra，无需再改 matching.ts/testConfig.tsx。
- `hiddenTriggerValue: -1` 不可达，ZERO$ 走 MpiApp 后置多条件覆盖（对齐 FSI BOSSY 模式）
- Per-dim threshold：D2/D5（3 题）用 ≤6/7-9/≥10；其他默认 flat

**Task 7-9 — Badge + slot 复用 + 自检** ✅
- `65bdacd` feat(mpi): add MPIHeroBadge with invoice-sticker visual（金色发票美学）
- `f2e88f4` verify: ResultPage testBadge slot reused from FPI（empty，无代码改动）
- `c33f261` verify: mpi 18 normal-type patterns are unique (min hamming 2)（`scripts/mpi-pattern-check.ts` + `npm run mpi:pattern-check`）

**Task 10 — MpiApp 顶层** ✅
- `21f8923` feat(mpi): add MpiApp top-level with ZERO$ post-compute override（464 行）
- `maybeOverrideToZero(result, answers)`：`mpi_gate===1 AND levels.D3==='L'` → 覆盖 finalType=ZERO$（复用 `quiz.answers`，无需扩展 useQuiz）
- `<ResultPage testBadge={<MPIHeroBadge>} ...>`；无 testFooter（MPI 不需要危机热线）、无 DisclaimerModal、无 GenderPicker

**Task 11-16 — 构建配置 + Hub + API + skip promo** ✅
- `c80cd88` feat(mpi): add mpi vite entry
- `64dcdae` feat(mpi): copy mpi build artefact to /new/mpi/
- `b21e062` feat(mpi): add MPI card to hub page (10 tests total)
- `322b369` feat(mpi): whitelist mpi type codes in record API（20 codes）
- `06c17ae` feat(mpi): add mpi to ranking mock types + hidden type map
- `ace7647` decide: skip MPI cross-promo card on SBTI main site for MVP（empty）

**Task 17 — Smoke** ✅
- `1e460d7` verify: mpi smoke-dist 18/18 reachable + smoke-zero 5/5 pass
- 新增 `scripts/mpi-smoke-dist.ts`（2000 轮验证全部 18 类型可达）+ `scripts/mpi-smoke-zero.ts`（ZERO$ 5 用例含 3 个 gate 负例 + 1 个 FRUGAL guard）

**Task 18 — 合规审校（含金融扫描）** ✅
- `951f9d6` chore(mpi): remove '分期' + platform names + add adult-only disclaimer
- 3 处合规修复：
  1. MPIHeroBadge LUXUR sticker `"分期有风险·此处不提供"` → `"仅供娱乐，不提供消费建议"`（去金融关键词）
  2. BILIB desc 里真实平台名 `淘宝、京东、拼多多、抖音` → `各大综合电商、直播间、品牌小程序、会员店、海淘渠道`（去品牌实名）
  3. MpiApp 首页加成人专属警告
- 最终扫描：金融词/污名词/品牌实名 全 0 命中

**Task 19 — TypeScript + 生产构建** ✅
- `6a3f04d` verify: mpi tsc + production build pass（MPI chunk 43.02 kB / gzip 19.66 kB，`dist/new/mpi/index.html` 可达）

**Task 20 — Vercel rewrite + ship** ✅
- `dd3dd8c` fix(mpi): add Vercel rewrite for /new/mpi
- 2 条 rewrite 置于 catch-all 之前，对齐 gsti/fpi/fsi 模式

---

### MPI 本地实现完工状态

- 20 task 全部完成
- 5 个 smoke/verify 脚本就位（pattern-check / smoke-dist / smoke-zero）
- 金融合规审校通过（0 金融词 / 0 品牌实名 / 0 污名词）
- 分支 `feat/mpi-money-persona` 准备 push 到 main
