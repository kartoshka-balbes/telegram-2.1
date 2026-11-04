import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Sparkles, Compass, Moon } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const ZODIAC_SIGNS = [
  { sign: 'Овен', dates: '21 марта — 19 апреля', icon: '♈', prediction: 'Сегодня отличный день для реализации амбициозных планов. Энергия на высоте, главное — избегать споров по пустякам.' },
  { sign: 'Телец', dates: '20 апреля — 20 мая', icon: '♉', prediction: 'Благоприятный период для финансовых вопросов и планирования бюджета. Вечером вас ждет приятный сюрприз от близких.' },
  { sign: 'Близнецы', dates: '21 мая — 20 июня', icon: '♊', prediction: 'Общение принесет новые полезные знакомства. Будьте открыты к информации и не бойтесь брать на себя инициативу.' },
  { sign: 'Рак', dates: '21 июня — 22 июля', icon: '♋', prediction: 'Интуиция сегодня подскажет верное решение. Уделите время отдыху, уюту и гармонии в семейном кругу.' },
  { sign: 'Лев', dates: '23 июля — 22 августа', icon: '♌', prediction: 'Ваше обаяние и лидерские качества не останутся незамеченными. День подходит для публичных выступлений и творческих дел.' },
  { sign: 'Дева', dates: '23 августа — 22 сентября', icon: '♍', prediction: 'Проявите внимательность к деталям в работе. Системный подход поможет быстро и качественно завершить текущие задачи.' },
  { sign: 'Весы', dates: '23 сентября — 22 октября', icon: '♎', prediction: 'Гармония в отношениях и душевное равновесие помогут легко разрешить любые спорные моменты. Удачный день для поездок.' },
  { sign: 'Скорпион', dates: '23 октября — 21 ноября', icon: '♏', prediction: 'Проницательность и целеустремленность помогут преодолеть любые препятствия. Продуктивное время для учебы и саморазвития.' },
  { sign: 'Стрелец', dates: '22 ноября — 21 декабря', icon: '♐', prediction: 'Новые горизонты и вдохновение ждут вас! Не бойтесь выходить из зоны комфорта — успех на вашей стороне.' },
  { sign: 'Козерог', dates: '22 декабря — 19 января', icon: '♑', prediction: 'Упорный труд принесет долгожданные плоды. Стабильность и фокус на цели — ваш главный ключ к успеху.' },
  { sign: 'Водолей', dates: '20 января — 18 февраля', icon: '♒', prediction: 'Нестандартное мышление поможет найти оригинальный выход из сложной ситуации. Не бойтесь экспериментировать.' },
  { sign: 'Рыбы', dates: '19 февраля — 20 марта', icon: '♓', prediction: 'День наполнен вдохновением и чуткостью. Доверьтесь внутреннему голосу — он направит вас по верному пути.' },
];

export const HoroscopeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedZodiac, setSelectedZodiac] = useState(ZODIAC_SIGNS[0]);

  return (
    <ToolWrapper title="Гороскоп Астрология" onClose={onClose} headerColor="bg-indigo-950 border-indigo-900">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2 font-mono">
        {/* Zodiac Selector Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mb-3">
          {ZODIAC_SIGNS.map((z) => (
            <button
              key={z.sign}
              onClick={() => setSelectedZodiac(z)}
              className={`p-2 border text-center transition-all cursor-pointer ${
                selectedZodiac.sign === z.sign
                  ? 'bg-indigo-600 border-indigo-400 text-white font-black'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="text-lg">{z.icon}</div>
              <div className="text-[10px] font-bold uppercase truncate">{z.sign}</div>
            </button>
          ))}
        </div>

        {/* Prediction Display Box */}
        <div className="bg-slate-900 border-2 border-indigo-500 p-5 space-y-3">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="text-3xl p-2 bg-indigo-950 border border-indigo-500">{selectedZodiac.icon}</span>
            <div>
              <h3 className="text-base font-black text-white uppercase">{selectedZodiac.sign}</h3>
              <p className="text-[10px] text-indigo-400">{selectedZodiac.dates}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-300 uppercase flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Предсказание на сегодня:</span>
            </span>
            <p className="text-xs text-white leading-relaxed font-sans font-medium">
              "{selectedZodiac.prediction}"
            </p>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
