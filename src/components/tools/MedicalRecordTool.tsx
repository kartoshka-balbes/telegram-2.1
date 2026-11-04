import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Activity, ShieldCheck, Zap, UserCheck, Heart, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MedicalRecordTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isSuperhuman, setIsSuperhuman] = useState(false);

  const handleImprove = () => {
    soundManager.playBeep(1200, 0.1);
    setIsSuperhuman(true);
  };

  return (
    <ToolWrapper title="Медицинская карта" onClose={onClose} headerColor="bg-teal-950 border-teal-900">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-5 py-2 font-mono text-xs">
        {/* Patient Header */}
        <div className="bg-slate-900 border border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-950 border border-teal-500/50 flex items-center justify-center text-2xl font-bold">
              {isSuperhuman ? '🦸' : '👤'}
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isSuperhuman ? 'СВЕРХЧЕЛОВЕК (ОБЪЕКТ S-01)' : 'ПАТИЕНТ: АНОНИМНЫЙ В.'}
              </h3>
              <p className="text-teal-400 font-bold">
                {isSuperhuman ? 'КАТЕГОРИЯ: АБСОЛЮТНЫЙ ОРГАНИЗМ' : 'КАРТА № 84920-MC'}
              </p>
            </div>
          </div>
          <button
            onClick={handleImprove}
            disabled={isSuperhuman}
            className={`px-4 py-2 font-black uppercase text-xs flex items-center gap-2 cursor-pointer transition-all ${
              isSuperhuman
                ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/50 cursor-default'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isSuperhuman ? 'УЛУЧШЕНО' : 'УЛУЧШИТЬ'}</span>
          </button>
        </div>

        {/* Medical Metrics Table */}
        <div className="bg-slate-900 border border-slate-800 p-4 space-y-3">
          <h4 className="font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            Физиологические показатели
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Группа крови:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? 'АЛЬФА-СВЕРХУНИВЕРСАЛЬНАЯ' : 'A(II) Rh+ (Вторая положительная)'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Гемоглобин:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? '999 г/л (Максимальная оксигенация)' : '142 г/л (Норма)'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Артериальное давление:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? '120/80 мм рт. ст. (Идеальное)' : '118/78 мм рт. ст.'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Пульс в покое:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? '35 уд/мин (Титановая выносливость)' : '72 уд/мин'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Острота зрения:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? '20/0.1 (Телескопическое)' : '1.0 / 1.0 (100%)'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Индекс иммунитета:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? '1000% (Полная неуязвимость)' : '92%'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Скорость регенерации:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? '0.001 сек (Мгновенное восстановление)' : 'Стандартная (7-14 дней)'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Плотность костной ткани:</span>
              <span className="text-base font-black text-white">
                {isSuperhuman ? 'Титаново-углеродная матрица' : 'Стандартная T-score +0.2'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="p-3 bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
          <span className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Статус записи:
          </span>
          <span className="font-black text-teal-400 uppercase">
            {isSuperhuman ? 'Сверхчеловек верифицирован' : 'Заверен клиникой'}
          </span>
        </div>
      </div>
    </ToolWrapper>
  );
};
