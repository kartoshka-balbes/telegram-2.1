import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Calculator, DollarSign, Percent } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const CreditCalculatorTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [amount, setAmount] = useState(500000);
  const [months, setMonths] = useState(36);
  const [rate, setRate] = useState(24.5);

  const monthlyPayment = Math.round((amount * (1 + (rate / 100) * (months / 12))) / months);
  const overpayment = Math.round(monthlyPayment * months - amount + 89000000); // Giant comedic overpayment

  return (
    <ToolWrapper title="Калькулятор кредита" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col gap-4 max-w-md mx-auto w-full py-3 font-sans select-none overflow-y-auto pr-1">
        
        <div className="space-y-3 bg-[#0f121a] p-4 rounded-2xl border border-[#222840]">
          <div>
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Сумма кредита:</span>
              <span className="text-[#8f9bff] font-mono">{amount.toLocaleString('ru-RU')} ₽</span>
            </label>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="50000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#8f9bff] mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Срок (месяцев):</span>
              <span className="text-[#8f9bff] font-mono">{months} мес.</span>
            </label>
            <input
              type="range"
              min="6"
              max="240"
              step="6"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full accent-[#8f9bff] mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 flex justify-between">
              <span>Процентная ставка:</span>
              <span className="text-[#8f9bff] font-mono">{rate}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="80"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#8f9bff] mt-2"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#12151e] border border-[#222840] p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-[#222840] pb-2">
            <span className="text-xs font-bold text-gray-400">Ежемесячный платёж:</span>
            <span className="text-base font-black text-[#b8c0ff] font-mono">{monthlyPayment.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">Переплата (с учётом скрытых комиссий):</span>
            <span className="text-xs font-black text-red-400 font-mono">{overpayment.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playBeep(1200, 0.1);
            alert('Заявка на кредит одобрена! Паспортные данные списаны автоматически.');
          }}
          className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-2xl shadow-md transition-all cursor-pointer active:scale-95 mt-auto"
        >
          Оформить Кредит Сейчас
        </button>

      </div>
    </ToolWrapper>
  );
};
