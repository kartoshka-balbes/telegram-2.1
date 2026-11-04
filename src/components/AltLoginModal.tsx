import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Loader2, ServerCrash, ChevronLeft } from 'lucide-react';
import { triggerHaptic, soundManager } from '../utils/soundEffects';

interface Service {
  name: string;
  icon: string;
}

const SERVICES: Service[] = [
  { name: 'Woman.ru', icon: '🌸' }, { name: 'ВКонтакте', icon: '🔵' }, { name: 'Яндекс', icon: '🔴' },
  { name: 'Яндекс Учебник', icon: '📘' }, { name: 'Едадил', icon: '🛒' }, { name: 'Яндекс Пэй', icon: '💳' },
  { name: 'Яндекс Музыка', icon: '🎵' }, { name: 'Spotify', icon: '🎧' }, { name: 'YouTube Music', icon: '🎶' },
  { name: 'YouTube', icon: '▶️' }, { name: 'РЖД', icon: '🚆' }, { name: 'YouTube Kids', icon: '🧸' },
  { name: 'Xbox', icon: '🎮' }, { name: 'Microsoft', icon: '🪟' }, { name: 'ICQ', icon: '🌼' },
  { name: 'Telegram', icon: '✈️' }, { name: 'Internet Explorer', icon: '🌐' }, { name: 'Microsoft Edge', icon: '🌊' },
  { name: 'Blizzard', icon: '❄️' }, { name: 'NVIDIA', icon: '🟩' }, { name: 'Instagram', icon: '📷' },
  { name: 'X', icon: '✖️' }, { name: 'Threads', icon: '🧵' }, { name: 'VPN', icon: '🛡️' },
  { name: 'Claude', icon: '🟠' }, { name: 'ChatGPT', icon: '🤖' }, { name: 'Gemini', icon: '✨' },
  { name: 'Яндекс Алиса', icon: '🟣' }, { name: 'Grok', icon: '⚫' }, { name: 'Ozon', icon: '🔷' },
  { name: 'Wildberries', icon: '🟪' }, { name: 'Золотое Яблоко', icon: '🍎' }, { name: 'AliExpress', icon: '🧧' },
  { name: 'WeChat', icon: '💬' }, { name: 'Bingo', icon: '🎰' }, { name: 'qBittorrent', icon: '⬇️' },
  { name: 'Epic Games', icon: '🕹️' }, { name: 'Word', icon: '📝' }, { name: 'Excel', icon: '📊' },
  { name: 'PowerPoint', icon: '📽️' }, { name: 'Samsung', icon: '📱' }, { name: 'Apple Pay', icon: '' },
  { name: 'Apple ID', icon: '🍏' }, { name: 'КОМПАС', icon: '📐' }, { name: 'Калькулятор', icon: '🧮' },
  { name: 'Электронный дневник', icon: '📓' }, { name: 'Госуслуги', icon: '🏛️' }, { name: 'MAX', icon: '🟦' },
  { name: 'Авито', icon: '🛍️' }, { name: 'Facebook', icon: '📘' }, { name: 'TikTok', icon: '🎬' },
  { name: 'WhatsApp', icon: '📞' }, { name: 'Rockstar Games', icon: '⭐' }, { name: 'Viber', icon: '🟣' },
  { name: 'Bing', icon: '🔎' }, { name: 'Wikipedia', icon: '📖' }, { name: 'Yahoo', icon: '🟪' },
  { name: 'Reddit', icon: '👽' }, { name: '4chan', icon: '🍀' }, { name: 'Amazon Prime', icon: '📦' },
  { name: 'Netflix', icon: '🎞️' }, { name: 'ESPN', icon: '🏈' }, { name: 'Кинопоиск', icon: '🍿' },
  { name: 'Смотрим', icon: '📺' }, { name: 'Rutube', icon: '📹' }, { name: 'VK Видео', icon: '🎥' },
  { name: 'Pinterest', icon: '📌' }, { name: 'Дзен', icon: '🧘' }, { name: 'Twitch', icon: '👾' },
  { name: 'Canva', icon: '🎨' }, { name: 'Fandom', icon: '🧙' }, { name: 'Mail.ru', icon: '✉️' },
  { name: 'DuckDuckGo', icon: '🦆' }, { name: 'Zoom', icon: '💻' }, { name: 'GitHub', icon: '🐙' },
  { name: 'eBay', icon: '🏷️' }, { name: 'Google', icon: '🔍' }, { name: 'Gmail', icon: '📧' },
  { name: 'Huawei', icon: '🌺' }, { name: 'Walmart', icon: '🏬' }, { name: 'Tinder', icon: '🔥' },
  { name: 'Одноклассники', icon: '🟠' }, { name: 'Gismeteo', icon: '⛅' }, { name: 'Яндекс Маркет', icon: '🛒' },
  { name: 'РБК', icon: '📰' }, { name: 'DNS', icon: '🖥️' }, { name: 'Сбербанк', icon: '🟢' },
  { name: 'Т-Банк', icon: '🟡' }, { name: 'Альфа-Банк', icon: '🔺' }, { name: 'Пикабу', icon: '🟩' },
  { name: 'hh.ru', icon: '💼' }, { name: 'ivi', icon: '🎦' }, { name: 'Дром', icon: '🚗' },
  { name: '2ГИС', icon: '🗺️' }, { name: 'РИА Новости', icon: '🗞️' }, { name: 'RuStore', icon: '🛒' },
  { name: 'Лента', icon: '🥫' }, { name: 'ДомКлик', icon: '🏠' }, { name: 'Газета.Ru', icon: '📄' },
  { name: 'Roblox', icon: '🧱' }, { name: 'EA', icon: '⚽' },
];

