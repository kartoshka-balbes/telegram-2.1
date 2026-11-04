import React, { useState } from 'react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';
import { KeyRound, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { AltLoginModal } from './AltLoginModal';

export interface LoginCustomizationData {
  title: string;
  subtitle: string;
  logoType: 'emoji' | 'image' | 'none';
  logoValue: string;
  buttonText: string;
  placeholderText: string;
  customBgUrl?: string;
  cardBannerUrl?: string;
  footerText?: string;
  accentColor?: string;
}

export const DEFAULT_LOGIN_CUSTOMIZATION: LoginCustomizationData = {
  title: 'войти в любой аккаунт',
  subtitle: '',
  logoType: 'emoji',
  logoValue: '🚀',
  buttonText: 'войти',
  placeholderText: 'Пароль',
  customBgUrl: '',
  cardBannerUrl: '',
  footerText: '',
  accentColor: '#8f9bff',
};

interface LoginScreenProps {
  onLoginSuccess?: (username?: string) => void;
  onLogin?: (username?: string) => void;
  customization?: LoginCustomizationData;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onLogin,
  customization = DEFAULT_LOGIN_CUSTOMIZATION,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlt, setShowAlt] = useState(false);

  const config = { ...DEFAULT_LOGIN_CUSTOMIZATION, ...customization };
  const accent = config.accentColor || '#8f9bff';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 16);
    setPassword(val);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      triggerHaptic('heavy');
      setError('Введите пароль для входа');
      soundManager.playBeep(350, 0.15);
      return;
    }
    triggerHaptic('success');
    soundManager.playBeep(900, 0.15);
    const callback = onLoginSuccess || onLogin;
    if (callback) {
      callback(password.trim() || 'Пользователь');
    }
  };

  return (
    <div
      id="login-screen-wrapper"
      className="min-h-screen w-full bg-[#08080a] flex items-center justify-center p-4 relative overflow-hidden select-none"
      style={
        config.customBgUrl
          ? {
              backgroundImage: `url(${config.customBgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Background Ambience / Overlay */}
      {config.customBgUrl ? (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-0" />
      ) : (
        <div className="absolute inset-0 bg-radial from-[#151822]/40 via-transparent to-black/90 pointer-events-none z-0" />
      )}

      {/* Кнопка сбоку: войти другим способом */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('tap');
          setShowAlt(true);
        }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-20 px-2 py-5 rounded-l-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-r-0 border-white/15 text-[11px] font-bold text-white cursor-pointer transition-colors"
        style={{ writingMode: 'vertical-rl' }}
      >
        Войти другим способом
      </button>
      {showAlt && <AltLoginModal accent={accent} onClose={() => setShowAlt(false)} />}

      {/* Main Login Card */}
      <div
        className="w-full max-w-sm bg-[#121216]/95 backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative z-10 transition-all duration-300 animate-in fade-in zoom-in-95"
        style={{
          borderColor: `${accent}40`,
          boxShadow: `0 0 45px ${accent}25, 0 20px 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Optional Custom Card Banner Image */}
        {config.cardBannerUrl && (
          <div className="w-full h-32 rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-lg relative shrink-0">
            <img
              src={config.cardBannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
          </div>
        )}

        {/* Logo / Avatar (Emoji or Custom Image) */}
        {config.logoType !== 'none' && (
          <>
            {config.logoType === 'image' && config.logoValue ? (
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-lg mb-4 shrink-0 bg-black/50 relative group"
                style={{
                  borderColor: accent,
                  boxShadow: `0 0 20px ${accent}40`,
                }}
              >
                <img
                  src={config.logoValue}
                  alt="Login Logo"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl mb-4 transform hover:scale-105 transition-all shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${accent}33, ${accent})`,
                  boxShadow: `0 0 25px ${accent}50`,
                }}
              >
                {config.logoValue || '🚀'}
              </div>
            )}
          </>
        )}

        {/* Custom Welcome Title */}
        <h1 className="text-lg sm:text-xl font-black text-white mb-1 uppercase tracking-wider leading-snug">
          {config.title || 'войти в любой аккаунт'}
        </h1>

        {/* Custom Subtitle */}
        {config.subtitle ? (
          <p className="text-xs text-gray-300/90 mb-5 font-sans leading-relaxed">
            {config.subtitle}
          </p>
        ) : (
          <div className="h-2" />
        )}

        {/* Password / Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-3.5 mt-1">
          <div className="w-full relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={password}
              maxLength={16}
              onChange={handlePasswordChange}
              placeholder={config.placeholderText || 'Пароль'}
              className="w-full bg-[#0d0d10] border rounded-2xl pl-10 pr-12 py-3 text-center text-sm sm:text-base text-white placeholder-gray-500 outline-none transition-all font-mono shadow-inner focus:ring-2"
              style={{
                borderColor: `${accent}50`,
              }}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">
              {password.length}/16
            </span>
          </div>

          {error && (
            <div className="text-rose-400 text-xs font-bold font-mono uppercase animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            onClick={() => triggerHaptic('tap')}
            className="w-full py-3.5 text-black font-black text-sm sm:text-base uppercase rounded-2xl transition-all cursor-pointer active:scale-95 shadow-lg flex items-center justify-center gap-2"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 25px ${accent}60`,
            }}
          >
            <KeyRound className="w-4 h-4 text-black" />
            <span>{config.buttonText || 'войти'}</span>
          </button>
        </form>

        {/* Optional Custom Footer Note */}
        {config.footerText && (
          <p className="mt-4 text-[11px] text-gray-400 font-sans leading-tight">
            {config.footerText}
          </p>
        )}
      </div>
    </div>
  );
};
