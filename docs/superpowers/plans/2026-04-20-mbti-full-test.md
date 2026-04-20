# MBTI 16 型人格测试 · 完整版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 SBTI 项目新增第 7 个测试 `/mbti` —— 72 题 7 点李克特量表 MBTI 测试，输出 32 种亚型（16 主类型 × A/T），完整集成排名 / 分享 / 对比 / 本地草稿。

**Architecture:** 嵌入现有 `TestConfig` 框架。通过在 `TestConfig` 增加可选 `directTypeResolver` 字段规避 `levelNum` 字母冲突（I/E/N/S/T/F/J/P/A/T 无法走原有 pattern 距离匹配）。MBTI 专用 `MbtiResultPage` + `MbtiDimensionBars` 展示百分比条形图替代雷达图。`useQuiz` 增加可选 `draftKey` 支持 72 题中途保存。

**Tech Stack:** React 19, TypeScript, Vite, Tailwind, Emotion CSS, Framer Motion, @upstash/redis, 项目无测试框架（验证靠 `tsc --noEmit` + 手动浏览器检查）。

**Reference:** `docs/superpowers/specs/2026-04-20-mbti-test-design.md`

---

## 文件清单

### 新建（11 个）
```
src/data/mbti/
  dimensions.ts       # 5 维度元信息
  questions.ts        # 72 题 + LIKERT_OPTIONS 常量
  types.ts            # 32 TypeDef + NORMAL_TYPES + TYPE_RARITY
  typeImages.ts       # SVG 生成器（32 张 data URL）
  compatibility.ts    # 16 对相性（soulmate + rival）
  content.ts          # 8 板块扩展内容 + A/T 层叠
  config.ts           # 拼装 mbtiConfig
src/MbtiApp.tsx                            # React 入口（镜像 WorkApp）
src/components/MbtiDimensionBars.tsx       # 百分比条组件
src/components/MbtiResultPage.tsx          # 8 板块结果页
mbti.html                                  # Vite 入口 HTML
```

### 修改（13 个）
```
src/data/testConfig.tsx       # 加 directTypeResolver 字段 + Question.kind 类型
src/utils/matching.ts         # computeResult 加 directTypeResolver 分支
src/components/QuestionCard.tsx    # 加 Likert 渲染分支
src/utils/quiz.ts             # randomAnswerForQuestion 加 likert 分支
src/data/allTests.ts          # 注册 mbti
src/components/ComparePage.tsx     # 加 mbti 分支（用 MbtiDimensionBars）
src/utils/shareCard.ts        # 加 mbti 分支（画百分比条）
src/hooks/useQuiz.ts          # 加可选 draftKey 参数
vite.config.ts                # rollupOptions.input 加 mbti
vercel.json                   # rewrite 加 /mbti
build.sh                      # 循环数组加 mbti
api/record.js                 # VALID_TYPES_BY_TEST.mbti
api/ranking.js                # MOCK_TYPES_BY_TEST.mbti
```

---

## Phase 1: 框架铺设（Tasks 1-6）

### Task 1: 扩展 TestConfig 接口

**目的**：给 TestConfig 加上 `directTypeResolver` 可选字段 + `Question.kind` 字面量联合类型，其它测试不受影响。

**Files:**
- Modify: `src/data/testConfig.tsx`

- [ ] **Step 1: 修改 Question 接口的 kind 字段**

在 `src/data/testConfig.tsx` 第 20 行，把 `kind?: string;` 改成：

```ts
kind?: 'single' | 'multi' | 'likert';
```

- [ ] **Step 2: 在 TestConfig 接口末尾（sumToLevel 之前）加 directTypeResolver**

在 `src/data/testConfig.tsx` 的 `TestConfig` 接口里，找到 `// Matching params` 注释块，在 `sumToLevel` 前加一行：

```ts
  // Optional: bypass pattern matching — map levels directly to a type code.
  // When provided, computeResult uses this to resolve finalType.
  directTypeResolver?: (levels: Record<string, string>) => string;
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无新增错误（其它测试不用 directTypeResolver 也不影响）

- [ ] **Step 4: Commit**

```bash
git add src/data/testConfig.tsx
git commit -m "feat(mbti): add directTypeResolver to TestConfig"
```

---

### Task 2: 在 matching.ts 加 directTypeResolver 分支

**目的**：让 `computeResult` 在 config 提供 `directTypeResolver` 时走捷径，跳过 pattern matching。

**Files:**
- Modify: `src/utils/matching.ts`

- [ ] **Step 1: 在 computeResult 的 levels 计算之后插入分支**

在 `src/utils/matching.ts` 第 80 行（`// 3. Build user vector` 之前），插入以下代码：

```ts
  // 2.5. Direct type resolver path (e.g., MBTI)
  if (config.directTypeResolver) {
    const code = config.directTypeResolver(levels);
    const typeDefBase = typeLibrary[code] ?? typeLibrary[fallbackTypeCode];
    const finalType: RankedType = {
      ...typeDefBase,
      pattern: code,
      distance: 0,
      exact: dimCount,
      similarity: 100,
    };
    return {
      rawScores,
      levels,
      ranked: [finalType],
      bestNormal: finalType,
      finalType,
      modeKicker: '\u4f60\u7684\u4eba\u683c\u7c7b\u578b',
      badge: code,
      sub: '',
      special: false,
      secondaryType: null,
    };
  }
```

注意：`modeKicker` 用 Unicode 转义写"你的人格类型"，以匹配文件原有风格。

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 回归验证——其它测试不受影响**

由于没有测试框架，手动验证：

```bash
npm run build
```

Expected: build 成功（other tests' computeResult paths 都走 else 分支）

- [ ] **Step 4: Commit**

```bash
git add src/utils/matching.ts
git commit -m "feat(mbti): add directTypeResolver short-circuit to computeResult"
```

---

### Task 3: 创建 mbti/ 目录骨架（空 stub 文件）

**目的**：建所有 mbti 数据文件的"空"版本，能 import、能编译，后续 task 填内容。

**Files:**
- Create: `src/data/mbti/dimensions.ts`
- Create: `src/data/mbti/questions.ts`
- Create: `src/data/mbti/types.ts`
- Create: `src/data/mbti/typeImages.ts`
- Create: `src/data/mbti/compatibility.ts`
- Create: `src/data/mbti/content.ts`
- Create: `src/data/mbti/config.ts`

- [ ] **Step 1: Create dimensions.ts stub**

```ts
// src/data/mbti/dimensions.ts
import type { DimensionInfo } from '../testConfig';

export const dimensionOrder = ['EI', 'SN', 'TF', 'JP', 'AT'] as const;

export const dimensionMeta: Record<string, DimensionInfo> = {
  EI: { name: '\u80fd\u91cf\u65b9\u5411', model: 'MBTI' },
  SN: { name: '\u4fe1\u606f\u5904\u7406', model: 'MBTI' },
  TF: { name: '\u51b3\u7b56\u4f9d\u636e', model: 'MBTI' },
  JP: { name: '\u751f\u6d3b\u65b9\u5f0f', model: 'MBTI' },
  AT: { name: '\u8eab\u4efd\u8ba4\u540c', model: 'NERIS' },
};

export const DIM_EXPLANATIONS: Record<string, Record<string, string>> = {
  EI: { I: '\u5185\u5411', E: '\u5916\u5411' },
  SN: { N: '\u76f4\u89c9', S: '\u5b9e\u611f' },
  TF: { T: '\u601d\u8003', F: '\u60c5\u611f' },
  JP: { J: '\u5224\u65ad', P: '\u611f\u77e5' },
  AT: { A: '\u81ea\u4fe1\u578b', T: '\u52a8\u8361\u578b' },
};
```

- [ ] **Step 2: Create questions.ts stub (占位，后续 Phase 3 填内容)**

```ts
// src/data/mbti/questions.ts
import type { Question } from '../testConfig';

export const LIKERT_OPTIONS = [
  { label: '\u5b8c\u5168\u540c\u610f', value: 3 },
  { label: '\u540c\u610f', value: 2 },
  { label: '\u7565\u540c\u610f', value: 1 },
  { label: '\u4e2d\u7acb', value: 0 },
  { label: '\u7565\u4e0d\u540c\u610f', value: -1 },
  { label: '\u4e0d\u540c\u610f', value: -2 },
  { label: '\u5b8c\u5168\u4e0d\u540c\u610f', value: -3 },
] as const;

// Populated in Phase 3 tasks. All 72 questions share LIKERT_OPTIONS.
export const questions: Question[] = [];

export const specialQuestions: Question[] = [];
```

- [ ] **Step 3: Create types.ts stub**

```ts
// src/data/mbti/types.ts
import type { TypeDef, NormalType, RarityInfo } from '../testConfig';

export const TYPE_LIBRARY: Record<string, TypeDef> = {};

export const NORMAL_TYPES: NormalType[] = [];

export const TYPE_RARITY: Record<string, RarityInfo> = {};
```

- [ ] **Step 4: Create typeImages.ts stub**

```ts
// src/data/mbti/typeImages.ts
export const TYPE_IMAGES: Record<string, string> = {};
export const SHARE_IMAGES: Record<string, string> = {};
```

- [ ] **Step 5: Create compatibility.ts stub**

```ts
// src/data/mbti/compatibility.ts
import type { CompatEntry, CompatResult } from '../testConfig';

export const COMPATIBILITY: Record<string, CompatEntry> = {};

export function getCompatibility(a: string, b: string): CompatResult {
  // Strip A/T suffix and look up by main type
  const mainA = a.split('-')[0];
  const mainB = b.split('-')[0];
  const key = `${mainA}+${mainB}`;
  const reverseKey = `${mainB}+${mainA}`;
  const entry = COMPATIBILITY[key] ?? COMPATIBILITY[reverseKey];
  if (entry) return { type: entry.type, say: entry.say };
  if (mainA === mainB) return { type: 'mirror', say: '\u540c\u7c7b\u578b\u955c\u50cf\u3002' };
  return { type: 'normal', say: '\u666e\u901a\u7684\u5173\u7cfb\u3002' };
}
```

