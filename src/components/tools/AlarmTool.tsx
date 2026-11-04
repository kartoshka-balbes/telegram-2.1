import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ShieldAlert, BellOff, BellRing, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const AlarmTool: React.FC<ToolProps> = ({ onClose }) => {
  const [alarmActive, setAlarmActive] = useState(false);

  useEffect(() => {
    if (!alarmActive) return;

    // Endless overlapping siren interval
    const interval = setInterval(() => {
      soundManager.playOverlappingSirens();
    }, 1400);

    soundManager.playOverlappingSirens();

    return () => clearInterval(interval);
  }, [alarmActive]);

  const handleTurnOn = () => {
    soundManager.playOverlappingSirens();
    setAlarmActive(true);
  };

  const handleTurnOff = () => {
    soundManager.playBeep(1200, 0.1);
    setAlarmActive(false);
  };

  return (
    <ToolWrapper title="Сигнализация" onClose={onClose}>
      <div
        className={`max-w-md mx-auto w-full flex-1 flex flex-col justify-between gap-4 py-2 text-xs rounded-[2rem] transition-colors duration-150 ${
          alarmActive ? 'bg-red-600/90 animate-pulse text-white' : ''
        }`}
      >
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[1.75rem] p-5 text-center space-y-1.5">
          <div
            className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center ${
              alarmActive ? 'bg-red-500/30' : 'bg-white/[0.07]'
            }`}
          >
            <ShieldAlert className={`w-9 h-9 ${alarmActive ? 'text-red-300 animate-bounce' : 'text-gray-400'}`} />
          </div>
          <h3 className="text-base font-bold text-white">Система охранной сигнализации</h3>
          <p className="text-gray-400 text-xs">Объект под охраной 24/7</p>
        </div>

        <div className="my-auto text-center space-y-5">
          {alarmActive ? (
            <div className="p-8 bg-black/40 border-2 border-red-300/70 rounded-[2rem] space-y-3 shadow-2xl">
              <div className="text-6xl animate-bounce">🚨</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-wide animate-pulse">Тревога! Взлом!</h2>
              <span className="text-red-100 font-semibold block text-xs">Сирена включена на максимальную громкость</span>
            </div>
          ) : (
            <div className="p-8 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[2rem] space-y-2">
              <span className="text-gray-400 font-medium block text-xs uppercase tracking-widest">Статус сигнализации</span>
              <span className="text-emerald-300 font-bold text-xl flex items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6" /> Готова к включению
              </span>
            </div>
          )}

          {/* Кнопка выключения видна всегда */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            {!alarmActive ? (
              <button
                onClick={handleTurnOn}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-sm rounded-full cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <BellRing className="w-5 h-5" />
                <span>Включить сигнализацию</span>
              </button>
            ) : null}

            <button
              onClick={handleTurnOff}
              className="w-full py-4 bg-white/[0.08] backdrop-blur-xl hover:bg-white/[0.14] text-white border border-white/15 font-bold text-sm rounded-full cursor-pointer flex items-center justify-center gap-2 shadow-2xl z-50"
            >
              <BellOff className="w-5 h-5 text-emerald-300" />
              <span>Выключить</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-white/[0.04] border border-white/10 rounded-full text-center text-gray-500 text-[11px]">
          Протокол безопасности #84920 · пульт охраны активен
        </div>
      </div>
    </ToolWrapper>
  );
};
