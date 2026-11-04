import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Layout, Plus, Trash2, Home, Palette, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface PlacedFurniture {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

const FURNITURE_CATALOG = [
  { name: 'Диван «Уют»', icon: '🛋️' },
  { name: 'ТВ 65″ 4K', icon: '📺' },
  { name: 'Платяной шкаф', icon: '🚪' },
  { name: 'Обеденный стол', icon: '🪑' },
  { name: 'Комнатный цветок', icon: '🪴' },
  { name: 'Люстра хрустальная', icon: '💡' },
  { name: 'Двуспальная кровать', icon: '🛏️' },
  { name: 'Стиральная машина', icon: '🧺' },
  { name: 'Игровая консоль', icon: '🎮' },
  { name: 'Рабочий компьютер', icon: '🖥️' },
  { name: 'Большое зеркало', icon: '🪞' },
  { name: 'Камин с пламенем', icon: '🪵' },
];

export const ApartmentDesignTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState<'Гостиная' | 'Спальня' | 'Кухня' | 'Ванная'>('Гостиная');
  const [placedItems, setPlacedItems] = useState<PlacedFurniture[]>([
    { id: '1', name: 'Диван «Уют»', icon: '🛋️', x: 25, y: 35 },
    { id: '2', name: 'ТВ 65″ 4K', icon: '📺', x: 70, y: 20 },
    { id: '3', name: 'Комнатный цветок', icon: '🪴', x: 15, y: 70 },
  ]);

  const handleAddItem = (item: { name: string; icon: string }) => {
    soundManager.playBeep(900, 0.08);
    const newItem: PlacedFurniture = {
      id: Date.now().toString(),
      name: item.name,
      icon: item.icon,
      x: Math.floor(Math.random() * 60) + 10,
      y: Math.floor(Math.random() * 60) + 10,
    };
    setPlacedItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    soundManager.playBeep(400, 0.05);
    setPlacedItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <ToolWrapper title="3D Дизайн & Планировка квартиры" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none space-y-3">
        {/* Room Switcher */}
        <div className="flex bg-[#0f121a] p-1.5 rounded-2xl border border-[#222840] gap-1">
          {(['Гостиная', 'Спальня', 'Кухня', 'Ванная'] as const).map((room) => (
            <button
              key={room}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedRoom(room);
              }}
              className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                selectedRoom === room
                  ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                  : 'text-gray-400 hover:text-white bg-[#171b27]'
              }`}
            >
              {room}
            </button>
          ))}
        </div>

        {/* 2D Interactive Floorplan Canvas */}
        <div className="bg-[#0f121a] border-2 border-[#8f9bff] rounded-2xl h-56 relative overflow-hidden p-3 shadow-[0_0_20px_rgba(143,155,255,0.15)]">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="absolute top-2 left-2 text-[10px] font-extrabold text-[#8f9bff] bg-[#12151e]/90 px-2.5 py-1 rounded-xl border border-[#222840] z-10 uppercase">
            ПЛАН: {selectedRoom} ({placedItems.length} предм.)
          </div>

          {/* Placed Furniture Items */}
          {placedItems.map((item) => (
            <div
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform active:scale-125 z-20 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#12151e] border border-[#8f9bff] flex items-center justify-center text-xl shadow-lg hover:border-[#b8c0ff]">
                {item.icon}
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow cursor-pointer transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Furniture Palette Adders */}
        <div className="bg-[#12151e] border border-[#222840] p-3.5 rounded-2xl space-y-2.5 shadow-md">
          <span className="text-[10px] font-extrabold text-[#8f9bff] uppercase block tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#b8c0ff]" /> Добавить мебель и декор:
          </span>

          <div className="grid grid-cols-4 gap-2">
            {FURNITURE_CATALOG.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAddItem(item)}
                className="p-2 bg-[#0f121a] border border-[#222840] hover:border-[#8f9bff] rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[9px] text-gray-300 font-extrabold truncate w-full text-center">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
