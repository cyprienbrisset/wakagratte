import { NoteName } from '@/types/music';

export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const A4_FREQUENCY = 440;

export function noteToFrequency(note: NoteName, octave: number): number {
  const noteIndex = NOTE_NAMES.indexOf(note);
  const a4Index = NOTE_NAMES.indexOf('A');
  const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - a4Index);
  return A4_FREQUENCY * Math.pow(2, semitonesFromA4 / 12);
}

export function frequencyToNote(frequency: number): { note: NoteName; octave: number; cents: number } {
  const semitonesFromA4 = 12 * Math.log2(frequency / A4_FREQUENCY);
  const roundedSemitones = Math.round(semitonesFromA4);
  const cents = Math.round((semitonesFromA4 - roundedSemitones) * 100);

  const a4Index = NOTE_NAMES.indexOf('A');
  const noteIndex = ((roundedSemitones % 12) + a4Index + 12) % 12;
  const octave = 4 + Math.floor((roundedSemitones + a4Index) / 12);

  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    cents,
  };
}

export function getNoteDisplayName(note: NoteName): string {
  return note.replace('#', '♯');
}

export function parseNoteString(noteString: string): { note: NoteName; octave: number } | null {
  const match = noteString.match(/^([A-G]#?)(\d)$/);
  if (!match) return null;

  return {
    note: match[1] as NoteName,
    octave: parseInt(match[2], 10),
  };
}

// Fréquences des cordes à vide en accordage standard
export const STANDARD_TUNING_FREQUENCIES: Record<number, number> = {
  6: 82.41,   // E2
  5: 110.00,  // A2
  4: 146.83,  // D3
  3: 196.00,  // G3
  2: 246.94,  // B3
  1: 329.63,  // E4
};

// Mapping corde + frette vers fréquence
export function getFretFrequency(stringNumber: number, fret: number): number {
  const openStringFreq = STANDARD_TUNING_FREQUENCIES[stringNumber];
  if (!openStringFreq) return 0;
  return openStringFreq * Math.pow(2, fret / 12);
}

// Mapping corde + frette vers note
export function getFretNote(stringNumber: number, fret: number): { note: NoteName; octave: number } {
  const frequency = getFretFrequency(stringNumber, fret);
  const { note, octave } = frequencyToNote(frequency);
  return { note, octave };
}
