import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Footprints, Zap } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const PedometerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [steps, setSteps] = useState(12);
  const [boostTimer, setBoostTimer] = useState(0);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (boostTimer > 0) {
      timerInterval = setInterval(() => {
        setBoostTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [boostTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      const inc = Math.floor(Math.random() * 3) + 1;
      const multiplier = boostTimer > 0 ? 2 : 1;
      setSteps((prev) => prev + inc * multiplier);
    }, 1000);
    return () => clearInterval(interval);
  }, [boostTimer]);

  const handleAccelerate = () => {
    setBoostTimer(5);
  };

  return (
    <ToolWrapper title="Шагомер" onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full p-6 text-center select-none font-sans">
        <div className="bg-[#12151e] border border-[#222840] rounded-3xl p-8 w-full shadow-[0_0_30px_rgba(143,155,255,0.15)] flex flex-col items-center">
          <Footprints className={`w-20 h-20 mb-6 ${boostTimer > 0 ? 'text-[#b8c0ff] animate-pulse' : 'text-[#8f9bff] animate-bounce'}`} />
          <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight mb-2">
            {steps.toLocaleString('ru-RU')}
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Шагов пройдено {boostTimer > 0 && <span className="text-[#b8c0ff] font-extrabold">(х2 УСКОРЕНИЕ!)</span>}
          </span>

          <button
            onClick={handleAccelerate}
            disabled={boostTimer > 0}
            className={`w-full py-4 font-extrabold text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              boostTimer > 0
                ? 'bg-[#b8c0ff] text-black shadow-[0_0_20px_rgba(184,192,255,0.5)] animate-pulse'
                : 'bg-[#8f9bff] hover:bg-[#b8c0ff] text-black shadow-[0_0_15px_rgba(143,155,255,0.3)]'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{boostTimer > 0 ? `Ускорение (${boostTimer}с)` : 'Разогнаться (х2)'}</span>
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
