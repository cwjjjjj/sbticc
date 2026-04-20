# MBTI 16 型人格测试 · 完整版 — 设计文档

**日期**: 2026-04-20
**作者**: Claude + @jike
**状态**: 待审核

## 背景与目标

在现有 SBTI 项目中新增一个与 16personalities 体验等价的完整版 MBTI 测试，作为与现有 6 个测试（sbti / love / work / values / cyber / desire）并列的第 7 个测试。

### 为什么做

项目作者的朋友因网络限制无法访问 16personalities.com，需要一个可替代的、功能完整的中文 MBTI 测试站。

### 版权边界（重要）

- **MBTI 4 维度理论**（E/I, S/N, T/F, J/P）与 **16 种类型代码**（INTJ、ENFP 等）属于公共心理学知识，可自由使用。
- **A/T 身份维度**的行为描述来自公开心理学文献（对应五大人格的 Neuroticism 维度），可自由实现。
- **题目文本、官方人格描述文案**受版权保护。本项目**全部题目与人格描述为原创**，不复制、不改写、不翻译任何具体 MBTI 题库的题目措辞。原创内容按标准 MBTI 心理计量学方法设计，测出同一类型的概率高，但题目表述与任何具体网站都不同。

## 核心决策（来自头脑风暴）

| 决策 | 选择 |
|---|---|
| 测试规模 | 完整版（~72 题） |
| 第五维度 | 加 -A/-T，输出 32 种亚型 |
| 结果板块 | 核心特征 + 优势 + 劣势 + 恋爱与人际 + 职业建议 + 成长建议 + 著名人物 + 维度条，共 8 项 |
| 集成程度 | 完整接入（排名 / 相性 / 分享 / 对比 / 本地历史） |
| 题目形式 | 7 点李克特量表 |
| 隐藏类型 | 无 |
| 相性表 | 仅按 16 主类型（-A/-T 不参与相性判定） |
| 路径 | `/mbti` |
| 中文名 | "MBTI 16 型人格测试 · 完整版" |
| Emoji | 🧬 |
| 结果页视觉 | 用百分比条形图替代雷达图（MBTI 惯用形态） |
| 中途保存 | 有本地草稿机制 |

## 架构

### 嵌入现有框架

SBTI 项目已有的 `TestConfig` 抽象（`src/data/testConfig.tsx`）和 `computeResult` 算法（`src/utils/matching.ts`）天然适配 MBTI：

- 现有算法用**维度求和 → 分级 → 与 pattern 向量比对**。work 测试已证明二值分级（A/B）可行。
- MBTI 5 个维度每个都是二值，5 字母 pattern 互斥唯一 → 精确匹配、无歧义。
- `similarityThreshold: 0` 关闭兜底，`hiddenTriggerQuestionId: ''` 关闭隐藏触发。

### 数据模型

#### 5 个维度（dimension keys）

| key | 左极 | 右极 | UI 显示名 |
|---|---|---|---|
| `EI` | I | E | 能量方向 |
| `SN` | N | S | 信息处理 |
| `TF` | T | F | 决策依据 |
| `JP` | J | P | 生活方式 |
| `AT` | A | T | 身份认同 |

`dimensionOrder: ['EI', 'SN', 'TF', 'JP', 'AT']`

#### 32 种类型代码

16 主类型（INTJ / INTP / ENTJ / ENTP / INFJ / INFP / ENFJ / ENFP / ISTJ / ISFJ / ESTJ / ESFJ / ISTP / ISFP / ESTP / ESFP）× 2 亚型（-A / -T）= 32 种。

Pattern 编码直接取自类型代码，如 `INTJ-A` → `['I', 'N', 'T', 'J', 'A']`。

#### 题目

72 题，分配：
- E/I：15 题
- S/N：15 题
- T/F：15 题
- J/P：15 题
- A/T：12 题

每题结构：
```ts
{
  id: 'mbti_ei_001',
  dim: 'EI',
  kind: 'likert',
  text: '（原创场景/偏好句）',
  options: [
    { label: '完全同意', value: 3 },
    { label: '同意', value: 2 },
    { label: '略同意', value: 1 },
    { label: '中立', value: 0 },
    { label: '略不同意', value: -1 },
    { label: '不同意', value: -2 },
    { label: '完全不同意', value: -3 },
  ],
}
```

量表文案全局统一（在 `questions.ts` 顶部定一个常量 `LIKERT_OPTIONS` 复用）。

