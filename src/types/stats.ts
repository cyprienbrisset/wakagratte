export interface PlaySession {
  cheatCodeId: string;
  timestamp: number;
  score: number;
  accuracy: number;       // % de notes justes (0-100)
  completionTime: number; // ms pour finir
  notesPlayed: number;
  notesCorrect: number;
}

export interface CheatCodeStats {
  cheatCodeId: string;
  playCount: number;
  bestScore: number;
  averageAccuracy: number;
  lastPlayed: number;
}

export interface UserStats {
  totalPlayTime: number;
  totalSessions: number;
  totalNotesPlayed: number;
  sessions: PlaySession[];
  cheatCodeStats: Record<string, CheatCodeStats>;
}
