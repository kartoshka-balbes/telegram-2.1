import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Zap } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const ElectricityMeterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [powerValue, setPowerValue] = useState(0.0);
  const [loadKw, setLoadKw] = useState(4.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setPowerValue((prev) => parseFloat((prev + 2.1).toFixed(1)));
      setLoadKw(parseFloat((3.8 + Math.random() * 1.5).toFixed(1)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Счётчик электричества" onClose={onClose} headerColor="bg-yellow-950 border-yellow-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto animate-bounce" />
          <h3 className="text-base font-black text-white uppercase">ЭЛЕКТРОСЧЕТЧИК</h3>
          <p className="text-yellow-400 text-[10px]">МНОГОТАРИФНЫЙ УЧЕТ ЭЛЕКТРОЭНЕРГИИ</p>
        </div>

        <div className="bg-slate-900 border-4 border-yellow-500/80 p-6 my-auto text-center space-y-4 shadow-2xl">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold border-b border-slate-800 pb-2">
            <span>ТАРИФ Т1 (ДЕНЬ)</span>
            <span className="text-yellow-400 animate-pulse">ИМПУЛЬС: 3200 imp/kWh</span>
          </div>

          <div className="bg-slate-950 border-2 border-slate-800 p-5">
            <div className="text-5xl font-black text-yellow-400 font-mono tracking-widest animate-pulse">
              {powerValue.toFixed(1)} <span className="text-xl text-white">кВт·ч</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left pt-2 font-bold">
            <div className="p-2.5 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Текущая нагрузка:</span>
              <span className="text-white font-black text-sm">{loadKw} кВт</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Напряжение сети:</span>
              <span className="text-emerald-400 font-black text-sm">230 В</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          КЛАСС ТОЧНОСТИ 1.0 • ПЛОМБА № 84920-ELEC
        </div>
      </div>
    </ToolWrapper>
  );
};
