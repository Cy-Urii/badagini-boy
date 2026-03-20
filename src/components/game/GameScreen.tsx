'use client';
import { ScoreDisplay } from './ScoreDisplay';
import { RubZone } from './RubZone';
import { useGameStore } from '@/engine/state/gameStore';

interface GameScreenProps {
  onCashOut: () => void;
}

export function GameScreen({ onCashOut }: GameScreenProps) {
  const treats = useGameStore((s) => s.treats);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between py-4 px-2 font-pixel">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <span className="text-green-400 text-xs">BADAGINI BOY</span>
        <div className="text-xs text-gray-500 flex gap-3">
          <span>🦴 {treats.bones}</span>
          <span>🍪 {treats.scoobySnacks}</span>
        </div>
      </div>

      {/* Score */}
      <ScoreDisplay />

      {/* Game canvas + interaction */}
      <RubZone onCashOut={onCashOut} />

      {/* Footer hint */}
      <div className="text-gray-700 text-xs mt-2">
        HOLD LONGER = MORE BELLY RUBS
      </div>
    </div>
  );
}
