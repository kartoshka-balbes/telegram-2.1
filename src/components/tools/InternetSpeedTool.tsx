import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Wifi, Zap } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const InternetSpeedTool: React.FC<ToolProps> = ({ onClose }) => {
  const [speed, setSpeed] = useState<number | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [accelerating, setAccelerating] = useState(false);

  const handleMeasure = () => {
    setMeasuring(true);
    soundManager.playBeep(900, 0.1);

    setTimeout(() => {
      setMeasuring(false);
      // number from 0.000000007 to 0.00214683
      const val = Math.random() * (0.00214683 - 0.000000007) + 0.000000007;
      setSpeed(val);
    }, 2000);
  };

  const handleAccelerate = () => {
    setAccelerating(true);
    soundManager.playBeep(1200, 0.2);

    setTimeout(() => {
      setAccelerating(false);
      if (speed !== null) {
        setSpeed(speed * -100);
      } else {
        setSpeed(-0.000214683);
      }
      soundManager.playExplosion();
    }, 5000);
  };

  return (
    <ToolWrapper title="Интернет" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <Wifi className="w-20 h-20 text-cyan-400 animate-pulse" />

          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 w-full font-mono">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Скорость интернета:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">
              {measuring ? (
                <span className="animate-pulse text-amber-400">Измерение...</span>
              ) : accelerating ? (
                <span className="animate-pulse text-red-400">Ускорение в процессе (5 сек)...</span>
              ) : speed !== null ? (
                `${speed.toFixed(11)} Мб/с`
              ) : (
                '-- Мб/с'
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleMeasure}
              disabled={measuring || accelerating}
              className="py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs uppercase cursor-pointer border border-slate-700"
            >
              Измерить
            </button>

            <button
              onClick={handleAccelerate}
              disabled={measuring || accelerating}
              className="py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl text-xs uppercase cursor-pointer flex items-center justify-center gap-1 shadow-lg"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Ускорить</span>
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
