import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { X, ArrowLeft, Play, Star, AlertTriangle } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

interface Game {
  title: string;
  icon: string;
  genre: string;
  rating: string;
  size: string;
  desc: string;
}

const GAMES: Game[] = [
  { title: 'GTA 6', icon: '🚗', genre: 'Экшен, открытый мир', rating: '4.9', size: '152 ГБ', desc: 'Открытый мир, криминальный сюжет, режим кооператива на несколько игроков.' },
  { title: 'Half-Life 3', icon: '🧪', genre: 'Шутер от первого лица', rating: '5.0', size: '64 ГБ', desc: 'Продолжение культовой серии: исследование, головоломки и сюжетная кампания.' },
  { title: 'The Sims 8', icon: '🏠', genre: 'Симулятор жизни', rating: '4.6', size: '48 ГБ', desc: 'Создание персонажей, строительство домов и управление жизнью целого района.' },
  { title: 'Minecraft 2', icon: '⛏️', genre: 'Песочница', rating: '4.8', size: '12 ГБ', desc: 'Процедурно генерируемые миры, выживание и строительство без ограничений.' },
  { title: 'Terraria 2', icon: '🌳', genre: 'Приключения, песочница', rating: '4.8', size: '3 ГБ', desc: 'Двухмерный мир с исследованием пещер, боссами и крафтом.' },
  { title: 'World of Tanks 3', icon: '🪖', genre: 'Танковые сражения', rating: '4.3', size: '85 ГБ', desc: 'Командные бои на бронетехнике, более 600 машин в ангаре.' },
  { title: 'Roblox 2', icon: '🧱', genre: 'Платформа игровых миров', rating: '4.4', size: '6 ГБ', desc: 'Миллионы пользовательских режимов и встроенный редактор игр.' },
  { title: 'GTA Samara Online', icon: '🌆', genre: 'Многопользовательский экшен', rating: '4.2', size: '71 ГБ', desc: 'Онлайн-режим с городской картой, транспортом и сообществами игроков.' },
  { title: 'Уральские пельмени', icon: '🥟', genre: 'Аркада', rating: '4.5', size: '2 ГБ', desc: 'Аркадная игра с мини-играми и коллекционными карточками.' },
  { title: 'Brawl Stars', icon: '⭐', genre: 'Командные арены', rating: '4.7', size: '1.5 ГБ', desc: 'Короткие матчи 3 на 3, десятки бойцов и сезонные события.' },
  { title: 'Clash Royale', icon: '👑', genre: 'Стратегия, карточная', rating: '4.7', size: '0.6 ГБ', desc: 'Дуэли в реальном времени с колодой из восьми карт.' },
  { title: 'Clash of Clans', icon: '🛡️', genre: 'Стратегия', rating: '4.7', size: '0.4 ГБ', desc: 'Развитие базы, клановые войны и наборы войск.' },
  { title: 'Clash Royale 2', icon: '🏰', genre: 'Стратегия, карточная', rating: '4.6', size: '1.1 ГБ', desc: 'Новая арена, обновлённый баланс и расширенный набор карт.' },
  { title: 'Plants vs. Zombies 5', icon: '🌻', genre: 'Защита башен', rating: '4.8', size: '2.5 ГБ', desc: 'Защита участка от волн зомби с помощью растений и улучшений.' },
  { title: 'Angry Birds: Саратов', icon: '🐦', genre: 'Головоломка', rating: '4.3', size: '0.9 ГБ', desc: 'Физическая головоломка с запуском птиц по конструкциям.' },
  { title: 'Subway Surfers: Иваново', icon: '🏃', genre: 'Бесконечный раннер', rating: '4.4', size: '0.8 ГБ', desc: 'Бесконечный забег по железнодорожным путям с бонусами и ускорителями.' },
  { title: 'Wormix', icon: '🪱', genre: 'Пошаговые сражения', rating: '4.5', size: '0.3 ГБ', desc: 'Пошаговые битвы червей с оружием и изменяемым ландшафтом.' },
  { title: 'Counter-Strike 3', icon: '🔫', genre: 'Тактический шутер', rating: '4.7', size: '58 ГБ', desc: 'Командные раунды 5 на 5, соревновательный режим и рейтинговая система.' },
  { title: 'Among Us 2', icon: '🚀', genre: 'Социальная дедукция', rating: '4.4', size: '1.2 ГБ', desc: 'Поиск предателя среди экипажа космического корабля.' },
  { title: 'Fortnite: Воронеж', icon: '🪂', genre: 'Королевская битва', rating: '4.3', size: '38 ГБ', desc: 'Королевская битва на 100 игроков с возведением построек.' },
  { title: 'Танки Онлайн: Тюмень', icon: '🛞', genre: 'Аркадные бои', rating: '4.1', size: '0.5 ГБ', desc: 'Трёхмерные аркадные сражения на танках в браузере.' },
];

