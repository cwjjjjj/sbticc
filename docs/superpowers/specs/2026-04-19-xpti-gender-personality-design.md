# XPTI · 性别人格画像 Design

**Date:** 2026-04-19
**Inspired by:** 小红书 FCI/XPTI 概念（原帖作者只开了 8 维草案，无类型）
**Goal:** 第 11 个测试 — 用同一套 8 维度测量用户在「恋爱模式 + 自我人设 + 能量气质」三合一维度上的画像，男生/女生各用独立类型池。
**URL:** `/xpti` | **基础设施:** 复用 GSTI 的性别分流 + SBTI 的结果计算管线

---

## 定位

**XPTI = 性别视角下的你**。用户先选性别，后续 24 题同构但结果分入不同类型池。
不是"反串"（GSTI 那套），也不限于"恋爱"（love 那套）或"欲望"（desire 那套），而是「**你作为一个性别化主体在世界里是什么气质**」。

## 8 个维度（沿用原帖，不改）

| Code | 名 | 解释 |
|------|---|------|
| D | 支配 | 主导 vs 让渡；在互动中掌控还是适配 |
| V | 视觉 | 外显审美敏感 vs 内向实用；照镜子的重要性 |
| P | 纯爱 | 理想化情感 vs 务实情感；浪漫阈值 |
| F | 幻想 | 脑内剧本 vs 现实聚焦；白日梦频率 |
| S | 顺从 | 配合引导 vs 逆反抗拒；他人意志的穿透度 |
| E | 情感 | 情绪密度高 vs 低；感受型 vs 抽离型 |
| N | 混沌 | 随机自由 vs 有序结构；可预测度 |
| R | 现实 | 物质实用 vs 脱俗抽离；接地程度 |

每维度用 6 种配对关系：D/V/P/F/S/E/N/R 每个都是**独立坐标**（不是二元对立），每个类型在 8 维上各有高低分。

## 题目结构

- **24 题**（8 维 × 每维 3 题）
- 每题 4 选项
- 每题绑定 1-2 个维度 score 映射（`dimScores: [{dim: 'D', value: 1}, {dim: 'V', value: -1}]`）
- 题材配比：恋爱/关系 40% + 自我人设 30% + 情绪能量 30%
- 题目对男女通用（不分流）

## 类型池（共 42 个）

**男生池 21 个**（20 主 + 1 兜底 `MSHADOW`）
- 偏 **支配 / 现实 / 混沌 / 顺从** 的男性原型
- 类型 code 格式：6 字母，大写，第一位固定 `M` 避免与女性池冲突

**女生池 21 个**（20 主 + 1 兜底 `FSHADOW`）
- 偏 **幻想 / 情感 / 视觉 / 纯爱** 的女性原型（呼应 FCI 原意）
- 类型 code 格式：6 字母，大写，第一位固定 `F`

**1 个跨性别隐藏类型 `XFREAK`**
- 触发：某道特定题（`trigger_q`）选择特定值（比如"以上都不是"）
- 男女都可以触发，避免只有一性别能拿到

## 计算

完全复用 `src/utils/matching.ts` 的 `computeResult` 逻辑：
- 每个类型有一组 8 维 pattern vector（参考 NORMAL_TYPES 结构）
- 用户答题 → 累计每维度分数 → L2 归一化 → 和每个类型 pattern 做 cosine similarity
- **性别字段**作为过滤器：男选只在男池里匹配；女选只在女池里匹配；隐藏触发除外

## 品牌

- **主色**：黑 `#0a0a0a` + 金 `#d4af37` + 银灰 `#a8a8a8`
- **调性**：肖像画 / 黑金时装大片 / 暗调杂志编辑风
- **图片风格**：editorial magazine portrait, chiaroscuro lighting, 1:1 square, black + gold accents
- **声音**：延续站内 — 毒舌 / 不崇拜性别气质 / 反讽男性气质和女性气质的刻板标签

## 现状复用

