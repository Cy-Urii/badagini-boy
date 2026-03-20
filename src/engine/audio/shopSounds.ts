'use client';
import { audioEngine } from './AudioEngine';

function scheduleNote(freq: number, time: number, dur: number, vol = 0.12, type: OscillatorType = 'square') {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(gain);
  gain.connect(master);
  osc.start(time);
  osc.stop(time + dur + 0.01);
}

export function playCashOutJingle(): void {
  const ctx = audioEngine.getContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((freq, i) => {
    scheduleNote(freq, ctx.currentTime + i * 0.1, 0.09, 0.1, 'square');
  });
}

export function playDogWoof(): void {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  const woofTimes = [0, 0.25];
  woofTimes.forEach((t) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime + t);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + t + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.22);
    osc.connect(gain);
    gain.connect(master);
    osc.start(ctx.currentTime + t);
    osc.stop(ctx.currentTime + t + 0.25);
  });
}

export function playScoobySnackSound(): void {
  const ctx = audioEngine.getContext();
  if (!ctx) return;
  scheduleNote(659.25, ctx.currentTime, 0.12, 0.1, 'sine');
  scheduleNote(523.25, ctx.currentTime + 0.15, 0.18, 0.1, 'sine');
  playDogWoof();
}

export function playBoneSound(): void {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  // Crunch: noise burst + low sine
  const bufSize = Math.floor(ctx.sampleRate * 0.12);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(ctx.currentTime);
  // Low thud
  const osc = ctx.createOscillator();
  const oGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 100;
  oGain.gain.setValueAtTime(0.2, ctx.currentTime);
  oGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(oGain);
  oGain.connect(master);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
  playDogWoof();
}
