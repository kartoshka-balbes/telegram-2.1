import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Mic, Square, Play } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Recording {
  id: string;
  name: string;
  duration: string;
  date: string;
}

export const DictaphoneTool: React.FC<ToolProps> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [history, setHistory] = useState<Recording[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    soundManager.playBeep(isRecording ? 500 : 900, 0.1);

    if (isRecording) {
      setIsRecording(false);
      const newRec: Recording = {
        id: Date.now().toString(),
        name: `Запись #${history.length + 1}`,
        duration: formatTime(seconds),
        date: 'Только что',
      };
      setHistory((prev) => [newRec, ...prev]);
      setSeconds(0);
    } else {
      setIsRecording(true);
      setSeconds(0);
    }
  };

  const formatTime = (totalSec: number) => {
    const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  return (
    <ToolWrapper title="Диктофон" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4">
        {/* Timer display */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="text-4xl sm:text-5xl font-mono font-black text-cyan-400 tracking-widest mb-6">
            {formatTime(seconds)}
          </div>

          {/* Record / Stop Button */}
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 cursor-pointer ${
              isRecording
                ? 'bg-red-600 hover:bg-red-500 shadow-red-600/50 animate-pulse'
                : 'bg-red-500 hover:bg-red-400 shadow-red-500/30'
            }`}
          >
            {isRecording ? (
              <Square className="w-10 h-10 text-white fill-current" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>
          <span className="text-xs text-slate-500 font-bold uppercase mt-4">
            {isRecording ? 'Запись идет (нажмите для остановки)' : 'Нажмите для начала записи'}
          </span>
        </div>

        {/* History List */}
        <div className="flex-1 mt-6 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            История записей:
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-60 pr-1">
            {history.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center cursor-pointer hover:bg-cyan-600/30">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                  <div>
                    <h4 className="text-white font-bold text-sm">{rec.name}</h4>
                    <span className="text-xs text-slate-500">{rec.date}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{rec.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
