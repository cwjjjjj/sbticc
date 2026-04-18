# SEO Phase 3 — Articles + Daily Cron Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Ship markdown-based article pipeline (`/articles/<slug>`), article hub (`/articles/`), 2 seed articles, and launchd-driven daily cron (7 AM) that invokes headless Claude Code to research + draft + PR a new article each day.

**Architecture:** Same static-HTML-generation pattern as Phase 2. Articles live in `content/articles/*.md` with YAML frontmatter. A Node/tsx generator parses markdown, renders HTML, outputs to `dist/articles/<slug>/index.html`. launchd plist schedules a shell script that runs `claude -p` (headless mode) with a fixed prompt template that requires WebSearch + cite sources + open draft PR.

**Tech Stack:** `tsx`, `remark` + `remark-html` + `gray-matter` (markdown → HTML + frontmatter), `launchd` (macOS native), `claude` CLI (Claude Code headless mode), `gh` CLI (GitHub operations).

---

## File Structure

**New files:**
- `scripts/gen-articles.mts` — parse markdown, render HTML, emit `dist/articles/<slug>/index.html` + hub
- `scripts/gen-articles.test.mts` — unit test for markdown→HTML rendering
- `content/articles/topic-queue.md` — list of 30 seed article topics
- `content/articles/mbti-vs-sbti-whats-the-difference.md` — seed article 1
- `content/articles/10-kinds-of-worker-persona.md` — seed article 2
- `scripts/article-bot/bot-prompt.md` — prompt template for cron-invoked Claude
- `scripts/article-bot/run.sh` — shell wrapper: invokes `claude -p` with bot-prompt, handles branch + PR
- `scripts/article-bot/com.jiligulu.article-bot.plist` — launchd plist (user-level)
- `scripts/article-bot/install.sh` — install / uninstall the launchd job
- `scripts/article-bot/README.md` — docs

**Modified files:**
- `package.json` — add `gray-matter`, `remark`, `remark-html`, `remark-gfm`
- `scripts/gen-sitemap.mjs` — also merge article-routes.json
- `build.sh` — run gen-articles before sitemap

**Output:**
- `dist/articles/index.html` — hub
- `dist/articles/<slug>/index.html` — one per article
- `dist/sitemap.xml` — now includes article routes
- `scripts/article-routes.json` — manifest for sitemap

---

### Task 1: Install markdown deps

- [ ] **Step 1: Install**

```bash
npm install --save-dev gray-matter remark remark-html remark-gfm unified
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add markdown deps for article pipeline

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: gen-articles generator + test

**Files:**
- Create `scripts/gen-articles.mts`
- Create `scripts/gen-articles.test.mts`
- Create `content/articles/.gitkeep` (empty, to commit empty dir)

- [ ] **Step 1: Write failing test `scripts/gen-articles.test.mts`**

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderArticleHTML, type ArticleData } from './gen-articles.mts';

test('renderArticleHTML produces valid article with meta + body', async () => {
  const data: ArticleData = {
    origin: 'https://test.jiligulu.xyz',
    slug: 'example-post',
    title: '示例文章标题',
    description: '这是一篇示例文章的描述。',
    publishedAt: '2026-04-18',
    keywords: ['人格', '测试'],
    bodyHtml: '<p>这是正文第一段。</p><p>第二段。</p>',
    sources: [
      { url: 'https://example.com/paper', note: '人格理论的基础研究' },
    ],
  };
  const html = await renderArticleHTML(data);
  assert.match(html, /<!DOCTYPE html>/);
  assert.match(html, /<title>示例文章标题 - 人格实验室<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/test\.jiligulu\.xyz\/articles\/example-post" \/>/);
  assert.match(html, /<meta name="keywords" content="人格,测试" \/>/);
  assert.match(html, /<h1[^>]*>示例文章标题<\/h1>/);
  assert.match(html, /<p>这是正文第一段。<\/p>/);
  assert.match(html, /href="https:\/\/example\.com\/paper"/);
  assert.match(html, /人格理论的基础研究/);
  assert.match(html, /<time[^>]*>2026-04-18<\/time>/);
});
```

