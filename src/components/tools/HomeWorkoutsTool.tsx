import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Play, Pause, CheckCircle2, Flame, Video, X, Ban } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Trick =
  | 'jacks' | 'backflip' | 'cartwheel' | 'handstand' | 'splits' | 'spin'
  | 'helicopter' | 'headspin' | 'tripleflip' | 'moonwalk' | 'robot' | 'giant' | 'levitate'
  | 'teleport' | 'earthquake' | 'noodle' | 'rocket' | 'windmill' | 'pendulum' | 'shrink';

interface Exercise {
  id: string;
  name: string;
  reps: string;
  burnedKcal: number;
  icon: string;
  tricks: Trick[];
  steps: string[];
}

const TRICK_NAMES: Record<Trick, string> = {
  jacks: 'Прыжки «звёздочка»',
  backflip: 'Сальто назад',
  cartwheel: 'Колесо',
  handstand: 'Стойка на руках',
  splits: 'Шпагат',
  spin: 'Пируэт',
  helicopter: '', headspin: '', tripleflip: '', moonwalk: '', robot: '', giant: '', levitate: '',
  teleport: '', earthquake: '', noodle: '', rocket: '', windmill: '', pendulum: '', shrink: '',
};

const EXERCISES: Exercise[] = [
  { id: '1', name: 'Отжимания от пола', reps: '3 подхода × 15 раз', burnedKcal: 45, icon: '💪', tricks: ['jacks', 'cartwheel'], steps: ['Упор лёжа, руки чуть шире плеч', 'Корпус прямой, как доска', 'Опуститесь до угла 90° в локтях', 'Выдох и вернитесь в исходное положение'] },
  { id: '2', name: 'Приседания глубокие', reps: '3 подхода × 20 раз', burnedKcal: 60, icon: '🦵', tricks: ['backflip', 'splits'], steps: ['Ноги на ширине плеч, носки слегка в стороны', 'Спина прямая, взгляд вперёд', 'Опуститесь до параллели бёдер с полом', 'Вернитесь, не отрывая пятки'] },
  { id: '3', name: 'Планка на локтях', reps: '60 секунд', burnedKcal: 35, icon: '🧘', tricks: ['handstand', 'spin'], steps: ['Локти строго под плечами', 'Тело образует прямую линию', 'Напрягите пресс и ягодицы', 'Дышите ровно, не прогибайтесь'] },
  { id: '4', name: 'Скручивания на пресс', reps: '3 подхода × 25 раз', burnedKcal: 50, icon: '🔥', tricks: ['cartwheel', 'backflip'], steps: ['Лягте на спину, колени согнуты', 'Руки за головой, локти в стороны', 'Поднимайте лопатки от пола на выдохе', 'Опускайтесь медленно'] },
  { id: '5', name: 'Выпады назад', reps: '3 подхода × 12 раз', burnedKcal: 40, icon: '🏃', tricks: ['splits', 'jacks', 'handstand'], steps: ['Встаньте прямо, руки на поясе', 'Сделайте шаг назад и опуститесь', 'Переднее колено над стопой', 'Оттолкнитесь и вернитесь в стойку'] },
];

/* ---------- Анимированный человек ---------- */

const GROUND = 160;
const LEG = 50;

interface Pose {
  x: number;
  y: number;
  rot: number;
  sx: number;
  aL: number;
  aR: number;
  eL: number;
  eR: number;
  lL: number;
  lR: number;
  kL: number;
  kR: number;
  sc: number;
}

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

const standY = (legAng: number) => GROUND - LEG * Math.cos((legAng * Math.PI) / 180);

