import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

import {
  Sparkles,
  Package,
  Award,
  Shield,
  Layers,
  RotateCcw,
  CheckCircle2,
  Archive,
  Info
} from 'lucide-react';

interface CrateOpeningToolProps {
  onClose: () => void;
}

export interface DropItem {
  id: string;
  game: string;
  name: string;
  amount: string;
  rarity: 'Обычное' | 'Редкое' | 'Эпическое' | 'Мифическое' | 'Легендарное';
  category: string;
  icon: string;
}

const ALL_DROP_POOLS: DropItem[] = [
  // Brawl Stars
  { id: 'bs-1', game: 'Brawl Stars', name: 'Гемы (Кристаллы)', amount: '150 шт.', rarity: 'Эпическое', category: 'Валюта', icon: '💎' },
  { id: 'bs-2', game: 'Brawl Stars', name: 'Монеты', amount: '2,800 шт.', rarity: 'Обычное', category: 'Валюта', icon: '🪙' },
  { id: 'bs-3', game: 'Brawl Stars', name: 'Блинги', amount: '1,500 шт.', rarity: 'Редкое', category: 'Косметика', icon: '✨' },
  { id: 'bs-4', game: 'Brawl Stars', name: 'Очки силы', amount: '950 шт.', rarity: 'Обычное', category: 'Прокачка', icon: '⚡' },
  { id: 'bs-5', game: 'Brawl Stars', name: 'Клубные билеты', amount: '12 шт.', rarity: 'Редкое', category: 'Клуб', icon: '🎟️' },
  { id: 'bs-6', game: 'Brawl Stars', name: 'Скин: Меха-Мортис', amount: '1 шт.', rarity: 'Легендарное', category: 'Скины', icon: '🦇' },
  { id: 'bs-7', game: 'Brawl Stars', name: 'Боец: Леон', amount: '1 шт.', rarity: 'Легендарное', category: 'Бойцы', icon: '🥷' },
  { id: 'bs-8', game: 'Brawl Stars', name: 'Боец: Спайк', amount: '1 шт.', rarity: 'Легендарное', category: 'Бойцы', icon: '🌵' },
  { id: 'bs-9', game: 'Brawl Stars', name: 'Звёздные очки', amount: '5,000 шт.', rarity: 'Эпическое', category: 'Рейтинг', icon: '⭐' },
  { id: 'bs-10', game: 'Brawl Stars', name: 'Золотые билеты', amount: '4 шт.', rarity: 'Мифическое', category: 'Пропуск', icon: '🎫' },
  { id: 'bs-11', game: 'Brawl Stars', name: 'Звёздные жетоны', amount: '25 шт.', rarity: 'Редкое', category: 'Жетоны', icon: '🌟' },
  { id: 'bs-12', game: 'Brawl Stars', name: 'Ключи ресурсов', amount: '8 шт.', rarity: 'Эпическое', category: 'Ключи', icon: '🗝️' },

  // Clash of Clans
  { id: 'coc-1', game: 'Clash of Clans', name: 'Золото хранилища', amount: '8,000,000 ед.', rarity: 'Обычное', category: 'Ресурсы', icon: '💰' },
  { id: 'coc-2', game: 'Clash of Clans', name: 'Эликсир', amount: '8,000,000 ед.', rarity: 'Обычное', category: 'Ресурсы', icon: '🧪' },
  { id: 'coc-3', game: 'Clash of Clans', name: 'Чёрный эликсир', amount: '120,000 ед.', rarity: 'Мифическое', category: 'Ресурсы', icon: '🖤' },
  { id: 'coc-4', game: 'Clash of Clans', name: 'Золото строителя', amount: '3,500,000 ед.', rarity: 'Редкое', category: 'База строителя', icon: '🔨' },
  { id: 'coc-5', game: 'Clash of Clans', name: 'Эликсир строителя', amount: '3,500,000 ед.', rarity: 'Редкое', category: 'База строителя', icon: '⚗️' },
  { id: 'coc-6', game: 'Clash of Clans', name: 'Гемы', amount: '1,200 шт.', rarity: 'Эпическое', category: 'Валюта', icon: '💎' },
  { id: 'coc-7', game: 'Clash of Clans', name: 'Золото столицы', amount: '45,000 ед.', rarity: 'Эпическое', category: 'Клановая столица', icon: '🏰' },
  { id: 'coc-8', game: 'Clash of Clans', name: 'Зелье строителя', amount: '5 шт.', rarity: 'Эпическое', category: 'Зелья', icon: '🧪' },
  { id: 'coc-9', game: 'Clash of Clans', name: 'Зелье исследований', amount: '3 шт.', rarity: 'Редкое', category: 'Зелья', icon: '📜' },
  { id: 'coc-10', game: 'Clash of Clans', name: 'Молот героев', amount: '1 шт.', rarity: 'Легендарное', category: 'Молотки', icon: '👑' },
  { id: 'coc-11', game: 'Clash of Clans', name: 'Молот зданий', amount: '1 шт.', rarity: 'Легендарное', category: 'Молотки', icon: '⚒️' },

  // Clash Royale
  { id: 'cr-1', game: 'Clash Royale', name: 'Гемы', amount: '500 шт.', rarity: 'Эпическое', category: 'Валюта', icon: '💎' },
  { id: 'cr-2', game: 'Clash Royale', name: 'Золото', amount: '100,000 ед.', rarity: 'Редкое', category: 'Валюта', icon: '🪙' },
  { id: 'cr-3', game: 'Clash Royale', name: 'Карта: Мегарыцарь', amount: '2 шт.', rarity: 'Легендарное', category: 'Карты', icon: '🛡️' },
  { id: 'cr-4', game: 'Clash Royale', name: 'Карта: П.Е.К.К.А', amount: '15 шт.', rarity: 'Эпическое', category: 'Карты', icon: '⚔️' },
  { id: 'cr-5', game: 'Clash Royale', name: 'Карта: Всадник на кабане', amount: '80 шт.', rarity: 'Редкое', category: 'Карты', icon: '🐗' },
  { id: 'cr-6', game: 'Clash Royale', name: 'Легендарная карта: Шахтёр', amount: '1 шт.', rarity: 'Легендарное', category: 'Карты', icon: '⛏️' },

  // Counter-Strike
  { id: 'cs-1', game: 'Counter-Strike', name: 'Автомат AK-47 | Вулкан (Прямо с завода)', amount: '1 шт.', rarity: 'Легендарное', category: 'Оружие', icon: '🔫' },
  { id: 'cs-2', game: 'Counter-Strike', name: 'Автомат M4A4 | Вой (Немного поношенное)', amount: '1 шт.', rarity: 'Легендарное', category: 'Оружие', icon: '🐺' },
  { id: 'cs-3', game: 'Counter-Strike', name: 'Пистолет Desert Eagle | Пламя', amount: '1 шт.', rarity: 'Мифическое', category: 'Оружие', icon: '🔥' },
  { id: 'cs-4', game: 'Counter-Strike', name: 'Пистолет Glock-18 | Градиент', amount: '1 шт.', rarity: 'Мифическое', category: 'Оружие', icon: '🌈' },
  { id: 'cs-5', game: 'Counter-Strike', name: 'Скин: Керамбит | Волны (Фаза 4)', amount: '1 шт.', rarity: 'Легендарное', category: 'Ножи', icon: '🔪' },
  { id: 'cs-6', game: 'Counter-Strike', name: 'Скин: AWP | Азимов', amount: '1 шт.', rarity: 'Эпическое', category: 'Снайперки', icon: '🎯' },
  { id: 'cs-7', game: 'Counter-Strike', name: 'Голда (Золотой кейс операции)', amount: '3 шт.', rarity: 'Эпическое', category: 'Контейнеры', icon: '📦' },

  // The Sims 4
  { id: 'sims-1', game: 'The Sims 4', name: 'Мебель: Гарнитур премиум-класса', amount: '1 компл.', rarity: 'Редкое', category: 'Интерьер', icon: '🛋️' },
  { id: 'sims-2', game: 'The Sims 4', name: 'Одежда: Дизайнерская коллекция сезона', amount: '6 предметов', rarity: 'Редкое', category: 'Гардероб', icon: '👗' },
  { id: 'sims-3', game: 'The Sims 4', name: 'Симолеоны', amount: '§ 100,000', rarity: 'Эпическое', category: 'Финансы', icon: '💵' },
  { id: 'sims-4', game: 'The Sims 4', name: 'Мебель: Роскошная кровать с балдахином', amount: '1 шт.', rarity: 'Обычное', category: 'Интерьер', icon: '🛏️' },

  // Hearts of Iron IV
  { id: 'hoi4-1', game: 'Hearts of Iron 4', name: 'Гражданские фабрики', amount: '+18 фабрик', rarity: 'Эпическое', category: 'Экономика', icon: '🏭' },
  { id: 'hoi4-2', game: 'Hearts of Iron 4', name: 'Военные заводы', amount: '+30 заводов', rarity: 'Эпическое', category: 'Военпром', icon: '🏗️' },
  { id: 'hoi4-3', game: 'Hearts of Iron 4', name: 'Людские ресурсы (Призывники)', amount: '+1,800,000 чел.', rarity: 'Легендарное', category: 'Армия', icon: '🪖' },
  { id: 'hoi4-4', game: 'Hearts of Iron 4', name: 'Политическая власть', amount: '+200 очков', rarity: 'Редкое', category: 'Политика', icon: '🏛️' },
  { id: 'hoi4-5', game: 'Hearts of Iron 4', name: 'Стабильность страны', amount: '+25%', rarity: 'Редкое', category: 'Государство', icon: '⚖️' },
  { id: 'hoi4-6', game: 'Hearts of Iron 4', name: 'Поддержка войны', amount: '+30%', rarity: 'Редкое', category: 'Государство', icon: '🎖️' },
  { id: 'hoi4-7', game: 'Hearts of Iron 4', name: 'Пехотное снаряжение III', amount: '60,000 компл.', rarity: 'Обычное', category: 'Снаряжение', icon: '🎒' },
  { id: 'hoi4-8', game: 'Hearts of Iron 4', name: 'Бронемашины разведки', amount: '1,200 ед.', rarity: 'Редкое', category: 'Бронетехника', icon: '🚐' },
  { id: 'hoi4-9', game: 'Hearts of Iron 4', name: 'Моторизованные грузовики', amount: '4,500 ед.', rarity: 'Обычное', category: 'Логистика', icon: '🚛' },
  { id: 'hoi4-10', game: 'Hearts of Iron 4', name: 'Самолёты: Истребители IV поколения', amount: '850 звеньев', rarity: 'Мифическое', category: 'Авиация', icon: '✈️' },
  { id: 'hoi4-11', game: 'Hearts of Iron 4', name: 'Корабли: Линейный ударный крейсер', amount: '1 ударн. флот', rarity: 'Легендарное', category: 'Флот', icon: '🚢' },
  { id: 'hoi4-12', game: 'Hearts of Iron 4', name: 'Узлы снабжения', amount: '+6 узлов', rarity: 'Редкое', category: 'Инфраструктура', icon: '🏢' },
  { id: 'hoi4-13', game: 'Hearts of Iron 4', name: 'Железные дороги', amount: '+500 км ж/д 5 ур.', rarity: 'Обычное', category: 'Инфраструктура', icon: '🛤️' },

  // Geometry Dash
  { id: 'gd-1', game: 'Geometry Dash', name: 'Скин куба: Неоновый Демон', amount: '1 шт.', rarity: 'Легендарное', category: 'Скины', icon: '🟩' },
  { id: 'gd-2', game: 'Geometry Dash', name: 'Скин корабля: Плазменный Рейдер', amount: '1 шт.', rarity: 'Мифическое', category: 'Скины', icon: '🚀' },
  { id: 'gd-3', game: 'Geometry Dash', name: 'Палитра цветов: Ультра-Изумруд & Чёрный', amount: '2 цвета', rarity: 'Редкое', category: 'Цвета', icon: '🎨' },
  { id: 'gd-4', game: 'Geometry Dash', name: 'Огненные шарды', amount: '75 шт.', rarity: 'Эпическое', category: 'Шарды', icon: '🔥' },
  { id: 'gd-5', game: 'Geometry Dash', name: 'Ледяные шарды', amount: '60 шт.', rarity: 'Эпическое', category: 'Шарды', icon: '❄️' },
  { id: 'gd-6', game: 'Geometry Dash', name: 'Теневые шарды', amount: '90 шт.', rarity: 'Мифическое', category: 'Шарды', icon: '🔮' },
];

