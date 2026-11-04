import sirenAudioUrl from '../assets/sounds/siren.mp3';
import flapJackAudioUrl from '../assets/sounds/flap-jack-scream.mp3';
import nuclearAlarmAudioUrl from '../assets/sounds/nuclear-alarm-siren.mp3';
import failAudioUrl from '../assets/sounds/fail.mp3';
import rockAudioUrl from '../assets/sounds/rock.mp3';
import detiAudioUrl from '../assets/sounds/deti.mp3';
import squealAudioUrl from '../assets/sounds/squeal.mp3';
import winAudioUrl from '../assets/sounds/win.mp3';
import krabAudioUrl from '../assets/sounds/krab.mp3';

import {
  audio_b64_siren,
  audio_b64_flap_jack_scream,
  audio_b64_nuclear_alarm_siren,
  audio_b64_fail,
  audio_b64_rock,
  audio_b64_deti,
  audio_b64_squeal,
  audio_b64_win,
  audio_b64_krab,
} from '../assets/audioBase64';

export type SoundKey = 'siren' | 'scream' | 'nuclear' | 'fail' | 'rock' | 'deti' | 'squeal' | 'win' | 'krab';

// Primary base64 in-memory data URIs (instant, 100% offline, zero network delay or CORS)
export const USER_SOUND_BASE64: Record<SoundKey, string> = {
  siren: audio_b64_siren,
  scream: audio_b64_flap_jack_scream,
  nuclear: audio_b64_nuclear_alarm_siren,
  fail: audio_b64_fail,
  rock: audio_b64_rock,
  deti: audio_b64_deti,
  squeal: audio_b64_squeal,
  win: audio_b64_win,
  krab: audio_b64_krab,
};

// All user audio files mapped to multiple fallback URLs
export const USER_SOUND_FILES: Record<SoundKey, string[]> = {
  siren: [audio_b64_siren, sirenAudioUrl, '/sounds/siren.mp3', '/siren.mp3'],
  scream: [audio_b64_flap_jack_scream, flapJackAudioUrl, '/sounds/flap-jack-scream.mp3', '/flap-jack-scream.mp3'],
  nuclear: [audio_b64_nuclear_alarm_siren, nuclearAlarmAudioUrl, '/sounds/nuclear-alarm-siren.mp3', '/nuclear-alarm-siren.mp3'],
  fail: [audio_b64_fail, failAudioUrl, '/sounds/fail.mp3', '/fail.mp3'],
  rock: [audio_b64_rock, rockAudioUrl, '/sounds/rock.mp3', '/rock.mp3'],
  deti: [audio_b64_deti, detiAudioUrl, '/sounds/deti.mp3', '/deti.mp3'],
  squeal: [audio_b64_squeal, squealAudioUrl, '/sounds/squeal.mp3', '/squeal.mp3'],
  win: [audio_b64_win, winAudioUrl, '/sounds/win.mp3', '/win.mp3'],
  krab: [audio_b64_krab, krabAudioUrl, '/sounds/krab.mp3', '/krab.mp3'],
};

