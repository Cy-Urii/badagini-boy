'use client';
import { useGameStore } from '@/engine/state/gameStore';

export function ScoreDisplay() {
  const score = useGameStore((s) => s.score);
  const rubState = useGameStore((s) => s.rubState);

  const RUB_LABELS: Record<string, string> = {
    IDLE: '',
    GENTLE: '~ GENTLE RUB ~',
    VIGOROUS: '~~ VIGOROUS ~~',
    MAX: '~~~ MAX RUB ~~~',
  };

  const RUB_COLORS: Record<string, string> = {
    IDLE: 'text-gray-500',
    GENTLE: 'text-yellow-300',
    VIGOROUS: 'text-orange-400',
    MAX: 'text-pink-400',
  };

  return (
    <div className="text-center font-pixel py-2">
      <div className="text-green-400 text-xs mb-1">BELLY RUBS</div>
      <div className="text-white text-2xl sm:text-4xl tabular-nums">
        {String(score).padStart(8, '0')}
      </div>
      <div className={`text-xs mt-1 h-4 ${RUB_COLORS[rubState]} transition-colors duration-200`}>
        {RUB_LABELS[rubState]}
      </div>
    </div>
  );
}
