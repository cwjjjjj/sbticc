# SEO Phase 2 — Type Encyclopedia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship ~200 static HTML type detail pages (`/types/<CODE>`) plus `/types/` hub, sitemap updated, all routes live on test.jiligulu.xyz — each page is a long-tail SEO magnet for `{type cn name}`-style queries.

**Architecture:** Pure static HTML generation — NO vite-plugin-ssg, NO React refactor. A Node/tsx script imports each test's `TYPE_LIBRARY`, renders standalone HTML files from an inline template, writes to `dist/types/<CODE>/index.html`. Images referenced from existing `/images/` (SBTI) or `/src/data/<test>/images/` pipeline. Zero risk to existing React apps; type pages are independent static assets.

**Tech Stack:** `tsx` (TypeScript runner for Node), native Node `fs`, existing Vite+React build for non-type routes. Type pages are 100% static HTML with inline CSS — no JS required to render them.

---

## Context

- Each test's `TYPE_LIBRARY: Record<code, { code, cn, intro, desc }>` lives at:
  - SBTI: `src/data/types.ts`
  - Others: `src/data/<test>/types.ts` (cyber, desire, fpi, fsi, gsti, love, mpi, values, work)
- Every type has: `code` (ID), `cn` (Chinese name), `intro` (English subtitle), `desc` (multi-paragraph description)
- Images:
  - SBTI: `/images/<CODE>.png` (repo-root, already served at /images/)
  - GSTI/FPI/FSI/MPI: `src/data/<test>/images/<CODE>.png` (Vite-bundled with hash per typeImages.ts)
  - Others (love/work/values/cyber/desire): no images — have empty `TYPE_IMAGES`, use CSS card fallback

**Simplification decision:** type pages use CSS-card-only style (no `<img>` tags). Images remain a future enhancement. This removes all asset-pipeline complexity. og:image uses the test-level `og-<testId>.png` we already have.

## File Structure

**New files:**
- `scripts/gen-type-pages.mts` — TypeScript ESM, imports all 10 type libraries, emits HTML files
- `scripts/gen-type-pages.test.mts` — unit test for HTML template function
- `package.json` — add devDep `tsx`

**Modified files:**
- `scripts/gen-sitemap.mjs` — accept optional JSON file of extra routes; include type pages
- `build.sh` — run gen-type-pages BEFORE gen-sitemap so sitemap picks up type routes

**Output (generated into dist/ during build):**
- `dist/types/index.html` — hub
- `dist/types/<CODE>/index.html` — one per type code, ~200 total
- Updated `dist/sitemap.xml` — now includes ~200 additional URLs

---

### Task 1: Install `tsx` for running TypeScript scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install --save-dev tsx
```

- [ ] **Step 2: Verify**

```bash
npx tsx --version
```

Expected: prints tsx version (e.g., `4.x.x`).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add tsx devDep for running TS build scripts

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Gen-type-pages generator (TDD)

**Files:**
- Create: `scripts/gen-type-pages.mts`
- Create: `scripts/gen-type-pages.test.mts`

- [ ] **Step 1: Write failing test**

`scripts/gen-type-pages.test.mts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderTypePageHTML, type TypePageData } from './gen-type-pages.mts';

test('renderTypePageHTML produces valid HTML with expected fields', () => {
  const data: TypePageData = {
    origin: 'https://test.jiligulu.xyz',
    testId: 'gsti',
    testName: 'GSTI 性转人格测试',
    testPath: '/gsti',
    code: 'M_GOLD',
    cn: '挖金壮男',
    intro: 'The Gold Digger (male)',
    desc: '兄弟，你不是找对象，你是在做尽职调查。',
    relatedTypes: [
      { code: 'M_GTEA', cn: '绿茶公' },
      { code: 'M_WHIT', cn: '傻白男' },
    ],
  };
  const html = renderTypePageHTML(data);

  assert.match(html, /<!DOCTYPE html>/);
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>挖金壮男是什么人？GSTI 性转人格测试 - 人格实验室<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/test\.jiligulu\.xyz\/types\/M_GOLD" \/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/test\.jiligulu\.xyz\/images\/og-gsti\.png" \/>/);
  assert.match(html, /<h1[^>]*>挖金壮男<\/h1>/);
  assert.match(html, /The Gold Digger \(male\)/);
  assert.match(html, /兄弟，你不是找对象/);
  assert.match(html, /href="\/gsti"/);           // CTA link to test
  assert.match(html, /href="\/types\/M_GTEA"/);  // related type link
  assert.match(html, /href="\/types\/M_WHIT"/);
  assert.match(html, /人格实验室/); // brand in breadcrumb/footer
});

