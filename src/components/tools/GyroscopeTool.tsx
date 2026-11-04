import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Compass } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const GyroscopeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [coords, setCoords] = useState({ x: '0', y: '0', z: '0' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        x: (Math.sin(Date.now() / 50) * 8500 + (Math.random() - 0.5) * 99999).toFixed(3),
        y: (Math.cos(Date.now() / 40) * 12400 + (Math.random() - 0.5) * 450000).toFixed(3),
        z: (Math.tan(Date.now() / 80) * 3500 + (Math.random() - 0.5) * 888888).toFixed(3),
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Гироскоп" onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full p-6 text-center">
        <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center">
          <Compass className="w-20 h-20 text-cyan-400 mb-6 animate-spin" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Ориентация устройства в пространстве:
          </h3>

          <div className="w-full space-y-4 font-mono">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-red-400 font-bold">Ось X:</span>
              <span className="text-white font-black text-lg sm:text-xl truncate ml-2">
                {coords.x}°
              </span>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold">Ось Y:</span>
              <span className="text-white font-black text-lg sm:text-xl truncate ml-2">
                {coords.y}°
              </span>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-blue-400 font-bold">Ось Z:</span>
              <span className="text-white font-black text-lg sm:text-xl truncate ml-2">
                {coords.z}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
