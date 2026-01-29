import { Tuning, TuningName } from '@/types/music';

export const TUNINGS: Record<TuningName, Tuning> = {
  standard: {
    name: 'standard',
    label: 'Standard',
    notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  dropD: {
    name: 'dropD',
    label: 'Drop D',
    notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  openG: {
    name: 'openG',
    label: 'Open G',
    notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
  },
  openD: {
    name: 'openD',
    label: 'Open D',
    notes: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
  },
  halfStepDown: {
    name: 'halfStepDown',
    label: 'Half Step Down',
    notes: ['D#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
  },
};

export const DEFAULT_TUNING: TuningName = 'standard';

export function getTuningFrequencies(tuningName: TuningName): number[] {
  const tuning = TUNINGS[tuningName];
  if (!tuning) return [];

  return tuning.notes.map((noteStr) => {
    const match = noteStr.match(/^([A-G]#?)(\d)$/);
    if (!match) return 0;

    const note = match[1];
    const octave = parseInt(match[2], 10);
    const noteIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(note);
    const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
    return 440 * Math.pow(2, semitonesFromA4 / 12);
  });
}

export function getStringNote(tuningName: TuningName, stringNumber: number): string {
  const tuning = TUNINGS[tuningName];
  if (!tuning) return '';
  // stringNumber 1 = corde la plus aiguë (index 5), stringNumber 6 = corde la plus grave (index 0)
  return tuning.notes[6 - stringNumber] || '';
}
