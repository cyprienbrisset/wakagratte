'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ScrollingTablature } from '@/components/tablature/ScrollingTablature';
import { LoopControls } from '@/components/cheatcode/LoopControls';
import { TempoControls } from '@/components/cheatcode/TempoControls';
import { ScoreDisplay } from '@/components/stats/ScoreDisplay';
import { SessionSummary } from '@/components/stats/SessionSummary';
import { useMicrophone } from '@/hooks/useMicrophone';
import { usePitchDetection } from '@/hooks/usePitchDetection';
import { useCheatCodeValidation } from '@/hooks/useCheatCodeValidation';
import { useMetronome } from '@/hooks/useMetronome';
import { useStats } from '@/hooks/useStats';
import { getSongById } from '@/lib/music/songs';
import { CheatCode } from '@/types/music';

export default function PlaySongPage() {
  const params = useParams();
  const router = useRouter();
  const songId = params.songId as string;

  const song = useMemo(() => getSongById(songId) ?? null, [songId]);

  // Convert song to CheatCode format for validation hook compatibility
  const cheatCode: CheatCode | null = useMemo(() => {
    if (!song) return null;
    return {
      id: song.id,
      name: song.title,
      difficulty: song.difficulty,
      tempo: song.tempo,
      sequence: song.sequence,
      description: song.description,
    };
  }, [song]);

  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);

  // Stats tracking
  const { saveSession, getCodeStats } = useStats();
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const completionTimeRef = useRef<number>(0);
  const saveSessionRef = useRef(saveSession);
  saveSessionRef.current = saveSession;

  const { status: micStatus, stream, error, requestAccess, stopMicrophone } = useMicrophone();
  const { detectedNote, isListening, isOnset } = usePitchDetection(stream, {
    minClarity: 0.85,
    minVolume: 0.01,
  });

  const { currentIndex, noteStates, isComplete, isWaitingForNote, loopCount, score, streak, reset, validateNote } =
    useCheatCodeValidation(cheatCode, {
      loopStart,
      loopEnd,
      isOnset,
    });

  const {
    isPlaying: metronomeIsPlaying,
    currentBeat,
    tempo,
    start: startMetronome,
    stop: stopMetronome,
    setTempo,
  } = useMetronome(cheatCode?.tempo ?? 80);

  const toggleMetronome = () => {
    if (metronomeIsPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  useEffect(() => {
    if (detectedNote && isListening && !isComplete) {
      validateNote(detectedNote);
    }
  }, [detectedNote, isListening, isComplete, validateNote]);

  // Capture completion time when sequence completes
  useEffect(() => {
    if (isComplete && sessionStartTime) {
      completionTimeRef.current = Date.now() - sessionStartTime;
    }
  }, [isComplete, sessionStartTime]);

  // Save session when complete
  useEffect(() => {
    if (isComplete && !sessionSaved && sessionStartTime && cheatCode) {
      saveSessionRef.current({
        cheatCodeId: cheatCode.id,
        timestamp: Date.now(),
        score,
        accuracy: 100, // On ne compte que les succes
        completionTime: completionTimeRef.current,
        notesPlayed: cheatCode.sequence.length,
        notesCorrect: cheatCode.sequence.length,
      });
      setSessionSaved(true);
    }
  }, [isComplete, sessionSaved, sessionStartTime, cheatCode, score]);

  const handleStart = () => {
    requestAccess();
    setSessionStartTime(Date.now());
    setSessionSaved(false);
  };

  const handleReplay = () => {
    reset();
    setSessionSaved(false);
    setSessionStartTime(Date.now());
  };

  if (!song || !cheatCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Morceau non trouve</p>
          <Link href="/songs">
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#0d111c] border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/songs" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retour</span>
          </Link>
          <div className="text-center">
            <span className="text-sm font-semibold text-white">{song.title}</span>
            <p className="text-xs text-gray-500">{song.artist}</p>
          </div>
          <span className="text-sm text-amber-500 font-medium tabular-nums">
            {currentIndex}/{cheatCode.sequence.length}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Scrolling Tablature */}
        <div className="flex-1 flex items-center py-8 bg-[#0d111c]">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <ScrollingTablature
              sequence={cheatCode.sequence}
              currentIndex={currentIndex}
              noteStates={noteStates}
              visibleNotes={12}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0d111c] py-6">
          <div className="max-w-3xl mx-auto px-6">
            {isComplete ? (
              <SessionSummary
                score={score}
                totalNotes={cheatCode.sequence.length}
                completionTime={completionTimeRef.current}
                previousBest={getCodeStats(cheatCode.id)}
                onReplay={handleReplay}
                onNext={() => router.push('/songs')}
              />
            ) : (
              <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
                <div className="flex flex-col gap-4">
                  <LoopControls
                    sequenceLength={cheatCode.sequence.length}
                    loopStart={loopStart}
                    loopEnd={loopEnd}
                    onLoopChange={(start, end) => {
                      // Si les deux sont definis et start > end, ne pas accepter
                      if (start !== null && end !== null && start > end) {
                        return;
                      }
                      setLoopStart(start);
                      setLoopEnd(end);
                    }}
                    loopCount={loopCount}
                    disabled={!isListening}
                  />
                  <TempoControls
                    tempo={tempo}
                    onTempoChange={setTempo}
                    isPlaying={metronomeIsPlaying}
                    onToggle={toggleMetronome}
                    currentBeat={currentBeat}
                  />
                  {/* Score display when playing */}
                  {isListening && (
                    <div className="pb-4 border-b border-white/5 mb-4">
                      <ScoreDisplay
                        score={score}
                        streak={streak}
                        currentIndex={currentIndex}
                        totalNotes={cheatCode.sequence.length}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isListening && (
                        <>
                          <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-sm text-gray-400">
                            {detectedNote ? (
                              <span className="text-white font-medium">{detectedNote.note}{detectedNote.octave}</span>
                            ) : (
                              'En ecoute...'
                            )}
                          </span>
                          {isWaitingForNote ? (
                            <span className="text-sm text-amber-400 animate-pulse">En attente de la note...</span>
                          ) : (
                            <span className="text-sm text-emerald-400">Note validee!</span>
                          )}
                        </>
                      )}
                      {error && <span className="text-sm text-red-400">{error}</span>}
                    </div>

                    <div className="flex gap-3">
                      {currentIndex > 0 && (
                        <Button onClick={reset} variant="ghost" size="sm">
                          Reinitialiser
                        </Button>
                      )}
                      {!isListening ? (
                        <Button onClick={handleStart} disabled={micStatus === 'requesting'} size="sm">
                          {micStatus === 'requesting' ? 'Autorisation...' : 'Demarrer'}
                        </Button>
                      ) : (
                        <Button onClick={stopMicrophone} variant="secondary" size="sm">
                          Arreter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
