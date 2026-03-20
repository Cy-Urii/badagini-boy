import { create } from 'zustand';
import { RubState, TreatInventory } from '@/types/game';

interface GameStore {
  score: number;
  rubState: RubState;
  holdMs: number;
  treats: TreatInventory;
  totalClicks: number;
  addScore: (points: number) => void;
  setRubState: (state: RubState) => void;
  setHoldMs: (ms: number) => void;
  cashOut: (treatType: 'scoobySnack' | 'bone') => boolean;
  resetSession: () => void;
}

const TREAT_COSTS = {
  scoobySnack: 50,
  bone: 100,
};

export const useGameStore = create<GameStore>((set, get) => ({
  score: 0,
  rubState: RubState.IDLE,
  holdMs: 0,
  treats: { scoobySnacks: 0, bones: 0 },
  totalClicks: 0,

  addScore: (points) => set((s) => ({ score: s.score + points, totalClicks: s.totalClicks + 1 })),
  setRubState: (state) => set({ rubState: state }),
  setHoldMs: (ms) => set({ holdMs: ms }),

  cashOut: (treatType) => {
    const cost = TREAT_COSTS[treatType];
    const { score } = get();
    if (score < cost) return false;
    set((s) => ({
      score: s.score - cost,
      treats: {
        ...s.treats,
        scoobySnacks: treatType === 'scoobySnack' ? s.treats.scoobySnacks + 1 : s.treats.scoobySnacks,
        bones: treatType === 'bone' ? s.treats.bones + 1 : s.treats.bones,
      },
    }));
    return true;
  },

  resetSession: () =>
    set({ score: 0, rubState: RubState.IDLE, holdMs: 0, totalClicks: 0 }),
}));
