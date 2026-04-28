import { useMemo } from 'react';
import { useTestConfig } from '../data/testConfig';

interface DimListProps {
  levels: Record<string, string>;
  rawScores: Record<string, number>;
  showExplanations?: boolean;
}

const levelWidth: Record<string, string> = {
  L: '33%',
  M: '66%',
  H: '100%',
  A: '33%',
  B: '100%',
  E: '100%',
  I: '100%',
  S: '100%',
  N: '100%',
  T: '100%',
  F: '100%',
  J: '100%',
  P: '100%',
};

const levelColor: Record<string, string> = {
  L: '#ff3b3b',
  M: '#ffaa00',
  H: '#44ff88',
  A: '#ff3b3b',
  B: '#44ff88',
  E: '#a855f7',
  I: '#a855f7',
  S: '#a855f7',
  N: '#a855f7',
  T: '#a855f7',
  F: '#a855f7',
  J: '#a855f7',
  P: '#a855f7',
};

const MBTI_LEVELS = new Set(['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']);

export default function DimList({
  levels,
  rawScores,
  showExplanations = false,
}: DimListProps) {
  const config = useTestConfig();
  const { dimensionOrder, dimensionMeta, dimExplanations, questions } = config;

  const maxAbsByDim = useMemo(() => {
    const out: Record<string, number> = {};
    dimensionOrder.forEach((dim) => {
      out[dim] = 0;
    });

    questions.forEach((q) => {
      if (q.dim) {
        const maxOptionScore = q.options.reduce((max, option) => {
          const score = typeof option.score === 'number' ? option.score : option.value;
          return Math.max(max, Math.abs(score));
        }, 0);
        out[q.dim] = (out[q.dim] ?? 0) + maxOptionScore;
        return;
      }

      const optionMaxByDim: Record<string, number> = {};
      q.options.forEach((option) => {
        if (!option.dim) return;
        const score = typeof option.score === 'number' ? option.score : option.value;
        optionMaxByDim[option.dim] = Math.max(
          optionMaxByDim[option.dim] ?? 0,
          Math.abs(score),
        );
      });

      Object.entries(optionMaxByDim).forEach(([dim, max]) => {
        out[dim] = (out[dim] ?? 0) + max;
      });
    });

    dimensionOrder.forEach((dim) => {
      out[dim] = Math.max(1, out[dim] ?? 1);
    });

    return out;
  }, [dimensionOrder, questions]);

  return (
    <div>
      {dimensionOrder.map((dim, i) => {
        const level = levels[dim] ?? 'M';
        const meta = dimensionMeta[dim];
        const shortName = meta.name.replace(/^[A-Za-z]+\d*\s*/, '');
        const color = levelColor[level] ?? '#a855f7';
        const explanation = dimExplanations[dim]?.[level];
        const isBipolar = dim.length === 2 && MBTI_LEVELS.has(level);
        const rawScore = rawScores[dim] ?? 0;
        const [leftLabel, rightLabel] = dim.split('');
        const isLeft = level === leftLabel;
        const strength = Math.min(50, Math.round((Math.abs(rawScore) / maxAbsByDim[dim]) * 50));
        const width = levelWidth[level] ?? '66%';

        return (
          <div
            key={dim}
            className={`py-3 ${
              i < dimensionOrder.length - 1 ? 'border-b border-[#1a1a1a]' : ''
            }`}
            title={explanation}
          >
            {isBipolar ? (
              <div className="grid grid-cols-[88px_1fr_88px] sm:grid-cols-[100px_1fr_100px] items-center gap-3">
                <div>
                  <span className="block text-xs text-[#888]">{shortName}</span>
                  <span className="block font-mono text-[10px] text-[#555] mt-0.5">
                    {leftLabel}
                  </span>
                </div>
                <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#333]" />
                  <div
                    className="absolute top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      left: isLeft ? `${50 - strength}%` : '50%',
                      width: `${strength}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <div className="text-right">
                  <span className="block font-mono text-xs font-bold" style={{ color }}>
                    {level}
                  </span>
                  <span className="block font-mono text-[10px] text-[#555] mt-0.5">
                    {rightLabel}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#888] w-[100px] flex-shrink-0">
                  {shortName}
                </span>
                <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span
                  className="font-mono text-xs font-bold w-6 text-center"
                  style={{ color }}
                >
                  {level}
                </span>
              </div>
            )}
            {showExplanations && explanation && (
              <p className="mt-2 pl-[116px] text-xs leading-relaxed text-[#aaa]">
                {explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
