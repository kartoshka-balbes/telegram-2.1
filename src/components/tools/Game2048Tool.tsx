import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

import {
  RotateCcw,
  Trophy,
  Award,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Undo2,
  Play,
  Flame,
} from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

type Board = number[][];

const BOARD_SIZE = 4;

export const Game2048Tool: React.FC<ToolProps> = ({ onClose }) => {
  const [board, setBoard] = useState<Board>(() => getInitialBoard());
  const [prevBoard, setPrevBoard] = useState<Board | null>(null);
  const [score, setScore] = useState(0);
  const [prevScore, setPrevScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  React.useEffect(() => {
    if (gameWon) soundManager.playWin();
  }, [gameWon]);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Touch Swipe ref
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load best score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('game_2048_best_score');
      if (saved) {
        setBestScore(parseInt(saved, 10) || 0);
      }
    } catch {}
  }, []);

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem('game_2048_best_score', score.toString());
      } catch {}
    }
  }, [score, bestScore]);

  // Initial board helper
  function getInitialBoard(): Board {
    let b: Board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    b = addRandomTile(b);
    b = addRandomTile(b);
    return b;
  }

  function addRandomTile(currentBoard: Board): Board {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) return currentBoard;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const val = Math.random() < 0.9 ? 2 : 4;

    const newBoard = currentBoard.map(row => [...row]);
    newBoard[randomCell.r][randomCell.c] = val;
    return newBoard;
  }

  // Slide & Merge Row logic
  const slideRow = (row: number[]) => {
    let arr = row.filter(val => val !== 0);
    let gainedScore = 0;
    let merged = false;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        gainedScore += arr[i];
        arr[i + 1] = 0;
        merged = true;
      }
    }

    arr = arr.filter(val => val !== 0);
    while (arr.length < BOARD_SIZE) {
      arr.push(0);
    }

    return { row: arr, gainedScore, merged };
  };

  // Move Board in direction
  const moveBoard = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameOver) return;

      let changed = false;
      let totalGained = 0;
      let hasMerged = false;
      let newBoard: Board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

      if (direction === 'left') {
        for (let r = 0; r < BOARD_SIZE; r++) {
          const { row, gainedScore, merged } = slideRow(board[r]);
          newBoard[r] = row;
          totalGained += gainedScore;
          if (merged) hasMerged = true;
          if (row.some((val, idx) => val !== board[r][idx])) {
            changed = true;
          }
        }
      } else if (direction === 'right') {
        for (let r = 0; r < BOARD_SIZE; r++) {
          const reversed = [...board[r]].reverse();
          const { row, gainedScore, merged } = slideRow(reversed);
          newBoard[r] = row.reverse();
          totalGained += gainedScore;
          if (merged) hasMerged = true;
          if (newBoard[r].some((val, idx) => val !== board[r][idx])) {
            changed = true;
          }
        }
      } else if (direction === 'up') {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const col = [board[0][c], board[1][c], board[2][c], board[3][c]];
          const { row, gainedScore, merged } = slideRow(col);
          totalGained += gainedScore;
          if (merged) hasMerged = true;
          for (let r = 0; r < BOARD_SIZE; r++) {
            newBoard[r][c] = row[r];
            if (row[r] !== board[r][c]) {
              changed = true;
            }
          }
        }
      } else if (direction === 'down') {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const col = [board[3][c], board[2][c], board[1][c], board[0][c]];
          const { row, gainedScore, merged } = slideRow(col);
          const reversed = row.reverse();
          totalGained += gainedScore;
          if (merged) hasMerged = true;
          for (let r = 0; r < BOARD_SIZE; r++) {
            newBoard[r][c] = reversed[r];
            if (reversed[r] !== board[r][c]) {
              changed = true;
            }
          }
        }
      }

      if (changed) {
        triggerHaptic('tap');
        if (hasMerged) {
          soundManager.playTileMergeSound(totalGained);
        } else {
          soundManager.playTileMoveSound();
        }

        setPrevBoard(board);
        setPrevScore(score);

        const spawnedBoard = addRandomTile(newBoard);
        setBoard(spawnedBoard);
        setScore(prev => prev + totalGained);

        // Check for 2048 tile win
        if (!gameWon && !keepPlaying) {
          for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
              if (spawnedBoard[r][c] === 2048) {
                setGameWon(true);
                soundManager.playCoin();
                break;
              }
            }
          }
        }

        // Check Game Over
        if (checkGameOver(spawnedBoard)) {
          setGameOver(true);
          soundManager.playWindowsErrorSound();
        }
      }
    },
    [board, score, gameOver, gameWon, keepPlaying]
  );

  const checkGameOver = (b: Board): boolean => {
    // If any empty cell, not over
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (b[r][c] === 0) return false;
      }
    }
    // Check horizontal neighbors
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE - 1; c++) {
        if (b[r][c] === b[r][c + 1]) return false;
      }
    }
    // Check vertical neighbors
    for (let c = 0; c < BOARD_SIZE; c++) {
      for (let r = 0; r < BOARD_SIZE - 1; r++) {
        if (b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        moveBoard('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        moveBoard('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveBoard('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveBoard('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveBoard]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) moveBoard('right');
        else moveBoard('left');
      } else {
        if (dy > 0) moveBoard('down');
        else moveBoard('up');
      }
    }
    touchStartRef.current = null;
  };

  const handleRestart = () => {
    triggerHaptic('heavy');
    soundManager.playBeep(800, 0.08);
    setBoard(getInitialBoard());
    setPrevBoard(null);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setKeepPlaying(false);
  };

  const handleUndo = () => {
    if (prevBoard) {
      soundManager.playBeep(600, 0.05);
      setBoard(prevBoard);
      setScore(prevScore);
      setPrevBoard(null);
      setGameOver(false);
    }
  };

  // Tile styling with backdrop blur and vibrant colors
  const getTileStyle = (val: number) => {
    if (val === 0) return 'bg-black/30 border border-white/10 text-transparent';

    const styles: Record<number, string> = {
      2: 'bg-white/30 text-white font-bold border border-white/40 shadow-sm text-base sm:text-lg',
      4: 'bg-emerald-500/40 text-emerald-100 font-bold border border-emerald-400/50 shadow-sm text-base sm:text-lg',
      8: 'bg-cyan-500/50 text-cyan-100 font-extrabold border border-cyan-300/60 shadow-sm text-base sm:text-lg',
      16: 'bg-blue-600/60 text-blue-100 font-extrabold border border-blue-400/60 shadow-sm text-base sm:text-lg',
      32: 'bg-purple-600/70 text-purple-100 font-black border border-purple-400/70 shadow-sm text-base sm:text-lg',
      64: 'bg-pink-600/70 text-pink-100 font-black border border-pink-400/70 shadow-sm text-base sm:text-lg',
      128: 'bg-amber-500/80 text-amber-100 font-black border border-amber-300 shadow-md text-sm sm:text-base',
      256: 'bg-orange-600/80 text-orange-100 font-black border border-orange-300 shadow-md text-sm sm:text-base',
      512: 'bg-red-600/90 text-white font-black border border-red-400 shadow-md text-sm sm:text-base animate-pulse',
      1024: 'bg-yellow-500 text-black font-black border-2 border-yellow-200 shadow-lg text-xs sm:text-sm',
      2048: 'bg-gradient-to-r from-yellow-300 to-amber-500 text-black font-black border-2 border-white shadow-xl text-xs sm:text-sm animate-bounce',
      4096: 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black border-2 border-white text-xs sm:text-sm',
    };

    return styles[val] || 'bg-indigo-700/90 text-white font-black text-xs border border-white/50';
  };

  return (
    <ToolWrapper
      title="Игра 2048"
      onClose={onClose}
      headerColor="bg-[#12151e] border-[#222840]"
    >
      <div
        className="flex-1 relative flex flex-col items-center justify-between p-2 sm:p-3 select-none overflow-hidden h-full max-h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Modern Authentic Geometric Grid Background */}
        <div className="absolute inset-0 bg-[#0c0d14] bg-[radial-gradient(#1c2236_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#11162b]/40 via-transparent to-black pointer-events-none z-0" />

        {/* HEADER & SCORE SECTION */}
        <div className="w-full max-w-xs flex items-center justify-between gap-2 z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] flex items-center gap-1">
              2048
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            </h1>
          </div>

          <div className="flex gap-1.5">
            {/* Score */}
            <div className="bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl text-center shadow min-w-[58px]">
              <div className="text-[8px] uppercase font-bold text-gray-400">Счёт</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">{score}</div>
            </div>

            {/* Best Score */}
            <div className="bg-amber-950/70 backdrop-blur-md border border-amber-400/40 px-2.5 py-1 rounded-xl text-center shadow min-w-[58px]">
              <div className="text-[8px] uppercase font-bold text-amber-300 flex items-center justify-center gap-0.5">
                <Trophy className="w-2 h-2" />
                <span>Рекорд</span>
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-300 font-mono">{bestScore}</div>
            </div>
          </div>
        </div>

        {/* COMPACT ACTION BAR: UNDO & RESTART */}
        <div className="w-full max-w-xs flex items-center justify-between z-10 shrink-0 my-1">
          <span className="text-[10px] text-gray-200 font-medium drop-shadow">
            Свайпайте или нажимайте стрелки
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={!prevBoard}
              title="Отменить ход"
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                prevBoard
                  ? 'bg-black/60 hover:bg-black/80 text-white border border-white/30 active:scale-95'
                  : 'bg-black/30 text-gray-500 border border-white/5 cursor-not-allowed opacity-50'
              }`}
            >
              <Undo2 className="w-3 h-3" />
              <span>Назад</span>
            </button>

            <button
              onClick={handleRestart}
              title="Начать заново"
              className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[11px] rounded-lg flex items-center gap-1 shadow active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Заново</span>
            </button>
          </div>
        </div>

        {/* 2048 4x4 COMPACT GAME BOARD */}
        <div className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] bg-black/60 backdrop-blur-md border border-white/30 p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between z-10 shrink-0">
          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-2xl z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-200">
              <span className="text-3xl mb-1">💥</span>
              <h2 className="text-lg font-black text-red-500 uppercase tracking-wider mb-0.5">Игра окончена!</h2>
              <p className="text-[11px] text-gray-300 mb-2">Ходов больше нет.</p>
              <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/15 mb-3 text-xs font-mono font-bold text-white">
                Счёт: <span className="text-yellow-400 font-black">{score}</span>
              </div>
              <button
                onClick={handleRestart}
                className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Заново</span>
              </button>
            </div>
          )}

          {/* Win 2048 Overlay */}
          {gameWon && !keepPlaying && (
            <div className="absolute inset-0 bg-yellow-500/95 backdrop-blur-md rounded-2xl z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-200 text-black">
              <span className="text-3xl mb-1 animate-bounce">🏆</span>
              <h2 className="text-lg font-black uppercase tracking-wider mb-0.5">Победа! 2048!</h2>
              <p className="text-[11px] font-semibold text-gray-900 mb-2">Легендарная плитка собрана!</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setKeepPlaying(true)}
                  className="px-3 py-1 bg-black text-white font-bold text-xs rounded-lg shadow active:scale-95 transition-all cursor-pointer"
                >
                  Дальше
                </button>
                <button
                  onClick={handleRestart}
                  className="px-3 py-1 bg-white text-black font-bold text-xs rounded-lg shadow active:scale-95 transition-all cursor-pointer"
                >
                  Заново
                </button>
              </div>
            </div>
          )}

          {/* 4x4 Tiles Grid */}
          <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-full h-full">
            {board.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`rounded-xl backdrop-blur-xs flex items-center justify-center font-mono select-none transition-all duration-100 ${getTileStyle(
                    cell
                  )}`}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))
            )}
          </div>
        </div>

        {/* COMPACT ON-SCREEN ARROW CONTROLS */}
        <div className="w-full max-w-xs flex flex-col items-center gap-1 z-10 shrink-0">
          <button
            onClick={() => moveBoard('up')}
            className="w-10 h-7 bg-black/60 hover:bg-black/80 active:bg-yellow-400 active:text-black rounded-lg flex items-center justify-center text-white border border-white/20 cursor-pointer shadow transition-all"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveBoard('left')}
              className="w-10 h-7 bg-black/60 hover:bg-black/80 active:bg-yellow-400 active:text-black rounded-lg flex items-center justify-center text-white border border-white/20 cursor-pointer shadow transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveBoard('down')}
              className="w-10 h-7 bg-black/60 hover:bg-black/80 active:bg-yellow-400 active:text-black rounded-lg flex items-center justify-center text-white border border-white/20 cursor-pointer shadow transition-all"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveBoard('right')}
              className="w-10 h-7 bg-black/60 hover:bg-black/80 active:bg-yellow-400 active:text-black rounded-lg flex items-center justify-center text-white border border-white/20 cursor-pointer shadow transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
