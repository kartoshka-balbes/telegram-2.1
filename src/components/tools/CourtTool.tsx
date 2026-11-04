import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Gavel, Scale, ShieldCheck, FileCheck2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const CourtTool: React.FC<ToolProps> = ({ onClose }) => {
  const [defendantName, setDefendantName] = useState('');
  const [reason, setReason] = useState('');
  const [isVerdict, setIsVerdict] = useState(false);
  const [verdictData, setVerdictData] = useState<{
    caseNumber: string;
    decision: string;
    details: string;
  } | null>(null);

  const handleFileLawsuit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defendantName.trim() || !reason.trim()) return;

    soundManager.playBeep(300, 0.4);
    setIsVerdict(true);

    const caseNum = `Дело № 2-${Math.floor(Math.random() * 8999) + 1000}/${new Date().getFullYear()}`;

    const rulings = [
      {
        decision: 'Исковые требования удовлетворить полностью',
        details: `Рассмотрев в открытом судебном заседании гражданское дело по исковому заявлению к ответчику «${defendantName}» по вопросу «${reason}», руководствуясь ст. 194-199 ГПК РФ, суд решил: Взыскать с ответчика материальный ущерб и судебные расходы в полном объеме. Решение может быть обжаловано в апелляционном порядке в течение месяца.`
      },
      {
        decision: 'Удовлетворить иск частично',
        details: `Исследовав доказательства по делу в отношении «${defendantName}» (предмет иска: «${reason}»), суд постановил: Обязать ответчика устранить допущенные нарушения законных прав и компенсировать причиненный моральный вред в соответствии со ст. 151 ГК РФ.`
      },
      {
        decision: 'В удовлетворении исковых требований отказать',
        details: `По результатам судебного разбирательства по делу ответчика «${defendantName}» (предмет иска: «${reason}»), суд установил отсутствие достаточной доказательной базы и состава правонарушения. На основании ст. 56 ГПК РФ в иске отказано.`
      }
    ];

    const chosen = rulings[Math.floor(Math.random() * rulings.length)];
    setVerdictData({
      caseNumber: caseNum,
      decision: chosen.decision,
      details: chosen.details
    });
  };

  return (
    <ToolWrapper title="Районный Суд общей юрисдикции" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-3 font-sans text-xs select-none">
        {!isVerdict ? (
          <form onSubmit={handleFileLawsuit} className="bg-[#0f121a] border border-[#222840] p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-center gap-2.5 text-[#8f9bff]">
              <Scale className="w-7 h-7" />
              <h2 className="text-sm font-extrabold uppercase text-center text-white tracking-wide">
                Подача искового заявления
              </h2>
            </div>

            <div className="text-[10px] text-gray-400 bg-[#171b27] p-2.5 rounded-xl border border-[#222840] leading-relaxed">
              Официальное обращение в суд общей юрисдикции Российской Федерации. Введите корректные данные ответчика и суть претензии.
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                ФИО / Наименование Ответчика:
              </label>
              <input
                type="text"
                value={defendantName}
                onChange={(e) => setDefendantName(e.target.value)}
                placeholder="ФИО гражданина или наименование организации..."
                className="w-full bg-[#171b27] border border-[#222840] p-2.5 rounded-xl text-xs text-white outline-none focus:border-[#8f9bff]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Предмет и основания иска (суть нарушения):
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Опишите обстоятельства правонарушения и правовые основания требований..."
                rows={3}
                className="w-full bg-[#171b27] border border-[#222840] p-2.5 rounded-xl text-xs text-white outline-none focus:border-[#8f9bff]"
              />
            </div>

            <button
              type="submit"
              disabled={!defendantName.trim() || !reason.trim()}
              className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] disabled:opacity-50 text-black font-extrabold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(143,155,255,0.3)] transition-all active:scale-95 rounded-xl"
            >
              <Gavel className="w-4 h-4 fill-current" />
              <span>Зарегистрировать иск и огласить решение</span>
            </button>
          </form>
        ) : (
          <div className="bg-[#0f121a] border-2 border-[#8f9bff] p-5 rounded-2xl space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#222840] pb-3">
              <div className="flex items-center gap-2 text-[#8f9bff]">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-extrabold text-xs uppercase text-white">РОССИЙСКАЯ ФЕДЕРАЦИЯ</span>
              </div>
              <span className="text-[10px] font-mono text-[#8f9bff] font-bold">{verdictData?.caseNumber}</span>
            </div>

            <div className="text-center space-y-1">
              <Gavel className="w-10 h-10 text-[#8f9bff] mx-auto" />
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">СУДЕБНОЕ РЕШЕНИЕ</h3>
              <h2 className="text-sm font-black text-[#8f9bff] uppercase">{verdictData?.decision}</h2>
            </div>

            <div className="bg-[#171b27] border border-[#222840] p-3.5 rounded-xl text-xs text-gray-200 leading-relaxed font-medium">
              {verdictData?.details}
            </div>

            <button
              onClick={() => {
                setIsVerdict(false);
                setDefendantName('');
                setReason('');
              }}
              className="w-full py-3 bg-[#8f9bff] text-black font-extrabold text-xs uppercase cursor-pointer rounded-xl hover:bg-[#b8c0ff] transition-all"
            >
              Подать новое исковое заявление
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
