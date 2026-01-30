'use client';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  currentIndex: number;
  totalNotes: number;
}

export function ScoreDisplay({ score, streak, currentIndex, totalNotes }: ScoreDisplayProps) {
  const progress = totalNotes > 0 ? Math.round((currentIndex / totalNotes) * 100) : 0;

  return (
    <div className="flex items-center gap-6 text-sm">
      {/* Score */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Score</span>
        <span className="text-white font-bold tabular-nums">{score}</span>
      </div>

      {/* Streak */}
      {streak > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-medium">{streak}x</span>
          <span className="text-gray-400">combo</span>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-gray-400 tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}
