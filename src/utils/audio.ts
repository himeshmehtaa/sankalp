// Native Web Audio API Ambient Soundscapes & Chimes (Zero external dependencies)
class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  public currentSound: 'none' | 'rain' | 'ocean' | 'breeze' | 'bowl' = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fundamental singing bowl harmonics (432Hz calming pitch)
      const frequencies = [432, 864, 1296, 1728];
      const gains = [0.25, 0.1, 0.04, 0.015];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.6);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  public setAmbientSound(sound: 'none' | 'rain' | 'ocean' | 'breeze') {
    this.stopAmbient();
    if (sound === 'none') {
      this.currentSound = 'none';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx) return;

      this.currentSound = sound;
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate pink / brown noise for natural textures
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter based on selected sound
      const filter = this.ctx.createBiquadFilter();
      if (sound === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1100;
      } else if (sound === 'ocean') {
        filter.type = 'bandpass';
        filter.frequency.value = 450;
        filter.Q.value = 0.7;
      } else if (sound === 'breeze') {
        filter.type = 'lowpass';
        filter.frequency.value = 650;
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.currentSource = whiteNoise;
      this.gainNode = gain;
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  public stopAmbient() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        setTimeout(() => {
          if (this.currentSource) {
            (this.currentSource as AudioScheduledSourceNode).stop?.();
            this.currentSource = null;
          }
        }, 400);
      } catch (e) {}
    } else if (this.currentSource) {
      (this.currentSource as AudioScheduledSourceNode).stop?.();
      this.currentSource = null;
    }
    this.currentSound = 'none';
  }
}

export const soundManager = new AmbientAudioManager();
