import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  QualityLevel,
  FontFamilyType,
  AppTheme,
  ChatWallpaperType,
  LoginCustomizationData,
} from '../types';
import { soundManager, triggerHaptic } from '../utils/soundEffects';
import { useDisasterMode, setDisasterMode } from '../utils/disasterMode';
import { getChatPhotos, ChatPhotoItem } from '../utils/chatPhotos';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Sun,
  SunMedium,
  Bell,
  Trash2,
  Smartphone,
  ChevronRight,
  Eye,
  Tv,
  AlertTriangle,
  Flame,
  Check,
  Upload,
  Play,
  RotateCcw,
  Palette,
  KeyRound,
  User,
  Sliders,
  SlidersHorizontal,
  Type,
  Image as ImageIcon,
  X,
  Settings,
  Battery,
  Monitor,
  Phone,
  Siren,
  Edit3,
  Music,
  Film,
  Disc,
  Clapperboard,
  Utensils,
  Calendar,
  Briefcase,
  BookOpen,
  Book,
  FileText,
  Shield,
  Ban,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import { DEFAULT_LOGIN_CUSTOMIZATION } from './LoginScreen';
import { TimeManagement, ParentalControl } from './SettingsExtras';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenProfileDrawer?: () => void;
  coolMode: boolean;
  onToggleCoolMode: () => void;
  fontSize: 'small' | 'medium' | 'large';
  onChangeFontSize: (size: 'small' | 'medium' | 'large') => void;
  fontFamily?: FontFamilyType;
  onChangeFontFamily?: (font: FontFamilyType) => void;
  theme?: AppTheme;
  onChangeTheme?: (theme: AppTheme) => void;
  accentColor?: string;
  onChangeAccentColor?: (color: string) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  notificationFrequency: 'rare' | 'frequent';
  onChangeNotificationFrequency: (freq: 'rare' | 'frequent') => void;
  quality?: QualityLevel;
  onChangeQuality?: (q: QualityLevel) => void;
  vrMode?: boolean;
  onToggleVrMode?: () => void;
  cinemaMode?: boolean;
  onToggleCinemaMode?: () => void;
  powerSavingMode?: boolean;
  onTogglePowerSavingMode?: () => void;
  sendSoundEnabled?: boolean;
  onToggleSendSound?: () => void;
  chatWallpaper?: ChatWallpaperType;
  onChangeChatWallpaper?: (wallpaper: ChatWallpaperType) => void;
  loginCustomization?: LoginCustomizationData;
  onUpdateLoginCustomization?: (custom: LoginCustomizationData) => void;
  onTestLoginScreen?: () => void;
  onTriggerBsod?: () => void;
  blockedUsers?: string[];
  onUnblockUser?: (name: string) => void;
}

const APP_VERSION = '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1';

const THEMES_LIST: Array<{ id: AppTheme; name: string; desc: string; previewClass: string }> = [
  {
    id: 'telegram_dark',
    name: 'Telegram Dark',
    desc: 'Классическая тёмная тема с изумрудным акцентом',
    previewClass: 'bg-[#12151e] border-[#8f9bff] text-[#8f9bff]',
  },
  {
    id: 'telegram_light',
    name: 'Telegram Light',
    desc: 'Светлая чистая тема с небесно-голубыми элементами',
    previewClass: 'bg-white border-[#2481cc] text-[#2481cc]',
  },
  {
    id: 'matrix_green',
    name: 'Matrix Neon',
    desc: 'Кибернетический глубокий зелёный с неоновым свечением',
    previewClass: 'bg-[#010803] border-[#00ff41] text-[#00ff41]',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    desc: 'Яркий контраст жёлтого, неонового фиолетового и циана',
    previewClass: 'bg-[#0b0014] border-[#fee715] text-[#fee715]',
  },
  {
    id: 'sunset_gold',
    name: 'Sunset Gold',
    desc: 'Тёплые закатные тона и мягкое золотое сияние',
    previewClass: 'bg-[#190f05] border-[#f59e0b] text-[#f59e0b]',
  },
  {
    id: 'oled_black',
    name: 'OLED Pure Black',
    desc: 'Абсолютно чёрный фон для максимальной экономии батареи',
    previewClass: 'bg-black border-white text-white',
  },
  {
    id: 'windows_xp',
    name: 'Windows XP Retro',
    desc: 'Ностальгическая тема Windows XP',
    previewClass: 'bg-[#0055ea] border-[#22cc44] text-white',
  },
];

const ACCENT_COLORS = [
  { id: '#8f9bff', name: 'Изумрудный', class: 'bg-[#8f9bff]' },
  { id: '#2481cc', name: 'Телеграм', class: 'bg-[#2481cc]' },
  { id: '#a855f7', name: 'Фиолетовый', class: 'bg-[#a855f7]' },
  { id: '#f59e0b', name: 'Янтарный', class: 'bg-[#f59e0b]' },
  { id: '#ef4444', name: 'Алый', class: 'bg-[#ef4444]' },
  { id: '#06b6d4', name: 'Циан', class: 'bg-[#06b6d4]' },
  { id: '#ec4899', name: 'Розовый', class: 'bg-[#ec4899]' },
  { id: '#ffffff', name: 'Белый', class: 'bg-white' },
];

const FONTS_LIST: Array<{ id: FontFamilyType; name: string; desc: string; sample: string }> = [
  { id: 'sans', name: 'Inter Sans', desc: 'Чистый гротеск для современного интерфейса', sample: 'Aa Bb Cc 123' },
  { id: 'serif', name: 'Playfair Serif', desc: 'Классический книжный шрифт с засечками', sample: 'Aa Bb Cc 123' },
  { id: 'mono', name: 'JetBrains Mono', desc: 'Моноширинный код-шрифт для терминалов', sample: 'Aa Bb Cc 123' },
  { id: 'comic', name: 'Comic Sans Style', desc: 'Веселый округлый непринужденный шрифт', sample: 'Aa Bb Cc 123' },
  { id: 'display', name: 'Display Font', desc: 'Акцидентный заголовочный стиль', sample: 'Aa Bb Cc 123' },
  { id: 'pixel', name: 'Pixel Retro', desc: 'Пиксельный 8-битный ретро-стиль', sample: 'Aa Bb Cc 123' },
];

