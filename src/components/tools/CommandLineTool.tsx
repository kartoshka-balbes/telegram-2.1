import React, { useState, useRef, useEffect, useMemo } from 'react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Line {
  text: string;
  kind: 'out' | 'cmd' | 'err';
}

const makeCracks = () => {
  const cx = 30 + Math.random() * 40;
  const cy = 30 + Math.random() * 40;
  const rays: string[] = [];
  const n = 14 + Math.floor(Math.random() * 6);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
    let x = cx;
    let y = cy;
    let d = `M ${x} ${y}`;
    const segs = 4 + Math.floor(Math.random() * 4);
    for (let s = 0; s < segs; s++) {
      const len = 8 + Math.random() * 14;
      const aa = a + (Math.random() - 0.5) * 0.5;
      x += Math.cos(aa) * len;
      y += Math.sin(aa) * len;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    rays.push(d);
  }
  const rings = [7, 15, 26].map((r) => {
    const pts = Array.from({ length: 10 }, (_, k) => {
      const a = (k / 10) * Math.PI * 2;
      const rr = r + (Math.random() - 0.5) * 3;
      return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
    });
    return pts.join(' ');
  });
  return { cx, cy, rays, rings };
};

export const CommandLineTool: React.FC<ToolProps> = ({ onClose }) => {
  const [lines, setLines] = useState<Line[]>([
    { text: 'Microsoft Windows [Version 10.0.22631.4602]', kind: 'out' },
    { text: '(c) Корпорация Майкрософт (Microsoft Corporation). Все права защищены.', kind: 'out' },
    { text: '', kind: 'out' },
  ]);
  const [input, setInput] = useState('');
  const [exploding, setExploding] = useState(false);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const cracks = useMemo(makeCracks, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView();
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exploding) return;
    const cmd = input.trim();
    if (!cmd) {
      setLines((l) => [...l, { text: 'C:\\Users\\User>', kind: 'cmd' }]);
      return;
    }
    const name = cmd.split(/\s+/)[0];
    setLines((l) => [
      ...l,
      { text: `C:\\Users\\User>${cmd}`, kind: 'cmd' },
      { text: `Критическая ошибка: команда «${name}» вызвала сбой ядра (0xC0000005, нарушение доступа к памяти).`, kind: 'err' },
    ]);
    setInput('');

    // Мощный взрыв и сломанный экран, вылет через 2–3 секунды
    setExploding(true);
    setFlash(true);
    soundManager.playExplosion();
    window.setTimeout(() => soundManager.playGlassBreak(), 150);
    triggerHaptic('heavy');
    window.setTimeout(() => setFlash(false), 450);
    window.setTimeout(() => onClose(), 2000 + Math.floor(Math.random() * 1000));
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0c0c0c] text-[#cccccc] flex flex-col font-mono text-[13px]" style={exploding ? { animation: 'cmd-shake 0.09s linear infinite' } : undefined} onClick={() => inputRef.current?.focus()}>
      <style>{`
        @keyframes cmd-shake { 0% { transform: translate(0,0) } 25% { transform: translate(-7px,5px) } 50% { transform: translate(6px,-6px) } 75% { transform: translate(-5px,-4px) } 100% { transform: translate(4px,6px) } }
        @keyframes cmd-boom { 0% { transform: scale(0.1); opacity: 1 } 100% { transform: scale(4); opacity: 0 } }
      `}</style>

      {/* Заголовок окна */}
      <div className="flex items-center justify-between bg-[#1f1f1f] px-3 py-2 text-xs text-gray-300 shrink-0">
        <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-gray-400" /> Командная строка</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!exploding) onClose();
          }}
          className="px-3 py-0.5 hover:bg-red-600 hover:text-white cursor-pointer"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>

      {/* Вывод */}
      <div className="flex-1 overflow-y-auto px-3 py-2 leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === 'err' ? 'text-red-400' : l.kind === 'cmd' ? 'text-white' : ''}`}>
            {l.text || '\u00A0'}
          </div>
        ))}
        <form onSubmit={submit} className="flex items-center">
          <span className="text-white whitespace-pre">C:\Users\User&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent outline-none text-white caret-white"
          />
        </form>
        <div ref={endRef} />
      </div>

      {/* Эффект взрыва и сломанный экран */}
      {exploding && (
        <>
          {flash && <div className="absolute inset-0 bg-white z-[60] pointer-events-none" />}
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${cracks.cx}%`,
                  top: `${cracks.cy}%`,
                  width: 300,
                  height: 300,
                  marginLeft: -150,
                  marginTop: -150,
                  background: 'radial-gradient(circle, #fff7c2 0%, #ff9d00 35%, #ff3b00 60%, transparent 72%)',
                  animation: `cmd-boom ${0.9 + i * 0.25}s ease-out ${i * 0.12}s forwards`,
                }}
              />
            ))}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <rect width="100" height="100" fill="rgba(0,0,0,0.25)" />
              {cracks.rays.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.35" />
              ))}
              {cracks.rings.map((p, i) => (
                <polygon key={i} points={p} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.25" />
              ))}
              <circle cx={cracks.cx} cy={cracks.cy} r="2.2" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
