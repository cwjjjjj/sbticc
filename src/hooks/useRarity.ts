import { useState, useEffect } from 'react';

export type RarityTier = 'legendary' | 'rare' | 'uncommon' | 'common';

export interface RarityData {
  percentile: number;
  tier: RarityTier;
  typeCount: number;
  totalTests: number;
  loaded: boolean;
  error: boolean;
}

export function computeTier(percentile: number): RarityTier {
  if (percentile <= 5) return 'legendary';
  if (percentile <= 15) return 'rare';
  if (percentile <= 40) return 'uncommon';
  return 'common';
}

export function computePercentile(typeCount: number, totalTests: number): number {
  if (totalTests <= 0) return 100;
  const proportion = typeCount / totalTests;
  return Math.max(0, Math.min(100, proportion * 100));
}

interface RankingApiResponse {
  total?: number;
  typeCounts?: Record<string, number>;
}

export function useRarity(testId: string, code: string): RarityData {
  const [data, setData] = useState<RarityData>({
    percentile: 100,
    tier: 'common',
    typeCount: 0,
    totalTests: 0,
    loaded: false,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    const url = testId === 'sbti' ? '/api/ranking' : `/api/ranking?test=${encodeURIComponent(testId)}`;
    fetch(url)
      .then((r) => r.json() as Promise<RankingApiResponse>)
      .then((json) => {
        if (cancelled) return;
        const typeCount = (json.typeCounts ?? {})[code] ?? 0;
        const totalTests = json.total ?? 0;
        const percentile = computePercentile(typeCount, totalTests);
        const tier = computeTier(percentile);
        setData({ percentile, tier, typeCount, totalTests, loaded: true, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setData((d) => ({ ...d, loaded: true, error: true }));
      });
    return () => { cancelled = true; };
  }, [testId, code]);

  return data;
}