- [ ] **Step 6: Create content.ts stub**

```ts
// src/data/mbti/content.ts
// Extended 8-section content for 16 main types + A/T flavor text.
// Consumed only by MbtiResultPage.

export interface MbtiTypeContent {
  overview: string;      // 核心特征
  strengths: string[];   // 优势 bullets
  weaknesses: string[];  // 劣势 bullets
  relationships: string; // 恋爱与人际
  careers: string[];     // 职业建议 bullets
  growth: string;        // 成长建议
  famous: { name: string; role: string }[]; // 著名人物
}

export const MBTI_CONTENT: Record<string, MbtiTypeContent> = {};

export const AT_FLAVOR: Record<'A' | 'T', string> = {
  A: '',
  T: '',
};
```

- [ ] **Step 7: Create config.ts (assemble TestConfig)**

```ts
// src/data/mbti/config.ts
import type { TestConfig } from '../testConfig';
import { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } from './dimensions';
import { questions, specialQuestions } from './questions';
import { TYPE_LIBRARY, NORMAL_TYPES, TYPE_RARITY } from './types';
import { TYPE_IMAGES, SHARE_IMAGES } from './typeImages';
import { COMPATIBILITY, getCompatibility } from './compatibility';

export const mbtiConfig: TestConfig = {
  id: 'mbti',
  name: 'MBTI 16 \u578b\u4eba\u683c\u6d4b\u8bd5 \u00b7 \u5b8c\u6574\u7248',
  dimensionOrder: [...dimensionOrder],
  dimensionMeta,
  dimExplanations: DIM_EXPLANATIONS,
  questions,
  specialQuestions,
  gateQuestionId: '',
  gateAnswerValue: 0,
  hiddenTriggerQuestionId: '',
  hiddenTriggerValue: 0,
  typeLibrary: TYPE_LIBRARY,
  normalTypes: NORMAL_TYPES,
  typeRarity: TYPE_RARITY,
  typeImages: TYPE_IMAGES,
  shareImages: SHARE_IMAGES,
  compatibility: COMPATIBILITY,
  getCompatibility,
  sumToLevel: () => 'A', // stub - directTypeResolver short-circuits before this is used
  maxDistance: 5,
  fallbackTypeCode: 'INTJ-A',
  hiddenTypeCode: '',
  similarityThreshold: 0,
  directTypeResolver: (levels) =>
    `${levels.EI}${levels.SN}${levels.TF}${levels.JP}-${levels.AT}`,
  prodBaseUrl: 'https://sbti.jiligulu.xyz',
  basePath: '/new/mbti',
  localHistoryKey: 'mbti_history',
  localStatsKey: 'mbti_local_stats',
  apiTestParam: 'mbti',
  dimSectionTitle: '\u4e94\u7ef4\u5ea6\u8bc4\u5206',
  questionCountLabel: '72',
};
```

- [ ] **Step 8: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误（所有数据结构类型对齐 TestConfig）

- [ ] **Step 9: Commit**

```bash
git add src/data/mbti/
git commit -m "feat(mbti): scaffold data directory with empty stubs"
```

---

### Task 4: 创建 MbtiApp.tsx

**目的**：React 入口组件，镜像 `WorkApp.tsx` 结构。

**Files:**
- Create: `src/MbtiApp.tsx`

- [ ] **Step 1: 创建 MbtiApp.tsx**

以 `src/WorkApp.tsx` 为模板复制，替换以下内容：

```ts
// 第 18 行
import { workConfig } from './data/work/config';
// 改为
import { mbtiConfig } from './data/mbti/config';

// 最底部 export default function WorkApp() 改为
export default function MbtiApp() {
  return (
    <TestConfigProvider config={mbtiConfig}>
      <WorkAppInner />
    </TestConfigProvider>
  );
}
```

同时把文件中所有 `WorkAppInner` 重命名为 `MbtiAppInner`，`WorkHero` 重命名为 `MbtiHero`，`workTabs` 重命名为 `mbtiTabs`，`WorkTabId` 重命名为 `MbtiTabId`。

Hero 组件内文本修改：
- `WQ16 WORK QUIZ` → `MBTI 16 PERSONALITIES`
- `职场人格矩阵` → `MBTI 16 型人格测试`
- `4个维度 × 16种职场人格 — 你是哪种打工人？` → `5 个维度 × 32 种亚型 — 72 题完整版测试`
- 其它文案按 mbti 调性调整

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/MbtiApp.tsx
git commit -m "feat(mbti): add MbtiApp component"
```

---

### Task 5: 创建 mbti.html 并接入 build 配置

**目的**：Vite 多入口 + 静态输出目录 + Vercel 路由。

**Files:**
- Create: `mbti.html`
- Modify: `vite.config.ts`
- Modify: `vercel.json`
- Modify: `build.sh`

- [ ] **Step 1: 创建 mbti.html（以 work.html 为模板）**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MBTI 16 \u578b\u4eba\u683c\u6d4b\u8bd5 \u00b7 \u5b8c\u6574\u7248</title>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import MbtiApp from './src/MbtiApp.tsx'
    import './src/index.css'

    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(React.StrictMode, null,
        React.createElement(MbtiApp)
      )
    )
  </script>
</body>
</html>
```

- [ ] **Step 2: 修改 vite.config.ts**

在 `rollupOptions.input` 对象末尾加一行：

```ts
mbti: 'mbti.html',
```

- [ ] **Step 3: 修改 vercel.json**

在 `rewrites` 数组中 `desire` 条目之后加一行：

```json
{ "source": "/mbti", "destination": "/mbti/index.html" },
```

同时修改最后一条（兜底 rewrite），把排除列表里的 `desire` 后面加 `|mbti`：

```json
{ "source": "/((?!api|assets|images|love|work|values|cyber|desire|mbti|sw\\.js).*)", "destination": "/index.html" }
```

- [ ] **Step 4: 修改 build.sh**

第 16 行：

```bash
for test in love work values cyber desire mbti; do
```

- [ ] **Step 5: 本地 build 验证**

Run: `npm run build`
Expected: 成功，`dist/mbti/index.html` 存在。

```bash
ls dist/mbti/
```

- [ ] **Step 6: Commit**

```bash
git add mbti.html vite.config.ts vercel.json build.sh
git commit -m "feat(mbti): add build config and routing for /mbti"
```

---

### Task 6: 后端 API 白名单

**目的**：允许 `/api/record` 接收 mbti 类型，`/api/ranking` 返回 mbti 排名。

**Files:**
- Modify: `api/record.js`
- Modify: `api/ranking.js`

- [ ] **Step 1: 在 api/record.js 的 VALID_TYPES_BY_TEST 加一条**

在 `desire` 条目之后（第 38 行左右）插入：

```js
'mbti': new Set([
  'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
  'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
  'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
  'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
]),
```

- [ ] **Step 2: 在 api/ranking.js 的 MOCK_TYPES_BY_TEST 加一条**

在 `desire` 条目之后插入相同的 32 个代码数组（作为 mock 基线）：

```js
mbti: [
  'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
  'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
  'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
  'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
],
```

**注意**：不要在 `HIDDEN_TYPE_BY_TEST` 加 mbti 条目（无隐藏类型）。`hiddenType = undefined` → 所有 32 种获得正常权重。

- [ ] **Step 3: 本地无法直接测 API（vercel functions），通过 build 验证语法**

```bash
node -e "const m = require('./api/ranking.js'); console.log('ok')"
```

Expected: `ok`（确保语法正确）。如果 require 在 ESM 项目下报错，改用：

```bash
node --check api/record.js && node --check api/ranking.js
```

- [ ] **Step 4: Commit**

```bash
git add api/record.js api/ranking.js
git commit -m "feat(mbti): whitelist 32 mbti type codes in record/ranking APIs"
```

---

## Phase 2: 静态数据结构（Tasks 7-10）

### Task 7: 完善 dimensions.ts（已在 Task 3 完成骨架，此处补 DIM_EXPLANATIONS 细节）

**Files:**
- Modify: `src/data/mbti/dimensions.ts`

- [ ] **Step 1: 检查 Task 3 已写的 DIM_EXPLANATIONS，补全双极对应关系**

文件应已包含正确的 5 个维度 + 每维度两极的中文标签。如 Task 3 已正确完成，此 task 作为 no-op 跳过，仅核对。核对内容：

- EI: I=内向, E=外向
- SN: N=直觉, S=实感
- TF: T=思考, F=情感
- JP: J=判断, P=感知
- AT: A=自信型, T=动荡型

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: (no-op commit if nothing changed)**

---

### Task 8: 填充 types.ts — 32 TypeDef + NORMAL_TYPES + TYPE_RARITY

**目的**：32 个亚型的代码/中文名/简介/描述 + 32 个 NORMAL_TYPES pattern + 32 个 TYPE_RARITY。

**Files:**
- Modify: `src/data/mbti/types.ts`

- [ ] **Step 1: 定义 16 主类型的业界中译和 archetype 名称**

作为一个常量对象放在文件顶部（方便后续读者查阅）：

