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
        {/* Tablature - ligne par ligne */}
        {STRINGS_ORDER.map((stringNum) => (
          <div key={stringNum} className="flex items-center h-12">
            {/* Label de la corde */}
            <div className="w-8 flex-shrink-0 text-amber-500 font-bold text-base text-right pr-3">
              {STRING_LABELS[stringNum]}
            </div>

            {/* Ligne avec notes */}
            <div className="flex-1 flex items-center justify-center gap-6 relative">
              {/* Ligne horizontale */}
              <div className="absolute inset-x-0 h-px bg-gray-600" />

              {/* Notes pour cette corde */}
              {sequence.map((step, stepIndex) => {
                const fret = getFretForString(stepIndex, stringNum);
                const hasNote = fret !== null;
                const styles = getNoteStyle(stepIndex, hasNote);
                const isCurrent = stepIndex === currentIndex;

                return (
                  <div
                    key={stepIndex}
                    className={`relative z-10 w-14 flex items-center justify-center ${
                      isCurrent ? 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''
                    }`}
                  >
                    {hasNote ? (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${styles.bg} ${styles.text} ${styles.ring} ${
                          isCurrent ? 'scale-110' : ''
                        }`}
                      >
                        {fret}
                      </div>
                    ) : (
                      <span className="text-gray-700 bg-[#0d111c] px-1">―</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Numéros des steps */}
        <div className="flex items-center h-12 mt-2">
          <div className="w-8 flex-shrink-0" />
          <div className="flex-1 flex items-center justify-center gap-6">
            {sequence.map((_, stepIndex) => {
              const isCurrent = stepIndex === currentIndex;
              const state = noteStates[stepIndex];

              return (
                <div key={stepIndex} className="w-14 flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
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
