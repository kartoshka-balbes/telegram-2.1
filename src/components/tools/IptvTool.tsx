import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Tv } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const CHANNELS = [
  'Первый канал',
  'Россия 1',
  'НТВ',
  'СТС',
  'ТНТ',
  'Пятница!',
  'РЕН ТВ',
  'МУЗ-ТВ',
  'Карусель',
  'Матч ТВ',
  'Че',
  'Домашний',
  '2x2',
];

export const IptvTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isStaticNoise, setIsStaticNoise] = useState<boolean>(false);

  const handleSelectChannel = (ch: string) => {
    setSelectedChannel(ch);
    setIsStaticNoise(true);
    setTimeout(() => {
      setIsStaticNoise(false);
    }, 1000);
  };

  return (
    <ToolWrapper title="IPTV Плеер" onClose={onClose}>
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-6 py-2">
        {/* Video Player Box */}
        <div className="w-full aspect-video bg-black rounded-3xl border-2 border-slate-800 flex flex-col items-center justify-center text-center p-6 shadow-2xl relative overflow-hidden">
          {isStaticNoise ? (
            /* 1-second static noise animation */
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:6px_6px] animate-pulse opacity-80" />
              <div className="text-white font-mono font-black text-xl z-10 bg-black/60 px-4 py-2 rounded-xl border border-white/20">
                ПОМЕХИ СИГНАЛА...
              </div>
            </div>
          ) : !selectedChannel ? (
            /* Initial state */
            <>
              <Tv className="w-16 h-16 text-slate-700 mb-4" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
                Выберите канал
              </h2>
            </>
          ) : (
            /* After selecting channel and noise finishes */
            <>
              <Tv className="w-16 h-16 text-slate-700 mb-4 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
                Подключите антенну
              </h2>
              <span className="text-xs text-cyan-400 font-mono mt-2">
                Канал: {selectedChannel}
              </span>
            </>
          )}
        </div>

        {/* Channel Selection Grid */}
        <div className="flex-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Список ТВ Каналов:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CHANNELS.map((ch) => (
              <button
                key={ch}
                onClick={() => handleSelectChannel(ch)}
                className={`p-3 rounded-2xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-between ${
                  selectedChannel === ch
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="truncate">{ch}</span>
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
