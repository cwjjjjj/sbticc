---
name: SEO + 内容策略（方案 3）
description: Google 为主 + 长尾梗词 + 类型名词为目标，通过预渲染 + 类型百科 + 文章中心三层内容策略提升自然搜索流量
type: design-spec
status: approved
author: cwjjjjj + Claude
created: 2026-04-18
supersedes: none
---

# SEO + 内容策略 · Design Spec

## 目标 & 非目标

**目标**
- 让 Google 能正确索引全部 10 个测试的内容（当前 9 个是 SPA 空壳，爬虫看不见）
- 占领独一份的长尾关键词：具体测试名 + 类型中文名（如"挖金壮男测试""凤凰女 人格"）
- 建立长期内容护城河：文章 → 类型页 → 测试页的内链矩阵

**非目标**
- 百度专项 SEO（无 ICP、Vercel 美区部署，性价比极低）
- 挑战"MBTI 测试""人格测试"等红海大词
- 品牌词阶段性放弃（流量起来自然涨，不主动优化）

## 战略选型（已决）

| 维度 | 选择 |
|------|------|
| 目标搜索引擎 | Google 为主，百度做对了也是红利 |
| 关键词类型 | c（具体测试名）+ d（类型中文名） |
| 深度 | 方案 3（预渲染 + 类型百科 + 文章中心） |
| 文章作者 | Claude 起草 + cron 日更 draft PR → 用户 review → merge |
| 初始文章数 | Phase 3 阶段性交付，首批 5 篇，cron 接管后每日 1 篇 |

## URL 结构

```
/                              主页（已有）
/sbti /love /work /values /cyber /desire /gsti /fpi /fsi /mpi
                               10 个测试落地页（现有壳，预渲染后变为含完整介绍/FAQ 的静态 HTML）
/types/                        类型百科首页（新增，列出全部 ~200 类型 + 分组导航）
/types/<CODE>                  ~200 个类型详情页
                               例如 /types/M_GOLD, /types/F_PHNX, /types/INTJ
/articles/                     文章索引页
/articles/<slug>               每篇文章独立页，URL slug 形如 "mbti-vs-sbti-difference"

# 重定向（已落地）
/new            → /sbti  (308)
/new/<test>     → /<test> (308)
sbti.jiligulu.xyz → test.jiligulu.xyz (308)
```

**站点地图规模**：约 220~230 个静态 URL（10 + 200 + 10 + 首页 + 索引页）。

## 架构分层

### Layer 1：技术 SEO 基础（Phase 1）

**产物**
- `public/robots.txt`：允许全站抓取，声明 sitemap 位置
- 构建期生成的 `/sitemap.xml`：build.sh 末尾运行 Node 脚本枚举所有静态页面
- 每个 `*.html` 壳的 canonical 修正：指向新路径（`/sbti` 而非 `/new`）
- 补齐 4 个新测试（gsti/fpi/fsi/mpi）缺的 `og:image` 和 `twitter:image`
  - 临时方案：手搓 1200x630 PNG 放入 `/images/og-<test>.png`
  - 或用 `html2canvas`/Satori 自动生成
- 每个 `*.html` 壳的 `<body>` 内塞入 100-200 字的静态介绍文案 + `<noscript>` fallback

**风险**
- `<body>` 里塞的静态内容被 React 挂载时覆盖。解决：用 `<div id="seo-intro" hidden>` 藏起来（对爬虫可见、对人眼不可见），或让 React 只挂载到独立 `<div id="root">`

### Layer 2：预渲染 & 类型百科（Phase 2）

**技术方案**：引入 `vite-plugin-ssg` 或 `vite-react-ssg`（二选一，取决于能否不重构路由）。

**与 Layer 1 的关系**：Layer 2 上线时，Layer 1 的"`<body>` 内手塞静态文案"会被移除——因为 SSG 产出的 HTML 已经天然包含完整内容，不再需要壳内注入。Layer 1 是过渡方案，保留 1~2 周直到 Layer 2 交付。

