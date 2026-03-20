'use client';
import { useEffect, useRef } from 'react';
import { RubState } from '@/types/game';
import { useHoldInteraction } from '@/hooks/useHoldInteraction';
import { useGameStore } from '@/engine/state/gameStore';
import { startRubSound, stopRubSound, playClickSound } from '@/engine/audio/gameSounds';
import { GameCanvas } from './GameCanvas';

interface RubZoneProps {
  onCashOut: () => void;
}

export function RubZone({ onCashOut }: RubZoneProps) {
  const addScore = useGameStore((s) => s.addScore);
  const setRubState = useGameStore((s) => s.setRubState);
  const score = useGameStore((s) => s.score);
  const prevRubRef = useRef<RubState>(RubState.IDLE);

  const { pointerHandlers, rubState, isHolding } = useHoldInteraction({
    onScoreAdd: (pts) => addScore(pts),
    onRubStateChange: (state) => {
      setRubState(state);
      if (state !== prevRubRef.current) {
        stopRubSound();
        if (state !== RubState.IDLE) startRubSound(state);
        prevRubRef.current = state;
      }
    },
    onSingleClick: () => playClickSound(),
  });

  // Cleanup sound on unmount
  useEffect(() => () => stopRubSound(), []);

  const BG_CLASSES: Record<RubState, string> = {
    [RubState.IDLE]: 'bg-gray-900',
    [RubState.GENTLE]: 'bg-gray-900',
    [RubState.VIGOROUS]: 'bg-gray-800',
    [RubState.MAX]: 'bg-gray-900',
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        className={`relative w-full max-w-lg rounded cursor-pointer select-none transition-colors duration-300 ${BG_CLASSES[rubState]}`}
        {...pointerHandlers}
        style={{ touchAction: 'none' }}
      >
        <GameCanvas rubState={rubState} />

        {/* Hold instruction */}
        {!isHolding && (
          <div className="absolute bottom-2 left-0 right-0 text-center font-pixel text-gray-500 text-xs animate-pulse">
            CLICK OR HOLD TO RUB BELLY
          </div>
        )}
      </div>

      {/* Cash out */}
      <button
        onClick={onCashOut}
        className="font-pixel text-xs px-4 py-2 mt-1 border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors"
        disabled={score < 50}
        style={{ opacity: score < 50 ? 0.4 : 1 }}
      >
        CASH OUT FOR TREATS
      </button>
      <div className="font-pixel text-gray-600 text-xs">MIN 50 PTS TO REDEEM</div>
    </div>
  );
}
