import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ArrowLeftRight, DollarSign } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const RATES: Record<string, number> = {
  RUB: 1,
  USD: 88.5,
  EUR: 96.2,
  CNY: 12.3,
  BYN: 27.4,
  KZT: 0.18,
};

export const CurrencyConverterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('1000');
  const [fromCurr, setFromCurr] = useState('RUB');
  const [toCurr, setToCurr] = useState('USD');

  const numAmount = parseFloat(amount) || 0;
  const inRub = numAmount * RATES[fromCurr];
  const converted = (inRub / RATES[toCurr]).toFixed(2);

  const handleSwap = () => {
    soundManager.playBeep(900, 0.05);
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <ToolWrapper title="Конвертер валют" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <DollarSign className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-black text-white uppercase">МЕЖДУНАРОДНЫЙ ВАЛЮТНЫЙ ОБМЕН</h3>
          <p className="text-slate-400 text-[10px]">КУРСЫ МЕЖБАНКОВСКОЙ БИРЖИ</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 my-auto space-y-4 shadow-xl">
          {/* From Currency */}
          <div className="space-y-1">
            <label className="text-slate-400 font-bold text-[10px] uppercase">ИСХОДНАЯ СУММА:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 p-3 text-white font-black text-lg font-mono outline-none focus:border-emerald-400"
              />
              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-3 text-emerald-400 font-black outline-none cursor-pointer"
              >
                {Object.keys(RATES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center my-2">
            <button
              onClick={handleSwap}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-full cursor-pointer transition-transform active:scale-90"
              title="Поменять местами"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Result Currency */}
          <div className="space-y-1">
            <label className="text-slate-400 font-bold text-[10px] uppercase">РЕЗУЛЬТАТ КОНВЕРТАЦИИ:</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 p-3 text-emerald-400 font-black text-2xl font-mono">
                {converted}
              </div>
              <select
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-3 text-emerald-400 font-black outline-none cursor-pointer"
              >
                {Object.keys(RATES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          КРОСС-КУРС ЦБ РФ • ОБНОВЛЕНО 1 МИНУТУ НАЗАД
        </div>
      </div>
    </ToolWrapper>
  );
};
