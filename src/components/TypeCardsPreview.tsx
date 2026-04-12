import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import { TYPE_LIBRARY, TYPE_RARITY } from '../data/types';

const TYPE_COLORS: Record<string, string> = {
  SHIT: '#ff3b3b',
  CTRL: '#44ff88',
  FUCK: '#4488ff',
  SEXY: '#ffaa00',
  MONK: '#aa44ff',
  'LOVE-R': '#ff6b9d',
  DEAD: '#44ddff',
  BOSS: '#88ff44',
  HHHH: '#ff8844',
};

const FEATURED_TYPES = [
  'SHIT', 'CTRL', 'FUCK', 'SEXY', 'MONK', 'LOVE-R', 'DEAD', 'BOSS', 'HHHH',
];

function rarityColor(stars: number): { bg: string; text: string } {
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

const hideScrollbar = css`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default function TypeCardsPreview() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
          29 种人格，你是哪种？
        </h2>
        <p className="text-sm text-muted mt-2">
          每一种都是对你的精准打击
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        css={hideScrollbar}
        className="flex gap-4 overflow-x-auto pb-4"
      >
        {FEATURED_TYPES.map((code, i) => {
          const typeDef = TYPE_LIBRARY[code];
          const rarity = TYPE_RARITY[code];
          const color = TYPE_COLORS[code] || '#ff3b3b';
          const rc = rarityColor(rarity?.stars ?? 1);

          if (!typeDef) return null;

          return (
            <motion.div
              key={code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-[180px] bg-surface border border-border rounded-2xl p-5 text-center relative overflow-hidden group cursor-default"
            >
              {/* Top accent bar on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: color }}
              />

              {/* Type code */}
              <div
                className="font-mono text-xl font-extrabold"
                style={{ color }}
              >
                {code}
              </div>

              {/* CN name */}
              <div className="text-sm text-muted mt-1">
                {typeDef.cn}
              </div>

              {/* Rarity badge */}
              {rarity && (
                <span
                  className="inline-block mt-3 px-2.5 py-1 rounded-md text-xs font-semibold"
                  style={{ background: rc.bg, color: rc.text }}
                >
                  {'★'.repeat(rarity.stars)} {rarity.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
