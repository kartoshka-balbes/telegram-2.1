import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RotateCw, Smartphone } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const RotatePhoneTool: React.FC<ToolProps> = ({ onClose }) => {
  const [rotation, setRotation] = useState<number>(0);

  const handleRotate = () => {
    soundManager.playBeep(900, 0.08);
    setRotation((prev) => (prev + 90) % 360);
  };

  const isLandscape = rotation === 90 || rotation === 270;

  return (
    <ToolWrapper title="Поверните телефон" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 w-full h-full min-h-[75vh] flex flex-col items-center justify-between p-4 overflow-hidden bg-[#09090b] select-none font-sans">
        
        {/* Top Info Bar */}
        <div className="w-full max-w-sm bg-[#121216] border border-[#27272a] rounded-2xl p-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#8f9bff]" />
            <span className="text-xs font-bold text-gray-200">
              Ориентация: <span className="text-[#8f9bff]">{isLandscape ? 'Альбомная' : 'Портретная'} ({rotation}°)</span>
            </span>
          </div>

          <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            Датчик гироскопа
          </span>
        </div>

        {/* Interactive Rotating Vector Smartphone */}
        <div className="relative my-auto flex items-center justify-center p-6">
          <div
            onClick={handleRotate}
            className="cursor-pointer transition-transform duration-500 ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {/* Phone Body with Titanium Frame & Curved Corners */}
            <div className="w-48 h-84 sm:w-56 sm:h-96 bg-zinc-950 border-4 border-zinc-700 rounded-[44px] shadow-[0_0_50px_rgba(0,0,0,0.9)] p-2 relative flex flex-col items-center justify-between ring-2 ring-zinc-800">
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2 border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-blue-950 border border-blue-600/40" />
              </div>

              {/* OLED Screen Content */}
              <div className="w-full flex-1 bg-gradient-to-b from-[#11131a] via-[#0b0c11] to-black rounded-[34px] overflow-hidden p-4 flex flex-col items-center justify-between text-center relative border border-white/5 my-1">
                
                {/* Status Bar */}
                <div className="w-full flex justify-between items-center text-[10px] font-mono text-gray-400 px-1">
                  <span>12:00</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Animated Gyro Graphic */}
                <div className="flex flex-col items-center gap-3 my-auto">
                  <div className="w-16 h-16 rounded-full bg-[#8f9bff]/10 border-2 border-[#8f9bff] flex items-center justify-center shadow-[0_0_20px_rgba(143,155,255,0.3)] animate-pulse">
                    <RotateCw className="w-8 h-8 text-[#8f9bff] animate-spin-slow" />
                  </div>
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
                    {isLandscape ? 'ГОРИЗОНТАЛЬНЫЙ РЕЖИМ' : 'ПОВЕРНИТЕ УСТРОЙСТВО'}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Нажмите на экран телефона для поворота на 90 градусов
                  </p>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-24 h-1 bg-white/40 rounded-full" />
              </div>

              {/* Bottom Volume / Bezel indicator */}
              <div className="h-2" />
            </div>
          </div>
        </div>

        {/* Rotate Action Button */}
        <div className="w-full max-w-sm space-y-2">
          <button
            onClick={handleRotate}
            className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs uppercase rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(143,155,255,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Повернуть телефон (+90°)</span>
          </button>
        </div>

      </div>
    </ToolWrapper>
  );
};
