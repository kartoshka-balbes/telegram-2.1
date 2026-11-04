import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  Mail,
  Inbox,
  Star,
  Search,
  CheckCircle2,
  Trash2,
  Reply,
  Forward,
  ShieldCheck,
  Send,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Email {
  id: string;
  sender: string;
  email: string;
  subject: string;
  date: string;
  body: string;
  avatarColor: string;
  initials: string;
  isStarred?: boolean;
}

export const MailTool: React.FC<ToolProps> = ({ onClose }) => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'Единый портал Госуслуг',
      email: 'no-reply@gosuslugi.ru',
      subject: 'Уведомление о статусе заявления',
      date: 'Сегодня, 10:15',
      body: 'Уважаемый гражданин! Ваше заявление на получение государственных услуг успешно зарегистрировано в ведомстве. Ожидайте готовности документов.',
      avatarColor: 'bg-blue-600',
      initials: 'ГУ',
      isStarred: true,
    },
    {
      id: '2',
      sender: 'Сбербанк Онлайн',
      email: 'info@sberbank.ru',
      subject: 'Ежемесячная выписка по счету',
      date: 'Вчера, 18:40',
      body: 'Здравствуйте! Ваш финансовый отчет за прошлый месяц сформирован и доступен в личном кабинете. Благодарим за использование наших банковских продуктов.',
      avatarColor: 'bg-emerald-600',
      initials: 'СБ',
      isStarred: false,
    },
    {
      id: '3',
      sender: 'Служба доставки Ozon',
      email: 'delivery@ozon.ru',
      subject: 'Ваш заказ доставлен в пункт выдачи',
      date: '05.08.2026',
      body: 'Ваш заказ №98410023 доставлен в пункт выдачи по адресу: ул. Ленина, д. 42. Срок хранения посылки — до 12 августа. Код получения: 849-201.',
      avatarColor: 'bg-blue-500',
      initials: 'OZ',
      isStarred: false,
    },
    {
      id: '4',
      sender: 'Отдел Кадров ООО «ПромТех»',
      email: 'hr@promtech.ru',
      subject: 'Приглашение на собеседование',
      date: '03.08.2026',
      body: 'Добрый день! Мы рассмотрели ваше резюме и рады пригласить вас на онлайн-интервью. Пожалуйста, сообщите удобное для вас время.',
      avatarColor: 'bg-amber-600',
      initials: 'ПТ',
      isStarred: false,
    },
  ]);

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplySuccess, setShowReplySuccess] = useState(false);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playBeep(1100, 0.05);
    setEmails((prev) =>
      prev.map((mail) => (mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    soundManager.playBeep(1300, 0.08);
    setShowReplySuccess(true);
    setReplyText('');
    setTimeout(() => setShowReplySuccess(false), 2500);
  };

  const filteredEmails = emails.filter(
    (m) =>
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ToolWrapper title="Электронная Почта" onClose={onClose} headerColor="bg-[#0e1626] border-blue-900">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full py-2 font-sans select-none space-y-3">
        {/* Top Modern App Bar */}
        <div className="flex items-center justify-between gap-3 bg-[#111c30] p-2.5 rounded-2xl border border-blue-900/50 shadow-lg">
          <div className="flex items-center gap-2 flex-1 relative">
            <Search className="w-4 h-4 text-blue-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по письмам и отправителям..."
              className="w-full bg-[#0a1222] border border-blue-950 focus:border-blue-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-300 font-bold px-2 py-1 bg-blue-950/60 rounded-xl border border-blue-800/40 shrink-0">
            <Inbox className="w-3.5 h-3.5 text-blue-400" />
            <span>{emails.length} писем</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-[380px]">
          {/* Left Email Feed */}
          <div className="md:col-span-5 flex flex-col gap-2 overflow-y-auto max-h-[420px] pr-1">
            {filteredEmails.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">Ничего не найдено</div>
            ) : (
              filteredEmails.map((mail) => {
                const isSelected = selectedEmail?.id === mail.id;
                return (
                  <div
                    key={mail.id}
                    onClick={() => {
                      soundManager.playBeep(900, 0.03);
                      setSelectedEmail(mail);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 group relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-950/90 to-[#122240] border-blue-500 shadow-md'
                        : 'bg-[#0f172a] border-slate-800/80 hover:border-slate-700 hover:bg-[#131d35]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 ${mail.avatarColor} shadow-md`}
                    >
                      {mail.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{mail.sender}</span>
                        <span className="text-[9px] text-slate-400 shrink-0">{mail.date.split(',')[0]}</span>
                      </div>
                      <h4 className="text-[11px] font-semibold text-blue-300 truncate mt-0.5">
                        {mail.subject}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                        {mail.body}
                      </p>
                    </div>

                    <button
                      onClick={(e) => toggleStar(mail.id, e)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors shrink-0"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          mail.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Email Preview Box */}
          <div className="md:col-span-7 bg-[#0d1527] border border-blue-900/60 rounded-3xl p-4 flex flex-col justify-between shadow-xl">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-blue-950 pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-black ${selectedEmail.avatarColor} shadow-lg`}
                      >
                        {selectedEmail.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{selectedEmail.subject}</h3>
                        <p className="text-[11px] text-blue-400 font-medium">
                          {selectedEmail.sender}{' '}
                          <span className="text-slate-500 text-[10px]">&lt;{selectedEmail.email}&gt;</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      {selectedEmail.date}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="py-4 text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/40 p-3.5 rounded-2xl border border-slate-900 mt-3">
                    <p>{selectedEmail.body}</p>
                  </div>
                </div>

                {/* Reply section */}
                <div className="space-y-2 pt-2 border-t border-blue-950">
                  {showReplySuccess && (
                    <div className="p-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-[11px] text-emerald-300 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ответ успешно отправлен!</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder={`Быстрый ответ для ${selectedEmail.sender}...`}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Отправить</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Цифровая подпись подтверждена
                    </span>
                    <span>Шифрование TLS 1.3</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Выберите письмо
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
