// Web Audio Synthesizer supporting multiple soundscape packs: Zen Chimes, Subtle Tech, Retro Arcade, and Mute

export type SoundPack = 'zen' | 'tech' | 'retro' | 'mute';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private currentPack: SoundPack = 'zen';

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundPack(pack: SoundPack) {
    this.currentPack = pack;
  }

  public getSoundPack(): SoundPack {
    return this.currentPack;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- 1. Tap / Click Sound ---
  public playTap() {
    if (!this.isEnabled || this.currentPack === 'mute') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.currentPack === 'tech') {
        // High-precision crisp micro-click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.015);
      } else if (this.currentPack === 'retro') {
        // 8-bit square blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.02);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      } else {
        // Zen Chime: Soft sine click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Ignore
    }
  }

  // --- 2. Correct Answer Feedback ---
  public playCorrect() {
    if (!this.isEnabled || this.currentPack === 'mute') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (this.currentPack === 'tech') {
        // Double micro-click positive confirmation
        [
          { freq: 880, time: 0, dur: 0.035 },
          { freq: 1760, time: 0.035, dur: 0.06 }
        ].forEach(note => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.06, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur);
        });
      } else if (this.currentPack === 'retro') {
        // 8-bit ascending chime (C5 -> E5 -> G5)
        [
          { freq: 523.25, time: 0, dur: 0.04 },
          { freq: 659.25, time: 0.04, dur: 0.04 },
          { freq: 783.99, time: 0.08, dur: 0.08 }
        ].forEach(note => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.05, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur);
        });
      } else {
        // Zen: Harmonic sine pair (G5 -> C6)
        [
          { freq: 783.99, time: 0, dur: 0.1 },
          { freq: 1046.50, time: 0.06, dur: 0.18 }
        ].forEach(note => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.08, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur);
        });
      }
    } catch {
      // Ignore
    }
  }

  // --- 3. Mistake / Error Feedback ---
  public playMistake() {
    if (!this.isEnabled || this.currentPack === 'mute') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.currentPack === 'tech') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      } else if (this.currentPack === 'retro') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(120, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.1);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (this.currentPack === 'tech' ? 0.06 : 0.1));
    } catch {
      // Ignore
    }
  }

  // --- 4. Countdown Beep ---
  public playCountdownBeep(isFinal: boolean = false) {
    if (!this.isEnabled || this.currentPack === 'mute') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = isFinal ? (this.currentPack === 'tech' ? 1200 : 659.25) : (this.currentPack === 'tech' ? 800 : 440);
      const dur = isFinal ? 0.15 : 0.06;

      osc.type = this.currentPack === 'retro' ? 'square' : this.currentPack === 'tech' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + dur);
    } catch {
      // Ignore
    }
  }

  // --- 5. Flash Arithmetic Pulse ---
  public playFlash() {
    if (!this.isEnabled || this.currentPack === 'mute') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.currentPack === 'retro' ? 'square' : this.currentPack === 'tech' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  // --- 6. Level Up / Victory Celebration ---
  public playLevelUp() {
    if (!this.isEnabled || this.currentPack === 'mute') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (this.currentPack === 'retro') {
        // Classic 8-bit fanfare (C5 -> E5 -> G5 -> C6)
        const chord = [
          { freq: 523.25, time: 0, dur: 0.06 },
          { freq: 659.25, time: 0.06, dur: 0.06 },
          { freq: 783.99, time: 0.12, dur: 0.06 },
          { freq: 1046.50, time: 0.18, dur: 0.25 }
        ];

        chord.forEach(note => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.06, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur);
        });
      } else if (this.currentPack === 'tech') {
        // High-tech ascending arpeggio
        const chord = [
          { freq: 880, time: 0, dur: 0.05 },
          { freq: 1174.66, time: 0.05, dur: 0.05 },
          { freq: 1760, time: 0.10, dur: 0.18 }
        ];

        chord.forEach(note => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.07, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur);
        });
      } else {
        // Zen: Serene ascending triad E5 -> G#5 -> B5 -> E6
        const chord = [
          { freq: 659.25, time: 0, dur: 0.12 },
          { freq: 830.61, time: 0.08, dur: 0.14 },
          { freq: 987.77, time: 0.16, dur: 0.16 },
          { freq: 1318.51, time: 0.26, dur: 0.35 }
        ];

        chord.forEach(note => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.09, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur);
        });
      }
    } catch {
      // Ignore
    }
  }

  // --- 7. Play Sample for Auditioning ---
  public playSample(pack: SoundPack) {
    const prevPack = this.currentPack;
    this.currentPack = pack;
    this.playCorrect();
    setTimeout(() => {
      this.currentPack = prevPack;
    }, 300);
  }
}

export const soundManager = new SoundManager();
