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
  const { pitchTolerance = 40, loopStart = null, loopEnd = null } = options; // 40 cents = moins d'un demi-ton

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

  const validateNote = useCallback(
    (detectedNote: DetectedNote | null) => {
      if (!cheatCode || isComplete || !detectedNote) return;

      const now = Date.now();
      // Prevent rapid-fire validations (debounce) - reduced to 100ms
      if (now - lastValidatedTime < 100) return;

      const currentStep = cheatCode.sequence[currentIndex];
      if (!currentStep || currentStep.length === 0) return;

      const { isMatch, matchedNote } = checkNoteMatch(detectedNote, currentStep);

      if (isMatch && matchedNote) {
        // Success!
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
    [cheatCode, currentIndex, isComplete, checkNoteMatch, streak, lastValidatedTime, isLoopActive, loopStart, loopEnd]
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
