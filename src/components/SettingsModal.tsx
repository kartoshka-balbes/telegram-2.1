import React, { useState } from 'react';
import { X, Check, Monitor, Sliders } from 'lucide-react';
import { soundManager, triggerHaptic } from '../utils/soundEffects';

interface SettingsModalProps {
  onClose: () => void;
  userProfile: { name: string; status: string; avatar: string };
  onUpdateProfile: (updated: { name: string; status: string; avatar: string }) => void;
}

const QUALITIES = ['144p', '360p', '480p', '720p', '1080p', '2k', '4k', '8k', '16k'];
const AVATARS = ['🐵', '🤡', '👽', '👑', '🚀', '⚡', '💩', '😎'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [status, setStatus] = useState(userProfile.status);
  const [avatar, setAvatar] = useState(userProfile.avatar);

  const [quality, setQuality] = useState('1080p');
  const [vrMode, setVrMode] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);

  const handleSave = () => {
    triggerHaptic('success');
    soundManager.playBeep(900, 0.1);
    onUpdateProfile({ name, status, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e1119] border border-[#8f9bff]/40 rounded-2xl p-6 text-white shadow-[0_0_30px_rgba(143,155,255,0.2)] relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222840] pb-4 mb-4">
          <h2 className="text-xl font-extrabold uppercase tracking-wider text-[#8f9bff]">Настройки</h2>
          <button
            onClick={() => {
              triggerHaptic('tap');
              onClose();
            }}
            className="p-1.5 rounded-xl text-gray-400 hover:text-[#8f9bff] hover:bg-[#222840]/50 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Profile Section */}
          <div className="space-y-3 bg-[#141824] p-4 rounded-xl border border-[#222840]">
            <h3 className="text-xs font-bold text-[#8f9bff] uppercase tracking-wider">
              Редактирование профиля:
            </h3>

            {/* Avatar Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => {
                    triggerHaptic('tap');
                    setAvatar(av);
                  }}
                  className={`text-2xl p-2 rounded-xl transition-all cursor-pointer border ${
                    avatar === av
                      ? 'bg-[#8f9bff]/20 border-[#8f9bff] scale-105 shadow-[0_0_10px_rgba(143,155,255,0.3)]'
                      : 'border-[#222840] hover:bg-[#171b27]'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="w-full bg-[#0f121a] border border-[#222840] rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-[#8f9bff]"
              />
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Статус"
                className="w-full bg-[#0f121a] border border-[#222840] rounded-xl p-3 text-sm text-white outline-none focus:border-[#8f9bff]"
              />
            </div>
          </div>

          {/* App Video Quality Settings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#8f9bff]" />
              Качество графики и видео:
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {QUALITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    triggerHaptic('tap');
                    setQuality(q);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    quality === q
                      ? 'bg-[#8f9bff] text-black scale-105 shadow-[0_0_12px_rgba(143,155,255,0.4)]'
                      : 'bg-[#141824] text-gray-300 border border-[#222840] hover:border-[#8f9bff]/50'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Display Modes (VR & Cinema) */}
          <div className="space-y-3 bg-[#141824] p-4 rounded-xl border border-[#222840]">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-[#8f9bff]" />
              Специальные режимы:
            </h3>

            {/* VR Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm block">Режим VR (Виртуальная реальность)</span>
                <span className="text-[10px] text-gray-400">Погружение через шлем</span>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setVrMode(!vrMode);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  vrMode ? 'bg-[#8f9bff]' : 'bg-[#171b27] border border-[#222840]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    vrMode ? 'translate-x-6 bg-black' : 'translate-x-0 bg-gray-400'
                  }`}
                />
              </button>
            </div>

            {/* Cinema Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm block">Режим Кинотеатра</span>
                <span className="text-[10px] text-gray-400">Затемнение элементов</span>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setCinemaMode(!cinemaMode);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  cinemaMode ? 'bg-[#8f9bff]' : 'bg-[#171b27] border border-[#222840]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    cinemaMode ? 'translate-x-6 bg-black' : 'translate-x-0 bg-gray-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Save */}
        <div className="pt-4 border-t border-[#222840] mt-4">
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(143,155,255,0.3)] active:scale-[0.97] transition-all"
          >
            <Check className="w-5 h-5" />
            <span>Сохранить изменения</span>
          </button>
        </div>
      </div>
    </div>
  );
};

