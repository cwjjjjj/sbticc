interface ProgressBarProps {
  current: number;
  total: number;
}

const SEGMENT_LABELS = ['基础画像', '深水区', '最后审判'] as const;

function currentSegmentIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  const ratio = Math.min(current / total, 1);
  if (ratio < 1 / 3) return 0;
  if (ratio < 2 / 3) return 1;
  return 2;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const segIdx = currentSegmentIndex(current, total);

  return (
    <div>
      <div className="relative h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #ff3b3b, #ffaa00)',
          }}
        />
        {/* Segment dividers at 1/3 and 2/3 */}
        <div className="absolute top-0 bottom-0 w-px bg-bg/80" style={{ left: '33.33%' }} />
        <div className="absolute top-0 bottom-0 w-px bg-bg/80" style={{ left: '66.66%' }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <div className="flex gap-4 font-mono text-[10px] uppercase tracking-wider">
          {SEGMENT_LABELS.map((label, i) => (
            <span
              key={label}
              className={
                i === segIdx
                  ? 'text-accent font-bold'
                  : i < segIdx
                    ? 'text-muted/80'
                    : 'text-muted/30'
              }
            >
              {label}
            </span>
          ))}
        </div>
        <p className="font-mono text-xs text-muted">
          {current} / {total}
        </p>
      </div>
    </div>
  );
}
