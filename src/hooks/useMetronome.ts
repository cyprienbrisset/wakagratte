'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseMetronomeReturn {
  isPlaying: boolean;
  currentBeat: number;
  tempo: number;
  start: () => void;
  stop: () => void;
  setTempo: (bpm: number) => void;
}

export function useMetronome(initialTempo: number = 80): UseMetronomeReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [tempo, setTempoState] = useState(initialTempo);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef<number>(0);

  // Jouer un click avec Web Audio API
  const playClick = useCallback(() => {
    if (!audioContextRef.current) return;

    // Resume if suspended (mobile browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Son court et sec
    osc.frequency.value = 800; // Hz
    osc.type = 'square';

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, []);

  const start = useCallback(() => {
    if (isPlaying) return;

    // Créer AudioContext au premier click (pour Safari/iOS)
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    setIsPlaying(true);
    setCurrentBeat(0);

    const intervalMs = 60000 / tempo;

    // Jouer le premier click immédiatement
    playClick();
    setCurrentBeat(1);

    intervalRef.current = setInterval(() => {
      playClick();
      setCurrentBeat((prev) => (prev % 4) + 1); // 1, 2, 3, 4, 1, 2, ...
    }, intervalMs);
  }, [isPlaying, tempo, playClick]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);

  const setTempo = useCallback((bpm: number) => {
    const clampedBpm = Math.max(40, Math.min(200, bpm));
    setTempoState(clampedBpm);

    // Si un interval existe, le redémarrer avec le nouveau tempo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      const intervalMs = 60000 / clampedBpm;
      intervalRef.current = setInterval(() => {
        playClick();
        setCurrentBeat((prev) => (prev % 4) + 1);
      }, intervalMs);
    }
  }, [playClick]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    currentBeat,
    tempo,
    start,
    stop,
    setTempo,
  };
}
