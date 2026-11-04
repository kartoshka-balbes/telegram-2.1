import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Fingerprint, AlertTriangle, CheckCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const LieDetectorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<'truth' | 'lie' | null>(null);

  const handleStartDetector = () => {
    setAnalyzing(true);
    setResult(null);
    soundManager.playBeep(600, 0.1);

    setTimeout(() => {
      setAnalyzing(false);
      const isTruth = Math.random() < 0.3; // 30% truth, 70% lie
      if (isTruth) {
        setResult('truth');
        soundManager.playMicrowaveDing();
      } else {
        setResult('lie');
        soundManager.playSiren();
      }
    }, 5000);
  };

  return (
    <ToolWrapper title="Детектор лжи" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        {!analyzing && !result && (
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-4">
            <Fingerprint className="w-20 h-20 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-extrabold text-white uppercase">Проверка на правду</h2>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Введите ваш вопрос..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-2xl p-4 text-white text-sm outline-none font-medium"
            />

            <button
              onClick={handleStartDetector}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base rounded-2xl uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Задать вопрос
            </button>
          </div>
        )}

        {analyzing && (
          <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-8 w-full shadow-2xl flex flex-col items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <Fingerprint className="w-24 h-24 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-black text-cyan-400 animate-pulse uppercase tracking-wider">
                Анализ биотоков мозга... (5 сек)
              </p>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-400 animate-[pulse_1s_infinite] w-full" />
              </div>
            </div>
          </div>
        )}

        {result === 'truth' && (
          <div className="fixed inset-0 bg-emerald-600 animate-pulse z-50 flex flex-col items-center justify-center p-6 text-center select-none">
            <CheckCircle className="w-32 h-32 text-white mb-6 animate-bounce" />
            <h1 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-widest drop-shadow-2xl mb-8">
              ПРАВДА
            </h1>
            <button
              onClick={() => setResult(null)}
              className="px-8 py-4 bg-white text-emerald-950 font-black text-lg rounded-2xl uppercase shadow-2xl cursor-pointer"
            >
              Пройти еще раз
            </button>
          </div>
        )}

        {result === 'lie' && (
          <div className="fixed inset-0 bg-red-600 animate-pulse z-50 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="text-9xl mb-6 animate-bounce">🚨</div>
            <h1 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-widest drop-shadow-2xl mb-8">
              ЛОЖЬ
            </h1>
            <button
              onClick={() => setResult(null)}
              className="px-8 py-4 bg-white text-red-950 font-black text-lg rounded-2xl uppercase shadow-2xl cursor-pointer"
            >
              Пройти еще раз
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
