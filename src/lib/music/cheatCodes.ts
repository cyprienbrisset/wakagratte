import { CheatCode } from '@/types/music';
import cheatcodesData from '@/data/cheatcodes.json';

export function getAllCheatCodes(): CheatCode[] {
  return cheatcodesData.cheatcodes as CheatCode[];
}

export function getCheatCodeById(id: string): CheatCode | undefined {
  return getAllCheatCodes().find((code) => code.id === id);
}

export function getCheatCodesByDifficulty(difficulty: CheatCode['difficulty']): CheatCode[] {
  return getAllCheatCodes().filter((code) => code.difficulty === difficulty);
}
