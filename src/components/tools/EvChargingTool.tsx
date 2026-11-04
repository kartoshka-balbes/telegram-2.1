import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Zap, BatteryCharging, MapPin, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface EvStation {
  id: string;
  name: string;
  power: string;
  connectors: string;
  price: string;
  status: 'Free' | 'Busy';
  distance: string;
}

const EV_STATIONS: EvStation[] = [
  { id: '1', name: 'Энергия Москвы #102', power: '150 кВт (Быстрая DC)', connectors: 'CCS Combo 2, CHAdeMO', price: '18 ₽ / кВт⋅ч', status: 'Free', distance: '120 м' },
  { id: '2', name: 'Россети Зарядка #045', power: '60 кВт', connectors: 'Type 2, CCS2', price: '15 ₽ / кВт⋅ч', status: 'Free', distance: '350 м' },
  { id: '3', name: 'Touch Charging Hub', power: '22 кВт (AC)', connectors: 'Type 2', price: '12 ₽ / кВт⋅ч', status: 'Busy', distance: '700 м' },
];

export const EvChargingTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedStation, setSelectedStation] = useState<EvStation>(EV_STATIONS[0]);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(48);

  const handleStartCharging = () => {
    soundManager.playBeep(1200, 0.15);
    setIsCharging(true);
  };

  return (
    <ToolWrapper title="Зарядные станции для электромобилей" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Active Charging Session Status */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-emerald-500/80 p-4 rounded-2xl flex justify-between items-center shadow-2xl">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Зарядка аккумулятора:</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {isCharging ? `${chargeProgress}% (Заряжается...)` : 'Подключите кабель'}
            </div>
            <div className="text-[10px] text-slate-300 font-bold mt-0.5">{selectedStation.name}</div>
          </div>

          <button
            onClick={() => {
              if (isCharging) {
                soundManager.playBeep(400, 0.1);
                setIsCharging(false);
              } else {
                handleStartCharging();
              }
            }}
            className={`px-4 py-3 rounded-2xl border font-black text-xs uppercase cursor-pointer shadow-lg transition-transform active:scale-95 ${
              isCharging
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
            }`}
          >
            {isCharging ? 'Остановить' : 'Зарядить'}
          </button>
        </div>

        {/* Selected Station Box */}
        <div className="bg-black/30 border border-white/10 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span className="text-emerald-400 font-black">{selectedStation.name}</span>
            <span className="text-slate-400 text-[10px]">{selectedStation.distance}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-bold">Мощность: {selectedStation.power}</p>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10 flex justify-between">
            <span>Разъемы: {selectedStation.connectors}</span>
            <span className="text-amber-400 font-bold">{selectedStation.price}</span>
          </div>
        </div>

        {/* Stations List */}
        <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
          {EV_STATIONS.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedStation(st);
                setIsCharging(false);
              }}
              className={`w-full p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                selectedStation.id === st.id
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-white/[0.05] backdrop-blur-xl border-white/10 text-slate-300 hover:border-white/10'
              }`}
            >
              <div>
                <div className="font-bold text-xs">{st.name}</div>
                <div className="text-[10px] text-slate-400">{st.power}</div>
              </div>
              <span className="text-xs font-black text-emerald-400">{st.price}</span>
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
