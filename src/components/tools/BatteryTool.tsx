import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { BatteryCharging } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const BatteryTool: React.FC<ToolProps> = ({ onClose }) => {
  const [charge, setCharge] = useState(200);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharge((prev) => prev - Math.floor(Math.random() * 85) - 15);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Батарея" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center gap-6">
          {/* Vertical Large Battery Graphic */}
          <div className="relative w-32 h-64 border-4 border-emerald-500 rounded-3xl p-2 flex flex-col justify-end bg-slate-950 shadow-2xl">
            {/* Battery Terminal Tip */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-4 bg-emerald-500 rounded-t-lg" />

            {/* Battery Fill Level */}
            <div
              className={`w-full transition-all duration-200 rounded-2xl ${
                charge < 0 ? 'bg-red-600' : 'bg-emerald-500'
              }`}
              style={{
                height: `${Math.max(0, Math.min(100, (charge / 200) * 100))}%`,
              }}
            />

            <BatteryCharging className="absolute inset-0 m-auto w-12 h-12 text-white/50 animate-pulse pointer-events-none" />
          </div>

          <div className="font-mono text-4xl sm:text-5xl font-black text-emerald-400">
            {charge}%
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
