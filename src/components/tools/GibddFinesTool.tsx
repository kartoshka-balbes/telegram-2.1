import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ShieldAlert, CreditCard, CheckCircle, Car, Bike, User, Zap, AlertOctagon, FileCheck, Search, Filter } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface FineItem {
  id: number;
  type: 'car' | 'quad' | 'moto' | 'scooter' | 'pedestrian' | 'bike' | 'tricycle';
  vehicle: string;
  article: string;
  desc: string;
  location: string;
  date: string;
  amount: number;
  discount: number;
  paid: boolean;
}

const INITIAL_FINES: FineItem[] = [
  {
    id: 1,
    type: 'car',
    vehicle: 'Автомобиль • ВАЗ 2107 (Госномер А777АА777)',
    article: 'КоАП РФ ст. 12.38.1',
    desc: 'Исполнение парного управляемого заноса (дрифта) на кольцевой развязке перед экипажем спецбатальона ДПС с включённой сиреной и рупором.',
    location: 'г. Москва, Садовое кольцо / ул. Новый Арбат',
    date: '14.08.2026 02:41',
    amount: 14500000,
    discount: 7250000,
    paid: false,
  },
  {
    id: 2,
    type: 'scooter',
    vehicle: 'Электросамокат • Whoosh Pro Ultra Max',
    article: 'КоАП РФ ст. 12.29 ч.4',
    desc: 'Движение по пешеходному тротуару со скоростью 98 км/ч в нетрезвом виде в позе ласточки без рук с перевозкой чугунной ванны с мокрым бетоном.',
    location: 'г. Санкт-Петербург, Невский проспект, д. 22',
    date: '12.08.2026 19:15',
    amount: 8800000,
    discount: 4400000,
    paid: false,
  },
  {
    id: 3,
    type: 'tricycle',
    vehicle: 'Трёхколёсный велосипед • «Гномик-3»',
    article: 'КоАП РФ ст. 12.11 ч.1',
    desc: 'Выезд на левую скоростную полосу автомагистрали М-11 со скоростью 6 км/ч, агрессивное мигание фонариком и подача звуковых сигналов резиновой уточкой с требованием уступить дорогу.',
    location: 'Скоростная автомагистраль М-11 «Нева», 48-й км',
    date: '10.08.2026 14:02',
    amount: 24500000,
    discount: 12250000,
    paid: false,
  },
  {
    id: 4,
    type: 'pedestrian',
    vehicle: 'Пешеход • Гражданин РФ',
    article: 'КоАП РФ ст. 12.29 ч.1',
    desc: 'Переход восьмиполосной скоростной автомагистрали ползком по-пластунски в маскировочном костюме гигантского солёного огурца на красный сигнал светофора.',
    location: 'г. Москва, МКАД 14-й км, внутренняя сторона',
    date: '08.08.2026 23:55',
    amount: 5200000,
    discount: 2600000,
    paid: false,
  },
  {
    id: 5,
    type: 'quad',
    vehicle: 'Квадроцикл • CFMOTO CFORCE 1000',
    article: 'КоАП РФ ст. 12.15 ч.5',
    desc: 'Заезд на квадроцикле в торговый центр через вращающиеся двери, дрифт вокруг фонтана и попытка заправиться 95-м бензином в отделе элитной парфюмерии.',
    location: 'г. Екатеринбург, ТРЦ «Гринвич», 1-й этаж',
    date: '07.08.2026 16:30',
    amount: 32000000,
    discount: 16000000,
    paid: false,
  },
  {
    id: 6,
    type: 'moto',
    vehicle: 'Мотоцикл • ИЖ Юпитер-5',
    article: 'КоАП РФ ст. 12.5 ч.3',
    desc: 'Установка в кустарных условиях прямоточного реактивного двигателя от самолёта Ту-154 и езда на заднем колесе без шлема с закрытыми глазами перед стационарным постом ГИБДД.',
    location: 'г. Казань, Оренбургский тракт, Пост №1',
    date: '05.08.2026 01:12',
    amount: 54000000,
    discount: 27000000,
    paid: false,
  },
  {
    id: 7,
    type: 'bike',
    vehicle: 'Велосипед • Складной «Кама-1988»',
    article: 'КоАП РФ ст. 12.12 ч.2',
    desc: 'Попытка перепрыгнуть закрытый железнодорожный шлагбаум с криком «Я успею!» перед приближающимся скоростным поездом «Сапсан».',
    location: 'ж/д переезд ст. Поварово, 58-й км',
    date: '03.08.2026 11:08',
    amount: 9700000,
    discount: 4850000,
    paid: false,
  },
  {
    id: 8,
    type: 'car',
    vehicle: 'Автомобиль • Lada Priora (Госномер Е001КХ99)',
    article: 'КоАП РФ ст. 12.21.2',
    desc: 'Буксировка трёхместного бархатного дивана с тремя пассажирами, распивающими чай из самовара, на гибкой сцепке по третьей полосе МКАД со скоростью 140 км/ч.',
    location: 'г. Москва, МКАД 68-й км',
    date: '01.08.2026 18:20',
    amount: 18900000,
    discount: 9450000,
    paid: false,
  },
  {
    id: 9,
    type: 'pedestrian',
    vehicle: 'Пешеход • Гражданин РФ',
    article: 'КоАП РФ ст. 19.3 ч.1',
    desc: 'Остановка колонны строительных бетономешалок жезлом из варёной колбасы «Докторская» с последующим требованием путевого листа у водителей.',
    location: 'г. Новосибирск, Красный проспект, д. 45',
    date: '29.07.2026 08:50',
    amount: 4100000,
    discount: 2050000,
    paid: true,
  },
  {
    id: 10,
    type: 'tricycle',
    vehicle: 'Трёхколёсный велосипед • Smart Trike Red',
    article: 'КоАП РФ ст. 12.14 ч.3',
    desc: 'Выполнение разворота через две сплошные полосы на перекрёстке перед зданием Главного управления МВД с созданием помехи для кортежа сопровождения.',
    location: 'г. Москва, ул. Петровка, д. 38',
    date: '26.07.2026 15:10',
    amount: 15300000,
    discount: 7650000,
    paid: false,
  },
  {
    id: 11,
    type: 'scooter',
    vehicle: 'Электросамокат • Dualtron Thunder 3',
    article: 'КоАП РФ ст. 12.9 ч.7',
    desc: 'Обгон патрульного автомобиля ДПС по встречной разделительной полосе Кутузовского проспекта со скоростью 132 км/ч задним ходом в маске сварщика.',
    location: 'г. Москва, Кутузовский проспект, д. 18',
    date: '24.07.2026 22:40',
    amount: 21000000,
    discount: 10500000,
    paid: false,
  },
  {
    id: 12,
    type: 'quad',
    vehicle: 'Квадроцикл • BRP Can-Am Renegade',
    article: 'КоАП РФ ст. 12.33 ч.1',
    desc: 'Штурм городской клумбы перед мэрией с буксировкой привязанной двухместной надувной лодки с рыболовными снастями и мангалом на углях.',
    location: 'г. Самара, Волжский проспект, пл. Славы',
    date: '20.07.2026 17:05',
    amount: 11800000,
    discount: 5900000,
    paid: true,
  },
];

