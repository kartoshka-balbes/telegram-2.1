import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { AlertTriangle, ShoppingCart, Table } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const ExcelTool: React.FC<ToolProps> = ({ onClose }) => {
  const [showError, setShowError] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const handleAction = () => {
    soundManager.playBeep(300, 0.2);
    setShowError(true);
  };

  const handleBuy = () => {
    soundManager.playBeep(200, 0.2);
    setBuyError('На вашем банковском счете недостаточно средств для оплаты 14 990 ₽!');
  };

  return (
    <ToolWrapper title="Microsoft Excel 365" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-3 font-mono text-xs select-none space-y-3">
        <div className="bg-slate-900 border-2 border-emerald-500 p-5 rounded-2xl text-center space-y-3 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30">
            <Table className="w-9 h-9" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Microsoft Excel PRO</h2>

          {!showError ? (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] text-slate-300">Табличный процессор и формулы.</p>
              <button
                onClick={handleAction}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg"
              >
                Открыть рабочую книгу
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in zoom-in duration-200">
              <div className="p-4 bg-red-950/90 border-2 border-red-500 rounded-xl space-y-2">
                <AlertTriangle className="w-7 h-7 text-red-400 mx-auto animate-bounce" />
                <div className="text-xs font-black text-red-300 uppercase">ЛИЦЕНЗИЯ MICROSOFT EXCEL АННУЛИРОВАНА!</div>
                <p className="text-[11px] text-slate-200 leading-relaxed font-bold">
                  Для работы с таблицами и расчетов требуется активация бессрочной лицензии за <span className="text-amber-400 underline font-black">14 990 ₽</span>.
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
                <span>Активировать Excel (14 990 ₽)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