const ERROR_TITLES = [
  'СРОЧНО', 'ВНИМАНИЕ', 'ОПАСНОСТЬ', 'ТРЕВОГА', 'ЗАПРЕЩЕНО', 'ЗАПРЕТ', 'НЕЛЬЗЯ', 'ОТКАЗ', 'БЛОКИРОВКА',
  'ЗАБЛОКИРОВАНО', 'ЭКСТРЕННО', 'УГРОЗА', 'РИСК', 'ОСТОРОЖНО', 'ПРЕДУПРЕЖДЕНИЕ', 'ПАНИКА', 'СИГНАЛИЗАЦИЯ',
  'ОПОВЕЩЕНИЕ', 'УВЕДОМЛЕНИЕ', 'НЕ ДОЗВОЛЕНО', 'ВНЕ ЗАКОНА', 'ВОСПРЕЩЕНО', 'НЕДОПУСТИМОЕ ПОВЕДЕНИЕ',
  'ПОД ЗАПРЕТОМ', 'ОТКЛОНЕНИЕ ЗАПРОСА', 'ЗАПРЕТ НА ДЕЙСТВИЕ', 'ОТКАЗ В ДОСТУПЕ', 'НЕДОСТУПНО', 'ЗАКРЫТО',
  'НЕЗАМЕДЛИТЕЛЬНО',
];

const ERROR_DESCRIPTIONS = [
  'Потеряно соединение с игровым сервером. Проверьте стабильность интернет-подключения и повторите попытку.',
  'Не удалось получить видеопоток от облачного сервера. Пропускная способность канала ниже минимально допустимой.',
  'Превышено время ожидания ответа от узла рендеринга. Сеанс может быть завершён принудительно.',
  'Сбой графического драйвера на стороне облачной платформы. Код ошибки: GPU-0x0000007E.',
  'Недостаточно памяти для запуска игровой сессии. Закройте другие приложения и повторите запуск.',
  'Обнаружено несоответствие версии клиента и игрового сервера. Требуется обновление приложения.',
  'Лицензия на запуск этой игры не подтверждена. Доступ к игровому сеансу ограничен.',
  'Ошибка синхронизации ввода: команды управления не передаются на сервер.',
  'Потери пакетов превысили допустимый порог (более 38%). Качество трансляции не может быть обеспечено.',
  'Запрос на запуск отклонён: на выбранном игровом узле нет свободных слотов.',
  'Не удалось инициализировать декодер видео. Формат потока не поддерживается устройством.',
  'Игровой процесс завершился с ошибкой. Код выхода: 0xC0000005 (нарушение прав доступа к памяти).',
  'Сетевой экран блокирует исходящие соединения на порты потоковой передачи (47998–48000).',
  'Не удалось сохранить прогресс в облачное хранилище. Данные текущей сессии могут быть утеряны.',
];

// Интервалы между ошибками сокращены в 1,8 раза
const GAP_SCALE = 1.8;
const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface ErrorWin {
  id: number;
  title: string;
  desc: string;
  code: string;
  x: number;
  y: number;
  style: 'light' | 'dark';
}

type Stage = 'list' | 'page' | 'loading' | 'running';

