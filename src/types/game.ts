export enum GamePhase {
  BOOT = 'BOOT',
  MENU = 'MENU',
  GAME = 'GAME',
  SHOP = 'SHOP',
}

export enum RubState {
  IDLE = 'IDLE',
  GENTLE = 'GENTLE',
  VIGOROUS = 'VIGOROUS',
  MAX = 'MAX',
}

export interface TreatInventory {
  scoobySnacks: number;
  bones: number;
}

export interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  opacity: number;
  size: number;
  char: string;
}
