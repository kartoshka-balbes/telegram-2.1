import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Shield, ShieldAlert, Cpu, Database, Radar, FlaskConical, Fingerprint } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const LOG_LINES = [
  'heuristic.engine: загрузка модуля эвристики v7.4.1',
  'sig.db: проверка целостности базы сигнатур (SHA-256 ok)',
  'kernel.guard: анализ таблицы системных вызовов (syscall table)',
  'mem.scan: обход виртуальных страниц 0x7FFA0000–0x7FFFFFFF',
  'net.shield: инспекция исходящих TLS-сессий (1.3)',
  'chem.matrix: молекулярное сопоставление образцов кода',
  'sandbox: изолированный запуск подозрительного объекта',
  'cloud.rep: запрос репутации файла (хэш MD5/SHA-1)',
  'rootkit.hunt: сканирование скрытых драйверов и хуков',
  'ml.core: классификация поведения нейросетью (conf 0.987)',
  'registry.watch: контроль автозагрузки и планировщика',
  'entropy: расчёт энтропии Шеннона по секциям PE/ELF',
];

const randHex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');

export const AntivirusTool: React.FC<ToolProps> = ({ onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [virusCount, setVirusCount] = useState<number | null>(null);

  // Бутафорские показатели (ничего из этого не настоящее)
  const [cpu, setCpu] = useState(23);
  const [ram, setRam] = useState(41);
  const [entropy, setEntropy] = useState(6.83);
  const [files, setFiles] = useState(0);
  const [rate, setRate] = useState(0);
  const [sigs] = useState(184392071);
  const [log, setLog] = useState<string[]>(['ядро защиты инициализировано', 'сигнатуры актуальны: ' + new Date().toLocaleDateString('ru-RU')]);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(
      () => {
        setCpu((c) => Math.max(8, Math.min(97, Math.round(c + (Math.random() - 0.5) * (scanning ? 22 : 8)))));
        setRam((r) => Math.max(20, Math.min(92, Math.round(r + (Math.random() - 0.5) * 6))));
        setEntropy((e) => Math.max(4, Math.min(7.99, Number((e + (Math.random() - 0.5) * 0.3).toFixed(2)))));
        if (scanning) {
          setFiles((f) => f + Math.floor(1800 + Math.random() * 5200));
          setRate(Math.floor(9000 + Math.random() * 14000));
          setLog((l) => [...l.slice(-40), `${randHex(8)}  ${LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)]}`]);
        }
      },
      scanning ? 350 : 1100
    );
    return () => window.clearInterval(id);
  }, [scanning]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const handleScan = () => {
    setScanning(true);
    setVirusCount(null);
    setFiles(0);
    soundManager.playBeep(800, 0.1);

    const delay = Math.floor(Math.random() * 9000) + 3000; // 3-12s
    setTimeout(() => {
      setScanning(false);
      setRate(0);
      // Random from 2638947 to 173256839
      const count = Math.floor(Math.random() * (173256839 - 2638947 + 1)) + 2638947;
      setVirusCount(count);
      setLog((l) => [...l, 'scan.complete: обнаружены угрозы, карантин недоступен']);
      soundManager.playSiren();
    }, delay);
  };

  const danger = virusCount !== null;
  const bar = (v: number, color: string) => (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${v}%`, background: color }} />
    </div>
  );

  return (
    <ToolWrapper title="Антивирус" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-3 py-1 select-none">
        {/* Щит и радар */}
        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-b from-[#07201d] to-[#050b12] p-5 flex flex-col items-center">
          <style>{`@keyframes av-sweep { to { transform: rotate(360deg); } } @keyframes av-hex { 0%,100% { opacity:.25 } 50% { opacity:.9 } }`}</style>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(110,255,200,0.35) 1px, transparent 0)', backgroundSize: '18px 18px' }} />

          <div className="relative w-44 h-44">
            {[100, 72, 44].map((p) => (
              <span key={p} className="absolute rounded-full border border-emerald-400/25" style={{ inset: `${(100 - p) / 2}%` }} />
            ))}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${danger ? 'rgba(239,68,68,0.5)' : 'rgba(52,211,153,0.5)'}, transparent 70deg)`,
                animation: `av-sweep ${scanning ? 1.2 : 4}s linear infinite`,
              }}
            />
            <div
              className={`absolute inset-[27%] rounded-full border-2 flex items-center justify-center backdrop-blur-sm ${
                danger ? 'border-red-500 bg-red-950/60 text-red-400' : scanning ? 'border-amber-400 bg-amber-950/50 text-amber-300' : 'border-emerald-400 bg-[#06241f]/80 text-emerald-300'
              }`}
            >
              {danger ? <ShieldAlert className="w-10 h-10 animate-pulse" /> : <Shield className="w-10 h-10" />}
            </div>
          </div>
          <div className="relative mt-3 text-[10px] font-mono tracking-widest text-emerald-300/80">
            {scanning ? 'DEEP SCAN · РЕЖИМ ГЛУБОКОГО АНАЛИЗА' : danger ? 'THREAT LEVEL: CRITICAL' : 'SYSTEM GUARD · АКТИВЕН'}
          </div>
        </div>

        {/* Показатели */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
            <div className="flex justify-between text-[10px] text-gray-400"><span className="flex items-center gap-1"><Cpu className="w-3 h-3" />CPU</span><span className="text-white">{cpu}%</span></div>
            {bar(cpu, '#34d399')}
            <div className="flex justify-between text-[10px] text-gray-400 pt-1"><span>RAM</span><span className="text-white">{ram}%</span></div>
            {bar(ram, '#38bdf8')}
          </div>
          <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3 space-y-1 text-[10px] text-gray-400">
            <div className="flex justify-between"><span className="flex items-center gap-1"><Database className="w-3 h-3" />Сигнатур</span><span className="text-white">{sigs.toLocaleString('ru-RU')}</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><FlaskConical className="w-3 h-3" />Энтропия</span><span className="text-white">{entropy.toFixed(2)} бит/Б</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><Radar className="w-3 h-3" />Файлов</span><span className="text-white">{files.toLocaleString('ru-RU')}</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" />Скорость</span><span className="text-white">{rate.toLocaleString('ru-RU')}/с</span></div>
          </div>
        </div>

        {/* Молекулярная сетка */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-2">МОЛЕКУЛЯРНЫЙ АНАЛИЗ СИГНАТУР · C₆H₁₂O₆ ↔ SHA-256</div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="aspect-square rounded-[30%] bg-emerald-400/70"
                style={{ animation: `av-hex ${1.2 + (i % 7) * 0.25}s ease-in-out infinite`, animationDelay: `${(i % 9) * 0.12}s`, opacity: scanning ? undefined : 0.35 }}
              />
            ))}
          </div>
        </div>

        {/* Лог */}
        <div ref={logRef} className="rounded-2xl bg-black/50 border border-white/10 p-3 h-28 overflow-y-auto font-mono text-[10px] leading-relaxed text-emerald-300/90">
          {log.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">&gt; {l}</div>
          ))}
        </div>

        {/* Кнопка */}
        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-400 disabled:opacity-50 text-slate-950 font-black text-base rounded-full shadow-xl uppercase transition-all cursor-pointer active:scale-[0.98]"
        >
          {scanning ? 'ИДЁТ СКАНИРОВАНИЕ...' : 'Сканировать'}
        </button>

        {virusCount !== null && (
          <div className="bg-red-500/10 border border-red-500/60 rounded-[1.75rem] p-5 w-full shadow-2xl text-center animate-in zoom-in duration-200">
            <h3 className="text-red-400 font-bold text-xs uppercase mb-2">РЕЗУЛЬТАТ СКАНИРОВАНИЯ:</h3>
            <div className="text-3xl font-black text-white tracking-tight mb-2 tabular-nums">{virusCount.toLocaleString('ru-RU')}</div>
            <span className="text-xs font-bold text-red-400 uppercase">Вирусов найдено на вашем телефоне!</span>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
