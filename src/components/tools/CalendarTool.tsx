import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';

interface ToolProps {
  onClose: () => void;
}

const NORMAL_MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const CalendarTool: React.FC<ToolProps> = ({ onClose }) => {
  const [restMode, setRestMode] = useState(false);

  return (
    <ToolWrapper title="Календарь" onClose={onClose}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-6 py-2 font-sans">
        {/* Header Toggle Switch */}
        <div className="bg-[#12151e] border border-[#222840] rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <span className="font-extrabold text-white text-base">Календарь</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-[#8f9bff] uppercase">Режим отдыха</span>
            <button
              onClick={() => setRestMode(!restMode)}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                restMode ? 'bg-red-500' : 'bg-[#171b27] border border-[#222840]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  restMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3 x 4 Grid of Months */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
          {NORMAL_MONTHS.map((monthName, idx) => {
            const displayName = restMode ? 'Июль' : monthName;
            return (
              <div
                key={idx}
                className={`bg-[#12151e] border rounded-2xl p-3 shadow-md transition-colors ${
                  restMode ? 'border-red-500/60' : 'border-[#222840]'
                }`}
              >
                <h4
                  className={`font-extrabold text-center text-sm uppercase tracking-wider mb-2 ${
                    restMode ? 'text-red-400' : 'text-[#8f9bff]'
                  }`}
                >
                  {displayName}
                </h4>

                <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-mono">
                  {['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((d, i) => (
                    <span key={i} className="text-gray-500 font-bold">
                      {d}
                    </span>
                  ))}

                  {Array.from({ length: 30 }).map((_, dIdx) => {
                    const dayNum = dIdx + 1;
                    const isWeekend = (dIdx + 1) % 7 === 6 || (dIdx + 1) % 7 === 0;
                    const isRed = restMode || isWeekend;

                    return (
                      <span
                        key={dIdx}
                        className={`py-0.5 rounded font-bold ${
                          isRed
                            ? 'text-red-400 bg-red-950/40'
                            : 'text-gray-200 bg-[#171b27]'
                        }`}
                      >
                        {dayNum}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolWrapper>
  );
};