**方向标注**：量表选项的 value（-3..3）符号直接表示方向。约定：**value 为正 → 加到偏向右极（E/S/F/P/T）**，**value 为负 → 加到偏向左极（I/N/T/J/A）**。

举例：题干 "我喜欢在人多的场合补充能量"（偏 E 的陈述），用户选"完全同意"应得 value = +3（贡献给 E）。题干 "我常在脑中预演未来的场景"（偏 N 的陈述），用户选"完全同意"应得 value = -3（贡献给 N）。

出题时需要让作者自己选：**句子写成"偏正极/右极"视角、还是"偏负极/左极"视角**，并在 questions.ts 里把选项的 value 对应起来。为避免混乱，本项目**统一所有题目都写成"偏右极"视角**（"偏 E"、"偏 S"、"偏 F"、"偏 P"、"偏 T"），这样所有题的 value 表映射完全一样（+3 = 完全同意 = 加正分），只需通过题干措辞表达方向。

### 打分流程

1. **维度累加**：遍历 72 题，`rawScores[q.dim] += answer.value`（值域 -3..3）。
   - 每维度理论值域：EI/SN/TF/JP = ±45（15 题 × 3），AT = ±36（12 题 × 3）
2. **字母判定**（`sumToLevel`）：需要按 dim 调度。由于现有 `sumToLevel: (score) => string` 签名不带 dim，MBTI 配置里把 `sumToLevel` 改成**在同一函数内根据调用上下文的 dim 名区分**——具体实现：mbti 的 `config.sumToLevel` 通过闭包引用的 `currentDim` 状态判断，或者更干净的办法是**引入新的直接解析器**（见下）。
3. **直接类型解析器**（MBTI 专用）：
   - 现有 `matching.ts` 的 `levelNum` 函数只识别 L/M/H/A/B。如果我们让 mbti 的 sumToLevel 返回 I/E/N/S/T/F/J/P/a/t，这些字母会全部落到 `?? 2` 分支，所有维度距离都算成 0，**32 种类型会全部并列**。这是一个必须修的真实 bug。
   - 解决方案：**在 `TestConfig` 增加一个可选字段** `directTypeResolver?: (levels: Record<string, string>) => string`。在 `computeResult` 开头判断：如果 config 提供了这个函数，跳过 pattern matching，直接用返回的 code 查 `typeLibrary`，产出 `finalType`。其它 6 个测试不设置这个字段，行为不变。
   - mbti 的 resolver：
     ```ts
     directTypeResolver: (levels) =>
       `${levels.EI}${levels.SN}${levels.TF}${levels.JP}-${levels.AT}`
     ```
   - 这同时也简化了 mbti 的 sumToLevel 实现——它直接返回对应字母即可（不再需要 `levelNum` 理解它们）：
     - `EI` → `score >= 0 ? 'E' : 'I'`
     - `SN` → `score >= 0 ? 'S' : 'N'`
     - `TF` → `score >= 0 ? 'F' : 'T'`
     - `JP` → `score >= 0 ? 'P' : 'J'`
     - `AT` → `score >= 0 ? 'T' : 'A'`
   - 由于 `sumToLevel` 签名没 dim 参数，我们换一种做法：`config.sumToLevel` 在 mbti 里其实**不使用**——直接在 mbti 的 `computeResult` 分支里手写 5 个 if 分支把 rawScores 转成 levels。`directTypeResolver` 一个函数吃 levels 出 code，干净利落。
4. **百分比计算**（MBTI 结果页专用）：
   - 每维度额外算 `pct = round(50 + (rawScores[dim] / maxAbs) * 50)`
   - 其中 `maxAbs = 题数 × 3`（EI/SN/TF/JP = 45，AT = 36）
   - 结果 0..100 的整数，用于结果页 5 条百分比条

### matching.ts 改动最小化

```ts
// 在 computeResult 顶部（rawScores 计算完、levels 转换之后）：
if (config.directTypeResolver) {
  const code = config.directTypeResolver(levels);
  const typeDef = typeLibrary[code] ?? typeLibrary[fallbackTypeCode];
  const finalType = { ...typeDef, similarity: 100, exact: dimCount, distance: 0 } as RankedType;
  return {
    rawScores,
    levels,
    ranked: [finalType],
    bestNormal: finalType,
    finalType,
    modeKicker: '你的人格类型',
    badge: `${code}`,
    sub: '',
    special: false,
    secondaryType: null,
  };
}
// ...原有 pattern matching 逻辑不变
```

对其它 6 个测试零影响。

