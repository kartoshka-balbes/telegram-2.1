import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Droplet, Activity, CheckCircle, RefreshCw, Battery, Bluetooth } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const HISTORY = [5.1, 5.6, 4.9, 5.8, 5.2, 5.0, 5.4];

export const GlucometerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [measuring, setMeasuring] = useState(false);
  const [glucose, setGlucose] = useState<number | null>(null);

  const handleMeasure = () => {
    soundManager.playBeep(900, 0.08);
    setMeasuring(true);
    setGlucose(null);

    setTimeout(() => {
      soundManager.playBeep(1200, 0.15);
      setMeasuring(false);
      // Realistic glucose value: 5.4 mmol/L
      setGlucose(5.4);
    }, 2000);
  };

  const pts = [...HISTORY, glucose ?? HISTORY[HISTORY.length - 1]];
  const min = 3.5;
  const max = 7;
  const path = pts
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * 280 + 10} ${70 - ((v - min) / (max - min)) * 60}`)
    .join(' ');

  return (
    <ToolWrapper title="Глюкометр" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4 py-2 select-none">
        {/* Прибор */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-[#f7f9ff] to-[#dfe7f5] text-[#12203a] shadow-[0_25px_60px_rgba(0,0,0,0.45)] p-5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#5a6c8f] mb-3">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-rose-500" /> ТЕСТ-ПОЛОСКА · КОД 842-BG</span>
            <span className="flex items-center gap-2"><Bluetooth className="w-3.5 h-3.5" /><Battery className="w-4 h-4" /></span>
          </div>

          <div className="rounded-3xl bg-[#0f1a2e] text-white p-5 text-center min-h-[200px] flex flex-col items-center justify-center shadow-inner">
            {measuring && (
              <div className="space-y-3">
                <div className="relative w-16 h-16 mx-auto">
                  <span className="absolute inset-0 rounded-full bg-rose-500/25 animate-ping" />
                  <Droplet className="relative w-16 h-16 text-rose-400 animate-bounce fill-current" />
                </div>
                <span className="text-rose-300 font-bold text-xs uppercase tracking-widest block animate-pulse">Измерение глюкозы в крови...</span>
              </div>
            )}

            {!measuring && glucose === null && (
              <div className="space-y-3">
                <Droplet className="w-14 h-14 text-slate-500 mx-auto" />
                <span className="text-slate-300 font-medium block text-sm">Приложите палец к датчику для анализа</span>
              </div>
            )}

            {!measuring && glucose !== null && (
              <div className="space-y-2 animate-in zoom-in duration-150">
                <span className="text-slate-300 font-semibold text-[11px] uppercase block tracking-wider">Уровень сахара в крови:</span>
                <div className="text-7xl font-extrabold tracking-tight tabular-nums">
                  {glucose} <span className="text-xl text-rose-300 font-semibold">ммоль/л</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-semibold px-3.5 py-1.5 rounded-full text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Норма натощак (3.3 – 5.5 ммоль/л)</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleMeasure}
            disabled={measuring}
            className="mt-4 w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-50 text-white font-bold uppercase text-sm cursor-pointer shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 rounded-full active:scale-[0.98] transition-all"
          >
            {measuring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Droplet className="w-4 h-4 fill-current" />}
            <span>{glucose === null ? 'Измерить глюкозу' : 'Повторить анализ'}</span>
          </button>
        </div>

        {/* График */}
        <div className="rounded-[1.75rem] bg-white/[0.05] border border-white/10 p-4">
          <div className="text-[11px] font-semibold text-gray-400 mb-2">Динамика за неделю, ммоль/л</div>
          <svg viewBox="0 0 300 80" className="w-full">
            <line x1="10" y1={70 - ((5.5 - min) / (max - min)) * 60} x2="290" y2={70 - ((5.5 - min) / (max - min)) * 60} stroke="rgba(52,211,153,0.4)" strokeDasharray="4 4" />
            <path d={path} fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((v, i) => (
              <circle key={i} cx={(i / (pts.length - 1)) * 280 + 10} cy={70 - ((v - min) / (max - min)) * 60} r="3" fill="#fff" />
            ))}
          </svg>
        </div>

        <div className="p-4 rounded-[1.75rem] bg-white/[0.05] border border-white/10 text-gray-300 space-y-1.5 text-xs">
          <div className="flex justify-between"><span>Метод анализа:</span><span className="text-white font-semibold">Электрохимический</span></div>
          <div className="flex justify-between"><span>Объём пробы:</span><span className="text-white font-semibold">0.6 мкл</span></div>
        </div>
      </div>
    </ToolWrapper>
  );
};
