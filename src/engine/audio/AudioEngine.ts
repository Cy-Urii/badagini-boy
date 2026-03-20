'use client';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _ready = false;

  init(): void {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(this.ctx.destination);
    this._ready = true;
  }

  async resume(): Promise<void> {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  get ready(): boolean {
    return this._ready;
  }

  getContext(): AudioContext | null {
    return this.ctx;
  }

  getMasterGain(): GainNode | null {
    return this.masterGain;
  }
}

export const audioEngine = new AudioEngine();
