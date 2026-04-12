import { useRef, useEffect } from 'react';

interface RadarChartProps {
  labelsArr: string[];
  dataA: number[];
  dataB: number[];
}

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 50; // leave room for labels

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  angleOffset: number,
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = angleOffset + (2 * Math.PI * i) / sides;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawDataPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxRadius: number,
  data: number[],
  angleOffset: number,
  strokeColor: string,
  fillColor: string,
) {
  const n = data.length;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = angleOffset + (2 * Math.PI * i) / n;
    const ratio = data[i] / 3; // values are 1-3
    const r = maxRadius * ratio;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

export default function RadarChart({ labelsArr, dataA, dataB }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, SIZE, SIZE);

    const n = labelsArr.length;
    const angleOffset = -Math.PI / 2; // start from top

    // Draw 3 concentric grid rings (1, 0.66, 0.33)
    const scales = [1, 0.66, 0.33];
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (const scale of scales) {
      drawPolygon(ctx, CENTER, CENTER, RADIUS * scale, n, angleOffset);
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const angle = angleOffset + (2 * Math.PI * i) / n;
      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.lineTo(CENTER + RADIUS * Math.cos(angle), CENTER + RADIUS * Math.sin(angle));
      ctx.stroke();
    }

    // Draw data polygons
    drawDataPolygon(
      ctx, CENTER, CENTER, RADIUS, dataA, angleOffset,
      '#ff3b3b', 'rgba(255, 59, 59, 0.3)',
    );
    drawDataPolygon(
      ctx, CENTER, CENTER, RADIUS, dataB, angleOffset,
      '#4488ff', 'rgba(68, 136, 255, 0.3)',
    );

    // Draw labels
    ctx.font = '11px "Noto Sans SC", sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const labelRadius = RADIUS + 22;
    for (let i = 0; i < n; i++) {
      const angle = angleOffset + (2 * Math.PI * i) / n;
      const x = CENTER + labelRadius * Math.cos(angle);
      const y = CENTER + labelRadius * Math.sin(angle);
      ctx.fillText(labelsArr[i], x, y);
    }
  }, [labelsArr, dataA, dataB]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}
    />
  );
}
