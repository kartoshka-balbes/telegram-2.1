import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';
import { ZoomIn, ZoomOut, CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const SIVTSEV_ROWS = [
  { level: '0.1', letters: 'Ш  Б', size: 'text-6xl sm:text-7xl tracking-widest' },
  { level: '0.2', letters: 'М  Н  К', size: 'text-4xl sm:text-5xl tracking-widest' },
  { level: '0.3', letters: 'Ы  М  Б  И', size: 'text-3xl sm:text-4xl tracking-wider' },
  { level: '0.4', letters: 'Б  И  Н  Ш  К', size: 'text-2xl sm:text-3xl tracking-wider' },
  { level: '0.5', letters: 'Н  Ш  Ы  И  М  К', size: 'text-xl sm:text-2xl tracking-wider' },
  { level: '0.6', letters: 'И  Б  Ш  М  К  Ы', size: 'text-lg sm:text-xl tracking-wider' },
  { level: '0.7', letters: 'Ш  Н  И  К  М  Б  Ы', size: 'text-base sm:text-lg tracking-normal' },
  { level: '0.8', letters: 'К  Ы  М  И  Ш  Б  Н', size: 'text-sm sm:text-base tracking-normal' },
  { level: '0.9', letters: 'М  Ш  Б  Ы  Н  К  И', size: 'text-xs sm:text-sm tracking-normal' },
  { level: '1.0', letters: 'Ш  Б  М  Н  К  Ы  И', size: 'text-[11px] sm:text-xs tracking-tight' },
  { level: '1.5', letters: 'Н  К  Б  И  Ш  Ы  М', size: 'text-[9px] sm:text-[10px] tracking-tight' },
  { level: '2.0', letters: 'Ы  М  К  Н  Ш  Б  И', size: 'text-[7px] sm:text-[8px] tracking-tight' },
];

export const VisionTestTool: React.FC<ToolProps> = ({ onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestPass = () => {
    soundManager.playRock();
    setTestResult('100% Зрение (1.0) — Норма!');
  };

  const handleTestFail = () => {
    soundManager.playFail();
    setTestResult('Зрение снижено. Рекомендуется консультация офтальмолога.');
  };

  const handleReset = () => {
    soundManager.playBeep(800, 0.05);
    setZoom(1);
    setTestResult(null);
  };

  return (
    <ToolWrapper title="Таблица Сивцева (Проверка зрения)" onClose={onClose} headerColor="bg-slate-900 border-slate-800">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-between p-3 font-sans select-none overflow-hidden h-full">
        {/* Controls Header */}
        <div className="w-full flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Официальная таблица Сивцева</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playBeep(1000, 0.04);
                setZoom((z) => Math.min(2.5, z + 0.25));
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="Увеличить"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundManager.playBeep(900, 0.04);
                setZoom((z) => Math.max(0.75, z - 0.25));
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="Уменьшить"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="Сброс"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Crisp Sivtsev Table Board */}
        <div className="w-full flex-1 min-h-0 bg-white rounded-2xl overflow-auto border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-start p-6 relative text-black">
          <div
            className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-3.5 transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            {SIVTSEV_ROWS.map((row, idx) => (
              <div key={idx} className="w-full flex items-center justify-between border-b border-gray-200/50 pb-1">
                <span className="font-mono text-[9px] text-gray-500 w-10 text-left">V={row.level}</span>
                <span className={`font-black font-mono text-center flex-1 ${row.size} text-black select-text`}>
                  {row.letters}
                </span>
                <span className="font-mono text-[9px] text-gray-500 w-10 text-right">D=5.0m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 mt-2 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2">
          {testResult ? (
            <div className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
              testResult.includes('100%') ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-rose-950/80 border-rose-500 text-rose-300'
            }`}>
              {testResult.includes('100%') ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
              {testResult}
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-medium">
              Отойдите на 1 метр. Различаете ли буквы 10-й строки (V=1.0)?
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestPass}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Вижу чётко (1.0)
            </button>
            <button
              onClick={handleTestFail}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Не вижу / Размыто
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
