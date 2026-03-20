'use client';
import { useState } from 'react';
import { useGameStore } from '@/engine/state/gameStore';
import { TreatOption } from './TreatOption';
import { FlashOverlay } from './FlashOverlay';
import { playCashOutJingle, playScoobySnackSound, playBoneSound } from '@/engine/audio/shopSounds';

interface TreatShopProps {
  onBack: () => void;
}

export function TreatShop({ onBack }: TreatShopProps) {
  const score = useGameStore((s) => s.score);
  const treats = useGameStore((s) => s.treats);
  const cashOut = useGameStore((s) => s.cashOut);
  const [flashTrigger, setFlashTrigger] = useState(0);
  const [flashColor, setFlashColor] = useState('white');
  const [lastBuy, setLastBuy] = useState('');

  const handleBuy = (type: 'scoobySnack' | 'bone') => {
    const success = cashOut(type);
    if (!success) return;
    setFlashTrigger((n) => n + 1);
    setFlashColor(type === 'scoobySnack' ? '#ffffaa' : '#ffddaa');
    setLastBuy(type === 'scoobySnack' ? '🍪 SCOOBY SNACK ACQUIRED!' : '🦴 BONE ACQUIRED!');
    if (type === 'scoobySnack') {
      playScoobySnackSound();
    } else {
      playBoneSound();
    }
    playCashOutJingle();
    setTimeout(() => setLastBuy(''), 2000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-pixel px-4 py-8">
      <FlashOverlay trigger={flashTrigger} color={flashColor} />

      <div className="text-yellow-300 text-lg sm:text-2xl mb-2 tracking-widest">TREAT SHOP</div>
      <div className="text-green-400 text-xs mb-1">──────────────────────</div>

      <div className="text-white text-sm mb-6">
        AVAILABLE: <span className="text-yellow-400">{score}</span> PTS
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        <TreatOption
          name="SCOOBY SNACK"
          emoji="🍪"
          cost={50}
          owned={treats.scoobySnacks}
          canAfford={score >= 50}
          onClick={() => handleBuy('scoobySnack')}
        />
        <TreatOption
          name="BONE"
          emoji="🦴"
          cost={100}
          owned={treats.bones}
          canAfford={score >= 100}
          onClick={() => handleBuy('bone')}
        />
      </div>

      {lastBuy && (
        <div className="mt-6 text-pink-400 text-sm animate-bounce">{lastBuy}</div>
      )}

      <button
        onClick={onBack}
        className="mt-10 font-pixel text-xs px-6 py-3 border border-gray-500 text-gray-400 hover:border-white hover:text-white transition-colors"
      >
        ← BACK TO GAME
      </button>
    </div>
  );
}
