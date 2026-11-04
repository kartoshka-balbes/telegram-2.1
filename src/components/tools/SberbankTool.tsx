import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Lock, CreditCard, ShieldAlert, ArrowUpRight, History, QrCode, Sparkles, PlusCircle, PhoneCall } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Operation {
  id: string;
  title: string;
  amount: number;
  type: 'in' | 'out';
  date: string;
}

export const SberbankTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [balance, setBalance] = useState(17381836);
  const [creditError, setCreditError] = useState(false);
  const [cashback, setCashback] = useState(-14850);

  // Modals / Sections
  const [activeModal, setActiveModal] = useState<'history' | 'transfer' | 'qr' | 'cashback' | null>(null);
  
  // Form inputs
  const [transferComment, setTransferComment] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [operations, setOperations] = useState<Operation[]>([
    { id: '1', title: 'Оплата Бургер Кинг', amount: 890, type: 'out', date: 'Вчера, 19:45' },
    { id: '2', title: 'Перевод по СБП', amount: 1500, type: 'out', date: '04.08.2026' },
  ]);

  const handleGlobalClick = () => {
    if (!isLoggedIn) return;
    soundManager.playBeep(400, 0.05);

    setBalance((prev) => {
      if (prev <= 0) return prev - 10000;
      const next = Math.floor(prev / 2);
      return next <= 0 ? -10000 : next;
    });
  };

  const handleStealMoney = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stolen = Math.random() < 0.5 ? 2 : 3;
    setBalance((prev) => prev + stolen);
    soundManager.playCoin();
    setOperations((prev) => [
      { id: Date.now().toString(), title: 'Украдено', amount: stolen, type: 'in', date: 'Только что' },
      ...prev,
    ]);
    setStatusMsg(`+${stolen} ₽ успешно украдено на счёт!`);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Введите пароль!');
      return;
    }
    setIsLoggedIn(true);
  };

  const handleTakeCredit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreditError(true);
    setTimeout(() => setCreditError(false), 3000);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const val = 1000;
    setBalance((prev) => prev - val);
    setOperations((prev) => [
      { id: Date.now().toString(), title: `Перевод (${transferComment || 'Без комментария'})`, amount: val, type: 'out', date: 'Только что' },
      ...prev,
    ]);
    setStatusMsg(`Перевод с комментарием "${transferComment || '-'}" успешно отправлен!`);
    setTransferComment('');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <ToolWrapper title="Сбербанк" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div onClick={handleGlobalClick} className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-3 font-mono select-none">
        {!isLoggedIn ? (
          /* Login Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-4xl text-white font-bold mb-6 shadow-xl shadow-emerald-600/30">
              🏦
            </div>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
              Вход в Сбербанк Онлайн
            </h2>
            <form onSubmit={handleLogin} className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Введите пароль..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-4 py-3 text-white text-center outline-none focus:border-emerald-500"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              </div>
              {loginError && (
                <div className="text-red-400 text-xs font-bold uppercase animate-pulse">{loginError}</div>
              )}
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-none shadow-lg transition-transform active:scale-95 cursor-pointer uppercase"
              >
                Войти
              </button>
            </form>
          </div>
        ) : (
          /* Personal Cabinet */
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Account Card & Steal action */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-emerald-600 rounded-none p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Личный счёт пользователя
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors ${
                      balance < 0 ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    {balance.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[10px] text-red-300 mt-1 font-bold">
                    Кэшбэк: {cashback.toLocaleString('ru-RU')} СберСпасибо
                  </div>
                </div>

                {/* Steal Button - Always available (+2 or +3 on click) */}
                <button
                  type="button"
                  onClick={handleStealMoney}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300 flex items-center gap-1.5 shrink-0"
                >
                  <span>💰</span>
                  <span>Украсть</span>
                </button>
              </div>
            </div>

            {/* Floating Status Message Toast (Overlay: does not shift UI) */}
            {statusMsg && (
              <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-emerald-950/95 backdrop-blur-md border-2 border-emerald-500 p-3 text-emerald-300 text-center font-bold text-xs shadow-2xl animate-in zoom-in pointer-events-none rounded-xl">
                {statusMsg}
              </div>
            )}

            {/* Floating Error Toast for credit (Overlay: does not shift UI) */}
            {creditError && (
              <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-red-900/95 backdrop-blur-md border-2 border-red-500 p-3 text-white text-center font-bold text-xs flex items-center justify-center gap-2 shadow-2xl animate-in zoom-in pointer-events-none rounded-xl">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <span>Отказано: плохая кредитная история пользователя!</span>
              </div>
            )}

            {/* Quick Action Grid */}
            <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveModal('transfer')}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-white">Перевод</span>
              </button>

              <button
                onClick={() => setActiveModal('history')}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 cursor-pointer"
              >
                <History className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-white">История</span>
              </button>

              <button
                onClick={() => setActiveModal('qr')}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-white">QR код</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal('cashback')}
              className="p-3 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-600/50 flex items-center justify-between cursor-pointer"
              onClickCapture={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Кэшбэк СберСпасибо</div>
                  <div className="text-[10px] text-red-400 font-bold">{cashback} баллов</div>
                </div>
              </div>
              <span className="text-[10px] bg-red-600 text-white px-2 py-1 font-black uppercase">Задолженность</span>
            </button>

            {/* Credit Button */}
            <button
              onClick={handleTakeCredit}
              className="bg-slate-900 border border-slate-800 hover:border-red-500/50 p-3 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-red-400" />
                <div>
                  <div className="font-bold text-white text-xs">Взять кредит</div>
                  <div className="text-[10px] text-slate-500">До 10 000 000 ₽</div>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-red-950 text-red-300 font-bold border border-red-800 uppercase">
                Заблокировано
              </span>
            </button>

            {/* Modal Windows */}
            {activeModal === 'transfer' && (
              <div className="p-3 bg-slate-950 border border-cyan-500 space-y-2" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs font-bold text-cyan-400 uppercase">Перевод денег</div>
                <form onSubmit={handleTransferSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={transferComment}
                    onChange={(e) => setTransferComment(e.target.value)}
                    placeholder="Комментарий..."
                    className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white outline-none focus:border-cyan-500"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-1.5 bg-cyan-500 text-slate-950 font-bold text-xs uppercase">
                      Перевести
                    </button>
                    <button type="button" onClick={() => setActiveModal(null)} className="px-3 bg-slate-800 text-white text-xs font-bold">
                      Закрыть
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeModal === 'history' && (
              <div className="p-3 bg-slate-950 border border-amber-500 space-y-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase">История операций</span>
                  <button onClick={() => setActiveModal(null)} className="text-xs text-slate-400">✕</button>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {operations.map((op) => (
                    <div key={op.id} className="p-2 bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">{op.title}</div>
                        <div className="text-[9px] text-slate-500">{op.date}</div>
                      </div>
                      <span className={`font-black ${op.type === 'in' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {op.type === 'in' ? '+' : '-'}{op.amount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'qr' && (
              <div className="p-4 bg-slate-950 border border-purple-500 text-center space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs font-bold text-purple-400 uppercase">Оплата по QR-коду</div>
                <div className="w-32 h-32 mx-auto bg-white p-2 border-2 border-purple-400 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-950" />
                </div>
                <p className="text-[10px] text-slate-400">Покажите QR-код кассиру для списания бонусов и оплаты</p>
                <button onClick={() => setActiveModal(null)} className="w-full py-1.5 bg-slate-800 text-white text-xs font-bold uppercase">
                  Закрыть
                </button>
              </div>
            )}

            {activeModal === 'cashback' && (
              <div className="p-4 bg-slate-950 border border-amber-500 text-center space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="text-xs font-bold text-red-400 uppercase">Задолженность СберСпасибо</div>
                <div className="text-2xl font-black text-red-400">{cashback.toLocaleString('ru-RU')} БАЛЛОВ</div>
                <p className="text-[10px] text-slate-400">Требуется погасить задолженность по СберСпасибо</p>
                <button onClick={() => setActiveModal(null)} className="w-full py-1 bg-slate-800 text-white text-xs font-bold uppercase">
                  Закрыть
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
