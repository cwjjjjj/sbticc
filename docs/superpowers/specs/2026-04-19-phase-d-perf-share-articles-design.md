# Phase D — WebP / Native Share / Related Articles Design

**Date:** 2026-04-19
**Goal:** 三个独立小优化合一个 spec —— 降图片体积、接通原生分享、把文章系统引流到结果页。
**Scope:** 三项互相独立，可按顺序分别 PR。

---

## D1. WebP 图片压缩

**问题**：9 个测试的 208 张类型图全是 PNG（平均 800KB-2MB），单测试 bundle >20MB。每个首次访问者都要下载。

**做法**：
- 新脚本 `scripts/convert-images-to-webp.mjs`：
  - 依赖：`sharp`（devDep）
  - 行为：扫 `src/data/{love,work,values,cyber,desire,gsti,fpi,fsi,mpi}/images/*.png` → `sharp(png).webp({ quality: 85 })` → 落盘同名 `.webp` → `unlink` 原 PNG
  - 只转 PNG 到 WebP，不做其他处理
- 修改 9 个 `src/data/<test>/typeImages.ts`：把 `from './images/<CODE>.png'` 改成 `from './images/<CODE>.webp'`
  - 用脚本 `tmp/gen-typeimages.mjs` 重新生成就能顺便升级扩展名
- Vite 原生支持 `.webp` import，不需要改 `vite.config.ts`

**非范围**：
- 不碰 SBTI（它的 `src/data/typeImages.ts` 用 base64 embed，本来就不走 asset pipeline）
- 不碰 `public/images/og-*.png` 和 `public/images/og-types/*.png`（Satori/resvg 产物，走 Vercel 边缘，不影响 SPA bundle）

**验收**：
- `src/data/*/images/*.png` 全部消失，只剩 `.webp`
- `bash build.sh` 通过
- `dist-temp/assets/*.webp` 总体积 < 25MB（当前 PNG 总体积 ~100MB）
- 任一测试的结果页 / 人格介绍 tab 图片正常渲染

---

## D2. 移动端原生分享

**问题**：现 `ShareModal` 只有 PNG 下载 + 复制链接。移动用户要下载完切到微信再手动选图。完整链路太长。

**做法**：
- `src/components/ShareModal.tsx` 改造：
  - Mount 时用 `navigator.canShare?.({ files: [new File([blob], fileName, { type: 'image/png' })] })` 探测原生 share 可用性
  - 支持 → 加主按钮 **"分享到…"**（在现有下载按钮上方）
  - 点击 → `navigator.share({ files: [file], title, text, url })`
  - 成功 → track `share_click` 事件字段 `platform=native`，然后关闭 modal
  - AbortError（用户取消）→ 静默，modal 保持
  - 其他错误 → fallback 执行下载逻辑
- 不支持的情况：现有 UX 保持不变

**埋点扩展**：`src/hooks/useAnalytics.ts` 和 `api/track.js` 已经接受任意 `props`，不需要改。

**WeChat 特例**：不做。JS-SDK 需要服务号授权 + 域名白名单，成本大于收益。WeChat 内置浏览器现在对 blob URL 和 `navigator.share` 也有基本支持，不处理也能用。

**验收**：
- iPhone Safari 打开 love 结果页 → 点"分享" → 弹出分享表单
- 桌面 Chrome / Firefox 打开同一页 → 现有下载按钮行为不变
- Funnel 看板能看到 `share_click:platform=native`

---

## D3. 结果页 → 相关文章

**问题**：文章 bot 每天产出一篇 SEO 内容，但结果页没有任何文章入口。两套流量各跑各的。

**数据流**：
- build 阶段 `scripts/gen-articles.mts` 额外产出 `public/articles.json`：
  - Schema：`[{ slug, title, description, relatedTests, publishedAt }]`
  - 按 `publishedAt` 降序
- 新 hook `src/hooks/useRelatedArticles.ts`：
  - `useRelatedArticles(testId): { articles, loaded }`
  - mount 时 fetch `/articles.json` → filter `relatedTests.includes(testId)` → 取前 3
  - 单次会话缓存结果（ref 存 module-level cache）
- 新组件 `src/components/RelatedArticles.tsx`：
  - Props: `{ testId: string }`
  - 无文章 / loading 时不渲染（`return null`）
  - 有文章时渲染 3 张横向卡片：title（大）+ description（2 行 clamp）+ "阅读 →"
  - 点击触发 `trackEvent('article_click', { testId, slug })`
  - `<a href={'/articles/' + slug} target="_blank" rel="noopener">`（新 tab，不中断结果页）

**集成点**：
- `src/components/ResultPage.tsx` 在 HookMatrix 之前插入 `<RelatedArticles testId={config.id} />`
- 各个 `*App.tsx`（LoveApp/WorkApp/...）用的也是同一个 `ResultPage`，所以只改一处

**埋点**：
- `src/hooks/useAnalytics.ts` 的 `TrackEvent` 类型添加 `'article_click'`
- `api/track.js` 的 `ALLOWED_EVENTS` 集合加 `'article_click'`
- 看板 `public/admin/funnel.html` 的 `FUNNEL_STAGES` 不用动（article_click 算独立事件，不是漏斗一环），但会在 totals 表格里自动出现

**验收**：
- `public/articles.json` 构建后存在，包含 3+ 文章
- 任一结果页底部出现文章卡片
- 点击卡片能正常跳转 `/articles/<slug>`
- funnel 看板出现 `article_click:testId=X:slug=Y` 计数

---

## 非目标（YAGNI）

- 按 `typeCode` 精准匹配文章：目前 bot 的 `relatedTests` 粒度是测试级，足够用
- 微博/小红书 URL scheme 分享：这些平台的 scheme 在各 webview 里都不稳定
- WeChat JS-SDK 官方集成

---

## 测试

- `scripts/convert-images-to-webp.mjs`：在本地执行一次，git diff 看 `src/data/*/images/` 全变成 .webp
- `useRelatedArticles`：手动打开 love 结果页观察文章卡
- 原生分享：需实机手机（也可在桌面 Chrome 的 DevTools Mobile Emulation 预览 UI 但 `navigator.share` 可能不触发）

---

## 里程碑

| 里程碑 | 验收 |
|---|---|
| D1 完成 | `src/data/*/images/` 全部 .webp；`bash build.sh` OK；dist bundle 体积对比 |
| D2 完成 | 手机端点分享看到原生表单；桌面行为不变 |
| D3 完成 | 结果页出现文章卡；funnel 能看到 `article_click` |
