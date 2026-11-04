import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Newspaper, RefreshCw, Smile } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const NewsTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    soundManager.playBeep(1000, 0.05);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <ToolWrapper title="Лента Мировых Новостей" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-6 font-sans select-none text-center space-y-4">
        
        <div className="w-24 h-24 rounded-full bg-[#0f121a] border-2 border-[#8f9bff]/40 flex items-center justify-center shadow-[inset_0_0_20px_rgba(143,155,255,0.1)]">
          <Newspaper className="w-10 h-10 text-[#8f9bff]" />
        </div>

        {loading ? (
          <div className="text-xs font-bold text-[#8f9bff] animate-pulse">
            ПОЛУЧЕНИЕ СВЕЖИХ НОВОСТЕЙ С ПЛАНЕТЫ...
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">НОВОСТЕЙ НЕТ</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Все международные рынки работают в стабильном штатном режиме. Новые экстренные сводки отсутствуют.
            </p>
          </div>
        )}

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-6 py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] disabled:opacity-50 text-black font-extrabold text-xs uppercase rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Обновить Новостную Ленту</span>
        </button>

      </div>
    </ToolWrapper>
  );
};
