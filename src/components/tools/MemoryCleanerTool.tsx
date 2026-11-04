import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Trash2, ShieldCheck, Cpu } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MemoryCleanerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleStartClean = () => {
    setCleaning(true);
    setResult(null);
    soundManager.playBeep(800, 0.1);

    setTimeout(() => {
      setCleaning(false);
      // Number from 78945132 GB to 99754616157513 GB
      const min = 78945132;
      const max = 99754616157513;
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      setResult(`Удалено ${val.toLocaleString('ru-RU')} гб памяти`);
      soundManager.playPrinterSound();
    }, 3000);
  };

  return (
    <ToolWrapper title="Очистка памяти" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />

          {cleaning ? (
            <div className="space-y-3 w-full">
              <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider animate-pulse">
                Анализ мусорных файлов...
              </span>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-400 animate-[pulse_1s_infinite] w-full" />
              </div>
            </div>
          ) : result ? (
            <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-6 w-full font-mono">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <div className="text-lg font-black text-emerald-400 uppercase tracking-wide">
                {result}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Нажмите кнопку для глубокой очистки оперативной памяти и кэша.
            </p>
          )}

          <button
            onClick={handleStartClean}
            disabled={cleaning}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-base rounded-2xl uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Очистить память</span>
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
