'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useState(85);

  const handleClearStats = () => {
    if (confirm('Es-tu sur de vouloir effacer toutes tes statistiques ?')) {
      localStorage.removeItem('wakagratte_stats');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reglages</h1>
        <p className="text-gray-400">Configure l&apos;application</p>
      </div>

      {/* Audio */}
      <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Audio</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300">Sensibilite du micro</label>
              <span className="text-amber-500 font-mono">{sensitivity}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={sensitivity}
              onChange={(e) => setSensitivity(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Augmente si les notes ne sont pas detectees, diminue s&apos;il y a trop de faux positifs
            </p>
          </div>
        </div>
      </div>

      {/* Données */}
      <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Donnees</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300">Effacer les statistiques</div>
              <div className="text-xs text-gray-500">Supprime toutes tes donnees de progression</div>
            </div>
            <button
              onClick={handleClearStats}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      {/* À propos */}
      <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">A propos</h2>
        <div className="space-y-2 text-gray-400 text-sm">
          <p><span className="text-gray-500">Version:</span> 1.0.0</p>
          <p><span className="text-gray-500">Developpe par:</span> Wakagratte Team</p>
        </div>
      </div>
    </div>
  );
}
