'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { RubState } from '@/types/game';

const THRESHOLDS = {
  [RubState.GENTLE]: 300,
  [RubState.VIGOROUS]: 1200,
  [RubState.MAX]: 3000,
};

const SCORE_PER_TICK: Record<RubState, number> = {
  [RubState.IDLE]: 0,
  [RubState.GENTLE]: 2,
  [RubState.VIGOROUS]: 8,
  [RubState.MAX]: 25,
};

interface Options {
  onScoreAdd: (pts: number) => void;
  onRubStateChange: (state: RubState) => void;
  onSingleClick: () => void;
}

export function useHoldInteraction({ onScoreAdd, onRubStateChange, onSingleClick }: Options) {
  const [rubState, setRubState] = useState<RubState>(RubState.IDLE);
  const [isHolding, setIsHolding] = useState(false);

  const holdStartRef = useRef<number | null>(null);
  const currentStateRef = useRef<RubState>(RubState.IDLE);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const updateRubState = useCallback((state: RubState) => {
    currentStateRef.current = state;
    setRubState(state);
    onRubStateChange(state);
  }, [onRubStateChange]);

  const clearTimers = useCallback(() => {
    transitionRefs.current.forEach(clearTimeout);
    transitionRefs.current = [];
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startHold = useCallback(() => {
    holdStartRef.current = Date.now();
    setIsHolding(true);

    tickRef.current = setInterval(() => {
      const pts = SCORE_PER_TICK[currentStateRef.current];
      if (pts > 0) onScoreAdd(pts);
    }, 100);

    const t1 = setTimeout(() => updateRubState(RubState.GENTLE), THRESHOLDS[RubState.GENTLE]);
    const t2 = setTimeout(() => updateRubState(RubState.VIGOROUS), THRESHOLDS[RubState.VIGOROUS]);
    const t3 = setTimeout(() => updateRubState(RubState.MAX), THRESHOLDS[RubState.MAX]);
    transitionRefs.current = [t1, t2, t3];
  }, [onScoreAdd, updateRubState]);

  const endHold = useCallback(() => {
    const start = holdStartRef.current;
    const wasSingleClick = start != null && Date.now() - start < 200 && currentStateRef.current === RubState.IDLE;
    clearTimers();
    holdStartRef.current = null;
    setIsHolding(false);
    updateRubState(RubState.IDLE);
    if (wasSingleClick) {
      onSingleClick();
      onScoreAdd(1);
    }
  }, [clearTimers, updateRubState, onSingleClick, onScoreAdd]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const pointerHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      startHold();
    },
    onPointerUp: endHold,
    onPointerLeave: endHold,
    onPointerCancel: endHold,
  };

  return { pointerHandlers, rubState, isHolding };
}
