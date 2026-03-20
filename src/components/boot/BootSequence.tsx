'use client';
import { useEffect, useState, useRef } from 'react';
import { playBlip, playTypeClick, playFloppySpin } from '@/engine/audio/bootSounds';

const BOOT_LINES = [
  '> BADAGINI SYSTEMS v1.0',
  '> (C) 1987 RETRO INDUSTRIES',
  '> INITIALIZING HARDWARE...',
  '> LOADING FROM DRIVE 0:',
  '  [||||||||||||||||] 100%',
  '> READING FAT TABLE........  OK',
  '> LOADING KERNEL...........  OK',
  '> INIT AUDIO SUBSYSTEM....  OK',
  '> LOADING SPRITE DATA......  OK',
  '> CHECKING BELLY RUB MOD..  OK',
  '> LOADING TREAT INVENTORY.  OK',
  '> CALIBRATING DOGGO........  OK',
  '',
  '>_ SYSTEM READY',
  '>_ PRESS ANY KEY TO CONTINUE',
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [spinner, setSpinner] = useState(0);
  const spinChars = ['|', '/', '-', '\\'];
  const completedRef = useRef(false);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let currentLine = '';

    const spinnerInterval = setInterval(() => {
      setSpinner((s) => (s + 1) % 4);
      playFloppySpin();
    }, 200);

    const typeNextChar = () => {
      if (lineIdx >= BOOT_LINES.length) {
        clearInterval(spinnerInterval);
        setDone(true);
        return;
      }

      const line = BOOT_LINES[lineIdx];

      if (charIdx < line.length) {
        currentLine += line[charIdx];
        charIdx++;
        setVisibleLines((prev) => {
          const next = [...prev];
          next[lineIdx] = currentLine;
          return next;
        });
        if (line[charIdx - 1] !== ' ') playTypeClick();
        setTimeout(typeNextChar, 18 + Math.random() * 20);
      } else {
        if (line.length > 0) playBlip();
        lineIdx++;
        charIdx = 0;
        currentLine = '';
        setTimeout(typeNextChar, 80);
      }
    };

    setTimeout(typeNextChar, 400);

    return () => clearInterval(spinnerInterval);
  }, []);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      // Wait for user input or auto-advance
      const handler = () => onComplete();
      window.addEventListener('keydown', handler, { once: true });
      window.addEventListener('pointerdown', handler, { once: true });
      const timeout = setTimeout(onComplete, 4000);
      return () => {
        window.removeEventListener('keydown', handler);
        window.removeEventListener('pointerdown', handler);
        clearTimeout(timeout);
      };
    }
  }, [done, onComplete]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-start p-4 sm:p-8 font-pixel">
      <div className="text-green-400 text-xs sm:text-sm space-y-0.5 leading-relaxed">
        {visibleLines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line}
            {i === visibleLines.length - 1 && !done && (
              <span className="animate-blink">█</span>
            )}
          </div>
        ))}
        {done && (
          <div className="mt-4 text-yellow-300 animate-blink">
            &gt;_ PRESS ANY KEY TO CONTINUE {spinChars[spinner]}
          </div>
        )}
      </div>
      {!done && (
        <div className="fixed bottom-4 right-4 text-green-600 text-xs font-pixel">
          {spinChars[spinner]}
        </div>
      )}
    </div>
  );
}
