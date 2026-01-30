'use client';

import { useStats } from '@/hooks/useStats';

export default function StatsPage() {
  const { stats } = useStats();

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Trier les cheat codes par nombre de parties
  const topCheatCodes = stats
    ? Object.values(stats.cheatCodeStats)
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Statistiques</h1>
        <p className="text-gray-400">Suis ta progression</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
          <div className="text-3xl font-bold text-amber-500 mb-1">
            {stats?.totalSessions ?? 0}
          </div>
          <div className="text-sm text-gray-400">Sessions jouees</div>
        </div>
        <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.totalNotesPlayed ?? 0}
          </div>
          <div className="text-sm text-gray-400">Notes jouees</div>
        </div>
        <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
          <div className="text-3xl font-bold text-white mb-1">
            {formatTime(stats?.totalPlayTime ?? 0)}
          </div>
          <div className="text-sm text-gray-400">Temps de jeu</div>
        </div>
        <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
          <div className="text-3xl font-bold text-white mb-1">
            {Object.keys(stats?.cheatCodeStats ?? {}).length}
          </div>
          <div className="text-sm text-gray-400">Sequences essayees</div>
        </div>
      </div>

      {/* Top séquences */}
      <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Sequences les plus jouees</h2>
        {topCheatCodes.length === 0 ? (
          <p className="text-gray-500">Aucune donnee pour le moment. Joue des sequences pour voir tes stats !</p>
        ) : (
          <div className="space-y-3">
            {topCheatCodes.map((stat, index) => (
              <div
                key={stat.cheatCodeId}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-600 w-8">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-white">{stat.cheatCodeId}</div>
                    <div className="text-sm text-gray-500">
                      Meilleur score: {stat.bestScore}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-amber-500">{stat.playCount}x</div>
                  <div className="text-sm text-gray-500">parties</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
