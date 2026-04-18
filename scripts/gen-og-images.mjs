import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images');
const FONT_DIR = join(__dirname, 'fonts');
const FONT_PATH = join(FONT_DIR, 'NotoSansSC-Bold.ttf');
// Google Fonts static TTF — Satori doesn't accept TTC (PingFang/STHeiti on macOS).
const FONT_URL = 'https://fonts.gstatic.com/s/notosanssc/v40/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaGzjCnYw.ttf';

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
if (!existsSync(FONT_DIR)) mkdirSync(FONT_DIR, { recursive: true });

async function ensureFont() {
  if (existsSync(FONT_PATH)) return readFileSync(FONT_PATH);
  console.log(`Fetching font from ${FONT_URL}`);
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`Font download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(FONT_PATH, buf);
  console.log(`Saved font to ${FONT_PATH} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
  return buf;
}

const fontData = await ensureFont();
console.log(`Using font: ${FONT_PATH}`);

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
              // Emoji intentionally omitted — Satori doesn't render emoji without loadAdditionalAsset.
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
