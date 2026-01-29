'use client';

import { TuningName } from '@/types/music';
import { getStringNote } from '@/lib/music/tunings';

interface StringIndicatorProps {
  tuning: TuningName;
  activeString: number | null;
  tunedStrings: boolean[];
}

export function StringIndicator({ tuning, activeString, tunedStrings }: StringIndicatorProps) {
  const strings = [6, 5, 4, 3, 2, 1];

  return (
    <div className="flex gap-3 justify-center">
      {strings.map((stringNum) => {
        const note = getStringNote(tuning, stringNum);
        const isActive = activeString === stringNum;
        const isTuned = tunedStrings[stringNum - 1];

        return (
          <div
            key={stringNum}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              isActive
                ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 scale-110'
                : isTuned
                  ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                  : 'bg-[#1f2937] text-gray-500'
            }`}
          >
            {note.replace(/\d/, '')}
          </div>
        );
      })}
    </div>
  );
}
