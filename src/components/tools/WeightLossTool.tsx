import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { CheckCircle2, Flame, Trophy, TrendingDown, TrendingUp } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Mode = 'loss' | 'gain';

interface Progress {
  month: number; // номер месяца, с 1
  done: number[]; // выполненные дни текущего месяца
  full: number; // полностью завершённые дни прошлых месяцев
}

const START_WEIGHT = 80;
const fmt = (n: number, d = 1) => n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });

export const WeightLossTool: React.FC<ToolProps> = ({ onClose }) => {
  const [mode, setMode] = useState<Mode>('loss');
  const [state, setState] = useState<Record<Mode, Progress>>({
    loss: { month: 1, done: [1, 2, 3, 4], full: 0 },
    gain: { month: 1, done: [], full: 0 },
  });
  const [banner, setBanner] = useState('');

  const cur = state[mode];
  const isLoss = mode === 'loss';
  const totalDays = cur.full + cur.done.length;
  const weight = isLoss ? START_WEIGHT - totalDays * 0.25 : START_WEIGHT + totalDays * 25;
  const accentFrom = isLoss ? '#fb923c' : '#a3e635';
  const accentTo = isLoss ? '#ec4899' : '#22c55e';

  const toggleDay = (day: number) => {
    soundManager.playBeep(1000, 0.1);
    setState((prev) => {
      const p = prev[mode];
      const done = p.done.includes(day) ? p.done.filter((d) => d !== day) : [...p.done, day];
      return { ...prev, [mode]: { ...p, done } };
    });
  };

  // Все 30 дней выполнены: открывается следующий месяц (бесконечно)
  React.useEffect(() => {
    if (cur.done.length < 30) return;
    const id = window.setTimeout(() => {
      soundManager.playCoin();
      setBanner(`Месяц ${cur.month} завершён! Открыт месяц ${cur.month + 1}`);
      setState((prev) => {
        const p = prev[mode];
        return { ...prev, [mode]: { month: p.month + 1, done: [], full: p.full + 30 } };
      });
      window.setTimeout(() => setBanner(''), 2500);
    }, 500);
    return () => window.clearTimeout(id);
  }, [cur.done.length, cur.month, mode]);

  const progressPercent = Math.round((cur.done.length / 30) * 100);
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <ToolWrapper title={isLoss ? 'Худеем за 30 дней (Марафон)' : 'Жиреем за 30 дней'} onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 text-xs select-none gap-4">
        {banner && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-none">
            <div className="px-4 py-3 rounded-2xl bg-[#1b1f33]/95 backdrop-blur-xl border border-white/15 text-white font-semibold text-xs text-center shadow-2xl">
              🎉 {banner}
            </div>
          </div>
        )}

        {/* Вкладки */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
          {([
            ['loss', 'Худеем', TrendingDown],
            ['gain', 'Жиреем', TrendingUp],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setMode(id);
              }}
              className={`py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                mode === id ? 'text-slate-950' : 'text-gray-300 hover:bg-white/10'
              }`}
              style={mode === id ? { background: `linear-gradient(90deg, ${id === 'loss' ? '#fb923c' : '#a3e635'}, ${id === 'loss' ? '#ec4899' : '#22c55e'})` } : undefined}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Прогресс */}
        <div className="relative overflow-hidden rounded-[2rem] p-5 border border-white/10 bg-gradient-to-br from-[#2a1620] via-[#1c1424] to-[#12121c] shadow-2xl">
          <div className="absolute -top-14 -right-10 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: accentFrom }} />
          <div className="relative flex items-center gap-5">
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="url(#wl-grad2)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C - (C * progressPercent) / 100}
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
                <defs>
                  <linearGradient id="wl-grad2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={accentFrom} />
                    <stop offset="100%" stopColor={accentTo} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white tabular-nums">{progressPercent}%</span>
                <span className="text-[10px] text-gray-400">месяц {cur.month}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: accentFrom }}>
                <Trophy className="w-4 h-4" /> Месяц {cur.month}
              </div>
              <div className="text-white font-bold text-base leading-tight">{cur.done.length} из 30 дней</div>
              <div className="space-y-1.5 text-[11px] text-gray-300">
                <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-full px-2.5 py-1">
                  <span>⚖️</span>
                  <span className="truncate">Вес: {fmt(weight)} кг</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-full px-2.5 py-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="truncate">
                    {isLoss ? `Сожжено: ${fmt(totalDays * 350, 0)} ккал` : `Съедено: ${fmt(totalDays * 9000, 0)} ккал`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-4 text-[11px] text-gray-400 text-center">
            {isLoss ? 'Каждый день: −0,25 кг' : 'Каждый день: +25 кг'} · всего дней: {fmt(totalDays, 0)}
          </div>
        </div>

        {/* Календарь */}
        <div className="bg-white/[0.04] border border-white/10 p-4 rounded-[2rem] space-y-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase block tracking-widest">
            Календарь · месяц {cur.month}
          </span>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isDone = cur.done.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`aspect-square rounded-2xl font-bold text-sm cursor-pointer border transition-all flex flex-col items-center justify-center relative ${
                    isDone ? 'text-white border-transparent shadow-lg scale-[1.04]' : 'bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                  style={isDone ? { background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` } : undefined}
                >
                  <span>{day}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-white absolute bottom-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
