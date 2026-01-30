'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheatCodeCard } from '@/components/cheatcode/CheatCodeCard';
import { getAllCheatCodes } from '@/lib/music/cheatCodes';
import { CheatCodeCategory } from '@/types/music';

const CATEGORY_LABELS: Record<CheatCodeCategory, string> = {
  basics: 'Bases Wakagratte',
  chords: 'Accords',
  riffs: 'Riffs celebres',
  scales: 'Gammes & Exercices',
};

const CATEGORY_ORDER: CheatCodeCategory[] = ['basics', 'chords', 'riffs', 'scales'];

export default function PlayPage() {
  const cheatCodes = getAllCheatCodes();

  // Grouper par categorie
  const grouped = CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = cheatCodes.filter(cc => (cc.category ?? 'basics') === category);
    return acc;
  }, {} as Record<CheatCodeCategory, typeof cheatCodes>);

  return (
    <main className="min-h-screen bg-[#0b0f19]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Wakagratte" width={128} height={128} />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/tuner" className="text-sm text-gray-400 hover:text-white transition-colors">
              Accordeur
            </Link>
            <span className="text-sm text-amber-500 font-medium">Sequences</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-3">Sequences</h1>
            <p className="text-gray-400">Choisis une sequence et joue-la avec ta guitare</p>
          </div>

          {/* Cheat codes grouped by category */}
          <div className="space-y-8">
            {CATEGORY_ORDER.map((category) => {
              const codes = grouped[category];
              if (codes.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <div className="space-y-4">
                    {codes.map((cheatCode) => (
                      <CheatCodeCard key={cheatCode.id} cheatCode={cheatCode} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
