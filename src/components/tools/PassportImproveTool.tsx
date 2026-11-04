import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Shield, Sparkles, Award, Star, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const PassportImproveTool: React.FC<ToolProps> = ({ onClose }) => {
  const [level, setLevel] = useState(1);

  const handleImprove = () => {
    soundManager.playBeep(1200, 0.2);
    setLevel((prev) => (prev < 3 ? prev + 1 : 3));
  };

  return (
    <ToolWrapper title="Паспорт гражданина РФ (VIP Версия)" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Passport Document Card */}
        <div
          className={`border-2 p-5 rounded-3xl space-y-3 shadow-2xl relative overflow-hidden transition-all duration-300 ${
            level === 1
              ? 'bg-slate-900 border-slate-700'
              : level === 2
              ? 'bg-indigo-950 border-indigo-500 shadow-indigo-500/20'
              : 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 border-amber-400 shadow-amber-500/30 ring-2 ring-amber-400/50'
          }`}
        >
          {level === 3 && (
            <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
              <Star className="w-3 h-3 fill-slate-950" /> VIP PREMIUM
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-16 h-20 bg-slate-950 border-2 border-slate-700 rounded-xl overflow-hidden flex flex-col items-center justify-end pb-1 shadow-inner shrink-0 relative bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-7 h-7 rounded-full bg-slate-600 mb-1 border border-slate-500" />
              <div className="w-11 h-7 rounded-t-full bg-slate-600 border border-slate-500" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-amber-400 font-black uppercase">Паспорт гражданина РФ</div>
              <h3 className="text-sm font-black text-white">ИВАНОВ ИВАН ИВАНОВИЧ</h3>
              <div className="text-[10px] text-slate-400 font-bold">
                Серия и номер: <span className="text-white">{level === 1 ? '45 12 391042' : level === 2 ? 'VIP-777777' : 'GOLD-999999'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block font-bold">Место жительства:</span>
              <span className="text-slate-200 font-black">
                {level === 1 ? 'г. Москва, ул. Ленина 5' : level === 2 ? 'г. Москва, Рублевка 1' : 'Личный остров на Мальдивах'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">Статус гражданина:</span>
              <span className="text-amber-400 font-black">
                {level === 1 ? 'Обычный' : level === 2 ? 'Бизнес-класс' : 'Императорский'}
              </span>
            </div>
          </div>
        </div>

        {/* Upgrade Passport Button */}
        {level < 3 ? (
          <button
            onClick={handleImprove}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-2xl cursor-pointer shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>УЛУЧШИТЬ ПАСПОРТ (LVL {level + 1})</span>
          </button>
        ) : (
          <div className="p-3 bg-amber-950 border border-amber-400 text-amber-300 font-black text-center text-xs rounded-2xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Паспорт прокачан до МАКСИМАЛЬНОГО УРОВНЯ!</span>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
