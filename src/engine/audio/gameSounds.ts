'use client';
import { audioEngine } from './AudioEngine';
import { RubState } from '@/types/game';

interface ActiveRubSound {
  oscillators: OscillatorNode[];
  lfo: OscillatorNode;
  gainNode: GainNode;
  stop: () => void;
}

let activeRub: ActiveRubSound | null = null;

export function startRubSound(state: RubState): void {
  stopRubSound();
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master || state === RubState.IDLE) return;

  const gainNode = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';

  const oscillators: OscillatorNode[] = [];

  if (state === RubState.GENTLE) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 180;
    lfo.frequency.value = 4;
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gainNode);
    oscillators.push(osc);
    gainNode.gain.value = 0.04;
  } else if (state === RubState.VIGOROUS) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine'; osc1.frequency.value = 180;
    osc2.type = 'sine'; osc2.frequency.value = 184;
    lfo.frequency.value = 8;
    lfoGain.gain.value = 12;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    oscillators.push(osc1, osc2);
    gainNode.gain.value = 0.07;
  } else if (state === RubState.MAX) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    osc1.type = 'sawtooth'; osc1.frequency.value = 180;
    osc2.type = 'sine';     osc2.frequency.value = 184;
    osc3.type = 'sine';     osc3.frequency.value = 190;
    lfo.frequency.value = 12;
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    oscillators.push(osc1, osc2, osc3);
    gainNode.gain.value = 0.1;
  }

  gainNode.connect(master);
  lfo.start();
  oscillators.forEach((o) => o.start());

  activeRub = {
    oscillators,
    lfo,
    gainNode,
    stop: () => {
      gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      setTimeout(() => {
        oscillators.forEach((o) => { try { o.stop(); } catch {} });
        try { lfo.stop(); } catch {}
      }, 200);
    },
  };
}

export function stopRubSound(): void {
  if (activeRub) {
    activeRub.stop();
    activeRub = null;
  }
}

export function playClickSound(): void {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  const bufSize = Math.floor(ctx.sampleRate * 0.03);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(ctx.currentTime);
}
