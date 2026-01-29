'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PitchDetector } from 'pitchy';
import Meyda from 'meyda';
import { DetectedNote } from '@/types/audio';
import { frequencyToNote, getNoteDisplayName } from '@/lib/music/notes';

interface UsePitchDetectionOptions {
  minClarity?: number;
  minVolume?: number;
  onsetThreshold?: number;
}

interface AudioFeatures {
  rms: number;
  spectralCentroid: number;
  spectralFlux: number;
  zcr: number;
}

interface UsePitchDetectionReturn {
  detectedNote: DetectedNote | null;
  isListening: boolean;
  audioFeatures: AudioFeatures | null;
  isOnset: boolean;
  start: () => void;
  stop: () => void;
}

export function usePitchDetection(
  stream: MediaStream | null,
  options: UsePitchDetectionOptions = {}
): UsePitchDetectionReturn {
  // Reduced thresholds for better detection
  const { minClarity = 0.8, minVolume = 0.005, onsetThreshold = 0.1 } = options;

  const [detectedNote, setDetectedNote] = useState<DetectedNote | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [isOnset, setIsOnset] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);
  const meydaAnalyzerRef = useRef<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousSpectralFluxRef = useRef<number>(0);
  const lastNoteRef = useRef<DetectedNote | null>(null);
  const noteHoldCountRef = useRef<number>(0);

  const detectPitch = useCallback(() => {
    if (!analyserRef.current || !detectorRef.current || !audioContextRef.current) {
      return;
    }

    const analyser = analyserRef.current;
    const detector = detectorRef.current;
    const sampleRate = audioContextRef.current.sampleRate;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const volume = Math.sqrt(sum / buffer.length);

    if (volume < minVolume) {
      // Keep the last note for a few frames to avoid flickering
      noteHoldCountRef.current++;
      if (noteHoldCountRef.current > 10) { // Hold for ~10 frames before clearing
        setDetectedNote(null);
        lastNoteRef.current = null;
      }
      animationFrameRef.current = requestAnimationFrame(detectPitch);
      return;
    }

    const [pitch, clarity] = detector.findPitch(buffer, sampleRate);

    if (clarity >= minClarity && pitch > 50 && pitch < 1000) {
      const { note, octave, cents } = frequencyToNote(pitch);
      const newNote: DetectedNote = {
        frequency: pitch,
        note: getNoteDisplayName(note),
        octave,
        cents,
        clarity,
      };

      setDetectedNote(newNote);
      lastNoteRef.current = newNote;
      noteHoldCountRef.current = 0;
    } else if (clarity >= minClarity * 0.7 && lastNoteRef.current) {
      // Lower clarity but still some signal - keep the last note
      noteHoldCountRef.current++;
      if (noteHoldCountRef.current > 15) {
        setDetectedNote(null);
        lastNoteRef.current = null;
      }
    } else {
      noteHoldCountRef.current++;
      if (noteHoldCountRef.current > 10) {
        setDetectedNote(null);
        lastNoteRef.current = null;
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  }, [minClarity, minVolume]);

  const start = useCallback(() => {
    if (!stream || isListening) return;

    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);

      // Initialize Meyda analyzer for audio features
      const meydaAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 2048,
        featureExtractors: ['rms', 'spectralCentroid', 'spectralFlux', 'zcr'],
        callback: (features: { rms?: number; spectralCentroid?: number; spectralFlux?: number; zcr?: number }) => {
          const currentFeatures: AudioFeatures = {
            rms: features.rms || 0,
            spectralCentroid: features.spectralCentroid || 0,
            spectralFlux: features.spectralFlux || 0,
            zcr: features.zcr || 0,
          };

          setAudioFeatures(currentFeatures);

          // Detect onset (sudden increase in spectral flux)
          const fluxDelta = currentFeatures.spectralFlux - previousSpectralFluxRef.current;
          setIsOnset(fluxDelta > onsetThreshold && currentFeatures.rms > minVolume);
          previousSpectralFluxRef.current = currentFeatures.spectralFlux;
        },
      });

      meydaAnalyzer.start();

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      detectorRef.current = detector;
      meydaAnalyzerRef.current = meydaAnalyzer;

      setIsListening(true);
      animationFrameRef.current = requestAnimationFrame(detectPitch);
    } catch (err) {
      console.error('Erreur lors du démarrage de la détection:', err);
    }
  }, [stream, isListening, detectPitch, onsetThreshold, minVolume]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (meydaAnalyzerRef.current) {
      meydaAnalyzerRef.current.stop();
      meydaAnalyzerRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    detectorRef.current = null;

    setIsListening(false);
    setDetectedNote(null);
    setAudioFeatures(null);
    setIsOnset(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Auto-start when stream is available, auto-stop when stream is removed
  useEffect(() => {
    if (stream && !isListening) {
      start();
    } else if (!stream && isListening) {
      stop();
    }
  }, [stream, isListening, start, stop]);

  return {
    detectedNote,
    isListening,
    audioFeatures,
    isOnset,
    start,
    stop,
  };
}