### 关键 config 字段

```ts
mbtiConfig: TestConfig = {
  id: 'mbti',
  name: 'MBTI 16 型人格测试 · 完整版',
  dimensionOrder: ['EI', 'SN', 'TF', 'JP', 'AT'],
  fallbackTypeCode: 'INTJ-A',      // 理论上走不到；填真实 code 以防守护
  hiddenTypeCode: '',              // 无
  hiddenTriggerQuestionId: '',     // 关闭隐藏触发
  similarityThreshold: 0,          // 关闭兜底（directTypeResolver 直接给答案）
  maxDistance: 5,                  // 5 维 binary；directTypeResolver 存在时不使用
  directTypeResolver: (levels) =>
    `${levels.EI}${levels.SN}${levels.TF}${levels.JP}-${levels.AT}`,
  basePath: '/new/mbti',
  localHistoryKey: 'mbti_history',
  localStatsKey: 'mbti_local_stats',
  apiTestParam: 'mbti',
  dimSectionTitle: '五维度评分',
  questionCountLabel: '72',
  // sumToLevel 字段仍需提供（签名不变）——mbti 分支里 computeResult 不调用它，
  // 但 TypeScript 要求 TestConfig 接口字段非可选，给一个 stub 实现即可
  sumToLevel: () => 'A',
  // ...questions / typeLibrary / normalTypes / typeImages / compatibility 等
}
```

### UI 架构

#### 改动现有组件

**`src/components/QuestionCard.tsx`**
- 当前：根据 `question.options` 渲染垂直按钮列表
- 新增：`question.kind === 'likert'` 分支
  - 横向 7 圆点量表
  - 左侧标签"不同意"，右侧标签"同意"（或用箭头符号）
  - 点击任一圆立即提交（跟现有"单选即提交"一致）
  - 中间圆（value=0）更小、更暗，两端依次放大并染色

**`src/utils/quiz.ts`**
- `randomAnswerForQuestion` 加 `kind === 'likert'` 分支：返回 `-3..3` 随机整数（用于 `#test` 调试自动填充）

**`src/data/testConfig.tsx`**
- `Question.kind` 类型扩展：由 `string` 收窄为 `'single' | 'multi' | 'likert'`（或保留 `string` 允许任意值）

#### 新增 MBTI 专属组件

**`src/components/MbtiDimensionBars.tsx`**
- Props: `levels` + 计算好的 `pcts` + `dimensionOrder` + `dimensionMeta` + 两极标签
- 渲染 5 条横向分段条。每条左右两端是字母（I / E），中间是百分比数字。主体是一个带渐变的填充条，高亮当前偏向极的那一侧。

**`src/components/MbtiResultPage.tsx`**
- 包装现有 `ResultPage`，或完全替代它。初版**完全替代**：
  - 顶部：类型卡（代码 + 中文名 + 小标签 A/T）
  - 第 1 板块：核心特征（1 段）
  - 第 2 板块：`MbtiDimensionBars`
  - 第 3 板块：优势（bullets）
  - 第 4 板块：劣势（bullets）
  - 第 5 板块：恋爱与人际（1-2 段）
  - 第 6 板块：职业建议（bullets）
  - 第 7 板块：成长建议（1 段）
  - 第 8 板块：著名人物（3-5 条，每条"人名 · 身份"）
  - 第 9 板块：相性——**不使用全局 `CompatTable`**（那个组件绑定了项目根层的 `data/types` 和 `data/compatibility`，不走 TestConfig）。在 `MbtiResultPage` 内部直接渲染：把当前类型代码去掉 `-A`/`-T` 后缀得到主类型，查 `compatibility.ts` 的 `{main: {soulmate, rival}}` 结构，展示 2 张小卡片（一张 soulmate、一张 rival）
  - 第 10 板块：A/T 层叠文案（短段）
  - 底部：分享按钮 / 邀请对比按钮 / 重测 / 返回 —— 沿用现有 `ResultPage` 的按钮行为

#### 定制现有组件

**`src/components/ComparePage.tsx`**
- 加一个判断：如果当前 `TestConfig.id === 'mbti'`，渲染 `MbtiDimensionBars`（双人叠加：两种颜色）而非雷达图。

**`src/utils/shareCard.ts`**
- 在 `drawShareCard` 里加 `config.id === 'mbti'` 分支：画 5 条百分比条而不是雷达图。其它元素（类型代码、中文名、QR）结构不变。

### 后端

#### API 白名单

