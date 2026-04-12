import { dimensionOrder, dimensionMeta, DIM_EXPLANATIONS } from '../data/dimensions';

interface DimListProps {
  levels: Record<string, string>;
  rawScores: Record<string, number>;
}

const levelWidth: Record<string, string> = {
  L: '33%',
  M: '66%',
  H: '100%',
};

const levelColor: Record<string, string> = {
  L: '#ff3b3b',
  M: '#ffaa00',
  H: '#44ff88',
};

export default function DimList({ levels, rawScores }: DimListProps) {
  return (
    <div>
      {dimensionOrder.map((dim, i) => {
        const level = levels[dim] ?? 'M';
        const meta = dimensionMeta[dim];
        // Strip prefix like "S1 " to get short name
        const shortName = meta.name.replace(/^[A-Za-z]+\d*\s*/, '');
        const color = levelColor[level];
        const width = levelWidth[level];
        const explanation = DIM_EXPLANATIONS[dim]?.[level as keyof typeof DIM_EXPLANATIONS[typeof dim]];

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
