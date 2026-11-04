import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { MapPin, ShieldAlert, Radio, RefreshCw, Plus } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface KidDot {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

const RANDOM_NAMES = [
  'Максим', 'София', 'Артем', 'Виктория', 'Даниил', 'Алиса', 'Михаил', 'Ева',
  'Кирилл', 'Полина', 'Егор', 'Анна', 'Тимофей', 'Ксения', 'Матвей', 'Валерия',
  'Александр', 'Милана', 'Роман', 'Елизавета', 'Глеб', 'Анастасия', 'Владислав',
  'Татьяна', 'Илья', 'Вероника', 'Матвей', 'Ульяна', 'Марк', 'Яна',
  'Олег', 'Светлана', 'Богдан', 'Екатерина', 'Семён', 'Павел', 'Ольга',
  'Ярослав', 'Арина', 'Алексей', 'Василиса', 'Захар', 'Кристина', 'Степан',
  'Диана', 'Денис', 'Маргарита', 'Арсений', 'Злата', 'Никита',
  'Андрей', 'Дарья', 'Иван', 'Мария', 'Фёдор', 'Софья', 'Тихон', 'Варвара',
  'Лев', 'Алёна', 'Руслан', 'Таисия', 'Назар', 'Амина', 'Платон', 'Есения',
  'Демид', 'Мирослава', 'Савелий', 'Лидия', 'Макар', 'Агата', 'Эмиль', 'Вера',
  'Ян', 'Аделина', 'Родион', 'Элина', 'Тимур', 'Камила', 'Святослав', 'Лилия',
  'Герман', 'Эльвира', 'Леонид', 'Майя', 'Станислав', 'Инна', 'Назарий', 'Оливия',
  'Всеволод', 'Нина', 'Давид', 'Мила', 'Константин', 'Алина', 'Артур', 'Дана',
  'Виталий', 'Любовь'
];

export const WhereAreMyKidsTool: React.FC<ToolProps> = ({ onClose }) => {
  const [hasEverLostAll, setHasEverLostAll] = useState(false);

  useEffect(() => {
    soundManager.startDetiLoop();
    return () => {
      soundManager.stopDetiLoop();
    };
  }, []);

  const [dots, setDots] = useState<KidDot[]>(() => {
    const shuffled = [...RANDOM_NAMES].sort(() => 0.5 - Math.random());
    const colors = ['bg-[#8f9bff]', 'bg-[#b8c0ff]', 'bg-[#6f7df0]', 'bg-emerald-400', 'bg-teal-300'];
    return shuffled.slice(0, 5).map((name, i) => ({
      id: `kid-${i + 1}`,
      name,
      x: Math.floor(Math.random() * 60 + 20),
      y: Math.floor(Math.random() * 60 + 20),
      color: colors[i % colors.length],
    }));
  });

  const [panicMsg, setPanicMsg] = useState<string | null>(null);

  useEffect(() => {
    if (dots.length === 0) {
      setHasEverLostAll(true);
    }
  }, [dots]);

  useEffect(() => {
    // Animate dots running around (2x faster: 250ms)
    const moveInterval = setInterval(() => {
      setDots((prev) =>
        prev.map((d) => ({
          ...d,
          x: Math.max(10, Math.min(85, d.x + (Math.random() * 8 - 4))),
          y: Math.max(10, Math.min(85, d.y + (Math.random() * 8 - 4))),
        }))
      );
    }, 250);

    let nextVanishTimer: NodeJS.Timeout;

    const scheduleNextVanish = () => {
      // Reduced delay by 2x (5500ms - 9500ms)
      const delay = Math.floor(Math.random() * 4000) + 5500;
      nextVanishTimer = setTimeout(() => {
        setDots((prev) => {
          if (prev.length <= 0) return prev;
          const removed = prev[prev.length - 1];
          soundManager.playBeep(200, 0.3);
          setPanicMsg(`ТРЕВОГА! Точка «${removed.name}» ушла вне зоны действия радара!`);
          const nextDots = prev.slice(0, prev.length - 1);
          if (nextDots.length > 0) {
            scheduleNextVanish();
          }
          return nextDots;
        });
      }, delay);
    };

    // First point vanishes after 4.5 seconds (reduced by 2x from 9s)
    const firstTimeout = setTimeout(() => {
      setDots((prev) => {
        if (prev.length <= 0) return prev;
        const removed = prev[prev.length - 1];
        soundManager.playBeep(200, 0.3);
        setPanicMsg(`ТРЕВОГА! Точка «${removed.name}» ушла вне зоны действия радара!`);
        const nextDots = prev.slice(0, prev.length - 1);
        if (nextDots.length > 0) {
          scheduleNextVanish();
        }
        return nextDots;
      });
    }, 4500);

    return () => {
      clearInterval(moveInterval);
      clearTimeout(firstTimeout);
      clearTimeout(nextVanishTimer);
    };
  }, []);

  const handleAddKid = () => {
    const unusedNames = RANDOM_NAMES.filter((n) => !dots.some((d) => d.name === n));
    const name = unusedNames[Math.floor(Math.random() * unusedNames.length)] || 'Ребёнок';
    const newKid: KidDot = {
      id: `kid-${Date.now()}`,
      name,
      x: Math.floor(Math.random() * 60 + 20),
      y: Math.floor(Math.random() * 60 + 20),
      color: 'bg-[#8f9bff]',
    };
    setDots((prev) => [...prev, newKid]);
    setPanicMsg(null);
  };

  return (
    <ToolWrapper title="Где Мои Дети (GPS Радар)" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-2 font-sans">
        {/* Map View Box */}
        <div className="bg-[#0f121a] border border-[#8f9bff]/40 rounded-2xl p-4 h-80 relative overflow-hidden shadow-[0_0_25px_rgba(143,155,255,0.15)]">
          {/* Radar grid lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="absolute top-3 left-3 flex items-center gap-2 text-xs font-bold text-[#8f9bff] uppercase bg-[#171b27]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#222840]">
            <Radio className="w-4 h-4 text-[#8f9bff] animate-pulse" />
            <span>GPS: {dots.length} активных маячков</span>
          </div>

          {/* Running Kid Dots */}
          {dots.map((d) => (
            <div
              key={d.id}
              className="absolute transition-all duration-500 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
            >
              <div className={`w-6 h-6 rounded-full ${d.color} border-2 border-black flex items-center justify-center animate-ping`} />
              <span className="text-[10px] font-extrabold bg-[#171b27] text-white px-2 py-0.5 rounded-lg border border-[#8f9bff]/40 mt-1 shadow-md">
                {d.name}
              </span>
            </div>
          ))}

          {dots.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/60 backdrop-blur-sm">
              <ShieldAlert className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
              <p className="text-sm font-bold text-red-400">Все маячки неактивны!</p>
            </div>
          )}
        </div>

        {/* Alarm Banner */}
        {panicMsg && (
          <div className="bg-[#171b27] border-l-4 border-red-500 p-3 rounded-xl my-3 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 animate-pulse" />
            <p className="text-xs font-bold text-red-300">{panicMsg}</p>
          </div>
        )}

        {/* Actions - Only shown after losing all dots at least once */}
        {hasEverLostAll && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAddKid}
              className="flex-1 py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(143,155,255,0.3)] active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить ребенка</span>
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
