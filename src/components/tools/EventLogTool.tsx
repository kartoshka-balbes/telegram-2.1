import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Terminal } from 'lucide-react';

interface LogItem {
  id: string;
  time: string;
  text: string;
  level: 'error' | 'fatal' | 'warn' | 'info';
}

interface ToolProps {
  onClose: () => void;
}

const REALISTIC_LOGS = [
  { text: '[CRITICAL] Kernel panic - not syncing: Fatal exception in interrupt', level: 'fatal' as const },
  { text: '[ERROR] ACPI BIOS Error (bug): Could not resolve symbol [\\_SB.PCI0.SAT0.APT0]', level: 'error' as const },
  { text: '[WARN] systemd-journald[412]: Suppressed 82 messages from /system.slice/cron.service', level: 'warn' as const },
  { text: '[ERROR] Memory allocation failure at 0x00007FFF89A20B00 (ENOMEM)', level: 'error' as const },
  { text: '[FATAL] Segmentation fault (core dumped) in process 1042 (dbus-daemon)', level: 'fatal' as const },
  { text: '[WARN] Disk I/O latency spike detected on /dev/sda1 (1240ms)', level: 'warn' as const },
  { text: '[ERROR] Connection refused by host 127.0.0.1:5432 (PostgreSQL daemon)', level: 'error' as const },
  { text: '[CRITICAL] Hardware error detected: CPU 0 MCE bank 4', level: 'fatal' as const },
  { text: '[WARN] Out of memory: Kill process 8812 (mysqld) score 912 or sacrifice child', level: 'warn' as const },
  { text: '[ERROR] SSL handshake failed: Certificate verification error (0x14090086)', level: 'error' as const },
  { text: '[FATAL] Unhandled null pointer dereference at address 0x00000000', level: 'fatal' as const },
];

const PELMENI_ERROR = {
  text: '[ERROR] CRITICAL_SYSTEM_FAILURE: Deficit of pelmeni (пельмени) detected in freezer node 4 (0x8007000B)',
  level: 'error' as const,
};

export const EventLogTool: React.FC<ToolProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: '1',
      time: new Date().toLocaleTimeString(),
      text: '[INFO] System Event Log Service initialized',
      level: 'info',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sample = REALISTIC_LOGS[Math.floor(Math.random() * REALISTIC_LOGS.length)];
      const newLog: LogItem = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        text: sample.text,
        level: sample.level,
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 50)]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Журнал событий" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full py-2">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs flex-1 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3 text-slate-400">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold uppercase tracking-wider">Системные события Windows/Linux</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
                  log.level === 'fatal'
                    ? 'bg-red-950/60 border-red-800 text-red-300'
                    : log.level === 'error'
                    ? 'bg-red-900/30 border-red-800/50 text-red-400'
                    : log.level === 'warn'
                    ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75">
                  <span>TIMESTAMP: {log.time}</span>
                  <span className="uppercase font-bold">{log.level}</span>
                </div>
                <div className="font-mono text-xs">{log.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
