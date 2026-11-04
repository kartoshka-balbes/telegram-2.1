import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Train, Search, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const TrainTicketsTool: React.FC<ToolProps> = ({ onClose }) => {
  const [from, setFrom] = useState('Москва');
  const [to, setTo] = useState('Санкт-Петербург');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [purchasedTicket, setPurchasedTicket] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playBeep(700, 0.1);
    setPurchasedTicket(null);
    setSearchResults([
      { train: '072А «Сапсан»', time: '03 ч 50 мин', price: '4 250 ₽', type: 'Сидячий Эконом', wagon: 'Вагон 04, Место 12' },
      { train: '074А «Сапсан Бизнес»', time: '03 ч 45 мин', price: '9 800 ₽', type: 'Бизнес-Класс', wagon: 'Вагон 01, Место 04' },
      { train: '002А «Красная Стрела»', time: '08 ч 00 мин', price: '7 800 ₽', type: 'Купе Люкс', wagon: 'Вагон 02, Место 18' },
      { train: '146У «Плацкартный Экспресс»', time: '09 ч 15 мин', price: '2 100 ₽', type: 'Плацкарт', wagon: 'Вагон 08, Место 35' },
      { train: '016А «Арктика»', time: '08 ч 30 мин', price: '3 400 ₽', type: 'Купе Стандарт', wagon: 'Вагон 05, Место 21' },
      { train: '054Ч «Ласточка Premium»', time: '04 ч 10 мин', price: '2 850 ₽', type: 'Комфорт Сидячий', wagon: 'Вагон 03, Место 42' },
    ]);
  };

  const handleBuy = (ticket: any) => {
    soundManager.playBeep(1200, 0.15);
    setPurchasedTicket(ticket);
  };

  return (
    <ToolWrapper title="Ж/Д Билеты РЖД" onClose={onClose} headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none">
        <form onSubmit={handleSearch} className="bg-white/[0.05] backdrop-blur-xl border border-[#8f9bff]/40 p-4 space-y-3 rounded-2xl shadow-[0_0_20px_rgba(143,155,255,0.15)]">
          <div className="flex items-center gap-2 text-[#8f9bff] font-extrabold text-xs uppercase mb-1">
            <Train className="w-4 h-4 text-[#b8c0ff]" />
            <span>Поиск билетов на поезд:</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-extrabold uppercase mb-1 block">Откуда:</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full bg-black/30 border border-white/10 focus:border-[#8f9bff] p-2.5 text-xs text-white outline-none rounded-2xl font-bold transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-extrabold uppercase mb-1 block">Куда:</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-black/30 border border-white/10 focus:border-[#8f9bff] p-2.5 text-xs text-white outline-none rounded-2xl font-bold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 rounded-2xl shadow-[0_0_12px_rgba(143,155,255,0.3)] transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Найти билеты</span>
          </button>
        </form>

        {/* Confirmation Card */}
        {purchasedTicket && (
          <div className="mt-3 bg-[#222840] border border-[#8f9bff] p-4 rounded-2xl space-y-2 animate-in zoom-in duration-150 shadow-lg">
            <div className="flex items-center gap-2 text-[#8f9bff] font-black uppercase text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Покупка билета подтверждена!</span>
            </div>
            <div className="text-white font-bold space-y-1 pt-2 border-t border-[#8f9bff]/40">
              <div>Маршрут: {from} ➔ {to}</div>
              <div>Поезд: <span className="text-[#8f9bff] font-black">{purchasedTicket.train}</span></div>
              <div>Категория: {purchasedTicket.type} ({purchasedTicket.wagon})</div>
              <div>Оплачено: <span className="text-[#b8c0ff] font-black font-mono">{purchasedTicket.price}</span></div>
            </div>
          </div>
        )}

        {searchResults && (
          <div className="space-y-2.5 mt-3 overflow-y-auto max-h-[250px] pr-1">
            <span className="text-xs font-extrabold text-[#8f9bff] uppercase block">Найденные поезда ({searchResults.length}):</span>
            {searchResults.map((res, i) => (
              <div key={i} className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl flex justify-between items-center hover:border-[#8f9bff]/50 transition-all shadow-lg">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{res.train}</h4>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">{res.type} • В пути: {res.time}</div>
                </div>
                <button
                  onClick={() => handleBuy(res)}
                  className="px-3.5 py-2 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs cursor-pointer rounded-2xl font-mono shadow-[0_0_10px_rgba(143,155,255,0.3)] transition-all active:scale-95"
                >
                  {res.price}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
