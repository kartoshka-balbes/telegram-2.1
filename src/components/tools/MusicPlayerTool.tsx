import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Home,
  History,
  Search,
  Library,
  AudioLines,
  Bell,
  ArrowLeft,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Flag,
  Repeat,
  Mic,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  ListPlus,
  ListMusic,
  Heart,
  Download,
  EyeOff,
  Star,
  Ban,
  Share2,
  User,
  AlertTriangle,
  X,
} from 'lucide-react';

interface ToolProps {
  onClose: () => void;
  userAvatar?: string;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  album?: string;
  emoji: string;
  hue: number;
  duration: number; // сек
  kind?: 'music' | 'podcast' | 'book';
}

const RAW: Array<[string, string, string | undefined, string]> = [
  ['Говновоз', 'Олег Газманов', undefined, '🚛'],
  ['Уральские пельмени phonk', 'Уральские пельмени', undefined, '🥟'],
  ['Уральские пельмени', 'Уральские пельмени', undefined, '🥟'],
  ['Спанч Боб', 'Губка Боб', 'Саундтрек сериала', '🧽'],
  ['Moonlight', 'Ludwig van Beethoven', 'Piano Sonata No. 14', '🌙'],
  ['Chop Suey!', 'System of a Down', 'Toxicity', '🎸'],
  ['Смешарики', 'Смешарики', 'Саундтрек мультсериала', '🐰'],
  ['Реальные пацаны', 'Саундтрек сериала', undefined, '🧢'],
  ['Интерны', 'Саундтрек сериала', undefined, '🩺'],
  ['Всё идёт по плану', 'Егор Летов', 'Сто лет одиночества', '🖤'],
  ['Subway Surfers', 'Игровой саундтрек', undefined, '🏃'],
  ['Говновоз (рок ремикс)', 'Олег Газманов', undefined, '🤘'],
  ['Barbie Girl', 'Aqua', 'Aquarium', '💖'],
  ['Деревня дураков', 'Неизвестный исполнитель', undefined, '🏚️'],
  ['Речь Ленина на броневике', 'Исторический архив', undefined, '🎙️'],
  ['Обращение Жириновского к Бушу', 'Исторический архив', undefined, '🎤'],
  ['Натуральный блондин', 'Николай Басков', undefined, '👱'],
  ['Прощание славянки', 'Василий Агапкин', undefined, '🎺'],
  ['Звук обмакивания вареников в сметану', 'Звуки кухни', undefined, '🥄'],
  ['Пэрэдайс', 'Артур Пирожков', undefined, '🌴'],
  ['Мимимишки phonk', 'Мимимишки', undefined, '🐱'],
  ['Звук тишины — 10 часов', 'Тишина', undefined, '🔇'],
  ['Дора-дура', 'Дора', undefined, '🎒'],
  ['Ponos Deda (remix)', 'Ponos Deda', undefined, '👴'],
  ['Papercut', 'Linkin Park', 'Hybrid Theory', '📎'],
  ['Заставка GTA San Andreas', 'Rockstar Games', 'Grand Theft Auto: San Andreas', '🌴'],
  ['Brawl Stars — Menu Theme', 'Supercell', 'Brawl Stars OST', '⭐'],
  ['Clash Royale — Menu Theme', 'Supercell', 'Clash Royale OST', '👑'],
  ['Звуки ошибок Windows XP', 'Microsoft', 'Системные звуки Windows XP', '🪟'],
  ['Песня про Бравл Старс', 'Неизвестный исполнитель', undefined, '🎤'],
];

const TRACKS: Track[] = RAW.map(([title, artist, album, emoji], i) => ({
  id: i,
  title,
  artist,
  album,
  emoji,
  hue: (i * 47) % 360,
  duration: 150 + ((i * 37) % 120),
}));