```ts
// Main type -> { cn: 中文名, archetype: 原型, rarityPct: 理论占比 % }
const MAIN_TYPES = {
  INTJ: { cn: '建筑师',   archetype: 'Architect',   rarityPct: 2.1 },
  INTP: { cn: '逻辑学家', archetype: 'Logician',    rarityPct: 3.3 },
  ENTJ: { cn: '指挥官',   archetype: 'Commander',   rarityPct: 1.8 },
  ENTP: { cn: '辩论家',   archetype: 'Debater',     rarityPct: 3.2 },
  INFJ: { cn: '提倡者',   archetype: 'Advocate',    rarityPct: 1.5 },
  INFP: { cn: '调停者',   archetype: 'Mediator',    rarityPct: 4.4 },
  ENFJ: { cn: '主人公',   archetype: 'Protagonist', rarityPct: 2.5 },
  ENFP: { cn: '竞选者',   archetype: 'Campaigner',  rarityPct: 8.1 },
  ISTJ: { cn: '物流师',   archetype: 'Logistician', rarityPct: 11.6 },
  ISFJ: { cn: '守卫者',   archetype: 'Defender',    rarityPct: 13.8 },
  ESTJ: { cn: '总经理',   archetype: 'Executive',   rarityPct: 8.7 },
  ESFJ: { cn: '执政官',   archetype: 'Consul',      rarityPct: 12.0 },
  ISTP: { cn: '鉴赏家',   archetype: 'Virtuoso',    rarityPct: 5.4 },
  ISFP: { cn: '探险家',   archetype: 'Adventurer',  rarityPct: 8.8 },
  ESTP: { cn: '企业家',   archetype: 'Entrepreneur',rarityPct: 4.3 },
  ESFP: { cn: '表演者',   archetype: 'Entertainer', rarityPct: 8.5 },
} as const;
```

**来源说明**：rarityPct 使用 16personalities.com 公开的全球统计（常见引用值）。这些数据是公开的统计事实，不涉及版权文案。

- [ ] **Step 2: 循环生成 32 个 TypeDef**

```ts
export const TYPE_LIBRARY: Record<string, TypeDef> = (() => {
  const lib: Record<string, TypeDef> = {};
  (Object.keys(MAIN_TYPES) as Array<keyof typeof MAIN_TYPES>).forEach((main) => {
    const meta = MAIN_TYPES[main];
    (['A', 'T'] as const).forEach((suffix) => {
      const code = `${main}-${suffix}`;
      lib[code] = {
        code,
        cn: `${meta.cn} \u00b7 ${suffix === 'A' ? '\u81ea\u4fe1\u578b' : '\u52a8\u8361\u578b'}`,
        intro: '', // 待 Phase 4 任务填充（来自 content.ts overview 的第一句）
        desc: '',  // 待 Phase 4 任务填充（来自 content.ts overview 的完整段）
      };
    });
  });
  return lib;
})();
```

`intro` 和 `desc` 先留空，在 Phase 4 写完 content.ts 后回来填。或者更简洁的做法：让 `MbtiResultPage` 直接读 `MBTI_CONTENT[mainCode].overview`，不依赖 TypeDef.desc。这样 TypeDef 的 desc 就保留空串不用回填。

**采用后者**：TypeDef.desc 保留空串，`MbtiResultPage` 从 `content.ts` 读 overview 显示。

- [ ] **Step 3: 生成 NORMAL_TYPES（32 个 pattern）**

```ts
export const NORMAL_TYPES: NormalType[] = Object.keys(TYPE_LIBRARY).map((code) => ({
  code,
  pattern: code, // "INTJ-A" 直接作为 pattern，parsePattern 会 strip '-' → ['I','N','T','J','A']
}));
```

- [ ] **Step 4: 生成 TYPE_RARITY（32 个条目）**

```ts
function starsFor(pct: number): number {
  if (pct < 1) return 5;
  if (pct < 3) return 4;
  if (pct < 8) return 3;
  if (pct < 15) return 2;
  return 1;
}

function rarityLabel(pct: number): string {
  if (pct < 1) return '\u7a00\u6709';
  if (pct < 3) return '\u5c11\u89c1';
  if (pct < 8) return '\u666e\u901a';
  if (pct < 15) return '\u5e38\u89c1';
  return '\u5f88\u5e38\u89c1';
}

export const TYPE_RARITY: Record<string, RarityInfo> = (() => {
  const map: Record<string, RarityInfo> = {};
  (Object.keys(MAIN_TYPES) as Array<keyof typeof MAIN_TYPES>).forEach((main) => {
    const meta = MAIN_TYPES[main];
    const splitPct = meta.rarityPct / 2; // A/T 各占一半
    (['A', 'T'] as const).forEach((suffix) => {
      const code = `${main}-${suffix}`;
      map[code] = {
        pct: splitPct,
        stars: starsFor(splitPct),
        label: rarityLabel(splitPct),
      };
    });
  });
  return map;
})();
```

- [ ] **Step 5: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 6: Commit**

```bash
git add src/data/mbti/types.ts
git commit -m "feat(mbti): add 32 TypeDefs, NORMAL_TYPES and TYPE_RARITY"
```

---

### Task 9: 实现 typeImages.ts — SVG 生成器

**目的**：程序化生成 32 张 SVG data URL，避免外部图片资源。

**Files:**
- Modify: `src/data/mbti/typeImages.ts`

- [ ] **Step 1: 写 SVG 生成函数**

```ts
// src/data/mbti/typeImages.ts

type Temperament = 'NT' | 'NF' | 'SJ' | 'SP';

function temperamentOf(main: string): Temperament {
  const s = main[1]; // 第二个字母：N 或 S
  const t = main[2]; // 第三个字母：T 或 F
  const j = main[3]; // 第四个字母：J 或 P
  if (s === 'N' && t === 'T') return 'NT';
  if (s === 'N' && t === 'F') return 'NF';
  if (s === 'S' && (j === 'J')) return 'SJ';
  return 'SP';
}

const TEMP_COLORS: Record<Temperament, { bg: string; fg: string; accent: string }> = {
  NT: { bg: '#2a1b4a', fg: '#ffffff', accent: '#8b5cf6' },
  NF: { bg: '#1a3a2e', fg: '#ffffff', accent: '#10b981' },
  SJ: { bg: '#1a2a4a', fg: '#ffffff', accent: '#3b82f6' },
  SP: { bg: '#3a2a1a', fg: '#ffffff', accent: '#f59e0b' },
};

function generateMbtiTypeSvg(code: string): string {
  const [main, suffix] = code.split('-') as [string, 'A' | 'T'];
  const colors = TEMP_COLORS[temperamentOf(main)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
  <rect width="320" height="320" fill="${colors.bg}"/>
  <rect x="20" y="20" width="280" height="280" rx="20" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
  <text x="160" y="180" fill="${colors.fg}" font-family="-apple-system, SF Pro Display, system-ui, sans-serif" font-size="72" font-weight="800" text-anchor="middle" letter-spacing="4">${main}</text>
  <circle cx="258" cy="258" r="28" fill="${colors.accent}"/>
  <text x="258" y="268" fill="${colors.fg}" font-family="-apple-system, SF Pro Display, system-ui, sans-serif" font-size="28" font-weight="800" text-anchor="middle">${suffix}</text>
</svg>`;
  const b64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);
  return `data:image/svg+xml;base64,${b64}`;
}

const ALL_CODES = [
  'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
  'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
  'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
  'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
];

export const TYPE_IMAGES: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  ALL_CODES.forEach(code => { m[code] = generateMbtiTypeSvg(code); });
  return m;
})();

export const SHARE_IMAGES: Record<string, string> = TYPE_IMAGES;
```

- [ ] **Step 2: 本地快速渲染验证**

在浏览器 devtools 或临时 node 脚本验证输出：

```bash
node -e "
import('./src/data/mbti/typeImages.ts').then(m => {
  const first = m.TYPE_IMAGES['INTJ-A'];
  console.log('length:', first.length);
  console.log('starts with:', first.substring(0, 40));
});
"
```

（如 ts loader 不可用则跳过此步，依赖 Phase 7 的 E2E 验证）。

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/data/mbti/typeImages.ts
git commit -m "feat(mbti): generate 32 type images as inline SVG data URLs"
```

---

### Task 10: 填充 compatibility.ts — 16 soulmate + 16 rival

**目的**：每个主类型有一条"天生一对"和"欢喜冤家"。getCompatibility 已在 Task 3 写好，此 task 只填数据。

**Files:**
- Modify: `src/data/mbti/compatibility.ts`

**文案风格要求**：
- 每条 30-60 字，口语化
- 说出这对为什么契合 / 为什么冲突，用具体的情境词
- 不重复套话（"互补"、"默契"需换种表述）

**配对经典组合**（按 MBTI 认知功能互补理论）：
- NT 主导 vs NF 反向（或同 NT 镜像）
- 分析型 vs 感性型往往碰撞
- I 和 E 能互相拉扯（有时契合、有时冲突）

- [ ] **Step 1: 填写 soulmate 配对（16 条）**

在 `COMPATIBILITY` 对象中加入以下键值对。示例格式：

```ts
export const COMPATIBILITY: Record<string, CompatEntry> = {
  'INTJ+ENFP': {
    type: 'soulmate',
    say: '\u4e00\u4e2a\u8ba1\u5212\u5341\u5e74\u540e\u7684\u4eba\u751f\uff0c\u4e00\u4e2a\u8ba1\u5212\u660e\u5929\u73a9\u4ec0\u4e48\u3002\u653e\u5728\u4e00\u8d77\u7adf\u7136\u5e73\u8861\u4e86\u3002',
  },
  // ...15 more
};
```

**16 对 soulmate 建议配对**（engineer 按 MBTI 理论 + 项目调性原创 60 字内文案）：

