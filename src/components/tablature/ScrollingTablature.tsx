'use client';

import { useMemo, useRef, useEffect } from 'react';
import { NoteStep, NoteState } from '@/types/music';

interface ScrollingTablatureProps {
  sequence: NoteStep[];
  currentIndex: number;
  noteStates: NoteState[];
  visibleNotes?: number; // Nombre de notes visibles
}

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];

export function ScrollingTablature({
  sequence,
  currentIndex,
  noteStates,
  visibleNotes = 12
}: ScrollingTablatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcul des notes à afficher (fenêtre glissante)
  const { visibleSequence, startIndex } = useMemo(() => {
    // La note courante est à la position 0 (gauche)
    const start = currentIndex;
    const end = Math.min(start + visibleNotes, sequence.length);

    return {
      visibleSequence: sequence.slice(start, end),
      startIndex: start,
    };
  }, [sequence, currentIndex, visibleNotes]);

  // Créer une map des notes par position et corde
  const noteGrid = useMemo(() => {
    const grid: Map<number, Map<number, { fret: number; state: NoteState; isCurrent: boolean }>> = new Map();

    visibleSequence.forEach((step, relativeIndex) => {
      const absoluteIndex = startIndex + relativeIndex;
      const state = noteStates[absoluteIndex];
      const isCurrent = absoluteIndex === currentIndex;

      step.forEach((note) => {
        if (!grid.has(relativeIndex)) {
          grid.set(relativeIndex, new Map());
        }
        grid.get(relativeIndex)!.set(note.string, { fret: note.fret, state, isCurrent });
      });
    });

    return grid;
  }, [visibleSequence, startIndex, noteStates, currentIndex]);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="bg-[#0d1420] rounded-xl p-6 border border-white/10"
      >
        {/* Tablature grid */}
        <div className="relative">
          {/* Strings (6 cordes) */}
          {STRING_NAMES.map((stringName, stringIndex) => {
            const stringNum = stringIndex + 1; // 1-6

            return (
              <div key={stringIndex} className="flex items-center h-10">
                {/* String name */}
                <div className="w-8 text-sm font-semibold text-amber-500">
                  {stringName}
                </div>

                {/* String line with notes */}
                <div className="flex-1 relative flex items-center">
                  {/* Dashed line */}
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-600" />

                  {/* Notes */}
                  <div className="flex gap-0 relative z-10 w-full">
                    {Array.from({ length: visibleNotes }, (_, colIndex) => {
                      const noteData = noteGrid.get(colIndex)?.get(stringNum);

                      return (
                        <div
                          key={colIndex}
                          className="flex-1 flex items-center justify-center"
                        >
                          {noteData ? (
                            <div
                              className={`
                                w-9 h-9 rounded-full flex items-center justify-center
                                text-sm font-bold transition-all duration-200
                                ${noteData.isCurrent
                                  ? 'bg-amber-500 text-gray-900 ring-4 ring-amber-500/30 shadow-lg shadow-amber-500/50'
                                  : noteData.state === 'success'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-700/80 text-gray-300'
                                }
                              `}
                            >
                              {noteData.fret}
                            </div>
                          ) : (
                            <div className="w-9 h-9" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Position indicators */}
        <div className="flex mt-4 pl-8">
          {Array.from({ length: visibleNotes }, (_, i) => {
            const absoluteIndex = startIndex + i;
            const isCurrent = absoluteIndex === currentIndex;
            const isPlayed = noteStates[absoluteIndex] === 'success';

            return (
              <div key={i} className="flex-1 flex justify-center">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center
                    text-xs font-semibold transition-all
                    ${isCurrent
                      ? 'bg-amber-500 text-gray-900'
                      : isPlayed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-800 text-gray-500'
                    }
                  `}
                >
                  {absoluteIndex + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500" />
            <span className="text-sm text-gray-400">À jouer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-400">Joué</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-700" />
            <span className="text-sm text-gray-400">À venir</span>
          </div>
        </div>
      </div>
    </div>
  );
}
