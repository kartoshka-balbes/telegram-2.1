import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';

interface ToolProps {
  onClose: () => void;
}

type ColorMode = 'white' | 'red' | 'blue' | 'yellow' | 'purple' | 'green' | 'brown' | 'epilepsy';

const COLOR_VALUES: Record<ColorMode, string> = {
  white: '#ffffff',
  red: '#ff0000',
  blue: '#0066ff',
  yellow: '#ffee00',
  purple: '#a000ff',
  green: '#00ff44',
  brown: '#8b4513',
  epilepsy: '#ff0055',
};

const EPILEPSY_COLORS = ['#ff0000', '#8f9bff', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

export const FlashlightTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isOn, setIsOn] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorMode>('red');
  const [currentEpilepsyIdx, setCurrentEpilepsyIdx] = useState(0);

  useEffect(() => {
    if (selectedColor === 'epilepsy' && isOn) {
      const interval = setInterval(() => {
        setCurrentEpilepsyIdx((prev) => (prev + 1) % EPILEPSY_COLORS.length);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [selectedColor, isOn]);

  const activeBgColor =
    selectedColor === 'epilepsy'
      ? EPILEPSY_COLORS[currentEpilepsyIdx]
      : COLOR_VALUES[selectedColor];

  return (
    <ToolWrapper title="Фонарик" onClose={onClose}>
      {/* Fullscreen light overlay when ON */}
      {isOn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-colors duration-300"
          style={{ backgroundColor: activeBgColor }}
        >
          <button
            onClick={() => setIsOn(false)}
            className="px-8 py-4 bg-slate-900/90 text-white font-black text-2xl rounded-2xl border-4 border-white shadow-2xl hover:scale-105 active:scale-95 transition-transform uppercase cursor-pointer"
          >
            ВЫКЛ
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full py-6">
        {/* Big Glow Circle */}
        <div className="relative mb-8 flex items-center justify-center">
          <div
            className={`w-44 h-44 rounded-full border-4 border-red-500 flex items-center justify-center shadow-2xl transition-all duration-300 ${
              isOn ? 'scale-110 shadow-red-500/80 animate-pulse' : 'opacity-80'
            }`}
            style={{
              backgroundColor: COLOR_VALUES[selectedColor],
              boxShadow: isOn ? `0 0 60px ${COLOR_VALUES[selectedColor]}` : 'none',
            }}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOn(!isOn)}
          className={`w-full py-4 rounded-2xl font-black text-xl uppercase tracking-wider shadow-xl transition-all mb-10 cursor-pointer ${
            isOn
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/50'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/50'
          }`}
        >
          {isOn ? 'ВЫКЛ' : 'ВКЛЮЧИТЬ'}
        </button>

        {/* Small Color Selector Circles */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Выберите цвет луча:
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(
              [
                { id: 'white', label: 'Белый', color: '#ffffff' },
                { id: 'red', label: 'Красный', color: '#ff0000' },
                { id: 'blue', label: 'Синий', color: '#0066ff' },
                { id: 'yellow', label: 'Жёлтый', color: '#ffee00' },
                { id: 'purple', label: 'Фиолетовый', color: '#a000ff' },
                { id: 'green', label: 'Зелёный', color: '#00ff44' },
                { id: 'brown', label: 'Коричневый', color: '#8b4513' },
                { id: 'epilepsy', label: 'Эпилепсия', color: 'rainbow' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedColor(item.id)}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  selectedColor === item.id
                    ? 'border-cyan-400 bg-slate-800 scale-105 shadow-md'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border border-slate-700 shadow-inner"
                  style={{
                    background:
                      item.color === 'rainbow'
                        ? 'linear-gradient(45deg, red, yellow, green, cyan, blue, magenta)'
                        : item.color,
                  }}
                />
                <span className="text-[10px] text-slate-300 font-semibold truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