test('renderTypePageHTML escapes HTML special chars in desc', () => {
  const data: TypePageData = {
    origin: 'https://test.jiligulu.xyz',
    testId: 'sbti',
    testName: 'SBTI',
    testPath: '/sbti',
    code: 'OK',
    cn: '还行',
    intro: 'Meh',
    desc: 'He said <script>alert(1)</script> & done.',
    relatedTypes: [],
  };
  const html = renderTypePageHTML(data);
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&amp; done/);
});

test('renderTypePageHTML encodes special-char type codes in URLs', () => {
  const data: TypePageData = {
    origin: 'https://test.jiligulu.xyz',
    testId: 'fpi', testName: 'FPI', testPath: '/fpi',
    code: '9PIC!', cn: '九宫格暴君', intro: 'x', desc: 'x',
    relatedTypes: [],
  };
  const html = renderTypePageHTML(data);
  // Code in canonical URL — `!` is URL-safe per RFC 3986 but test for exact encoding
  assert.match(html, /<link rel="canonical" href="[^"]*\/types\/9PIC!" \/>/);
});
```

- [ ] **Step 2: Verify test fails**

```bash
npx tsx --test scripts/gen-type-pages.test.mts
```

Expected: FAIL with module not found.

- [ ] **Step 3: Write minimal implementation**

`scripts/gen-type-pages.mts`:

```ts
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HTML_ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => HTML_ESC[c]);
}

export interface TypePageData {
  origin: string;
  testId: string;
  testName: string;
  testPath: string;
  code: string;
  cn: string;
  intro: string;
  desc: string;
  relatedTypes: Array<{ code: string; cn: string }>;
}

