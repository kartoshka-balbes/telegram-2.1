import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  Image,
  Smile,
  Phone,
  Video,
  Pin,
  MapPin,
  Reply,
  Share2,
  Edit2,
  Trash2,
  X,
  Play,
  Pause,
  Camera,
  Ban,
  UserPlus,
  Clock,
  Bold,
  Italic,
  Code,
  PieChart,
  UserCheck,
  Palette,
  Volume2,
  Monitor,
  Flame,
  ShieldAlert,
  Siren,
  Bomb,
  Radio,
  Quote,
  History,
  FileText,
  MoreVertical,
  AlertTriangle,
  Flag,
  MicOff,
  VideoOff,
  PhoneOff,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { ChatItem, MessageItem } from '../types';
import { soundManager, triggerHaptic } from '../utils/soundEffects';
import { ChatBackground, ChatWallpaperType, WallpaperOptions } from './ChatBackground';
import { ParticipantProfile } from './ProfileExtras';
import { saveChatPhoto, getChatPhotos, setUserAvatar, ChatPhotoItem } from '../utils/chatPhotos';

interface ChatViewProps {
  chat: ChatItem;
  allChats: ChatItem[];
  onBack: () => void;
  onSendMessage: (chatId: string, message: Partial<MessageItem>) => void;
  onEditMessage: (chatId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (chatId: string, messageId: string) => void;
  onPinMessage: (chatId: string, messageId: string | undefined) => void;
  onToggleReaction: (chatId: string, messageId: string, emoji: string) => void;
  onForwardMessage: (targetChatId: string, text: string) => void;
  onBlockUser: (userName: string) => void;
  onAddFriend: (userName: string) => void;
  draftText: string;
  onSaveDraft: (chatId: string, text: string) => void;
  sendSoundEnabled?: boolean;
  chatWallpaper?: ChatWallpaperType;
}

const FUNNY_LOCATIONS = [
  'подвал', 'нигерия', 'саратов', 'сызрань', 'северодвинск', 'непонятно где', 'где-то здесь',
  'рядом', 'в двух метрах', 'диснейленд', 'алкомагазин', 'общественный туалет', 'канава',
  'марс', 'юпитер', 'солнце', 'северный полюс', 'антарктида', 'берлин', 'париж', 'остров',
  'майами', 'лос-анджелес', 'лондон', 'кардифф', 'рим', 'челябинск', 'шахты', 'комсомольск-на-амуре',
  'якутск', 'на дне байкала', 'ташкент', 'бишкек', 'казахстан', 'баку', 'чечня', 'казань',
  'тольятти', 'херсон', 'бахмут', 'киев', 'одесса', 'беларусь', 'иваново', 'новосибирск',
  'томск', 'софия', 'александрия', 'виктория', 'димитровград', 'артём', 'ярославль', 'орёл',
  'лариса', 'влера', 'печ', 'стокгольм', 'болото', 'яма', 'роддом', 'автобус', 'детский сад',
  'школа', 'в одежде'
];

const MENTION_SUGGESTIONS = [
  '@Ольга', '@Разработчик', '@Маньяк', '@Трамп', '@Админ', '@Все', '@Пиво', '@Мошенник'
];

const FUNNY_INSULTS = [
  'Ты редиска!',
  'Дурилка картонная!',
  'Бублик дырявый!',
  'Пингвин без крыльев!',
  'Чайник со свистком!',
  'Капустный кочерыжка!',
  'Огурец соленый!',
  'Оладушек подгоревший!'
];

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  allChats,
  onBack,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onPinMessage,
  onToggleReaction,
  onForwardMessage,
  onBlockUser,
  onAddFriend,
  draftText,
  onSaveDraft,
  sendSoundEnabled = true,
  chatWallpaper = 'cyber_emerald',
}) => {
  const [showParticipantProfile, setShowParticipantProfile] = useState(false);
  const [inputText, setInputText] = useState(draftText || '');
  const [showStickers, setShowStickers] = useState(false);
  const [recentStickers, setRecentStickers] = useState<string[]>(['🤡', '💩', '🗿', '🔥']);

  // Chat 0.5s Loading Animation state
  const [isLoadingChat, setIsLoadingChat] = useState(true);

  // States for interactive features
  const [replyingTo, setReplyingTo] = useState<MessageItem | null>(null);
  const [quotingMsg, setQuotingMsg] = useState<MessageItem | null>(null);
  const [editingMsg, setEditingMsg] = useState<MessageItem | null>(null);
  const [forwardingMsg, setForwardingMsg] = useState<MessageItem | null>(null);
  const [selectedMsgForActions, setSelectedMsgForActions] = useState<MessageItem | null>(null);
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  // Swipe and Long-press refs
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Trigger 0.5s loading animation whenever chat.id changes
  useEffect(() => {
    setIsLoadingChat(true);
    const timer = setTimeout(() => {
      setIsLoadingChat(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [chat.id]);

  // Scheduled delay (seconds)
  const [scheduleDelay, setScheduleDelay] = useState<number>(0);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);

  // Media Attachment Caption modal
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaCaption, setMediaCaption] = useState('');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [fullPhotoModal, setFullPhotoModal] = useState<string | null>(null);
  const [savedChatPhotos, setSavedChatPhotos] = useState<ChatPhotoItem[]>([]);

  // Poll Creation Modal
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Да', 'Нет', 'Возможно']);

  // Wallpapers
  const [activeWallpaper, setActiveWallpaper] = useState<ChatWallpaperType>(chatWallpaper || 'cyber_emerald');
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useEffect(() => {
    if (chatWallpaper) {
      setActiveWallpaper(chatWallpaper);
    }
  }, [chatWallpaper]);

  useEffect(() => {
    if (showMediaModal) {
      setSavedChatPhotos(getChatPhotos());
    }
  }, [showMediaModal]);

  // Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Спам');
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Deleted messages log
  const [deletedLog, setDeletedLog] = useState<MessageItem[]>([]);
  const [showDeletedLogModal, setShowDeletedLogModal] = useState(false);

  // Call state
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callError, setCallError] = useState('');
  const [callTime, setCallTime] = useState(0);
  const [showSystemErrorModal, setShowSystemErrorModal] = useState(false);
  const [noiseSuppressionActive, setNoiseSuppressionActive] = useState(false);
  const [showInCallPopup, setShowInCallPopup] = useState<string | null>(null);
  const [callKind, setCallKind] = useState<'voice' | 'video'>('voice');
  const [callPhase, setCallPhase] = useState<'ringing' | 'connecting' | 'active' | 'failed'>('ringing');
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [frontCam, setFrontCam] = useState(true);
  const [showCallMenu, setShowCallMenu] = useState(false);

  // Recording state (Voice/Circle)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Audio playing state
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when new message arrives or chat changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(timer);
  }, [chat.id, chat.messages]);

  // Voice recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVoice) {
      timer = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  // Call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callConnected) {
      timer = setInterval(() => setCallTime((t) => t + 1), 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(timer);
  }, [callConnected]);

  // Periodic weird noise during active noise suppression call
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callConnected && noiseSuppressionActive) {
      interval = setInterval(() => {
        soundManager.playBeep(Math.floor(Math.random() * 2000) + 300, 0.2);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [callConnected, noiseSuppressionActive]);

  // Handle Input Changes & Draft Saving
  const handleInputChange = (val: string) => {
    setInputText(val);
    onSaveDraft(chat.id, val);
    if (val.endsWith('@')) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (editingMsg) {
      onEditMessage(chat.id, editingMsg.id, inputText);
      setEditingMsg(null);
    } else {
      if (sendSoundEnabled) {
        soundManager.playSendMessage();
      } else {
        soundManager.playBeep(900, 0.05);
      }

      const msgData: Partial<MessageItem> = {
        text: inputText,
        sender: 'user',
        replyToId: replyingTo?.id,
        replyToText: replyingTo?.text,
        quotedText: quotingMsg ? quotingMsg.text : undefined,
        type: 'text',
      };

      // 1-second delay timer for sending messages as requested
      setTimeout(() => {
        if (scheduleDelay > 0) {
          msgData.isScheduled = true;
          const delay = scheduleDelay;
          setShowInCallPopup(`💬 Сообщение запланировано к отправке через ${delay} сек.`);
          setTimeout(() => {
            setShowInCallPopup(null);
          }, 2000);

          setTimeout(() => {
            onSendMessage(chat.id, { ...msgData, isScheduled: false });
          }, delay * 1000);
        } else {
          onSendMessage(chat.id, msgData);
        }
      }, 1000);

      setReplyingTo(null);
      setQuotingMsg(null);
    }

    setInputText('');
    setScheduleDelay(0);
    onSaveDraft(chat.id, '');
  };

  const handleSendVoice = () => {
    soundManager.playBeep(600, 0.1);
    onSendMessage(chat.id, {
      text: '🎤 Голосовое сообщение (0:09)',
      sender: 'user',
      type: 'voice',
      duration: '0:09',
    });
    setIsRecordingVoice(false);
  };

  const handleSendVideoCircle = () => {
    soundManager.playBeep(700, 0.1);
    onSendMessage(chat.id, {
      text: '📹 Видеосообщение (кружок)',
      sender: 'user',
      type: 'video_circle',
      duration: '0:12',
    });
  };

  const handleSendLocation = () => {
    soundManager.playBeep(850, 0.1);
    const randomLoc = FUNNY_LOCATIONS[Math.floor(Math.random() * FUNNY_LOCATIONS.length)];
    const lat = (Math.random() * 180 - 90).toFixed(4);
    const lng = (Math.random() * 360 - 180).toFixed(4);

    onSendMessage(chat.id, {
      text: `📍 Геолокация: ${randomLoc} (${lat}, ${lng})`,
      sender: 'user',
      type: 'location',
      locationName: randomLoc,
      locationCoords: `${lat}, ${lng}`,
    });
  };

  const handleSendMedia = () => {
    soundManager.playRock();
    const finalPhotoUrl = selectedPhotoUrl || '';
    if (mediaType === 'photo' && finalPhotoUrl) {
      saveChatPhoto(finalPhotoUrl, mediaCaption || 'Фотография из чата', 'Вы');
    }
    onSendMessage(chat.id, {
      text: mediaCaption || (mediaType === 'photo' ? '📷 Фотография' : '📹 Видеозапись'),
      sender: 'user',
      type: mediaType,
      caption: mediaCaption,
      mediaUrl: mediaType === 'photo' ? finalPhotoUrl : '🎥 [ВИДЕО]',
    });
    setShowMediaModal(false);
    setSelectedPhotoUrl('');
    setMediaCaption('');
  };

  const handleSendContact = () => {
    soundManager.playBeep(1100, 0.1);
    onSendMessage(chat.id, {
      text: '🎴 Контакт: Олег Сталин (+7 999 123-45-67)',
      sender: 'user',
      type: 'contact',
      contactData: {
        name: 'Олег Сталин',
        phone: '+7 999 123-45-67',
        avatar: '🚩',
      },
    });
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim()) return;
    soundManager.playBeep(1200, 0.1);
    onSendMessage(chat.id, {
      text: `📊 Опрос: ${pollQuestion}`,
      sender: 'user',
      type: 'poll',
      pollData: {
        question: pollQuestion,
        options: pollOptions.filter((o) => o.trim()).map((o, idx) => ({ id: `${idx}`, text: o, votes: 0 })),
        totalVotes: 0,
      },
    });
    setShowPollModal(false);
    setPollQuestion('');
  };

  const handleStartCall = (kind: 'voice' | 'video' = 'voice') => {
    soundManager.playPhoneRing();
    setCallKind(kind);
    setIsCalling(true);
    setCallConnected(false);
    setCallError('');
    setCallPhase('ringing');
    setMicMuted(false);
    setCamOff(false);
    setSpeakerOn(true);
    setShowCallMenu(false);

    setTimeout(() => setCallPhase((p) => (p === 'ringing' ? 'connecting' : p)), 1200);

    setTimeout(() => {
      // 30% CHANCE call connects!
      if (Math.random() < 0.3) {
        soundManager.playBeep(1200, 0.1);
        setCallConnected(true);
        setCallPhase('active');
      } else {
        soundManager.playBeep(300, 0.3);
        setCallPhase('failed');
        setCallError('Абонент занят / Линия недоступна');
        setTimeout(() => {
          setIsCalling(false);
          setCallError('');
        }, 2200);
      }
    }, 2400);
  };

  const endCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    setCallError('');
    setShowCallMenu(false);
  };

  const handlePlayAudioMessage = (msgId: string) => {
    setPlayingMsgId(msgId);
    soundManager.playRandomOverlappingSounds();
    setTimeout(() => {
      setPlayingMsgId(null);
    }, 3000);
  };

  const handleInsertFormat = (tag: string) => {
    if (tag === 'bold') setInputText((prev) => prev + '**жирный** ');
    if (tag === 'italic') setInputText((prev) => prev + '*курсив* ');
    if (tag === 'code') setInputText((prev) => prev + '`код` ');
  };

  const handleUseSticker = (stk: string) => {
    soundManager.playBeep(800, 0.1);
    onSendMessage(chat.id, { text: `Стикер: ${stk}`, sender: 'user', type: 'sticker', stickerUrl: stk });
    setShowStickers(false);
    setRecentStickers((prev) => Array.from(new Set([stk, ...prev])).slice(0, 8));
  };

  const handleDeleteWithLog = (msg: MessageItem) => {
    setDeletedLog((prev) => [msg, ...prev]);
    onDeleteMessage(chat.id, msg.id);
  };

  const pinnedMessage = chat.messages.find((m) => m.id === chat.pinnedMessageId);

  // Render message text with simple markdown formatting
  const renderFormattedText = (text: string) => {
    let formatted = text;
    return <span className="leading-relaxed whitespace-pre-wrap">{formatted}</span>;
  };

  return (
    <div className="flex-1 flex flex-col h-full text-white relative font-sans text-xs min-h-0 overflow-hidden bg-[#0b0d13]">
      {/* Critical System Error Modal in Call */}
      {showSystemErrorModal && (
        <div className="fixed inset-0 bg-blue-900 z-50 flex flex-col items-center justify-center p-6 text-center text-white font-mono animate-in fade-in duration-200">
          <ShieldAlert className="w-24 h-24 text-amber-400 mb-4 animate-bounce" />
          <h1 className="text-3xl font-black mb-4">CRITICAL SYSTEM ERROR 0x000000FF</h1>
          <div className="bg-slate-950 border-2 border-red-500 p-4 max-w-md text-left text-red-300 text-xs font-mono space-y-2 mb-6">
            <p>*** STOP: 0x000000FA (0x00000004, 0x00000000, 0x00000000)</p>
            <p>SCREEN_SHARE_SECURITY_VIOLATION: Прямая трансляция экрана заблокирована антивирусом.</p>
            <p>Память системы дамплена на диск (100%).</p>
          </div>
          <button
            onClick={() => setShowSystemErrorModal(false)}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 font-black uppercase text-xs cursor-pointer shadow-lg"
          >
            Закрыть ошибку
          </button>
        </div>
      )}

      {/* Call Screen Overlay */}
      {isCalling && (
        <div
          className="fixed inset-0 z-50 flex flex-col text-white overflow-hidden select-none"
          style={{
            background:
              callKind === 'video'
                ? 'radial-gradient(900px 600px at 50% 20%, #1d2552, #070913 70%)'
                : 'radial-gradient(900px 600px at 50% 10%, #2a2f6b, #0b0d13 70%)',
          }}
        >
          {/* Уведомления поверх экрана: не сдвигают интерфейс */}
          {(showInCallPopup || callError) && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-sm pointer-events-none">
              <div
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold text-center shadow-2xl backdrop-blur-xl border ${
                  callError ? 'bg-red-500/25 border-red-400/40 text-red-100' : 'bg-white/15 border-white/20 text-white'
                }`}
              >
                {callError ? `⚠️ ${callError}` : showInCallPopup}
              </div>
            </div>
          )}

          {/* Видео: «картинка» собеседника */}
          {callKind === 'video' && callConnected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 opacity-60" style={{ background: 'conic-gradient(from 0deg at 50% 50%, #1e3a8a, #6d28d9, #0e7490, #1e3a8a)', filter: 'blur(80px)' }} />
              <div className="relative text-[10rem] drop-shadow-2xl animate-pulse">{chat.avatar}</div>
            </div>
          )}

          {/* Верх: имя и статус */}
          <div className="relative z-10 flex flex-col items-center pt-14 px-6 text-center">
            <div className="text-[11px] uppercase tracking-widest text-white/60 mb-1">
              {callKind === 'video' ? 'Видеозвонок' : 'Голосовой звонок'}
            </div>
            <h3 className="text-2xl font-bold">{chat.name}</h3>
            <p className="text-sm text-white/75 mt-1 tabular-nums">
              {callPhase === 'ringing' && 'Вызов…'}
              {callPhase === 'connecting' && 'Соединение…'}
              {callPhase === 'failed' && 'Не удалось соединиться'}
              {callPhase === 'active' &&
                `${String(Math.floor(callTime / 60)).padStart(2, '0')}:${String(callTime % 60).padStart(2, '0')}`}
            </p>
          </div>

          {/* Центр: аватар с волнами (голос / ожидание) */}
          {(callKind === 'voice' || !callConnected) && (
            <div className="relative z-10 flex-1 flex items-center justify-center">
              <div className="relative">
                {callPhase !== 'failed' && (
                  <>
                    <span className="absolute -inset-6 rounded-full border border-white/15 animate-ping" />
                    <span className="absolute -inset-12 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-7xl shadow-2xl">
                  {chat.avatar}
                </div>
              </div>
            </div>
          )}
          {callKind === 'video' && callConnected && <div className="flex-1" />}

          {/* Видео: своя камера (PIP) */}
          {callKind === 'video' && (
            <div className="absolute top-14 right-4 z-20 w-24 h-32 rounded-2xl overflow-hidden border border-white/25 bg-black/60 backdrop-blur-md shadow-2xl flex items-center justify-center">
              {camOff ? (
                <div className="flex flex-col items-center text-[10px] text-white/60 gap-1">
                  <VideoOff className="w-5 h-5" />
                  Камера выкл.
                </div>
              ) : (
                <div className={`text-5xl transition-transform ${frontCam ? '' : '-scale-x-100'}`}>🙂</div>
              )}
            </div>
          )}

          {/* Меню функций звонка */}
          <div className="relative z-10 px-4 mb-3">
          {callConnected && showCallMenu && (
            <div className="w-full max-w-md mx-auto max-h-[42vh] overflow-y-auto rounded-3xl bg-black/55 backdrop-blur-xl border border-white/10 p-3 grid grid-cols-2 gap-2 text-xs [&_button]:rounded-2xl [&_button]:py-2.5">
              <button
                onClick={() => setShowSystemErrorModal(true)}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Демка экрана</span>
              </button>

              <button
                onClick={() => {
                  setShowInCallPopup('Камера переключена на фронтальный модуль...');
                  setTimeout(() => setShowInCallPopup(null), 2000);
                }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Сменить камеру</span>
              </button>

              <button
                onClick={() => setNoiseSuppressionActive(!noiseSuppressionActive)}
                className={`p-2.5 border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  noiseSuppressionActive ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Шумоподавление ({noiseSuppressionActive ? 'ВКЛ' : 'ВЫКЛ'})</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playBeep(1200, 0.1);
                  const randomChat = allChats[Math.floor(Math.random() * allChats.length)];
                  setShowInCallPopup(`Пользователь ${randomChat.name} подключился к звонку!`);
                  setTimeout(() => setShowInCallPopup(null), 2500);
                }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Пригласить по ссылке</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playExplosion();
                  onSendMessage(chat.id, { text: '💣 В собеседника запущена ядерная бомба!', sender: 'user' });
                  setShowInCallPopup('💣 БОМБА УСПЕШНО ЗАПУЩЕНА!');
                  setTimeout(() => setShowInCallPopup(null), 2000);
                }}
                className="p-2.5 bg-red-950/80 border border-red-600 text-red-200 font-black flex items-center justify-center gap-1.5 cursor-pointer col-span-2"
              >
                <Bomb className="w-4 h-4 text-red-500 animate-bounce" />
                <span>Запустить бомбу в собеседника</span>
              </button>

              <div className="col-span-2 grid grid-cols-3 gap-1 pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    onSendMessage(chat.id, { text: '👮 Вызвана полиция на адрес собеседника!', sender: 'user' });
                    setShowInCallPopup('👮 Наряд выехал!');
                    setTimeout(() => setShowInCallPopup(null), 1500);
                  }}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-blue-300 font-bold text-[10px] cursor-pointer"
                >
                  👮 Полиция
                </button>
                <button
                  onClick={() => {
                    onSendMessage(chat.id, { text: '🚒 Вызвана пожарная служба!', sender: 'user' });
                    setShowInCallPopup('🚒 Пожарные выехали!');
                    setTimeout(() => setShowInCallPopup(null), 1500);
                  }}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-red-300 font-bold text-[10px] cursor-pointer"
                >
                  🚒 Пожарная
                </button>
                <button
                  onClick={() => {
                    onSendMessage(chat.id, { text: '🚑 Вызвана скорая помощь!', sender: 'user' });
                    setShowInCallPopup('🚑 Скорая выехала!');
                    setTimeout(() => setShowInCallPopup(null), 1500);
                  }}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-emerald-300 font-bold text-[10px] cursor-pointer"
                >
                  🚑 Скорая
                </button>
              </div>

              <button
                onClick={() => {
                  const insult = FUNNY_INSULTS[Math.floor(Math.random() * FUNNY_INSULTS.length)];
                  onSendMessage(chat.id, { text: insult, sender: 'user' });
                  setShowInCallPopup(`🗣️ Обозвали: "${insult}"`);
                  setTimeout(() => setShowInCallPopup(null), 1500);
                }}
                className="p-2 bg-amber-950 border border-amber-600 text-amber-200 font-black uppercase cursor-pointer col-span-2"
              >
                Обозвать собеседника 🗣️
              </button>
            </div>
          )}

          </div>

          {/* Нижняя панель управления */}
          <div className="relative z-10 pb-10 pt-2 px-6">
            <div className="mx-auto max-w-sm flex items-center justify-between gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${micMuted ? 'bg-white text-slate-900' : 'bg-white/15 text-white'}`}
                title="Микрофон"
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {callKind === 'video' ? (
                <>
                  <button
                    onClick={() => setCamOff(!camOff)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${camOff ? 'bg-white text-slate-900' : 'bg-white/15 text-white'}`}
                    title="Камера"
                  >
                    {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setFrontCam(!frontCam)}
                    className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center cursor-pointer"
                    title="Сменить камеру"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSpeakerOn(!speakerOn)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${speakerOn ? 'bg-white text-slate-900' : 'bg-white/15 text-white'}`}
                  title="Громкая связь"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}

              {callConnected && (
                <button
                  onClick={() => setShowCallMenu(!showCallMenu)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${showCallMenu ? 'bg-white text-slate-900' : 'bg-white/15 text-white'}`}
                  title="Ещё"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(239,68,68,0.5)] active:scale-90 transition-all"
                title="Завершить"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showParticipantProfile && (
        <ParticipantProfile
          name={chat.name}
          avatar={chat.avatar}
          status={chat.status}
          onClose={() => setShowParticipantProfile(false)}
        />
      )}

      {/* Chat Header (Fixed & Sticky Top) */}
      <div className="bg-[#0b0d13]/70 backdrop-blur-2xl border-b border-white/[0.06] px-3 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {/* Explicit Back / Exit Arrow Button */}
          <button
            onClick={onBack}
            title="Назад к списку чатов"
            className="p-2 bg-white/[0.07] hover:bg-white/[0.14] text-white font-bold rounded-full cursor-pointer flex items-center gap-1.5 shrink-0 border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs uppercase font-extrabold hidden sm:inline">Выйти</span>
          </button>

          <div
            onClick={() => window.open('https://yandex.ru/images/', '_blank')}
            title="Открыть Яндекс Картинки"
            className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#ff8fd8] via-[#b18cff] to-[#8f9bff] flex items-center justify-center text-xl font-bold shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="w-full h-full bg-[#171b27] rounded-full flex items-center justify-center">
              {chat.avatar}
            </span>
          </div>
          <div className="truncate cursor-pointer" onClick={() => { if (!chat.isGroup) setShowParticipantProfile(true); }}>
            <h3 className="font-semibold text-sm sm:text-[15px] text-white flex items-center gap-1.5 truncate">
              {chat.name}
              {chat.isFriend && <span className="text-[9px] bg-[#252b63] text-[#8f9bff] border border-[#6f7df0]/50 px-1.5 py-0.5 rounded-full uppercase">Друг</span>}
            </h3>
            <span className="text-[11px] text-[#34d399] font-medium block truncate">
              {chat.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-300 shrink-0">
          <button
            onClick={() => handleStartCall('voice')}
            title="Голосовой звонок"
            className="p-2 rounded-full hover:text-[#8f9bff] hover:bg-white/10 cursor-pointer transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStartCall('video')}
            title="Видеозвонок"
            className="p-2 rounded-full hover:text-[#8f9bff] hover:bg-white/10 cursor-pointer transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowWallpaperMenu(!showWallpaperMenu)}
            title="Обои чата"
            className="p-2 rounded-full hover:text-[#8f9bff] hover:bg-white/10 cursor-pointer transition-colors"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeletedLogModal(true)}
            title="Удалённые сообщения"
            className="p-2 rounded-full hover:text-red-400 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <History className="w-4 h-4" />
          </button>
          
          {/* 3-Dots Options Menu Trigger */}
          <div className="relative z-50">
            <button
              onClick={() => {
                triggerHaptic('tap');
                soundManager.playBeep(900, 0.05);
                setShowOptionsMenu(!showOptionsMenu);
              }}
              title="Настройки чата"
              className="p-2 rounded-full hover:text-[#8f9bff] hover:bg-white/10 cursor-pointer transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-[#8f9bff]" />
            </button>

            {/* Dropdown Options Window - Layered higher than title bar (z-50) */}
            {showOptionsMenu && (
              <div className="absolute right-0 top-10 w-52 bg-[#0f121a]/95 backdrop-blur-md border border-[#8f9bff]/60 rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowWallpaperMenu(!showWallpaperMenu);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-white hover:bg-[#8f9bff]/20 hover:text-[#8f9bff] rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Palette className="w-4 h-4 text-[#8f9bff]" />
                  <span>Изменить обои</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowReportModal(true);
                    setReportSubmitted(false);
                    soundManager.playBeep(600, 0.08);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-950/60 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Пожаловаться</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    onBlockUser(chat.name);
                    soundManager.playBeep(400, 0.1);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/60 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Ban className="w-4 h-4 text-red-500" />
                  <span>Заблокировать</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowDeletedLogModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-[#171b27] rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>История сообщений</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallpaper Picker Menu */}
      {showWallpaperMenu && (
        <div className="bg-[#12151e] border-b border-[#222840] p-3 grid grid-cols-3 gap-2 shrink-0 z-20">
          {WallpaperOptions.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                triggerHaptic('tap');
                soundManager.playBeep(1000, 0.05);
                setActiveWallpaper(w.id);
                setShowWallpaperMenu(false);
              }}
              className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all active:scale-95 ${
                activeWallpaper === w.id
                  ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                  : 'bg-[#171b27] text-gray-300 border-[#222840] hover:border-[#8f9bff]/40'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
      )}

      {/* Pinned Message Banner */}
      {pinnedMessage && (
        <div className="bg-slate-900 border-b border-amber-500/40 px-3 py-1.5 flex items-center justify-between text-amber-300 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-[11px] truncate">
              Закреплено: {pinnedMessage.text}
            </span>
          </div>
          <button
            onClick={() => onPinMessage(chat.id, undefined)}
            className="text-slate-400 hover:text-white p-1 font-bold ml-2 shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Thread (Takes rest of height, scrolls internally!) */}
      {isLoadingChat ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-400 font-extrabold text-xs font-mono uppercase tracking-widest animate-pulse">
            Загрузка чата...
          </p>
        </div>
      ) : (
        <div ref={messagesContainerRef} className="relative flex-1 overflow-y-auto min-h-0 p-3">
          <ChatBackground wallpaper={activeWallpaper} />
          <div className="relative z-10 space-y-2.5">
            {chat.messages.map((msg) => (
            <div
              key={msg.id}
              onDoubleClick={() => onToggleReaction(chat.id, msg.id, '❤️')}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} group`}
            >
              <div
                onTouchStart={(e) => {
                  touchStartXRef.current = e.touches[0].clientX;
                  longPressTimerRef.current = setTimeout(() => {
                    soundManager.playBeep(1200, 0.08);
                    setSelectedMsgForActions(msg);
                  }, 400);
                }}
                onTouchMove={(e) => {
                  if (touchStartXRef.current !== null) {
                    const deltaX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
                    if (deltaX > 15 && longPressTimerRef.current) {
                      clearTimeout(longPressTimerRef.current);
                      longPressTimerRef.current = null;
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  if (longPressTimerRef.current) {
                    clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                  if (touchStartXRef.current !== null) {
                    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
                    if (deltaX > 50) {
                      soundManager.playBeep(900, 0.05);
                      setReplyingTo(msg);
                    }
                    touchStartXRef.current = null;
                  }
                }}
                onMouseDown={() => {
                  longPressTimerRef.current = setTimeout(() => {
                    soundManager.playBeep(1200, 0.08);
                    setSelectedMsgForActions(msg);
                  }, 400);
                }}
                onMouseUp={() => {
                  if (longPressTimerRef.current) {
                    clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedMsgForActions(msg);
                }}
                className={`max-w-[82%] px-3.5 py-2.5 rounded-[1.4rem] text-[13px] leading-relaxed font-medium shadow-lg border border-transparent cursor-pointer select-none transition-transform active:scale-[0.98] ${
                  msg.isBroadcast
                    ? 'bg-red-950 border-2 border-red-500 text-red-200 w-full text-center font-bold'
                    : msg.sender === 'user'
                    ? 'bg-gradient-to-br from-[#8f9bff] to-[#a78bfa] text-[#0b0d13] rounded-br-md shadow-[0_8px_24px_rgba(143,155,255,0.25)]'
                    : 'bg-white/[0.08] backdrop-blur-md border-white/[0.06] text-white rounded-bl-md'
                }`}
              >
                {/* Reply / Quote Header */}
                {msg.replyToText && (
                  <div className="bg-black/40 border-l-2 border-cyan-400 p-1 mb-1.5 text-[10px] text-slate-300">
                    <span className="font-bold text-cyan-300 block">Ответ на:</span>
                    <p className="truncate italic">{msg.replyToText}</p>
                  </div>
                )}
                {msg.quotedText && (
                  <div className="bg-black/40 border-l-2 border-amber-400 p-1 mb-1.5 text-[10px] text-amber-200">
                    <span className="font-bold text-amber-300 block">Цитата:</span>
                    <p className="italic">"{msg.quotedText}"</p>
                  </div>
                )}

                {/* Special Message Types Rendering */}
                {msg.type === 'voice' ? (
                  <div className="flex items-center gap-2 p-1">
                    <button
                      onClick={() => handlePlayAudioMessage(msg.id)}
                      className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-none font-bold cursor-pointer"
                    >
                      {playingMsgId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <span className="font-bold text-cyan-300 block">Голосовое сообщение</span>
                      <span className="text-[10px] text-slate-400">{msg.duration || '0:09'}</span>
                    </div>
                  </div>
                ) : msg.type === 'video_circle' ? (
                  <div className="flex flex-col items-center gap-1.5 p-1 bg-slate-950 border border-slate-800">
                    <div className="w-28 h-28 bg-black border-2 border-cyan-400 flex flex-col items-center justify-center p-1 text-center relative">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        очистите камеру
                      </span>
                      <button
                        onClick={() => handlePlayAudioMessage(msg.id)}
                        className="mt-1 p-1.5 bg-cyan-500 text-slate-950 rounded-none cursor-pointer"
                      >
                        {playingMsgId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold">Видеокружок</span>
                  </div>
                ) : msg.type === 'location' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>Геолокация: {msg.locationName}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">Координаты: {msg.locationCoords}</p>
                  </div>
                ) : msg.type === 'photo' || msg.type === 'video' ? (
                  <div className="space-y-1.5">
                    {msg.type === 'photo' && msg.mediaUrl ? (
                      <div className="max-w-[280px] rounded-xl overflow-hidden border-2 border-emerald-500/40 shadow-lg bg-black">
                        <img
                          src={msg.mediaUrl}
                          alt={msg.caption || 'Фото'}
                          className="w-full max-h-72 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => setFullPhotoModal(msg.mediaUrl || null)}
                        />
                        <div className="p-1.5 bg-[#10131d] border-t border-white/10 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserAvatar(msg.mediaUrl!);
                              soundManager.playRock();
                              triggerHaptic('success');
                              setActionToast('Фото установлено как ваш аватар!');
                              setTimeout(() => setActionToast(null), 2500);
                            }}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                          >
                            <span>👤</span> Сделать аватаром
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              saveChatPhoto(msg.mediaUrl!, msg.caption, msg.sender === 'user' ? 'Вы' : chat.name);
                              triggerHaptic('tap');
                              soundManager.playCoin();
                              setActionToast('Сохранено в фото-галерею чата!');
                              setTimeout(() => setActionToast(null), 2000);
                            }}
                            className="text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10 active:scale-95 transition-transform"
                          >
                            ⭐ В галерею
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-32 bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center p-2 text-center text-cyan-400 font-bold">
                        <Camera className="w-8 h-8 mb-1 animate-pulse" />
                        <span>{msg.mediaUrl || 'МЕДИАФАЙЛ'}</span>
                      </div>
                    )}
                    {msg.caption && (
                      <p className="text-xs text-white font-bold bg-black/40 p-1.5 rounded-lg border-l-2 border-[#8f9bff]">
                        Подпись: {msg.caption}
                      </p>
                    )}
                  </div>
                ) : msg.type === 'contact' ? (
                  <div className="p-2 bg-slate-950 border border-emerald-500/50 flex items-center gap-3">
                    <span className="text-2xl">{msg.contactData?.avatar || '🎴'}</span>
                    <div>
                      <div className="font-bold text-white text-xs">{msg.contactData?.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{msg.contactData?.phone}</div>
                    </div>
                  </div>
                ) : msg.type === 'poll' && msg.pollData ? (
                  <div className="p-2 bg-slate-950 border border-cyan-500/50 space-y-2">
                    <div className="font-extrabold text-cyan-300 text-xs">📊 {msg.pollData.question}</div>
                    <div className="space-y-1">
                      {msg.pollData.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            soundManager.playBeep(1000, 0.05);
                            opt.votes += 1;
                          }}
                          className="w-full p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-400 text-left text-[11px] font-bold text-slate-200 flex justify-between cursor-pointer"
                        >
                          <span>{opt.text}</span>
                          <span className="text-cyan-400 font-mono">{opt.votes} гол.</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : msg.type === 'sticker' ? (
                  <div className="text-4xl p-1">{msg.stickerUrl || msg.text}</div>
                ) : (
                  renderFormattedText(msg.text)
                )}

                {msg.isEdited && (
                  <span className="text-[9px] text-cyan-400 font-bold block mt-1">(изменено)</span>
                )}

                {/* Reactions list */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 border-t border-slate-800 pt-1">
                    {Object.entries(msg.reactions).map(([emo, cnt]) => (
                      <span
                        key={emo}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (emo === '🚨') soundManager.playSiren();
                          onToggleReaction(chat.id, msg.id, emo);
                        }}
                        className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded-none text-[10px] cursor-pointer hover:border-cyan-400 flex items-center gap-1"
                      >
                        <span>{emo}</span>
                        <span className="font-bold text-cyan-400">{cnt}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Timestamp (Hold for actions) */}
                <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 border-t border-slate-800/60 pt-1">
                  <span className="font-mono">{msg.time}</span>
                  <span className="text-[8px] text-slate-600 uppercase font-bold tracking-wider">
                    Удерживайте для действий
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Fixed Sticky Bottom Control & Input Container */}
      <div className="shrink-0 sticky bottom-0 z-30 bg-slate-900 border-t border-slate-800 flex flex-col w-full">
        {/* Mention Auto-Complete Menu */}
        {showMentionMenu && (
          <div className="bg-slate-900 border-b border-slate-800 p-2 grid grid-cols-4 gap-1 shrink-0">
            {MENTION_SUGGESTIONS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setInputText(inputText + m.slice(1) + ' ');
                  setShowMentionMenu(false);
                }}
                className="p-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-800 text-center cursor-pointer truncate text-[10px]"
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Reply Banner */}
        {replyingTo && (
          <div className="bg-slate-900 border-b border-cyan-500/40 p-2 flex items-center justify-between text-cyan-300 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Reply className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-bold text-[10px] truncate">Ответ на: {replyingTo.text}</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-slate-400 hover:text-white p-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quote Banner */}
        {quotingMsg && (
          <div className="bg-slate-900 border-b border-amber-500/40 p-2 flex items-center justify-between text-amber-300 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-[10px] truncate">Цитата: "{quotingMsg.text}"</span>
            </div>
            <button
              onClick={() => setQuotingMsg(null)}
              className="text-slate-400 hover:text-white p-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Editing Banner */}
        {editingMsg && (
          <div className="bg-slate-900 border-b border-amber-500/40 p-2 flex items-center justify-between text-amber-300 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Edit2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-[10px] truncate">Редактирование...</span>
            </div>
            <button
              onClick={() => {
                setEditingMsg(null);
                setInputText('');
              }}
              className="text-slate-400 hover:text-white p-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Schedule Timer selector */}
        {showScheduleMenu && (
          <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Задержка отправки:</span>
            <div className="flex gap-1">
              {[0, 5, 10, 30].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScheduleDelay(s);
                    setShowScheduleMenu(false);
                  }}
                  className={`px-2 py-1 text-[10px] font-bold border cursor-pointer ${
                    scheduleDelay === s ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  {s === 0 ? 'Сразу' : `${s} сек`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Formatting Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-2 py-1 flex items-center gap-2 shrink-0 text-[10px] text-slate-400">
          <span className="font-bold text-slate-500">Форматирование:</span>
          <button
            onClick={() => handleInsertFormat('bold')}
            className="p-1 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer font-black"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleInsertFormat('italic')}
            className="p-1 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleInsertFormat('code')}
            className="p-1 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer font-mono"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stickers Panel */}
        {showStickers && (
          <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex flex-col gap-2 shrink-0 animate-in slide-in-from-bottom-5 duration-200">
            <div className="text-[9px] font-bold text-slate-400 uppercase">Недавние стикеры:</div>
            <div className="flex gap-2">
              {recentStickers.map((stk) => (
                <button
                  key={stk}
                  onClick={() => handleUseSticker(stk)}
                  className="text-xl p-1.5 hover:bg-slate-800 rounded-none cursor-pointer"
                >
                  {stk}
                </button>
              ))}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase border-t border-slate-800 pt-1">Все стикеры:</div>
            <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto">
              {['🤡', '💩', '🗿', '🔥', '💥', '🚀', '🥟', '🚚', '💣', '🐱', '🍕', '👑', '👾', '🥑', '🛸', '🎯', '🦄', '🎉'].map((stk) => (
                <button
                  key={stk}
                  onClick={() => handleUseSticker(stk)}
                  className="text-xl p-1 hover:bg-slate-800 rounded-none cursor-pointer text-center"
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice recording bar */}
        {isRecordingVoice && (
          <div className="bg-slate-900 border-b border-red-500 p-2.5 flex items-center justify-between text-red-400 animate-pulse font-bold shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span>Запись: 0:0{recordingTime}</span>
            </div>
            <button
              onClick={handleSendVoice}
              className="px-3 py-1 bg-red-600 text-white font-black rounded-none uppercase cursor-pointer text-xs"
            >
              Отправить
            </button>
          </div>
        )}

        {/* Input Bar (ALWAYS Fixed at Bottom!) */}
        <div className="p-2 flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowScheduleMenu(!showScheduleMenu)}
            title="Отложенное сообщение"
            className={`p-1.5 rounded-none cursor-pointer ${
              scheduleDelay > 0 ? 'text-amber-400 bg-amber-950/60' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMediaType('photo');
              setShowMediaModal(true);
            }}
            title="Фото с подписью"
            className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPollModal(true)}
            title="Создать опрос"
            className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <PieChart className="w-4 h-4" />
          </button>
          <button
            onClick={handleSendContact}
            title="Отправить контакт"
            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Написать сообщение..."
            className="flex-1 min-w-0 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2.5 text-[13px] text-white placeholder-gray-500 outline-none focus:border-[#8f9bff]/60 focus:bg-white/[0.09]"
          />

          {inputText.trim() || editingMsg ? (
            <button
              onClick={handleSend}
              className="p-2.5 bg-gradient-to-br from-[#8f9bff] to-[#b18cff] text-[#0b0d13] rounded-full cursor-pointer font-bold transition-all active:scale-90 shrink-0 shadow-[0_6px_18px_rgba(143,155,255,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecordingVoice(true)}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer transition-all active:scale-90 shrink-0"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Media Attachment Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e1119] border border-[#8f9bff]/40 p-5 rounded-2xl space-y-3 font-sans shadow-[0_0_30px_rgba(143,155,255,0.2)]">
            <h3 className="font-extrabold text-[#8f9bff] uppercase text-center text-sm">Отправить фотографию</h3>
            
            {/* User Real Photo File Upload & Preview */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-mono block">Загрузите фото с устройства:</label>
              <label className="w-full py-3 px-4 bg-[#141824] hover:bg-[#1c2030] border border-[#222840] hover:border-[#8f9bff] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-white font-bold">
                <Image className="w-4 h-4 text-[#8f9bff]" />
                <span>{selectedPhotoUrl ? 'Заменить выбранное фото' : 'Выбрать файл фотографии'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (typeof ev.target?.result === 'string') {
                          setSelectedPhotoUrl(ev.target.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {/* Or Pick from Chat Photos */}
              {savedChatPhotos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-[#8f9bff] font-bold block">
                      💬 Выбрать из ранее отправленных в чате:
                    </label>
                    <span className="text-[9px] text-zinc-400 font-mono">{savedChatPhotos.length} шт.</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 max-h-20 scrollbar-thin">
                    {savedChatPhotos.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPhotoUrl(p.url);
                          triggerHaptic('tap');
                        }}
                        className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedPhotoUrl === p.url
                            ? 'border-[#8f9bff] scale-105 ring-2 ring-[#8f9bff]'
                            : 'border-zinc-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt="Из чата" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedPhotoUrl && (
                <div className="relative aspect-video max-h-36 rounded-xl overflow-hidden border border-[#8f9bff]/60 mx-auto">
                  <img src={selectedPhotoUrl} alt="Предпросмотр" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/75 rounded-full text-white hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={mediaCaption}
              onChange={(e) => setMediaCaption(e.target.value)}
              placeholder="Добавьте подпись к файлу..."
              className="w-full bg-[#141824] border border-[#222840] p-2.5 rounded-xl text-xs text-white outline-none focus:border-[#8f9bff]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setShowMediaModal(false);
                }}
                className="flex-1 py-2.5 bg-[#171b27] border border-[#222840] text-gray-300 font-bold uppercase rounded-xl text-xs hover:bg-[#1e2232]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  handleSendMedia();
                }}
                className="flex-1 py-2.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold uppercase rounded-xl text-xs shadow-[0_0_12px_rgba(143,155,255,0.3)]"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Feedback Toast */}
      {actionToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-[#8f9bff] text-black font-black text-xs px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(143,155,255,0.5)] z-[85] animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <span>✨</span>
          <span>{actionToast}</span>
        </div>
      )}

      {/* Fullscreen Photo Viewer */}
      {fullPhotoModal && (
        <div
          className="fixed inset-0 bg-black/95 z-[95] flex flex-col items-center justify-center p-4 backdrop-blur-md cursor-pointer select-none"
          onClick={() => setFullPhotoModal(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={fullPhotoModal}
              alt="Просмотр"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border-2 border-[#8f9bff]/40 shadow-2xl"
            />
            <button
              onClick={() => setFullPhotoModal(null)}
              className="absolute -top-3 -right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <span className="text-zinc-400 text-xs mt-3 font-mono">Нажмите в любое место, чтобы закрыть</span>
        </div>
      )}

      {/* Poll Creation Modal */}
      {showPollModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e1119] border border-[#8f9bff]/40 p-5 rounded-2xl space-y-3 font-sans shadow-[0_0_30px_rgba(143,155,255,0.2)]">
            <h3 className="font-extrabold text-[#8f9bff] uppercase text-center text-sm">Создать опрос</h3>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Вопрос опроса..."
              className="w-full bg-[#141824] border border-[#222840] p-2.5 rounded-xl text-xs text-white outline-none focus:border-[#8f9bff]"
            />
            <div className="space-y-1.5">
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...pollOptions];
                    newOpts[idx] = e.target.value;
                    setPollOptions(newOpts);
                  }}
                  placeholder={`Вариант ${idx + 1}`}
                  className="w-full bg-[#141824] border border-[#222840] p-2 rounded-xl text-xs text-white outline-none focus:border-[#8f9bff]"
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setShowPollModal(false);
                }}
                className="flex-1 py-2.5 bg-[#171b27] border border-[#222840] text-gray-300 font-bold uppercase rounded-xl text-xs hover:bg-[#1e2232]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  handleCreatePoll();
                }}
                className="flex-1 py-2.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold uppercase rounded-xl text-xs shadow-[0_0_12px_rgba(143,155,255,0.3)]"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {forwardingMsg && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e1119] border border-[#8f9bff]/40 p-5 rounded-2xl space-y-3 font-sans shadow-[0_0_30px_rgba(143,155,255,0.2)]">
            <h3 className="font-extrabold text-[#8f9bff] uppercase text-center text-sm">Переслать сообщение</h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {allChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    triggerHaptic('tap');
                    onForwardMessage(c.id, `(Переслано): ${forwardingMsg.text}`);
                    setForwardingMsg(null);
                  }}
                  className="w-full p-2.5 bg-[#141824] border border-[#222840] hover:border-[#8f9bff] rounded-xl flex items-center gap-3 text-white text-left cursor-pointer transition-colors"
                >
                  <span className="text-xl">{c.avatar}</span>
                  <span className="font-bold truncate text-xs">{c.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                triggerHaptic('tap');
                setForwardingMsg(null);
              }}
              className="w-full py-2.5 bg-[#171b27] border border-[#222840] text-gray-300 font-bold uppercase rounded-xl text-xs hover:bg-[#1e2232]"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Deleted Messages Log Modal */}
      {showDeletedLogModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1119] border border-red-500/50 p-5 rounded-2xl space-y-3 font-sans shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#222840] pb-2">
              <h3 className="font-extrabold text-red-400 uppercase text-xs">Список удалённых сообщений</h3>
              <button onClick={() => setShowDeletedLogModal(false)} className="text-white font-bold p-1 hover:text-red-400">✕</button>
            </div>
            {deletedLog.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">Нет удалённых сообщений</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {deletedLog.map((m) => (
                  <div key={m.id} className="p-2.5 bg-[#141824] border border-red-900/60 rounded-xl text-red-300 text-xs">
                    <span className="font-bold block text-[10px] text-red-400">{m.time}:</span>
                    <p className="line-through">{m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Long-Press Message Actions Modal */}
      {selectedMsgForActions && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0e1119] border border-[#8f9bff]/40 p-5 rounded-2xl space-y-3 shadow-[0_0_30px_rgba(143,155,255,0.2)] animate-in zoom-in-95 duration-150 font-sans">
            <div className="flex justify-between items-center border-b border-[#222840] pb-2">
              <h3 className="font-extrabold text-[#8f9bff] text-xs uppercase">Действия с сообщением</h3>
              <button onClick={() => setSelectedMsgForActions(null)} className="text-gray-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <p className="text-[11px] text-gray-300 bg-[#141824] p-2.5 rounded-xl border border-[#222840] line-clamp-2 italic">
              "{selectedMsgForActions.text}"
            </p>

            {/* Reactions Bar */}
            <div className="flex justify-between p-2 bg-[#141824] border border-[#222840] rounded-xl">
              {['👍', '❤️', '🚨', '🤡', '💩', '🔥'].map((emo) => (
                <button
                  key={emo}
                  onClick={() => {
                    triggerHaptic('tap');
                    if (emo === '🚨') soundManager.playSiren();
                    onToggleReaction(chat.id, selectedMsgForActions.id, emo);
                    setSelectedMsgForActions(null);
                  }}
                  className="text-xl hover:scale-125 transition-transform cursor-pointer"
                >
                  {emo}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-1.5 text-xs font-bold">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setReplyingTo(selectedMsgForActions);
                  setSelectedMsgForActions(null);
                }}
                className="w-full p-2.5 bg-[#141824] hover:bg-[#1c2030] text-gray-200 flex items-center gap-2 border border-[#222840] rounded-xl text-left cursor-pointer transition-colors"
              >
                <Reply className="w-4 h-4 text-[#8f9bff]" /> Ответить
              </button>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setQuotingMsg(selectedMsgForActions);
                  setSelectedMsgForActions(null);
                }}
                className="w-full p-2.5 bg-[#141824] hover:bg-[#1c2030] text-amber-300 flex items-center gap-2 border border-[#222840] rounded-xl text-left cursor-pointer transition-colors"
              >
                <Quote className="w-4 h-4 text-amber-400" /> Цитировать
              </button>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setForwardingMsg(selectedMsgForActions);
                  setSelectedMsgForActions(null);
                }}
                className="w-full p-2.5 bg-[#141824] hover:bg-[#1c2030] text-gray-200 flex items-center gap-2 border border-[#222840] rounded-xl text-left cursor-pointer transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#8f9bff]" /> Переслать
              </button>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onPinMessage(chat.id, selectedMsgForActions.id);
                  setSelectedMsgForActions(null);
                }}
                className="w-full p-2.5 bg-[#141824] hover:bg-[#1c2030] text-amber-300 flex items-center gap-2 border border-[#222840] rounded-xl text-left cursor-pointer transition-colors"
              >
                <Pin className="w-4 h-4 text-amber-400" /> Закрепить
              </button>

              {selectedMsgForActions.sender !== 'user' && (
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    setShowReportModal(true);
                    setReportSubmitted(false);
                    setSelectedMsgForActions(null);
                  }}
                  className="w-full p-2.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 flex items-center gap-2 border border-amber-700 rounded-xl text-left cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Пожаловаться на сообщение
                </button>
              )}

              {selectedMsgForActions.sender === 'user' && (
                <>
                  <button
                    onClick={() => {
                      triggerHaptic('tap');
                      setEditingMsg(selectedMsgForActions);
                      setInputText(selectedMsgForActions.text);
                      setSelectedMsgForActions(null);
                    }}
                    className="w-full p-2.5 bg-[#141824] hover:bg-[#1c2030] text-gray-200 flex items-center gap-2 border border-[#222840] rounded-xl text-left cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#8f9bff]" /> Редактировать
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('tap');
                      handleDeleteWithLog(selectedMsgForActions);
                      setSelectedMsgForActions(null);
                    }}
                    className="w-full p-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 flex items-center gap-2 border border-red-800 rounded-xl text-left cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" /> Удалить
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report / Пожаловаться Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12151e] border-2 border-amber-500/80 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#262a3b] pb-3">
              <div className="flex items-center gap-2 font-black text-amber-400 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Пожаловаться</span>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#8f9bff]/20 border border-[#8f9bff] text-[#8f9bff] mx-auto flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-extrabold text-white text-sm">Жалоба отправлена</h4>
                <p className="text-xs text-gray-400">
                  Модераторы рассмотрят обращение в отношении пользователя <span className="text-[#8f9bff] font-bold">{chat.name}</span>.
                </p>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="mt-3 px-5 py-2 bg-[#8f9bff] text-black font-bold rounded-xl text-xs cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-gray-300">
                  Выберите причину жалобы на <span className="font-bold text-white">{chat.name}</span>:
                </p>
                <div className="space-y-1.5">
                  {['Спам и реклама', 'Оскорбления и агрессия', 'Мошенничество', 'Неприемлемый контент', 'Другое'].map((reason) => (
                    <label
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        reportReason === reason
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-[#171b27] border-[#262a3b] text-gray-300 hover:bg-[#1e2232]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        className="accent-amber-400"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <textarea
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    placeholder="Дополнительный комментарий (необязательно)..."
                    className="w-full h-16 bg-[#171b27] border border-[#333] rounded-xl p-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2 bg-[#1e2232] hover:bg-[#2a2a2a] text-gray-300 rounded-xl font-bold cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playBeep(900, 0.1);
                      setReportSubmitted(true);
                    }}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black cursor-pointer shadow-md"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
