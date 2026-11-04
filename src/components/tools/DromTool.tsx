import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Car, Check, Search } from 'lucide-react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';


interface ToolProps {
  onClose: () => void;
}

interface CarItem {
  id: string;
  name: string;
  year: number;
  mileage: string;
  price: number;
  city: string;
  category: 'отечественные' | 'иномарки' | 'премиум' | 'спорт' | 'все';
  isBought?: boolean;
}

export const DromTool: React.FC<ToolProps> = ({ onClose }) => {
  const [cars, setCars] = useState<CarItem[]>([
    { id: '1', name: 'ВАЗ-2107 «Боевая Классика»', year: 2004, mileage: '380,000 км', price: 65000, city: 'Новосибирск', category: 'отечественные' },
    { id: '2', name: 'Toyota Mark II (JZX100 1JZ-GTE)', year: 1999, mileage: '290,000 км', price: 1250000, city: 'Владивосток', category: 'иномарки' },
    { id: '3', name: 'Lada Priora Седан (Пневма)', year: 2012, mileage: '180,000 км', price: 380000, city: 'Махачкала', category: 'отечественные' },
    { id: '4', name: 'Bugatti Chiron (не бит не крашен)', year: 2020, mileage: '850,000 км', price: 290000000, city: 'Москва', category: 'спорт' },
    { id: '5', name: 'BMW M5 E60 V10 (без масел)', year: 2007, mileage: '210,000 км', price: 1850000, city: 'Санкт-Петербург', category: 'премиум' },
    { id: '6', name: 'Nissan Skyline GT-R R34', year: 2001, mileage: '115,000 км', price: 8900000, city: 'Иркутск', category: 'спорт' },
    { id: '7', name: 'УАЗ Хантер 4x4 (Тайга Эдишн)', year: 2015, mileage: '95,000 км', price: 520000, city: 'Чита', category: 'отечественные' },
    { id: '8', name: 'Mercedes-Benz G 63 AMG', year: 2021, mileage: '42,000 км', price: 18500000, city: 'Казань', category: 'премиум' },
    { id: '9', name: 'Audi RS6 Avant (700 л.с.)', year: 2019, mileage: '68,000 км', price: 9200000, city: 'Сочи', category: 'премиум' },
    { id: '10', name: 'Subaru Impreza WRX STI', year: 2006, mileage: '175,000 км', price: 1650000, city: 'Хабаровск', category: 'спорт' },
    { id: '11', name: 'Hyundai Solaris 1.6 AT', year: 2017, mileage: '240,000 км (из под такси)', price: 720000, city: 'Нижний Новгород', category: 'иномарки' },
    { id: '12', name: 'Porsche 911 GT3 RS', year: 2022, mileage: '8,500 км', price: 34000000, city: 'Москва', category: 'спорт' },
    { id: '13', name: 'ГАЗ 24 Волга (хранение в гараже)', year: 1982, mileage: '54,000 км', price: 290000, city: 'Саратов', category: 'отечественные' },
    { id: '14', name: 'Toyota Land Cruiser 200', year: 2014, mileage: '310,000 км', price: 3900000, city: 'Тюмень', category: 'иномарки' },
  ]);

  const [boughtMessage, setBoughtMessage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('все');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBuyCar = (car: CarItem) => {
    triggerHaptic('tap');
    soundManager.playBeep(900, 0.1);
    setCars((prev) =>
      prev.map((c) => (c.id === car.id ? { ...c, isBought: true } : c))
    );
    setBoughtMessage(`Поздравляем с покупкой авто «${car.name}» за ${car.price.toLocaleString('ru-RU')} ₽! Машина уже заведена и ждет во дворе.`);
    setTimeout(() => setBoughtMessage(null), 3500);
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'все' || car.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <ToolWrapper title="Дром — Автосалон & Объявления" onClose={onClose} headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10">
      <div className="flex-1 flex flex-col gap-3 max-w-2xl mx-auto w-full py-2 font-sans select-none overflow-y-auto px-1">
        
        {/* Automobile Portal Showcase Banner */}
        <div className="w-full shrink-0 bg-gradient-to-r from-red-950/60 via-[#171b28] to-[#121218] border border-red-900/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-lg">
              DROM
            </div>
            <div>
              <h3 className="font-black text-sm text-white uppercase tracking-wider">Всероссийский авторынок</h3>
              <p className="text-[11px] text-gray-400">Проверенные объявления от собственников и дилеров</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-2.5 py-1 rounded-2xl border border-red-800">
            {cars.length} авто в базе
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск марки, модели или города..."
              className="w-full pl-9 pr-3 py-2 bg-white/[0.05] backdrop-blur-xl border border-white/10 focus:border-[#8f9bff] rounded-2xl text-xs text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
            {['все', 'отечественные', 'иномарки', 'премиум', 'спорт'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  triggerHaptic('tap');
                  setSelectedFilter(f);
                }}
                className={`px-3 py-1.5 rounded-2xl text-[11px] font-bold capitalize transition-all cursor-pointer shrink-0 border ${
                  selectedFilter === f
                    ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-sm'
                    : 'bg-white/[0.05] backdrop-blur-xl text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {boughtMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] p-3.5 bg-[#222840]/95 backdrop-blur-md border border-[#8f9bff] text-[#8f9bff] text-xs font-black text-center rounded-2xl shadow-2xl animate-in zoom-in pointer-events-none">
            {boughtMessage}
          </div>
        )}

        {/* Car listings */}
        <div className="space-y-2.5 pb-4">
          {filteredCars.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              Автомобилей по данному запросу не найдено
            </div>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-[#8f9bff]/50 transition-all shadow-lg group"
              >
                <div className="w-12 h-12 bg-black/30 border border-white/10 rounded-2xl flex items-center justify-center text-[#8f9bff] font-bold shrink-0 group-hover:scale-105 transition-transform">
                  <Car className="w-6 h-6 text-[#b8c0ff]" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <h4 className="text-xs font-extrabold text-white truncate">{car.name}</h4>
                  <div className="text-xs font-black text-[#b8c0ff] font-mono mt-0.5">
                    {car.price.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                    {car.year} г. • {car.mileage} • {car.city}
                  </div>
                </div>

                {car.isBought ? (
                  <span className="text-[10px] bg-[#222840] text-[#8f9bff] border border-[#8f9bff] px-3 py-1.5 font-extrabold uppercase rounded-2xl shrink-0 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Куплено
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyCar(car)}
                    className="px-3.5 py-2 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase cursor-pointer rounded-2xl shrink-0 shadow-[0_0_10px_rgba(143,155,255,0.3)] transition-all active:scale-95"
                  >
                    Купить
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
