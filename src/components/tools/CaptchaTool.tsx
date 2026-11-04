import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const CaptchaTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isDetectedBot, setIsDetectedBot] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const toggleSelect = (idx: number) => {
    soundManager.playBeep(600, 0.05);
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleVerify = () => {
    soundManager.playBeep(200, 0.3);
    setIsDetectedBot(true);
  };

  useEffect(() => {
    if (!isDetectedBot) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Closes tool or app after 3 seconds!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDetectedBot, onClose]);

  if (isDetectedBot) {
    return (
      <div className="fixed inset-0 bg-red-950 z-50 flex flex-col items-center justify-center p-6 text-center animate-pulse font-mono select-none">
        <ShieldAlert className="w-32 h-32 text-red-500 mb-6 animate-bounce" />
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-4 text-red-400">
          ⚠️ ВНИМАНИЕ! ОБНАРУЖЕН БОТ! ⚠️
        </h1>
        <p className="text-xl font-bold text-red-200 mb-6 max-w-lg">
          Система защиты определила, что вы не человек! Доступ к приложению заблокирован!
        </p>
        <div className="text-4xl font-black bg-black border-4 border-red-500 px-8 py-4 text-red-500">
          ЗАКРЫТИЕ ЧЕРЕЗ {countdown} СЕК...
        </div>
      </div>
    );
  }

  return (
    <ToolWrapper title="Проверка на робота (reCAPTCHA)" onClose={onClose}>
      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col items-center justify-center p-3 font-mono">
        <div className="bg-slate-900 border-2 border-cyan-400 p-4 w-full shadow-2xl">
          {/* Captcha Header */}
          <div className="bg-cyan-600 p-3 text-slate-950 font-black text-xs uppercase mb-3 text-center">
            Выберите все изображения с <span className="underline text-black font-extrabold text-sm">ДИНОЗАВРАМИ 🦖</span>
          </div>

          <p className="text-[10px] text-slate-400 text-center mb-3">
            Если изображений нет, нажмите "Подтвердить"
          </p>

          {/* 3x3 Empty Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
              const isSel = selectedIndices.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  className={`h-20 bg-slate-950 border-2 transition-all relative cursor-pointer flex items-center justify-center ${
                    isSel ? 'border-cyan-400 bg-cyan-950/40' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] text-slate-700 font-bold">ПУСТО</span>
                  {isSel && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setSelectedIndices([])}
              className="p-2 text-slate-400 hover:text-white"
              title="Обновить"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleVerify}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase cursor-pointer"
            >
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
