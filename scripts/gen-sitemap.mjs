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

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const xml = buildSitemap({ origin: ORIGIN, routes: ROUTES, lastmod: today() });
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote ${outPath} (${ROUTES.length} routes)`);
}
