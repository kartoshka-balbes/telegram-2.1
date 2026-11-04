import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Calculator, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MultiplicationTableTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedNum, setSelectedNum] = useState<number>(7);
  const [quizMode, setQuizMode] = useState(false);
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(8);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateNextQuestion = () => {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    setNumA(a);
    setNumB(b);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const ans = parseInt(userAnswer.trim(), 10);
    if (ans === numA * numB) {
      soundManager.playBeep(1000, 0.15);
      setFeedback('correct');
      setScore((prev) => prev + 10);
      setTimeout(() => generateNextQuestion(), 1000);
    } else {
      soundManager.playBeep(200, 0.2);
      setFeedback('wrong');
    }
  };

  return (
    <ToolWrapper title="Таблица умножения" onClose={onClose} headerColor="bg-indigo-950 border-indigo-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundManager.playBeep(800, 0.05);
              setQuizMode(false);
            }}
            className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              !quizMode ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Таблица (1-10)
          </button>
          <button
            onClick={() => {
              soundManager.playBeep(800, 0.05);
              setQuizMode(true);
              generateNextQuestion();
            }}
            className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              quizMode ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Проверка знаний (Викторина)
          </button>
        </div>

        {!quizMode ? (
          <>
            {/* Number Selector Bar */}
            <div className="flex justify-between gap-1 overflow-x-auto pb-1">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    soundManager.playBeep(700, 0.05);
                    setSelectedNum(n);
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-xs shrink-0 cursor-pointer transition-all ${
                    selectedNum === n
                      ? 'bg-indigo-500 text-white scale-105 shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ×{n}
                </button>
              ))}
            </div>

            {/* Multiplication Table Grid for Selected Number */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5 max-h-[360px] overflow-y-auto">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((multiplier) => {
                const res = selectedNum * multiplier;
                return (
                  <div
                    key={multiplier}
                    className="p-2 bg-slate-950 border border-slate-800/80 rounded-xl flex justify-between items-center text-xs font-bold hover:border-indigo-500/50"
                  >
                    <span className="text-slate-300">
                      {selectedNum} × {multiplier} =
                    </span>
                    <span className="text-indigo-400 font-black text-sm">{res}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Quiz Game View */
          <div className="bg-slate-900 border-2 border-indigo-500/80 p-5 rounded-2xl space-y-4 text-center shadow-2xl">
            <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
              <span>Тренировка устного счета</span>
              <span className="text-amber-400 font-black text-xs">Очки: {score}</span>
            </div>

            <div className="py-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="text-3xl font-black text-white font-mono">
                {numA} × {numB} = ?
              </div>
            </div>

            <form onSubmit={handleCheckAnswer} className="space-y-3">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Введите ответ..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-xl p-3 text-center text-xl font-bold text-white outline-none font-mono"
              />

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg"
              >
                Ответить
              </button>
            </form>

            {feedback === 'correct' && (
              <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold rounded-xl flex items-center justify-center gap-2 animate-in zoom-in">
                <CheckCircle2 className="w-5 h-5" />
                <span>Правильно! +10 очков</span>
              </div>
            )}

            {feedback === 'wrong' && (
              <div className="p-3 bg-red-950 border border-red-500 text-red-300 font-bold rounded-xl flex items-center justify-center gap-2 animate-in zoom-in">
                <XCircle className="w-5 h-5" />
                <span>Неверно! Попробуйте еще раз.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
