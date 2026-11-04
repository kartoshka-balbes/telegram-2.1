import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Droplet } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const WaterMeterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [coldValue, setColdValue] = useState(0.000);
  const [hotValue, setHotValue] = useState(0.000);

  useEffect(() => {
    const interval = setInterval(() => {
      setColdValue((prev) => parseFloat((prev + 0.091).toFixed(3)));
      setHotValue((prev) => parseFloat((prev + 0.063).toFixed(3)));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Счётчики воды" onClose={onClose} headerColor="bg-blue-950 border-blue-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <Droplet className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
          <h3 className="text-base font-black text-white uppercase">УЗЕЛ УЧЕТА ВОДОСНАБЖЕНИЯ</h3>
          <p className="text-slate-400 text-[10px]">АВТОМАТИЧЕСКИЙ МОНИТОРИНГ РАСХОДА</p>
        </div>

        <div className="space-y-6 my-auto">
          {/* Cold Water Meter */}
          <div className="bg-slate-900 border-2 border-blue-500/80 p-5 space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-extrabold text-blue-400 flex items-center gap-1.5 text-sm uppercase">
                <Droplet className="w-4 h-4 text-blue-400 fill-current" /> ХОЛОДНАЯ ВОДА (ХВС)
              </span>
              <span className="text-[10px] text-slate-500 font-bold">СЧЕТЧИК № 84920</span>
            </div>

            <div className="bg-slate-950 border-2 border-slate-800 p-4 text-center">
              <div className="text-4xl font-black text-white font-mono tracking-wider animate-pulse">
                {coldValue.toFixed(3)} <span className="text-lg text-blue-400">м³</span>
              </div>
            </div>
          </div>

          {/* Hot Water Meter */}
          <div className="bg-slate-900 border-2 border-rose-500/80 p-5 space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-extrabold text-rose-400 flex items-center gap-1.5 text-sm uppercase">
                <Droplet className="w-4 h-4 text-rose-400 fill-current" /> ГОРЯЧАЯ ВОДА (ГВС)
              </span>
              <span className="text-[10px] text-slate-500 font-bold">СЧЕТЧИК № 84921</span>
            </div>

            <div className="bg-slate-950 border-2 border-slate-800 p-4 text-center">
              <div className="text-4xl font-black text-white font-mono tracking-wider animate-pulse">
                {hotValue.toFixed(3)} <span className="text-lg text-rose-400">м³</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          ПОВЕРКА ДО 2030 г. • ИМПУЛЬСНЫЙ ВЫХОД АКТИВЕН
        </div>
      </div>
    </ToolWrapper>
  );
};
