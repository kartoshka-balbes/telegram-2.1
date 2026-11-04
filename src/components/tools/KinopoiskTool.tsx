import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Play, Star, Film, X, Tv } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type ServiceType = 'all' | 'kinopoisk' | 'netflix' | 'prime' | 'wink' | 'start' | 'ivi' | 'smotrim';

const SERVICE_CATALOG: Record<
  Exclude<ServiceType, 'all'>,
  { name: string; color: string; movies: { title: string; rating: string; year: string; emoji: string }[] }
> = {
  kinopoisk: {
    name: 'Кинопоиск',
    color: 'from-orange-600 to-amber-600',
    movies: [
      { title: 'Интерстеллар', rating: '8.6', year: '2014', emoji: '🚀' },
      { title: 'Побег из Шоушенка', rating: '9.1', year: '1994', emoji: '🎬' },
      { title: 'Начало', rating: '8.7', year: '2010', emoji: '🌀' },
      { title: 'Тёмный рыцарь', rating: '8.5', year: '2008', emoji: '🦇' },
    ],
  },
  netflix: {
    name: 'Netflix',
    color: 'from-red-700 to-red-950',
    movies: [
      { title: 'Очень странные дела', rating: '8.7', year: '2016', emoji: '👾' },
      { title: 'Игра в кальмара', rating: '8.0', year: '2021', emoji: '🦑' },
      { title: 'Уэнсдэй', rating: '8.1', year: '2022', emoji: '🕷️' },
      { title: 'Черное зеркало', rating: '8.5', year: '2011', emoji: '📱' },
    ],
  },
  prime: {
    name: 'Prime Video',
    color: 'from-sky-700 to-blue-950',
    movies: [
      { title: 'Пацаны (The Boys)', rating: '8.7', year: '2019', emoji: '⚡' },
      { title: 'Властелин колец: Кольца власти', rating: '6.9', year: '2022', emoji: '💍' },
      { title: 'Джек Ричер', rating: '8.1', year: '2022', emoji: '🎯' },
      { title: 'Неуязвимый', rating: '8.7', year: '2021', emoji: '🦸' },
    ],
  },
  wink: {
    name: 'Wink',
    color: 'from-indigo-600 to-purple-900',
    movies: [
      { title: 'Слово пацана. Кровь на асфальте', rating: '8.3', year: '2023', emoji: '🧢' },
      { title: 'Фишер', rating: '7.8', year: '2023', emoji: '🌲' },
      { title: 'Библиотекарь', rating: '7.2', year: '2023', emoji: '📖' },
      { title: 'Грозный', rating: '7.6', year: '2020', emoji: '👑' },
    ],
  },
  start: {
    name: 'Start',
    color: 'from-rose-600 to-pink-900',
    movies: [
      { title: 'Вампиры средней полосы', rating: '8.2', year: '2021', emoji: '🧛' },
      { title: 'Содержанки', rating: '6.7', year: '2019', emoji: '💎' },
      { title: 'Жуки', rating: '7.9', year: '2019', emoji: '🐛' },
      { title: 'Против всех', rating: '7.4', year: '2023', emoji: '🏡' },
    ],
  },
  ivi: {
    name: 'Иви',
    color: 'from-fuchsia-600 to-purple-950',
    movies: [
      { title: 'И снова здравствуйте!', rating: '7.7', year: '2022', emoji: '🚑' },
      { title: 'Лада Гольд', rating: '7.5', year: '2023', emoji: '🚗' },
      { title: '13 клиническая', rating: '7.6', year: '2022', emoji: '🏥' },
      { title: 'Нежность', rating: '8.0', year: '2020', emoji: '💌' },
    ],
  },
  smotrim: {
    name: 'Смотрим',
    color: 'from-blue-600 to-slate-900',
    movies: [
      { title: 'Тихий Дон', rating: '8.1', year: '2015', emoji: '🐎' },
      { title: 'Екатерина', rating: '7.8', year: '2014', emoji: '👑' },
      { title: 'Оптимисты', rating: '7.3', year: '2017', emoji: '🕊️' },
      { title: 'Шаляпин', rating: '7.4', year: '2023', emoji: '🎭' },
    ],
  },
};

