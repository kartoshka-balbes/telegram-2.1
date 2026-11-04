import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Fuel, MapPin, Compass, Navigation, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const GasStationsNearbyTool: React.FC<ToolProps> = ({ onClose }) => {
  const [buildingRoute, setBuildingRoute] = useState(false);

  const handleBuildRoute = () => {
    soundManager.playBeep(1200, 0.15);
    setBuildingRoute(true);
  };

  return (
    <ToolWrapper title="Заправки рядом (Яндекс Заправки)" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Radar Map Frame */}
        <div className="bg-slate-950 border-2 border-amber-500 rounded-2xl h-56 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
          {/* Empty Grid */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* User Location Center Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold animate-ping opacity-75 absolute inset-0" />
            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center font-bold z-10 shadow-lg">
              📍
            </div>
            <span className="text-[9px] bg-slate-900 text-slate-300 px-1.5 border border-slate-700 font-bold mt-1">
              Вы здесь
            </span>
          </div>

          <div className="relative z-10 flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> Поиск ближайшей АЗС...
            </span>
            <span className="text-amber-400 font-black text-[10px]">РАДИУС: МАКС</span>
          </div>

          <div className="relative z-10 bg-slate-900/90 border border-slate-800 p-2 rounded-xl flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Ближайшая станция:</span>
            <span className="text-red-400 font-black">6 192 917 км</span>
          </div>
        </div>

        {/* Distance Alert Box */}
        <div className="bg-slate-900 border border-amber-500/80 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-black uppercase text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>АИ-95 Премиум — АЗС №402</span>
          </div>
          <p className="text-[11px] text-slate-300 font-bold leading-relaxed">
            Расстояние до ближайшей заправки: <span className="text-red-400 font-black">6 192 917 км</span> (Находится на орбите планеты Марс).
          </p>

          {buildingRoute && (
            <div className="p-3 bg-red-950 border border-red-500 rounded-xl text-red-300 font-bold text-[11px] animate-in zoom-in">
              🚀 Маршрут построен! Время в пути пешком с канистрой: <span className="text-amber-300 font-black">678 412 лет</span>.
            </div>
          )}
        </div>

        <button
          onClick={handleBuildRoute}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          <span>Построить маршрут (6 192 917 км)</span>
        </button>
      </div>
    </ToolWrapper>
  );
};
