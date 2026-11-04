import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RotateCcw, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Side = 'white' | 'red';

type PieceType = 'white' | 'white-king' | 'red' | 'red-king' | null;

const createInitialCheckersBoard = (): PieceType[][] => [
  [null, 'red', null, 'red', null, 'red', null, 'red'],
  ['red', null, 'red', null, 'red', null, 'red', null],
  [null, 'red', null, 'red', null, 'red', null, 'red'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['white', null, 'white', null, 'white', null, 'white', null],
  [null, 'white', null, 'white', null, 'white', null, 'white'],
  ['white', null, 'white', null, 'white', null, 'white', null],
];

export const CheckersTool: React.FC<ToolProps> = ({ onClose }) => {
  const handleExit = () => {
    soundManager.playFail();
    onClose();
  };

  const [playerSide, setPlayerSide] = useState<Side | null>(null);
  const [board, setBoard] = useState<PieceType[][]>(createInitialCheckersBoard);
  const [currentTurn, setCurrentTurn] = useState<Side>('white');
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [whiteCaptured, setWhiteCaptured] = useState(0);
  const [redCaptured, setRedCaptured] = useState(0);
  const [gameMessage, setGameMessage] = useState('Ход белых шашек.');
  const whiteLeft = board.flat().filter((p) => p === 'white' || p === 'white-king').length;
  const redLeft = board.flat().filter((p) => p === 'red' || p === 'red-king').length;
  React.useEffect(() => {
    if (playerSide && (whiteLeft === 0 || redLeft === 0)) {
      soundManager.playWin();
      setGameMessage(`Победа ${whiteLeft === 0 ? 'красных' : 'белых'}! Все шашки соперника взяты.`);
    }
  }, [whiteLeft, redLeft]);

  const startNewGame = (side: Side) => {
    setPlayerSide(side);
    setBoard(createInitialCheckersBoard());
    setCurrentTurn('white');
    setSelectedCell(null);
    setWhiteCaptured(0);
    setRedCaptured(0);
    setGameMessage(`Вы играете за ${side === 'white' ? 'Белых (⚪)' : 'Красных (🔴)'}. Ход белых.`);
    soundManager.playBeep(800, 0.08);
  };

  const isCurrentPlayerPiece = (piece: PieceType) => {
    if (!piece) return false;
    if (currentTurn === 'white') return piece === 'white' || piece === 'white-king';
    return piece === 'red' || piece === 'red-king';
  };

  const handleCellClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (!selectedCell) {
      if (piece && isCurrentPlayerPiece(piece)) {
        setSelectedCell([r, c]);
        soundManager.playBeep(550, 0.04);
      } else if (piece) {
        soundManager.playBeep(300, 0.05);
        setGameMessage(`Сейчас ход ${currentTurn === 'white' ? 'Белых' : 'Красных'}!`);
      }
      return;
    }

    const [sr, sc] = selectedCell;
    if (sr === r && sc === c) {
      setSelectedCell(null);
      return;
    }

    // Switch selection to another own piece
    if (piece && isCurrentPlayerPiece(piece)) {
      setSelectedCell([r, c]);
      soundManager.playBeep(550, 0.04);
      return;
    }

    // Target must be empty and dark tile
    if (piece !== null || (r + c) % 2 === 0) {
      setSelectedCell(null);
      return;
    }

    const movingPiece = board[sr][sc];
    if (!movingPiece) return;

    const rowDiff = r - sr;
    const colDiff = c - sc;
    const isKing = movingPiece.includes('king');

    // 1. Regular 1-step diagonal move
    const isValidStep =
      Math.abs(colDiff) === 1 &&
      (isKing
        ? Math.abs(rowDiff) === 1
        : currentTurn === 'white'
        ? rowDiff === -1
        : rowDiff === 1);

    // 2. Jump/Capture 2-step move
    const isJump = Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2;
    const midR = sr + rowDiff / 2;
    const midC = sc + colDiff / 2;
    const midPiece = board[midR]?.[midC];

    const isEnemyPiece =
      midPiece &&
      (currentTurn === 'white'
        ? midPiece === 'red' || midPiece === 'red-king'
        : midPiece === 'white' || midPiece === 'white-king');

    if (isValidStep) {
      const newBoard = board.map((row) => [...row]);
      let finalPiece = movingPiece;

      // King promotion
      if (currentTurn === 'white' && r === 0) finalPiece = 'white-king';
      if (currentTurn === 'red' && r === 7) finalPiece = 'red-king';

      newBoard[r][c] = finalPiece;
      newBoard[sr][sc] = null;
      setBoard(newBoard);
      setSelectedCell(null);
      soundManager.playBeep(650, 0.04);
      setGameMessage(`Ход совершен. Теперь ход ${currentTurn === 'white' ? 'Красных' : 'Белых'}.`);
      setCurrentTurn(currentTurn === 'white' ? 'red' : 'white');
    } else if (isJump && isEnemyPiece) {
      const newBoard = board.map((row) => [...row]);
      let finalPiece = movingPiece;

      // King promotion
      if (currentTurn === 'white' && r === 0) finalPiece = 'white-king';
      if (currentTurn === 'red' && r === 7) finalPiece = 'red-king';

      newBoard[r][c] = finalPiece;
      newBoard[sr][sc] = null;
      newBoard[midR][midC] = null;

      if (currentTurn === 'white') {
        setRedCaptured((n) => n + 1);
      } else {
        setWhiteCaptured((n) => n + 1);
      }

      setBoard(newBoard);
      setSelectedCell(null);
      soundManager.playCameraClick();
      setGameMessage(`Взятие шашки противника!`);
      setCurrentTurn(currentTurn === 'white' ? 'red' : 'white');
    } else {
      soundManager.playBeep(300, 0.04);
      setSelectedCell(null);
    }
  };

  if (!playerSide) {
    return (
      <ToolWrapper title="Русские Шашки" onClose={handleExit} headerColor="bg-red-950 border-red-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full select-none">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-4xl mb-4 shadow-xl">
            ⚪
          </div>
          <h2 className="text-xl font-black text-red-400 mb-2">Русские Шашки</h2>
          <p className="text-xs text-gray-400 mb-6">
            Выберите цвет ваших шашек для начала поединка:
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <button
              onClick={() => startNewGame('white')}
              className="p-5 bg-gradient-to-b from-stone-100 to-stone-200 hover:from-white hover:to-stone-100 text-slate-950 font-black rounded-2xl border-2 border-stone-300 shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl">⚪</span>
              <span className="text-sm font-black uppercase">Белые</span>
              <span className="text-[10px] text-slate-700 font-medium">Первый ход</span>
            </button>

            <button
              onClick={() => startNewGame('red')}
              className="p-5 bg-gradient-to-b from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 text-white font-black rounded-2xl border-2 border-red-500/50 shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl text-red-500">🔴</span>
              <span className="text-sm font-black uppercase">Красные</span>
              <span className="text-[10px] text-red-300 font-medium">Второй ход</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500">
            Поддерживаются взятия через перепрыгивание и превращение в дамки (👑).
          </div>
        </div>
      </ToolWrapper>
    );
  }

  const renderPiece = (piece: PieceType) => {
    if (!piece) return null;
    if (piece === 'white') return <span className="text-2xl drop-shadow">⚪</span>;
    if (piece === 'white-king') return <span className="text-xl font-black text-amber-300">👑⚪</span>;
    if (piece === 'red') return <span className="text-2xl drop-shadow">🔴</span>;
    if (piece === 'red-king') return <span className="text-xl font-black text-amber-300">👑🔴</span>;
    return null;
  };

  return (
    <ToolWrapper title="Русские Шашки" onClose={handleExit} headerColor="bg-red-950 border-red-900">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2 font-mono select-none overflow-y-auto">
        
        {/* Game Top Bar */}
        <div className="bg-slate-900 border-2 border-red-600/60 p-3 rounded-2xl space-y-2 mb-3 shadow-xl">
          <div className="flex justify-between items-center text-xs font-bold text-red-300 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentTurn === 'white' ? 'bg-white' : 'bg-red-500'} animate-pulse`} />
              <span>Ход: {currentTurn === 'white' ? 'Белые (⚪)' : 'Красные (🔴)'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayerSide(null)}
                className="p-1 text-gray-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Сменить сторону"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => startNewGame(playerSide)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Начать заново"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Captured Score */}
          <div className="flex items-center justify-between text-xs py-1 px-2 bg-slate-950 rounded-xl">
            <span className="text-gray-300">Сбито красных: <strong className="text-red-400">{redCaptured}</strong></span>
            <span className="text-gray-300">Сбито белых: <strong className="text-white">{whiteCaptured}</strong></span>
          </div>

          <div className="text-[11px] text-center text-red-200/90 font-medium">
            {gameMessage}
          </div>
        </div>

        {/* 8x8 Board */}
        <div className="bg-amber-950 p-2.5 rounded-2xl border-2 border-red-600 shadow-2xl">
          <div className="grid grid-cols-8 gap-0 border border-amber-900 rounded-lg overflow-hidden">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`h-11 sm:h-12 flex items-center justify-center transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-red-500 shadow-inner'
                        : isDark
                        ? 'bg-[#40241a] hover:bg-[#522f22]'
                        : 'bg-[#d8b589]'
                    }`}
                  >
                    {renderPiece(cell)}
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
};
