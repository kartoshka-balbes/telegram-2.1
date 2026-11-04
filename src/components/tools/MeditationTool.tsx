import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Sparkles, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const MeditationTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [phase, setPhase] = useState<'Вдох' | 'Задержка' | 'Выдох'>('Вдох');
  const [isActive, setIsActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 minutes default
  const [initialSeconds, setInitialSeconds] = useState<number>(300);

  // Breathing rhythm phase cycle
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPhase((p) => (p === 'Вдох' ? 'Задержка' : p === 'Задержка' ? 'Выдох' : 'Вдох'));
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || timerSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          soundManager.playBeep(1200, 0.4);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectPreset = (minutes: number) => {
    soundManager.playBeep(900, 0.05);
    setIsActive(false);
    setTimerSeconds(minutes * 60);
    setInitialSeconds(minutes * 60);
  };

  const handleResetTimer = () => {
    soundManager.playBeep(600, 0.05);
    setIsActive(false);
    setTimerSeconds(initialSeconds);
  };

  return (
    <ToolWrapper title="Медитация & Дыхательные практики" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-4 font-sans select-none text-center space-y-5">
        
        {/* Preset Selector */}
        <div className="w-full bg-[#0f121a] border border-[#222840] p-2 rounded-2xl flex items-center justify-between gap-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase px-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#8f9bff]" /> Время:
          </span>
          {[1, 3, 5, 10, 15].map((m) => (
            <button
              key={m}
              onClick={() => handleSelectPreset(m)}
              className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                initialSeconds === m * 60
                  ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)] font-black'
                  : 'bg-[#171b27] text-gray-300 hover:text-white border border-[#222840]'
              }`}
            >
              {m} мин
            </button>
          ))}
        </div>

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center my-auto">
          <div
            className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-[#8f9bff] bg-[#222840]/30 flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-[0_0_35px_rgba(143,155,255,0.3)] ${
              isActive
                ? phase === 'Вдох'
                  ? 'scale-110 border-[#b8c0ff]'
                  : phase === 'Выдох'
                  ? 'scale-90 border-[#8f9bff]/50'
                  : 'scale-105 border-cyan-400'
                : 'scale-100 border-gray-700'
            }`}
          >
            <Sparkles className="w-7 h-7 text-[#8f9bff] animate-pulse mb-1" />
            <span className="text-3xl font-black text-white font-mono tracking-tight my-0.5">
              {formatTime(timerSeconds)}
            </span>
            <span className="text-xs font-black text-[#8f9bff] uppercase tracking-wider font-mono">
              {isActive ? phase : timerSeconds === 0 ? 'Завершено!' : 'Готово'}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-medium">
          Расслабьте плечи, закройте глаза и делайте плавные глубокие вдохи в такт пульсации.
        </p>

        {/* Controls */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playBeep(1000, 0.05);
              if (timerSeconds === 0) setTimerSeconds(initialSeconds);
              setIsActive(!isActive);
            }}
            className="flex-1 py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs uppercase rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isActive ? 'Пауза' : 'Старт медитации'}</span>
          </button>

          <button
            onClick={handleResetTimer}
            className="p-3.5 bg-[#171b27] border border-[#222840] hover:border-[#8f9bff] text-gray-300 hover:text-white rounded-2xl transition-all cursor-pointer active:scale-95"
            title="Сбросить таймер"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </ToolWrapper>
  );
};
