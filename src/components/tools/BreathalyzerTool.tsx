import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Wind, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const BreathalyzerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [measuring, setMeasuring] = useState(false);
  const [percentResult, setPercentResult] = useState<number | null>(null);

  const handleBlow = () => {
    soundManager.playBeep(600, 0.1);
    setMeasuring(true);
    setPercentResult(null);

    setTimeout(() => {
      soundManager.playSiren();
      setMeasuring(false);
      // Random result strictly between 42.2% and 91.78%
      const val = 42.2 + Math.random() * (91.78 - 42.2);
      setPercentResult(parseFloat(val.toFixed(2)));
    }, 2000);
  };

  const norm = 0.16;
  const multiplier = percentResult ? (percentResult / norm).toFixed(1) : '0';
  const state = measuring ? 'measure' : percentResult !== null ? 'result' : 'ready';

  return (
    <ToolWrapper title="Алкотестер" onClose={onClose}>
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col items-center py-2 select-none">
        {/* Корпус прибора */}
        <div className="relative w-full rounded-[2.5rem] bg-gradient-to-b from-[#2b2f3a] via-[#1a1d26] to-[#0f1117] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] px-5 pt-3 pb-6">
          {/* Мундштук */}
          <div className="mx-auto -mt-1 w-28 h-9 rounded-b-3xl bg-gradient-to-b from-[#3a3f4d] to-[#23262f] border border-white/10 flex items-center justify-center gap-1.5 shadow-inner">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="w-1.5 h-4 rounded-full bg-black/60" />
            ))}
          </div>

          {/* Индикаторы */}
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-2">
              {[
                { c: 'bg-emerald-400', on: state === 'ready', l: 'ГОТОВ' },
                { c: 'bg-amber-400', on: state === 'measure', l: 'ЗАМЕР' },
                { c: 'bg-red-500', on: state === 'result', l: 'ТРЕВОГА' },
              ].map((d) => (
                <div key={d.l} className="flex flex-col items-center gap-1">
                  <span
                    className={`w-3 h-3 rounded-full ${d.c} ${d.on ? 'shadow-[0_0_12px_currentColor] opacity-100' : 'opacity-20'} ${
                      d.on && state !== 'ready' ? 'animate-pulse' : ''
                    }`}
                    style={{ color: d.on ? undefined : undefined }}
                  />
                  <span className="text-[8px] text-gray-500 tracking-widest">{d.l}</span>
                </div>
              ))}
            </div>
            <span className="text-[10px] font-semibold text-gray-500 tracking-widest">BAC-84920</span>
          </div>

          {/* ЖК-дисплей */}
          <div className="mt-4 rounded-2xl bg-[#9fb98a] border-4 border-[#0b0d10] shadow-[inset_0_4px_18px_rgba(0,0,0,0.45)] p-4 min-h-[190px] flex flex-col justify-between font-mono text-[#16210f]">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest opacity-80">
              <span>{state === 'ready' ? 'READY' : state === 'measure' ? 'ANALYZING' : 'RESULT'}</span>
              <span>BrAC %</span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center">
              {state === 'ready' && (
                <div className="space-y-1">
                  <Wind className="w-9 h-9 mx-auto" />
                  <div className="text-lg font-extrabold leading-tight">ПОДУЙТЕ НА ЭКРАН</div>
                  <div className="text-[10px] font-bold opacity-80 leading-snug">
                    Для проведения измерений удерживайте дыхание на сенсоре
                  </div>
                </div>
              )}

              {state === 'measure' && (
                <div className="w-full space-y-3">
                  <div className="text-base font-extrabold animate-pulse">АНАЛИЗ ВОЗДУХА... (2 СЕК)</div>
                  <div className="h-3 rounded-full bg-[#16210f]/20 overflow-hidden">
                    <div className="h-full bg-[#16210f] rounded-full" style={{ animation: 'brth-fill 2s linear forwards' }} />
                  </div>
                  <style>{`@keyframes brth-fill { from { width: 0%; } to { width: 100%; } }`}</style>
                </div>
              )}

              {state === 'result' && percentResult !== null && (
                <div className="w-full space-y-1">
                  <div className="text-[10px] font-bold tracking-wider">УРОВЕНЬ АЛКОГОЛЯ В КРОВИ</div>
                  <div className="text-6xl font-black tabular-nums leading-none">{percentResult.toFixed(2)}%</div>
                  <div className="flex items-center justify-center gap-1.5 text-[#7a1010] font-extrabold text-xs pt-1">
                    <AlertTriangle className="w-4 h-4" /> ПРЕВЫШЕНИЕ ДОПУСТИМОЙ НОРМЫ
                  </div>
                </div>
              )}
            </div>

            {state === 'result' && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#16210f]/30 text-left text-[10px] font-bold">
                <div>
                  <span className="opacity-70 block">Допустимая норма:</span>
                  <span className="text-sm">0.16%</span>
                </div>
                <div>
                  <span className="opacity-70 block">Превышение нормы:</span>
                  <span className="text-sm text-[#7a1010]">В {multiplier} РАЗ</span>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка */}
          <div className="mt-6 flex justify-center">
            {state === 'ready' && (
              <button
                onClick={handleBlow}
                className="w-28 h-28 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-black text-sm uppercase flex flex-col items-center justify-center gap-1 shadow-[0_8px_0_#92600a,0_18px_30px_rgba(245,158,11,0.35)] active:translate-y-1 active:shadow-[0_4px_0_#92600a] transition-all cursor-pointer"
              >
                <Wind className="w-7 h-7" />
                <span>ПОДУТЬ</span>
              </button>
            )}
            {state === 'measure' && (
              <div className="w-28 h-28 rounded-full bg-[#2b2f3a] border border-white/10 flex items-center justify-center">
                <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {state === 'result' && (
              <button
                onClick={handleBlow}
                className="w-full py-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-black uppercase text-xs cursor-pointer shadow-[0_6px_0_#92600a] active:translate-y-1 active:shadow-[0_2px_0_#92600a] transition-all"
              >
                ПОВТОРИТЬ ТЕСТ
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-gray-500 text-[10px] font-semibold tracking-wider">
          ПРИБОР КАЛИБРОВАН • СЕРТИФИКАТ № 84920-BAC
        </div>
      </div>
    </ToolWrapper>
  );
};