export const GibddFinesTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fines, setFines] = useState<FineItem[]>(INITIAL_FINES);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handlePay = (id: number) => {
    soundManager.playBeep(1400, 0.15);
    setFines((prev) => prev.map((f) => (f.id === id ? { ...f, paid: true } : f)));
  };

  const filteredFines = fines
    .filter((f) => selectedFilter === 'all' || f.type === selectedFilter)
    .filter(
      (f) =>
        f.desc.toLowerCase().includes(search.toLowerCase()) ||
        f.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        f.location.toLowerCase().includes(search.toLowerCase()) ||
        f.article.toLowerCase().includes(search.toLowerCase())
    );

  const unpaidCount = fines.filter((f) => !f.paid).length;
  const unpaidSum = fines.filter((f) => !f.paid).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ToolWrapper title="Государственная база штрафов ГИБДД" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Official Header Card */}
        <div className="bg-[#0f121a] border-2 border-[#222840] p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Единая база правонарушений</div>
              <div className="text-xs font-black text-white">СТС 77 АА 999888 • ВУ 99 00 123456</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full font-bold inline-block">
              {unpaidCount} неоплаченных
            </span>
            <div className="text-[11px] font-black text-amber-400 font-mono mt-0.5">
              {(unpaidSum).toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#171b27] border border-[#222840] rounded-xl px-3 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#8f9bff]" />
          <input
            type="text"
            placeholder="Поиск по статье, транспорту или описанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white outline-none w-full"
          />
        </div>

        {/* Vehicle Category Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
          {[
            { id: 'all', label: 'Все' },
            { id: 'car', label: '🚗 Авто' },
            { id: 'quad', label: '🚜 Квадроцикл' },
            { id: 'moto', label: '🏍️ Мотоцикл' },
            { id: 'scooter', label: '🛴 Самокат' },
            { id: 'pedestrian', label: '🚶 Пешеход' },
            { id: 'bike', label: '🚲 Велосипед' },
            { id: 'tricycle', label: '🧒 Трёхколёсный' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                  : 'bg-[#12151e] text-gray-400 border border-[#222840] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fines List */}
        <div className="space-y-2.5">
          {filteredFines.map((f) => (
            <div
              key={f.id}
              className={`bg-[#12151e] border rounded-2xl p-3.5 space-y-2.5 transition-all ${
                f.paid ? 'border-[#222840] opacity-80' : 'border-red-900/60 shadow-lg'
              }`}
            >
              {/* Badge & Date */}
              <div className="flex justify-between items-center text-[10px] border-b border-[#222840] pb-1.5">
                <span className="font-mono font-extrabold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
                  {f.article}
                </span>
                <span className="text-gray-400 font-mono">{f.date}</span>
              </div>

              {/* Vehicle & Violation details */}
              <div>
                <div className="text-[11px] font-black text-white">{f.vehicle}</div>
                <p className="text-xs text-gray-300 font-medium leading-relaxed mt-1">
                  {f.desc}
                </p>
                <div className="text-[9px] text-gray-500 font-mono mt-1">
                  📍 Место: {f.location}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex justify-between items-center border-t border-[#222840] pt-2">
                <div>
                  <div className="text-sm font-black text-red-400 font-mono">
                    {f.amount.toLocaleString('ru-RU')} ₽
                  </div>
                  {!f.paid && (
                    <div className="text-[9px] text-[#8f9bff] font-extrabold">
                      Со скидкой 50%: {f.discount.toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </div>

                {f.paid ? (
                  <span className="text-[10px] bg-[#222840] text-[#8f9bff] border border-[#8f9bff] px-3 py-1.5 font-black uppercase rounded-xl flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Оплачено
                  </span>
                ) : (
                  <button
                    onClick={() => handlePay(f.id)}
                    className="px-4 py-2 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs uppercase rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Оплатить {f.discount.toLocaleString('ru-RU')} ₽</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </ToolWrapper>
  );
};

