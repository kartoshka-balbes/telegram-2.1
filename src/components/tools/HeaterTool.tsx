import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Flame, Wind, Power } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const HeaterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [mode, setMode] = useState(0); // 0 to 10
  const [fanActive, setFanActive] = useState(true);

  const handleModeChange = (newMode: number) => {
    soundManager.playBeep(400 + newMode * 100, 0.1);
    setMode(newMode);
    if (newMode >= 8) {
      soundManager.playExplosion();
    }
  };

  const getShakeStyle = () => {
    if (mode === 0) return {};
    const intensity = mode * 0.8;
    return {
      animation: `heaterShake 0.1s infinite ease-in-out`,
      transform: `translate(${Math.random() * intensity - intensity / 2}px, ${Math.random() * intensity - intensity / 2}px)`,
    };
  };

  return (
    <ToolWrapper title="Обогреватель" onClose={onClose}>
      <style>{`
        @keyframes heaterShake {
          0% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          100% { transform: translate(1px, 0px); }
        }
        @keyframes fanSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes heatPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>

      <div
        style={mode > 0 ? getShakeStyle() : {}}
        className="relative flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-4 overflow-hidden select-none"
      >
        {/* Fire heat overlay when mode > 6 */}
        {mode > 6 && (
          <div
            className="absolute inset-0 bg-red-600/30 pointer-events-none z-10 animate-pulse transition-opacity duration-300"
            style={{
              opacity: (mode - 5) * 0.2,
            }}
          />
        )}

        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 w-full shadow-2xl flex flex-col items-center gap-5 relative z-20">
          
          {/* Fan Heater Ceramic Body Display */}
          <div className={`relative w-56 h-56 border-4 rounded-3xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
            mode > 0 ? 'border-amber-500 bg-amber-950/50 shadow-[0_0_35px_rgba(245,158,11,0.5)]' : 'border-slate-800 bg-slate-950'
          }`}>
            {mode === 0 ? (
              <div className="flex flex-col items-center gap-2 text-slate-600">
                <Power className="w-10 h-10" />
                <span className="font-bold uppercase text-xs">Выключено</span>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
                {/* Authentic Vector Heating Coils and Shimmering Plasma */}
                <div className="absolute inset-0 z-10 overflow-hidden rounded-2xl flex items-center justify-center pointer-events-none">
                  {/* Glowing background heat radial gradient */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, rgba(255, ${Math.max(40, 180 - mode * 14)}, 0, ${Math.min(0.95, 0.3 + mode * 0.07)}) 0%, rgba(200, 30, 0, ${Math.min(0.8, mode * 0.08)}) 60%, transparent 100%)`,
                      filter: `blur(${Math.max(2, 10 - mode)}px)`,
                    }}
                  />

                  {/* Radiator Grill & Tungsten Spirals SVG */}
                  <svg className="w-full h-full p-4 relative z-10" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#1e2232" strokeWidth="3" />
                    {/* Glowing Heat Coils */}
                    {[16, 26, 36].map((r, idx) => (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r={r}
                        fill="none"
                        stroke={mode >= 7 ? '#ff2200' : mode >= 4 ? '#ff6600' : '#ffaa00'}
                        strokeWidth="3.5"
                        strokeDasharray="6 3"
                        style={{
                          filter: `drop-shadow(0 0 ${mode * 1.5}px ${mode >= 7 ? '#ff0000' : '#ff8800'})`,
                          opacity: 0.6 + mode * 0.04,
                        }}
                      />
                    ))}

                    {/* Ceramic Honeycomb Mesh */}
                    <g opacity={0.35 + mode * 0.05} stroke="#ffcc00" strokeWidth="0.8">
                      <line x1="20" y1="50" x2="80" y2="50" />
                      <line x1="50" y1="20" x2="50" y2="80" />
                      <line x1="28" y1="28" x2="72" y2="72" />
                      <line x1="28" y1="72" x2="72" y2="28" />
                    </g>
                  </svg>
                </div>

                <div className="relative z-20 flex flex-col items-center gap-1.5 drop-shadow-md">
                  <Flame
                    className="w-12 h-12 transition-all duration-300 animate-bounce"
                    style={{
                      color: mode > 7 ? '#ef4444' : mode > 4 ? '#f97316' : '#f59e0b',
                      filter: `drop-shadow(0 0 ${mode * 3}px ${mode > 7 ? '#ef4444' : '#f59e0b'})`,
                    }}
                  />
                  <span className="text-3xl font-black text-white font-mono tracking-wider drop-shadow-lg">
                    {mode * 25 + 20}°C
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                    {mode < 4 ? 'Слабый нагрев' : mode < 8 ? 'Интенсивный обдув' : 'КРИТИЧЕСКИЙ ЖАР'}
                  </span>
                </div>

                {fanActive && (
                  <div
                    className="absolute inset-4 border border-dashed border-amber-400/20 rounded-full pointer-events-none"
                    style={{
                      animation: `fanSpin ${Math.max(0.1, 1.2 - mode * 0.1)}s linear infinite`,
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Temperature & Power Mode Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>Мощность спиралей:</span>
              <span className="text-amber-400 font-mono text-sm">{mode} / 10</span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              value={mode}
              onChange={(e) => handleModeChange(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (ВЫКЛ)</span>
              <span>5 (НОРМА)</span>
              <span className="text-red-500 font-bold">10 (ПЕРЕГРЕВ)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2 w-full">
            {[0, 3, 7, 10].map((val) => (
              <button
                key={val}
                onClick={() => handleModeChange(val)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  mode === val
                    ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {val === 0 ? 'Выкл' : `${val * 10}%`}
              </button>
            ))}
          </div>

          {/* Fan Toggle */}
          <div className="flex items-center justify-between w-full pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Wind className={`w-4 h-4 ${fanActive ? 'text-amber-400 animate-spin' : 'text-slate-600'}`} />
              <span className="text-xs font-bold text-slate-300">Вентилятор обдува</span>
            </div>
            <button
              onClick={() => {
                soundManager.playBeep(600, 0.05);
                setFanActive(!fanActive);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fanActive ? 'bg-amber-500 text-black font-black' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {fanActive ? 'ВКЛ' : 'ВЫКЛ'}
            </button>
          </div>
        </div>

        {/* Warning Badge at Max Temperature */}
        {mode >= 9 && (
          <div className="mt-4 p-3 bg-red-950/80 border border-red-600 rounded-2xl text-red-300 text-xs text-center font-bold animate-pulse max-w-sm w-full">
            ⚠️ ВНИМАНИЕ: СРАБОТАЛА ТЕРМОЗАЩИТА! КОРПУС НАГРЕЛСЯ ДО ПРЕДЕЛЬНОЙ ТЕМПЕРАТУРЫ!
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
