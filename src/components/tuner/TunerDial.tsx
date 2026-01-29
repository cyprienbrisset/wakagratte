'use client';

import { useMemo } from 'react';
import { TunerStatus } from '@/types/audio';

interface TunerDialProps {
  centsOff: number;
  status: TunerStatus;
  note: string | null;
}

export function TunerDial({ centsOff, status, note }: TunerDialProps) {
  const position = useMemo(() => {
    const clampedCents = Math.max(-50, Math.min(50, centsOff));
    return ((clampedCents + 50) / 100) * 100;
  }, [centsOff]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Note display */}
      <div className="text-center">
        <div
          className={`text-7xl font-bold tracking-tight transition-colors ${
            note
              ? status === 'in_tune'
                ? 'text-amber-500'
                : 'text-white'
              : 'text-gray-600'
          }`}
        >
          {note || '—'}
        </div>
        <div className={`text-sm mt-2 ${status === 'in_tune' && note ? 'text-amber-500' : 'text-gray-500'}`}>
          {!note
            ? 'Joue une note...'
            : status === 'in_tune'
              ? 'Parfait !'
              : `${centsOff > 0 ? '+' : ''}${centsOff} cents`}
        </div>
      </div>

      {/* Linear gauge */}
      <div className="w-full max-w-xs">
        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-3 px-1">
          <span>Grave</span>
          <span>Aigu</span>
        </div>

        {/* Track */}
        <div className="relative h-2 bg-[#1f2937] rounded-full overflow-hidden">
          {/* Center zone (green when in tune) */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-4 h-full transition-colors ${
              status === 'in_tune' && note ? 'bg-amber-500/30' : 'bg-transparent'
            }`}
          />

          {/* Center marker */}
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-600" />

          {/* Indicator */}
          {note && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-75 shadow-lg ${
                status === 'in_tune' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-white shadow-white/30'
              }`}
              style={{ left: `calc(${position}% - 8px)` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
