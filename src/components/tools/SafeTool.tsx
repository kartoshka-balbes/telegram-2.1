import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const PW_KEY = 'safe_password';
const TXT_KEY = 'safe_secret_text';

const readStore = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStore = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export const SafeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [savedPassword, setSavedPassword] = useState<string | null>(() => readStore(PW_KEY));
  const [inputPassword, setInputPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Информации в сейфе по умолчанию нет
  const [secretText, setSecretText] = useState<string>(() => readStore(TXT_KEY) || '');

  // Первый вход: придумать пароль (без подсказок)
  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) {
      setErrorMsg('Пароль не может быть пустым');
      return;
    }
    const pw = inputPassword.trim();
    setSavedPassword(pw);
    writeStore(PW_KEY, pw);
    setIsUnlocked(true);
    setInputPassword('');
    setErrorMsg('');
    soundManager.playBeep(1000, 0.15);
  };

  // Следующие входы: пароль всегда показан на экране входа
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === savedPassword) {
      setIsUnlocked(true);
      setErrorMsg('');
      soundManager.playBeep(1200, 0.15);
    } else {
      setErrorMsg('Неверный пароль');
      soundManager.playSiren();
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setInputPassword('');
    setErrorMsg('');
    soundManager.playBeep(400, 0.1);
  };

  const updateSecret = (v: string) => {
    setSecretText(v);
    writeStore(TXT_KEY, v);
  };

  const card =
    'relative bg-gradient-to-b from-[#1b1f2e] to-[#12141d] border border-white/10 rounded-[2rem] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-5 my-auto overflow-hidden';

  return (
    <ToolWrapper title="Сейф" onClose={onClose}>
      <div className="relative flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-4 select-none">
        {/* Первый вход */}
        {savedPassword === null && (
          <form onSubmit={handleSetupPassword} className={card}>
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.4)]">
                <ShieldCheck className="w-10 h-10 text-slate-900" />
              </div>
              <h2 className="text-xl font-bold text-white">Настройка сейфа</h2>
              <p className="text-xs text-slate-400 mt-1">Придумайте пароль для доступа</p>
            </div>

            <input
              type="text"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white text-center text-lg font-semibold outline-none focus:border-amber-400 transition-colors"
            />

            {errorMsg && (
              <p className="text-rose-300 text-xs font-semibold text-center bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all"
            >
              Сохранить и открыть сейф
            </button>
          </form>
        )}

        {/* Вход: пароль всегда виден */}
        {savedPassword !== null && !isUnlocked && (
          <form onSubmit={handleUnlock} className={card}>
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-[0_10px_30px_rgba(244,63,94,0.4)]">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Сейф заблокирован</h2>
              <p className="text-xs text-slate-400 mt-1">Введите пароль для разблокировки</p>
            </div>

            {/* Пароль всегда высвечивается на экране входа */}
            <div className="text-center bg-black/30 border border-white/10 rounded-2xl py-3 px-4">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Пароль</div>
              <div className="text-xl font-bold text-amber-300 break-all">{savedPassword}</div>
            </div>

            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white text-center text-lg font-semibold outline-none focus:border-cyan-400 transition-colors"
            />

            {errorMsg && (
              <p className="text-rose-300 text-xs font-semibold text-center bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-bold text-sm rounded-2xl cursor-pointer shadow-lg active:scale-[0.98] transition-all"
            >
              Открыть сейф
            </button>
          </form>
        )}

        {/* Открытый сейф */}
        {savedPassword !== null && isUnlocked && (
          <div className="space-y-4 my-auto">
            <div className={card.replace('space-y-5', 'space-y-3')}>
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between relative">
                <span className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Содержимое сейфа
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  ОТКРЫТО
                </span>
              </div>

              <textarea
                value={secretText}
                onChange={(e) => updateSecret(e.target.value)}
                rows={7}
                placeholder="Здесь пока пусто"
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-emerald-200 text-sm outline-none focus:border-emerald-400 resize-none relative"
              />
            </div>

            <button
              onClick={handleLock}
              className="w-full py-4 bg-rose-500/90 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Заблокировать сейф</span>
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
