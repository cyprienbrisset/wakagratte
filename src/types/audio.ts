export interface DetectedNote {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  clarity: number;
}

export interface AudioAnalysisResult {
  pitch: number | null;
  clarity: number;
  volume: number;
}

export type MicrophoneStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'error';

export interface MicrophoneState {
  status: MicrophoneStatus;
  stream: MediaStream | null;
  error: string | null;
}

export type TunerStatus = 'flat' | 'sharp' | 'in_tune';

export interface TunerResult {
  targetNote: string;
  detectedNote: DetectedNote | null;
  status: TunerStatus;
  centsOff: number;
}
