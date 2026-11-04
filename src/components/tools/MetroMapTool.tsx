import React, { useState, useEffect, useMemo } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Train, TriangleAlert, UserX, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

/* ---------- Схема (упрощённая карта московского метро) ---------- */

const CX = 170;
const CY = 190;
const CR = 58;

const CIRCLE: Array<[string, number]> = [
  ['Белорусская', -125],
  ['Новослободская', -100],
  ['Проспект Мира', -70],
  ['Комсомольская', -40],
  ['Курская', -10],
  ['Таганская', 20],
  ['Павелецкая', 50],
  ['Добрынинская', 80],
  ['Октябрьская', 110],
  ['Парк Культуры', 140],
  ['Киевская', 170],
  ['Краснопресненская', -155],
];

const circlePos = (deg: number): [number, number] => [
  Math.round(CX + CR * Math.cos((deg * Math.PI) / 180)),
  Math.round(CY + CR * Math.sin((deg * Math.PI) / 180)),
];

const POS: Record<string, [number, number]> = {};
CIRCLE.forEach(([n, d]) => (POS[n] = circlePos(d)));

const EXTRA: Record<string, [number, number]> = {
  'Бульвар Рокоссовского': [318, 38],
  Черкизовская: [306, 66],
  'Преображенская пл.': [294, 94],
  Сокольники: [278, 122],
  Красносельская: [250, 146],
  'Красные Ворота': [196, 168],
  'Чистые пруды': [182, 180],
  Лубянка: [166, 192],
  'Охотный Ряд': [152, 200],
  'Библиотека им. Ленина': [141, 210],
  Кропоткинская: [131, 219],
  Фрунзенская: [100, 246],
  Спортивная: [78, 260],
  'Воробьёвы горы': [52, 276],
  'Речной вокзал': [98, 18],
  'Водный стадион': [104, 42],
  Войковская: [112, 68],
  Сокол: [120, 92],
  Аэропорт: [130, 112],
  Динамо: [142, 128],
  Маяковская: [160, 160],
  Тверская: [154, 178],
  Театральная: [150, 196],
  Новокузнецкая: [158, 224],
  Автозаводская: [232, 258],
  Коломенская: [258, 278],
};
Object.assign(POS, EXTRA);

interface Line {
  name: string;
  color: string;
  css: string;
  stations: string[];
  loop?: boolean;
}

const LINES: Line[] = [
  {
    name: 'Сокольническая (Красная)',
    color: '#ef4444',
    css: 'bg-red-500',
    stations: ['Бульвар Рокоссовского', 'Черкизовская', 'Преображенская пл.', 'Сокольники', 'Красносельская', 'Комсомольская', 'Красные Ворота', 'Чистые пруды', 'Лубянка', 'Охотный Ряд', 'Библиотека им. Ленина', 'Кропоткинская', 'Парк Культуры', 'Фрунзенская', 'Спортивная', 'Воробьёвы горы'],
  },
  {
    name: 'Замоскворецкая (Зелёная)',
    color: '#22c55e',
    css: 'bg-emerald-500',
    stations: ['Речной вокзал', 'Водный стадион', 'Войковская', 'Сокол', 'Аэропорт', 'Динамо', 'Белорусская', 'Маяковская', 'Тверская', 'Театральная', 'Новокузнецкая', 'Павелецкая', 'Автозаводская', 'Коломенская'],
  },
  {
    name: 'Кольцевая (Коричневая)',
    color: '#a16207',
    css: 'bg-amber-700',
    loop: true,
    stations: CIRCLE.slice().sort((a, b) => a[1] - b[1]).map((c) => c[0]),
  },
];

interface MetroStation {
  id: string;
  name: string;
  line: string;
  css: string;
}

const STATIONS: MetroStation[] = [];
const seen = new Set<string>();
LINES.forEach((l) =>
  l.stations.forEach((s) => {
    if (seen.has(s)) return;
    seen.add(s);
    STATIONS.push({ id: String(STATIONS.length + 1), name: s, line: l.name, css: l.css });
  })
);

/* ---------- Поезда ---------- */

type TrainState = 'ok' | 'broken' | 'nodriver';

const TRAINS: Array<{ id: number; dir: string; state: TrainState }> = [
  { id: 101, dir: 'Бульвар Рокоссовского', state: 'ok' },
  { id: 102, dir: 'Воробьёвы горы', state: 'broken' },
  { id: 103, dir: 'Речной вокзал', state: 'ok' },
  { id: 104, dir: 'Коломенская', state: 'nodriver' },
  { id: 105, dir: 'Кольцевая (по часовой)', state: 'broken' },
  { id: 106, dir: 'Кольцевая (против часовой)', state: 'ok' },
  { id: 107, dir: 'Сокольники', state: 'nodriver' },
  { id: 108, dir: 'Автозаводская', state: 'broken' },
];

// Сломанный таймер: значения от 00:01 до 15:68
const randomBrokenTime = (): string => {
  let mm = 0;
  let ss = 0;
  do {
    mm = Math.floor(Math.random() * 16); // 0..15
    ss = Math.floor(Math.random() * 69); // 0..68
  } while (mm === 0 && ss === 0);
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};

