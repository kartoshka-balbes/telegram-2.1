import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Clock, FastForward, Rewind, RotateCcw, Zap } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
  yearOffset: number;
  onSetYearOffset: (offset: number) => void;
}

export const TimeMachineTool: React.FC<ToolProps> = ({ onClose, yearOffset, onSetYearOffset }) => {
  const [isWarping, setIsWarping] = useState(false);
  const [warpDirection, setWarpDirection] = useState<'future' | 'past' | 'reset'>('reset');

  const currentYear = new Date().getFullYear() + yearOffset;

  const triggerWarp = (direction: 'future' | 'past' | 'reset', newOffset: number) => {
    setIsWarping(true);
    setWarpDirection(direction);
    soundManager.playBeep(direction === 'future' ? 1400 : 400, 0.25);
    soundManager.playExplosion();

    setTimeout(() => {
      onSetYearOffset(newOffset);
      setIsWarping(false);
    }, 1200);
  };

  const handleTravelFuture = () => triggerWarp('future', yearOffset + 150);
  const handleTravelPast = () => triggerWarp('past', yearOffset - 150);
  const handleResetNow = () => triggerWarp('reset', 0);

  return (
    <ToolWrapper title="Машина времени" onClose={onClose}>
      <div className="relative max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        {/* Time Warp Tunnel Overlay */}
        {isWarping && (
          <div className="absolute inset-0 bg-cyan-950/90 z-40 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <div className="w-48 h-48 border-8 border-cyan-400 border-t-amber-400 rounded-full animate-spin flex items-center justify-center">
              <Zap className="w-20 h-20 text-amber-300 animate-bounce" />
            </div>
            <p className="text-xl font-black font-mono text-cyan-300 mt-6 tracking-widest uppercase animate-pulse">
              {warpDirection === 'future' ? 'ПЕРЕМЕЩЕНИЕ В БУДУЩЕЕ...' : warpDirection === 'past' ? 'ПЕРЕМЕЩЕНИЕ В ПРОШЛОЕ...' : 'ВОЗВРАТ В НАСТОЯЩЕЕ...'}
            </p>
          </div>
        )}

        <div className="bg-white/[0.05] backdrop-blur-xl border border-amber-500/50 rounded-none p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <div className="relative">
            <Clock className={`w-20 h-20 text-amber-400 ${isWarping ? 'animate-spin text-cyan-400 scale-125' : 'animate-spin'}`} style={{ animationDuration: isWarping ? '0.5s' : '8s' }} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Текущий системный год:
            </span>
            <div className="text-5xl font-black font-mono text-amber-300 tracking-wider">
              {currentYear}
            </div>
            {yearOffset !== 0 && (
              <span className="text-xs text-amber-400 font-bold block">
                Смещение: {yearOffset > 0 ? `+${yearOffset}` : yearOffset} лет
              </span>
            )}
          </div>

          {/* Time Slider */}
          <div className="w-full flex flex-col gap-2 my-2 bg-black/30 p-4 border border-white/10 rounded-2xl">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
              <span>1026 г.</span>
              <span className="text-amber-400 font-black">Ползунок времени</span>
              <span>3026 г.</span>
            </div>
            <input
              type="range"
              min="-1000"
              max="1000"
              step="1"
              value={yearOffset}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onSetYearOffset(val);
                soundManager.playBeep(800 + val / 2, 0.02);
              }}
              disabled={isWarping}
              className="w-full h-2 bg-white/[0.08] rounded-2xl appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <button
              onClick={handleTravelPast}
              disabled={isWarping}
              className="py-4 bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-amber-300 font-black rounded-none flex flex-col items-center gap-1 cursor-pointer"
            >
              <Rewind className="w-6 h-6" />
              <span className="text-xs uppercase">В прошлое</span>
              <span className="text-[10px] text-slate-400 font-mono">-150 лет</span>
            </button>

            <button
              onClick={handleResetNow}
              disabled={isWarping}
              className="py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-none flex flex-col items-center gap-1 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-6 h-6" />
              <span className="text-xs uppercase">В сейчас</span>
              <span className="text-[10px] text-slate-900 font-mono">2026 год</span>
            </button>

            <button
              onClick={handleTravelFuture}
              disabled={isWarping}
              className="py-4 bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-cyan-400 font-black rounded-none flex flex-col items-center gap-1 cursor-pointer"
            >
              <FastForward className="w-6 h-6" />
              <span className="text-xs uppercase">В будущее</span>
              <span className="text-[10px] text-slate-400 font-mono">+150 лет</span>
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
