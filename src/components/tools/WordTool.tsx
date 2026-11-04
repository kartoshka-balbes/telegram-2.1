import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { AlertTriangle, ShoppingCart, FileText } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const WordTool: React.FC<ToolProps> = ({ onClose }) => {
  const [showError, setShowError] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const handleAction = () => {
    soundManager.playBeep(300, 0.2);
    setShowError(true);
  };

  const handleBuy = () => {
    soundManager.playBeep(200, 0.2);
    setBuyError('На вашем банковском счете недостаточно средств для оплаты 9 990 ₽!');
  };

  return (
    <ToolWrapper title="Microsoft Word 365" onClose={onClose} headerColor="bg-blue-950 border-blue-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-3 font-mono text-xs select-none space-y-3">
        <div className="bg-slate-900 border-2 border-blue-500 p-5 rounded-2xl text-center space-y-3 shadow-2xl">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30">
            <FileText className="w-9 h-9" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Microsoft Word PRO</h2>

          {!showError ? (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] text-slate-300">Текстовый редактор документов.</p>
              <button
                onClick={handleAction}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg"
              >
                Создать документ Word
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in zoom-in duration-200">
              <div className="p-4 bg-red-950/90 border-2 border-red-500 rounded-xl space-y-2">
                <AlertTriangle className="w-7 h-7 text-red-400 mx-auto animate-bounce" />
                <div className="text-xs font-black text-red-300 uppercase">ДОКУМЕНТ ЗАБЛОКИРОВАН!</div>
                <p className="text-[11px] text-slate-200 leading-relaxed font-bold">
                  Для редактирования и печати документов требуется подписка Word Premium за <span className="text-amber-400 underline font-black">9 990 ₽/мес</span>.
                </p>
              </div>

              {buyError && (
                <div className="p-3 bg-amber-950 border border-amber-500 text-amber-300 text-xs font-bold rounded-xl">
                  ❌ {buyError}
                </div>
              )}

              <button
                onClick={handleBuy}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 rounded-xl cursor-pointer shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Оплатить Word Premium (9 990 ₽)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