const WALLPAPERS_LIST: Array<{ id: ChatWallpaperType; name: string; description: string; previewClass: string }> = [
  { id: 'default', name: 'Стандартные', description: 'Тёмный фон приложения', previewClass: 'bg-[#0a0a0f]' },
  { id: 'cyber_emerald', name: 'Кибер Изумруд', description: 'Изумрудный кибернетический градиент', previewClass: 'bg-[#051c11] text-[#8f9bff]' },
  { id: 'matrix', name: 'Матрица', description: 'Зелёный падающий матричный код', previewClass: 'bg-[#020b04] text-[#00ff41]' },
  { id: 'matrix_rain', name: 'Матричный дождь', description: 'Цифровой поток данных', previewClass: 'bg-[#011406] text-[#b8c0ff]' },
  { id: 'stars_space', name: 'Звёздный космос', description: 'Россыпь мерцающих звёзд', previewClass: 'bg-[#020208] text-amber-200' },
  { id: 'deep_space', name: 'Глубокий космос', description: 'Тёмная бесконечность Вселенной', previewClass: 'bg-[#030312] text-blue-300' },
  { id: 'sunset_glow', name: 'Закатное сияние', description: 'Мягкий тёплый градиент заката', previewClass: 'bg-gradient-to-br from-[#2a0e18] to-[#1a0808] text-rose-300' },
  { id: 'grid_cyber', name: 'Кибер-сетка', description: 'Неоновая ретро-сетка', previewClass: 'bg-[#080314] text-purple-400' },
  { id: 'minimal_dark', name: 'Минимализм', description: 'Глубокий монохромный тон', previewClass: 'bg-black/25 text-gray-400' },
  { id: 'soviet_carpet', name: 'Советский ковёр', description: 'Легендарный узор на стене', previewClass: 'bg-[#3b0d0c] text-amber-300' },
];

