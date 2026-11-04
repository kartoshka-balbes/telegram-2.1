import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RefreshCw, MoveHorizontal, MoveVertical, Slash } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Mode = 'h' | 'v' | 'd';

const MODES: Array<{ id: Mode; label: string; Icon: React.ElementType }> = [
  { id: 'h', label: 'Горизонтальный', Icon: MoveHorizontal },
  { id: 'v', label: 'Вертикальный', Icon: MoveVertical },
  { id: 'd', label: 'Диагональный', Icon: Slash },
];

export const BubbleLevelTool: React.FC<ToolProps> = ({ onClose }) => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [activeLevel, setActiveLevel] = useState(false);
  // Положение пузырька в процентах вдоль трубки (50 — центр)
  const [bubble, setBubble] = useState(50);
  const [teleport, setTeleport] = useState(false);

  const handleStartMeasure = () => {
    soundManager.playBeep(800, 0.08);
    setMeasuring(true);
    setActiveLevel(false);
    setBubble(50);

    // 1-2 seconds
    const delay = Math.floor(Math.random() * 1000) + 1000;
    setTimeout(() => {
      soundManager.playBeep(1100, 0.1);
      setMeasuring(false);
      setActiveLevel(true);
    }, delay);
  };

  const chooseMode = (m: Mode) => {
    soundManager.playBeep(900, 0.06);
    setMode(m);
    setActiveLevel(false);
    setMeasuring(false);
    setBubble(50);
  };

  // Пузырёк медленно дрейфует возле центра, иногда телепортируется
  useEffect(() => {
    if (!activeLevel) return;
    const interval = window.setInterval(() => {
      if (Math.random() < 0.06) {
        setTeleport(true);
        setBubble(12 + Math.random() * 76);
        window.setTimeout(() => setTeleport(false), 60);
      } else {
        setBubble((b) => {
          const drift = (Math.random() - 0.5) * 6;
          const pull = (50 - b) * 0.08; // слабое притяжение к центру
          return Math.max(8, Math.min(92, b + drift + pull));
        });
      }
    }, 900);
    return () => window.clearInterval(interval);
  }, [activeLevel]);

  const deviation = (bubble - 50) * 0.3; // градусов
  const bubbleStyle: React.CSSProperties = {
    transition: teleport ? 'none' : 'all 1.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  const marks = (
    <>
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-300/80 -translate-x-1/2" />
      <div className="absolute left-[40%] top-0 bottom-0 w-px bg-amber-300/30" />
      <div className="absolute left-[60%] top-0 bottom-0 w-px bg-amber-300/30" />
    </>
  );

  return (
    <ToolWrapper title="Строительный уровень" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4 py-2 select-none">
        {/* Выбор режима */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => chooseMode(id)}
              className={`py-2.5 rounded-full text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                mode === id ? 'bg-amber-300 text-slate-950' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Корпус уровня */}
        <div className="relative rounded-[2rem] bg-gradient-to-b from-[#f5c542] to-[#d99a1f] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] min-h-[320px] flex flex-col items-center justify-center">
          {mode === null && (
            <div className="text-center text-slate-900 space-y-2">
              <div className="text-5xl">📐</div>
              <div className="font-bold text-sm">Выберите режим измерения</div>
              <div className="text-xs opacity-75">Горизонтальный, вертикальный или диагональный</div>
            </div>
          )}

          {mode !== null && !activeLevel && !measuring && (
            <div className="text-center space-y-3">
              <p className="text-slate-900 font-semibold text-sm">Приложите телефон к поверхности</p>
              <button
                onClick={handleStartMeasure}
                className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold uppercase text-sm rounded-full cursor-pointer shadow-lg active:scale-95 transition-transform"
              >
                Измерить
              </button>
            </div>
          )}

          {measuring && (
            <div className="text-center space-y-3 text-slate-900">
              <RefreshCw className="w-10 h-10 mx-auto animate-spin" />
              <span className="font-bold text-xs uppercase animate-pulse">Калибровка инклинометра (1-2 сек)...</span>
            </div>
          )}

          {mode !== null && activeLevel && (
            <div className="w-full flex flex-col items-center gap-5 animate-in zoom-in duration-200">
              {mode === 'h' && (
                <div className="relative w-full h-16 rounded-full bg-[#fff7d6] border-4 border-slate-900 overflow-hidden shadow-inner">
                  {marks}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-9 rounded-full bg-lime-300 border-2 border-lime-700 shadow-md" style={{ left: `${bubble}%`, ...bubbleStyle }} />
                </div>
              )}

              {mode === 'v' && (
                <div className="relative w-16 h-64 rounded-full bg-[#fff7d6] border-4 border-slate-900 overflow-hidden shadow-inner">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-300/80 -translate-y-1/2" />
                  <div className="absolute top-[40%] left-0 right-0 h-px bg-amber-300/30" />
                  <div className="absolute top-[60%] left-0 right-0 h-px bg-amber-300/30" />
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-12 rounded-full bg-lime-300 border-2 border-lime-700 shadow-md" style={{ top: `${bubble}%`, ...bubbleStyle }} />
                </div>
              )}

              {mode === 'd' && (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="relative w-[320px] h-16 rounded-full bg-[#fff7d6] border-4 border-slate-900 overflow-hidden shadow-inner" style={{ transform: 'rotate(-45deg)' }}>
                    {marks}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-9 rounded-full bg-lime-300 border-2 border-lime-700 shadow-md" style={{ left: `${bubble}%`, ...bubbleStyle }} />
                  </div>
                </div>
              )}

              <div className="text-center font-bold text-slate-900 text-sm tabular-nums">
                Отклонение: {deviation >= 0 ? '+' : ''}
                {deviation.toFixed(1)}°
                <span className="block text-[11px] font-medium opacity-70">
                  {Math.abs(deviation) < 0.6 ? 'Поверхность ровная' : 'Есть наклон'}
                </span>
              </div>

              <button
                onClick={handleStartMeasure}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-amber-300 text-xs font-bold cursor-pointer"
              >
                Откалибровать заново
              </button>
            </div>
          )}
        </div>

        <div className="p-3 rounded-full bg-white/[0.05] border border-white/10 text-center text-gray-500 text-[11px]">
          Точность датчика ±0.01° • Двухосевой акселерометр
        </div>
      </div>
    </ToolWrapper>
  );
};
