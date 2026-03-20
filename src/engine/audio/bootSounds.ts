'use client';
import { audioEngine } from './AudioEngine';

export function playBlip(): void {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 600 + Math.random() * 400;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.connect(gain);
  gain.connect(master);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

export function playTypeClick(): void {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;

  const bufferSize = ctx.sampleRate * 0.025;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(ctx.currentTime);
}

export function playFloppySpin(): void {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(master);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}
