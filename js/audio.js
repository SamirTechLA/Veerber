/**
 * Coniugiamo! - Web Audio Sound Effects Synthesizer
 */

const AudioManager = {
  ctx: null,
  enabled: true,

  init() {
    if (this.ctx) return;
    // Create audio context lazily on user interaction to bypass browser autoplay policies
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser.", e);
      this.enabled = false;
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  },

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Play a sweet ascending arpeggio: C5 (523.25 Hz) -> E5 (659.25 Hz) -> G5 (783.99 Hz)
    const notes = [523.25, 659.25, 783.99];
    const duration = 0.08;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * duration);
      
      gain.gain.setValueAtTime(0, t + idx * duration);
      gain.gain.linearRampToValueAtTime(0.15, t + idx * duration + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * duration + duration + 0.1);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t + idx * duration);
      osc.stop(t + idx * duration + duration + 0.15);
    });
  },

  playFailure() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Play a low, descending sliding buzz
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.25);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  },

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Play a rich, magical chime (C4 -> G4 -> C5 -> E5 -> G5 -> C6)
    const notes = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    const duration = 0.07;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * duration);
      
      gain.gain.setValueAtTime(0, t + idx * duration);
      gain.gain.linearRampToValueAtTime(0.12, t + idx * duration + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * duration + duration + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t + idx * duration);
      osc.stop(t + idx * duration + duration + 0.35);
    });
  },

  playClick() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Play a tiny tick sound (whoosh/click)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }
};

window.AudioManager = AudioManager;
