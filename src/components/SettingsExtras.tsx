import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Lock, Ban, ShoppingBag, Timer } from 'lucide-react';
import { getLast7Days, DayStat } from '../utils/usageTracker';
import { triggerHaptic } from '../utils/soundEffects';

const fmtMin = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = Math.round(m % 60);
  return h > 0 ? `${h} ч ${mm} мин` : `${mm} мин`;
};

type Mode = 'real' | 'h26';

export const TimeManagement: React.FC<{ accent?: string }> = ({ accent = '#8f9bff' }) => {
  const [mode, setMode] = useState<Mode>('real');
  const [days, setDays] = useState<DayStat[]>(() => getLast7Days());

  useEffect(() => {
    const id = window.setInterval(() => setDays(getLast7Days()), 5000);
    return () => window.clearInterval(id);
  }, []);

  const values = days.map((d) => (mode === 'real' ? d.minutes : d.hours26));
  const max = mode === 'real' ? Math.max(60, ...values) : 26;
  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / 7;

  return (
    <div className="rounded-[1.75rem] bg-white/[0.045] border border-white/[0.08] p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-bold text-white">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Clock className="w-4 h-4 text-slate-950" />
          </span>
          Тайм-менеджмент
        </h4>
        <span className="text-[10px] text-gray-500">последние 7 дней</span>
      </div>

      <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-black/30">
        {([
          ['real', 'Реальные значения'],
          ['h26', '26 часов в сутки'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              triggerHaptic('tap');
              setMode(id);
            }}
            className={`py-2 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
              mode === id ? 'text-slate-950' : 'text-gray-300 hover:bg-white/10'
            }`}
            style={mode === id ? { background: accent } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Столбчатый график */}
      <div className="relative">
        {mode === 'h26' && (
          <div className="absolute inset-x-0 top-0 border-t border-dashed border-white/15 pointer-events-none">
            <span className="absolute -top-3 right-0 text-[9px] text-gray-500">26 ч</span>
          </div>
        )}
        <div className="flex items-end justify-between gap-2 h-44 pt-4">
          {days.map((d, i) => {
            const v = values[i];
            const h = Math.max(2, (v / max) * 100);
            return (
              <div key={d.key} className="flex-1 min-w-0 h-full flex flex-col items-center justify-end gap-1">
                <span className="text-[9px] text-gray-400 tabular-nums whitespace-nowrap">
                  {mode === 'real' ? (v >= 60 ? `${(v / 60).toFixed(1)}ч` : `${Math.round(v)}м`) : `${v}ч`}
                </span>
                <div
                  className="w-full rounded-t-xl rounded-b-md transition-all duration-500"
                  style={{
                    height: `${h}%`,
                    background: d.isToday
                      ? `linear-gradient(180deg, ${accent}, #b18cff)`
                      : 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12))',
                    boxShadow: d.isToday ? `0 6px 18px ${accent}55` : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between gap-2 mt-2">
          {days.map((d) => (
            <div key={d.key} className={`flex-1 text-center text-[11px] font-semibold ${d.isToday ? 'text-white' : 'text-gray-500'}`}>
              {d.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-black/25 px-3 py-2.5">
          <div className="text-[10px] text-gray-500">Всего за неделю</div>
          <div className="text-sm font-bold text-white">{mode === 'real' ? fmtMin(total) : `${total.toFixed(1)} ч`}</div>
        </div>
        <div className="rounded-2xl bg-black/25 px-3 py-2.5">
          <div className="text-[10px] text-gray-500">В среднем в день</div>
          <div className="text-sm font-bold text-white">{mode === 'real' ? fmtMin(avg) : `${avg.toFixed(1)} ч`}</div>
        </div>
      </div>
      {mode === 'h26' && (
        <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5" /> В режиме 26-часовых суток шкала графика рассчитана на 26 часов.
        </p>
      )}
    </div>
  );
};

const PC_KEY = 'parental_control_enabled';

export const ParentalControl: React.FC<{ accent?: string }> = ({ accent = '#8f9bff' }) => {
  const [on, setOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PC_KEY) === '1';
    } catch {
      return false;
    }
  });

  const toggle = () => {
    triggerHaptic('tap');
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(PC_KEY, next ? '1' : '0');
    } catch {}
  };

  return (
    <div className="rounded-[1.75rem] bg-white/[0.045] border border-white/[0.08] p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white">Родительский контроль</h4>
            <p className="text-[11px] text-gray-400">{on ? 'Включён' : 'Выключен'}</p>
          </div>
        </div>
        <button
          onClick={toggle}
          role="switch"
          aria-checked={on}
          className="relative w-14 h-8 rounded-full transition-colors cursor-pointer shrink-0"
          style={{ background: on ? accent : 'rgba(255,255,255,0.14)' }}
        >
          <span
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all"
            style={{ left: on ? '1.75rem' : '0.25rem' }}
          />
        </button>
      </div>

      {on && (
        <div className="grid grid-cols-1 gap-1.5 pt-1">
          {[
            [Ban, 'Ограничение контента 18+'],
            [Timer, 'Контроль экранного времени'],
            [ShoppingBag, 'Запрет покупок без подтверждения'],
            [Lock, 'Защита настроек паролем'],
          ].map(([Icon, label], i) => {
            const I = Icon as React.ElementType;
            return (
              <div key={i} className="flex items-center gap-2.5 rounded-xl bg-black/25 px-3 py-2 text-xs text-gray-200">
                <I className="w-4 h-4 text-emerald-300" /> {label as string}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
