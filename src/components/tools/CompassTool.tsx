import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { X, AlertCircle, HelpCircle, Loader2, Clock } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';


interface ToolProps {
  onClose: () => void;
}

type ExitStage =
  | 'none'
  | 'confirm1'
  | 'shop_countdown'
  | 'darkened_exit'
  | 'confirm2'
  | 'corner_cross_top'
  | 'corner_cross_bottom';

export const CompassTool: React.FC<ToolProps> = ({ onClose }) => {
  const [heading, setHeading] = useState(0);

  // Exit flow state machine
  const [exitStage, setExitStage] = useState<ExitStage>('none');
  const [shopCountdown, setShopCountdown] = useState(7);
  const [exitButtonSeconds, setExitButtonSeconds] = useState(3);
  const [waitTimerCount, setWaitTimerCount] = useState(0);

  // Corner positions for stage 6 & 7
  const [topCorner, setTopCorner] = useState<'top-left' | 'top-right'>('top-right');
  const [bottomCorner, setBottomCorner] = useState<'bottom-left' | 'bottom-right'>('bottom-left');

  useEffect(() => {
    let animId: number;
    let speed = 0.8;

    const animate = () => {
      setHeading((prev) => (prev + speed) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const normHeading = Math.round(((heading % 360) + 360) % 360);

  const getDirectionName = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'Север (С)';
    if (deg >= 22.5 && deg < 67.5) return 'Северо-Восток (СВ)';
    if (deg >= 67.5 && deg < 112.5) return 'Восток (В)';
    if (deg >= 112.5 && deg < 157.5) return 'Юго-Восток (ЮВ)';
    if (deg >= 157.5 && deg < 202.5) return 'Юг (Ю)';
    if (deg >= 202.5 && deg < 247.5) return 'Юго-Запад (ЮЗ)';
    if (deg >= 247.5 && deg < 292.5) return 'Запад (З)';
    if (deg >= 292.5 && deg < 337.5) return 'Северо-Запад (СЗ)';
    return 'Север (С)';
  };

  // STEP 1: Attempt to close tool -> opens confirmation 1
  const handleAttemptClose = () => {
    soundManager.playBeep(750, 0.05);
    setExitStage('confirm1');
  };

  // STEP 2: Countdown 7 to 0 on shop fullscreen
  useEffect(() => {
    if (exitStage === 'shop_countdown') {
      if (shopCountdown > 0) {
        const timer = setTimeout(() => {
          setShopCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [exitStage, shopCountdown]);

  // STEP 4: 3-second wait until "Выйти" button becomes active
  useEffect(() => {
    if (exitStage === 'darkened_exit') {
      if (exitButtonSeconds > 0) {
        const timer = setTimeout(() => {
          setExitButtonSeconds((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [exitStage, exitButtonSeconds]);

  // STEP 6: Waiting timer counter animation
  useEffect(() => {
    if (exitStage === 'corner_cross_top' || exitStage === 'corner_cross_bottom') {
      const interval = setInterval(() => {
        setWaitTimerCount((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [exitStage]);

  // Transitions handlers:
  const handleConfirm1Yes = () => {
    soundManager.playBeep(850, 0.05);
    setShopCountdown(7);
    setExitStage('shop_countdown');
  };

  const handleConfirm1No = () => {
    soundManager.playBeep(600, 0.05);
    setExitStage('none');
  };

  const handleCloseShopAtZero = () => {
    soundManager.playBeep(900, 0.05);
    setExitButtonSeconds(3);
    setExitStage('darkened_exit');
  };

  const handleDarkenedExitClick = () => {
    if (exitButtonSeconds > 0) return;
    soundManager.playBeep(1000, 0.05);
    setExitStage('confirm2');
  };

  const handleConfirm2Yes = () => {
    soundManager.playBeep(1100, 0.05);
    setTopCorner(Math.random() < 0.5 ? 'top-left' : 'top-right');
    setWaitTimerCount(0);
    setExitStage('corner_cross_top');
  };

  const handleConfirm2No = () => {
    soundManager.playBeep(600, 0.05);
    setExitStage('none');
  };

  const handleTopCornerCrossClick = () => {
    soundManager.playBeep(1200, 0.06);
    setBottomCorner(topCorner === 'top-left' ? 'bottom-right' : 'bottom-left');
    setExitStage('corner_cross_bottom');
  };

  const handleFinalBottomCornerCrossClick = () => {
    soundManager.playBeep(1400, 0.15);
    onClose();
  };

  return (
    <ToolWrapper title="Компас" onClose={handleAttemptClose}>
      
      {/* ========================================================================= */}
      {/* 1. CONFIRMATION 1 MODAL: "Вы хотите выйти? - Да / Нет" */}
      {/* ========================================================================= */}
      {exitStage === 'confirm1' && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-cyan-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <HelpCircle className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
            <h3 className="text-lg font-black text-white font-sans">Вы хотите выйти?</h3>
            <p className="text-xs text-slate-400">Подтвердите действие для завершения работы компаса</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleConfirm1Yes}
                className="py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg shadow-red-600/30 transition-all active:scale-95"
              >
                Да
              </button>
              <button
                onClick={handleConfirm1No}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded-xl border border-slate-700 cursor-pointer transition-all active:scale-95"
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2 & 3. FULLSCREEN SHOP IMAGE WITH 7 -> 0 TIMER & "ЗАКРЫТЬ" BUTTON */}
      {/* ========================================================================= */}
      {exitStage === 'shop_countdown' && (
        <div className="fixed inset-0 bg-[#090b10] z-[100] flex flex-col items-center justify-center p-6 select-none overflow-hidden animate-in fade-in">
          {/* Authentic Sponsor Billboard Card */}
          <div className="w-full max-w-md bg-gradient-to-b from-[#181d28] via-[#10141d] to-[#0a0d13] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4 relative">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase rounded-full tracking-wider">
              Спонсор навигации
            </span>
            <div className="text-5xl">🧭</div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Экипировка «Экспедиция & Туризм»
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Надёжные компасы, спутниковые трекеры, термобельё и спальные мешки для суровых условий тайги и горных походов.
            </p>
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5 text-[11px] text-amber-300 font-mono">
              Скидка 15% по промокоду: КОМПАС-2026
            </div>
          </div>

          {/* Floating Timer Badge (7 down to 0) */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 border-2 border-amber-400 px-6 py-3 rounded-2xl text-center shadow-2xl backdrop-blur-md">
            <span className="text-[10px] text-amber-300 font-mono font-bold uppercase block tracking-wider">
              Таймер выхода:
            </span>
            <span className="text-4xl font-black font-mono text-white">
              {shopCountdown}
            </span>
          </div>

          {/* At 0, "Закрыть" button appears */}
          {shopCountdown === 0 && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4 animate-in zoom-in-90 duration-200">
              <button
                onClick={handleCloseShopAtZero}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all active:scale-95"
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DARKENED SPONSOR SCREEN WITH 3-SECOND DELAYED "ВЫЙТИ" BUTTON */}
      {/* ========================================================================= */}
      {exitStage === 'darkened_exit' && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in">
          <div className="w-full max-w-md p-6 opacity-30 text-center space-y-2 pointer-events-none">
            <div className="text-4xl">🏕️</div>
            <div className="text-sm font-bold text-gray-400 uppercase">Экспедиция & Туризм</div>
          </div>

          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
            <button
              onClick={handleDarkenedExitClick}
              disabled={exitButtonSeconds > 0}
              className={`w-full max-w-xs py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-2xl ${
                exitButtonSeconds === 0
                  ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-red-600/50 active:scale-95 animate-pulse'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-70'
              }`}
            >
              {exitButtonSeconds > 0 ? `Выйти (${exitButtonSeconds}...)` : 'Выйти'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONFIRMATION 2 MODAL: "Вы точно хотите выйти? - Да / Нет" */}
      {/* ========================================================================= */}
      {exitStage === 'confirm2' && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-red-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-white font-sans">Вы точно хотите выйти?</h3>
            <p className="text-xs text-slate-400">Это последнее подтверждение завершения сессии</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleConfirm2Yes}
                className="py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg shadow-red-600/30 transition-all active:scale-95"
              >
                Да
              </button>
              <button
                onClick={handleConfirm2No}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase rounded-xl border border-slate-700 cursor-pointer transition-all active:scale-95"
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. WAITING TIMER + SMALL WHITE CROSS IN RANDOM TOP CORNER */}
      {/* ========================================================================= */}
      {exitStage === 'corner_cross_top' && (
        <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-6 select-none animate-in fade-in">
          
          {/* Waiting Timer display in center */}
          <div className="text-center space-y-3">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Таймер ожидания завершения
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Прошло: {waitTimerCount} сек. Ожидание отклика системы...
              </p>
            </div>
          </div>

          {/* Small White X in Top Left or Top Right */}
          <button
            onClick={handleTopCornerCrossClick}
            className={`fixed p-2 rounded-lg bg-white/10 hover:bg-white/30 text-white cursor-pointer transition-all ${
              topCorner === 'top-left' ? 'top-4 left-4' : 'top-4 right-4'
            }`}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7 & 8. CROSS MOVED TO RANDOM BOTTOM CORNER -> SECOND CLICK FINALLY CLOSES */}
      {/* ========================================================================= */}
      {exitStage === 'corner_cross_bottom' && (
        <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-6 select-none animate-in fade-in">
          
          {/* Waiting Timer display in center */}
          <div className="text-center space-y-3">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Таймер ожидания завершения
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Прошло: {waitTimerCount} сек. Повторное подтверждение...
              </p>
            </div>
          </div>

          {/* Small White X in Bottom Left or Bottom Right */}
          <button
            onClick={handleFinalBottomCornerCrossClick}
            className={`fixed p-2 rounded-lg bg-white/10 hover:bg-white/30 text-white cursor-pointer transition-all ${
              bottomCorner === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'
            }`}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN COMPASS UI (ACTIVE WHEN exitStage === 'none') */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full p-6 text-center select-none">
        {/* Compass Ring */}
        <div className="relative w-72 h-72 bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-cyan-500/40 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
          {/* Bezel marks */}
          <div className="absolute inset-2 border border-slate-700/60 rounded-full" />
          
          {/* Dial with labels & ticks */}
          <div
            className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-linear"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Main directions */}
            <span className="absolute top-4 font-black text-red-500 text-xl font-mono">С</span>
            <span className="absolute bottom-4 font-black text-slate-300 text-xl font-mono">Ю</span>
            <span className="absolute right-4 font-black text-slate-300 text-xl font-mono">В</span>
            <span className="absolute left-4 font-black text-slate-300 text-xl font-mono">З</span>

            {/* Intermediate directions */}
            <span className="absolute top-10 right-10 text-xs font-bold text-slate-400 font-mono">СВ</span>
            <span className="absolute bottom-10 right-10 text-xs font-bold text-slate-400 font-mono">ЮВ</span>
            <span className="absolute bottom-10 left-10 text-xs font-bold text-slate-400 font-mono">ЮЗ</span>
            <span className="absolute top-10 left-10 text-xs font-bold text-slate-400 font-mono">СЗ</span>

            {/* Tick marks */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-3 bg-slate-700"
                style={{ transform: `rotate(${i * 30}deg) translateY(-120px)` }}
              />
            ))}
          </div>

          {/* Needle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-28 relative flex flex-col items-center justify-between">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[50px] border-b-red-500 shadow-lg" />
              <div className="w-3 h-3 rounded-full bg-cyan-400 z-10 border-2 border-slate-900 shadow-md" />
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[50px] border-t-slate-400 shadow-lg" />
            </div>
          </div>
        </div>

        {/* Direction & Heading Display */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full shadow-lg">
          <div className="text-2xl font-black text-white font-sans tracking-wide">
            {getDirectionName(normHeading)}
          </div>
          <div className="text-cyan-400 font-mono font-bold text-lg mt-1">
            {normHeading}°
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
