class AudioEngine {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isMuted: boolean = true;

  constructor() {
    // Context is initialized on first user interaction
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (!this.isMuted) {
      this.startDrone();
    } else {
      this.stopDrone();
    }
  }

  private startDrone() {
    if (!this.ctx || this.droneOsc) return;

    // Create a low frequency drone (Brownian noise simulation via filtered low osc)
    this.droneOsc = this.ctx.createOscillator();
    this.droneGain = this.ctx.createGain();
    
    // Filter to make it sound like a cave/deep rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;

    this.droneOsc.type = 'sawtooth';
    this.droneOsc.frequency.value = 50; // 50Hz hum
    
    // Very low volume background
    this.droneGain.gain.value = 0.03;

    this.droneOsc.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.droneOsc.start();
  }

  private stopDrone() {
    if (this.droneOsc) {
      // Smooth fade out
      const now = this.ctx?.currentTime || 0;
      this.droneGain?.gain.setTargetAtTime(0, now, 0.5);
      setTimeout(() => {
        this.droneOsc?.stop();
        this.droneOsc?.disconnect();
        this.droneOsc = null;
      }, 1000);
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Synthesize a "chisel" or "stone click" sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // High frequency burst
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

export const audioService = new AudioEngine();
