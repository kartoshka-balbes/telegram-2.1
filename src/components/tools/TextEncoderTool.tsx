import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Code2, ArrowDown } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const TextEncoderTool: React.FC<ToolProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [encodingMode, setEncodingMode] = useState<'base64' | 'hex' | 'binary' | 'rot13'>('base64');

  const getEncodedText = () => {
    if (!inputText) return '';
    try {
      if (encodingMode === 'base64') {
        return btoa(unescape(encodeURIComponent(inputText)));
      }
      if (encodingMode === 'hex') {
        return Array.from(new TextEncoder().encode(inputText))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(' ');
      }
      if (encodingMode === 'binary') {
        return Array.from(new TextEncoder().encode(inputText))
          .map((b) => b.toString(2).padStart(8, '0'))
          .join(' ');
      }
      if (encodingMode === 'rot13') {
        return inputText.replace(/[a-zA-Z]/g, (c) =>
          String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
        );
      }
    } catch {
      return 'Ошибка кодирования';
    }
    return '';
  };

  return (
    <ToolWrapper title="Кодировщик текста" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 gap-4">
        {/* Mode selection buttons */}
        <div className="grid grid-cols-4 gap-2">
          {(['base64', 'hex', 'binary', 'rot13'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setEncodingMode(m)}
              className={`py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border ${
                encodingMode === m
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Input & Output Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          {/* Input Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Исходный текст:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              placeholder="Введите текст для кодирования..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-cyan-400 resize-none font-mono"
            />
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Закодированный результат:</label>
            <div className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-cyan-300 font-mono text-xs break-all min-h-[125px] shadow-inner">
              {getEncodedText() || 'Результат отобразится здесь...'}
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
