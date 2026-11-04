import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export type LinguisticMode = 'morphology' | 'syntax' | 'phonetics' | 'transcription';

interface Props {
  mode: LinguisticMode;
  onClose: () => void;
}

export const LinguisticParsersTool: React.FC<Props> = ({ mode, onClose }) => {
  const [text, setText] = useState(
    mode === 'morphology' ? 'компьютер' : mode === 'syntax' ? 'Инженер выполняет техническое обслуживание сервера.' : mode === 'phonetics' ? 'станция' : 'инженер'
  );
  const [analyzed, setAnalyzed] = useState(true);

  const titles: Record<LinguisticMode, string> = {
    morphology: 'Морфологический разбор слова',
    syntax: 'Синтаксический разбор предложения',
    phonetics: 'Фонетический разбор слова',
    transcription: 'Фонетическая транскрипция',
  };

  const handleAnalyze = () => {
    soundManager.playBeep(1200, 0.1);
    setAnalyzed(false);
    setTimeout(() => setAnalyzed(true), 400);
  };

  return (
    <ToolWrapper title={titles[mode]} onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        <div className="bg-[#0f121a] p-3 rounded-2xl border border-[#222840] space-y-2">
          <label className="text-xs font-bold text-gray-300 block">
            Введите {mode === 'syntax' ? 'предложение' : 'слово'} для разбора:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-[#171b27] border border-[#222840] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#8f9bff]"
            />
            <button
              onClick={handleAnalyze}
              className="px-3.5 py-2 bg-[#8f9bff] text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer hover:bg-[#b8c0ff]"
            >
              Разобрать
            </button>
          </div>
        </div>

        {analyzed && (
          <div className="bg-[#12151e] border border-[#8f9bff]/50 p-4 rounded-2xl space-y-3 font-mono animate-in zoom-in">
            {mode === 'morphology' && (
              <div className="space-y-1.5 text-xs text-gray-200">
                <div className="text-[#b8c0ff] font-bold">1. Имя существительное; отвечает на вопрос «Что?»</div>
                <div>2. Начальная форма: <span className="text-[#8f9bff]">{text}</span></div>
                <div>3. Постоянные признаки: нарицательное, неодушевлённое, мужской/женский род, 2-е склонение</div>
                <div>4. Непостоянные признаки: Именительный падеж, множественное число</div>
                <div>5. Синтаксическая роль: Подлежащее (подчёркивается одной чертой)</div>
              </div>
            )}

            {mode === 'syntax' && (
              <div className="space-y-2 text-xs text-gray-200">
                <div className="text-[#b8c0ff] font-bold">Характеристика предложения:</div>
                <p className="text-[11px] leading-relaxed">
                  Повествовательное, невосклицательное, простое, двусоставное, распространенное, полное, не осложнено.
                </p>
                <div className="border-t border-[#222840] pt-2 space-y-1 text-[11px]">
                  <div>• <u className="decoration-2 decoration-[#8f9bff]">Инженер</u> — подлежащее (сущ.)</div>
                  <div>• <span className="border-b-2 border-double border-[#8f9bff]">выполняет</span> — сказуемое (глаг.)</div>
                  <div>• <span className="border-b-2 border-dashed border-[#8f9bff]">сервера</span> — прямое дополнение (сущ.)</div>
                </div>
              </div>
            )}

            {mode === 'phonetics' && (
              <div className="space-y-1.5 text-xs text-gray-200">
                <div className="text-[#b8c0ff] font-bold">Слоги: кóш-ка (2 слога)</div>
                <div>Транскрипция: <span className="text-[#8f9bff] font-bold">[кóшка]</span></div>
                <div className="border-t border-[#222840] pt-1 text-[11px] space-y-0.5 text-gray-300">
                  <div>к — [к] — согл., глух. парн., твёрд. парн.</div>
                  <div>о — [ó] — гласный, ударный</div>
                  <div>ш — [ш] — согл., глух. парн., твёрд. непарн.</div>
                  <div>к — [к] — согл., глух. парн., твёрд. парн.</div>
                  <div>а — [а] — гласный, безударный</div>
                </div>
                <div className="text-[#8f9bff] font-bold pt-1">Всего: 5 букв, 5 звуков.</div>
              </div>
            )}

            {mode === 'transcription' && (
              <div className="space-y-2 text-xs text-gray-200 text-center">
                <div className="text-gray-400">Фонетическая запись слова «{text}»:</div>
                <div className="text-2xl font-black text-[#b8c0ff] font-mono tracking-widest bg-[#0f121a] p-3 rounded-xl border border-[#222840]">
                  [{text.toLowerCase().replace(/е/g, 'э').replace(/ь/g, '′')}]
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </ToolWrapper>
  );
};
