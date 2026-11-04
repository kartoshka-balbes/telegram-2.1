import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Globe, Lock, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const DuolingoTool: React.FC<ToolProps> = ({ onClose }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const languages = [
    { name: 'Английский (English)', flag: '🇬🇧', price: '49 900 ₽ / мес' },
    { name: 'Испанский (Español)', flag: '🇪🇸', price: '39 900 ₽ / мес' },
    { name: 'Китайский (中文)', flag: '🇨🇳', price: '89 900 ₽ / мес' },
    { name: 'Немецкий (Deutsch)', flag: '🇩🇪', price: '59 900 ₽ / мес' },
    { name: 'Японский (日本語)', flag: '🇯🇵', price: '79 900 ₽ / мес' },
    { name: 'Клингонский (Klingon)', flag: '🛸', price: '199 900 ₽ / мес' },
  ];

  const handleStartLesson = (langName: string) => {
    soundManager.playBeep(200, 0.2);
    setServerError(`ОШИБКА СЕРВЕРА (500 Internal Server Error): Не удалось подключиться к серверам Duolingo при загрузке курса «${langName}». Сервер временно недоступен.`);
  };

  return (
    <ToolWrapper title="Duolingo Изучение Языков" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-2">
        <div className="bg-emerald-900 border-2 border-emerald-400 p-3 text-center rounded-2xl shadow-lg">
          <span className="text-3xl animate-bounce inline-block">🦉</span>
          <h3 className="text-sm font-black text-white uppercase mt-1">Зеленая Сова ждет уроков!</h3>
        </div>

        {serverError && (
          <div className="p-3 bg-red-950 border-2 border-red-500 rounded-2xl text-red-200 text-xs font-bold text-center space-y-2 animate-in zoom-in duration-150">
            <div className="flex items-center justify-center gap-1.5 text-red-400 font-black uppercase">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>ОШИБКА СЕРВЕРА DUOLINGO</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">{serverError}</p>
          </div>
        )}

        <div className="space-y-2 overflow-y-auto max-h-[380px]">
          {languages.map((l) => (
            <div key={l.name} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{l.flag}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{l.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-400">{l.price}</span>
                </div>
              </div>
              <button
                onClick={() => handleStartLesson(l.name)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1 cursor-pointer rounded-lg shadow-md"
              >
                <span>Учить</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
