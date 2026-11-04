import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RotateCw, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const WheelOfFortuneTool: React.FC<ToolProps> = ({ onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [screamer, setScreamer] = useState(false);
  const [siren, setSiren] = useState(false);
  const [nothing, setNothing] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setScreamer(false);
    setSiren(false);
    setNothing(false);
    soundManager.playBeep(900, 0.1);

    setTimeout(() => {
      setSpinning(false);
      const rand = Math.random(); // 0..1

      if (rand < 0.2) {
        // 20% Screamer
        setScreamer(true);
        soundManager.playScream();
      } else if (rand < 0.6) {
        // 40% Crash application / Close tool (Вылет из колеса фортуны)
        soundManager.playFail();
        soundManager.playExplosion();
        onClose();
      } else if (rand < 0.9) {
        // 30% Siren
        setSiren(true);
        soundManager.playSiren();
      } else {
        // 10% Nothing
        setNothing(true);
      }
    }, 2000);
  };

  return (
    <ToolWrapper title="Колесо фортуны" onClose={onClose}>
      <div className="relative flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full p-4 text-center">
        {/* Siren flash overlay */}
        {siren && (
          <div className="fixed inset-0 bg-red-600/80 z-50 flex flex-col items-center justify-center p-6 animate-pulse">
            <div className="text-9xl mb-4 animate-bounce">🚨</div>
            <h1 className="text-4xl font-black text-white uppercase mb-6">СИРЕНА ТРЕВОГИ!</h1>
            <button
              onClick={() => setSiren(false)}
              className="px-8 py-4 bg-white text-red-950 font-black text-lg rounded-2xl uppercase cursor-pointer shadow-2xl"
            >
              Отключить
            </button>
          </div>
        )}

        {/* Screamer overlay */}
        {screamer && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-100 select-none">
            <div className="text-[12rem] mb-4 animate-bounce">🤓</div>
            <button
              onClick={() => setScreamer(false)}
              className="mt-8 px-8 py-3 bg-yellow-400 text-slate-950 font-black rounded-xl uppercase cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        )}

        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <div className="relative w-44 h-44 rounded-full border-4 border-amber-400 flex items-center justify-center bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-500 shadow-2xl">
            <RotateCw className={`w-16 h-16 text-white ${spinning ? 'animate-spin' : ''}`} />
          </div>

          {nothing && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 w-full text-slate-400 font-bold text-sm">
              Ничего не произошло! Попробуйте еще раз.
            </div>
          )}

          <button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-base rounded-2xl uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            {spinning ? 'Вращение...' : 'Крутить колесо'}
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
