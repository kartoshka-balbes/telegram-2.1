import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Phone, PhoneCall, HeartHandshake, ShieldAlert, PhoneOff, ArrowRight, UserCheck, Sparkles, Volume2, X } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface SupportLine {
  id: string;
  name: string;
  phone: string;
  category: string;
  hours: string;
  badgeColor: string;
  icon: string;
  description: string;
}

const SUPPORT_LINES: SupportLine[] = [
  {
    id: '1',
    name: 'Единый всероссийский телефон доверия',
    phone: '8-800-200-01-22',
    category: 'Кризисная помощь',
    hours: 'Круглосуточно • 24/7',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🤝',
    description: 'Экстренная психологическая помощь при кризисных состояниях и тревоге.',
  },
  {
    id: '2',
    name: 'Служба неотложной психологической помощи',
    phone: '051',
    category: 'Городская линия',
    hours: 'Круглосуточно • Бесплатно',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    icon: '🏢',
    description: 'Прямая линия поддержки жителей в стрессовых и конфликтных ситуациях.',
  },
  {
    id: '3',
    name: 'Горячая линия душевного равновесия',
    phone: '+7 (495) 989-50-50',
    category: 'Стресс и депрессия',
    hours: '24/7',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: '🧠',
    description: 'Индивидуальные консультации по преодолению эмоционального выгорания.',
  },
  {
    id: '4',
    name: 'Линия экстренной помощи при панике и страхе',
    phone: '8-800-333-44-34',
    category: 'Панические атаки',
    hours: 'Круглосуточно',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    icon: '🫀',
    description: 'Техники стабилизации дыхания, заземления и снятия острого приступа тревоги.',
  },
  {
    id: '5',
    name: 'Кабинет мгновенного утешения и поддержки',
    phone: '8-800-500-11-22',
    category: 'Одиночество',
    hours: '24/7 • Анонимно',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: '🫂',
    description: 'Теплый доверительный разговор, если не с кем разделить накопившиеся переживания.',
  },
  {
    id: '6',
    name: 'Центр психологической реабилитации',
    phone: '8-800-200-47-03',
    category: 'Восстановление',
    hours: 'Круглосуточно',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: '🌿',
    description: 'Помощь в преодолении постстрессовых реакций и обретении внутренней опоры.',
  },
  {
    id: '7',
    name: 'Горячая линия поддержки «Не грусти»',
    phone: '+7 (999) 777-66-55',
    category: 'Позитив и надежда',
    hours: '08:00 - 02:00',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '☀️',
    description: 'Дружеская поддержка, добрые советы и мотивационные установки на день.',
  },
  {
    id: '8',
    name: 'Скорая антистресс-помощь',
    phone: '+7 (495) 625-31-01',
    category: 'Срочный вызов',
    hours: '24/7 • Экстренно',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: '🚑',
    description: 'Оперативная психологическая помощь при внезапных стрессовых потрясениях.',
  },
  {
    id: '9',
    name: 'Служба доверия «Второе дыхание»',
    phone: '8-800-100-49-94',
    category: 'Самопознание',
    hours: 'Круглосуточно',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '🌊',
    description: 'Психологические практики для восстановления жизненного ресурса и тонуса.',
  },
  {
    id: '10',
    name: 'Линия принятия и самосострадания',
    phone: '+7 (499) 177-34-94',
    category: 'Самооценка',
    hours: '24/7 • Анонимно',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '💖',
    description: 'Поддержка при чувстве вины, самоедстве и синдроме самозванца.',
  }
];

const CALL_OUTCOMES = [
  {
    title: 'Недостаточно средств',
    subtitle: 'На вашем балансе недостаточно средств для совершения данного вызова.',
    icon: '💳',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    soundType: 'busy',
  },
  {
    title: 'Поплачь',
    subtitle: 'Абонент ответил: «Просто поплачь, легче станет...» и повесил трубку.',
    icon: '😭',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    soundType: 'cry',
  },
  {
    title: 'Линия занята',
    subtitle: 'Все операторы и специалисты в данный момент заняты на другой линии.',
    icon: '📞',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/50',
    soundType: 'busy',
  },
  {
    title: 'Абонент вне зоны действия сети',
    subtitle: 'Номер временно недоступен или находится вне зоны действия сети.',
    icon: '📶',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
    soundType: 'beep',
  },
];

