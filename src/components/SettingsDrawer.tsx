import React, { useState } from 'react';
import { useDisasterMode, setDisasterMode } from '../utils/disasterMode';
import { UserProfile, QualityLevel, AppTheme, FontFamilyType, LoginCustomizationData } from '../types';
import {
  X,
  Palette,
  Sparkles,
  Check,
  Tv,
  Eye,
  Trash2,
  Volume2,
  VolumeX,
  Sun,
  SunMedium,
  Zap,
  Sliders,
  Shield,
  Monitor,
  Upload,
  Play,
  Moon,
  Smartphone,
  Bell,
  Type,
  KeyRound,
  RotateCw,
  AlertTriangle,
  User,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';
import { WallpaperOptions, ChatWallpaperType } from './ChatBackground';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
}

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
    desc: 'Глубокий кибер-чёрный фон и светящийся лаймовый код',
    previewClass: 'bg-black border-[#00ff41] text-[#00ff41]',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    desc: 'Неоновый фиолетовый, ультрафиолет и бирюза',
    previewClass: 'bg-[#120024] border-[#a855f7] text-[#00f0ff]',
  },
  {
    id: 'sunset_gold',
    name: 'Sunset Gold',
    desc: 'Тёплый шоколадный градиент и золотистый янтарь',
    previewClass: 'bg-[#1c120c] border-[#f59e0b] text-[#f59e0b]',
  },
  {
    id: 'oled_black',
    name: 'OLED Pure Black',
    desc: 'Абсолютный контрастный чёрный цвет для AMOLED экранов',
    previewClass: 'bg-black border-white/80 text-white',
  },
  {
    id: 'windows_xp',
    name: 'Windows XP Classic',
    desc: 'Ностальгический сине-серебряный стиль Luna',
    previewClass: 'bg-[#0055ea] border-[#3882ff] text-white',
  },
];

