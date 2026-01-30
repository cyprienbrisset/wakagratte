import { UserStats, PlaySession, CheatCodeStats } from '@/types/stats';

const STATS_KEY = 'wakagratte_stats';

const DEFAULT_STATS: UserStats = {
  totalPlayTime: 0,
  totalSessions: 0,
  totalNotesPlayed: 0,
  sessions: [],
  cheatCodeStats: {},
};

export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;

  try {
    const data = localStorage.getItem(STATS_KEY);
    if (!data) return DEFAULT_STATS;
    return JSON.parse(data) as UserStats;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveSession(session: PlaySession): void {
  if (typeof window === 'undefined') return;

  try {
    const stats = getStats();

    // Ajouter la session
    stats.sessions.push(session);
    stats.totalSessions += 1;
    stats.totalPlayTime += session.completionTime;
    stats.totalNotesPlayed += session.notesPlayed;

    // Garder seulement les 100 dernieres sessions
    if (stats.sessions.length > 100) {
      stats.sessions = stats.sessions.slice(-100);
    }

    // Mettre a jour les stats du cheat code
    const existing = stats.cheatCodeStats[session.cheatCodeId];
    if (existing) {
      existing.playCount += 1;
      existing.bestScore = Math.max(existing.bestScore, session.score);
      existing.averageAccuracy = (existing.averageAccuracy * (existing.playCount - 1) + session.accuracy) / existing.playCount;
      existing.lastPlayed = session.timestamp;
    } else {
      stats.cheatCodeStats[session.cheatCodeId] = {
        cheatCodeId: session.cheatCodeId,
        playCount: 1,
        bestScore: session.score,
        averageAccuracy: session.accuracy,
        lastPlayed: session.timestamp,
      };
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save session stats:', error);
  }
}

export function getCheatCodeStats(id: string): CheatCodeStats | null {
  const stats = getStats();
  return stats.cheatCodeStats[id] || null;
}

export function clearStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STATS_KEY);
}
