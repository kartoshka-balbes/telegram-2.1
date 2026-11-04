import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Phone, PhoneOff, User } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

// Таймеры, на которые не влияет закрытие приложений
const nativeSetTimeout: typeof window.setTimeout = window.setTimeout.bind(window);
const nativeSetInterval: typeof window.setInterval = window.setInterval.bind(window);

type EventKind = 'call' | 'virus';

const CHECK_INTERVAL_MS = 2 * 60 * 1000; // раз в 2 минуты
const EVENT_CHANCE = 0.04; // шанс 4%

// Азбука Морзе (русская): «уральские пельмени»
const MORSE: Record<string, string> = {
  у: '..-', р: '.-.', а: '.-', л: '.-..', ь: '-..-', с: '...', к: '-.-', и: '..', е: '.',
  п: '.--.', м: '--', н: '-.',
};
const PHRASE = 'уральские пельмени';

const UNIT = 0.09; // длительность точки, сек
const TONE_HZ = 700;

interface MorseEvent {
  start: number;
  dur: number;
}

const buildMorse = (): { events: MorseEvent[]; total: number } => {
  const events: MorseEvent[] = [];
  let t = 0;
  const words = PHRASE.split(' ');
  words.forEach((word, wi) => {
    const letters = word.split('');
    letters.forEach((ch, li) => {
      const code = MORSE[ch] || '';
      code.split('').forEach((sym, si) => {
        const d = sym === '.' ? UNIT : UNIT * 3;
        events.push({ start: t, dur: d });
        t += d;
        if (si < code.length - 1) t += UNIT; // пауза между знаками
      });
      if (li < letters.length - 1) t += UNIT * 3; // пауза между буквами
    });
    if (wi < words.length - 1) t += UNIT * 7; // пауза между словами
  });
  return { events, total: t };
};

