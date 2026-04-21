import { useTestConfig } from '../data/testConfig';

interface DimListProps {
  levels: Record<string, string>;
  rawScores: Record<string, number>;
}

const levelWidth: Record<string, string> = {
  L: '33%',
  M: '66%',
  H: '100%',
  A: '33%',
  B: '100%',
  // MBTI dimensions (simplified mapping to show full bar for the dominant side)
  E: '100%', I: '100%',
  S: '100%', N: '100%',
  T: '100%', F: '100%',
  J: '100%', P: '100%',
};

const levelColor: Record<string, string> = {
  L: '#ff3b3b',
  M: '#ffaa00',
  H: '#44ff88',
  A: '#ff3b3b',
  B: '#44ff88',
  // MBTI colors (using a consistent theme color)
  E: '#a855f7', I: '#a855f7',
  S: '#a855f7', N: '#a855f7',
  T: '#a855f7', F: '#a855f7',
  J: '#a855f7', P: '#a855f7',
};

export default function DimList({ levels, rawScores }: DimListProps) {
  const config = useTestConfig();
  const { dimensionOrder, dimensionMeta, dimExplanations } = config;

  return (
    <div>
      {dimensionOrder.map((dim, i) => {
        const level = levels[dim] ?? 'M';
        const meta = dimensionMeta[dim];
        // Strip prefix like "S1 " to get short name
        const shortName = meta.name.replace(/^[A-Za-z]+\d*\s*/, '');
        const color = levelColor[level];
        const width = levelWidth[level];
        const explanation = dimExplanations[dim]?.[level];

        return (
          <div
            key={dim}
            className={`flex items-center gap-4 py-3 ${
              i < dimensionOrder.length - 1 ? 'border-b border-[#1a1a1a]' : ''
            }`}
            title={explanation}
          >
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
        );
      })}
    </div>
  );
}
