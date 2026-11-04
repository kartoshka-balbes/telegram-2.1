import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { XCircle, Ban } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

const QUESTIONS = [
  {
    question: 'Что означает данный дорожный знак «Главная дорога»?',
    options: ['Предоставляет право первоочередного проезда нерегулируемых перекрестков', 'Обязывает уступить дорогу', 'Запрещает въезд всех транспортных средств', 'Разрешает разворот'],
    correct: 0,
  },
  {
    question: 'Разрешен ли обгон транспортного средства на пешеходном переходе?',
    options: ['Разрешен в любых случаях', 'Запрещен категорически', 'Разрешен при отсутствии пешеходов', 'Запрещен только в темное время суток'],
    correct: 1,
  },
  {
    question: 'Какая максимальная скорость движения транспортных средств в жилой зоне?',
    options: ['20 км/ч', '60 км/ч', '40 км/ч', '90 км/ч'],
    correct: 0,
  },
];

export const PddExamTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'fail' | 'pass' | null>(null);

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    const ok = idx === QUESTIONS[current].correct;
    const nextScore = score + (ok ? 1 : 0);
    const nextWrong = wrong + (ok ? 0 : 1);
    if (ok) {
      soundManager.playBeep(1200, 0.1);
      setScore(nextScore);
    } else {
      soundManager.playBeep(400, 0.2);
      setWrong(nextWrong);
    }

    setTimeout(() => {
      setSelected(null);
      if (current < QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        // хотя бы 1 ошибка — права не выданы; без ошибок — всё равно не выдадут
        setResult(nextWrong > 0 ? 'fail' : 'pass');
        if (nextWrong > 0) soundManager.playFail();
      }
    }, 1200);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setWrong(0);
    setSelected(null);
    setResult(null);
  };

  const q = QUESTIONS[current];

  return (
    <ToolWrapper title="Билеты на экзамен ПДД" onClose={onClose}>
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 select-none">
        <div className="bg-white/[0.05] p-3.5 rounded-full border border-white/10 flex items-center justify-between px-5">
          <span className="text-xs font-bold text-white">
            Вопрос {current + 1} из {QUESTIONS.length}
          </span>
          <span className="text-[11px] bg-[#8f9bff]/20 text-[#b8c0ff] px-3 py-1 rounded-full font-bold">Счёт: {score}</span>
        </div>

        <div className="bg-white/[0.05] border border-white/10 p-5 rounded-3xl space-y-4">
          <h4 className="text-sm font-bold text-white leading-relaxed">{q.question}</h4>

          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
                className={`w-full p-3.5 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                  selected === idx
                    ? idx === q.correct
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-red-500/20 border-red-400 text-red-200'
                    : 'bg-black/20 border-white/10 text-gray-200 hover:border-[#8f9bff]'
                }`}
              >
                {idx + 1}. {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-xs rounded-3xl bg-[#1a1d2e] border border-white/15 p-6 text-center shadow-2xl">
            <div
              className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 ${
                result === 'fail' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {result === 'fail' ? <XCircle className="w-7 h-7" /> : <Ban className="w-7 h-7" />}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {result === 'fail' ? 'Права не выданы' : 'Права не выдадут'}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {result === 'fail'
                ? `Экзамен не сдан: допущено ошибок — ${wrong}. Водительское удостоверение не выдано.`
                : 'Все ответы верные, но права всё равно не выдадут просто так.'}
            </p>
            <button
              onClick={restart}
              className="mt-5 w-full py-3 rounded-full bg-gradient-to-r from-[#8f9bff] to-[#b18cff] text-slate-950 font-bold text-sm cursor-pointer"
            >
              Пройти заново
            </button>
          </div>
        </div>
      )}
    </ToolWrapper>
  );
};
