// Native Web Audio API Ambient Soundscapes, Chimes & Guided Meditation Monitoring
// Bulletproof Mobile iOS Safari & Android Chrome audio engine

class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  public currentSound: 'none' | 'rain' | 'ocean' | 'breeze' | 'bowl' = 'none';
  private isWarmedUp = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private speechWarmedUp = false;
  private silentAudio: HTMLAudioElement | null = null;

  constructor() {
    // 1. Pre-load speech voices when available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.cachedVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          this.cachedVoices = window.speechSynthesis.getVoices();
        });
      } catch (e) {}
    }

    // 2. Pre-create silent audio element for iOS audio session unlock (Playback category)
    if (typeof window !== 'undefined') {
      try {
        this.silentAudio = new Audio(
          'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
        );
        this.silentAudio.setAttribute('playsinline', 'true');
        this.silentAudio.setAttribute('preload', 'auto');
      } catch (e) {}
    }
  }

  public initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Warm up AudioContext & Media Session from a direct user gesture (essential for iOS Safari / Android)
  public async warmUp() {
    try {
      this.initContext();

      // Trigger silent HTML5 Audio element to force iOS into Playback audio category
      if (this.silentAudio) {
        this.silentAudio.play().catch(() => {});
      }

      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          await this.ctx.resume();
        }

        // iOS Safari unlock buffer
        if (!this.isWarmedUp) {
          const silentBuffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
          const source = this.ctx.createBufferSource();
          source.buffer = silentBuffer;
          source.connect(this.masterGain || this.ctx.destination);
          source.start(0);
          this.isWarmedUp = true;
        }
      }
    } catch (e) {
      console.warn('Audio warm-up error:', e);
    }
  }

  // Warm up Web Speech API from a direct user gesture (unlocks speech engine on iOS)
  public warmUpSpeech() {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (this.speechWarmedUp) return;
      const utterance = new SpeechSynthesisUtterance(' ');
      utterance.volume = 0.01;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      this.speechWarmedUp = true;
    } catch (e) {}
  }

  // Harmonic singing bowl chime
  public playChime() {
    try {
      this.warmUp();
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const targetDestination = this.masterGain || this.ctx.destination;

      // Fundamental singing bowl harmonics (432Hz calming pitch)
      const frequencies = [432, 864, 1296, 1728];
      const gains = [0.28, 0.12, 0.05, 0.02];

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
        gain.connect(targetDestination);

        osc.start(now);
        osc.stop(now + 4.6);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Phase-specific guided audio cues for breathwork
  public playBreathingTone(phase: 'inhale' | 'hold1' | 'exhale' | 'hold2') {
    try {
      this.warmUp();
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const targetDest = this.masterGain || this.ctx.destination;

      if (phase === 'inhale') {
        // Uplifting ascending harmonic tone (396Hz -> 528Hz Solfeggio frequency)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(396, now);
        osc1.frequency.exponentialRampToValueAtTime(528, now + 1.4);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(396 * 2, now);
        osc2.frequency.exponentialRampToValueAtTime(528 * 2, now + 1.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(targetDest);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.3);
        osc2.stop(now + 2.3);
      } else if (phase === 'hold1') {
        // Crystal singing bowl bell (528Hz pure harmonic shimmer)
        const freqs = [528, 1056, 1584];
        const amps = [0.24, 0.09, 0.03];

        freqs.forEach((f, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(amps[idx], now + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

          osc.connect(gain);
          gain.connect(targetDest);

          osc.start(now);
          osc.stop(now + 2.9);
        });
      } else if (phase === 'exhale') {
        // Relaxing descending wave (528Hz -> 396Hz -> 264Hz)
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now);
        osc.frequency.exponentialRampToValueAtTime(264, now + 1.8);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(264, now);
        subOsc.frequency.exponentialRampToValueAtTime(176, now + 1.8);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(targetDest);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 2.6);
        subOsc.stop(now + 2.6);
      } else if (phase === 'hold2') {
        // Grounding warm earth resonance (216Hz calm stillness)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc.connect(gain);
        gain.connect(targetDest);

        osc.start(now);
        osc.stop(now + 2.1);
      }
    } catch (e) {
      console.warn('Breathing tone audio error:', e);
    }
  }

  // Soft rhythmic tick for eyes-closed breath timing
  public playSubtleTick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Haptic pulse for mobile vibration feedback (feel the rhythm)
  public triggerHaptic(pattern: number | number[] = 40) {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  // Guided spoken voice prompt (Web Speech API with mobile Safari safety)
  public speakGuidedCue(text: string) {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      // On iOS Safari, cancel only if actively speaking to avoid engine freeze
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Small async tick so cancel finishes cleanly
      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.88; // Meditative natural pace
          utterance.pitch = 0.98; // Grounded tone
          utterance.volume = 1.0;

          // Select natural English voice if available
          const voices =
            this.cachedVoices.length > 0
              ? this.cachedVoices
              : window.speechSynthesis.getVoices();

          const preferred =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Samantha') ||
                  v.name.includes('Natural') ||
                  v.name.includes('Serena') ||
                  v.name.includes('Google') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('Karen') ||
                  v.name.includes('Arthur'))
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (preferred) {
            utterance.voice = preferred;
          }

          utterance.onerror = (err) => {
            console.warn('SpeechSynthesis error:', err);
          };

          window.speechSynthesis.speak(utterance);
        } catch (innerErr) {
          console.warn('Utterance speak error:', innerErr);
        }
      }, 35);
    } catch (e) {
      console.warn('Voice guidance speech error:', e);
    }
  }

  public setAmbientSound(sound: 'none' | 'rain' | 'ocean' | 'breeze') {
    this.stopAmbient();
    if (sound === 'none') {
      this.currentSound = 'none';
      return;
    }

    try {
      this.warmUp();
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
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
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
      gain.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

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

// Global unlock on ANY user touch on the page for zero-lag mobile playback
if (typeof window !== 'undefined') {
  const globalUnlock = () => {
    soundManager.warmUp();
    soundManager.warmUpSpeech();
  };
  window.addEventListener('touchstart', globalUnlock, { once: true, passive: true });
  window.addEventListener('pointerdown', globalUnlock, { once: true, passive: true });
  window.addEventListener('click', globalUnlock, { once: true, passive: true });
}
