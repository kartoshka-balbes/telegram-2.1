import React, { useState, useEffect, useRef } from 'react';
import { Bell, ArrowLeft, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

type Fx = 'shake' | 'spin' | 'tilt' | 'zoom' | 'melt' | 'pulse' | 'glitch' | 'rainbow' | 'invert' | 'blur' | 'sepia' | 'neon' | 'explode' | 'ghosts';

interface Med {
  id: number;
  name: string;
  time: string;
  dose: string;
  taken: boolean;
  icon: string;
  effects: string[];
  fx: Fx[];
  emoji: string[];
  bg: string;
}

const INITIAL: Med[] = [
  { id: 1, name: 'Аспирин Ультра', time: '08:00', dose: '1 таблетка', taken: true, icon: '💊', effects: ['головокружение', 'шум в ушах', 'ощущение, что пол чуть наклонён', 'лёгкая размытость зрения'], fx: ['shake', 'blur'], emoji: ['🌀'], bg: 'linear-gradient(160deg,#1c2340,#0b0d13)' },
  { id: 2, name: 'Витамин C 1000mg', time: '13:00', dose: '1 капсула', taken: false, icon: '🍊', effects: ['избыток энергии', 'яркие цвета везде', 'ускорение времени', 'желание бегать по потолку'], fx: ['pulse', 'rainbow'], emoji: ['🍊', '⚡'], bg: 'linear-gradient(160deg,#5a2a00,#1a0d00)' },
  { id: 3, name: 'Экстракт Пельмениума', time: '20:00', dose: '2 капсулы', taken: false, icon: '🥟', effects: ['слышны голоса пельменей', 'взрывы смысла', 'видения сметаны', 'потеря чувства стола'], fx: ['explode', 'ghosts'], emoji: ['🥟', '🧈', '🔥'], bg: 'linear-gradient(160deg,#4a2a10,#120a05)' },
  { id: 4, name: 'Парацетамол Форте', time: '09:30', dose: '1 таблетка', taken: false, icon: '🤒', effects: ['дежавю', 'мир стал старой фотографией', 'наклон горизонта', 'сонливость в вертикальном положении'], fx: ['tilt', 'sepia'], emoji: ['🕰️'], bg: 'linear-gradient(160deg,#3a2f20,#0f0c08)' },
  { id: 5, name: 'Ибупрофен Мега', time: '11:00', dose: '1 таблетка', taken: false, icon: '💉', effects: ['мир в негативе', 'дрожь экрана', 'звон в зубах', 'ощущение, что стены дышат'], fx: ['shake', 'invert'], emoji: ['👁️'], bg: 'linear-gradient(160deg,#101030,#000010)' },
  { id: 6, name: 'Антигистаминное «Не Чихай»', time: '10:00', dose: '1 таблетка', taken: false, icon: '🤧', effects: ['предметы увеличиваются', 'расфокус', 'чихание на расстоянии', 'уверенность, что вы цветок'], fx: ['zoom', 'blur'], emoji: ['🌸', '🌼'], bg: 'linear-gradient(160deg,#1f3a2a,#07120c)' },
  { id: 7, name: 'Мелатонин Плюс', time: '22:00', dose: '1 таблетка', taken: false, icon: '😴', effects: ['плавление реальности', 'вращение комнаты', 'сны наяву', 'разговоры с подушкой'], fx: ['melt', 'spin'], emoji: ['🌙', '💤', '⭐'], bg: 'linear-gradient(160deg,#25104a,#08031a)' },
  { id: 8, name: 'Валерьянка Экстра', time: '21:00', dose: '20 капель', taken: false, icon: '🌿', effects: ['появление говорящих котов', 'наклон мира', 'тяга к коробкам', 'мурчание из стен'], fx: ['ghosts', 'tilt'], emoji: ['🐱', '🐈', '🐾'], bg: 'linear-gradient(160deg,#2a2a10,#0b0b04)' },
  { id: 9, name: 'Таблетки от жадности', time: '15:00', dose: '3 таблетки', taken: false, icon: '🪙', effects: ['дождь из монет', 'взрывы кошельков', 'помехи в зрении', 'внезапная щедрость'], fx: ['explode', 'glitch'], emoji: ['🪙', '💰', '💸'], bg: 'linear-gradient(160deg,#4a3b00,#120e00)' },
  { id: 10, name: 'Эликсир Бодрости', time: '07:00', dose: '1 ампула', taken: false, icon: '⚡', effects: ['сильная тряска', 'радужное зрение', 'взрывы энергии', 'звон времени', 'перемещение сквозь цвета'], fx: ['shake', 'rainbow', 'explode'], emoji: ['⚡', '💥'], bg: 'linear-gradient(160deg,#4a0030,#0b0010)' },
  { id: 11, name: 'Сироп «Мятный Шторм»', time: '19:00', dose: '10 мл', taken: false, icon: '🍬', effects: ['неоновая метель', 'помехи реальности', 'призраки в мятной дымке', 'эхо собственного голоса'], fx: ['glitch', 'neon', 'ghosts'], emoji: ['❄️', '👻'], bg: 'linear-gradient(160deg,#00383a,#00090a)' },
  { id: 12, name: 'Углекислый уголь', time: '18:00', dose: '4 таблетки', taken: false, icon: '⚫', effects: ['инверсия цветов', 'вращение интерфейса', 'тёмные силуэты', 'ощущение, что вы тень'], fx: ['invert', 'spin', 'ghosts'], emoji: ['⚫', '👤', '🕳️'], bg: 'linear-gradient(160deg,#202020,#000000)' },
];

const DURATION = 12; // секунд действия препарата

const ANIM_CSS = `
@keyframes mx-shake { 0%{transform:translate(0,0)} 20%{transform:translate(-9px,6px)} 40%{transform:translate(8px,-7px)} 60%{transform:translate(-7px,-6px)} 80%{transform:translate(7px,8px)} 100%{transform:translate(0,0)} }
@keyframes mx-spin { to { transform: rotate(360deg) } }
@keyframes mx-tilt { 0%,100%{transform:rotate(-9deg)} 50%{transform:rotate(9deg)} }
@keyframes mx-zoom { 0%,100%{transform:scale(1)} 50%{transform:scale(1.28)} }
@keyframes mx-melt { 0%,100%{transform:skewX(0) scaleY(1)} 25%{transform:skewX(14deg) scaleY(1.12)} 75%{transform:skewX(-14deg) scaleY(.9)} }
@keyframes mx-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
@keyframes mx-glitch { 0%{transform:translate(0)} 10%{transform:translate(-14px,3px) skewX(8deg)} 20%{transform:translate(12px,-4px)} 30%{transform:translate(0)} 55%{transform:translate(9px,5px) skewX(-6deg)} 70%{transform:translate(-11px,-3px)} 100%{transform:translate(0)} }
@keyframes mx-rainbow { to { filter: hue-rotate(360deg) saturate(2.2) } }
@keyframes mx-blur { 0%,100%{filter:blur(0)} 50%{filter:blur(5px)} }
@keyframes mx-ghost { 0%{transform:translate(0,0) scale(.6);opacity:0} 20%{opacity:.9} 100%{transform:translate(var(--gx),var(--gy)) scale(1.5) rotate(var(--gr));opacity:0} }
@keyframes mx-boom { 0%{transform:scale(.2);opacity:1} 100%{transform:scale(3.4);opacity:0} }
@keyframes mx-flash { 0%{opacity:.85} 100%{opacity:0} }
`;

export const MedicationReminderTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [meds, setMeds] = useState<Med[]>(INITIAL);
  const [active, setActive] = useState<Med | null>(null);
  const [left, setLeft] = useState(0);
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; e: string; kind: 'boom' | 'ghost'; gx: number; gy: number; gr: number }>>([]);
  const [flash, setFlash] = useState(0);
  const idRef = useRef(0);

  const toggleTake = (id: number) => {
    soundManager.playBeep(1200, 0.1);
    const m = meds.find((x) => x.id === id);
    if (!m) return;
    setMeds((prev) => prev.map((x) => (x.id === id ? { ...x, taken: !x.taken } : x)));
    if (!m.taken) {
      setActive(m);
      setLeft(DURATION);
    }
  };

  // таймер действия препарата
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setActive(null);
          setBursts([]);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  // взрывы и галлюцинации
  useEffect(() => {
    if (!active) return;
    const hasBoom = active.fx.includes('explode');
    const hasGhost = active.fx.includes('ghosts');
    if (!hasBoom && !hasGhost) return;
    const id = window.setInterval(() => {
      const now = ++idRef.current;
      const e = active.emoji[Math.floor(Math.random() * active.emoji.length)];
      const boom = hasBoom && (!hasGhost || Math.random() < 0.5);
      setBursts((b) => [
        ...b.slice(-14),
        {
          id: now,
          x: 5 + Math.random() * 85,
          y: 10 + Math.random() * 75,
          e: boom ? '💥' : e,
          kind: boom ? 'boom' : 'ghost',
          gx: (Math.random() - 0.5) * 260,
          gy: (Math.random() - 0.5) * 260,
          gr: (Math.random() - 0.5) * 240,
        },
      ]);
      if (boom) {
        setFlash((f) => f + 1);
        soundManager.playBeep(160 + Math.random() * 120, 0.08);
      }
    }, 420);
    return () => window.clearInterval(id);
  }, [active]);

  const fx = active?.fx ?? [];
  const transformAnims = [
    fx.includes('shake') && 'mx-shake 0.22s linear infinite',
    fx.includes('spin') && 'mx-spin 5s linear infinite',
    fx.includes('tilt') && 'mx-tilt 1.6s ease-in-out infinite',
    fx.includes('zoom') && 'mx-zoom 2s ease-in-out infinite',
    fx.includes('melt') && 'mx-melt 2.4s ease-in-out infinite',
    fx.includes('pulse') && 'mx-pulse 0.7s ease-in-out infinite',
    fx.includes('glitch') && 'mx-glitch 0.6s steps(2) infinite',
  ].filter(Boolean) as string[];

  let filterAnim: string | undefined;
  let filterStatic: string | undefined;
  if (fx.includes('rainbow')) filterAnim = 'mx-rainbow 1.6s linear infinite';
  else if (fx.includes('blur')) filterAnim = 'mx-blur 2.2s ease-in-out infinite';
  if (fx.includes('invert')) filterStatic = 'invert(1) hue-rotate(180deg)';
  else if (fx.includes('sepia')) filterStatic = 'sepia(1) contrast(1.2)';
  else if (fx.includes('neon')) filterStatic = 'saturate(3) contrast(1.4) brightness(1.1)';

  return (
    <div className="fixed inset-0 z-40 text-white overflow-hidden select-none" style={{ background: active ? active.bg : '#0b0d13', transition: 'background 0.6s' }}>
      <style>{ANIM_CSS}</style>

      {/* Весь интерфейс приложения (тряска / вращение / цвета) */}
      <div className="absolute inset-0 flex flex-col" style={{ animation: transformAnims.join(', ') || undefined }}>
        <div className="flex flex-col h-full" style={{ animation: filterAnim, filter: filterStatic }}>
          <div className="px-3 py-3 flex items-center justify-between gap-2 border-b border-white/[0.07] bg-black/30 backdrop-blur-xl">
            <button onClick={onClose} className="flex items-center gap-1.5 text-gray-200 font-semibold text-sm cursor-pointer pl-2.5 pr-3.5 py-2 rounded-full bg-white/[0.06] border border-white/10">
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            <h2 className="text-[15px] font-bold truncate">💊 Напоминание лекарств</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-white/[0.06] border border-white/10 cursor-pointer" aria-label="Закрыть">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3 max-w-md mx-auto w-full font-sans pb-8">
              <div className="bg-white/[0.06] p-3.5 rounded-3xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#b8c0ff] animate-bounce" />
                  <span className="text-xs font-bold text-white">Расписание приема на сегодня</span>
                </div>
                <span className="text-[10px] bg-white/15 text-white px-2.5 py-0.5 rounded-full font-bold">{meds.length} приёмов</span>
              </div>

              <div className="space-y-2">
                {meds.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-3xl border flex items-center justify-between gap-2 transition-all ${
                      m.taken ? 'bg-white/[0.04] border-white/15 opacity-70' : 'bg-white/[0.07] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl w-11 h-11 rounded-2xl bg-black/30 flex items-center justify-center shrink-0">{m.icon}</span>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${m.taken ? 'line-through text-gray-400' : 'text-white'}`}>{m.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {m.time} • {m.dose}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTake(m.id)}
                      className={`px-3.5 py-2 rounded-full font-extrabold text-xs uppercase cursor-pointer transition-all shrink-0 ${
                        m.taken ? 'bg-white/10 text-[#b8c0ff] border border-[#b8c0ff]/60' : 'bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 shadow-md'
                      }`}
                    >
                      {m.taken ? 'Принято ✓' : 'Принять'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Побочные эффекты и галлюцинации (поверх, не двигают интерфейс) */}
      {active && (
        <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {flash > 0 && <div key={flash} className="absolute inset-0 bg-white" style={{ animation: 'mx-flash 0.35s ease-out forwards' }} />}
            {bursts.map((b) =>
              b.kind === 'boom' ? (
                <span key={b.id} className="absolute text-6xl" style={{ left: `${b.x}%`, top: `${b.y}%`, animation: 'mx-boom 0.9s ease-out forwards' }}>
                  {b.e}
                </span>
              ) : (
                <span
                  key={b.id}
                  className="absolute text-5xl"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, ['--gx' as string]: `${b.gx}px`, ['--gy' as string]: `${b.gy}px`, ['--gr' as string]: `${b.gr}deg`, animation: 'mx-ghost 2.4s ease-out forwards' } as React.CSSProperties}
                >
                  {b.e}
                </span>
              )
            )}
          </div>

          <div className="absolute left-3 right-3 top-16 z-30 pointer-events-none">
            <div className="max-w-md mx-auto rounded-2xl bg-black/75 backdrop-blur-xl border border-white/20 p-3 shadow-2xl">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-amber-300">Действие препарата: {active.name}</span>
                <span className="tabular-nums text-white">{left} с</span>
              </div>
              <div className="text-[10px] text-gray-200 leading-snug">Побочные эффекты и галлюцинации: {active.effects.join(', ')}.</div>
              <div className="mt-1.5 h-1 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full bg-amber-300" style={{ width: `${(left / DURATION) * 100}%`, transition: 'width 1s linear' }} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
