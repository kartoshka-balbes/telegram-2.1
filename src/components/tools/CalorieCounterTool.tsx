import React, { useState, useEffect, useRef } from 'react';
import { Plus, Flame, ArrowLeft, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const PRESET_FOODS = [
  { name: 'Шаурма классическая', calories: 650, protein: 28, fat: 32, carbs: 62, icon: '🌯' },
  { name: 'Борщ со сметаной', calories: 320, protein: 14, fat: 18, carbs: 22, icon: '🍲' },
  { name: 'Гречка с грудкой', calories: 410, protein: 38, fat: 8, carbs: 46, icon: '🥗' },
  { name: 'Капучино с сиропом', calories: 180, protein: 6, fat: 7, carbs: 24, icon: '☕' },
  { name: 'Пицца Маргарита (2 куска)', calories: 520, protein: 22, fat: 20, carbs: 58, icon: '🍕' },
  { name: 'Пельмени (15 шт.)', calories: 480, protein: 24, fat: 22, carbs: 46, icon: '🥟' },
  { name: 'Салат Оливье', calories: 350, protein: 9, fat: 24, carbs: 22, icon: '🥣' },
  { name: 'Блины со сметаной', calories: 410, protein: 11, fat: 18, carbs: 50, icon: '🥞' },
  { name: 'Хот-дог', calories: 480, protein: 16, fat: 26, carbs: 42, icon: '🌭' },
  { name: 'Суши-сет (8 шт.)', calories: 390, protein: 15, fat: 8, carbs: 66, icon: '🍣' },
  { name: 'Лапша быстрого приготовления', calories: 380, protein: 8, fat: 15, carbs: 52, icon: '🍜' },
  { name: 'Шашлык из свинины', calories: 560, protein: 38, fat: 42, carbs: 2, icon: '🍢' },
  { name: 'Бургер с двойной котлетой', calories: 780, protein: 42, fat: 46, carbs: 48, icon: '🍔' },
  { name: 'Торт «Наполеон»', calories: 480, protein: 6, fat: 28, carbs: 52, icon: '🍰' },
];

const N = PRESET_FOODS.length;
// Порядок отваливания частей интерфейса (по числу съеденных блюд)
const T_BACK = 1;
const T_TITLE = 2;
const T_GOAL = 3;
const T_BAR = 4;
const T_PROT = 5;
const T_FAT = 6;
const T_CARB = 7;
const T_HEAD = 8;
const T_ROW0 = 9; // дальше по одной строке за блюдо (кроме последней)
const T_LASTTEXT = T_ROW0 + (N - 1); // отваливается всё, кроме последней кнопки

export const CalorieCounterTool: React.FC<ToolProps> = ({ onClose }) => {
  const [dailyGoal] = useState(2200);
  const [logs, setLogs] = useState<FoodEntry[]>([
    { id: '1', name: 'Гречка с грудкой', calories: 410, protein: 38, fat: 8, carbs: 46 },
    { id: '2', name: 'Капучино с сиропом', calories: 180, protein: 6, fat: 7, carbs: 24 },
  ]);
  const [stage, setStage] = useState(0);
  const [ending, setEnding] = useState(false);
  const stageRef = useRef(0);
  stageRef.current = stage;

  const totalCalories = logs.reduce((a, c) => a + c.calories, 0);
  const totalProtein = logs.reduce((a, c) => a + c.protein, 0);
  const totalFat = logs.reduce((a, c) => a + c.fat, 0);
  const totalCarbs = logs.reduce((a, c) => a + c.carbs, 0);
  const percent = Math.min(100, Math.round((totalCalories / dailyGoal) * 100));

  // Приложение всё сильнее тормозит: нагрузка на каждый кадр растёт с каждым блюдом
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const ms = Math.min(38, stageRef.current * 1.7);
      if (ms > 0) {
        const t0 = performance.now();
        while (performance.now() - t0 < ms) {
          /* искусственная задержка */
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const eat = (index: number) => {
    if (ending) return;
    const food = PRESET_FOODS[index];
    const lag = Math.min(2600, stageRef.current * 120);
    soundManager.playBeep(1000, 0.08);

    window.setTimeout(() => {
      if (stageRef.current >= T_LASTTEXT) {
        // последняя кнопка: от приложения ничего не остаётся
        setEnding(true);
        soundManager.playExplosion();
        window.setTimeout(() => onClose(), 1500);
        return;
      }
      setLogs((prev) => [...prev, { id: Date.now().toString() + index, name: food.name, calories: food.calories, protein: food.protein, fat: food.fat, carbs: food.carbs }]);
      setStage((s) => s + 1);
    }, lag);
  };

  const fall = (threshold: number, seed: number): React.CSSProperties | undefined => {
    if (!ending && stage < threshold) return undefined;
    return {
      ['--rot' as string]: `${(seed % 2 ? 1 : -1) * (30 + seed * 17)}deg`,
      ['--dx' as string]: `${(seed % 3 - 1) * 60}px`,
      animation: `cal-fall ${0.9 + (seed % 4) * 0.15}s cubic-bezier(.5,0,1,.55) forwards`,
      animationDelay: ending ? `${(seed % 5) * 0.08}s` : '0s',
      pointerEvents: 'none',
    } as React.CSSProperties;
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0b0d13] text-white flex flex-col overflow-hidden select-none">
      <style>{`@keyframes cal-fall { 0% { transform: translate(0,0) rotate(0); opacity: 1 } 100% { transform: translate(var(--dx), 130vh) rotate(var(--rot)); opacity: 0.2 } }`}</style>
      <div className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25 bg-orange-500 pointer-events-none" />

      {/* Шапка */}
      <div className="relative z-10 px-3 py-3 flex items-center justify-between gap-2 border-b border-white/[0.07] bg-[#0b0d13]/70">
        <div style={fall(T_BACK, 1)}>
          <button onClick={onClose} className="flex items-center gap-1.5 text-gray-200 font-semibold text-sm cursor-pointer pl-2.5 pr-3.5 py-2 rounded-full bg-white/[0.06] border border-white/10">
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>
        </div>
        <div style={fall(T_TITLE, 2)}>
          <h2 className="text-[15px] font-bold tracking-tight truncate">🥗 Счётчик калорий & Дневник питания</h2>
        </div>
        <div style={fall(T_BACK, 3)}>
          <button onClick={onClose} className="p-2 rounded-full bg-white/[0.06] border border-white/10 cursor-pointer" aria-label="Закрыть">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto w-full space-y-3 text-xs">
          <div className="bg-white/[0.05] backdrop-blur-xl border border-orange-500/60 p-4 rounded-3xl space-y-3 shadow-2xl">
            <div className="flex justify-between items-center font-bold text-slate-300">
              <span style={fall(T_GOAL, 4)} className="flex items-center gap-1.5 text-orange-400">
                <Flame className="w-4 h-4" /> Дневная норма калорий:
              </span>
              <span style={fall(T_GOAL, 5)} className="text-white font-black">
                {totalCalories} / {dailyGoal} ккал
              </span>
            </div>

            <div style={fall(T_BAR, 6)} className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-white/10">
              {[
                ['Белки', totalProtein, 'text-amber-400', T_PROT],
                ['Жиры', totalFat, 'text-rose-400', T_FAT],
                ['Углеводы', totalCarbs, 'text-cyan-400', T_CARB],
              ].map(([l, v, c, t], i) => (
                <div key={l as string} style={fall(t as number, 7 + i)} className="bg-black/30 p-2 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-bold">{l as string}</span>
                  <span className={`text-xs font-black ${c as string}`}>{v as number} г</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 rounded-3xl space-y-2">
            <span style={fall(T_HEAD, 10)} className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
              Быстрое добавление блюда:
            </span>
            <div className="space-y-1.5">
              {PRESET_FOODS.map((food, idx) => {
                const isLast = idx === N - 1;
                const rowThreshold = T_ROW0 + idx; // строки отваливаются по одной
                const rowFall = isLast ? undefined : fall(rowThreshold, 11 + idx);
                const textFall = isLast ? fall(T_LASTTEXT, 20 + idx) : undefined;
                return (
                  <div key={idx} style={rowFall} className="p-2.5 bg-black/30 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span style={textFall} className="text-xl">{food.icon}</span>
                      <div style={textFall} className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{food.name}</h4>
                        <span className="text-[10px] text-slate-400">{food.calories} ккал</span>
                      </div>
                    </div>
                    <button
                      onClick={() => eat(idx)}
                      style={isLast && ending ? fall(0, 30) : undefined}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs uppercase rounded-full cursor-pointer flex items-center gap-1 shadow shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Съесть</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
