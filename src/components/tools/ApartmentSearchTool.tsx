import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Phone, Star } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Listing {
  id: string;
  title: string;
  price: string;
  metro: string;
  area: string;
  floor: string;
  image: string;
  agent: string;
  phone: string;
}

const APARTMENT_LISTINGS: Listing[] = [
  { id: '1', title: '2-к. квартира, 62 м²', price: '125 000 ₽ / мес', metro: 'м. Арбатская (3 мин пешком)', area: '62 м²', floor: '7/14 эт.', image: '🏢', agent: 'Ирина (ЦИАН Премиум)', phone: '+7 (999) 000-11-22' },
  { id: '2', title: 'Студия с панорамным видом', price: '85 000 ₽ / мес', metro: 'м. Москва-Сити (1 мин пешком)', area: '34 м²', floor: '42/75 эт.', image: '🏙️', agent: 'Алексей (Агентство Недвижимость)', phone: '+7 (999) 333-44-55' },
  { id: '3', title: '3-к. евротрешка в ЖК «Символ»', price: '28 500 000 ₽ (Продажа)', metro: 'м. Авиамоторная (7 мин)', area: '88 м²', floor: '12/25 эт.', image: '🏡', agent: 'Елена Риелтор', phone: '+7 (999) 777-88-99' },
  { id: '4', title: '1-к. квартира уютная', price: '45 000 ₽ / мес', metro: 'м. ВДНХ (10 мин)', area: '40 м²', floor: '3/9 эт.', image: '🏬', agent: 'Виктор (Собственник)', phone: '+7 (999) 111-22-33' },
  { id: '5', title: 'Пентхаус с террасой на крыше', price: '450 000 ₽ / мес', metro: 'м. Охотный Ряд (2 мин)', area: '180 м²', floor: '15/15 эт.', image: '🏰', agent: 'Элит Риелти Москва', phone: '+7 (999) 888-99-00' },
  { id: '6', title: '4-к. квартира бизнес-класса', price: '65 000 000 ₽ (Продажа)', metro: 'м. Раменки (5 мин)', area: '130 м²', floor: '8/22 эт.', image: '<ctrl42>', agent: 'Гранд Девелопмент', phone: '+7 (999) 555-66-77' },
  { id: '7', title: 'Компактная студия у парка', price: '38 000 ₽ / мес', metro: 'м. Сокольники (8 мин)', area: '26 м²', floor: '2/5 эт.', image: '🌲', agent: 'Наталья (Частный риелтор)', phone: '+7 (999) 222-33-44' },
  { id: '8', title: 'Лофт в реконструированном депо', price: '110 000 ₽ / мес', metro: 'м. Белорусская (6 мин)', area: '55 м²', floor: '4/6 эт.', image: '🧱', agent: 'Loft Space Realty', phone: '+7 (999) 444-11-88' },
  { id: '9', title: 'Комната 1×1 метр (без окон)', price: '9 900 ₽ / мес', metro: 'м. Окружная (12 мин)', area: '1 м²', floor: '-1/5 эт.', image: '🚪', agent: 'Валерий (Хозяин)', phone: '+7 (900) 111-11-09' },
  { id: '10', title: 'Мусорка во дворе (контейнерная площадка)', price: '5 000 ₽ / мес', metro: 'м. Щёлковская (5 мин)', area: '3 м²', floor: '1/1 эт.', image: '🗑️', agent: 'Управляющая компания', phone: '+7 (900) 111-11-10' },
  { id: '11', title: 'Автобусная остановка «Школа №4» (с лавочкой)', price: '15 000 ₽ / мес', metro: 'м. Кунцевская (9 мин)', area: '6 м²', floor: '1/1 эт.', image: '🚏', agent: 'Автоколонна №3', phone: '+7 (900) 111-11-11' },
  { id: '12', title: 'Теплотрасса: тёплый участок над трубами', price: '2 000 ₽ / мес', metro: 'м. Тимирязевская (15 мин)', area: '8 м²', floor: '0/1 эт.', image: '♨️', agent: 'Теплосеть (диспетчер)', phone: '+7 (900) 111-11-12' },
];

interface Hotel {
  id: number;
  name: string;
  city: string;
  stars: number;
  price: number;
  img: string;
}

const HOTELS: Hotel[] = [
  { id: 1, name: 'Отель «Пельмень Резорт & Спа»', city: 'Москва', stars: 5, price: 12500, img: '🏨' },
  { id: 2, name: 'Гостиница «Уютный Дворик»', city: 'Сочи', stars: 4, price: 6800, img: '🏖️' },
  { id: 3, name: 'Дубай Бурдж Аль Пельмень', city: 'Дубай', stars: 7, price: 450000, img: '🏰' },
  { id: 4, name: 'Подвал «Сырость и Тишина»', city: 'Саратов', stars: 1, price: 800, img: '🕳️' },
  { id: 5, name: 'Заброшка «Бывший завод»', city: 'Тула', stars: 0, price: 300, img: '🏚️' },
  { id: 6, name: 'Дупло в дереве (вековой дуб)', city: 'Липецк', stars: 2, price: 1500, img: '🌳' },
];

