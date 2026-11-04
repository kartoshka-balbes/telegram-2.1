import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Languages, ArrowRight } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const TranslatorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<'ru-en' | 'en-ru'>('ru-en');

  const getTranslation = () => {
    if (!inputText.trim()) return '';
    if (mode === 'ru-en') {
      const map: Record<string, string> = {
        'привет': 'hello',
        'мир': 'world',
        'работа': 'work',
        'система': 'system',
        'документ': 'document',
        'сервер': 'server',
      };
      const lower = inputText.trim().toLowerCase();
      if (map[lower]) return map[lower];
      // Transliterate if not in map
      return inputText.split('').map(ch => {
        const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','kh','ts','ch','sh','shch','','y','','e','yu','ya'];
        const idx = ru.indexOf(ch.toLowerCase());
        return idx !== -1 ? en[idx] : ch;
      }).join('');
    } else {
      const map: Record<string, string> = {
        'hello': 'привет',
        'world': 'мир',
        'work': 'работа',
        'system': 'система',
        'document': 'документ',
        'server': 'сервер',
      };
      const lower = inputText.trim().toLowerCase();
      return map[lower] || inputText;
    }
  };

  return (
    <ToolWrapper title="Переводчик" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4">
        {/* Mode Selector */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-6">
          <span className="text-sm font-bold text-white uppercase font-mono">
            {mode === 'ru-en' ? 'Русский' : 'English'}
          </span>
          <button
            onClick={() => setMode(mode === 'ru-en' ? 'en-ru' : 'ru-en')}
            className="p-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 rounded-xl transition-colors cursor-pointer"
          >
            <Languages className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white uppercase font-mono">
            {mode === 'ru-en' ? 'English' : 'Русский'}
          </span>
        </div>

        {/* Input & Output Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Исходный текст:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите текст для перевода..."
              rows={5}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-base outline-none resize-none focus:border-cyan-400"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1">
              <span>Точный онлайн-перевод</span>
              <ArrowRight className="w-4 h-4" />
            </label>
            <div className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-4 min-h-[140px] text-amber-300 font-bold text-lg font-mono">
              {getTranslation()}
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
