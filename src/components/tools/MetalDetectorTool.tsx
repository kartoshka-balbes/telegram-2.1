import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Disc, AlertTriangle, Power } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MetalDetectorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isOn, setIsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);

  useEffect(() => {
    if (!isOn) {
      setAlarmActive(false);
      return;
    }

    let alarmTimeout: any;

    const scheduleAlarm = () => {
      // 5-8 seconds
      const delay = Math.floor(Math.random() * 3000) + 5000;
      alarmTimeout = setTimeout(() => {
        setAlarmActive(true);
        soundManager.playSiren();

        // Alarm flashes for 2 seconds then stops and reschedules
        setTimeout(() => {
          setAlarmActive(false);
          if (isOn) scheduleAlarm();
        }, 2000);
      }, delay);
    };

    scheduleAlarm();

    return () => {
      if (alarmTimeout) clearTimeout(alarmTimeout);
    };
  }, [isOn]);

  const handleToggle = () => {
    soundManager.playBeep(900, 0.08);
    setIsOn((prev) => !prev);
    setAlarmActive(false);
  };

  return (
    <ToolWrapper title="Металлодетектор" onClose={onClose} headerColor="bg-slate-900 border-slate-800">
      <div
        className={`max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs transition-colors duration-200 ${
          alarmActive ? 'bg-red-950/90' : ''
        }`}
      >
        {/* Banner Prompt */}
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-2">
          <Disc className={`w-10 h-10 mx-auto ${isOn ? 'text-amber-400 animate-spin' : 'text-slate-600'}`} />
          <h3 className="text-base font-extrabold text-white uppercase">
            Проводите телефоном в поиске металла
          </h3>
          <p className="text-slate-400 text-[11px]">
            ИНДУКТИВНЫЙ МАГНИТОМЕТР • ПОИСК МЕТАЛЛА
          </p>
        </div>

        {/* Display Status */}
        <div className="my-auto space-y-6 text-center">
          {alarmActive && (
            <div className="bg-red-900 border-4 border-red-500 p-6 space-y-3 animate-pulse shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-white mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                ОБНАРУЖЕН МЕТАЛЛ!
              </h2>
              <span className="text-red-200 font-extrabold text-sm block">
                СИГНАЛ: 100% ФЕРРОМАГНИТНЫЙ ОБЪЕКТ
              </span>
            </div>
          )}

          {!alarmActive && (
            <div className="p-8 bg-slate-900 border-2 border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold block text-xs uppercase">СТАТУС ПРИБОРА:</span>
              <span className={`text-2xl font-black uppercase ${isOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isOn ? 'СКАНЕР АКТИВЕН' : 'ВЫКЛЮЧЕНО'}
              </span>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className={`w-40 h-40 rounded-full font-black text-base uppercase flex flex-col items-center justify-center gap-2 mx-auto shadow-2xl cursor-pointer transition-transform active:scale-95 ${
              isOn
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-2 border-slate-700'
            }`}
          >
            <Power className="w-8 h-8" />
            <span>{isOn ? 'ВКЛ (АКТИВНО)' : 'ВКЛЮЧИТЬ'}</span>
          </button>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          ЧУВСТВИТЕЛЬНОСТЬ: 0.05 мкТл • РЕЖИМ ГЛУБОКОГО ПОИСКА
        </div>
      </div>
    </ToolWrapper>
  );
};
