import { useState } from 'react';
import { useTestConfig } from '../data/testConfig';
import type { RankingData } from '../hooks/useRanking';

interface ProfilesGalleryProps {
  rankingData: RankingData | null;
}

function rarityBadgeStyle(stars: number): { bg: string; text: string } {
  switch (stars) {
    case 1:
    case 2:
      return { bg: 'rgba(102,102,102,0.2)', text: '#888888' };
    case 3:
      return { bg: 'rgba(68,136,255,0.15)', text: '#6699ff' };
    case 4:
      return { bg: 'rgba(170,68,255,0.15)', text: '#bb77ff' };
    case 5:
      return { bg: 'rgba(255,136,0,0.15)', text: '#ff8844' };
    default:
      return { bg: 'rgba(102,102,102,0.2)', text: '#888888' };
  }
}

function rarityIcon(code: string, stars: number, hiddenTypeCode: string): string {
  if (code === 'DRUNK') return '\ud83c\udf7a';
  if (code === hiddenTypeCode) return '?';
  if (stars === 5) return '\ud83d\udc8e';
  return '\u2605'.repeat(stars);
}

export default function ProfilesGallery({ rankingData }: ProfilesGalleryProps) {
  const config = useTestConfig();
  const [useRealData, setUseRealData] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const allTypes = Object.keys(config.typeLibrary);

  const toggleExpand = (code: string) => {
    setExpandedCards((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Compute real rarity percentages from ranking data
  const realRarity: Record<string, number> = {};
  if (rankingData && rankingData.total > 0) {
    for (const item of rankingData.list) {
      realRarity[item.code] = parseFloat(((item.count / rankingData.total) * 100).toFixed(2));
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* Header + toggle */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
            {'\u4eba\u683c\u56fe\u9274'}
          </h2>
          <p className="text-sm text-muted mt-1">
            {`全部 ${allTypes.length} 种人格类型`}
          </p>
        </div>

        {/* Rarity toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="text-sm text-muted">
            {'\u7406\u8bba\u7a00\u6709\u5ea6'}
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={useRealData}
              onChange={(e) => setUseRealData(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#333] rounded-full peer-checked:bg-accent transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
          </div>
          <span className="text-xs text-muted">
            {'\u5207\u6362\u5230\u771f\u5b9e\u6570\u636e'}
          </span>
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTypes.map((code) => {
          const typeDef = config.typeLibrary[code];
          const rarity = config.typeRarity[code];
          const imgSrc = config.typeImages[code];
          const isExpanded = expandedCards[code] ?? false;

          if (!typeDef) return null;

          const stars = rarity?.stars ?? 1;
          const badgeStyle = rarityBadgeStyle(stars);
          const icon = rarityIcon(code, stars, config.hiddenTypeCode);

          let pctDisplay: string;
          let labelDisplay: string;
          if (useRealData && realRarity[code] !== undefined) {
            pctDisplay = `${realRarity[code]}%`;
            labelDisplay = rarity?.label ?? '';
          } else {
            pctDisplay = rarity ? `${rarity.pct}%` : '';
            labelDisplay = rarity?.label ?? '';
          }

          return (
            <div
              key={code}
              className="bg-surface border border-border rounded-2xl overflow-hidden"
            >
              {/* Image */}
              {imgSrc && (
                <div className="w-full aspect-square bg-surface-2 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={code}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-white">
                    {code}
                  </span>
                  <span className="text-muted text-sm">
                    {typeDef.cn}
                  </span>
                </div>

                {/* Rarity badge */}
                {rarity && (
                  <span
                    className="inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-semibold"
                    style={{ background: badgeStyle.bg, color: badgeStyle.text }}
                  >
                    {icon} {labelDisplay} {pctDisplay}
                  </span>
                )}

                {/* Intro */}
                <p className="text-sm text-[#999] mt-3 italic">
                  {typeDef.intro}
                </p>

                {/* Description */}
                <p
                  className={`text-sm text-[#aaa] mt-2 leading-relaxed ${
                    isExpanded ? '' : 'line-clamp-3'
                  }`}
                >
                  {typeDef.desc}
                </p>

                {/* Toggle */}
                <button
                  onClick={() => toggleExpand(code)}
                  className="text-accent text-xs cursor-pointer mt-2 hover:underline"
                >
                  {isExpanded ? '\u6536\u8d77' : '\u5c55\u5f00\u5168\u6587'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