export const CrateOpeningTool: React.FC<CrateOpeningToolProps> = ({ onClose }) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [lastDrops, setLastDrops] = useState<DropItem[]>([]);
  const [inventory, setInventory] = useState<DropItem[]>([]);
  const [activeTab, setActiveTab] = useState<'crate' | 'inventory'>('crate');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('Все');

  const gamesList = ['Все', 'Brawl Stars', 'Clash of Clans', 'Clash Royale', 'Counter-Strike', 'The Sims 4', 'Hearts of Iron 4', 'Geometry Dash'];

  const handleCrateClick = () => {
    if (showRewardModal) return;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    setIsShaking(true);

    // Audio & Haptic feedback based on click stage
    if (nextCount === 1) {
      soundManager.playBeep(450, 0.12);
      triggerHaptic('tap');
      setTimeout(() => setIsShaking(false), 220);
    } else if (nextCount === 2) {
      soundManager.playBeep(650, 0.18);
      triggerHaptic('tap');
      setTimeout(() => setIsShaking(false), 300);
    } else if (nextCount >= 3) {
      // 3rd click: Full crate opening drop generation!
      soundManager.playSiren();
      triggerHaptic('heavy');

      // Pick 5 to 7 balanced unique drops across games
      const shuffled = [...ALL_DROP_POOLS].sort(() => 0.5 - Math.random());
      const selectedDrops = shuffled.slice(0, Math.floor(Math.random() * 3) + 5);

      setTimeout(() => {
        setIsShaking(false);
        setLastDrops(selectedDrops);
        setInventory((prev) => [...selectedDrops, ...prev]);
        setShowRewardModal(true);
        setClickCount(0);
      }, 450);
    }
  };

  const handleResetCrate = () => {
    setShowRewardModal(false);
    setClickCount(0);
    setIsShaking(false);
  };

  // Calculate dynamic shake intensity
  const getShakeStyle = () => {
    if (!isShaking) return {};
    if (clickCount === 1) {
      return {
        transform: 'translate(-4px, 3px) rotate(-2deg)',
      };
    }
    if (clickCount === 2) {
      return {
        transform: 'translate(8px, -6px) rotate(4deg) scale(1.04)',
      };
    }
    if (clickCount >= 3) {
      return {
        transform: 'translate(-14px, 12px) rotate(-6deg) scale(1.12)',
      };
    }
    return {};
  };

  const filteredInventory = selectedGameFilter === 'Все'
    ? inventory
    : inventory.filter((item) => item.game === selectedGameFilter);

  const getRarityBadge = (rarity: DropItem['rarity']) => {
    switch (rarity) {
      case 'Легендарное':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
      case 'Мифическое':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.25)]';
      case 'Эпическое':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50';
      case 'Редкое':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <ToolWrapper title="Открытие ящиков" onClose={onClose} headerColor="bg-[#0e1119] border-[#222840]">
      <div className="flex-1 flex flex-col h-full bg-[#0b0d13] rounded-2xl overflow-hidden border border-[#8f9bff]/25 text-white select-none relative">
        
        {/* Navigation / Header switcher */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#12151e] border-b border-[#1e2232]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('crate')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'crate'
                  ? 'bg-[#8f9bff]/20 text-[#8f9bff] border border-[#8f9bff]/50 shadow-[0_0_15px_rgba(143,155,255,0.2)]'
                  : 'text-gray-400 hover:text-white bg-[#1e1e1e]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Контейнер</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#8f9bff]/20 text-[#8f9bff] border border-[#8f9bff]/50 shadow-[0_0_15px_rgba(143,155,255,0.2)]'
                  : 'text-gray-400 hover:text-white bg-[#1e1e1e]'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Инвентарь ({inventory.length})</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <span className="text-gray-500">Клики:</span>
            <span className="font-extrabold text-[#8f9bff]">{clickCount}/3</span>
          </div>
        </div>

        {/* Crate Tab View - Edge-to-Edge Full Screen Image without frames/windows */}
        {activeTab === 'crate' && (
          <div
            onClick={handleCrateClick}
            className="flex-1 w-full h-full relative cursor-pointer overflow-hidden flex items-center justify-center select-none"
          >
            {/* Full-Screen Edge-to-Edge Image */}
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
              style={getShakeStyle()}
            >
              {/* Authentic Tactical Cyber-Crate Container SVG */}
              <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-[#090b10] via-[#050608] to-black">
                <img src="/img/box.jpg" alt="Ящик" draggable={false} className="w-full max-w-sm h-auto rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] select-none" />
              </div>
              
              {/* Dynamic Glow and Shockwave on Clicks */}
              {clickCount > 0 && (
                <div className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
                  clickCount === 1
                    ? 'bg-[#8f9bff]/15'
                    : clickCount === 2
                    ? 'bg-amber-500/25 animate-pulse'
                    : 'bg-red-600/35'
                }`} />
              )}
            </div>

            {/* Floating Minimalist HUD Overlay (Non-intrusive) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
              <div className="bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs text-white font-mono shadow-2xl flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${clickCount > 0 ? 'bg-[#8f9bff] animate-ping' : 'bg-white'}`} />
                <span className="font-bold">
                  {clickCount === 0 ? 'Нажмите на экран 3 раза для открытия' : `Удар: ${clickCount}/3 (осталось: ${3 - clickCount})`}
                </span>
              </div>
            </div>

            {/* Floating Impact Indicator on Tap */}
            {clickCount > 0 && (
              <div className="absolute z-20 bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border-2 border-[#8f9bff] text-white font-mono font-black text-base tracking-widest shadow-[0_0_30px_rgba(143,155,255,0.6)] animate-in zoom-in-75 duration-100 pointer-events-none">
                {clickCount === 1 && '⚡ УДАР 1/3'}
                {clickCount === 2 && '💥 УДАР 2/3 (ТРЕЩИНА!)'}
                {clickCount >= 3 && '🔥 ВЗЛОМ КОНТЕЙНЕРА...'}
              </div>
            )}

            {/* Floating Bottom Progress Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-10 h-2.5 rounded-full transition-all duration-200 ${
                    clickCount >= step
                      ? 'bg-[#8f9bff] shadow-[0_0_12px_#8f9bff]'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inventory Tab View */}
        {activeTab === 'inventory' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 pb-3 overflow-x-auto no-scrollbar shrink-0">
              {gamesList.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGameFilter(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGameFilter === g
                      ? 'bg-[#8f9bff] text-black font-black shadow-md'
                      : 'bg-[#161a26] text-gray-400 hover:text-white border border-[#262626]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredInventory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                  <Package className="w-12 h-12 mb-2 text-gray-600" />
                  <div className="text-sm font-bold text-gray-400">Инвентарь пуст</div>
                  <div className="text-xs">Откройте ящик во вкладке "Контейнер", чтобы получить трофеи.</div>
                </div>
              ) : (
                filteredInventory.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-3 rounded-2xl bg-[#12151e] border border-[#262626] hover:border-[#8f9bff]/40 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1c2030] border border-[#333] flex items-center justify-center text-xl shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white text-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-2">
                          <span className="text-[#8f9bff] font-bold">{item.game}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="font-mono font-black text-white text-xs">{item.amount}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRarityBadge(item.rarity)}`}>
                        {item.rarity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Inventory Footer */}
            {inventory.length > 0 && (
              <div className="pt-3 border-t border-[#1e2232] flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">Всего предметов: {inventory.length}</span>
                <button
                  onClick={() => setInventory([])}
                  className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer"
                >
                  Очистить инвентарь
                </button>
              </div>
            )}
          </div>
        )}

        {/* Drop Rewards Modal Overlay (Serious & Complete Drop Presentation) */}
        {showRewardModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#12151e] border-2 border-[#8f9bff] rounded-3xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(143,155,255,0.35)] flex flex-col max-h-[85vh] text-white animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1e2232]">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#8f9bff]/20 text-[#8f9bff] border border-[#8f9bff]/40">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wide text-white">
                      Полученные трофеи
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Результаты вскрытия контейнера • {lastDrops.length} наград
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResetCrate}
                  className="p-1.5 rounded-xl bg-[#1e2232] hover:bg-[#333] text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drops List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 my-1 pr-1">
                {lastDrops.map((drop, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#1b1b1b] border border-[#282c3d] flex items-center justify-between gap-3 shadow-sm hover:border-[#8f9bff]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#242424] border border-[#383838] flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {drop.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-white text-xs truncate">{drop.name}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                          <span className="text-[#8f9bff] font-bold">{drop.game}</span>
                          <span className="text-gray-600">•</span>
                          <span>{drop.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="font-mono font-black text-amber-300 text-xs">{drop.amount}</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getRarityBadge(drop.rarity)}`}>
                        {drop.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#1e2232] grid grid-cols-2 gap-3 mt-1">
                <button
                  onClick={() => {
                    setShowRewardModal(false);
                    setActiveTab('inventory');
                  }}
                  className="py-3 bg-[#242424] hover:bg-[#2e2e2e] text-gray-200 rounded-2xl font-black text-xs uppercase cursor-pointer"
                >
                  В инвентарь
                </button>
                <button
                  onClick={handleResetCrate}
                  className="py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black rounded-2xl font-black text-xs uppercase shadow-[0_0_20px_rgba(143,155,255,0.4)] cursor-pointer"
                >
                  Открыть ещё раз
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
};