**`api/record.js`** 的 `VALID_TYPES_BY_TEST` 加一条：
```js
'mbti': new Set([
  'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
  'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
  'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
  'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
]),
```

**`api/ranking.js`** 的 `MOCK_TYPES_BY_TEST.mbti` 同上 32 条。**不加**到 `HIDDEN_TYPE_BY_TEST`（无隐藏类型），`buildMockCounts` 会给所有 32 种类型正常权重。

#### Redis 键

按现有前缀规则，`test=mbti` 对应前缀 `mbti:`：
- `mbti:ranking` — sorted set
- `mbti:total` — counter
- `mbti:devices` — set
- `mbti:device_results` — hash
- `mbti:mock` / `mbti:mock_total` — 可选运营数据

不需要修改 API handler 代码本身，只需更新白名单。

### 路由

**`vite.config.ts`** rollupOptions.input：
```ts
{ main, love, work, values, cyber, desire, mbti: 'mbti.html' }
```

**`vercel.json`**：
```json
{ "source": "/mbti", "destination": "/mbti/index.html" }
```
排除列表加 `mbti`：
```
/((?!api|assets|images|love|work|values|cyber|desire|mbti|sw\\.js).*)
```

**`build.sh`** 第 16 行数组加 `mbti`。

**`mbti.html`** 复制 `work.html`，改标题和入口组件为 `MbtiApp`。

### 导航集成

`src/data/allTests.ts` 追加：
```ts
{
  id: 'mbti',
  name: 'MBTI 16 型人格测试 · 完整版',
  tagline: '72 题完整版 · 16 种人格 × A/T 亚型',
  path: '/new/mbti',
  emoji: '🧬',
}
```

现有的 `OtherTests` 组件会自动在其它测试的推荐位展示 mbti 入口。

## 新增功能：本地草稿机制

### 需求

72 题较长，需要支持：刷新页面 / 意外关闭后，再次访问 `/mbti` 时自动恢复到上次答到的位置。

### 实现

**存储**：`localStorage` key = `mbti_draft`，值为 JSON：
```ts
{
  version: 1,
  answers: Record<string, number>,
  questionOrder: string[],        // 题目乱序后的 ID 序列
  currentIndex: number,
  savedAt: number,                // Unix timestamp
}
```

**写入时机**：`useQuiz` 里每次 `setAnswer` 之后，debounce 300ms 写一次 draft。

**读取时机**：
- 进入 `quiz` screen 时，检查 `localStorage.mbti_draft`
- 如果存在且 `savedAt` 在 7 天内：弹确认对话框"继续上次测试（已答 N/72）？" → 是：恢复答题位置；否：清除 draft 开新测
- 如果不存在或已过期：正常开新测

**清除时机**：
- 完成测试（进入 interstitial）时清除
- 用户主动"重新开始"时清除
- `savedAt` 超过 7 天自动过期

**作用域**：只在 `config.id === 'mbti'` 时启用。其它测试不开启。实现方式：`useQuiz` 接受一个 `draftKey?: string` 参数；MbtiApp 传入 `config.localHistoryKey.replace('_history', '_draft')`，其它 App 不传即不启用。

### 无需改动的地方

- `useQuiz` 的核心答题状态机
- 题目乱序逻辑（已经在 `useQuiz` 内部完成）

## 内容范围

### 原创内容清单

| 项 | 数量 | 估算字数 |
|---|---|---|
| 题目 | 72 题 | ~1,800 字 |
| 量表选项 | 1 套 × 7 | ~30 字 |
| 16 主类型 TypeDef (`cn` / `intro` / `desc`) | 16 | ~800 字 |
| 32 亚型 TypeDef（复用主类型文案 + A/T 后缀） | 32 | ~200 字 |
| 16 主类型扩展内容（8 板块） | 16 × ~1,000 字 | ~16,000 字 |
| A/T 层叠文案 | 2 段 | ~240 字 |
| 相性条目（16 soulmate + 16 rival） | 32 | ~1,600 字 |
| **合计** | | **~20,700 字** |

### TYPE_RARITY 策略

现有 `TestConfig.typeRarity` 要求对 `typeLibrary` 中每个 code 都有对应的 `RarityInfo { pct, stars, label }`。由于主类型 A/T 没有公开的细分统计数据，处理方式：
- 按 16 主类型公开的理论比例设定（如 INFJ ~1.5%、ISFJ ~14%、ESTJ ~9% 等，使用公开心理学调查数据）
- 同一主类型的 -A / -T 亚型按 50/50 拆分该主类型的 pct
- 展开成 32 个 `RarityInfo` 条目，`label` 字符串共享（如 "稀有：全球约 0.7% 拥有"）
- `stars` 按 pct 映射（<1%→5 星、<3%→4 星、<8%→3 星、<15%→2 星、≥15%→1 星）

