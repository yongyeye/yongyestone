class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneNodes: AudioNode[] = []; 
  private artifactInterval: number | null = null;
  private isMuted: boolean = false; 
  private isDronePlaying: boolean = false;

  constructor() {
    // Context initialized lazily
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4; 
      this.masterGain.connect(this.ctx.destination);
    }
  }

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

  // Helper to create a stereo panner
  private createPanner(pan: number): StereoPannerNode | null {
      if (!this.ctx) return null;
      const panner = this.ctx.createStereoPanner();
      // Clamp pan between -1 and 1
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      return panner;
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain || this.isDronePlaying) return;
    this.isDronePlaying = true;
    
    // Drone usually stays centered or wide, not point-source panned
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.value = 45; 
    subGain.gain.value = 0.15;
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start();
    this.droneNodes.push(subOsc, subGain);

    const choirFreqs = [138.59, 207.65, 279.00, 137.5]; 
    choirFreqs.forEach((f) => {
        if(!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner();

        osc.type = 'triangle';
        osc.frequency.value = f;

        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05 + (Math.random() * 0.05); 
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.02; 
        
        const baseVol = 0.03;
        gain.gain.value = baseVol;
        
        lfo.connect(gain.gain); 
        lfo.start();

        panner.pan.value = (Math.random() * 2) - 1;

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
        osc.start();
        
        this.droneNodes.push(osc, gain, panner, lfo, lfoGain);
    });

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
      const panner = this.ctx.createStereoPanner();

      osc.type = Math.random() > 0.5 ? 'sawtooth' : 'square';
      osc.frequency.value = 2000 + Math.random() * 6000;
      
      filter.type = 'highpass';
      filter.frequency.value = 3000;

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      panner.pan.value = (Math.random() * 2) - 1; // Random location for artifacts

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.05);
  }

  private stopDrone() {
    this.isDronePlaying = false;
    if (this.artifactInterval) clearInterval(this.artifactInterval);
    this.droneNodes.forEach(node => {
        if (node instanceof AudioScheduledSourceNode) {
            try { node.stop(); } catch(e) {}
        }
        node.disconnect();
    });
    this.droneNodes = [];
  }

  // --- INTERACTION SFX with Panning ---

  public playClick(pan: number = 0) {
    this.resume(); 
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const panner = this.createPanner(pan);
    if (!panner) return;

    const carrier = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const masterEnv = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.value = 600;

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(800, t);
    carrier.frequency.exponentialRampToValueAtTime(100, t + 0.3);

    modulator.type = 'square';
    modulator.frequency.value = 1340; 

    modGain.gain.setValueAtTime(2000, t);
    modGain.gain.exponentialRampToValueAtTime(0.1, t + 0.1);

    masterEnv.gain.setValueAtTime(0.4, t);
    masterEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(filter);
    filter.connect(masterEnv);
    masterEnv.connect(panner);
    panner.connect(this.masterGain);

    carrier.start(t);
    modulator.start(t);
    carrier.stop(t + 0.3);
    modulator.stop(t + 0.3);
  }

  public playFracture(pan: number = 0) {
      this.resume();
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const panner = this.createPanner(pan);
      if (!panner) return;

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
      noiseGain.connect(panner);

      const tear = this.ctx.createOscillator();
      tear.type = 'sawtooth';
      tear.frequency.setValueAtTime(800, t);
      tear.frequency.exponentialRampToValueAtTime(50, t + 0.4);
      
      const tearGain = this.ctx.createGain();
      tearGain.gain.setValueAtTime(0.3, t);
      tearGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      tear.connect(tearGain);
      tearGain.connect(panner);
      
      panner.connect(this.masterGain);

      noise.start(t);
      tear.start(t);
  }

  public playRain(pan: number = 0) {
      this.resume();
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const panner = this.createPanner(pan);
      if (!panner) return;

      // Randomize pan slightly per drip for width
      panner.connect(this.masterGain);
      
      for(let i=0; i<3; i++) {
          const offset = i * 0.08 + Math.random() * 0.05;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, t + offset); 
          osc.frequency.exponentialRampToValueAtTime(50, t + offset + 0.1);
          
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0, t + offset);
          gain.gain.linearRampToValueAtTime(0.4, t + offset + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);

          const lp = this.ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = 400;

          osc.connect(lp);
          lp.connect(gain);
          gain.connect(panner); 
          osc.start(t + offset);
          osc.stop(t + offset + 0.3);
      }
  }

  public playRepair() {
      this.resume();
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      // Repair sound is usually centered, no panning needed
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

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