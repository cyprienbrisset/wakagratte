import { Song, SongCategory } from '@/types/song';
import songsData from '@/data/songs.json';

export function getAllSongs(): Song[] {
  return songsData.songs as Song[];
}

export function getSongById(id: string): Song | undefined {
  return getAllSongs().find((song) => song.id === id);
}

export function getSongsByCategory(category: SongCategory): Song[] {
  return getAllSongs().filter((song) => song.category === category);
}

export function getSongsByDifficulty(difficulty: Song['difficulty']): Song[] {
  return getAllSongs().filter((song) => song.difficulty === difficulty);
}
