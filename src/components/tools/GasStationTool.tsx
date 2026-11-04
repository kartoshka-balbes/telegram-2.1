import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Fuel, CheckCircle, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const GasStationTool: React.FC<ToolProps> = ({ onClose }) => {
  const [dispensing, setDispensing] = useState(false);
  const [receipt, setReceipt] = useState<{ price: number; liters: number } | null>(null);

  const handleStartRefuel = () => {
    soundManager.playBeep(900, 0.08);
    setDispensing(true);
    setReceipt(null);

    setTimeout(() => {
      soundManager.playBeep(1200, 0.15);
      setDispensing(false);
      // Random price between 2367 and 83619 for 0.00007 liters
      const randomPrice = Math.floor(Math.random() * (83619 - 2367 + 1)) + 2367;
      setReceipt({
        price: randomPrice,
        liters: 0.00007,
      });
    }, 2000);
  };

  return (
    <ToolWrapper title="Автозаправочная станция (АЗС)" onClose={onClose} headerColor="bg-sky-950 border-sky-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs">
        {/* Terminal Header */}
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <Fuel className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
          <h3 className="text-base font-black text-white uppercase">АЗС «НЕФТЬ-ЭКСПРЕСС»</h3>
          <p className="text-sky-400 text-[10px] font-bold">ТОПЛИВО АИ-98 SUPER • КОЛОНКА № 4</p>
        </div>

        {/* Display Terminal */}
        <div className="bg-slate-900 border-2 border-sky-500/80 p-6 my-auto text-center space-y-4 shadow-2xl">
          {dispensing && (
            <div className="space-y-3">
              <RefreshCw className="w-10 h-10 text-sky-400 mx-auto animate-spin" />
              <span className="text-sky-300 font-black text-xs uppercase tracking-widest animate-pulse block">
                ПОДАЧА ТОПЛИВА В БАК...
              </span>
            </div>
          )}

          {!dispensing && receipt === null && (
            <div className="space-y-2">
              <span className="text-slate-400 font-bold block">Вставьте пистолет в бак и запустите заправку</span>
            </div>
          )}

          {!dispensing && receipt !== null && (
            <div className="space-y-4 animate-in zoom-in duration-150">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">ОБЪЕМ ТОПЛИВА:</span>
                <span className="text-2xl font-black text-white font-mono">{receipt.liters} л</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">ИТОГО К ОПЛАТЕ:</span>
                <span className="text-4xl font-black text-sky-400 font-mono">
                  {receipt.price.toLocaleString()} ₽
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartRefuel}
          disabled={dispensing}
          className="w-full py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-black uppercase text-sm cursor-pointer shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
        >
          <Fuel className="w-4 h-4 fill-current" />
          <span>{receipt === null ? 'ЗАПУСТИТЬ ЗАПРАВКУ' : 'ЗАПРАВИТЬ ЕЩЕ'}</span>
        </button>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          ГОСТ 32513-2013 • ТОЧНОСТЬ ДОЗАТОРА 0.00001 Л
        </div>
      </div>
    </ToolWrapper>
  );
};