const poseFor = (trick: Trick, t: number): Pose => {
  const base: Pose = { x: 150, y: GROUND - LEG, rot: 0, sx: 1, aL: 8, aR: -8, eL: 0, eR: 0, lL: 3, lR: -3, kL: 0, kR: 0, sc: 1 };
  switch (trick) {
    case 'jacks': {
      const o = (Math.sin(t * 2 * Math.PI * 1.4) + 1) / 2;
      const leg = 4 + 24 * o;
      return { ...base, y: standY(leg) - 14 * Math.abs(Math.sin(t * Math.PI * 1.4)), aL: 15 + 155 * o, aR: -(15 + 155 * o), lL: leg, lR: -leg };
    }
    case 'backflip': {
      const u = (t % 2.4) / 2.4;
      const air = Math.sin(Math.PI * u);
      const tuck = Math.pow(air, 0.6);
      return {
        ...base,
        y: GROUND - LEG - 85 * air,
        rot: -360 * ease(u),
        aL: 30 + 120 * tuck,
        aR: -(30 + 120 * tuck),
        lL: 8 + 85 * tuck,
        lR: -(8 + 85 * tuck),
        kL: -110 * tuck,
        kR: 110 * tuck,
      };
    }
    case 'cartwheel': {
      const u = (t % 2.6) / 2.6;
      return {
        ...base,
        x: 60 + 180 * u,
        y: GROUND - LEG - 12 - 40 * Math.sin(Math.PI * u),
        rot: 360 * u,
        aL: 170,
        aR: -170,
        lL: 38,
        lR: -38,
      };
    }
    case 'handstand': {
      const sway = Math.sin(t * 2.2);
      return { ...base, y: GROUND - 82, rot: 180, aL: 172, aR: -172, lL: 6 + 5 * sway, lR: -(6 - 5 * sway) };
    }
    case 'splits': {
      const u = (Math.sin(t * 1.2 - Math.PI / 2) + 1) / 2;
      const ang = 4 + 84 * u;
      return { ...base, y: standY(ang), aL: 25 + 120 * u, aR: -(25 + 120 * u), lL: ang, lR: -ang };
    }
    case 'spin': {
      const c = Math.cos(t * 2 * Math.PI * 1.6);
      return { ...base, y: GROUND - LEG - 4 * Math.abs(c), sx: c, aL: 95, aR: -95, lL: 4, lR: -14 + 20 * Math.abs(c) };
    }
    case 'helicopter': {
      const a = t * 900;
      return { ...base, y: GROUND - LEG - 70 - 10 * Math.sin(t * 3), rot: t * 40, aL: a, aR: a + 180, lL: 12, lR: -12 };
    }
    case 'headspin': {
      const c = Math.cos(t * 2 * Math.PI * 2.2);
      return { ...base, y: GROUND - 82, rot: 180, sx: c, aL: 120, aR: -120, lL: 40 + 30 * Math.sin(t * 9), lR: -(40 + 30 * Math.sin(t * 9)) };
    }
    case 'tripleflip': {
      const u = (t % 3) / 3;
      const air = Math.sin(Math.PI * u);
      return { ...base, y: GROUND - LEG - 110 * air, rot: -1080 * ease(u), aL: 150, aR: -150, lL: 95 * air, lR: -95 * air, kL: -120 * air, kR: 120 * air };
    }
    case 'moonwalk': {
      const ph = Math.sin(t * 5);
      return { ...base, x: 240 - ((t * 30) % 180), aL: 40, aR: -70, lL: 22 * ph, lR: -22 * ph, kL: 10 * Math.max(0, ph) * 4, kR: -10 * Math.max(0, -ph) * 4 };
    }
    case 'robot': {
      const q = (v: number) => Math.round(v / 30) * 30;
      const k = Math.floor(t * 4);
      const pick = (n: number) => [0, 90, 135, 45, 180, 60][(k * 3 + n) % 6];
      return { ...base, aL: q(pick(0)), aR: -q(pick(1)), eL: q(pick(2)) / 2, eR: -q(pick(3)) / 2, lL: q(pick(4)) / 3, lR: -q(pick(5)) / 3 };
    }
    case 'giant': {
      const o = (Math.sin(t * 3) + 1) / 2;
      const sc = 0.5 + 1.6 * o;
      return { ...base, sc, y: GROUND - LEG * sc, aL: 20 + 150 * o, aR: -(20 + 150 * o), lL: 6 + 20 * o, lR: -(6 + 20 * o) };
    }
    case 'levitate': {
      const up = Math.min(1, (t % 5) / 3.5);
      const fall = (t % 5) > 4.2;
      return { ...base, y: GROUND - LEG - (fall ? 0 : 120 * ease(up)) + Math.sin(t * 8) * 4, rot: Math.sin(t * 2) * 14, aL: 100, aR: -100, lL: 12 + 6 * Math.sin(t * 6), lR: -(12 + 6 * Math.cos(t * 6)) };
    }
    case 'teleport': {
      const k = Math.floor(t * 2.5);
      const rnd = (n: number) => { const x = Math.sin(k * 91.7 + n * 13.3) * 43758.5; return x - Math.floor(x); };
      return { ...base, x: 50 + rnd(1) * 200, y: GROUND - LEG - rnd(2) * 40, sx: rnd(3) > 0.5 ? 1 : -1, aL: rnd(4) * 160, aR: -rnd(5) * 160, lL: rnd(6) * 30, lR: -rnd(7) * 30 };
    }
    case 'earthquake': {
      const j = (n: number) => Math.sin(t * (30 + n * 7)) * 70;
      return { ...base, x: 150 + Math.sin(t * 40) * 6, y: GROUND - LEG + Math.cos(t * 37) * 4, aL: 90 + j(1), aR: -(90 + j(2)), eL: j(3) / 2, eR: j(4) / 2, lL: j(5) / 3, lR: -j(6) / 3, kL: j(7) / 2, kR: -j(8) / 2 };
    }
    case 'noodle': {
      const w = (n: number, f: number) => Math.sin(t * f + n) * 85;
      return { ...base, rot: Math.sin(t * 2) * 25, aL: 90 + w(0, 3), aR: -(90 + w(1, 3.3)), eL: w(2, 4), eR: w(3, 4.4), lL: w(4, 2.7) / 2, lR: w(5, 3.1) / 2, kL: w(6, 3.5) / 1.5, kR: w(7, 3.9) / 1.5 };
    }
    case 'rocket': {
      const u = (t % 3.2) / 3.2;
      const crouch = u < 0.25 ? u / 0.25 : 0;
      const launch = u >= 0.3 ? (u - 0.3) / 0.7 : 0;
      return { ...base, y: GROUND - LEG + 22 * crouch - launch * launch * 260 + (u > 0.85 ? (u - 0.85) * 1400 - 210 : 0), aL: 175, aR: -175, lL: 40 * crouch, lR: -40 * crouch, kL: -70 * crouch, kR: 70 * crouch };
    }
    case 'windmill': {
      return { ...base, y: GROUND - 14, rot: 90 + t * 540, aL: 160, aR: -160, lL: 85, lR: -85 };
    }
    case 'pendulum': {
      const s2 = Math.sin(t * 2.4);
      return { ...base, x: 150, y: 54, rot: 180 + s2 * 65, aL: 170, aR: -170, lL: 8, lR: -8 };
    }
    case 'shrink': {
      const sc = 0.15 + 1.1 * (Math.sin(t * 2.2) + 1) / 2;
      return { ...base, sc, y: GROUND - LEG * sc, rot: t * 60, aL: 40 + 80 * Math.abs(Math.sin(t * 4)), aR: -(40 + 80 * Math.abs(Math.cos(t * 4))), lL: 20 * Math.sin(t * 7), lR: -20 * Math.sin(t * 7) };
    }
    default:
      return base;
  }
};

