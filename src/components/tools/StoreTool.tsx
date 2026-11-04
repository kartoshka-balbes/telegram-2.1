import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  X,
  Search,
  Store,
  Maximize2,
  RefreshCw,
  Upload,
  Layers,
  ArrowRight,
  PackageX,
  Sparkles,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info
} from 'lucide-react';

import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Marketplace {
  id: string;
  name: string;
  color: string;
  textColor: string;
  badgeBg: string;
  icon: string;
  logoText: string;
  tagline: string;
  stats: string;
  categories: string[];
}

const MARKETPLACES: Marketplace[] = [
  {
    id: 'ozon',
    name: 'Ozon',
    color: 'from-blue-600 to-blue-800',
    textColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    icon: '🔵',
    logoText: 'OZON',
    tagline: 'Быстрая доставка по всей России',
    stats: '14.8 млн наименований каталога • 0 шт. на складах',
    categories: ['Электроника', 'Одежда', 'Дом', 'Продукты', 'Автотовары']
  },
  {
    id: 'wb',
    name: 'Wildberries',
    color: 'from-purple-700 to-pink-800',
    textColor: 'text-purple-300',
    badgeBg: 'bg-purple-500/20 border-purple-500/50 text-purple-200',
    icon: '🟣',
    logoText: 'WILDBERRIES',
    tagline: 'Миллионы товаров со скидками',
    stats: '29.4 млн позиций • Складские запасы исчерпаны',
    categories: ['Одежда', 'Обувь', 'Косметика', 'Детям', 'Спорт']
  },
  {
    id: 'ym',
    name: 'Яндекс Маркет',
    color: 'from-amber-500 to-yellow-600',
    textColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
    icon: '🟡',
    logoText: 'ЯНДЕКС МАРКЕТ',
    tagline: 'Сплит, Плюс и экспресс-доставка',
    stats: 'Скидки до -99% • 0 шт. в наличии',
    categories: ['Гаджеты', 'Ноутбуки', 'Техника', 'Мебель', 'Дача']
  },
  {
    id: 'mega',
    name: 'Мегамаркет',
    color: 'from-emerald-600 to-teal-800',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200',
    icon: '🟢',
    logoText: 'МЕГАМАРКЕТ',
    tagline: 'Кэшбэк бонусами Спасибо до 80%',
    stats: 'Бонусы начислены • Товары временно закончились',
    categories: ['Супермаркет', 'Бытовая техника', 'Смартфоны', 'Красота']
  },
  {
    id: 'dns',
    name: 'DNS Ритейл',
    color: 'from-orange-600 to-amber-700',
    textColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 border-orange-500/50 text-orange-200',
    icon: '🟠',
    logoText: 'DNS SHOP',
    tagline: 'Федеральная сеть цифровой техники',
    stats: 'Видеокарты и процессоры • 0 в наличии',
    categories: ['Комплектующие', 'ПК и Ноутбуки', 'Телевизоры', 'Гейминг']
  },
  {
    id: 'ali',
    name: 'AliExpress Россия',
    color: 'from-red-600 to-orange-700',
    textColor: 'text-red-400',
    badgeBg: 'bg-red-500/20 border-red-500/50 text-red-200',
    icon: '🔴',
    logoText: 'ALIEXPRESS',
    tagline: 'Прямые поставки из Китая за копейки',
    stats: 'Распродажа 11.11 • Все раскуплено',
    categories: ['Электроника', 'Инструменты', 'Хобби', 'Тюнинг']
  },
  {
    id: 'avito',
    name: 'Авито',
    color: 'from-sky-500 to-indigo-600',
    textColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 border-sky-500/50 text-sky-200',
    icon: '🔷',
    logoText: 'АВИТО',
    tagline: 'Доска частных и коммерческих объявлений',
    stats: 'Объявление закрыто • Продано продавцом',
    categories: ['Авто', 'Недвижимость', 'Услуги', 'Личные вещи', 'Работа']
  },
  {
    id: 'cdek',
    name: 'CDEK.Shopping',
    color: 'from-green-600 to-emerald-700',
    textColor: 'text-green-400',
    badgeBg: 'bg-green-500/20 border-green-500/50 text-green-200',
    icon: '📦',
    logoText: 'CDEK SHOPPING',
    tagline: 'Оригинальные бренды из Европы и США',
    stats: 'Таможня пройдена • Склады пустые',
    categories: ['Брендовая одежда', 'Zara & Massimo', 'Dyson', 'Apple']
  },
  {
    id: 'edadeal',
    name: 'Едадил',
    color: 'from-emerald-700 to-green-900',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200',
    icon: '🛒',
    logoText: 'ЕДАДИЛ',
    tagline: 'Каталог акций, скидок и кэшбэка супермаркетов',
    stats: 'Скидки до -70% • Кэшбэк с чека активен',
    categories: ['Пятёрочка', 'Магнит', 'Перекрёсток', 'Лента', 'Ашан', 'Дикси']
  },
  {
    id: 'lamoda',
    name: 'Lamoda',
    color: 'from-zinc-700 to-black',
    textColor: 'text-zinc-300',
    badgeBg: 'bg-zinc-500/20 border-zinc-500/50 text-zinc-200',
    icon: '👠',
    logoText: 'LAMODA',
    tagline: 'Премиальная мода и стиль с примеркой',
    stats: 'Новая коллекция раскуплена стилистами',
    categories: ['Платья', 'Костюмы', 'Обувь', 'Аксессуары', 'Парфюм']
  },
  {
    id: 'kupi',
    name: 'KupiVip',
    color: 'from-rose-600 to-purple-800',
    textColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 border-rose-500/50 text-rose-200',
    icon: '💎',
    logoText: 'KUPIVIP',
    tagline: 'Закрытый клуб распродаж люксовых брендов',
    stats: 'Лимитированные серии распроданы за секунды',
    categories: ['Gucci', 'Prada', 'Balenciaga', 'Часы', 'Ювелирка']
  },
  {
    id: 'leroy',
    name: 'Лемана ПРО (Леруа)',
    color: 'from-lime-600 to-green-800',
    textColor: 'text-lime-400',
    badgeBg: 'bg-lime-500/20 border-lime-500/50 text-lime-200',
    icon: '🔨',
    logoText: 'ЛЕМАНА ПРО',
    tagline: 'Все для строительства, ремонта и уюта',
    stats: 'Все стройматериалы вывезены бригадами',
    categories: ['Инструмент', 'Плитка', 'Краски', 'Сантехника', 'Сад']
  },
  {
    id: 'samokat',
    name: 'Самокат',
    color: 'from-pink-600 to-rose-700',
    textColor: 'text-pink-400',
    badgeBg: 'bg-pink-500/20 border-pink-500/50 text-pink-200',
    icon: '⚡',
    logoText: 'САМОКАТ',
    tagline: 'Доставка продуктов и готовой еды от 15 минут',
    stats: 'Дарксторы пустые • Курьеры отдыхают',
    categories: ['Выпечка', 'Молоко', 'Фрукты', 'Готовая еда', 'Снеки']
  }
];

