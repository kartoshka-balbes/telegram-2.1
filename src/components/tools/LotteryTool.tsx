import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Trophy, RefreshCw, Coins, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Cell {
  id: number;
  revealed: boolean;
  val: string;
  isWin: boolean;
}

export const LotteryTool: React.FC<ToolProps> = ({ onClose }) => {
  const generateBoard = (): Cell[] => {
    // 50% chance of winning board with 3 "5 ₽" cells
    const willWin = Math.random() < 0.5;
    if (willWin) {
      // 3 cells with 5 ₽, 3 with other amounts
      const values = ['5 ₽', '5 ₽', '5 ₽', '0 ₽', '100 ₽', '0 ₽'];
      const shuffled = values.sort(() => 0.5 - Math.random());
      return shuffled.map((val, idx) => ({
        id: idx,
        revealed: false,
        val,
        isWin: val === '5 ₽',
      }));
    } else {
      // Losing board: only 1 or 2 "5 ₽" or completely different
      const values = ['0 ₽', '5 ₽', '100 ₽', '0 ₽', '50 ₽', '0 ₽'];
      const shuffled = values.sort(() => 0.5 - Math.random());
      return shuffled.map((val, idx) => ({
        id: idx,
        revealed: false,
        val,
        isWin: val === '5 ₽',
      }));
    }
  };

  const [cells, setCells] = useState<Cell[]>(generateBoard);
  const [showWinModal, setShowWinModal] = useState(false);

  const revealedCount = cells.filter((c) => c.revealed).length;
  const revealedWinsCount = cells.filter((c) => c.revealed && c.isWin).length;
  const isGameOver = revealedCount >= 3;
  const hasWon = isGameOver && revealedWinsCount === 3;
  React.useEffect(() => {
    if (hasWon) soundManager.playWin();
  }, [hasWon]);

  const handleReveal = (index: number) => {
    if (cells[index].revealed || isGameOver) return;

    soundManager.playBeep(1000, 0.1);
    const updated = cells.map((c, i) => (i === index ? { ...c, revealed: true } : c));
    setCells(updated);

    const newRevealedCount = updated.filter((c) => c.revealed).length;
    const newWinsCount = updated.filter((c) => c.revealed && c.isWin).length;

    if (newRevealedCount >= 3) {
      if (newWinsCount === 3) {
        soundManager.playBeep(1500, 0.2);
        setShowWinModal(true);
      } else {
        soundManager.playBeep(300, 0.2);
      }
    }
  };

  const handleRestart = () => {
    soundManager.playBeep(800, 0.05);
    setCells(generateBoard());
    setShowWinModal(false);
  };

  return (
    <ToolWrapper title="Мгновенная лотерея «Стирай и выигрывай»" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none space-y-4 relative">
        {/* Banner Box */}
        <div className="bg-[#12151e] border border-[#8f9bff]/40 p-4 rounded-2xl text-center space-y-1.5 shadow-[0_0_20px_rgba(143,155,255,0.15)]">
          <div className="flex justify-center items-center gap-2 text-[#8f9bff] font-extrabold text-sm uppercase">
            <Coins className="w-5 h-5 text-[#b8c0ff]" /> Главный приз: 5 рублей!
          </div>
          <p className="text-xs text-gray-300">Стрите 3 защитных слоя и найдите 3 совпадающих символа 5 ₽.</p>
          <div className="text-[10px] font-bold text-gray-400">Открыто полей: {revealedCount} из 3</div>
        </div>

        {/* Scratch Card Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#0f121a] border border-[#222840] rounded-2xl">
          {cells.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleReveal(idx)}
              disabled={cell.revealed || isGameOver}
              className={`h-24 rounded-2xl border-2 font-black text-sm flex flex-col items-center justify-center cursor-pointer transition-all ${
                cell.revealed
                  ? cell.isWin
                    ? 'bg-[#222840] text-[#8f9bff] border-[#8f9bff] shadow-[0_0_15px_rgba(143,155,255,0.4)] scale-105'
                    : 'bg-[#171b27] text-gray-400 border-[#222840]'
                  : 'bg-gradient-to-tr from-[#252b63] via-[#6f7df0] to-[#8f9bff] text-black border-[#8f9bff] hover:scale-105 shadow-md'
              }`}
            >
              {cell.revealed ? (
                <span className="text-base font-extrabold">{cell.val}</span>
              ) : (
                <>
                  <Coins className="w-6 h-6 mb-1 opacity-80" />
                  <span className="text-[10px] uppercase font-bold">Стереть</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Loss state restart button */}
        {isGameOver && !hasWon && (
          <div className="p-4 bg-[#12151e] border border-red-500/50 rounded-2xl text-center space-y-3">
            <p className="text-sm font-extrabold text-red-400 uppercase">Увы, вы не выиграли!</p>
            <button
              onClick={handleRestart}
              className="w-full py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(143,155,255,0.3)] active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Перезапустить</span>
            </button>
          </div>
        )}

        {/* Win Modal Popup */}
        {showWinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#12151e] border border-[#8f9bff] rounded-3xl p-6 text-center space-y-5 shadow-[0_0_40px_rgba(143,155,255,0.3)] animate-in zoom-in">
              <Trophy className="w-16 h-16 text-[#8f9bff] mx-auto animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-wider">
                  ПОЗДРАВЛЯЕМ!
                </h3>
                <p className="text-base font-bold text-[#8f9bff]">
                  Вы выиграли 5 рублей! 🎉
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_10px_rgba(143,155,255,0.3)]"
                >
                  Начать заново
                </button>
                <button
                  onClick={onClose}
                  className="py-3 bg-[#171b27] hover:bg-[#1e2232] text-gray-300 border border-[#222840] font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
