import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Gauge } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const TachometerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [rpm, setRpm] = useState(2400);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuates +/- 300 RPM
      const delta = Math.floor(Math.random() * 600) - 300;
      setRpm((prev) => Math.max(0, prev + delta));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Тахометр" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <Gauge className="w-24 h-24 text-amber-400 animate-pulse" />

          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 w-full font-mono">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Обороты двигателя (RPM):
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-300">
              {rpm.toLocaleString('ru-RU')} Об/мин
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
