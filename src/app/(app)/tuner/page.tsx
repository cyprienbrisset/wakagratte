'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { TunerDial } from '@/components/tuner/TunerDial';
import { TuningSelector } from '@/components/tuner/TuningSelector';
import { GuitarVisualizer } from '@/components/tuner/GuitarVisualizer';
import { useMicrophone } from '@/hooks/useMicrophone';
import { usePitchDetection } from '@/hooks/usePitchDetection';
import { TuningName } from '@/types/music';
import { TunerStatus } from '@/types/audio';
import { getTuningFrequencies, getStringNote } from '@/lib/music/tunings';
import { parseNoteString } from '@/lib/music/notes';

const IN_TUNE_THRESHOLD = 5;

export default function TunerPage() {
  const [selectedTuning, setSelectedTuning] = useState<TuningName>('standard');
  const [tunedStrings, setTunedStrings] = useState<boolean[]>([false, false, false, false, false, false]);

  const { status: micStatus, stream, error, requestAccess, stopMicrophone } = useMicrophone();
  const { detectedNote, isListening } = usePitchDetection(stream);

  const tuningFrequencies = useMemo(() => getTuningFrequencies(selectedTuning), [selectedTuning]);

  const findClosestString = useCallback(
    (frequency: number): { stringNum: number; centsOff: number } | null => {
      if (!frequency || tuningFrequencies.length === 0) return null;

      let closestString = 1;
      let minCentsOff = Infinity;

      tuningFrequencies.forEach((targetFreq, index) => {
        const centsOff = 1200 * Math.log2(frequency / targetFreq);
        if (Math.abs(centsOff) < Math.abs(minCentsOff)) {
          minCentsOff = centsOff;
          closestString = 6 - index;
        }
      });

      return { stringNum: closestString, centsOff: Math.round(minCentsOff) };
    },
    [tuningFrequencies]
  );

  const tunerState = useMemo(() => {
    if (!detectedNote) {
      return { note: null, centsOff: 0, status: 'in_tune' as TunerStatus, activeString: null };
    }

    const result = findClosestString(detectedNote.frequency);
    if (!result) {
      return { note: null, centsOff: 0, status: 'in_tune' as TunerStatus, activeString: null };
    }

    const targetNote = getStringNote(selectedTuning, result.stringNum);
    const parsedNote = parseNoteString(targetNote);
    const displayNote = parsedNote?.note.replace('#', '\u266F') || targetNote;

    let status: TunerStatus = 'in_tune';
    if (result.centsOff < -IN_TUNE_THRESHOLD) {
      status = 'flat';
    } else if (result.centsOff > IN_TUNE_THRESHOLD) {
      status = 'sharp';
    }

    return {
      note: displayNote,
      centsOff: result.centsOff,
      status,
      activeString: result.stringNum,
    };
  }, [detectedNote, findClosestString, selectedTuning]);

  useMemo(() => {
    if (tunerState.status === 'in_tune' && tunerState.activeString) {
      setTunedStrings((prev) => {
        const newTuned = [...prev];
        newTuned[tunerState.activeString! - 1] = true;
        return newTuned;
      });
    }
  }, [tunerState.status, tunerState.activeString]);

  const handleTuningChange = (tuning: TuningName) => {
    setSelectedTuning(tuning);
    setTunedStrings([false, false, false, false, false, false]);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Accordeur</h1>
          <p className="text-gray-400">Accorde ta guitare avec precision</p>
        </div>

        {/* Tuning selector */}
        <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5 mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Accordage</h2>
          <TuningSelector selectedTuning={selectedTuning} onSelect={handleTuningChange} />
        </div>

        {/* Tuner */}
        <div className="bg-[#151a28] rounded-2xl p-8 border border-white/5 mb-6">
          {!isListening ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-6">Active le micro pour commencer</p>
              <Button onClick={requestAccess} disabled={micStatus === 'requesting'} size="lg">
                {micStatus === 'requesting' ? 'Autorisation...' : 'Activer le micro'}
              </Button>
              {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            </div>
          ) : (
            <>
              <TunerDial
                centsOff={tunerState.centsOff}
                status={tunerState.status}
                note={tunerState.note}
              />
              <div className="mt-8 text-center">
                <Button onClick={stopMicrophone} variant="ghost" size="sm">
                  Desactiver le micro
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Guitar visualizer */}
        <div className="bg-[#151a28] rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Visualisation</h2>
          <GuitarVisualizer
            tuning={selectedTuning}
            activeString={tunerState.activeString}
            tunedStrings={tunedStrings}
          />
        </div>
      </div>
    </div>
  );
}