const ACCENT_COLORS = [
  { id: '#8f9bff', name: 'Изумрудный', class: 'bg-[#8f9bff]' },
  { id: '#2481cc', name: 'Telegram Blue', class: 'bg-[#2481cc]' },
  { id: '#00f0ff', name: 'Неоновый Циан', class: 'bg-[#00f0ff]' },
  { id: '#f59e0b', name: 'Янтарное Золото', class: 'bg-[#f59e0b]' },
  { id: '#ef4444', name: 'Рубиновый Красный', class: 'bg-[#ef4444]' },
  { id: '#a855f7', name: 'Фиолетовый Неон', class: 'bg-[#a855f7]' },
  { id: '#ec4899', name: 'Розовый Коралл', class: 'bg-[#ec4899]' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onOpenProfileDrawer,
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
  chatWallpaper = 'cyber_emerald',
  onChangeChatWallpaper,
  loginCustomization,
  onUpdateLoginCustomization,
  onTestLoginScreen,
  onTriggerBsod,
}) => {
  const disasterMode = useDisasterMode();
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const [showCacheModal, setShowCacheModal] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [clearedCacheAmount, setClearedCacheAmount] = useState('45 819 203 Гб');

  // Login Screen Customizer Local State
  const [loginButtonText, setLoginButtonText] = useState(loginCustomization?.buttonText || 'войти');
  const [loginPlaceholder, setLoginPlaceholder] = useState(loginCustomization?.placeholderText || 'Пароль');
  const [loginLogoValue, setLoginLogoValue] = useState(loginCustomization?.logoValue || '🚀');
  const [loginLogoType, setLoginLogoType] = useState<'emoji' | 'image'>(loginCustomization?.logoType || 'emoji');
  const [loginBgUrl, setLoginBgUrl] = useState(loginCustomization?.customBgUrl || '');
  const [loginSavedMsg, setLoginSavedMsg] = useState(false);

  // Active Sessions Mock Data
  const [activeSessions, setActiveSessions] = useState([
    { device: 'Текущее устройство (Windows 11 / Chrome)', location: 'Москва, Россия', time: 'Активно сейчас', isCurrent: true },
    { device: 'Nokia 3310 (Symbian OS)', location: 'Сызрань, Россия', time: '2 секунды назад', isCurrent: false },
    { device: 'Siemens A35 (Кнопочный)', location: 'Саратов, Россия', time: '15 секунд назад', isCurrent: false },
  ]);

  if (!isOpen) return null;

  const handleSaveLoginSettings = () => {
    triggerHaptic('success');
    soundManager.playBeep(1100, 0.1);
    const updated: LoginCustomizationData = {
      title: 'войти в любой аккаунт',
      subtitle: '',
      buttonText: loginButtonText.trim() || 'войти',
      placeholderText: loginPlaceholder.trim() || 'Пароль',
      logoType: loginLogoType,
      logoValue: loginLogoValue,
      customBgUrl: loginBgUrl.trim(),
    };
    if (onUpdateLoginCustomization) {
      onUpdateLoginCustomization(updated);
    }
    localStorage.setItem('app_login_customization', JSON.stringify(updated));
    setLoginSavedMsg(true);
    setTimeout(() => setLoginSavedMsg(false), 3000);
  };

  const handleFileUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLoginLogoType('image');
        setLoginLogoValue(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUploadBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLoginBgUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCache = () => {
    triggerHaptic('heavy');
    soundManager.playDrillSound();
    setIsClearingCache(true);
    setTimeout(() => {
      const min = 1235646;
      const max = 78978461;
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      setClearedCacheAmount(`${val.toLocaleString('ru-RU')} Гб`);
      setIsClearingCache(false);
      setShowCacheModal(true);
    }, 1200);
  };

  // Volume and Brightness Sliders state
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Settings Drawer Panel */}
      <div className="w-full max-w-xl h-full bg-[#111114] border-l border-[#242428] text-white flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] relative z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#242428] flex items-center justify-between bg-[#16161b] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#1e1e26] border border-[#2d2d38] flex items-center justify-center text-[#8f9bff]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white tracking-wide">Настройки</h2>
              <span className="text-[11px] text-gray-400">Персонализация и управление приложением</span>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('tap');
              onClose();
            }}
            className="p-2 rounded-2xl bg-[#1e1e26] border border-[#2d2d38] text-gray-400 hover:text-white hover:border-[#8f9bff] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          
          {/* HARDWARE SLIDERS: MASTER VOLUME & BRIGHTNESS */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
                <SlidersHorizontal className="w-4 h-4 text-[#8f9bff]" />
                Громкость и Яркость
              </h4>
              <span className="text-[10px] text-gray-400 font-mono">Мгновенная регулировка</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Master Volume */}
              <div className="bg-[#121217] border border-[#272b3d] rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    {currentVolume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#8f9bff]" />
                    )}
                    <span>Звук</span>
                  </div>
                  <span className="font-mono font-bold text-[#8f9bff] text-xs">
                    {Math.round(currentVolume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVolumeChange(currentVolume === 0 ? 0.7 : 0)}
                    title={currentVolume === 0 ? 'Включить звук' : 'Выключить звук'}
                    className="p-1 rounded-lg text-gray-400 hover:text-white bg-[#1e1e26] cursor-pointer"
                  >
                    {currentVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(currentVolume * 100)}
                    onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-[#272b3d] rounded-lg appearance-none cursor-pointer accent-[#8f9bff]"
                  />
                </div>
              </div>

              {/* Screen Brightness */}
              <div className="bg-[#121217] border border-[#272b3d] rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Яркость</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {Math.round(currentBrightness * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBrightnessChange(currentBrightness < 1 ? 1 : 0.5)}
                    title="Сброс на 100%"
                    className="p-1 rounded-lg text-gray-400 hover:text-white bg-[#1e1e26] cursor-pointer"
                  >
                    <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={Math.round(currentBrightness * 100)}
                    onChange={(e) => handleBrightnessChange(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-[#272b3d] rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Quick Card */}
          <div
            onClick={() => {
              triggerHaptic('tap');
              soundManager.playBeep(1000, 0.05);
              onClose();
              if (onOpenProfileDrawer) onOpenProfileDrawer();
            }}
            className="bg-[#161a27] border border-[#272b3d] hover:border-[#8f9bff] rounded-2xl p-3.5 shadow-md cursor-pointer flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#20202a] border-2 border-[#8f9bff] flex items-center justify-center text-2xl shrink-0 shadow-sm overflow-hidden">
                {userProfile.avatar && (userProfile.avatar.startsWith('data:') || userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('/')) ? (
                  <img src={userProfile.avatar} alt="Аватар" className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.avatar || '🐵'}</span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-[#8f9bff] transition-colors">
                  {userProfile.name || 'Пользователь'}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {userProfile.status || 'В сети'}
                </p>
                <span className="text-[10px] text-[#8f9bff] block mt-0.5">
                  Открыть профиль, приватность и аватар →
                </span>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-[#8f9bff] text-black font-extrabold rounded-xl text-[10px] uppercase shrink-0">
              Профиль
            </div>
          </div>

          {/* 1. THEMES SELECTOR */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Palette className="w-4 h-4 text-[#8f9bff]" />
              Темы интерфейса
            </h4>
            <p className="text-[11px] text-gray-400">
              Выберите цветовую схему и визуальный стиль всей экосистемы:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {THEMES_LIST.map((th) => {
                const isSelected = theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(1000, 0.05);
                      if (onChangeTheme) onChangeTheme(th.id);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8f9bff] bg-[#8f9bff]/10 shadow-[0_0_15px_rgba(143,155,255,0.25)] ring-1 ring-[#8f9bff]'
                        : 'border-[#272b3d] bg-[#12151f] hover:border-[#8f9bff]/50 hover:bg-[#1a1a22]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 ${th.previewClass}`}>
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-xs flex items-center justify-between">
                        <span>{th.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8f9bff] shrink-0" />}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">
                        {th.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ACCENT COLORS */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#8f9bff]" />
              Цветовые акценты приложения
            </h4>
            <p className="text-[11px] text-gray-400">
              Цвет кнопок, активных иконок, подсветки и элементов управления:
            </p>

            <div className="flex items-center gap-2.5 flex-wrap">
              {ACCENT_COLORS.map((col) => {
                const isSelected = accentColor === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      triggerHaptic('tap');
                      soundManager.playBeep(1100, 0.04);
                      if (onChangeAccentColor) onChangeAccentColor(col.id);
                    }}
                    title={col.name}
                    className={`w-10 h-10 rounded-2xl ${col.class} transition-all transform flex items-center justify-center cursor-pointer shadow-md ${
                      isSelected
                        ? 'ring-3 ring-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-black font-black" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. FONTS & TEXT SIZE */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Type className="w-4 h-4 text-[#8f9bff]" />
              Шрифт и размер текста
            </h4>

            <div>
              <span className="font-bold text-gray-300 block mb-1.5 text-[11px]">Шрифт системы:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sans', name: 'Стандартный Sans' },
                  { id: 'display', name: 'Премиум Serif' },
                  { id: 'mono', name: 'Моноширинный' },
                  { id: 'pixel', name: 'Пиксельный' },
                  { id: 'comic', name: 'Комикс' },
                  { id: 'serif', name: 'Классический' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      triggerHaptic('tap');
                      if (onChangeFontFamily) onChangeFontFamily(f.id as FontFamilyType);
                    }}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer truncate ${
                      fontFamily === f.id
                        ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-sm'
                        : 'bg-[#12151f] text-gray-300 border-[#272b3d] hover:border-[#8f9bff]/50'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#272b3d]">
              <span className="font-bold text-gray-300 block mb-1.5 text-[11px]">Размер шрифта:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      triggerHaptic('tap');
                      onChangeFontSize(sz);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      fontSize === sz
                        ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-sm'
                        : 'bg-[#12151f] text-gray-400 border-[#272b3d] hover:border-[#8f9bff]/50'
                    }`}
                  >
                    {sz === 'small' ? 'Мелкий' : sz === 'medium' ? 'Обычный' : 'Крупный'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. CHAT WALLPAPERS */}
          {onChangeChatWallpaper && (
            <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
              <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-[#8f9bff]" />
                Фон чата
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {WallpaperOptions.map((wp) => {
                  const isSelected = chatWallpaper === wp.id;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        onChangeChatWallpaper(wp.id);
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#8f9bff] bg-[#8f9bff]/15 shadow-[0_0_12px_rgba(143,155,255,0.3)]'
                          : 'border-[#272b3d] bg-[#12151f] hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-full h-10 rounded-lg ${wp.previewClass} border border-white/10`} />
                      <span className="text-[11px] font-bold text-white text-center leading-tight">
                        {wp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. BLUE SCREEN OF DEATH (BSOD) - Direct trigger */}
          <div className="bg-[#161a27] border border-red-500/40 rounded-2xl p-4 space-y-3 shadow-md">
            <h4 className="font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Экран смерти (BSOD)
            </h4>

            <button
              onClick={() => {
                triggerHaptic('heavy');
                onClose();
                if (onTriggerBsod) onTriggerBsod();
              }}
              className="w-full py-3 bg-red-600/30 hover:bg-red-600/60 border border-red-500 text-red-200 font-extrabold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs shadow-md active:scale-98"
            >
              <Monitor className="w-4 h-4 text-red-400" />
              <span>Вызвать экран смерти</span>
            </button>
          </div>

          {/* 7. VIDEO & DISPLAY MODES */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Tv className="w-4 h-4 text-[#8f9bff]" />
              Видео и режимы отображения
            </h4>

            <div>
              <span className="font-bold text-gray-300 block mb-2 text-[11px]">Качество видео:</span>
              <div className="grid grid-cols-5 gap-1.5">
                {(['144p', '240p', '360p', '480p', '720p', '1080p', '2k', '4k', '8k', '16k'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      triggerHaptic('tap');
                      if (onChangeQuality) onChangeQuality(q);
                    }}
                    className={`py-1.5 rounded-xl font-mono font-bold uppercase text-[10px] border transition-all cursor-pointer ${
                      quality === q
                        ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-sm'
                        : 'bg-[#12151f] text-gray-400 border-[#272b3d] hover:border-[#8f9bff]/50 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#272b3d]">
              <div className="flex items-center justify-between p-2.5 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Eye className="w-4 h-4 text-purple-400" /> VR режим
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onToggleVrMode) onToggleVrMode();
                  }}
                  className={`px-3 py-1 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    vrMode ? 'bg-purple-500 text-black shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {vrMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <Tv className="w-4 h-4 text-amber-400" /> Режим кинотеатра
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onToggleCinemaMode) onToggleCinemaMode();
                  }}
                  className={`px-3 py-1 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    cinemaMode ? 'bg-amber-400 text-black shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {cinemaMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>
          </div>

          {/* 8. COOL MODE & POWER SAVING */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Moon className="w-4 h-4 text-[#8f9bff]" />
              Производительность и спецрежимы
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <div className="font-bold text-white flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Крутой режим
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    onToggleCoolMode();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    coolMode ? 'bg-amber-400 text-black shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {coolMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <div className="font-bold text-white flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Режим катастрофы
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    setDisasterMode(!disasterMode);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    disasterMode ? 'bg-red-600 text-white shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {disasterMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <div>
                  <span className="font-bold text-white block text-xs flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Режим экономии энергии
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Снижает частоту анимаций</span>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onTogglePowerSavingMode) onTogglePowerSavingMode();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    powerSavingMode ? 'bg-[#8f9bff] text-black shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {powerSavingMode ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <div className="font-bold text-white flex items-center gap-2 text-xs">
                  <Volume2 className="w-4 h-4 text-[#8f9bff]" />
                  Звук при отправке сообщений
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    if (onToggleSendSound) onToggleSendSound();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    sendSoundEnabled ? 'bg-[#8f9bff] text-black shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {sendSoundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>
          </div>

          {/* 9. NOTIFICATIONS & STORAGE */}
          <div className="bg-[#161a27] border border-[#272b3d] rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-[#8f9bff] uppercase tracking-wider flex items-center gap-2 text-xs">
              <Bell className="w-4 h-4 text-[#8f9bff]" />
              Уведомления и память
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#12151f] border border-[#272b3d] rounded-xl">
                <div>
                  <span className="font-bold text-white block text-xs">Случайные уведомления</span>
                  <span className="text-[10px] text-gray-400">Симулирует входящие сообщения</span>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('tap');
                    onToggleNotifications(!notificationsEnabled);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold uppercase text-[10px] cursor-pointer transition-all ${
                    notificationsEnabled ? 'bg-[#8f9bff] text-black shadow-sm' : 'bg-[#1e2232] text-gray-400 border border-[#272b3d]'
                  }`}
                >
                  {notificationsEnabled ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>

              {/* Clear Cache */}
              <div className="p-3 bg-[#12151f] border border-[#272b3d] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-xs flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-orange-400" /> Очистить кэш
                  </span>
                  <span className="text-[10px] text-gray-400">Освобождает временные файлы</span>
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
              <div className="p-3 bg-[#12151f] border border-[#272b3d] rounded-xl">
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
                  <div className="mt-3 space-y-2 pt-2 border-t border-[#272b3d]">
                    {activeSessions.map((s, idx) => (
                      <div key={idx} className="p-2 bg-[#171b28] border border-[#272b3d] rounded-lg text-[10px] flex items-center justify-between">
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
                            className="text-red-400 hover:text-red-300 text-[10px] font-bold p-1"
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
          </div>

          {/* Version Footer */}
          <div className="text-center py-3 border-t border-[#242428] text-gray-500 font-mono text-[11px]">
            Версия приложения: <span className="text-[#8f9bff] font-bold">0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1</span>
          </div>

        </div>
      </div>

      {/* CACHE CLEARED MODAL */}
      {showCacheModal && (
        <div className="fixed inset-0 bg-black/85 z-[150] flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-xs bg-[#161a27] border-2 border-[#8f9bff] rounded-2xl p-5 text-center shadow-[0_0_40px_rgba(143,155,255,0.3)] space-y-4">
            <div className="w-12 h-12 bg-[#8f9bff]/20 border border-[#8f9bff] rounded-full flex items-center justify-center text-2xl mx-auto">
              🧹
            </div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Кэш успешно очищен!</h3>
            <p className="text-[#8f9bff] font-mono font-bold text-sm bg-[#12151f] p-3 border border-[#272b3d] rounded-xl">
              Очищено: {clearedCacheAmount}
            </p>
            <button
              onClick={() => setShowCacheModal(false)}
              className="w-full py-2.5 bg-[#8f9bff] text-black font-extrabold uppercase rounded-xl cursor-pointer hover:bg-[#b8c0ff] transition-all"
            >
              Отлично
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
