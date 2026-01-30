'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Fretboard } from '@/components/fretboard/Fretboard';
import { SequenceProgress } from '@/components/cheatcode/SequenceProgress';
import { LoopControls } from '@/components/cheatcode/LoopControls';
import { useMicrophone } from '@/hooks/useMicrophone';
import { usePitchDetection } from '@/hooks/usePitchDetection';
import { useCheatCodeValidation } from '@/hooks/useCheatCodeValidation';
import { getCheatCodeById } from '@/lib/music/cheatCodes';

export default function PlayCheatCodePage() {
  const params = useParams();
  const cheatId = params.cheatId as string;

  const cheatCode = useMemo(() => getCheatCodeById(cheatId) ?? null, [cheatId]);

  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);

  const { status: micStatus, stream, error, requestAccess, stopMicrophone } = useMicrophone();
  const { detectedNote, isListening } = usePitchDetection(stream, {
    minClarity: 0.85,
    minVolume: 0.01,
  });

  const { currentIndex, noteStates, isComplete, isWaitingForNote, loopCount, reset, validateNote } =
    useCheatCodeValidation(cheatCode, {
      loopStart,
      loopEnd,
    });

  useEffect(() => {
    if (detectedNote && isListening && !isComplete) {
      validateNote(detectedNote);
    }
  }, [detectedNote, isListening, isComplete, validateNote]);

  if (!cheatCode) {
    return (
      <main className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Séquence non trouvée</p>
          <Link href="/play">
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </main>
    );
  }

  const maxFret = Math.max(...cheatCode.sequence.flatMap((step) => step.map((note) => note.fret)), 5);

  return (
    <main className="min-h-screen bg-[#0b0f19] flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/play" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <Image src="/logo.svg" alt="Wakagratte" width={96} height={96} />
          </Link>
          <span className="text-sm font-semibold text-white">{cheatCode.name}</span>
          <span className="text-sm text-amber-500 font-medium tabular-nums">
            {currentIndex}/{cheatCode.sequence.length}
          </span>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col pt-20">
        {/* Sequence */}
        <div className="py-8 bg-[#0d111c]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4 text-center">Séquence</h2>
            <SequenceProgress
              sequence={cheatCode.sequence}
              currentIndex={currentIndex}
              noteStates={noteStates}
            />
          </div>
        </div>

        {/* Fretboard */}
        <div className="flex-1 flex items-center py-8">
          <div className="max-w-4xl mx-auto px-6 w-full">
            <Fretboard
              sequence={cheatCode.sequence}
              currentIndex={currentIndex}
              noteStates={noteStates}
              maxFret={maxFret + 2}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0d111c] py-6">
          <div className="max-w-3xl mx-auto px-6">
            {isComplete ? (
              <div className="bg-[#151a28] rounded-2xl p-6 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-amber-500 font-medium">Séquence terminée !</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={reset} variant="secondary" size="sm">
                      Recommencer
                    </Button>
                    <Link href="/play">
                      <Button size="sm">Suivant</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
                <div className="flex flex-col gap-4">
                  <LoopControls
                    sequenceLength={cheatCode.sequence.length}
                    loopStart={loopStart}
                    loopEnd={loopEnd}
                    onLoopChange={(start, end) => {
                      // Si les deux sont définis et start > end, ne pas accepter
                      if (start !== null && end !== null && start > end) {
                        return;
                      }
                      setLoopStart(start);
                      setLoopEnd(end);
                    }}
                    loopCount={loopCount}
                    disabled={!isListening}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isListening && (
                        <>
                          <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-sm text-gray-400">
                            {detectedNote ? (
                              <span className="text-white font-medium">{detectedNote.note}{detectedNote.octave}</span>
                            ) : (
                              'En ecoute...'
                            )}
                          </span>
                          {isWaitingForNote ? (
                            <span className="text-sm text-amber-400 animate-pulse">En attente de la note...</span>
                          ) : (
                            <span className="text-sm text-emerald-400">Note validee!</span>
                          )}
                        </>
                      )}
                      {error && <span className="text-sm text-red-400">{error}</span>}
                    </div>

                    <div className="flex gap-3">
                      {currentIndex > 0 && (
                        <Button onClick={reset} variant="ghost" size="sm">
                          Reinitialiser
                        </Button>
                      )}
                      {!isListening ? (
                        <Button onClick={requestAccess} disabled={micStatus === 'requesting'} size="sm">
                          {micStatus === 'requesting' ? 'Autorisation...' : 'Demarrer'}
                        </Button>
                      ) : (
                        <Button onClick={stopMicrophone} variant="secondary" size="sm">
                          Arreter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
