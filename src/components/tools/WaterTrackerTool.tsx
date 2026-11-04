import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { GlassWater, Lock, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface PopupModal {
  id: number;
}

const MODES = [
  { id: 'easy', name: 'Самый легкий (500 ЛИТРОВ)', locked: false },
  { id: 'medium', name: 'Средний (10,000 ЛИТРОВ)', locked: true },
  { id: 'hard', name: 'Хардкор (1,000,000 ЛИТРОВ)', locked: true },
  { id: 'god', name: 'Режим Океан (Бесконечность)', locked: true },
];

export const WaterTrackerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [popups, setPopups] = useState<PopupModal[]>([]);
  const [selectedMode, setSelectedMode] = useState('easy');

  useEffect(() => {
    // Every 1 second spawn a new giant popup
    const interval = setInterval(() => {
      setPopups((prev) => [...prev, { id: Date.now() }]);
      soundManager.playSiren();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismissPopup = (id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ToolWrapper title="Трекер воды" onClose={onClose}>
      <div className="relative flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full py-4">
        {/* Main Interface: Mode selection */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <GlassWater className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="font-black text-white uppercase text-base">Выбор режима гидратации</h3>
              <p className="text-xs text-slate-400">Выберите норму потребления воды</p>
            </div>
          </div>

          <div className="space-y-2">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  if (!mode.locked) setSelectedMode(mode.id);
                }}
                className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all cursor-pointer ${
                  mode.locked
                    ? 'bg-slate-950 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-extrabold shadow-lg'
                }`}
              >
                <span className="text-xs uppercase font-bold">{mode.name}</span>
                {mode.locked ? (
                  <Lock className="w-4 h-4 text-slate-600" />
                ) : (
                  <span className="text-[10px] font-mono bg-cyan-500 text-slate-950 font-black px-2 py-0.5 rounded">
                    АКТИВНО
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stackable Giant Popups */}
        {popups.map((popup, index) => (
          <div
            key={popup.id}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in zoom-in duration-200"
            style={{
              transform: `translate(${(index % 5) * 8}px, ${(index % 5) * 8}px)`,
            }}
          >
            <div className="w-full max-w-sm bg-gradient-to-b from-blue-600 to-cyan-900 border-4 border-amber-400 rounded-3xl p-6 text-center shadow-2xl relative">
              <button
                onClick={() => handleDismissPopup(popup.id)}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/40 p-1.5 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-7xl mb-3 animate-bounce">🥤</div>

              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest mb-1">
                🚨 НАПОМИНАНИЕ О ВОДЕ 🚨
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-6">
                ВЫПИТЬ ВОДЫ 500ЛИТРОВ
              </h1>

              <button
                onClick={() => handleDismissPopup(popup.id)}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Я ВЫПИЛ 500 ЛИТРОВ
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToolWrapper>
  );
};
