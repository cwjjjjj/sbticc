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
