/**
 * Generate Open Graph preview images (1200x630) for each personality test.
 *
 * Usage:  node scripts/generate-og-images.js
 * Requires: npm install canvas --save-dev
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const TESTS = [
  { key: 'sbti',   emoji: '🧠', name: 'SBTI 人格测试',    tagline: '15维度深度人格扫描' },
  { key: 'love',   emoji: '💘', name: '恋爱脑浓度检测',    tagline: '你谈恋爱是什么德性' },
  { key: 'work',   emoji: '💼', name: '打工人鉴定',        tagline: '你是哪种打工人' },
  { key: 'values', emoji: '🌏', name: '活法检测报告',      tagline: '你到底在活什么' },
  { key: 'cyber',  emoji: '📱', name: '赛博基因检测',      tagline: '你是什么品种的网民' },
  { key: 'desire', emoji: '🔥', name: '欲望图谱',          tagline: '关上门之后你是谁' },
];

const WIDTH = 1200;
const HEIGHT = 630;
const OUT_DIR = path.join(__dirname, '..', 'images');

function generate(test) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // --- Dark background ---
  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // --- Subtle radial red glow in center ---
  const glow = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2 - 30, 0, WIDTH / 2, HEIGHT / 2 - 30, 420);
  glow.addColorStop(0, 'rgba(255, 59, 59, 0.18)');
  glow.addColorStop(0.5, 'rgba(255, 59, 59, 0.06)');
  glow.addColorStop(1, 'rgba(255, 59, 59, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // --- Decorative thin top/bottom border accent ---
  ctx.fillStyle = 'rgba(255, 59, 59, 0.5)';
  ctx.fillRect(0, 0, WIDTH, 2);
  ctx.fillRect(0, HEIGHT - 2, WIDTH, 2);

  // --- Emoji ---
  // node-canvas emoji rendering is limited; draw as text, may render as tofu
  // We fall back to a large circle with the emoji character
  const emojiY = 195;
  ctx.font = '100px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(test.emoji, WIDTH / 2, emojiY);

  // --- Test name ---
  ctx.font = 'bold 64px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(test.name, WIDTH / 2, 330);

  // --- Tagline ---
  ctx.font = '32px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillText(test.tagline, WIDTH / 2, 400);

  // --- Divider line ---
  ctx.strokeStyle = 'rgba(255, 59, 59, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 120, 460);
  ctx.lineTo(WIDTH / 2 + 120, 460);
  ctx.stroke();

  // --- Domain at bottom ---
  ctx.font = '26px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", monospace';
  ctx.fillStyle = '#ff3b3b';
  ctx.fillText('test.jiligulu.xyz', WIDTH / 2, 530);

  // --- Write PNG ---
  const outPath = path.join(OUT_DIR, `og-${test.key}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  console.log(`  created: ${outPath}  (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('Generating OG images...\n');
for (const test of TESTS) {
  generate(test);
}
console.log('\nDone.');
