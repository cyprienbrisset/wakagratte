'use client';

export default function StatsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Statistiques</h1>
          <p className="text-gray-400">Suis ta progression et tes performances</p>
        </div>

        {/* Placeholder content */}
        <div className="bg-[#151a28] rounded-2xl p-8 border border-white/5 text-center">
          <div className="text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium mb-2">Bientot disponible</p>
            <p className="text-sm">Joue quelques sequences pour voir tes statistiques ici.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
