import React, { useState, useEffect } from 'react';
import {
  Battery,
  BatteryCharging,
  Clock,
  Calendar,
  Wifi,
  Bluetooth,
  Headphones,
  Zap,
  Volume2,
  Signal,
  Languages,
  Globe,
  Check
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';

interface TopStatusBarProps {
  yearOffset?: number;
  powerSavingMode?: boolean;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({ yearOffset = 0, powerSavingMode = false }) => {
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [isCharging, setIsCharging] = useState(true);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [hasBluetooth] = useState(true);
  const [hasHeadphones] = useState(true);

  // Keyboard Layout state (RU / EN)
  const [layout, setLayout] = useState<'RU' | 'EN'>(() => {
    return (localStorage.getItem('app_keyboard_layout') as 'RU' | 'EN') || 'RU';
  });
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  // Continuously changing battery level
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      const nextBattery = Math.floor(Math.random() * 100) + 1;
      setBatteryLevel(nextBattery);
      setIsCharging(Math.random() > 0.4);
    }, 2000);

    return () => clearInterval(batteryInterval);
  }, []);

  // Clock & Date updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      now.setFullYear(now.getFullYear() + yearOffset);
      setTimeStr(now.toLocaleTimeString('ru-RU'));
      setDateStr(now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };

    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, [yearOffset]);

  // Global Keyboard listener for layout switching and physical key detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Switch on Alt+Shift, Ctrl+Shift, Meta+Space
      if (
        (e.altKey && e.shiftKey) ||
        (e.ctrlKey && e.shiftKey) ||
        (e.metaKey && e.code === 'Space')
      ) {
        setLayout((prev) => {
          const next = prev === 'RU' ? 'EN' : 'RU';
          localStorage.setItem('app_keyboard_layout', next);
          soundManager.playBeep(950, 0.05);
          triggerHaptic('tap');
          return next;
        });
        return;
      }

      // Auto-detect based on typed characters
      if (e.key && e.key.length === 1) {
        if (/[а-яА-ЯёЁ]/.test(e.key)) {
          if (layout !== 'RU') {
            setLayout('RU');
            localStorage.setItem('app_keyboard_layout', 'RU');
          }
        } else if (/[a-zA-Z]/.test(e.key)) {
          if (layout !== 'EN') {
            setLayout('EN');
            localStorage.setItem('app_keyboard_layout', 'EN');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layout]);

  const toggleLayout = () => {
    triggerHaptic('tap');
    soundManager.playBeep(850, 0.05);
    const next = layout === 'RU' ? 'EN' : 'RU';
    setLayout(next);
    localStorage.setItem('app_keyboard_layout', next);
  };

  const getBatteryColor = () => {
    if (powerSavingMode) return 'text-amber-400';
    if (batteryLevel > 60) return 'text-[#8f9bff]';
    if (batteryLevel > 20) return 'text-amber-400';
    return 'text-red-400 animate-pulse';
  };

  return (
    <div className="bg-[#0c0d12] border-b border-[#222840] px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-gray-300 z-40 shrink-0 select-none relative shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
      {/* Left: Clock & Date */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-extrabold text-[#8f9bff]">
          <Clock className="w-3.5 h-3.5 text-[#8f9bff]" />
          {timeStr || '00:00:00'}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400/80 hidden sm:flex">
          <Calendar className="w-3.5 h-3.5 text-[#6f7df0]" />
          {dateStr}
        </span>
      </div>

      {/* Right: Keyboard Layout Tool & Phone Status Icons */}
      <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
        {/* Working Keyboard Layout Selector Tool */}
        <div className="relative">
          <button
            onClick={toggleLayout}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowLayoutMenu(!showLayoutMenu);
            }}
            title="Раскладка клавиатуры (нажмите для смены RU/EN или сочетанием Shift+Alt)"
            className="flex items-center gap-1 bg-[#171923] hover:bg-[#1e222f] text-[#8f9bff] border border-[#8f9bff]/40 hover:border-[#8f9bff] px-2 py-0.5 rounded-lg font-bold text-[10px] cursor-pointer shadow-[0_0_8px_rgba(143,155,255,0.2)] transition-all active:scale-95"
          >
            <Languages className="w-3 h-3 text-[#8f9bff]" />
            <span className="tracking-wider">{layout === 'RU' ? '🇷🇺 RU' : '🇬🇧 EN'}</span>
          </button>

          {/* Quick Layout Dropdown Menu */}
          {showLayoutMenu && (
            <div className="absolute right-0 top-full mt-1.5 bg-[#151821] border border-[#8f9bff]/50 rounded-xl p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-50 min-w-[120px] flex flex-col gap-1">
              <button
                onClick={() => {
                  setLayout('RU');
                  localStorage.setItem('app_keyboard_layout', 'RU');
                  setShowLayoutMenu(false);
                  soundManager.playBeep(900, 0.05);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                  layout === 'RU' ? 'bg-[#8f9bff] text-black' : 'text-gray-200 hover:bg-[#212533]'
                }`}
              >
                <span>🇷🇺 Русский (RU)</span>
                {layout === 'RU' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setLayout('EN');
                  localStorage.setItem('app_keyboard_layout', 'EN');
                  setShowLayoutMenu(false);
                  soundManager.playBeep(900, 0.05);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                  layout === 'EN' ? 'bg-[#8f9bff] text-black' : 'text-gray-200 hover:bg-[#212533]'
                }`}
              >
                <span>🇬🇧 English (EN)</span>
                {layout === 'EN' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {powerSavingMode && (
          <span
            className="flex items-center gap-1 text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded-lg border border-amber-500/50 font-bold text-[10px]"
            title="Режим энергосбережения активен"
          >
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="hidden md:inline">ЭКО</span>
          </span>
        )}

        {hasHeadphones && (
          <span className="flex items-center text-emerald-400" title="Наушники подключены">
            <Headphones className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        )}

        {hasBluetooth && (
          <span className="flex items-center text-emerald-400" title="Bluetooth активен">
            <Bluetooth className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        )}

        <span className="flex items-center text-emerald-400/70 hidden sm:flex" title="Звуковой профиль">
          <Volume2 className="w-3.5 h-3.5" />
        </span>

        <span className="flex items-center gap-0.5 text-emerald-400 text-[10px] font-bold" title="Сотовая сеть">
          <Signal className="w-3 h-3 text-emerald-400" />
          <span className="hidden sm:inline">LTE</span>
        </span>

        <span className="flex items-center gap-0.5 text-[#8f9bff] text-[10px] font-bold" title="Wi-Fi">
          <Wifi className="w-3 h-3 text-[#8f9bff]" />
          <span>5G+</span>
        </span>

        {/* Dynamic Battery indicator */}
        <div className={`flex items-center gap-1 font-bold ${getBatteryColor()}`} title={`Батарея: ${batteryLevel}%`}>
          {isCharging ? (
            <BatteryCharging className="w-4 h-4 text-[#8f9bff] animate-bounce" />
          ) : (
            <Battery className="w-4 h-4" />
          )}
          <span className="font-mono">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};
