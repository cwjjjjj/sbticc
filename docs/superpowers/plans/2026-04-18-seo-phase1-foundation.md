# SEO Phase 1 — Technical Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the technical SEO baseline so Google can correctly index every test landing page within 1-2 days of work: sitemap, robots, canonical fixes, missing OG images, and static fallback content in each SPA shell.

**Architecture:** No SPA refactor. Each `*.html` shell gets static intro HTML inside `<div id="root">` that is replaced by React on mount — Google's first-pass crawl sees rich content, rendered-pass sees the app. Sitemap + robots served from `public/`. Missing OG images generated at build time via Satori + resvg-js.

**Tech Stack:** Node ESM scripts, Satori (`satori`), `@resvg/resvg-js`, existing Vite + React 19 + bash build pipeline.

---

## File Structure

**New files:**
- `public/robots.txt` — static, shipped as-is by Vite
- `scripts/gen-sitemap.mjs` — Node ESM, produces `public/sitemap.xml`
- `scripts/gen-og-images.mjs` — Node ESM, uses Satori to render 4 missing OG PNGs to `public/images/`
- `scripts/gen-sitemap.test.mjs` — unit test for sitemap generator using `node:test`
- `public/images/og-gsti.png`, `og-fpi.png`, `og-fsi.png`, `og-mpi.png` — generated, committed

**Modified files:**
- `build.sh` — run sitemap + og-images generators before Vite build
- `index.html` — add canonical + og tags; add H1 + intro paragraph still hidden behind JS
- `new.html` — add static SEO intro block inside `<div id="root">`; fix canonical to new path
- `love.html`, `work.html`, `values.html`, `cyber.html`, `desire.html` — same (canonical + intro)
- `gsti.html`, `fpi.html`, `fsi.html`, `mpi.html` — same + add missing og:image and twitter:image tags
- `package.json` — add devDeps `satori`, `@resvg/resvg-js`

**URL structure (already live via vercel.json rewrites):**
- Canonical format: `https://test.jiligulu.xyz/<path>` (not `/new/<path>`)
- Homepage canonical: `https://test.jiligulu.xyz/`
- SBTI canonical: `https://test.jiligulu.xyz/sbti`
- Other tests: `https://test.jiligulu.xyz/<test>` for `love|work|values|cyber|desire|gsti|fpi|fsi|mpi`

---

### Task 1: sitemap.xml generator

**Files:**
- Create: `scripts/gen-sitemap.mjs`
- Create: `scripts/gen-sitemap.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `scripts/gen-sitemap.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap } from './gen-sitemap.mjs';

test('buildSitemap emits one <url> per route, with lastmod', () => {
  const xml = buildSitemap({
    origin: 'https://test.jiligulu.xyz',
    routes: ['/', '/sbti', '/love'],
    lastmod: '2026-04-18',
  });
  assert.match(xml, /<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<loc>https:\/\/test\.jiligulu\.xyz\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/test\.jiligulu\.xyz\/sbti<\/loc>/);
  assert.match(xml, /<loc>https:\/\/test\.jiligulu\.xyz\/love<\/loc>/);
  assert.match(xml, /<lastmod>2026-04-18<\/lastmod>/);
  const urlCount = (xml.match(/<url>/g) ?? []).length;
  assert.equal(urlCount, 3);
});

