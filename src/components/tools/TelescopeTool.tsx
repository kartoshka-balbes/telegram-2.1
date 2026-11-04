import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ZoomIn, ZoomOut, RefreshCw, Upload, Orbit } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const TelescopeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [customImg, setCustomImg] = useState<string | null>('/img/alien.jpg');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterMode, setFilterMode] = useState<'optical' | 'infrared' | 'ultraviolet'>('optical');

  const handleZoomIn = () => {
    soundManager.playBeep(1400, 0.09);
    setIsZoomed(true);
    setZoomLevel((prev) => Math.min(10, prev === 1 ? 2.0 : prev * 1.5));
  };

  const handleZoomOut = () => {
    soundManager.playBeep(900, 0.07);
    setZoomLevel((prev) => {
      const next = Math.max(1, prev / 1.5);
      if (next <= 1) {
        setIsZoomed(false);
      }
      return next;
    });
  };

  const handleReset = () => {
    soundManager.playBeep(600, 0.08);
    setIsZoomed(false);
    setZoomLevel(1);
    setCustomImg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setCustomImg(ev.target.result);
          setIsZoomed(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ToolWrapper title="Орбитальный Телескоп" onClose={onClose} headerColor="bg-[#090b14] border-[#1e293b]">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Orbital Status Bar */}
        <div className="w-full bg-[#0d111e] border border-[#1e293b] p-3 rounded-2xl flex items-center justify-between shadow-md mb-2">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-cyan-400 animate-spin" />
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-gray-200 uppercase tracking-wider block">
                {isZoomed ? 'Сектор: Наблюдение кратеров луны' : 'Обзор небосвода: Луна и звёзды'}
              </span>
              <span className="text-[9px] text-gray-400 font-mono">Координаты: 14h 29m • DEC -62° 40′</span>
            </div>
          </div>

          <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-xl border border-cyan-700/60 shadow">
            x{(zoomLevel * 500).toFixed(0)} КРАТ
          </span>
        </div>

        {/* Telescope Viewport Lens */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 bg-black border-4 border-slate-700 rounded-full overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.35)] flex items-center justify-center my-2 group ring-4 ring-cyan-500/20">
          
          {/* Space Image / Authentic Deep-Space SVG */}
          <div
            className="w-full h-full relative flex items-center justify-center transition-all duration-500 ease-out"
            style={{
              transform: `scale(${isZoomed ? zoomLevel : 1.02})`,
              filter:
                filterMode === 'infrared'
                  ? 'hue-rotate(180deg) saturate(200%) contrast(120%)'
                  : filterMode === 'ultraviolet'
                  ? 'hue-rotate(90deg) brightness(110%) contrast(130%)'
                  : 'none',
            }}
          >
            {customImg ? (
              <img
                src={customImg}
                alt="Астроснимок пользователя"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-[#030611] relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <radialGradient id="nebulaGlow" cx="60%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#02040a" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="moonShading" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#f3f4f6" />
                      <stop offset="60%" stopColor="#9ca3af" />
                      <stop offset="100%" stopColor="#1f2937" />
                    </radialGradient>
                  </defs>

                  {/* Deep Cosmic Background */}
                  <rect width="200" height="200" fill="url(#nebulaGlow)" />

                  {/* Stars Field */}
                  {[
                    [15, 25, 1], [30, 80, 1.2], [50, 15, 0.8], [75, 45, 1.5],
                    [120, 20, 1], [160, 35, 1.3], [180, 70, 0.7], [170, 130, 1.1],
                    [140, 175, 0.9], [85, 180, 1.4], [35, 160, 1], [15, 120, 0.8]
                  ].map(([x, y, r], idx) => (
                    <circle key={idx} cx={x} cy={y} r={r} fill="#ffffff" opacity={0.7 + (idx % 3) * 0.15} />
                  ))}

                  {/* Constellation line */}
                  <polyline
                    points="30,80 75,45 120,20 160,35"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    opacity="0.4"
                  />

                  {/* High Detail Moon Globe */}
                  <g transform="translate(100, 100)">
                    <circle cx="0" cy="0" r="42" fill="url(#moonShading)" stroke="#94a3b8" strokeWidth="0.5" />
                    {/* Moon Craters */}
                    <circle cx="-14" cy="-12" r="8" fill="#64748b" opacity="0.6" stroke="#475569" strokeWidth="0.5" />
                    <circle cx="-16" cy="-14" r="2.5" fill="#334155" opacity="0.8" />

                    <circle cx="12" cy="15" r="11" fill="#64748b" opacity="0.55" stroke="#475569" strokeWidth="0.5" />
                    <circle cx="10" cy="13" r="3.5" fill="#334155" opacity="0.75" />

                    <circle cx="16" cy="-18" r="6" fill="#64748b" opacity="0.5" />
                    <circle cx="-20" cy="18" r="7" fill="#64748b" opacity="0.5" />
                    <circle cx="-2" cy="6" r="4" fill="#64748b" opacity="0.4" />
                    <circle cx="-8" cy="-28" r="5" fill="#64748b" opacity="0.45" />

                    {/* Mare Serenitatis shadow arc */}
                    <path
                      d="M -10 -25 Q 15 -10 25 10 Q 5 20 -15 0 Z"
                      fill="#475569"
                      opacity="0.25"
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>

          {/* Reticle HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[14px] border-slate-900/60 rounded-full">
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-full h-[1px] bg-cyan-400" />
              <div className="h-full w-[1px] bg-cyan-400 absolute" />
              <div className="w-32 h-32 rounded-full border border-cyan-400/60 absolute" />
              <div className="w-56 h-56 rounded-full border border-dashed border-cyan-400/40 absolute" />
            </div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300 font-bold bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              {filterMode.toUpperCase()} FILTER
            </div>
          </div>
        </div>

        {/* Spectral Filter Selector */}
        <div className="w-full grid grid-cols-3 gap-2 my-2">
          {(['optical', 'infrared', 'ultraviolet'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                soundManager.playBeep(1100, 0.05);
                setFilterMode(mode);
              }}
              className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                filterMode === mode
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {mode === 'optical' ? 'Оптика' : mode === 'infrared' ? 'Инфракрасный' : 'УФ-Спектр'}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 w-full mt-1">
          <button
            onClick={handleZoomOut}
            disabled={!isZoomed && zoomLevel <= 1}
            className="py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 uppercase border border-slate-800 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <ZoomOut className="w-4 h-4 text-cyan-400" />
            <span>Отдалить</span>
          </button>

          <button
            onClick={handleZoomIn}
            className="py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Приблизить</span>
          </button>
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between w-full mt-2 px-1 text-[11px] text-slate-400">
          <label className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Загрузить астроснимок</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {(isZoomed || customImg) && (
            <button
              onClick={handleReset}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Сброс</span>
            </button>
          )}
        </div>

      </div>
    </ToolWrapper>
  );
};
