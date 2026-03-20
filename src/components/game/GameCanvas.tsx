'use client';
import { useRef, useCallback, useEffect } from 'react';
import { RubState, Particle } from '@/types/game';
import { useGameLoop } from '@/hooks/useGameLoop';
import {
  drawBackground, drawSprite, drawHearts, drawRubEffect,
  getManagerFrame, getDogFrame,
  PIXEL, MANAGER_HEIGHT, DOG_WIDTH, DOG_HEIGHT,
} from '@/engine/sprites/canvasRenderer';
import { MANAGER_PALETTE } from '@/engine/sprites/managerSprite';
import { DOG_PALETTE } from '@/engine/sprites/dogSprite';

interface GameCanvasProps {
  rubState: RubState;
}

const CANVAS_W = 320;
const CANVAS_H = 240;

export function GameCanvas({ rubState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(0);
  const frameRef = useRef(0);
  const frameTimerRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const particleTimerRef = useRef(0);
  const rubStateRef = useRef(rubState);

  useEffect(() => { rubStateRef.current = rubState; }, [rubState]);

  const draw = useCallback((delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    tickRef.current++;
    frameTimerRef.current += delta;

    // Advance sprite frame every 400ms (idle) or 200ms (active)
    const frameInterval = rubStateRef.current === RubState.IDLE ? 400 : 200;
    if (frameTimerRef.current >= frameInterval) {
      frameRef.current++;
      frameTimerRef.current = 0;
    }

    // Spawn hearts in MAX state
    if (rubStateRef.current === RubState.MAX) {
      particleTimerRef.current += delta;
      if (particleTimerRef.current > 150) {
        particleTimerRef.current = 0;
        particlesRef.current.push({
          x: 160 + (Math.random() - 0.5) * 80,
          y: 120,
          vy: 0.8 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          opacity: 1,
          size: 10 + Math.random() * 8,
          char: Math.random() > 0.5 ? '♥' : '★',
        });
      }
    } else {
      particleTimerRef.current = 0;
    }

    // Update particles
    particlesRef.current = particlesRef.current
      .map((p) => ({ ...p, y: p.y - p.vy, x: p.x + p.vx, opacity: p.opacity - 0.015 }))
      .filter((p) => p.opacity > 0);

    // Draw
    drawBackground(ctx, CANVAS_W, CANVAS_H);

    const managerX = 30;
    const managerY = CANVAS_H - MANAGER_HEIGHT * PIXEL - 20;
    const dogX = CANVAS_W - DOG_WIDTH * PIXEL - 20;
    const dogY = CANVAS_H - DOG_HEIGHT * PIXEL - 20;

    // Manager slight shake in VIGOROUS/MAX
    let mOffX = 0;
    if (rubStateRef.current === RubState.VIGOROUS || rubStateRef.current === RubState.MAX) {
      mOffX = Math.sin(tickRef.current * 0.5) * 2;
    }

    drawSprite(ctx, getManagerFrame(frameRef.current), MANAGER_PALETTE, managerX + mOffX, managerY);
    drawRubEffect(ctx, rubStateRef.current, dogX, dogY, tickRef.current);
    drawSprite(ctx, getDogFrame(frameRef.current, rubStateRef.current), DOG_PALETTE, dogX, dogY);
    drawHearts(ctx, particlesRef.current);
  }, []);

  useGameLoop(draw);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="w-full max-w-lg mx-auto block"
      style={{ imageRendering: 'pixelated', border: '2px solid #333' }}
    />
  );
}
