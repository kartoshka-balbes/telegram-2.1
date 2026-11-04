import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Flame, AlertTriangle, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const SmokeDetectorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    // First warning after 6 seconds
    const firstTimer = setTimeout(() => {
      triggerSmokeWarning();

      // Then every 7-8 seconds
      const recurringInterval = setInterval(() => {
        triggerSmokeWarning();
      }, 7500);

      return () => clearInterval(recurringInterval);
    }, 6000);

    return () => clearTimeout(firstTimer);
  }, []);

  const triggerSmokeWarning = () => {
    soundManager.playNuclearAlarm();
    const time = new Date().toLocaleTimeString();
    const msg = `🚨 ОБНАРУЖЕНО ЗАДЫМЛЕНИЕ В ПОМЕЩЕНИИ! (${time})`;
    setWarnings((prev) => [msg, ...prev]);
    setActiveModal(msg);
  };

  return (
    <ToolWrapper title="Датчик дыма" onClose={onClose} headerColor="bg-slate-900 border-slate-800">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <Flame className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
          <h3 className="text-base font-black text-white uppercase">ПОЖАРНО-ИЗВЕЩАТЕЛЬНЫЙ ДАТЧИК</h3>
          <p className="text-slate-400 text-[10px]">ОПТИЧЕСКИЙ ДАТЧИК ДЫМА И ГАЗА</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 space-y-3 my-auto">
          <span className="text-slate-400 font-bold block text-[10px] uppercase">
            ЖУРНАЛ СРАБАТЫВАНИЙ ДАТЧИКА:
          </span>

          {warnings.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-bold">
              Датчик активен. Ожидание первого сигнала (6 сек)...
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {warnings.map((w, idx) => (
                <div key={idx} className="p-3 bg-red-950/60 border border-red-800 text-red-300 font-extrabold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smoke Popup Warning Modal */}
        {activeModal && (
          <div className="fixed inset-0 bg-red-950/90 z-50 flex items-center justify-center p-6 animate-in zoom-in duration-150">
            <div className="w-full max-w-sm bg-slate-900 border-4 border-red-600 p-6 text-center shadow-2xl relative font-mono space-y-4">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-6xl animate-bounce">💨</div>
              <h2 className="text-lg font-black text-red-500 uppercase tracking-widest">
                ВНИМАНИЕ!
              </h2>
              <p className="text-white font-black text-sm">{activeModal}</p>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs cursor-pointer"
              >
                ПРИНЯТЬ ТРЕВОГУ
              </button>
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          АВТОНОМНЫЙ ПИТАТЕЛЬ 9V • СТАНДАРТ EN 14604
        </div>
      </div>
    </ToolWrapper>
  );
};
