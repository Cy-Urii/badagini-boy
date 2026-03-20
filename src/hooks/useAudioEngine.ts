'use client';
import { useState, useCallback } from 'react';
import { audioEngine } from '@/engine/audio/AudioEngine';

export function useAudioEngine() {
  const [isReady, setIsReady] = useState(false);

  const initOnGesture = useCallback(async () => {
    if (!audioEngine.ready) {
      audioEngine.init();
    }
    await audioEngine.resume();
    setIsReady(true);
  }, []);

  return { audioEngine, isReady, initOnGesture };
}
