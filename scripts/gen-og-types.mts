// Per-type OG image generator. Uses Satori (JSX→SVG) + @resvg/resvg-js (SVG→PNG).
// Generates public/images/og-types/<testId>/<CODE>.png for every type in every test.
// Conditional: only generates if target file missing (so build is cheap after first run).

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = join(__dirname, '..', 'public', 'images', 'og-types');

// Font path: reuse the Noto Sans SC TTF downloaded by gen-og-images.mjs
const FONT_PATHS = [
  join(__dirname, 'fonts', 'NotoSansSC-Bold.ttf'),
  '/System/Library/Fonts/PingFang.ttc', // fallback (may fail on Satori)
];
let fontData: Buffer | null = null;
for (const p of FONT_PATHS) {
  if (existsSync(p)) {
    try { fontData = readFileSync(p); break; } catch {}
  }
}
if (!fontData) {
  console.error('ERROR: No usable font. Run `node scripts/gen-og-images.mjs` first to fetch Noto Sans SC.');
  process.exit(1);
}

interface TypeDef { code: string; cn: string; intro: string; desc: string }

interface TestSpec {
  id: string;
  name: string;
  typesModule: string;
  bg: string;
  accent: string;
}

const TESTS: TestSpec[] = [
  { id: 'sbti',   name: 'SBTI 人格测试',     typesModule: '../src/data/types.ts',        bg: '#1a0f1f', accent: '#ff3b3b' },
  { id: 'love',   name: '恋爱脑浓度检测',     typesModule: '../src/data/love/types.ts',   bg: '#1f1015', accent: '#ff3b82' },
  { id: 'work',   name: '打工人鉴定',         typesModule: '../src/data/work/types.ts',   bg: '#0f1420', accent: '#3b82ff' },
  { id: 'values', name: '活法检测报告',       typesModule: '../src/data/values/types.ts', bg: '#0f1a10', accent: '#3bff82' },
  { id: 'cyber',  name: '赛博基因检测',       typesModule: '../src/data/cyber/types.ts',  bg: '#0f1a1f', accent: '#3bffff' },
  { id: 'desire', name: '欲望图谱',           typesModule: '../src/data/desire/types.ts', bg: '#1a0f1f', accent: '#a855f7' },
  { id: 'gsti',   name: 'GSTI 性转人格测试',   typesModule: '../src/data/gsti/types.ts',   bg: '#1a0f1f', accent: '#c084fc' },
  { id: 'fpi',    name: '朋友圈人设诊断',     typesModule: '../src/data/fpi/types.ts',    bg: '#0f1a1f', accent: '#22d3ee' },
  { id: 'fsi',    name: '原生家庭幸存者',     typesModule: '../src/data/fsi/types.ts',    bg: '#1f1510', accent: '#fb923c' },
  { id: 'mpi',    name: '消费人格图鉴',       typesModule: '../src/data/mpi/types.ts',    bg: '#1f1810', accent: '#facc15' },
];

// Sanitize code for filesystem — same rules as typeImages
function safeFilename(code: string): string {
  return code
    .replace(/!/g, 'X')
    .replace(/\?/g, 'Q')
    .replace(/\$/g, 'S')
    .replace(/\+/g, 'P');
}

function jsxFor(test: TestSpec, code: string, cn: string, intro: string) {
  return {
    type: 'div',
    props: {
      style: {
        width: 1200, height: 630,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 80, background: test.bg, color: '#fff', fontFamily: 'NotoSans SC',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'baseline', gap: 16 },
            children: [
              { type: 'span', props: { style: { fontSize: 22, color: '#888', letterSpacing: 2 }, children: 'test.jiligulu.xyz' } },
              { type: 'span', props: { style: { fontSize: 20, color: test.accent, fontWeight: 700 }, children: '·' } },
              { type: 'span', props: { style: { fontSize: 20, color: test.accent, fontWeight: 600 }, children: test.name } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 8 },
            children: [
              { type: 'div', props: { style: { fontSize: 28, color: test.accent, fontFamily: 'NotoSans SC', letterSpacing: 4 }, children: code } },
              { type: 'div', props: { style: { fontSize: 128, fontWeight: 900, lineHeight: 1.0, marginTop: 12 }, children: cn } },
              { type: 'div', props: { style: { fontSize: 28, color: '#aaa', marginTop: 20, fontStyle: 'italic' }, children: intro } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#888' },
            children: [
              { type: 'span', props: { children: '人格实验室' } },
              { type: 'span', props: { children: '点击查看详细描述 →' } },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  let generated = 0;
  let skipped = 0;

  for (const spec of TESTS) {
    const testDir = join(OUT_ROOT, spec.id);
    mkdirSync(testDir, { recursive: true });

    let mod;
    try { mod = await import(spec.typesModule); } catch (e) {
      console.warn(`WARN: failed to import ${spec.typesModule}: ${(e as Error).message}`);
      continue;
    }
    const lib: Record<string, TypeDef> = mod.TYPE_LIBRARY;
    if (!lib) continue;

    for (const [code, tdef] of Object.entries(lib)) {
      const outPath = join(testDir, `${safeFilename(code)}.png`);
      if (existsSync(outPath)) { skipped++; continue; }

      const svg = await satori(jsxFor(spec, code, tdef.cn, tdef.intro), {
        width: 1200, height: 630,
        fonts: [{ name: 'NotoSans SC', data: fontData, weight: 700, style: 'normal' }],
      });
      const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
      writeFileSync(outPath, png);
      generated++;
      if (generated % 20 === 0) console.log(`  generated ${generated}...`);
    }
  }

  console.log(`Done: ${generated} generated, ${skipped} already existed`);
}

main().catch((e) => { console.error(e); process.exit(1); });
