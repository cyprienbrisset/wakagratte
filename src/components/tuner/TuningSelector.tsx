'use client';

import { TuningName } from '@/types/music';
import { TUNINGS } from '@/lib/music/tunings';

interface TuningSelectorProps {
  selectedTuning: TuningName;
  onSelect: (tuning: TuningName) => void;
}

export function TuningSelector({ selectedTuning, onSelect }: TuningSelectorProps) {
  const tuningEntries = Object.entries(TUNINGS) as [TuningName, (typeof TUNINGS)[TuningName]][];

  return (
    <div className="flex flex-wrap gap-2">
      {tuningEntries.map(([name, tuning]) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedTuning === name
              ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/25'
              : 'bg-[#1f2937] text-gray-400 hover:text-white hover:bg-[#374151]'
          }`}
        >
          {tuning.label}
        </button>
      ))}
    </div>
  );
}