1. INTJ + ENFP — 规划家 × 理想主义者
2. INTP + ENTJ — 思考者 × 执行者
3. ENTJ + INFP — 铁血 × 梦幻
4. ENTP + INFJ — 辩论家 × 洞察者
5. INFJ + ENTP — 理想 × 颠覆（与 4 重复则跳过合并）
6. INFP + ENFJ — 诗人 × 领路人
7. ENFJ + ISFP — 领路人 × 艺术家
8. ENFP + ISTJ — 花火 × 磐石
9. ISTJ + ESFP — 严谨 × 欢乐
10. ISFJ + ESTP — 守护 × 行动派
11. ESTJ + ISFP — 管理 × 感性
12. ESFJ + ISTP — 热心 × 冷静
13. ISTP + ENFJ — 实干 × 热情
14. ISFP + ENTJ — 感受 × 决断
15. ESTP + INFJ — 当下 × 未来
16. ESFP + INTJ — 烟火气 × 战略家

（配对数量可以合并重复的，最终形成 16 条唯一的 soulmate）

**去重后目标**：16 对唯一配对，每个主类型至少出现在一对里。engineer 决定最终 16 对清单时注意不要让同一主类型出现两次作为 A 方。

- [ ] **Step 2: 填写 rival 配对（16 条）**

同上格式，每条表达两类型间的天然张力或常见摩擦。避免"死对头"标签过激，走"欢喜冤家"的幽默调性。

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: 检查覆盖率**

```bash
node -e "
const m = require('./dist-check.js'); // 或其他方式
// 断言 Object.keys(COMPATIBILITY).length === 32
"
```

（无测试框架，用 `Object.keys(COMPATIBILITY).length === 32` 的 console.log 手验）

- [ ] **Step 5: Commit**

```bash
git add src/data/mbti/compatibility.ts
git commit -m "feat(mbti): add 32 compatibility entries (16 soulmate + 16 rival)"
```

---

## Phase 3: 题目内容（Tasks 11-15）

**通用要求（所有 5 个维度）：**

每题结构：
```ts
{
  id: 'mbti_<dim>_<nn>',         // nn 从 01 起
  dim: '<DIM>',                    // 'EI' | 'SN' | 'TF' | 'JP' | 'AT'
  kind: 'likert',
  text: '<原创中文句，25-40 字>',
  options: LIKERT_OPTIONS,         // 统一引用
}
```

**方向约定**：所有题统一写成 **"偏正极"视角**（偏 E / 偏 S / 偏 F / 偏 P / 偏 T）。即："同意 = +value = 右极字母"。于是同一组 options 常量可复用到所有题。

**题干写作要求**：
- 不抄任何 MBTI 测试网站的题目；原创中文
- 具体场景描述，不用心理学术语
- 避免双重否定、避免"有时 / 偶尔"等模糊词
- 每题只测一个维度（不跨维度混淆）

### Task 11: 写 E/I 维度的 15 道题（偏 E 视角）

**Files:**
- Modify: `src/data/mbti/questions.ts`

- [ ] **Step 1: 追加 15 道 EI 题到 questions 数组**

```ts
// 在 questions.ts 里让 questions 数组包含这 15 项
// id 为 mbti_ei_01 到 mbti_ei_15
// dim: 'EI'
// kind: 'likert'
// text: 每条都是"偏 E 的陈述"（如 "我喜欢在人多的场合补充能量"）
// options: LIKERT_OPTIONS
```

**题目主题建议**（engineer 按此列 15 题）：
1. 在聚会中是否感到精力充沛
2. 是否主动发起对话
3. 是否倾向于放大声量表达观点
4. 是否喜欢多人协作胜过独立工作
5. 是否在人前思考（边说边想）
6. 下班后倾向于社交聚会
7. 认识陌生人的积极性
8. 讨论话题时是否喜欢现场头脑风暴
9. 在团体中是否经常成为能量中心
10. 对沉默是否感到不适
11. 电话沟通是否比文字更自在
12. 是否享受成为关注焦点
13. 休假时倾向于旅行而非独处
14. 是否更多通过外部反馈了解自己
15. 面对人群的自然反应是兴奋（非疲惫）

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/data/mbti/questions.ts
git commit -m "feat(mbti): add 15 E/I dimension questions"
```

---

### Task 12: 写 S/N 维度的 15 道题（偏 S 视角）

**Files:**
- Modify: `src/data/mbti/questions.ts`

- [ ] **Step 1: 追加 15 道 SN 题**

结构同 Task 11，id 为 `mbti_sn_01` 到 `mbti_sn_15`，dim 为 `'SN'`，text 为"偏 S 的陈述"。

**题目主题建议**：
1. 更相信实际经验而非理论
2. 注重具体细节胜过整体图景
3. 解决问题时先看已有数据而非推测可能性
4. 对看不见摸不着的概念（如灵感、直觉）持怀疑
5. 阅读时偏好纪实/实用书胜过小说/哲学
6. 学习新技能时先上手再理解原理
7. 对"创意性想法"保持务实态度（问可行性）
8. 描述事物时用具体的颜色/尺寸/时间
9. 更信任历史数据胜过趋势预测
10. 喜欢维护和优化胜过从零创新
11. 在决策时重视事实清单
12. 反感脱离现实的空想
13. 喜欢可验证、可重复的方法
14. 信息密集时关注"发生了什么"胜过"意味着什么"
15. 对新鲜事物先问"能做什么"而非"能变成什么"

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/data/mbti/questions.ts
git commit -m "feat(mbti): add 15 S/N dimension questions"
```

---

### Task 13: 写 T/F 维度的 15 道题（偏 F 视角）

**Files:**
- Modify: `src/data/mbti/questions.ts`

- [ ] **Step 1: 追加 15 道 TF 题**

id 为 `mbti_tf_01` 到 `mbti_tf_15`，dim 为 `'TF'`，text 为"偏 F 的陈述"（同意 = +value = F 字母）。

**题目主题建议**：
1. 决策时先考虑他人感受
2. 冲突中倾向于维护关系胜过讲道理
3. 评价事情时看动机胜过看结果
4. 容易被他人的情绪感染
5. 听到负面反馈时首先想到对方的情绪
6. 看重团队和谐胜过效率
7. 反感过于冷静、只讲逻辑的沟通
8. 在他人难过时本能想安慰而非分析
9. 评判好坏时价值观优先于准确性
10. 更相信"心里感觉对"胜过"数据支持"
11. 对"公平"的理解偏向"同理心"胜过"规则一致"
12. 鼓励别人时更重视情感支持
13. 做决定时难以对事不对人
14. 表达观点时会考虑听众情绪
15. 反对纯粹的绩效主义

- [ ] **Step 2 + 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/questions.ts
git commit -m "feat(mbti): add 15 T/F dimension questions"
```

---

### Task 14: 写 J/P 维度的 15 道题（偏 P 视角）

**Files:**
- Modify: `src/data/mbti/questions.ts`

- [ ] **Step 1: 追加 15 道 JP 题**

id 为 `mbti_jp_01` 到 `mbti_jp_15`，dim 为 `'JP'`，text 为"偏 P 的陈述"。

**题目主题建议**：
1. 喜欢保持计划的弹性
2. 临时调整日程不觉得混乱
3. 讨厌过早锁死决定
4. 享受"灵感来了再做"
5. 待办清单经常打破顺序
6. 旅行不爱做紧密行程
7. 截止日期前的冲刺反而激发状态
8. 同时推进多个项目胜过单一推进
9. 工作区域常处于"可变混乱"状态
10. 对信息收集完整度容忍高
11. 选择题上反复摇摆属于正常
12. 规则能绕就绕
13. 更享受"过程中探索"
14. 对"按时完成"的执着程度不高
15. 反感过度规划的生活方式

- [ ] **Step 2 + 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/questions.ts
git commit -m "feat(mbti): add 15 J/P dimension questions"
```

---

### Task 15: 写 A/T 维度的 12 道题（偏 T 视角）

**Files:**
- Modify: `src/data/mbti/questions.ts`

- [ ] **Step 1: 追加 12 道 AT 题**

id 为 `mbti_at_01` 到 `mbti_at_12`，dim 为 `'AT'`，text 为"偏 T（动荡型）视角"（同意 = +value = T 字母）。

**注**：A/T 对应心理学的"情绪稳定性"轴，T = 动荡型 = 较高 Neuroticism，A = 自信型 = 较低 Neuroticism。

**题目主题建议**：
1. 对自己的决定常事后反复怀疑
2. 失败时容易把责任归到自己
3. 别人的看法强烈影响心情
4. 焦虑是日常的一部分
5. 对未来倾向于设想最坏情况
6. 压力下容易睡不好
7. 完美主义经常拖慢进度
8. 需要持续的外部肯定才能放心
9. 犯错后长时间反刍
10. 对自身能力的自信容易动摇
11. 情绪波动的频率高
12. 对"被误解"特别敏感

- [ ] **Step 2: 题数核对**

```bash
node -e "
const m = require('./src/data/mbti/questions.ts');
// 检查总数 = 72
// 按 dim 分组计数应为 EI:15, SN:15, TF:15, JP:15, AT:12
"
```

由于 TS 不能直接 require，手动统计：文件中 `mbti_ei_` 前缀 15 条、`mbti_sn_` 15 条、`mbti_tf_` 15 条、`mbti_jp_` 15 条、`mbti_at_` 12 条 = 72。

