'use client';

import { NoteStep, NoteState } from '@/types/music';

interface SequenceProgressProps {
  sequence: NoteStep[];
  currentIndex: number;
  noteStates: NoteState[];
}

export function SequenceProgress({ sequence, currentIndex, noteStates }: SequenceProgressProps) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {sequence.map((step, index) => {
        const state = noteStates[index];
        const isCurrent = index === currentIndex;
        const isDoubleStop = step.length > 1;

        return (
          <div
            key={index}
            className={`min-w-14 h-14 px-2 rounded-2xl flex flex-col items-center justify-center font-mono text-xs transition-all ${
              isCurrent
                ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 scale-110'
                : state === 'success'
                  ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                  : 'bg-[#1f2937] text-gray-500'
            }`}
          >
            {isDoubleStop ? (
              <div className="flex flex-col items-center gap-0.5">
                {step.map((note, noteIdx) => (
                  <span key={noteIdx} className="font-semibold leading-tight">
                    {note.string}-{note.fret}
                  </span>
                ))}
              </div>
            ) : (
              <span className="font-semibold">{step[0].string}-{step[0].fret}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
