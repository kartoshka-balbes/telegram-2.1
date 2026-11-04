import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { FileText, CheckCircle2, Shield, DollarSign, Send } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const InternationalPassportTool: React.FC<ToolProps> = ({ onClose }) => {
  const [passportType, setPassportType] = useState<'10' | '5'>('10');
  const [fullName, setFullName] = useState('Иванов Иван Иванович');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playBeep(1200, 0.15);
    setIsSubmitted(true);
  };

  return (
    <ToolWrapper title="Оформление загранпаспорта (Госуслуги)" onClose={onClose} headerColor="bg-blue-950 border-blue-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Header Badge */}
        <div className="bg-slate-900 border-2 border-blue-500/80 p-4 rounded-2xl space-y-2 shadow-2xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
            <Shield className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Госуслуги: Подача заявления на загранпаспорт</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Госпошлина: <span className="text-amber-400 font-black">{passportType === '10' ? '5 000 ₽' : '2 000 ₽'}</span>
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            {/* Passport Type Selector */}
            <div>
              <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase">Срок действия паспорта:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playBeep(800, 0.05);
                    setPassportType('10');
                  }}
                  className={`p-2.5 rounded-xl font-bold text-xs cursor-pointer border transition-all ${
                    passportType === '10'
                      ? 'bg-blue-600 text-white border-blue-400 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  10 лет (Биометрический)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playBeep(800, 0.05);
                    setPassportType('5');
                  }}
                  className={`p-2.5 rounded-xl font-bold text-xs cursor-pointer border transition-all ${
                    passportType === '5'
                      ? 'bg-blue-600 text-white border-blue-400 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  5 лет (Старый образец)
                </button>
              </div>
            </div>

            {/* FIO Input */}
            <div>
              <label className="text-[10px] text-slate-400 block font-bold mb-1 uppercase">ФИО заявителя:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-white font-bold outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Подать заявление & Оплатить пошлину</span>
            </button>
          </form>
        ) : (
          <div className="p-5 bg-emerald-950 border-2 border-emerald-500 rounded-2xl text-center space-y-2 animate-in zoom-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-black text-emerald-300 uppercase text-xs">ЗАЯВЛЕНИЕ №7700-2026 ПРИНЯТО!</h3>
            <p className="text-[11px] text-slate-200">Ваш загранпаспорт на {passportType} лет успешно передан в МВД РФ на изготовление.</p>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
