import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { BookOpen, Lock, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  price: string;
  demoText: string;
}

const BOOKS_CATALOG: Book[] = [
  {
    id: '1',
    title: 'Война и Мир (Коллекционное издание)',
    author: 'Лев Толстой',
    year: '1869 г.',
    price: '4 500 000 ₽',
    demoText: '«Его сиятельство граф Ростов сидел в гостиной и читал вечернюю газету...» [ДЕМО ФРАГМЕНТ ОКОНЧЕН]',
  },
  {
    id: '2',
    title: 'Преступление и Наказание',
    author: 'Федор Достоевский',
    year: '1866 г.',
    price: '2 800 000 ₽',
    demoText: '«В начале июля, в чрезвычайно жаркое время, один молодой человек вышел из своей каморки...» [ДЕМО ВЕРСИЯ]',
  },
  {
    id: '3',
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    year: '1940 г.',
    price: '3 200 000 ₽',
    demoText: '«Однажды весною, в час небывало жаркого заката, в Москве, на Патриарших прудах...» [ДЕМО ОГРАНИЧЕНИЕ]',
  },
  {
    id: '4',
    title: '1984',
    author: 'Джордж Оруэлл',
    year: '1949 г.',
    price: '1 950 000 ₽',
    demoText: '«Был холодный ясный апрельский день, и часы пробили тринадцать...» [ДЕМО-ВЕРСИЯ]',
  },
  {
    id: '5',
    title: 'Евгений Онегин',
    author: 'Александр Пушкин',
    year: '1833 г.',
    price: '1 500 000 ₽',
    demoText: '«Мой дядя самых честных правил, когда не в шутку занемог...» [КОНЕЦ ОЗНАКОМИТЕЛЬНОГО ОТРЕЗКА]',
  },
  {
    id: '6',
    title: 'Собачье Сердце',
    author: 'Михаил Булгаков',
    year: '1925 г.',
    price: '2 100 000 ₽',
    demoText: '«У-у-у-у-у-гу-гу-гг-у-у! О, гляньте на меня, я погибаю. Вьюга в подворотне...» [ДЕМО]',
  },
  {
    id: '7',
    title: 'Мертвые Души',
    author: 'Николай Гоголь',
    year: '1842 г.',
    price: '1 800 000 ₽',
    demoText: '«В ворота гостиницы губернского города Н. въехала довольно красивая рессорная небольшая бричка...» [ДЕМО]',
  },
  {
    id: '8',
    title: 'Граф Монте-Кристо',
    author: 'Александр Дюма',
    year: '1844 г.',
    price: '3 800 000 ₽',
    demoText: '«24 февраля 1815 года смотрящий на башне Нотр-Дам-де-ла-Гар подал сигнал о приближении трехмачтового корабля...» [ДЕМО]',
  },
];

export const BooksTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState<string | null>(null);

  const handleOpenBook = (book: Book) => {
    soundManager.playBeep(800, 0.1);
    setActiveBook(book);
  };

  const handleAttemptPurchase = (price: string) => {
    soundManager.playBeep(400, 0.2);
    setShowInsufficientFundsModal(price);
  };

  return (
    <ToolWrapper title="Книги" onClose={onClose} headerColor="bg-amber-950 border-amber-900">
      {/* Insufficient Funds On-Screen Notification Window */}
      {showInsufficientFundsModal && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-150 select-none">
          <div className="w-full max-w-sm bg-[#18110b] border border-red-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white font-sans">Недостаточно средств</h3>
              <p className="text-xs text-red-400 font-mono font-bold">Ошибка списания средств</p>
            </div>

            <div className="p-4 bg-black/60 border border-red-900/50 rounded-2xl space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Требуется к оплате:</span>
                <span className="text-amber-400 font-black text-sm">{showInsufficientFundsModal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Баланс вашего счета:</span>
                <span className="text-red-400 font-black">0,00 ₽</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Для оформления покупки электронной книги пополните баланс через приложение онлайн-банка.
            </p>

            <button
              onClick={() => setShowInsufficientFundsModal(null)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl cursor-pointer shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              Понятно, закрыть
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none">
        {/* Book Catalog Grid */}
        <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
          {BOOKS_CATALOG.map((b) => (
            <div key={b.id} className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-amber-500/50">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-12 bg-amber-950 border border-amber-700 rounded flex items-center justify-center text-amber-400 font-bold shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-black text-white truncate">{b.title}</h3>
                  <p className="text-[10px] text-amber-400 font-bold">{b.author} • {b.year}</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenBook(b)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer rounded-2xl shrink-0"
              >
                Читать
              </button>
            </div>
          ))}
        </div>

        {/* Demo Reading Window (Modal) */}
        {activeBook && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-white/[0.05] backdrop-blur-xl border border-amber-500 rounded-2xl p-5 space-y-4 text-center shadow-2xl relative">
              <button
                onClick={() => setActiveBook(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <BookOpen className="w-10 h-10 text-amber-400 mx-auto" />

              <div>
                <h3 className="text-sm font-black text-white">{activeBook.title}</h3>
                <p className="text-xs text-amber-400 font-bold">{activeBook.author}</p>
              </div>

              <div className="p-3 bg-black/30 border border-white/10 rounded-2xl text-slate-300 italic text-[11px] leading-relaxed">
                "{activeBook.demoText}"
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="text-xs text-slate-400">
                  Стоимость полной версии: <span className="text-amber-400 font-black text-sm">{activeBook.price}</span>
                </div>

                <button
                  onClick={() => handleAttemptPurchase(activeBook.price)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 rounded-2xl cursor-pointer shadow-lg transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Купить полную версию</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