const Limb: React.FC<{ a: number; b: number; l1: number; l2: number }> = ({ a, b, l1, l2 }) => (
  <g transform={`rotate(${a})`}>
    <line x1="0" y1="0" x2="0" y2={l1} />
    <g transform={`translate(0 ${l1}) rotate(${b})`}>
      <line x1="0" y1="0" x2="0" y2={l2} />
    </g>
  </g>
);

const Figure: React.FC<{ pose: Pose; color: string }> = ({ pose, color }) => (
  <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.rot}) scale(${pose.sx * pose.sc} ${pose.sc})`} stroke={color} strokeWidth="5" strokeLinecap="round" fill="none">
    <line x1="0" y1="0" x2="0" y2="-38" />
    <circle cx="0" cy="-50" r="10" fill={color} stroke="none" />
    <g transform="translate(0 -36)">
      <Limb a={pose.aL} b={pose.eL} l1={20} l2={18} />
      <Limb a={pose.aR} b={pose.eR} l1={20} l2={18} />
    </g>
    <Limb a={pose.lL} b={pose.kL} l1={26} l2={24} />
    <Limb a={pose.lR} b={pose.kR} l1={26} l2={24} />
  </g>
);

const TRICK_SECONDS = 4;
const ALL_TRICKS: Trick[] = [
  'jacks', 'backflip', 'cartwheel', 'handstand', 'splits', 'spin',
  'helicopter', 'headspin', 'tripleflip', 'moonwalk', 'robot', 'giant', 'levitate',
  'teleport', 'earthquake', 'noodle', 'rocket', 'windmill', 'pendulum', 'shrink',
];
const pickRandomTricks = (): Trick[] => [...ALL_TRICKS].sort(() => Math.random() - 0.5).slice(0, 5);

const TutorialModal: React.FC<{ ex: Exercise; onClose: () => void }> = ({ ex, onClose }) => {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tricks] = useState<Trick[]>(pickRandomTricks);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = -1;
    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(0.1, (now - lastRef.current) / 1000));
      if (lastRef.current < 0) lastRef.current = now;
      lastRef.current = now;
      setT((v) => v + dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const total = tricks.length * TRICK_SECONDS;
  const tt = ((t % total) + total) % total;
  const idx = Math.min(tricks.length - 1, Math.max(0, Math.floor(tt / TRICK_SECONDS)));
  const trick = tricks[idx] ?? 'jacks';
  const local = tt - idx * TRICK_SECONDS;
  const pose = poseFor(trick, local);
  const mm = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-[#12151e] border border-white/10 rounded-t-3xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-gray-500">Туториал</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* «Видео» */}
        <div className="mx-4 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1d2347] to-[#0b0d1a] border border-white/10 relative">
          <svg viewBox="0 0 300 190" className="w-full block">
            
            <rect x="0" y={GROUND + 2} width="300" height={190 - GROUND} fill="#0e1228" />
            <line x1="0" y1={GROUND + 2} x2="300" y2={GROUND + 2} stroke="#3b4280" strokeWidth="2" />
            <Figure pose={pose} color="#b8c0ff" />
          </svg>
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-500/80 text-[10px] font-bold text-white">REC</div>
        </div>

        <div className="mx-4 mt-2 flex items-center gap-3">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center cursor-pointer shrink-0"
          >
            {playing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8f9bff] to-[#ff8fd8]" style={{ width: `${(tt / total) * 100}%` }} />
          </div>
          <span className="text-[11px] text-gray-400 tabular-nums shrink-0">
            {mm(tt)} / {mm(total)}
          </span>
        </div>

        <div className="px-4 py-4 space-y-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Как выполнять</div>
          {ex.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3 text-xs text-gray-200">
              <span className="w-5 h-5 rounded-full bg-[#8f9bff]/25 text-[#b8c0ff] flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
              <span className="leading-snug pt-0.5">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomeWorkoutsTool: React.FC<ToolProps> = ({ onClose }) => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [tutorial, setTutorial] = useState<Exercise | null>(null);
  const [impossible, setImpossible] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => window.clearInterval(interval);
  }, [isTimerRunning]);

  const toggleExercise = (id: string) => {
    soundManager.playBeep(1200, 0.1);
    if (completed.includes(id)) {
      setCompleted(completed.filter((i) => i !== id));
      return;
    }
    const next = [...completed, id];
    setCompleted(next);
    if (next.length === EXERCISES.length) {
      // Выполнено всё: это невозможно, всё сбрасывается
      window.setTimeout(() => {
        soundManager.playFail();
        setImpossible(true);
        setIsTimerRunning(false);
      }, 350);
    }
  };

  const resetAll = () => {
    setImpossible(false);
    setCompleted([]);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const totalBurned = completed.reduce((sum, id) => {
    const ex = EXERCISES.find((e) => e.id === id);
    return sum + (ex ? ex.burnedKcal : 0);
  }, 0);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Тренировки для дома (Фитнес)" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 text-xs select-none space-y-3">
        <div className="relative overflow-hidden rounded-[2rem] p-5 border border-white/10 bg-gradient-to-br from-[#3a1d0b] via-[#2a1420] to-[#13121f] flex justify-between items-center shadow-2xl">
          <div className="absolute -top-14 -left-10 w-48 h-48 rounded-full bg-orange-500/25 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Время тренировки</div>
            <div className="text-4xl font-extrabold text-white tabular-nums">{formatTime(timer)}</div>
            <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mt-1">
              <Flame className="w-3.5 h-3.5" /> Сожжено: {totalBurned} ккал
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playBeep(900, 0.05);
              setIsTimerRunning(!isTimerRunning);
            }}
            className={`relative w-16 h-16 rounded-full font-black cursor-pointer shadow-xl transition-transform active:scale-90 flex items-center justify-center ${
              isTimerRunning ? 'bg-amber-400 text-slate-950' : 'bg-gradient-to-br from-orange-400 to-pink-500 text-white'
            }`}
          >
            {isTimerRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
          </button>
        </div>

        <div className="space-y-2.5">
          {EXERCISES.map((ex) => {
            const isDone = completed.includes(ex.id);
            return (
              <div
                key={ex.id}
                className={`p-3.5 rounded-3xl border transition-all ${
                  isDone ? 'bg-orange-500/15 border-orange-400/50' : 'bg-white/[0.05] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl w-11 h-11 rounded-2xl bg-black/25 flex items-center justify-center shrink-0">{ex.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[13px] text-white">{ex.name}</h3>
                      <p className="text-[10px] text-gray-400">
                        {ex.reps} • {ex.burnedKcal} ккал
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExercise(ex.id)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-all ${
                      isDone ? 'bg-orange-400 border-orange-300 text-slate-950' : 'border-white/25 hover:bg-white/10'
                    }`}
                    aria-label="Выполнено"
                  >
                    {isDone && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundManager.playBeep(800, 0.05);
                    setTutorial(ex);
                  }}
                  className="mt-3 w-full py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-[#b8c0ff]" /> Смотреть туториал
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {tutorial && <TutorialModal ex={tutorial} onClose={() => setTutorial(null)} />}

      {impossible && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-xs rounded-3xl bg-[#1a1d2e] border border-red-500/40 p-6 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <Ban className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Это невозможно</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Выполнить все упражнения невозможно. Результаты тренировки сброшены.
            </p>
            <button
              onClick={resetAll}
              className="mt-5 w-full py-3 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-sm cursor-pointer"
            >
              Начать заново
            </button>
          </div>
        </div>
      )}
    </ToolWrapper>
  );
};
