'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserStats, PlaySession, CheatCodeStats } from '@/types/stats';
import { getStats, saveSession as saveSessionToStorage, getCheatCodeStats } from '@/lib/storage/stats';

export function useStats() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  const saveSession = useCallback((session: PlaySession) => {
    saveSessionToStorage(session);
    setStats(getStats());
  }, []);

  const getCodeStats = useCallback((id: string): CheatCodeStats | null => {
    return getCheatCodeStats(id);
  }, []);

  return {
    stats,
    saveSession,
    getCodeStats,
  };
}
