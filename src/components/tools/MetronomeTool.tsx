import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Play, Pause, Minus, Plus, Hand, Volume2, VolumeX } from 'lucide-react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const SIGNATURES = [
  { label: '2/4', beats: 2 },
  { label: '3/4', beats: 3 },
  { label: '4/4', beats: 4 },
  { label: '5/4', beats: 5 },
  { label: '6/8', beats: 6 },
];

const PRESETS = [
  { name: 'Ларго', bpm: 50 },
  { name: 'Адажио', bpm: 70 },
  { name: 'Анданте', bpm: 90 },
  { name: 'Модерато', bpm: 110 },
  { name: 'Аллегро', bpm: 130 },
  { name: 'Виваче', bpm: 160 },
  { name: 'Престо', bpm: 190 },
];

const tempoName = (bpm: number) => {
  if (bpm < 60) return 'Ларго';
  if (bpm < 76) return 'Адажио';
  if (bpm < 108) return 'Анданте';
  if (bpm < 120) return 'Модерато';
  if (bpm < 156) return 'Аллегро';
  if (bpm < 176) return 'Виваче';
  return 'Престо';
};

export const MetronomeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickRight, setTickRight] = useState(false);
  const [beats, setBeats] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [accent, setAccent] = useState(true);
  const [muted, setMuted] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapsRef = useRef<number[]>([]);
  const beatRef = useRef(-1);

  useEffect(() => {
    if (!isPlaying) {
      beatRef.current = -1;
      setCurrentBeat(-1);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    const tick = () => {
      beatRef.current = (beatRef.current + 1) % beats;
      setCurrentBeat(beatRef.current);
      if (!muted) {
        soundManager.playBeep(accent && beatRef.current === 0 ? 1800 : 1200, 0.05);
      }
      triggerHaptic(beatRef.current === 0 ? 'heavy' : 'tap');
      setTickRight((prev) => !prev);
    };
    tick();
    const interval = setInterval(tick, intervalMs);
    return () => clearInterval(interval);
  }, [isPlaying, bpm, beats, accent, muted]);

  const handleTap = () => {
    const now = Date.now();
    const taps = tapsRef.current.filter((t) => now - t < 2500);
    taps.push(now);
    tapsRef.current = taps;
    setTapCount(taps.length);
    if (taps.length >= 2) {
      const gaps = taps.slice(1).map((t, i) => t - taps[i]);
      const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      setBpm(Math.max(30, Math.min(300, Math.round(60000 / avg))));
    }
    triggerHaptic('tap');
  };

  return (
    <ToolWrapper title="Метроном" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col items-center p-2 sm:p-4 text-center gap-4">
        <div className="bg-gradient-to-b from-[#1a1f2e] to-[#12141d] border border-white/10 rounded-[2rem] p-6 w-full shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex flex-col items-center gap-5">
          {/* Pendulum Graphic */}
          <div className="relative w-36 h-48 bg-black/30 border border-white/10 rounded-3xl flex items-end justify-center overflow-hidden p-4">
            <div
              className={`w-2 bg-cyan-400 rounded-full h-36 origin-bottom transition-transform duration-200 ${
                isPlaying ? (tickRight ? 'rotate-30' : '-rotate-30') : 'rotate-0'
              }`}
            >
              <div className="w-6 h-6 bg-amber-400 rounded-full -ml-2 top-10 relative border-2 border-slate-950" />
            </div>
          </div>

          {/* Beat indicators */}
          <div className="flex items-center gap-2.5 h-4">
            {Array.from({ length: beats }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-100 ${
                  currentBeat === i
                    ? i === 0
                      ? 'w-4 h-4 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]'
                      : 'w-4 h-4 bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]'
                    : 'w-2.5 h-2.5 bg-white/15'
                }`}
              />
            ))}
          </div>

          <div>
            <div className="text-7xl sm:text-8xl font-extrabold text-cyan-300 tabular-nums leading-none">
              {bpm} <span className="text-lg font-semibold text-slate-500">BPM</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">{tempoName(bpm)}</div>
          </div>

          {/* BPM Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBpm((b) => Math.max(30, b - 5))}
              className="p-3.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white rounded-2xl cursor-pointer active:scale-95 transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-5 rounded-3xl font-black cursor-pointer shadow-lg transition-transform active:scale-95 ${
                isPlaying ? 'bg-rose-500 text-white' : 'bg-gradient-to-br from-cyan-300 to-cyan-500 text-slate-950'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button
              onClick={() => setBpm((b) => Math.min(300, b + 5))}
              className="p-3.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white rounded-2xl cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <input
            type="range"
            min={30}
            max={300}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            aria-label="Темп"
          />
        </div>

        {/* Расширенные настройки */}
        <div className="w-full bg-white/[0.04] border border-white/10 rounded-3xl p-4 space-y-4 text-left">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Размер</div>
            <div className="grid grid-cols-5 gap-2">
              {SIGNATURES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setBeats(s.beats)}
                  className={`py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${
                    beats === s.beats ? 'bg-cyan-400 text-slate-950' : 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Темп</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setBpm(p.bpm)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    Math.abs(bpm - p.bpm) < 8 ? 'bg-amber-400 text-slate-950' : 'bg-white/[0.06] text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {p.name} · {p.bpm}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleTap}
              className="py-3 rounded-2xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all"
            >
              <Hand className="w-4 h-4 text-cyan-300" />
              Тап-темп{tapCount > 1 ? ` (${tapCount})` : ''}
            </button>
            <button
              onClick={() => setAccent(!accent)}
              className={`py-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all ${
                accent ? 'bg-amber-400/15 border-amber-400/40 text-amber-300' : 'bg-white/[0.06] border-white/10 text-slate-300'
              }`}
            >
              <span className="text-base leading-none">❶</span>
              Акцент {accent ? 'вкл' : 'выкл'}
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className={`py-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all ${
                muted ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' : 'bg-white/[0.06] border-white/10 text-slate-300'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
              {muted ? 'Звук выкл' : 'Звук вкл'}
            </button>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