- [ ] **Step 2: Run, verify fails**

```bash
npx tsx --test scripts/gen-articles.test.mts
```

- [ ] **Step 3: Write `scripts/gen-articles.mts`**

```ts
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const HTML_ESC: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};
function escapeHtml(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => HTML_ESC[c]);
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  publishedAt: string; // YYYY-MM-DD
  keywords?: string[];
  relatedTests?: string[];
  sources?: Array<{ url: string; note: string }>;
}

export interface ArticleData extends ArticleFrontmatter {
  origin: string;
  bodyHtml: string;
  sources?: Array<{ url: string; note: string }>;
}

export async function mdToHtml(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}

export async function renderArticleHTML(d: ArticleData): Promise<string> {
  const title = escapeHtml(d.title);
  const descMeta = escapeHtml(d.description);
  const canonical = `${d.origin}/articles/${d.slug}`;
  const keywords = d.keywords && d.keywords.length ? escapeHtml(d.keywords.join(',')) : '人格测试,心理学,MBTI';
  const sourcesHtml = (d.sources ?? []).map((s) =>
    `      <li><a href="${escapeHtml(s.url)}" rel="nofollow noopener" target="_blank">${escapeHtml(s.note)}</a></li>`
  ).join('\n');
  const sourcesBlock = sourcesHtml ? `
    <section class="sources">
      <h2>参考资料</h2>
      <ul>
