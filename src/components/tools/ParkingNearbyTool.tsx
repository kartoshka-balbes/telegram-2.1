import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Car, Clock, ShieldCheck, DollarSign, MapPin } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface ParkingSpot {
  id: string;
  zone: string;
  address: string;
  price: string;
  freeSpots: number;
  totalSpots: number;
}

const PARKING_ZONES: ParkingSpot[] = [
  { id: '1', zone: 'Зона 3004', address: 'ул. Тверская, 16', price: '380 ₽ / час', freeSpots: 3, totalSpots: 20 },
  { id: '2', zone: 'Зона 4012', address: 'Страстной бульвар, 4', price: '200 ₽ / час', freeSpots: 11, totalSpots: 35 },
  { id: '3', zone: 'Зона 2008', address: 'пер. Романов, 2', price: '450 ₽ / час', freeSpots: 1, totalSpots: 15 },
  { id: '4', zone: 'Зона 1002', address: 'Садовое кольцо, 88', price: '150 ₽ / час', freeSpots: 24, totalSpots: 50 },
];

export const ParkingNearbyTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot>(PARKING_ZONES[0]);
  const [isParkingActive, setIsParkingActive] = useState(false);
  const [parkingTime, setParkingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isParkingActive) {
      interval = setInterval(() => setParkingTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isParkingActive]);

  const toggleParkingSession = () => {
    soundManager.playBeep(isParkingActive ? 400 : 1200, 0.15);
    if (isParkingActive) {
      setIsParkingActive(false);
      setParkingTime(0);
    } else {
      setIsParkingActive(true);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Парковки Москвы & Оплата" onClose={onClose} headerColor="bg-blue-950 border-blue-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Active Parking Session Display */}
        <div className="bg-slate-900 border-2 border-blue-500/80 p-4 rounded-2xl flex justify-between items-center shadow-2xl">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Парковочная сессия:</div>
            <div className="text-2xl font-black text-white font-mono">{formatTimer(parkingTime)}</div>
            <div className="text-[10px] text-blue-400 font-bold mt-0.5">{selectedSpot.zone} • {selectedSpot.price}</div>
          </div>

          <button
            onClick={toggleParkingSession}
            className={`px-4 py-3 rounded-2xl border font-black text-xs uppercase cursor-pointer shadow-lg transition-transform active:scale-95 ${
              isParkingActive
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400'
            }`}
          >
            {isParkingActive ? 'Завершить' : 'Оплатить'}
          </button>
        </div>

        {/* Selected Zone Info Box */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span className="text-blue-400 font-black">{selectedSpot.zone}</span>
            <span className="text-emerald-400 font-black">{selectedSpot.price}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-bold">{selectedSpot.address}</p>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Свободно мест: <span className="text-amber-400 font-bold">{selectedSpot.freeSpots} из {selectedSpot.totalSpots}</span>
          </div>
        </div>

        {/* Parking Zones List */}
        <div className="space-y-1.5 overflow-y-auto max-h-[180px] pr-1">
          {PARKING_ZONES.map((spot) => (
            <button
              key={spot.id}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedSpot(spot);
              }}
              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                selectedSpot.id === spot.id
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-bold text-xs">{spot.zone} ({spot.address})</div>
                <div className="text-[10px] text-slate-400">Свободно: {spot.freeSpots} мест</div>
              </div>
              <span className="text-xs font-black text-blue-400">{spot.price}</span>
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
