import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Gauge } from 'lucide-react';

interface ToolProps {
  mode: 'barometer' | 'ammeter' | 'voltmeter';
  onClose: () => void;
}

const METRICS_CONFIG = {
  barometer: {
    title: 'Барометр',
    unit: 'мм рт. ст.',
    gen: () => `${Math.floor(Math.random() * 80 + 720)} мм рт. ст.`,
  },
  ammeter: {
    title: 'Амперметр',
    unit: 'Амп (А)',
    gen: () => `${(Math.random() * 20 + 0.1).toFixed(1)} А`,
  },
  voltmeter: {
    title: 'Вольтметр',
    unit: 'Вольт (В)',
    gen: () => `${Math.floor(Math.random() * 20 + 220)} В`,
  },
};

export const GaugesTool: React.FC<ToolProps> = ({ mode, onClose }) => {
  const cfg = METRICS_CONFIG[mode];
  const [measuring, setMeasuring] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const handleMeasure = () => {
    setMeasuring(true);
    setValue(null);

    setTimeout(() => {
      setMeasuring(false);
      setValue(cfg.gen());
    }, 1200);
  };

  return (
    <ToolWrapper title={cfg.title} onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full p-6 text-center">
        {/* Gauge icon container */}
        <div className="w-48 h-48 rounded-full bg-slate-900 border-4 border-cyan-500/40 flex flex-col items-center justify-center mb-8 shadow-2xl relative">
          <Gauge className="w-20 h-20 text-cyan-400 mb-2 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">
            {cfg.unit}
          </span>
        </div>

        {/* Measure Button */}
        <button
          onClick={handleMeasure}
          disabled={measuring}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-lg rounded-2xl shadow-xl transition-all uppercase cursor-pointer mb-6"
        >
          {measuring ? 'Измерение...' : `Измерить ${cfg.title}`}
        </button>

        {/* Result Window */}
        {value && (
          <div className="bg-slate-900 border border-cyan-400/50 rounded-2xl p-5 w-full text-cyan-300 font-mono font-bold text-lg shadow-xl animate-in fade-in duration-200">
            {value}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