${sourcesHtml}
      </ul>
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - 人格实验室</title>
  <meta name="description" content="${descMeta}" />
  <meta name="keywords" content="${keywords}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${descMeta}" />
  <meta property="og:image" content="${d.origin}/images/og-sbti.png" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${d.origin}/images/og-sbti.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "datePublished": "${escapeHtml(d.publishedAt)}",
    "description": "${descMeta}",
    "mainEntityOfPage": "${canonical}"
  }
  </script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; background: #080808; color: #fff; }
    body { line-height: 1.75; }
    .container { max-width: 720px; margin: 0 auto; padding: 48px 24px; }
    nav.breadcrumb { font-size: 13px; color: #888; margin-bottom: 32px; }
    nav.breadcrumb a { color: #bbb; text-decoration: none; }
    article h1 { font-size: 36px; line-height: 1.3; margin-bottom: 12px; }
    .meta { font-size: 14px; color: #888; margin-bottom: 32px; border-bottom: 1px solid #222; padding-bottom: 16px; }
    article h2 { font-size: 24px; margin: 40px 0 16px; padding-left: 12px; border-left: 3px solid #ff3b3b; }
    article h3 { font-size: 19px; margin: 28px 0 12px; color: #ff3b3b; }
    article p { margin-bottom: 16px; color: #ddd; }
    article a { color: #ff3b3b; text-decoration: underline; text-decoration-color: #ff3b3b66; text-underline-offset: 3px; }
    article a:hover { text-decoration-color: #ff3b3b; }
    article ul, article ol { margin: 12px 0 20px 24px; color: #ddd; }
    article li { margin-bottom: 8px; }
    article blockquote { border-left: 3px solid #444; padding: 12px 16px; margin: 20px 0; color: #bbb; background: #111; border-radius: 0 8px 8px 0; }
    article code { background: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 0.9em; color: #ff8585; }
    article pre { background: #0f0f0f; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 20px 0; }
    .sources { margin-top: 48px; padding: 20px; background: #111; border: 1px solid #222; border-radius: 8px; }
    .sources h2 { font-size: 16px; margin-bottom: 12px; color: #888; border: 0; padding: 0; }
    .sources ul { margin: 0 0 0 20px; color: #bbb; font-size: 13px; }
    footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #222; font-size: 13px; color: #666; text-align: center; }
    footer a { color: #888; text-decoration: none; }
  </style>
</head>
<body>
  <article class="container">
    <nav class="breadcrumb"><a href="/">首页</a> › <a href="/articles/">所有文章</a> › <span>${title}</span></nav>
    <h1>${title}</h1>
    <p class="meta">发布日期 <time datetime="${escapeHtml(d.publishedAt)}">${escapeHtml(d.publishedAt)}</time> · 人格实验室</p>
    ${d.bodyHtml}
${sourcesBlock}
    <footer>
      <p><a href="/">人格实验室</a> · <a href="/articles/">所有文章</a> · 所有测试仅供娱乐</p>
    </footer>
  </article>
</body>
</html>`;
}

export async function renderArticleHubHTML(items: ArticleFrontmatter[], origin: string): string {
  const listHtml = items.map((a) =>
    `      <li><a href="/articles/${escapeHtml(a.slug)}"><span class="date">${escapeHtml(a.publishedAt)}</span><span class="title">${escapeHtml(a.title)}</span><span class="desc">${escapeHtml(a.description)}</span></a></li>`
  ).join('\n');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>所有文章 - 人格实验室</title>
  <meta name="description" content="人格实验室文章中心：${items.length} 篇关于人格、心理、测试设计的深度文章。每日更新。" />
  <link rel="canonical" href="${origin}/articles/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="人格实验室 · 文章中心" />
  <meta property="og:description" content="${items.length} 篇关于人格与测试的文章" />
  <meta property="og:image" content="${origin}/images/og-sbti.png" />
  <meta property="og:url" content="${origin}/articles/" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; background: #080808; color: #fff; }
    body { line-height: 1.6; }
    header { text-align: center; padding: 64px 24px 32px; }
    header h1 { font-size: 44px; margin-bottom: 12px; }
    header p { color: #888; }
    header a { color: #ff3b3b; text-decoration: none; }
    main { max-width: 760px; margin: 0 auto; padding: 0 24px 64px; }
    ul.articles { list-style: none; }
    ul.articles li { margin-bottom: 20px; }
    ul.articles li a { display: block; background: #111; border: 1px solid #222; border-radius: 10px; padding: 20px; text-decoration: none; color: #fff; transition: all 0.2s; }
    ul.articles li a:hover { background: #1a1a1a; border-color: #ff3b3b44; }
    ul.articles .date { display: block; font-size: 12px; font-family: ui-monospace, monospace; color: #666; margin-bottom: 6px; }
    ul.articles .title { display: block; font-size: 20px; font-weight: 700; margin-bottom: 6px; }
    ul.articles .desc { display: block; font-size: 14px; color: #aaa; line-height: 1.6; }
    footer { text-align: center; color: #666; font-size: 13px; padding: 32px 24px 48px; border-top: 1px solid #222; max-width: 760px; margin: 0 auto; }
    footer a { color: #888; text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <h1>文章中心</h1>
    <p><a href="/">← 返回首页</a> · ${items.length} 篇关于人格、心理、测试设计的文章</p>
  </header>
  <main>
    <ul class="articles">
${listHtml}
    </ul>
  </main>
  <footer><p>每日更新 · <a href="/">人格实验室</a></p></footer>
</body>
</html>`;
}

// --- Main ---
const ORIGIN = 'https://test.jiligulu.xyz';

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const contentDir = join(__dirname, '..', 'content', 'articles');
  const outDir = join(__dirname, '..', 'dist', 'articles');
  mkdirSync(outDir, { recursive: true });

  const routes: string[] = ['/articles/'];
  const allArticles: ArticleFrontmatter[] = [];

  const files = existsSync(contentDir) ? readdirSync(contentDir).filter((f) => f.endsWith('.md')) : [];
  for (const filename of files) {
    const full = join(contentDir, filename);
    const raw = readFileSync(full, 'utf8');
    const { data: frontmatter, content } = matter(raw);
    const fm = frontmatter as ArticleFrontmatter;
    if (!fm.title || !fm.slug || !fm.publishedAt) {
      console.warn(`WARN: ${filename} missing required frontmatter, skipping`);
      continue;
    }
    const bodyHtml = await mdToHtml(content);
    const html = await renderArticleHTML({ ...fm, origin: ORIGIN, bodyHtml });
    const dir = join(outDir, fm.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
    routes.push(`/articles/${fm.slug}`);
    allArticles.push(fm);
  }

  // Sort articles newest first
  allArticles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const hubHtml = await renderArticleHubHTML(allArticles, ORIGIN);
  writeFileSync(join(outDir, 'index.html'), hubHtml, 'utf8');

  writeFileSync(join(__dirname, 'article-routes.json'), JSON.stringify(routes, null, 2), 'utf8');
  console.log(`Generated ${allArticles.length} articles + hub + routes manifest`);
}

const scriptPath = process.argv[1];
const isMain = scriptPath && import.meta.url.endsWith(scriptPath.split('/').pop()!);
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
```

- [ ] **Step 4: Run test, verify 1/1 passes**

```bash
npx tsx --test scripts/gen-articles.test.mts
```

- [ ] **Step 5: Commit**

```bash
mkdir -p content/articles
touch content/articles/.gitkeep
git add scripts/gen-articles.mts scripts/gen-articles.test.mts content/articles/.gitkeep
git commit -m "feat(seo): add markdown article generator with unit test

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Seed topic queue (30 topics)

**Files:**
- Create `content/articles/topic-queue.md`

- [ ] **Step 1: Write the queue**

```markdown
# Article Topic Queue

Each line is a topic for the daily article-bot. Lines starting with `-` are pending; change to `+` when done.

- MBTI 官方有多不准？它在科研界为何有争议？
- 大五人格（Big Five）是什么？与 MBTI 有什么区别？
- 依恋理论（Attachment Theory）与成人恋爱风格
- 九型人格（Enneagram）简史与科学性讨论
- HEXACO 人格模型：比大五多一个维度的东西
- 为什么人们相信星座？心理学中的巴纳姆效应
- 原生家庭理论在现代心理学中的地位
- 讨好型人格（Fawn Response）是什么？
- 反社会人格障碍 vs 反社会行为的区别
- 自恋型人格光谱：健康自恋到 NPD
- 内向外向的神经生物学基础
- 宜家效应（IKEA effect）与自我认同
- 情绪劳动（Emotional Labor）：概念、测量、代价
- 回避型依恋的形成机制
- Z 世代的人格变化：真的在"越来越焦虑"吗？
- 赌博行为的心理学
- 过度消费的心理学：多巴胺、缺口填补、身份表达
- 为什么人们沉迷于小众测试？
- 阳刚性气质（Masculinity）和脆弱的连接
- 友谊在成年期衰减的心理学原因
- 同理心疲劳（Compassion Fatigue）
- 完美主义的两种类型及其代价
- 冲动控制与前额叶发育
- 为什么人们想成为"被看见"的人？
- 社交媒体人设与真实自我的张力
- 中国语境下的人格评估：翻译、文化、偏差
- 直男/直女/钢铁直女的心理学标签化问题
- 亲密关系中的权力动态
- 消费决策中的后悔厌恶
- 自我实现预言（Self-fulfilling Prophecy）的社会影响
```

- [ ] **Step 2: Commit**

```bash
git add content/articles/topic-queue.md
git commit -m "feat(seo): seed article topic queue with 30 personality topics

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Write 2 seed articles (via research subagent)

This task dispatches a separate subagent to write 2 articles with real web research. Each article:
- 1200~1800 Chinese characters
- Markdown with YAML frontmatter
- At least 2 cited sources (real URLs)
- At least 3 internal links to our tests
- Matching brand voice (see `docs/superpowers/specs/2026-04-18-seo-content-strategy-design.md`)

**Seed article topics (bot starts at topic 3 onwards):**
1. `mbti-vs-sbti-whats-the-difference.md` — "MBTI vs SBTI：为什么我要做 SBTI 而不做 MBTI"
2. `big-five-explained.md` — "大五人格是什么？与 MBTI 有什么区别？"

- [ ] **Step 1: Dispatch Article Writer Subagent**

The subagent should:
1. Use WebSearch to find 5-10 authoritative sources per topic
2. WebFetch 2-3 most relevant
3. Synthesize into a markdown article with frontmatter
4. Save to `content/articles/<slug>.md`
5. Commit

Use the general-purpose subagent with detailed brief (to be authored at dispatch time).

- [ ] **Step 2: Run gen-articles once to verify rendering**

```bash
rm -rf dist/articles
mkdir -p dist
npx tsx scripts/gen-articles.mts
[ -f dist/articles/index.html ] && echo "✓ hub" || echo "✗"
ls dist/articles/
```

Expected: hub + 2 article directories.

---

### Task 5: Sitemap + build.sh integration

- [ ] **Step 1: Update `scripts/gen-sitemap.mjs`**

Add article-routes.json merge, parallel to type-routes.json. Find where `type-routes.json` is read, after that block add:

```js
  const articleManifestPath = join(__dirname, 'article-routes.json');
  let articleRoutes = [];
  if (existsSync(articleManifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(articleManifestPath, 'utf8'));
      if (Array.isArray(manifest)) articleRoutes = manifest;
    } catch {}
  }
```

And update `allRoutes`:

```js
const allRoutes = [...new Set([...ROUTES, ...extraRoutes, ...articleRoutes])];
```

Update the console.log to show counts from each source.

- [ ] **Step 2: Update `build.sh`**

After the type-pages generation line (`npx tsx scripts/gen-type-pages.mts`), add:

```bash
# 7.7 Generate article pages + hub
npx tsx scripts/gen-articles.mts
```

(The sitemap regen already runs after and will pick up article-routes.json.)

- [ ] **Step 3: Full build**

```bash
rm -rf dist dist-temp
bash build.sh 2>&1 | tail -10
```

Expected: sitemap output shows article routes count, articles dir exists.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-sitemap.mjs build.sh
git commit -m "feat(seo): integrate article-routes into sitemap + build

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: article-bot prompt template

**Files:**
- Create `scripts/article-bot/bot-prompt.md`
- Create `scripts/article-bot/README.md`

- [ ] **Step 1: Write `scripts/article-bot/bot-prompt.md`**

```markdown
你是人格实验室（test.jiligulu.xyz）的日更文章作者。任务：今天从话题池里挑一个未写的主题，做网络调研，写一篇 1200~1800 字的深度文章，开 draft PR。

## 步骤（严格按顺序，出错立即 abort）

1. **读话题池**：`content/articles/topic-queue.md`。
2. **选一个话题**：第一个未被标记（以 `-` 开头）的。
3. **检查是否已写过**：grep `content/articles/` 的现有 md 文件的 title frontmatter。如果已经写过同名主题，跳到下一个 topic。
4. **WebSearch 5-10 条资料**：
   - 优先：Google Scholar, APA, Psychology Today, Harvard Business Review, Verywell Mind, 知乎精华, 壹心理/KnowYourself, Reddit 精华, arxiv, PubMed
   - 至少找到 3 条可访问、非 paywall 的一次资料
   - 如果 <3 条，abort：写一个 `content/articles/skipped-$(date +%Y-%m-%d).md`，记录原因，commit 后 push 一个带 `skipped` 标签的空 PR。
5. **WebFetch 2-3 条最相关的**：提取关键论点、数据、结论。
6. **起草文章**（1200~1800 汉字，markdown 格式）：
   - YAML frontmatter：`title, slug, description, publishedAt (今天), keywords (3-5 个), sources (2+ 条, 每条 {url, note})`
   - 首段直击关键词（不堆砌）
   - 3~5 个 `##` heading
   - 至少 3 处内链：`[测试名](/test-slug)` 或 `[类型名](/types/test-id/CODE)`
   - 结尾 CTA：推荐去做我们的某个测试
   - 保持品牌声音：反差、荒诞、不卖鸡汤、毒舌但有料
   - 文末「参考资料」section 对齐 frontmatter 的 sources
7. **保存到** `content/articles/<slug>.md`
8. **更新 topic-queue.md**：把当前话题的 `-` 改为 `+ (已写于 YYYY-MM-DD)`
9. **新建分支**：`auto/article-<slug>`
10. **Commit**（commit 消息：`auto(article): <title>` + 正文列出 sources 数量）
11. **Push**：`git push -u origin auto/article-<slug>`
12. **开 draft PR**：`gh pr create --draft --title "auto(article): <title>" --body "<详细描述：引用的 sources 清单 + 内链清单>" --label auto-article`

## Abort 条件
- WebSearch <3 条可用 → skipped 文件 + 空 PR with `skipped` label
- WebFetch 全部 401/403/paywall → 同上
- topic-queue 为空 → 写 `skipped-queue-empty.md`，PR 提醒补话题
- git/gh 命令失败 → 记录到 `/tmp/article-bot-errors.log`，abort

## 禁止
- 虚构来源 / 假 URL
- 不经 WebFetch 就引用
- 大于 2000 字（过长）
- 纯科普无 CTA
- 照搬某一来源超过 50 字
```

- [ ] **Step 2: Write README**

`scripts/article-bot/README.md`:

```markdown
# Article Bot

Daily cron job: 7 AM local time, dispatches headless Claude Code to write + PR one personality article.

## Install

```bash
bash scripts/article-bot/install.sh
```

This copies the plist to `~/Library/LaunchAgents/` and loads it with launchctl. Next trigger is tomorrow 7 AM (or next Mac wake after).

## Dry-run (write article without opening PR)

```bash
DRY_RUN=1 bash scripts/article-bot/run.sh
```

## Uninstall

```bash
bash scripts/article-bot/install.sh --uninstall
```

## Logs

- stdout → `~/Library/Logs/jiligulu-article-bot.log`
- stderr → `~/Library/Logs/jiligulu-article-bot.err`

## Troubleshoot

- Check launchctl: `launchctl list | grep jiligulu`
- Force run now: `launchctl start com.jiligulu.article-bot`
- PR not opening? Check `gh auth status`.
```

- [ ] **Step 3: Commit**

```bash
git add scripts/article-bot/bot-prompt.md scripts/article-bot/README.md
git commit -m "feat(cron): article bot prompt + README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: article-bot shell wrapper + launchd plist + install

**Files:**
- Create `scripts/article-bot/run.sh`
- Create `scripts/article-bot/com.jiligulu.article-bot.plist`
- Create `scripts/article-bot/install.sh`

- [ ] **Step 1: Write `run.sh`**

```bash
#!/bin/bash
# Article bot runner. Invoked by launchd daily at 7 AM.
set -e

REPO_DIR="/Users/jike/Desktop/Developer/sbticc"
cd "$REPO_DIR"

# Sync main
git checkout main
git pull --rebase origin main

# Invoke Claude Code headless with the prompt
PROMPT_FILE="$REPO_DIR/scripts/article-bot/bot-prompt.md"
if [ ! -f "$PROMPT_FILE" ]; then
  echo "ERROR: prompt file missing: $PROMPT_FILE" >&2
  exit 1
fi

if [ "$DRY_RUN" = "1" ]; then
  echo "[DRY RUN] Would invoke claude with prompt"
  cat "$PROMPT_FILE"
  exit 0
fi

claude -p "$(cat $PROMPT_FILE)" --dangerously-skip-permissions
```

Note: `--dangerously-skip-permissions` is needed because cron can't answer permission prompts. Claude only has access to what the repo + tools expose. Make executable:

```bash
chmod +x scripts/article-bot/run.sh
```

- [ ] **Step 2: Write `com.jiligulu.article-bot.plist`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.jiligulu.article-bot</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>/Users/jike/Desktop/Developer/sbticc/scripts/article-bot/run.sh</string>
  </array>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>7</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>/Users/jike/Library/Logs/jiligulu-article-bot.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/jike/Library/Logs/jiligulu-article-bot.err</string>

  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
```

Note: When the Mac is asleep at 7 AM, launchd will run the job the moment it wakes up. No missed days if woken within 24 hours.

- [ ] **Step 3: Write `install.sh`**

```bash
#!/bin/bash
# Install / uninstall the article-bot launchd job.
set -e

PLIST_LABEL="com.jiligulu.article-bot"
REPO_DIR="/Users/jike/Desktop/Developer/sbticc"
SRC_PLIST="$REPO_DIR/scripts/article-bot/$PLIST_LABEL.plist"
DEST_PLIST="$HOME/Library/LaunchAgents/$PLIST_LABEL.plist"

if [ "$1" = "--uninstall" ]; then
  if [ -f "$DEST_PLIST" ]; then
    launchctl unload "$DEST_PLIST" 2>/dev/null || true
    rm "$DEST_PLIST"
    echo "Uninstalled $PLIST_LABEL"
  else
    echo "Not installed"
  fi
  exit 0
fi

mkdir -p "$HOME/Library/LaunchAgents"
mkdir -p "$HOME/Library/Logs"
cp "$SRC_PLIST" "$DEST_PLIST"
launchctl unload "$DEST_PLIST" 2>/dev/null || true
launchctl load "$DEST_PLIST"

echo "Installed. Next trigger: tomorrow at 7:00 AM local."
echo "Logs: ~/Library/Logs/jiligulu-article-bot.{log,err}"
echo "Force-run now: launchctl start $PLIST_LABEL"
```

Make executable:

```bash
chmod +x scripts/article-bot/install.sh
```

- [ ] **Step 4: Commit**

```bash
git add scripts/article-bot/run.sh scripts/article-bot/com.jiligulu.article-bot.plist scripts/article-bot/install.sh
git commit -m "feat(cron): article-bot run.sh + launchd plist + install script

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Final verify + merge + push

- [ ] **Step 1: Clean build, verify everything**

```bash
rm -rf dist dist-temp
bash build.sh 2>&1 | tail -10
```

Verify:
```bash
[ -f dist/articles/index.html ] && echo "✓ articles hub"
ls dist/articles/ | head -10
grep -c '<url>' dist/sitemap.xml
```

Expected: `<url>` count = 11 base + 237 type + N articles (250+).

- [ ] **Step 2: Run all tests**

```bash
npx tsx --test scripts/gen-articles.test.mts
npx tsx --test scripts/gen-type-pages.test.mts
node --test scripts/gen-sitemap.test.mjs
```

- [ ] **Step 3: TSC**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Merge to main + push**

```bash
git checkout main
git merge --ff-only feat/seo-phase3
git log --oneline -10
git push origin main
```

- [ ] **Step 5: (Optional) Install launchd job**

User can run this manually:

```bash
bash scripts/article-bot/install.sh
```

Verify: `launchctl list | grep jiligulu` shows the job.

---

## Self-Review

**Spec coverage:**
- ✅ Markdown article pipeline (Task 2)
- ✅ `/articles/` hub (Task 2, renderArticleHubHTML)
- ✅ Seed articles (Task 4 — via dispatched writer subagent)
- ✅ Topic queue (Task 3)
- ✅ Bot prompt (Task 6)
- ✅ launchd plist + installer (Task 7)
- ✅ Sitemap integration (Task 5)
- ✅ Build pipeline (Task 5)

**Not in scope** (explicitly deferred per spec):
- "Related tests" widget on result pages (requires React changes, separate follow-up)
- Lighthouse CI automation
- Cron failure notifications (Slack/email)

## Risks

- **tsx stability on ESM + TS imports**: if gray-matter's types don't export correctly via tsx, may need to use `.cts` or add type shims. Fallback: run `.mts` scripts with `--experimental-strip-types` (Node 22+).
- **claude headless mode has tool restrictions**: launchd cron context may limit what `claude -p` can do. If WebSearch/WebFetch/gh don't work headless, fallback is Anthropic API script (future Phase 3.5).
- **launchd scheduling when Mac asleep**: launchd runs missed jobs ON wake if within 24 h. Longer Mac sleep could skip days. Acceptable for solo dev use.

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-18 | v1 initial | cwjjjjj + Claude |
