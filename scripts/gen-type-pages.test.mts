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
  assert.match(html, /<link rel="canonical" href="https:\/\/test\.jiligulu\.xyz\/types\/gsti\/M_GOLD" \/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/test\.jiligulu\.xyz\/images\/og-gsti\.png" \/>/);
  assert.match(html, /<h1[^>]*>挖金壮男<\/h1>/);
  assert.match(html, /The Gold Digger \(male\)/);
  assert.match(html, /兄弟，你不是找对象/);
  assert.match(html, /href="\/gsti"/);           // CTA link to test
  assert.match(html, /href="\/types\/gsti\/M_GTEA"/);  // related type link
  assert.match(html, /href="\/types\/gsti\/M_WHIT"/);
  assert.match(html, /人格实验室/);
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

test('renderTypePageHTML handles special-char type codes', () => {
  const data: TypePageData = {
    origin: 'https://test.jiligulu.xyz',
    testId: 'fpi', testName: 'FPI', testPath: '/fpi',
    code: '9PIC!', cn: '九宫格暴君', intro: 'x', desc: 'x',
    relatedTypes: [],
  };
  const html = renderTypePageHTML(data);
  assert.match(html, /<link rel="canonical" href="[^"]*\/types\/fpi\/9PIC!" \/>/);
});
