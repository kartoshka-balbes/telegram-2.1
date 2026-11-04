import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { RotateCw, Check, X, Plus, Trash2, Layers } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface Card {
  id: string;
  front: string;
  back: string;
}

const KEY = 'flashcards_user_cards';

const load = (): Card[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Card[];
  } catch {}
  return []; // стандартных карточек нет
};

export const FlashcardsTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cards, setCards] = useState<Card[]>(load);
  const [mode, setMode] = useState<'study' | 'edit'>(() => (load().length ? 'study' : 'edit'));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const persist = (next: Card[]) => {
    setCards(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    soundManager.playBeep(1100, 0.06);
    persist([...cards, { id: String(Date.now()), front: front.trim(), back: back.trim() }]);
    setFront('');
    setBack('');
  };

  const removeCard = (id: string) => {
    persist(cards.filter((c) => c.id !== id));
    setIndex(0);
  };

  const nextCard = () => {
    soundManager.playBeep(1000, 0.05);
    setFlipped(false);
    setIndex((i) => (cards.length ? (i + 1) % cards.length : 0));
  };

  const current = cards[index];

  return (
    <ToolWrapper title="Флешкарточки для обучения" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 select-none gap-4">
        <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10">
          {([
            ['study', 'Учить', Layers],
            ['edit', 'Мои карточки', Plus],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => {
                setMode(id);
                setFlipped(false);
                setIndex(0);
              }}
              className={`py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                mode === id ? 'bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {mode === 'study' && (
          <>
            {cards.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3 py-10">
                <div className="text-5xl">🎴</div>
                <p className="text-sm">Карточек пока нет. Создайте свои во вкладке «Мои карточки».</p>
                <button onClick={() => setMode('edit')} className="px-5 py-2.5 rounded-full bg-white text-slate-900 text-xs font-bold cursor-pointer">
                  Создать карточку
                </button>
              </div>
            ) : (
              <>
                <div className="text-center text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                  Карточка {index + 1} из {cards.length}
                </div>
                <div
                  onClick={() => {
                    soundManager.playBeep(1100, 0.05);
                    setFlipped(!flipped);
                  }}
                  className="w-full h-60 bg-gradient-to-br from-[#2b2f66] to-[#1a1d34] border border-white/15 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all relative"
                >
                  <div className="text-[10px] text-[#b8c0ff] uppercase font-semibold absolute top-4 right-4 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Нажми чтобы перевернуть
                  </div>
                  <div className="text-2xl font-bold text-white break-words max-w-full">{flipped ? current.back : current.front}</div>
                  <div className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">{flipped ? 'Ответ' : 'Вопрос / Слово'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={nextCard} className="py-3.5 bg-red-500/15 border border-red-500/40 text-red-300 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer">
                    <X className="w-4 h-4" /> Повторить
                  </button>
                  <button onClick={nextCard} className="py-3.5 bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer">
                    <Check className="w-4 h-4" /> Знаю
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {mode === 'edit' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-4 space-y-3">
              <div className="text-xs font-semibold text-gray-300">Новая карточка</div>
              <input
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Лицевая сторона (вопрос / слово)"
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
              <input
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Обратная сторона (ответ)"
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
              <button
                onClick={addCard}
                disabled={!front.trim() || !back.trim()}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-bold text-sm cursor-pointer disabled:opacity-40"
              >
                Добавить карточку
              </button>
            </div>

            <div className="space-y-2">
              {cards.length === 0 && <div className="text-center text-xs text-gray-500 py-4">У вас пока нет карточек</div>}
              {cards.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.05] border border-white/10 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">{c.front}</div>
                    <div className="text-xs text-gray-400 truncate">{c.back}</div>
                  </div>
                  <button onClick={() => removeCard(c.id)} className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 cursor-pointer" aria-label="Удалить">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
