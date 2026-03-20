'use client';
import { useEffect, useState } from 'react';
import { useChiptune } from '@/hooks/useChiptune';

interface MainMenuProps {
  onStart: () => void;
  audioReady: boolean;
}

export function MainMenu({ onStart, audioReady }: MainMenuProps) {
  const [phase, setPhase] = useState<'black' | 'title' | 'art' | 'sub' | 'ready'>('black');
  useChiptune(audioReady && phase !== 'black');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('title'), 200);
    const t2 = setTimeout(() => setPhase('art'), 600);
    const t3 = setTimeout(() => setPhase('sub'), 1100);
    const t4 = setTimeout(() => setPhase('ready'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleStart = () => {
    if (phase === 'ready') onStart();
  };

  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center select-none cursor-pointer font-pixel"
      onClick={handleStart}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleStart() : undefined}
      tabIndex={0}
    >
      {/* Title */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: phase === 'black' ? 0 : 1,
          transform: phase === 'black' ? 'translateY(-60px)' : 'translateY(0)',
        }}
      >
        <div className="text-center mb-2">
          <span className="text-yellow-300 text-lg sm:text-2xl md:text-3xl tracking-widest drop-shadow-[0_0_8px_rgba(255,200,0,0.8)]">
            BADAGINI
          </span>
        </div>
        <div className="text-center">
          <span className="text-red-400 text-2xl sm:text-4xl md:text-5xl tracking-widest drop-shadow-[0_0_12px_rgba(255,80,80,0.9)]">
            BOY
          </span>
        </div>
        <div className="text-center mt-1">
          <span className="text-green-400 text-xs tracking-[0.3em]">────────────────</span>
        </div>
      </div>

      {/* Manager pixel art (CSS art) */}
      <div
        className="my-6 transition-all duration-700"
        style={{ opacity: ['art', 'sub', 'ready'].includes(phase) ? 1 : 0 }}
      >
        <ManagerArt />
      </div>

      {/* Subtitle */}
      <div
        className="text-center transition-all duration-500"
        style={{ opacity: ['sub', 'ready'].includes(phase) ? 1 : 0 }}
      >
        <div className="text-green-300 text-xs mb-2 tracking-wider">~ THE BELLY RUB CHRONICLES ~</div>
        <div className="text-gray-400 text-xs mt-2">RUB THE DOGGO. EARN TREATS.</div>
      </div>

      {/* Press start */}
      <div className="mt-8 h-6">
        {phase === 'ready' && (
          <div className="text-white text-sm sm:text-base animate-blink tracking-widest">
            ── PRESS START ──
          </div>
        )}
      </div>

      {/* Copyright */}
      <div
        className="fixed bottom-4 text-gray-600 text-xs font-pixel"
        style={{ opacity: ['sub', 'ready'].includes(phase) ? 1 : 0 }}
      >
        © 1987 RETRO INDUSTRIES
      </div>
    </div>
  );
}

function ManagerArt() {
  // CSS pixel art of manager using a grid of colored divs
  const P = 6; // pixel size in px
  // Simple 16x20 manager face/body icon
  const pixels: [number, number, string][] = [
    // Head
    ...range(3,9).map(c => [2, c, '#f4a46b'] as [number,number,string]),
    ...range(3,9).map(c => [3, c, '#f4a46b'] as [number,number,string]),
    [3,4,'#1a1a1a'],[3,7,'#1a1a1a'], // eyes
    [4,5,'#f4a46b'],[4,6,'#f4a46b'],
    [5,4,'#f4a46b'],[5,5,'#f4a46b'],[5,6,'#f4a46b'],[5,7,'#f4a46b'],
    // Hair
    [1,3,'#2a1a0a'],[1,4,'#2a1a0a'],[1,5,'#2a1a0a'],[1,6,'#2a1a0a'],[1,7,'#2a1a0a'],[1,8,'#2a1a0a'],
    [2,2,'#2a1a0a'],[2,9,'#2a1a0a'],
    // Suit body
    ...range(2,10).map(c => [6, c, '#555577'] as [number,number,string]),
    ...range(2,10).map(c => [7, c, '#555577'] as [number,number,string]),
    ...range(2,10).map(c => [8, c, '#555577'] as [number,number,string]),
    // Tie
    [6,5,'#cc2222'],[6,6,'#cc2222'],
    [7,5,'#cc2222'],[7,6,'#cc2222'],
    [8,5,'#cc2222'],
    // Shirt collar
    [6,4,'#eeeeff'],[6,7,'#eeeeff'],
    // Arms
    ...range(6,9).map(r => [r, 1, '#555577'] as [number,number,string]),
    ...range(6,9).map(r => [r, 10, '#555577'] as [number,number,string]),
    // Legs
    [9,3,'#33334a'],[9,4,'#33334a'],[9,7,'#33334a'],[9,8,'#33334a'],
    [10,3,'#33334a'],[10,4,'#33334a'],[10,7,'#33334a'],[10,8,'#33334a'],
    [11,3,'#1a1a1a'],[11,4,'#1a1a1a'],[11,7,'#1a1a1a'],[11,8,'#1a1a1a'],
  ];

  return (
    <div className="relative" style={{ width: 12 * P, height: 13 * P }}>
      {pixels.map(([r, c, color], i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: r * P, left: c * P, width: P, height: P, background: color }}
        />
      ))}
    </div>
  );
}

function range(a: number, b: number): number[] {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}
