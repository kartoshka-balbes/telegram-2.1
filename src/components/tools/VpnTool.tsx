import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Power, Globe } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const VpnTool: React.FC<ToolProps> = ({ onClose }) => {
  const [connecting, setConnecting] = useState(false);
  const [forbiddenModal, setForbiddenModal] = useState(false);

  const handleToggleVpn = () => {
    setConnecting(true);
    soundManager.playBeep(800, 0.1);

    const delay = Math.floor(Math.random() * 3000) + 4000; // 4-7s
    setTimeout(() => {
      setConnecting(false);
      setForbiddenModal(true);
      soundManager.playSiren();
    }, delay);
  };

  useEffect(() => {
    if (forbiddenModal) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [forbiddenModal, onClose]);

  return (
    <ToolWrapper title="VPN" onClose={onClose}>
      <div className="flex-1 flex flex-col items-center justify-between max-w-sm mx-auto w-full py-8 text-center">
        {/* Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full shadow-xl">
          <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold mb-2">
            <Globe className="w-5 h-5" />
            <span>Локация: Неизвестно</span>
          </div>
          <div className="text-xs font-mono text-slate-500">IP: 192.168.0.777 (Анонимно)</div>
        </div>

        {/* Big Circular Power Button */}
        <div className="relative my-auto">
          <button
            onClick={handleToggleVpn}
            disabled={connecting || forbiddenModal}
            className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-all cursor-pointer ${
              connecting
                ? 'border-amber-400 bg-amber-500/10 text-amber-400 animate-pulse'
                : 'border-cyan-500 bg-cyan-600/20 text-cyan-400 hover:scale-105 active:scale-95 shadow-cyan-500/30'
            }`}
          >
            <Power className="w-16 h-16 mb-1" />
            <span className="text-xs font-black uppercase">
              {connecting ? 'ПОДКЛЮЧЕНИЕ...' : 'ПОДКЛЮЧИТЬ'}
            </span>
          </button>
        </div>

        {/* Forbidden Modal Popup */}
        {forbiddenModal && (
          <div className="fixed inset-0 bg-red-950/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-pulse">
            <div className="text-9xl mb-6 animate-bounce">🚨</div>
            <h1 className="text-4xl sm:text-6xl font-black text-red-500 uppercase tracking-widest shadow-text">
              ЗАПРЕЩЕНО
            </h1>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
