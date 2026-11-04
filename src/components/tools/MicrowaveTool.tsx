import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const CLOSE_SECONDS = 3;

export const MicrowaveTool: React.FC<ToolProps> = ({ onClose }) => {
  const [heating, setHeating] = useState(false);
  const [timer, setTimer] = useState(7);
  const [exploded, setExploded] = useState(false);
  const [closeIn, setCloseIn] = useState(CLOSE_SECONDS);
  const intervalRef = useRef<number | null>(null);

  const handleStartHeating = () => {
    setHeating(true);
    setTimer(7);
    soundManager.playBeep(600, 0.2);

    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          setHeating(false);
          setExploded(true);
          soundManager.playExplosion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    },
    []
  );

  // Живой обратный отсчёт до закрытия приложения после взрыва
  useEffect(() => {
    if (!exploded) return;
    setCloseIn(CLOSE_SECONDS);
    const tick = window.setInterval(() => {
      setCloseIn((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    const done = window.setTimeout(() => onClose(), CLOSE_SECONDS * 1000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [exploded, onClose]);

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');
  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <ToolWrapper title="Микроволновка" onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full p-4 text-center">
        {!exploded ? (
          <div className="bg-gradient-to-b from-[#1b1f2e] to-[#12141d] border border-white/10 rounded-[2rem] p-6 w-full shadow-2xl flex flex-col items-center relative mb-6">
            <div className={`text-8xl mb-4 ${heating ? 'animate-pulse' : ''}`}>📦</div>
            {/* Цифровое табло */}
            <div className="bg-black/50 border border-amber-400/30 rounded-2xl px-6 py-2 shadow-inner">
              <div className="text-4xl font-bold text-amber-300 tabular-nums tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                {mm}:{ss}
              </div>
            </div>
            <div className="text-xs font-medium text-gray-400 mt-3">
              {heating ? `Нагрев еды (${timer}с)...` : 'Еда готова к разогреву'}
            </div>
          </div>
        ) : (
          <div className="text-9xl mb-6 animate-ping">💥</div>
        )}

        <button
          onClick={handleStartHeating}
          disabled={heating || exploded}
          className={`w-full py-4 rounded-full font-bold text-lg shadow-xl transition-all cursor-pointer ${
            exploded
              ? 'bg-white/5 text-gray-600 border border-red-500/40 cursor-not-allowed'
              : heating
              ? 'bg-amber-500 text-slate-950 animate-pulse'
              : 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          {heating ? `Разогрев (${timer}с)` : 'Разогреть'}
        </button>

        {/* Окно взрыва: без прыжков, с идущим таймером */}
        {exploded && (
          <div className="fixed inset-0 bg-[#2a0a0e]/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-8xl mb-4">🚨</div>
            <h1 className="text-3xl sm:text-5xl font-black text-amber-300 uppercase tracking-wide mb-8">
              Микроволновка взорвалась!
            </h1>

            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                <circle
                  key={exploded ? 'run' : 'idle'}
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={0}
                  style={{ animation: `mw-countdown ${CLOSE_SECONDS}s linear forwards` }}
                />
              </svg>
              <style>{`@keyframes mw-countdown { from { stroke-dashoffset: 0; } to { stroke-dashoffset: ${C}; } }`}</style>
              <div className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-white tabular-nums">
                {closeIn}
              </div>
            </div>
            <p className="text-white text-sm font-semibold">Приложение закроется через {closeIn} сек.</p>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
