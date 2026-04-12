import { useEffect } from 'react';
import { TYPE_LIBRARY, TYPE_RARITY } from '../data/types';
import type { UseRankingReturn } from '../hooks/useRanking';
import type { UseLocalHistoryReturn } from '../hooks/useLocalHistory';

interface RankingPageProps {
  ranking: UseRankingReturn;
  localHistory: UseLocalHistoryReturn;
  onStartTest: () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getRarityLabel(code: string): string {
  const r = TYPE_RARITY[code];
  if (!r) return '';
  if (code === 'DRUNK') return '\ud83c\udf7a \u9690\u85cf';
  if (r.stars === 5) return '\ud83d\udc8e \u6781\u7a00\u6709';
  return '\u2605'.repeat(r.stars) + ' ' + r.label;
}

export default function RankingPage({
  ranking,
  localHistory,
  onStartTest,
}: RankingPageProps) {
  const { data, loading, error, fetchRanking } = ranking;
  const { history, stats } = localHistory;

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  const list = data?.list ?? [];
  const total = data?.total ?? 0;
  const maxCount = list.length > 0 ? list[0].count : 1;
  const unlockedTypes = list.filter((r) => r.count > 0).length;

  // Local history: newest first, max 20
  const displayHistory = [...history].reverse().slice(0, 20);
  const localTestCount = history.length;
  const localUnlockedCount = Object.keys(stats).length;

  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto pb-16">
      {/* Section 1: Global Ranking */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-mono font-extrabold text-xl sm:text-2xl text-center text-white">
          {'\u5168\u7ad9\u4eba\u683c\u6392\u884c\u699c'}
        </h2>
        <p className="text-center text-sm text-muted mt-1 mb-6">
          {'\u57fa\u4e8e\u6240\u6709\u7528\u6237\u7684\u6d4b\u8bd5\u7edf\u8ba1'}
        </p>

        {/* Stats cards */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-surface-2 border border-border rounded-2xl p-5 text-center">
            <div className="font-mono text-3xl font-extrabold text-white">
              {loading ? '...' : total.toLocaleString()}
            </div>
            <div className="text-xs text-muted mt-1">
              {'\u603b\u6d4b\u8bd5\u6b21\u6570'}
            </div>
          </div>
          <div className="flex-1 bg-surface-2 border border-border rounded-2xl p-5 text-center">
            <div className="font-mono text-3xl font-extrabold text-white">
              {loading ? '...' : unlockedTypes}
            </div>
            <div className="text-xs text-muted mt-1">
              {'\u5df2\u89e3\u9501\u4eba\u683c'}
            </div>
          </div>
        </div>

        {/* Ranking list */}
        {loading && (
          <p className="text-center text-muted py-8">
            {'\u52a0\u8f7d\u4e2d...'}
          </p>
        )}

        {!loading && (error || list.length === 0) && (
          <div className="text-center py-8">
            <p className="text-muted mb-4">
              {'\u8fd8\u6ca1\u6709\u6d4b\u8bd5\u8bb0\u5f55'}
            </p>
            <button
              onClick={onStartTest}
              className="bg-accent text-white font-bold py-2.5 px-6 rounded-xl hover:bg-accent/80 transition-colors cursor-pointer"
            >
              {'\u53bb\u6d4b\u8bd5'}
            </button>
          </div>
        )}

        {!loading && !error && list.length > 0 && (
          <div>
            {list.map((item, idx) => {
              const rank = idx + 1;
              const typeDef = TYPE_LIBRARY[item.code];
              const cn = typeDef?.cn ?? '';
              const barPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

              let rankColor = 'text-muted';
              if (rank === 1) rankColor = 'text-warm';
              else if (rank === 2) rankColor = 'text-[#c0c0c0]';
              else if (rank === 3) rankColor = 'text-[#cd7f32]';

              return (
                <div
                  key={item.code}
                  className="flex items-center gap-4 py-4 border-b border-[#1a1a1a] last:border-b-0"
                >
                  <span className={`font-mono text-xl font-extrabold w-8 text-center ${rankColor}`}>
                    {rank}
                  </span>
                  <span className="font-mono text-base font-bold text-white w-20">
                    {item.code}
                  </span>
                  <span className="text-sm text-muted w-16">
                    {cn}
                  </span>
                  <div className="flex-1 h-2 bg-[#1a1a1a] rounded overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${barPct}%`,
                        background: 'linear-gradient(to right, #ff3b3b, #ffaa00)',
                      }}
                    />
                  </div>
                  <span className="font-mono text-sm text-muted w-16 text-right">
                    {item.count} {'\u6b21'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Local History */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-mono font-extrabold text-xl sm:text-2xl text-center text-white">
          {'\u6211\u7684\u6d4b\u8bd5\u8bb0\u5f55'}
        </h2>
        <p className="text-center text-sm text-muted mt-1 mb-6">
          {'\u6570\u636e\u4fdd\u5b58\u5728\u4f60\u7684\u6d4f\u89c8\u5668\u4e2d'}
        </p>

        {displayHistory.length === 0 ? (
          <p className="text-center text-muted py-8">
            {'\u8fd8\u6ca1\u6709\u6d4b\u8bd5\u8bb0\u5f55'}
          </p>
        ) : (
          <>
            {/* Local stats */}
            <div className="flex gap-6 mb-6">
              <div className="flex-1 bg-surface-2 border border-border rounded-2xl p-5 text-center">
                <div className="font-mono text-3xl font-extrabold text-white">
                  {localTestCount}
                </div>
                <div className="text-xs text-muted mt-1">
                  {'\u6211\u7684\u6d4b\u8bd5\u6b21\u6570'}
                </div>
              </div>
              <div className="flex-1 bg-surface-2 border border-border rounded-2xl p-5 text-center">
                <div className="font-mono text-3xl font-extrabold text-white">
                  {localUnlockedCount}
                </div>
                <div className="text-xs text-muted mt-1">
                  {'\u6211\u89e3\u9501\u7684\u4eba\u683c'}
                </div>
              </div>
            </div>

            {/* History list */}
            <div>
              {displayHistory.map((entry, i) => {
                const typeDef = TYPE_LIBRARY[entry.code];
                const cn = typeDef?.cn ?? '';
                const rarityLabel = getRarityLabel(entry.code);

                return (
                  <div
                    key={`${entry.code}-${entry.time}-${i}`}
                    className="flex justify-between items-center py-3 border-b border-[#1a1a1a] last:border-b-0"
                  >
                    <div>
                      <span className="font-mono font-bold text-white">
                        {entry.code}
                      </span>
                      <span className="text-muted text-sm ml-2">
                        {cn}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {rarityLabel && (
                        <span className="text-xs text-muted">
                          {rarityLabel}
                        </span>
                      )}
                      <span className="text-xs text-muted font-mono">
                        {formatTime(entry.time)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
