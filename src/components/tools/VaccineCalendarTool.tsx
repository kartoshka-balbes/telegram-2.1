import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Syringe, Calendar, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Vaccine {
  id: string;
  name: string;
  age: string;
  disease: string;
  status: 'Done' | 'Planned' | 'Pending';
}

const VACCINES_LIST: Vaccine[] = [
  { id: '1', name: 'БЦЖ-М', age: '3-7 дней', disease: 'Туберкулез', status: 'Done' },
  { id: '2', name: 'Гепатит B (V1)', age: '1 месяц', disease: 'Вирусный гепатит B', status: 'Done' },
  { id: '3', name: 'Пентаксим / АКДС (V1)', age: '3 месяца', disease: 'Дифтерия, Коклюш, Столбняк', status: 'Done' },
  { id: '4', name: 'Корь, Краснуха, Паротит', age: '12 месяцев', disease: 'Корь и краснуха', status: 'Planned' },
  { id: '5', name: 'Сезонная вакцина от Гриппа', age: 'Осень 2026', disease: 'Грипп A/B', status: 'Pending' },
  { id: '6', name: 'Клещевой Энцефалит', age: 'Весна 2026', disease: 'Клещевой энцефалит', status: 'Pending' },
];

export const VaccineCalendarTool: React.FC<ToolProps> = ({ onClose }) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>(VACCINES_LIST);

  const toggleStatus = (id: string) => {
    soundManager.playBeep(1000, 0.1);
    setVaccines((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: v.status === 'Done' ? 'Pending' : 'Done' } : v
      )
    );
  };

  return (
    <ToolWrapper title="Календарь медицинских прививок" onClose={onClose} headerColor="bg-cyan-950 border-cyan-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Header Summary Box */}
        <div className="bg-slate-900 border-2 border-cyan-500/80 p-4 rounded-2xl space-y-2 shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
            <Syringe className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Национальный календарь прививок</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Сделано вакцинаций: <span className="text-emerald-400 font-black">{vaccines.filter((v) => v.status === 'Done').length} из {vaccines.length}</span>
          </p>
        </div>

        {/* Vaccines Catalog List */}
        <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
          {vaccines.map((v) => (
            <div
              key={v.id}
              onClick={() => toggleStatus(v.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                v.status === 'Done'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <h3 className="font-black text-xs text-white">{v.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold">Срок: {v.age} • Защита: {v.disease}</p>
              </div>

              <div
                className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 ${
                  v.status === 'Done'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {v.status === 'Done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 'Запланирована'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
