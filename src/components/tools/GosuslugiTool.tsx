import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  X, ShieldAlert, UserCheck, FileText, Home, AlertTriangle, HelpCircle, Frown, Sparkles, Ban,
  Search, Bell, QrCode, CreditCard, Car, HeartPulse, Baby, GraduationCap, Briefcase, Building2,
  Landmark, Mail, Scale, Wrench, ChevronRight, LayoutGrid, ClipboardList, Wallet, User, Receipt,
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const SERVICES = [
  { title: 'Оформление беспомощности', icon: Frown },
  { title: 'Оформление бездарности', icon: Ban },
  { title: 'Оформление бестолковости', icon: HelpCircle },
  { title: 'Оформление бездумности', icon: AlertTriangle },
  { title: 'Оформление безалаберности', icon: Sparkles },
  { title: 'Оформление банкротства', icon: FileText },
  { title: 'Оформление бездетности', icon: AlertTriangle },
  { title: 'Оформление бездомности', icon: Home },
  { title: 'Выписка из ЕГРН', icon: FileText },
  { title: 'Замена паспорта СССР', icon: FileText },
  { title: 'Запись к терапевту / хирургу / психиатру', icon: UserCheck },
];

// Новые кнопки: при нажатии ничего не меняется, выходит окно о технических работах
const CATALOG = [
  { title: 'Документы', icon: FileText },
  { title: 'Налоги', icon: Receipt },
  { title: 'Штрафы', icon: Scale },
  { title: 'Транспорт', icon: Car },
  { title: 'Здоровье', icon: HeartPulse },
  { title: 'Семья', icon: Baby },
  { title: 'Образование', icon: GraduationCap },
  { title: 'Работа', icon: Briefcase },
  { title: 'Бизнес', icon: Building2 },
  { title: 'Пенсии', icon: Landmark },
  { title: 'Почта', icon: Mail },
  { title: 'ЖКХ', icon: Wrench },
];

const BOTTOM = [
  { title: 'Главная', icon: LayoutGrid },
  { title: 'Заявления', icon: ClipboardList },
  { title: 'Платежи', icon: Wallet },
  { title: 'Профиль', icon: User },
];

export const GosuslugiTool: React.FC<ToolProps> = ({ onClose }) => {
  const [modal, setModal] = useState<'busy' | 'works' | null>(null);

  const openBusy = () => {
    soundManager.playBeep(600, 0.08);
    setModal('busy');
  };
  const openWorks = () => {
    soundManager.playBeep(500, 0.08);
    setModal('works');
  };

  return (
    <ToolWrapper title="Госуслуги" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4 py-1 select-none">
        {/* Шапка портала */}
        <div className="relative overflow-hidden rounded-[2rem] p-5 text-white shadow-xl border border-white/10 bg-gradient-to-br from-[#0b2a6b] via-[#0a3a96] to-[#1a6fd6]">
          <div className="absolute -top-12 -right-8 w-44 h-44 rounded-full bg-sky-300/25 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-md">🏛️</div>
              <div>
                <h1 className="text-lg font-extrabold leading-none">Госуслуги</h1>
                <p className="text-[10px] text-sky-100 mt-1">Единый портал государственных сервисов</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={openWorks} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer" aria-label="Уведомления">
                <Bell className="w-4 h-4" />
              </button>
              <button onClick={openWorks} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer" aria-label="Госключ">
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={openWorks}
            className="relative mt-4 w-full flex items-center gap-2.5 rounded-full bg-white text-slate-400 px-4 py-3 text-sm text-left cursor-pointer shadow-lg"
          >
            <Search className="w-4 h-4 text-[#0a3a96]" />
            Поиск услуг и ведомств
          </button>

          <div className="relative mt-3 grid grid-cols-2 gap-2">
            <button onClick={openWorks} className="rounded-2xl bg-white/15 hover:bg-white/25 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
              <CreditCard className="w-4 h-4" /> Мои документы
            </button>
            <button onClick={openWorks} className="rounded-2xl bg-white/15 hover:bg-white/25 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
              <Receipt className="w-4 h-4" /> Мои платежи
            </button>
          </div>
        </div>

        {/* Каталог */}
        <div>
          <div className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-sky-200/80">Каталог услуг</div>
          <div className="grid grid-cols-4 gap-2">
            {CATALOG.map((c) => (
              <button
                key={c.title}
                onClick={openWorks}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white py-3 px-1 shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                <span className="w-10 h-10 rounded-xl bg-[#e6f1ff] text-[#0a3a96] flex items-center justify-center">
                  <c.icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-semibold text-[#0b2a6b] leading-tight text-center">{c.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Популярные услуги */}
        <div>
          <div className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-sky-200/80">Популярные услуги</div>
          <div className="space-y-2">
            {SERVICES.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <button
                  key={idx}
                  onClick={openBusy}
                  className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between text-left cursor-pointer shadow-md active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#e6f1ff] text-[#0a3a96] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[#0b2a6b] font-semibold text-xs sm:text-[13px] leading-snug">{srv.title}</span>
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] text-[#1a6fd6] font-bold uppercase shrink-0 ml-2">
                    Оформить <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Нижняя навигация */}
        <div className="sticky bottom-0 mt-1 grid grid-cols-4 gap-1 rounded-full bg-white p-1.5 shadow-2xl">
          {BOTTOM.map((b, i) => (
            <button
              key={b.title}
              onClick={openWorks}
              className={`py-2 rounded-full flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
                i === 0 ? 'bg-[#0a3a96] text-white' : 'text-[#0b2a6b] hover:bg-[#e6f1ff]'
              }`}
            >
              <b.icon className="w-4 h-4" />
              {b.title}
            </button>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-[#031024]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${modal === 'busy' ? 'bg-red-50 text-red-500' : 'bg-[#e6f1ff] text-[#1a6fd6]'}`}>
              {modal === 'busy' ? <ShieldAlert className="w-8 h-8" /> : <Wrench className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-[#0b2a6b] mb-2">{modal === 'busy' ? 'Все сервера заняты' : 'Технические работы'}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {modal === 'busy' ? 'Попробуйте позже.' : 'Раздел временно недоступен. Мы проводим технические работы, попробуйте зайти позже.'}
            </p>
            <button onClick={() => setModal(null)} className="w-full py-3 bg-[#0a3a96] hover:bg-[#0b4bb8] text-white font-bold rounded-full transition-colors cursor-pointer text-xs uppercase">
              Понятно
            </button>
          </div>
        </div>
      )}
    </ToolWrapper>
  );
};
