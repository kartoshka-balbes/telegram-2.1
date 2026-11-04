import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { AlarmClock, Bell, BellOff } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const AlarmClockTool: React.FC<ToolProps> = ({ onClose }) => {
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [alarmDate, setAlarmDate] = useState('2026-08-04');
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    if (!isArmed) return;

    const interval = setInterval(() => {
      soundManager.playSiren();
    }, 1000);

    return () => clearInterval(interval);
  }, [isArmed]);

  return (
    <ToolWrapper title="Будильник" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 w-full shadow-2xl flex flex-col items-center gap-6">
          <AlarmClock className={`w-20 h-20 ${isArmed ? 'text-red-500 animate-bounce' : 'text-cyan-400'}`} />

          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase">Время будильника:</label>
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-xl font-mono outline-none focus:border-cyan-400 text-center font-bold"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase">Дата:</label>
              <input
                type="date"
                value={alarmDate}
                onChange={(e) => setAlarmDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-base font-mono outline-none focus:border-cyan-400 text-center font-bold"
              />
            </div>
          </div>

          <button
            onClick={() => setIsArmed(!isArmed)}
            className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
              isArmed
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {isArmed ? (
              <>
                <BellOff className="w-5 h-5" />
                <span>Отключить будильник</span>
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                <span>Завести будильник</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ToolWrapper>
  );
};