export const KinopoiskTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeService, setActiveService] = useState<ServiceType>('all');
  const [showForbiddenModal, setShowForbiddenModal] = useState(false);

  const handlePlayMovie = () => {
    soundManager.playSiren();
    setShowForbiddenModal(true);
  };

  const allMoviesCombined = Object.entries(SERVICE_CATALOG).flatMap(([key, catalog]) =>
    catalog.movies.map((m) => ({ ...m, serviceName: catalog.name }))
  );

  const displayMovies =
    activeService === 'all'
      ? allMoviesCombined
      : SERVICE_CATALOG[activeService].movies.map((m) => ({
          ...m,
          serviceName: SERVICE_CATALOG[activeService].name,
        }));

  return (
    <ToolWrapper title="Кинопоиск (Единая библиотека)" onClose={onClose} headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col gap-4 py-2 font-mono text-xs select-none">
        {/* Service Switcher Bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              soundManager.playBeep(900, 0.05);
              setActiveService('all');
            }}
            className={`px-3 py-2 font-black uppercase text-[11px] whitespace-nowrap cursor-pointer transition-colors border ${
              activeService === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                : 'bg-white/[0.05] backdrop-blur-xl text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            ⭐ Единая библиотека ({allMoviesCombined.length})
          </button>

          {(Object.keys(SERVICE_CATALOG) as Array<Exclude<ServiceType, 'all'>>).map((key) => {
            const s = SERVICE_CATALOG[key];
            const isActive = activeService === key;
            return (
              <button
                key={key}
                onClick={() => {
                  soundManager.playBeep(900, 0.05);
                  setActiveService(key);
                }}
                className={`px-3 py-2 font-black uppercase text-[11px] whitespace-nowrap cursor-pointer transition-colors border ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg'
                    : 'bg-white/[0.05] backdrop-blur-xl text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Браузерное окно на главной странице */}
        {activeService === 'all' && (
          <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#1b1f2b] shadow-2xl">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#252a3a]">
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </span>
              <div className="flex-1 min-w-0 rounded-full bg-black/30 px-3 py-1 text-[10px] text-gray-300 truncate">🔒 https://interny-serial.ru/</div>
              <a
                href="https://interny-serial.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-amber-300 hover:text-amber-200 whitespace-nowrap"
              >
                Открыть ↗
              </a>
            </div>
            <iframe
              title="Интерны"
              src="https://interny-serial.ru/"
              className="w-full h-[340px] bg-white block"
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}

        {/* Cinema Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-purple-700 to-indigo-900 rounded-none p-5 text-white shadow-2xl flex items-center justify-between border border-white/10">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider">
              {activeService === 'all' ? 'Объединённая кинотека' : SERVICE_CATALOG[activeService].name}
            </h1>
            <p className="text-xs opacity-80 mt-0.5">
              {activeService === 'all'
                ? 'Все фильмы и сериалы со всех стриминговых сервисов'
                : 'Официальный каталог фильмов и сериалов'}
            </p>
          </div>
          <Tv className="w-10 h-10 opacity-80 shrink-0" />
        </div>

        {/* Movies List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {displayMovies.map((movie, idx) => (
            <div
              key={idx}
              className="bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-cyan-500/60 p-3.5 flex flex-col justify-between shadow-xl group"
            >
              <div className="w-full aspect-video bg-black/30 border border-white/10 flex items-center justify-center text-5xl mb-2.5 group-hover:scale-105 transition-transform relative">
                {movie.emoji}
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-white/[0.045] text-amber-400 text-[9px] font-bold border border-white/10 rounded">
                  {movie.serviceName}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-bold">{movie.year}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <h3 className="text-white font-black text-xs mb-3 leading-tight truncate">
                  {movie.title}
                </h3>
              </div>
              <button
                onClick={handlePlayMovie}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center justify-center gap-1.5 uppercase text-[10px] tracking-wider cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Смотреть</span>
              </button>
            </div>
          ))}
        </div>

        {/* Forbidden Modal */}
        {showForbiddenModal && (
          <div className="fixed inset-0 bg-red-950/95 z-50 flex items-center justify-center p-6 animate-pulse">
            <div className="w-full max-w-md bg-white/[0.05] backdrop-blur-xl border-4 border-red-600 p-8 text-center shadow-2xl relative font-mono">
              <button
                onClick={() => setShowForbiddenModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-8xl mb-4">🚨</div>
              <h1 className="text-3xl font-black text-red-500 uppercase tracking-widest mb-6">
                ЗАПРЕЩЕНО
              </h1>
              <button
                onClick={() => setShowForbiddenModal(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
