import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
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
  publishedAt: string;
  keywords?: string[];
  relatedTests?: string[];
  sources?: Array<{ url: string; note: string }>;
}

export interface ArticleData extends ArticleFrontmatter {
  origin: string;
  bodyHtml: string;
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
    html, body, * { scrollbar-width: none; -ms-overflow-style: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none; width: 0; height: 0; }
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

export function renderArticleHubHTML(items: ArticleFrontmatter[], origin: string): string {
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
    html, body, * { scrollbar-width: none; -ms-overflow-style: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none; width: 0; height: 0; }
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

  allArticles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const hubHtml = renderArticleHubHTML(allArticles, ORIGIN);
  writeFileSync(join(outDir, 'index.html'), hubHtml, 'utf8');

  writeFileSync(join(__dirname, 'article-routes.json'), JSON.stringify(routes, null, 2), 'utf8');

  // Emit a public manifest so the client can render in-result related-article cards.
  const manifest = allArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    relatedTests: a.relatedTests ?? [],
    publishedAt: a.publishedAt,
  }));
  const manifestPath = join(__dirname, '..', 'dist', 'articles.json');
  writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');

  console.log(`Generated ${allArticles.length} articles + hub + manifest`);
}

const scriptPath = process.argv[1];
const isMain = scriptPath && import.meta.url.endsWith(scriptPath.split('/').pop()!);
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
