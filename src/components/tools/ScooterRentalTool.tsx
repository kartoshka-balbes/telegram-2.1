import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Zap, Bell, QrCode, ShieldAlert, Navigation, Battery } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Scooter {
  id: string;
  code: string;
  battery: number;
  rangeKm: number;
  tariff: string;
  distance: string;
}

const SCOOTERS: Scooter[] = [
  { id: '1', code: 'WHOOSH #4829', battery: 94, rangeKm: 38, tariff: '50 ₽ старт + 7 ₽/мин', distance: '45 метров' },
  { id: '2', code: 'YANDEX #1209', battery: 78, rangeKm: 28, tariff: '50 ₽ старт + 8 ₽/мин', distance: '120 метров' },
  { id: '3', code: 'Urent #8812', battery: 52, rangeKm: 18, tariff: '30 ₽ старт + 6 ₽/мин', distance: '210 метров' },
  { id: '4', code: 'WHOOSH #9011', battery: 100, rangeKm: 42, tariff: '50 ₽ старт + 7 ₽/мин', distance: '380 метров' },
];

export const ScooterRentalTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedScooter, setSelectedScooter] = useState<Scooter>(SCOOTERS[0]);
  const [isRiding, setIsRiding] = useState(false);
  const [speedLimit, setSpeedLimit] = useState(25);
  const [price, setPrice] = useState(50);
  const [seconds, setSeconds] = useState(0);
  const [isPriceSurgeActive, setIsPriceSurgeActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRiding || isPriceSurgeActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
        setPrice((p) => p + 500);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRiding, isPriceSurgeActive]);

  const handleStartRide = () => {
    soundManager.playBeep(1200, 0.2);
    setIsRiding(true);
    setIsPriceSurgeActive(true);
  };

  const handleRingBell = () => {
    soundManager.playRock();
    setPrice((prev) => prev + 120);
    setIsPriceSurgeActive(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Аренда электросамокатов" onClose={onClose} headerColor="bg-yellow-950 border-yellow-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Radar Map View */}
        <div className="bg-slate-950 border-2 border-yellow-400 p-4 rounded-2xl relative overflow-hidden h-44 flex flex-col justify-between shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* User Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center animate-bounce shadow-lg">
              🛴
            </div>
            <span className="text-[9px] bg-slate-900 text-yellow-300 px-1 border border-yellow-400 font-bold mt-1">
              Самокат рядом
            </span>
          </div>

          <div className="relative z-10 flex justify-between items-center bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-white font-bold">{selectedScooter.code}</span>
            <span className="text-emerald-400 font-black flex items-center gap-1">
              <Battery className="w-3.5 h-3.5" /> {selectedScooter.battery}% ({selectedScooter.rangeKm} км)
            </span>
          </div>

          <div className="relative z-10 bg-slate-900/90 border border-slate-800 p-2 rounded-xl flex items-center justify-between text-[11px]">
            <span className="text-slate-300">Тариф:</span>
            <span className="text-yellow-400 font-bold">{selectedScooter.tariff}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
          {!isRiding ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300 font-bold text-[11px]">
                <span>Ограничение скорости:</span>
                <button
                  onClick={() => {
                    soundManager.playBeep(900, 0.05);
                    setSpeedLimit((prev) => (prev === 25 ? 15 : 25));
                  }}
                  className="px-2.5 py-1 bg-yellow-400 text-slate-950 rounded font-black text-[10px] cursor-pointer"
                >
                  {speedLimit === 25 ? '25 км/ч (Стандарт)' : '15 км/ч (Медленно)'}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleStartRide}
                  className="flex-1 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Отсканировать QR и Поехать</span>
                </button>
                <button
                  onClick={handleRingBell}
                  className="py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-1.5 border border-yellow-500/30"
                  title="Посигналить (+120 ₽ и +500 ₽/сек)"
                >
                  <Bell className="w-4 h-4" />
                  <span>Сигнал</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-xl text-center space-y-3 animate-in zoom-in">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-300">
                <span>ПОЕЗДКА АКТИВНА</span>
                <span>Скорость: 22 км/ч</span>
              </div>

              <div className="py-3 bg-slate-950 rounded-xl border border-slate-800 text-2xl font-black text-yellow-400 font-mono">
                {formatTime(seconds)} • {price.toLocaleString('ru-RU')} ₽
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRingBell}
                  className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>Посигналить</span>
                </button>

                <button
                  onClick={() => setIsRiding(false)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Завершить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scooter Selector */}
        <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1">
          {SCOOTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                soundManager.playBeep(700, 0.05);
                setSelectedScooter(s);
                setIsRiding(false);
              }}
              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                selectedScooter.id === s.id
                  ? 'bg-yellow-950/80 border-yellow-500 text-yellow-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-bold text-xs">{s.code}</div>
                <div className="text-[10px] text-slate-400">{s.distance}</div>
              </div>
              <span className="text-xs font-black text-emerald-400">{s.battery}% Заряда</span>
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
