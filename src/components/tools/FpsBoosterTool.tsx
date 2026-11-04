import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Cpu, Zap, Activity } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const FpsBoosterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [fps, setFps] = useState(60);

  const handleFpsChange = (val: number) => {
    soundManager.playBeep(200 + val / 100, 0.02);
    setFps(val);
  };

  return (
    <ToolWrapper title="NVIDIA FPS Booster Ultra 9000" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4 font-mono">
        <div className="bg-slate-900 border-2 border-emerald-500 p-6 text-center space-y-6 shadow-2xl">
          <div className="flex justify-center items-center gap-2 text-emerald-400">
            <Cpu className="w-10 h-10 animate-spin" style={{ animationDuration: '3s' }} />
            <Zap className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Уровень Кадров в секунду (FPS):</span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-wider">
              {fps.toLocaleString('ru-RU')} <span className="text-xl text-white">FPS</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="57800"
              value={fps}
              onChange={(e) => handleFpsChange(Number(e.target.value))}
              className="w-full h-4 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>0 FPS (Лаги)</span>
              <span>60 FPS</span>
              <span>57 800 FPS (Космос)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-bold">
            {fps < 10 && '⚠️ Критическое замедление! Экран слайд-шоу.'}
            {fps >= 10 && fps <= 120 && '⚡ Стандартный плавный режим.'}
            {fps > 120 && '🚀 Сверхчеловеческая плавная герцовка! Видеокарта горит!'}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