**预渲染目标**
- 10 个测试落地页：构建时执行 React，把首屏（Hero + 测试介绍 + 示例题目 + FAQ）渲染为静态 HTML；浏览器加载后 React hydrate，无缝接管交互
- `/types/<CODE>`：构建时对每个测试的 `TYPE_LIBRARY` 做笛卡尔积，为每个 code 生成一页

**类型详情页组件设计** (`src/pages/TypePage.tsx`)
- 接收 `testId + code` 参数
- 渲染：
  - H1：`{cn} · {intro}`（例："挖金壮男 · The Gold Digger (male)"）
  - 面包屑：首页 > 测试 > 类型百科 > 当前类型
  - 配图：`TYPE_IMAGES[code]`（我们生成的 104 张 + 其它测试既有的）
  - 描述：`TypeDef.desc` 字段（已存在，几百字）
  - 雷达图缩略（纯 SVG 静态）
  - CTA 卡片："想测出{cn}？→ 去做 {testName}"
  - 相关类型：同测试内的 2-3 个邻近类型，基于 `NORMAL_TYPES` pattern 相似度
- SEO meta：`<title>{cn}是什么人？{testName} - 人格实验室</title>`
- 结构化数据：Person schema + BreadcrumbList

**类型百科首页** (`/types/`)
- H1：类型百科
- 按测试分组：每组展示该测试的全部类型缩略卡
- 搜索框（客户端过滤即可）

**内链策略**
- 测试落地页底部 → 链到该测试的所有类型页
- 类型页 → 链回所属测试 + 2-3 个相似类型
- 类型百科 → 所有类型页 + 所有测试

### Layer 3：文章内容中心（Phase 3）

**技术方案**
- 文章源：`content/articles/*.md`（Markdown + frontmatter）
- frontmatter 字段：`title, slug, description, keywords, publishedAt, coverImage, relatedTests[]`
- 构建：vite-plugin-ssg 同一管道，Markdown → HTML（`remark` + `rehype`）
- URL：`/articles/<slug>`

**首批 5 篇（Claude 起草，用户定稿）**
1. `mbti-vs-sbti-whats-the-difference` — "MBTI vs SBTI：为什么我要做 SBTI 而不做 MBTI"（品牌对比）
2. `10-kinds-of-worker-persona` — "打工人的 10 种原型，你属于哪一种？"（引流到 /work）
3. `what-is-gsti-gender-swap-test` — "性转人格测试是什么？GSTI 完全说明"（引流到 /gsti）
4. `friends-circle-persona-guide` — "朋友圈人设大赏：你是哪种显眼包？"（引流到 /fpi）
5. `consumption-persona-types` — "消费人格图鉴：你怎么把钱输给这个世界"（引流到 /mpi）

**文章规范**
- 目标 1000~1500 字
- 明确 H1 + 3~5 个 H2 + 必要 H3
- 首段直击关键词（不堆砌）
- 至少 3 处内链到相关测试页/类型页
- 结尾 CTA：去做测试

**Cron 日更机制**（Phase 3 后期）

**调用链选型**（二选一）：
- **方案 A（首选，低改动）**：macOS `launchd` + Claude Code headless 模式
  - 注册 launchd plist `~/Library/LaunchAgents/com.jiligulu.article-bot.plist`
  - `StartCalendarInterval` 设 7:00，launchd 在 Mac 唤醒后会补跑一次最近的 missed interval（比 crontab 可靠）
  - plist 执行 shell 脚本 `scripts/article-bot.sh`，内部调 `claude -p "$(cat scripts/article-bot-prompt.md)"`
  - headless Claude Code 继承本机的 Anthropic 登录、WebSearch、git、gh 工具权限
- **方案 B（备选，云端托管）**：GitHub Actions `schedule` workflow
  - `.github/workflows/article-bot.yml` cron `0 23 * * *` UTC（= 7 AM CST）
  - Runner 调 Anthropic API（需 `ANTHROPIC_API_KEY` secret）+ 带 WebSearch tool
  - 100% 可靠，不依赖本地 Mac 开机
  - 代价：需要额外写 Anthropic SDK 调用代码、管理 API key、不能直接继承 Claude Code 的 skills/hooks