// Helper: convert Base64 Data URL to ArrayBuffer in memory
function dataUriToArrayBuffer(dataUri: string): ArrayBuffer {
  const base64Index = dataUri.indexOf(';base64,');
  const base64 = base64Index !== -1 ? dataUri.slice(base64Index + 8) : dataUri;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

class SoundManager {
  private ctx: AudioContext | null = null;
  public isUnlocked = false;
  private masterVolume: number = 1.0;

  // Decoded WebAudio buffers
  private buffers: Record<SoundKey, AudioBuffer | null> = {
    siren: null,
    scream: null,
    nuclear: null,
    fail: null,
    rock: null,
    deti: null,
    squeal: null,
    win: null,
    krab: null,
  };

  // Pre-warmed HTMLAudioElement pools for instant HTML5 playback
  private audioPool: Record<SoundKey, HTMLAudioElement[]> = {
    siren: [],
    scream: [],
    nuclear: [],
    fail: [],
    rock: [],
    deti: [],
    squeal: [],
    win: [],
    krab: [],
  };
  private poolIndex: Record<SoundKey, number> = {
    siren: 0,
    scream: 0,
    nuclear: 0,
    fail: 0,
    rock: 0,
    deti: 0,
    squeal: 0,
    win: 0,
    krab: 0,
  };

  // Active looping node for deti.mp3
  private detiLoopAudio: HTMLAudioElement | null = null;
  private detiLoopSource: AudioBufferSourceNode | null = null;
  private detiLoopGain: GainNode | null = null;
  private activeSources: Set<AudioBufferSourceNode> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedVol = localStorage.getItem('app_master_volume');
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.masterVolume = parsed;
          }
        }
      } catch {}

      // Pre-warm audio pools with in-memory base64 audio
      try {
        const keys: SoundKey[] = ['siren', 'scream', 'nuclear', 'fail', 'rock', 'deti', 'squeal', 'win', 'krab'];
        for (const k of keys) {
          const uri = USER_SOUND_BASE64[k];
          for (let i = 0; i < 3; i++) {
            const el = new Audio(uri);
            el.preload = 'auto';
            this.audioPool[k].push(el);
          }
        }
      } catch {}

      // Listen for any user gesture to unlock WebAudio and HTML5 audio immediately
      const unlock = () => {
        this.unlockContext();
        this.decodeAllBuffers();
      };

      window.addEventListener('pointerdown', unlock, { passive: true, once: true });
      window.addEventListener('keydown', unlock, { passive: true, once: true });
      window.addEventListener('touchstart', unlock, { passive: true, once: true });
      window.addEventListener('click', unlock, { passive: true, once: true });

      // Decode buffers from memory on startup
      setTimeout(() => {
        this.decodeAllBuffers();
      }, 50);
    }
  }

  public setMasterVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.masterVolume = clamped;
    try {
      localStorage.setItem('app_master_volume', clamped.toString());
    } catch {}

    if (this.detiLoopAudio) {
      try {
        this.detiLoopAudio.volume = clamped;
      } catch {}
    }
    if (this.detiLoopGain && this.ctx) {
      try {
        this.detiLoopGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      } catch {}
    }

    window.dispatchEvent(new CustomEvent('volume_changed', { detail: clamped }));
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public unlockContext(): AudioContext | null {
    try {
      const ctx = this.getContext();
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        // Play silent buffer to unlock on iOS / Safari / strict iframes
        if (!this.isUnlocked) {
          try {
            const osc = ctx.createBuffer(1, 1, 22050);
            const src = ctx.createBufferSource();
            src.buffer = osc;
            src.connect(ctx.destination);
            src.start(0);
          } catch {}
        }
      }
      this.isUnlocked = true;
      return ctx;
    } catch {
      return null;
    }
  }

  private async decodeAllBuffers() {
    const ctx = this.getContext();
    if (!ctx) return;

    for (const [k, uri] of Object.entries(USER_SOUND_BASE64)) {
      const key = k as SoundKey;
      if (this.buffers[key]) continue;
      try {
        const ab = dataUriToArrayBuffer(uri);
        // Universal decodeAudioData supporting Promise and callback formats
        const decoded = await new Promise<AudioBuffer | null>((resolve) => {
          try {
            const promiseOrVoid = ctx.decodeAudioData(
              ab.slice(0),
              (buf) => resolve(buf),
              () => resolve(null)
            );
            if (promiseOrVoid && typeof (promiseOrVoid as Promise<AudioBuffer>).then === 'function') {
              (promiseOrVoid as Promise<AudioBuffer>).then(resolve).catch(() => resolve(null));
            }
          } catch {
            resolve(null);
          }
        });

        if (decoded) {
          this.buffers[key] = decoded;
        }
      } catch {}
    }
  }

  // HTML5 audio playback with pre-warmed pool and data URIs
  private playHtmlAudio(key: SoundKey, volume = 1.0, playbackRate = 1.0) {
    if (typeof Audio === 'undefined') return;
    const effectiveVol = Math.max(0, Math.min(1, volume * this.masterVolume));
    if (effectiveVol <= 0) return;

    try {
      const pool = this.audioPool[key];
      let audio: HTMLAudioElement;

      if (pool && pool.length > 0) {
        const idx = this.poolIndex[key] % pool.length;
        this.poolIndex[key] = (this.poolIndex[key] + 1) % pool.length;
        audio = pool[idx];
      } else {
        audio = new Audio(USER_SOUND_BASE64[key]);
      }

      audio.currentTime = 0;
      audio.volume = effectiveVol;
      audio.playbackRate = playbackRate;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to fresh audio element if pool item was locked
          try {
            const fallback = new Audio(USER_SOUND_BASE64[key]);
            fallback.volume = effectiveVol;
            fallback.play().catch(() => {});
          } catch {}
        });
      }
    } catch {
      try {
        const fresh = new Audio(USER_SOUND_BASE64[key]);
        fresh.volume = effectiveVol;
        fresh.play().catch(() => {});
      } catch {}
    }
  }

  // Primary playback method: WebAudio for instant low latency + HTML5 audio guarantee
  public playSound(key: SoundKey, volume = 1.0, playbackRate = 1.0) {
    const ctx = this.unlockContext();
    const effectiveVol = Math.max(0, Math.min(1, volume * this.masterVolume));
    if (effectiveVol <= 0) return;

    const buf = this.buffers[key];

    // If WebAudio is running and buffer is ready: play via WebAudio node
    if (ctx && ctx.state === 'running' && buf) {
      try {
        const srcNode = ctx.createBufferSource();
        srcNode.buffer = buf;
        srcNode.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(effectiveVol, ctx.currentTime);

        srcNode.connect(gainNode);
        gainNode.connect(ctx.destination);
        this.trackSource(srcNode);
        srcNode.start(0);
        return;
      } catch {}
    }

    // If ctx was suspended, resume and play as soon as it resumes
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (this.buffers[key]) {
          try {
            const srcNode = ctx.createBufferSource();
            srcNode.buffer = this.buffers[key];
            srcNode.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(effectiveVol, ctx.currentTime);
            srcNode.connect(gainNode);
            gainNode.connect(ctx.destination);
            this.trackSource(srcNode);
        srcNode.start(0);
          } catch {}
        }
      }).catch(() => {});
    }

    // Simultaneously trigger HTML5 audio to guarantee audible playback
    this.playHtmlAudio(key, volume, playbackRate);
  }

  // User's authentic sounds:
  playSiren() {
    this.playSound('siren', 1.0);
  }

  synthesizeSiren() {
    this.playSiren();
  }

  private trackSource(node: AudioBufferSourceNode) {
    this.activeSources.add(node);
    node.onended = () => {
      this.activeSources.delete(node);
    };
  }

  // Мгновенно останавливает все звуки приложения
  public stopAll() {
    this.activeSources.forEach((n) => {
      try {
        n.stop();
      } catch {}
    });
    this.activeSources.clear();
    (Object.keys(this.audioPool) as SoundKey[]).forEach((k) => {
      this.audioPool[k].forEach((a) => {
        try {
          a.pause();
          a.currentTime = 0;
        } catch {}
      });
    });
    try {
      this.stopDetiLoop();
    } catch {}
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch {}
  }

  playWin() {
    this.playSound('win', 1.0);
  }

  playKrab() {
    this.playSound('krab', 1.0);
  }

  playSqueal() {
    this.playSound('squeal', 1.0);
  }

  playFlapJackScream() {
    this.playSound('scream', 1.0);
  }

  playScreamer() {
    this.playFlapJackScream();
  }

  playScream() {
    this.playFlapJackScream();
  }

  synthesizeScream() {
    this.playFlapJackScream();
  }

  playNuclearAlarm() {
    this.playSound('nuclear', 1.0);
  }

  synthesizeNuclearAlarm() {
    this.playNuclearAlarm();
  }

  playFail() {
    this.playSound('fail', 1.0);
  }

  playRock() {
    this.playSound('rock', 1.0);
  }

  // deti.mp3 loop for WhereAreMyKidsTool
  startDetiLoop() {
    this.unlockContext();
    this.stopDetiLoop();

    const ctx = this.getContext();
    const buf = this.buffers['deti'];
    if (ctx && ctx.state === 'running' && buf) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.loop = true;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.95 * this.masterVolume, ctx.currentTime);

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);

        this.detiLoopSource = source;
        this.detiLoopGain = gain;
        return;
      } catch {}
    }

    if (typeof Audio !== 'undefined') {
      try {
        const aud = new Audio(USER_SOUND_BASE64.deti);
        aud.loop = true;
        aud.volume = 0.95 * this.masterVolume;
        aud.play().catch(() => {});
        this.detiLoopAudio = aud;
      } catch {}
    }
  }

  stopDetiLoop() {
    try {
      if (this.detiLoopSource) {
        this.detiLoopSource.stop();
        this.detiLoopSource.disconnect();
        this.detiLoopSource = null;
      }
      if (this.detiLoopGain) {
        this.detiLoopGain.disconnect();
        this.detiLoopGain = null;
      }
      if (this.detiLoopAudio) {
        this.detiLoopAudio.pause();
        this.detiLoopAudio.currentTime = 0;
        this.detiLoopAudio = null;
      }
    } catch {}
  }

  // Interactive UI clicks, switches, taps (uses user's rock.mp3 or fail.mp3)
  playBeep(freq = 900, _duration = 0.08) {
    const rate = Math.max(0.7, Math.min(1.6, freq / 900));
    this.playSound('rock', 0.5, rate);
  }

  playCoin() {
    this.playSound('rock', 0.7, 1.4);
  }

  playExplosion() {
    this.playSound('nuclear', 1.0, 0.9);
  }

  playGlassBreak() {
    this.playSound('fail', 0.9, 1.2);
  }

  playStaticNoise(_duration = 0.4) {
    this.playSound('nuclear', 0.4, 1.8);
  }

  playCameraClick() {
    this.playSound('rock', 0.7, 1.7);
  }

  playMicrowaveDing() {
    this.playSound('siren', 0.8, 1.3);
  }

  playPhoneRing() {
    this.playSound('siren', 0.7, 1.1);
  }

  playDrillSound() {
    this.playSound('rock', 0.85, 0.85);
  }

  playPrinterSound() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playSound('rock', 0.4, 1.2 + i * 0.1);
      }, i * 180);
    }
  }

  playSendMessage() {
    this.playSound('rock', 0.65, 1.3);
  }

  playRandomOverlappingSounds() {
    const list: SoundKey[] = ['siren', 'rock', 'fail', 'nuclear', 'scream'];
    for (let i = 0; i < 4; i++) {
      const snd = list[Math.floor(Math.random() * list.length)];
      setTimeout(() => {
        this.playSound(snd);
      }, i * 150);
    }
  }

  playOverlappingSirens() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playSiren();
      }, i * 200);
    }
  }

  playWindowsStartupSound() {
    this.playSound('rock', 0.9, 1.0);
  }

  playWindowsErrorSound() {
    this.playSound('fail', 0.95);
  }

  playTileMoveSound() {
    this.playSound('rock', 0.4, 1.3);
  }

  playTileMergeSound(value: number = 2) {
    const rate = 1.0 + Math.min(0.6, Math.log2(value || 2) * 0.08);
    this.playSound('rock', 0.7, rate);
  }
}

export const soundManager = new SoundManager();

export function triggerHaptic(type: 'tap' | 'heavy' | 'long' | 'success' = 'tap') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'tap') navigator.vibrate(8);
      else if (type === 'heavy') navigator.vibrate(25);
      else if (type === 'long') navigator.vibrate([15, 30, 15]);
      else if (type === 'success') navigator.vibrate([10, 20, 10]);
    } catch {}
  }
}
