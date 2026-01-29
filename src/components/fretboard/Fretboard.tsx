'use client';

import { NoteStep, NoteState, StringNumber } from '@/types/music';

interface FretboardProps {
  sequence: NoteStep[];
  currentIndex: number;
  noteStates: NoteState[];
  maxFret?: number;
}

const STRING_LABELS: Record<StringNumber, string> = {
  1: 'e',
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E',
};

const STRINGS_ORDER: StringNumber[] = [1, 2, 3, 4, 5, 6];

export function Fretboard({ sequence, currentIndex, noteStates }: FretboardProps) {

  const getFretForString = (stepIndex: number, stringNum: StringNumber): number | null => {
    const step = sequence[stepIndex];
    const note = step.find(n => n.string === stringNum);
    return note ? note.fret : null;
  };

  const getNoteStyle = (stepIndex: number, hasNote: boolean): { bg: string; text: string; ring: string } => {
    const state = noteStates[stepIndex];
    const isCurrent = stepIndex === currentIndex;

    if (!hasNote) {
      return { bg: 'bg-transparent', text: 'text-gray-600', ring: '' };
    }

    if (isCurrent) {
      return {
        bg: 'bg-gradient-to-br from-amber-400 to-amber-600',
        text: 'text-gray-900 font-black',
        ring: 'ring-4 ring-amber-400/30'
      };
    }
    if (state === 'success') {
      return {
        bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
        text: 'text-white font-bold',
        ring: ''
      };
    }
    return {
      bg: 'bg-gray-700/80',
      text: 'text-gray-300 font-medium',
      ring: ''
    };
  };

  return (
    <div className="w-full font-mono">
      <div className="bg-gradient-to-b from-[#12172a] to-[#0d111c] rounded-2xl p-6 border border-white/10 shadow-2xl">
        {/* Tablature grid */}
        <div className="relative">
          {/* Lignes horizontales continues */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ top: '20px', bottom: '40px' }}>
            {STRINGS_ORDER.map((_, idx) => (
              <div key={idx} className="h-px bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600" style={{ marginLeft: '48px' }} />
            ))}
          </div>

          {/* Contenu */}
          <div className="relative flex">
            {/* Labels des cordes */}
            <div className="flex flex-col w-12 flex-shrink-0">
              {STRINGS_ORDER.map((stringNum) => (
                <div
                  key={stringNum}
                  className="h-12 flex items-center justify-end pr-3 text-amber-500 font-bold text-base"
                >
                  {STRING_LABELS[stringNum]}
                </div>
              ))}
              {/* Espace pour les numéros */}
              <div className="h-8" />
            </div>

            {/* Notes */}
            <div className="flex-1 flex justify-center gap-4">
              {sequence.map((step, stepIndex) => {
                const isCurrent = stepIndex === currentIndex;
                const state = noteStates[stepIndex];

                return (
                  <div
                    key={stepIndex}
                    className="flex flex-col items-center"
                  >
                    {/* Colonne de notes */}
                    <div
                      className={`flex flex-col items-center px-2 rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                          : ''
                      }`}
                    >
                      {STRINGS_ORDER.map((stringNum) => {
                        const fret = getFretForString(stepIndex, stringNum);
                        const hasNote = fret !== null;
                        const styles = getNoteStyle(stepIndex, hasNote);

                        return (
                          <div
                            key={stringNum}
                            className="h-12 w-12 flex items-center justify-center"
                          >
                            {hasNote ? (
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${styles.bg} ${styles.text} ${styles.ring} ${
                                  isCurrent ? 'scale-110 shadow-lg' : ''
                                }`}
                              >
                                {fret}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xl">―</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Numéro du step */}
                    <div
                      className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-gray-900'
                          : state === 'success'
                            ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                            : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {stepIndex + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-8 text-sm text-gray-400 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ring-4 ring-amber-400/30 flex items-center justify-center text-gray-900 font-bold">
            2
          </div>
          <span>À jouer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
            2
          </div>
          <span>Joué</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center text-gray-300 font-medium">
            2
          </div>
          <span>À venir</span>
        </div>
      </div>
    </div>
  );
}
