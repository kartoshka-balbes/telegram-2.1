import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Activity, Cpu, HardDrive } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface Process {
  id: string;
  name: string;
  cpu: string;
  ram: string;
  isVirus?: boolean;
}

interface ToolProps {
  onClose: () => void;
}

const VIRUS_TYPES = [
  'Trojan.Win32.Generic',
  'CryptoMiner.XMRig',
  'Ransomware.LockBit',
  'Worm.Win32.NetSky',
  'Keylogger.SilentSys',
  'Spyware.Agent',
  'Adware.PopupGen',
  'Rootkit.HiddenCore',
  'Backdoor.DarkComet',
  'Stealer.RedLine',
];

const INITIAL_VIRUSES: Process[] = Array.from({ length: 684 }, (_, i) => ({
  id: `virus-${i + 1}`,
  name: `${VIRUS_TYPES[i % VIRUS_TYPES.length]} (Вирус №${i + 1})`,
  cpu: `${(Math.random() * 4.5 + 0.1).toFixed(1)}%`,
  ram: `${Math.floor(Math.random() * 180 + 12)} МБ`,
  isVirus: true,
}));

export const TaskManagerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [processes, setProcesses] = useState<Process[]>(INITIAL_VIRUSES);

  const handleKillProcess = (id: string) => {
    soundManager.playBeep(400, 0.05);
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ToolWrapper title="Диспетчер задач / Монитор процессов" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full py-2 font-mono">
        {/* Top summary header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-slate-400 block">Загрузка ЦП:</span>
              <span className="font-bold text-white text-sm">99.8%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-slate-400 block">Оперативная память:</span>
              <span className="font-bold text-white text-sm">15.9 / 16 ГБ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Activity className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-slate-400 font-bold block text-[10px]">Всего процессов:</span>
              <span className="font-black text-amber-300 text-xs">{processes.length} шт.</span>
            </div>
          </div>
        </div>

        {/* Processes List (684 items) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex-1 overflow-y-auto space-y-1.5 max-h-[420px]">
          {processes.map((p) => (
            <div
              key={p.id}
              className="p-2.5 bg-red-500/15 border border-red-500/50 rounded-2xl flex items-center justify-between text-xs hover:bg-red-500/25 transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <Activity className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-bold text-red-400 truncate text-[11px]">{p.name}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-red-300/80">
                  {p.cpu} / {p.ram}
                </span>
                <button
                  onClick={() => handleKillProcess(p.id)}
                  className="px-2.5 py-1 bg-red-600/80 hover:bg-red-500 text-white font-bold rounded-xl text-[10px] uppercase cursor-pointer border border-red-400/60"
                >
                  Снять
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
