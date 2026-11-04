import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';
import { Cpu, Terminal, Delete, ShieldAlert } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

export const CalculatorTool: React.FC<ToolProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expressionHistory, setExpressionHistory] = useState<string>('');
  const [isRad, setIsRad] = useState(true);
  const [memory, setMemory] = useState<number | null>(null);

  const handlePress = (val: string) => {
    soundManager.playBeep(450, 0.03);

    if (val === 'C') {
      setDisplay('0');
      setExpressionHistory('');
      return;
    }

    if (val === 'DEL') {
      if (display.length <= 1 || display === 'ОШИБКА' || display === '0') {
        setDisplay('0');
      } else {
        setDisplay((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (val === 'RAD' || val === 'DEG') {
      setIsRad(!isRad);
      return;
    }

    if (val === 'M+') {
      try {
        const num = parseFloat(display);
        if (!isNaN(num)) {
          setMemory((prev) => (prev !== null ? prev + num : num));
        }
      } catch {}
      return;
    }

    if (val === 'MR') {
      if (memory !== null) {
        setDisplay(String(memory));
      }
      return;
    }

    if (val === 'MC') {
      setMemory(null);
      return;
    }

    if (val === '=') {
      try {
        setExpressionHistory(display);
        let expr = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/√\(/g, 'Math.sqrt(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(');

        if (isRad) {
          expr = expr.replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(');
        } else {
          expr = expr
            .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)')
            .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)');
        }

        expr = expr.replace(/\^/g, '**');

        const calculateFunc = new Function(`'use strict'; return (${expr})`);
        const res = calculateFunc();

        if (res === undefined || isNaN(res) || !isFinite(res)) {
          setDisplay('ОШИБКА');
        } else {
          // Format result cleanly
          const rounded = Number(res.toFixed(10)).toString();
          setDisplay(rounded);
        }
      } catch {
        setDisplay('ОШИБКА');
      }
      return;
    }

    if (['sin', 'cos', 'log', 'ln', '√'].includes(val)) {
      if (display === '0' || display === 'ОШИБКА') {
        setDisplay(val + '(');
      } else {
        setDisplay((prev) => prev + val + '(');
      }
      return;
    }

    if (display === '0' || display === 'ОШИБКА') {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const BUTTON_ROWS = [
    [
      { label: isRad ? 'RAD' : 'DEG', type: 'mode' },
      { label: 'sin', type: 'fn' },
      { label: 'cos', type: 'fn' },
      { label: 'log', type: 'fn' },
      { label: 'ln', type: 'fn' },
      { label: 'C', type: 'danger' },
    ],
    [
      { label: '√', type: 'fn' },
      { label: '^', type: 'fn' },
      { label: '(', type: 'fn' },
      { label: ')', type: 'fn' },
      { label: 'DEL', type: 'fn' },
      { label: '÷', type: 'op' },
    ],
    [
      { label: 'MC', type: 'mem' },
      { label: '7', type: 'num' },
      { label: '8', type: 'num' },
      { label: '9', type: 'num' },
      { label: '%', type: 'fn' },
      { label: '×', type: 'op' },
    ],
    [
      { label: 'MR', type: 'mem' },
      { label: '4', type: 'num' },
      { label: '5', type: 'num' },
      { label: '6', type: 'num' },
      { label: 'π', type: 'fn' },
      { label: '-', type: 'op' },
    ],
    [
      { label: 'M+', type: 'mem' },
      { label: '1', type: 'num' },
      { label: '2', type: 'num' },
      { label: '3', type: 'num' },
      { label: 'e', type: 'fn' },
      { label: '+', type: 'op' },
    ],
    [
      { label: '0', type: 'num', span: 'col-span-2' },
      { label: '.', type: 'num' },
      { label: '=', type: 'action', span: 'col-span-3' },
    ],
  ];

  return (
    <ToolWrapper title="Инженерный Калькулятор" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center py-2 select-none">
        
        {/* Brutalist Heavy Industrial Chassis */}
        <div className="bg-[#111215] border-2 border-[#2b2e36] rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-3 relative">
          
          {/* Top Industrial Header Plate */}
          <div className="flex items-center justify-between border-b border-[#22252c] pb-2 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 font-bold">
              <Cpu className="w-3.5 h-3.5 text-zinc-300" />
              <span>CALC-UNIT MK.IV // SER. 904-B</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                isRad 
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-200' 
                  : 'bg-zinc-800 border-zinc-600 text-zinc-300'
              }`}>
                {isRad ? 'RAD' : 'DEG'}
              </span>
              {memory !== null && (
                <span className="bg-zinc-800 border border-zinc-600 text-zinc-200 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  M: {memory}
                </span>
              )}
            </div>
          </div>

          {/* Monochromatic Rugged LCD / VFD Display */}
          <div className="bg-[#08090b] border-2 border-[#1c1f26] rounded-xl p-3 sm:p-4 text-right shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)] flex flex-col justify-between min-h-[90px] relative overflow-hidden">
            {/* Expression History */}
            <div className="text-right text-xs font-mono text-zinc-400 tracking-wider h-4 overflow-hidden truncate">
              {expressionHistory}
            </div>

            {/* Main Value Display */}
            <div className="overflow-x-auto whitespace-nowrap text-right py-1">
              <span className={`text-3xl sm:text-4xl font-mono font-black tracking-tight ${
                display === 'ОШИБКА' ? 'text-red-400' : 'text-zinc-100'
              }`}>
                {display}
              </span>
            </div>

            {/* Bottom Status Ticker */}
            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-1 border-t border-zinc-900">
              <span>STATUS: NOMINAL</span>
              <span>64-BIT PRECISION</span>
            </div>
          </div>

          {/* Heavy Block Keypad Grid */}
          <div className="space-y-1.5 pt-1">
            {BUTTON_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-6 gap-1.5">
                {row.map((btn) => {
                  let style = 'bg-[#181a1f] hover:bg-[#22252c] text-zinc-200 border-[#262a33]';

                  if (btn.type === 'num') {
                    style = 'bg-[#1e2128] hover:bg-[#2a2f38] text-white font-bold border-[#2f3542] active:bg-[#14161b]';
                  } else if (btn.type === 'op') {
                    style = 'bg-[#292e38] hover:bg-[#363c4a] text-zinc-100 font-black border-[#404858] active:bg-[#1f232b]';
                  } else if (btn.type === 'danger') {
                    style = 'bg-[#261515] hover:bg-[#381c1c] text-red-300 font-black border-[#4a2222] active:bg-[#1a0f0f]';
                  } else if (btn.type === 'action') {
                    style = 'bg-[#3b4352] hover:bg-[#495366] text-white font-black border-[#586377] active:bg-[#2c323d] shadow-md';
                  } else if (btn.type === 'mode') {
                    style = 'bg-[#1d222b] hover:bg-[#282f3c] text-zinc-300 font-bold text-[11px] border-[#313a4a]';
                  } else if (btn.type === 'mem') {
                    style = 'bg-[#15171c] hover:bg-[#1e2128] text-zinc-400 font-mono text-[10px] border-[#20242c]';
                  } else if (btn.type === 'fn') {
                    style = 'bg-[#16181d] hover:bg-[#21242c] text-zinc-300 font-mono text-xs border-[#242831]';
                  }

                  return (
                    <button
                      key={btn.label}
                      onClick={() => handlePress(btn.label)}
                      className={`py-3 sm:py-3.5 rounded-lg border text-sm transition-all duration-75 cursor-pointer flex items-center justify-center select-none active:translate-y-0.5 active:shadow-inner ${style} ${btn.span || ''}`}
                    >
                      {btn.label === 'DEL' ? <Delete className="w-4 h-4" /> : btn.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Chassis Bottom Markings */}
          <div className="flex justify-between items-center text-[8px] font-mono text-zinc-400 pt-1 px-1">
            <span>HEAVY DUTY CALCULATION MODULE</span>
            <span>SYSTEM CALIBRATED</span>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};
