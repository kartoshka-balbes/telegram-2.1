import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ZoomIn, ZoomOut, Focus, RefreshCw, Upload } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MicroscopeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [customImg, setCustomImg] = useState<string | null>('/img/virus.jpg');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusClarity, setFocusClarity] = useState(0); // 0 = blurry, 100 = crystal sharp
  const [lightIntensity, setLightIntensity] = useState(90);

  const handleZoomInClick = () => {
    soundManager.playBeep(1200, 0.08);
    setIsZoomed(true);
    setZoomLevel((prev) => Math.min(10, prev === 1 ? 2.5 : prev * 1.5));
    setFocusClarity(100);
  };

  const handleZoomOutClick = () => {
    soundManager.playBeep(800, 0.06);
    setZoomLevel((prev) => {
      const next = Math.max(1, prev / 1.5);
      if (next <= 1) {
        setIsZoomed(false);
        setFocusClarity(0);
      }
      return next;
    });
  };

  const handleReset = () => {
    soundManager.playBeep(500, 0.08);
    setIsZoomed(false);
    setZoomLevel(1);
    setFocusClarity(0);
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
          setFocusClarity(100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // When not zoomed, image is blurred (5px). When zoomed, blur is 0px (or controlled by slider).
  const blurAmount = isZoomed ? Math.max(0, (100 - focusClarity) / 10) : 5;

  return (
    <ToolWrapper title="Электронный Микроскоп" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Status Bar */}
        <div className="w-full bg-[#0f121a] border border-[#222840] p-3 rounded-2xl flex items-center justify-between shadow-md mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isZoomed ? 'bg-[#8f9bff] animate-ping' : 'bg-amber-400'}`} />
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              {isZoomed ? 'Фокус: 100% Чёткость' : 'Линза: Исходный биопрепарат (размыто)'}
            </span>
          </div>

          <span className="text-xs font-mono font-black text-[#8f9bff] bg-[#8f9bff]/15 px-2.5 py-1 rounded-xl border border-[#8f9bff]/40">
            x{(zoomLevel * 100).toFixed(0)} КРАТ
          </span>
        </div>

        {/* Microscope Viewport Lens */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 bg-black border-4 border-[#222840] rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center justify-center my-2 group ring-4 ring-[#8f9bff]/20">
          
          {/* Specimen View (User Custom Upload or Authentic Microscopic Bio-Slide SVG) */}
          <div
            className="w-full h-full relative flex items-center justify-center transition-all duration-500 ease-out"
            style={{
              transform: `scale(${isZoomed ? zoomLevel : 1.05})`,
              filter: `blur(${blurAmount}px) brightness(${lightIntensity}%) contrast(108%)`,
            }}
          >
            {customImg ? (
              <img
                src={customImg}
                alt="Микропрепарат пользователя"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-[#0b0d12] relative flex items-center justify-center overflow-hidden">
                {/* Cellular Grid SVG */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <radialGradient id="cellGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#8f9bff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#14161f" stopOpacity="0.9" />
                    </radialGradient>
                    <pattern id="onionCells" width="40" height="24" patternUnits="userSpaceOnUse">
                      <rect width="40" height="24" fill="none" stroke="#8f9bff" strokeWidth="0.8" opacity="0.35" />
                      <circle cx="20" cy="12" r="3.5" fill="#b8c0ff" opacity="0.6" />
                      <circle cx="28" cy="8" r="1.5" fill="#70ff00" opacity="0.5" />
                      <circle cx="12" cy="16" r="1.2" fill="#70ff00" opacity="0.5" />
                    </pattern>
                  </defs>
                  
                  {/* Plant tissue mesh */}
                  <rect width="200" height="200" fill="url(#onionCells)" />

                  {/* Organelles and cell nucleus cluster in center */}
                  <circle cx="100" cy="100" r="32" fill="url(#cellGlow)" stroke="#8f9bff" strokeWidth="1.5" />
                  <circle cx="95" cy="98" r="9" fill="#8f9bff" opacity="0.85" />
                  <circle cx="97" cy="95" r="3" fill="#ffffff" opacity="0.9" />

                  {/* Mitochondria & Chloroplasts */}
                  {[
                    [65, 80], [135, 75], [120, 130], [70, 125], [105, 55], [60, 60], [140, 110]
                  ].map(([cx, cy], i) => (
                    <ellipse
                      key={i}
                      cx={cx}
                      cy={cy}
                      rx={6}
                      ry={3.5}
                      transform={`rotate(${i * 35} ${cx} ${cy})`}
                      fill="#b8c0ff"
                      opacity="0.75"
                      stroke="#8f9bff"
                      strokeWidth="0.8"
                    />
                  ))}
                </svg>
              </div>
            )}
          </div>

          {/* Initial blurred hint badge */}
          {!isZoomed && (
            <div className="absolute bottom-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/50 flex items-center gap-1.5 shadow-lg pointer-events-none z-20">
              <Focus className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Нажмите «Увеличить» для чёткости
              </span>
            </div>
          )}

          {/* Lens Glass Grid / Reticle */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-black/40 rounded-full">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-cyan-400" />
              <div className="h-full w-[1px] bg-cyan-400 absolute" />
              <div className="w-24 h-24 rounded-full border border-cyan-400 absolute" />
              <div className="w-48 h-48 rounded-full border border-dashed border-cyan-400/50 absolute" />
            </div>
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Top Magnification Badge */}
          <div className="absolute top-4 font-mono text-[10px] text-[#8f9bff] font-black bg-black/85 px-3 py-1 rounded-full border border-[#222840] shadow-md z-20">
            {isZoomed ? `HD МИКРОСКОП: ${(zoomLevel * 100).toFixed(0)}X` : 'ОБЪЕКТИВ (100X РАЗМЫТО)'}
          </div>
        </div>

        {/* Fine Adjustment Controls */}
        {isZoomed && (
          <div className="w-full bg-[#0f121a] border border-[#222840] p-3 rounded-2xl my-2 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-300">
              <span className="flex items-center gap-1"><Focus className="w-3.5 h-3.5 text-cyan-400" /> Чёткость фокусировки:</span>
              <span className="text-[#8f9bff] font-mono">{focusClarity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={focusClarity}
              onChange={(e) => setFocusClarity(Number(e.target.value))}
              className="w-full accent-[#8f9bff] cursor-pointer"
            />
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <button
            onClick={handleZoomOutClick}
            disabled={!isZoomed && zoomLevel <= 1}
            className="py-3.5 bg-[#171b27] hover:bg-[#212536] disabled:opacity-40 text-gray-200 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 uppercase border border-[#222840] transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <ZoomOut className="w-4 h-4 text-gray-400" />
            <span>Уменьшить</span>
          </button>

          <button
            onClick={handleZoomInClick}
            className="py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs rounded-2xl flex items-center justify-center gap-2 uppercase shadow-[0_0_20px_rgba(143,155,255,0.4)] transition-all active:scale-95 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Увеличить</span>
          </button>
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between w-full mt-2 px-1 text-[11px] text-gray-400">
          <label className="hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Загрузить препарат</span>
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
