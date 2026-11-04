import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { REVIEW_NICKNAMES } from '../../data/mockData';
import { Star, AlertTriangle, Send } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}

export const ReviewsTool: React.FC<ToolProps> = ({ onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', author: 'илон маск', text: 'приложение крутое', rating: 5, date: 'Только что' },
    { id: '2', author: 'чебурашка', text: 'приложение крутое', rating: 5, date: '1 мин назад' },
    { id: '3', author: 'влад бумага А4', text: 'приложение крутое', rating: 5, date: '3 мин назад' },
  ]);

  const [authorName, setAuthorName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const author = REVIEW_NICKNAMES[Math.floor(Math.random() * REVIEW_NICKNAMES.length)];
      const newReview: Review = {
        id: Date.now().toString(),
        author,
        text: 'приложение крутое',
        rating: 5,
        date: 'Только что',
      };
      setReviews((prev) => [newReview, ...prev.slice(0, 19)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedRating < 5) {
      setErrorMessage(`ОШИБКА! ВНИМАНИЕ: Оценка ${selectedRating} ⭐ не принимается разработчиками! Разрешено ставить только 5 звёзд!`);
      return;
    }

    if (!authorName.trim() || !reviewText.trim()) {
      setErrorMessage('Заполните имя и текст отзыва!');
      return;
    }

    const userRev: Review = {
      id: Date.now().toString(),
      author: authorName.trim(),
      text: reviewText.trim(),
      rating: 5,
      date: 'Только что',
    };

    setReviews([userRev, ...reviews]);
    setAuthorName('');
    setReviewText('');
    setSelectedRating(5);
  };

  return (
    <ToolWrapper title="Отзывы" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-3 py-2 font-mono">
        <div className="bg-slate-900 border border-slate-800 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-2xl mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <h3 className="text-lg font-black text-white uppercase">Средняя оценка: 5.0 / 5.0</h3>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleSubmitReview} className="bg-slate-900 border border-slate-800 p-3 space-y-2">
          <span className="text-xs font-black text-cyan-400 uppercase block">Оставить свой отзыв:</span>

          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Ваше имя..."
            className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
          />

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Текст вашего отзыва..."
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">Выберите оценку:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => {
                    setSelectedRating(star);
                    setErrorMessage(null);
                  }}
                  className="p-1 cursor-pointer transition-transform active:scale-125"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-2 bg-red-950 border border-red-700 text-red-200 text-xs font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Опубликовать отзыв
          </button>
        </form>

        {/* List of Reviews */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900 border border-slate-800 p-3 shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-cyan-400 capitalize text-xs">
                  {rev.author}
                </span>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-white text-xs font-medium">"{rev.text}"</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1 block">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
