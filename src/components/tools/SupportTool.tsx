import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Send, MessageSquare, Lightbulb, AlertTriangle, Clock, Hourglass, ShieldCheck, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const SupportTool: React.FC<ToolProps> = ({ onClose }) => {
  const [category, setCategory] = useState<'idea' | 'complaint' | 'bug' | 'question'>('idea');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'critical'>('urgent');
  const [isSending, setIsSending] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // 2-year countdown in seconds (2 years = 730 days = 63,072,000 seconds)
  const [countdownSeconds, setCountdownSeconds] = useState(63072000);

  useEffect(() => {
    if (!showResponseModal) return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [showResponseModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !message.trim()) return;

    soundManager.playBeep(1000, 0.1);
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setShowResponseModal(true);
      soundManager.playMicrowaveDing();
    }, 1500);
  };

  const formatCountdown = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${days} дн. ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const input =
    'w-full bg-[#f3f8ff] border border-[#d6e6fb] focus:border-[#2b7de9] focus:bg-white rounded-2xl px-4 py-3 text-sm text-[#12315c] placeholder-[#8aa4c6] outline-none transition-colors';

  return (
    <ToolWrapper title="Служба поддержки" onClose={onClose}>
      {showResponseModal && (
        <div className="fixed inset-0 bg-[#0a1c3a]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-[#12315c]">
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-[#e6f1ff] text-[#2b7de9] mx-auto flex items-center justify-center">
                <Hourglass className="w-7 h-7 animate-pulse" />
              </div>
              <div className="inline-block bg-[#e6f1ff] text-[#2b7de9] text-[10px] font-bold px-3 py-1 rounded-full">
                Реестровый номер обращения: #RU-2026/849204
              </div>
              <h2 className="text-base font-bold">Обращение зарегистрировано в системе</h2>
            </div>

            <div className="bg-[#f3f8ff] border border-[#d6e6fb] p-4 rounded-2xl space-y-2.5 text-xs leading-relaxed">
              <p>
                Ваше обращение по теме <strong className="font-bold">«{topic}»</strong> принято в обработку и внесено в Единый Архив Долгосрочного Рассмотрения.
              </p>

              <div className="p-3 bg-white border border-[#cfe0f7] rounded-xl space-y-1 text-[11px]">
                <div className="font-bold flex items-center gap-1 text-[#2b7de9]">
                  <Clock className="w-3.5 h-3.5" /> Регламент обработки обращений:
                </div>
                <p>
                  Срок регламентного рассмотрения составляет <strong className="underline decoration-[#2b7de9]">от 2 до 5 лет</strong> (плановая дата предоставления ответа: не ранее <strong>15 августа 2028 г.</strong>).
                </p>
              </div>

              <p className="text-[11px] text-[#5f7ea6]">
                Ваш текущий номер в очереди рассмотрения: <strong className="text-[#2b7de9]">#1,849,203</strong>.
              </p>
              <p className="text-[10px] text-[#8aa4c6] italic">
                Внимание: Пожалуйста, сохраняйте сессию активной в течение установленного срока рассмотрения.
              </p>
            </div>

            <div className="bg-[#eaf3ff] p-3 rounded-2xl text-center space-y-0.5">
              <span className="text-[10px] text-[#5f7ea6] uppercase tracking-widest font-semibold block">Расчётное время ожидания ответа:</span>
              <div className="text-xl font-bold text-[#2b7de9] tabular-nums">{formatCountdown(countdownSeconds)}</div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundManager.playBeep(700, 0.05);
                  setShowResponseModal(false);
                  setTopic('');
                  setMessage('');
                }}
                className="w-full py-3 bg-gradient-to-r from-[#2b7de9] to-[#4ba3ff] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Принять регламент ожидания (2 года)
              </button>

              <button
                onClick={() => {
                  soundManager.playBeep(400, 0.05);
                  setCountdownSeconds((prev) => prev + 86400 * 365); // Adds another year
                }}
                className="w-full py-2.5 bg-[#f3f8ff] hover:bg-[#e6f1ff] text-[#5f7ea6] text-[10px] font-semibold rounded-full border border-[#d6e6fb] transition-colors cursor-pointer"
              >
                Продлить регламент рассмотрения на 1 год (+365 дней)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Светлая форма */}
      <div className="flex-1 min-h-0 max-w-lg mx-auto w-full select-none">
        <div className="rounded-[2rem] bg-white text-[#12315c] p-4 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#2b7de9] to-[#4ba3ff] text-white">
            <div className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Единая служба технической поддержки</h2>
              <p className="text-[10px] text-white/85">Приём заявлений, предложений и технических отчётов</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5f7ea6] px-1">Категория обращения</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'idea', label: 'Предложение по улучшению', icon: Lightbulb, color: 'text-amber-500' },
                { id: 'complaint', label: 'Официальная жалоба', icon: AlertTriangle, color: 'text-rose-500' },
                { id: 'bug', label: 'Техническая неисправность', icon: MessageSquare, color: 'text-cyan-600' },
                { id: 'question', label: 'Консультация и вопросы', icon: HelpCircle, color: 'text-emerald-600' },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      category === cat.id ? 'bg-[#e6f1ff] border-[#2b7de9] text-[#12315c] font-semibold' : 'bg-white border-[#d6e6fb] text-[#5f7ea6] hover:bg-[#f3f8ff]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                    <span className="text-xs leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f7ea6] px-1">Тема обращения</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Кратко сформулируйте тему обращения..."
                className={input}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f7ea6] px-1">Категория срочности</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Стандартная' },
                  { id: 'urgent', label: 'Срочная' },
                  { id: 'critical', label: 'Высокая' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as any)}
                    className={`py-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      priority === p.id ? 'bg-[#2b7de9] text-white shadow' : 'bg-[#f3f8ff] border border-[#d6e6fb] text-[#5f7ea6] hover:bg-[#e6f1ff]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#5f7ea6] px-1">Подробное описание</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Подробно изложите суть обращения или технические детали..."
                className={`${input} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !topic.trim() || !message.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-[#2b7de9] to-[#4ba3ff] disabled:opacity-40 text-white font-bold text-sm rounded-full transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#2b7de9]/30"
            >
              {isSending ? (
                <>
                  <Hourglass className="w-4 h-4 animate-spin" />
                  <span>Регистрация в едином реестре...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Отправить обращение в поддержку</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </ToolWrapper>
  );
};
