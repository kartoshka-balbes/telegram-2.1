import React, { useState, useEffect, useCallback } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';
import { RefreshCw, Eye, EyeOff, Upload, Coins, Sparkles, Image as ImageIcon, HelpCircle, CheckCircle2 } from 'lucide-react';

const PUZZLE_LIST = [
  { id: 0, name: 'Осторожно!', src: '/puzzle/1.jpg' },
  { id: 1, name: 'Картофельный геймер', src: '/puzzle/2.jpg' },
  { id: 2, name: 'Вот это да!', src: '/puzzle/3.jpg' },
  { id: 3, name: 'Не уберу со стены', src: '/puzzle/4.jpg' },
];

interface ToolProps {
  onClose: () => void;
}

export const PuzzleTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [customImg, setCustomImg] = useState<string | null>(null);
  
  // 9 fixed sliced square tile pieces (0 to 8)
  const [tilePieces, setTilePieces] = useState<string[]>([]);
  // Full square cropped original image (for sample and win screen)
  const [fullSquareImg, setFullSquareImg] = useState<string | null>(null);
  const [isSlicing, setIsSlicing] = useState(true);

  // Puzzle slots state: index is position (0..8), value is tile index (0..8, where 8 is the empty piece)
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [moves, setMoves] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [totalEarned, setTotalEarned] = useState(() => {
    return parseInt(localStorage.getItem('puzzle_earned_rubles') || '0', 10);
  });

  const currentImage = customImg || PUZZLE_LIST[activeImageIdx].src;

  // Pre-slice image into exact square 3x3 tiles without any loss or gaps
  useEffect(() => {
    setIsSlicing(true);
    let isCancelled = false;

    const tryLoad = (sources: string[], idx = 0) => {
      if (idx >= sources.length || isCancelled) {
        setIsSlicing(false);
        return;
      }
      const source = sources[idx];
      const img = new Image();
      if (source.startsWith('http://') || source.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        if (isCancelled) return;
        const size = Math.min(img.naturalWidth || 400, img.naturalHeight || 400);
        const sx = ((img.naturalWidth || 400) - size) / 2;
        const sy = ((img.naturalHeight || 400) - size) / 2;
        const pieceSize = size / 3;

        // Full square version
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = 600;
        fullCanvas.height = 600;
        const fullCtx = fullCanvas.getContext('2d');
        if (fullCtx) {
          fullCtx.imageSmoothingEnabled = true;
          fullCtx.imageSmoothingQuality = 'high';
          fullCtx.drawImage(img, sx, sy, size, size, 0, 0, 600, 600);
          setFullSquareImg(fullCanvas.toDataURL('image/jpeg', 0.95));
        }

        // Slice 9 equal pieces (3x3)
        const pieces: string[] = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(
                img,
                sx + col * pieceSize,
                sy + row * pieceSize,
                pieceSize,
                pieceSize,
                0,
                0,
                300,
                300
              );
              pieces.push(canvas.toDataURL('image/jpeg', 0.95));
            }
          }
        }
        setTilePieces(pieces);
        setIsSlicing(false);
      };

      img.onerror = () => {
        tryLoad(sources, idx + 1);
      };

      img.src = source;
    };

    if (customImg) {
      tryLoad([customImg]);
    } else {
      tryLoad([PUZZLE_LIST[activeImageIdx].src]);
    }

    return () => {
      isCancelled = true;
    };
  }, [currentImage, customImg, activeImageIdx]);

  // Shuffle board safely with guaranteed solvability
  const shuffle = useCallback(() => {
    soundManager.playBeep(600, 0.1);
    setMoves(0);
    setIsWon(false);
    setShowWinModal(false);

    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let emptyIdx = 8;

    // Perform 80 random valid neighbor moves
    for (let i = 0; i < 80; i++) {
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(emptyIdx - 3);
      if (row < 2) neighbors.push(emptyIdx + 3);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < 2) neighbors.push(emptyIdx + 1);

      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      arr[emptyIdx] = arr[randomNeighbor];
      arr[randomNeighbor] = 8;
      emptyIdx = randomNeighbor;
    }
    setTiles([...arr]);
  }, []);

  // Re-shuffle whenever image changes or tiles finish slicing
  useEffect(() => {
    if (tilePieces.length === 9) {
      shuffle();
    }
  }, [tilePieces, shuffle]);

  const handleTileClick = (slotIndex: number) => {
    if (isWon || isSlicing) return;
    const emptyIndex = tiles.indexOf(8);
    const row = Math.floor(slotIndex / 3);
    const col = slotIndex % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      soundManager.playBeep(900, 0.04);
      const nextTiles = [...tiles];
      nextTiles[emptyIndex] = tiles[slotIndex];
      nextTiles[slotIndex] = 8;
      setTiles(nextTiles);
      setMoves((m) => m + 1);

      // Check victory: all tiles in slots 0..8 match their original index 0..8
      const won = nextTiles.every((val, idx) => val === idx);
      if (won) {
        setIsWon(true);
        soundManager.playWin();
        const newEarned = totalEarned + 1;
        setTotalEarned(newEarned);
        localStorage.setItem('puzzle_earned_rubles', newEarned.toString());
        setTimeout(() => {
          setShowWinModal(true);
        }, 350);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setCustomImg(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ToolWrapper title="Пазлы 3x3 (Квадратное поле)" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-4 p-1 font-sans select-none overflow-y-auto">
        
        {/* LEFT SIDEBAR (Controls & Selection) */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-3">
          
          {/* Card: Puzzle Choice */}
          <div className="bg-[#0f121a] border border-[#222840] p-3.5 rounded-3xl space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-[#222840] pb-2">
              <span className="text-xs font-black uppercase text-[#8f9bff] tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Выбор картинки (1:1)
              </span>
              <span className="text-[10px] text-gray-400 font-mono">3x3</span>
            </div>

            {/* Grid of puzzles */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {PUZZLE_LIST.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCustomImg(null);
                    setActiveImageIdx(p.id);
                  }}
                  className={`p-1.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    !customImg && activeImageIdx === p.id
                      ? 'bg-[#8f9bff]/15 border-[#8f9bff] text-white shadow-md'
                      : 'bg-[#141824] border-[#222840] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <img src={p.src} alt={p.name} className="w-10 h-10 md:w-12 md:h-12 rounded-xl aspect-square object-cover border border-white/10 shrink-0" draggable={false} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-400">Квадратный оригинал</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Photo Upload */}
            <label className="w-full py-2 px-3 bg-[#161a26] hover:bg-[#202020] text-cyan-300 border border-cyan-800/60 rounded-2xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all">
              <Upload className="w-4 h-4" />
              <span>Загрузить своё фото</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Card: Stats & Controls */}
          <div className="bg-[#0f121a] border border-[#222840] p-3.5 rounded-3xl space-y-3 shadow-md">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#141824] border border-[#222840] p-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Ходов</span>
                <span className="text-lg font-black font-mono text-[#8f9bff]">{moves}</span>
              </div>
              <div className="bg-[#141824] border border-[#222840] p-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-amber-400/90 uppercase font-bold block">Награда</span>
                <span className="text-lg font-black font-mono text-amber-300 flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400" /> {totalEarned} ₽
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowNumbers(!showNumbers)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  showNumbers ? 'bg-[#222840] text-[#8f9bff] border-[#8f9bff]' : 'bg-[#161a26] text-gray-400 border-gray-700'
                }`}
                title="Переключить цифры на плитках"
              >
                <span>Цифры 1-8</span>
              </button>

              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  showHint ? 'bg-amber-950/70 text-amber-300 border-amber-600' : 'bg-[#161a26] text-gray-400 border-gray-700'
                }`}
                title="Показать / скрыть образец"
              >
                {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Образец</span>
              </button>
            </div>

            <button
              onClick={shuffle}
              className="w-full py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs uppercase rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Перемешать пазл</span>
            </button>
          </div>

          {/* Hint Preview Thumbnail (if active) */}
          {showHint && fullSquareImg && (
            <div className="bg-[#0f121a] border border-amber-500/40 p-3 rounded-3xl space-y-2 animate-in fade-in">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Исходный образец (100% квадрат):
              </span>
              <img
                src={fullSquareImg}
                alt="Образец"
                className="w-full aspect-square object-cover rounded-2xl border border-amber-500/60 shadow-md block"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

        </div>

        {/* RIGHT BOARD AREA: 100% STRICT SQUARE BOARD */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0f121a] border border-[#222840] p-4 md:p-6 rounded-3xl shadow-xl min-h-[380px]">
          
          {isSlicing ? (
            <div className="flex flex-col items-center justify-center gap-3 text-gray-400 py-16">
              <RefreshCw className="w-8 h-8 text-[#8f9bff] animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Подгонка изображения 1:1...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              
              {/* Victory Banner */}
              {isWon && (
                <div className="mb-3 px-4 py-1.5 bg-[#8f9bff]/20 border border-[#8f9bff] rounded-full text-xs font-black text-[#8f9bff] uppercase tracking-wider flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" /> Пазл собран! Точное совпадение с оригиналом
                </div>
              )}

              {/* Exact Square Canvas / Grid */}
              <div
                className={`w-full max-w-[340px] sm:max-w-[380px] md:max-w-[400px] aspect-square bg-black rounded-2xl overflow-hidden shadow-2xl transition-all ${
                  isWon
                    ? 'border-2 border-[#8f9bff] shadow-[0_0_30px_rgba(143,155,255,0.4)] p-0'
                    : 'border-2 border-[#222840] p-[2px]'
                }`}
              >
                {isWon && fullSquareImg ? (
                  /* Flawless continuous assembled original square image without any cuts */
                  <img
                    src={fullSquareImg}
                    alt="Собранный пазл"
                    className="w-full h-full object-cover block animate-in zoom-in-95 duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  /* 3x3 interactive playing grid */
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[2px]">
                    {tiles.map((tileIndex, slotIdx) => {
                      const isEmpty = tileIndex === 8;
                      const pieceImg = tilePieces[tileIndex];

                      return (
                        <div
                          key={slotIdx}
                          onClick={() => handleTileClick(slotIdx)}
                          className={`relative w-full h-full aspect-square overflow-hidden cursor-pointer select-none flex items-center justify-center transition-all ${
                            isEmpty
                              ? 'bg-[#151515] border border-dashed border-gray-800'
                              : 'bg-[#161a26] border border-black/40 hover:brightness-110 active:scale-[0.98]'
                          }`}
                        >
                          {!isEmpty && pieceImg && (
                            <img
                              src={pieceImg}
                              alt={`Кусочек ${tileIndex + 1}`}
                              className="w-full h-full object-cover pointer-events-none select-none block"
                              draggable={false}
                              referrerPolicy="no-referrer"
                            />
                          )}

                          {!isEmpty && showNumbers && (
                            <span className="absolute top-1 left-1 bg-black/85 text-[#8f9bff] text-[10px] font-black w-4 h-4 flex items-center justify-center border border-[#222840] shadow-md pointer-events-none">
                              {tileIndex + 1}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 text-center text-xs text-gray-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#8f9bff]" />
                <span>
                  {isWon
                    ? 'Изображение собрано 1 в 1 без пропусков и смещений!'
                    : 'Нажимайте на соседние кусочки рядом с пустым полем для сборки'}
                </span>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* POPUP WIN MODAL */}
      {showWinModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#12151e] border-2 border-[#8f9bff] rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(143,155,255,0.3)] space-y-4 relative">
            
            <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-[#8f9bff] flex items-center justify-center text-4xl shadow-xl animate-bounce">
              🏆
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full border border-yellow-300 shadow-md">
                +1 ₽
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-[#8f9bff] uppercase tracking-wider">
                Пазл собран идеально! 🎉
              </h3>
              <p className="text-white text-sm font-bold">
                Собрано за <span className="text-[#8f9bff] font-black">{moves} ходов</span>!
              </p>
            </div>

            {/* Money Reward Box */}
            <div className="bg-gradient-to-r from-amber-950/60 via-emerald-950/70 to-amber-950/60 border border-amber-500/50 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-xs uppercase">
                <Coins className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Денежное вознаграждение</span>
              </div>
              <div className="text-3xl font-black text-amber-300 font-mono tracking-tight">
                +1.00 РУБЛЬ
              </div>
              <p className="text-[11px] text-gray-300">
                Сумма 1 ₽ зачислена на счёт. Всего заработано: <strong className="text-[#8f9bff]">{totalEarned} ₽</strong>
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowWinModal(false);
                  shuffle();
                }}
                className="w-full py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs uppercase rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Забрать 1 ₽ и играть снова</span>
              </button>

              <button
                onClick={() => setShowWinModal(false)}
                className="w-full py-2.5 bg-[#171b27] hover:bg-[#212536] text-gray-300 font-bold text-xs uppercase rounded-xl border border-[#222840] transition-colors cursor-pointer"
              >
                Полюбоваться результатом
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolWrapper>
  );
};
