import { useState, useEffect, useCallback } from 'react';

const LOCAL_HISTORY_KEY = 'sbti_history';
const LOCAL_STATS_KEY = 'sbti_local_stats';

export interface HistoryEntry {
  code: string;
  time: number;
}

export interface UseLocalHistoryReturn {
  history: HistoryEntry[];
  stats: Record<string, number>;
  saveResult: (typeCode: string) => Promise<void>;
}

function readHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function readStats(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STATS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useLocalHistory(): UseLocalHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  // Initialise from localStorage on mount
  useEffect(() => {
    setHistory(readHistory());
    setStats(readStats());
  }, []);

  const saveResult = useCallback(async (typeCode: string) => {
    // POST to remote (fire-and-forget)
    fetch('/api/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: typeCode }),
    }).catch(() => {});

    // Update stats
    const nextStats = { ...readStats() };
    nextStats[typeCode] = (nextStats[typeCode] || 0) + 1;
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(nextStats));
    setStats(nextStats);

    // Update history (keep last 100)
    let nextHistory = [...readHistory(), { code: typeCode, time: Date.now() }];
    if (nextHistory.length > 100) nextHistory = nextHistory.slice(-100);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);
  }, []);

  return { history, stats, saveResult };
}
