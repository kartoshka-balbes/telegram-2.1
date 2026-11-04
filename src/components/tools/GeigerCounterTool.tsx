import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Radio, AlertTriangle, Zap } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const GeigerCounterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [measuring, setMeasuring] = useState(false);
  const [radiationValue, setRadiationValue] = useState<number | null>(null);
  const [interferenceGlitch, setInterferenceGlitch] = useState(false);
  const [glassCracked, setGlassCracked] = useState(false);

  useEffect(() => {
    if (radiationValue === null) return;
    const interval = setInterval(() => {
      // Fluctuating value around 146x normal (~17.52)
      const base = 146 * 0.12;
      const fluc = (Math.random() * 2 - 1) * 1.8;
      setRadiationValue(parseFloat((base + fluc).toFixed(2)));
      soundManager.playBeep(1600, 0.04);
      if (Math.random() > 0.6) {
        soundManager.playStaticNoise(0.15);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [radiationValue]);

  const handleMeasure = () => {
    setMeasuring(true);
    setRadiationValue(null);
    setGlassCracked(false);
    setInterferenceGlitch(true);
    soundManager.playBeep(800, 0.1);
    soundManager.playStaticNoise(0.6);

    // Click sound effects & light interference during measurement
    const interval = setInterval(() => {
      soundManager.playBeep(1200 + Math.random() * 400, 0.03);
      if (Math.random() > 0.5) {
        soundManager.playStaticNoise(0.2);
      }
    }, 180);

    const duration = Math.floor(Math.random() * 2000) + 2200;
    setTimeout(() => {
      clearInterval(interval);
      setMeasuring(false);
      setRadiationValue(17.52);
      setGlassCracked(true);
      // Play glass break sound and glitch sound
      soundManager.playGlassBreak();
      soundManager.playStaticNoise(0.8);
      setTimeout(() => {
        setInterferenceGlitch(false);
      }, 1000);
    }, duration);
  };

  return (
    <ToolWrapper title="Счётчик Гейгера" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">
        {/* Light interference / Screen radiation glitch overlay */}
        {(measuring || interferenceGlitch) && (
          <div className="absolute inset-0 pointer-events-none z-30 bg-amber-500/10 mix-blend-screen animate-pulse flex items-center justify-center">
            <div className="w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_2px,transparent_2px,transparent_4px)] opacity-70" />
          </div>
        )}

        <div className={`bg-slate-900 border-2 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-5 transition-all relative ${
          glassCracked ? 'border-red-500/70 shadow-red-950/50' : 'border-slate-800'
        }`}>
          {/* Glass crack visual overlay when cracked */}
          {glassCracked && (
            <div className="absolute top-3 right-4 px-2.5 py-1 bg-red-950/80 border border-red-500 text-red-400 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 animate-bounce">
              <AlertTriangle className="w-3 h-3" />
              <span>ДАТЧИК ПОВРЕЖДЁН (ТРЕСНУЛ)</span>
            </div>
          )}

          <div className={`p-4 rounded-full border transition-all ${
            measuring
              ? 'bg-amber-500/20 border-amber-400 animate-spin'
              : glassCracked
              ? 'bg-red-500/20 border-red-500 animate-pulse'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            {measuring ? (
              <Zap className="w-16 h-16 text-amber-300" />
            ) : (
              <Radio className={`w-16 h-16 ${glassCracked ? 'text-red-400' : 'text-amber-400'}`} />
            )}
          </div>

          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 w-full font-mono relative overflow-hidden">
            {measuring && (
              <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
            )}
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Уровень радиационного фона:
            </span>
            <div className={`text-3xl sm:text-4xl font-black min-h-[48px] flex items-center justify-center transition-colors ${
              glassCracked ? 'text-red-500 animate-pulse' : 'text-amber-400'
            }`}>
              {measuring ? (
                <span className="animate-pulse text-amber-300 text-xl font-bold flex items-center gap-2">
                  <span className="inline-block animate-spin">⚡</span> Замер фона...
                </span>
              ) : radiationValue !== null ? (
                `${radiationValue} мкЗв/ч`
              ) : (
                '0.00 мкЗв/ч'
              )}
            </div>
            {radiationValue !== null && (
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mt-1">
                КРИТИЧЕСКОЕ ПРЕВЫШЕНИЕ (×146 НОРМЫ)
              </span>
            )}
          </div>

          <button
            onClick={handleMeasure}
            disabled={measuring}
            className={`w-full py-4 font-black text-base rounded-2xl uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer ${
              measuring
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {measuring ? 'Идёт замер радиации...' : 'Измерить'}
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
