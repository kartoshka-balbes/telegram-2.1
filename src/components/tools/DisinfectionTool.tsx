import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const DisinfectionTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setCompleted(false);
    soundManager.playSiren();

    setTimeout(() => {
      setIsScanning(false);
      setCompleted(true);
      soundManager.playMicrowaveDing();
    }, 5500);
  };

  return (
    <ToolWrapper title="Дезинфекция" onClose={onClose}>
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        {/* Irregular small "Начать" button in top-left corner */}
        {!isScanning && !completed && (
          <button
            onClick={handleStartScan}
            className="absolute top-2 left-2 px-3 py-1 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs rounded shadow-md border border-black cursor-pointer transform -rotate-6 hover:rotate-0 transition-transform"
          >
            Начать
          </button>
        )}

        {/* Instructions */}
        {!isScanning && !completed && (
          <div className="text-center max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="text-7xl mb-6 animate-pulse">✋</div>
            <h2 className="text-xl font-bold text-white leading-relaxed">
              Приложите руку к экрану, а затем нажмите кнопку для дезинфекции.
            </h2>
          </div>
        )}

        {/* Scanning state */}
        {isScanning && (
          <div className="text-center flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 border-4 border-cyan-400/40 rounded-3xl overflow-hidden flex items-center justify-center mb-6 bg-cyan-950/20 shadow-2xl">
              <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#00e5ff] animate-scan" />
              <div className="text-8xl animate-pulse">✋</div>
            </div>
            <p className="text-xl font-black text-cyan-400 animate-pulse tracking-wider uppercase">
              ИДЁТ СВЕРХМОЩНАЯ ДЕЗИНФЕКЦИЯ... (5 сек)
            </p>
          </div>
        )}

        {/* Completed state */}
        {completed && (
          <div className="text-center bg-emerald-950/40 border-2 border-emerald-500 rounded-3xl p-8 max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-7xl mb-4">✨</div>
            <h2 className="text-2xl font-black text-emerald-400 mb-4 uppercase">
              рука продезинфицирована!
            </h2>
            <p className="text-slate-300 text-sm mb-6">
              Все бактерии и вирусы успешно уничтожены квантовым лазером приложения.
            </p>
            <button
              onClick={() => setCompleted(false)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Повторить
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