const AUDIO_RAW: Array<[string, string, string | undefined, string, number, 'podcast' | 'book']> = [
  ['Выпуск 42: Архитектура распределённых микросервисов', 'Tech Architecture Podcast', undefined, '🎙️', 42 * 60 + 15, 'podcast'],
  ['Тайны квантовой физики и борща', 'Теория Всего', undefined, '🌌', 58 * 60, 'podcast'],
  ['Машинное обучение для котов', 'AI Daily', undefined, '🤖', 31 * 60 + 40, 'podcast'],
  ['Война и мир (Том 1)', 'Лев Толстой', 'Читает Алексей Чтивец', '📖', 28 * 3600 + 15 * 60, 'book'],
  ['Мастер и Маргарита', 'Михаил Булгаков', 'Читает Сергей Чонишвили', '🧹', 14 * 3600 + 50 * 60, 'book'],
  ['Маленький принц', 'Антуан де Сент-Экзюпери', 'Читает Вениамин Смехов', '👑', 2 * 3600 + 10 * 60, 'book'],
];

const AUDIO_TRACKS: Track[] = AUDIO_RAW.map(([title, artist, album, emoji, duration, kind], i) => ({
  id: 100 + i,
  title,
  artist,
  album,
  emoji,
  hue: (i * 61 + 260) % 360,
  duration,
  kind,
}));

const LIB_IDX = ['Chop Suey!', 'Barbie Girl', 'Всё идёт по плану', 'Moonlight'].map((t) => Math.max(0, TRACKS.findIndex((x) => x.title === t)));

const FIND_RESULTS = RAW.map(([title, artist]) => `${artist} — ${title}`);

type ThemeId = 'ytm' | 'spotify' | 'vk' | 'yandex' | 'zaycev' | 'audio';

interface Theme {
  name: string;
  accent: string;
  accentText: string;
  bg: string;
  bg2: string;
  text: string;
  sub: string;
  surface: string;
}

const THEMES: Record<ThemeId, Theme> = {
  ytm: { name: 'YouTube Music', accent: '#ff2a2a', accentText: '#ffffff', bg: '#0b0405', bg2: '#3a0b0e', text: '#ffffff', sub: '#c7a3a5', surface: 'rgba(255,255,255,0.08)' },
  spotify: { name: 'Spotify', accent: '#1ed760', accentText: '#04140a', bg: '#040a06', bg2: '#0b3a1d', text: '#ffffff', sub: '#9fc7ad', surface: 'rgba(255,255,255,0.08)' },
  vk: { name: 'VK Музыка', accent: '#2aa8ff', accentText: '#03111f', bg: '#030d18', bg2: '#0a3a63', text: '#ffffff', sub: '#9cbbd6', surface: 'rgba(255,255,255,0.08)' },
  yandex: { name: 'Яндекс Музыка', accent: '#ffb300', accentText: '#1a0f00', bg: '#110a02', bg2: '#5a2a05', text: '#ffffff', sub: '#d1b48a', surface: 'rgba(255,255,255,0.09)' },
  audio: { name: 'Подкасты и книги', accent: '#b66bff', accentText: '#14041f', bg: '#09040f', bg2: '#3b1262', text: '#ffffff', sub: '#c2a6df', surface: 'rgba(255,255,255,0.09)' },
  zaycev: { name: 'zaycev.net', accent: '#1e88e5', accentText: '#ffffff', bg: '#f4f9ff', bg2: '#d6eaff', text: '#0c2a4a', sub: '#5b7b9b', surface: 'rgba(30,136,229,0.10)' },
};

type Page = 'home' | 'history' | 'search' | 'library' | 'find';

const NAV: Array<{ id: Page; label: string; Icon: React.ElementType }> = [
  { id: 'home', label: 'Главное', Icon: Home },
  { id: 'history', label: 'История', Icon: History },
  { id: 'search', label: 'Искать', Icon: Search },
  { id: 'library', label: 'Библиотека', Icon: Library },
  { id: 'find', label: 'Найти музыку', Icon: AudioLines },
];

