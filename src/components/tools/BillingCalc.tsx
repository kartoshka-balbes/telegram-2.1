import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { AlertTriangle, Receipt } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface Props {
  onClose: () => void;
  title: string;
  label: string;
  unit: string;
  multiplier: number;
  buttonText: string;
  resultLabel: string;
  accent: string;
}

const fmt = (n: number) => n.toLocaleString('ru-RU');

// Четырёхзначное число: сумма по умолчанию случайная от 182 671 до 9 371 611
const randomDefault = () => 182671 + Math.floor(Math.random() * (9371611 - 182671 + 1));

export const BillingCalc: React.FC<Props> = ({ onClose, title, label, unit, multiplier, buttonText, resultLabel, accent }) => {
  const [val, setVal] = useState('');
  const [total, setTotal] = useState<number | null>(null);
  const [usedDefault, setUsedDefault] = useState(false);

  const handleCalculate = () => {
    soundManager.playBeep(1200, 0.1);
    soundManager.playSiren();
    const digits = val.replace(/\D/g, '');
    const num = Number(val);
    if (digits.length === 4 && !val.includes('-')) {
      setTotal(randomDefault());
      setUsedDefault(true);
    } else {
      setTotal(Math.abs(num || 0) * multiplier);
      setUsedDefault(false);
    }
  };

  return (
    <ToolWrapper title={title} onClose={onClose}>
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 select-none">
        <div className="rounded-[1.75rem] bg-white/[0.05] border border-white/10 p-4 space-y-3">
          <label className="text-xs font-semibold text-gray-300 block">{label}</label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Введите показания..."
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-base text-white font-semibold outline-none focus:border-white/40 tabular-nums"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-4 text-slate-950 font-bold text-sm rounded-full shadow-lg cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ background: accent }}
        >
          <Receipt className="w-4 h-4" />
          {buttonText}
        </button>

        {total !== null && (
          <div className="rounded-[1.75rem] bg-red-500/10 border border-red-500/40 p-5 text-center space-y-2 shadow-xl animate-in zoom-in">
            <AlertTriangle className="w-9 h-9 text-red-400 mx-auto" />
            <div className="text-xs font-semibold text-red-300 uppercase tracking-wide">{resultLabel}</div>
            <div className="text-3xl font-extrabold text-red-400 tabular-nums break-all">{fmt(total)} ₽</div>
            <div className="text-[11px] text-gray-400 border-t border-white/10 pt-2">
              Показания: {val || '0'} {unit}
              {usedDefault ? '. Применён расчёт по умолчанию.' : `. Тариф: ×${fmt(multiplier)}.`}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