- [ ] **Step 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/questions.ts
git commit -m "feat(mbti): add 12 A/T dimension questions (72 total)"
```

---

## Phase 4: 扩展人格内容（Tasks 16-20）

### Task 16: 写 content.ts A/T 层叠文案 + 内容格式示例

**目的**：给 `MBTI_CONTENT` 定类型骨架 + 写好 A/T 层叠两段 + 写 1 个完整类型样本（供后续 16-20 task 复刻格式）。

**Files:**
- Modify: `src/data/mbti/content.ts`

- [ ] **Step 1: 完善类型定义 + A/T 层叠**

```ts
// src/data/mbti/content.ts
export interface MbtiTypeContent {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  careers: string[];
  growth: string;
  famous: { name: string; role: string }[];
}

export const MBTI_CONTENT: Record<string, MbtiTypeContent> = {};

export const AT_FLAVOR: Record<'A' | 'T', string> = {
  A: '\u81ea\u4fe1\u578b\uff08-A\uff09\u7684\u4eba\u60c5\u7eea\u7a33\u5b9a\u3001\u5bf9\u81ea\u5df1\u8f83\u6ee1\u610f\u3001\u5bf9\u538b\u529b\u8f83\u6709\u62b5\u6297\u529b\u3002\u5728\u76f8\u540c\u7c7b\u578b\u4e2d\uff0c\u4ed6\u4eec\u66f4\u503e\u5411\u4e8e\u5728\u51b3\u7b56\u540e\u4e0d\u56de\u5934\uff0c\u8d70\u4f60\u7684\u8def\u3002\u4f46\u4e5f\u53ef\u80fd\u56e0\u6b64\u5bf9\u5916\u754c\u4fe1\u53f7\u4e0d\u591f\u654f\u611f\u3001\u9519\u8fc7\u81ea\u6211\u8c03\u6574\u7684\u673a\u4f1a\u3002',
  T: '\u52a8\u8361\u578b\uff08-T\uff09\u7684\u4eba\u5bf9\u81ea\u6211\u66f4\u82db\u523b\u3001\u5bf9\u5916\u754c\u53cd\u9988\u66f4\u654f\u611f\u3001\u9a71\u52a8\u81ea\u5df1\u6301\u7eed\u6539\u8fdb\u7684\u529b\u91cf\u66f4\u5f3a\u3002\u5f80\u5f80\u66f4\u5bb9\u6613\u6210\u957f\uff0c\u4f46\u4e5f\u66f4\u5bb9\u6613\u88ab\u81ea\u6211\u6279\u8bc4\u7f13\u51b2\u7136\u3001\u88ab\u201c\u4e0d\u591f\u597d\u201d\u7684\u611f\u89c9\u538b\u57ae\u3002',
};
```

（A/T 两段文案仅为示例长度参考；engineer 原创时保持 100-150 字、调性跟项目其它测试一致）

- [ ] **Step 2: 写 1 个完整类型内容作为参考模板（INTJ）**

```ts
MBTI_CONTENT['INTJ'] = {
  overview: '...150 字核心特征段...',
  strengths: ['策略思维', '独立判断', '长线执行', '高度自律', '洞察本质'], // 5 条
  weaknesses: ['过于理性显得疏离', '对他人感受不够敏感', '完美主义拖延', '难以表达情感', '对他人标准过高'],
  relationships: '...200 字恋爱与人际...',
  careers: ['系统架构师', '战略咨询', '研发管理', '产品规划', '长期投资分析师'],
  growth: '...150 字成长建议...',
  famous: [
    { name: '\u5c3c\u91c7', role: '\u54f2\u5b66\u5bb6' },     // 尼采
    { name: '\u7279\u65af\u62c9', role: '\u53d1\u660e\u5bb6' }, // 特斯拉
    { name: '\u6d77\u5fb7\u683c\u5c14', role: '\u54f2\u5b66\u5bb6' }, // 海德格尔
  ],
};
```

engineer 按这个模板把每部分填成完整原创中文，总字数约 800-1000 字/类型。

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add src/data/mbti/content.ts
git commit -m "feat(mbti): scaffold content.ts with A/T flavor and INTJ sample"
```

---

### Task 17: NT 温度族内容（INTP / ENTJ / ENTP）

**Files:**
- Modify: `src/data/mbti/content.ts`

- [ ] **Step 1: 为 INTP 填充完整 MbtiTypeContent**

复制 Task 16 的 INTP 模板结构，完成 overview / strengths / weaknesses / relationships / careers / growth / famous 7 个字段。字数要求同 Task 16。

**INTP 要点**：逻辑学家原型。优势在抽象推理、深度思考、系统建模；弱势在执行力、情绪表达。职业方向：研究、算法、哲学、编程。著名人物：笛卡尔、亚里士多德、伽利略等已故哲学家/科学家。

- [ ] **Step 2: ENTJ**

**ENTJ 要点**：指挥官原型。优势在战略决断、组织力、长期目标；弱势在对他人情感的耐心。职业：高管、投资人、律师、企业创始人。著名人物：凯撒大帝、拿破仑、玛格丽特·撒切尔（在世已逝，可用）。

- [ ] **Step 3: ENTP**

**ENTP 要点**：辩论家原型。优势在思维灵活、跨领域连接、打破常规；弱势在坚持、细节。职业：创业者、发明家、律师、创意总监。著名人物：苏格拉底、伏尔泰、富兰克林。

- [ ] **Step 4: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/content.ts
git commit -m "feat(mbti): add NT temperament content (INTP/ENTJ/ENTP)"
```

---

### Task 18: NF 温度族内容（INFJ / INFP / ENFJ / ENFP）

**Files:**
- Modify: `src/data/mbti/content.ts`

- [ ] **Step 1: INFJ**

**INFJ 要点**：提倡者原型。优势在洞察、理想主义、深度关怀；弱势在孤立感、过度牺牲。著名人物：甘地、柏拉图、歌德。

- [ ] **Step 2: INFP**

**INFP 要点**：调停者原型。优势在共情、创造力、价值观坚定；弱势在现实操作、自我怀疑。著名人物：莎士比亚、弗吉尼亚·伍尔夫、圣·埃克苏佩里。

- [ ] **Step 3: ENFJ**

**ENFJ 要点**：主人公原型。优势在感召力、组织他人、人际洞察；弱势在自我照顾、边界感弱。著名人物：马丁·路德·金、奥普拉（在世，避用）→ 换成艾蒿夫·托尔斯泰或类似。

- [ ] **Step 4: ENFP**

**ENFP 要点**：竞选者原型。优势在热情、想象、人际连接；弱势在专注、坚持。著名人物：奥斯卡·王尔德、沃尔特·惠特曼。

- [ ] **Step 5: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/content.ts
git commit -m "feat(mbti): add NF temperament content (INFJ/INFP/ENFJ/ENFP)"
```

---

### Task 19: SJ 温度族内容（ISTJ / ISFJ / ESTJ / ESFJ）

**Files:**
- Modify: `src/data/mbti/content.ts`

- [ ] **Step 1: ISTJ**

**ISTJ 要点**：物流师原型。优势在负责、精确、可靠；弱势在僵化、难接受变化。著名人物：康德、华盛顿、荣格的部分学派代表。

- [ ] **Step 2: ISFJ**

**ISFJ 要点**：守卫者原型。优势在细致、守护他人、记忆力；弱势在被动、过度牺牲。著名人物：圣特蕾莎修女（避用在世/近代）→ 换成其它已故慈善家。

- [ ] **Step 3: ESTJ**

**ESTJ 要点**：总经理原型。优势在管理、执行、秩序；弱势在情感迟钝、缺乏弹性。著名人物：托马斯·爱迪生、老西奥多·罗斯福。

- [ ] **Step 4: ESFJ**

**ESFJ 要点**：执政官原型。优势在社交、照顾他人、团队凝聚；弱势在依赖他人评价、逃避冲突。著名人物：查尔斯·狄更斯、安娜·罗斯福（可选已故人物）。

- [ ] **Step 5: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/content.ts
git commit -m "feat(mbti): add SJ temperament content (ISTJ/ISFJ/ESTJ/ESFJ)"
```

---

### Task 20: SP 温度族内容（ISTP / ISFP / ESTP / ESFP）

**Files:**
- Modify: `src/data/mbti/content.ts`

- [ ] **Step 1: ISTP**

**ISTP 要点**：鉴赏家原型。优势在动手能力、空间感、冷静处理危机；弱势在长期承诺、情感表达。著名人物：达·芬奇（兼 INTJ 特质，但也常列 ISTP）、爱因斯坦（有 ISTP 争议）。选保守的：米开朗基罗。

- [ ] **Step 2: ISFP**

**ISFP 要点**：探险家原型。优势在审美、共情、享受当下；弱势在规划、自我表达受限。著名人物：梵高、肖邦、莫扎特。

- [ ] **Step 3: ESTP**

**ESTP 要点**：企业家原型。优势在行动力、临场判断、冒险；弱势在深度思考、长期规划。著名人物：西奥多·罗斯福（如已被 ESTJ 占，换成丘吉尔）。

- [ ] **Step 4: ESFP**

**ESFP 要点**：表演者原型。优势在即兴、感染力、当下享受；弱势在纪律、严肃规划。著名人物：莫扎特（如已被 ISFP 占，换成罗西尼）、洛可可画派人物。

- [ ] **Step 5: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/data/mbti/content.ts
git commit -m "feat(mbti): add SP temperament content (ISTP/ISFP/ESTP/ESFP)"
```

**Phase 4 结束后应有**：`MBTI_CONTENT` 包含全部 16 个主类型的条目。

---

## Phase 5: UI 组件（Tasks 21-24）

### Task 21: QuestionCard Likert 渲染分支

**Files:**
- Modify: `src/components/QuestionCard.tsx`

- [ ] **Step 1: 在 QuestionCard 组件主体中添加 Likert 分支**

在 `src/components/QuestionCard.tsx` 里，`const isMulti = !!question.multiSelect;` 这一行之后，加：

