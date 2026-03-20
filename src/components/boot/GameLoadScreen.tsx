'use client';
import { useEffect, useState } from 'react';
import { playBlip } from '@/engine/audio/bootSounds';

const LOAD_LINES = [
  'LOADING GAME ENGINE.......',
  'SPAWNING MANAGER..........',
  'WAKING UP DOGGO...........',
  'FILLING TREAT BOWL........',
  'PREPARING BELLY...........',
  'SYSTEMS READY. LETS GO!',
];

export function GameLoadScreen() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < LOAD_LINES.length) {
        setLines((prev) => [...prev, LOAD_LINES[i]]);
        playBlip();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-pixel">
      <div className="text-green-400 text-xs space-y-2 w-64">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-green-600">›</span>
            <span>{line}</span>
            {i === lines.length - 1 && <span className="animate-blink">█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
