import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Heart, Calendar, Smile, Shield } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const PeriodTrackerTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [day, setDay] = useState(14);

  return (
    <ToolWrapper title="Женский календарь & Трекер цикла" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Main Status Circle */}
        <div className="bg-[#0f121a] border border-[#222840] p-5 rounded-3xl text-center flex flex-col items-center justify-center space-y-2 shadow-md">
          <div className="w-28 h-28 rounded-full border-4 border-[#8f9bff] bg-[#222840]/30 flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(143,155,255,0.2)]">
            <Heart className="w-8 h-8 text-[#8f9bff] fill-[#8f9bff]" />
            <span className="text-lg font-black text-white font-mono mt-0.5">{day} День</span>
            <span className="text-[9px] text-[#8f9bff] uppercase font-bold">Овуляция</span>
          </div>
          <p className="text-xs text-gray-300 font-bold">Фаза: Высокая вероятность зачатия (14/28 день)</p>
        </div>

        {/* Symptoms & Mood */}
        <div className="bg-[#12151e] p-3.5 rounded-2xl border border-[#222840] space-y-2">
          <div className="text-xs font-extrabold text-gray-300 uppercase">Симптомы сегодня:</div>
          <div className="flex flex-wrap gap-1.5">
            {['😊 Хорошее настроение', '☕ Хочется кофе', '🍫 Хочется сладкого', '😴 Легкая усталость'].map((s, i) => (
              <span key={i} className="text-[10px] bg-[#171b27] border border-[#222840] text-gray-300 px-2.5 py-1 rounded-xl font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Prediction */}
        <div className="bg-[#0f121a] p-3 rounded-2xl border border-[#222840] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">Следующий цикл через:</span>
          <span className="text-xs font-black text-[#b8c0ff] font-mono">14 дней (15 сентября)</span>
        </div>

      </div>
    </ToolWrapper>
  );
};
