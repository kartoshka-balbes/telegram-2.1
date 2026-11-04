import React, { useState } from 'react';
import { X, Plus, Camera } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface Story {
  id: string;
  name: string;
  avatar: string;
  text: string;
  color: string;
  time: string;
}

const MOCK_STORIES: Story[] = [
  { id: '1', name: 'Ольга С.', avatar: '👵', text: 'Засолила 40 банок огурцов на зиму! 🥒', color: 'from-amber-600 to-red-800', time: '10 мин назад' },
  { id: '2', name: 'Бургер Кинг', avatar: '🍔', text: 'Бесплатный воппер при заказе на 10 000 руб! 💥', color: 'from-orange-600 to-yellow-600', time: '25 мин назад' },
  { id: '3', name: 'Маньяк', avatar: '🔪', text: 'Ищу нового друга для прогулки в тёмном парке... 🌲', color: 'from-red-950 to-black', time: '1 час назад' },
  { id: '4', name: 'Дональд Трамп', avatar: '🇺🇸', text: 'MAKE TELEGRAM GREAT AGAIN! 🦅', color: 'from-blue-600 to-red-600', time: '2 часа назад' },
  { id: '5', name: 'ТехСервер', avatar: '⚙️', text: 'ВНИМАНИЕ: Плановое техническое обслуживание успешно завершено! 💻✨', color: 'from-cyan-700 to-blue-900', time: '3 часа назад' },
];

export const StoriesBar: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const handleCloseStory = () => {
    if (activeStory) {
      setStories((prev) => prev.filter((s) => s.id !== activeStory.id));
      setActiveStory(null);
    }
  };

  return (
    <div className="px-3 pt-3 pb-2">
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar">
        {/* Create Story Button */}
        <button
          onClick={() => {
            soundManager.playBeep(900, 0.05);
            setShowCameraModal(true);
          }}
          className="shrink-0 flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="w-[58px] h-[58px] rounded-full p-[2px] bg-gradient-to-tr from-[#8f9bff] to-[#b8c0ff] group-hover:scale-105 transition-all shadow-[0_0_8px_rgba(143,155,255,0.3)]">
            <span className="w-full h-full flex items-center justify-center bg-[#171b27] rounded-full text-[#8f9bff]">
              <Plus className="w-5 h-5" />
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#8f9bff] max-w-[62px] truncate">
            Создать историю
          </span>
        </button>

        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              soundManager.playBeep(1100, 0.05);
              setActiveStory(story);
            }}
            className="shrink-0 flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-[58px] h-[58px] rounded-full p-[2px] bg-gradient-to-tr from-[#ff8fd8] via-[#b18cff] to-[#8f9bff] group-hover:scale-105 transition-all shadow-[0_0_8px_rgba(143,155,255,0.3)]">
              <span className="w-full h-full flex items-center justify-center bg-[#171b27] rounded-full overflow-hidden text-[26px]">
                {story.avatar}
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-300 max-w-[62px] truncate">
              {story.name}
            </span>
          </button>
        ))}
      </div>

      {/* Camera Required Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className="w-full max-w-xs bg-[#0f121a] border border-[#8f9bff]/50 rounded-2xl p-5 text-center space-y-4 shadow-[0_0_25px_rgba(143,155,255,0.3)] animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-[#222840] border border-[#8f9bff] rounded-full flex items-center justify-center mx-auto text-[#8f9bff]">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-white uppercase">ОШИБКА КАМЕРЫ</h3>
              <p className="text-xs text-gray-300 font-bold">Подключите камеру</p>
              <p className="text-[10px] text-gray-400">Для записи и публикации новой истории требуется доступ к видеоустройству.</p>
            </div>
            <button
              onClick={() => {
                soundManager.playBeep(600, 0.05);
                setShowCameraModal(false);
              }}
              className="w-full py-2.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {/* Story View Modal (Slightly smaller size) */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className={`w-full max-w-[280px] sm:max-w-[320px] h-[320px] sm:h-[360px] bg-gradient-to-br ${activeStory.color} border border-[#8f9bff]/50 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between relative shadow-[0_0_30px_rgba(143,155,255,0.25)]`}>
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white border-b border-white/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{activeStory.avatar}</span>
                <div>
                  <h4 className="font-extrabold text-xs">{activeStory.name}</h4>
                  <span className="text-[9px] text-white/70 font-mono">{activeStory.time}</span>
                </div>
              </div>

              <button
                onClick={handleCloseStory}
                className="p-1 text-gray-200 hover:text-[#8f9bff] bg-black/50 hover:bg-black/80 rounded-xl transition-all cursor-pointer hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="my-auto text-center p-3 bg-black/60 border border-[#8f9bff]/30 rounded-xl backdrop-blur-md">
              <p className="text-xs sm:text-sm font-black text-white leading-relaxed">
                {activeStory.text}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="text-center">
              <button
                onClick={handleCloseStory}
                className="w-full py-2 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold rounded-xl uppercase text-[10px] tracking-wider cursor-pointer shadow-[0_0_15px_rgba(143,155,255,0.4)] transition-all"
              >
                Закрыть историю
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
