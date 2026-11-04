import React, { useState, useEffect } from 'react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';
import { X, MapPin, Radar, MessageCircle } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  avatar: string;
  distance: string;
}

const MASTER_PEOPLE = [
  { name: 'Мошенник', avatar: '🥷' },
  { name: 'Пиво', avatar: '🍺' },
  { name: 'Туалетный монстр', avatar: '👾' },
  { name: 'Ольга Сковородкина', avatar: '👵' },
  { name: 'Морячок', avatar: '⚓' },
  { name: 'Какой-то мужик', avatar: '🧔' },
  { name: 'Маньяк', avatar: '🔪' },
  { name: 'Разработчик', avatar: '💻' },
  { name: 'Дональд Трамп', avatar: '🇺🇸' },
  { name: 'Лёня Воронин', avatar: '📺' },
  { name: 'Мимимишки', avatar: '🐻' },
  { name: 'Трансформер', avatar: '🤖' },
  { name: 'Коля Какашкин', avatar: '💩' },
  { name: 'Дима Бездарев', avatar: '🤡' },
  { name: 'Уинстон Черчилль', avatar: '🎩' },
  { name: 'Олег Сталин', avatar: '🚩' },
  { name: 'Монгольский завоеватель', avatar: '🐎' },
  { name: 'Местный шпион', avatar: '🕵️' },
  { name: 'Яндекс Алиса', avatar: '🟣' },
  { name: 'Женя Бравлстарсов', avatar: '🎮' },
  { name: 'Костя Дудункин', avatar: '🎺' },
  { name: 'Оксана Валедолова', avatar: '💊' },
  { name: 'Галина Ассенизаторовна', avatar: '🚜' },
];


const distToMeters = (d: string): number => {
  const n = parseFloat(d.replace(',', '.'));
  if (isNaN(n)) return 100;
  return d.includes('см') ? n / 100 : n;
};

const radarPos = (id: string, meters: number) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const angle = ((h % 360) * Math.PI) / 180;
  // логарифмическая шкала: 0.1 м в центре, 185 м у края
  const frac = Math.min(1, Math.max(0.12, Math.log10(meters * 10 + 1) / Math.log10(1851)));
  return { x: 50 + Math.cos(angle) * frac * 44, y: 50 + Math.sin(angle) * frac * 44 };
};

export const PeopleNearbyTool: React.FC<{
  onClose: () => void;
  onSelectPerson: (name: string, avatar: string) => void;
}> = ({ onClose, onSelectPerson }) => {
  const [activePeople, setActivePeople] = useState<Person[]>([
    { id: '1', name: 'Ольга Сковородкина', avatar: '👵', distance: '12 см' },
    { id: '2', name: 'Мошенник', avatar: '🥷', distance: '45 см' },
    { id: '3', name: 'Туалетный монстр', avatar: '👾', distance: '80 см' },
    { id: '4', name: 'Пиво', avatar: '🍺', distance: '1.2 м' },
    { id: '5', name: 'Какой-то мужик', avatar: '🧔', distance: '3.5 м' },
    { id: '6', name: 'Разработчик', avatar: '💻', distance: '15 м' },
    { id: '7', name: 'Дональд Трамп', avatar: '🇺🇸', distance: '120 м' },
    { id: '8', name: 'Яндекс Алиса', avatar: '🟣', distance: '180 м' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePeople((prev) => {
        const copy = [...prev];
        const randomDistantIndex = Math.floor(Math.random() * (copy.length - 5)) + 5;
        const pool = MASTER_PEOPLE.filter((p) => !copy.some((c) => c.name === p.name));
        if (pool.length > 0) {
          const chosen = pool[Math.floor(Math.random() * pool.length)];
          copy[randomDistantIndex] = {
            id: `${chosen.name}-${Date.now()}`,
            name: chosen.name,
            avatar: chosen.avatar,
            distance: `${Math.floor(Math.random() * 80) + 100} м`,
          };
        }
        return copy;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const pick = (person: Person) => {
    triggerHaptic('tap');
    soundManager.playBeep(950, 0.05);
    onSelectPerson(person.name, person.avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md bg-[#0d0f15] sm:rounded-3xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-300">
        {/* Handle + Header */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="px-5 pt-3 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Люди рядом</h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Найдено рядом: {activePeople.length} · радиус 185 м
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('tap');
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Radar */}
        <div className="px-5 pt-1 pb-3">
          <div className="relative w-full aspect-square max-h-64 mx-auto rounded-3xl bg-gradient-to-b from-[#161923] to-[#0a0b0f] border border-emerald-400/15 overflow-hidden">
            <style>{`@keyframes radar-sweep { to { transform: rotate(360deg); } }`}</style>
            {[88, 62, 36].map((size) => (
              <div
                key={size}
                className="absolute rounded-full border border-emerald-400/20"
                style={{ width: `${size}%`, height: `${size}%`, left: `${(100 - size) / 2}%`, top: `${(100 - size) / 2}%` }}
              />
            ))}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/10" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-400/10" />
            <div
              className="absolute inset-[6%] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(52,211,153,0.35), rgba(52,211,153,0) 70deg, rgba(52,211,153,0) 360deg)',
                animation: 'radar-sweep 4s linear infinite',
              }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-[0_0_18px_rgba(52,211,153,0.8)]">
              <MapPin className="w-4 h-4" />
            </div>
            {activePeople.map((person) => {
              const pos = radarPos(person.id, distToMeters(person.distance));
              return (
                <button
                  key={`dot-${person.id}`}
                  onClick={() => pick(person)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1a1d29] border border-emerald-400/40 text-base flex items-center justify-center hover:scale-125 transition-transform cursor-pointer"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title={person.name}
                >
                  {person.avatar}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="px-3 pb-3 overflow-y-auto flex-1">
          {activePeople.map((person) => (
            <button
              key={person.id}
              onClick={() => pick(person)}
              className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer text-left"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#232736] to-[#151822] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                {person.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{person.name}</div>
                <div className="text-xs text-emerald-400">{person.distance} от вас</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-400/15 text-emerald-300 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