| 复用组件 | 文件 | 用途 |
|---|---|---|
| `TestConfigProvider` | `src/data/testConfig.tsx` | 类型定义 + context |
| `useQuiz` | `src/hooks/useQuiz.ts` | 答题 state + 自动续测 |
| `useRanking` | `src/hooks/useRanking.ts` | 排行榜 |
| `useRarity` | `src/hooks/useRarity.ts` | 稀有度 |
| `useLocalHistory` | `src/hooks/useLocalHistory.ts` | 本地记录 |
| `ResultPage / Interstitial / ShareModal / QuizOverlay` | `src/components/*` | 标配结果管线 |
| `shareCard`, `compare`, `qr`, `matching`, `quiz` utilities | `src/utils/*` | 全部复用 |
| `computeResult` | `src/utils/matching.ts` | 加性别过滤参数（已有 gender 支持，GSTI 已用） |

## 文件清单（新建）

```
src/data/xpti/
├── config.ts             // TestConfig export (mirrors gsti/config.ts)
├── types.ts              // TYPE_LIBRARY (42 types) + NORMAL_TYPES (42 pattern vectors)
├── questions.ts          // 24 questions + specialQuestions + DIMENSIONS + gateQuestionId
└── typeImages.ts         // Placeholder first, fill after ChatHub batch
└── images/               // 42 webp generated later

src/XptiApp.tsx           // Port from GstiApp.tsx
docs/superpowers/assets/2026-04-19-xpti-type-images-prompts.md   // prompt library
```

## 接入点（修改）

| 文件 | 改动 |
|---|---|
| `src/data/allTests.ts` | 加 XPTI 条目（path `/xpti`, emoji `🎭`） |
| `src/components/Nav.tsx` | `BRAND_MAP` 加 xpti 条目 |
| `vite.config.ts` | 加 xpti 入口（和 gsti 对称） |
| `vercel.json` | 加 xpti rewrite |
| `build.sh` | for loop 的测试清单加 xpti |
| `scripts/gen-og-types.mts` | TESTS 数组加 xpti 条目 |
| `scripts/gen-type-pages.mts` | TEST_CONFIGS 数组加 xpti |
| `scripts/gen-sitemap.mjs` | 加 xpti 路由 |
| `scripts/gen-og-images.mjs` | 可选：为 XPTI 生成 test-level OG 图 |
| `index.html`（hub）| 加 xpti 卡片 |

## 非目标（YAGNI）

- **不做"反串进另一个池"** — 那是 GSTI 的专属玩法，XPTI 不碰
- **不做 dynamic gender** — 一次测只能选一个性别；切换 = 重新答
- **不做"非二元"第三池** — 增加 20+ 类型工作量，后续如有需求再做
- **不改 `computeResult` 签名** — 已有 gender 参数，足够用

## 里程碑

| 里程碑 | 验收 |
|---|---|
| M1 数据层 | `src/data/xpti/{config,types,questions}.ts` 完成；42 types + 24 questions；tsc 通过 |
| M2 前端接入 | `/xpti` 可访问，能走完全流程到结果页；分享图、排行榜能用 |
| M3 SEO | 42 个 `/types/xpti/<CODE>` 页 + OG images；sitemap 含 xpti |
| M4 图片 | 42 张 1:1 黑金肖像画风 type image（ChatHub 批量）|
| M5 首页 | hub 卡片 + nav tab + article topic-queue 加 xpti 子类 |

## 测试策略

- `questions` 单测：所有题目每个选项 score 有效，维度覆盖完整
- `types` 单测：所有 type 的 pattern vector 都有 8 维
- `computeResult` 已有单测框架（参考 sbti），xpti 重用
- 手动 smoke：男/女各走一遍，确保结果只出对应池

---

## 构建顺序

1. 写 types + questions（类型 + 题目）— 这是最重的内容生产
2. 扫 gsti 为模板做前端接入（XptiApp + 路由）
3. tsc + build.sh 本地验证
4. commit "feat(xpti): scaffold + types + questions" 并部署
5. ChatHub 批量生 42 张图
6. `gen-typeimages.mjs xpti` 生成 typeImages.ts
7. commit "feat(xpti): type images" 并部署
