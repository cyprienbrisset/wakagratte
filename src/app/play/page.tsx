'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CheatCodeCard } from '@/components/cheatcode/CheatCodeCard';
import { getAllCheatCodes } from '@/lib/music/cheatCodes';

export default function PlayPage() {
  const cheatCodes = getAllCheatCodes();

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
            <span className="text-sm text-amber-500 font-medium">Séquences</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-3">Séquences</h1>
            <p className="text-gray-400">Choisis une séquence et joue-la avec ta guitare</p>
          </div>

          {/* Cheat codes list */}
          <div className="space-y-4">
            {cheatCodes.map((cheatCode) => (
              <CheatCodeCard key={cheatCode.id} cheatCode={cheatCode} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
