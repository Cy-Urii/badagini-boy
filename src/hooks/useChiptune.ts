'use client';
import { useEffect, useRef } from 'react';
import { startChiptune, stopChiptune } from '@/engine/audio/menuSounds';

export function useChiptune(enabled: boolean) {
  const playing = useRef(false);

  useEffect(() => {
    if (enabled && !playing.current) {
      startChiptune();
      playing.current = true;
    }
    return () => {
      if (playing.current) {
        stopChiptune();
        playing.current = false;
      }
    };
  }, [enabled]);
}
