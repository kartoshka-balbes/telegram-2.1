import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ShoppingBag, Check, Tag } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Item {
  id: string;
  title: string;
  price: number;
  location: string;
  seller: string;
  emoji: string;
  badgeBg: string;
  isBought?: boolean;
}


const FREE_ITEMS: Item[] = [
  { id: 'f1', title: 'Холодильник «Саратов» неисправный (не морозит, течёт)', price: 0, location: 'Саратов', seller: 'Валентина', emoji: '🧊', badgeBg: 'from-slate-800/70 to-slate-900' },
  { id: 'f2', title: 'Диван продавленный, пятна, запах (самовывоз)', price: 0, location: 'Москва', seller: 'Сергей', emoji: '🛋️', badgeBg: 'from-stone-800/70 to-slate-900' },
  { id: 'f3', title: 'Шины б/у 4 шт., износ 100%, без протектора', price: 0, location: 'Самара', seller: 'Гараж №14', emoji: '🛞', badgeBg: 'from-zinc-800/70 to-slate-900' },
  { id: 'f4', title: 'Телевизор ЭЛТ с разбитым экраном', price: 0, location: 'Омск', seller: 'Николай', emoji: '📺', badgeBg: 'from-gray-800/70 to-slate-900' },
  { id: 'f5', title: 'Стиральная машина ржавая, без барабана', price: 0, location: 'Тула', seller: 'Ирина', emoji: '🧺', badgeBg: 'from-orange-950/70 to-slate-900' },
  { id: 'f6', title: 'Матрас односпальный грязный, со следами протечек', price: 0, location: 'Казань', seller: 'Антон', emoji: '🛏️', badgeBg: 'from-yellow-950/70 to-slate-900' },
  { id: 'f7', title: 'Стул с тремя ножками, обивка порвана', price: 0, location: 'Пермь', seller: 'Людмила', emoji: '🪑', badgeBg: 'from-amber-950/70 to-slate-900' },
  { id: 'f8', title: 'Строительный мусор, 12 мешков (вывоз за счёт покупателя)', price: 0, location: 'Химки', seller: 'Бригада', emoji: '🗑️', badgeBg: 'from-neutral-800/70 to-slate-900' },
  { id: 'f9', title: 'Ведро засохшей краски, не открывается', price: 0, location: 'Уфа', seller: 'Павел', emoji: '🪣', badgeBg: 'from-red-950/70 to-slate-900' },
  { id: 'f10', title: 'Утюг нерабочий, оборван провод', price: 0, location: 'Тверь', seller: 'Галина', emoji: '🔌', badgeBg: 'from-slate-800/70 to-slate-900' },
  { id: 'f11', title: 'Ванна чугунная, сколы эмали, 120 кг (самовывоз)', price: 0, location: 'Курск', seller: 'Ремонт-Сервис', emoji: '🛁', badgeBg: 'from-stone-800/70 to-slate-900' },
  { id: 'f12', title: 'Ковёр 3×2 м, тронут молью, застарелые пятна', price: 0, location: 'Рязань', seller: 'Тамара', emoji: '🟫', badgeBg: 'from-amber-950/70 to-slate-900' },
  { id: 'f13', title: 'Кастрюля с подгоревшим дном, эмаль отколота', price: 0, location: 'Липецк', seller: 'Ольга', emoji: '🍲', badgeBg: 'from-zinc-800/70 to-slate-900' },
  { id: 'f14', title: 'Велосипед без колёс и цепи, рама погнута', price: 0, location: 'Омск', seller: 'Дмитрий', emoji: '🚲', badgeBg: 'from-gray-800/70 to-slate-900' },
  { id: 'f15', title: 'Межкомнатная дверь с трещиной, без ручки', price: 0, location: 'Ярославль', seller: 'Виктор', emoji: '🚪', badgeBg: 'from-yellow-950/70 to-slate-900' },
  { id: 'f16', title: 'Монитор с треснувшей матрицей', price: 0, location: 'Воронеж', seller: 'Офис', emoji: '🖥️', badgeBg: 'from-slate-800/70 to-slate-900' },
  { id: 'f17', title: 'Коробка проводов и удлинителей, жилы оборваны', price: 0, location: 'Томск', seller: 'Электрик', emoji: '🧶', badgeBg: 'from-neutral-800/70 to-slate-900' },
  { id: 'f18', title: 'Кирпич битый, около 200 шт.', price: 0, location: 'Калуга', seller: 'Стройка', emoji: '🧱', badgeBg: 'from-red-950/70 to-slate-900' },
  { id: 'f19', title: 'Пакет старых газет и журналов (сырые, слипшиеся)', price: 0, location: 'Курган', seller: 'Борис', emoji: '📰', badgeBg: 'from-stone-800/70 to-slate-900' },
  { id: 'f20', title: 'Зеркало разбитое, осколки в упаковке', price: 0, location: 'Брянск', seller: 'Марина', emoji: '🪞', badgeBg: 'from-zinc-800/70 to-slate-900' },
];

