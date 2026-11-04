import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Phone, Users, PhoneOff, Volume2, History, Trash2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface CallHistoryItem {
  id: string;
  name: string;
  phone: string;
  time: string;
  type: string;
  status: string;
}

export const PhoneTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dialer' | 'contacts' | 'history'>('dialer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callingState, setCallingState] = useState<'idle' | 'ringing' | 'connected'>('idle');

  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [callSeconds, setCallSeconds] = useState(0);

  // Special Contact States
  const [pushedExplosion, setPushedExplosion] = useState(false);
  const [pirozkovBusy, setPirozkovBusy] = useState(false);
  const [active666Countdown, setActive666Countdown] = useState<number | null>(null);
  const [show666Screamer, setShow666Screamer] = useState(false);
  const [screamerZoom, setScreamerZoom] = useState(false);
  const [screamerDismissable, setScreamerDismissable] = useState(false);

  const screamerStartTimeRef = useRef<number>(0);
  const autoDismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dismiss666Screamer = useCallback(() => {
    const elapsed = Date.now() - screamerStartTimeRef.current;
    if (elapsed < 1000) return;

    if (autoDismissTimeoutRef.current) {
      clearTimeout(autoDismissTimeoutRef.current);
      autoDismissTimeoutRef.current = null;
    }

    setActive666Countdown(null);
    setShow666Screamer(false);
    setScreamerZoom(false);
    setScreamerDismissable(false);
    setActiveTab('contacts');
    setPhoneNumber('');
    setCallingState('idle');
    setCallSeconds(0);
    soundManager.playBeep(880, 0.08);
  }, []);

  // Global listener for instant skip upon any click, tap, pointerdown or keydown after 1s
  useEffect(() => {
    if (!show666Screamer) return;

    const handleGlobalInteraction = (e: Event) => {
      const elapsed = Date.now() - screamerStartTimeRef.current;
      if (elapsed >= 1000) {
        e.preventDefault();
        e.stopPropagation();
        dismiss666Screamer();
      }
    };

    window.addEventListener('click', handleGlobalInteraction, { capture: true });
    window.addEventListener('pointerdown', handleGlobalInteraction, { capture: true });
    window.addEventListener('touchstart', handleGlobalInteraction, { capture: true });
    window.addEventListener('keydown', handleGlobalInteraction, { capture: true });

    return () => {
      window.removeEventListener('click', handleGlobalInteraction, { capture: true });
      window.removeEventListener('pointerdown', handleGlobalInteraction, { capture: true });
      window.removeEventListener('touchstart', handleGlobalInteraction, { capture: true });
      window.removeEventListener('keydown', handleGlobalInteraction, { capture: true });
    };
  }, [show666Screamer, dismiss666Screamer]);

  // 666 Silent countdown from 10 to 0 effect
  useEffect(() => {
    if (active666Countdown !== null && active666Countdown > 0) {
      const timer = setTimeout(() => {
        setActive666Countdown(active666Countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (active666Countdown === 0) {
      // Reached zero: Face appears in center, zooms for 1.5s, dismissable after 1s
      setActive666Countdown(null);
      screamerStartTimeRef.current = Date.now();
      setShow666Screamer(true);
      setScreamerZoom(false);
      setScreamerDismissable(false);
      soundManager.playSqueal();

      // Enable visual cursor indicator after 1 second
      const dismissEnableTimer = setTimeout(() => {
        setScreamerDismissable(true);
      }, 1000);

      // Trigger zoom in over 1.5s
      const zoomTimer = setTimeout(() => {
        setScreamerZoom(true);
      }, 30);

      // Auto return back to phone tool after 3.5s and reset to contacts
      autoDismissTimeoutRef.current = setTimeout(() => {
        setShow666Screamer(false);
        setScreamerZoom(false);
        setScreamerDismissable(false);
        setActiveTab('contacts');
        setPhoneNumber('');
        setCallingState('idle');
        setCallSeconds(0);
        soundManager.playBeep(880, 0.1);
      }, 3500);

      return () => {
        clearTimeout(dismissEnableTimer);
        clearTimeout(zoomTimer);
        if (autoDismissTimeoutRef.current) {
          clearTimeout(autoDismissTimeoutRef.current);
        }
      };
    }
  }, [active666Countdown]);

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('phone_call_history');
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored) && stored.length > 0) {
          const seenIds = new Set<string>();
          const sanitized: CallHistoryItem[] = [];

          stored.forEach((item, idx) => {
            if (!item || typeof item !== 'object') return;
            let id = String(item.id || `hist-${idx}-${Date.now()}`);
            if (seenIds.has(id)) {
              id = `${id}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
            }
            seenIds.add(id);

            sanitized.push({
              id,
              name: String(item.name || item.phone || 'Неизвестный'),
              phone: String(item.phone || item.name || '+7 (900) 000-00-00'),
              time: String(item.time || '12:00'),
              type: String(item.type || 'Вызов'),
              status: String(item.status || 'Завершён'),
            });
          });

          setCallHistory(sanitized);
          return;
        }
      }
      const defaultHistory: CallHistoryItem[] = [
        { id: 'd1', name: '+7 (900) 666-13-13', phone: '+7 (900) 666-13-13', time: '14:02', type: 'Неизвестный номер', status: 'Пропущенный' },
        { id: 'd2', name: 'Ирина (ЦИАН Премиум)', phone: '+7 (999) 000-11-22', time: '12:45', type: 'Недвижимость (2-к. квартира)', status: 'Исходящий' },
        { id: 'd3', name: 'Доставка пиццы', phone: '+7 (495) 777-00-00', time: 'Вчера 21:40', type: 'Служба доставки', status: 'Входящий' },
        { id: 'd4', name: 'Мошенник из банка', phone: '+7 (800) 555-35-35', time: '3 мин назад', type: 'Спам', status: 'Пропущенный' },
        { id: 'd5', name: 'Алексей (Агентство)', phone: '+7 (999) 333-44-55', time: '04:12', type: 'Недвижимость (Студия Сити)', status: 'Исходящий' },
      ];
      setCallHistory(defaultHistory);
      localStorage.setItem('phone_call_history', JSON.stringify(defaultHistory));
    } catch {
      setCallHistory([
        { id: 'd1', name: '+7 (900) 666-13-13', phone: '+7 (900) 666-13-13', time: '14:02', type: 'Неизвестный номер', status: 'Пропущенный' },
        { id: 'd2', name: 'Ирина (ЦИАН Премиум)', phone: '+7 (999) 000-11-22', time: '12:45', type: 'Недвижимость (2-к. квартира)', status: 'Исходящий' },
      ]);
    }
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playBeep(450, 0.08);
    setCallHistory([]);
    try {
      localStorage.setItem('phone_call_history', JSON.stringify([]));
    } catch {}
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playBeep(500, 0.05);
    const updated = callHistory.filter((item) => item.id !== id);
    setCallHistory(updated);
    try {
      localStorage.setItem('phone_call_history', JSON.stringify(updated));
    } catch {}
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener('phone_history_updated', handleUpdate);
    return () => window.removeEventListener('phone_history_updated', handleUpdate);
  }, []);

  // Real call timer effect
  useEffect(() => {
    let interval: any = null;
    if (callingState === 'connected') {
      interval = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callingState]);

  const formatCallTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDialDigit = (digit: string) => {
    soundManager.playBeep(1200, 0.08);
    setPhoneNumber((prev) => (prev.length < 15 ? prev + digit : prev));
  };

  const handleStartCall = () => {
    if (!phoneNumber) return;

    if (phoneNumber.trim() === '666' || phoneNumber.includes('666')) {
      setActive666Countdown(10);
      return;
    }

    soundManager.playPhoneRing();
    setCallingState('ringing');

    // Add into history
    const newCall: CallHistoryItem = {
      id: Date.now().toString(),
      name: phoneNumber,
      phone: phoneNumber,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Исходящий вызов',
      status: 'Завершён',
    };
    const updated = [newCall, ...callHistory];
    setCallHistory(updated);
    try {
      localStorage.setItem('phone_call_history', JSON.stringify(updated));
    } catch {}

    setTimeout(() => {
      setCallingState('connected');
    }, 2500);
  };

  const handleEndCall = () => {
    setCallingState('idle');
  };

  const handleContactClick = (name: string, phone: string) => {
    if (name === 'Уральские Пельмени') {
      soundManager.playExplosion();
      setPushedExplosion(true);
      setTimeout(() => setPushedExplosion(false), 1000);
    } else if (name === 'Артур Пирожков') {
      setPirozkovBusy(true);
      setTimeout(() => setPirozkovBusy(false), 3000);
    } else if (name === '666' || phone === '666') {
      setActive666Countdown(10);
    } else {
      setPhoneNumber(phone);
      setActiveTab('dialer');
    }
  };

  return (
    <ToolWrapper title="Телефон" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      {/* 666 Silent Countdown: Completely Black Screen with 10 -> 0 RED Timer in the center */}
      {active666Countdown !== null && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 select-none">
          <div className="text-8xl sm:text-9xl font-mono font-black text-red-600 tracking-widest select-none">
            {active666Countdown}
          </div>
        </div>
      )}

      {/* 666 Screamer: Scary scream sound + Face zooms in center (Dismisses on first click/tap only after 1s has elapsed) */}
      {show666Screamer && (
        <div
          onClick={dismiss666Screamer}
          onPointerDown={dismiss666Screamer}
          onTouchStart={dismiss666Screamer}
          className={`fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-4 overflow-hidden select-none ${
            screamerDismissable ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <div
            className="w-64 h-64 sm:w-80 sm:h-80 select-none pointer-events-none transition-transform duration-[1500ms] ease-out will-change-transform flex items-center justify-center overflow-hidden rounded-full border-4 border-red-600 shadow-[0_0_100px_rgba(239,68,68,1)] bg-black"
            style={{
              transform: screamerZoom ? 'scale(4.8)' : 'scale(1)',
            }}
          >
            <span className="text-[9rem] leading-none sm:text-[11rem]">🥸</span>
          </div>
        </div>
      )}

      {/* Explosion overlay for Uralskie Pelmeni */}
      {pushedExplosion && (
        <div className="fixed inset-0 bg-amber-500/80 z-50 flex items-center justify-center animate-ping">
          <div className="text-9xl">💥</div>
        </div>
      )}

      {/* Pirozhkov Busy Toast */}
      {pirozkovBusy && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce text-lg">
          Абонент занят...
        </div>
      )}

      {/* Active Call UI Overlay */}
      {callingState !== 'idle' && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-8 animate-in fade-in duration-200">
          <div className="flex flex-col items-center pt-12">
            <div className="w-28 h-28 rounded-full bg-[#8f9bff]/20 border-2 border-[#8f9bff] flex items-center justify-center text-4xl text-[#8f9bff] font-bold mb-6 animate-pulse shadow-[0_0_25px_rgba(143,155,255,0.4)]">
              📞
            </div>
            <h2 className="text-2xl font-black text-white mb-2 font-mono">{phoneNumber}</h2>
            <p className="text-[#8f9bff] font-mono text-sm animate-pulse">
              {callingState === 'ringing' ? 'Гудки... (Идёт вызов)' : `${formatCallTime(callSeconds)} - Разговор установлен`}
            </p>
          </div>

          <div className="w-full max-w-xs flex items-center justify-around pb-12">
            <button className="p-4 bg-[#171b27] border border-[#222840] rounded-full text-gray-300 hover:text-white transition-colors cursor-pointer">
              <Volume2 className="w-8 h-8" />
            </button>
            <button
              onClick={handleEndCall}
              className="p-5 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl shadow-red-600/50 transition-transform active:scale-90 cursor-pointer"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col transition-all duration-200">
        {/* Phone Nav Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#0f121a] p-1.5 rounded-2xl border border-[#222840] mb-4">
          <button
            onClick={() => {
              soundManager.playBeep(800, 0.05);
              setActiveTab('dialer');
            }}
            className={`py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'dialer'
                ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                : 'text-gray-400 hover:text-white bg-[#171b27]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Набор</span>
          </button>
          <button
            onClick={() => {
              soundManager.playBeep(800, 0.05);
              setActiveTab('contacts');
            }}
            className={`py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                : 'text-gray-400 hover:text-white bg-[#171b27]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Контакты</span>
          </button>
          <button
            onClick={() => {
              soundManager.playBeep(800, 0.05);
              setActiveTab('history');
            }}
            className={`py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                : 'text-gray-400 hover:text-white bg-[#171b27]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>История</span>
          </button>
        </div>

        {/* TAB 1: Dialer */}
        {activeTab === 'dialer' && (
          <div className="flex-1 flex flex-col items-center justify-between py-2 animate-in fade-in duration-200">
            {/* Number Display */}
            <div className="w-full bg-[#0f121a] border border-[#222840] rounded-2xl p-3.5 text-center min-h-[58px] flex items-center justify-center mb-4">
              <span className="text-xl sm:text-2xl font-mono text-[#8f9bff] font-black tracking-widest truncate">
                {phoneNumber || '+7 (___) ___-__-__'}
              </span>
            </div>

            {/* Circular Keypad Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDialDigit(digit)}
                  className="w-14 h-14 mx-auto rounded-2xl bg-[#12151e] border border-[#222840] hover:border-[#8f9bff] hover:bg-[#222840]/30 text-white font-black text-xl flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full max-w-xs">
              <button
                onClick={handleStartCall}
                disabled={!phoneNumber}
                className="flex-1 py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] disabled:opacity-50 text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(143,155,255,0.4)] uppercase cursor-pointer transition-all active:scale-95"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>Вызов</span>
              </button>
              <button
                onClick={() => setPhoneNumber('')}
                className="px-4 py-3.5 bg-[#171b27] hover:bg-[#1e2232] text-gray-300 font-extrabold rounded-2xl border border-[#222840] cursor-pointer"
              >
                Сброс
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: History (Updated from Missed) */}
        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col gap-2 font-mono overflow-y-auto max-h-[380px] pr-1 animate-in fade-in duration-200">
            {callHistory.length > 0 && (
              <div className="flex items-center justify-between px-1 pb-1 mb-1 border-b border-[#222840]/60 text-[11px]">
                <span className="text-gray-400 font-bold">Всего записей: {callHistory.length}</span>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 font-extrabold cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Очистить всё</span>
                </button>
              </div>
            )}

            {callHistory.length === 0 ? (
              <p className="text-center text-gray-500 my-auto text-xs font-bold py-8">История звонков пуста</p>
            ) : (
              callHistory.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    soundManager.playBeep(900, 0.04);
                    setPhoneNumber(item.phone);
                    setActiveTab('dialer');
                  }}
                  className="bg-[#12151e] border border-[#222840] hover:border-[#8f9bff]/50 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      item.status === 'Пропущенный' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-[#222840] text-[#8f9bff] border border-[#8f9bff]/40'
                    }`}>
                      📞
                    </div>
                    <div className="truncate">
                      <div className="text-white font-extrabold text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-[#8f9bff] font-semibold truncate">{item.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-[10px] text-gray-400 font-bold">{item.time}</div>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                      title="Удалить запись"
                      className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Contacts */}
        {activeTab === 'contacts' && (
          <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[380px] pr-1 animate-in fade-in duration-200">
            {[
              { name: 'Уральские Пельмени', phone: '+7 999 111-22-33', emoji: '🎭' },
              { name: 'Артур Пирожков', phone: '+7 777 777-77-77', emoji: '🕺' },
              { name: '666', phone: '666', emoji: '😈' },
              { name: 'Агент Недвижимости (Ирина)', phone: '+7 (999) 000-11-22', emoji: '🏢' },
            ].map((contact) => (
              <div
                key={contact.name}
                onClick={() => handleContactClick(contact.name, contact.phone)}
                className="bg-[#12151e] border border-[#222840] hover:border-[#8f9bff] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#171b27] group-hover:bg-[#8f9bff]/20 flex items-center justify-center text-xl transition-colors">
                    {contact.emoji}
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-xs">{contact.name}</h3>
                    <p className="text-gray-400 text-[10px] font-mono">{contact.phone}</p>
                  </div>
                </div>
                <Phone className="w-4 h-4 text-[#8f9bff] opacity-60 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
