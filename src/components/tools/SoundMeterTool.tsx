import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Volume2 } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const SoundMeterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [db, setDb] = useState(() => {
    return Math.random() > 0.5
      ? Math.floor(Math.random() * 9000000) + 1000000
      : Math.floor(Math.random() * 4) + 1;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDb((prev) => Math.max(0, prev + Math.floor(Math.random() * 2000) - 1000));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Шумомер" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center gap-6">
          <Volume2 className="w-24 h-24 text-amber-400 animate-pulse" />
          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 w-full font-mono">
            <div className="text-4xl sm:text-5xl font-black text-amber-300">
              {db.toLocaleString('ru-RU')} дБ
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
