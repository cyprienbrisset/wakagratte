'use client';

import Link from 'next/link';
import { getAllSongs } from '@/lib/music/songs';
import { SongCategory, Song } from '@/types/song';
import { Difficulty } from '@/types/music';
import { useRef } from 'react';

const CATEGORY_GRADIENTS: Record<SongCategory, string> = {
  classical: 'from-indigo-500 to-purple-700',
  rock: 'from-red-500 to-orange-600',
  popular: 'from-pink-500 to-rose-600',
  film: 'from-amber-500 to-yellow-600',
  jazz: 'from-teal-500 to-cyan-600',
};

const DIFFICULTY_DOTS: Record<Difficulty, { count: number; colors: string }> = {
  easy: { count: 1, colors: 'bg-emerald-500' },
  medium: { count: 2, colors: 'bg-amber-500' },
  hard: { count: 3, colors: 'bg-red-500' },
};

interface SongRowProps {
  title: string;
  songs: Song[];
  showAll?: boolean;
}

function SongRow({ title, songs, showAll }: SongRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (songs.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {showAll && (
          <button className="text-amber-500 text-sm hover:underline">Tout afficher</button>
        )}
      </div>

      <div className="relative group">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Songs row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/songs/${song.id}`}
              className="flex-shrink-0 w-44 group/card"
            >
              {/* Thumbnail */}
              <div className={`w-44 h-44 rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENTS[song.category]} relative overflow-hidden mb-3`}>
                {/* Decorative music icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Difficulty dots */}
              <div className="flex gap-1 mb-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < DIFFICULTY_DOTS[song.difficulty].count
                        ? DIFFICULTY_DOTS[song.difficulty].colors
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* Title and artist */}
              <h3 className="font-medium text-white text-sm truncate group-hover/card:text-amber-500 transition-colors">
                {song.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">{song.artist}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SongsPage() {
  const allSongs = getAllSongs();

  // Group by category
  const classical = allSongs.filter(s => s.category === 'classical');
  const film = allSongs.filter(s => s.category === 'film');
  const rock = allSongs.filter(s => s.category === 'rock');
  const popular = allSongs.filter(s => s.category === 'popular');
  const easy = allSongs.filter(s => s.difficulty === 'easy');

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Morceaux</h1>
        <p className="text-gray-400">Apprends tes morceaux preferes a la guitare</p>
      </div>

      {/* Song rows by category */}
      <SongRow title="Chansons faciles" songs={easy} showAll />
      <SongRow title="Classique" songs={classical} showAll />
      <SongRow title="Musiques de film" songs={film} showAll />
      <SongRow title="Rock" songs={rock} showAll />
      <SongRow title="Populaire" songs={popular} showAll />
    </div>
  );
}
