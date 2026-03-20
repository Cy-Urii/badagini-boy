'use client';

interface TreatOptionProps {
  name: string;
  emoji: string;
  cost: number;
  owned: number;
  canAfford: boolean;
  onClick: () => void;
}

export function TreatOption({ name, emoji, cost, owned, canAfford, onClick }: TreatOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className="flex flex-col items-center gap-2 p-4 border-2 font-pixel text-xs transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed
        border-green-600 text-green-300 hover:bg-green-900 hover:border-green-400 active:scale-95"
      style={{ minWidth: 120 }}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="tracking-wider">{name}</span>
      <span className="text-yellow-400">{cost} PTS</span>
      <span className="text-gray-500">OWNED: {owned}</span>
    </button>
  );
}
