// Modern Web Audio Generative Music & Binaural Focus Soundscapes
// Generates real ambient music (Lo-Fi chords, binaural beats, generative pads, rainfall)

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  type: 'lofi' | 'binaural' | 'rain' | 'theta' | 'gamma';
  description: string;
}

export const FOCUS_TRACKS: MusicTrack[] = [
  {
    id: 'deep-alpha',
    title: 'Alpha Flow 10Hz',
    artist: 'Sankalp Brainwave',
    type: 'binaural',
    description: '10Hz binaural beats for effortless deep cognitive focus and sustained flow.',
  },
  {
    id: 'kyoto-lofi',
    title: 'Kyoto Rain Chords',
    artist: 'Ambient Sanctuary',
    type: 'lofi',
    description: 'Warm electric piano chord voicings with soft analog vinyl warmth.',
  },
  {
    id: 'tokyo-rain',
    title: 'Midnight Rain & Wind',
    artist: 'Nature Acoustic',
    type: 'rain',
    description: 'Natural low-pass filtered rainfall with gentle distance swells.',
  },
  {
    id: 'theta-stillness',
    title: 'Theta 6Hz Stillness',
    artist: 'Calm Synthesis',
    type: 'theta',
    description: 'Sub-bass drone with 6Hz relaxation frequency for anxiety reduction.',
  },
  {
    id: 'gamma-focus',
    title: '40Hz Gamma Focus',
    artist: 'Neural Synthesis',
    type: 'gamma',
    description: '40Hz rhythmic pulse scientifically shown to enhance attention & memory.',
  },
];

class FocusMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId: string = 'deep-alpha';
  private masterGain: GainNode | null = null;
  private volume = 0.5;
  private activeNodes: (AudioNode | number)[] = [];
  private sequenceTimer: any = null;
  private onStateChangeCallback: (() => void) | null = null;

  public subscribe(cb: () => void) {
    this.onStateChangeCallback = cb;
  }

  private notify() {
    if (this.onStateChangeCallback) this.onStateChangeCallback();
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getCurrentTrack(): MusicTrack {
    return FOCUS_TRACKS.find((t) => t.id === this.currentTrackId) || FOCUS_TRACKS[0];
  }

  public getVolume() {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(this.currentTrackId);
    }
  }

  public play(trackId?: string) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (trackId) {
      this.currentTrackId = trackId;
    }

    this.stopNodes();
    this.isPlaying = true;
    this.notify();

    const track = this.getCurrentTrack();

    switch (track.type) {
      case 'binaural':
        this.playBinaural(216, 10); // 10Hz Alpha beat
        break;
      case 'theta':
        this.playBinaural(144, 6); // 6Hz Theta beat
        break;
      case 'gamma':
        this.playGamma(240, 40); // 40Hz Gamma beat
        break;
      case 'lofi':
        this.playLofiChords();
        break;
      case 'rain':
        this.playRainfall();
        break;
    }
  }

  public nextTrack() {
    const curIdx = FOCUS_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const nextIdx = (curIdx + 1) % FOCUS_TRACKS.length;
    this.play(FOCUS_TRACKS[nextIdx].id);
  }

  public prevTrack() {
    const curIdx = FOCUS_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const prevIdx = (curIdx - 1 + FOCUS_TRACKS.length) % FOCUS_TRACKS.length;
    this.play(FOCUS_TRACKS[prevIdx].id);
  }

  public stop() {
    this.stopNodes();
    this.isPlaying = false;
    this.notify();
  }

  private stopNodes() {
    if (this.sequenceTimer) {
      clearInterval(this.sequenceTimer);
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    this.activeNodes.forEach((node) => {
      if (typeof node === 'object' && 'stop' in node) {
        try {
          (node as AudioScheduledSourceNode).stop();
        } catch (e) {}
      } else if (typeof node === 'object' && 'disconnect' in node) {
        try {
          (node as AudioNode).disconnect();
        } catch (e) {}
      }
    });
    this.activeNodes = [];
  }

  // 1. Binaural Beats Engine (Stereo panned frequency separation)
  private playBinaural(baseFreq: number, beatFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Ambient warm carrier pad
    const padOsc = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    padOsc.type = 'sine';
    padOsc.frequency.setValueAtTime(baseFreq / 2, now);
    padGain.gain.setValueAtTime(0.04, now);
    padOsc.connect(padGain);
    padGain.connect(this.masterGain);
    padOsc.start(now);
    this.activeNodes.push(padOsc, padGain);

    // Left Ear: baseFreq
    const leftOsc = this.ctx.createOscillator();
    const leftPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const leftGain = this.ctx.createGain();

    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(baseFreq, now);
    leftGain.gain.setValueAtTime(0.08, now);

    if (leftPanner) {
      leftPanner.pan.setValueAtTime(-1, now);
      leftOsc.connect(leftGain);
      leftGain.connect(leftPanner);
      leftPanner.connect(this.masterGain);
    } else {
      leftOsc.connect(leftGain);
      leftGain.connect(this.masterGain);
    }
    leftOsc.start(now);
    this.activeNodes.push(leftOsc, leftGain);

    // Right Ear: baseFreq + beatFreq
    const rightOsc = this.ctx.createOscillator();
    const rightPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const rightGain = this.ctx.createGain();

    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, now);
    rightGain.gain.setValueAtTime(0.08, now);

    if (rightPanner) {
      rightPanner.pan.setValueAtTime(1, now);
      rightOsc.connect(rightGain);
      rightGain.connect(rightPanner);
      rightPanner.connect(this.masterGain);
    } else {
      rightOsc.connect(rightGain);
      rightGain.connect(this.masterGain);
    }
    rightOsc.start(now);
    this.activeNodes.push(rightOsc, rightGain);
  }

  // 2. 40Hz Gamma Amplitude Modulation
  private playGamma(baseFreq: number, modFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const carrier = this.ctx.createOscillator();
    carrier.type = 'triangle';
    carrier.frequency.setValueAtTime(baseFreq, now);

    const ampMod = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(modFreq, now);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.5, now);
    ampMod.gain.setValueAtTime(0.5, now);

    lfo.connect(lfoGain);
    lfoGain.connect(ampMod.gain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    carrier.connect(filter);
    filter.connect(ampMod);
    ampMod.connect(this.masterGain);

    carrier.start(now);
    lfo.start(now);
    this.activeNodes.push(carrier, lfo, ampMod, filter);
  }

  // 3. Generative Lo-Fi Ambient Chords
  private playLofiChords() {
    if (!this.ctx || !this.masterGain) return;

    // Soft vinyl crackle noise
    this.addVinylNoise();

    // Pentatonic jazz chords: F minor 9, Bb minor 7, Eb dominant 9, Ab major 7
    const chords = [
      [174.61, 220.0, 261.63, 329.63], // F, A, C, E
      [220.0, 261.63, 329.63, 392.0],  // A, C, E, G
      [196.0, 246.94, 293.66, 369.99], // G, B, D, F#
      [164.81, 207.65, 246.94, 311.13] // E, G#, B, D#
    ];

    let chordIdx = 0;

    const triggerChord = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.3 + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.04);
        osc.stop(now + 4.0);
      });
    };

    triggerChord();
    this.sequenceTimer = setInterval(triggerChord, 4200);
  }

  // 4. Natural Rainfall Generator
  private playRainfall() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.08;
      b2 = 0.85 * b2 + white * 0.15;
      output[i] = (b0 + b1 + b2) * 0.08;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);
  }

  private addVinylNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.008;
    }

    const vinyl = this.ctx.createBufferSource();
    vinyl.buffer = noiseBuffer;
    vinyl.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3500;

    vinyl.connect(filter);
    filter.connect(this.masterGain);
    vinyl.start();
    this.activeNodes.push(vinyl, filter);
  }
}

export const focusMusic = new FocusMusicEngine();
