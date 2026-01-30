export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface SingleNote {
  string: StringNumber;
  fret: number;
}

// Un NoteStep peut être une note simple ou un double stop (2+ notes jouées ensemble)
export type NoteStep = SingleNote[];

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CheatCodeCategory = 'basics' | 'riffs' | 'chords' | 'scales';

export interface CheatCode {
  id: string;
  name: string;
  difficulty: Difficulty;
  tempo: number;
  sequence: NoteStep[];
  description?: string;
  category?: CheatCodeCategory;
  tags?: string[];
}

export type NoteState = 'waiting' | 'active' | 'success' | 'error';

export interface SequenceState {
  currentIndex: number;
  states: NoteState[];
  isComplete: boolean;
  score: number;
}

export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface Note {
  name: NoteName;
  octave: number;
  frequency: number;
}

export type TuningName = 'standard' | 'dropD' | 'openG' | 'openD' | 'halfStepDown';

export interface Tuning {
  name: TuningName;
  label: string;
  notes: string[];
}
