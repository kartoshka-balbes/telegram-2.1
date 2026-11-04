import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Wind } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const FanTool: React.FC<ToolProps> = ({ onClose }) => {
  const [speed, setSpeed] = useState<number>(0);

  const handleSetSpeed = (s: number) => {
    setSpeed(s);
    soundManager.playBeep(300 + s * 100, 0.15);
  };

  const getAnimDuration = () => {
    if (speed === 1) return '2.5s';
    if (speed === 2) return '1.8s';
    if (speed === 3) return '1.2s';
    if (speed === 4) return '0.8s';
    if (speed === 5) return '0.5s';
    if (speed === 6) return '0.3s';
    if (speed === 7) return '0.18s';
    if (speed === 8) return '0.1s';
    if (speed === 9) return '0.05s';
    if (speed === 10) return '0.02s';
    return '0s';
  };

  // Screen Shake Intensity Class based on speed level (0 to 10)
  const getShakeStyle = () => {
    if (speed === 0) return {};
    const intensity = speed * 1.2;
    return {
      animation: `fanShake 0.1s infinite ease-in-out`,
      transform: `translate(${Math.random() * intensity - intensity / 2}px, ${Math.random() * intensity - intensity / 2}px)`,
    };
  };

  return (
    <ToolWrapper title="Вентилятор" onClose={onClose}>
      <style>{`
        @keyframes fanShake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          20% { transform: translate(-1px, -2px) rotate(-0.5deg); }
          40% { transform: translate(-2px, 0px) rotate(0.5deg); }
          60% { transform: translate(2px, 1px) rotate(0deg); }
          80% { transform: translate(1px, -1px) rotate(0.5deg); }
          100% { transform: translate(-1px, 2px) rotate(-0.5deg); }
        }
      `}</style>

      <div
        style={speed > 0 ? getShakeStyle() : {}}
        className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-4 text-center select-none"
      >
        {/* Fan Body Design */}
        <div className="relative w-64 h-64 bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-slate-700 rounded-3xl flex flex-col items-center justify-between p-4 shadow-2xl overflow-hidden my-auto">
          {/* Top Brand & Status LED */}
          <div className="w-full flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              ВЕНТИЛЯТОР V-1000
            </span>
            <div className={`w-3 h-3 rounded-full border border-white ${speed > 0 ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700'}`} />
          </div>

          {/* Protective Fan Grill */}
          <div className="relative w-44 h-44 border-4 border-slate-700 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300">
            {/* Rotating Fan Blades */}
            <div
              className="w-36 h-36 relative flex items-center justify-center transition-all z-10"
              style={{
                animation: speed > 0 ? `spin ${getAnimDuration()} linear infinite` : 'none',
              }}
            >
              <div className="w-9 h-32 bg-slate-700 rounded-full absolute rotate-0 opacity-80" />
              <div className="w-9 h-32 bg-slate-700 rounded-full absolute rotate-60 opacity-80" />
              <div className="w-9 h-32 bg-slate-700 rounded-full absolute rotate-120 opacity-80" />
              <div className="w-9 h-9 bg-cyan-400 rounded-full z-10 border-2 border-white shadow-lg flex items-center justify-center">
                <Wind className="w-5 h-5 text-black" />
              </div>
            </div>

            {/* Outer Safety Metal Grill Lines */}
            <div className="absolute inset-0 border-2 border-dashed border-slate-600/40 rounded-full pointer-events-none z-20" />
          </div>
        </div>

        {/* Speed Controls Grid */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mt-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex justify-between items-center">
            <span>Мощность обдува (0-10):</span>
            <span className="text-[#8f9bff] font-mono font-black">{speed > 0 ? `Уровень ${speed}` : 'Выключено'}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleSetSpeed(lvl)}
                className={`py-2.5 rounded-xl font-black text-xs uppercase transition-all cursor-pointer ${
                  speed === lvl
                    ? 'bg-cyan-500 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl === 0 ? 'Выкл' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