### 类型图策略

不做手绘。`src/data/mbti/typeImages.ts` 导出一个函数 `generateMbtiTypeSvg(code)` 在模块加载时循环调用生成 32 张 SVG data URL：
- 背景：4 大 temperament 分组染色（NT 紫 `#8b5cf6` / NF 绿 `#10b981` / SJ 蓝 `#3b82f6` / SP 黄 `#f59e0b`）
- 主体：大号四字母（INTJ）
- 右下角：小标签圆（A 或 T）

达到视觉识别度 + 零外部图片资源。

### 著名人物选取原则

**可选**（避版权）：
- 已故历史人物（政治、科学、文学、艺术、哲学界）
- 公共领域概念人物（如古希腊哲学家、神话原型）

**不选**：
- 在世明星、商业 IP 虚构角色、版权未过期的文学角色

每类型选 3-5 个，标明"历史人物参考"字样。

## 风险

| 风险 | 缓解 |
|---|---|
| 原创题目与 16p 对同一用户可能测出不同亚型 | 按标准心理计量学方法出题，前 4 维度高一致，A/T 公开说明精度较低 |
| 20,000 字原创内容工作量大 | 拆分成多个子任务，分批完成；首版可先出所有 16 主类型的精简版，后续迭代 |
| ComparePage / shareCard 加 mbti 分支增加维护成本 | 接受此代价，这是 MBTI 与其它测试本质差异的必然结果 |
| `matching.ts` 的 `modeKicker` / `badge` / `sub` 文案对 mbti 不适用 | 在 `MbtiResultPage` 里覆盖这几个字段，不渲染默认文案 |
| A/T 精度低于公开 MBTI 测试 | 在结果页注明"A/T 为实验性维度，精度低于四字母主类型" |

## 不在本次范围

- 官方 MBTI® 商标与 The Myers-Briggs Company 授权（本测试不使用"MBTI®"注册商标，标题使用"MBTI"作为通用心理学术语）
- 测试结果的学术效度验证（不宣称本测试是 MBTI® Form M 的替代品）
- 人格图谱的社交传播机制（沿用现有分享 / 对比，不新增）
- 付费解锁（不接入 Stripe）

## 实施顺序（大块）

1. **框架铺设**：新增 `src/data/mbti/` 目录骨架（空文件），`mbti.html`，`MbtiApp.tsx`，更新 vite/vercel/build 配置
2. **后端白名单**：`api/record.js` 和 `api/ranking.js` 加 mbti 白名单
3. **维度 / 类型结构**：`dimensions.ts` / `types.ts`（32 NORMAL_TYPES + TypeDef 骨架，内容先用占位）
4. **题目**：`questions.ts` 写完 72 题
5. **扩展内容**：`content.ts` 写完 16 主类型 × 8 板块 + 2 A/T 层叠
6. **类型图生成器**：`typeImages.ts`
7. **相性**：`compatibility.ts`
8. **QuestionCard Likert 渲染分支**
9. **MbtiDimensionBars 组件**
10. **MbtiResultPage 组件**
11. **ComparePage / shareCard 加 mbti 分支**
12. **本地草稿机制**
13. **`allTests.ts` 导航入口**
14. **手动端到端测试**

顺序便于每一步都能独立验证并提交一个 commit。

## 验收标准

- [ ] `/mbti` 能加载，首页显示 "MBTI 16 型人格测试 · 完整版"
- [ ] 点击"开始测试"进入 72 题答题流程，所有题都是 7 点量表
- [ ] 答完显示结果页：类型代码（如 INTJ-A）、中文名、8 个板块、百分比条
- [ ] 相同答题组合多次测试结果稳定一致
- [ ] 答到一半刷新能弹"继续上次测试"，选择继续恢复到断点
- [ ] 分享卡片生成成功，显示百分比条而非雷达图
- [ ] `/api/ranking?test=mbti` 返回 32 种类型的排名数据
- [ ] 对比链接（`/mbti#compare=<b64>`）能打开并显示双人百分比条对比
- [ ] 其它 6 个测试的功能不受影响（回归）
- [ ] 首页和每个测试的 OtherTests 推荐位能看到 mbti 入口
