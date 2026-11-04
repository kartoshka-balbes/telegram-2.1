import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Play, Square, Navigation, Pause } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const TaximeterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'driving' | 'parking'>('parking');
  const [hasStarted, setHasStarted] = useState(false);
  const [fare, setFare] = useState(0);
  const [distance, setDistance] = useState(0);

  // Interval for Driving mode
  useEffect(() => {
    if (status !== 'driving') return;

    const interval = setInterval(() => {
      setFare((prev) => prev + Math.floor(Math.random() * 45) + 15);
      setDistance((prev) => parseFloat((prev + 0.08).toFixed(2)));
    }, 80);

    return () => clearInterval(interval);
  }, [status]);

  // Interval for Parking mode (ONLY after trip has been started at least once)
  useEffect(() => {
    if (status !== 'parking' || !hasStarted) return;

    const interval = setInterval(() => {
      setFare((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, hasStarted]);

  const handleToggle = () => {
    soundManager.playBeep(900, 0.08);
    if (!hasStarted) {
      setHasStarted(true);
      setStatus('driving');
    } else if (status === 'parking') {
      setStatus('driving');
    } else {
      setStatus('parking');
    }
  };

  const handleReset = () => {
    soundManager.playBeep(600, 0.05);
    setStatus('parking');
    setHasStarted(false);
    setFare(0);
    setDistance(0);
  };

  return (
    <ToolWrapper title="Таксометр 24/7" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4 font-mono text-xs select-none">
        {/* Device Header */}
        <div className="bg-[#0f121a] border border-[#222840] p-4 text-center space-y-1 rounded-2xl">
          <Navigation className="w-8 h-8 text-[#8f9bff] mx-auto animate-pulse" />
          <h3 className="text-base font-extrabold text-white uppercase">ТАКСОМЕТР «ГОРОД-ЭКСПРЕСС»</h3>
          <p className="text-[#8f9bff] text-[10px] font-bold">ТАРИФ: ГОРОДСКОЙ • ПОЕЗДКА / СТОЯНКА</p>
        </div>

        {/* Display Screen */}
        <div className="bg-[#0f121a] border-2 border-[#8f9bff] p-6 my-auto text-center space-y-4 shadow-[0_0_25px_rgba(143,155,255,0.2)] rounded-3xl">
          <span className="text-gray-400 font-bold block text-xs uppercase">ТЕКУЩАЯ СТОИМОСТЬ:</span>
          <div className="text-4xl sm:text-5xl font-black text-[#8f9bff] font-mono tracking-tight">
            {fare.toLocaleString()} ₽
          </div>

          <div className="pt-4 border-t border-[#222840] grid grid-cols-2 gap-2 text-left">
            <div className="p-3 bg-[#171b27] border border-[#222840] rounded-xl">
              <span className="text-gray-400 block text-[10px]">Расстояние:</span>
              <span className="text-white font-black text-sm">{distance} км</span>
            </div>
            <div className="p-3 bg-[#171b27] border border-[#222840] rounded-xl">
              <span className="text-gray-400 block text-[10px]">Текущий статус:</span>
              <span className={`font-black uppercase text-xs ${status === 'driving' ? 'text-[#8f9bff]' : 'text-amber-400'}`}>
                {!hasStarted ? '🅿️ СТОЯНКА' : status === 'driving' ? '🚕 ПОЕЗДКА' : '🅿️ СТОЯНКА'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <button
            onClick={handleToggle}
            className={`w-full py-4 font-black uppercase text-xs rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
              status === 'driving'
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                : 'bg-[#8f9bff] hover:bg-[#b8c0ff] text-black shadow-[0_0_15px_rgba(143,155,255,0.3)]'
            }`}
          >
            {status === 'driving' ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{!hasStarted ? 'Начать поездку' : status === 'driving' ? 'Переключить на Стоянку' : 'Возобновить поездку'}</span>
          </button>

          {fare > 0 && (
            <button
              onClick={handleReset}
              className="w-full py-3 bg-[#171b27] hover:bg-[#1e2232] text-gray-400 hover:text-white font-bold uppercase text-xs rounded-2xl border border-[#222840] cursor-pointer"
            >
              Сбросить счётчик
            </button>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
