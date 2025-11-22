
class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneNodes: AudioNode[] = []; // Store all running nodes to kill them later
  private artifactInterval: number | null = null;
  private isMuted: boolean = false; // Default to enabled (logic handled in App)
  private isDronePlaying: boolean = false;

  constructor() {
    // Context initialized lazily
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4; // Overall volume cap
      this.masterGain.connect(this.ctx.destination);
    }
  }

  /**
   * Browsers require a user gesture to start audio.
   * This should be called on the first global click.
   */
  public async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (!this.isMuted && !this.isDronePlaying) {
      this.startDrone();
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopDrone();
    } else {
      this.resume();
    }
  }

  // --- SOUND DESIGN: "MAGDALENE" (Sacred/Industrial) ---

  private startDrone() {
    if (!this.ctx || !this.masterGain || this.isDronePlaying) return;
    this.isDronePlaying = true;
    const now = this.ctx.currentTime;

    // 1. THE SUB (Physical Weight)
    // Deep, constant rumble representing the stone mass
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.value = 45; // Low G#
    subGain.gain.value = 0.15;
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start();
    this.droneNodes.push(subOsc, subGain);

    // 2. THE CHOIR (Ethereal/Uneasy)
    // Cluster of Triangle waves with slow LFOs to simulate breathing/bowing
    const choirFreqs = [138.59, 207.65, 279.00, 137.5]; // C#3 cluster, slightly detuned
    choirFreqs.forEach((f, i) => {
        if(!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner();

        osc.type = 'triangle';
        osc.frequency.value = f;

        // LFO for volume (Breathing)
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05 + (Math.random() * 0.05); // Very slow
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.02; 
        
        // Base volume
        const baseVol = 0.03;
        gain.gain.value = baseVol;
        
        lfo.connect(gain.gain); // Modulate volume directly
        lfo.start();

        // Pan spread
        panner.pan.value = (Math.random() * 2) - 1;

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
        osc.start();
        
        this.droneNodes.push(osc, gain, panner, lfo, lfoGain);
    });

    // 3. THE GLITCH (Technological Imperfection)
    // Random metallic artifacts triggers
    this.artifactInterval = window.setInterval(() => {
        if(Math.random() > 0.7) this.playArtifact();
    }, 800);
  }

  private playArtifact() {
      if(!this.ctx || !this.masterGain || this.isMuted) return;
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // High pitched, short blip
      osc.type = Math.random() > 0.5 ? 'sawtooth' : 'square';
      osc.frequency.value = 2000 + Math.random() * 6000;
      
      filter.type = 'highpass';
      filter.frequency.value = 3000;

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.05);
  }

  private stopDrone() {
    this.isDronePlaying = false;
    if (this.artifactInterval) clearInterval(this.artifactInterval);
    
    // Clean up nodes
    this.droneNodes.forEach(node => {
        if (node instanceof AudioScheduledSourceNode) {
            try { node.stop(); } catch(e) {}
        }
        node.disconnect();
    });
    this.droneNodes = [];
  }

  // --- INTERACTION SFX ---

  // "Metallic / Glass" - FM Synthesis
  public playClick() {
    this.resume(); // Ensure audio is awake
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // FM Setup
    const carrier = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const masterEnv = this.ctx.createGain();
    
    // Filter to make it brittle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 600;

    // Carrier: High pure tone
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(800, t);
    carrier.frequency.exponentialRampToValueAtTime(100, t + 0.3);

    // Modulator: Inharmonic ratio for metal sound
    modulator.type = 'square';
    modulator.frequency.value = 1340; // 1.675 ratio approx

    // Heavy Modulation -> Fast Decay
    modGain.gain.setValueAtTime(2000, t);
    modGain.gain.exponentialRampToValueAtTime(0.1, t + 0.1);

    // Master Volume Envelope
    masterEnv.gain.setValueAtTime(0.4, t);
    masterEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    // Routing
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(filter);
    filter.connect(masterEnv);
    masterEnv.connect(this.masterGain);

    carrier.start(t);
    modulator.start(t);
    carrier.stop(t + 0.3);
    modulator.stop(t + 0.3);
  }

  public playFracture() {
      this.resume();
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      // 1. The Snap (Noise burst)
      const noiseBufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, noiseBufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < noiseBufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      const noiseGain = this.ctx.createGain();
      
      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(t);

      // 2. The Tearing (Sawtooth slide)
      const tear = this.ctx.createOscillator();
      tear.type = 'sawtooth';
      tear.frequency.setValueAtTime(800, t);
      tear.frequency.exponentialRampToValueAtTime(50, t + 0.4);
      
      const tearGain = this.ctx.createGain();
      tearGain.gain.setValueAtTime(0.3, t);
      tearGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      tear.connect(tearGain);
      tearGain.connect(this.masterGain);
      tear.start(t);
  }

  public playRain() {
      this.resume();
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      
      // Multiple drips
      for(let i=0; i<3; i++) {
          const offset = i * 0.08 + Math.random() * 0.05;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, t + offset); // Low thud
          osc.frequency.exponentialRampToValueAtTime(50, t + offset + 0.1);
          
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0, t + offset);
          gain.gain.linearRampToValueAtTime(0.4, t + offset + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);

          // Lowpass to make it "heavy/liquid"
          const lp = this.ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = 400;

          osc.connect(lp);
          lp.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t + offset);
          osc.stop(t + offset + 0.3);
      }
  }

  public playRepair() {
      this.resume();
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Rising swelling tone (Reversed sound feeling)
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 2.0);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 1.5);
      gain.gain.linearRampToValueAtTime(0, t + 2.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 2.0);
  }
}

export const audioService = new AudioEngine();