export const RandomEvents: React.FC = () => {
  const [active, setActive] = useState<EventKind | null>(null);
  const [answered, setAnswered] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  const activeRef = useRef<EventKind | null>(null);
  const ctxNodes = useRef<OscillatorNode[]>([]);
  const timers = useRef<number[]>([]);
  const ringRef = useRef<number | null>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (ringRef.current) {
      window.clearInterval(ringRef.current);
      ringRef.current = null;
    }
  };

  const stopTones = () => {
    ctxNodes.current.forEach((o) => {
      try {
        o.stop();
      } catch {}
    });
    ctxNodes.current = [];
  };

  const endEvent = useCallback(() => {
    clearTimers();
    stopTones();
    soundManager.stopAll();
    activeRef.current = null;
    setActive(null);
    setAnswered(false);
    setCallSeconds(0);
  }, []);

  /* ----- Звонок с номера 444 ----- */
  const ringOnce = () => {
    const ctx = soundManager.unlockContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // классический двойной звонок: 2 всплеска по 0.4 с
    [0, 0.6].forEach((off) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 440;
      osc2.frequency.value = 480;
      gain.gain.setValueAtTime(0.0001, now + off);
      gain.gain.exponentialRampToValueAtTime(0.25, now + off + 0.02);
      gain.gain.setValueAtTime(0.25, now + off + 0.38);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.42);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + off);
      osc2.start(now + off);
      osc.stop(now + off + 0.45);
      osc2.stop(now + off + 0.45);
      ctxNodes.current.push(osc, osc2);
    });
  };

  const startCall = useCallback(() => {
    soundManager.stopAll(); // все старые звуки выключаются
    activeRef.current = 'call';
    setActive('call');
    setAnswered(false);
    setCallSeconds(0);
    ringOnce();
    ringRef.current = nativeSetInterval(ringOnce, 3000);
  }, []);

  const answerCall = () => {
    if (answered) return;
    clearTimers();
    stopTones();
    setAnswered(true);
    setCallSeconds(0);

    const ctx = soundManager.unlockContext();
    const { events, total } = buildMorse();

    if (ctx) {
      const base = ctx.currentTime + 0.5;
      events.forEach((e) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = TONE_HZ;
        gain.gain.setValueAtTime(0.0001, base + e.start);
        gain.gain.exponentialRampToValueAtTime(0.35, base + e.start + 0.008);
        gain.gain.setValueAtTime(0.35, base + e.start + e.dur - 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, base + e.start + e.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(base + e.start);
        osc.stop(base + e.start + e.dur + 0.02);
        ctxNodes.current.push(osc);
      });
    }

    // тикающий таймер разговора
    ringRef.current = nativeSetInterval(() => setCallSeconds((s) => s + 1), 1000);

    // после шифра звонок остаётся ещё на 2 секунды и сам сбрасывается
    const endMs = (0.5 + total) * 1000 + 2000;
    timers.current.push(nativeSetTimeout(() => endEvent(), endMs));
  };

  /* ----- Предупреждение о вирусе ----- */
  const startVirus = useCallback(() => {
    activeRef.current = 'virus';
    setActive('virus');
    soundManager.playNuclearAlarm();
    soundManager.playScream();
    soundManager.playSiren();
    soundManager.playOverlappingSirens();
    timers.current.push(nativeSetTimeout(() => soundManager.playFlapJackScream(), 1500));
    timers.current.push(nativeSetTimeout(() => soundManager.playScream(), 3200));
    timers.current.push(nativeSetTimeout(() => soundManager.playSiren(), 4200));
    const lifetime = 6000 + Math.floor(Math.random() * 1000); // 6–7 секунд
    timers.current.push(nativeSetTimeout(() => endEvent(), lifetime));
  }, [endEvent]);

  const trigger = useCallback(
    (kind?: EventKind) => {
      if (activeRef.current) return;
      const k: EventKind = kind || (Math.random() < 0.5 ? 'call' : 'virus');
      if (k === 'call') startCall();
      else startVirus();
    },
    [startCall, startVirus]
  );

  useEffect(() => {
    const id = nativeSetInterval(() => {
      if (!activeRef.current && Math.random() < EVENT_CHANCE) trigger();
    }, CHECK_INTERVAL_MS);

    // для проверки из консоли браузера: triggerRandomEvent('call') или ('virus')
    (window as unknown as { triggerRandomEvent?: (k?: EventKind) => void }).triggerRandomEvent = (k) => trigger(k);

    return () => {
      window.clearInterval(id);
    };
  }, [trigger]);

  useEffect(() => () => endEvent(), [endEvent]);

  if (!active) return null;

  const mm = String(Math.floor(callSeconds / 60)).padStart(2, '0');
  const ss = String(callSeconds % 60).padStart(2, '0');

  if (active === 'call') {
    return (
      <div className="fixed inset-0 z-[500] bg-gradient-to-b from-[#1b2340] via-[#0f1428] to-[#05060c] text-white flex flex-col items-center justify-between py-16 px-6 select-none">
        <div className="text-center space-y-2">
          <div className="text-xs tracking-widest text-gray-400 uppercase">
            {answered ? 'Идёт разговор' : 'Входящий вызов'}
          </div>
          <div className="text-6xl font-light tabular-nums tracking-wide">444</div>
          <div className="text-sm text-gray-400 tabular-nums">{answered ? `${mm}:${ss}` : 'Неизвестный номер'}</div>
        </div>

        <div className="relative">
          {!answered && <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />}
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/15 flex items-center justify-center">
            <User className="w-16 h-16 text-gray-300" />
          </div>
        </div>

        <div className="w-full max-w-xs flex items-center justify-around">
          <button
            onClick={endEvent}
            className="w-18 h-18 p-5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-[0_10px_30px_rgba(239,68,68,0.5)] active:scale-90 transition-all cursor-pointer"
            aria-label="Сбросить"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          {!answered && (
            <button
              onClick={answerCall}
              className="p-5 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.5)] active:scale-90 transition-all cursor-pointer animate-bounce"
              aria-label="Ответить"
            >
              <Phone className="w-7 h-7" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // virus
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 pointer-events-none">
      <div className="relative w-full max-w-xs rounded-2xl bg-[#1b1b1b] border-2 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.45)] px-6 py-8 text-center pointer-events-auto">
        <span className="absolute top-2 left-2 text-3xl leading-none animate-pulse">☢️</span>
        <span className="absolute top-2 right-2 text-3xl leading-none animate-pulse">☢️</span>
        <p className="mt-6 text-base font-bold text-white leading-snug">
          Нет причин для паники. Антивирус делает свою работу.
        </p>
      </div>
    </div>
  );
};
