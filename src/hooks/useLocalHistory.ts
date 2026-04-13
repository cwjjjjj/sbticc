import { useState, useEffect, useCallback } from 'react';
import { useTestConfig } from '../data/testConfig';

export interface HistoryEntry {
  code: string;
  time: number;
}

export interface UseLocalHistoryReturn {
  history: HistoryEntry[];
  stats: Record<string, number>;
  saveResult: (typeCode: string) => Promise<void>;
}

function readHistory(key: string): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function readStats(key: string): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

export function useLocalHistory(): UseLocalHistoryReturn {
  const config = useTestConfig();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  // Initialise from localStorage on mount
  useEffect(() => {
    setHistory(readHistory(config.localHistoryKey));
    setStats(readStats(config.localStatsKey));
  }, [config.localHistoryKey, config.localStatsKey]);

  const saveResult = useCallback(async (typeCode: string) => {
    // POST to remote (fire-and-forget)
    const body: Record<string, string> = { type: typeCode };
    if (config.apiTestParam) body.test = config.apiTestParam;
    fetch('/api/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});

    // Update stats
    const nextStats = { ...readStats(config.localStatsKey) };
    nextStats[typeCode] = (nextStats[typeCode] || 0) + 1;
    localStorage.setItem(config.localStatsKey, JSON.stringify(nextStats));
    setStats(nextStats);

    // Update history (keep last 100)
    let nextHistory = [...readHistory(config.localHistoryKey), { code: typeCode, time: Date.now() }];
    if (nextHistory.length > 100) nextHistory = nextHistory.slice(-100);
    localStorage.setItem(config.localHistoryKey, JSON.stringify(nextHistory));
    setHistory(nextHistory);
  }, [config]);

  return { history, stats, saveResult };
}
