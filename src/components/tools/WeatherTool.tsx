import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { WEATHER_CONDITIONS } from '../../data/mockData';

interface ToolProps {
  onClose: () => void;
}

export const WeatherTool: React.FC<ToolProps> = ({ onClose }) => {
  const [temp, setTemp] = useState(22);
  const [condition, setCondition] = useState('солнечно');

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTemp = Math.floor(Math.random() * (472 - (-158) + 1)) + (-158);
      const randomCond = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
      setTemp(randomTemp);
      setCondition(randomCond);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Погода" onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full p-6 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-6 font-mono">
            Ваш город. Точно
          </h3>

          <div className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tighter mb-4 animate-pulse">
            {temp > 0 ? `+${temp}` : temp}°C
          </div>

          <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-amber-300 font-bold text-lg uppercase tracking-wide">
            {condition}
          </div>

          <p className="text-[11px] text-slate-500 mt-8 italic">
            * Данные обновляются каждую секунду в суперточечном режиме.
          </p>
        </div>
      </div>
    </ToolWrapper>
  );
};
