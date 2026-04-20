import { writeFileSync, readFileSync, existsSync } from 'node:fs';
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
  '/xpti',
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Merge in type-routes.json if present (populated by gen-type-pages)
  let typeRoutes = [];
  const typeManifest = join(__dirname, 'type-routes.json');
  if (existsSync(typeManifest)) {
    try {
      const m = JSON.parse(readFileSync(typeManifest, 'utf8'));
      if (Array.isArray(m)) typeRoutes = m;
    } catch (e) {
      console.warn(`WARN: could not parse ${typeManifest}: ${e.message}`);
    }
  }

  // Merge in article-routes.json if present (populated by gen-articles)
  let articleRoutes = [];
  const articleManifest = join(__dirname, 'article-routes.json');
  if (existsSync(articleManifest)) {
    try {
      const m = JSON.parse(readFileSync(articleManifest, 'utf8'));
      if (Array.isArray(m)) articleRoutes = m;
    } catch (e) {
      console.warn(`WARN: could not parse ${articleManifest}: ${e.message}`);
    }
  }

  const allRoutes = [...new Set([...ROUTES, ...typeRoutes, ...articleRoutes])];
  const xml = buildSitemap({ origin: ORIGIN, routes: allRoutes, lastmod: today() });
  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote ${outPath} (${allRoutes.length} routes: ${ROUTES.length} base + ${typeRoutes.length} type + ${articleRoutes.length} article)`);
}
