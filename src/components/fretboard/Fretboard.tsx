'use client';

import { NoteStep, NoteState, StringNumber } from '@/types/music';

interface FretboardProps {
  sequence: NoteStep[];
  currentIndex: number;
  noteStates: NoteState[];
  maxFret?: number;
}

// Notes à vide pour chaque corde (accordage standard)
const STRING_NOTES: Record<StringNumber, string> = {
  1: 'E',
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E',
};

export function Fretboard({ sequence, currentIndex, noteStates, maxFret = 7 }: FretboardProps) {
  const frets = Array.from({ length: maxFret + 1 }, (_, i) => i);
  const strings: StringNumber[] = [1, 2, 3, 4, 5, 6];

  // Retourne tous les indices des steps qui contiennent cette position
  const getNotesAtPosition = (stringNum: StringNumber, fret: number): number[] => {
    const indices: number[] = [];
    for (let i = 0; i < sequence.length; i++) {
      const step = sequence[i];
      const isInStep = step.some((note) => note.string === stringNum && note.fret === fret);
      if (isInStep) {
        indices.push(i);
      }
    }
    return indices;
  };

  // Retourne l'index le plus pertinent à afficher (priorité: actuel > prochain > passé)
  const getMostRelevantIndex = (indices: number[]): number | null => {
    if (indices.length === 0) return null;

    // Si l'index actuel est dans la liste, le retourner
    if (indices.includes(currentIndex)) return currentIndex;

    // Sinon, retourner le prochain index non joué
    const futureIndices = indices.filter(i => i > currentIndex);
    if (futureIndices.length > 0) return Math.min(...futureIndices);

    // Sinon, retourner le dernier joué
    return Math.max(...indices);
  };

  const getMarkerStyle = (noteIndex: number): string => {
    const state = noteStates[noteIndex];
    const isCurrent = noteIndex === currentIndex;

    if (isCurrent) {
      return 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/50 scale-110';
    }
    if (state === 'success') {
      return 'bg-emerald-500/80 text-white';
    }
    // Notes futures (waiting)
    return 'bg-[#374151] text-gray-400';
  };

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="min-w-[700px] flex items-center">
        {/* Tête de guitare (Headstock) */}
        <div className="relative flex-shrink-0 w-24">
          {/* Forme de la tête */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1810] via-[#3d2317] to-[#2a1810] rounded-l-3xl"
               style={{ clipPath: 'polygon(30% 0%, 100% 5%, 100% 95%, 30% 100%, 0% 85%, 0% 15%)' }} />

          {/* Mécaniques (tuning pegs) */}
          <div className="relative z-10 flex flex-col justify-between h-full py-2">
            {strings.map((stringNum) => (
              <div key={stringNum} className="flex items-center justify-end pr-1 h-10">
                {/* Mécanique */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-amber-500/60 font-medium">{STRING_NOTES[stringNum]}</span>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#c9a227] via-[#d4af37] to-[#996515] shadow-md" />
                  <div className="w-2 h-1 bg-[#888] rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sillet (Nut) */}
        <div className="flex-shrink-0 w-2 bg-gradient-to-b from-[#f5f5dc] via-[#fffef0] to-[#f5f5dc] rounded-sm shadow-md self-stretch" />

        {/* Manche (Neck) avec frettes */}
        <div className="flex-1 relative">
          {/* Fond du manche en bois */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1209] via-[#2d1f0f] to-[#1a1209] rounded-r-lg" />

          {/* Indicateurs AIGU / GRAVE */}
          <div className="absolute -top-6 left-0 right-0 flex justify-between px-4">
            <span className="text-[10px] text-amber-500/50 font-medium tracking-wider">AIGU</span>
          </div>
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-4">
            <span className="text-[10px] text-amber-500/50 font-medium tracking-wider">GRAVE</span>
          </div>

          {/* Numéros de frettes */}
          <div className="absolute -top-5 left-0 right-0 flex">
            {frets.map((fret) => (
              <div key={fret} className="flex-1 text-center text-[10px] text-gray-600 font-mono">
                {fret === 0 ? '' : fret}
              </div>
            ))}
          </div>

          {/* Cordes et frettes */}
          <div className="relative">
            {strings.map((stringNum, stringIndex) => (
              <div key={stringNum} className="flex items-center h-10 relative">
                {/* Frets */}
                {frets.map((fret) => {
                  const noteIndices = getNotesAtPosition(stringNum, fret);
                  const noteIndex = getMostRelevantIndex(noteIndices);
                  const hasNote = noteIndex !== null;

                  return (
                    <div
                      key={fret}
                      className="flex-1 h-full relative flex items-center justify-center"
                    >
                      {/* Frette métallique */}
                      {fret > 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#c0c0c0] via-[#e8e8e8] to-[#c0c0c0] shadow-sm" />
                      )}

                      {/* Corde */}
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                        <div
                          className="w-full shadow-sm"
                          style={{
                            height: `${1 + stringIndex * 0.6}px`,
                            background: stringIndex < 3
                              ? 'linear-gradient(180deg, #e8e8e8 0%, #b8b8b8 50%, #888888 100%)'
                              : 'linear-gradient(180deg, #d4a574 0%, #c9a227 50%, #8b6914 100%)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>

                      {/* Marqueurs de position (dots) */}
                      {[3, 5, 7, 9].includes(fret) && stringNum === 3 && (
                        <div className="absolute w-3 h-3 rounded-full bg-[#f5f5dc] opacity-60 shadow-inner" />
                      )}
                      {fret === 12 && (stringNum === 2 || stringNum === 4) && (
                        <div className="absolute w-3 h-3 rounded-full bg-[#f5f5dc] opacity-60 shadow-inner" />
                      )}

                      {/* Note marker */}
                      {hasNote && noteIndex !== null && (
                        <div
                          className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${getMarkerStyle(noteIndex)}`}
                        >
                          {noteIndices.length > 1
                            ? noteIndices.map(i => i + 1).join('·')
                            : noteIndex + 1
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Corps de la guitare (suggestion) */}
        <div className="flex-shrink-0 w-16 relative self-stretch">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#2a1810] to-[#1a0f08]"
            style={{
              clipPath: 'polygon(0% 0%, 60% 0%, 100% 20%, 100% 80%, 60% 100%, 0% 100%)',
              borderRadius: '0 20px 20px 0'
            }}
          />
          {/* Rosace suggérée */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#3d2317] bg-[#0a0605]" />
        </div>
      </div>
    </div>
  );
}
