import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Power, Wind, Droplets, Thermometer, Flame, Snowflake, Gauge, Activity } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const AirConditionerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isOn, setIsOn] = useState(true);
  const [targetTemp, setTargetTemp] = useState(20);
  const [humidity, setHumidity] = useState(48);
  const [fanSpeed, setFanSpeed] = useState<'Low' | 'Med' | 'High' | 'Turbo'>('Med');
  const [mode, setMode] = useState<'Cool' | 'Heat' | 'Dry' | 'Fan'>('Cool');
  const [swingActive, setSwingActive] = useState(true);

  const togglePower = () => {
    soundManager.playBeep(isOn ? 350 : 1300, 0.12);
    setIsOn(!isOn);
  };

  // Speed multiplier for animations
  const speedDurations = {
    Low: '2.5s',
    Med: '1.4s',
    High: '0.8s',
    Turbo: '0.4s',
  };

  const getTempTheme = () => {
    if (targetTemp <= 19) return { color: 'text-sky-400', bg: 'bg-sky-500', glow: 'shadow-[0_0_20px_rgba(56,189,248,0.4)]', modeName: 'Ледяной холод' };
    if (targetTemp <= 23) return { color: 'text-cyan-300', bg: 'bg-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]', modeName: 'Комфортная прохлада' };
    if (targetTemp <= 26) return { color: 'text-emerald-400', bg: 'bg-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]', modeName: 'Нейтральный климат' };
    return { color: 'text-amber-400', bg: 'bg-amber-500', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]', modeName: 'Интенсивный обогрев' };
  };

  const theme = getTempTheme();

  return (
    <ToolWrapper title="Кондиционер" onClose={onClose} headerColor="bg-[#0b1626] border-sky-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        
        {/* ========================================================================= */}
        {/* LIVE REALISTIC WALL AC UNIT INTERFACE */}
        {/* ========================================================================= */}
        <div className="p-4 bg-gradient-to-b from-slate-900 via-[#0d1726] to-slate-950 border-2 border-sky-500/40 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Split Unit Casing */}
          <div className="w-full bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-slate-700 rounded-2xl p-4 shadow-xl relative">
            
            {/* Top Vent Grille */}
            <div className="flex justify-between items-center mb-2 px-2">
              <div className="flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-4 h-1 bg-slate-700 rounded-full opacity-60" />
                ))}
              </div>
              <span className="text-[9px] font-sans font-bold tracking-widest text-slate-400 uppercase">
                CLIMA•PRO INVERTER
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
                <span className="text-[9px] text-slate-400">{isOn ? 'ECO' : 'OFF'}</span>
              </div>
            </div>

            {/* Split Faceplate with Integrated Glow LED Display */}
            <div className="flex items-center justify-between bg-black/80 border border-slate-700/80 rounded-xl px-4 py-2.5 my-1">
              <div className="flex items-center gap-2">
                {mode === 'Cool' ? (
                  <Snowflake className={`w-4 h-4 ${isOn ? 'text-sky-400 animate-spin' : 'text-slate-600'}`} />
                ) : (
                  <Flame className={`w-4 h-4 ${isOn ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
                )}
                <span className="text-[10px] font-black uppercase text-slate-300">
                  {isOn ? theme.modeName : 'ВЫКЛЮЧЕН'}
                </span>
              </div>

              {/* Digital LED 7-Segment style readout */}
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black font-mono tracking-tight ${isOn ? theme.color : 'text-slate-700'}`}>
                  {isOn ? targetTemp : '--'}
                </span>
                <span className={`text-xs font-black ${isOn ? theme.color : 'text-slate-700'}`}>°C</span>
              </div>
            </div>

            {/* Bottom Air Outlet Louver (Flap that opens when ON and swings) */}
            <div className="mt-3 relative h-10 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-end p-1">
              {isOn ? (
                <>
                  {/* Active Louver Flap Angle */}
                  <div
                    className={`h-2.5 rounded-lg transition-all duration-700 border ${theme.bg} ${
                      swingActive ? 'animate-pulse' : ''
                    }`}
                    style={{
                      transform: swingActive ? 'scaleY(1.2)' : 'scaleY(0.9)',
                    }}
                  />
                  {/* Air Stream Particles */}
                  <div className="absolute inset-0 flex justify-around items-center pointer-events-none opacity-80">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-6 rounded-full ${theme.bg} opacity-75 blur-[1px] animate-bounce`}
                        style={{
                          animationDuration: speedDurations[fanSpeed],
                          animationDelay: `${i * 0.12}s`,
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-1.5 bg-slate-700 rounded-md opacity-40 mx-auto w-full text-center" />
              )}
            </div>

          </div>

          {/* Quick Metrics Bar below Unit */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Поток:</span>
              <span className="font-black text-sky-300">{isOn ? fanSpeed : '--'}</span>
            </div>
            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Влажность:</span>
              <span className="font-black text-cyan-300">{isOn ? `${humidity}%` : '--'}</span>
            </div>
            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Свинг-заслонка:</span>
              <span className="font-black text-emerald-400">{isOn ? (swingActive ? 'АВТО' : 'ФИКС') : '--'}</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE CONTROLS */}
        {/* ========================================================================= */}

        {/* Master Power & Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePower}
            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
              isOn
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOn ? 'Выключить сплит' : 'Включить кондиционер'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(900, 0.05);
              setSwingActive(!swingActive);
            }}
            disabled={!isOn}
            className={`px-4 py-3 rounded-2xl border font-bold text-xs cursor-pointer transition-all disabled:opacity-40 ${
              swingActive && isOn
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Swing ↕
          </button>
        </div>

        {/* Temperature Slider */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Thermometer className="w-4 h-4" /> Заданная температура:
            </span>
            <span className="text-white text-sm font-black font-mono">{targetTemp}°C</span>
          </div>
          <input
            type="range"
            min={16}
            max={30}
            value={targetTemp}
            disabled={!isOn}
            onChange={(e) => {
              soundManager.playBeep(950, 0.04);
              setTargetTemp(parseInt(e.target.value, 10));
            }}
            className="w-full accent-sky-400 cursor-pointer disabled:opacity-40"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-bold">
            <span>16°C (Холод)</span>
            <span>22°C (Норма)</span>
            <span>30°C (Тепло)</span>
          </div>
        </div>

        {/* Humidity Slider */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Droplets className="w-4 h-4" /> Влажность воздуха:
            </span>
            <span className="text-white text-sm font-black font-mono">{humidity}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            value={humidity}
            disabled={!isOn}
            onChange={(e) => {
              soundManager.playBeep(850, 0.04);
              setHumidity(parseInt(e.target.value, 10));
            }}
            className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
          />
        </div>

        {/* Fan Speed Buttons */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
            Скорость обдува:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {(['Low', 'Med', 'High', 'Turbo'] as const).map((s) => (
              <button
                key={s}
                disabled={!isOn}
                onClick={() => {
                  soundManager.playBeep(1100, 0.04);
                  setFanSpeed(s);
                }}
                className={`py-2 rounded-xl font-bold text-xs cursor-pointer border transition-all ${
                  fanSpeed === s && isOn
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-lg shadow-sky-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 disabled:opacity-40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
};