```tsx
const isLikert = question.kind === 'likert';
```

然后在 return 块的 `<div className="grid gap-2.5">` 之前加条件分支：

```tsx
{isLikert ? (
  <LikertScale
    question={question}
    selectedValue={typeof selectedValue === 'number' ? selectedValue : undefined}
    onAnswer={handleSingleSelect}
    previewMode={previewMode}
  />
) : (
  <div className="grid gap-2.5">
    {/* 原有按钮列表 */}
  </div>
)}
```

- [ ] **Step 2: 在同文件加 LikertScale 子组件**

```tsx
interface LikertScaleProps {
  question: Question;
  selectedValue: number | undefined;
  onAnswer: (value: number) => void;
  previewMode: boolean;
}

function LikertScale({ question, selectedValue, onAnswer }: LikertScaleProps) {
  const values = [3, 2, 1, 0, -1, -2, -3]; // 左=同意，右=不同意
  // 每个圆的尺寸：两端 44px，中间 28px，线性过渡
  const sizes = [44, 40, 34, 28, 34, 40, 44];

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-muted mb-3 px-1">
        <span>\u540c\u610f</span>
        <span>\u4e0d\u540c\u610f</span>
      </div>
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {values.map((v, i) => {
          const size = sizes[i];
          const isSelected = selectedValue === v;
          const isPositive = v > 0;
          const isNegative = v < 0;
          const colorClass = isSelected
            ? (isPositive
                ? 'bg-green-500 border-green-400'
                : isNegative
                  ? 'bg-red-500 border-red-400'
                  : 'bg-white border-white')
            : 'bg-transparent border-border hover:border-white';

          return (
            <button
              key={v}
              type="button"
              onClick={() => onAnswer(v)}
              className={`rounded-full border-2 transition-all cursor-pointer ${colorClass}`}
              style={{ width: size, height: size }}
              aria-label={`value ${v}`}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 确保 LikertScale 不破坏 badgeText 和 question.text 的现有渲染**

原 QuestionCard 上半部分（badgeText、question.text）保留不变，只有下半部分选项区域切换为 LikertScale。

- [ ] **Step 4: 本地 dev 启动验证**

```bash
npm run dev
```

访问 `http://localhost:5173/mbti`（需要先完成后续 Task 28 注册入口才能真正访问，否则用浏览器 devtools 临时模拟渲染一个 likert 问题）。

或者：在 `WorkApp` 的临时 question 里手动加一条 `kind: 'likert'` 的题快速验证。完成后移除临时代码。

- [ ] **Step 5: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/components/QuestionCard.tsx
git commit -m "feat(mbti): add likert renderer to QuestionCard"
```

---

### Task 22: quiz.ts randomAnswerForQuestion 支持 likert

**Files:**
- Modify: `src/utils/quiz.ts`

- [ ] **Step 1: 找到 randomAnswerForQuestion 函数**

```bash
grep -n "randomAnswerForQuestion" src/utils/quiz.ts
```

- [ ] **Step 2: 在函数开头加 likert 分支**

```ts
export function randomAnswerForQuestion(q: Question): number | number[] {
  if (q.kind === 'likert') {
    // 返回 -3..3 的随机整数
    return Math.floor(Math.random() * 7) - 3;
  }
  // ...原有单选/多选逻辑
}
```

- [ ] **Step 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/utils/quiz.ts
git commit -m "feat(mbti): support likert in randomAnswerForQuestion"
```

---

### Task 23: MbtiDimensionBars 组件

**Files:**
- Create: `src/components/MbtiDimensionBars.tsx`

- [ ] **Step 1: 写组件**