export const MetroMapTool: React.FC<ToolProps> = ({ onClose }) => {
  const [fromStation, setFromStation] = useState(STATIONS.find((s) => s.name === 'Сокольники')!);
  const [toStation, setToStation] = useState(STATIONS.find((s) => s.name === 'Охотный Ряд')!);
  const [timeText, setTimeText] = useState(randomBrokenTime());
  const [selectedTrain, setSelectedTrain] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  // Таймер до следующего поезда всегда сломан: меняется каждые 2–3 секунды
  useEffect(() => {
    let id: number;
    const tick = () => {
      setTimeText(randomBrokenTime());
      id = window.setTimeout(tick, 2000 + Math.random() * 1000);
    };
    id = window.setTimeout(tick, 2000 + Math.random() * 1000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  const pickTrain = (t: (typeof TRAINS)[number]) => {
    soundManager.playBeep(t.state === 'ok' ? 1100 : 300, 0.1);
    setSelectedTrain(t.id);
    setToast(
      t.state === 'ok'
        ? `Вы сели в поезд №${t.id} → ${t.dir}`
        : t.state === 'broken'
        ? `Поезд №${t.id} неисправен. Посадка невозможна`
        : `В поезде №${t.id} нет машиниста. Посадка невозможна`
    );
  };

  const polyline = (l: Line) => {
    const pts = l.stations.map((s) => POS[s]).filter(Boolean);
    return pts.map((p) => p.join(',')).join(' ');
  };

  const highlight = useMemo(() => new Set([fromStation.name, toStation.name]), [fromStation, toStation]);

  return (
    <ToolWrapper title="Карта и схема метрополитена" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 text-xs select-none space-y-3">
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-none">
            <div className="px-4 py-3 rounded-2xl bg-[#1b1f33]/95 backdrop-blur-xl border border-white/15 text-white font-semibold text-xs text-center shadow-2xl">
              {toast}
            </div>
          </div>
        )}

        {/* Табло */}
        <div className="rounded-[1.75rem] bg-black/40 border border-red-500/40 p-4 space-y-3 shadow-2xl">
          <div className="flex justify-between items-center text-xs font-bold text-red-400">
            <span className="flex items-center gap-1.5">
              <Train className="w-4 h-4 animate-pulse" /> ТАБЛО ПРИБЫТИЯ ПОЕЗДА
            </span>
            <span className="text-white font-bold truncate ml-2">{fromStation.name}</span>
          </div>
          <div className="py-3 bg-black/40 border border-white/10 rounded-2xl text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Следующий поезд через:</div>
            <div className="text-4xl font-black text-amber-400 tracking-wider tabular-nums font-mono">{timeText}</div>
          </div>
        </div>

        {/* Карта */}
        <div className="rounded-[1.75rem] bg-white/[0.04] border border-white/10 p-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase block tracking-wider mb-2 px-1">Схема линий</span>
          <div className="rounded-2xl bg-[#0b0e1a] overflow-hidden">
            <svg viewBox="0 0 360 300" className="w-full block">
              {LINES.map((l) => (
                <polyline
                  key={l.name}
                  points={polyline(l) + (l.loop ? ' ' + POS[l.stations[0]].join(',') : '')}
                  fill="none"
                  stroke={l.color}
                  strokeWidth="5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              ))}
              {LINES.flatMap((l) =>
                l.stations.map((s) => {
                  const p = POS[s];
                  if (!p) return null;
                  const hl = highlight.has(s);
                  return (
                    <g key={l.name + s}>
                      <circle cx={p[0]} cy={p[1]} r={hl ? 6 : 3.2} fill="#0b0e1a" stroke={hl ? '#fff' : l.color} strokeWidth={hl ? 2.5 : 1.8} />
                      {hl && (
                        <text x={p[0] + 9} y={p[1] + 3} fontSize="9" fill="#fff" fontWeight="bold">
                          {s}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 px-1">
            {LINES.map((l) => (
              <span key={l.name} className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <span className={`w-2.5 h-2.5 rounded-full ${l.css}`} />
                {l.name}
              </span>
            ))}
          </div>
        </div>

        {/* Маршрут */}
        <div className="rounded-[1.75rem] bg-white/[0.05] border border-white/10 p-4 space-y-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase block tracking-wider">Расчёт времени в пути:</span>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['Откуда:', fromStation, setFromStation],
              ['Куда:', toStation, setToStation],
            ] as const).map(([label, val, setter]) => (
              <div key={label}>
                <label className="text-[10px] text-slate-400 block font-semibold mb-1">{label}</label>
                <select
                  value={val.id}
                  onChange={(e) => {
                    soundManager.playBeep(800, 0.05);
                    const st = STATIONS.find((s) => s.id === e.target.value);
                    if (st) setter(st);
                  }}
                  className="w-full bg-black/30 border border-white/10 text-white rounded-xl p-2 font-semibold outline-none text-xs"
                >
                  {STATIONS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#12151e]">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="p-3 bg-black/25 rounded-2xl flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-300">Время поездки:</span>
            <span className="text-emerald-400 font-bold">12 минут (1 пересадка)</span>
          </div>
        </div>

        {/* Выбор поезда */}
        <div className="rounded-[1.75rem] bg-white/[0.05] border border-white/10 p-4 space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase block tracking-wider">Выбор поезда</span>
          {TRAINS.map((t) => (
            <button
              key={t.id}
              onClick={() => pickTrain(t)}
              className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left cursor-pointer transition-all active:scale-[0.99] ${
                selectedTrain === t.id ? 'bg-white/[0.12] border-white/40' : 'bg-black/20 border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Train className="w-4 h-4 text-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold text-white">Поезд №{t.id}</span>
                <span className="block text-[10px] text-gray-400 truncate">→ {t.dir}</span>
              </span>
              {t.state === 'ok' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> В пути
                </span>
              )}
              {t.state === 'broken' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                  <TriangleAlert className="w-3.5 h-3.5" /> Сломан
                </span>
              )}
              {t.state === 'nodriver' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-300">
                  <UserX className="w-3.5 h-3.5" /> Без машиниста
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
