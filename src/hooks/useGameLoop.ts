'use client';
import { useEffect, useRef } from 'react';

export function useGameLoop(callback: (deltaMs: number) => void, active = true) {
  const cbRef = useRef(callback);
  const rafRef = useRef<number>(0);
  const prevTimeRef = useRef<number | null>(null);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;

    const loop = (time: number) => {
      const delta = prevTimeRef.current != null ? time - prevTimeRef.current : 0;
      prevTimeRef.current = time;
      cbRef.current(delta);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      prevTimeRef.current = null;
    };
  }, [active]);
}
