interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div>
      <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #ff3b3b, #ffaa00)',
          }}
        />
      </div>
      <p className="text-right font-mono text-xs text-muted mt-1.5">
        {current} / {total}
      </p>
    </div>
  );
}
