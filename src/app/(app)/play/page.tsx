'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllCheatCodes } from '@/lib/music/cheatCodes';
import { CheatCodeCategory, Difficulty } from '@/types/music';

const CATEGORY_GRADIENTS: Record<CheatCodeCategory, string> = {
  basics: 'from-blue-600 to-blue-800',
  chords: 'from-emerald-500 to-emerald-700',
  riffs: 'from-red-500 to-red-700',
  scales: 'from-purple-500 to-purple-700',
};

const CATEGORY_LABELS: Record<CheatCodeCategory, string> = {
  basics: 'Bases',
  chords: 'Accords',
  riffs: 'Riffs',
  scales: 'Gammes',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-red-500/20 text-red-400',
};

type FilterDifficulty = 'all' | Difficulty;

const FILTERS: { value: FilterDifficulty; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
];

export default function PlayPage() {
  const [filter, setFilter] = useState<FilterDifficulty>('all');
  const cheatCodes = getAllCheatCodes();

  const filteredCodes = filter === 'all'
    ? cheatCodes
    : cheatCodes.filter(cc => cc.difficulty === filter);

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sequences</h1>
        <p className="text-gray-400">Choisis une sequence et joue-la avec ta guitare</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === value
                ? 'bg-gray-700 text-white'
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCodes.map((code) => {
          const category = (code.category ?? 'basics') as CheatCodeCategory;
          return (
            <Link
              key={code.id}
              href={`/play/${code.id}`}
              className="group relative bg-[#151a28] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all hover:scale-[1.02]"
            >
              {/* Gradient thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${CATEGORY_GRADIENTS[category]} relative`}>
                {/* Category badge */}
                <span className="absolute top-3 left-3 px-2 py-1 bg-black/30 backdrop-blur-sm rounded text-xs font-medium text-white">
                  {CATEGORY_LABELS[category]}
                </span>
                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 group-hover:text-amber-500 transition-colors">
                  {code.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {code.sequence.length} notes
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${DIFFICULTY_COLORS[code.difficulty]}`}>
                    {DIFFICULTY_LABELS[code.difficulty]}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
