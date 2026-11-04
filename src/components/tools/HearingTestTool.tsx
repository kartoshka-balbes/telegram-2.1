import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const HearingTestTool: React.FC<ToolProps> = ({ onClose }) => {
  const [testing, setTesting] = useState(false);
  const [decibels, setDecibels] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleStartSound = () => {
    soundManager.playBeep(800, 0.05);
    setTesting(true);
    setFinished(false);
    setDecibels(42567);

    // Randomize decibels between 42567 and 9446751 during 2.5 seconds
    const interval = setInterval(() => {
      const db = Math.floor(Math.random() * (9446751 - 42567 + 1)) + 42567;
      setDecibels(db);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setTesting(false);
      setFinished(true);
    }, 2500);
  };

  return (
    <ToolWrapper title="Тест на слух" onClose={onClose} headerColor="bg-indigo-950 border-indigo-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs text-center">
        <div className="bg-slate-900 border border-slate-800 p-4 space-y-1">
          <h3 className="text-base font-black text-white uppercase">АУДИОМЕТРИЯ ВЫСОКИХ ЧАСТОТ</h3>
          <p className="text-slate-400 text-xs">Проверка аудиочувствительности перепонки</p>
        </div>

        <div className="my-auto space-y-6">
          {!testing && !finished && (
            <button
              onClick={handleStartSound}
              className="w-40 h-40 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg uppercase flex flex-col items-center justify-center gap-2 mx-auto shadow-2xl shadow-indigo-500/20 cursor-pointer"
            >
              <Volume2 className="w-10 h-10" />
              <span>ЗВУК</span>
            </button>
          )}

          {testing && (
            <div className="bg-slate-900 border-2 border-indigo-500 p-6 space-y-3">
              <VolumeX className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
              <div className="text-slate-400 font-bold uppercase text-[10px]">
                ВОСПРОИЗВЕДЕНИЕ СИГНАЛА НА СВЕРХЧАСТОТЕ...
              </div>
              <div className="text-3xl font-black text-indigo-300 font-mono">
                {decibels?.toLocaleString()} дБ
              </div>
            </div>
          )}

          {finished && (
            <div className="bg-slate-900 border-2 border-indigo-500 p-6 space-y-4 animate-in fade-in duration-200">
              <div className="text-4xl">👂</div>
              <h2 className="text-base font-extrabold text-white uppercase leading-snug">
                Если вы ничего не слышите, значит вы глухой
              </h2>
              <div className="p-2 bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">
                Пиковый уровень во время генерации: <span className="text-indigo-400 font-bold">{decibels?.toLocaleString()} дБ</span>
              </div>
              <button
                onClick={handleStartSound}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase cursor-pointer"
              >
                ПОВТОРИТЬ ТЕСТ
              </button>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 text-slate-500 text-[10px]">
          ЧАСТОТНЫЙ ДИАПАЗОН: 0.1 Гц – 240,000 Гц
        </div>
      </div>
    </ToolWrapper>
  );
};