```tsx
// src/components/MbtiDimensionBars.tsx
import type { DimensionInfo } from '../data/testConfig';

interface DimSpec {
  key: string;
  leftLetter: string;
  rightLetter: string;
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}

const DIM_SPECS: DimSpec[] = [
  { key: 'EI', leftLetter: 'I', rightLetter: 'E', leftLabel: '\u5185\u5411', rightLabel: '\u5916\u5411', leftColor: '#6366f1', rightColor: '#f59e0b' },
  { key: 'SN', leftLetter: 'N', rightLetter: 'S', leftLabel: '\u76f4\u89c9', rightLabel: '\u5b9e\u611f', leftColor: '#8b5cf6', rightColor: '#10b981' },
  { key: 'TF', leftLetter: 'T', rightLetter: 'F', leftLabel: '\u601d\u8003', rightLabel: '\u60c5\u611f', leftColor: '#3b82f6', rightColor: '#ec4899' },
  { key: 'JP', leftLetter: 'J', rightLetter: 'P', leftLabel: '\u5224\u65ad', rightLabel: '\u611f\u77e5', leftColor: '#ef4444', rightColor: '#14b8a6' },
  { key: 'AT', leftLetter: 'A', rightLetter: 'T', leftLabel: '\u81ea\u4fe1', rightLabel: '\u52a8\u8361', leftColor: '#22c55e', rightColor: '#a855f7' },
];

interface MbtiDimensionBarsProps {
  // pct: 每维度 0-100，100 = 完全偏向 rightLetter，0 = 完全偏向 leftLetter
  pcts: Record<string, number>;
  // 可选：第二份数据用于 ComparePage 对比（双人）
  compare?: Record<string, number>;
}

export default function MbtiDimensionBars({ pcts, compare }: MbtiDimensionBarsProps) {
  return (
    <div className="space-y-5">
      {DIM_SPECS.map((spec) => {
        const pct = pcts[spec.key] ?? 50;
        const isLeftSide = pct < 50;
        const displayPct = isLeftSide ? 100 - pct : pct;
        const dominantLetter = isLeftSide ? spec.leftLetter : spec.rightLetter;

        return (
          <div key={spec.key} className="bg-surface border border-border rounded-xl p-4">
            {/* Labels row */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-lg">{spec.leftLetter}</span>
                <span className="text-xs text-muted">{spec.leftLabel}</span>
              </div>
              <span className="font-mono font-extrabold text-white text-lg">
                {dominantLetter} {displayPct}%
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{spec.rightLabel}</span>
                <span className="font-mono font-bold text-white text-lg">{spec.rightLetter}</span>
              </div>
            </div>
            {/* Bar */}
            <div className="relative h-3 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(to right, ${spec.leftColor}, ${spec.rightColor})`,
                }}
              />
              {compare !== undefined && (
                <div
                  className="absolute top-0 h-full w-0.5 bg-white"
                  style={{ left: `${compare[spec.key] ?? 50}%` }}
                  aria-label="compare marker"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/components/MbtiDimensionBars.tsx
git commit -m "feat(mbti): add MbtiDimensionBars component"
```

---

### Task 24: MbtiResultPage 组件

**Files:**
- Create: `src/components/MbtiResultPage.tsx`

- [ ] **Step 1: 写组件骨架**

```tsx
// src/components/MbtiResultPage.tsx
import { useMemo } from 'react';
import MbtiDimensionBars from './MbtiDimensionBars';
import { useTestConfig } from '../data/testConfig';
import type { ComputeResultOutput } from '../utils/matching';
import { MBTI_CONTENT, AT_FLAVOR } from '../data/mbti/content';
import { COMPATIBILITY } from '../data/mbti/compatibility';

interface MbtiResultPageProps {
  result: ComputeResultOutput;
  onShare: () => void;
  onInviteCompare: () => void;
  onRestart: () => void;
  onHome: () => void;
  onDebugReroll?: () => void;
  onDebugForceType?: (code: string) => void;
}

function computePcts(rawScores: Record<string, number>): Record<string, number> {
  const maxAbs: Record<string, number> = { EI: 45, SN: 45, TF: 45, JP: 45, AT: 36 };
  const pcts: Record<string, number> = {};
  Object.keys(rawScores).forEach((dim) => {
    const score = rawScores[dim];
    const max = maxAbs[dim] ?? 45;
    pcts[dim] = Math.max(0, Math.min(100, Math.round(50 + (score / max) * 50)));
  });
  return pcts;
}

export default function MbtiResultPage({
  result,
  onShare,
  onInviteCompare,
  onRestart,
  onHome,
}: MbtiResultPageProps) {
  const config = useTestConfig();
  const code = result.finalType.code;
  const [mainCode, suffix] = code.split('-') as [string, 'A' | 'T'];
  const content = MBTI_CONTENT[mainCode];
  const typeDef = config.typeLibrary[code];
  const image = config.typeImages[code];
  const rarity = config.typeRarity[code];
  const pcts = useMemo(() => computePcts(result.rawScores), [result.rawScores]);

  // Find soulmate and rival for the main type
  const compatEntries = useMemo(() => {
    const soul: { pairCode: string; say: string } | null = (() => {
      const key = Object.keys(COMPATIBILITY).find((k) => {
        const [a, b] = k.split('+');
        return (a === mainCode || b === mainCode) && COMPATIBILITY[k].type === 'soulmate';
      });
      if (!key) return null;
      const [a, b] = key.split('+');
      return { pairCode: a === mainCode ? b : a, say: COMPATIBILITY[key].say };
    })();
    const rival: { pairCode: string; say: string } | null = (() => {
      const key = Object.keys(COMPATIBILITY).find((k) => {
        const [a, b] = k.split('+');
        return (a === mainCode || b === mainCode) && COMPATIBILITY[k].type === 'rival';
      });
      if (!key) return null;
      const [a, b] = key.split('+');
      return { pairCode: a === mainCode ? b : a, say: COMPATIBILITY[key].say };
    })();
    return { soul, rival };
  }, [mainCode]);

  if (!content) {
    return <div className="text-white p-8">Content missing for {mainCode}</div>;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 text-white">
        {/* Header: code + name + image */}
        <div className="flex items-center gap-4 mb-6">
          {image && <img src={image} alt={code} className="w-20 h-20 rounded-xl" />}
          <div>
            <h1 className="font-mono font-extrabold text-3xl">{code}</h1>
            <p className="text-lg text-muted">{typeDef?.cn}</p>
            {rarity && (
              <p className="text-xs text-accent mt-1">
                {rarity.label} \u00b7 {rarity.pct.toFixed(1)}% \u00b7 {'\u2605'.repeat(rarity.stars)}
              </p>
            )}
          </div>
        </div>

        {/* Section 1: Overview */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u6838\u5fc3\u7279\u5f81</h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{content.overview}</p>
        </section>

        {/* Section 2: DimensionBars */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-3">{config.dimSectionTitle}</h2>
          <MbtiDimensionBars pcts={pcts} />
        </section>

        {/* Section 3: Strengths */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u4f18\u52bf</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ccc]">
            {content.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>

        {/* Section 4: Weaknesses */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u52a3\u52bf</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ccc]">
            {content.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>

        {/* Section 5: Relationships */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u604b\u7231\u4e0e\u4eba\u9645</h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{content.relationships}</p>
        </section>

        {/* Section 6: Careers */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u804c\u4e1a\u5efa\u8bae</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ccc]">
            {content.careers.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>

        {/* Section 7: Growth */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u6210\u957f\u5efa\u8bae</h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{content.growth}</p>
        </section>

        {/* Section 8: Famous people */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-2">\u540c\u7c7b\u578b\u7684\u8457\u540d\u4eba\u7269</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {content.famous.map((f, i) => (
              <div key={i} className="bg-surface-2 rounded-lg p-2">
                <p className="font-bold text-sm">{f.name}</p>
                <p className="text-xs text-muted">{f.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-2">\u5386\u53f2\u4eba\u7269\u53c2\u8003</p>
        </section>

        {/* Section 9: Compat */}
        <section className="mb-6">
          <h2 className="font-bold text-xl mb-3">\u4eba\u683c\u76f8\u6027</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {compatEntries.soul && (
              <div className="bg-surface border border-[#ff6b9d]/20 rounded-xl p-3">
                <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-[#ff3b3b]/10 text-[#ff6b9d] mb-2">
                  \ud83d\udc95 \u5929\u751f\u4e00\u5bf9
                </span>
                <p className="font-mono font-bold text-white mb-1">
                  {mainCode} \u00d7 {compatEntries.soul.pairCode}
                </p>
                <p className="text-sm text-[#999]">{compatEntries.soul.say}</p>
              </div>
            )}
            {compatEntries.rival && (
              <div className="bg-surface border border-warm/20 rounded-xl p-3">
                <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-warm/10 text-warm mb-2">
                  \u2694\ufe0f \u6b22\u559c\u51a4\u5bb6
                </span>
                <p className="font-mono font-bold text-white mb-1">
                  {mainCode} \u00d7 {compatEntries.rival.pairCode}
                </p>
                <p className="text-sm text-[#999]">{compatEntries.rival.say}</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 10: A/T flavor */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-2">
            {suffix === 'A' ? '\u81ea\u4fe1\u578b' : '\u52a8\u8361\u578b'}\u7684\u4f60
          </h2>
          <p className="text-sm text-[#ccc] leading-relaxed">{AT_FLAVOR[suffix]}</p>
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-2 mb-8">
          <button onClick={onShare} className="bg-accent text-white font-bold py-3 rounded-xl">
            \u751f\u6210\u5206\u4eab\u5361\u7247
          </button>
          <button onClick={onInviteCompare} className="border border-border text-white font-bold py-3 rounded-xl">
            \u9080\u8bf7\u670b\u53cb\u5bf9\u6bd4
          </button>
          <button onClick={onRestart} className="text-muted underline text-sm py-2">
            \u91cd\u65b0\u6d4b\u8bd5
          </button>
          <button onClick={onHome} className="text-muted underline text-sm py-2">
            \u8fd4\u56de\u9996\u9875
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 在 MbtiApp.tsx 里替换 ResultPage 为 MbtiResultPage**

修改 `src/MbtiApp.tsx` 中 `{screen === 'result' && result && (...)}` 这一块，把 `<ResultPage ... />` 换成 `<MbtiResultPage ... />`，同时删除那个 block 里已不再需要的 ResultPage import 或保留（如果 ComparePage 里还需要）。

- [ ] **Step 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/components/MbtiResultPage.tsx src/MbtiApp.tsx
git commit -m "feat(mbti): add MbtiResultPage with 10 sections"
```

---

## Phase 6: 扩展集成（Tasks 25-27）

### Task 25: ComparePage 加 mbti 分支

**Files:**
- Modify: `src/components/ComparePage.tsx`

- [ ] **Step 1: 读现有 ComparePage，定位雷达图渲染处**

```bash
grep -n "RadarChart\|radar" src/components/ComparePage.tsx
```

- [ ] **Step 2: 在雷达图渲染处加 config.id === 'mbti' 分支**

在 ComparePage 组件顶部 import MbtiDimensionBars：

```tsx
import MbtiDimensionBars from './MbtiDimensionBars';
```

然后在渲染雷达的地方加分支：

```tsx
{config.id === 'mbti' ? (
  <MbtiDimensionBars
    pcts={computePctsFromLevels(myData.levels, 'mbti')}
    compare={computePctsFromLevels(theirData.levels, 'mbti')}
  />
) : (
  <RadarChart ...original props />
)}
```

由于 compare URL 里 encodeCompare 编码的是 `levels`（字母）而非 `rawScores`（数字），我们需要一个从 levels 反推 pct 的函数。简化方案：pct 只表示"二值字母"，50/50 不合适。**更合理的做法**：`encodeCompare` 同时编码 rawScores（扩展 DecodedCompare 接口）。

实际可行做法（最小改动）：**mbti 的对比只显示字母对比**（我 INTJ-A vs 对方 ENFP-T），不显示百分比条。因为 compare URL 里没法知道对方的 rawScores 细节（除非扩展编码格式，那样对现有 6 个测试不兼容）。

**决策**：MBTI 的 ComparePage 分支只显示"字母对比卡"——两个大字母网格，高亮相同/不同字母。不显示百分比条。

修改：

```tsx
{config.id === 'mbti' ? (
  <MbtiLetterCompare myCode={myData.code} theirCode={theirData.code} />
) : (
  <RadarChart ...original props />
)}
```

`MbtiLetterCompare` 直接写在 ComparePage 同文件内（不必拆单独组件）：

```tsx
function MbtiLetterCompare({ myCode, theirCode }: { myCode: string; theirCode: string }) {
  const myLetters = myCode.replace('-', '').split('');   // ['I','N','T','J','A']
  const theirLetters = theirCode.replace('-', '').split('');
  const labels = ['E/I', 'S/N', 'T/F', 'J/P', 'A/T'];
  return (
    <div className="grid grid-cols-5 gap-2">
      {labels.map((label, i) => {
        const same = myLetters[i] === theirLetters[i];
        return (
          <div key={i} className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted mb-1">{label}</p>
            <div className="flex flex-col gap-1">
              <span className={`font-mono font-extrabold text-xl ${same ? 'text-green-400' : 'text-white'}`}>
                {myLetters[i]}
              </span>
              <span className="text-xs text-muted">vs</span>
              <span className={`font-mono font-extrabold text-xl ${same ? 'text-green-400' : 'text-accent'}`}>
                {theirLetters[i]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/components/ComparePage.tsx
git commit -m "feat(mbti): add letter-compare branch to ComparePage"
```

---

### Task 26: shareCard 加 mbti 分支

**Files:**
- Modify: `src/utils/shareCard.ts`

- [ ] **Step 1: 读 drawShareCard 函数结构**

```bash
grep -n "drawShareCard\|radar\|drawRadar" src/utils/shareCard.ts
```

- [ ] **Step 2: 在 drawShareCard 里加 mbti 分支**

在函数内部（绘制雷达图的代码段前）：

```ts
if (config.id === 'mbti') {
  drawMbtiBars(ctx, result, x, y, w, h);
} else {
  drawRadar(ctx, result, x, y, w, h);
}
```

`drawMbtiBars` 实现：在指定坐标区域画 5 条水平进度条，每条左右两端写字母，右侧写百分比。复用 `computePcts` 的逻辑（需要从 result 的 rawScores 推算；rawScores 在 result 对象内）。

```ts
function drawMbtiBars(ctx: CanvasRenderingContext2D, result: ComputeResultOutput, x: number, y: number, w: number, h: number) {
  const maxAbs: Record<string, number> = { EI: 45, SN: 45, TF: 45, JP: 45, AT: 36 };
  const dims = [
    { key: 'EI', left: 'I', right: 'E' },
    { key: 'SN', left: 'N', right: 'S' },
    { key: 'TF', left: 'T', right: 'F' },
    { key: 'JP', left: 'J', right: 'P' },
    { key: 'AT', left: 'A', right: 'T' },
  ];
  const rowH = h / dims.length;
  dims.forEach((d, i) => {
    const score = result.rawScores[d.key] ?? 0;
    const max = maxAbs[d.key];
    const pct = Math.max(0, Math.min(100, Math.round(50 + (score / max) * 50)));
    const rowY = y + i * rowH + rowH / 2;
    // Left letter
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(d.left, x, rowY + 6);
    // Bar background
    const barX = x + 30;
    const barW = w - 80;
    const barY = rowY - 5;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, 10);
    // Fill
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(barX, barY, (barW * pct) / 100, 10);
    // Right letter
    ctx.fillStyle = '#fff';
    ctx.fillText(d.right, barX + barW + 10, rowY + 6);
    // Pct text
    ctx.fillStyle = '#999';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${pct}%`, barX + barW + 30, rowY + 6);
  });
}
```

- [ ] **Step 3: 类型检查 + Commit**

```bash
npx tsc --noEmit
git add src/utils/shareCard.ts
git commit -m "feat(mbti): draw dimension bars instead of radar in share card"
```

---

### Task 27: useQuiz 支持 draftKey（本地草稿）

**Files:**
- Modify: `src/hooks/useQuiz.ts`
- Modify: `src/MbtiApp.tsx`

- [ ] **Step 1: 在 useQuiz 里加 draftKey 参数支持**

读现有 `useQuiz` 实现：

```bash
cat src/hooks/useQuiz.ts
```

修改签名：

```ts
export function useQuiz(options?: { draftKey?: string }): QuizHook {
  const draftKey = options?.draftKey;
  // ...
}
```

在 useQuiz 内部：

**写入**：监听 `answers` / `shuffledQuestions` / `currentIndex` 的变化，debounce 300ms 写 draft：

```ts
useEffect(() => {
  if (!draftKey) return;
  const t = setTimeout(() => {
    const draft = {
      version: 1,
      answers,
      questionOrder: shuffledQuestions.map(q => q.id),
      currentIndex,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {}
  }, 300);
  return () => clearTimeout(t);
}, [draftKey, answers, shuffledQuestions, currentIndex]);
```

**读取**：在 `startQuiz` 前暴露一个 `checkDraft` 方法：

```ts
function checkDraft(): { exists: boolean; answered: number; total: number } | null {
  if (!draftKey) return null;
  try {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const ageMs = Date.now() - (d.savedAt || 0);
    if (ageMs > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(draftKey);
      return null;
    }
    return {
      exists: true,
      answered: Object.keys(d.answers || {}).length,
      total: (d.questionOrder || []).length,
    };
  } catch {
    return null;
  }
}

function resumeDraft(config: TestConfig) {
  if (!draftKey) return false;
  try {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return false;
    const d = JSON.parse(raw);
    // 按 d.questionOrder 重建 shuffledQuestions
    const allQs = [...config.questions, ...config.specialQuestions];
    const byId = Object.fromEntries(allQs.map(q => [q.id, q]));
    const restored = (d.questionOrder as string[]).map(id => byId[id]).filter(Boolean);
    setShuffledQuestions(restored);
    setAnswers(d.answers || {});
    setCurrentIndex(d.currentIndex || 0);
    return true;
  } catch {
    return false;
  }
}

function clearDraft() {
  if (draftKey) {
    try { localStorage.removeItem(draftKey); } catch {}
  }
}
```

在 `startQuiz` 结束时调用 `clearDraft()`（新测试覆盖旧 draft）。在 `getResult` 提交后也调用 `clearDraft()`。

把 `checkDraft` / `resumeDraft` / `clearDraft` 加入 QuizHook 的返回值类型。

- [ ] **Step 2: 在 MbtiApp 里接入 draftKey 和 resume 逻辑**

在 MbtiApp.tsx 里：

```ts
const quiz = useQuiz({ draftKey: 'mbti_draft' });
```

在 Hash routing 的 useEffect 中，`handleStartTest` 之前加检查：

```ts
const handleStartTest = useCallback(() => {
  const draft = quiz.checkDraft?.();
  if (draft && draft.exists && draft.answered > 0) {
    const ok = window.confirm(`\u7ee7\u7eed\u4e0a\u6b21\u6d4b\u8bd5\uff08\u5df2\u7b54 ${draft.answered}/${draft.total}\uff09\uff1f`);
    if (ok) {
      const resumed = quiz.resumeDraft?.(config);
      if (resumed) {
        setScreen('quiz');
        return;
      }
    }
    quiz.clearDraft?.();
  }
  quiz.startQuiz();
  setScreen('quiz');
}, [quiz, config]);
```

`handleQuizSubmit` 中（提交后），`quiz.clearDraft?.()` 会在 `getResult` 内部自动触发（已在 useQuiz 中处理），此处不需额外。

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 手动测试**

```bash
npm run dev
```

- 打开 `http://localhost:5173/mbti`
- 开始测试，答 5 题
- 关闭标签页
- 重开 `http://localhost:5173/mbti`，点击"开始测试"
- 应弹 confirm 对话框"继续上次测试（已答 5/72）？"
- 点确认，恢复到第 6 题
- 完成所有题目后，localStorage 的 `mbti_draft` 应被清除

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useQuiz.ts src/MbtiApp.tsx
git commit -m "feat(mbti): add local draft save/resume for 72-question session"
```

---

## Phase 7: 收尾 + 端到端测试（Tasks 28-29）

### Task 28: 注册到 allTests.ts 导航

**Files:**
- Modify: `src/data/allTests.ts`

- [ ] **Step 1: 追加 mbti 条目**

在 `ALL_TESTS` 数组末尾加：

```ts
{
  id: 'mbti',
  name: 'MBTI 16 \u578b\u4eba\u683c\u6d4b\u8bd5 \u00b7 \u5b8c\u6574\u7248',
  tagline: '72 \u9898\u5b8c\u6574\u7248 \u00b7 16 \u79cd\u4eba\u683c \u00d7 A/T \u4e9a\u578b',
  path: '/new/mbti',
  emoji: '\ud83e\uddec',
},
```

- [ ] **Step 2: 类型检查**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 本地 build + 访问验证**

```bash
npm run build
```

打开 `dist/index.html`（或用 `npx vite preview`）访问根页，验证首页和其它测试的跨测推荐位里能看到"MBTI 16 型人格测试"入口。

- [ ] **Step 4: Commit**

```bash
git add src/data/allTests.ts
git commit -m "feat(mbti): register MBTI test in global navigation"
```

---

### Task 29: 端到端手动测试清单

**目的**：上线前最后一道关卡。所有验收条件在这里逐条打钩。

**Files:**
- 无代码改动；此 task 纯粹是手动测试

- [ ] **Step 1: 启动 dev server**

```bash
npm run dev
```

- [ ] **Step 2: 验收清单（逐条打勾）**

- [ ] 访问 `http://localhost:5173/mbti` 加载成功，标题显示 "MBTI 16 型人格测试 · 完整版"
- [ ] Hero 里显示总测试数计数（即便是 0）
- [ ] 点 "开始测试" 进入答题流程，**第 1 题显示为 7 点量表圆点**而不是按钮列表
- [ ] 答第 1 题点圆点后自动进入第 2 题
- [ ] 进度条按 `N/72` 递增
- [ ] 调试模式（hash `#test`）能自动填充所有 72 题并跳到结果页
- [ ] 正常走完 72 题 → Interstitial → 结果页
- [ ] **结果页显示类型代码（如 INTJ-A）和中文名（建筑师 · 自信型）**
- [ ] 结果页显示 **5 条百分比维度条**（不是雷达图）
- [ ] 8 板块内容依次显示：核心特征 → 维度条 → 优势 → 劣势 → 恋爱与人际 → 职业建议 → 成长建议 → 著名人物 → 相性 → A/T 层叠文案
- [ ] 相性卡片显示 1 个 soulmate + 1 个 rival
- [ ] 点 "生成分享卡片" → 弹 Modal → 生成的图里**画的是 5 条百分比条而非雷达图**
- [ ] 点 "邀请好友对比" → 生成对比链接 `#compare=...`
- [ ] 在新标签页打开对比链接（在答过测试的浏览器里）→ ComparePage 渲染双方字母对比网格
- [ ] 重新测试时，如答到一半关闭浏览器，再次访问 `/mbti` 点 "开始测试" 弹 confirm "继续上次测试（N/72）？"
- [ ] 确认继续后恢复到正确题目位置
- [ ] 完成整个测试后 `localStorage.mbti_draft` 被清除
- [ ] 回到 `/new`（首页）→ 跨测推荐位里出现 "MBTI 16 型人格测试 · 完整版"
- [ ] 访问 `/work` → 跨测推荐里也出现 mbti

- [ ] **Step 3: 回归测试现有 6 个测试（抽查）**

访问 `/`、`/love`、`/work` 各做一次：
- [ ] 正常进入各自首页
- [ ] 做一次测试能走完并显示结果
- [ ] 结果页仍然是雷达图 + L/M/H 徽章（不受 mbti 分支影响）

- [ ] **Step 4: 生产 build 验证**

```bash
npm run build
ls -la dist/mbti/
```

Expected: `dist/mbti/index.html` 存在

- [ ] **Step 5: 如果全部通过，总结 commit**

此 task 不产生代码改动，不需 commit。如果发现问题：修 → 回到对应 task 重新做。

---

## 总结

29 个 task 分 7 phase 完成。关键里程碑：
- **Phase 1（Tasks 1-6）**完成后：框架能跑，`/mbti` 能访问到空壳页面
- **Phase 2（Tasks 7-10）**完成后：数据结构完整，能跳转到结果页但内容空
- **Phase 3（Tasks 11-15）**完成后：72 题可答
- **Phase 4（Tasks 16-20）**完成后：8 板块内容完整
- **Phase 5（Tasks 21-24）**完成后：结果页可视化完整
- **Phase 6（Tasks 25-27）**完成后：对比 / 分享卡 / 本地草稿齐备
- **Phase 7（Tasks 28-29）**完成后：上线

**总代码改动规模**：~24 文件，~3500 行（~2500 行数据 + ~1000 行组件/逻辑）。

**提交数**：约 20+ commits（每个 task 一个 commit，content.ts 一个 phase 一个 commit）。
