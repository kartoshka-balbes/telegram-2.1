import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const TBankTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [balance, setBalance] = useState(500000);
  const [customAmount, setCustomAmount] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [issuedCard, setIssuedCard] = useState<{ name: string; amount: number } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const handleGlobalClick = () => {
    if (!isLoggedIn) return;
    soundManager.playBeep(450, 0.05);
    setBalance((prev) => Math.max(0, Math.floor(prev * 0.8)));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Введите пароль!');
      return;
    }
    setIsLoggedIn(true);
  };

  return (
    <ToolWrapper title="Т-Банк (Тинькофф)" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
      <div onClick={handleGlobalClick} className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-3 font-mono select-none">
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-4xl text-slate-950 font-bold mb-6 shadow-xl">
              🟡
            </div>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
              Вход в Т-Банк
            </h2>
            <form onSubmit={handleLogin} className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                placeholder="Введите пароль..."
                className="w-full bg-slate-900 border border-slate-700 p-3 text-white text-center outline-none focus:border-amber-400 rounded-xl"
              />
              {loginError && <div className="text-red-400 text-xs font-bold uppercase animate-pulse">{loginError}</div>}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Войти
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Balance Box */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-2 border-amber-300 p-5 shadow-2xl rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black uppercase">Т-БАНК PREMIA</span>
                <ShieldCheck className="w-5 h-5 text-slate-950" />
              </div>
              <div className="text-3xl font-black">{balance.toLocaleString('ru-RU')} ₽</div>
            </div>

            {msg && (
              <div className="p-2 bg-amber-950 border border-amber-400 text-amber-200 text-xs text-center font-bold rounded-xl">
                {msg}
              </div>
            )}

            {/* Set Custom Balance */}
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const val = parseFloat(customAmount);
              if (!isNaN(val)) {
                setBalance(val);
                setCustomAmount('');
                setMsg(`Баланс установлен на ${val.toLocaleString('ru-RU')} ₽!`);
                setTimeout(() => setMsg(null), 2500);
              }
            }} className="bg-slate-900 border border-slate-800 p-3 space-y-2 rounded-2xl" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs font-bold text-amber-400 uppercase block">Указать свой баланс Т-Банк:</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Сумма ₽..."
                  className="flex-1 bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none focus:border-amber-400 rounded-xl"
                />
                <button type="submit" className="px-4 bg-amber-500 text-slate-950 font-bold text-xs uppercase cursor-pointer rounded-xl">
                  Задать
                </button>
              </div>
            </form>

            {/* Issue Card Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!cardName.trim()) return;
              const limit = parseFloat(cardLimit) || 150000;
              setIssuedCard({ name: cardName.trim(), amount: limit });
              setMsg(`Карта Т-Блэк для ${cardName} на сумму ${limit.toLocaleString('ru-RU')} ₽ выпущена!`);
              setCardName('');
              setCardLimit('');
              setTimeout(() => setMsg(null), 3000);
            }} className="bg-slate-900 border border-slate-800 p-3 space-y-2 rounded-2xl" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs font-bold text-amber-400 uppercase block">Оформить карту Т-Black:</span>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Имя владельца..."
                className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none focus:border-amber-400 rounded-xl"
              />
              <input
                type="number"
                value={cardLimit}
                onChange={(e) => setCardLimit(e.target.value)}
                placeholder="Сумма на карте..."
                className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none focus:border-amber-400 rounded-xl"
              />
              <button type="submit" className="w-full py-2 bg-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer rounded-xl">
                Выпустить карту
              </button>
            </form>

            {/* Issued Card Display */}
            {issuedCard && (
              <div className="bg-slate-950 border-2 border-amber-400 p-4 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs font-black text-amber-400 uppercase">Карта T-Black Metal</div>
                <div className="text-xl font-extrabold text-white my-2">{issuedCard.amount.toLocaleString('ru-RU')} ₽</div>
                <div className="text-xs font-bold text-slate-300 tracking-wider uppercase">{issuedCard.name}</div>
                <CreditCard className="w-8 h-8 text-amber-400 absolute bottom-3 right-3" />
              </div>
            )}
          </>
        )}
      </div>
    </ToolWrapper>
  );
};
