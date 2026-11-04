import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { FileText, RefreshCw, Stamp, ShieldCheck, HeartPulse } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const REAL_DISEASES = [
  'Острая респираторная вирусная инфекция (ОРВИ)',
  'Острый бронхит среднерассредоточенный',
  'Острый тонзиллит (Ангина фолликулярная)',
  'Острый гастроэнтерит легкой степени',
  'Острый средний отит катаральный',
  'Ветряная оспа (Varicella zoster)',
  'Острая кишечная инфекция (ОКИ)',
  'Пневмония внебольничная правосторонняя',
  'Острый аппендицит (послеоперационный период)',
  'Вегетососудистая дистония (ВСД по гипотоническому типу)',
  'Инфекционный мононуклеоз',
  'Острый синусит и гнойный гайморит',
  'Почечная колика и острый пиелонефрит',
  'Острая крапивница и аллергический дерматит',
  'Межреберная невралгия',
  'Синдром хронической усталости и астения',
  'Мигрень с аурой (острая фаза)',
];

export const MedicalNoteTool: React.FC<ToolProps> = ({ onClose }) => {
  const [studentName, setStudentName] = useState('Иванов Иван Иванович');
  const [selectedDisease, setSelectedDisease] = useState(REAL_DISEASES[0]);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<{
    number: string;
    date: string;
    startDate: string;
    endDate: string;
    peReleaseUntil: string;
  } | null>(null);

  const handleGenerate = () => {
    if (!studentName.trim()) return;
    soundManager.playBeep(900, 0.08);
    setLoading(true);
    setCertificate(null);

    setTimeout(() => {
      soundManager.playBeep(1200, 0.15);
      setLoading(false);

      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      const pe = new Date(today);
      pe.setDate(today.getDate() + 14);

      setCertificate({
        number: `№ ${Math.floor(Math.random() * 899999) + 100000}`,
        date: today.toLocaleDateString('ru-RU'),
        startDate: start.toLocaleDateString('ru-RU'),
        endDate: today.toLocaleDateString('ru-RU'),
        peReleaseUntil: pe.toLocaleDateString('ru-RU'),
      });
    }, 2000);
  };

  return (
    <ToolWrapper title="Медицинская справка 095/у" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col gap-4 py-2 font-sans text-xs select-none overflow-y-auto">
        {/* Hospital Header Banner */}
        <div className="bg-[#0f121a] border border-[#222840] p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-[#8f9bff]/20 border border-[#8f9bff]/50 rounded-xl text-[#8f9bff] shrink-0">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">Центральная Городская Поликлиника</h3>
            <p className="text-[10px] text-gray-400">Единый реестр медицинских заключений Минздрава РФ</p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="bg-[#0f121a] border border-[#222840] p-4 rounded-2xl space-y-3.5 shadow-md">
          <h3 className="font-extrabold text-white uppercase flex items-center gap-2 text-xs text-[#8f9bff]">
            <FileText className="w-4 h-4" />
            Оформление медицинского заключения (Форма 095/у)
          </h3>

          <div>
            <label className="text-gray-300 font-extrabold block mb-1">ФИО Ученика / Студента / Пациента:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Введите ФИО..."
              className="w-full bg-[#171b27] border border-[#222840] rounded-xl p-2.5 text-white font-bold outline-none focus:border-[#8f9bff]"
            />
          </div>

          <div>
            <label className="text-gray-300 font-extrabold block mb-1">Диагноз (заболевание):</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full bg-[#171b27] border border-[#222840] rounded-xl p-2.5 text-white font-bold outline-none focus:border-[#8f9bff] cursor-pointer"
            >
              {REAL_DISEASES.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !studentName.trim()}
            className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] disabled:opacity-50 text-black font-black uppercase text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(143,155,255,0.3)] transition-all active:scale-95"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Stamp className="w-4 h-4" />
            )}
            <span>{loading ? 'ФОРМИРОВАНИЕ В БАЗЕ БОЛЬНИЦЫ...' : 'ВЫДАТЬ МЕДИЦИНСКУЮ СПРАВКУ'}</span>
          </button>
        </div>

        {/* Issued Hospital Medical Document Certificate */}
        {certificate && (
          <div className="bg-[#f8fafc] text-slate-900 border-2 border-[#8f9bff] p-5 rounded-2xl space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Stamp Seal Badge */}
            <div className="absolute top-4 right-4 border-2 border-emerald-600 text-emerald-700 px-2.5 py-1 font-black text-[9px] uppercase tracking-widest rotate-3 bg-emerald-50 rounded-lg shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ОФИЦИАЛЬНЫЙ ШТАМП БОЛЬНИЦЫ</span>
            </div>

            <div className="text-center border-b border-slate-300 pb-3">
              <span className="text-[10px] text-slate-600 font-bold uppercase block tracking-wider">
                МИНИСТЕРСТВО ЗДРАВООХРАНЕНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ
              </span>
              <span className="text-xs font-black text-slate-800 uppercase block mt-0.5">
                ГБУЗ «ГОРОДСКАЯ ПОЛИКЛИНИКА № 14»
              </span>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mt-2">
                МЕДИЦИНСКАЯ СПРАВКА {certificate.number}
              </h2>
              <span className="text-[10px] text-slate-500 font-medium">
                Форма № 095/у (О временной нетрудоспособности)
              </span>
            </div>

            <div className="space-y-2 text-slate-800 text-xs">
              <p>
                <span className="font-bold text-slate-600">Выдана пациенту:</span>{' '}
                <span className="font-black text-slate-950 underline underline-offset-2">{studentName}</span>
              </p>
              <p>
                <span className="font-bold text-slate-600">Диагноз:</span>{' '}
                <span className="font-bold text-emerald-800">{selectedDisease}</span>
              </p>
              <p>
                <span className="font-bold text-slate-600">Освобождение от занятий:</span> с{' '}
                <span className="font-bold text-slate-900">{certificate.startDate}</span> по{' '}
                <span className="font-bold text-slate-900">{certificate.endDate}</span>
              </p>
              <p>
                <span className="font-bold text-slate-600">Освобождение от физкультуры до:</span>{' '}
                <span className="font-black text-blue-800">{certificate.peReleaseUntil}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-600 font-bold">
              <span>Дата выдачи: {certificate.date}</span>
              <span className="italic">Зав. отделением: Смирнова О.В. / (Подпись, печать)</span>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