export function renderTypePageHTML(d: TypePageData): string {
  const title = `${escapeHtml(d.cn)}是什么人？${escapeHtml(d.testName)} - 人格实验室`;
  const descMeta = escapeHtml(d.desc.slice(0, 160).replace(/\s+/g, ' '));
  const canonical = `${d.origin}/types/${d.code}`;
  const ogImage = `${d.origin}/images/og-${d.testId}.png`;
  const descHtml = escapeHtml(d.desc).split(/\n\n+/).map((p) => `      <p>${p}</p>`).join('\n');
  const relatedLinks = d.relatedTypes.map((t) =>
    `        <li><a href="/types/${escapeHtml(t.code)}">${escapeHtml(t.cn)}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${descMeta}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${descMeta}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${ogImage}" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeHtml(d.cn)} - ${escapeHtml(d.testName)}",
    "articleBody": "${descMeta}",
    "mainEntityOfPage": "${canonical}"
  }
  </script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; background: #080808; color: #fff; }
    body { line-height: 1.6; }
    .container { max-width: 720px; margin: 0 auto; padding: 48px 24px; }
    nav.breadcrumb { font-size: 13px; color: #888; margin-bottom: 32px; }
    nav.breadcrumb a { color: #bbb; text-decoration: none; }
    nav.breadcrumb a:hover { color: #fff; }
    .type-card { background: linear-gradient(145deg, #1a1a1a, #0a0a0a); border: 1px solid #222; border-radius: 16px; padding: 48px 32px; text-align: center; margin-bottom: 32px; }
    .type-code { font-family: ui-monospace, monospace; font-size: 32px; font-weight: 800; letter-spacing: 2px; color: #ff3b3b; }
    h1 { font-size: 36px; margin: 12px 0 8px; }
    .intro { font-size: 15px; color: #999; font-style: italic; }
    section { margin-bottom: 32px; }
    section h2 { font-size: 20px; margin-bottom: 12px; color: #ff3b3b; }
    section p { margin-bottom: 12px; color: #ddd; }
    .cta { display: inline-block; background: #fff; color: #000; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; margin-top: 8px; }
    .cta:hover { background: #eee; }
    ul.related { list-style: none; display: flex; flex-wrap: wrap; gap: 12px; }
    ul.related li a { display: block; background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; }
    ul.related li a:hover { background: #222; border-color: #555; }
    footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #222; font-size: 13px; color: #666; text-align: center; }
    footer a { color: #888; text-decoration: none; }
  </style>
</head>
<body>
  <article class="container">
    <nav class="breadcrumb"><a href="/">首页</a> › <a href="${escapeHtml(d.testPath)}">${escapeHtml(d.testName)}</a> › <a href="/types/">类型百科</a> › <span>${escapeHtml(d.cn)}</span></nav>
    <div class="type-card">
      <div class="type-code">${escapeHtml(d.code)}</div>
      <h1>${escapeHtml(d.cn)}</h1>
      <p class="intro">${escapeHtml(d.intro)}</p>
    </div>
    <section>
      <h2>关于这个类型</h2>
${descHtml}
    </section>
    <section>
      <h2>想测出 ${escapeHtml(d.cn)}？</h2>
      <p>这个类型来自《${escapeHtml(d.testName)}》——5 分钟出结果，免费，附稀有度评分。</p>
      <a class="cta" href="${escapeHtml(d.testPath)}">去做 ${escapeHtml(d.testName)} →</a>
    </section>
${relatedLinks ? `    <section>
      <h2>相关类型</h2>
      <ul class="related">
${relatedLinks}
      </ul>
    </section>\n` : ''}
    <footer>
      <p><a href="/">人格实验室</a> · <a href="/types/">所有类型</a> · 所有测试仅供娱乐</p>
    </footer>
  </article>
</body>
</html>`;
}

// --- Main build logic ---

interface TypeDef { code: string; cn: string; intro: string; desc: string; }

interface TestSpec {
  id: string;
  name: string;
  path: string;
  typesModule: string;
}

const TESTS: TestSpec[] = [
  { id: 'sbti',   name: 'SBTI 人格测试',         path: '/sbti',   typesModule: '../src/data/types.ts' },
  { id: 'love',   name: '恋爱脑浓度检测',         path: '/love',   typesModule: '../src/data/love/types.ts' },
  { id: 'work',   name: '打工人鉴定',             path: '/work',   typesModule: '../src/data/work/types.ts' },
  { id: 'values', name: '活法检测报告',           path: '/values', typesModule: '../src/data/values/types.ts' },
  { id: 'cyber',  name: '赛博基因检测',           path: '/cyber',  typesModule: '../src/data/cyber/types.ts' },
  { id: 'desire', name: '欲望图谱',               path: '/desire', typesModule: '../src/data/desire/types.ts' },
  { id: 'gsti',   name: 'GSTI 性转人格测试',       path: '/gsti',   typesModule: '../src/data/gsti/types.ts' },
  { id: 'fpi',    name: '朋友圈人设诊断',         path: '/fpi',    typesModule: '../src/data/fpi/types.ts' },
  { id: 'fsi',    name: '原生家庭幸存者',         path: '/fsi',    typesModule: '../src/data/fsi/types.ts' },
  { id: 'mpi',    name: '消费人格图鉴',           path: '/mpi',    typesModule: '../src/data/mpi/types.ts' },
];

const ORIGIN = 'https://test.jiligulu.xyz';

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outDir = join(__dirname, '..', 'dist', 'types');
  mkdirSync(outDir, { recursive: true });

  const allRoutes: string[] = ['/types/'];
  const allTypes: Array<{ testSpec: TestSpec; code: string; cn: string; intro: string; desc: string }> = [];

  for (const spec of TESTS) {
    const mod = await import(spec.typesModule);
    const lib: Record<string, TypeDef> = mod.TYPE_LIBRARY;
    if (!lib) { console.warn(`WARN: ${spec.id} has no TYPE_LIBRARY export, skipping`); continue; }
    for (const [code, typedef] of Object.entries(lib)) {
      allTypes.push({ testSpec: spec, code, cn: typedef.cn, intro: typedef.intro, desc: typedef.desc });
    }
  }

  // Generate one page per type
  for (const t of allTypes) {
    const related = allTypes
      .filter((r) => r.testSpec.id === t.testSpec.id && r.code !== t.code)
      .slice(0, 3)
      .map((r) => ({ code: r.code, cn: r.cn }));
    const html = renderTypePageHTML({
      origin: ORIGIN,
      testId: t.testSpec.id,
      testName: t.testSpec.name,
      testPath: t.testSpec.path,
      code: t.code,
      cn: t.cn,
      intro: t.intro,
      desc: t.desc,
      relatedTypes: related,
    });
    const typeDir = join(outDir, t.code);
    mkdirSync(typeDir, { recursive: true });
    writeFileSync(join(typeDir, 'index.html'), html, 'utf8');
    allRoutes.push(`/types/${t.code}`);
  }

  // Also emit routes manifest for gen-sitemap to consume
  writeFileSync(join(__dirname, 'type-routes.json'), JSON.stringify(allRoutes, null, 2), 'utf8');

  console.log(`Generated ${allTypes.length} type pages + routes manifest (${allRoutes.length} routes)`);
}

