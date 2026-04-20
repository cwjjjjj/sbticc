#!/usr/bin/env node
/**
 * Convert all type images from PNG to WebP in place.
 *
 * Scans src/data/{love,work,values,cyber,desire,gsti,fpi,fsi,mpi}/images/*.png,
 * writes <code>.webp alongside (quality 85), then deletes the original PNG.
 * Prints a size summary so you can tell the commit was worth it.
 *
 * Idempotent: re-running skips files whose .webp already exists (and doesn't
 * re-delete the PNG if it's already gone).
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO = resolve(new URL('..', import.meta.url).pathname);

const TESTS = ['love', 'work', 'values', 'cyber', 'desire', 'gsti', 'fpi', 'fsi', 'mpi', 'xpti'];

async function convertOne(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  if (existsSync(webpPath)) {
    // Already converted; just remove the leftover PNG if it still exists.
    if (existsSync(pngPath)) unlinkSync(pngPath);
    return { skipped: true, pngPath, webpPath };
  }
  const pngBytes = statSync(pngPath).size;
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath);
  const webpBytes = statSync(webpPath).size;
  unlinkSync(pngPath);
  return { skipped: false, pngPath, webpPath, pngBytes, webpBytes };
}

async function main() {
  let totalPng = 0;
  let totalWebp = 0;
  let converted = 0;
  let skipped = 0;

  for (const test of TESTS) {
    const dir = join(REPO, 'src/data', test, 'images');
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png'));
    for (const f of files) {
      const res = await convertOne(join(dir, f));
      if (res.skipped) { skipped++; continue; }
      totalPng += res.pngBytes;
      totalWebp += res.webpBytes;
      converted++;
      if (converted % 20 === 0) {
        process.stdout.write(`  converted ${converted}...\n`);
      }
    }
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  console.log(`\nDone: ${converted} converted, ${skipped} already-webp.`);
  if (converted > 0) {
    const saved = totalPng - totalWebp;
    const pct = ((saved / totalPng) * 100).toFixed(1);
    console.log(`PNG total:  ${mb(totalPng)} MB`);
    console.log(`WebP total: ${mb(totalWebp)} MB`);
    console.log(`Saved:      ${mb(saved)} MB (${pct}%)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
