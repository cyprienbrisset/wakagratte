'use client';

import { useMemo } from 'react';
import { TunerStatus } from '@/types/audio';

interface TunerDialProps {
  centsOff: number;
  status: TunerStatus;
  note: string | null;
  frequency?: number;
  activeString?: number | null;
}

const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export function TunerDial({ centsOff, status, note, frequency, activeString }: TunerDialProps) {
  // Angle de l'aiguille: -90° (gauche) à +90° (droite), 0° = centre
  const needleAngle = useMemo(() => {
    const clampedCents = Math.max(-50, Math.min(50, centsOff));
    return (clampedCents / 50) * 45; // ±45° max
  }, [centsOff]);

  // Trouver l'index de la note actuelle pour afficher les notes voisines
  const noteIndex = useMemo(() => {
    if (!note) return -1;
    const baseNote = note.replace('♯', '#').replace('♭', 'b');
    return NOTES.findIndex(n => n.replace('♯', '#') === baseNote || n === baseNote.charAt(0));
  }, [note]);

  // Notes à afficher sur le cadran (5 notes centrées sur la note actuelle)
  const displayNotes = useMemo(() => {
    if (noteIndex === -1) return ['', '', '—', '', ''];
    const notes: string[] = [];
    for (let i = -2; i <= 2; i++) {
      const idx = (noteIndex + i + 12) % 12;
      notes.push(NOTES[idx]);
    }
    return notes;
  }, [noteIndex]);

  return (
    <div className="flex flex-col items-center">
      {/* Cadran semi-circulaire */}
      <div className="relative w-72 h-40 overflow-hidden">
        {/* Fond du cadran */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f2e] to-[#0d111c] rounded-t-full border border-white/10 border-b-0" />

        {/* Graduations */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 160">
          {/* Graduations fines */}
          {Array.from({ length: 41 }, (_, i) => {
            const angle = -90 + (i * 180) / 40;
            const radian = (angle * Math.PI) / 180;
            const isMain = i % 10 === 0;
            const isMid = i % 5 === 0;
            const innerR = isMain ? 95 : isMid ? 100 : 105;
            const outerR = 115;
            const x1 = 144 + innerR * Math.cos(radian);
            const y1 = 150 + innerR * Math.sin(radian);
            const x2 = 144 + outerR * Math.cos(radian);
            const y2 = 150 + outerR * Math.sin(radian);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMain ? '#6b7280' : '#374151'}
                strokeWidth={isMain ? 2 : 1}
              />
            );
          })}

          {/* Notes sur l'arc */}
          {displayNotes.map((n, i) => {
            const angle = -60 + i * 30; // -60, -30, 0, 30, 60
            const radian = (angle * Math.PI) / 180;
            const r = 75;
            const x = 144 + r * Math.cos(radian);
            const y = 150 + r * Math.sin(radian);
            const isCenter = i === 2;
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-sm font-semibold ${
                  isCenter ? 'fill-white' : 'fill-gray-500'
                }`}
                style={{ fontSize: isCenter ? '18px' : '14px' }}
              >
                {n}
              </text>
            );
          })}
        </svg>

        {/* Indicateur "in tune" en haut */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <div
            className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] transition-colors ${
              status === 'in_tune' && note ? 'border-t-emerald-500' : 'border-t-gray-600'
            }`}
          />
        </div>

        {/* Symboles bémol et dièse */}
        <div className="absolute top-4 left-8 text-gray-500 text-xl font-serif">♭</div>
        <div className="absolute top-4 right-8 text-gray-500 text-xl font-serif">♯</div>

        {/* Aiguille */}
        <div
          className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-100"
          style={{ transform: `translateX(-50%) rotate(${needleAngle}deg)` }}
        >
          <div className="w-1 h-28 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-full shadow-lg shadow-amber-500/30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
        </div>

        {/* Centre du pivot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-[#1f2937] rounded-full border-2 border-gray-600" />
      </div>

      {/* Affichage fréquence */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-mono text-amber-500">
          {frequency ? `${frequency.toFixed(1)}` : '—'}
          <span className="text-sm text-amber-500/70 ml-1">Hz</span>
        </div>
      </div>

      {/* Indicateur de corde */}
      <div className="mt-4 flex gap-2">
        {[6, 5, 4, 3, 2, 1].map((string) => (
          <div
            key={string}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
              activeString === string
                ? 'bg-amber-500 text-gray-900'
                : 'bg-[#1f2937] text-gray-500'
            }`}
          >
            {string}
          </div>
        ))}
      </div>

      {/* Status text */}
      <div className={`mt-4 text-sm font-medium ${
        status === 'in_tune' && note ? 'text-emerald-500' : 'text-gray-500'
      }`}>
        {!note
          ? 'Joue une note...'
          : status === 'in_tune'
            ? 'Accordé !'
            : status === 'flat'
              ? 'Trop grave'
              : 'Trop aigu'}
      </div>
    </div>
  );
}
