import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Sun, Lightbulb, Zap, Gauge } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const LuxmeterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [lux, setLux] = useState(450);
  const [multiplier, setMultiplier] = useState<'x1' | 'x10' | 'x100'>('x1');
  const [isLightOn, setIsLightOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate lux slightly
      const delta = Math.floor(Math.random() * 30) - 15;
      const base = isLightOn ? 8500 : 450;
      setLux((prev) => Math.max(10, Math.min(100000, base + delta)));
    }, 300);

    return () => clearInterval(interval);
  }, [isLightOn]);

  const toggleFlash = () => {
    soundManager.playBeep(isLightOn ? 500 : 1200, 0.1);
    setIsLightOn(!isLightOn);
  };

  // Convert Lux to needle rotation angle (-60deg to +60deg)
  const maxLux = multiplier === 'x1' ? 1000 : multiplier === 'x10' ? 10000 : 100000;
  const clampedLux = Math.min(lux, maxLux);
  const angle = -60 + (clampedLux / maxLux) * 120;

  return (
    <ToolWrapper title="Люксометр (Измеритель освещенности)" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Analog Gauge / Voltmeter Dial Screen */}
        <div className="bg-slate-900 border-2 border-amber-500/80 p-5 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Gauge className="w-4 h-4" /> Аналоговый Фотометр ЛМ-200
          </div>

          {/* Semi-circle Gauge Dial */}
          <div className="w-56 h-32 relative flex justify-center items-end overflow-hidden my-2 border-b-2 border-amber-500/40">
            {/* Scale markings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full stroke-amber-500/50 stroke-2 fill-none">
                <path d="M 20 120 A 90 90 0 0 1 204 120" strokeDasharray="4,6" />
              </svg>
            </div>

            {/* Scale Numbers */}
            <div className="absolute top-4 left-4 text-[9px] text-amber-400 font-bold">0</div>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-amber-400 font-bold">50%</div>
            <div className="absolute top-4 right-4 text-[9px] text-amber-400 font-bold">100%</div>

            {/* Gauge Needle */}
            <div
              className="w-1 h-28 bg-red-500 origin-bottom transition-transform duration-200 ease-out rounded-full shadow-lg z-10"
              style={{ transform: `rotate(${angle}deg)` }}
            />
            {/* Needle Pivot Cap */}
            <div className="w-5 h-5 bg-amber-400 rounded-full border-2 border-slate-950 absolute -bottom-2 z-20 shadow-md" />
          </div>

          {/* Digital Readout Box */}
          <div className="mt-2 bg-slate-950 border border-slate-800 px-6 py-2 rounded-xl text-center">
            <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              {lux.toLocaleString()}
            </span>
            <span className="text-xs text-amber-300 font-bold ml-1.5">Lux (Лк)</span>
          </div>
        </div>

        {/* Range Multiplier Controls */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
            Диапазон измерений:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['x1', 'x10', 'x100'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  soundManager.playBeep(800, 0.05);
                  setMultiplier(m);
                }}
                className={`py-2 rounded-xl font-black text-xs cursor-pointer border transition-all ${
                  multiplier === m
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Light Source Test Trigger */}
        <button
          onClick={toggleFlash}
          className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase cursor-pointer flex items-center justify-center gap-2 border transition-all ${
            isLightOn
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span>{isLightOn ? 'Вспышка включена (Тест 8500 Лк)' : 'Включить тест-свет'}</span>
        </button>
      </div>
    </ToolWrapper>
  );
};