**先做方案 A**（Phase 3 内），运行一周稳定后，若用户 Mac 休眠导致漏跑 >2 次/周，再迁方案 B。

- 每天早 7:00 唤起我
- **主题聚焦**：每天写一篇"关于不同人格的文章"——即某一种人格类型、某一维度或某一心理学概念的深度文章，而非泛 SEO 文案
- **资料驱动**（硬要求，不是纯 AI 自 high）：
  1. **先搜**：WebSearch 找 5-10 条相关资料，目标包括：
     - 学术/权威：Google Scholar、APA、Psychology Today、Harvard Business Review、The Atlantic 心理板块、Verywell Mind
     - 中文科普：知乎精华回答、微信公众号（壹心理、KnowYourself、简单心理）、豆瓣心理小组
     - 热门讨论：Reddit r/psychology, r/MBTI, r/Enneagram、小红书相关笔记
     - 研究论文：arxiv psychology、PubMed、DOI 可追溯的一次资料
  2. **再读**：WebFetch 下 2-3 条最可用的，提取关键论点 / 数据 / 研究结论
  3. **再写**：综合至少 2 个独立来源的观点，配合我们的测试品牌声音（荒诞反串风），输出 1200~1800 字
  4. **必须引用**：文末「参考资料」列出所有 WebFetch 过的 URL + 简要说明各自提供了什么论点
  5. **内链**：至少 3 处链接到本站测试页或类型页
- 流程：
  1. 读 `content/articles/` 下已有文章 + 读 `content/articles/topic-queue.md`（待写话题池）
  2. 从队列挑一个未写的话题，执行上面的资料驱动写作流程
  3. 新建分支 `auto/article-<slug>`，commit（commit 消息列出 sources 数量 + 类型）
  4. `gh pr create` 打开 draft PR，标 `auto-article` 标签，PR description 含 sources 清单
  5. 用户每天花 1~2 分钟扫 PR → merge 或关闭
- **质量闸**：若 WebSearch 返回 <3 条可用资料，或 WebFetch 全失败（paywall/403），article-bot 跳过当日，写 `content/articles/skipped-<date>.md` 记录原因，不硬编
- 失败处理：topic-queue 为空时 cron 暂停；GitHub CLI 401 时写到 `auto-article-errors.log`
- 话题池维护：用户可以随时手动加话题；我每 7 天自动补 7 条到队列（可选，先不做）

## 组件拆分（实现视角）

| 路径 | 职责 | 依赖 |
|------|------|------|
| `scripts/gen-sitemap.mjs` | 枚举静态路由，生成 sitemap.xml | fs, glob |
| `scripts/gen-robots.mjs` | 写入 public/robots.txt | - |
| `scripts/article-bot.mjs` | cron 调 Claude：WebSearch → WebFetch → 综合写作 → 建分支 → 推 → 开 PR | @anthropic-ai/sdk (含 WebSearch tool), octokit |
| `src/pages/TestLandingPage.tsx` | 预渲染用的测试落地页模板 | testConfig |
| `src/pages/TypePage.tsx` | 类型详情页模板 | testConfig, types.ts |
| `src/pages/TypeHubPage.tsx` | `/types/` 首页 | - |
| `src/pages/ArticleIndexPage.tsx` | `/articles/` 首页 | glob on content/articles/ |
| `src/pages/ArticlePage.tsx` | 单篇文章页，md → JSX | remark-rehype |
| `vite.config.ts` | 引入 SSG 插件，枚举所有路由 | vite-plugin-ssg |
| `content/articles/*.md` | 文章源文件 | - |
| `content/articles/topic-queue.md` | 待写话题池 | - |

## 实施相位（Phasing）

### Phase 1：技术 SEO 基础（1-2 天，立即可上线）

交付：
- `public/robots.txt`
- `scripts/gen-sitemap.mjs` + 集成进 `build.sh`
- 修正 10 个 `*.html` 的 canonical
- 补齐 4 个缺失的 og:image
- 每个 `*.html` 塞静态介绍文案

