import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Dices, RotateCcw, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Side = 'white' | 'red';

interface PointState {
  side: Side | null;
  count: number;
}

const createInitialBackgammonBoard = (): PointState[] => {
  const points: PointState[] = Array(24)
    .fill(null)
    .map(() => ({ side: null, count: 0 }));

  // Standard Backgammon setup
  points[0] = { side: 'white', count: 2 };
  points[5] = { side: 'red', count: 5 };
  points[7] = { side: 'red', count: 3 };
  points[11] = { side: 'white', count: 5 };
  points[12] = { side: 'red', count: 5 };
  points[16] = { side: 'white', count: 3 };
  points[18] = { side: 'white', count: 5 };
  points[23] = { side: 'red', count: 2 };

  return points;
};

export const BackgammonTool: React.FC<ToolProps> = ({ onClose }) => {
  const [playerSide, setPlayerSide] = useState<Side | null>(null);
  const [board, setBoard] = useState<PointState[]>(createInitialBackgammonBoard);
  const [currentTurn, setCurrentTurn] = useState<Side>('white');
  const [dice, setDice] = useState<number[]>([6, 5]);
  const [remainingMoves, setRemainingMoves] = useState<number[]>([6, 5]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);
  const [borneOffWhite, setBorneOffWhite] = useState(0);
  const [borneOffRed, setBorneOffRed] = useState(0);
  const [gameMessage, setGameMessage] = useState('Бросьте зары, чтобы начать ход.');
  React.useEffect(() => {
    if (borneOffWhite >= 15 || borneOffRed >= 15) {
      soundManager.playWin();
      setGameMessage(`Победа ${borneOffWhite >= 15 ? 'белых' : 'красных'}! Все шашки выведены.`);
    }
  }, [borneOffWhite, borneOffRed]);

  const startNewGame = (side: Side) => {
    setPlayerSide(side);
    setBoard(createInitialBackgammonBoard());
    setCurrentTurn('white');
    setDice([6, 5]);
    setRemainingMoves([]);
    setSelectedPointIndex(null);
    setHasRolled(false);
    setBorneOffWhite(0);
    setBorneOffRed(0);
    setGameMessage(`Вы играете за ${side === 'white' ? 'Белых (⚪)' : 'Красных (🔴)'}. Ход белых. Бросьте зары!`);
    soundManager.playBeep(800, 0.08);
  };

  const rollDice = () => {
    soundManager.playBeep(700, 0.1);
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice([d1, d2]);

    if (d1 === d2) {
      setRemainingMoves([d1, d1, d1, d1]);
      setGameMessage(`Куш ${d1}:${d2}! У вас 4 хода по ${d1} пунктов!`);
    } else {
      setRemainingMoves([d1, d2]);
      setGameMessage(`Выпало ${d1} и ${d2}. Выберите шашку для хода.`);
    }
    setHasRolled(true);
    setSelectedPointIndex(null);
  };

  const handlePointClick = (index: number) => {
    if (!hasRolled || remainingMoves.length === 0) {
      soundManager.playBeep(300, 0.05);
      setGameMessage('Сначала бросьте зары или завершите ход!');
      return;
    }

    const currentPoint = board[index];

    if (selectedPointIndex === null) {
      if (currentPoint.side === currentTurn && currentPoint.count > 0) {
        setSelectedPointIndex(index);
        soundManager.playBeep(550, 0.04);
      }
      return;
    }

    if (selectedPointIndex === index) {
      setSelectedPointIndex(null);
      return;
    }

    // Attempt Move from selectedPointIndex to index
    const from = selectedPointIndex;
    const to = index;
    const distance = Math.abs(to - from);

    const moveIndexInRemaining = remainingMoves.indexOf(distance);

    if (moveIndexInRemaining === -1) {
      soundManager.playBeep(300, 0.05);
      setGameMessage(`Недопустимое расстояние хода: ${distance}. Доступно по костям: ${remainingMoves.join(', ')}`);
      setSelectedPointIndex(null);
      return;
    }

    const targetPoint = board[to];
    const isTargetBlocked = targetPoint.side && targetPoint.side !== currentTurn && targetPoint.count > 1;

    if (isTargetBlocked) {
      soundManager.playBeep(300, 0.05);
      setGameMessage('Пункт заблокирован противником (2+ шашки)!');
      setSelectedPointIndex(null);
      return;
    }

    // Execute valid Move
    const newBoard = [...board.map((p) => ({ ...p }))];
    newBoard[from].count -= 1;
    if (newBoard[from].count === 0) {
      newBoard[from].side = null;
    }

    if (targetPoint.side && targetPoint.side !== currentTurn && targetPoint.count === 1) {
      // Hit single checker (Blot)
      newBoard[to] = { side: currentTurn, count: 1 };
      soundManager.playCameraClick();
      setGameMessage(`Сбита одиночная шашка соперника на пункте ${to + 1}!`);
    } else {
      newBoard[to].side = currentTurn;
      newBoard[to].count += 1;
      soundManager.playBeep(650, 0.04);
      setGameMessage(`Перемещение на пункт ${to + 1}.`);
    }

    const nextMoves = [...remainingMoves];
    nextMoves.splice(moveIndexInRemaining, 1);
    setRemainingMoves(nextMoves);
    setBoard(newBoard);
    setSelectedPointIndex(null);

    if (nextMoves.length === 0) {
      setHasRolled(false);
      const nextTurn: Side = currentTurn === 'white' ? 'red' : 'white';
      setCurrentTurn(nextTurn);
      setGameMessage(`Ход завершён. Очередь ${nextTurn === 'white' ? 'Белых (⚪)' : 'Красных (🔴)'}. Бросьте зары!`);
    }
  };

  const handleEndTurnManually = () => {
    setHasRolled(false);
    setRemainingMoves([]);
    setSelectedPointIndex(null);
    const nextTurn: Side = currentTurn === 'white' ? 'red' : 'white';
    setCurrentTurn(nextTurn);
    setGameMessage(`Передача хода ${nextTurn === 'white' ? 'Белым' : 'Красным'}. Бросьте зары!`);
  };

  if (!playerSide) {
    return (
      <ToolWrapper title="Восточные Нарды" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full select-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-4xl mb-4 shadow-xl">
            🎲
          </div>
          <h2 className="text-xl font-black text-amber-400 mb-2">Восточные Нарды</h2>
          <p className="text-xs text-gray-400 mb-6">
            Выберите сторону для партии в длинные/короткие нарды:
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <button
              onClick={() => startNewGame('white')}
              className="p-5 bg-gradient-to-b from-amber-100 to-amber-200 hover:from-white hover:to-amber-100 text-slate-950 font-black rounded-2xl border-2 border-amber-300 shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl">⚪</span>
              <span className="text-sm font-black uppercase">Белые</span>
              <span className="text-[10px] text-slate-700 font-medium">Первый бросок</span>
            </button>

            <button
              onClick={() => startNewGame('red')}
              className="p-5 bg-gradient-to-b from-amber-950 to-amber-900 hover:from-amber-900 hover:to-amber-800 text-white font-black rounded-2xl border-2 border-amber-500/50 shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl text-amber-400">🔴</span>
              <span className="text-sm font-black uppercase">Красные</span>
              <span className="text-[10px] text-amber-200/70 font-medium">Второй бросок</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500">
            Интерактивная доска на 24 пункта с механикой кушей и выбивания.
          </div>
        </div>
      </ToolWrapper>
    );
  }

  const topRow = board.slice(12, 24).reverse();
  const bottomRow = board.slice(0, 12);

  return (
    <ToolWrapper title="Восточные Нарды" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full py-2 font-mono select-none overflow-y-auto">
        
        {/* Status and Action Panel */}
        <div className="bg-amber-950/80 border-2 border-amber-500/60 p-3 rounded-2xl space-y-2 mb-3 shadow-xl">
          <div className="flex justify-between items-center text-xs font-bold text-amber-300 border-b border-amber-800 pb-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentTurn === 'white' ? 'bg-white' : 'bg-red-500'} animate-pulse`} />
              <span>Ход: {currentTurn === 'white' ? 'Белые (⚪)' : 'Красные (🔴)'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayerSide(null)}
                className="p-1 text-gray-400 hover:text-amber-400 rounded-lg hover:bg-amber-900 transition-colors cursor-pointer"
                title="Сменить сторону"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => startNewGame(playerSide)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-amber-900 transition-colors cursor-pointer"
                title="Начать заново"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dice Roller & Move Counter */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center rounded-xl shadow-md">
                {dice[0]}
              </span>
              <span className="w-9 h-9 bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center rounded-xl shadow-md">
                {dice[1]}
              </span>

              <button
                onClick={rollDice}
                disabled={hasRolled && remainingMoves.length > 0}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Dices className="w-4 h-4" />
                <span>Бросить</span>
              </button>
            </div>

            {hasRolled && remainingMoves.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-200">Осталось ходов:</span>
                <span className="font-bold text-xs bg-amber-900 px-2 py-0.5 rounded text-amber-300">
                  {remainingMoves.join(', ')}
                </span>
                <button
                  onClick={handleEndTurnManually}
                  className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer ml-1"
                >
                  Пропуск
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-center text-amber-200/90 font-medium pt-1">
            {gameMessage}
          </div>
        </div>

        {/* Interactive 24-Point Backgammon Board */}
        <div className="bg-[#3d2012] border-4 border-[#5c3319] p-3 rounded-2xl shadow-2xl flex flex-col justify-between h-72 relative overflow-hidden">
          
          {/* Top Points Track (Points 24 down to 13) */}
          <div className="grid grid-cols-12 gap-1 h-32 border-b-2 border-amber-900/60 pb-1">
            {topRow.map((point, i) => {
              const realIndex = 23 - i;
              const isSelected = selectedPointIndex === realIndex;
              return (
                <button
                  key={realIndex}
                  onClick={() => handlePointClick(realIndex)}
                  className={`flex flex-col items-center justify-start p-1 rounded-t transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/50 ring-2 ring-amber-400'
                      : i % 2 === 0
                      ? 'bg-[#2a160c] hover:bg-[#381e10]'
                      : 'bg-[#4d2915] hover:bg-[#5e321a]'
                  }`}
                  title={`Пункт ${realIndex + 1}`}
                >
                  <span className="text-[9px] text-amber-500/70 font-mono">{realIndex + 1}</span>
                  {point.count > 0 && (
                    <div className="flex flex-col items-center -space-y-2 mt-1">
                      <span className="text-base">{point.side === 'white' ? '⚪' : '🔴'}</span>
                      {point.count > 1 && (
                        <span className="text-[9px] font-black bg-black/70 text-amber-300 px-1 rounded-full z-10">
                          {point.count}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Points Track (Points 1 to 12) */}
          <div className="grid grid-cols-12 gap-1 h-32 pt-1">
            {bottomRow.map((point, i) => {
              const realIndex = i;
              const isSelected = selectedPointIndex === realIndex;
              return (
                <button
                  key={realIndex}
                  onClick={() => handlePointClick(realIndex)}
                  className={`flex flex-col items-center justify-end p-1 rounded-b transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/50 ring-2 ring-amber-400'
                      : i % 2 === 0
                      ? 'bg-[#4d2915] hover:bg-[#5e321a]'
                      : 'bg-[#2a160c] hover:bg-[#381e10]'
                  }`}
                  title={`Пункт ${realIndex + 1}`}
                >
                  {point.count > 0 && (
                    <div className="flex flex-col items-center -space-y-2 mb-1">
                      {point.count > 1 && (
                        <span className="text-[9px] font-black bg-black/70 text-amber-300 px-1 rounded-full z-10">
                          {point.count}
                        </span>
                      )}
                      <span className="text-base">{point.side === 'white' ? '⚪' : '🔴'}</span>
                    </div>
                  )}
                  <span className="text-[9px] text-amber-500/70 font-mono">{realIndex + 1}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </ToolWrapper>
  );
};
