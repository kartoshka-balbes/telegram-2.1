import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Bus, Clock, MapPin, Navigation } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const BusScheduleTool: React.FC<ToolProps> = ({ onClose }) => {
  const [routeNum, setRouteNum] = useState<number>(15);

  // Generate realistic unique schedule for route
  const generateSchedule = (num: number) => {
    const times: string[] = [];
    const baseHour = 6;
    const interval = (num % 7) + 8; // 8 to 14 mins interval
    for (let i = 0; i < 8; i++) {
      const minutes = (i * interval) % 60;
      const hour = baseHour + Math.floor((i * interval) / 60);
      times.push(`${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }
    return times;
  };

  const schedule = generateSchedule(routeNum);

  return (
    <ToolWrapper title="Расписание городских автобусов (1-99)" onClose={onClose} headerColor="bg-blue-950 border-blue-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Route Selector Bar */}
        <div className="bg-slate-900 border-2 border-blue-500/80 p-4 rounded-2xl space-y-3 shadow-2xl">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Bus className="w-4 h-4" /> Выберите номер маршрута:
            </span>
            <span className="text-amber-400 font-black">Маршрут № {routeNum}</span>
          </div>

          <div className="flex gap-2">
            <input
              type="range"
              min={1}
              max={99}
              value={routeNum}
              onChange={(e) => {
                soundManager.playBeep(850, 0.05);
                setRouteNum(parseInt(e.target.value, 10));
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Bus Route Details & Arrival Timeline */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-white border-b border-slate-800 pb-2">
            <span>Автобус № {routeNum}</span>
            <span className="text-emerald-400 font-black">На линии: 6 машин</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Ближайшие рейсы отправления:</span>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {schedule.map((time, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-center text-xs font-black text-amber-400 font-mono"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stops List */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
            Маршрут следования остановки №{routeNum}:
          </span>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {[
              `Вокзальная площадь (Маршрут ${routeNum})`,
              'Улица Академика Королева',
              'Центральный Парк',
              'Станция Метро «Западная»',
              `Конечная остановка микрорайона №${routeNum}`,
            ].map((stop, i) => (
              <div key={i} className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-300 font-bold text-xs">{stop}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
