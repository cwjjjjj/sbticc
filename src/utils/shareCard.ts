import { PROD_BASE_URL } from '../theme/tokens';
import type { TestConfig, TypeDef } from '../data/testConfig';
import type { ComputeResultOutput } from './matching';

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

  // -- Dimension tags
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

  // -- Separator
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
  y += 30;

  // -- Watermark (only if not paid)
  if (!isPaid) {
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#444';
    ctx.fillText(PROD_BASE_URL.replace('https://', '') + config.basePath, pad, y);
    y += 30;
  }

  // -- QR + CTA footer
  const qrSize = 120;
  if (qrImg) {
    // White background for QR
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, W - pad - qrSize - 10, y - 5, qrSize + 20, qrSize + 20, 8);
    ctx.fill();
    ctx.drawImage(qrImg, W - pad - qrSize, y + 5, qrSize, qrSize);
  }

  ctx.font = '16px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#666';
  ctx.fillText('\u626b\u7801\u6216\u70b9\u51fb\u94fe\u63a5', pad, y + 20);
  ctx.fillText('\u6d4b\u8bd5\u4f60\u7684\u4eba\u683c', pad, y + 44);
  y += qrSize + 40;

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
