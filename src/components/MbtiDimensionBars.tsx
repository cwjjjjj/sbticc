interface DimSpec {
  key: string;
  leftLetter: string;
  rightLetter: string;
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}

const DIM_SPECS: DimSpec[] = [
  { key: 'EI', leftLetter: 'I', rightLetter: 'E', leftLabel: '内向', rightLabel: '外向', leftColor: '#6366f1', rightColor: '#f59e0b' },
  { key: 'SN', leftLetter: 'N', rightLetter: 'S', leftLabel: '直觉', rightLabel: '实感', leftColor: '#8b5cf6', rightColor: '#10b981' },
  { key: 'TF', leftLetter: 'T', rightLetter: 'F', leftLabel: '思考', rightLabel: '情感', leftColor: '#3b82f6', rightColor: '#ec4899' },
  { key: 'JP', leftLetter: 'J', rightLetter: 'P', leftLabel: '判断', rightLabel: '感知', leftColor: '#ef4444', rightColor: '#14b8a6' },
  { key: 'AT', leftLetter: 'A', rightLetter: 'T', leftLabel: '自信', rightLabel: '动荡', leftColor: '#22c55e', rightColor: '#a855f7' },
];

interface MbtiDimensionBarsProps {
  pcts: Record<string, number>;        // each dim 0-100, 100=fully right letter, 0=fully left letter
  compare?: Record<string, number>;    // optional second set for ComparePage overlay
}

export default function MbtiDimensionBars({ pcts, compare }: MbtiDimensionBarsProps) {
  return (
    <div className="space-y-5">
      {DIM_SPECS.map((spec) => {
        const pct = pcts[spec.key] ?? 50;
        const isLeftSide = pct < 50;
        const displayPct = isLeftSide ? 100 - pct : pct;
        const dominantLetter = isLeftSide ? spec.leftLetter : spec.rightLetter;

        return (
          <div key={spec.key} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-lg">{spec.leftLetter}</span>
                <span className="text-xs text-muted">{spec.leftLabel}</span>
              </div>
              <span className="font-mono font-extrabold text-white text-lg">
                {dominantLetter} {displayPct}%
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{spec.rightLabel}</span>
                <span className="font-mono font-bold text-white text-lg">{spec.rightLetter}</span>
              </div>
            </div>
            <div className="relative h-3 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(to right, ${spec.leftColor}, ${spec.rightColor})`,
                }}
              />
              {compare !== undefined && (
                <div
                  className="absolute top-0 h-full w-0.5 bg-white"
                  style={{ left: `${compare[spec.key] ?? 50}%` }}
                  aria-label="compare marker"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
