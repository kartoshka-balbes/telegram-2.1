import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';
import {
  X,
  Minus,
  Square,
  Maximize2,
  Minimize2,
  Terminal,
  Calculator as CalcIcon,
  FileText,
  Palette,
  Folder,
  HardDrive,
  Cpu,
  RotateCcw,
  AlertOctagon,
  Monitor,
  Volume2,
  Wifi,
  Search,
  Power,
  Globe,
  Bomb,
  Music,
  Trash2,
  Play,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

type WindowsOSMode = 'win98' | 'winxp' | 'win7' | 'win10' | 'win11';

interface VirtualWindow {
  id: string;
  appKey: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export const WindowsEmulatorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [osMode, setOsMode] = useState<WindowsOSMode>('winxp');
  const [isBooting, setIsBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [isBsod, setIsBsod] = useState(false);
  const [bsodDumping, setBsodDumping] = useState(0);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [openWindows, setOpenWindows] = useState<VirtualWindow[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [highestZ, setHighestZ] = useState(10);

  // App specific states
  // Notepad
  const [notepadText, setNotepadText] = useState('Добро пожаловать в виртуальный Windows!\nСистема готова к работе.\nВы можете печатать текст, сохранять файлы и запускать приложения.');
  
  // Calculator
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcResetOnNext, setCalcResetOnNext] = useState(false);

  // Command Prompt (CMD)
  const [cmdHistory, setCmdHistory] = useState<string[]>([
    'Microsoft Windows XP [Version 5.1.2600]',
    '(C) Copyright 1985-2001 Microsoft Corp.',
    '',
    'C:\\Documents and Settings\\Administrator> help - список команд (dir, ver, cls, ping, reboot, bsod)',
  ]);
  const [cmdInput, setCmdInput] = useState('');

  // Paint
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  // Minesweeper
  const [mineGrid, setMineGrid] = useState<Array<{ hasMine: boolean; revealed: boolean; flagged: boolean; neighborMines: number }>>([]);
  const [mineGameOver, setMineGameOver] = useState(false);
  const [mineWin, setMineWin] = useState(false);
  const [mineCount, setMineCount] = useState(10);
  const [mineTimer, setMineTimer] = useState(0);

  // Clock in taskbar
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Minesweeper timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!mineGameOver && !mineWin && mineGrid.some(c => c.revealed)) {
      interval = setInterval(() => setMineTimer(p => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mineGameOver, mineWin, mineGrid]);

  // Init Minesweeper
  const initMinesweeper = () => {
    const size = 64; // 8x8
    const mines = 10;
    const grid: Array<{ hasMine: boolean; revealed: boolean; flagged: boolean; neighborMines: number }> = Array(size).fill(null).map(() => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      neighborMines: 0,
    }));

    let planted = 0;
    while (planted < mines) {
      const idx = Math.floor(Math.random() * size);
      if (!grid[idx].hasMine) {
        grid[idx].hasMine = true;
        planted++;
      }
    }

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const idx = r * 8 + c;
        if (grid[idx].hasMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              if (grid[nr * 8 + nc].hasMine) count++;
            }
          }
        }
        grid[idx].neighborMines = count;
      }
    }

    setMineGrid(grid);
    setMineGameOver(false);
    setMineWin(false);
    setMineCount(10);
    setMineTimer(0);
  };

  useEffect(() => {
    initMinesweeper();
  }, []);

  // System reboot animation
  const handleReboot = () => {
    triggerHaptic('heavy');
    setIsStartOpen(false);
    setIsBsod(false);
    setOpenWindows([]);
    setIsBooting(true);
    setBootProgress(0);

    const step = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(step);
          setIsBooting(false);
          soundManager.playWindowsStartupSound();
          return 100;
        }
        return prev + 15;
      });
    }, 140);
  };

  // Trigger BSOD (Blue Screen of Death)
  const handleTriggerBsod = () => {
    triggerHaptic('long');
    soundManager.playWindowsErrorSound();
    setIsStartOpen(false);
    setIsBsod(true);
    setBsodDumping(0);

    const dumpTimer = setInterval(() => {
      setBsodDumping(prev => {
        if (prev >= 100) {
          clearInterval(dumpTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  const focusWindow = (id: string) => {
    setHighestZ(prev => {
      const nextZ = prev + 1;
      setOpenWindows(wins => wins.map(w => w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w));
      return nextZ;
    });
    setActiveWindowId(id);
  };

  const openApp = (appKey: string) => {
    setIsStartOpen(false);
    soundManager.playBeep(800, 0.04);

    const existing = openWindows.find(w => w.appKey === appKey);
    if (existing) {
      focusWindow(existing.id);
      return;
    }

    const appMeta: Record<string, { title: string; icon: string; width: number; height: number }> = {
      my_computer: { title: 'Мой компьютер', icon: '💻', width: 380, height: 300 },
      notepad: { title: 'Блокнот', icon: '📝', width: 360, height: 280 },
      paint: { title: 'Paint', icon: '🎨', width: 400, height: 320 },
      calc: { title: 'Калькулятор', icon: '🧮', width: 280, height: 320 },
      cmd: { title: 'Командная строка CMD', icon: '⬛', width: 420, height: 290 },
      minesweeper: { title: 'Сапёр (Minesweeper)', icon: '💣', width: 320, height: 360 },
      explorer: { title: 'Internet Explorer', icon: '🌐', width: 420, height: 320 },
      taskmgr: { title: 'Диспетчер задач Windows', icon: '📊', width: 350, height: 300 },
      mediaplayer: { title: 'Проигрыватель Windows Media', icon: '🎵', width: 340, height: 260 },
      trash: { title: 'Корзина', icon: '🗑️', width: 320, height: 240 },
    };

    const meta = appMeta[appKey] || { title: 'Приложение', icon: '🪟', width: 320, height: 240 };
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);

    const newWin: VirtualWindow = {
      id: `${appKey}-${Date.now()}`,
      appKey,
      title: meta.title,
      icon: meta.icon,
      isMinimized: false,
      isMaximized: false,
      x: 20 + (openWindows.length % 5) * 25,
      y: 20 + (openWindows.length % 5) * 25,
      width: meta.width,
      height: meta.height,
      zIndex: nextZ,
    };

    setOpenWindows(prev => [...prev, newWin]);
    setActiveWindowId(newWin.id);
  };

  const closeWindow = (id: string) => {
    soundManager.playBeep(500, 0.04);
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximize = (id: string) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const toggleMinimize = (id: string) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  // Calculator helper
  const handleCalcBtn = (val: string) => {
    soundManager.playBeep(900, 0.03);
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcPrev(null);
      setCalcOp(null);
      setCalcResetOnNext(false);
      return;
    }
    if (['+', '-', '*', '/'].includes(val)) {
      setCalcPrev(parseFloat(calcDisplay));
      setCalcOp(val);
      setCalcResetOnNext(true);
      return;
    }
    if (val === '=') {
      if (calcOp && calcPrev !== null) {
        const cur = parseFloat(calcDisplay);
        let res = 0;
        if (calcOp === '+') res = calcPrev + cur;
        if (calcOp === '-') res = calcPrev - cur;
        if (calcOp === '*') res = calcPrev * cur;
        if (calcOp === '/') res = cur !== 0 ? calcPrev / cur : 0;
        setCalcDisplay(String(res));
        setCalcPrev(null);
        setCalcOp(null);
        setCalcResetOnNext(true);
      }
      return;
    }
    if (calcResetOnNext || calcDisplay === '0') {
      setCalcDisplay(val);
      setCalcResetOnNext(false);
    } else {
      setCalcDisplay(calcDisplay + val);
    }
  };

  // CMD helper
  const handleCmdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = cmdInput.trim();
    if (!command) return;

    soundManager.playBeep(1100, 0.03);
    const newHistory = [...cmdHistory, `C:\\Documents and Settings\\Administrator> ${command}`];
    const lower = command.toLowerCase();

    if (lower === 'help') {
      newHistory.push(
        'Доступные команды:',
        '  dir       - просмотр списка файлов и папок',
        '  ver       - версия операционной системы',
        '  cls       - очистить экран',
        '  ping      - проверка сетевого соединения',
        '  calc      - открыть калькулятор',
        '  paint     - открыть графический редактор',
        '  notepad   - открыть блокнот',
        '  reboot    - перезагрузить виртуальную систему',
        '  bsod      - аварийный сбой системы (синий экран)'
      );
    } else if (lower === 'dir') {
      newHistory.push(
        ' Содержимое папки C:\\Documents and Settings\\Administrator',
        '',
        '12.08.2001  14:22    <DIR>          .',
        '12.08.2001  14:22    <DIR>          ..',
        '23.08.2026  10:00    <DIR>          Рабочий стол',
        '23.08.2026  10:00    <DIR>          Мои документы',
        '15.04.2001  12:00         1 048 576 autoexec.bat',
        '15.04.2001  12:00               248 config.sys',
        '               2 файлов      1 048 824 байт',
        '               4 папок   42 105 733 120 байт свободно'
      );
    } else if (lower === 'ver') {
      newHistory.push(`Microsoft Windows [Версия ${osMode.toUpperCase()} - Build 2600.xpsp_sp3]`);
    } else if (lower === 'cls') {
      setCmdHistory([]);
      setCmdInput('');
      return;
    } else if (lower.startsWith('ping')) {
      newHistory.push(
        'Обмен пакетами с 127.0.0.1 по с 32 байтами данных:',
        'Ответ от 127.0.0.1: число байт=32 время<1мс TTL=128',
        'Ответ от 127.0.0.1: число байт=32 время<1мс TTL=128',
        'Статистика Ping для 127.0.0.1: Пакетов: отправлено = 2, получено = 2, потеряно = 0 (0% потерь)'
      );
    } else if (lower === 'reboot') {
      handleReboot();
      return;
    } else if (lower === 'bsod') {
      handleTriggerBsod();
      return;
    } else if (lower === 'calc') {
      openApp('calc');
    } else if (lower === 'paint') {
      openApp('paint');
    } else if (lower === 'notepad') {
      openApp('notepad');
    } else {
      newHistory.push(`"${command}" не является внутренней или внешней командой.`);
    }

    setCmdHistory(newHistory);
    setCmdInput('');
  };

  // Minesweeper cell click
  const handleMineClick = (idx: number) => {
    if (mineGameOver || mineWin || mineGrid[idx].revealed || mineGrid[idx].flagged) return;

    soundManager.playBeep(900, 0.04);
    if (mineGrid[idx].hasMine) {
      soundManager.playExplosion();
      setMineGameOver(true);
      setMineGrid(prev => prev.map(c => c.hasMine ? { ...c, revealed: true } : c));
      return;
    }

    const next = [...mineGrid];
    const revealEmpty = (i: number) => {
      if (i < 0 || i >= 64 || next[i].revealed || next[i].flagged) return;
      next[i].revealed = true;
      if (next[i].neighborMines === 0 && !next[i].hasMine) {
        const r = Math.floor(i / 8);
        const c = i % 8;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              revealEmpty(nr * 8 + nc);
            }
          }
        }
      }
    };

    revealEmpty(idx);
    setMineGrid(next);

    // Check win
    const unrevealedNonMines = next.filter(c => !c.hasMine && !c.revealed).length;
    if (unrevealedNonMines === 0) {
      setMineWin(true);
      soundManager.playCoin();
    }
  };

  const handleMineRightClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    if (mineGameOver || mineWin || mineGrid[idx].revealed) return;
    soundManager.playBeep(600, 0.03);
    setMineGrid(prev => prev.map((c, i) => i === idx ? { ...c, flagged: !c.flagged } : c));
  };

  // Paint Canvas Handlers
  const handlePaintStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePaintMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handlePaintEnd = () => {
    setIsDrawing(false);
  };

  // OS Mode Theme Styling
  const getThemeStyles = () => {
    switch (osMode) {
      case 'win98':
        return {
          bg: '#008080',
          taskbar: 'bg-[#c0c0c0] border-t-2 border-white text-black',
          startBtn: 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-black font-bold text-black',
          windowHeader: 'bg-[#000080] text-white',
          windowBg: 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-black',
          startMenu: 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-black',
        };
      case 'win7':
        return {
          bg: 'linear-gradient(135deg, #1e528e 0%, #2e7bb6 50%, #70a9d8 100%)',
          taskbar: 'bg-[#0a203a]/80 backdrop-blur-md border-t border-cyan-400/40 text-white',
          startBtn: 'bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full text-white shadow-lg border border-cyan-200',
          windowHeader: 'bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700 text-white',
          windowBg: 'bg-[#f0f4f8] border border-blue-400/60 rounded-t-lg text-slate-900 shadow-2xl',
          startMenu: 'bg-slate-900/90 backdrop-blur-xl border border-cyan-400/50 rounded-tr-2xl text-white',
        };
      case 'win10':
        return {
          bg: '#004275',
          taskbar: 'bg-[#101010] border-t border-[#2a2a2a] text-white',
          startBtn: 'bg-transparent hover:bg-white/10 text-white',
          windowHeader: 'bg-[#1c2030] text-white',
          windowBg: 'bg-[#282c3d] border border-[#3f3f3f] text-white',
          startMenu: 'bg-[#1c2030] border border-[#3a3a3a] text-white',
        };
      case 'win11':
        return {
          bg: 'radial-gradient(circle at center, #1b355a 0%, #0c182c 100%)',
          taskbar: 'bg-[#181e28]/85 backdrop-blur-xl border-t border-white/10 text-white justify-center',
          startBtn: 'bg-blue-600/30 hover:bg-blue-600/50 rounded-xl text-cyan-300',
          windowHeader: 'bg-[#202836] text-white rounded-t-2xl',
          windowBg: 'bg-[#1b2230] border border-white/15 rounded-2xl text-white shadow-2xl',
          startMenu: 'bg-[#1e2638]/95 backdrop-blur-2xl border border-white/15 rounded-3xl text-white',
        };
      case 'winxp':
      default:
        return {
          bg: '#2572c6', // Bliss blue tone
          taskbar: 'bg-gradient-to-b from-[#245edb] to-[#1242a8] border-t-2 border-[#3d83fa] text-white shadow-lg',
          startBtn: 'bg-gradient-to-b from-[#388e3c] via-[#4caf50] to-[#2e7d32] border-2 border-[#81c784] rounded-r-2xl font-black text-white shadow-md italic',
          windowHeader: 'bg-gradient-to-r from-[#0055ea] via-[#0070ff] to-[#0055ea] text-white rounded-t-lg font-bold',
          windowBg: 'bg-[#ece9d8] border-3 border-[#0055ea] rounded-t-lg text-black shadow-2xl',
          startMenu: 'bg-[#ece9d8] border-2 border-[#0055ea] rounded-tr-xl text-black shadow-2xl',
        };
    }
  };

  const currentTheme = getThemeStyles();

  // BSOD Screen
  if (isBsod) {
    return (
      <ToolWrapper title="Синий экран (BSOD)" onClose={onClose} headerColor="bg-blue-900 border-blue-700">
        <div className="flex-1 bg-[#0000aa] text-white font-mono p-6 sm:p-10 flex flex-col justify-between select-none overflow-y-auto">
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            <div className="bg-white text-[#0000aa] font-bold px-3 py-1 inline-block text-lg">
              WINDOWS CRASH / СИСТЕМНЫЙ СБОЙ
            </div>
            
            <p className="text-sm sm:text-base leading-relaxed">
              Была обнаружена критическая ошибка, и Windows была остановлена, чтобы предотвратить повреждение вашего компьютера.
            </p>

            <p className="text-xs sm:text-sm text-yellow-300 font-bold">
              DRIVER_IRQL_NOT_LESS_OR_EQUAL (dxgkrnl.sys)
            </p>

            <p className="text-xs sm:text-sm text-gray-200">
              Если вы видите этот экран впервые, перезагрузите компьютер. Если этот экран появляется снова, выполните следующие действия:
            </p>

            <ul className="text-xs list-disc list-inside space-y-1 text-gray-300">
              <li>Убедитесь, что всё новое оборудование и программы установлены правильно.</li>
              <li>Отключите параметры памяти BIOS, такие как кэширование или затенение.</li>
              <li>Если вам нужно использовать безопасный режим, нажмите F8 при перезагрузке.</li>
            </ul>

            <div className="border-t border-blue-400/40 pt-3">
              <p className="text-xs text-yellow-200 font-mono">
                Техническая информация:
              </p>
              <p className="text-xs text-gray-200 font-mono">
                *** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF78A2100)
              </p>
              <p className="text-xs text-gray-300 font-mono mt-1">
                *** dxgkrnl.sys - Address F78A2100 base at F7890000, DateStamp 3d6dd67c
              </p>
            </div>

            <div className="bg-blue-950/80 p-3 rounded-lg border border-blue-500/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Создание аварийного дампа памяти на диск:</span>
                <span className="font-bold text-yellow-400">{bsodDumping}%</span>
              </div>
              <div className="w-full bg-blue-900 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full transition-all duration-150" style={{ width: `${bsodDumping}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={handleReboot}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all uppercase tracking-wider"
            >
              🔄 Перезагрузить систему сейчас
            </button>
          </div>
        </div>
      </ToolWrapper>
    );
  }

  // Booting Screen
  if (isBooting) {
    return (
      <ToolWrapper title="Загрузка Windows" onClose={onClose} headerColor="bg-black border-gray-800">
        <div className="flex-1 bg-black text-white flex flex-col items-center justify-center p-6 select-none font-mono">
          <div className="flex items-center gap-3 text-3xl font-black mb-6">
            <span className="text-4xl">🪟</span>
            <span className="tracking-widest uppercase text-sky-400">Microsoft Windows</span>
          </div>

          <div className="w-64 bg-gray-900 border border-gray-700 h-4 rounded-full p-0.5 overflow-hidden shadow-[0_0_20px_rgba(0,180,255,0.4)]">
            <div
              className="bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${bootProgress}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-4 animate-pulse">Запуск служб и виртуальных компонентов...</p>
        </div>
      </ToolWrapper>
    );
  }

  return (
    <ToolWrapper
      title={`Эмулятор Windows (${osMode.toUpperCase()})`}
      onClose={onClose}
      headerColor="bg-[#12151e] border-[#222840]"
    >
      <div
        className="flex-1 flex flex-col relative overflow-hidden select-none"
        style={{
          background: typeof currentTheme.bg === 'string' && currentTheme.bg.includes('gradient') ? currentTheme.bg : undefined,
          backgroundColor: typeof currentTheme.bg === 'string' && !currentTheme.bg.includes('gradient') ? currentTheme.bg : undefined,
        }}
      >
        {/* TOP OS SWITCHER BAR */}
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-xs z-30 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-gray-400 font-bold uppercase text-[10px] mr-1 hidden xs:inline">Режим ОС:</span>
            {(['win98', 'winxp', 'win7', 'win10', 'win11'] as WindowsOSMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  soundManager.playBeep(1000, 0.04);
                  setOsMode(mode);
                }}
                className={`px-2.5 py-0.5 rounded-lg font-bold text-[11px] uppercase transition-all cursor-pointer ${
                  osMode === mode
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {mode === 'win98' ? 'Win 98' : mode === 'winxp' ? 'Win XP' : mode === 'win7' ? 'Win 7' : mode === 'win10' ? 'Win 10' : 'Win 11'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleTriggerBsod}
              title="Вызвать аварийный синий экран"
              className="px-2 py-0.5 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <AlertOctagon className="w-3 h-3" />
              <span>BSOD</span>
            </button>
            <button
              onClick={handleReboot}
              title="Перезагрузка Windows"
              className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all active:scale-95 border border-gray-600"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Рестарт</span>
            </button>
          </div>
        </div>

        {/* DESKTOP WORKSPACE */}
        <div
          className="flex-1 relative p-3 sm:p-4 overflow-hidden"
          onClick={() => {
            if (isStartOpen) setIsStartOpen(false);
          }}
        >
          {/* Desktop Shortcuts Grid */}
          <div className="grid grid-flow-col grid-rows-6 gap-3 w-fit z-10 relative">
            {[
              { key: 'my_computer', name: 'Мой компьютер', icon: '💻' },
              { key: 'notepad', name: 'Блокнот', icon: '📝' },
              { key: 'paint', name: 'Paint', icon: '🎨' },
              { key: 'calc', name: 'Калькулятор', icon: '🧮' },
              { key: 'cmd', name: 'Командная строка', icon: '⬛' },
              { key: 'minesweeper', name: 'Сапёр', icon: '💣' },
              { key: 'explorer', name: 'Internet Explorer', icon: '🌐' },
              { key: 'taskmgr', name: 'Диспетчер задач', icon: '📊' },
              { key: 'mediaplayer', name: 'Медиаплеер', icon: '🎵' },
              { key: 'trash', name: 'Корзина', icon: '🗑️' },
            ].map((app) => (
              <button
                key={app.key}
                onDoubleClick={() => openApp(app.key)}
                onClick={() => soundManager.playBeep(700, 0.02)}
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/20 active:bg-blue-600/40 text-center w-20 group cursor-pointer transition-all"
              >
                <span className="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">{app.icon}</span>
                <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2 mt-1 leading-tight">
                  {app.name}
                </span>
              </button>
            ))}
          </div>

          {/* VIRTUAL WINDOWS STACK */}
          {openWindows.map((win) => {
            if (win.isMinimized) return null;
            const isFocused = activeWindowId === win.id;

            return (
              <div
                key={win.id}
                onPointerDown={() => focusWindow(win.id)}
                style={{
                  zIndex: win.zIndex,
                  left: win.isMaximized ? 0 : win.x,
                  top: win.isMaximized ? 0 : win.y,
                  width: win.isMaximized ? '100%' : win.width,
                  height: win.isMaximized ? '100%' : win.height,
                  position: 'absolute',
                }}
                className={`flex flex-col overflow-hidden transition-all duration-75 ${currentTheme.windowBg} ${
                  isFocused ? 'ring-2 ring-blue-500/80' : 'opacity-95'
                }`}
              >
                {/* Window Titlebar */}
                <div
                  className={`px-2.5 py-1.5 flex items-center justify-between cursor-move select-none shrink-0 ${currentTheme.windowHeader}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm">{win.icon}</span>
                    <span className="text-xs font-black truncate">{win.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMinimize(win.id);
                      }}
                      className="w-5 h-5 bg-white/20 hover:bg-white/40 active:bg-white/60 rounded flex items-center justify-center text-xs text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaximize(win.id);
                      }}
                      className="w-5 h-5 bg-white/20 hover:bg-white/40 active:bg-white/60 rounded flex items-center justify-center text-xs text-white cursor-pointer"
                    >
                      {win.isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWindow(win.id);
                      }}
                      className="w-5 h-5 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded flex items-center justify-center text-xs text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Window Content Body */}
                <div className="flex-1 bg-white text-black overflow-hidden flex flex-col p-1">
                  {/* APP: NOTEPAD */}
                  {win.appKey === 'notepad' && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex gap-2 border-b border-gray-300 pb-1 mb-1 text-xs text-gray-700">
                        <span className="cursor-pointer hover:bg-gray-200 px-1 rounded" onClick={() => setNotepadText('')}>Создать</span>
                        <span className="cursor-pointer hover:bg-gray-200 px-1 rounded" onClick={() => soundManager.playBeep(1200, 0.05)}>Сохранить</span>
                        <span className="cursor-pointer hover:bg-gray-200 px-1 rounded">Формат</span>
                      </div>
                      <textarea
                        value={notepadText}
                        onChange={(e) => setNotepadText(e.target.value)}
                        className="flex-1 w-full font-mono text-xs p-2 outline-none resize-none bg-white text-black"
                        placeholder="Начните вводить текст..."
                      />
                    </div>
                  )}

                  {/* APP: CALCULATOR */}
                  {win.appKey === 'calc' && (
                    <div className="flex-1 flex flex-col p-2 bg-[#ece9d8] text-black">
                      <div className="bg-white border-2 border-gray-400 p-2 text-right font-mono text-xl font-bold rounded mb-2 overflow-x-auto">
                        {calcDisplay}
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 flex-1">
                        {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0'].map((btn) => (
                          <button
                            key={btn}
                            onClick={() => handleCalcBtn(btn)}
                            className={`p-2 rounded font-bold text-sm shadow cursor-pointer border ${
                              btn === '='
                                ? 'bg-blue-600 text-white border-blue-700 row-span-2 flex items-center justify-center'
                                : btn === 'C'
                                ? 'bg-red-500 text-white border-red-600'
                                : 'bg-gray-100 hover:bg-gray-200 text-black border-gray-400'
                            }`}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APP: CMD TERMINAL */}
                  {win.appKey === 'cmd' && (
                    <div className="flex-1 bg-black text-[#b8c0ff] font-mono text-xs p-2 flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {cmdHistory.map((line, idx) => (
                          <div key={idx} className="whitespace-pre-wrap">{line}</div>
                        ))}
                      </div>
                      <form onSubmit={handleCmdSubmit} className="flex items-center gap-1 pt-1 border-t border-gray-800">
                        <span>C:\&gt;</span>
                        <input
                          type="text"
                          value={cmdInput}
                          onChange={(e) => setCmdInput(e.target.value)}
                          className="flex-1 bg-transparent text-[#b8c0ff] outline-none font-mono text-xs"
                          autoFocus
                        />
                      </form>
                    </div>
                  )}

                  {/* APP: PAINT */}
                  {win.appKey === 'paint' && (
                    <div className="flex-1 flex flex-col bg-[#ece9d8]">
                      <div className="flex items-center justify-between p-1.5 border-b border-gray-300 text-xs">
                        <div className="flex items-center gap-1.5">
                          {['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setDrawColor(color)}
                              style={{ backgroundColor: color }}
                              className={`w-5 h-5 rounded-full border-2 ${drawColor === color ? 'border-black scale-110' : 'border-white'}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-600">Кисть:</span>
                          {[2, 4, 8].map((size) => (
                            <button
                              key={size}
                              onClick={() => setBrushSize(size)}
                              className={`px-1.5 py-0.5 text-[10px] rounded border ${brushSize === size ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
                            >
                              {size}px
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              const canvas = canvasRef.current;
                              if (canvas) {
                                const ctx = canvas.getContext('2d');
                                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                              }
                            }}
                            className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-black text-[10px] rounded border"
                          >
                            Очистить
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center p-1">
                        <canvas
                          ref={canvasRef}
                          width={380}
                          height={230}
                          onPointerDown={handlePaintStart}
                          onPointerMove={handlePaintMove}
                          onPointerUp={handlePaintEnd}
                          onPointerLeave={handlePaintEnd}
                          className="bg-white border border-gray-300 shadow-inner cursor-crosshair w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* APP: MINESWEEPER */}
                  {win.appKey === 'minesweeper' && (
                    <div className="flex-1 flex flex-col items-center justify-between p-2 bg-[#bdbdbd] border-2 border-t-white border-l-white border-r-gray-700 border-b-gray-700 text-black">
                      {/* Header scoreboard */}
                      <div className="w-full bg-[#bdbdbd] border-2 border-t-gray-700 border-l-gray-700 border-r-white border-b-white p-1.5 flex items-center justify-between mb-2">
                        <div className="bg-black text-red-600 font-mono font-bold text-base px-2 py-0.5 rounded">
                          {mineCount - mineGrid.filter(c => c.flagged).length}
                        </div>
                        <button
                          onClick={initMinesweeper}
                          className="w-8 h-8 bg-gray-200 border-2 border-t-white border-l-white border-r-gray-700 border-b-gray-700 flex items-center justify-center text-lg active:scale-95 cursor-pointer"
                        >
                          {mineGameOver ? '😵' : mineWin ? '😎' : '🙂'}
                        </button>
                        <div className="bg-black text-red-600 font-mono font-bold text-base px-2 py-0.5 rounded">
                          {String(mineTimer).padStart(3, '0')}
                        </div>
                      </div>

                      {/* 8x8 Grid */}
                      <div className="grid grid-cols-8 gap-0.5 bg-gray-700 p-1 border-2 border-t-gray-700 border-l-gray-700 border-r-white border-b-white">
                        {mineGrid.map((cell, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleMineClick(idx)}
                            onContextMenu={(e) => handleMineRightClick(e, idx)}
                            className={`w-7 h-7 flex items-center justify-center font-black text-xs cursor-pointer select-none ${
                              cell.revealed
                                ? cell.hasMine
                                  ? 'bg-red-500 border border-gray-600'
                                  : 'bg-[#d0d0d0] border border-gray-400'
                                : 'bg-[#bdbdbd] border-2 border-t-white border-l-white border-r-gray-700 border-b-gray-700 active:border-none'
                            }`}
                          >
                            {cell.revealed ? (
                              cell.hasMine ? '💣' : cell.neighborMines > 0 ? (
                                <span style={{
                                  color: cell.neighborMines === 1 ? '#0000ff' : cell.neighborMines === 2 ? '#008000' : '#ff0000'
                                }}>
                                  {cell.neighborMines}
                                </span>
                              ) : ''
                            ) : cell.flagged ? '🚩' : ''}
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] text-gray-700 mt-2 font-bold text-center">
                        ЛКМ — открыть ячейку • ПКМ — поставить флаг
                      </div>
                    </div>
                  )}

                  {/* APP: MY COMPUTER */}
                  {win.appKey === 'my_computer' && (
                    <div className="flex-1 flex flex-col p-3 bg-white text-black overflow-y-auto">
                      <div className="font-bold text-xs text-blue-900 border-b pb-1 mb-2">Жесткие диски и накопители:</div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 border rounded-lg bg-gray-50 flex items-center gap-2.5">
                          <HardDrive className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="font-bold text-xs">Локальный диск (C:)</div>
                            <div className="text-[10px] text-gray-500">42.1 ГБ свободно из 120 ГБ</div>
                          </div>
                        </div>
                        <div className="p-2 border rounded-lg bg-gray-50 flex items-center gap-2.5">
                          <HardDrive className="w-8 h-8 text-amber-600" />
                          <div>
                            <div className="font-bold text-xs">Диск данных (D:)</div>
                            <div className="text-[10px] text-gray-500">250 ГБ свободно из 500 ГБ</div>
                          </div>
                        </div>
                      </div>

                      <div className="font-bold text-xs text-blue-900 border-b pb-1 mb-2">Системные характеристики:</div>
                      <div className="space-y-1 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border">
                        <div><span className="font-semibold">Процессор:</span> Intel Pentium 4 @ 3.20 GHz</div>
                        <div><span className="font-semibold">Память (RAM):</span> 1024 МБ DDR SDRAM</div>
                        <div><span className="font-semibold">Система:</span> Microsoft Windows XP Professional Service Pack 3</div>
                        <div><span className="font-semibold">Статус:</span> Виртуализация активна и функционирует штатно</div>
                      </div>
                    </div>
                  )}

                  {/* APP: INTERNET EXPLORER */}
                  {win.appKey === 'explorer' && (
                    <div className="flex-1 flex flex-col bg-white text-black">
                      <div className="bg-[#ece9d8] p-1.5 border-b flex items-center gap-2 text-xs">
                        <span className="text-gray-600 font-bold">Адрес:</span>
                        <div className="flex-1 bg-white border px-2 py-0.5 rounded font-mono text-xs">
                          http://www.telegram.org/web2001
                        </div>
                        <button className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs">Перейти</button>
                      </div>
                      <div className="flex-1 p-4 bg-gradient-to-b from-sky-50 to-white overflow-y-auto">
                        <div className="max-w-md mx-auto text-center space-y-3">
                          <h3 className="text-lg font-black text-blue-800">Добро пожаловать в сеть Интернет!</h3>
                          <p className="text-xs text-gray-600">
                            Вы подключены через модемное соединение со скоростью 56 кбит/с.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 border rounded bg-white shadow-sm font-bold text-blue-600 cursor-pointer hover:underline">
                              🔍 Поисковик Yandex
                            </div>
                            <div className="p-2 border rounded bg-white shadow-sm font-bold text-blue-600 cursor-pointer hover:underline">
                              💬 Чат Телеграм
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APP: TASK MANAGER */}
                  {win.appKey === 'taskmgr' && (
                    <div className="flex-1 flex flex-col p-2 bg-[#ece9d8] text-black">
                      <div className="font-bold text-xs mb-1">Список активных процессов:</div>
                      <div className="flex-1 bg-white border border-gray-400 rounded overflow-y-auto text-xs font-mono">
                        <div className="grid grid-cols-3 bg-gray-100 p-1 font-bold border-b text-[10px]">
                          <span>Имя процесса</span>
                          <span>ЦП</span>
                          <span>Память</span>
                        </div>
                        {[
                          { name: 'explorer.exe', cpu: '2%', mem: '14 200 КБ' },
                          { name: 'telegram.exe', cpu: '1%', mem: '28 400 КБ' },
                          { name: 'svchost.exe', cpu: '0%', mem: '8 900 КБ' },
                          { name: 'soundman.exe', cpu: '0%', mem: '4 100 КБ' },
                          { name: 'minesweeper.exe', cpu: '0%', mem: '3 200 КБ' },
                          { name: 'System Idle Process', cpu: '97%', mem: '16 КБ' },
                        ].map((p, idx) => (
                          <div key={idx} className="grid grid-cols-3 p-1 hover:bg-blue-100 border-b border-gray-100">
                            <span className="truncate">{p.name}</span>
                            <span>{p.cpu}</span>
                            <span>{p.mem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APP: MEDIA PLAYER */}
                  {win.appKey === 'mediaplayer' && (
                    <div className="flex-1 flex flex-col items-center justify-between p-3 bg-slate-900 text-white">
                      <div className="w-full text-center">
                        <div className="text-xs text-sky-400 font-bold">Windows Media Visualizer</div>
                        <div className="text-[10px] text-gray-400">Трек: Nostalgia Synthwave 2000</div>
                      </div>
                      <div className="w-full h-24 bg-black rounded-lg border border-cyan-500/50 flex items-center justify-center gap-1 p-2">
                        {[40, 70, 90, 60, 100, 80, 50, 90, 60, 30].map((h, idx) => (
                          <div
                            key={idx}
                            className="w-3 bg-gradient-to-t from-blue-500 via-cyan-400 to-green-400 rounded-t animate-pulse"
                            style={{ height: `${h}%`, animationDuration: `${0.4 + idx * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => soundManager.playWindowsStartupSound()}
                        className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Воспроизвести мелодию</span>
                      </button>
                    </div>
                  )}

                  {/* APP: TRASH / RECYCLE BIN */}
                  {win.appKey === 'trash' && (
                    <div className="flex-1 flex flex-col p-3 bg-white text-black">
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <div className="text-xs font-bold text-gray-700">Корзина (0 объектов)</div>
                        <button
                          onClick={() => soundManager.playBeep(600, 0.05)}
                          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border rounded text-xs"
                        >
                          Очистить корзину
                        </button>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                        Корзина пуста
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* START MENU POPUP */}
        {isStartOpen && (
          <div
            style={{ zIndex: highestZ + 50 }}
            className={`absolute bottom-11 left-1 w-72 ${currentTheme.startMenu} p-2 flex flex-col animate-in slide-in-from-bottom-2 duration-150`}
          >
            {/* Header User Banner */}
            <div className="flex items-center gap-2.5 p-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-t-lg mb-2">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/50 flex items-center justify-center text-lg">
                👤
              </div>
              <div className="font-bold text-xs">Администратор</div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1 mb-2">
              {[
                { key: 'my_computer', name: 'Мой компьютер', icon: '💻' },
                { key: 'notepad', name: 'Блокнот', icon: '📝' },
                { key: 'paint', name: 'Paint', icon: '🎨' },
                { key: 'calc', name: 'Калькулятор', icon: '🧮' },
                { key: 'cmd', name: 'Командная строка CMD', icon: '⬛' },
                { key: 'minesweeper', name: 'Игра Сапёр', icon: '💣' },
                { key: 'explorer', name: 'Internet Explorer', icon: '🌐' },
                { key: 'taskmgr', name: 'Диспетчер задач', icon: '📊' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => openApp(item.key)}
                  className="w-full px-2.5 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-300 pt-2 flex items-center justify-between text-xs">
              <button
                onClick={handleTriggerBsod}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <AlertOctagon className="w-3 h-3" />
                <span>Вызвать BSOD</span>
              </button>

              <button
                onClick={handleReboot}
                className="px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Перезагрузка</span>
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM TASKBAR */}
        <div
          className={`h-11 px-2 flex items-center justify-between relative z-40 shrink-0 ${currentTheme.taskbar}`}
        >
          {/* Start Button */}
          <button
            onClick={() => {
              soundManager.playBeep(900, 0.04);
              setIsStartOpen(!isStartOpen);
            }}
            className={`px-3 py-1 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all text-xs ${currentTheme.startBtn}`}
          >
            <span className="text-sm">🪟</span>
            <span className="uppercase tracking-wider font-black">Пуск</span>
          </button>

          {/* Running Tasks in Taskbar */}
          <div className="flex-1 flex items-center gap-1.5 px-2 overflow-x-auto no-scrollbar">
            {openWindows.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  if (w.isMinimized || activeWindowId !== w.id) {
                    focusWindow(w.id);
                  } else {
                    toggleMinimize(w.id);
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 truncate max-w-[130px] cursor-pointer transition-all border ${
                  activeWindowId === w.id && !w.isMinimized
                    ? 'bg-blue-600 text-white border-blue-400 shadow-inner'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/10'
                }`}
              >
                <span>{w.icon}</span>
                <span className="truncate">{w.title}</span>
              </button>
            ))}
          </div>

          {/* System Tray */}
          <div className="flex items-center gap-2 text-xs font-mono shrink-0 bg-black/20 px-2.5 py-1 rounded border border-white/10">
            <Volume2 className="w-3.5 h-3.5 text-gray-300" />
            <Wifi className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-bold">{currentTime || '12:00'}</span>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
