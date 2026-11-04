import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const CryptoInvestmentsTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [balance, setBalance] = useState(13420000);
  const [btc, setBtc] = useState(12.45);
  const [msg, setMsg] = useState('');

  const buyCrypto = () => {
    soundManager.playBeep(1200, 0.1);
    setBalance((b) => b - 100000);
    setBtc((c) => c + 0.12);
    setMsg('Успешно куплено 0.12 BTC!');
    setTimeout(() => setMsg(''), 3000);
  };

  const sellCrypto = () => {
    soundManager.playBeep(900, 0.1);
    setBalance((b) => b + 150000);
    setBtc((c) => Math.max(0, c - 0.12));
    setMsg('Успешно продано 0.12 BTC за 150 000 ₽!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <ToolWrapper title="Инвестиции & Криптокошелёк" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Balance Card */}
        <div className="bg-[#0f121a] border border-[#222840] rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Баланс портфеля</div>
            <div className="text-xl font-black text-[#b8c0ff] font-mono mt-0.5">
              {balance.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% за 24ч (Bull Run)
            </div>
          </div>
          <div className="p-3 bg-[#222840] text-[#8f9bff] rounded-2xl border border-[#8f9bff]">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {msg && (
          <div className="p-3 bg-[#222840] border border-[#8f9bff] text-[#8f9bff] text-xs font-bold text-center rounded-xl animate-in zoom-in">
            {msg}
          </div>
        )}

        {/* Markets list */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-gray-300 uppercase px-1">Рынок Активов</div>
          
          <div className="bg-[#12151e] border border-[#222840] p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪙</span>
              <div>
                <div className="text-xs font-extrabold text-white">Bitcoin (BTC)</div>
                <div className="text-[10px] text-gray-400 font-mono">Баланс: {btc.toFixed(2)} BTC</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-[#b8c0ff] font-mono">$94 250.00</div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-end">
                <ArrowUpRight className="w-3 h-3" /> +5.4%
              </div>
            </div>
          </div>

          <div className="bg-[#12151e] border border-[#222840] p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐶</span>
              <div>
                <div className="text-xs font-extrabold text-white">Dogecoin (DOGE)</div>
                <div className="text-[10px] text-gray-400 font-mono">Баланс: 1 450 000 DOGE</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-[#b8c0ff] font-mono">$0.42</div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-end">
                <ArrowUpRight className="w-3 h-3" /> +18.2%
              </div>
            </div>
          </div>

          <div className="bg-[#12151e] border border-[#222840] p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <div className="text-xs font-extrabold text-white">Газпром ПАО</div>
                <div className="text-[10px] text-gray-400 font-mono">Акции РФ</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-red-400 font-mono">132.40 ₽</div>
              <div className="text-[10px] text-red-400 font-bold flex items-center justify-end">
                <ArrowDownRight className="w-3 h-3" /> -1.1%
              </div>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={buyCrypto}
            className="py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer shadow-md"
          >
            Купить Активы
          </button>
          <button
            onClick={sellCrypto}
            className="py-3 bg-[#0f121a] hover:bg-[#171b27] text-[#8f9bff] border border-[#222840] font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer"
          >
            Продать Активы
          </button>
        </div>

      </div>
    </ToolWrapper>
  );
};