const SHEET_ACTIONS: Array<{ id: string; label: string; Icon: React.ElementType; toast: string }> = [
  { id: 'like', label: 'Поставить лайк', Icon: ThumbsUp, toast: 'Лайк поставлен' },
  { id: 'dislike', label: 'Поставить дизлайк', Icon: ThumbsDown, toast: 'Дизлайк поставлен' },
  { id: 'subscribe', label: 'Подписаться', Icon: UserPlus, toast: 'Вы подписались' },
  { id: 'playlist', label: 'Добавить в плейлист', Icon: ListPlus, toast: 'Добавлено в плейлист' },
  { id: 'liked', label: 'Добавить в понравившееся', Icon: Heart, toast: 'Добавлено в понравившееся' },
  { id: 'report', label: 'Пожаловаться', Icon: Flag, toast: 'Жалоба отправлена' },
  { id: 'download', label: 'Скачать', Icon: Download, toast: 'Загрузка добавлена в очередь' },
  { id: 'notinterested', label: 'Не интересует', Icon: EyeOff, toast: 'Мы учтём ваш выбор' },
  { id: 'interested', label: 'Интересует', Icon: Star, toast: 'Теперь все треки отмечены как интересные' },
  { id: 'noartist', label: 'Не рекомендовать этого исполнителя', Icon: Ban, toast: 'Исполнитель скрыт из рекомендаций' },
  { id: 'share', label: 'Поделиться', Icon: Share2, toast: 'Ссылка скопирована' },
  { id: 'queue', label: 'Добавить в очередь', Icon: ListMusic, toast: 'Добавлено в очередь' },
  { id: 'artist', label: 'Перейти на страницу исполнителя', Icon: User, toast: 'Страница исполнителя недоступна' },
];

