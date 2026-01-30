import { NoteStep, Difficulty } from './music';

export type SongCategory = 'classical' | 'rock' | 'pop' | 'film' | 'metal' | 'blues' | 'french' | 'folk' | 'videogame' | 'latin' | 'jazz';

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: Difficulty;
  category: SongCategory;
  tempo: number;
  sequence: NoteStep[];
  description?: string;
}
