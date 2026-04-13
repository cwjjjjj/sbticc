import { useState, useCallback } from 'react';
import { useTestConfig } from '../data/testConfig';

export interface RankingItem {
  code: string;
  count: number;
}

export interface RankingData {
  list: RankingItem[];
  total: number;
}

export interface UseRankingReturn {
  data: RankingData | null;
  loading: boolean;
  error: string | null;
  fetchRanking: () => Promise<void>;
}

export function useRanking(): UseRankingReturn {
  const config = useTestConfig();
  const [data, setData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = config.apiTestParam ? `?test=${config.apiTestParam}` : '';
      const res = await fetch(`/api/ranking${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData({ list: json.list ?? [], total: json.total ?? 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [config.apiTestParam]);

  return { data, loading, error, fetchRanking };
}