export const CloudGamingTool: React.FC<ToolProps> = ({ onClose }) => {
  const [stage, setStage] = useState<Stage>('list');
  const [game, setGame] = useState<Game | null>(null);
  const [errors, setErrors] = useState<ErrorWin[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const addError = useCallback(() => {
    const id = ++idRef.current;
    const w = 280;
    const maxX = Math.max(0, window.innerWidth - w - 8);
    const maxY = Math.max(0, window.innerHeight - 190);
    const win: ErrorWin = {
      id,
      title: pick(ERROR_TITLES),
      desc: pick(ERROR_DESCRIPTIONS),
      code: `CG-${Math.floor(rnd(1000, 9999))}`,
      x: Math.floor(rnd(4, maxX)),
      y: Math.floor(rnd(48, Math.max(60, maxY))),
      style: Math.random() > 0.5 ? 'light' : 'dark',
    };
    setErrors((prev) => [...prev.slice(-79), win]);
  }, []);

  const startErrorLoop = useCallback(() => {
    const loop = () => {
      addError();
      timersRef.current.push(window.setTimeout(loop, Math.floor(rnd(500, 1700) / GAP_SCALE)));
    };
    timersRef.current.push(window.setTimeout(loop, Math.floor(rnd(2600, 3400))));
  }, [addError]);

  const play = () => {
    clearTimers();
    setErrors([]);
    setStage('loading');
    timersRef.current.push(
      window.setTimeout(() => {
        setStage('running');
        startErrorLoop();
      }, Math.floor(rnd(6000, 9000)))
    );
  };

  const closeGameWindow = () => {
    clearTimers();
    setErrors([]);
    setStage('page');
  };

  return (
    <ToolWrapper title="Облачный гейминг" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      {/* LIST */}
      {stage === 'list' && (
        <div className="max-w-md mx-auto w-full flex-1 overflow-y-auto py-3 space-y-2">
          <span className="text-xs font-black text-emerald-400 uppercase block mb-1">Каталог игр</span>
          {GAMES.map((g) => (
            <button
              key={g.title}
              onClick={() => {
                setGame(g);
                setStage('page');
              }}
              className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-emerald-500/60 p-3 flex items-center gap-3 rounded-2xl text-left cursor-pointer transition-colors"
            >
              <span className="text-3xl">{g.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-white truncate">{g.title}</span>
                <span className="block text-[11px] text-slate-400 truncate">{g.genre}</span>
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {g.rating}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* GAME PAGE */}
      {stage === 'page' && game && (
        <div className="max-w-md mx-auto w-full flex-1 overflow-y-auto py-3">
          <button
            onClick={() => setStage('list')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> К каталогу
          </button>
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-6xl mb-3">{game.icon}</div>
            <h2 className="text-xl font-black text-white">{game.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{game.genre}</p>
            <div className="flex items-center justify-center gap-5 mt-4 text-xs">
              <div>
                <div className="text-amber-400 font-bold flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {game.rating}
                </div>
                <div className="text-slate-500">Рейтинг</div>
              </div>
              <div>
                <div className="text-white font-bold">{game.size}</div>
                <div className="text-slate-500">Размер</div>
              </div>
              <div>
                <div className="text-white font-bold">Облако</div>
                <div className="text-slate-500">Запуск</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-5 leading-relaxed">{game.desc}</p>
            <button
              onClick={play}
              className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4 fill-current" /> Играть
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {stage === 'loading' && game && (
        <div className="fixed inset-0 z-50 bg-[#05060a] flex flex-col items-center justify-center p-6">
          <div className="text-5xl mb-6">{game.icon}</div>
          <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-emerald-400 animate-spin" />
          <div className="mt-5 text-sm text-slate-300 font-bold">{game.title}</div>
          <p className="absolute bottom-5 left-5 right-5 text-center text-[10px] leading-snug text-slate-500">
            Внимание: при нестабильном или медленном интернет-соединении возможны ошибки подключения, потеря кадров,
            задержка управления и принудительное завершение игрового сеанса. Для корректной работы рекомендуется
            стабильный канал со скоростью не менее 100 Мбит/с.
          </p>
        </div>
      )}

      {/* RUNNING (black screen, then errors) */}
      {stage === 'running' && game && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-white/[0.05] backdrop-blur-xl border-b border-white/10">
            <span className="text-sm font-bold text-white truncate">{game.title}</span>
            <button
              onClick={closeGameWindow}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-red-600 rounded cursor-pointer"
              aria-label="Закрыть игру"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-black" />
        </div>
      )}

      {/* ERROR WINDOWS */}
      {stage === 'running' &&
        errors.map((e, i) => (
          <div
            key={e.id}
            className={`fixed w-[280px] rounded-lg shadow-2xl border overflow-hidden ${
              e.style === 'light' ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-800 text-white border-slate-600'
            }`}
            style={{ left: e.x, top: e.y, zIndex: 60 + i }}
          >
            <div
              className={`flex items-center justify-between px-2.5 py-1.5 ${
                e.style === 'light' ? 'bg-red-600 text-white' : 'bg-red-700 text-white'
              }`}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-black tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                {e.title}
              </span>
              <button
                onClick={() => setErrors((prev) => prev.filter((x) => x.id !== e.id))}
                className="p-0.5 hover:bg-black/25 rounded cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3 text-[11px] leading-snug">
              <p>{e.desc}</p>
              <p className={`mt-2 font-mono text-[10px] ${e.style === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Код: {e.code}
              </p>
            </div>
          </div>
        ))}
    </ToolWrapper>
  );
};
