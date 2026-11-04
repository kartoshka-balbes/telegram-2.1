import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Cpu, Zap, CheckCircle2, Gauge, ShieldCheck, Activity } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const UpgradeDeviceTool: React.FC<ToolProps> = ({ onClose }) => {
  const [upgrading, setUpgrading] = useState(false);
  const [isUpgraded, setIsUpgraded] = useState(false);

  const handleUpgrade = () => {
    setUpgrading(true);
    soundManager.playSiren();

    const duration = Math.floor(Math.random() * 2000) + 3000;
    setTimeout(() => {
      setUpgrading(false);
      setIsUpgraded(true);
      soundManager.playMicrowaveDing();
    }, duration);
  };

  return (
    <ToolWrapper title="Улучшить устройство" onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-4 text-center">
        {/* Specs Card */}
        <div
          className={`bg-slate-900 border-2 rounded-3xl p-6 w-full shadow-2xl transition-all ${
            isUpgraded
              ? 'border-emerald-500/80 bg-slate-900/90'
              : upgrading
              ? 'border-cyan-400 animate-pulse'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cpu
              className={`w-12 h-12 ${
                isUpgraded ? 'text-emerald-400' : 'text-cyan-400'
              }`}
            />
            <div className="text-left">
              <h3 className="text-white font-black text-lg uppercase leading-tight">
                {isUpgraded ? 'Устройство Pro Max' : 'Текущая конфигурация'}
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {isUpgraded ? 'Максимальный профиль' : 'Базовый профиль'}
              </span>
            </div>
          </div>

          <div className="w-full space-y-3 font-mono text-xs text-left">
            {/* CPU Metric */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1 font-bold">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-cyan-400" /> Процессор (Частота)
                </span>
                <span className={isUpgraded ? 'text-emerald-400 font-black' : 'text-white'}>
                  {isUpgraded ? '5.4 ГГц (8 Cores + Neural)' : '2.8 ГГц'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    isUpgraded ? 'w-full bg-emerald-400' : 'w-1/2 bg-cyan-400'
                  }`}
                />
              </div>
            </div>

            {/* RAM Metric */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1 font-bold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" /> ОЗУ (Скорость)
                </span>
                <span className={isUpgraded ? 'text-emerald-400 font-black' : 'text-white'}>
                  {isUpgraded ? '64 ГБ LPDDR5X (8500 МГц)' : '8 ГБ DDR4'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    isUpgraded ? 'w-full bg-purple-400' : 'w-1/3 bg-purple-500'
                  }`}
                />
              </div>
            </div>

            {/* GPU Performance */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Производительность GPU
                </span>
                <span className={isUpgraded ? 'text-emerald-400 font-black' : 'text-white'}>
                  {isUpgraded ? '128 TFLOPS (Ray Tracing)' : '12 TFLOPS'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    isUpgraded ? 'w-full bg-amber-400' : 'w-1/4 bg-amber-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={handleUpgrade}
          disabled={upgrading || isUpgraded}
          className={`w-full py-4 rounded-2xl font-black text-base uppercase shadow-xl transition-all cursor-pointer ${
            isUpgraded
              ? 'bg-emerald-500 text-slate-950 cursor-default'
              : upgrading
              ? 'bg-amber-500 text-slate-950 animate-pulse'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          {isUpgraded ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Устройство максимально улучшено
            </span>
          ) : upgrading ? (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 animate-spin" /> Улучшение...
            </span>
          ) : (
            'Улучшить устройство'
          )}
        </button>
      </div>
    </ToolWrapper>
  );
};
