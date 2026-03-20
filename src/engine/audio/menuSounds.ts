'use client';
import { audioEngine } from './AudioEngine';

// C4 = 261.63 Hz
const NOTE_FREQ: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0,  A4: 440.0,  B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  REST: 0,
};

const BPM = 140;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

// Melody: note + duration in beats
const MELODY: [string, number][] = [
  ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['A4', 0.5],
  ['G4', 0.5], ['E4', 0.5], ['C4', 1.0],
  ['D4', 0.5], ['F4', 0.5], ['A4', 0.5], ['C5', 0.5],
  ['A4', 0.5], ['F4', 0.5], ['D4', 1.0],
  ['E4', 0.5], ['G4', 0.5], ['B4', 0.5], ['D5', 0.5],
  ['B4', 0.5], ['G4', 0.5], ['E4', 1.0],
  ['C4', 0.5], ['G4', 0.5], ['C5', 0.5], ['E5', 0.5],
  ['D4', 0.5], ['A4', 0.5], ['D5', 1.0],
];

const BASS: [string, number][] = [
  ['C4', 1], ['G4', 1], ['C4', 1], ['G4', 1],
  ['D4', 1], ['A4', 1], ['D4', 1], ['A4', 1],
  ['E4', 1], ['B4', 1], ['E4', 1], ['B4', 1],
  ['C4', 1], ['G4', 1], ['D4', 1], ['G4', 1],
];

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let loopStart = 0;
let nextNoteTime = 0;
let noteIndex = 0;
let bassIndex = 0;
const LOOKAHEAD = 0.1;

function scheduleNote(freq: number, time: number, type: OscillatorType = 'square', dur = 0.12, vol = 0.08) {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master || freq === 0) return;
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

function scheduleKick(time: number) {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(gain);
  gain.connect(master);
  osc.start(time);
  osc.stop(time + 0.15);
}

function scheduleSnare(time: number) {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  const bufSize = Math.floor(ctx.sampleRate * 0.08);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1500;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(time);
}

function scheduleHihat(time: number) {
  const ctx = audioEngine.getContext();
  const master = audioEngine.getMasterGain();
  if (!ctx || !master) return;
  const bufSize = Math.floor(ctx.sampleRate * 0.04);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 8000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(time);
}

function scheduler() {
  const ctx = audioEngine.getContext();
  if (!ctx) return;

  while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
    const [melNote, melDur] = MELODY[noteIndex % MELODY.length];
    const melFreq = NOTE_FREQ[melNote] || 0;
    scheduleNote(melFreq, nextNoteTime, 'square', melDur * BEAT * 0.8, 0.08);

    const [bassNote, bassDur] = BASS[bassIndex % BASS.length];
    const bassFreq = (NOTE_FREQ[bassNote] || 0) / 2;
    scheduleNote(bassFreq, nextNoteTime, 'square', bassDur * BEAT * 0.7, 0.05);

    // Drums on beats
    const beatInBar = (nextNoteTime - loopStart) % BAR;
    if (beatInBar < 0.01 || Math.abs(beatInBar - BEAT * 2) < 0.01) {
      scheduleKick(nextNoteTime);
    }
    if (Math.abs(beatInBar - BEAT) < 0.01 || Math.abs(beatInBar - BEAT * 3) < 0.01) {
      scheduleSnare(nextNoteTime);
    }
    scheduleHihat(nextNoteTime);

    nextNoteTime += MELODY[noteIndex % MELODY.length][1] * BEAT;
    noteIndex++;
    if (noteIndex % BASS.length === 0) bassIndex = 0;
    else bassIndex = noteIndex;
  }
}

export function startChiptune(): void {
  const ctx = audioEngine.getContext();
  if (!ctx) return;
  loopStart = ctx.currentTime;
  nextNoteTime = ctx.currentTime;
  noteIndex = 0;
  bassIndex = 0;
  if (schedulerInterval) clearInterval(schedulerInterval);
  schedulerInterval = setInterval(scheduler, 25);
}

export function stopChiptune(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
