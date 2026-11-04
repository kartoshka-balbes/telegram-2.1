import React, { useState, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { CheckCircle, Users } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

const MAX_GUESTS = 392027351;
const pad = (n: number) => String(n).padStart(2, '0');

const ClockDial: React.FC<{
  hour: number;
  minute: number;
  mode: 'hour' | 'minute';
  onPick: (v: number) => void;
}> = ({ hour, minute, mode, onPick }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);

  const handle = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = clientX - (r.left + r.width / 2);
    const dy = clientY - (r.top + r.height / 2);
    let ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // 0 сверху
    if (ang < 0) ang += 360;
    if (mode === 'hour') {
      let h = Math.round(ang / 30) % 12;
      if (h === 0) h = 12;
      onPick(h);
    } else {
      onPick(Math.round(ang / 6) % 60);
    }
  };

  const handAng = mode === 'hour' ? ((hour % 12) / 12) * 360 : (minute / 60) * 360;
  const rad = ((handAng - 90) * Math.PI) / 180;
  const hx = 150 + 98 * Math.cos(rad);
  const hy = 150 + 98 * Math.sin(rad);

  const marks = mode === 'hour' ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)) : Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 300"
      className="w-full max-w-[320px] mx-auto touch-none cursor-pointer select-none"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        handle(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => dragging.current && handle(e.clientX, e.clientY)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <circle cx="150" cy="150" r="144" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <line x1="150" y1="150" x2={hx} y2={hy} stroke="#8f9bff" strokeWidth="4" strokeLinecap="round" />
      <circle cx={hx} cy={hy} r="24" fill="#8f9bff" />
      <circle cx="150" cy="150" r="6" fill="#8f9bff" />
      {marks.map((m, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const x = 150 + 98 * Math.cos(a);
        const y = 150 + 98 * Math.sin(a);
        const active = mode === 'hour' ? m === hour : m === Math.round(minute / 5) * 5 % 60 && minute % 5 === 0 && m === minute;
        return (
          <text key={i} x={x} y={y + 6} textAnchor="middle" fontSize="20" fontWeight="600" fill={active ? '#0b0d13' : '#e5e7eb'} style={{ pointerEvents: 'none' }}>
            {mode === 'minute' ? pad(m) : m}
          </text>
        );
      })}
    </svg>
  );
};

export const TableBookingTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [guests, setGuests] = useState(2);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [pm, setPm] = useState(true);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [booked, setBooked] = useState(false);

  const h24 = (hour % 12) + (pm ? 12 : 0);
  const time = `${pad(h24)}:${pad(minute)}`;

  const handleBook = () => {
    soundManager.playBeep(1200, 0.1);
    setBooked(true);
  };

  return (
    <ToolWrapper title="Помойка" onClose={onClose}>
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 select-none">
        {booked ? (
          <div className="rounded-[2rem] bg-white/[0.05] border border-white/15 p-6 text-center space-y-3 animate-in zoom-in">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Столик забронирован!</h3>
            <p className="text-sm text-gray-300">
              «Помойка» ждёт вас: {guests.toLocaleString('ru-RU')} чел. в {time}.
            </p>
            <button onClick={() => setBooked(false)} className="px-6 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-full cursor-pointer">
              Изменить бронь
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white/[0.05] p-4 rounded-3xl border border-white/10 flex items-center gap-3">
              <span className="text-3xl w-12 h-12 rounded-2xl bg-black/25 flex items-center justify-center">🗑️</span>
              <div>
                <h4 className="font-bold text-base text-white">Помойка</h4>
                <p className="text-[11px] text-gray-400">ул. Красная Площадь, д. 1 • Рейтинг 0.1 ⭐</p>
              </div>
            </div>

            <div className="bg-white/[0.05] p-4 rounded-3xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#8f9bff]" /> Количество гостей
                </label>
                <span className="text-sm font-bold text-white tabular-nums">{guests.toLocaleString('ru-RU')}</span>
              </div>
              <input
                type="range"
                min={1}
                max={MAX_GUESTS}
                step={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#8f9bff]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 tabular-nums">
                <span>1</span>
                <span>{MAX_GUESTS.toLocaleString('ru-RU')}</span>
              </div>
            </div>

            <div className="bg-white/[0.05] p-4 rounded-3xl border border-white/10 space-y-3">
              <label className="text-xs font-semibold text-gray-300 block">Время визита</label>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setMode('hour')}
                  className={`text-5xl font-light tabular-nums px-3 py-1 rounded-2xl cursor-pointer ${mode === 'hour' ? 'bg-[#8f9bff]/25 text-white' : 'text-gray-400'}`}
                >
                  {pad(hour)}
                </button>
                <span className="text-5xl font-light text-gray-500">:</span>
                <button
                  onClick={() => setMode('minute')}
                  className={`text-5xl font-light tabular-nums px-3 py-1 rounded-2xl cursor-pointer ${mode === 'minute' ? 'bg-[#8f9bff]/25 text-white' : 'text-gray-400'}`}
                >
                  {pad(minute)}
                </button>
                <div className="ml-2 flex flex-col gap-1">
                  {(['AM', 'PM'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPm(p === 'PM')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${(p === 'PM') === pm ? 'bg-[#8f9bff] text-slate-950' : 'bg-white/10 text-gray-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <ClockDial
                hour={hour}
                minute={minute}
                mode={mode}
                onPick={(v) => {
                  if (mode === 'hour') {
                    setHour(v);
                  } else {
                    setMinute(v);
                  }
                }}
              />
              <p className="text-center text-[11px] text-gray-500">
                {mode === 'hour' ? 'Выберите час на циферблате' : 'Выберите минуты на циферблате'}
              </p>
              {mode === 'hour' && (
                <button onClick={() => setMode('minute')} className="w-full py-2 rounded-full bg-white/10 text-xs font-semibold text-white cursor-pointer">
                  Далее: минуты
                </button>
              )}
            </div>

            <button
              onClick={handleBook}
              className="w-full py-4 bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-bold text-sm rounded-full shadow-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              Забронировать столик на {time}
            </button>
          </>
        )}
      </div>
    </ToolWrapper>
  );
};
