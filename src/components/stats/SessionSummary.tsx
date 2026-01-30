'use client';

import { CheatCodeStats } from '@/types/stats';
import { Button } from '@/components/ui/Button';

interface SessionSummaryProps {
  score: number;
  totalNotes: number;
  completionTime: number;
  previousBest: CheatCodeStats | null;
  onReplay: () => void;
  onNext: () => void;
}

export function SessionSummary({
  score,
  totalNotes,
  completionTime,
  previousBest,
  onReplay,
  onNext,
}: SessionSummaryProps) {
  const accuracy = totalNotes > 0 ? 100 : 0; // On a reussi toutes les notes si on arrive ici
  const isNewRecord = previousBest ? score > previousBest.bestScore : true;
  const timeInSeconds = (completionTime / 1000).toFixed(1);

  return (
    <div className="bg-[#151a28] rounded-2xl p-6 border border-amber-500/20">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">
          {isNewRecord ? '🎉' : '✅'}
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          {isNewRecord ? 'Nouveau record !' : 'Bien joue !'}
        </h3>
        <p className="text-gray-400 text-sm">Sequence terminee</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-500">{score}</div>
          <div className="text-xs text-gray-400">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{accuracy}%</div>
          <div className="text-xs text-gray-400">Precision</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{timeInSeconds}s</div>
          <div className="text-xs text-gray-400">Temps</div>
        </div>
      </div>

      {previousBest && (
        <div className="text-center text-sm text-gray-400 mb-6">
          Record precedent : <span className="text-white">{previousBest.bestScore}</span> points
          <br />
          Nombre de parties : <span className="text-white">{previousBest.playCount}</span>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Button onClick={onReplay} variant="secondary">
          Rejouer
        </Button>
        <Button onClick={onNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