export const StoreTool: React.FC<ToolProps> = ({ onClose }) => {
  // Main image state: uses custom uploaded user image
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageBrightness, setImageBrightness] = useState(100);
  const [imageContrast, setImageContrast] = useState(100);

  // Selected marketplace modal window (opened upon clicking any item in the library)
  const [activeMarketplace, setActiveMarketplace] = useState<Marketplace | null>(null);
  const [notifiedMarketplaces, setNotifiedMarketplaces] = useState<Record<string, boolean>>({});

  // Search filter for marketplaces list
  const [searchQuery, setSearchQuery] = useState('');

  const activeImage = customImage;

  const handleOpenMarketplace = (market: Marketplace) => {
    soundManager.playBeep(950, 0.06);
    setActiveMarketplace(market);
  };

  const handleNotifyMarket = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundManager.playBeep(1200, 0.1);
    setNotifiedMarketplaces((prev) => ({ ...prev, [id]: true }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setCustomImage(ev.target.result);
          soundManager.playBeep(1100, 0.08);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    soundManager.playBeep(700, 0.05);
    setCustomImage(null);
    setImageBrightness(100);
    setImageContrast(100);
  };

  const filteredMarketplaces = MARKETPLACES.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.tagline.toLowerCase().includes(query) ||
      m.categories.some((c) => c.toLowerCase().includes(query))
    );
  });

  return (
    <ToolWrapper title="Магазин" onClose={onClose} headerColor="bg-[#10131d] border-[#1e2232]">
      
      {/* ========================================================================= */}
      {/* 1. ОКНО ПЛОЩАДКИ ПРИ НАЖАТИИ: ИНФОРМАЦИЯ О ТОМ, ЧТО ТОВАРЫ РАСПРОДАНЫ */}
      {/* ========================================================================= */}
      {activeMarketplace && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-full max-w-lg bg-[#12151f] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r ${activeMarketplace.color} text-white flex items-center justify-between shadow-lg`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1 bg-black/20 rounded-2xl backdrop-blur-sm">{activeMarketplace.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg sm:text-xl tracking-tight">{activeMarketplace.logoText}</h3>
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase rounded-md">
                      0 В НАЛИЧИИ
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium">{activeMarketplace.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playBeep(700, 0.04);
                  setActiveMarketplace(null);
                }}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sold Out Information Notification Box */}
            <div className="p-5 space-y-4">
              <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
                  <PackageX className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-red-300 uppercase tracking-wide">
                    Все товары полностью распроданы!
                  </h4>
                  <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
                    На площадке «{activeMarketplace.name}» в данный момент нет доступных к заказу товаров. Склады и распределительные центры полностью пусты.
                  </p>
                  <div className="mt-2 text-[11px] text-gray-400 font-mono">
                    {activeMarketplace.stats}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <span className="text-xs font-bold text-gray-400 block mb-2">Категории каталога:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMarketplace.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-[#111116] border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleNotifyMarket(activeMarketplace.id, e)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  notifiedMarketplaces[activeMarketplace.id]
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10'
                }`}
              >
                {notifiedMarketplaces[activeMarketplace.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Вы подписаны на уведомление</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Уведомить о поступлении</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveMarketplace(null)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Закрыть
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ПОЛНОЭКРАННЫЙ ПРОСМОТР ЗАГРУЖЕННОГО ИЗОБРАЖЕНИЯ */}
      {/* ========================================================================= */}
      {showImageModal && activeImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm">Ваше изображение</span>
            </div>
            <button
              onClick={() => setShowImageModal(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            <img
              src={activeImage}
              alt="Изображение магазина"
              style={{
                filter: `brightness(${imageBrightness}%) contrast(${imageContrast}%)`
              }}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ОСНОВНОЙ ЭКРАН МАГАЗИНА: ЦИФРОВАЯ ВИТРИНА МАРКЕТПЛЕЙСОВ */}
      {/* ========================================================================= */}
      <div className="w-full h-full flex-1 flex flex-col bg-[#0b0b0e] overflow-y-auto select-none p-3 sm:p-5 space-y-5">
        
        {/* Modern Marketplace Hub Hero Banner */}
        <div className="w-full shrink-0 bg-gradient-to-r from-[#181824] via-[#101018] to-[#181824] border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#8f9bff]/20 border border-[#8f9bff]/40 text-[#8f9bff] text-[10px] font-black uppercase rounded-full">
                  Единый агрегатор
                </span>
                <span className="text-xs text-zinc-400 font-mono">12 торговых сетей</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Центральный Каталог Маркетплейсов
              </h1>
              <p className="text-xs text-zinc-400 max-w-lg">
                Мониторинг складских остатков, распродаж, промокодов и цен на крупнейших торговых площадках РФ.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/10 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Загрузить фото витрины</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              {customImage && (
                <button
                  onClick={() => setShowImageModal(true)}
                  className="px-3 py-2 bg-[#8f9bff] text-black font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Фото</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ОБЪЕДИНЁННАЯ БИБЛИОТЕКА ПЛОЩАДОК (БОЛЬШОЙ СПИСОК / СЕТКА) */}
        {/* ========================================================================= */}
        <div className="space-y-3 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" /> Объединённая библиотека площадок
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по библиотеке..."
                className="w-full bg-[#16161e] border border-[#2a2a34] focus:border-amber-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Clean Aggregated Library List / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMarketplaces.map((m) => (
              <div
                key={m.id}
                onClick={() => handleOpenMarketplace(m)}
                className="bg-[#12151f] border border-[#262630] hover:border-amber-400/50 rounded-2xl p-4 flex flex-col justify-between cursor-pointer group transition-all hover:scale-[1.01] shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{m.icon}</span>
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                        {m.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {m.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 my-2">
                  {m.categories.slice(0, 3).map((cat) => (
                    <span key={cat} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-md">
                      {cat}
                    </span>
                  ))}
                  {m.categories.length > 3 && (
                    <span className="text-[10px] text-gray-500 self-center">+{m.categories.length - 3}</span>
                  )}
                </div>

                <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span className="text-[11px] text-amber-400/80 font-medium">Библиотека сервисов</span>
                  <span className="group-hover:translate-x-1 transition-transform text-white font-bold flex items-center gap-1">
                    <span>Подробнее</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
};
