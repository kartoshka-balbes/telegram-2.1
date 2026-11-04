import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Bike, Navigation, MapPin, Gauge, Play, Pause } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface BikeStation {
  id: string;
  name: string;
  bikes: number;
  ebikes: number;
  distance: string;
}

const BIKE_STATIONS: BikeStation[] = [
  { id: '1', name: 'Станция №042 «Парк Горького»', bikes: 12, ebikes: 5, distance: '150 м' },
  { id: '2', name: 'Станция №108 «м. Охотный Ряд»', bikes: 8, ebikes: 2, distance: '320 м' },
  { id: '3', name: 'Станция №215 «ВДНХ Главный Вход»', bikes: 18, ebikes: 7, distance: '650 м' },
  { id: '4', name: 'Станция №302 «Чистые Пруды»', bikes: 4, ebikes: 1, distance: '900 м' },
];

export const BikeMapTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedStation, setSelectedStation] = useState<BikeStation>(BIKE_STATIONS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [speed, setSpeed] = useState(18.5);

  const toggleRecording = () => {
    soundManager.playBeep(isRecording ? 500 : 1200, 0.15);
    setIsRecording(!isRecording);
  };

  return (
    <ToolWrapper title="Велокарта & Прокат Велобайк" onClose={onClose} headerColor="bg-lime-950 border-lime-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Bike Speedometer & Ride Recorder Display */}
        <div className="bg-slate-900 border-2 border-lime-500/80 p-4 rounded-2xl flex justify-between items-center shadow-2xl">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Скорость на велодорожке:</div>
            <div className="text-3xl font-black text-lime-400 font-mono tracking-tight">{speed} км/ч</div>
            <div className="text-[10px] text-slate-300 font-bold mt-0.5">
              {isRecording ? '🟢 Запись трека маршрута...' : '⚪ Пауза трека'}
            </div>
          </div>

          <button
            onClick={toggleRecording}
            className={`px-4 py-3 rounded-2xl border font-black text-xs uppercase cursor-pointer shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 ${
              isRecording
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-lime-500 hover:bg-lime-400 text-slate-950 border-lime-400'
            }`}
          >
            {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRecording ? 'Пауза' : 'Старт'}</span>
          </button>
        </div>

        {/* Selected Velobike Station */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 text-lime-400">
              <Bike className="w-4 h-4" /> {selectedStation.name}
            </span>
            <span className="text-slate-400 text-[10px]">{selectedStation.distance}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Обычные велосипеды</span>
              <span className="text-sm font-black text-white">{selectedStation.bikes} шт</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Электровелосипеды</span>
              <span className="text-sm font-black text-lime-400">{selectedStation.ebikes} шт</span>
            </div>
          </div>
        </div>

        {/* Stations List */}
        <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
          {BIKE_STATIONS.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedStation(st);
              }}
              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                selectedStation.id === st.id
                  ? 'bg-lime-950/80 border-lime-500 text-lime-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-bold text-xs">{st.name}</div>
                <div className="text-[10px] text-slate-400">{st.distance} от вас</div>
              </div>
              <span className="text-xs font-black text-lime-400">{st.bikes + st.ebikes} вел.</span>
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
