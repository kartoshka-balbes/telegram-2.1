import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { X } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const BurgerKingTool: React.FC<ToolProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(true);

  const handleCloseNotification = () => {
    setShowModal(false);
    onClose();
  };
  return (
    <ToolWrapper title="Бургер Кинг" onClose={onClose}>
      <div className="relative flex-1 flex flex-col py-4">
        {/* Background menu layout */}
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <input
            type="text"
            placeholder="Поиск блюд (Воппер, Наггетсы)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-5xl mb-2">🍔</div>
              <div className="font-bold text-white text-sm">Воппер Комбо</div>
              <span className="text-xs text-amber-400 font-mono font-bold">399 ₽</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-5xl mb-2">🍟</div>
              <div className="font-bold text-white text-sm">Кинг Фри</div>
              <span className="text-xs text-amber-400 font-mono font-bold">149 ₽</span>
            </div>
          </div>
        </div>

        {/* Popup Modal with Close capability */}
        {showModal && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gradient-to-b from-red-600 to-red-900 border-4 border-amber-400 rounded-3xl p-8 text-center shadow-2xl relative">
              <button
                onClick={handleCloseNotification}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-black/40 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-7xl mb-4 animate-bounce">💩</div>
              <h1 className="text-3xl md:text-4xl font-black text-amber-300 tracking-wider leading-tight uppercase mb-6">
                БУРГЕР КИНГ ГОВНО
              </h1>
              <button
                onClick={handleCloseNotification}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
