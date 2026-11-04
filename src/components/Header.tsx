import React, { useState } from 'react';
import { Search, MoreVertical, Flame, RefreshCw, Camera, User, ShieldCheck, Zap, Sparkles, Bell } from 'lucide-react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenUpdates: () => void;
  onOpenSettings: () => void;
  onOpenProfileDrawer?: () => void;
  userAvatar?: string;
  coolMode: boolean;
  onToggleCoolMode: () => void;
  activeTab: 'chats' | 'tools' | 'settings';
  yearOffset?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenUpdates,
  onOpenSettings,
  onOpenProfileDrawer,
  userAvatar = '🐵',
  coolMode,
  onToggleCoolMode,
  activeTab,
  yearOffset = 0,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [sirenFlashing, setSirenFlashing] = useState(false);
  const [screenshotAlert, setScreenshotAlert] = useState(false);

  const displayDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + yearOffset);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSirenClick = () => {
    soundManager.unlockContext();
    soundManager.playSiren();
    setSirenFlashing(true);
    setTimeout(() => {
      setSirenFlashing(false);
    }, 2800);
  };

  const handleTakeScreenshot = () => {
    soundManager.unlockContext();
    soundManager.playCameraClick();
    setScreenshotAlert(true);
    setTimeout(() => {
      setScreenshotAlert(false);
    }, 600);
  };

  return (
    <header className="relative bg-[#0b0d13]/60 backdrop-blur-2xl border-b border-white/[0.06] sticky top-0 z-30">
      {/* Siren Flash Overlay */}
      {sirenFlashing && (
        <div className="absolute inset-0 bg-red-600/40 animate-pulse pointer-events-none" />
      )}

      {/* Screenshot Red Alert Modal - pure red screen and siren */}
      {screenshotAlert && (
        <div className="fixed inset-0 bg-red-600 z-[100] flex items-center justify-center pointer-events-none animate-pulse" />
      )}

      <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-2.5 flex items-center justify-between font-sans">
        {/* Title, Brand & Online Status in Modern Messenger Style */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSirenClick}
            title="Красная сирена"
            className="text-xl sm:text-2xl hover:scale-115 active:scale-90 transition-transform cursor-pointer p-1.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 hover:border-white/30"
          >
            🚨
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-1 ${
                coolMode ? 'text-[#b8c0ff] animate-pulse drop-shadow-[0_0_12px_rgba(184,192,255,0.8)]' : 'text-white'
              }`}>
                {coolMode ? '🔥 ТЕЛЕГРАМ' : 'Телеграм'}
              </h1>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="text-[#34d399] font-semibold text-[10px] sm:text-[11px]">в сети</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 font-mono text-[10px] hidden xs:inline">4 182 900 онлайн</span>
            </div>
          </div>
        </div>

        {/* Action icons bar - Modern Messenger Style */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Profile Avatar Button */}
          {onOpenProfileDrawer && (
            <button
              onClick={() => {
                triggerHaptic('tap');
                soundManager.playBeep(1000, 0.05);
                onOpenProfileDrawer();
              }}
              title="Открыть профиль"
              className="w-9 h-9 rounded-2xl bg-white/[0.07] border border-white/10 hover:border-white/40 flex items-center justify-center text-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md relative group overflow-hidden"
            >
              {userAvatar && (userAvatar.startsWith('data:') || userAvatar.startsWith('http') || userAvatar.startsWith('blob:') || userAvatar.startsWith('/')) ? (
                <img src={userAvatar} alt="Аватар" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span>{userAvatar}</span>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#8f9bff] border-2 border-[#111114]" />
            </button>
          )}

          {/* Screenshot Camera Button */}
          <button
            onClick={handleTakeScreenshot}
            title="Сделать скриншот"
            className="p-2 text-gray-300 hover:text-[#8f9bff] hover:bg-white/[0.08] rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/10 active:scale-95"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Search Button */}
          {activeTab === 'chats' && (
            <button
              onClick={onOpenSearch}
              title="Поиск"
              className="p-2 text-gray-300 hover:text-[#8f9bff] hover:bg-white/[0.08] rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/10 active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Action Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              title="Меню действий"
              className="p-2 text-gray-300 hover:text-[#8f9bff] hover:bg-white/[0.08] rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/10 active:scale-95"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Action Menu Dropdown */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#151826]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden p-2 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100">
                  {onOpenProfileDrawer && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenProfileDrawer();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 text-[#8f9bff] hover:bg-[#8f9bff]/10 transition-all text-left cursor-pointer font-bold"
                    >
                      <User className="w-4 h-4 text-[#8f9bff]" />
                      <span>Мой профиль и данные</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onToggleCoolMode();
                      setShowMenu(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all text-left cursor-pointer ${
                      coolMode
                        ? 'bg-[#8f9bff]/15 text-[#8f9bff] border border-[#8f9bff]/40'
                        : 'text-gray-200 hover:bg-white/[0.08] hover:text-[#8f9bff]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-[#8f9bff]" />
                      <span>{coolMode ? 'Отключить крутой режим' : 'Крутой режим'}</span>
                    </span>
                    {coolMode && <span className="text-[10px] bg-[#8f9bff] text-black px-2 py-0.5 rounded-full font-black">ВКЛ</span>}
                  </button>

                  <div className="h-px bg-white/10 my-1" />

                  <button
                    onClick={() => {
                      handleTakeScreenshot();
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 text-gray-200 hover:bg-white/[0.08] hover:text-[#8f9bff] transition-all text-left cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-red-400" />
                    <span>Сделать снимок экрана</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenUpdates();
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 text-gray-200 hover:bg-white/[0.08] hover:text-[#8f9bff] transition-all text-left cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-[#8f9bff]" />
                    <span>Проверить обновления</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

