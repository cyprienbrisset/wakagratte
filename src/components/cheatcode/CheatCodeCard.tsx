'use client';

import Link from 'next/link';
import { CheatCode } from '@/types/music';

interface CheatCodeCardProps {
  cheatCode: CheatCode;
}

const difficultyColors = {
  easy: 'bg-emerald-500/10 text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-400',
  hard: 'bg-red-500/10 text-red-400',
};

const difficultyLabels = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

export function CheatCodeCard({ cheatCode }: CheatCodeCardProps) {
  return (
    <Link
      href={`/play/${cheatCode.id}`}
      className="block p-6 rounded-2xl bg-[#151a28] border border-white/5 hover:border-amber-500/30 hover:bg-[#1a2035] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-amber-500 transition-colors">
            {cheatCode.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[cheatCode.difficulty]}`}>
              {difficultyLabels[cheatCode.difficulty]}
            </span>
            <span className="text-xs text-gray-500">{cheatCode.sequence.length} notes</span>
            {cheatCode.tempo && (
              <span className="text-xs text-gray-500">{cheatCode.tempo} BPM</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
          <svg
            className="w-5 h-5 text-amber-500 group-hover:text-gray-900 transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {cheatCode.description && (
        <p className="text-sm text-gray-400 leading-relaxed">{cheatCode.description}</p>
      )}
    </Link>
  );
}