interface Props {
  onClose: () => void;
  accent?: string;
}

export const AltLoginModal: React.FC<Props> = ({ onClose, accent = '#8f9bff' }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Service | null>(null);
  const [phase, setPhase] = useState<'loading' | 'busy'>('loading');
  const timerRef = useRef<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? SERVICES.filter((s) => s.name.toLowerCase().includes(q)) : SERVICES;
  }, [query]);

  const connect = (s: Service) => {
    triggerHaptic('tap');
    soundManager.playBeep(900, 0.05);
    setSelected(s);
    setPhase('loading');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setPhase('busy');
      triggerHaptic('heavy');
      soundManager.playBeep(350, 0.12);
    }, 1000 + Math.floor(Math.random() * 2000));
  };

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="w-full sm:max-w-md max-h-[88vh] bg-[#12141d] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 -ml-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Назад"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-base font-bold text-white truncate">
              {selected ? selected.name : 'Войти другим способом'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer" aria-label="Закрыть">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!selected ? (
          <>
            <div className="px-5 pb-3 shrink-0">
              <div className="flex items-center bg-black/30 border border-white/10 focus-within:border-white/30 rounded-2xl px-3 py-2.5">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск сервиса"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>
            <div className="px-4 pb-5 overflow-y-auto grid grid-cols-3 gap-2">
              {list.map((s) => (
                <button
                  key={s.name}
                  onClick={() => connect(s)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/5 hover:border-white/20 transition-colors cursor-pointer active:scale-95"
                >
                  <span className="text-2xl h-8 flex items-center">{s.icon || '🍎'}</span>
                  <span className="text-[11px] text-gray-200 text-center leading-tight line-clamp-2">{s.name}</span>
                </button>
              ))}
              {list.length === 0 && <div className="col-span-3 text-center text-sm text-gray-500 py-8">Ничего не найдено</div>}
            </div>
          </>
        ) : (
          <div className="px-6 pb-8 pt-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-4xl mb-5">
              {selected.icon || '🍎'}
            </div>
            {phase === 'loading' ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: accent }} />
                <p className="text-sm text-gray-300">Подключение к {selected.name}…</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3">
                  <ServerCrash className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Серверы заняты</h3>
                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                  Серверы {selected.name} сейчас перегружены из-за большого числа запросов. Не удалось выполнить вход. Повторите попытку позже.
                </p>
                <div className="flex gap-2 mt-6 w-full">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold cursor-pointer"
                  >
                    Другой способ
                  </button>
                  <button
                    onClick={() => connect(selected)}
                    className="flex-1 py-3 rounded-2xl text-black text-sm font-bold cursor-pointer"
                    style={{ background: accent }}
                  >
                    Повторить
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
