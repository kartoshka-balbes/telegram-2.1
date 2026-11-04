import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Scale } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const UNITS = ['г', 'кг'];

export const ScalesTool: React.FC<ToolProps> = ({ onClose }) => {
  const [measuring, setMeasuring] = useState(false);
  const [weightResult, setWeightResult] = useState<string | null>(null);

  const handleMeasure = () => {
    setMeasuring(true);
    setWeightResult(null);
    soundManager.playBeep(700, 0.1);

    setTimeout(() => {
      setMeasuring(false);
      // Range 2g to 1432kg
      const isKg = Math.random() > 0.3;
      if (isKg) {
        const val = (Math.random() * 1432 + 0.1).toFixed(1);
        setWeightResult(`${val} кг`);
      } else {
        const val = Math.floor(Math.random() * 998) + 2;
        setWeightResult(`${val} г`);
      }
      soundManager.playBeep(1200, 0.15);
    }, Math.floor(Math.random() * 1000) + 2000);
  };

  return (
    <ToolWrapper title="Весы" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl shadow-inner">
            <Scale className="w-24 h-24 text-cyan-400" />
          </div>

          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 w-full font-mono">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Результат взвешивания:
            </span>
            <div className="text-4xl font-black text-cyan-400 min-h-[48px] flex items-center justify-center">
              {measuring ? (
                <span className="animate-pulse text-amber-400 text-2xl">Измерение...</span>
              ) : (
                weightResult || '0.00 кг'
              )}
            </div>
          </div>

          <button
            onClick={handleMeasure}
            disabled={measuring}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-base rounded-2xl uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            {measuring ? 'Взвешивание...' : 'Измерить'}
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
