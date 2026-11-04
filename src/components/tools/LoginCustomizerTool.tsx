import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  KeyRound,
  Upload,
  Play,
  Save,
  RotateCcw,
  Sparkles,
  Check,
  Eye,
  Palette,
  Image as ImageIcon,
  Type,
  Smile,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  LoginCustomizationData,
  DEFAULT_LOGIN_CUSTOMIZATION
} from '../LoginScreen';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
  initialData?: LoginCustomizationData;
  onSave?: (data: LoginCustomizationData) => void;
  onLaunch?: (data: LoginCustomizationData) => void;
}

const COLOR_PRESETS = [
  { name: 'Неоновый изумруд', value: '#8f9bff' },
  { name: 'Электрик блю', value: '#00b4d8' },
  { name: 'Киберпанк янтарь', value: '#fbbf24' },
  { name: 'Аметистовый фиолет', value: '#c084fc' },
  { name: 'Рубиновый пламень', value: '#f43f5e' },
  { name: 'Чистый аквамарин', value: '#06b6d4' },
  { name: 'Золотой титан', value: '#eab308' },
];

const EMOJI_PRESETS = ['🚀', '🔐', '⚡', '👑', '👽', '💎', '🔥', '🛡️', '🌌', '🤖'];

export const LoginCustomizerTool: React.FC<ToolProps> = ({
  onClose,
  initialData,
  onSave,
  onLaunch,
}) => {
  const currentInitial = initialData || (() => {
    try {
      const saved = localStorage.getItem('app_login_customization');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LOGIN_CUSTOMIZATION;
  })();

  const [title, setTitle] = useState(currentInitial.title || 'войти в любой аккаунт');
  const [subtitle, setSubtitle] = useState(currentInitial.subtitle || '');
  const [buttonText, setButtonText] = useState(currentInitial.buttonText || 'войти');
  const [placeholderText, setPlaceholderText] = useState(currentInitial.placeholderText || 'Пароль');
  const [footerText, setFooterText] = useState(currentInitial.footerText || '');
  const [logoType, setLogoType] = useState<'emoji' | 'image' | 'none'>(currentInitial.logoType || 'emoji');
  const [logoValue, setLogoValue] = useState(currentInitial.logoValue || '🚀');
  const [customBgUrl, setCustomBgUrl] = useState(currentInitial.customBgUrl || '');
  const [cardBannerUrl, setCardBannerUrl] = useState(currentInitial.cardBannerUrl || '');
  const [accentColor, setAccentColor] = useState(currentInitial.accentColor || '#8f9bff');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'media' | 'style' | 'preview'>('text');

  const getCurrentConfig = (): LoginCustomizationData => ({
    title: title.trim() || 'войти в любой аккаунт',
    subtitle: subtitle.trim(),
    buttonText: buttonText.trim() || 'войти',
    placeholderText: placeholderText.trim() || 'Пароль',
    footerText: footerText.trim(),
    logoType,
    logoValue,
    customBgUrl: customBgUrl.trim(),
    cardBannerUrl: cardBannerUrl.trim(),
    accentColor,
  });

  const handleSave = () => {
    const data = getCurrentConfig();
    try {
      localStorage.setItem('app_login_customization', JSON.stringify(data));
    } catch {}
    if (onSave) {
      onSave(data);
    }
    triggerHaptic('success');
    soundManager.playBeep(1100, 0.1);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLaunch = () => {
    const data = getCurrentConfig();
    try {
      localStorage.setItem('app_login_customization', JSON.stringify(data));
    } catch {}
    triggerHaptic('heavy');
    soundManager.playBeep(1300, 0.15);
    if (onLaunch) {
      onLaunch(data);
    } else {
      // Fallback reload
      window.location.reload();
    }
  };

  const handleReset = () => {
    if (confirm('Сбросить все настройки окна входа к исходным?')) {
      setTitle(DEFAULT_LOGIN_CUSTOMIZATION.title);
      setSubtitle(DEFAULT_LOGIN_CUSTOMIZATION.subtitle);
      setButtonText(DEFAULT_LOGIN_CUSTOMIZATION.buttonText);
      setPlaceholderText(DEFAULT_LOGIN_CUSTOMIZATION.placeholderText);
      setFooterText(DEFAULT_LOGIN_CUSTOMIZATION.footerText || '');
      setLogoType(DEFAULT_LOGIN_CUSTOMIZATION.logoType);
      setLogoValue(DEFAULT_LOGIN_CUSTOMIZATION.logoValue);
      setCustomBgUrl(DEFAULT_LOGIN_CUSTOMIZATION.customBgUrl || '');
      setCardBannerUrl(DEFAULT_LOGIN_CUSTOMIZATION.cardBannerUrl || '');
      setAccentColor(DEFAULT_LOGIN_CUSTOMIZATION.accentColor || '#8f9bff');
      soundManager.playBeep(600, 0.08);
    }
  };

  const handleFileLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setLogoType('image');
          setLogoValue(ev.target.result);
          soundManager.playBeep(1000, 0.05);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setCardBannerUrl(ev.target.result);
          soundManager.playBeep(1000, 0.05);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setCustomBgUrl(ev.target.result);
          soundManager.playBeep(1000, 0.05);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ToolWrapper title="Редактор входа" onClose={onClose} headerColor="bg-[#121216] border-[#1e2232]">
      <div className="w-full h-full flex flex-col bg-[#0b0b0e] text-white overflow-hidden select-none">
        
        {/* Top Tab Bar */}
        <div className="p-2 sm:p-3 bg-[#12151f] border-b border-[#1e2232] flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playBeep(900, 0.03);
                setActiveTab('text');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'text' ? 'bg-[#8f9bff] text-black shadow-md' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Тексты и надписи</span>
            </button>

            <button
              onClick={() => {
                soundManager.playBeep(900, 0.03);
                setActiveTab('media');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'media' ? 'bg-[#8f9bff] text-black shadow-md' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Картинки и фото</span>
            </button>

            <button
              onClick={() => {
                soundManager.playBeep(900, 0.03);
                setActiveTab('style');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'style' ? 'bg-[#8f9bff] text-black shadow-md' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Цвет и стиль</span>
            </button>

            <button
              onClick={() => {
                soundManager.playBeep(900, 0.03);
                setActiveTab('preview');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preview' ? 'bg-[#8f9bff] text-black shadow-md' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Превью</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Сброс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: TEXTS */}
          {activeTab === 'text' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in">
              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-300 block">
                  1. Главный заголовок окна:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="войти в любой аккаунт"
                  className="w-full bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                />
                <span className="text-[11px] text-gray-500 block">
                  Этот текст пишется крупными буквами в центре окна входа.
                </span>
              </div>

              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-300 block">
                  2. Подзаголовок / описание (опционально):
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Введите пароль или любую фразу для входа..."
                  className="w-full bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                  <label className="text-xs font-bold text-gray-300 block">
                    3. Текст на кнопке входа:
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="войти"
                    className="w-full bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                  <label className="text-xs font-bold text-gray-300 block">
                    4. Подсказка в поле ввода (placeholder):
                  </label>
                  <input
                    type="text"
                    value={placeholderText}
                    onChange={(e) => setPlaceholderText(e.target.value)}
                    placeholder="Пароль"
                    className="w-full bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-300 block">
                  5. Нижний текст / примечание под формой:
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="Доступ открыт для всех пользователей"
                  className="w-full bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & IMAGES */}
          {activeTab === 'media' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in">
              
              {/* Logo / Avatar selection */}
              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-4">
                <label className="text-xs font-bold text-gray-200 flex items-center justify-between">
                  <span>Аватарка / Логотип входа:</span>
                  <span className="text-[11px] text-gray-400">Эмодзи или ваше фото</span>
                </label>

                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-xl overflow-hidden bg-black shrink-0"
                    style={{ borderColor: accentColor }}
                  >
                    {logoType === 'image' && logoValue ? (
                      <img src={logoValue} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      logoValue || '🚀'
                    )}
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить картинку</span>
                        <input type="file" accept="image/*" onChange={handleFileLogo} className="hidden" />
                      </label>

                      <button
                        onClick={() => {
                          const emo = prompt('Введите любой эмодзи:', logoValue) || logoValue;
                          setLogoType('emoji');
                          setLogoValue(emo);
                        }}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Smile className="w-3.5 h-3.5" />
                        <span>Ввести эмодзи</span>
                      </button>
                    </div>

                    {/* Quick Emojis */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {EMOJI_PRESETS.map((emo) => (
                        <button
                          key={emo}
                          onClick={() => {
                            setLogoType('emoji');
                            setLogoValue(emo);
                            soundManager.playBeep(900, 0.03);
                          }}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 text-base flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Banner Image */}
              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-200 flex items-center justify-between">
                  <span>Баннер / Картинка внутри карточки входа:</span>
                  {cardBannerUrl && (
                    <button
                      onClick={() => setCardBannerUrl('')}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Удалить
                    </button>
                  )}
                </label>
                
                {cardBannerUrl && (
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-white/10 mb-2">
                    <img src={cardBannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cardBannerUrl}
                    onChange={(e) => setCardBannerUrl(e.target.value)}
                    placeholder="Ссылка на картинку (https://...)"
                    className="flex-1 bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                  <label className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Файл</span>
                    <input type="file" accept="image/*" onChange={handleFileBanner} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Full Background Wallpaper */}
              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-200 flex items-center justify-between">
                  <span>Фоновое изображение экрана (Wallpaper):</span>
                  {customBgUrl && (
                    <button
                      onClick={() => setCustomBgUrl('')}
                      className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Удалить
                    </button>
                  )}
                </label>

                {customBgUrl && (
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-white/10 mb-2 relative">
                    <img src={customBgUrl} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-bold text-white">
                      Фон активен
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customBgUrl}
                    onChange={(e) => setCustomBgUrl(e.target.value)}
                    placeholder="Ссылка на фоновое изображение (https://...)"
                    className="flex-1 bg-[#0d1018] border border-white/15 focus:border-[#8f9bff] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                  <label className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Файл</span>
                    <input type="file" accept="image/*" onChange={handleFileBackground} className="hidden" />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: STYLE & COLORS */}
          {activeTab === 'style' && (
            <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in">
              <div className="bg-[#12151f] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-gray-200 block">
                  Акцентный цвет и свечение:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        setAccentColor(c.value);
                        soundManager.playBeep(1000, 0.04);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        accentColor === c.value
                          ? 'border-white bg-white/15 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shadow-md shrink-0"
                        style={{ backgroundColor: c.value }}
                      />
                      <span className="text-xs font-bold text-gray-200 truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PREVIEW */}
          {(activeTab === 'preview' || true) && (
            <div className="max-w-md mx-auto pt-2">
              <div className="text-center text-xs font-bold text-gray-400 mb-2 flex items-center justify-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Интерактивный предварительный просмотр:</span>
              </div>

              <div
                className="w-full bg-[#121216] border rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                style={{
                  borderColor: `${accentColor}40`,
                  boxShadow: `0 0 35px ${accentColor}20`,
                }}
              >
                {cardBannerUrl && (
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-white/10">
                    <img src={cardBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                {logoType !== 'none' && (
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-3 overflow-hidden"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      borderColor: accentColor,
                      borderWidth: 2,
                    }}
                  >
                    {logoType === 'image' && logoValue ? (
                      <img src={logoValue} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      logoValue || '🚀'
                    )}
                  </div>
                )}

                <h3 className="text-base font-black text-white mb-1 uppercase tracking-wide">
                  {title || 'войти в любой аккаунт'}
                </h3>

                {subtitle && (
                  <p className="text-[11px] text-gray-300 mb-3 leading-tight">{subtitle}</p>
                )}

                <div className="w-full space-y-2 mt-1">
                  <div
                    className="w-full bg-[#0d0d10] border rounded-xl py-2 px-3 text-center text-xs text-gray-400 font-mono"
                    style={{ borderColor: `${accentColor}40` }}
                  >
                    {placeholderText || 'Пароль'}
                  </div>

                  <div
                    className="w-full py-2.5 text-black font-black text-xs uppercase rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: accentColor }}
                  >
                    <KeyRound className="w-3.5 h-3.5 text-black" />
                    <span>{buttonText || 'войти'}</span>
                  </div>
                </div>

                {footerText && (
                  <p className="mt-3 text-[10px] text-gray-400">{footerText}</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Bar with "Запустить" & "Сохранить" */}
        <div className="p-3 sm:p-4 bg-[#12151f] border-t border-[#1e2232] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-extrabold uppercase rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 active:scale-95"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Сохранить настройки</span>
          </button>

          <button
            onClick={handleLaunch}
            className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.4)] active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Запустить систему</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl animate-in fade-in zoom-in-95 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Настройки экрана входа сохранены!</span>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
};
