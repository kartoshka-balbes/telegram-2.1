import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Dices, Trophy, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const LOTTO_NICKNAMES: Record<number, string> = {
  1: 'Кол', 11: 'Барабанные палочки', 12: 'Дюжина', 13: 'Чёртова дюжина',
  22: 'Утята', 33: 'Кудрявый', 44: 'Стульчики', 55: 'Перчатки',
  69: 'Туда-сюда', 77: 'Топорики', 88: 'Матрешки', 90: 'Дедушка',
};

export const LottoTool: React.FC<ToolProps> = ({ onClose }) => {
  const [drawnBarrels, setDrawnBarrels] = useState<number[]>([]);
  const [ticketNumbers, setTicketNumbers] = useState<number[]>([
    7, 11, 22, 35, 44, 58, 69, 77, 88,
  ]);

  const handleDrawBarrel = () => {
    if (drawnBarrels.length >= 90) return;
    soundManager.playBeep(1200, 0.15);

    let next: number;
    do {
      next = Math.floor(Math.random() * 90) + 1;
    } while (drawnBarrels.includes(next));

    setDrawnBarrels([next, ...drawnBarrels]);
  };

  const currentBarrel = drawnBarrels[0];
  const nickname = currentBarrel ? LOTTO_NICKNAMES[currentBarrel] : null;

  const matchedCount = ticketNumbers.filter((num) => drawnBarrels.includes(num)).length;
  const isWinner = matchedCount === ticketNumbers.length;
  React.useEffect(() => {
    if (isWinner && drawnBarrels.length > 0) soundManager.playWin();
  }, [isWinner]);

  return (
    <ToolWrapper title="Русское Лото (Игра с бочонками)" onClose={onClose} headerColor="bg-red-950 border-red-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Barrel Drawer Box */}
        <div className="bg-slate-900 border-2 border-red-500 p-4 rounded-2xl text-center space-y-3 shadow-2xl">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Достать бочонок из мешка:</div>

          <div className="flex justify-center items-center gap-3">
            <div className="w-20 h-20 bg-amber-500 rounded-full border-4 border-amber-300 flex flex-col items-center justify-center text-slate-950 shadow-xl animate-bounce">
              <span className="text-3xl font-black">{currentBarrel || '0'}</span>
            </div>
            {nickname && (
              <div className="text-left bg-slate-950 p-2.5 rounded-xl border border-amber-500/50">
                <span className="text-[10px] text-slate-400 block font-bold">Народное название:</span>
                <span className="text-amber-400 font-black text-xs">«{nickname}»</span>
              </div>
            )}
          </div>

          <button
            onClick={handleDrawBarrel}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg"
          >
            Достать следующий бочонок (1–90)
          </button>
        </div>

        {/* Lotto Ticket View */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span>Ваш лотерейный билет:</span>
            <span className="text-amber-400 font-black">Зачеркнуто {matchedCount} из {ticketNumbers.length}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {ticketNumbers.map((num) => {
              const isCrossed = drawnBarrels.includes(num);
              return (
                <div
                  key={num}
                  className={`p-3 rounded-xl border text-center font-black text-sm transition-all ${
                    isCrossed
                      ? 'bg-amber-500 text-slate-950 border-amber-300 line-through scale-105'
                      : 'bg-slate-950 text-white border-slate-800'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          {isWinner && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-300 font-black text-center text-xs animate-in zoom-in">
              🎉 БИНГО! ВЫ ВЫИГРАЛИ ДЖЕКПОТ 1 000 000 ₽!
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
