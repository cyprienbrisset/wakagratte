'use client';

import { TuningName } from '@/types/music';
import { getStringNote } from '@/lib/music/tunings';

interface GuitarVisualizerProps {
  tuning: TuningName;
  activeString: number | null;
  tunedStrings: boolean[];
}

// Notes à vide pour chaque corde (accordage standard)
const STRING_NOTES: Record<number, string> = {
  1: 'E',
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E',
};

// Cordes de haut en bas : E aigu (1) à E grave (6)
const STRINGS = [1, 2, 3, 4, 5, 6] as const;

export function GuitarVisualizer({ tuning, activeString, tunedStrings }: GuitarVisualizerProps) {
  const getStringStyle = (stringNum: number, index: number) => {
    const isActive = activeString === stringNum;
    const isTuned = tunedStrings[stringNum - 1];
    const thickness = 1 + index * 0.6;

    let strokeColor = index < 3 ? '#b8b8b8' : '#c9a227';
    let opacity = 0.4 + index * 0.1;

    if (isActive) {
      strokeColor = '#f59e0b';
      opacity = 1;
    } else if (isTuned) {
      strokeColor = '#f59e0b';
      opacity = 0.7;
    }

    return { strokeColor, opacity, thickness };
  };

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="min-w-[500px] flex items-center">
        {/* Tête de guitare (Headstock) - à gauche */}
        <div className="relative flex-shrink-0 w-20">
          {/* Forme de la tête */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#2a1810] via-[#3d2317] to-[#2a1810] rounded-l-3xl"
            style={{ clipPath: 'polygon(30% 0%, 100% 5%, 100% 95%, 30% 100%, 0% 85%, 0% 15%)' }}
          />

          {/* Mécaniques (tuning pegs) */}
          <div className="relative z-10 flex flex-col justify-between h-full py-1">
            {STRINGS.map((stringNum, index) => {
              const isActive = activeString === stringNum;
              const isTuned = tunedStrings[stringNum - 1];
              const noteStr = getStringNote(tuning, stringNum);

              return (
                <div key={stringNum} className="flex items-center justify-end pr-1 h-8">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold transition-colors ${
                        isActive ? 'text-amber-500' : isTuned ? 'text-amber-500/70' : 'text-amber-500/40'
                      }`}
                    >
                      {noteStr.replace(/\d/, '')}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full shadow-md transition-all ${
                        isActive
                          ? 'bg-amber-500 shadow-amber-500/50'
                          : 'bg-gradient-to-br from-[#c9a227] via-[#d4af37] to-[#996515]'
                      }`}
                    />
                    <div className="w-2 h-1 bg-[#888] rounded-sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sillet (Nut) */}
        <div className="flex-shrink-0 w-2 bg-gradient-to-b from-[#f5f5dc] via-[#fffef0] to-[#f5f5dc] rounded-sm shadow-md self-stretch" />

        {/* Manche (Neck) avec frettes */}
        <div className="flex-1 relative">
          {/* Fond du manche en bois */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1209] via-[#2d1f0f] to-[#1a1209] rounded-r-lg" />

          {/* Indicateurs AIGU / GRAVE */}
          <div className="absolute -top-5 left-0 right-0 flex justify-between px-4">
            <span className="text-[10px] text-amber-500/50 font-medium tracking-wider">AIGU</span>
          </div>
          <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-4">
            <span className="text-[10px] text-amber-500/50 font-medium tracking-wider">GRAVE</span>
          </div>

          {/* Cordes et frettes */}
          <div className="relative">
            {STRINGS.map((stringNum, stringIndex) => {
              const { strokeColor, opacity, thickness } = getStringStyle(stringNum, stringIndex);
              const isActive = activeString === stringNum;

              return (
                <div key={stringNum} className="flex items-center h-8 relative">
                  {/* Frettes */}
                  {[0, 1, 2, 3, 4, 5].map((fret) => (
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
                          className="w-full shadow-sm transition-all"
                          style={{
                            height: `${thickness}px`,
                            background: strokeColor,
                            opacity: opacity,
                            boxShadow: isActive ? `0 0 8px ${strokeColor}` : '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        />
                      </div>

                      {/* Marqueurs de position (dots) */}
                      {[3, 5].includes(fret) && stringNum === 3 && (
                        <div className="absolute w-3 h-3 rounded-full bg-[#f5f5dc] opacity-60 shadow-inner" />
                      )}
                    </div>
                  ))}

                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500/20 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Corps de la guitare (suggestion) - à droite */}
        <div className="flex-shrink-0 w-14 relative self-stretch">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#2a1810] to-[#1a0f08]"
            style={{
              clipPath: 'polygon(0% 0%, 60% 0%, 100% 20%, 100% 80%, 60% 100%, 0% 100%)',
              borderRadius: '0 20px 20px 0'
            }}
          />
          {/* Rosace suggérée */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-[#3d2317] bg-[#0a0605]" />
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <span>Accordée</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#c9a227]/50" />
          <span>À accorder</span>
        </div>
      </div>
    </div>
  );
}
