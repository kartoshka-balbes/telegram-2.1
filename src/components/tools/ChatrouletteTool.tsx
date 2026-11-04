import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { SkipForward, MessageSquare, Wifi, Activity, Globe2, Users, Gauge, Clock, Cpu, ShieldCheck, Star, Mic } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Interlocutor {
  id: string;
  name: string;
  city: string;
  avatar: string;
  phrase: string;
  status: string;
}

const INTERLOCUTORS: Interlocutor[] = [
  { id: '1', name: 'Анатолий (48 лет)', city: 'Сыктывкар', avatar: '🧔', phrase: '«Привет, пацаны! Как погода в Москве?»', status: 'В сети' },
  { id: '2', name: 'Кот Валера', city: 'Коробка из-под обуви', avatar: '🐱', phrase: '«Мяу... (смотрит в камеру с глубоким уважением)»', status: 'Мурчит' },
  { id: '3', name: 'Инопланетянин Гоша', city: 'Галактика Андромеда', avatar: '👽', phrase: '«Здорово, земляне! Есть чё по закуске?»', status: 'Телепортируется' },
  { id: '4', name: 'Баба Зина', city: 'Воронеж', avatar: '👵', phrase: '«Ой, внучек! Ты почему без шапки сидишь?»', status: 'Пекёт пирожки' },
  { id: '5', name: 'C++ Программист', city: 'Тайная лаборатория', avatar: '👨‍💻', phrase: '«Сегфолт в строке 402... Ой, извини, перепутала вкладку.»', status: 'Компилирует' },
  { id: '6', name: 'DJ Шаурма', city: 'Ростов-на-Дону', avatar: '🎧', phrase: '«Вам с чесночным соусом или острым сделать?»', status: 'Крутит треки' },
  { id: '7', name: 'Капитан Буран', city: 'Северный полюс', avatar: '🎅', phrase: '«Хо-хо-хо! Холодно тут у вас в чате!»', status: 'Запрягает оленей' },
  { id: '8', name: 'Робот Аркадий', city: 'Иннополис', avatar: '🤖', phrase: '«01000010 0110100100... Перевожу: Привет!»', status: 'Заряжается' },
  { id: '9', name: 'Таинственный Ниндзя', city: 'Киото', avatar: '🥷', phrase: '«Меня здесь нет... Вы ничего не видели!»', status: 'Прячется в тени' },
  { id: '10', name: 'Шеф Повар Жан', city: 'Париж', avatar: '👨‍🍳', phrase: '«Бонжур! Это лучший круассан в вашей жизни!»', status: 'Готовит суфле' },
];

const GLITCH = '▒░▓█#@%&?§¤¶ΩЖЩЪ~^*+=<>/\\|0123456789';
const ZALGO = ['\u0336', '\u0337', '\u0338', '\u0489', '\u0335'];

const corrupt = (text: string, strength = 0.7): string =>
  text
    .split('')
    .map((ch) => {
      if (ch === ' ') return Math.random() < 0.3 ? '\u2591' : ' ';
      if (Math.random() < strength) return GLITCH[Math.floor(Math.random() * GLITCH.length)];
      return ch + (Math.random() < 0.5 ? ZALGO[Math.floor(Math.random() * ZALGO.length)] : '');
    })
    .join('');

const COUNTRIES: Array<[string, number]> = [
  ['Россия', 41],
  ['Казахстан', 12],
  ['Беларусь', 9],
  ['Узбекистан', 8],
  ['Армения', 6],
  ['Другие', 24],
];

const TICKER =
  'ВАЖНО: в чате запрещено показывать документы • Курс лампочки к борщу: 1 : 0,73 • Погода в вашей комнате: комната • Сегодня в сети рекордное число котов • Завтра ожидается послезавтра • Не забудьте помыть уши • Вы не робот? Мы тоже • Скорость интернета измерена линейкой';

const HOROSCOPE = [
  'Овен: сегодня вас никто не поймёт, и это нормально.',
  'Телец: избегайте синих предметов и красных, остальное можно.',
  'Близнецы: оба хотят пиццу, но заказывать будет третий.',
  'Рак: идите назад, там интереснее.',
  'Лев: вас заметят, как только вы выключите камеру.',
  'Дева: порядок на столе не спасёт вас от понедельника.',
];

const Noise: React.FC<{ avatar: string }> = ({ avatar }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = 96;
    const H = 72;
    c.width = W;
    c.height = H;
    const id = window.setInterval(() => {
      const img = ctx.createImageData(W, H);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v * (Math.random() < 0.08 ? 0.3 : 1);
        img.data[i + 2] = v * (Math.random() < 0.08 ? 1.4 : 1);
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      // горизонтальные разрывы
      for (let k = 0; k < 4; k++) {
        const y = Math.floor(Math.random() * H);
        const h = 1 + Math.floor(Math.random() * 6);
        const shift = Math.floor((Math.random() - 0.5) * 50);
        const strip = ctx.getImageData(0, y, W, h);
        ctx.putImageData(strip, shift, y);
        ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '255,0,80' : '0,255,200'},0.35)`;
        ctx.fillRect(0, y, W, 1);
      }
    }, 70);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={ref} className="w-full h-full block" style={{ imageRendering: 'pixelated', filter: 'contrast(1.6) saturate(1.8)' }} />
      <span className="absolute inset-0 flex items-center justify-center text-6xl opacity-[0.07] animate-pulse select-none">{avatar}</span>
    </div>
  );
};

const Bar: React.FC<{ v: number; color: string }> = ({ v, color }) => (
  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(2, Math.min(100, v))}%`, background: color }} />
  </div>
);