export const PsychologicalHelpTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeCall, setActiveCall] = useState<SupportLine | null>(null);
  const [callPhase, setCallPhase] = useState<'dialing' | 'result' | null>(null);
  const [chosenOutcome, setChosenOutcome] = useState<(typeof CALL_OUTCOMES)[0] | null>(null);

  const handleStartCall = (line: SupportLine) => {
    setActiveCall(line);
    setCallPhase('dialing');
    soundManager.playPhoneRing();

    // Random outcome selection
    const outcome = CALL_OUTCOMES[Math.floor(Math.random() * CALL_OUTCOMES.length)];
    setChosenOutcome(outcome);

    // Save call attempt into phone history localStorage
    try {
      const raw = localStorage.getItem('phone_call_history');
      const prev = raw ? JSON.parse(raw) : [];
      const newHistoryItem = {
        id: Date.now().toString(),
        name: line.name,
        phone: line.phone,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Исходящий вызов',
        status: outcome.title,
      };
      const updated = [newHistoryItem, ...prev];
      localStorage.setItem('phone_call_history', JSON.stringify(updated));
      window.dispatchEvent(new Event('phone_history_updated'));
    } catch {}

    // After 2.2 seconds of ringing, reveal the random outcome
    setTimeout(() => {
      setCallPhase('result');
      if (outcome.title === 'Поплачь') {
        soundManager.playBeep(450, 0.4);
      } else {
        soundManager.playBeep(800, 0.2);
      }
    }, 2200);
  };

  const handleCloseCallModal = () => {
    setActiveCall(null);
    setCallPhase(null);
    setChosenOutcome(null);
  };

  const handleOpenPhoneTool = () => {
    handleCloseCallModal();
    window.dispatchEvent(new CustomEvent('open_tool', { detail: 'phone' }));
  };

  const CAT_STYLE: Record<string, string> = {
    '1': 'bg-teal-50 text-teal-700 ring-teal-200',
    '2': 'bg-sky-50 text-sky-700 ring-sky-200',
    '3': 'bg-cyan-50 text-cyan-700 ring-cyan-200',
    '4': 'bg-blue-50 text-blue-700 ring-blue-200',
    '5': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    '6': 'bg-violet-50 text-violet-700 ring-violet-200',
    '7': 'bg-amber-50 text-amber-700 ring-amber-200',
    '8': 'bg-rose-50 text-rose-700 ring-rose-200',
    '9': 'bg-blue-50 text-blue-700 ring-blue-200',
    '10': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  };

  return (
    <ToolWrapper title="Психологическая помощь" onClose={onClose}>
      <div className="flex-1 min-h-0 flex flex-col max-w-2xl mx-auto w-full select-none">
        {/* Светлая клиническая панель */}
        <div className="flex-1 min-h-0 overflow-y-auto rounded-[2rem] bg-[#f1f6fb] text-slate-800 p-3 sm:p-4 space-y-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-[1.75rem] p-5 bg-gradient-to-br from-[#0e7c86] via-[#0f9aa1] to-[#2a7de1] text-white shadow-lg shadow-teal-900/20">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute right-6 bottom-3 text-white/15 text-7xl font-black leading-none">+</div>
            <svg className="absolute left-0 right-0 bottom-0 w-full h-10 opacity-30" viewBox="0 0 400 40" preserveAspectRatio="none">
              <polyline fill="none" stroke="white" strokeWidth="2" points="0,22 70,22 85,22 95,6 105,36 115,22 190,22 205,22 215,10 225,32 235,22 400,22" />
            </svg>
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> Служба работает 24/7
                </div>
                <h2 className="text-lg sm:text-xl font-bold leading-tight">Служба психологической помощи</h2>
                <p className="text-xs text-white/85 mt-1 max-w-xs">
                  Выберите номер из каталога горячих линий для экстренной связи
                </p>
              </div>
              <button
                onClick={handleOpenPhoneTool}
                className="px-3.5 py-2 bg-white text-teal-700 hover:bg-teal-50 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">В телефон</span>
              </button>
            </div>

            <div className="relative grid grid-cols-3 gap-2 mt-4">
              {[
                ['10', 'линий'],
                ['24/7', 'приём'],
                ['100%', 'анонимно'],
              ].map(([n, l]) => (
                <div key={l} className="bg-white/15 backdrop-blur rounded-2xl py-2 text-center">
                  <div className="text-base font-bold leading-none">{n}</div>
                  <div className="text-[10px] text-white/80 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-1 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Каталог горячих линий</div>

          {/* Directory */}
          <div className="space-y-2.5">
            {SUPPORT_LINES.map((line) => (
              <div
                key={line.id}
                className="bg-white border border-slate-200/70 hover:border-teal-300 p-3.5 rounded-[1.5rem] transition-all shadow-[0_4px_16px_rgba(15,60,100,0.06)] hover:shadow-[0_8px_24px_rgba(15,100,120,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-50 to-sky-100 border border-teal-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    {line.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-[13px] font-bold text-slate-800 leading-snug">{line.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${CAT_STYLE[line.id] || 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
                        {line.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 leading-relaxed">{line.description}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold tabular-nums">📞 {line.phone}</span>
                      <span className="text-slate-400">{line.hours}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartCall(line)}
                  className="px-5 py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white font-bold text-xs rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Позвонить</span>
                </button>
              </div>
            ))}
          </div>
          <div className="h-2" />
        </div>

        {/* Окно вызова */}
        {activeCall && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white text-slate-800 rounded-[2rem] max-w-sm w-full p-6 text-center shadow-2xl relative space-y-5">
              <button
                onClick={handleCloseCallModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-50 to-sky-100 border border-teal-100 flex items-center justify-center text-4xl">
                {callPhase === 'dialing' ? (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-teal-300 animate-ping" />
                    <PhoneCall className="w-9 h-9 text-teal-500" />
                  </>
                ) : (
                  <span>{chosenOutcome?.icon}</span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 leading-snug">{activeCall.name}</h3>
                <p className="text-xs font-semibold text-teal-600 mt-1 tabular-nums">{activeCall.phone}</p>
              </div>

              {callPhase === 'dialing' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="text-xs font-semibold text-teal-600 tracking-wide animate-pulse">Соединение с абонентом...</div>
                  <svg viewBox="0 0 200 30" className="w-full h-8">
                    <polyline fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" points="0,15 40,15 50,15 56,4 62,26 68,15 120,15 130,15 136,6 142,24 148,15 200,15" />
                  </svg>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-full animate-progress" />
                  </div>
                </div>
              )}

              {callPhase === 'result' && chosenOutcome && (
                <div className="space-y-4 animate-in zoom-in duration-200">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-left space-y-1.5">
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>{chosenOutcome.icon}</span>
                      <span>{chosenOutcome.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">{chosenOutcome.subtitle}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => handleStartCall(activeCall)}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Позвонить снова</span>
                    </button>

                    <button
                      onClick={handleOpenPhoneTool}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-teal-600" />
                      <span>Открыть в инструменте «Телефон»</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