验收：
- Google Search Console 提交 sitemap.xml 通过
- 查看 `test.jiligulu.xyz/sitemap.xml` 能列出所有 URL
- 查看 10 个测试页 view-source 有实际介绍文字
- PageSpeed Insights 分数不降

### Phase 2：预渲染 + 类型百科（3-5 天）

交付：
- 引入 `vite-react-ssg` 或同类，配置 prerender 路由表
- 10 个测试落地页预渲染：含 H1/H2 + 测试介绍 + 示例题目 + FAQ
- `/types/<CODE>` 批量生成 ~200 页
- `/types/` 索引
- `build.sh` 更新以支持新的 SSG 输出结构

验收：
- `view-source:test.jiligulu.xyz/sbti` 可见完整介绍文字
- `view-source:test.jiligulu.xyz/types/M_GOLD` 可见类型描述
- sitemap.xml 自动包含所有类型页
- Lighthouse SEO 分数 ≥ 95

### Phase 3：文章中心 + cron 日更（1 周 + 持续）

交付：
- Markdown 文章管道（`content/articles/*.md` → `/articles/<slug>`）
- `/articles/` 索引页
- 首批 5 篇文章（Claude 起草，用户定稿，人工 merge）
- 每个测试结果页底部加"你可能也想测"模块（2-3 条推荐）
- cron 日更机制：`scripts/article-bot.mjs` + CronCreate 注册

验收：
- 5 篇文章上线，每篇含 3+ 内链
- cron 连续 7 天每天有 draft PR 出现
- 内链矩阵：任何一个类型页能在 2 跳内到达任何其他类型页

## 错误处理 & 边界

- **Prerender 构建慢**：200 页如果构建时间超过 5 分钟，用 concurrency 控制或分批；Vercel 构建默认超时 45 分钟，有 buffer
- **类型页生成失败（个别 code 的 desc 为空）**：fallback 到 CSS 生成卡兜底，类型页 H1 仍有中文名
- **Article bot 写差了**：PR 默认 draft，用户不 merge 就不上线；可以 close 或自己改后 merge
- **Cron 期间 Mac 休眠**：cron 遗漏；下次执行时正常写一篇（不补偿）
- **Topic queue 耗尽**：article-bot 检测到空队列时，commit 一个 `.queue-empty` 文件，用户收到 PR 为空时补话题
- **WebSearch 找不到可用资料**（<3 条 or WebFetch 全 paywall）：当日跳过，写 `skipped-<date>.md` 记录原因；不硬编避免低质
- **引用链接失效/改版**：article-bot 在 fetch 时保存每条源的 HTML 摘要到 PR 附件，即使链接后来死了也能追溯

## 不做

- **不做 AMP** — Google 早已弱化 AMP 权重，中文场景下 ROI 极差
- **不做 lazy-load 大改** — 当前图片量可控
- **不做 Server Components / Next.js 迁移** — 现有 Vite + React 栈够用，迁移成本不划算
- **不做自动反链建设**（PBN、link farm）— 会被惩罚
- **不做用户生成内容（UGC）SEO**（评论/论坛）— 反垃圾成本高

## 测试策略

- **Phase 1 + 2**：构建产物在 `dist/` 目录用 `npx serve dist` 起本地静态服务器，手动验证 view-source 和 sitemap
- **Lighthouse CI**：Phase 2 集成，每次 push 跑 Lighthouse，SEO + Performance 双分跌破阈值时告警
- **Google Search Console**：Phase 1 结束立即验证所有权 + 提交 sitemap；追踪 coverage / impressions / clicks
- **Article bot**：dry-run 模式（`DRY_RUN=1` 只写分支不 open PR），让用户先跑一轮确认质量再启 cron

## 开放问题 / 后续决策

- **Lighthouse CI 放 Vercel build 里 vs GitHub Action 里**：放哪随意，先不做
- **文章封面图**：首批 5 篇要不要专门做封面？（可跳过，用 emoji + 背景色代替，或复用类型配图）
- **cron 失败告警**：要不要加 Slack/邮件通知？（先不做，看 PR 就知道是否正常）

## 变更日志

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-04-18 | v1 初版 | cwjjjjj + Claude |
