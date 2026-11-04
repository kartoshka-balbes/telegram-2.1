import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Activity, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const REALISTIC_TESTS: Record<string, { positive: string[]; negative: string[] }> = {
  кровь: {
    positive: [
      'Гемоглобин: 142 г/л, Лейкоциты: 6.4×10⁹/л, СОЭ: 7 мм/ч. Все показатели в пределах референсных значений нормы.',
      'Общий анализ крови без патологических изменений. Лейкоцитарная формула нормоцитарная, тромбоциты в норме.',
    ],
    negative: [
      'Гемоглобин: 98 г/л (понижен), Эритроциты: 3.2×10¹²/л. Признаки железодефицитной анемии легкой степени.',
      'Лейкоцитоз: 14.8×10⁹/л, СОЭ: 28 мм/ч. Признаки активного воспалительного процесса.',
    ],
  },
  кал: {
    positive: [
      'Копрограмма: мышечные волокна и крахмал отсутствуют, скрытая кровь не обнаружена.',
      'Микрофлора кишечника в норме. Патогенные энтеробактерии и паразиты не выявлены.',
    ],
    negative: [
      'Обнаружена скрытая кровь в кале. Рекомендуется консультация гастроэнтеролога.',
      'Выявлен дисбиоз кишечника 2-й степени, снижено количество бифидобактерий.',
    ],
  },
  моча: {
    positive: [
      'Цвет: соломенно-желтый, Прозрачность: полная, Белок: не обнаружен, Сахар: не обнаружен.',
      'Общий анализ мочи в пределах физиологической нормы. Осадок без особенностей.',
    ],
    negative: [
      'Лейкоциты: 15-20 в п/зр, Протеинурия: 0.33 г/л. Признаки инфекции мочевыводящих путей.',
      'Обнаружены оксалаты кальция в большом количестве и ураты. Повышен риск мочекаменной болезни.',
    ],
  },
  'днк тест': {
    positive: [
      'Генетические маркеры в норме. Высокая степень совпадения биологического родства (99.9%).',
      'Мутации в основных исследуемых генах наследственных заболеваний не выявлены.',
    ],
    negative: [
      'Выявлена гетерозиготная мутация в гене BRCA1. Требуется консультация генетика.',
      'Биологическое родство не подтверждено (вероятность совпадения менее 0.1%).',
    ],
  },
  'тест на беременность': {
    positive: [
      'Результат: Положительный. Уровень хорионического гонадотропина (ХГЧ): 1250 МЕ/л (3-4 неделя).',
      'Результат: Положительный. Уровень ХГЧ: 8500 МЕ/л (5-6 недель).',
    ],
    negative: [
      'Результат: Отрицательный. Уровень ХГЧ < 5 МЕ/л (беременность не обнаружена).',
      'Результат: Отрицательный. Уровень ХГЧ < 2 МЕ/л.',
    ],
  },
};

export const MedicalTestsTool: React.FC<ToolProps> = ({ onClose }) => {
  const [loadingTest, setLoadingTest] = useState<string | null>(null);
  const [result, setResult] = useState<{ test: string; text: string; isPositive: boolean } | null>(null);

  const handleRunTest = (testKey: string) => {
    setLoadingTest(testKey);
    setResult(null);

    setTimeout(() => {
      setLoadingTest(null);
      const testData = REALISTIC_TESTS[testKey];
      const isPositive = Math.random() > 0.5;
      const options = isPositive ? testData.positive : testData.negative;
      const chosen = options[Math.floor(Math.random() * options.length)];

      setResult({
        test: testKey,
        text: chosen,
        isPositive,
      });

      if (!isPositive) {
        soundManager.playFail();
      } else {
        soundManager.playBeep(880, 0.1);
      }
    }, 1500);
  };

  return (
    <ToolWrapper title="Анализы" onClose={onClose}>
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col md:flex-row items-stretch gap-6 py-2 overflow-y-auto pr-1">
        
        {/* Authentic Clinical Medical Protocol Sheet */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 bg-[#0c101a] border-2 border-slate-800 rounded-3xl p-5 flex flex-col justify-between font-mono shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">КЛИНИЧЕСКИЙ БЛАНК</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                ГОСТ Р ИСО 15189
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-500">Лаборатория:</span>
                <span className="font-bold text-white">МедЛаб Экспресс</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-500">Биоматериал:</span>
                <span className="font-bold text-cyan-300">{result ? result.test.toUpperCase() : 'ОЖИДАНИЕ СДАЧИ'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-500">Штрихкод образца:</span>
                <span className="font-mono text-[10px] text-slate-400">#RU-7729183-LAB</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-500">Статус верификации:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ВЕРИФИЦИРОВАНО
                </span>
              </div>
            </div>

            {/* Micro barcode graphic */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center gap-1">
              <div className="flex gap-1 h-6 items-center">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2].map((w, i) => (
                  <div key={i} className="bg-slate-300 h-full" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
              <span className="text-[9px] text-slate-400">ИНВ. 9044-8812-74</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>ЭЦП Врача-лаборанта</span>
            <span className="text-emerald-400 font-bold">Подписано ✓</span>
          </div>
        </div>

        {/* Tests UI Controls and Results */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Выберите тип анализов для сдачи:
            </div>

            {['кровь', 'кал', 'моча', 'днк тест', 'тест на беременность'].map((testName) => (
              <button
                key={testName}
                onClick={() => handleRunTest(testName)}
                disabled={!!loadingTest}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-2xl p-4 flex items-center justify-between text-white font-bold text-sm uppercase transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-cyan-400 group-hover:animate-pulse" />
                  <span>{testName}</span>
                </div>
                <span className="text-xs text-cyan-400 font-mono">Сдать анализ</span>
              </button>
            ))}
          </div>

          {/* Loading Progress */}
          {loadingTest && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-xl animate-pulse my-4">
              <div className="text-xs font-bold text-cyan-400 uppercase mb-2">
                Идёт исследование образца...
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-full animate-progress" />
              </div>
            </div>
          )}

          {/* Clinical Result Window */}
          {result && (
            <div
              className={`border-2 rounded-3xl p-6 text-center shadow-2xl my-4 animate-in fade-in zoom-in duration-200 ${
                result.isPositive
                  ? 'bg-slate-900 border-emerald-500/60'
                  : 'bg-slate-900 border-amber-500/60'
              }`}
            >
              <div className="text-4xl mb-3">{result.isPositive ? '📋' : '⚠️'}</div>
              <h3
                className={`text-lg font-black uppercase tracking-wider mb-2 ${
                  result.isPositive ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                Результат исследования ({result.test}):
              </h3>
              <p className="text-white text-sm font-semibold leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono">
                {result.text}
              </p>
            </div>
          )}
        </div>

      </div>
    </ToolWrapper>
  );
};
