import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { CreditCard, AlertOctagon, Check, Delete } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const AtmTool: React.FC<ToolProps> = ({ onClose }) => {
  const [balance, setBalance] = useState(150000);
  const [amountInput, setAmountInput] = useState('5000');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeposit = () => {
    const val = parseInt(amountInput, 10);
    if (isNaN(val) || val <= 0) return;
    soundManager.playBeep(1000, 0.1);
    setBalance((prev) => prev + val);
    setErrorMessage('');
    setSuccessMessage(`Успешное пополнение счета на +${val.toLocaleString()} руб.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleWithdraw = () => {
    const val = parseInt(amountInput, 10);
    if (isNaN(val) || val <= 0) return;
    soundManager.playSiren();

    // Money IS deducted from balance
    setBalance((prev) => Math.max(0, prev - val));

    // Error shown
    setSuccessMessage('');
    setErrorMessage(`СБОЙ ТРАНЗАКЦИИ #E-80492: Купюроприемник заблокирован банком. Средства в размере ${val.toLocaleString()} руб. списаны со счета.`);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const press = (k: string) => {
    soundManager.playBeep(900, 0.03);
    setAmountInput((a) => (a === '0' ? k : (a + k).slice(0, 9)));
  };

  const keyCls =
    'h-11 rounded-md bg-gradient-to-b from-[#c9ced8] to-[#9aa2b1] text-slate-900 font-bold text-lg shadow-[0_3px_0_#6b7280] active:translate-y-[2px] active:shadow-[0_1px_0_#6b7280] cursor-pointer';
  const softCls =
    'h-10 w-14 rounded-md bg-gradient-to-b from-[#aab1bf] to-[#7b8393] shadow-[0_3px_0_#4b5563] active:translate-y-[2px] cursor-pointer';

  return (
    <ToolWrapper title="Банкомат 24/7" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col py-2 select-none">
        {/* Корпус банкомата */}
        <div className="relative rounded-[1.5rem] bg-gradient-to-b from-[#3a4150] via-[#2b303c] to-[#1d212b] border border-white/10 p-3 shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
          {/* Логотип банка */}
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-[11px] font-extrabold tracking-widest text-white/90 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-400 inline-block" /> ЕДИНЫЙ БАНК
            </span>
            <span className="text-[9px] font-semibold text-emerald-300">24/7 • ОНЛАЙН</span>
          </div>

          {/* Экран с боковыми кнопками */}
          <div className="flex items-stretch gap-2">
            <div className="flex flex-col justify-around py-2">
              {[0, 1, 2].map((i) => (
                <button key={i} className={softCls} onClick={i === 0 ? handleDeposit : i === 1 ? handleWithdraw : undefined} aria-label={i === 0 ? 'Положить' : i === 1 ? 'Снять' : 'Недоступно'} />
              ))}
            </div>

            <div className="flex-1 rounded-lg bg-gradient-to-b from-[#0a3a7a] to-[#06244f] border-4 border-[#0e1118] p-3 text-white min-h-[210px] flex flex-col justify-between shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-200 border-b border-white/15 pb-1.5">
                <CreditCard className="w-3.5 h-3.5" /> ДОСТУПНЫЙ БАЛАНС КАРТЫ
              </div>
              <div className="min-h-[44px] flex items-center justify-center text-center text-[10px] leading-snug font-semibold">
                {errorMessage ? (
                  <span className="text-red-300">{errorMessage}</span>
                ) : successMessage ? (
                  <span className="text-emerald-300">{successMessage}</span>
                ) : (
                  <span className="text-sky-200/70">Выберите операцию кнопками слева</span>
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold tabular-nums text-white drop-shadow">{balance.toLocaleString()} ₽</div>
                <div className="mt-3 text-[10px] text-sky-200">Сумма операции (руб):</div>
                <div className="mt-1 mx-auto max-w-[200px] bg-black/30 border border-white/20 rounded px-2 py-1.5 text-xl font-bold tabular-nums">
                  {amountInput || '0'}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-amber-200">
                <span>◄ ПОЛОЖИТЬ</span>
                <span>СНЯТЬ ►</span>
              </div>
            </div>

            <div className="flex flex-col justify-around py-2">
              {[1000, 5000, 10000].map((v) => (
                <button key={v} className={`${softCls} text-[10px] font-bold text-slate-900`} onClick={() => setAmountInput(String(v))}>
                  {v >= 1000 ? `${v / 1000}к` : v}
                </button>
              ))}
            </div>
          </div>

          {/* Клавиатура и слоты */}
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                <button key={k} className={keyCls} onClick={() => press(k)}>
                  {k}
                </button>
              ))}
              <button className={`${keyCls} !from-[#e5a0a0] !to-[#c26a6a] text-red-950 !text-sm`} onClick={() => setAmountInput('')}>
                C
              </button>
              <button className={keyCls} onClick={() => press('0')}>
                0
              </button>
              <button className={`${keyCls} flex items-center justify-center`} onClick={() => setAmountInput((a) => a.slice(0, -1))}>
                <Delete className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col justify-between gap-3 w-24">
              <div>
                <div className="text-[8px] text-gray-400 text-center mb-1">КАРТА</div>
                <div className="h-3 rounded-sm bg-black border border-white/20 relative">
                  <span className="absolute -top-2 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-400 text-center mb-1">ЧЕК</div>
                <div className="h-2 rounded-sm bg-black border border-white/20" />
              </div>
              <div>
                <div className="text-[8px] text-gray-400 text-center mb-1">ВЫДАЧА НАЛИЧНЫХ</div>
                <div className="h-6 rounded-sm bg-black border border-white/20 shadow-[inset_0_0_10px_rgba(52,211,153,0.4)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-full bg-white/[0.05] border border-white/10 text-gray-500 text-[10px] text-center">
          Терминал #9820-ATM • Инкассация и банковский мониторинг
        </div>
      </div>
    </ToolWrapper>
  );
};
