import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  Trash2,
  Save,
  Undo,
  Redo,
  Eraser,
  Palette,
  Download,
  Sparkles,
  Paintbrush,
  Pencil,
  Highlighter,
  Square,
  Circle,
  Slash,
  Star,
  Smile,
  Zap,
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

type DrawMode =
  | 'pencil'
  | 'brush'
  | 'neon'
  | 'highlighter'
  | 'rainbow'
  | 'fill'
  | 'eraser'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'star'
  | 'stamp';

const PRESET_COLORS = [
  '#8f9bff', '#b8c0ff', '#00e5ff', '#0099ff',
  '#ff0055', '#ff3366', '#ff8800', '#ffea00',
  '#aa00ff', '#e040fb', '#ffffff', '#888888',
  '#333333', '#000000', '#795548', '#ff5722'
];

const STAMPS = ['😂', '🔥', '💀', '🤡', '💩', '🐱', '🚀', '👑', '🍌', '🍕', '❤️', '🐸', '🦄', '💎', '🍆', '⚡', '🍔', '🎨'];

export const PaintTool: React.FC<ToolProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing state
  const [mode, setMode] = useState<DrawMode>('brush');
  const [color, setColor] = useState('#8f9bff');
  const [lineWidth, setLineWidth] = useState(6);
  const [selectedStamp, setSelectedStamp] = useState('🔥');
  const [rainbowHue, setRainbowHue] = useState(0);

  // Drawing tracking
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Rainbow hue ticker
  useEffect(() => {
    if (mode !== 'rainbow' || !isDrawing) return;
    const interval = setInterval(() => {
      setRainbowHue((h) => (h + 10) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [mode, isDrawing]);

  // Push state to undo history
  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        const next = [...sliced, imgData];
        if (next.length > 25) next.shift();
        return next;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 24));

      // Auto save draft in localStorage
      const dataUrl = canvas.toDataURL();
      localStorage.setItem('paint_tool_drawing', dataUrl);
    } catch {
      // Ignored
    }
  }, [historyIndex]);

  // Initial Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Load saved image or fill dark canvas
    const saved = localStorage.getItem('paint_tool_drawing');
    if (saved) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#0f121a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([imgData]);
        setHistoryIndex(0);
      };
      img.src = saved;
    } else {
      ctx.fillStyle = '#0f121a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([imgData]);
      setHistoryIndex(0);
    }
  }, []);

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    soundManager.playBeep(700, 0.05);
    const newIdx = historyIndex - 1;
    const targetState = history[newIdx];
    if (targetState) {
      ctx.putImageData(targetState, 0, 0);
      setHistoryIndex(newIdx);
    }
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    soundManager.playBeep(900, 0.05);
    const newIdx = historyIndex + 1;
    const targetState = history[newIdx];
    if (targetState) {
      ctx.putImageData(targetState, 0, 0);
      setHistoryIndex(newIdx);
    }
  };

  // Convert client touch/mouse event to precise canvas buffer coordinates
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: Math.max(0, Math.min(canvas.width, (clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(canvas.height, (clientY - rect.top) * scaleY)),
    };
  };

  // Start Drawing Handler
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPoint(coords);

    // Snapshot for previewing geometric shapes
    const currentSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setSnapshot(currentSnapshot);

    // If stamp mode
    if (mode === 'stamp') {
      ctx.font = `${lineWidth * 8}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, coords.x, coords.y);
      pushHistory();
      setIsDrawing(false);
      return;
    }

    // If bucket fill
    if (mode === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      pushHistory();
      setIsDrawing(false);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;

    if (mode === 'neon') {
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = lineWidth * 2.5;
    } else if (mode === 'highlighter') {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = lineWidth * 2;
      ctx.shadowBlur = 0;
    } else if (mode === 'eraser') {
      ctx.strokeStyle = '#0f121a';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.lineWidth = lineWidth * 2;
    } else if (mode === 'rainbow') {
      ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${rainbowHue}, 100%, 50%)`;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = color;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  };

  // Draw Movement Handler
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    // Shapes drawing preview with snapshot rollback
    if (['line', 'rectangle', 'circle', 'star'].includes(mode)) {
      if (snapshot && startPoint) {
        ctx.putImageData(snapshot, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        if (mode === 'line') {
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();
        } else if (mode === 'rectangle') {
          const w = coords.x - startPoint.x;
          const h = coords.y - startPoint.y;
          ctx.strokeRect(startPoint.x, startPoint.y, w, h);
        } else if (mode === 'circle') {
          const rx = Math.abs(coords.x - startPoint.x);
          const ry = Math.abs(coords.y - startPoint.y);
          const r = Math.sqrt(rx * rx + ry * ry);
          ctx.arc(startPoint.x, startPoint.y, r, 0, Math.PI * 2);
          ctx.stroke();
        } else if (mode === 'star') {
          const cx = startPoint.x;
          const cy = startPoint.y;
          const outerR = Math.sqrt((coords.x - cx) ** 2 + (coords.y - cy) ** 2);
          const innerR = outerR / 2;
          const spikes = 5;
          let rot = (Math.PI / 2) * 3;
          const step = Math.PI / spikes;

          ctx.beginPath();
          ctx.moveTo(cx, cy - outerR);
          for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerR;
            let y = cy + Math.sin(rot) * outerR;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerR;
            y = cy + Math.sin(rot) * innerR;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(cx, cy - outerR);
          ctx.closePath();
          ctx.stroke();
        }
      }
      return;
    }

    if (mode === 'rainbow') {
      ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${rainbowHue}, 100%, 50%)`;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  // Stop Drawing Handler
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPoint(null);
    setSnapshot(null);
    pushHistory();
  };

  // Clear Canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    soundManager.playBeep(400, 0.1);
    ctx.fillStyle = '#0f121a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  };

  // Download Image as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundManager.playCameraClick();
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `рисунок_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Save draft
  const handleSave = () => {
    if (canvasRef.current) {
      localStorage.setItem('paint_tool_drawing', canvasRef.current.toDataURL());
      soundManager.playBeep(1200, 0.08);
    }
  };

  return (
    <ToolWrapper
      title="Рисование"
      onClose={onClose}
      headerColor="bg-[#12151e] border-[#222840]"
    >
      <div className="flex-1 flex flex-col gap-2 w-full h-full relative py-0.5 font-sans select-none overflow-hidden">
        
        {/* MAIN TOOLBAR: Compact, high density */}
        <div className="bg-[#0f121a] border border-[#222840] p-2 rounded-2xl flex flex-col gap-1.5 shadow-md shrink-0 z-20">
          {/* Row 1: Drawing Modes & Fast Exit Button on Top */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {/* Extra Top Exit Button */}
              <button
                onClick={() => {
                  soundManager.playBeep(400, 0.05);
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/60 flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                title="Выход из рисования"
              >
                <span>←</span>
                <span>Выйти</span>
              </button>

              {[
                { id: 'brush', label: 'Кисть', icon: <Paintbrush className="w-3.5 h-3.5" /> },
                { id: 'pencil', label: 'Карандаш', icon: <Pencil className="w-3.5 h-3.5" /> },
                { id: 'neon', label: 'Неон', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> },
                { id: 'highlighter', label: 'Маркер', icon: <Highlighter className="w-3.5 h-3.5 text-yellow-400" /> },
                { id: 'rainbow', label: 'Радуга', icon: <Zap className="w-3.5 h-3.5 text-fuchsia-400" /> },
                { id: 'fill', label: 'Заливка', icon: <Palette className="w-3.5 h-3.5 text-emerald-400" /> },
                { id: 'eraser', label: 'Ластик', icon: <Eraser className="w-3.5 h-3.5 text-amber-400" /> },
                { id: 'line', label: 'Линия', icon: <Slash className="w-3.5 h-3.5" /> },
                { id: 'rectangle', label: 'Квадрат', icon: <Square className="w-3.5 h-3.5" /> },
                { id: 'circle', label: 'Круг', icon: <Circle className="w-3.5 h-3.5" /> },
                { id: 'star', label: 'Звезда', icon: <Star className="w-3.5 h-3.5 text-amber-300" /> },
                { id: 'stamp', label: 'Стикер', icon: <Smile className="w-3.5 h-3.5 text-pink-400" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setMode(t.id as DrawMode);
                    soundManager.playBeep(800, 0.04);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    mode === t.id
                      ? 'bg-[#8f9bff] text-black shadow-md scale-105'
                      : 'bg-[#171b27] text-gray-300 border border-[#222840] hover:border-[#8f9bff]/50 hover:text-white'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Undo / Redo & Secondary Top Exit */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto pl-2 border-l border-[#222840]">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 bg-[#171b27] hover:bg-[#212536] disabled:opacity-30 text-gray-200 rounded-xl border border-[#222840] cursor-pointer"
                title="Отменить"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 bg-[#171b27] hover:bg-[#212536] disabled:opacity-30 text-gray-200 rounded-xl border border-[#222840] cursor-pointer"
                title="Повторить"
              >
                <Redo className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundManager.playBeep(400, 0.05);
                  onClose();
                }}
                className="px-2 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-600 rounded-xl text-xs font-black cursor-pointer shadow-sm"
                title="Выход"
              >
                ✕ Выход
              </button>
            </div>
          </div>

          {/* Row 2: Stamps Selection (when in Stamp mode) */}
          {mode === 'stamp' && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 bg-[#141824] p-1.5 rounded-xl border border-[#222840] animate-in fade-in duration-150">
              <span className="text-[10px] text-pink-400 font-bold uppercase shrink-0">Выбери стикер:</span>
              {STAMPS.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStamp(st)}
                  className={`text-lg p-1 rounded-lg transition-transform shrink-0 cursor-pointer ${
                    selectedStamp === st ? 'bg-pink-950 border-2 border-pink-500 scale-125' : 'hover:scale-110'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {/* Row 3: Colors & Brush Size & Canvas Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#222840]/60">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform shrink-0 cursor-pointer ${
                    color === c ? 'scale-125 border-white shadow-md' : 'border-black/60 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}

              <label className="w-6 h-6 rounded-full border-2 border-[#222840] hover:border-[#8f9bff] flex items-center justify-center cursor-pointer overflow-hidden relative shrink-0 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 shadow-md">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                  title="Выбрать свой цвет"
                />
              </label>
            </div>

            {/* Brush Size Slider */}
            <div className="flex items-center gap-2 bg-[#171b27] border border-[#222840] px-2.5 py-1 rounded-xl">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Размер:</span>
              <button
                onClick={() => setLineWidth((w) => Math.max(2, w - 2))}
                className="text-gray-400 hover:text-white px-1 font-black cursor-pointer"
              >
                -
              </button>
              <div
                className="w-3.5 h-3.5 rounded-full bg-[#8f9bff] mx-0.5 shrink-0"
                style={{ transform: `scale(${Math.min(2.5, lineWidth / 10)})` }}
              />
              <span className="text-xs font-mono font-bold text-[#8f9bff] w-4 text-center">{lineWidth}</span>
              <button
                onClick={() => setLineWidth((w) => Math.min(60, w + 2))}
                className="text-gray-400 hover:text-white px-1 font-black cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Quick Actions (Save, Download, Clear) */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-bold text-xs rounded-xl flex items-center gap-1 shadow cursor-pointer"
                title="Сохранить рисунок"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Сохранить</span>
              </button>

              <button
                onClick={handleDownload}
                className="p-1.5 bg-[#171b27] hover:bg-[#212536] text-cyan-300 rounded-xl border border-[#222840] cursor-pointer"
                title="Скачать PNG"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleClear}
                className="p-1.5 bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl cursor-pointer"
                title="Очистить холст"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FULL EXPANDED WORKING DRAWING CANVAS with Non-Symmetrical Exit Buttons around */}
        <div
          ref={containerRef}
          className="flex-1 w-full bg-[#0f121a] border-2 border-[#222840] rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center touch-none min-h-[350px]"
        >
          {/* Main Drawing Canvas - Full Edge-to-Edge */}
          <canvas
            ref={canvasRef}
            width={1200}
            height={850}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full object-contain cursor-crosshair touch-none"
          />

          {/* NON-SYMMETRICAL EXIT BUTTONS AROUND CANVAS SIDES, TOP, BOTTOM */}
          
          {/* 1. Left side top floating exit pill */}
          <button
            onClick={() => {
              soundManager.playBeep(400, 0.05);
              onClose();
            }}
            className="absolute left-3 top-4 z-30 px-3 py-1.5 rounded-2xl bg-black/75 hover:bg-red-950/90 text-red-400 hover:text-white border border-red-600/60 backdrop-blur-md text-xs font-black flex items-center gap-1.5 shadow-xl cursor-pointer hover:scale-105 transition-all"
            title="Назад"
          >
            <span>←</span>
            <span>Назад</span>
          </button>

          {/* 2. Left side bottom exit button */}
          <button
            onClick={() => {
              soundManager.playBeep(400, 0.05);
              onClose();
            }}
            className="absolute left-4 bottom-14 z-30 p-2 rounded-full bg-neutral-900/85 hover:bg-red-900 text-gray-300 hover:text-white border border-neutral-700 backdrop-blur-md text-xs font-black shadow-xl cursor-pointer hover:scale-110 transition-all"
            title="Выход"
          >
            ✕
          </button>

          {/* 3. Right side mid-upper exit button */}
          <button
            onClick={() => {
              soundManager.playBeep(400, 0.05);
              onClose();
            }}
            className="absolute right-3 top-16 z-30 px-3 py-1.5 rounded-2xl bg-neutral-950/80 hover:bg-red-900 text-amber-300 hover:text-white border border-amber-600/50 backdrop-blur-md text-xs font-extrabold flex items-center gap-1 shadow-xl cursor-pointer hover:scale-105 transition-all"
            title="Выйти"
          >
            <span>Выйти</span>
            <span>✕</span>
          </button>

          {/* 4. Bottom left-of-center exit pill */}
          <button
            onClick={() => {
              soundManager.playBeep(400, 0.05);
              onClose();
            }}
            className="absolute bottom-3 left-16 z-30 px-3.5 py-1.5 rounded-2xl bg-black/80 hover:bg-red-900/90 text-red-300 hover:text-white border border-red-500/70 backdrop-blur-md text-xs font-black flex items-center gap-1.5 shadow-2xl cursor-pointer hover:scale-105 transition-all"
            title="Выход"
          >
            <span>🚪</span>
            <span>Выход</span>
          </button>

          {/* 5. Bottom right exit arrow */}
          <button
            onClick={() => {
              soundManager.playBeep(400, 0.05);
              onClose();
            }}
            className="absolute bottom-3 right-4 z-30 px-3 py-1.5 rounded-2xl bg-black/80 hover:bg-red-900/90 text-gray-300 hover:text-white border border-gray-700 backdrop-blur-md text-xs font-black flex items-center gap-1 shadow-2xl cursor-pointer hover:scale-105 transition-all"
            title="Назад"
          >
            <span>← Назад</span>
          </button>
        </div>

      </div>
    </ToolWrapper>
  );
};
