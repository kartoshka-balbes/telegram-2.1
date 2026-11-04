import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Thermometer, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const ThermometerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [measuring, setMeasuring] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);

  const handleMeasure = () => {
    soundManager.playBeep(700, 0.08);
    setMeasuring(true);
    setTemperature(null);

    // Random duration 4 to 8 seconds
    const duration = Math.floor(Math.random() * 4000) + 4000;

    setTimeout(() => {
      soundManager.playBeep(1000, 0.2);
      setMeasuring(false);

      // Either range [-147, -1] OR range [39.9, 148.3]
      const isNegativeRange = Math.random() < 0.5;
      let temp: number;
      if (isNegativeRange) {
        // -147 to -1
        temp = Math.floor(Math.random() * (1 - 147)) - 1;
      } else {
        // 39.9 to 148.3
        temp = parseFloat((Math.random() * (148.3 - 39.9) + 39.9).toFixed(1));
      }
      setTemperature(temp);
    }, duration);
  };

  return (
    <ToolWrapper title="Термометр" onClose={onClose} headerColor="bg-cyan-950 border-cyan-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs">
        {/* Top Prompt */}
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-2">
          <Thermometer className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
          <h3 className="text-base font-extrabold text-white uppercase">
            Приложите телефон к телу и нажмите на кнопку
          </h3>
          <p className="text-slate-400 text-[11px]">
            ИК-ДАТЧИК ТЕМПЕРАТУРЫ • КАЛИБРОВКА СЕНСОРА
          </p>
        </div>

        {/* Display Screen */}
        <div className="bg-slate-900 border-2 border-slate-800 p-8 my-auto text-center">
          {measuring && (
            <div className="space-y-4">
              <RefreshCw className="w-12 h-12 text-cyan-400 mx-auto animate-spin" />
              <div className="text-cyan-300 font-extrabold text-sm uppercase tracking-wider animate-pulse">
                ИЗМЕРЕНИЕ ТЕМПЕРАТУРЫ ТЕЛА...
              </div>
            </div>
          )}

          {!measuring && temperature === null && (
            <div className="text-slate-500 font-bold text-sm">
              ГОТОВ К ИЗМЕРЕНИЮ
            </div>
          )}

          {!measuring && temperature !== null && (
            <div className="space-y-2 animate-in zoom-in duration-150">
              <span className="text-slate-400 font-bold block text-xs uppercase">
                ТЕМПЕРАТУРА ТЕЛА:
              </span>
              <div
                className={`text-6xl font-black font-mono tracking-tight ${
                  temperature < 0 ? 'text-sky-400' : 'text-red-500'
                }`}
              >
                {temperature > 0 ? `+${temperature}` : temperature} °C
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleMeasure}
          disabled={measuring}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-black uppercase text-sm cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          {measuring ? 'ИЗМЕРЕНИЕ...' : 'ИЗМЕРИТЬ ТЕМПЕРАТУРУ'}
        </button>
      </div>
    </ToolWrapper>
  );
};
