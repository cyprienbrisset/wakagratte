'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllSongs } from '@/lib/music/songs';
import { getAllCheatCodes } from '@/lib/music/cheatCodes';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const songs = getAllSongs();
  const cheatCodes = getAllCheatCodes();

  const filteredSongs = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCodes = cheatCodes.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Recherche</h1>

        {/* Search input */}
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un morceau ou un cours..."
            className="w-full px-4 py-3 pl-12 bg-[#151a28] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {query && (
          <>
            {/* Songs results */}
            {filteredSongs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Morceaux</h2>
                <div className="space-y-2">
                  {filteredSongs.map(song => (
                    <Link
                      key={song.id}
                      href={`/songs/${song.id}`}
                      className="block p-4 bg-[#151a28] rounded-xl hover:bg-[#1a2035] transition-colors"
                    >
                      <div className="font-medium text-white">{song.title}</div>
                      <div className="text-sm text-gray-500">{song.artist}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cheat codes results */}
            {filteredCodes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Cours</h2>
                <div className="space-y-2">
                  {filteredCodes.map(code => (
                    <Link
                      key={code.id}
                      href={`/play/${code.id}`}
                      className="block p-4 bg-[#151a28] rounded-xl hover:bg-[#1a2035] transition-colors"
                    >
                      <div className="font-medium text-white">{code.name}</div>
                      <div className="text-sm text-gray-500">{code.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredSongs.length === 0 && filteredCodes.length === 0 && (
              <p className="text-gray-500 text-center">Aucun resultat pour &quot;{query}&quot;</p>
            )}
          </>
        )}

        {!query && (
          <p className="text-gray-500 text-center">Tape quelque chose pour rechercher...</p>
        )}
      </div>
    </div>
  );
}
