'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CheatCode, NoteState, NoteStep, SingleNote } from '@/types/music';
import { DetectedNote } from '@/types/audio';
import { getFretFrequency } from '@/lib/music/notes';

interface UseCheatCodeValidationOptions {
  pitchTolerance?: number; // cents
  timingTolerance?: number; // ms
  loopStart?: number | null;  // index de début (inclus), null = pas de loop
  loopEnd?: number | null;    // index de fin (inclus)
  isOnset?: boolean;  // true si une nouvelle attaque est détectée
}

interface UseCheatCodeValidationReturn {
  currentIndex: number;
  noteStates: NoteState[];
  isComplete: boolean;
  score: number;
  streak: number;
  isWaitingForNote: boolean;
  loopCount: number;  // nombre de loops complétés
  validateNote: (detectedNote: DetectedNote | null) => void;
  reset: () => void;
}

export function useCheatCodeValidation(
  cheatCode: CheatCode | null,
  options: UseCheatCodeValidationOptions = {}
): UseCheatCodeValidationReturn {
  const { pitchTolerance = 40, loopStart = null, loopEnd = null, isOnset = false } = options; // 40 cents = moins d'un demi-ton

  const sequenceLength = cheatCode?.sequence.length || 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [noteStates, setNoteStates] = useState<NoteState[]>(() =>
    Array(sequenceLength).fill('waiting')
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastValidatedTime, setLastValidatedTime] = useState(0);
  const [isWaitingForNote, setIsWaitingForNote] = useState(true);
  const [loopCount, setLoopCount] = useState(0);
  const waitingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedNoteRef = useRef<{ string: number; fret: number } | null>(null);
  const needsNewOnsetRef = useRef<boolean>(false);
  const lastOnsetRef = useRef<boolean>(false);

  // Reset when cheatCode changes
  useEffect(() => {
    setCurrentIndex(0);
    setNoteStates(Array(sequenceLength).fill('waiting'));
    setScore(0);
    setStreak(0);
    setLastValidatedTime(0);
    setIsWaitingForNote(true);
    setLoopCount(0);
  }, [cheatCode?.id, sequenceLength]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
      }
    };
  }, []);

  const isLoopActive = loopStart !== null && loopEnd !== null;

  const isComplete = useMemo(() => {
    // Never complete when loop is active
    if (isLoopActive) return false;
    return currentIndex >= sequenceLength && sequenceLength > 0;
  }, [currentIndex, sequenceLength, isLoopActive]);

  // Vérifie si la note détectée correspond à l'une des notes du groupe (double stop)
  const checkNoteMatch = useCallback(
    (detectedNote: DetectedNote, targetStep: NoteStep): { isMatch: boolean; matchedNote: SingleNote | null } => {
      for (const note of targetStep) {
        const targetFrequency = getFretFrequency(note.string, note.fret);
        const centsOff = 1200 * Math.log2(detectedNote.frequency / targetFrequency);
        if (Math.abs(centsOff) <= pitchTolerance) {
          return { isMatch: true, matchedNote: note };
        }
      }
      return { isMatch: false, matchedNote: null };
    },
    [pitchTolerance]
  );

  // Détecte si la note courante est identique à la précédente
  const isRepeatedNote = useCallback(
    (currentStep: NoteStep): boolean => {
      if (!lastValidatedNoteRef.current || currentIndex === 0) return false;

      // Vérifie si une des notes du step correspond à la dernière note validée
      return currentStep.some(
        (note) =>
          note.string === lastValidatedNoteRef.current!.string &&
          note.fret === lastValidatedNoteRef.current!.fret
      );
    },
    [currentIndex]
  );

  const validateNote = useCallback(
    (detectedNote: DetectedNote | null) => {
      if (!cheatCode || isComplete || !detectedNote) return;

      const now = Date.now();

      const currentStep = cheatCode.sequence[currentIndex];
      if (!currentStep || currentStep.length === 0) return;

      const { isMatch, matchedNote } = checkNoteMatch(detectedNote, currentStep);

      // Vérifie si c'est une note répétée
      const isRepeat = isRepeatedNote(currentStep);

      // Pour les notes répétées, on doit détecter une nouvelle attaque
      if (isRepeat && needsNewOnsetRef.current) {
        // Détection de front montant sur isOnset
        const onsetRising = isOnset && !lastOnsetRef.current;
        lastOnsetRef.current = isOnset;

        if (!onsetRising) {
          // Pas encore de nouvelle attaque détectée
          return;
        }
        // Nouvelle attaque détectée, on peut continuer
        needsNewOnsetRef.current = false;
      }

      lastOnsetRef.current = isOnset;

      // Prevent rapid-fire validations (debounce) - reduced to 80ms
      if (now - lastValidatedTime < 80) return;

      if (isMatch && matchedNote) {
        // Success!
        // Mémorise la note validée pour la détection des répétitions
        lastValidatedNoteRef.current = { string: matchedNote.string, fret: matchedNote.fret };

        // Vérifie si la prochaine note est identique (pour demander une nouvelle attaque)
        const nextIndex = currentIndex + 1;
        if (nextIndex < cheatCode.sequence.length) {
          const nextStep = cheatCode.sequence[nextIndex];
          const nextIsRepeat = nextStep.some(
            (note) =>
              note.string === matchedNote.string && note.fret === matchedNote.fret
          );
          if (nextIsRepeat) {
            needsNewOnsetRef.current = true;
          }
        }

        setNoteStates((prev) => {
          const newStates = [...prev];
          newStates[currentIndex] = 'success';
          return newStates;
        });

        // Calculate score based on accuracy (use the matched note for accuracy calculation)
        const targetFreq = getFretFrequency(matchedNote.string, matchedNote.fret);
        const accuracy = Math.max(0, 100 - Math.abs(1200 * Math.log2(detectedNote.frequency / targetFreq)));
        const streakBonus = Math.min(streak * 10, 50);
        const noteScore = Math.round(accuracy + streakBonus);

        setScore((prev) => prev + noteScore);
        setStreak((prev) => prev + 1);
        setCurrentIndex((prev) => {
          const newIndex = prev + 1;
          // Handle loop logic
          if (isLoopActive && loopEnd !== null && loopStart !== null && newIndex > loopEnd) {
            // Reset note states for the loop range
            setNoteStates((prevStates) => {
              const newStates = [...prevStates];
              for (let i = loopStart; i <= loopEnd; i++) {
                newStates[i] = 'waiting';
              }
              return newStates;
            });
            setLoopCount((prevCount) => prevCount + 1);
            lastValidatedNoteRef.current = null;
            needsNewOnsetRef.current = false;
            return loopStart;
          }
          return newIndex;
        });
        setLastValidatedTime(now);

        // Visual feedback for wait mode
        // Clear any existing timeout
        if (waitingTimeoutRef.current) {
          clearTimeout(waitingTimeoutRef.current);
        }
        setIsWaitingForNote(false);
        waitingTimeoutRef.current = setTimeout(() => {
          setIsWaitingForNote(true);
          waitingTimeoutRef.current = null;
        }, 200);
      }
    },
    [cheatCode, currentIndex, isComplete, checkNoteMatch, streak, lastValidatedTime, isLoopActive, loopStart, loopEnd, isOnset, isRepeatedNote]
  );

  const reset = useCallback(() => {
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setNoteStates(Array(sequenceLength).fill('waiting'));
    setScore(0);
    setStreak(0);
    setLastValidatedTime(0);
    setIsWaitingForNote(true);
    setLoopCount(0);
    lastValidatedNoteRef.current = null;
    needsNewOnsetRef.current = false;
    lastOnsetRef.current = false;
  }, [sequenceLength]);

  return {
    currentIndex,
    noteStates,
    isComplete,
    score,
    streak,
    isWaitingForNote,
    loopCount,
    validateNote,
    reset,
  };
}
