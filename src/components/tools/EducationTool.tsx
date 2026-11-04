import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Award, GraduationCap } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const DEGREES = [
  '09.03.01 Программная инженерия',
  '01.03.02 Прикладная математика и информатика',
  '10.05.01 Компьютерная безопасность',
  '31.05.01 Лечебное дело (Врач-терапевт)',
  '31.05.02 Стоматология',
  '40.03.01 Юриспруденция',
  '38.03.01 Экономика и мировой бизнес',
  '38.03.02 Менеджмент организации',
  '07.03.01 Архитектура и градостроительство',
  '08.05.01 Строительство уникальных зданий',
  '45.03.02 Лингвистика и перевод',
  '42.03.02 Журналистика и медиакоммуникации',
  '37.05.01 Клиническая психология',
  '19.03.01 Биотехнология и генетика',
  '21.05.02 Нефтегазовые техника и технологии',
];

export const EducationTool: React.FC<ToolProps> = ({ onClose }) => {
  const [userName, setUserName] = useState('');
  const [selectedDegree, setSelectedDegree] = useState(DEGREES[0]);
  const [diplomaGenerated, setDiplomaGenerated] = useState(false);

  return (
    <ToolWrapper title="Получить образование" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4">
        {!diplomaGenerated ? (
          <div className="space-y-6 my-auto">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 text-cyan-400 mx-auto mb-2 animate-bounce" />
              <h2 className="text-xl font-black text-white uppercase">Образовательный портал</h2>
              <p className="text-xs text-slate-400">Оформление государственного диплома</p>
            </div>

            {/* Input Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Ваше ФИО:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-base outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            {/* Select Degree */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Специальность:</label>
              <div className="space-y-2">
                {DEGREES.map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setSelectedDegree(deg)}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold transition-all cursor-pointer border ${
                      selectedDegree === deg
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {deg}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setDiplomaGenerated(true)}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-lg rounded-2xl uppercase tracking-wider shadow-xl cursor-pointer"
            >
              Сгенерировать диплом
            </button>
          </div>
        ) : (
          /* Official Diploma Display */
          <div className="my-auto">
            <div className="bg-slate-950 border-4 border-amber-400 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
              <Award className="w-16 h-16 text-amber-400 mx-auto mb-2" />
              <span className="text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest block mb-4">
                ДИПЛОМ ГОСУДАРСТВЕННОГО ОБРАЗЦА
              </span>

              <h2 className="text-amber-200 font-black text-xl uppercase tracking-wide mb-4">
                {selectedDegree}
              </h2>

              <p className="text-slate-400 text-xs mb-2">Настоящим подтверждается, что гражданин(ка):</p>
              <div className="text-white font-black text-2xl uppercase border-b-2 border-dashed border-amber-400/50 pb-2 mb-4">
                {userName || 'Иванов Иван Иванович'}
              </div>

              <p className="text-xs text-slate-400 italic mb-6">
                Успешно окончил(а) полный курс обучения по указанной специальности с отличием.
              </p>

              <button
                onClick={() => setDiplomaGenerated(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 rounded-xl font-bold uppercase text-xs cursor-pointer"
              >
                Получить другой диплом
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
