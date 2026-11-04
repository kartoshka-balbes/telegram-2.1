import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const TomographyTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setDiagnosis(null);
    soundManager.playBeep(200, 0.5);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      soundManager.playBeep(200 + current * 5, 0.05);

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        const results = [
          'КТ ГОЛОВНОГО МОЗГА: Обнаружен гигантский уровень гениальности! Ошибок нет.',
          'МРТ ПОЗВОНОЧНИКА: Обнаружено 100% здоровье и мощнейший титановый скелет!',
          'ТОМОГРАФИЯ СЕРДЦА: Работает с частотой платинового реактора Тони Старка!',
        ];
        setDiagnosis(results[Math.floor(Math.random() * results.length)]);
      }
    }, 300);
  };

  return (
    <ToolWrapper title="Компьютерная Томография (КТ/МРТ)" onClose={onClose} headerColor="bg-cyan-950 border-cyan-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-3 font-mono">
        <div className="bg-slate-900 border-2 border-cyan-400 p-5 text-center space-y-4 shadow-2xl">
          {/* Scanner Visualizer */}
          <div className="relative w-40 h-40 mx-auto bg-slate-950 rounded-full border-4 border-cyan-500 flex items-center justify-center overflow-hidden">
            {isScanning && (
              <div
                className="absolute inset-0 bg-cyan-500/20 animate-spin border-t-4 border-cyan-400"
                style={{ animationDuration: '1s' }}
              />
            )}
            <Activity className={`w-16 h-16 text-cyan-400 ${isScanning ? 'animate-pulse' : ''}`} />
          </div>

          <h3 className="text-lg font-black text-white uppercase">Медицинский Сканер КТ-3000</h3>

          {isScanning ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-cyan-400">Сканирование... {progress}%</div>
              <div className="h-3 bg-slate-950 border border-cyan-500 w-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <button
              onClick={startScan}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-lg"
            >
              Начать томографию
            </button>
          )}

          {diagnosis && (
            <div className="p-4 bg-cyan-950 border-2 border-cyan-400 text-cyan-200 text-xs font-black uppercase tracking-wide leading-relaxed animate-in fade-in">
              {diagnosis}
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
