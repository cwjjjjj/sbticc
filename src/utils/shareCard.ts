import { PROD_BASE_URL } from '../theme/tokens';
import type { Gender, TestConfig, TypeDef } from '../data/testConfig';
import type { ComputeResultOutput } from './matching';

/* ---------- types ---------- */

export interface ShareCardRarity {
  /** 0-100, lower = rarer (same convention as useRarity). */
  percentile: number;
  tier: 'legendary' | 'rare' | 'uncommon' | 'common';
}

/* ---------- helpers ---------- */

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Count how many wrapped lines `text` would take up given the font currently
 * set on ctx and the given maxWidth.
 */
export function estimateLineCount(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  _fontSize: number,
  _lineHeight: number,
): number {
  if (!text) return 0;
  const chars = text.split('');
  let lines = 0;
  let line = '';
  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      lines += 1;
      line = chars[i];
    } else {
      line = testLine;
    }
  }
  if (line) lines += 1;
  return lines;
}

/**
 * Word-wrap text on canvas, returning the Y position after the last line.
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  if (!text) return y;
  const chars = text.split('');
  let line = '';
  let currentY = y;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/* ---------- main draw ---------- */

export async function drawShareCard(
  type: TypeDef,
  result: ComputeResultOutput,
  qrUrl: string,
  mode: 'share' | 'invite',
  config: TestConfig,
  isPaid: boolean = false,
  rarity?: ShareCardRarity,
): Promise<HTMLCanvasElement> {
  const { dimensionOrder, dimensionMeta, shareImages } = config;
  const W = 840;
  const pad = 50;
  const contentW = W - pad * 2;

  // Pre-load poster image
  const posterSrc = shareImages[type.code] || '';
  const posterImg = posterSrc ? await loadImage(posterSrc) : null;

  // Pre-load QR
  const qrImg = await loadImage(qrUrl);

  // Create off-screen canvas — start tall, trim later
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = 2000;
  const ctx = canvas.getContext('2d')!;

  // -- Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, 2000);

  let y = pad;

  // -- Brand header
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#666';
  ctx.fillText(config.name, pad, y + 18);
  y += 50;

  // GSTI-only: make the swap direction visible on generated posters.
  if (config.genderLocked) {
    drawSwapBadge(ctx, pad, y, type.code, config);
    y += 68;
  }

  // -- Rarity banner (Phase B virality) — prominent "前 X% · 稀世/罕见/少见/普通"
  if (rarity && rarity.percentile < 100) {
    const tierCfg = {
      legendary: { cn: '稀世', color: '#ffd700' },
      rare:      { cn: '罕见', color: '#ff3b3b' },
      uncommon:  { cn: '少见', color: '#c0c0c0' },
      common:    { cn: '普通', color: '#888888' },
    }[rarity.tier];
    const pctStr = rarity.percentile < 1 ? '< 1' : rarity.percentile.toFixed(1);

    ctx.save();
    ctx.textAlign = 'center';

    // Big percentile number
    ctx.font = 'bold 72px "JetBrains Mono", monospace';
    ctx.fillStyle = tierCfg.color;
    ctx.shadowColor = tierCfg.color;
    ctx.shadowBlur = 16;
    ctx.fillText(`\u524d ${pctStr}%`, W / 2, y + 60);

    // Tier label
    ctx.shadowBlur = 0;
    ctx.font = 'bold 28px "Noto Sans SC", sans-serif';
    ctx.fillStyle = tierCfg.color;
    ctx.fillText(tierCfg.cn, W / 2, y + 100);

    ctx.restore();
    ctx.textAlign = 'left';
    y += 130;
  }

  // -- Poster image + type info
  const posterSize = 200;
  if (posterImg) {
    ctx.save();
    const radius = 16;
    ctx.beginPath();
    ctx.moveTo(pad + radius, y);
    ctx.lineTo(pad + posterSize - radius, y);
    ctx.quadraticCurveTo(pad + posterSize, y, pad + posterSize, y + radius);
    ctx.lineTo(pad + posterSize, y + posterSize - radius);
    ctx.quadraticCurveTo(pad + posterSize, y + posterSize, pad + posterSize - radius, y + posterSize);
    ctx.lineTo(pad + radius, y + posterSize);
    ctx.quadraticCurveTo(pad, y + posterSize, pad, y + posterSize - radius);
    ctx.lineTo(pad, y + radius);
    ctx.quadraticCurveTo(pad, y, pad + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(posterImg, pad, y, posterSize, posterSize);
    ctx.restore();
  } else {
    // Placeholder box
    ctx.fillStyle = '#1a1a1a';
    roundRect(ctx, pad, y, posterSize, posterSize, 16);
    ctx.fill();
    ctx.font = 'bold 64px "JetBrains Mono", monospace';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(type.code.substring(0, 4), pad + posterSize / 2, y + posterSize / 2 + 20);
    ctx.textAlign = 'left';
  }

  const infoX = pad + posterSize + 30;

  // Type code
  ctx.font = 'bold 48px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(type.code, infoX, y + 55);

  // CN name
  ctx.font = '20px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#999';
  ctx.fillText(type.cn, infoX, y + 90);

  // Match badge
  const similarity = 'similarity' in result.finalType
    ? (result.finalType as { similarity: number }).similarity
    : 0;
  const badgeText = `\u5339\u914d\u5ea6 ${similarity}%`;
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  const badgeW = ctx.measureText(badgeText).width + 24;
  ctx.fillStyle = 'rgba(255, 59, 130, 0.2)';
  roundRect(ctx, infoX, y + 108, badgeW, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#ff3b82';
  ctx.fillText(badgeText, infoX + 12, y + 130);

  y += posterSize + 30;

  // -- Intro text
  ctx.font = 'italic 18px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#ffaa00';
  if (mode === 'invite') {
    const inviteText = `\u6211\u662f${type.cn}\uff0c\u4f60\u662f\u4ec0\u4e48\uff1f\u6765\u6d4b\u6d4b\u770b\uff01`;
    y = wrapText(ctx, inviteText, pad, y, contentW, 28);
  } else {
    y = wrapText(ctx, type.intro, pad, y, contentW, 28);
  }
  y += 10;

  // -- Dimension tags / MBTI bars
  if (config.id === 'mbti') {
    const barsH = 200;
    drawMbtiBars(ctx, result, pad, y, contentW, barsH);
    y += barsH + 10;
  } else {
    const tagH = 30;
    const tagGap = 8;
    let tagX = pad;
    let tagY = y;

    ctx.font = '13px "Noto Sans SC", sans-serif';
    for (const dimKey of dimensionOrder) {
      const level = result.levels[dimKey] || 'M';
      const dimInfo = dimensionMeta[dimKey];
      const shortName = dimInfo ? dimInfo.name.replace(/^[A-Za-z]+\d*\s*/, '') : dimKey;
      const label = `${shortName} ${level}`;
      const tw = ctx.measureText(label).width + 16;

      if (tagX + tw > W - pad) {
        tagX = pad;
        tagY += tagH + tagGap;
      }

      ctx.fillStyle = '#1a1a1a';
      roundRect(ctx, tagX, tagY, tw, tagH, 6);
      ctx.fill();

      ctx.fillStyle = '#888';
      ctx.fillText(label, tagX + 8, tagY + 20);
      tagX += tw + tagGap;
    }
    y = tagY + tagH + 30;
  }

  // -- Character desc (first paragraph only) + soulmate compat card
  // Only shown on 'share' mode (not 'invite' — invite cards stay compact).
  // Skipped for MBTI since MBTI has its own html2canvas pipeline.
  if (mode === 'share' && config.id !== 'mbti') {
    // Desc first paragraph
    const descFull = type.desc || '';
    const firstPara = descFull.split(/\n\n+/)[0]?.trim();
    if (firstPara) {
      y += 10;
      ctx.font = 'bold 18px "Noto Sans SC", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('\u89d2\u8272\u63cf\u8ff0', pad, y + 18);
      y += 34;

      ctx.font = '16px "Noto Sans SC", sans-serif';
      ctx.fillStyle = '#ccc';
      y = wrapText(ctx, firstPara, pad, y, contentW, 26);
      y += 10;
    }

    // Soulmate compat card
    const soulmateKey = Object.keys(config.compatibility).find((k) => {
      if (config.compatibility[k].type !== 'soulmate') return false;
      const [a, b] = k.split('+');
      return a === type.code || b === type.code;
    });
    if (soulmateKey) {
      const [a, b] = soulmateKey.split('+');
      const partnerCode = a === type.code ? b : a;
      const partnerType = config.typeLibrary[partnerCode];
      const say = config.compatibility[soulmateKey].say;

      const cardPad = 16;
      const badgeH = 26;
      const pairLineH = 26;
      const sayLineH = 24;
      const sayLines = estimateLineCount(ctx, say, contentW - cardPad * 2, 14, sayLineH);
      const cardH = cardPad * 2 + badgeH + 8 + pairLineH + 6 + sayLines * sayLineH;

      ctx.fillStyle = 'rgba(255, 59, 130, 0.08)';
      roundRect(ctx, pad, y, contentW, cardH, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 107, 157, 0.25)';
      ctx.lineWidth = 1;
      roundRect(ctx, pad, y, contentW, cardH, 12);
      ctx.stroke();

      let cy = y + cardPad;

      // Badge
      ctx.font = 'bold 13px "Noto Sans SC", sans-serif';
      const badgeText = '\ud83d\udc95 \u5929\u751f\u4e00\u5bf9';
      const badgeW = ctx.measureText(badgeText).width + 20;
      ctx.fillStyle = 'rgba(255, 59, 59, 0.15)';
      roundRect(ctx, pad + cardPad, cy, badgeW, badgeH, 6);
      ctx.fill();
      ctx.fillStyle = '#ff6b9d';
      ctx.fillText(badgeText, pad + cardPad + 10, cy + 18);
      cy += badgeH + 8;

      // Pair
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fff';
      const pairText = `${type.code} \u00d7 ${partnerCode}`;
      ctx.fillText(pairText, pad + cardPad, cy + 18);
      if (partnerType?.cn) {
        ctx.font = '13px "Noto Sans SC", sans-serif';
        ctx.fillStyle = '#999';
        const pairW = ctx.measureText(pairText).width;
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.font = '13px "Noto Sans SC", sans-serif';
        ctx.fillText(` \u00b7 ${partnerType.cn}`, pad + cardPad + pairW + 4, cy + 18);
      }
      cy += pairLineH + 6;

      // Say
      ctx.font = '14px "Noto Sans SC", sans-serif';
      ctx.fillStyle = '#bbb';
      wrapText(ctx, say, pad + cardPad, cy, contentW - cardPad * 2, sayLineH);

      y += cardH + 20;
    }
  }

  // -- Separator
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
  y += 30;

  // -- QR + CTA footer
  const qrSize = 140;
  const qrPadding = 12;
  const qrBlockW = qrSize + qrPadding * 2;
  const qrBlockH = qrSize + qrPadding * 2;
  const qrBlockX = W - pad - qrBlockW;
  const ctaTextX = pad;

  // Test name
  ctx.font = 'bold 22px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#ffaa00';
  ctx.fillText(config.name, ctaTextX, y + 24);

  // Call-to-action
  ctx.font = '18px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#ccc';
  ctx.fillText('扫码测测你是什么人格 →', ctaTextX, y + 58);

  // URL (prominent)
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ff3b82';
  ctx.fillText('test.jiligulu.xyz', ctaTextX, y + 90);

  // Watermark path (only if not paid)
  if (!isPaid) {
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#444';
    ctx.fillText(PROD_BASE_URL.replace('https://', '') + config.basePath, ctaTextX, y + 115);
  }

  // QR code
  if (qrImg) {
    // White background for QR readability
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, qrBlockX, y, qrBlockW, qrBlockH, 10);
    ctx.fill();
    ctx.drawImage(qrImg, qrBlockX + qrPadding, y + qrPadding, qrSize, qrSize);

    // URL label below QR
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('扫码参加测试', qrBlockX + qrBlockW / 2, y + qrBlockH + 20);
    ctx.textAlign = 'left';
  }

  y += Math.max(qrBlockH + 30, 130) + 20;

  // -- Trim canvas to actual height
  const finalH = y + pad;
  const trimmed = document.createElement('canvas');
  trimmed.width = W;
  trimmed.height = finalH;
  const tCtx = trimmed.getContext('2d')!;
  tCtx.drawImage(canvas, 0, 0);

  return trimmed;
}

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

/* ---------- internal ---------- */

function drawMbtiBars(
  ctx: CanvasRenderingContext2D,
  result: ComputeResultOutput,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const maxAbs: Record<string, number> = { EI: 45, SN: 45, TF: 45, JP: 45, AT: 36 };
  const dims = [
    { key: 'EI', left: 'I', right: 'E' },
    { key: 'SN', left: 'N', right: 'S' },
    { key: 'TF', left: 'T', right: 'F' },
    { key: 'JP', left: 'J', right: 'P' },
    { key: 'AT', left: 'A', right: 'T' },
  ];
  const rowH = h / dims.length;
  dims.forEach((d, i) => {
    const score = result.rawScores[d.key] ?? 0;
    const max = maxAbs[d.key];
    const pct = Math.max(0, Math.min(100, Math.round(50 + (score / max) * 50)));
    const rowY = y + i * rowH + rowH / 2;
    // Left letter
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(d.left, x, rowY + 6);
    // Bar background
    const barX = x + 30;
    const barW = w - 80;
    const barY = rowY - 5;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, 10);
    // Fill
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(barX, barY, (barW * pct) / 100, 10);
    // Right letter
    ctx.fillStyle = '#fff';
    ctx.fillText(d.right, barX + barW + 10, rowY + 6);
    // Pct text
    ctx.fillStyle = '#999';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${pct}%`, barX + barW + 30, rowY + 6);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSwapBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  typeCode: string,
  config: TestConfig,
) {
  const gender = readStoredGender(config);
  const genderLabel: Record<Gender, string> = {
    male: '男',
    female: '女',
    unspecified: '?',
  };
  const poolLabel = typeCode.startsWith('M_')
    ? '女性物种'
    : typeCode.startsWith('F_')
      ? '男性物种'
      : '无池';

  ctx.save();
  ctx.fillStyle = 'rgba(220, 38, 38, 0.16)';
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.72)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, 330, 52, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GSTI · SWAP', x + 18, y + 26);

  ctx.font = '16px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText(`${genderLabel[gender]} → ${poolLabel}`, x + 170, y + 26);
  ctx.restore();
}

function readStoredGender(config: TestConfig): Gender {
  if (typeof window === 'undefined') return 'unspecified';
  try {
    const stored = window.localStorage.getItem(`${config.id}_gender`);
    if (stored === 'male' || stored === 'female' || stored === 'unspecified') {
      return stored;
    }
  } catch {
    // Ignore storage failures and fall back to the neutral label.
  }
  return 'unspecified';
}
