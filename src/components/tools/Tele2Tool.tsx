import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const Tele2Tool: React.FC<ToolProps> = ({ onClose }) => {
  const [showForbiddenModal, setShowForbiddenModal] = useState(false);

  const handleActionClick = () => {
    soundManager.playSiren();
    setShowForbiddenModal(true);
    setTimeout(() => setShowForbiddenModal(false), 1000);
  };

  return (
    <ToolWrapper title="Теле2" onClose={onClose} headerColor="bg-slate-900 border-slate-800">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-6 py-4">
        {/* Tele2 Header */}
        <div className="bg-black border-2 border-slate-700 rounded-3xl p-6 text-center shadow-2xl">
          <div className="text-3xl font-black text-white font-mono tracking-widest uppercase mb-1">
            TELE2
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
            Другие правила
          </div>

          <div className="text-xs text-slate-400 mb-1">Ваш текущий баланс:</div>
          <div className="text-3xl sm:text-4xl font-black text-red-500 font-mono tracking-tight">
            -6,219,539 ₽
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {['Пополнить счёт', 'Взять кредит', 'Позвонить в долг', 'Выбор услуг'].map(
            (btnText) => (
              <button
                key={btnText}
                onClick={handleActionClick}
                className="w-full bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl p-4 text-white font-bold text-base transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{btnText}</span>
                <span className="text-xs px-2.5 py-1 bg-red-950 text-red-400 font-bold rounded-full border border-red-800 uppercase">
                  Выбрать
                </span>
              </button>
            )
          )}
        </div>

        {/* Fullscreen Forbidden Alarm Overlay */}
        {showForbiddenModal && (
          <div className="fixed inset-0 bg-red-600 animate-pulse z-50 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="text-9xl mb-6 animate-bounce">🚨</div>
            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-widest drop-shadow-2xl">
              ЗАПРЕЩЕНО
            </h1>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
