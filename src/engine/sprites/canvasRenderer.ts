import { RubState, Particle } from '@/types/game';
import {
  MANAGER_FRAMES, MANAGER_WIDTH, MANAGER_HEIGHT,
} from './managerSprite';
import {
  DOG_FRAMES, DOG_WIDTH, DOG_HEIGHT,
} from './dogSprite';

const PIXEL = 4; // pixels per "game pixel" on canvas

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  frame: number[][],
  palette: string[],
  x: number,
  y: number,
): void {
  for (let row = 0; row < frame.length; row++) {
    for (let col = 0; col < frame[row].length; col++) {
      const idx = frame[row][col];
      if (!idx || palette[idx] === 'transparent') continue;
      ctx.fillStyle = palette[idx];
      ctx.fillRect(x + col * PIXEL, y + row * PIXEL, PIXEL, PIXEL);
    }
  }
}

export function getManagerFrame(frameIdx: number): number[][] {
  return MANAGER_FRAMES[frameIdx % MANAGER_FRAMES.length];
}

export function getDogFrame(frameIdx: number, rubState: RubState): number[][] {
  if (rubState === RubState.IDLE) {
    return DOG_FRAMES[frameIdx % 2]; // 0-1
  } else if (rubState === RubState.GENTLE) {
    return DOG_FRAMES[2 + (frameIdx % 2)]; // 2-3
  } else {
    return DOG_FRAMES[4 + (frameIdx % 2)]; // 4-5
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Dark room background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0a0a1a');
  grad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Floor line
  ctx.fillStyle = '#2a2a4a';
  ctx.fillRect(0, h - 20, w, 20);

  // Office desk suggestion
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(w * 0.1, h * 0.7, w * 0.8, 8);
}

export function drawHearts(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  particles.forEach((p) => {
    if (p.opacity <= 0) return;
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = '#ff4488';
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.char, p.x, p.y);
  });
  ctx.globalAlpha = 1;
}

export function drawRubEffect(
  ctx: CanvasRenderingContext2D,
  rubState: RubState,
  dogX: number,
  dogY: number,
  tick: number,
): void {
  if (rubState === RubState.IDLE) return;

  if (rubState === RubState.GENTLE) {
    ctx.globalAlpha = 0.3 + 0.1 * Math.sin(tick * 0.1);
    ctx.fillStyle = '#ffff88';
    ctx.beginPath();
    ctx.arc(dogX + DOG_WIDTH * PIXEL * 0.4, dogY + DOG_HEIGHT * PIXEL * 0.3, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (rubState === RubState.VIGOROUS) {
    // Wavy lines around dog
    for (let i = 0; i < 3; i++) {
      const offset = (tick * 2 + i * 8) % 30;
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#ffaa22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        dogX + DOG_WIDTH * PIXEL * 0.4 + Math.cos(tick * 0.05 + i) * 10,
        dogY + DOG_HEIGHT * PIXEL * 0.3 + Math.sin(tick * 0.05 + i) * 10,
        offset * 0.5 + 5, 0, Math.PI * 2
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (rubState === RubState.MAX) {
    // Pulsing glow
    const pulse = 0.5 + 0.5 * Math.sin(tick * 0.2);
    ctx.globalAlpha = pulse * 0.4;
    ctx.fillStyle = '#ff88ff';
    ctx.beginPath();
    ctx.arc(
      dogX + DOG_WIDTH * PIXEL * 0.4,
      dogY + DOG_HEIGHT * PIXEL * 0.4,
      60 + pulse * 20, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export { PIXEL, MANAGER_WIDTH, MANAGER_HEIGHT, DOG_WIDTH, DOG_HEIGHT };
