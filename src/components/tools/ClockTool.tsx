import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Clock, Globe, Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const ClockTool: React.FC<ToolProps> = ({ onClose }) => {
  const [time, setTime] = useState(new Date());

  // Timer state
  const [inputMinutes, setInputMinutes] = useState(1);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [timerLeft, setTimerLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundManager.playBeep(800, 0.5);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerLeft]);

  const handleStartTimer = () => {
    if (timerLeft <= 0) {
      const totalSec = inputMinutes * 60 + inputSeconds;
      setTimerLeft(totalSec > 0 ? totalSec : 60);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    const totalSec = inputMinutes * 60 + inputSeconds;
    setTimerLeft(totalSec);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Часы" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-5 py-2 font-mono select-none">
        {/* Main Clock Card */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center">
          <Clock className="w-12 h-12 text-cyan-400 mb-2 animate-spin-slow" />
          <div className="text-3xl sm:text-4xl font-black text-white tracking-widest mb-1">
            {time.toLocaleTimeString('ru-RU')}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Текущее точное время
          </span>
        </div>

        {/* Customizable Timer Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <TimerIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase">Настраиваемый таймер</h3>
          </div>

          <div className="flex items-center justify-center gap-2 my-1">
            <div className="flex flex-col items-center">
              <label className="text-[10px] text-slate-400 uppercase font-bold mb-1">Минуты</label>
              <input
                type="number"
                min="0"
                max="99"
                value={inputMinutes}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setInputMinutes(val);
                  setTimerLeft(val * 60 + inputSeconds);
                }}
                disabled={isTimerRunning}
                className="w-16 h-10 bg-slate-950 border border-slate-700 rounded-xl text-center text-white font-bold text-lg focus:outline-none focus:border-cyan-400"
              />
            </div>
            <span className="text-xl font-black text-slate-500 pt-5">:</span>
            <div className="flex flex-col items-center">
              <label className="text-[10px] text-slate-400 uppercase font-bold mb-1">Секунды</label>
              <input
                type="number"
                min="0"
                max="59"
                value={inputSeconds}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                  setInputSeconds(val);
                  setTimerLeft(inputMinutes * 60 + val);
                }}
                disabled={isTimerRunning}
                className="w-16 h-10 bg-slate-950 border border-slate-700 rounded-xl text-center text-white font-bold text-lg focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Big Timer Countdown */}
          <div className="text-center py-2 bg-slate-950 rounded-2xl border border-slate-800">
            <span className={`text-4xl font-black ${timerLeft === 0 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
              {formatTimer(timerLeft)}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="grid grid-cols-3 gap-2">
            {!isTimerRunning ? (
              <button
                onClick={handleStartTimer}
                className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Старт</span>
              </button>
            ) : (
              <button
                onClick={handlePauseTimer}
                className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Пауза</span>
              </button>
            )}

            <button
              onClick={handleResetTimer}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer col-span-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сбросить</span>
            </button>
          </div>
        </div>

        {/* World Time */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Мировое время:
          </h3>

          {[
            { city: 'Москва', tz: '+3 ч', time: time.toLocaleTimeString('ru-RU') },
            { city: 'Токио', tz: '+9 ч', time: '22:14:09' },
            { city: 'Нью-Йорк', tz: '-5 ч', time: '08:14:09' },
          ].map((item) => (
            <div
              key={item.city}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
            >
              <div>
                <h4 className="text-white font-bold text-xs">{item.city}</h4>
                <span className="text-[10px] text-slate-500">{item.tz}</span>
              </div>
              <span className="font-mono font-bold text-cyan-400 text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
