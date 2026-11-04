import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const COFFEE_TYPES = [
  { id: 'espresso', name: 'Эспрессо', icon: '☕', desc: 'Крепкий насыщенный кофе' },
  { id: 'cappuccino', name: 'Капучино', icon: '🥛', desc: 'С пышной молочной пенкой' },
  { id: 'latte', name: 'Латте', icon: '🧋', desc: 'Нежный с большим количеством молока' },
  { id: 'americano', name: 'Американо', icon: '☕', desc: 'Эспрессо, разбавленный горячей водой' },
  { id: 'flatwhite', name: 'Флэт Уайт', icon: '🍵', desc: 'Двойной эспрессо с бархатистым молоком' },
];

export const CoffeeMachineTool: React.FC<ToolProps> = ({ onClose }) => {
  const handleExit = () => {
    soundManager.playFail();
    onClose();
  };

  const [brewing, setBrewing] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [exploded, setExploded] = useState(false);

  const handleBrew = (id: string) => {
    setBrewing(id);
    const duration = Math.floor(Math.random() * 4) + 3; // 3-6s
    setTimer(duration);

    soundManager.playBeep(600, 0.2);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBrewing(null);
          setExploded(true);
          soundManager.playExplosion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <ToolWrapper title="Кофемашина" onClose={handleExit}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-2 space-y-3 font-mono select-none">
        <div className="text-center bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <span className="text-xs font-bold text-amber-400 uppercase block">Кофейный автомат DeLonghi</span>
          <span className="text-[10px] text-slate-400">Выберите напиток для приготовления</span>
        </div>

        {/* Coffee Options List */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {COFFEE_TYPES.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors"
            >
              {/* Image / Icon on the Left */}
              <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                {item.icon}
              </div>

              {/* Coffee Name & Desc */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-white truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
              </div>

              {/* Prepare Button on Right */}
              <button
                onClick={() => handleBrew(item.id)}
                disabled={brewing !== null || exploded}
                className={`px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all ${
                  exploded
                    ? 'bg-slate-800 text-slate-600 line-through'
                    : brewing === item.id
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-95'
                }`}
              >
                {brewing === item.id ? `${timer}с...` : 'Приготовить'}
              </button>
            </div>
          ))}
        </div>

        {/* Explosion Modal */}
        {exploded && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-gradient-to-b from-red-700 to-red-950 border-4 border-amber-400 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center">
              <div className="text-8xl mb-4">💥</div>
              <h2 className="text-3xl font-black text-amber-300 uppercase tracking-widest mb-6">
                КОФЕМАШИНА ВЗОРВАЛАСЬ
              </h2>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg rounded-2xl uppercase tracking-wider shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
