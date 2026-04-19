# Phase A — UX 提升测试欲望 Design

**Date:** 2026-04-19
**Goal:** 提升三个漏斗的转化率：首页 → 选测试、Hero → 开始、开题 → 完成；同时铺埋点，后续能基于数据迭代。
**Scope:** 两条独立轨道，可并行落地：A1 埋点基建 + A2 三项 UX 优化。

---

## A1. 埋点基建（数据层）

**为什么**：现在没有任何行为数据，无法判断哪个漏斗掉得最严重。先以最低代价接入自己的埋点（复用已有 Upstash Redis），为后续迭代提供依据。

### 事件规格

| 事件 | 触发时机 | 额外字段 |
|---|---|---|
| `home_view` | `/` 首页 mount | — |
| `test_click` | 首页点测试卡片 | `testId` |
| `hero_view` | `/{testId}` Hero 页 mount | `testId` |
| `quiz_start` | 点"开始测试"按钮 | `testId` |
| `quiz_q` | 每答完一题（含多选） | `testId`, `qIndex`（0-based） |
| `quiz_complete` | 点"提交"按钮 | `testId` |
| `result_view` | 结果页渲染完成 | `testId`, `typeCode` |
| `share_click` | 分享/下载卡片按钮 | `testId`, `platform`（`download\|wechat\|weibo`...） |

### 后端

- **新文件 `api/track.js`**：POST `{ event, props? }` → 写 Redis
  - `HINCRBY track:daily:{YYYY-MM-DD} {event_with_props} 1`（每日分桶）
  - `INCR track:total:{event_with_props}`（累计）
  - `event_with_props` 格式：`event_name` 或 `event_name:key1=value1:key2=value2`（按字段字母序，保证 key 稳定）
- **新文件 `api/funnel.js`**：GET `?key={ADMIN_KEY}&days=7` → 返回最近 7 天数据
  - 响应：`{ days: [{ date, events: {...} }], totals: {...} }`
  - 环境变量 `ADMIN_KEY` 鉴权，缺失或不匹配返回 401

### 前端

- **新文件 `src/hooks/useAnalytics.ts`**：`trackEvent(name, props?)` 发 `POST /api/track`
  - 失败静默（不阻塞 UI）
  - 使用 `navigator.sendBeacon` 若可用，降级到 `fetch`
  - 去重：首次加载类事件（`home_view`, `hero_view`, `result_view`）在组件内用 `useEffect` 空依赖 + ref 守卫只发一次
- **集成点**：`Hero.tsx`, `QuizOverlay.tsx`, `ResultPage.tsx`, 首页 `App.tsx`, `shareCard.ts` 调用点
- **开发环境**：若 `import.meta.env.DEV` 则打印 `[track]` 日志且不发请求，避免污染数据

### 看板

- **新文件 `dist/admin/funnel/index.html`**（静态 HTML + fetch）：
  - 查询串 `?key=xxx` → 调 `/api/funnel?key=xxx&days=7`
  - 渲染：每天每事件的计数表格 + 漏斗转化率计算（home_view → test_click → hero_view → quiz_start → quiz_complete → result_view → share_click）
  - 构建集成：放在 `public/admin/funnel.html`，Vite 带出
  - 访问：`test.jiligulu.xyz/admin/funnel?key=xxx`

### 隐私

- 不采集 IP、UA、cookie、指纹；只记事件名 + 事件字段聚合计数
- `robots.txt` 追加 `Disallow: /admin/`（避免被索引）

---

## A2. UX 优化（基于判断）

### A2-1 草稿自动续测

**问题**：答到第 20 题不小心关了页面，进度全丢 → 大概率不会重来。

**设计**：
- `src/hooks/useDraft.ts`：`useDraft(testId)` 返回 `{ draft, saveDraft, clearDraft }`
  - `saveDraft({ answers, currentQ })` → 写 `localStorage[draft:{testId}]`，含 `timestamp`
  - `draft` 有效期 7 天；过期自动清
- **集成**：
  - `QuizOverlay.tsx` 每次 `answer()` 调用后 `saveDraft(...)`
  - `ResultPage` 提交后 `clearDraft(testId)`
  - Hero 页若存在未过期草稿 → 在 CTA 上方插黄色横条：
    ```
    你上次答到第 18 题 · [继续答题] [重新开始]
    ```
  - 点"继续答题"：跳转到 Quiz，preset `answers` 和 `currentQ`
  - 点"重新开始"：`clearDraft` 后按原流程走

### A2-2 分段进度

**问题**：`2 / 31` 这种数字看着很累，用户会感到"还有那么多"。

**设计**：
- 不改底层逻辑，只改呈现层。按题数比例切 3 段（前 ⅓ / 中 ⅓ / 后 ⅓）
- `ProgressBar.tsx` 视觉调整：
  - 底层横条上加两道竖线标段位
  - 段名覆盖在进度条下方（按当前所在段变色）
  - 段名示例（中立但有噱头）：`基础画像` / `深水区` / `最后审判`
- **段落完成提示**：答完第 10/21 题时，题目区顶部浮一条提示（1.5s 后淡出，不挡操作）：
  ```
  ✓ 基础画像 · 已锁定 3 个维度
  ```
  - 文案动态：取该段覆盖的 dimension 数量
  - 用 `framer-motion` 做入/出场，不阻塞自动推进

### A2-3 Hero 页"先试一题"

**问题**：31 题承诺门槛高，部分用户进 Hero 后就走了。

**设计**：
- Hero CTA "开始测试" 下方加次级按钮 "先试一题"（灰底、小号）
- 点击弹 modal：
  - 抽一道代表性题目（每个 test 在 config 里标记 `sampleQuestionId`）
  - 样题用选项风格跟正式题一致
  - 答完显示："看来你是个 XX 的人 · 剩下 30 题见分晓" → CTA "继续正式测试"
  - 点继续 → 跳正式 Quiz，preset 这题答案 + `currentQ=0`（样题编号在 shuffled 列表里被识别并跳过）
- **实现细节**：
  - `TestConfig` 加 `sampleQuestionId?: string` 可选字段
  - 没配 sampleQuestionId 的 test → 不显示"先试一题"按钮（纯增量，不影响现状）
  - 本次只给 SBTI 配，其他先空着（成本可控）

---

## 非目标（YAGNI）

- 不上 GA / PostHog / Plausible：需要额外账号 + 外部脚本，收益不大
- 不做 A/B 测试框架：现阶段流量还没到那个规模
- 不搞跨设备草稿同步：只在本设备 localStorage

---

## 测试策略

- `api/track.js`, `api/funnel.js`：`node:test` 单测（模拟 Redis client）
- `useAnalytics`, `useDraft`：jsdom + 手动集成验证
- 三项 UX 优化：手动在 dev 跑一遍正常路径 + 边界（草稿过期、续测后重改答、样题 → 正式题衔接）

---

## 里程碑 & 验收

| 里程碑 | 验收 |
|---|---|
| A1 完成 | `/admin/funnel?key=xxx` 渲染出 7 天计数表；跑一遍 Quiz 能看到所有 8 类事件 |
| A2-1 完成 | 答 5 题后关页面，重进 Hero 看到黄色续测横条；点继续进度正确恢复 |
| A2-2 完成 | ProgressBar 视觉上分 3 段；答完 10/21 题弹段落提示 |
| A2-3 完成 | SBTI Hero 底部出现"先试一题"；答完样题进正式测试时该题已填充 |
