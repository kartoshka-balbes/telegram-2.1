import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  QrCode,
  MoreVertical,
  X,
  Phone,
  Siren,
  Edit3,
  User,
  Music,
  Film,
  Disc,
  Clapperboard,
  Utensils,
  Palette,
  Calendar,
  Sparkles,
  Briefcase,
  BookOpen,
  Book,
  Share2,
  AlertTriangle,
  Check,
  Heart,
  FileText,
  Shield,
  Ban,
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';
import { getChatPhotos, ChatPhotoItem } from '../utils/chatPhotos';
import { ProfileExtras, ProfileStats } from './ProfileExtras';

const isImageAvatar = (av?: string) =>
  Boolean(av && (av.startsWith('data:') || av.startsWith('http') || av.startsWith('blob:') || av.startsWith('/')));


interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  blockedUsers?: string[];
  onUnblockUser?: (name: string) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  blockedUsers = [],
  onUnblockUser,
}) => {
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals for 4 buttons
  const [showEditAvatarModal, setShowEditAvatarModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  // Modal for phone change
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState(userProfile.phoneNumber || '');
  const [phoneCodeStep, setPhoneCodeStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Editing state for info fields
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState('');

  // Temporary local values
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar || '🐵');
  const [tempName, setTempName] = useState(userProfile.name || '');
  const [tempStatus, setTempStatus] = useState(userProfile.status || '');

  // About me (limited to 8000 chars)
  const [aboutText, setAboutText] = useState(userProfile.about || '');

  // User chat-shared photos pool
  const [chatPhotos, setChatPhotos] = useState<ChatPhotoItem[]>([]);

  useEffect(() => {
    setChatPhotos(getChatPhotos());
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ChatPhotoItem[]>;
      if (customEvent.detail) {
        setChatPhotos(customEvent.detail);
      } else {
        setChatPhotos(getChatPhotos());
      }
    };
    window.addEventListener('chat_photos_updated', handler);
    return () => window.removeEventListener('chat_photos_updated', handler);
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSiren = () => {
    soundManager.playSiren();
    setSirenActive(true);
    triggerHaptic('heavy');
    setTimeout(() => setSirenActive(false), 3000);
  };

  const handleOpenEditField = (key: string, currentValue: string) => {
    soundManager.playBeep(900, 0.05);
    setEditingField(key);
    setFieldValue(currentValue || '');
  };

  const handleSaveField = () => {
    if (!editingField) return;
    soundManager.playBeep(1200, 0.08);
    onUpdateProfile({
      ...userProfile,
      [editingField]: fieldValue,
    });
    setEditingField(null);
    showToast('Информация обновлена');
  };

  const handleSaveAbout = () => {
    soundManager.playBeep(1200, 0.08);
    onUpdateProfile({
      ...userProfile,
      about: aboutText.slice(0, 8000),
    });
    showToast('Раздел "О себе" сохранен');
  };

  const accentColor = userProfile.profileColor || '#8f9bff';

  const avatarPresets = ['🐵', '🚀', '👽', '👑', '⚡', '🤖', '🦊', '🔥', '💎', '🦁', '🐺', '🐉'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-sans">
      {/* Background Dim */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Siren Flash Overlay */}
      {sirenActive && (
        <div className="fixed inset-0 bg-red-600/40 animate-pulse pointer-events-none z-[120]" />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[130] bg-[#222840] border border-[#8f9bff] text-[#8f9bff] font-mono font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(143,155,255,0.4)] animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#0f121a] border-l border-[#222840] shadow-[-10px_0_50px_rgba(0,0,0,0.9)] flex flex-col h-full overflow-hidden text-white z-10 animate-in slide-in-from-right duration-300">
        
        {/* Top Bar with Transparent Corner Buttons */}
        <div className="p-3 border-b border-[#222840] flex items-center justify-between bg-[#12151e]/95 backdrop-blur-md shrink-0 relative z-40">
          {/* Left Corner: Transparent QR Code Button */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              setShowQrModal(true);
            }}
            title="QR-код профиля"
            className="p-2 text-gray-300 hover:text-[#8f9bff] bg-transparent hover:bg-white/5 rounded-full transition-all cursor-pointer border border-transparent hover:border-[#8f9bff]/30"
          >
            <QrCode className="w-5 h-5 text-[#8f9bff]" />
          </button>

          <span className="font-mono font-bold text-xs uppercase tracking-wider text-gray-300">
            Профиль пользователя
          </span>

          <div className="flex items-center gap-1">
            {/* Right Corner: Transparent 3 Dots Button */}
            <div className="relative">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setShowMoreMenu(!showMoreMenu);
                }}
                title="Прочие настройки профиля"
                className="p-2 text-gray-300 hover:text-[#8f9bff] bg-transparent hover:bg-white/5 rounded-full transition-all cursor-pointer border border-transparent hover:border-[#8f9bff]/30"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* 3 Dots Dropdown Menu */}
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-[#171b27] border border-[#8f9bff]/40 rounded-2xl shadow-[0_0_25px_rgba(143,155,255,0.25)] z-50 p-1.5 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Ссылка на профиль скопирована!');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-gray-200 hover:bg-[#1e2232] hover:text-[#8f9bff] transition-all text-left cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-[#8f9bff]" />
                      <span>Поделиться профилем</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        showToast('Жалоба отправлена администратору');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-gray-200 hover:bg-[#1e2232] hover:text-red-400 transition-all text-left cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>Пожаловаться</span>
                    </button>

                    <div className="h-px bg-[#222840] my-1" />

                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowColorModal(true);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-gray-200 hover:bg-[#1e2232] hover:text-amber-300 transition-all text-left cursor-pointer"
                    >
                      <Palette className="w-4 h-4 text-amber-300" />
                      <span>Изменить цвет профиля</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Close Drawer Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-transparent hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pt-14 space-y-4">
          {/* USER AVATAR (Positioned above the middle) */}
          <div className="flex flex-col items-center justify-center transition-all duration-300">
            <div
              onClick={() => {
                triggerHaptic('tap');
                soundManager.playBeep(1100, 0.05);
                setIsAvatarExpanded(!isAvatarExpanded);
              }}
              title="Нажмите, чтобы увеличить/свернуть аватар"
              className={`transition-all duration-300 cursor-pointer flex items-center justify-center bg-[#222840] border-4 shadow-[0_0_25px_rgba(143,155,255,0.3)] relative overflow-hidden select-none group ${
                isAvatarExpanded
                  ? 'w-full aspect-square rounded-2xl text-9xl shadow-[0_0_40px_rgba(143,155,255,0.5)] my-2'
                  : 'w-28 h-28 rounded-full text-6xl hover:scale-105 my-2'
              }`}
              style={{ borderColor: accentColor }}
            >
              {isImageAvatar(userProfile.avatar) ? (
                <img src={userProfile.avatar} alt="Аватар" className="w-full h-full object-cover" />
              ) : (
                <span className="transform transition-transform duration-300 group-hover:scale-110">
                  {userProfile.avatar || '🐵'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono font-bold text-white uppercase tracking-wider bg-black/40 p-1 text-center">
                {isAvatarExpanded ? 'Свернуть' : 'Увеличить'}
              </div>
            </div>

            {/* Below Avatar: Name and Status */}
            <h2 className="text-xl font-extrabold text-white text-center mt-2 flex items-center gap-1.5">
              <span style={{ color: accentColor }}>{userProfile.name || 'Пользователь'}</span>
            </h2>
            <p className="text-xs text-gray-400 font-mono text-center mt-0.5">
              {userProfile.status || 'В сети'}
            </p>
          </div>

          {/* СТАТИСТИКА ПОД ИМЕНЕМ */}
          <ProfileStats
            profileKey="__me__"
            isOwn
            status={userProfile.status}
            about={userProfile.about}
            music={userProfile.music}
            accent={accentColor}
          />

          {/* 4 STYLED BUTTONS BELOW NAME & STATUS */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <button
              onClick={() => {
                triggerHaptic('tap');
                setTempAvatar(userProfile.avatar || '🐵');
                setShowEditAvatarModal(true);
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff] rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:bg-[#222840]/30 active:scale-95"
            >
              <User className="w-5 h-5 text-[#8f9bff] mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-xs text-white">Изменить аватар</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                setTempName(userProfile.name || '');
                setShowEditNameModal(true);
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff] rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:bg-[#222840]/30 active:scale-95"
            >
              <Edit3 className="w-5 h-5 text-[#8f9bff] mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-xs text-white">Изменить имя</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                setTempStatus(userProfile.status || '');
                setShowEditStatusModal(true);
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff] rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:bg-[#222840]/30 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-[#8f9bff] mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-xs text-white">Изменить статус</span>
            </button>

            <button
              onClick={handleSiren}
              className="p-3 bg-[#141824] border border-red-900/60 hover:border-red-500 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:bg-red-950/40 active:scale-95"
            >
              <Siren className="w-5 h-5 text-red-500 mb-1 animate-bounce group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-xs text-red-400">Сирена</span>
            </button>
          </div>

          {/* INFORMATION LIST BELOW BUTTONS */}
          <div className="space-y-3 pt-2 border-t border-[#222840]">
            <h3 className="font-extrabold text-[#8f9bff] uppercase text-xs tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8f9bff]" />
              Подробная информация
            </h3>

            {/* 1. Phone Number (Clickable to change) */}
            <div
              onClick={() => {
                triggerHaptic('tap');
                setNewPhone(userProfile.phoneNumber || '');
                setPhoneCodeStep(false);
                setShowPhoneModal(true);
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff] rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8f9bff] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Номер телефона:</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {userProfile.phoneNumber || '+7 (900) 123-45-67'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-[#222840] text-[#8f9bff] px-2 py-1 rounded-lg font-mono font-bold">
                Сменить
              </span>
            </div>

            {/* 2. About Me (Text limited to 8000 characters) */}
            <div className="p-3 bg-[#141824] border border-[#222840] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold block">О себе (макс. 8000 символов):</span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {aboutText.length}/8000
                </span>
              </div>
              <textarea
                value={aboutText}
                maxLength={8000}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Расскажите подробнее о себе..."
                rows={3}
                className="w-full bg-[#0f121a] border border-[#222840] focus:border-[#8f9bff] p-2 text-xs text-white rounded-lg outline-none font-sans"
              />
              <button
                onClick={handleSaveAbout}
                className="w-full py-1.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold uppercase rounded-lg text-[10px] cursor-pointer transition-all"
              >
                Сохранить "О себе"
              </button>
            </div>

            {/* Favorite info fields array */}
            {[
              { key: 'favMusic', label: 'Любимая музыка', icon: Music, val: userProfile.favMusic },
              { key: 'favMovie', label: 'Любимый фильм', icon: Film, val: userProfile.favMovie },
              { key: 'favMusicGenre', label: 'Любимый жанр музыки', icon: Disc, val: userProfile.favMusicGenre },
              { key: 'favMovieGenre', label: 'Любимый жанр фильма', icon: Clapperboard, val: userProfile.favMovieGenre },
              { key: 'favFood', label: 'Любимая еда', icon: Utensils, val: userProfile.favFood },
              { key: 'favColor', label: 'Любимый цвет', icon: Palette, val: userProfile.favColor },
              { key: 'favDayOfWeek', label: 'Любимый день недели', icon: Calendar, val: userProfile.favDayOfWeek },
              { key: 'favMonth', label: 'Любимый месяц', icon: Calendar, val: userProfile.favMonth },
              { key: 'favYear', label: 'Любимый год', icon: Calendar, val: userProfile.favYear },
              { key: 'favHoliday', label: 'Любимый праздник', icon: Sparkles, val: userProfile.favHoliday },
              { key: 'favProfession', label: 'Любимая профессия', icon: Briefcase, val: userProfile.favProfession },
              { key: 'favBook', label: 'Любимая книга', icon: BookOpen, val: userProfile.favBook },
              { key: 'favBookGenre', label: 'Любимый жанр книг', icon: Book, val: userProfile.favBookGenre },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.key}
                  onClick={() => handleOpenEditField(item.key, item.val || '')}
                  className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff]/60 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4 text-[#8f9bff] shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">{item.label}:</span>
                      <span className="text-xs font-bold text-white">
                        {item.val || 'Не указано'}
                      </span>
                    </div>
                  </div>
                  <Edit3 className="w-3.5 h-3.5 text-gray-500 hover:text-[#8f9bff] shrink-0" />
                </div>
              );
            })}
          </div>

          {/* PRIVACY & CONFIDENTIALITY SECTION */}
          <div className="space-y-2 pt-3 border-t border-[#222840]">
            <h3 className="font-extrabold text-[#8f9bff] uppercase text-xs tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8f9bff]" />
              Конфиденциальность и приватность
            </h3>

            <div
              onClick={() => {
                triggerHaptic('tap');
                onUpdateProfile({ ...userProfile, hidePhone: !userProfile.hidePhone });
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
            >
              <span className="font-bold text-white text-xs">Скрыть номер телефона</span>
              <span
                className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-[10px] uppercase transition-all ${
                  userProfile.hidePhone
                    ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                    : 'bg-[#1e2232] text-gray-400 border border-[#222840]'
                }`}
              >
                {userProfile.hidePhone ? 'СКРЫТ' : 'ВИДЕН'}
              </span>
            </div>

            <div
              onClick={() => {
                triggerHaptic('tap');
                onUpdateProfile({ ...userProfile, hideAvatar: !userProfile.hideAvatar });
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
            >
              <span className="font-bold text-white text-xs">Скрыть аватарку</span>
              <span
                className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-[10px] uppercase transition-all ${
                  userProfile.hideAvatar
                    ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                    : 'bg-[#1e2232] text-gray-400 border border-[#222840]'
                }`}
              >
                {userProfile.hideAvatar ? 'СКРЫТА' : 'ВИДНА'}
              </span>
            </div>

            <div
              onClick={() => {
                triggerHaptic('tap');
                onUpdateProfile({ ...userProfile, hideName: !userProfile.hideName });
              }}
              className="p-3 bg-[#141824] border border-[#222840] hover:border-[#8f9bff]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
            >
              <span className="font-bold text-white text-xs">Скрыть имя профиля</span>
              <span
                className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-[10px] uppercase transition-all ${
                  userProfile.hideName
                    ? 'bg-[#8f9bff] text-black shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                    : 'bg-[#1e2232] text-gray-400 border border-[#222840]'
                }`}
              >
                {userProfile.hideName ? 'СКРЫТО' : 'ВИДНО'}
              </span>
            </div>
          </div>

          {/* BLACKLIST SECTION */}
          <div className="space-y-2 pt-3 border-t border-[#222840]">
            <h3 className="font-extrabold text-red-400 uppercase text-xs tracking-wider flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-400" />
              Чёрный список ({blockedUsers.length})
            </h3>

            {blockedUsers.length === 0 ? (
              <p className="text-gray-400 p-2 text-xs font-sans">Чёрный список пуст.</p>
            ) : (
              <div className="space-y-1.5">
                {blockedUsers.map((name) => (
                  <div
                    key={name}
                    className="p-2.5 bg-[#141824] border border-[#222840] rounded-xl flex items-center justify-between text-white"
                  >
                    <span className="font-bold text-xs">{name}</span>
                    <button
                      onClick={() => {
                        triggerHaptic('tap');
                        if (onUnblockUser) onUnblockUser(name);
                      }}
                      className="px-3 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg font-bold uppercase text-[10px] cursor-pointer transition-all"
                    >
                      Разблокировать
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Соцсети (угол), посты (сбоку), меню взаимодействия (другой угол) */}
        <ProfileExtras profileKey="__me__" isOwn accent={accentColor} topOffset={68} />
      </div>

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 text-center shadow-[0_0_40px_rgba(143,155,255,0.4)] space-y-4">
            <h3 className="font-extrabold text-white text-base uppercase">QR-код профиля</h3>
            <div className="bg-[#0f121a] p-4 border border-[#222840] rounded-xl flex flex-col items-center justify-center">
              {/* Stylized QR Code Visual */}
              <div className="w-36 h-36 bg-[#222840] border-2 border-[#8f9bff] rounded-lg p-2 flex flex-col justify-between shadow-[0_0_20px_rgba(143,155,255,0.3)]">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-2 border-[#8f9bff] bg-[#8f9bff]/20 flex items-center justify-center font-bold text-xs text-[#8f9bff]">■</div>
                  <div className="w-8 h-8 border-2 border-[#8f9bff] bg-[#8f9bff]/20 flex items-center justify-center font-bold text-xs text-[#8f9bff]">■</div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden mx-auto my-auto flex items-center justify-center">
                  {isImageAvatar(userProfile.avatar) ? (
                    <img src={userProfile.avatar} alt="Аватар" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-mono text-[#8f9bff]">{userProfile.avatar || '🐵'}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-2 border-[#8f9bff] bg-[#8f9bff]/20 flex items-center justify-center font-bold text-xs text-[#8f9bff]">■</div>
                  <div className="w-4 h-4 bg-[#8f9bff]" />
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono mt-2 block">
                @{userProfile.name || 'user'}
              </span>
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* COLOR PICKER MODAL */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm uppercase">Выберите цвет профиля</h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { name: 'Изумруд', code: '#8f9bff' },
                { name: 'Неон Розовый', code: '#ff007f' },
                { name: 'Электрик', code: '#00d2ff' },
                { name: 'Закат', code: '#ffaa00' },
                { name: 'Фиолетовый', code: '#a855f7' },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    onUpdateProfile({ ...userProfile, profileColor: c.code });
                    setShowColorModal(false);
                    showToast(`Цвет профиля изменен: ${c.name}`);
                  }}
                  className="w-10 h-10 rounded-full border-2 border-white/20 hover:scale-110 transition-transform cursor-pointer shadow-md"
                  style={{ backgroundColor: c.code }}
                  title={c.name}
                />
              ))}
            </div>
            <button
              onClick={() => setShowColorModal(false)}
              className="w-full py-2 bg-[#171b27] text-gray-300 font-bold uppercase rounded-xl cursor-pointer border border-[#222840]"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* EDIT AVATAR MODAL */}
      {showEditAvatarModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm uppercase text-center">Изменить аватар</h3>
            <div>
              <div className="mb-3">
                <label className="text-[10px] text-gray-400 block mb-1">Загрузить своё фото с устройства:</label>
                <label className="w-full py-2.5 px-3 bg-[#0f121a] hover:bg-[#171b27] border border-[#222840] hover:border-[#8f9bff] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-white font-bold">
                  <span>📁 Выбрать файл изображения</span>
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
                            setTempAvatar(ev.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Chat-shared photos section */}
              {chatPhotos.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[#8f9bff] font-bold block">
                      💬 Выбрать из чата (ваши фото):
                    </label>
                    <span className="text-[9px] text-zinc-400 font-mono">{chatPhotos.length} шт.</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {chatPhotos.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setTempAvatar(item.url);
                          triggerHaptic('tap');
                        }}
                        className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-transform ${
                          tempAvatar === item.url
                            ? 'border-[#8f9bff] scale-105 ring-2 ring-[#8f9bff]'
                            : 'border-zinc-700 hover:border-zinc-500 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={item.url} alt="Из чата" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="text-[10px] text-gray-400 block mb-1">Или выберите эмодзи:</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {avatarPresets.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setTempAvatar(emoji)}
                    className={`p-2 text-2xl bg-[#0f121a] rounded-xl border cursor-pointer hover:scale-110 transition-transform ${
                      tempAvatar === emoji ? 'border-[#8f9bff] bg-[#222840]' : 'border-[#222840]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={tempAvatar}
                onChange={(e) => setTempAvatar(e.target.value)}
                placeholder="Свой эмодзи/символ"
                className="w-full bg-[#0f121a] border border-[#222840] focus:border-[#8f9bff] p-2 text-center text-xl text-white rounded-xl outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditAvatarModal(false)}
                className="flex-1 py-2 bg-[#171b27] text-gray-300 font-bold uppercase rounded-xl border border-[#222840]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onUpdateProfile({ ...userProfile, avatar: tempAvatar });
                  setShowEditAvatarModal(false);
                  showToast('Аватар обновлен');
                }}
                className="flex-1 py-2 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT NAME MODAL */}
      {showEditNameModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm uppercase text-center">Изменить имя</h3>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Введите имя..."
              className="w-full bg-[#0f121a] border border-[#222840] focus:border-[#8f9bff] p-2.5 text-xs text-white rounded-xl outline-none font-bold"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditNameModal(false)}
                className="flex-1 py-2 bg-[#171b27] text-gray-300 font-bold uppercase rounded-xl border border-[#222840]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onUpdateProfile({ ...userProfile, name: tempName });
                  setShowEditNameModal(false);
                  showToast('Имя обновлено');
                }}
                className="flex-1 py-2 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STATUS MODAL */}
      {showEditStatusModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm uppercase text-center">Изменить статус</h3>
            <input
              type="text"
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              placeholder="Введите статус..."
              className="w-full bg-[#0f121a] border border-[#222840] focus:border-[#8f9bff] p-2.5 text-xs text-white rounded-xl outline-none font-bold"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditStatusModal(false)}
                className="flex-1 py-2 bg-[#171b27] text-gray-300 font-bold uppercase rounded-xl border border-[#222840]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onUpdateProfile({ ...userProfile, status: tempStatus });
                  setShowEditStatusModal(false);
                  showToast('Статус обновлен');
                }}
                className="flex-1 py-2 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIELD EDIT MODAL */}
      {editingField && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-xs uppercase text-center">
              Редактировать поле
            </h3>
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              placeholder="Введите значение..."
              className="w-full bg-[#0f121a] border border-[#222840] focus:border-[#8f9bff] p-2.5 text-xs text-white rounded-xl outline-none font-bold"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingField(null)}
                className="flex-1 py-2 bg-[#171b27] text-gray-300 font-bold uppercase rounded-xl border border-[#222840]"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveField}
                className="flex-1 py-2 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHONE CHANGE MODAL */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#12151e] border-2 border-[#8f9bff] rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider text-center">
              Смена номера телефона
            </h3>

            {!phoneCodeStep ? (
              <div className="space-y-3">
                <p className="text-gray-300 text-xs">Введите новый номер телефона:</p>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+7 (900) 123-45-67"
                  className="w-full bg-[#0f121a] border border-[#222840] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#8f9bff]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="flex-1 py-2 bg-[#171b27] text-gray-300 font-bold uppercase rounded-xl"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      if (newPhone.trim()) {
                        soundManager.playBeep(900, 0.05);
                        setPhoneCodeStep(true);
                      }
                    }}
                    className="flex-1 py-2 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl"
                  >
                    Далее
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-300 text-xs">
                  Введите 4-значный код из SMS для номера {newPhone}:
                </p>
                <input
                  type="text"
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-[#0f121a] border border-[#222840] rounded-xl px-3 py-2 text-center text-lg font-mono font-black text-[#8f9bff] outline-none focus:border-[#8f9bff]"
                />
                <button
                  onClick={() => {
                    soundManager.playBeep(1200, 0.08);
                    onUpdateProfile({ ...userProfile, phoneNumber: newPhone });
                    setShowPhoneModal(false);
                    setPhoneCodeStep(false);
                    setVerificationCode('');
                    showToast('Номер телефона успешно изменен!');
                  }}
                  className="w-full py-2.5 bg-[#8f9bff] text-black font-black uppercase rounded-xl"
                >
                  Подтвердить
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
