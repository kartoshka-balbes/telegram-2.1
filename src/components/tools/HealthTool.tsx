import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { IMPOSSIBLE_WORKOUTS, SLEEP_EXERCISES } from '../../data/mockData';
import { Moon, Dumbbell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const HealthTool: React.FC<ToolProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'sleep' | 'workout'>('sleep');

  // Sleep Tracker state
  const [sleepActive, setSleepActive] = useState(false);
  const [sleepSeconds, setSleepSeconds] = useState(0);
  const [sleepAlarm, setSleepAlarm] = useState<string | null>(null);

  // Workout state
  const [checkedWorkouts, setCheckedWorkouts] = useState<Record<number, boolean>>({});
  const [showCongrats, setShowCongrats] = useState(false);

  // Sleep timer + alarm every 5s
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sleepActive) {
      interval = setInterval(() => {
        setSleepSeconds((prev) => {
          const next = prev + 1;
          if (next % 5 === 0) {
            soundManager.playSiren();
            const ex = SLEEP_EXERCISES[Math.floor(Math.random() * SLEEP_EXERCISES.length)];
            setSleepAlarm(ex);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleepActive]);

  const toggleWorkoutCheck = (idx: number) => {
    soundManager.playBeep(900, 0.05);
    const updated = { ...checkedWorkouts, [idx]: !checkedWorkouts[idx] };
    setCheckedWorkouts(updated);

    // If all checked
    const allChecked = IMPOSSIBLE_WORKOUTS.every((_, i) => updated[i]);
    if (allChecked) {
      soundManager.playMicrowaveDing();
      setShowCongrats(true);
      setCheckedWorkouts({});
    }
  };

  return (
    <ToolWrapper title="Здоровье" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-6 py-4">
        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setMode('sleep')}
            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              mode === 'sleep'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Трекер сна</span>
          </button>
          <button
            onClick={() => setMode('workout')}
            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              mode === 'workout'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Тренировка</span>
          </button>
        </div>

        {/* 1 - SLEEP TRACKER */}
        {mode === 'sleep' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full shadow-xl flex flex-col items-center">
              <Moon className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
              <div className="text-4xl font-mono font-black text-white mb-2">
                00:00:{String(sleepSeconds % 60).padStart(2, '0')}
              </div>
              <span className="text-xs text-slate-400 uppercase font-bold mb-6">
                Длительность глубокого сна
              </span>

              <button
                onClick={() => setSleepActive(!sleepActive)}
                className={`w-full py-4 rounded-2xl font-black text-lg uppercase shadow-xl transition-all cursor-pointer ${
                  sleepActive
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {sleepActive ? 'Остановить трекер сна' : 'Включить трекер сна'}
              </button>
            </div>

            {/* Alarm Popup Modal */}
            {sleepAlarm && (
              <div className="fixed inset-0 bg-red-950/95 z-50 flex items-center justify-center p-6 animate-pulse">
                <div className="w-full max-w-sm bg-slate-900 border-4 border-red-500 rounded-3xl p-8 text-center shadow-2xl relative">
                  <button
                    onClick={() => setSleepAlarm(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-black text-white uppercase mb-2">СИРЕНА ЗАРЯДКИ!</h3>
                  <p className="text-red-400 text-xs font-bold uppercase mb-4">
                    СРОЧНО ВЫПОЛНИТЕ УПРАЖНЕНИЕ:
                  </p>
                  <div className="bg-red-950 border border-red-600 rounded-2xl p-4 text-amber-300 font-black text-xl uppercase mb-6">
                    {sleepAlarm}
                  </div>
                  <button
                    onClick={() => setSleepAlarm(null)}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase cursor-pointer"
                  >
                    Выполнил!
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2 - WORKOUT */}
        {mode === 'workout' && (
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Программа тренировок на сегодня:
            </h3>

            <div className="space-y-3">
              {IMPOSSIBLE_WORKOUTS.map((ex, idx) => {
                const isChecked = !!checkedWorkouts[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleWorkoutCheck(idx)}
                    className={`bg-slate-900 border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                        : 'border-slate-800 hover:border-slate-700 text-white'
                    }`}
                  >
                    <span className="text-sm font-bold flex-1 pr-3">{ex}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-6 h-6 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Congratulations Modal */}
            {showCongrats && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
                <div className="w-full max-w-sm bg-slate-900 border-2 border-emerald-500 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-200">
                  <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-3xl font-black text-emerald-400 uppercase mb-2">
                    ПОЗДРАВЛЯЕМ!
                  </h2>
                  <p className="text-slate-300 text-sm mb-6">
                    Вы установили абсолютный мировой рекорд по фитнесу! Список тренировок сброшен и готов к новому кругу.
                  </p>
                  <button
                    onClick={() => setShowCongrats(false)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Продолжить
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
