import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Heart, Activity, AlertOctagon, MinusCircle, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type EcgMode = 'normal' | 'catastrophe' | 'flatline';

export const EcgTool: React.FC<ToolProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<EcgMode>('normal');
  const [bpm, setBpm] = useState(74);

  const modeRef = useRef<EcgMode>('normal');
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const points: number[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    const draw = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw Medical Grid
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < width; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Generate ECG Waveform Point based on active mode
      const currentMode = modeRef.current;
      let y = midY;

      if (currentMode === 'flatline') {
        // Absolutely straight horizontal flatline without any movement
        y = midY;
      } else if (currentMode === 'catastrophe') {
        // Mad chaotic wildly vibrating waveform with giant swings and extreme peaks
        const chaoticNoise = (Math.random() - 0.5) * (height * 0.9);
        const wildSine = Math.sin(x * 0.35) * (height * 0.45);
        y = midY + chaoticNoise + wildSine;
      } else {
        // Normal physiological sinus rhythm
        const step = x % 120;
        if (step === 40) y = midY - 12; // P wave
        else if (step === 50) y = midY + 16; // Q wave
        else if (step === 55) y = midY - 85; // R peak
        else if (step === 60) y = midY + 36; // S wave
        else if (step === 80) y = midY - 24; // T wave
        else y = midY + (Math.random() * 2.5 - 1.25);
      }

      points[x] = y;

      // Draw Wave Path
      ctx.lineWidth = currentMode === 'catastrophe' ? 3 : 2;
      ctx.strokeStyle =
        currentMode === 'catastrophe'
          ? '#ef4444'
          : currentMode === 'flatline'
          ? '#eab308'
          : '#22c55e';

      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (points[i] !== undefined) {
          if (i === 0) ctx.moveTo(i, points[i]);
          else ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();

      // Leading beam cursor
      ctx.fillStyle =
        currentMode === 'catastrophe'
          ? '#f87171'
          : currentMode === 'flatline'
          ? '#fde047'
          : '#4ade80';
      ctx.fillRect(x, 0, 3, height);

      x = (x + 2) % width;
      if (x === 0) points.length = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update BPM based on selected mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'normal') {
      setBpm(74);
      timer = setInterval(() => {
        setBpm(72 + Math.floor(Math.random() * 6 - 3));
      }, 2000);
    } else if (mode === 'catastrophe') {
      setBpm(228);
      timer = setInterval(() => {
        setBpm(210 + Math.floor(Math.random() * 45));
      }, 400);
    } else if (mode === 'flatline') {
      setBpm(0);
    }

    return () => clearInterval(timer);
  }, [mode]);

  const handleSelectMode = (newMode: EcgMode) => {
    soundManager.playBeep(newMode === 'catastrophe' ? 1400 : newMode === 'flatline' ? 400 : 900, 0.08);
    setMode(newMode);
  };

  return (
    <ToolWrapper title="ЭЛЕКТРОКАРДИОГРАММА (ЭКГ)" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-2 py-1 font-mono text-xs min-h-0">
        
        {/* ECG Monitor Header */}
        <div className={`p-2.5 sm:p-4 rounded-2xl flex items-center justify-between gap-2 border transition-colors shadow-lg shrink-0 ${
          mode === 'catastrophe'
            ? 'bg-red-950/80 border-red-600 animate-pulse'
            : mode === 'flatline'
            ? 'bg-amber-950/80 border-amber-600'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Heart className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 fill-current ${
              mode === 'catastrophe'
                ? 'text-red-500 animate-ping'
                : mode === 'flatline'
                ? 'text-amber-500'
                : 'text-emerald-500 animate-pulse'
            }`} />
            <div>
              <h3 className="text-[10px] sm:text-base font-black text-white uppercase tracking-normal sm:tracking-wider leading-tight">
                КАРДИОМОНИТОР ЭКГ • ОТВЕДЕНИЕ II
              </h3>
              <p className={`font-bold text-[9px] sm:text-xs leading-tight mt-0.5 ${
                mode === 'catastrophe'
                  ? 'text-red-400'
                  : mode === 'flatline'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}>
                {mode === 'catastrophe'
                  ? 'КРИТИЧЕСКАЯ ТАХИКАРДИЯ / ФИБРИЛЛЯЦИЯ'
                  : mode === 'flatline'
                  ? 'АСИСТОЛИЯ (ОТСУТСТВИЕ СЕРДЦЕБИЕНИЯ)'
                  : 'НОРМАЛЬНЫЙ СИНУСОВЫЙ РИТМ'}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-slate-400 font-bold text-[9px] sm:text-[10px] block">ЧСС (BPM)</span>
            <span className={`text-2xl sm:text-4xl font-black font-mono ${
              mode === 'catastrophe'
                ? 'text-red-400'
                : mode === 'flatline'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {bpm}
            </span>
          </div>
        </div>

        {/* Main Stage: Large Mode Buttons on the Left + Graph Canvas on the Right */}
        <div className="flex flex-col md:flex-row items-stretch gap-2 sm:gap-4 flex-1 min-h-0">
          
          {/* Mode Selector Buttons on Left */}
          <div className="grid grid-cols-3 md:flex md:flex-col gap-1.5 sm:gap-2.5 shrink-0 md:w-56">
            <button
              onClick={() => handleSelectMode('normal')}
              className={`p-2 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-center md:justify-between gap-2 shadow-md ${
                mode === 'normal'
                  ? 'bg-emerald-600 text-black border-emerald-400 font-black scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 group-hover:scale-110" />
                <div>
                  <div className="text-[11px] sm:text-sm font-black uppercase leading-tight">Нормально</div>
                  <div className="hidden md:block text-[10px] opacity-80 font-normal">Обычный график</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectMode('catastrophe')}
              className={`p-2 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-center md:justify-between gap-2 shadow-md ${
                mode === 'catastrophe'
                  ? 'bg-red-600 text-white border-red-400 font-black scale-[1.02] animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-red-500/50'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
                <AlertOctagon className="w-5 h-5 shrink-0 text-red-400" />
                <div>
                  <div className="text-[11px] sm:text-sm font-black uppercase leading-tight">Катастрофа</div>
                  <div className="hidden md:block text-[10px] opacity-80 font-normal">Безумные размахи</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectMode('flatline')}
              className={`p-2 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-center md:justify-between gap-2 shadow-md ${
                mode === 'flatline'
                  ? 'bg-amber-500 text-black border-amber-300 font-black scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
                <MinusCircle className="w-5 h-5 shrink-0 text-amber-400" />
                <div>
                  <div className="text-[11px] sm:text-sm font-black uppercase leading-tight">Тишина</div>
                  <div className="hidden md:block text-[10px] opacity-80 font-normal">Ровная линия</div>
                </div>
              </div>
            </button>
          </div>

          {/* Canvas Screen */}
          <div className="flex-1 min-h-[150px] bg-slate-950 border border-white/10 rounded-2xl relative p-1 overflow-hidden shadow-2xl flex items-center justify-center">
            <canvas ref={canvasRef} width={640} height={250} className="w-full h-full block" />
            <div className="absolute top-1.5 left-1.5 text-[8px] sm:text-[10px] text-emerald-500 font-bold bg-slate-900/85 px-2.5 py-1 rounded-md border border-emerald-500/40">
              25 мм/с • 10 мм/мВ
            </div>
            <div className="absolute top-1.5 right-1.5 text-[8px] sm:text-[10px] font-bold px-2.5 py-1 rounded-md border font-mono uppercase bg-slate-900/85 border-slate-700 text-white">
              Режим: {mode === 'normal' ? 'Норма' : mode === 'catastrophe' ? 'Катастрофа' : 'Асистолия'}
            </div>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
          <div className="p-1.5 sm:p-3 bg-white/[0.05] border border-white/10 rounded-xl text-center">
            <span className="text-slate-400 text-[8px] sm:text-[10px] font-bold block leading-tight">Интервал PR:</span>
            <span className="text-white font-black text-[11px] sm:text-sm">{mode === 'catastrophe' ? 'ERR' : mode === 'flatline' ? '—' : '162 мс'}</span>
          </div>
          <div className="p-1.5 sm:p-3 bg-white/[0.05] border border-white/10 rounded-xl text-center">
            <span className="text-slate-400 text-[8px] sm:text-[10px] font-bold block leading-tight">Комплекс QRS:</span>
            <span className="text-white font-black text-[11px] sm:text-sm">{mode === 'catastrophe' ? '410 мс' : mode === 'flatline' ? '—' : '88 мс'}</span>
          </div>
          <div className="p-1.5 sm:p-3 bg-white/[0.05] border border-white/10 rounded-xl text-center">
            <span className="text-slate-400 text-[8px] sm:text-[10px] font-bold block leading-tight">Интервал QT:</span>
            <span className="text-white font-black text-[11px] sm:text-sm">{mode === 'catastrophe' ? 'ERR' : mode === 'flatline' ? '—' : '390 мс'}</span>
          </div>
          <div className="p-1.5 sm:p-3 bg-white/[0.05] border border-white/10 rounded-xl text-center">
            <span className="text-slate-400 text-[8px] sm:text-[10px] font-bold block leading-tight">Состояние:</span>
            <span className={`font-black text-sm ${
              mode === 'catastrophe'
                ? 'text-red-400'
                : mode === 'flatline'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {mode === 'catastrophe' ? 'Шок' : mode === 'flatline' ? 'Остановка' : 'Стабилен'}
            </span>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