export const ApartmentSearchTool: React.FC<ToolProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'apartments' | 'hotels'>('apartments');
  const [filterType, setFilterType] = useState<'Все' | 'Аренда' | 'Продажа'>('Все');
  const [calledAgent, setCalledAgent] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);

  const handleCallAgent = (agentName: string, phone: string, title: string) => {
    soundManager.playBeep(1200, 0.15);
    setCalledAgent(agentName);
    window.setTimeout(() => setCalledAgent(null), 3000);

    // Save call into phone history in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('phone_call_history') || '[]');
      const newCall = {
        id: Date.now().toString(),
        name: agentName,
        phone: phone,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: `Звонок по недвижимости (${title})`,
        status: 'Исходящий',
      };
      localStorage.setItem('phone_call_history', JSON.stringify([newCall, ...existing]));
      window.dispatchEvent(new Event('phone_history_updated'));
    } catch {}
  };

  const handleBook = (name: string) => {
    soundManager.playBeep(1200, 0.1);
    setBooked(name);
    window.setTimeout(() => setBooked(null), 3000);
  };

  const listings = APARTMENT_LISTINGS.filter((l) => {
    if (filterType === 'Все') return true;
    const isSale = l.price.includes('Продажа');
    return filterType === 'Продажа' ? isSale : !isSale;
  });

  return (
    <ToolWrapper title="Недвижимость & Поиск квартир" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 text-xs select-none space-y-3">
        {/* Уведомления: поверх экрана, не сдвигают интерфейс */}
        {(calledAgent || booked) && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-none">
            <div className="px-4 py-3 rounded-2xl bg-[#1b1f33]/95 backdrop-blur-xl border border-white/15 text-white font-semibold text-xs shadow-2xl flex items-center gap-2">
              {calledAgent ? <Phone className="w-4 h-4 text-emerald-300 shrink-0" /> : <span>✅</span>}
              <span>{calledAgent ? `Звонок агенту: ${calledAgent}...` : `Забронировано: ${booked}. Номер ждёт вас.`}</span>
            </div>
          </div>
        )}

        {/* Вкладки */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
          {([
            ['apartments', '🏢 Квартиры'],
            ['hotels', '🏨 Отели'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setTab(id);
              }}
              className={`py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                tab === id ? 'bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'apartments' && (
          <>
            <div className="flex bg-white/[0.05] p-1.5 rounded-full border border-white/10 gap-1">
              {(['Все', 'Аренда', 'Продажа'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    soundManager.playBeep(800, 0.05);
                    setFilterType(f);
                  }}
                  className={`flex-1 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                    filterType === f ? 'bg-white text-slate-900' : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {listings.length === 0 && <div className="text-center text-gray-500 py-8">Объявлений нет</div>}
              {listings.map((item) => (
                <div key={item.id} className="bg-white/[0.05] border border-white/10 p-4 rounded-3xl space-y-2.5 hover:border-white/25 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-3xl shrink-0">{item.image}</span>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-white leading-snug">{item.title}</h3>
                        <p className="text-[10px] text-[#8f9bff] font-semibold">{item.metro}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#b8c0ff] shrink-0 text-right">{item.price}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-white/10 pt-2">
                    <span>
                      {item.area} • {item.floor}
                    </span>
                    <span className="text-gray-200 font-semibold">{item.agent}</span>
                  </div>

                  <button
                    onClick={() => handleCallAgent(item.agent, item.phone, item.title)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-bold text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Позвонить агенту ({item.phone})</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'hotels' && (
          <div className="space-y-2.5">
            {HOTELS.map((h) => (
              <div key={h.id} className="bg-white/[0.05] border border-white/10 p-3.5 rounded-3xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl p-2 bg-black/25 rounded-2xl border border-white/10 shrink-0">{h.img}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white leading-snug">{h.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      {h.city} •{' '}
                      {h.stars > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-amber-300">
                          {h.stars}
                          <Star className="w-3 h-3 fill-current" />
                        </span>
                      ) : (
                        <span>без звёзд</span>
                      )}
                    </p>
                    <div className="text-xs font-bold text-[#b8c0ff] mt-1">{h.price.toLocaleString('ru-RU')} ₽ / ночь</div>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(h.name)}
                  className="px-3 py-2 bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-bold text-[11px] rounded-full cursor-pointer shrink-0 active:scale-95"
                >
                  Забронировать
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