const ERRORS = [
  'Устройство не поддерживает формат файла (FLAC, 24 бит / 96 кГц).',
  'Устройство не поддерживает формат файла (ALAC, .m4a).',
  'Устройство не поддерживает формат файла (OGG Opus, .opus).',
  'Устройство не поддерживает формат файла (DSD, .dsf).',
];

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (s: number) =>
  s >= 3600
    ? `${Math.floor(s / 3600)}:${pad(Math.floor((s % 3600) / 60))}:${pad(Math.floor(s % 60))}`
    : `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
const fmtDate = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

const Cover: React.FC<{ t: Track; className?: string; size?: string }> = ({ t, className = '', size = 'text-4xl' }) => (
  <div
    className={`aspect-square flex items-center justify-center ${size} ${className}`}
    style={{ background: `linear-gradient(135deg, hsl(${t.hue} 70% 48%), hsl(${(t.hue + 50) % 360} 70% 28%))` }}
  >
    <span className="drop-shadow-lg">{t.emoji}</span>
  </div>
);

export const MusicPlayerTool: React.FC<ToolProps> = ({ onClose, userAvatar = '🐵' }) => {
  const [themeId, setThemeId] = useState<ThemeId>('ytm');
  const th = THEMES[themeId];
  const [page, setPage] = useState<Page>('home');
  const [interested, setInterested] = useState(false);

  // плеер
  const [queue, setQueue] = useState<Track[]>(TRACKS);
  const [playerIdx, setPlayerIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [pos, setPos] = useState(0);
  const [repeat, setRepeat] = useState(false);

  // панель действий
  const [sheetTrack, setSheetTrack] = useState<Track | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // прочее
  const [showBell, setShowBell] = useState(false);
  const [query, setQuery] = useState('');
  const [libError, setLibError] = useState<string | null>(null);
  const [findState, setFindState] = useState<'idle' | 'listening' | 'result'>('idle');
  const [findResult, setFindResult] = useState('');

  const longPressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  const [historyTrack] = useState<Track>(() => TRACKS[Math.floor(Math.random() * TRACKS.length)]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  // работающий прогресс
  useEffect(() => {
    if (playerIdx === null || !playing) return;
    const id = window.setInterval(() => {
      setPos((p) => {
        const dur = queue[playerIdx].duration;
        if (p + 0.25 >= dur) {
          if (repeat) return 0;
          setPlayerIdx((i) => (i === null ? i : (i + 1) % queue.length));
          return 0;
        }
        return p + 0.25;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [playerIdx, playing, repeat, queue]);

  const openPlayer = (idx: number, list: Track[] = TRACKS) => {
    setQueue(list);
    setPlayerIdx(idx);
    setPos(0);
    setPlaying(true);
  };

  const step = (d: number) => {
    setPlayerIdx((i) => (i === null ? i : (i + d + queue.length) % queue.length));
    setPos(0);
  };

  // долгое удержание
  const pressStart = (t: Track) => {
    longPressed.current = false;
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      setSheetTrack(t);
    }, 450);
  };
  const pressEnd = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const runAction = (a: (typeof SHEET_ACTIONS)[number]) => {
    setFlashId(a.id);
    if (a.id === 'interested') setInterested(true);
    if (a.id === 'notinterested') setInterested(false);
    window.setTimeout(() => {
      setFlashId(null);
      setSheetTrack(null);
      setToast(a.toast);
    }, 160);
  };

  const startFind = () => {
    setFindState('listening');
    const ms = 5000 + Math.floor(Math.random() * 1000);
    window.setTimeout(() => {
      setFindResult(FIND_RESULTS[Math.floor(Math.random() * FIND_RESULTS.length)]);
      setFindState('result');
    }, ms);
  };

  const historyCount = (() => {
    const start = new Date(2000, 1, 13).getTime();
    return Math.floor((Date.now() - start) / 86400000) + 1;
  })();
  const [historyVisible, setHistoryVisible] = useState(60);
  const onHistoryScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      if (el.scrollTop + el.clientHeight > el.scrollHeight - 500) {
        setHistoryVisible((v) => Math.min(historyCount, v + 80));
      }
    },
    [historyCount]
  );

  const avatarIsImg = userAvatar && (userAvatar.startsWith('data:') || userAvatar.startsWith('http') || userAvatar.startsWith('blob:') || userAvatar.startsWith('/'));

  const rootStyle: React.CSSProperties = {
    background: `linear-gradient(180deg, ${th.bg2} 0%, ${th.bg} 55%)`,
    color: th.text,
  };

  const track = playerIdx !== null ? queue[playerIdx] : null;

  return (
    <div className="fixed inset-0 z-40 flex select-none transition-colors duration-500" style={rootStyle}>
      {/* ЛЕВЫЙ БАР */}
      <aside className="w-[72px] shrink-0 flex flex-col items-center gap-1 py-3" style={{ background: 'rgba(0,0,0,0.18)' }}>
        {NAV.map(({ id, label, Icon }) => {
          const on = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className="w-[64px] py-2.5 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-colors"
              style={{ background: on ? th.surface : 'transparent', color: on ? th.accent : th.sub }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] leading-tight text-center font-medium px-0.5">{label}</span>
            </button>
          );
        })}
      </aside>

      {/* ОСНОВНАЯ ОБЛАСТЬ */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Верх: назад / уведомления / аккаунт */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
          <button onClick={onClose} className="p-2 rounded-full cursor-pointer" style={{ background: th.surface }} aria-label="Назад">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowBell(!showBell)}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: th.surface }}
              aria-label="Уведомления"
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-xl" style={{ background: th.surface }}>
              {avatarIsImg ? <img src={userAvatar} alt="" className="w-full h-full object-cover" /> : <span>{userAvatar}</span>}
            </div>
            {showBell && (
              <div
                className="absolute right-0 top-12 w-56 rounded-2xl p-4 text-center text-xs z-30 shadow-2xl"
                style={{ background: th.bg2, border: `1px solid ${th.surface}`, color: th.sub }}
              >
                Уведомлений нет
              </div>
            )}
          </div>
        </div>

        {/* Вкладки сервисов: меняют цветовую гамму */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2 shrink-0">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const on = themeId === id;
            return (
              <button
                key={id}
                onClick={() => setThemeId(id)}
                className="px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
                style={on ? { background: th.accent, color: th.accentText } : { background: th.surface, color: th.text }}
              >
                {THEMES[id].name}
              </button>
            );
          })}
        </div>

        {/* СТРАНИЦЫ */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-6" onScroll={page === 'history' ? onHistoryScroll : undefined}>
          {/* ГЛАВНОЕ */}
          {page === 'home' && themeId === 'audio' && (
            <div className="pt-2 space-y-5">
              {([
                ['Подкасты', 'podcast'],
                ['Аудиокниги', 'book'],
              ] as const).map(([label, kind]) => (
                <div key={kind}>
                  <div className="text-sm font-semibold mb-2" style={{ color: th.sub }}>
                    {label}
                  </div>
                  <div className="grid grid-cols-3 landscape:grid-cols-5 gap-3">
                    {AUDIO_TRACKS.filter((t) => t.kind === kind).map((t) => {
                      const i = AUDIO_TRACKS.indexOf(t);
                      return (
                        <div
                          key={t.id}
                          className="min-w-0 cursor-pointer"
                          onPointerDown={() => pressStart(t)}
                          onPointerUp={pressEnd}
                          onPointerLeave={pressEnd}
                          onPointerCancel={pressEnd}
                          onContextMenu={(e) => e.preventDefault()}
                          onClick={() => {
                            if (longPressed.current) {
                              longPressed.current = false;
                              return;
                            }
                            openPlayer(i, AUDIO_TRACKS);
                          }}
                        >
                          <Cover t={t} className="w-full rounded-md" />
                          <div className="mt-1 text-[10px] leading-tight truncate text-white">{t.title}</div>
                          <div className="text-[9px] leading-tight truncate" style={{ color: th.sub }}>
                            {t.artist}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {page === 'home' && themeId !== 'audio' && (
            <div className="grid grid-cols-3 landscape:grid-cols-5 gap-3 pt-2">
              {TRACKS.map((t, i) => (
                <div
                  key={t.id}
                  className="min-w-0 cursor-pointer"
                  onPointerDown={() => pressStart(t)}
                  onPointerUp={pressEnd}
                  onPointerLeave={pressEnd}
                  onPointerCancel={pressEnd}
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={() => {
                    if (longPressed.current) {
                      longPressed.current = false;
                      return;
                    }
                    openPlayer(i);
                  }}
                >
                  <div className="relative">
                    <Cover t={t} className="w-full rounded-md" />
                    {interested && (
                      <span className="absolute top-1 right-1 text-[11px]" style={{ color: th.accent }}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[10px] leading-tight truncate" style={{ color: themeId === 'zaycev' ? th.text : '#ffffff' }}>
                    {t.title}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ИСТОРИЯ */}
          {page === 'history' && (
            <div className="pt-2">
              {Array.from({ length: Math.min(historyVisible, historyCount) }, (_, i) => {
                const d = new Date(Date.now() - i * 86400000);
                return (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <Cover t={historyTrack} className="w-11 rounded-md shrink-0" size="text-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{historyTrack.title}</div>
                      <div className="text-xs truncate" style={{ color: th.sub }}>
                        {historyTrack.artist}
                      </div>
                    </div>
                    <div className="text-[11px] shrink-0 tabular-nums" style={{ color: th.sub }}>
                      {fmtDate(d)}
                    </div>
                  </div>
                );
              })}
              <div className="py-6 text-center text-xs" style={{ color: th.sub }}>
                {historyVisible >= historyCount ? 'История начинается с 13.02.2000' : 'Загрузка…'}
              </div>
            </div>
          )}

          {/* ПОИСК */}
          {page === 'search' && (
            <div className="pt-2">
              <div className="flex items-center rounded-full px-4 py-3" style={{ background: th.surface }}>
                <Search className="w-4 h-4 mr-2.5 shrink-0" style={{ color: th.sub }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск треков, исполнителей, альбомов"
                  className="w-full bg-transparent outline-none text-sm"
                  style={{ color: th.text }}
                />
              </div>
              {query.trim() && (
                <div className="mt-8 flex flex-col items-center text-center gap-2 px-4">
                  <AlertTriangle className="w-10 h-10" style={{ color: th.accent }} />
                  <div className="text-base font-semibold">Ошибка поиска</div>
                  <div className="text-sm" style={{ color: th.sub }}>
                    По запросу «{query.trim()}» таких результатов нет.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* БИБЛИОТЕКА */}
          {page === 'library' && (
            <div className="pt-2 space-y-5">
              <div>
                <div className="text-sm font-semibold mb-2" style={{ color: th.sub }}>
                  Скачанные песни
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {LIB_IDX.map((idx) => (
                    <button key={idx} onClick={() => setLibError(ERRORS[Math.floor(Math.random() * ERRORS.length)])} className="text-left cursor-pointer min-w-0">
                      <Cover t={TRACKS[idx]} className="w-full rounded-xl" size="text-6xl" />
                      <div className="mt-1.5 text-sm font-medium truncate">{TRACKS[idx].title}</div>
                      <div className="text-xs truncate" style={{ color: th.sub }}>
                        {TRACKS[idx].artist}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2" style={{ color: th.sub }}>
                  Альбомы
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {LIB_IDX.map((idx, k) => (
                    <button key={`al${idx}`} onClick={() => setLibError(ERRORS[Math.floor(Math.random() * ERRORS.length)])} className="text-left cursor-pointer min-w-0">
                      <Cover t={{ ...TRACKS[idx], hue: (TRACKS[idx].hue + 120 + k * 20) % 360, emoji: '💿' }} className="w-full rounded-xl" size="text-6xl" />
                      <div className="mt-1.5 text-sm font-medium truncate">{TRACKS[idx].album || TRACKS[idx].title}</div>
                      <div className="text-xs truncate" style={{ color: th.sub }}>
                        Альбом · {TRACKS[idx].artist}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* НАЙТИ МУЗЫКУ */}
          {page === 'find' && (
            <div className="pt-6 flex flex-col items-center text-center gap-5">
              {findState !== 'result' && (
                <>
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {findState === 'listening' && (
                      <>
                        <span className="absolute inset-0 rounded-full animate-ping" style={{ background: th.accent, opacity: 0.25 }} />
                        <span className="absolute inset-4 rounded-full animate-ping" style={{ background: th.accent, opacity: 0.3, animationDelay: '0.4s' }} />
                      </>
                    )}
                    <button
                      onClick={() => findState === 'idle' && startFind()}
                      className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl cursor-pointer active:scale-95 transition-transform"
                      style={{ background: th.accent, color: th.accentText, boxShadow: `0 20px 50px ${th.accent}66` }}
                      aria-label="Найти музыку"
                    >
                      <Mic className="w-14 h-14" />
                    </button>
                  </div>
                  <div className="text-base font-semibold">{findState === 'listening' ? 'Слушаю…' : 'Нажмите и напойте песню'}</div>
                  <div className="text-xs max-w-xs" style={{ color: th.sub }}>
                    {findState === 'listening' ? 'Продолжайте напевать мелодию' : 'Мы определим трек по вашему пению'}
                  </div>
                </>
              )}

              {findState === 'result' && (
                <div className="w-full max-w-xs flex flex-col items-center gap-3">
                  <div className="text-xs uppercase tracking-widest" style={{ color: th.sub }}>
                    Найдено
                  </div>
                  <div className="text-xl font-bold leading-snug">{findResult}</div>
                  <button
                    onClick={() => setFindState('idle')}
                    className="mt-2 px-6 py-3 rounded-full text-sm font-semibold cursor-pointer"
                    style={{ background: th.accent, color: th.accentText }}
                  >
                    Искать ещё
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ПЛЕЕР */}
      {track && (
        <div className="fixed inset-0 z-50 flex flex-col px-6 pt-5 pb-8" style={{ background: `linear-gradient(180deg, hsl(${track.hue} 55% 30%), ${th.bg} 70%)`, color: themeId === 'zaycev' ? '#ffffff' : th.text }}>
          <div className="flex items-start gap-3">
            <button onClick={() => setPlayerIdx(null)} className="p-2 rounded-full bg-black/25 cursor-pointer shrink-0" aria-label="Свернуть">
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="min-w-0 flex-1 text-center pr-10">
              <div className="text-lg font-bold leading-tight truncate">{track.title}</div>
              <div className="text-sm opacity-80 truncate">{track.artist}</div>
              {track.album && <div className="text-xs opacity-60 truncate">{track.album}</div>}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 min-h-0">
            <div className="relative w-full max-w-[320px]">
              <Cover t={track} className="w-full rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)]" size="text-[7rem]" />
              {interested && <Star className="absolute top-3 right-3 w-6 h-6 fill-current" style={{ color: th.accent }} />}
            </div>
          </div>

          {/* прогресс */}
          <div className="w-full max-w-md mx-auto">
            <input
              type="range"
              min={0}
              max={track.duration}
              step={0.25}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: th.accent }}
              aria-label="Прогресс"
            />
            <div className="flex justify-between text-xs opacity-75 tabular-nums -mt-0.5">
              <span>{fmt(pos)}</span>
              <span>{fmt(track.duration)}</span>
            </div>
          </div>

          {/* управление: пожаловаться — назад — пауза — вперёд — повтор */}
          <div className="w-full max-w-md mx-auto mt-5 flex items-center justify-between">
            <button onClick={() => setToast('Жалоба отправлена')} className="p-3 rounded-full cursor-pointer opacity-80 hover:opacity-100" aria-label="Пожаловаться">
              <Flag className="w-6 h-6" />
            </button>
            <button onClick={() => step(-1)} className="p-3 rounded-full cursor-pointer" aria-label="Назад">
              <SkipBack className="w-8 h-8 fill-current" />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center cursor-pointer shadow-xl active:scale-95 transition-transform"
              style={{ background: '#ffffff', color: '#111111' }}
              aria-label="Пауза"
            >
              {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button onClick={() => step(1)} className="p-3 rounded-full cursor-pointer" aria-label="Вперёд">
              <SkipForward className="w-8 h-8 fill-current" />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className="p-3 rounded-full cursor-pointer"
              style={{ color: repeat ? th.accent : undefined, opacity: repeat ? 1 : 0.8 }}
              aria-label="Повтор"
            >
              <Repeat className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ПАНЕЛЬ ФУНКЦИЙ (долгое удержание) */}
      {sheetTrack && (
        <div className="fixed inset-0 z-[60] flex items-end" onClick={() => setSheetTrack(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-h-[78vh] overflow-y-auto rounded-t-3xl pt-3 pb-6"
            style={{ background: themeId === 'zaycev' ? '#ffffff' : '#1c1c1e', color: themeId === 'zaycev' ? '#0c2a4a' : '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-3 bg-current opacity-20" />
            <div className="flex items-center gap-3 px-5 pb-3">
              <Cover t={sheetTrack} className="w-12 rounded-md" size="text-2xl" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{sheetTrack.title}</div>
                <div className="text-xs opacity-60 truncate">{sheetTrack.artist}</div>
              </div>
            </div>
            {SHEET_ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => runAction(a)}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-left cursor-pointer transition-colors duration-100"
                style={{ background: flashId === a.id ? (themeId === 'zaycev' ? 'rgba(30,136,229,0.2)' : 'rgba(255,255,255,0.22)') : 'transparent' }}
              >
                <a.Icon className="w-5 h-5 shrink-0 opacity-90" />
                <span className="text-[15px]">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ОШИБКА БИБЛИОТЕКИ */}
      {libError && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-6" onClick={() => setLibError(null)}>
          <div className="w-full max-w-xs rounded-2xl p-5 text-center" style={{ background: '#1c1c1e', color: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <X className="w-6 h-6" />
            </div>
            <div className="text-base font-bold mb-1">Ошибка воспроизведения</div>
            <p className="text-sm text-gray-300 leading-relaxed">{libError}</p>
            <p className="text-[11px] text-gray-500 mt-2">Код ошибки: ERR_UNSUPPORTED_MEDIA_FORMAT</p>
            <button onClick={() => setLibError(null)} className="mt-4 w-full py-2.5 rounded-full bg-white/10 text-sm font-semibold cursor-pointer">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Тост */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-4 py-2 rounded-full text-xs font-medium bg-black/85 text-white shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
};
