import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RotateCcw, Award, User, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Side = 'white' | 'black';

const INITIAL_BOARD = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const WHITE_PIECES = new Set(['♙', '♖', '♘', '♗', '♕', '♔']);
const BLACK_PIECES = new Set(['♟', '♜', '♞', '♝', '♛', '♚']);

export const ChessTool: React.FC<ToolProps> = ({ onClose }) => {
  const handleExit = () => {
    soundManager.playFail();
    onClose();
  };

  const [playerSide, setPlayerSide] = useState<Side | null>(null);
  const [board, setBoard] = useState<string[][]>(INITIAL_BOARD);
  const [currentTurn, setCurrentTurn] = useState<Side>('white');
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [gameMessage, setGameMessage] = useState<string>('Игра началась! Ход белых.');
  const whiteKingAlive = board.some((r) => r.includes('♔'));
  const blackKingAlive = board.some((r) => r.includes('♚'));
  React.useEffect(() => {
    if (playerSide && (!whiteKingAlive || !blackKingAlive)) {
      soundManager.playWin();
      setGameMessage(`Победа ${whiteKingAlive ? 'белых' : 'чёрных'}! Король побеждён.`);
    }
  }, [whiteKingAlive, blackKingAlive]);

  // Reset or Start Game with chosen side
  const startNewGame = (side: Side) => {
    setPlayerSide(side);
    setBoard(INITIAL_BOARD);
    setCurrentTurn('white');
    setSelectedCell(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveCount(0);
    setGameMessage(`Вы играете за ${side === 'white' ? 'Белых (⚪)' : 'Чёрных (⚫)'}. Ход белых.`);
    soundManager.playBeep(800, 0.08);
  };

  const isPieceOfColor = (piece: string, side: Side) => {
    if (!piece) return false;
    return side === 'white' ? WHITE_PIECES.has(piece) : BLACK_PIECES.has(piece);
  };

  const handleSquareClick = (r: number, c: number) => {
    const targetPiece = board[r][c];

    if (!selectedCell) {
      if (targetPiece && isPieceOfColor(targetPiece, currentTurn)) {
        setSelectedCell([r, c]);
        soundManager.playBeep(600, 0.04);
      } else if (targetPiece) {
        soundManager.playBeep(300, 0.05);
        setGameMessage(`Сейчас ход ${currentTurn === 'white' ? 'Белых' : 'Чёрных'}!`);
      }
      return;
    }

    const [sr, sc] = selectedCell;
    if (sr === r && sc === c) {
      setSelectedCell(null);
      return;
    }

    const movingPiece = board[sr][sc];

    // If clicking another piece of the same color, switch selection
    if (targetPiece && isPieceOfColor(targetPiece, currentTurn)) {
      setSelectedCell([r, c]);
      soundManager.playBeep(600, 0.04);
      return;
    }

    // Execute Move
    const newBoard = board.map((row) => [...row]);
    if (targetPiece) {
      if (WHITE_PIECES.has(targetPiece)) {
        setCapturedWhite((prev) => [...prev, targetPiece]);
      } else {
        setCapturedBlack((prev) => [...prev, targetPiece]);
      }
      soundManager.playCameraClick();
      setGameMessage(`Фигура ${targetPiece} взята!`);
    } else {
      soundManager.playBeep(750, 0.04);
      setGameMessage(`Ход ${movingPiece} на ${String.fromCharCode(97 + sc)}${8 - sr} → ${String.fromCharCode(97 + c)}${8 - r}`);
    }

    newBoard[r][c] = movingPiece;
    newBoard[sr][sc] = '';
    setBoard(newBoard);
    setSelectedCell(null);
    setMoveCount((m) => m + 1);

    const nextTurn: Side = currentTurn === 'white' ? 'black' : 'white';
    setCurrentTurn(nextTurn);
  };

  // If side is not selected yet, show side selection screen
  if (!playerSide) {
    return (
      <ToolWrapper title="Шахматы" onClose={handleExit} headerColor="bg-slate-900 border-slate-800">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full select-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-4xl mb-4 shadow-xl">
            ♔
          </div>
          <h2 className="text-xl font-black text-amber-300 mb-2">Шахматная Партия</h2>
          <p className="text-xs text-gray-400 mb-6">
            Выберите сторону, за которую хотите играть, чтобы начать матч:
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <button
              onClick={() => startNewGame('white')}
              className="p-5 bg-gradient-to-b from-amber-100 to-amber-200 hover:from-white hover:to-amber-100 text-slate-950 font-black rounded-2xl border-2 border-amber-300 shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl">♔</span>
              <span className="text-sm font-black uppercase">Белые</span>
              <span className="text-[10px] text-slate-700 font-medium">Первый ход</span>
            </button>

            <button
              onClick={() => startNewGame('black')}
              className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-white font-black rounded-2xl border-2 border-amber-500/50 shadow-xl transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="text-4xl text-amber-400">♚</span>
              <span className="text-sm font-black uppercase">Чёрные</span>
              <span className="text-[10px] text-gray-400 font-medium">Второй ход</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500">
            Классическая доска 8×8 со счётчиком взятых фигур и подсветкой ходов.
          </div>
        </div>
      </ToolWrapper>
    );
  }

  return (
    <ToolWrapper title="Шахматы" onClose={handleExit} headerColor="bg-slate-900 border-slate-800">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2 font-mono select-none overflow-y-auto">
        
        {/* Game Status & Info Bar */}
        <div className="bg-slate-900 border-2 border-amber-600/60 p-3 rounded-2xl space-y-2 mb-3 shadow-xl">
          <div className="flex justify-between items-center text-xs font-bold text-amber-300 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Ход: {currentTurn === 'white' ? 'Белые (⚪)' : 'Чёрные (⚫)'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">Ходов: {moveCount}</span>
              <button
                onClick={() => setPlayerSide(null)}
                className="p-1 text-gray-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Сменить сторону"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => startNewGame(playerSide)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Перезапустить матч"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Captured Pieces Trays */}
          <div className="flex items-center justify-between text-xs py-1 px-1 bg-slate-950 rounded-xl">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500 font-bold">Взятые чёрными:</span>
              <span className="text-sm tracking-tight">{capturedWhite.join(' ') || '—'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500 font-bold">Взятые белыми:</span>
              <span className="text-sm tracking-tight">{capturedBlack.join(' ') || '—'}</span>
            </div>
          </div>

          <div className="text-[11px] text-center text-amber-200/90 font-medium">
            {gameMessage}
          </div>
        </div>

        {/* 8x8 Chessboard */}
        <div className="bg-amber-950/80 p-2.5 rounded-2xl border-2 border-amber-600 shadow-2xl">
          <div className="grid grid-cols-8 gap-0 border border-amber-800 rounded-lg overflow-hidden">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`h-11 sm:h-12 text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 scale-95 shadow-inner'
                        : isDark
                        ? 'bg-[#b58863] text-amber-100 hover:bg-[#a07450]'
                        : 'bg-[#f0d9b5] text-amber-950 hover:bg-[#e4cb9f]'
                    }`}
                  >
                    <span className="drop-shadow-sm">{cell}</span>
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