export const ChatrouletteTool: React.FC<ToolProps> = ({ onClose }) => {
  const [partnerIndex, setPartnerIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [online, setOnline] = useState(184392);
  const [ping, setPing] = useState(48);
  const [loss, setLoss] = useState(37);
  const [bitrate, setBitrate] = useState(212);
  const [load, setLoad] = useState(73);
  const [seconds, setSeconds] = useState(0);
  const [msgNoise, setMsgNoise] = useState('');
  const [chatsToday, setChatsToday] = useState(1);
  const [loadPct, setLoadPct] = useState(3);
  const [filters, setFilters] = useState({ male: true, female: true, adult: true });

  const partner = INTERLOCUTORS[partnerIndex];

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      setOnline((o) => Math.max(1000, o + Math.floor((Math.random() - 0.45) * 900)));
      setPing((p) => Math.max(11, Math.min(990, Math.round(p + (Math.random() - 0.4) * 60))));
      setLoss((l) => Math.max(5, Math.min(95, Math.round(l + (Math.random() - 0.5) * 20))));
      setBitrate((b) => Math.max(8, Math.min(900, Math.round(b + (Math.random() - 0.5) * 90))));
      setLoad((l) => Math.max(20, Math.min(99, Math.round(l + (Math.random() - 0.5) * 14))));
      setSeconds((s) => s + 1);
      // загрузка «зависает» на низких значениях
      setLoadPct((p) => (Math.random() < 0.15 ? Math.min(11, p + 1) : p));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // сообщение собеседника не загружается: постоянные сильные помехи
  useEffect(() => {
    const id = window.setInterval(() => setMsgNoise(corrupt(partner.phrase, 0.72)), 110);
    return () => window.clearInterval(id);
  }, [partner]);

  const handleNext = () => {
    soundManager.playBeep(1200, 0.1);
    setPartnerIndex((prev) => (prev + 1) % INTERLOCUTORS.length);
    setLoadPct(1);
    setChatsToday((c) => c + 1);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const card = 'bg-white/[0.05] border border-white/10 rounded-2xl p-2.5';
  const tickerOffset = -(tick * 24) % 1400;

  return (
    <ToolWrapper title="Чат-рулетка (Видеосвязь онлайн)" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-1 font-sans text-xs select-none space-y-2">
        {/* Бегущая строка */}
        <div className="overflow-hidden rounded-full bg-black/40 border border-white/10 py-1.5">
          <div className="whitespace-nowrap text-[10px] text-amber-300 font-semibold" style={{ transform: `translateX(${tickerOffset}px)` }}>
            {TICKER} • {TICKER}
          </div>
        </div>

        {/* Статус сети */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            [Users, 'Онлайн', online.toLocaleString('ru-RU')],
            [Wifi, 'Пинг', `${ping} мс`],
            [Activity, 'Потери', `${loss}%`],
            [Gauge, 'Битрейт', `${bitrate} кб/с`],
          ].map(([I, l, v], i) => {
            const Icon = I as React.ElementType;
            return (
              <div key={i} className={`${card} text-center`}>
                <Icon className="w-3.5 h-3.5 mx-auto text-sky-300" />
                <div className="text-[9px] text-gray-400 mt-0.5">{l as string}</div>
                <div className="text-[10px] font-bold text-white tabular-nums">{v as string}</div>
              </div>
            );
          })}
        </div>

        {/* Видео */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 border border-white/10 rounded-2xl h-40 p-2 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <span className="text-4xl">👨</span>
            <span className="text-[10px] text-gray-400 font-bold mt-2">Вы (Ваша камера)</span>
            <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="absolute bottom-1 right-1.5 text-[8px] text-gray-500 tabular-nums">REC {mm}:{ss}</span>
          </div>

          <div className="relative rounded-2xl h-40 overflow-hidden border border-[#8f9bff]/70 bg-black">
            <Noise avatar={partner.avatar} />
            <div className="absolute inset-x-0 top-0 p-1.5 flex justify-between text-[8px] font-bold text-white/90 bg-gradient-to-b from-black/70 to-transparent">
              <span className="truncate max-w-[70%]">{corrupt(partner.name, 0.45)}</span>
              <span className="text-red-400 animate-pulse">NO SIGNAL</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-[9px] text-white/90 font-semibold tabular-nums">Загрузка видео… {loadPct}%</div>
              <Bar v={loadPct} color="#f87171" />
            </div>
          </div>
        </div>

        {/* Сообщение собеседника */}
        <div className={`${card} space-y-1.5`}>
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5 text-[#8f9bff] font-bold uppercase">
              <MessageSquare className="w-3.5 h-3.5" /> Сообщение собеседника
            </span>
            <span className="text-red-300 tabular-nums">{loadPct}% загружено</span>
          </div>
          <div className="p-2.5 bg-black/40 border border-white/10 rounded-xl text-white/90 text-[12px] font-mono break-all leading-snug min-h-[40px]" style={{ textShadow: '1px 0 rgba(255,0,80,0.7), -1px 0 rgba(0,255,220,0.7)' }}>
            {msgNoise}
          </div>
          <div className="text-[9px] text-gray-500 flex items-center gap-1">
            <Mic className="w-3 h-3" /> Звук собеседника: {corrupt('не удалось расшифровать', 0.5)}
          </div>
        </div>

        {/* Профиль собеседника */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          <div className={card}><div className="text-gray-400 text-[9px]">Город</div><div className="text-white font-semibold truncate">{partner.city}</div></div>
          <div className={card}><div className="text-gray-400 text-[9px]">Статус</div><div className="text-white font-semibold truncate">{partner.status}</div></div>
          <div className={card}><div className="text-gray-400 text-[9px]">Рейтинг</div><div className="text-amber-300 font-semibold flex items-center gap-0.5"><Star className="w-3 h-3 fill-current" />{(3 + ((partnerIndex * 7) % 20) / 10).toFixed(1)}</div></div>
        </div>

        {/* Страны */}
        <div className={`${card} space-y-1.5`}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white"><Globe2 className="w-3.5 h-3.5 text-emerald-300" /> Распределение пользователей по странам</div>
          {COUNTRIES.map(([n, v]) => (
            <div key={n} className="flex items-center gap-2 text-[9px] text-gray-300">
              <span className="w-16 truncate">{n}</span>
              <div className="flex-1"><Bar v={v * 2} color="#34d399" /></div>
              <span className="w-7 text-right tabular-nums">{v}%</span>
            </div>
          ))}
        </div>

        {/* Серверы и система */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`${card} space-y-1.5`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white"><Cpu className="w-3.5 h-3.5 text-rose-300" /> Нагрузка сервера</div>
            <Bar v={load} color="#fb7185" />
            <div className="text-[9px] text-gray-400 tabular-nums">{load}% • очередь: {Math.floor(online / 977)}</div>
          </div>
          <div className={`${card} space-y-1.5`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white"><Clock className="w-3.5 h-3.5 text-sky-300" /> Сессия</div>
            <div className="text-lg font-bold text-white tabular-nums leading-none">{mm}:{ss}</div>
            <div className="text-[9px] text-gray-400">Чатов сегодня: {chatsToday}</div>
          </div>
        </div>

        {/* Фильтры */}
        <div className={`${card} space-y-1.5`}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Фильтры подбора</div>
          <div className="flex flex-wrap gap-1.5">
            {([
              ['male', 'Мужчины'],
              ['female', 'Женщины'],
              ['adult', '18+'],
            ] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilters((f) => ({ ...f, [k]: !f[k] }))}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${filters[k] ? 'bg-[#8f9bff] text-slate-950' : 'bg-white/10 text-gray-300'}`}
              >
                {label}
              </button>
            ))}
            {['Музыка', 'Игры', 'Коты', 'Борщ', 'Ничего'].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-[10px] bg-white/[0.06] text-gray-400">#{t}</span>
            ))}
          </div>
        </div>

        {/* Совет и гороскоп */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className={card}>
            <div className="font-bold text-amber-300 mb-0.5">Совет дня</div>
            <div className="text-gray-300 leading-snug">Не говорите собеседнику пароль, даже если он очень вежливо просит.</div>
          </div>
          <div className={card}>
            <div className="font-bold text-sky-300 mb-0.5">Гороскоп</div>
            <div className="text-gray-300 leading-snug">{HOROSCOPE[(partnerIndex + tick % 3) % HOROSCOPE.length]}</div>
          </div>
        </div>

        <div className={`${card} grid grid-cols-3 gap-1 text-center text-[9px] text-gray-400`}>
          <div>USD: <span className="text-white font-semibold">92,41</span></div>
          <div>EUR: <span className="text-white font-semibold">100,18</span></div>
          <div>BTC: <span className="text-white font-semibold">96 204</span></div>
          <div>Погода: <span className="text-white font-semibold">+{4 + (tick % 5)}°C</span></div>
          <div>Влажность: <span className="text-white font-semibold">{60 + (tick % 20)}%</span></div>
          <div>Ветер: <span className="text-white font-semibold">{2 + (tick % 7)} м/с</span></div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-extrabold text-xs uppercase rounded-full cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 sticky bottom-0"
        >
          <SkipForward className="w-5 h-5" />
          <span>Следующий собеседник</span>
        </button>
      </div>
    </ToolWrapper>
  );
};
