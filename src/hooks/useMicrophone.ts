'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { MicrophoneStatus } from '@/types/audio';

interface UseMicrophoneReturn {
  status: MicrophoneStatus;
  stream: MediaStream | null;
  error: string | null;
  requestAccess: () => Promise<void>;
  stopMicrophone: () => void;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [status, setStatus] = useState<MicrophoneStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestAccess = useCallback(async () => {
    if (status === 'active' && streamRef.current) {
      return;
    }

    setStatus('requesting');
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setStatus('active');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setStatus('denied');
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    }
  }, [status]);

  const stopMicrophone = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setStatus('idle');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    status,
    stream,
    error,
    requestAccess,
    stopMicrophone,
  };
}