test('buildSitemap escapes XML special chars in URLs', () => {
  const xml = buildSitemap({
    origin: 'https://test.jiligulu.xyz',
    routes: ['/types/FAMX?'],
    lastmod: '2026-04-18',
  });
  assert.match(xml, /<loc>https:\/\/test\.jiligulu\.xyz\/types\/FAMX&#63;<\/loc>/);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test scripts/gen-sitemap.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `./gen-sitemap.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/gen-sitemap.mjs`:

```js
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const XML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '?': '&#63;',
};

function escapeXml(s) {
  return s.replace(/[&<>"'?]/g, (c) => XML_ESCAPES[c]);
}

/**
 * Build a sitemap XML string.
 * @param {{origin: string, routes: string[], lastmod: string}} opts
 * @returns {string}
 */
export function buildSitemap({ origin, routes, lastmod }) {
  const urls = routes.map((route) => {
    const loc = escapeXml(`${origin}${route}`);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const ORIGIN = 'https://test.jiligulu.xyz';
const ROUTES = [
  '/',
  '/sbti',
  '/love',
  '/work',
  '/values',
  '/cyber',
  '/desire',
  '/gsti',
  '/fpi',
  '/fsi',
  '/mpi',
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Only run main if invoked directly (not imported)
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const xml = buildSitemap({ origin: ORIGIN, routes: ROUTES, lastmod: today() });
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote ${outPath} (${ROUTES.length} routes)`);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node --test scripts/gen-sitemap.test.mjs
```

Expected: PASS (2 tests).

- [ ] **Step 5: Run generator once to create initial sitemap**

```bash
mkdir -p public
node scripts/gen-sitemap.mjs
cat public/sitemap.xml
```

Expected output: XML with 11 `<url>` entries (`/` + 10 tests).

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-sitemap.mjs scripts/gen-sitemap.test.mjs public/sitemap.xml
git commit -m "feat(seo): add sitemap.xml generator with route list"
```

---

### Task 2: robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create robots.txt**

```
User-agent: *
Allow: /

# Disallow build/dev artifacts that shouldn't be indexed
Disallow: /api/
Disallow: /_vercel/
Disallow: /new/

Sitemap: https://test.jiligulu.xyz/sitemap.xml
```

Notes:
- `Disallow: /new/` prevents indexing of the legacy paths (they 308-redirect anyway, but explicit is safer).
- `Disallow: /api/` is habit; API is stateless JSON endpoints, nothing to crawl.

- [ ] **Step 2: Verify file**

```bash
cat public/robots.txt
```

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): add robots.txt with sitemap reference"
```

---

### Task 3: Fix canonical URLs across 11 HTML files

All current canonicals point to `https://sbti.jiligulu.xyz/new/...`. Need to update to `https://test.jiligulu.xyz/...` (new domain + flattened path).

**Files to modify** (exact edits listed per file below):
- `index.html` — add canonical (currently missing)
- `new.html` — fix canonical
- `love.html`, `work.html`, `values.html`, `cyber.html`, `desire.html`, `gsti.html`, `fpi.html`, `fsi.html`, `mpi.html` — fix canonical + og:url + twitter metadata

- [ ] **Step 1: Add canonical + og tags to index.html**

In `index.html`, after line 10 (the `<meta name="description">` line), insert:

```html
  <link rel="canonical" href="https://test.jiligulu.xyz/" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="人格实验室 — 10个测试，N种人格，0个正确答案" />
  <meta property="og:description" content="人格实验室：10款趣味人格测试，从恋爱脑到打工人，从赛博基因到朋友圈人设再到消费人格，测出你从未认识的自己。" />
  <meta property="og:image" content="https://test.jiligulu.xyz/images/og-sbti.png" />
  <meta property="og:url" content="https://test.jiligulu.xyz/" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="人格实验室" />
  <meta name="twitter:description" content="10款趣味人格测试，测出你从未认识的自己。" />
  <meta name="twitter:image" content="https://test.jiligulu.xyz/images/og-sbti.png" />
```

- [ ] **Step 2: Fix canonical + og:url in new.html, love, work, values, cyber, desire, gsti, fpi, fsi, mpi**

Each file has two URL references to update:
1. `<link rel="canonical" href="https://sbti.jiligulu.xyz/new/<path>" />` → change to `https://test.jiligulu.xyz/<path>`
2. `<meta property="og:url" content="https://sbti.jiligulu.xyz/new/<path>" />` → change to `https://test.jiligulu.xyz/<path>`

Path mapping:
- `new.html`         → `/sbti`
- `love.html`        → `/love`
- `work.html`        → `/work`
- `values.html`      → `/values`
- `cyber.html`       → `/cyber`
- `desire.html`      → `/desire`
- `gsti.html`        → `/gsti`
- `fpi.html`         → `/fpi`
- `fsi.html`         → `/fsi`
- `mpi.html`         → `/mpi`

Also update any `og:image` / `twitter:image` that use `sbti.jiligulu.xyz` domain to `test.jiligulu.xyz`.

Batch sed command (preview first with `-n` flag or run per file):

```bash
for f in new.html love.html work.html values.html cyber.html desire.html gsti.html fpi.html fsi.html mpi.html; do
  # Note: sed -i '' on macOS, sed -i on Linux
  sed -i '' -e 's|https://sbti\.jiligulu\.xyz/new/|https://test.jiligulu.xyz/|g' \
            -e 's|https://sbti\.jiligulu\.xyz/|https://test.jiligulu.xyz/|g' "$f"
done
# Special case: new.html path /new/ flattens to /sbti (not just /)
sed -i '' -e 's|href="https://test\.jiligulu\.xyz/"|href="https://test.jiligulu.xyz/sbti"|' \
          -e 's|content="https://test\.jiligulu\.xyz/"|content="https://test.jiligulu.xyz/sbti"|' new.html
```

**Gotcha:** if `new.html` had `href="https://sbti.jiligulu.xyz/new/"` (trailing slash), after the first sed it becomes `href="https://test.jiligulu.xyz/"` which collides with root. The second sed fixes that to `/sbti`. Verify post-edit.

- [ ] **Step 3: Verify each file has correct canonical**

```bash
grep -nH 'canonical\|og:url' index.html new.html love.html work.html values.html cyber.html desire.html gsti.html fpi.html fsi.html mpi.html
```

Expected: each file shows exactly one canonical and one og:url, both pointing to the right `https://test.jiligulu.xyz/<path>` with matching paths.

- [ ] **Step 4: Commit**

```bash
git add index.html new.html love.html work.html values.html cyber.html desire.html gsti.html fpi.html fsi.html mpi.html
git commit -m "feat(seo): fix canonicals to new test.jiligulu.xyz short paths"
```

---

### Task 4: Generate 4 missing OG images with Satori

Tests `gsti`, `fpi`, `fsi`, `mpi` currently have no `og:image`. Generate brand-consistent 1200×630 PNGs via Satori (JSX → SVG) + `@resvg/resvg-js` (SVG → PNG).

**Files:**
- Create: `scripts/gen-og-images.mjs`
- Modify: `package.json` (add devDependencies)
- Output: `public/images/og-gsti.png`, `og-fpi.png`, `og-fsi.png`, `og-mpi.png`

- [ ] **Step 1: Install dependencies**

```bash
npm install --save-dev satori @resvg/resvg-js
```

- [ ] **Step 2: Write generator**

Create `scripts/gen-og-images.mjs`:

```js
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Load a CJK-capable system font for Satori text rendering.
// macOS ships PingFang at this path; fallback to a common alt.
const FONT_CANDIDATES = [
  '/System/Library/Fonts/PingFang.ttc',
  '/System/Library/Fonts/STHeiti Medium.ttc',
  '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
];
let fontData = null;
for (const p of FONT_CANDIDATES) {
  if (existsSync(p)) {
    fontData = readFileSync(p);
    console.log(`Using font: ${p}`);
    break;
  }
}
if (!fontData) {
  throw new Error('No CJK font found. Install Noto Sans CJK or run on macOS.');
}

const TESTS = [
  { slug: 'gsti', emoji: '🪞', title: 'GSTI 性转人格测试', tagline: '性转后你是什么鬼',        bg: '#1a0f1f', accent: '#c084fc' },
  { slug: 'fpi',  emoji: '📸', title: '朋友圈人设诊断',       tagline: '你在朋友圈是什么物种',   bg: '#0f1a1f', accent: '#22d3ee' },
  { slug: 'fsi',  emoji: '🏷️', title: '原生家庭幸存者',       tagline: '你被养成了什么形状',     bg: '#1f1510', accent: '#fb923c' },
  { slug: 'mpi',  emoji: '💸', title: '消费人格图鉴',         tagline: '你怎么把钱输给这个世界', bg: '#1f1810', accent: '#facc15' },
];

function jsx(test) {
  return {
    type: 'div',
    props: {
      style: {
        width: 1200, height: 630,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 80, background: test.bg, color: '#fff', fontFamily: 'PingFang SC',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 20 },
            children: [
              { type: 'span', props: { style: { fontSize: 80 }, children: test.emoji } },
              { type: 'span', props: { style: { fontSize: 28, color: test.accent, fontWeight: 700, letterSpacing: 2 }, children: 'test.jiligulu.xyz' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 16 },
            children: [
              { type: 'div', props: { style: { fontSize: 88, fontWeight: 800, lineHeight: 1.1 }, children: test.title } },
              { type: 'div', props: { style: { fontSize: 40, color: '#bbb' }, children: test.tagline } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#888' },
            children: [
              { type: 'span', props: { children: '人格实验室' } },
              { type: 'span', props: { children: '10 个测试 · N 种人格 · 0 个正确答案' } },
            ],
          },
        },
      ],
    },
  };
}

for (const t of TESTS) {
  const svg = await satori(jsx(t), {
    width: 1200, height: 630,
    fonts: [{ name: 'PingFang SC', data: fontData, weight: 700, style: 'normal' }],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  const out = join(OUT_DIR, `og-${t.slug}.png`);
  writeFileSync(out, png);
  console.log(`Wrote ${out} (${(png.length / 1024).toFixed(0)} KB)`);
}
```

- [ ] **Step 3: Run generator**

```bash
node scripts/gen-og-images.mjs
ls -lh public/images/og-{gsti,fpi,fsi,mpi}.png
```

Expected: 4 PNGs, each ~40-80 KB, 1200×630.

- [ ] **Step 4: Quick visual sanity check**

```bash
open public/images/og-gsti.png
```

Confirm: title, tagline, emoji rendered correctly in Chinese; colors match brand (dark bg + accent).

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-og-images.mjs package.json package-lock.json public/images/og-gsti.png public/images/og-fpi.png public/images/og-fsi.png public/images/og-mpi.png
git commit -m "feat(seo): generate brand OG images for gsti/fpi/fsi/mpi"
```

---

### Task 5: Add og:image + twitter:image to 4 HTML files missing them

- [ ] **Step 1: Edit gsti.html**

In `gsti.html`, after line 15 (the `<meta property="og:url">` line), insert:

```html
  <meta property="og:image" content="https://test.jiligulu.xyz/images/og-gsti.png" />
```

In `gsti.html`, after the existing `<meta name="twitter:description">` line, insert:

```html
  <meta name="twitter:image" content="https://test.jiligulu.xyz/images/og-gsti.png" />
```

- [ ] **Step 2: Edit fpi.html the same way**

After `og:url`, add:
```html
  <meta property="og:image" content="https://test.jiligulu.xyz/images/og-fpi.png" />
```

After `twitter:description`, add:
```html
  <meta name="twitter:image" content="https://test.jiligulu.xyz/images/og-fpi.png" />
```

- [ ] **Step 3: Edit fsi.html the same way** (substitute `og-fsi.png`)

- [ ] **Step 4: Edit mpi.html the same way** (substitute `og-mpi.png`)

- [ ] **Step 5: Verify**

```bash
grep -nH 'og:image\|twitter:image' gsti.html fpi.html fsi.html mpi.html
```

Expected: each file shows exactly one `og:image` and one `twitter:image`, both pointing to the right PNG.

- [ ] **Step 6: Commit**

```bash
git add gsti.html fpi.html fsi.html mpi.html
git commit -m "feat(seo): add og:image and twitter:image for gsti/fpi/fsi/mpi"
```

---

### Task 6: Inline SEO intro content inside each test shell

Insert a static fallback block inside `<div id="root">` of each `*.html` file. React's `createRoot(root).render(App)` replaces children on mount — so Google's first-pass crawl sees static content, rendered-pass sees React app. No hidden content / cloaking concern.

**Principle:** For each test, put an `<article class="seo-intro">` with `<h1>`, test tagline (`<p>`), "测试说明" heading (`<h2>`), and 2 more short paragraphs. Total ~150 words per test.

- [ ] **Step 1: Edit new.html**

Replace `<div id="root"></div>` (line 36 or similar) with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>SBTI 人格测试 — 15 维度深度人格扫描</h1>
      <p>29 种人格类型，1 种隐藏彩蛋。SBTI 不是 MBTI，问题更毒、维度更多、结果更有梗。</p>
      <h2>测试说明</h2>
      <p>本测试包含约 30 道情境题，覆盖性取向、情感、行动、态度、社交 5 大模型共 15 个心理维度。根据你的答题分布，系统会在 29 个类型里做向量相似度匹配，给出最接近你的那一个。</p>
      <p>完成后你会看到：你的雷达图、类型卡片、中英文解读、以及你在全站历史测试里的稀有度排名。</p>
      <p>测试完全免费，5 分钟出结果，支持分享图 + 好友对比链接。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 2: Edit love.html** — replace `<div id="root"></div>` with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>恋爱脑浓度检测 — 你谈恋爱是什么德性</h1>
      <p>30 道尖锐问题，6 个维度，20 种恋爱人格。你是飞蛾、操盘手还是孤岛？比任何恋爱测试都更毒舌。</p>
      <h2>测试说明</h2>
      <p>本测试不猜血型、不问星座，只追问："恋爱时你的大脑在干什么？"从依恋模式、嫉妒阈值、投入程度、控制欲、沟通方式、边界感 6 个维度扫描你的恋爱内核。</p>
      <p>结果包含 20 种类型：从"飞蛾扑火型"到"铁石心肠型"，从"情感操盘手"到"浪漫殉道者"。每个类型附有相性匹配和冷知识。</p>
      <p>5 分钟完成，支持与伴侣/好友对比生成雷达图。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 3: Edit work.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>打工人鉴定 — 你是哪种打工人</h1>
      <p>20 种打工人原型，从"卷王"到"摸鱼专业户"，从"会议收集癖"到"背锅吸铁石"，精准识别你的职场物种。</p>
      <h2>测试说明</h2>
      <p>不问 MBTI、不猜星座，只追踪你一天中处理 Slack、开会、写周报、背锅时的真实反应。6 个维度：内卷指数、摸鱼天赋、汇报话术、情绪劳动、社交电量、权力关系嗅觉。</p>
      <p>结果包含 20 种打工人类型卡片，每张附带"你最容易在哪类公司活下来"的职场适配度推断。</p>
      <p>完成测试送稀有度评分，可对比同事/老板，测完就知道为什么你总是加班。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 4: Edit values.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>活法检测报告 — 你到底在活什么</h1>
      <p>你以为自己在追求"幸福"？也许你在追求安全感、爽感、意义感或干脆什么都没追求。20 种活法，看看哪个是你。</p>
      <h2>测试说明</h2>
      <p>本测试通过 30 道哲学向问题，从意义感、确定性、体验欲、社群连结、自主权 5 个维度追问："你生活的底层逻辑到底是什么？"</p>
      <p>结果包含 20 种活法：从"意义狂热者"到"爽感驱动者"，从"秩序守护者"到"混乱拥抱者"。每一种都有对应的人生策略建议。</p>
      <p>适合迷茫的打工人、30+ 人生复盘者、所有"我是谁我在哪儿"的大龄儿童。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 5: Edit cyber.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>赛博基因检测 — 你是什么品种的网民</h1>
      <p>25 种网络物种大赏：杠精、考古学家、点赞机器、吃瓜群众、空降键盘侠。你在互联网上是什么样子？</p>
      <h2>测试说明</h2>
      <p>本测试从 6 个网络行为维度（发帖频率、评论攻击性、信息摄取、社交姿态、隐私洁癖、算法驯服度）扫描你的数字人格。</p>
      <p>结果包含 25 种网络物种，每种配专属吐槽、冷知识、"遇到这类人应该怎么办"指南。</p>
      <p>Z 世代、互联网原住民、朋友圈观察家友好。5 分钟出结果，支持分享给群友集体对比。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 6: Edit desire.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>欲望图谱 — 关上门之后你是谁</h1>
      <p>性取向只是表层。欲望图谱 20 种类型，扫描你关灯后的真正形状——控制欲、依附需求、禁忌兴奋点、情感连结模式。</p>
      <h2>测试说明</h2>
      <p>本测试不是性向测试、不给标签。它问的是："在亲密关系的私领域里，你的能量流向哪里？"从支配/臣服、探索/稳定、开放/占有、情感/肉体等 6 个维度精准定位。</p>
      <p>结果卡片自带 SFW/NSFW 切换，可以安全截图分享。内含相性配对、禁忌雷区、健康边界提示。</p>
      <p>测试结果匿名，不记录、不上传任何题目答案，仅计算类型分布。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 7: Edit gsti.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>GSTI 性转人格测试 — 性转后你是什么鬼</h1>
      <p>SBTI 告诉你是什么，GSTI 告诉你性转后是什么。男生测出全是女性物种，女生测出全是男性物种。42 种跨性别刻板画像。</p>
      <h2>测试说明</h2>
      <p>本测试基于 SBTI 的 15 维度模型，但把结果池反转：男生获得 20 种"女性刻板物种"（挖金壮男、绿茶公、圣母公、白月光哥哥等），女生获得 20 种"男性刻板物种"（凤凰女、海后、阴谋家、键盘大妈等），加 2 个隐藏类型。</p>
      <p>意在以荒诞反串方式解构性别刻板印象，测试题中立，结果充满梗。</p>
      <p>适合深夜无聊、闺蜜聚会、微博朋友圈发梗素材。5 分钟完成，附稀有度排名。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 8: Edit fpi.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>朋友圈人设诊断 — 你在朋友圈是什么物种</h1>
      <p>滤镜代工厂、九宫格暴君、深夜 emo 发电机、已读不回幽灵、朋友圈坟墓……22 种朋友圈物种画像，一键识别你或你对象。</p>
      <h2>测试说明</h2>
      <p>本测试从 6 个社交媒体行为维度（发文频率、精修程度、人设经营、情绪表达、互动热度、隐私边界）扫描你的朋友圈人格。</p>
      <p>结果包含 22 种类型，每种附带"朋友看到你的朋友圈会怎么想"的真实反馈、"该如何改进/保持"的社交建议。</p>
      <p>适合：社交疲惫党、互联网观察家、想吐槽对象朋友圈但缺素材的人。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 9: Edit fsi.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>原生家庭幸存者 — 你被养成了什么形状</h1>
      <p>复印机娃、在逃孝子、家庭隐身术、断亲先锋、重养自己……20 种童年遗产类型。看看你身上有多少家族 bug 没 debug。</p>
      <h2>测试说明</h2>
      <p>本测试不煽情、不卖惨，纯结构化扫描。从 6 个维度（父母控制度、家庭温度、性别角色、经济条件、关注度、代际复刻程度）分析你童年环境留下的痕迹。</p>
      <p>结果包含 20 种"幸存者"类型，每种附带"这种背景下常见的心理 pattern""自我疗愈的第一步建议"。</p>
      <p>适合 30+ 人生复盘者、咨询室常客、试图和父母和解或彻底断亲的人。测试结果仅供自我觉察，不构成医学诊断。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 10: Edit mpi.html** — replace with:

```html
  <div id="root">
    <article class="seo-intro">
      <h1>消费人格图鉴 — 你怎么把钱输给这个世界</h1>
      <p>直播间人质、二奢鉴定师、剁手永动机、双 11 赌徒、羊毛党、会员狂魔……20 种消费人格，精准定位你的钱包泄洞。</p>
      <h2>测试说明</h2>
      <p>本测试从 6 个消费行为维度（囤积欲、炫耀程度、节俭指数、易感度、二手接受度、直播易感度）扫描你的消费人格。</p>
      <p>结果包含 20 种类型，每种附带"你最容易在哪类平台失控"的诊断 + 一张"本月剁手风险地图"。</p>
      <p>完成测试可以对比伴侣/室友，看看谁才是家里真正的败家户。免费，5 分钟，不会让你花任何钱（理论上）。</p>
      <p><em>JavaScript 加载中，如长时间无响应请刷新页面。</em></p>
    </article>
  </div>
```

- [ ] **Step 11: Add CSS to hide seo-intro visually when React mounts (defensive)**

Append to `src/index.css` (append at end):

```css
/* SEO fallback — visible in raw HTML for crawlers, replaced by React on mount */
.seo-intro { display: block; padding: 2rem; max-width: 720px; margin: 0 auto; color: #e5e5e5; font-family: -apple-system, "PingFang SC", sans-serif; }
.seo-intro h1 { font-size: 2rem; margin-bottom: 0.75rem; }
.seo-intro h2 { font-size: 1.25rem; margin: 1.5rem 0 0.5rem; color: #c084fc; }
.seo-intro p { line-height: 1.7; margin-bottom: 0.75rem; color: #bbb; }
```

Note: this styles it nicely so the brief flash users see (before React hydrates) is readable, not ugly. React will replace the node anyway.

- [ ] **Step 12: Verify**

```bash
grep -l 'seo-intro' *.html | wc -l
```

Expected: 10 (all test HTMLs; index.html is excluded — its hero content is already static).

- [ ] **Step 13: Commit**

```bash
git add new.html love.html work.html values.html cyber.html desire.html gsti.html fpi.html fsi.html mpi.html src/index.css
git commit -m "feat(seo): add static SEO intro content inside each test shell"
```

---

### Task 7: Wire sitemap + og-image generators into build.sh

- [ ] **Step 1: Read current build.sh**

```bash
cat build.sh
```

- [ ] **Step 2: Add generators as first build step**

Insert after `set -e` (line 2), before `npx tsc`:

```bash
# Generate sitemap + OG images (idempotent, always fresh)
node scripts/gen-sitemap.mjs
# Only regenerate OG images if any missing (avoids slow font load on every build)
if [ ! -f public/images/og-gsti.png ] || [ ! -f public/images/og-fpi.png ] || \
   [ ! -f public/images/og-fsi.png ] || [ ! -f public/images/og-mpi.png ]; then
  node scripts/gen-og-images.mjs
fi
```

- [ ] **Step 3: Verify sitemap + robots get into dist**

Since they live in `public/`, Vite copies them automatically to `dist-temp/`, then build.sh copies to `dist/`. No extra copy needed — BUT the current build.sh only copies `dist-temp/assets` and `dist-temp/*.html` explicitly. Check if it copies all of `public/` contents.

Read current build.sh step 4:
```bash
cp dist-temp/new.html dist/new/index.html
cp -r dist-temp/assets dist/new/assets
```

Vite places `public/` files at the output root. So `dist-temp/sitemap.xml`, `dist-temp/robots.txt`, `dist-temp/images/og-*.png` all exist. Need to copy to `dist/`.

Add after step 7 (Copy shared static assets):

```bash
# 7.5 Copy SEO root files (sitemap, robots) to dist root
[ -f dist-temp/sitemap.xml ] && cp dist-temp/sitemap.xml dist/sitemap.xml
[ -f dist-temp/robots.txt ] && cp dist-temp/robots.txt dist/robots.txt
# og-*.png already copied under public/images → dist/images/ via the images copy above (step 7 does `cp -r images dist/images`).
# If we added them to public/images (not repo /images), verify they're copied from dist-temp:
# Use a merge copy to not overwrite existing /images/ files:
if [ -d dist-temp/images ]; then
  cp -n dist-temp/images/* dist/images/ 2>/dev/null || true
fi
```

Actually, there's ambiguity: `public/images/og-gsti.png` (generated) vs `./images/og-love.png` (in repo root). Let me check which one `new.html` references:

```bash
grep og-sbti index.html
```

If it's `/images/og-sbti.png`, the public/ approach serves as `/images/og-sbti.png` too (Vite copies public → root). So paths align. We just need to avoid overwriting the repo's original `/images/` with the `dist-temp/images/` copy.

Simpler: symlink or explicit merge. The `cp -n` above preserves existing files when merging, so generated OG images fill in only where absent.

- [ ] **Step 4: Run local build to verify**

```bash
bash build.sh
```

Expected: no errors, final echo "Build complete" message.

- [ ] **Step 5: Verify dist contents**

```bash
test -f dist/sitemap.xml && echo "✓ sitemap.xml"
test -f dist/robots.txt && echo "✓ robots.txt"
test -f dist/images/og-gsti.png && echo "✓ og-gsti.png"
test -f dist/images/og-sbti.png && echo "✓ og-sbti.png (existing preserved)"
grep -l 'seo-intro' dist/new/*/index.html 2>/dev/null | wc -l  # should be non-zero after React build does NOT strip the static content from *.html shells
```

- [ ] **Step 6: Serve locally and verify view-source**

```bash
npx serve dist -l 5174 &
SERVE_PID=$!
sleep 2
curl -sL http://localhost:5174/sitemap.xml | head -5
curl -sL http://localhost:5174/robots.txt
curl -sL http://localhost:5174/new/love/index.html | grep -c 'seo-intro'   # expect 1
kill $SERVE_PID
```

- [ ] **Step 7: Commit**

```bash
git add build.sh
git commit -m "feat(seo): wire sitemap + og-images generators into build pipeline"
```

---

### Task 8: Final verification + push

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist dist-temp
bash build.sh
```

Expected: success, dist/ contains everything.

- [ ] **Step 2: TypeScript check (no regressions)**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify sitemap content**

```bash
cat dist/sitemap.xml
```

Expected: 11 URLs, all pointing to `https://test.jiligulu.xyz/...`.

- [ ] **Step 4: Verify robots.txt**

```bash
cat dist/robots.txt
```

Expected: contains `Sitemap: https://test.jiligulu.xyz/sitemap.xml`.

- [ ] **Step 5: Verify canonicals**

```bash
for f in dist/index.html dist/new/*/index.html; do
  echo "=== $f ==="
  grep -E 'canonical|og:url' "$f" | head -4
done
```

Expected: every file shows canonical + og:url pointing to correct `https://test.jiligulu.xyz/<path>`.

- [ ] **Step 6: Verify OG images exist**

```bash
ls -lh dist/images/og-{sbti,love,work,values,cyber,desire,gsti,fpi,fsi,mpi}.png
```

Expected: 10 files, all non-zero.

- [ ] **Step 7: View-source check in browser (manual)**

Open `http://localhost:5174/new/gsti/index.html` in browser, right-click → View Source, confirm:
- Contains `<h1>GSTI 性转人格测试`
- Contains og:image URL
- Contains `<link rel="canonical" href="https://test.jiligulu.xyz/gsti"`

- [ ] **Step 8: Push main**

```bash
git log --oneline origin/main..HEAD
git push origin main
```

Expected: Vercel auto-deploy triggers. After ~2-3 min, verify at `https://test.jiligulu.xyz/sitemap.xml`.

- [ ] **Step 9: Post-deploy Google Search Console step (manual)**

User task (not a code step):
1. Open https://search.google.com/search-console/
2. Add property `test.jiligulu.xyz` (DNS or HTML verification)
3. Submit sitemap URL `https://test.jiligulu.xyz/sitemap.xml`
4. Check "Indexing / Pages" in 2-3 days to confirm URLs discovered

---

## Self-Review Checklist Run

**Spec coverage:**
- ✅ `robots.txt` (Task 2)
- ✅ `sitemap.xml` generator (Task 1)
- ✅ Canonical fixes for new URL structure (Task 3)
- ✅ Missing OG images generated (Task 4)
- ✅ OG meta tags added to 4 HTMLs (Task 5)
- ✅ Static intro content in each test shell (Task 6)
- ✅ build.sh integration (Task 7)
- ✅ Verification + GSC submission (Task 8 + step 9)

**Gaps vs. spec Phase 1 deliverables:** None — all 5 items addressed.

**Placeholder scan:** No TBD/TODO/vague placeholders in this plan. All code blocks complete.

**Type consistency:** `buildSitemap({origin, routes, lastmod})` signature consistent in test and impl. Script filenames consistent.

---

## Risks & Non-Goals

- **Font missing on CI**: if executed on a Linux runner, `/System/Library/Fonts/PingFang.ttc` won't exist. Script falls back to Noto Sans CJK path; if absent, it will throw. **Mitigation**: run `gen-og-images.mjs` once locally (macOS has PingFang), commit the PNGs; build.sh has an `if missing` check, so it won't re-run on CI unless someone deletes the PNGs.
- **Not in scope for Phase 1**: SSG prerender (→ Phase 2), type-encyclopedia pages (→ Phase 2), articles + cron (→ Phase 3).

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-18 | v1 initial | cwjjjjj + Claude |
