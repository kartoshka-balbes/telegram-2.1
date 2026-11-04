import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Navigation, MapPin, Search, Volume2, VolumeX, Car, Route, Layers, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const PRESET_PLACES = [
  { name: 'Дом', address: 'ул. Ленина, д. 42', dist: '3.2 км', time: '8 мин', traffic: 3 },
  { name: 'Работа / Офис', address: 'Деловой центр, башня «Запад»', dist: '14.5 км', time: '28 мин', traffic: 6 },
  { name: 'ТЦ «Европа»', address: 'пр. Победителей, 84', dist: '6.1 км', time: '12 мин', traffic: 4 },
  { name: 'Аэропорт Шереметьево', address: 'Терминал B', dist: '38.0 км', time: '42 мин', traffic: 5 },
  { name: 'АЗС «Роснефть»', address: 'Шоссе Энтузиастов, 12', dist: '1.1 км', time: '3 мин', traffic: 2 },
];

export const NavigatorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [destination, setDestination] = useState('');
  const [activeRoute, setActiveRoute] = useState<typeof PRESET_PLACES[0] | null>(PRESET_PLACES[0]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [trafficScore, setTrafficScore] = useState(4);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSelectPreset = (place: typeof PRESET_PLACES[0]) => {
    soundManager.playBeep(900, 0.08);
    setActiveRoute(place);
    setDestination(place.name);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    soundManager.playBeep(1000, 0.1);

    const timeMin = Math.floor(Math.random() * 35) + 10;
    const kmDist = (Math.random() * 15 + 2).toFixed(1);

    setActiveRoute({
      name: destination.trim(),
      address: `Пользовательский адрес`,
      dist: `${kmDist} км`,
      time: `${timeMin} мин`,
      traffic: trafficScore,
    });
  };

  const toggleNavigation = () => {
    soundManager.playBeep(isNavigating ? 500 : 1200, 0.15);
    setIsNavigating(!isNavigating);
  };

  return (
    <ToolWrapper title="Яндекс Навигатор" onClose={onClose} headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10">
      <div className="flex-1 flex flex-col gap-3 max-w-lg mx-auto w-full py-2 font-mono text-xs select-none">
        {/* Destination Search Header */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Поиск адреса или места..."
              className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 focus:border-cyan-400 rounded-2xl pl-9 pr-3 py-2.5 text-white font-bold outline-none text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-2xl uppercase tracking-wider text-[11px] cursor-pointer"
          >
            Маршрут
          </button>
        </form>

        {/* Map Display Viewport */}
        <div className="bg-black/30 border border-white/10 rounded-2xl h-60 relative overflow-hidden flex flex-col justify-between p-3 shadow-2xl">
          {/* Map Grid Patterns */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Road Visual Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/[0.08] border-y border-white/10 -rotate-3" />
          <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-white/[0.08] border-x border-white/10 rotate-12" />

          {/* Simulated Active Route Line */}
          {activeRoute && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full stroke-cyan-400 stroke-2 fill-none opacity-80">
                <path d="M 40 180 Q 150 90 280 120 T 420 50" strokeDasharray="6,6" className="animate-pulse" />
              </svg>
            </div>
          )}

          {/* User Car Pin */}
          <div className="absolute bottom-12 left-12 z-10 flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center shadow-lg animate-pulse">
              <Navigation className="w-4 h-4 fill-current transform rotate-45" />
            </div>
            <span className="text-[9px] bg-white/[0.045] text-yellow-300 px-1.5 py-0.5 border border-white/10 font-bold rounded">
              Вы
            </span>
          </div>

          {/* Destination Pin */}
          {activeRoute && (
            <div className="absolute top-8 right-12 z-10 flex items-center gap-1">
              <MapPin className="w-6 h-6 text-red-500 fill-current animate-bounce" />
              <span className="text-[9px] bg-white/[0.045] text-white px-1.5 py-0.5 border border-white/10 font-bold rounded">
                {activeRoute.name}
              </span>
            </div>
          )}

          {/* Top Info Bar: Traffic Score & Voice Switch */}
          <div className="relative z-10 flex justify-between items-center bg-white/[0.045] backdrop-blur-md border border-white/10 p-2 rounded-2xl">
            <div className="flex items-center gap-2">
              <div
                onClick={() => setTrafficScore((prev) => (prev % 10) + 1)}
                className={`w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center cursor-pointer ${
                  trafficScore <= 3
                    ? 'bg-emerald-500 text-slate-950'
                    : trafficScore <= 6
                    ? 'bg-yellow-400 text-slate-950'
                    : 'bg-red-500 text-white'
                }`}
              >
                {trafficScore}
              </div>
              <span className="text-[10px] text-slate-300 font-bold">
                Пробки {trafficScore} баллов
              </span>
            </div>

            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className="p-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 rounded-2xl cursor-pointer"
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>

          {/* Bottom Route Card on Map */}
          {activeRoute && (
            <div className="relative z-10 bg-white/[0.045] backdrop-blur-md border border-white/10 p-2.5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">{activeRoute.time}</span>
                  <span className="text-slate-400 font-normal">({activeRoute.dist})</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {activeRoute.address}
                </div>
              </div>

              <button
                onClick={toggleNavigation}
                className={`px-4 py-2 rounded-2xl font-black text-xs uppercase cursor-pointer shadow-lg tracking-wider ${
                  isNavigating
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isNavigating ? 'Сброс' : 'Поехали'}
              </button>
            </div>
          )}
        </div>

        {/* Quick Presets List */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 rounded-2xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
            Быстрые маршруты:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PLACES.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  activeRoute?.name === p.name
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-black/30 border-white/10 hover:border-white/10 text-slate-300'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="font-bold text-xs truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.address}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                  {p.dist}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
