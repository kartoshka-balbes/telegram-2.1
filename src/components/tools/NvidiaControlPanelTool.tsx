import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Monitor, Cpu, Sliders, Check } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const NvidiaControlPanelTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [dsr, setDsr] = useState('4.00x (4K Ultra)');
  const [gSync, setGSync] = useState(true);
  const [filtering, setFiltering] = useState('16x (Максимальное качество)');
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    soundManager.playBeep(1200, 0.1);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <ToolWrapper title="Панель управления NVIDIA" onClose={onClose} headerColor="bg-[#12151e] border-[#8f9bff]">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-mono select-none overflow-y-auto pr-1">
        
        {/* Top Banner */}
        <div className="bg-[#0f121a] p-3 rounded-2xl border border-[#8f9bff] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#8f9bff]">NVIDIA</span>
            <div>
              <div className="text-xs font-bold text-white">GeForce RTX 5090 Ti</div>
              <div className="text-[9px] text-gray-400">Драйвер v560.81 WHQL</div>
            </div>
          </div>
          <span className="text-[10px] bg-[#8f9bff] text-black px-2 py-0.5 rounded font-black uppercase">
            3D Pro
          </span>
        </div>

        {applied && (
          <div className="p-3 bg-[#222840] border border-[#8f9bff] text-[#8f9bff] text-xs font-bold text-center rounded-xl animate-in zoom-in">
            Параметры 3D успешно применены к видеокарте!
          </div>
        )}

        {/* Settings tree */}
        <div className="bg-[#12151e] border border-[#222840] p-4 rounded-2xl space-y-3 font-sans">
          <div className="text-xs font-extrabold text-[#8f9bff] uppercase border-b border-[#222840] pb-1">
            Управление параметрами 3D
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">DSR - Степень:</span>
              <select
                value={dsr}
                onChange={(e) => setDsr(e.target.value)}
                className="bg-[#171b27] border border-[#222840] text-[#8f9bff] rounded-lg px-2 py-1 text-xs outline-none"
              >
                <option>1.78x DL</option>
                <option>2.25x DL</option>
                <option>4.00x (4K Ultra)</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">G-SYNC:</span>
              <input
                type="checkbox"
                checked={gSync}
                onChange={(e) => setGSync(e.target.checked)}
                className="accent-[#8f9bff] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Анизотропная фильтрация:</span>
              <select
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                className="bg-[#171b27] border border-[#222840] text-[#8f9bff] rounded-lg px-2 py-1 text-xs outline-none"
              >
                <option>Выкл</option>
                <option>4x</option>
                <option>8x</option>
                <option>16x (Максимальное качество)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleApply}
          className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Применить Настройки
        </button>

      </div>
    </ToolWrapper>
  );
};
