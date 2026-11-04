import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Sparkles, Sun, Droplets, RefreshCw, Eye, Camera, VideoOff } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MirrorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [brightness, setBrightness] = useState(100);
  const [isFogged, setIsFogged] = useState(false);
  const [hasWiped, setHasWiped] = useState(false);
  const [frameType, setFrameType] = useState<'modern' | 'luxury' | 'frameless'>('modern');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraError(true);
        });
    } else {
      setCameraError(true);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleWipeMirror = () => {
    soundManager.playBeep(950, 0.08);
    setHasWiped(true);
    setIsFogged(false);
  };

  const handleToggleFog = () => {
    soundManager.playBeep(650, 0.06);
    setIsFogged(!isFogged);
    setHasWiped(false);
  };

  return (
    <ToolWrapper title="Зеркало (Интерактивное)" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Status bar */}
        <div className="w-full bg-[#0f121a] border border-[#222840] p-3 rounded-2xl flex items-center justify-between shadow-md mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8f9bff]" />
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              {cameraActive ? 'Камера в реальном времени' : 'Отражающая поверхность'}
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#8f9bff] bg-[#8f9bff]/15 px-2.5 py-0.5 rounded-full border border-[#8f9bff]/30">
            {cameraActive ? 'Видеопоток ON' : 'HD Режим'}
          </span>
        </div>

        {/* Mirror Frame Viewport */}
        <div
          className={`relative aspect-[9/15] min-h-[440px] md:min-h-[490px] w-full max-w-[330px] md:max-w-[360px] my-auto overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center transition-all ${
            frameType === 'modern'
              ? 'rounded-[38px] border-[10px] border-[#1e1e1e] ring-2 ring-[#8f9bff]/30'
              : frameType === 'luxury'
              ? 'rounded-[46px] border-[14px] border-[#997733] shadow-[0_0_40px_rgba(255,215,0,0.2)] ring-2 ring-[#ffe066]'
              : 'rounded-2xl border-2 border-white/20'
          }`}
        >
          {/* Live Video or Silver Mirror Surface */}
          <div
            className="w-full h-full relative flex items-center justify-center transition-all duration-300 bg-gradient-to-tr from-slate-900 via-zinc-800 to-slate-900"
            style={{
              filter: `brightness(${brightness}%) contrast(105%)`,
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${cameraActive ? 'block' : 'hidden'}`}
            />

            {!cameraActive && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-800 via-slate-700 to-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mb-3 shadow-2xl backdrop-blur-sm bg-white/5">
                  <Camera className="w-10 h-10 text-white/70" />
                </div>
                <h4 className="text-white font-extrabold text-sm mb-1 uppercase tracking-wider">Чистое зеркало</h4>
                <p className="text-xs text-gray-400 max-w-[200px]">
                  Предоставьте доступ к веб-камере или используйте интерактивную подсветку
                </p>
              </div>
            )}
          </div>

          {/* Fog overlay if activated */}
          {isFogged && (
            <div
              onClick={handleWipeMirror}
              className="absolute inset-0 bg-white/60 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center p-4 z-20 text-center animate-in fade-in"
            >
              <Droplets className="w-10 h-10 text-cyan-700 animate-bounce mb-2" />
              <span className="text-xs font-black text-slate-800 uppercase bg-white/80 px-3 py-1.5 rounded-xl shadow">
                Зеркало запотело! Нажмите, чтобы протереть
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full bg-[#0f121a] border border-[#222840] p-4 rounded-2xl space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> Подсветка зеркала
            </span>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="accent-[#8f9bff] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#222840]">
            <button
              onClick={handleToggleFog}
              className="flex-1 py-2 bg-[#171b27] hover:bg-[#1e2232] border border-[#222840] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              {isFogged ? 'Очистить пар' : 'Запотеть'}
            </button>

            <button
              onClick={() => {
                soundManager.playRock();
                setFrameType((f) => (f === 'modern' ? 'luxury' : f === 'luxury' ? 'frameless' : 'modern'));
              }}
              className="flex-1 py-2 bg-[#222840] hover:bg-[#8f9bff] text-[#8f9bff] hover:text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer"
            >
              Рамка: {frameType === 'modern' ? 'Модерн' : frameType === 'luxury' ? 'Золото' : 'Без рамки'}
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
