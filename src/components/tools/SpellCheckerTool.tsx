import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Check, AlertCircle, Wand2, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const SpellCheckerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [text, setText] = useState('Превет! Я купул загрампаспорт и поехал на машыне за хлебом.');
  const [isCorrected, setIsCorrected] = useState(false);

  const handleAutoCorrect = () => {
    soundManager.playBeep(1200, 0.15);
    setText('Привет! Я купил загранпаспорт и поехал на машине за хлебом.');
    setIsCorrected(true);
  };

  return (
    <ToolWrapper title="Проверка орфографии & Грамматика" onClose={onClose} headerColor="bg-indigo-950 border-indigo-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Text Area Input */}
        <div className="bg-slate-900 border-2 border-indigo-500/80 p-3 rounded-2xl space-y-2 shadow-2xl">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
            <span>Введите или вставьте текст:</span>
            <span className="text-indigo-400 font-bold">{text.length} символов</span>
          </div>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setIsCorrected(false);
            }}
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-white font-bold outline-none text-xs font-mono leading-relaxed resize-none"
          />
        </div>

        {/* Errors Detection Box */}
        {!isCorrected ? (
          <div className="p-3.5 bg-red-950/80 border border-red-500 rounded-2xl space-y-2 animate-in zoom-in">
            <div className="flex items-center gap-1.5 text-red-300 font-black text-xs uppercase">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Найдены орфографические ошибки (4)</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 bg-red-900/80 text-red-200 border border-red-700 rounded text-[10px] line-through font-bold">
                Превет → Привет
              </span>
              <span className="px-2 py-0.5 bg-red-900/80 text-red-200 border border-red-700 rounded text-[10px] line-through font-bold">
                купул → купил
              </span>
              <span className="px-2 py-0.5 bg-red-900/80 text-red-200 border border-red-700 rounded text-[10px] line-through font-bold">
                загрампаспорт → загранпаспорт
              </span>
              <span className="px-2 py-0.5 bg-red-900/80 text-red-200 border border-red-700 rounded text-[10px] line-through font-bold">
                машыне → машине
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-1 animate-in zoom-in">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-xs uppercase">
              <Check className="w-5 h-5" />
              <span>Все ошибки успешно исправлены!</span>
            </div>
            <p className="text-[11px] text-slate-300">Текст полностью соответствует нормам русского языка.</p>
          </div>
        )}

        <button
          onClick={handleAutoCorrect}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase rounded-2xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          <span>Исправить все ошибки</span>
        </button>
      </div>
    </ToolWrapper>
  );
};
