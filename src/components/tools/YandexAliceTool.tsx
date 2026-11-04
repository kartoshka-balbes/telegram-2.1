import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Mic, AlertTriangle, ShoppingCart, Send } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const YandexAliceTool: React.FC<ToolProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const handleAsk = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundManager.playBeep(800, 0.1);
    // Show access error only on attempt
    setShowError(true);
  };

  const handleBuyMicrophone = () => {
    soundManager.playBeep(400, 0.1);
    // On purchase attempt, show "not supported"
    setPurchaseError('Покупка устройства не поддерживается в вашем регионе или на данном устройстве!');
  };

  return (
    <ToolWrapper title="Яндекс Алиса Голосовой Помощник" onClose={onClose} headerColor="bg-purple-950 border-purple-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4 font-mono text-center select-none">
        <div className="bg-slate-900 border-2 border-purple-500 p-6 space-y-5 shadow-2xl rounded-3xl">
          {/* Alice Logo */}
          <div className="w-20 h-20 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl shadow-xl shadow-purple-600/30 animate-pulse">
            🟣
          </div>

          <h2 className="text-xl font-black text-white uppercase tracking-wider">Яндекс Алиса PRO</h2>

          {!showError ? (
            <div className="space-y-4">
              <p className="text-xs text-purple-300 font-bold">
                «Привет! Я Алиса. Задайте мне любой вопрос или попросите включить музыку.»
              </p>

              <form onSubmit={handleAsk} className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Спросите о чем-нибудь..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white outline-none font-bold"
                />
                <button
                  type="submit"
                  className="px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <button
                onClick={() => handleAsk()}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase flex items-center justify-center gap-2 rounded-xl cursor-pointer shadow-lg shadow-purple-600/20"
              >
                <Mic className="w-5 h-5 animate-bounce" />
                <span>Голосовой ввод</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in zoom-in duration-200">
              <div className="p-4 bg-red-950/80 border-2 border-red-500 rounded-2xl space-y-3">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto animate-bounce" />
                <div className="text-sm font-black text-red-300 uppercase">ОШИБКА ДОСТУПА!</div>
                <p className="text-xs text-white leading-relaxed font-bold">
                  Для работы голосового помощника требуется купить премиум-микрофон студийного качества за{' '}
                  <span className="text-amber-400 text-sm font-black underline">999 000 ₽</span> в Яндекс Маркете!
                </p>
              </div>

              {purchaseError && (
                <div className="p-3 bg-amber-950 border border-amber-500 text-amber-300 text-xs font-bold rounded-xl animate-in fade-in">
                  ❌ {purchaseError}
                </div>
              )}

              <button
                onClick={handleBuyMicrophone}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg rounded-xl"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Купить микрофон за 999 000 ₽</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
