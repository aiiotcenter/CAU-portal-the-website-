/**
 * ==============================================================================
 * CYPRUS AYDIN UNIVERSITY (CAU) — ARENA SFX & SPEECH SYNTHESIZER
 * Zero-dependency procedural audio engine powered by Web Audio API & Web Speech API.
 * 0ms latency • 0 external audio files • Duolingo-inspired harmonic aesthetics
 * ==============================================================================
 */

class ArenaSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    try {
      this.isMuted = localStorage.getItem('cau_arena_muted') === 'true';
    } catch {}

    // Lazily initialized on first user interaction to comply with browser autoplay policy
    this.initAudioContext = this.initAudioContext.bind(this);
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('cau_arena_muted', String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  setMute(muted) {
    this.isMuted = Boolean(muted);
    try {
      localStorage.setItem('cau_arena_muted', String(this.isMuted));
    } catch {}
  }

  /* ── 1. DUOLINGO-STYLE CORRECT CHIME (Ascending Major Triad with Bell Decay) ── */
  playSuccess() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Bell envelope: instant attack, exponential ring-out
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  /* ── 2. ERROR THUD (Low-Frequency Damped Triangle Wave with Pitch Sweep) ── */
  playError() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Downward pitch drop: 150Hz -> 75Hz
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.28);

    // Damped thud envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /* ── 3. FANFARE / CHEST UNLOCK (Sparkling 4-Note Arpeggio) ── */
  playLevelUp() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 octave

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.24, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  /* ── 4. TACTILE CHIP CLICK ── */
  playClick() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /* ── 5. CHEST SHIMMER ── */
  playChestUnlock() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [783.99, 987.77, 1174.66, 1318.51, 1567.98]; // G5, B5, D6, E6, G6

    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  }

  /* ── 6. WEB SPEECH API (Native TTS for Listening & Dictation) ── */
  speakText(text, rate = 1.0, lang = 'en-US') {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      utterance.pitch = 1.0;
      utterance.lang = lang;

      // Select high quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Failed to synthesize speech:', e);
    }
  }
}

export const arenaSfx = new ArenaSoundEngine();

if (typeof window !== 'undefined') {
  window.arenaSfx = arenaSfx;
}
