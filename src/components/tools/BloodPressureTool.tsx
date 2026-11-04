import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Fingerprint, Heart } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const BloodPressureTool: React.FC<ToolProps> = ({ onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ sys: number; dia: number; pulse: number } | null>(null);

  const handleStartScan = () => {
    setScanning(true);
    setResult(null);
    soundManager.playSiren();

    setTimeout(() => {
      setScanning(false);
      const sysVal = Math.floor(Math.random() * 30) + 110;
      const diaVal = Math.floor(Math.random() * 20) + 70;
      const pulseVal = Math.floor(Math.random() * 25) + 65;
      setResult({
        sys: sysVal,
        dia: diaVal,
        pulse: pulseVal,
      });
      soundManager.playMicrowaveDing();
    }, 3000);
  };

  return (
    <ToolWrapper title="Измерение давления" onClose={onClose}>
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Irregular action button like in disinfection */}
        {!scanning && (
          <button
            onClick={handleStartScan}
            className="absolute top-2 left-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl shadow-lg border border-cyan-200 cursor-pointer transform -rotate-3 hover:rotate-0 transition-transform uppercase tracking-wider"
          >
            Начать измерение
          </button>
        )}

        {/* Main Display Box */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-cyan-500/40 bg-slate-950 flex items-center justify-center mb-6 shadow-inner">
            <Fingerprint className={`w-16 h-16 ${scanning ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
          </div>

          {!scanning && !result && (
            <p className="text-sm font-bold text-slate-300">
              Нажмите кнопку «Начать измерение» для получения показателей.
            </p>
          )}

          {scanning && (
            <p className="text-sm font-black text-cyan-400 animate-pulse uppercase tracking-wider">
              Идёт измерение давления...
            </p>
          )}

          {result && !scanning && (
            <div className="w-full text-center animate-in zoom-in duration-200">
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-3">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
                <span className="text-xs uppercase tracking-wider text-slate-400">Результаты</span>
              </div>
              <div className="text-4xl font-black text-white font-mono mb-2">
                {result.sys} / {result.dia}
              </div>
              <div className="text-sm font-mono font-bold text-cyan-400">
                Пульс: {result.pulse} уд/мин
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
