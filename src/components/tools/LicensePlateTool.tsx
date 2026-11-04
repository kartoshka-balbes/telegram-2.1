import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Car } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const SPECIAL_PLATES = [
  'ЫА00Ы0 ЪЪ',
  '1ЪЕЪ23 45',
  'АААААА АА',
];

export const LicensePlateTool: React.FC<ToolProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [plate, setPlate] = useState<string | null>(null);

  const handleGetPlate = () => {
    setLoading(true);
    setPlate(null);
    soundManager.playBeep(800, 0.1);

    setTimeout(() => {
      setLoading(false);
      // 65% chance for special plates
      const isSpecial = Math.random() < 0.65;
      if (isSpecial) {
        const randomSpecial = SPECIAL_PLATES[Math.floor(Math.random() * SPECIAL_PLATES.length)];
        setPlate(randomSpecial);
      } else {
        const letters = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'];
        const l1 = letters[Math.floor(Math.random() * letters.length)];
        const l2 = letters[Math.floor(Math.random() * letters.length)];
        const l3 = letters[Math.floor(Math.random() * letters.length)];
        const num = Math.floor(Math.random() * 900) + 100;
        setPlate(`${l1}${num}${l2}${l3} 777`);
      }
      soundManager.playBeep(1200, 0.15);
    }, Math.floor(Math.random() * 1000) + 2000);
  };

  return (
    <ToolWrapper title="Получение номеров" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <Car className="w-20 h-20 text-cyan-400 animate-pulse" />

          {/* License Plate Graphic */}
          <div className="bg-white border-4 border-black rounded-2xl p-4 w-full text-black font-mono font-black text-2xl sm:text-3xl tracking-widest uppercase shadow-2xl flex items-center justify-between min-h-[90px]">
            {loading ? (
              <span className="text-slate-400 text-lg mx-auto animate-pulse">
                Генерация номера...
              </span>
            ) : plate ? (
              <>
                <span className="truncate pr-2">{plate.split(' ')[0]}</span>
                <div className="border-l-2 border-black pl-3 flex flex-col items-center text-xs shrink-0">
                  <span className="text-xl font-black">{plate.split(' ')[1] || 'RUS'}</span>
                  <span className="text-[10px] font-bold">RUS 🇷🇺</span>
                </div>
              </>
            ) : (
              <span className="text-slate-300 text-lg mx-auto">А000АА 777</span>
            )}
          </div>

          <button
            onClick={handleGetPlate}
            disabled={loading}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-base rounded-2xl uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            {loading ? 'Получение...' : 'Получить госномер'}
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
