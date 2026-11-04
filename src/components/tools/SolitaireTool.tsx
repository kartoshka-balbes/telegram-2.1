import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RotateCcw, Undo } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type Suit = '♠' | '♥' | '♦' | '♣';
type CardColor = 'red' | 'black';

interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 = A, 2..10, 11 = J, 12 = Q, 13 = K
  color: CardColor;
  faceUp: boolean;
}

const SUITS: { suit: Suit; color: CardColor }[] = [
  { suit: '♠', color: 'black' },
  { suit: '♥', color: 'red' },
  { suit: '♦', color: 'red' },
  { suit: '♣', color: 'black' },
];

const getRankLabel = (rank: number): string => {
  switch (rank) {
    case 1: return 'A';
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    default: return rank.toString();
  }
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(({ suit, color }) => {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}-${Math.random().toString(36).substring(2, 7)}`,
        suit,
        rank,
        color,
        faceUp: false,
      });
    }
  });
  // Shuffle Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles
  tableau: Card[][]; // 7 columns
  score: number;
  moves: number;
}

export const SolitaireTool: React.FC<ToolProps> = ({ onClose }) => {
  const handleExit = () => {
    soundManager.playFail();
    onClose();
  };

  const [gameState, setGameState] = useState<GameState>(() => initGame());
  const [history, setHistory] = useState<GameState[]>([]);
  const [selectedCard, setSelectedCard] = useState<{ source: 'waste' | 'tableau'; colIdx?: number; cardIdx?: number } | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  useEffect(() => {
    if (isWon) soundManager.playWin();
  }, [isWon]);
  const [seconds, setSeconds] = useState<number>(0);

  function initGame(): GameState {
    const deck = createDeck();
    const tableau: Card[][] = [[], [], [], [], [], [], []];

    // Deal 1 to 7 cards into columns
    for (let col = 0; col < 7; col++) {
      for (let i = 0; i <= col; i++) {
        const card = deck.pop()!;
        if (i === col) {
          card.faceUp = true;
        }
        tableau[col].push(card);
      }
    }

    return {
      stock: deck,
      waste: [],
      foundations: [[], [], [], []],
      tableau,
      score: 0,
      moves: 0,
    };
  }

  const startNewGame = () => {
    soundManager.playBeep(600, 0.08);
    const newG = initGame();
    setGameState(newG);
    setHistory([]);
    setSelectedCard(null);
    setIsWon(false);
    setSeconds(0);
  };

  // Timer ticker
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  // Check victory condition: all 4 foundations have 13 cards (total 52)
  useEffect(() => {
    const totalFoundations = gameState.foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalFoundations === 52 && !isWon) {
      setIsWon(true);
      soundManager.playSiren();
    }
  }, [gameState.foundations, isWon]);

  const saveHistory = () => {
    setHistory((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(gameState))]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setGameState(last);
    setSelectedCard(null);
    soundManager.playBeep(500, 0.05);
  };

  // Click Stock
  const handleStockClick = () => {
    saveHistory();
    soundManager.playBeep(700, 0.04);
    setSelectedCard(null);

    setGameState((prev) => {
      if (prev.stock.length === 0) {
        // Recycle waste to stock
        if (prev.waste.length === 0) return prev;
        const recycledStock = prev.waste.map((c) => ({ ...c, faceUp: false })).reverse();
        return {
          ...prev,
          stock: recycledStock,
          waste: [],
          moves: prev.moves + 1,
          score: Math.max(0, prev.score - 20),
        };
      } else {
        // Draw 1 card from stock to waste
        const stockCopy = [...prev.stock];
        const drawn = stockCopy.pop()!;
        drawn.faceUp = true;
        return {
          ...prev,
          stock: stockCopy,
          waste: [...prev.waste, drawn],
          moves: prev.moves + 1,
        };
      }
    });
  };

  // Try auto-moving a single card or stack
  const tryAutoMove = (card: Card, source: 'waste' | 'tableau', colIdx?: number, cardIdx?: number): boolean => {
    // 1. Try moving to Foundation
    for (let f = 0; f < 4; f++) {
      const foundation = gameState.foundations[f];
      const topFoundation = foundation[foundation.length - 1];

      // Legal to foundation: Ace if empty, or same suit and rank = top + 1
      if ((!topFoundation && card.rank === 1) || (topFoundation && topFoundation.suit === card.suit && card.rank === topFoundation.rank + 1)) {
        // If moving from tableau, only top single card can move to foundation
        if (source === 'tableau' && colIdx !== undefined && cardIdx !== undefined) {
          if (cardIdx !== gameState.tableau[colIdx].length - 1) continue;
        }

        saveHistory();
        soundManager.playBeep(900, 0.06);

        setGameState((prev) => {
          const nextFoundations = prev.foundations.map((fn, idx) => (idx === f ? [...fn, card] : fn));
          let nextTableau = prev.tableau;
          let nextWaste = prev.waste;

          if (source === 'waste') {
            nextWaste = prev.waste.slice(0, -1);
          } else if (source === 'tableau' && colIdx !== undefined) {
            nextTableau = prev.tableau.map((col, idx) => {
              if (idx === colIdx) {
                const nextCol = col.slice(0, -1);
                if (nextCol.length > 0) {
                  nextCol[nextCol.length - 1].faceUp = true;
                }
                return nextCol;
              }
              return col;
            });
          }

          return {
            ...prev,
            foundations: nextFoundations,
            tableau: nextTableau,
            waste: nextWaste,
            moves: prev.moves + 1,
            score: prev.score + 10,
          };
        });
        return true;
      }
    }

    // 2. Try moving to another Tableau column
    for (let t = 0; t < 7; t++) {
      if (source === 'tableau' && colIdx === t) continue;
      const targetCol = gameState.tableau[t];
      const topCard = targetCol[targetCol.length - 1];

      // Legal to tableau: King if empty, or opposite color and rank = top - 1
      if ((!topCard && card.rank === 13) || (topCard && topCard.faceUp && topCard.color !== card.color && topCard.rank === card.rank + 1)) {
        saveHistory();
        soundManager.playBeep(800, 0.05);

        setGameState((prev) => {
          let movingCards: Card[] = [];
          let nextWaste = prev.waste;
          let nextTableau = prev.tableau.map((c) => [...c]);

          if (source === 'waste') {
            movingCards = [card];
            nextWaste = prev.waste.slice(0, -1);
          } else if (source === 'tableau' && colIdx !== undefined && cardIdx !== undefined) {
            movingCards = nextTableau[colIdx].slice(cardIdx);
            nextTableau[colIdx] = nextTableau[colIdx].slice(0, cardIdx);
            if (nextTableau[colIdx].length > 0) {
              nextTableau[colIdx][nextTableau[colIdx].length - 1].faceUp = true;
            }
          }

          nextTableau[t] = [...nextTableau[t], ...movingCards];

          return {
            ...prev,
            tableau: nextTableau,
            waste: nextWaste,
            moves: prev.moves + 1,
            score: prev.score + 5,
          };
        });
        return true;
      }
    }

    return false;
  };

  // Click on a Waste card
  const handleWasteCardClick = () => {
    if (gameState.waste.length === 0) return;
    const topWaste = gameState.waste[gameState.waste.length - 1];
    
    const moved = tryAutoMove(topWaste, 'waste');
    if (!moved) {
      if (selectedCard && selectedCard.source === 'waste') {
        setSelectedCard(null);
      } else {
        setSelectedCard({ source: 'waste' });
        soundManager.playBeep(750, 0.03);
      }
    } else {
      setSelectedCard(null);
    }
  };

  // Click on a Tableau card
  const handleTableauCardClick = (colIdx: number, cardIdx: number) => {
    const col = gameState.tableau[colIdx];
    const card = col[cardIdx];

    // If face down and top, flip it
    if (!card.faceUp) {
      if (cardIdx === col.length - 1) {
        saveHistory();
        soundManager.playBeep(650, 0.04);
        setGameState((prev) => {
          const nextTab = prev.tableau.map((c, i) => {
            if (i === colIdx) {
              const updated = [...c];
              updated[cardIdx].faceUp = true;
              return updated;
            }
            return c;
          });
          return { ...prev, tableau: nextTab, score: prev.score + 5 };
        });
      }
      return;
    }

    // If a card was already selected elsewhere, check if we can place it on this column
    if (selectedCard) {
      if (selectedCard.source === 'waste') {
        const topWaste = gameState.waste[gameState.waste.length - 1];
        if (topWaste && tryAutoMove(topWaste, 'waste')) {
          setSelectedCard(null);
          return;
        }
      } else if (selectedCard.source === 'tableau' && selectedCard.colIdx !== undefined && selectedCard.cardIdx !== undefined) {
        const sourceCol = gameState.tableau[selectedCard.colIdx];
        const sourceCard = sourceCol[selectedCard.cardIdx];
        if (sourceCard && tryAutoMove(sourceCard, 'tableau', selectedCard.colIdx, selectedCard.cardIdx)) {
          setSelectedCard(null);
          return;
        }
      }
    }

    // Otherwise try auto-moving this card/stack
    const moved = tryAutoMove(card, 'tableau', colIdx, cardIdx);
    if (!moved) {
      if (selectedCard?.colIdx === colIdx && selectedCard?.cardIdx === cardIdx) {
        setSelectedCard(null);
      } else {
        setSelectedCard({ source: 'tableau', colIdx, cardIdx });
        soundManager.playBeep(750, 0.03);
      }
    } else {
      setSelectedCard(null);
    }
  };

  // Click on empty Tableau spot
  const handleEmptyTableauClick = (colIdx: number) => {
    if (!selectedCard) return;

    if (selectedCard.source === 'waste') {
      const topWaste = gameState.waste[gameState.waste.length - 1];
      if (topWaste && topWaste.rank === 13) {
        tryAutoMove(topWaste, 'waste');
        setSelectedCard(null);
      }
    } else if (selectedCard.source === 'tableau' && selectedCard.colIdx !== undefined && selectedCard.cardIdx !== undefined) {
      const sourceCol = gameState.tableau[selectedCard.colIdx];
      const sourceCard = sourceCol[selectedCard.cardIdx];
      if (sourceCard && sourceCard.rank === 13) {
        tryAutoMove(sourceCard, 'tableau', selectedCard.colIdx, selectedCard.cardIdx);
        setSelectedCard(null);
      }
    }
  };

  // Format time mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ToolWrapper title="Пасьянс Косынка" onClose={handleExit} headerColor="bg-emerald-950 border-emerald-800">
      <div className="flex-1 flex flex-col w-full h-full bg-[#072415] text-white select-none p-2 sm:p-4 font-sans relative overflow-y-auto">
        
        {/* Victory Celebration Modal */}
        {isWon && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-emerald-950 border-2 border-emerald-400 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>
              <h2 className="text-xl font-black text-emerald-300 uppercase tracking-wider">
                Победа в Пасьянсе!
              </h2>
              <p className="text-xs text-gray-300">
                Все карты собраны в стопки оснований! Превосходная раскладка!
              </p>
              <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60 text-xs font-mono flex justify-around">
                <div>
                  <div className="text-gray-400 text-[10px]">Время</div>
                  <div className="font-bold text-[#8f9bff]">{formatTime(seconds)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px]">Ходы</div>
                  <div className="font-bold text-white">{gameState.moves}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px]">Очки</div>
                  <div className="font-bold text-amber-300">{gameState.score}</div>
                </div>
              </div>
              <button
                onClick={startNewGame}
                className="w-full py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black uppercase text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Сыграть ещё раз
              </button>
            </div>
          </div>
        )}

        {/* Top Game Bar */}
        <div className="flex items-center justify-between bg-emerald-950/90 border border-emerald-800/80 px-3 py-2 rounded-2xl mb-3 shrink-0 shadow-lg flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-emerald-300 flex items-center gap-1 font-bold">
              <span>⏱️</span> {formatTime(seconds)}
            </span>
            <span className="text-gray-300 font-bold">
              Ходы: <span className="text-white">{gameState.moves}</span>
            </span>
            <span className="text-amber-400 font-bold">
              Очки: <span className="text-amber-300">{gameState.score}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1.5 bg-emerald-900/80 hover:bg-emerald-800 disabled:opacity-30 text-emerald-200 rounded-xl border border-emerald-700 cursor-pointer flex items-center gap-1 text-[11px]"
              title="Отменить ход"
            >
              <Undo className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Отмена</span>
            </button>
            <button
              onClick={startNewGame}
              className="px-2.5 py-1.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black rounded-xl text-[11px] flex items-center gap-1 cursor-pointer shadow-md"
              title="Новая игра"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Новая игра</span>
            </button>
          </div>
        </div>

        {/* Upper Zone: Stock & Waste on Left, 4 Foundations on Right */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4 shrink-0">
          
          {/* Stock Pile */}
          <div className="col-span-1 flex justify-center">
            <div
              onClick={handleStockClick}
              className={`w-full max-w-[68px] aspect-[5/7] rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center shadow-md ${
                gameState.stock.length > 0
                  ? 'bg-blue-900 border-blue-400/80 hover:scale-105'
                  : 'bg-emerald-900/30 border-dashed border-emerald-600/50 hover:bg-emerald-900/50'
              }`}
            >
              {gameState.stock.length > 0 ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-900 rounded-md border border-blue-300/40 flex items-center justify-center text-blue-200 font-black text-xs">
                  🂠
                </div>
              ) : (
                <RotateCcw className="w-4 h-4 text-emerald-400" />
              )}
            </div>
          </div>

          {/* Waste Pile */}
          <div className="col-span-1 flex justify-center">
            {gameState.waste.length > 0 ? (
              <div
                onClick={handleWasteCardClick}
                className={`w-full max-w-[68px] aspect-[5/7] bg-white rounded-lg border-2 p-1 flex flex-col justify-between items-center shadow-lg cursor-pointer transition-all ${
                  selectedCard?.source === 'waste'
                    ? 'border-amber-400 ring-2 ring-amber-400 scale-105'
                    : 'border-slate-900 hover:scale-105'
                }`}
              >
                {(() => {
                  const card = gameState.waste[gameState.waste.length - 1];
                  const isRed = card.color === 'red';
                  return (
                    <>
                      <div className={`text-[10px] sm:text-xs font-black self-start leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                        {getRankLabel(card.rank)}{card.suit}
                      </div>
                      <div className={`text-base sm:text-xl ${isRed ? 'text-red-600' : 'text-black'}`}>
                        {card.suit}
                      </div>
                      <div className={`text-[10px] sm:text-xs font-black self-end leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                        {getRankLabel(card.rank)}{card.suit}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="w-full max-w-[68px] aspect-[5/7] rounded-lg border-2 border-emerald-800/40 bg-emerald-950/30" />
            )}
          </div>

          {/* Spacer */}
          <div className="col-span-1" />

          {/* 4 Foundations */}
          {gameState.foundations.map((pile, fIdx) => {
            const topCard = pile[pile.length - 1];
            const baseSuit = SUITS[fIdx].suit;
            return (
              <div key={fIdx} className="col-span-1 flex justify-center">
                <div
                  className={`w-full max-w-[68px] aspect-[5/7] rounded-lg border-2 flex flex-col justify-between items-center p-1 shadow-md ${
                    topCard
                      ? 'bg-white border-slate-900 cursor-pointer'
                      : 'bg-emerald-950/40 border-dashed border-emerald-600/60'
                  }`}
                >
                  {topCard ? (
                    <>
                      <div className={`text-[10px] sm:text-xs font-black self-start leading-none ${topCard.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                        {getRankLabel(topCard.rank)}{topCard.suit}
                      </div>
                      <div className={`text-base sm:text-xl ${topCard.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                        {topCard.suit}
                      </div>
                      <div className={`text-[10px] sm:text-xs font-black self-end leading-none ${topCard.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                        {getRankLabel(topCard.rank)}{topCard.suit}
                      </div>
                    </>
                  ) : (
                    <span className="m-auto text-emerald-600/70 text-lg font-bold">
                      {baseSuit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lower Zone: 7 Tableau Columns */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1 items-start min-h-[360px]">
          {gameState.tableau.map((column, colIdx) => (
            <div
              key={colIdx}
              onClick={() => {
                if (column.length === 0) handleEmptyTableauClick(colIdx);
              }}
              className="flex flex-col items-center relative min-h-[140px] w-full"
            >
              {column.length === 0 && (
                <div className="w-full max-w-[68px] aspect-[5/7] rounded-lg border-2 border-dashed border-emerald-700/40 bg-emerald-950/20 flex items-center justify-center text-emerald-600/40 text-xs font-bold">
                  K
                </div>
              )}

              {column.map((card, cardIdx) => {
                const isSelected = selectedCard?.source === 'tableau' && selectedCard.colIdx === colIdx && selectedCard.cardIdx === cardIdx;
                const isRed = card.color === 'red';

                return (
                  <div
                    key={card.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTableauCardClick(colIdx, cardIdx);
                    }}
                    style={{
                      marginTop: cardIdx === 0 ? 0 : '-68%',
                      zIndex: cardIdx + 1,
                    }}
                    className={`w-full max-w-[68px] aspect-[5/7] rounded-lg border-2 transition-all select-none cursor-pointer ${
                      card.faceUp
                        ? isSelected
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 scale-105 shadow-2xl'
                          : 'bg-white border-slate-900 hover:brightness-95 shadow-md'
                        : 'bg-gradient-to-br from-blue-700 to-indigo-950 border-blue-400/80 shadow'
                    }`}
                  >
                    {card.faceUp ? (
                      <div className="w-full h-full p-1 flex flex-col justify-between">
                        <div className={`text-[10px] sm:text-xs font-black leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                          {getRankLabel(card.rank)}{card.suit}
                        </div>
                        <div className={`text-center text-sm sm:text-lg leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                          {card.suit}
                        </div>
                        <div className={`text-[10px] sm:text-xs font-black self-end leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                          {getRankLabel(card.rank)}{card.suit}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-200/50 text-[10px]">
                        ♦
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Helper Hint */}
        <div className="mt-2 text-center text-[10px] text-emerald-400/80 font-mono">
          Нажмите на карту для автоматического хода в дом или на столбик
        </div>

      </div>
    </ToolWrapper>
  );
};