const EMOJI_PRESETS = ['🐵', '🚀', '👽', '👑', '⚡', '🤖', '🦊', '🔥', '💎', '🦁', '🐺', '🐉', '🎯', '🍀', '🌟', '🦄'];

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  coolMode,
  onToggleCoolMode,
  fontSize,
  onChangeFontSize,
  fontFamily = 'sans',
  onChangeFontFamily,
  theme = 'telegram_dark',
  onChangeTheme,
  accentColor = '#8f9bff',
  onChangeAccentColor,
  notificationsEnabled,
  onToggleNotifications,
  notificationFrequency,
  onChangeNotificationFrequency,
  quality = '1080p',
  onChangeQuality,
  vrMode = false,
  onToggleVrMode,
  cinemaMode = false,
  onToggleCinemaMode,
  powerSavingMode = false,
  onTogglePowerSavingMode,
  sendSoundEnabled = true,
  onToggleSendSound,
  chatWallpaper = 'default',
  onChangeChatWallpaper,
  loginCustomization = DEFAULT_LOGIN_CUSTOMIZATION,
  onUpdateLoginCustomization,
  onTestLoginScreen,
  onTriggerBsod,
  blockedUsers = [],
  onUnblockUser,
}) => {
  // Sub-tabs: 'appearance' (Внешний вид), 'general' (Общие), 'profile' (Профиль), 'login' (Экран входа)
  const disasterMode = useDisasterMode();
  const [activeSubTab, setActiveSubTab] = useState<'appearance' | 'general' | 'profile' | 'login' | null>(null);

  // Cache clearing simulation
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [showCacheModal, setShowCacheModal] = useState(false);
  const [clearedCacheAmount, setClearedCacheAmount] = useState('');

  // Active Sessions
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { device: 'Telegram Web (Текущее устройство)', location: 'Москва, Россия', time: 'Активно сейчас', isCurrent: true },
    { device: 'iPhone 15 Pro Max', location: 'Санкт-Петербург, Россия', time: '3 часа назад', isCurrent: false },
    { device: 'MacBook Air M2', location: 'Новосибирск, Россия', time: 'Вчера, 22:41', isCurrent: false },
  ]);

  // Profile Subtab Local States
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [profileToast, setProfileToast] = useState('');
  const [sirenActive, setSirenActive] = useState(false);

  // Quick Edit Modals
  const [showEditAvatarModal, setShowEditAvatarModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [editingFieldVal, setEditingFieldVal] = useState('');

  // Phone modal
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhoneInput, setNewPhoneInput] = useState(userProfile.phoneNumber || '');
  const [phoneCodeStep, setPhoneCodeStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Local copy of profile values
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar || '🐵');
  const [tempName, setTempName] = useState(userProfile.name || '');
  const [tempStatus, setTempStatus] = useState(userProfile.status || '');
  const [aboutText, setAboutText] = useState(userProfile.about || '');

  useEffect(() => {
    setTempAvatar(userProfile.avatar || '🐵');
    setTempName(userProfile.name || '');
    setTempStatus(userProfile.status || '');
    setAboutText(userProfile.about || '');
    setNewPhoneInput(userProfile.phoneNumber || '');
  }, [userProfile]);

  const [chatPhotos, setChatPhotos] = useState<ChatPhotoItem[]>([]);
  useEffect(() => {
    setChatPhotos(getChatPhotos());
    const handler = () => setChatPhotos(getChatPhotos());
    window.addEventListener('chat_photos_updated', handler);
    return () => window.removeEventListener('chat_photos_updated', handler);
  }, []);

  // Login Screen Customizer Local States
  const [loginTitle, setLoginTitle] = useState(loginCustomization.title || 'войти в любой аккаунт');
  const [loginSubtitle, setLoginSubtitle] = useState(loginCustomization.subtitle || '');
  const [loginBtnText, setLoginBtnText] = useState(loginCustomization.buttonText || 'войти');
  const [loginPlaceholder, setLoginPlaceholder] = useState(loginCustomization.placeholderText || 'Пароль');
  const [loginLogoValue, setLoginLogoValue] = useState(loginCustomization.logoValue || '🚀');
  const [loginCustomBgUrl, setLoginCustomBgUrl] = useState(loginCustomization.customBgUrl || '');
  const [loginCardBannerUrl, setLoginCardBannerUrl] = useState(loginCustomization.cardBannerUrl || '');
  const [loginAccent, setLoginAccent] = useState(loginCustomization.accentColor || '#8f9bff');
  const [loginSavedToast, setLoginSavedToast] = useState(false);

  // Volume and Brightness Sliders state with instant feedback
  const [currentVolume, setCurrentVolume] = useState<number>(() => soundManager.getMasterVolume());
  const [currentBrightness, setCurrentBrightness] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('app_screen_brightness');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.2 && val <= 1) return val;
      }
    } catch {}
    return 1;
  });

  useEffect(() => {
    const handleVol = (e: Event) => {
      const custom = e as CustomEvent<number>;
      if (custom.detail !== undefined) setCurrentVolume(custom.detail);
    };
    const handleBright = (e: Event) => {
      const custom = e as CustomEvent<number>;
      if (custom.detail !== undefined) setCurrentBrightness(custom.detail);
    };
    window.addEventListener('volume_changed', handleVol);
    window.addEventListener('brightness_changed', handleBright);
    return () => {
      window.removeEventListener('volume_changed', handleVol);
      window.removeEventListener('brightness_changed', handleBright);
    };
  }, []);

  const handleVolumeChange = (newVal: number) => {
    const clamped = Math.max(0, Math.min(1, newVal));
    setCurrentVolume(clamped);
    soundManager.setMasterVolume(clamped);
    soundManager.playBeep(600 + clamped * 600, 0.03);
    window.dispatchEvent(new CustomEvent('volume_changed', { detail: clamped }));
  };

  const handleBrightnessChange = (newVal: number) => {
    const clamped = Math.max(0.2, Math.min(1, newVal));
    setCurrentBrightness(clamped);
    try {
      localStorage.setItem('app_screen_brightness', clamped.toString());
    } catch {}
    window.dispatchEvent(new CustomEvent('brightness_changed', { detail: clamped }));
  };

  const showToast = (msg: string) => {
    setProfileToast(msg);
    setTimeout(() => setProfileToast(''), 2500);
  };

  const handleSiren = () => {
    soundManager.playSiren();
    setSirenActive(true);
    triggerHaptic('heavy');
    setTimeout(() => setSirenActive(false), 1500);
  };

  const handleClearCache = () => {
    setIsClearingCache(true);
    triggerHaptic('tap');
    soundManager.playBeep(800, 0.05);

    setTimeout(() => {
      const gbAmount = (Math.random() * 8.5 + 2.1).toFixed(2);
      setClearedCacheAmount(`${gbAmount} ГБ`);
      setIsClearingCache(false);
      setShowCacheModal(true);
      triggerHaptic('success');
      soundManager.playBeep(1200, 0.1);
    }, 1200);
  };

  // Avatar file upload from user device
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          const imgDataUrl = ev.target.result;
          setTempAvatar(imgDataUrl);
          onUpdateProfile({
            ...userProfile,
            avatar: imgDataUrl,
          });
          triggerHaptic('success');
          soundManager.playBeep(1200, 0.08);
          showToast('Фото профиля успешно обновлено!');
          setShowEditAvatarModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAbout = () => {
    soundManager.playBeep(1200, 0.08);
    onUpdateProfile({
      ...userProfile,
      about: aboutText.slice(0, 8000),
    });
    showToast('Раздел "О себе" сохранен');
  };

  const handleOpenEditField = (key: string, currentValue: string) => {
    soundManager.playBeep(900, 0.05);
    setEditingFieldKey(key);
    setEditingFieldVal(currentValue || '');
  };

  const handleSaveField = () => {
    if (!editingFieldKey) return;
    soundManager.playBeep(1200, 0.08);
    onUpdateProfile({
      ...userProfile,
      [editingFieldKey]: editingFieldVal,
    });
    setEditingFieldKey(null);
    showToast('Информация обновлена');
  };

  const handleSaveLoginCustomization = () => {
    const updated: LoginCustomizationData = {
      ...loginCustomization,
      title: loginTitle,
      subtitle: loginSubtitle,
      buttonText: loginBtnText,
      placeholderText: loginPlaceholder,
      logoType: 'emoji',
      logoValue: loginLogoValue,
      customBgUrl: loginCustomBgUrl,
      cardBannerUrl: loginCardBannerUrl,
      accentColor: loginAccent,
    };
    if (onUpdateLoginCustomization) {
      onUpdateLoginCustomization(updated);
    }
    triggerHaptic('success');
    soundManager.playBeep(1200, 0.08);
    setLoginSavedToast(true);
    setTimeout(() => setLoginSavedToast(false), 2000);
  };

  const handleResetLoginCustomization = () => {
    setLoginTitle(DEFAULT_LOGIN_CUSTOMIZATION.title);
    setLoginSubtitle(DEFAULT_LOGIN_CUSTOMIZATION.subtitle);
    setLoginBtnText(DEFAULT_LOGIN_CUSTOMIZATION.buttonText);
    setLoginPlaceholder(DEFAULT_LOGIN_CUSTOMIZATION.placeholderText);
    setLoginLogoValue(DEFAULT_LOGIN_CUSTOMIZATION.logoValue);
    setLoginCustomBgUrl('');
    setLoginCardBannerUrl('');
    setLoginAccent(DEFAULT_LOGIN_CUSTOMIZATION.accentColor);
    if (onUpdateLoginCustomization) {
      onUpdateLoginCustomization(DEFAULT_LOGIN_CUSTOMIZATION);
    }
    soundManager.playBeep(700, 0.05);
  };

  const handleLoginFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bg' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          if (type === 'bg') setLoginCustomBgUrl(ev.target.result);
          if (type === 'banner') setLoginCardBannerUrl(ev.target.result);
          soundManager.playBeep(1100, 0.08);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isCustomImageAvatar = userProfile.avatar?.startsWith('data:') || userProfile.avatar?.startsWith('http') || userProfile.avatar?.startsWith('/');
  const profAccent = userProfile.profileColor || '#8f9bff';

  return (
    <div className="w-full flex-1 flex flex-col p-3 sm:p-5 max-w-2xl mx-auto font-sans text-white select-none">
      
      {/* Toast Notification */}
      {profileToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[130] bg-[#222840] border border-[#8f9bff] text-[#8f9bff] font-mono font-bold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(143,155,255,0.4)] animate-in fade-in duration-200">
          {profileToast}
        </div>
      )}

      {/* Siren Flash Overlay */}
      {sirenActive && (
        <div className="fixed inset-0 bg-red-600/40 animate-pulse pointer-events-none z-[120]" />
      )}

      {activeSubTab === null ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Профиль-герой */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundManager.playBeep(900, 0.04);
              setActiveSubTab('profile');
            }}
            className="w-full relative overflow-hidden rounded-[2rem] p-5 text-left cursor-pointer border border-white/10 bg-gradient-to-br from-[#2b2f66] via-[#1c2040] to-[#12151f] shadow-[0_20px_60px_rgba(0,0,0,0.45)] active:scale-[0.99] transition-transform"
          >
            <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full blur-3xl opacity-40" style={{ background: profAccent }} />
            <div className="relative flex items-center gap-4">
              <div className="w-[72px] h-[72px] rounded-full p-[3px] shrink-0" style={{ background: `linear-gradient(135deg, ${profAccent}, #ff8fd8)` }}>
                <div className="w-full h-full rounded-full bg-white/[0.045] flex items-center justify-center text-4xl overflow-hidden">
                  {isCustomImageAvatar ? <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" /> : userProfile.avatar}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-bold text-white truncate">{userProfile.name}</div>
                <div className="text-xs text-gray-300 mt-0.5 truncate">{userProfile.phoneNumber}</div>
                <div className="text-[11px] text-gray-400 mt-1 truncate">{userProfile.status || 'Добавить статус'}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
            </div>
          </button>

          {/* Быстрые ползунки */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.75rem] bg-white/[0.05] border border-white/[0.08] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleVolumeChange(currentVolume === 0 ? 0.7 : 0)}
                  className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center cursor-pointer"
                  title={currentVolume === 0 ? 'Включить звук' : 'Выключить звук'}
                >
                  {currentVolume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#8f9bff]" />}
                </button>
                <span className="text-sm font-bold text-white tabular-nums">{Math.round(currentVolume * 100)}%</span>
              </div>
              <div className="text-xs text-gray-400">Громкость</div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(currentVolume * 100)}
                onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                className="w-full cursor-pointer accent-[#8f9bff]"
              />
            </div>

            <div className="rounded-[1.75rem] bg-white/[0.05] border border-white/[0.08] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleBrightnessChange(currentBrightness < 1 ? 1 : 0.5)}
                  className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center cursor-pointer"
                  title="Сброс на 100%"
                >
                  <SunMedium className="w-4 h-4 text-amber-400" />
                </button>
                <span className="text-sm font-bold text-white tabular-nums">{Math.round(currentBrightness * 100)}%</span>
              </div>
              <div className="text-xs text-gray-400">Яркость</div>
              <input
                type="range"
                min="20"
                max="100"
                value={Math.round(currentBrightness * 100)}
                onChange={(e) => handleBrightnessChange(Number(e.target.value) / 100)}
                className="w-full cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Категории */}
          <div className="rounded-[1.75rem] bg-white/[0.045] border border-white/[0.08] overflow-hidden">
            {([
              { id: 'appearance', title: 'Внешний вид', sub: 'Темы, акценты, шрифты, режимы, обои чатов', Icon: Palette, grad: 'from-violet-500 to-fuchsia-500' },
              { id: 'general', title: 'Общие', sub: 'Звук, уведомления, тайм-менеджмент, родительский контроль', Icon: Sliders, grad: 'from-[#8f9bff] to-cyan-400' },
              { id: 'profile', title: 'Профиль', sub: 'Имя, статус, конфиденциальность, чёрный список', Icon: User, grad: 'from-sky-500 to-blue-600' },
              { id: 'login', title: 'Экран входа', sub: 'Редактор окна входа в аккаунт', Icon: KeyRound, grad: 'from-amber-400 to-orange-500' },
            ] as const).map((row, i, arr) => (
              <button
                key={row.id}
                onClick={() => {
                  triggerHaptic('tap');
                  soundManager.playBeep(900, 0.04);
                  setActiveSubTab(row.id);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left cursor-pointer hover:bg-white/[0.05] active:bg-white/[0.08] transition-colors ${
                  i < arr.length - 1 ? 'border-b border-white/[0.06]' : ''
                }`}
              >
                <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${row.grad} flex items-center justify-center shrink-0 shadow-lg`}>
                  <row.Icon className="w-5 h-5 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-white">{row.title}</span>
                  <span className="block text-[11px] text-gray-400 truncate">{row.sub}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
              </button>
            ))}
          </div>

          <div className="text-center text-[11px] text-gray-600 pt-2 pb-24">Версия приложения {APP_VERSION}</div>
        </div>
      ) : (
        <div className="sticky top-0 z-20 -mx-3 sm:-mx-5 px-3 sm:px-5 py-3 mb-4 bg-[#0b0d13]/75 backdrop-blur-2xl border-b border-white/[0.06] flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundManager.playBeep(700, 0.04);
              setActiveSubTab(null);
            }}
            className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 rounded-full bg-white/[0.07] hover:bg-white/[0.13] border border-white/10 text-sm font-semibold text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Настройки
          </button>
          <h2 className="text-base font-bold text-white">
            {activeSubTab === 'appearance' ? 'Внешний вид' : activeSubTab === 'general' ? 'Общие' : activeSubTab === 'profile' ? 'Профиль' : 'Экран входа'}
          </h2>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUB-TAB: APPEARANCE (ВНЕШНИЙ ВИД) */}
      {/* ========================================================================= */}
      {activeSubTab === 'appearance' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Section: Themes */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Palette className="w-4 h-4 text-purple-400" />
              Темы оформления
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEMES_LIST.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(1000, 0.04);
                      if (onChangeTheme) onChangeTheme(t.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'border-white/10 bg-[#16161d] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-xs text-white">{t.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400 mb-2 leading-tight">{t.desc}</p>
                    <div className={`h-6 rounded-xl border flex items-center justify-center font-mono font-bold text-[10px] ${t.previewClass}`}>
                      Предпросмотр темы
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Accent Colors */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Цветовые акценты
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              {ACCENT_COLORS.map((c) => {
                const isSelected = accentColor.toLowerCase() === c.id.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(1100, 0.04);
                      if (onChangeAccentColor) onChangeAccentColor(c.id);
                    }}
                    title={c.name}
                    className={`w-11 h-11 rounded-2xl ${c.class} flex items-center justify-center transition-transform cursor-pointer shadow-md ${
                      isSelected ? 'ring-4 ring-white scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-black stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Fonts & Sizes */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
            <h4 className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Type className="w-4 h-4 text-purple-400" />
              Шрифты и размер текста
            </h4>

            {/* Font Family Selection */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-300 block">Шрифт интерфейса:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {FONTS_LIST.map((f) => {
                  const isSelected = fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        triggerHaptic('tap');
                        soundManager.playBeep(950, 0.04);
                        if (onChangeFontFamily) onChangeFontFamily(f.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-400 bg-purple-500/20 shadow-sm'
                          : 'border-white/10 bg-black/25 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-white">{f.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <span className="text-[10px] text-gray-400 block mb-1.5">{f.desc}</span>
                      <span className="text-xs font-bold text-purple-300 block bg-black/40 px-2 py-1 rounded-lg">
                        {f.sample}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size Selection */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-gray-300 block">Размер шрифта:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(900, 0.04);
                      onChangeFontSize(s);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer text-center ${
                      fontSize === s
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-black/25 text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {s === 'small' ? 'Мелкий' : s === 'medium' ? 'Стандартный' : 'Крупный'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Video Quality */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Monitor className="w-4 h-4 text-purple-400" />
              Редактор качества видеопотока
            </h4>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {(['144p', '240p', '360p', '480p', '720p', '1080p', '2k', '4k', '8k', '16k'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    triggerHaptic('tap');
                    soundManager.playBeep(900, 0.03);
                    if (onChangeQuality) onChangeQuality(q);
                  }}
                  className={`py-2 rounded-xl font-mono font-bold uppercase text-[10px] border transition-all cursor-pointer ${
                    quality === q
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-[#171b28] text-gray-400 border-white/10 hover:border-purple-400/50 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Modes & Effects */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Sliders className="w-4 h-4 text-purple-400" />
              Спецрежимы и эффекты
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* VR Mode */}
              <div className="flex items-center justify-between p-3 bg-black/25 border border-white/5 rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Eye className="w-4 h-4 text-purple-400" /> VR стерео режим
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onToggleVrMode) onToggleVrMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                    vrMode ? 'bg-purple-600 text-white' : 'bg-[#171b28] text-gray-400 border border-white/10'
                  }`}
                >
                  {vrMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              {/* Cinema Mode */}
              <div className="flex items-center justify-between p-3 bg-black/25 border border-white/5 rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Tv className="w-4 h-4 text-amber-400" /> Режим кинотеатра
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onToggleCinemaMode) onToggleCinemaMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                    cinemaMode ? 'bg-amber-600 text-white' : 'bg-[#171b28] text-gray-400 border border-white/10'
                  }`}
                >
                  {cinemaMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              {/* Power Saving Mode */}
              <div className="flex items-center justify-between p-3 bg-black/25 border border-white/5 rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Battery className="w-4 h-4 text-emerald-400" /> Режим экономии энергии
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onTogglePowerSavingMode) onTogglePowerSavingMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                    powerSavingMode ? 'bg-[#8f9bff] text-black font-extrabold' : 'bg-[#171b28] text-gray-400 border border-white/10'
                  }`}
                >
                  {powerSavingMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              {/* Cool Mode - parentheses removed per instruction */}
              <div className="flex items-center justify-between p-3 bg-black/25 border border-white/5 rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Flame className="w-4 h-4 text-orange-400" /> Крутой режим
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    onToggleCoolMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                    coolMode ? 'bg-orange-500 text-black font-extrabold' : 'bg-[#171b28] text-gray-400 border border-white/10'
                  }`}
                >
                  {coolMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              {/* Disaster Mode */}
              <div className="flex items-center justify-between p-3 bg-black/25 border border-white/5 rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Режим катастрофы
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    setDisasterMode(!disasterMode);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                    disasterMode ? 'bg-red-600 text-white font-extrabold' : 'bg-[#171b28] text-gray-400 border border-white/10'
                  }`}
                >
                  {disasterMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              {/* Send Sound Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/25 border border-white/5 rounded-xl sm:col-span-2">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Volume2 className="w-4 h-4 text-blue-400" /> Звуковой сигнал при отправке сообщений
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onToggleSendSound) onToggleSendSound();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                    sendSoundEnabled ? 'bg-blue-600 text-white' : 'bg-[#171b28] text-gray-400 border border-white/10'
                  }`}
                >
                  {sendSoundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Chat Wallpapers */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              Обои чата
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {WALLPAPERS_LIST.map((wp) => {
                const isSelected = chatWallpaper === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(1000, 0.04);
                      if (onChangeChatWallpaper) onChangeChatWallpaper(wp.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500/20 shadow-sm'
                        : 'border-white/10 bg-[#16161d] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{wp.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <span className="text-[10px] text-gray-400 mb-2 leading-tight">{wp.description}</span>
                    <div className={`h-8 rounded-xl border flex items-center justify-center text-[10px] ${wp.previewClass}`}>
                      Превью
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-TAB: GENERAL SETTINGS (ОБЫЧНЫЕ НАСТРОЙКИ) */}
      {/* ========================================================================= */}
      {activeSubTab === 'general' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Новое: тайм-менеджмент и родительский контроль */}
          <TimeManagement accent={accentColor} />
          <ParentalControl accent={accentColor} />

          {/* Section: Authentic User Media & Audio Test Board */}
          <div className="bg-white/[0.045] border border-white/[0.1] rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_0_25px_rgba(143,155,255,0.15)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs sm:text-sm">
                <Volume2 className="w-5 h-5 text-[#8f9bff]" />
                Ваши Аудиофайлы и Фотографии
              </h4>
              <span className="text-[10px] text-[#8f9bff] font-mono font-bold bg-[#222840] px-2 py-0.5 rounded-full border border-[#8f9bff]/40">100% Ваши файлы</span>
            </div>

            {/* Audio Files Board (6 real sounds) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">Прослушать звуковые файлы:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Rock Sound', file: 'rock.mp3', action: () => soundManager.playRock(), icon: '🎸' },
                  { name: 'Дети (Loop)', file: 'deti.mp3', action: () => soundManager.startDetiLoop(), icon: '👦' },
                  { name: 'Сирена', file: 'siren.mp3', action: () => soundManager.playSiren(), icon: '🚨' },
                  { name: 'Ядерная сирена', file: 'nuclear-alarm-siren.mp3', action: () => soundManager.playNuclearAlarm(), icon: '☢️' },
                  { name: 'Flapjack Scream', file: 'flap-jack-scream.mp3', action: () => soundManager.playFlapJackScream(), icon: '😱' },
                  { name: 'Fail Sound', file: 'fail.mp3', action: () => soundManager.playFail(), icon: '❌' },
                ].map((snd) => (
                  <button
                    key={snd.file}
                    onClick={() => {
                      triggerHaptic('tap');
                      snd.action();
                    }}
                    className="p-2.5 bg-black/25 hover:bg-[#1a1a24] border border-[#8f9bff]/30 hover:border-[#8f9bff] rounded-xl text-left transition-all active:scale-95 cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{snd.icon}</span>
                      <div className="overflow-hidden">
                        <span className="text-xs font-black text-white group-hover:text-[#8f9bff] block truncate">{snd.name}</span>
                        <span className="text-[9px] font-mono text-zinc-500 block truncate">{snd.file}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => soundManager.stopDetiLoop()}
                className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer pt-1 block"
              >
                Остановить звук детей (если играет)
              </button>
            </div>


          </div>

          {/* Section: Notifications */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
                <Bell className="w-4 h-4 text-[#8f9bff]" />
                Система уведомлений
              </h4>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onToggleNotifications(!notificationsEnabled);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                  notificationsEnabled
                    ? 'bg-[#8f9bff] text-black shadow-md font-extrabold'
                    : 'bg-[#171b28] text-gray-400 border border-white/10'
                }`}
              >
                {notificationsEnabled ? 'ВКЛ' : 'ВЫКЛ'}
              </button>
            </div>

            {notificationsEnabled && (
              <div className="bg-black/25 p-3.5 rounded-xl border border-white/5 space-y-3">
                <span className="font-bold text-gray-200 block text-xs">Частота показа уведомлений:</span>
                
                {/* Descriptions removed per user instruction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Rare Frequency */}
                  <button
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(900, 0.04);
                      onChangeNotificationFrequency('rare');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      notificationFrequency === 'rare'
                        ? 'border-[#8f9bff] bg-[#8f9bff]/15 text-white shadow-[0_0_15px_rgba(143,155,255,0.2)]'
                        : 'border-white/10 bg-[#171b28] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-[#8f9bff] flex items-center gap-1.5">
                      <span>🐢 Редко</span>
                    </span>
                    {notificationFrequency === 'rare' && <Check className="w-4 h-4 text-[#8f9bff]" />}
                  </button>

                  {/* Frequent Frequency */}
                  <button
                    onClick={() => {
                      triggerHaptic('heavy');
                      soundManager.playBeep(1200, 0.05);
                      onChangeNotificationFrequency('frequent');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      notificationFrequency === 'frequent'
                        ? 'border-rose-500 bg-rose-500/20 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                        : 'border-white/10 bg-[#171b28] text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-rose-400 flex items-center gap-1.5">
                      <span>🚨 Часто (Каждые 0.4 сек)</span>
                    </span>
                    {notificationFrequency === 'frequent' && <Check className="w-4 h-4 text-rose-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section: Storage & Sessions */}
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Trash2 className="w-4 h-4 text-[#8f9bff]" />
              Память и сессии
            </h4>

            {/* Clear Cache */}
            <div className="p-3 bg-black/25 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-orange-400" /> Очистить кэш
                </span>
                <span className="text-[10px] text-gray-400">Освобождает временные гигабайты файлов</span>
              </div>
              <button
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-400 text-black font-extrabold rounded-xl uppercase text-[10px] cursor-pointer shadow-sm transition-all"
              >
                {isClearingCache ? 'Очистка...' : 'Очистить'}
              </button>
            </div>

            {/* Active Sessions */}
            <div className="p-3 bg-black/25 border border-white/5 rounded-xl">
              <button
                onClick={() => setShowActiveSessions(!showActiveSessions)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-bold text-white text-xs flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#8f9bff]" /> Активные сессии ({activeSessions.length})
                </span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showActiveSessions ? 'rotate-90' : ''}`} />
              </button>

              {showActiveSessions && (
                <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
                  {activeSessions.map((s, idx) => (
                    <div key={idx} className="p-2 bg-[#171b28] border border-white/5 rounded-lg text-[10px] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {s.device}
                          {s.isCurrent && <span className="text-[9px] bg-[#8f9bff] text-black px-1 rounded font-bold">Это</span>}
                        </div>
                        <div className="text-gray-400">{s.location} • {s.time}</div>
                      </div>
                      {!s.isCurrent && (
                        <button
                          onClick={() => setActiveSessions((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300 text-[10px] font-bold p-1 cursor-pointer"
                        >
                          Завершить
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: BSOD Trigger (Direct execution, no confirmation modal) */}
          <div className="bg-white/[0.045] border border-rose-500/40 hover:border-rose-500 rounded-2xl p-4 space-y-2 shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Вызов экрана смерти (BSOD)
              </h4>
              <button
                onClick={() => {
                  triggerHaptic('heavy');
                  if (onTriggerBsod) onTriggerBsod();
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase text-[10px] rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
              >
                Вызвать BSOD
              </button>
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Имитирует критический сбой операционной системы с синим экраном ошибки.
            </p>
          </div>

          {/* Footprint Version */}
          <div className="text-center py-4 border-t border-white/10 text-gray-500 font-mono text-[11px]">
            Версия приложения: <span className="text-[#8f9bff] font-bold">{APP_VERSION}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB: PROFILE (НАСТРОЙКИ ПРОФИЛЯ) */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-3xl p-4 sm:p-5 space-y-5 shadow-xl">
            
            {/* Header & QR Code button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                <User className="w-4 h-4 text-blue-400" />
                Настройки профиля
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    setShowQrModal(true);
                  }}
                  className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR-код</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    setShowColorModal(true);
                  }}
                  className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30 flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Цвет</span>
                </button>
              </div>
            </div>

            {/* Avatar & Header Identity */}
            <div className="flex flex-col items-center justify-center">
              <div
                onClick={() => {
                  triggerHaptic('tap');
                  soundManager.playBeep(1100, 0.05);
                  setIsAvatarExpanded(!isAvatarExpanded);
                }}
                className={`transition-all duration-300 cursor-pointer flex items-center justify-center bg-[#222840] border-4 shadow-xl relative overflow-hidden select-none group ${
                  isAvatarExpanded
                    ? 'w-full aspect-square rounded-2xl text-9xl my-2'
                    : 'w-24 h-24 rounded-full text-5xl hover:scale-105 my-2'
                }`}
                style={{ borderColor: profAccent }}
              >
                {isCustomImageAvatar ? (
                  <img
                    src={userProfile.avatar}
                    alt="Аватар"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="transform transition-transform duration-300 group-hover:scale-110">
                    {userProfile.avatar || '🐵'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono font-bold text-white uppercase tracking-wider p-1 text-center">
                  {isAvatarExpanded ? 'Свернуть' : 'Увеличить'}
                </div>
              </div>

              <h2 className="text-lg font-extrabold text-white text-center mt-1">
                <span style={{ color: profAccent }}>{userProfile.name || 'Пользователь'}</span>
              </h2>
              <p className="text-xs text-gray-400 font-mono text-center">
                {userProfile.status || 'В сети'}
              </p>
            </div>

            {/* 4 Styled Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setTempAvatar(userProfile.avatar || '🐵');
                  setShowEditAvatarModal(true);
                }}
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
              >
                <User className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-[11px] text-white">Аватар</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setTempName(userProfile.name || '');
                  setShowEditNameModal(true);
                }}
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-[11px] text-white">Имя</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setTempStatus(userProfile.status || '');
                  setShowEditStatusModal(true);
                }}
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-[11px] text-white">Статус</span>
              </button>

              <button
                onClick={handleSiren}
                className="p-3 bg-[#171b28] border border-red-900/60 hover:border-red-500 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:bg-red-950/40 active:scale-95 shadow-sm"
              >
                <Siren className="w-4 h-4 text-red-500 mb-1 animate-bounce group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-[11px] text-red-400">Сирена</span>
              </button>
            </div>

            {/* Information List */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h3 className="font-extrabold text-blue-400 uppercase text-xs tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Подробная информация
              </h3>

              {/* 1. Phone Number */}
              <div
                onClick={() => {
                  triggerHaptic('tap');
                  setNewPhoneInput(userProfile.phoneNumber || '');
                  setPhoneCodeStep(false);
                  setShowPhoneModal(true);
                }}
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">Номер телефона:</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {userProfile.phoneNumber || '+7 (999) 000-00-00'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/40 px-2.5 py-1 rounded-xl font-mono font-bold">
                  Сменить
                </span>
              </div>

              {/* 2. About Me */}
              <div className="p-3.5 bg-[#171b28] border border-white/10 rounded-2xl space-y-2">
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
                  className="w-full bg-black/25 border border-white/10 focus:border-blue-400 p-2.5 text-xs text-white rounded-xl outline-none font-sans"
                />
                <button
                  onClick={handleSaveAbout}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase rounded-xl text-[10px] cursor-pointer transition-all"
                >
                  Сохранить "О себе"
                </button>
              </div>

              {/* Extended Favorite Info Fields */}
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
                    className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400/60 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold">{item.label}:</span>
                        <span className="text-xs font-bold text-white">
                          {item.val || 'Не указано'}
                        </span>
                      </div>
                    </div>
                    <Edit3 className="w-3.5 h-3.5 text-gray-500 hover:text-blue-400 shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Privacy & Confidentiality Section */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h3 className="font-extrabold text-blue-400 uppercase text-xs tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Конфиденциальность и приватность
              </h3>

              <div
                onClick={() => {
                  triggerHaptic('tap');
                  onUpdateProfile({ ...userProfile, hidePhone: !userProfile.hidePhone });
                }}
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
              >
                <span className="font-bold text-white text-xs">Скрыть номер телефона</span>
                <span
                  className={`px-2.5 py-1 rounded-xl font-mono font-extrabold text-[10px] uppercase transition-all ${
                    userProfile.hidePhone
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-black/25 text-gray-400 border border-white/10'
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
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
              >
                <span className="font-bold text-white text-xs">Скрыть аватарку</span>
                <span
                  className={`px-2.5 py-1 rounded-xl font-mono font-extrabold text-[10px] uppercase transition-all ${
                    userProfile.hideAvatar
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-black/25 text-gray-400 border border-white/10'
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
                className="p-3 bg-[#171b28] border border-white/10 hover:border-blue-400/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
              >
                <span className="font-bold text-white text-xs">Скрыть имя профиля</span>
                <span
                  className={`px-2.5 py-1 rounded-xl font-mono font-extrabold text-[10px] uppercase transition-all ${
                    userProfile.hideName
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-black/25 text-gray-400 border border-white/10'
                  }`}
                >
                  {userProfile.hideName ? 'СКРЫТО' : 'ВИДНО'}
                </span>
              </div>
            </div>

            {/* Blacklist Section */}
            <div className="space-y-2 pt-3 border-t border-white/10">
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
                      className="p-2.5 bg-[#171b28] border border-white/10 rounded-xl flex items-center justify-between text-white"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-TAB: LOGIN SCREEN EDITOR (РЕДАКТОР ВХОДА) */}
      {/* ========================================================================= */}
      {activeSubTab === 'login' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white/[0.045] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2 text-xs">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Настройка экрана авторизации (входа)
              </h4>
              {loginSavedToast && (
                <span className="text-xs text-[#8f9bff] font-bold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Настройки сохранены!
                </span>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 block">Заголовок экрана:</label>
                <input
                  type="text"
                  value={loginTitle}
                  onChange={(e) => setLoginTitle(e.target.value)}
                  className="w-full bg-black/25 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="войти в любой аккаунт"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 block">Подзаголовок:</label>
                <input
                  type="text"
                  value={loginSubtitle}
                  onChange={(e) => setLoginSubtitle(e.target.value)}
                  className="w-full bg-black/25 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="Необязательно"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 block">Текст на кнопке входа:</label>
                <input
                  type="text"
                  value={loginBtnText}
                  onChange={(e) => setLoginBtnText(e.target.value)}
                  className="w-full bg-black/25 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="войти"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 block">Подсказка в поле ввода:</label>
                <input
                  type="text"
                  value={loginPlaceholder}
                  onChange={(e) => setLoginPlaceholder(e.target.value)}
                  className="w-full bg-black/25 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="Пароль"
                />
              </div>
            </div>

            {/* Logo Emoji Selector */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-gray-300 block">Логотип / Иконка входа:</span>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {loginLogoValue}
                </div>
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {EMOJI_PRESETS.map((em) => (
                    <button
                      key={em}
                      onClick={() => {
                        triggerHaptic('tap');
                        setLoginLogoValue(em);
                      }}
                      className={`w-8 h-8 rounded-xl border text-lg flex items-center justify-center cursor-pointer ${
                        loginLogoValue === em
                          ? 'border-amber-400 bg-amber-500/30 scale-110'
                          : 'border-white/10 bg-black/25'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Background Image */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-300 block">Фоновое изображение экрана:</span>
                <label className="flex items-center justify-center gap-2 p-3 bg-black/25 hover:bg-[#171b28] border border-dashed border-white/20 hover:border-amber-400 rounded-xl cursor-pointer transition-all text-xs text-gray-300">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{loginCustomBgUrl ? 'Заменить фон' : 'Загрузить картинку'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLoginFileUpload(e, 'bg')}
                    className="hidden"
                  />
                </label>
                {loginCustomBgUrl && (
                  <button
                    onClick={() => setLoginCustomBgUrl('')}
                    className="text-[10px] text-red-400 hover:text-red-300"
                  >
                    Удалить фон
                  </button>
                )}
              </div>

              {/* Banner Image */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-300 block">Верхний баннер входа:</span>
                <label className="flex items-center justify-center gap-2 p-3 bg-black/25 hover:bg-[#171b28] border border-dashed border-white/20 hover:border-amber-400 rounded-xl cursor-pointer transition-all text-xs text-gray-300">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{loginCardBannerUrl ? 'Заменить баннер' : 'Загрузить баннер'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLoginFileUpload(e, 'banner')}
                    className="hidden"
                  />
                </label>
                {loginCardBannerUrl && (
                  <button
                    onClick={() => setLoginCardBannerUrl('')}
                    className="text-[10px] text-red-400 hover:text-red-300"
                  >
                    Удалить баннер
                  </button>
                )}
              </div>
            </div>

            {/* Accent Color for Login */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-gray-300 block">Цвет кнопки входа:</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {ACCENT_COLORS.map((c) => {
                  const isSelected = loginAccent.toLowerCase() === c.id.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        triggerHaptic('tap');
                        setLoginAccent(c.id);
                      }}
                      className={`w-8 h-8 rounded-xl ${c.class} flex items-center justify-center transition-transform cursor-pointer ${
                        isSelected ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
              <button
                onClick={handleSaveLoginCustomization}
                className="py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Сохранить</span>
              </button>

              <button
                onClick={() => {
                  handleSaveLoginCustomization();
                  if (onTestLoginScreen) onTestLoginScreen();
                }}
                className="py-3 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Запустить экран входа</span>
              </button>

              <button
                onClick={handleResetLoginCustomization}
                className="py-3 bg-[#171b28] hover:bg-[#242430] text-gray-300 border border-white/10 font-bold text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Сброс</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: PROFILE QUICK EDIT MODALS */}
      {/* ========================================================================= */}

      {/* 1. Modal: Edit Avatar (with file upload & emojis) */}
      {showEditAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-blue-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Выберите аватар
              </h3>
              <button
                onClick={() => setShowEditAvatarModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex items-center justify-center py-2">
              <div className="w-20 h-20 rounded-full border-2 border-blue-400 bg-[#222840] flex items-center justify-center text-5xl overflow-hidden shadow-lg">
                {tempAvatar.startsWith('data:') || tempAvatar.startsWith('http') || tempAvatar.startsWith('/') ? (
                  <img src={tempAvatar} alt="Аватар" className="w-full h-full object-cover" />
                ) : (
                  <span>{tempAvatar}</span>
                )}
              </div>
            </div>

            {/* Upload from Device Button */}
            <label className="flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-2xl cursor-pointer transition-all text-xs font-bold">
              <Upload className="w-4 h-4" />
              <span>Загрузить фото с устройства</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </label>



            {/* Chat Photos Picker */}
            {chatPhotos.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8f9bff]">💬 Ваши фото из чата:</span>
                  <span className="text-[9px] text-zinc-400 font-mono">{chatPhotos.length} шт.</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 max-h-20 scrollbar-thin">
                  {chatPhotos.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        setTempAvatar(item.url);
                      }}
                      className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-transform ${
                        tempAvatar === item.url
                          ? 'border-[#8f9bff] scale-105 ring-2 ring-[#8f9bff]'
                          : 'border-white/10 hover:border-white/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt="Из чата" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Emoji Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-gray-400">Или выберите эмодзи:</span>
              <div className="grid grid-cols-4 gap-2">
                {EMOJI_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      triggerHaptic('tap');
                      setTempAvatar(emoji);
                    }}
                    className={`h-11 rounded-xl border text-2xl flex items-center justify-center transition-all cursor-pointer ${
                      tempAvatar === emoji
                        ? 'border-blue-400 bg-blue-500/30 scale-105 shadow-md'
                        : 'border-white/10 bg-black/25 hover:border-white/30'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onUpdateProfile({ ...userProfile, avatar: tempAvatar });
                setShowEditAvatarModal(false);
                soundManager.playBeep(1200, 0.08);
                showToast('Аватар обновлен');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* 2. Modal: Edit Name */}
      {showEditNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-blue-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-white text-sm">Изменить имя профиля</h3>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-black/25 border border-white/10 focus:border-blue-400 p-2.5 text-xs text-white rounded-xl outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowEditNameModal(false)}
                className="py-2.5 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onUpdateProfile({ ...userProfile, name: tempName });
                  setShowEditNameModal(false);
                  soundManager.playBeep(1200, 0.08);
                  showToast('Имя обновлено');
                }}
                className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Edit Status */}
      {showEditStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-blue-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-white text-sm">Изменить статус</h3>
            <input
              type="text"
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              placeholder="Например: В сети, Занят, Отдыхаю..."
              className="w-full bg-black/25 border border-white/10 focus:border-blue-400 p-2.5 text-xs text-white rounded-xl outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowEditStatusModal(false)}
                className="py-2.5 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onUpdateProfile({ ...userProfile, status: tempStatus });
                  setShowEditStatusModal(false);
                  soundManager.playBeep(1200, 0.08);
                  showToast('Статус обновлен');
                }}
                className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Edit Info Field */}
      {editingFieldKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-blue-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-white text-sm">Редактирование поля</h3>
            <input
              type="text"
              value={editingFieldVal}
              onChange={(e) => setEditingFieldVal(e.target.value)}
              placeholder="Введите значение..."
              className="w-full bg-black/25 border border-white/10 focus:border-blue-400 p-2.5 text-xs text-white rounded-xl outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setEditingFieldKey(null)}
                className="py-2.5 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveField}
                className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Change Phone Number */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-blue-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                Смена номера телефона
              </h3>
              <button onClick={() => setShowPhoneModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!phoneCodeStep ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  Введите ваш новый номер телефона для отправки проверочного SMS-кода:
                </p>
                <input
                  type="text"
                  value={newPhoneInput}
                  onChange={(e) => setNewPhoneInput(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-black/25 border border-white/10 focus:border-blue-400 p-2.5 text-xs text-white rounded-xl outline-none font-mono"
                />
                <button
                  onClick={() => {
                    if (newPhoneInput.trim()) {
                      setPhoneCodeStep(true);
                      soundManager.playBeep(1100, 0.05);
                    }
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Получить SMS-код
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">
                  Мы отправили 4-значный код на номер <span className="text-white font-bold">{newPhoneInput}</span>
                </p>
                <input
                  type="text"
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-black/25 border border-white/10 focus:border-blue-400 p-3 text-center text-lg text-white rounded-xl outline-none font-mono tracking-widest"
                />
                <button
                  onClick={() => {
                    onUpdateProfile({
                      ...userProfile,
                      phoneNumber: newPhoneInput,
                    });
                    setShowPhoneModal(false);
                    soundManager.playBeep(1200, 0.1);
                    showToast('Номер телефона успешно привязан!');
                  }}
                  className="w-full py-2.5 bg-[#8f9bff] text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Подтвердить номер
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Modal: Profile Color Picker */}
      {showColorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-purple-500 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                Цвет оформления профиля
              </h3>
              <button onClick={() => setShowColorModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 py-2">
              {['#8f9bff', '#2481cc', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onUpdateProfile({ ...userProfile, profileColor: color });
                    setShowColorModal(false);
                    soundManager.playBeep(1100, 0.05);
                    showToast('Цвет профиля изменен');
                  }}
                  style={{ backgroundColor: color }}
                  className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                >
                  {userProfile.profileColor === color && <Check className="w-5 h-5 text-black stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141823] border border-blue-500 rounded-3xl p-5 text-center shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-extrabold text-white text-sm">QR-код вашего профиля</h3>
              <button onClick={() => setShowQrModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <QrCode className="w-44 h-44 text-black" />
            </div>
            <p className="text-xs text-gray-400">
              Покажите этот код, чтобы быстро поделиться контактом
            </p>
            <button
              onClick={() => {
                setShowQrModal(false);
                showToast('QR-код сохранен');
              }}
              className="w-full py-2.5 bg-blue-600 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Cache Cleared Modal */}
      {showCacheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#171b28] border border-[#8f9bff] rounded-3xl p-5 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#8f9bff]/20 border border-[#8f9bff] flex items-center justify-center text-3xl mx-auto animate-bounce">
              🧹
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Кэш успешно очищен!</h3>
              <p className="text-xs text-gray-400 mt-1">Освобождено памяти на вашем устройстве:</p>
              <div className="text-xl font-black text-[#8f9bff] font-mono mt-2 bg-black/50 py-2 rounded-xl border border-[#8f9bff]/30">
                {clearedCacheAmount}
              </div>
            </div>
            <button
              onClick={() => setShowCacheModal(false)}
              className="w-full py-2.5 bg-[#8f9bff] text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
            >
              Отлично
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
