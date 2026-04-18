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
