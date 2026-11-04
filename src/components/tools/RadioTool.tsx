import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Radio as RadioIcon, VolumeX, Volume2 } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const MIN = 87.5;
const MAX = 108.0;

export const RadioTool: React.FC<ToolProps> = ({ onClose }) => {
  const [freq, setFreq] = useState(101.5);
  const [volume, setVolume] = useState(80);

  const pos = ((freq - MIN) / (MAX - MIN)) * 100;

  return (
    <ToolWrapper title="Радио" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 gap-4">
        {/* Дисплей */}
        <div className="relative rounded-[2rem] p-6 overflow-hidden border border-white/10 bg-gradient-to-br from-[#2a1608] via-[#1a1020] to-[#0f1220] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-orange-500/25 blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between mb-5">
            <span className="flex items-center gap-2 text-[11px] font-semibold text-orange-200/80 uppercase tracking-widest">
              <RadioIcon className="w-4 h-4 animate-pulse" /> FM · Стерео
            </span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> {volume}%
            </span>
          </div>

          <div className="relative text-center">
            <div className="text-6xl sm:text-7xl font-extrabold tabular-nums text-white tracking-tight drop-shadow-[0_0_24px_rgba(251,146,60,0.45)]">
              {freq.toFixed(1)}
            </div>
            <div className="text-sm font-semibold text-orange-300 mt-1">МГц</div>
          </div>

          <div className="relative mt-5 flex items-center justify-center gap-2 text-rose-300 text-xs font-semibold bg-rose-500/10 px-3.5 py-2 rounded-full border border-rose-500/25 w-fit mx-auto">
            <VolumeX className="w-4 h-4" />
            <span>Сигнал не найден</span>
          </div>
        </div>

        {/* Шкала настройки */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Настройка частоты</div>

          <div className="relative h-10 mb-2">
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between h-full pointer-events-none">
              {Array.from({ length: 41 }).map((_, i) => (
                <span key={i} className={`w-px bg-white/25 ${i % 5 === 0 ? 'h-6 bg-white/50' : 'h-3'}`} />
              ))}
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)] rounded-full pointer-events-none"
              style={{ left: `${pos}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-3 tabular-nums">
            <span>88</span>
            <span>92</span>
            <span>96</span>
            <span>100</span>
            <span>104</span>
            <span>108</span>
          </div>

          <input
            type="range"
            min={MIN}
            max={MAX}
            step={0.1}
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="w-full accent-orange-400 cursor-pointer"
            aria-label="Частота"
          />
        </div>

        {/* Громкость (вертикальный ползунок сохранён) */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-orange-300 shrink-0" />
          <div className="flex-1 flex items-center justify-center h-24">
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
              className="h-full w-2 accent-orange-400 cursor-pointer appearance-none bg-white/[0.1] rounded-full"
              aria-label="Громкость"
            />
          </div>
          <span className="text-sm font-bold text-gray-300 tabular-nums w-10 text-right">{volume}%</span>
        </div>
      </div>
    </ToolWrapper>
  );
};
