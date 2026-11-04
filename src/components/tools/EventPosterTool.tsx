import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  price: string;
  icon: string;
}

const CATS = ['Концерты', 'Кино', 'Стендап', 'Театр'] as const;

// Во всех категориях только три вида событий
const EVENTS_CATALOG: EventItem[] = [
  { id: '1', title: 'Концерт «Уральских пельменей»', category: 'Концерты', date: '15 Августа, 19:00', venue: 'Крокус Сити Холл', price: '2 500 ₽', icon: '🥟' },
  { id: '2', title: 'Выступление бомжей (живой звук)', category: 'Концерты', date: '18 Августа, 20:00', venue: 'Подземный переход у метро', price: '50 ₽', icon: '🎸' },
  { id: '3', title: 'Драка алкашей (открытая сцена)', category: 'Концерты', date: '20 Августа, 22:30', venue: 'Двор за магазином «Пятёрочка»', price: '100 ₽', icon: '🥊' },

  { id: '4', title: 'Фильм-концерт «Уральские пельмени»', category: 'Кино', date: 'Сегодня, 22:00', venue: 'Формула Кино IMAX', price: '600 ₽', icon: '🥟' },
  { id: '5', title: 'Документальный фильм: выступление бомжей', category: 'Кино', date: 'Завтра, 20:30', venue: 'Кинотеатр Октябрь', price: '450 ₽', icon: '🎥' },
  { id: '6', title: 'Кинопоказ: драка алкашей (4K)', category: 'Кино', date: '19 Августа, 23:00', venue: 'Кинотеатр «Родина»', price: '350 ₽', icon: '🍿' },

  { id: '7', title: 'Стендап-концерт «Уральских пельменей»', category: 'Стендап', date: '22 Августа, 20:00', venue: 'Зал Комедии', price: '1 800 ₽', icon: '🥟' },
  { id: '8', title: 'Стендап: выступление бомжей', category: 'Стендап', date: '23 Августа, 21:00', venue: 'StandUp Club #1', price: '300 ₽', icon: '🎤' },
  { id: '9', title: 'Стендап-шоу: драка алкашей', category: 'Стендап', date: '24 Августа, 21:30', venue: 'Бар «Последний автобус»', price: '500 ₽', icon: '🍺' },

  { id: '10', title: 'Спектакль «Уральские пельмени»', category: 'Театр', date: '25 Августа, 18:30', venue: 'МХАТ им. Чехова', price: '3 200 ₽', icon: '🥟' },
  { id: '11', title: 'Театр: выступление бомжей', category: 'Театр', date: '26 Августа, 19:00', venue: 'Театр на теплотрассе', price: '200 ₽', icon: '🎭' },
  { id: '12', title: 'Драка алкашей (театральная постановка)', category: 'Театр', date: '30 Августа, 19:00', venue: 'Большой Театр', price: '7 500 ₽', icon: '🩰' },
  { id: '13', title: 'Концерт «Деревня дураков»', category: 'Концерты', date: '28 Августа, 20:00', venue: 'Клуб «Красная Горка»', price: '900 ₽', icon: '🏚️' },
  { id: '14', title: 'Фильм «Деревня дураков» (премьера)', category: 'Кино', date: '29 Августа, 21:00', venue: 'Кинотеатр «Родина»', price: '400 ₽', icon: '🏚️' },
  { id: '15', title: 'Стендап: «Деревня дураков»', category: 'Стендап', date: '1 Сентября, 20:30', venue: 'StandUp Club #1', price: '600 ₽', icon: '🏚️' },
  { id: '16', title: 'Спектакль «Деревня дураков»', category: 'Театр', date: '3 Сентября, 19:00', venue: 'Театр на Таганке', price: '2 200 ₽', icon: '🏚️' },
];

export const EventPosterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'Все' | (typeof CATS)[number]>('Все');
  const [boughtTicket, setBoughtTicket] = useState<EventItem | null>(null);

  useEffect(() => {
    if (!boughtTicket) return;
    const id = window.setTimeout(() => setBoughtTicket(null), 3000);
    return () => window.clearTimeout(id);
  }, [boughtTicket]);

  const handleBuy = (ev: EventItem) => {
    soundManager.playBeep(1200, 0.15);
    setBoughtTicket(ev);
  };

  const filtered = EVENTS_CATALOG.filter((e) => selectedCategory === 'Все' || e.category === selectedCategory);

  return (
    <ToolWrapper title="Афиша мероприятий & Билеты" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 text-xs select-none space-y-3">
        {boughtTicket && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-none">
            <div className="px-4 py-3 rounded-2xl bg-[#1b1f33]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Билет успешно куплен!
              </div>
              <div className="font-semibold">{boughtTicket.title}</div>
              <div className="text-[10px] text-gray-300">
                {boughtTicket.venue} • {boughtTicket.date}
              </div>
            </div>
          </div>
        )}

        <div className="flex bg-white/[0.06] p-1.5 rounded-full border border-white/10 overflow-x-auto gap-1">
          {(['Все', ...CATS] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedCategory(cat);
              }}
              className={`flex-1 py-2 px-3 rounded-full font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat ? 'bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-slate-950' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {filtered.map((ev) => (
            <div key={ev.id} className="bg-white/[0.05] border border-white/10 p-4 rounded-3xl space-y-2.5 hover:border-white/25 transition-all">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl w-12 h-12 rounded-2xl bg-black/25 flex items-center justify-center shrink-0">{ev.icon}</span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white leading-snug">{ev.title}</h3>
                    <p className="text-[10px] text-[#b8c0ff] font-medium mt-0.5">
                      {ev.venue} • {ev.date}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-white shrink-0">{ev.price}</span>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => handleBuy(ev)}
                  className="px-5 py-2 bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-slate-950 font-bold text-xs rounded-full cursor-pointer active:scale-95 transition-transform"
                >
                  Купить билет
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