const isMain = import.meta.url.endsWith(process.argv[1].replace(/^.*\//, ''));
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
```

- [ ] **Step 4: Run test, verify 3/3 pass**

```bash
npx tsx --test scripts/gen-type-pages.test.mts
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-type-pages.mts scripts/gen-type-pages.test.mts
git commit -m "feat(seo): add type page HTML generator with unit test

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Type hub page `/types/index.html`

**Files:**
- Modify: `scripts/gen-type-pages.mts` (extend main() to emit hub)

- [ ] **Step 1: Add hub template function to `gen-type-pages.mts`**

Before `main()`, add:

```ts
interface HubTypeItem { testId: string; testName: string; testPath: string; code: string; cn: string; intro: string; }

export function renderTypeHubHTML(items: HubTypeItem[], origin: string): string {
  // Group by testId
  const grouped = new Map<string, { name: string; path: string; items: HubTypeItem[] }>();
  for (const it of items) {
    if (!grouped.has(it.testId)) grouped.set(it.testId, { name: it.testName, path: it.testPath, items: [] });
    grouped.get(it.testId)!.items.push(it);
  }

  const groupsHtml = Array.from(grouped.entries()).map(([tid, g]) => {
    const cards = g.items.map((i) =>
      `      <li><a href="/types/${escapeHtml(i.code)}"><span class="code">${escapeHtml(i.code)}</span><span class="cn">${escapeHtml(i.cn)}</span></a></li>`
    ).join('\n');
    return `  <section class="group">
    <h2><a href="${escapeHtml(g.path)}">${escapeHtml(g.name)}</a> <span class="count">(${g.items.length})</span></h2>
    <ul class="types">
${cards}
    </ul>
  </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>类型百科 - 人格实验室 ${items.length} 种人格类型</title>
  <meta name="description" content="人格实验室所有 ${items.length} 种人格类型的完整索引，覆盖 10 款测试。从恋爱脑到打工人，从消费人格到朋友圈物种。" />
  <link rel="canonical" href="${origin}/types/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="类型百科 - 人格实验室" />
  <meta property="og:description" content="${items.length} 种人格类型的完整索引" />
  <meta property="og:image" content="${origin}/images/og-sbti.png" />
  <meta property="og:url" content="${origin}/types/" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; background: #080808; color: #fff; }
    body { line-height: 1.6; }
    header { text-align: center; padding: 64px 24px 32px; }
    header h1 { font-size: 44px; margin-bottom: 12px; }
    header p { color: #888; }
    header a { color: #ff3b3b; text-decoration: none; }
    main { max-width: 960px; margin: 0 auto; padding: 0 24px 64px; }
    .group { margin-bottom: 48px; }
    .group h2 { font-size: 22px; margin-bottom: 16px; border-left: 3px solid #ff3b3b; padding-left: 12px; }
    .group h2 a { color: #fff; text-decoration: none; }
    .group h2 a:hover { color: #ff3b3b; }
    .count { font-size: 14px; color: #666; font-weight: 400; }
    ul.types { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
    ul.types li a { display: flex; flex-direction: column; gap: 4px; background: #111; border: 1px solid #222; border-radius: 10px; padding: 14px; text-decoration: none; color: #fff; transition: background 0.2s, border-color 0.2s; }
    ul.types li a:hover { background: #1a1a1a; border-color: #ff3b3b44; }
    ul.types .code { font-family: ui-monospace, monospace; font-size: 13px; color: #ff3b3b; font-weight: 700; }
    ul.types .cn { font-size: 14px; color: #ddd; }
    footer { text-align: center; color: #666; font-size: 13px; padding: 32px 24px 48px; border-top: 1px solid #222; max-width: 960px; margin: 0 auto; }
    footer a { color: #888; text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <h1>类型百科</h1>
    <p><a href="/">← 返回首页</a> · 共 ${items.length} 种人格类型，分布在 ${grouped.size} 款测试中</p>
  </header>
  <main>
${groupsHtml}
  </main>
  <footer>
    <p>所有测试仅供娱乐 · <a href="/">人格实验室</a></p>
  </footer>
</body>
</html>`;
}
```

- [ ] **Step 2: Extend `main()` to emit hub**

In `main()`, after the per-type loop, BEFORE writing `type-routes.json`, add:

```ts
  // Emit hub page
  const hubItems: HubTypeItem[] = allTypes.map((t) => ({
    testId: t.testSpec.id, testName: t.testSpec.name, testPath: t.testSpec.path,
    code: t.code, cn: t.cn, intro: t.intro,
  }));
  const hubHtml = renderTypeHubHTML(hubItems, ORIGIN);
  writeFileSync(join(outDir, 'index.html'), hubHtml, 'utf8');
  console.log(`Generated hub page /types/index.html (${hubItems.length} types grouped by ${new Set(hubItems.map((i) => i.testId)).size} tests)`);
```

- [ ] **Step 3: Add hub test**

Append to `scripts/gen-type-pages.test.mts`:

```ts
test('renderTypeHubHTML groups types by test and includes count', () => {
  const items = [
    { testId: 'gsti', testName: 'GSTI', testPath: '/gsti', code: 'M_GOLD', cn: '挖金壮男', intro: 'x' },
    { testId: 'gsti', testName: 'GSTI', testPath: '/gsti', code: 'F_PHNX', cn: '凤凰女', intro: 'x' },
    { testId: 'love', testName: 'Love', testPath: '/love', code: 'BURN', cn: '飞蛾', intro: 'x' },
  ];
  const html = renderTypeHubHTML(items, 'https://test.jiligulu.xyz');
  assert.match(html, /<title>类型百科 - 人格实验室 3 种人格类型<\/title>/);
  assert.match(html, /GSTI/);
  assert.match(html, /Love/);
  assert.match(html, /挖金壮男/);
  assert.match(html, /href="\/types\/M_GOLD"/);
  assert.match(html, /\(2\)/);  // GSTI count
  assert.match(html, /\(1\)/);  // Love count
});
```

Import it at the top:

```ts
import { renderTypePageHTML, renderTypeHubHTML, type TypePageData } from './gen-type-pages.mts';
```

- [ ] **Step 4: Run tests, verify 4/4 pass**

```bash
npx tsx --test scripts/gen-type-pages.test.mts
```

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-type-pages.mts scripts/gen-type-pages.test.mts
git commit -m "feat(seo): add /types/ hub page generator

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Extend sitemap generator to include type routes

**Files:**
- Modify: `scripts/gen-sitemap.mjs`

- [ ] **Step 1: Read current `scripts/gen-sitemap.mjs`**

- [ ] **Step 2: Modify main() to merge type-routes.json if present**

Replace the final `if (isMain)` block with:

```js
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // Optional: pick up additional routes from gen-type-pages
  let extraRoutes = [];
  const manifestPath = join(__dirname, 'type-routes.json');
  try {
    const manifest = JSON.parse(await import('node:fs').then((fs) => fs.readFileSync(manifestPath, 'utf8')));
    if (Array.isArray(manifest)) extraRoutes = manifest;
  } catch {}

  const allRoutes = [...new Set([...ROUTES, ...extraRoutes])];  // dedupe
  const xml = buildSitemap({ origin: ORIGIN, routes: allRoutes, lastmod: today() });
  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote ${outPath} (${allRoutes.length} routes)`);
}
```

- [ ] **Step 3: Run gen-type-pages then gen-sitemap, verify**

```bash
mkdir -p dist/types
npx tsx scripts/gen-type-pages.mts
node scripts/gen-sitemap.mjs
head -5 public/sitemap.xml
grep -c '<url>' public/sitemap.xml
```

Expected: count is 11 (base) + N type pages + 1 (for `/types/`) — should be 200+.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-sitemap.mjs
git commit -m "feat(seo): merge type-routes.json into sitemap generation

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Wire into build.sh

**Files:**
- Modify: `build.sh`

- [ ] **Step 1: Read current build.sh**

- [ ] **Step 2: Reorder and add type-page generation**

In the SEO asset generation block (near top, after `set -e`), replace the existing block with:

```bash

# --- SEO asset generation ---
# Regenerate OG images if any are missing
if [ ! -f public/images/og-gsti.png ] || [ ! -f public/images/og-fpi.png ] || \
   [ ! -f public/images/og-fsi.png ] || [ ! -f public/images/og-mpi.png ]; then
  node scripts/gen-og-images.mjs
fi
```

Note: we REMOVE `node scripts/gen-sitemap.mjs` from here — it runs later, after type pages.

After the Vite build + dist assembly (after step 7.5 — where sitemap is currently copied), and BEFORE the final cleanup (`rm -rf dist-temp`), add:

```bash

# 7.6 Generate type pages directly into dist/types/
npx tsx scripts/gen-type-pages.mts
# Regenerate sitemap now that type routes exist
node scripts/gen-sitemap.mjs
# Re-copy sitemap since it changed
cp public/sitemap.xml dist/sitemap.xml
```

- [ ] **Step 3: Clean build**

```bash
rm -rf dist dist-temp
bash build.sh 2>&1 | tail -10
```

Expected: no errors. End message "Build complete...".

- [ ] **Step 4: Verify dist contents**

```bash
[ -f dist/types/index.html ] && echo "✓ /types/"
ls dist/types/ | wc -l  # expect ~200 directories + index.html
[ -f dist/types/M_GOLD/index.html ] && echo "✓ /types/M_GOLD/"
[ -f dist/types/F_PHNX/index.html ] && echo "✓ /types/F_PHNX/"
grep -c '<url>' dist/sitemap.xml
```

Expected: `/types/` exists, ~200 subdirs exist, sitemap count > 200.

- [ ] **Step 5: Spot-check a type page**

```bash
cat dist/types/M_GOLD/index.html | head -30
```

Expected: valid HTML with correct canonical, title, h1.

- [ ] **Step 6: Commit**

```bash
git add build.sh
git commit -m "feat(seo): wire type-pages generation into build pipeline

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Final verify, merge main, push

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist dist-temp
bash build.sh 2>&1 | tail -10
```

- [ ] **Step 2: Tsc check**

```bash
npx tsc --noEmit
```

Expected: no errors (note: `.mts` script files are not part of the main tsconfig, should be excluded; if tsc complains about them, add to tsconfig excludes or ignore — but they should work via tsx standalone anyway).

- [ ] **Step 3: Run all tests**

```bash
npx tsx --test scripts/gen-type-pages.test.mts
node --test scripts/gen-sitemap.test.mjs
```

Expected: all pass.

- [ ] **Step 4: Smoke-test type pages locally**

```bash
npx serve dist -l 5175 &
SERVE_PID=$!
sleep 2
curl -sL http://localhost:5175/types/ | grep -c 'M_GOLD'  # expect 1+
curl -sL http://localhost:5175/types/M_GOLD/ | grep -c '挖金壮男'  # expect 1+
curl -sL http://localhost:5175/sitemap.xml | grep -c '<url>'  # expect 200+
kill $SERVE_PID
```

- [ ] **Step 5: Merge branch to main**

```bash
git checkout main
git merge --ff-only feat/seo-phase1  # or whatever branch we're on; might be feat/seo-phase2
git log --oneline -8
```

- [ ] **Step 6: Push**

```bash
git push origin main
```

Vercel deploys automatically.

---

## Self-Review Checklist Run

**Spec coverage:**
- ✅ Type page template + per-type generation (Task 2)
- ✅ `/types/` hub index (Task 3)
- ✅ Sitemap includes type routes (Task 4)
- ✅ Build pipeline integration (Task 5)
- ✅ Internal linking (type page → test + related types; hub → all)

**Gaps vs. spec Phase 2 deliverables:**
- **Skipped**: vite-plugin-ssg for test landing pages. Reason: Phase 1 already shipped static intro blocks inside each *.html shell; richer content can be an iterative enhancement (Phase 2.5), doesn't block core SEO value. Type pages are the 80/20 of Phase 2.
- **Skipped**: lighthouse-ci setup (nice-to-have; verify manually via PageSpeed Insights).

**Placeholder scan:** no TBD/TODO; all code blocks complete.

**Type consistency:** `TypePageData` interface used consistently across test + impl; `HubTypeItem` consistent. Route format `/types/<CODE>` consistent.

---

## Risks & Non-Goals

- **Risk**: Importing TS from Node script via `tsx`. The `.mts` script files include direct imports of `src/data/*/types.ts`. If those files have circular deps or import heavy React code, the script could fail. Each `types.ts` should be pure data — spot-check if unsure.
- **Risk**: `new.html` (SBTI) and the repo-root `/images/` may conflict on dist build with other assets. Type pages only reference `/images/og-<testId>.png` which we control, so no conflict expected.
- **Non-goal**: Enhanced landing page content (FAQ, example questions, type preview) — deferred to Phase 2.5.
- **Non-goal**: Lighthouse CI — manual check post-deploy.

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-18 | v1 initial | cwjjjjj + Claude |