export const AvitoTool: React.FC<ToolProps> = ({ onClose }) => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'Смартфон флагманский 256GB', price: 28500, location: 'Москва', seller: 'Даниил', emoji: '📱', badgeBg: 'from-blue-900/60 to-slate-900' },
    { id: '2', title: 'Торговый павильон / Готовый бизнес', price: 450000, location: 'СПб', seller: 'Алексей', emoji: '🏪', badgeBg: 'from-amber-900/60 to-slate-900' },
    { id: '3', title: 'Автомобиль с пробегом (на ходу)', price: 180000, location: 'Владивосток', seller: 'Дром Авто', emoji: '🚗', badgeBg: 'from-red-900/60 to-slate-900' },
    { id: '4', title: 'Микроскоп лабораторный бинокулярный', price: 34000, location: 'Новосибирск', seller: 'Институт', emoji: '🔬', badgeBg: 'from-emerald-900/60 to-slate-900' },
    { id: '5', title: 'Телескоп астрономический с оптикой', price: 42000, location: 'Казань', seller: 'Астроном', emoji: '🔭', badgeBg: 'from-indigo-900/60 to-slate-900' },
    { id: '6', title: 'Камин обогреватель с живым пламенем', price: 12500, location: 'Екатеринбург', seller: 'Уютный Дом', emoji: '🔥', badgeBg: 'from-orange-900/60 to-slate-900' },
    { id: '7', title: 'Зеркало интерьерное с подсветкой', price: 6800, location: 'Самара', seller: 'Мастерская', emoji: '🪞', badgeBg: 'from-cyan-900/60 to-slate-900' },
    { id: '8', title: 'Лабораторные бланки и анализы', price: 1500, location: 'Омск', seller: 'МедЦентр', emoji: '📋', badgeBg: 'from-teal-900/60 to-slate-900' },
    { id: '9', title: 'Кейс металлический армейский', price: 5400, location: 'Ростов-на-Дону', seller: 'Склад', emoji: '📦', badgeBg: 'from-zinc-800 to-slate-950' },
    { id: '10', title: 'Коллекционная головоломка 2048', price: 2200, location: 'Уфа', seller: 'ИгроМир', emoji: '🔢', badgeBg: 'from-yellow-900/60 to-slate-900' },
    { id: '11', title: 'Таблица проверки зрения настенная', price: 1900, location: 'Пермь', seller: 'Оптика', emoji: '👁️', badgeBg: 'from-sky-900/60 to-slate-900' },
    { id: '12', title: 'Пазл премиум качества 1000 дет.', price: 2500, location: 'Воронеж', seller: 'Хобби', emoji: '🧩', badgeBg: 'from-purple-900/60 to-slate-900' },
  ]);

  const [freeItems, setFreeItems] = useState<Item[]>(FREE_ITEMS);
  const [tab, setTab] = useState<'ads' | 'free'>('ads');
  const [boughtMessage, setBoughtMessage] = useState<string | null>(null);

  const handleBuy = (item: Item) => {
    soundManager.playRock();
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isBought: true } : i))
    );
    setFreeItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isBought: true } : i))
    );
    setBoughtMessage(
      item.price === 0
        ? `Вы забрали «${item.title}» бесплатно. Продавец ${item.seller} ждёт вас для самовывоза.`
        : `Вы успешно купили «${item.title}» за ${item.price.toLocaleString('ru-RU')} ₽! Продавец ${item.seller} подтвердил заказ.`
    );
    setTimeout(() => setBoughtMessage(null), 3500);
  };

  return (
    <ToolWrapper title="Авито — Объявления" onClose={onClose} headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none">
        {boughtMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] p-3.5 bg-[#222840]/95 backdrop-blur-md border border-[#8f9bff] text-[#8f9bff] text-xs font-black text-center rounded-2xl shadow-2xl animate-in zoom-in pointer-events-none">
            {boughtMessage}
          </div>
        )}

        {/* Вкладки */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-white/[0.06] border border-white/10">
          {([
            ['ads', 'Объявления'],
            ['free', 'Бесплатные товары (помойка)'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`py-2 px-2 rounded-full text-[11px] font-semibold leading-tight cursor-pointer transition-all ${
                tab === id ? 'bg-gradient-to-r from-[#00aaff] to-[#97cf26] text-slate-950' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
          {(tab === 'ads' ? items : freeItems).map((item) => (
            <div key={item.id} className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-[#8f9bff]/50 transition-all shadow-lg">
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-gradient-to-br ${item.badgeBg} flex items-center justify-center text-2xl shadow-inner`}>
                {item.emoji}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-extrabold text-white truncate">{item.title}</h4>
                <div className="text-xs font-black text-[#b8c0ff] font-mono mt-0.5">{item.price === 0 ? 'Бесплатно' : `${item.price.toLocaleString('ru-RU')} ₽`}</div>
                <div className="text-[10px] text-gray-400 font-bold mt-0.5">{item.location} • {item.seller}</div>
              </div>

              {item.isBought ? (
                <span className="text-[10px] bg-[#222840] text-[#8f9bff] border border-[#8f9bff] px-3 py-1.5 font-extrabold uppercase rounded-2xl shrink-0">
                  {item.price === 0 ? 'Забрано ✓' : 'Куплено ✓'}
                </span>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  className="px-3.5 py-2 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase cursor-pointer rounded-2xl shrink-0 shadow-[0_0_10px_rgba(143,155,255,0.3)] transition-all active:scale-95"
                >
                  {item.price === 0 ? 'Забрать' : 'Купить'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
