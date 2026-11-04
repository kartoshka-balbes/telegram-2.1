import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { X, Heart, ThumbsDown, Share2, Flag, Plus, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface ShortVideo {
  id: number;
  title: string;
  author: string;
  emoji: string;
  gradient: string;
  likes: number;
}

const SHORT_VIDEOS: ShortVideo[] = [
  { id: 1, title: 'Кот летит в космос 🚀🐱', author: '@cat_space', emoji: '🐱🚀✨', gradient: 'from-purple-900 via-indigo-900 to-black', likes: 14200 },
  { id: 2, title: 'Фокус с исчезновением колбасы 🌭', author: '@magic_sausage', emoji: '🌭🎩✨', gradient: 'from-amber-900 via-orange-950 to-black', likes: 8900 },
  { id: 3, title: 'Танец бетономешалки 🚜💃', author: '@build_dances', emoji: '🚜💃🔊', gradient: 'from-[#222840] via-emerald-950 to-black', likes: 25400 },
  { id: 4, title: 'Как отварить пельмени за 0.1 секунды 🥟', author: '@fast_chef', emoji: '🥟🔥⚡', gradient: 'from-red-950 via-rose-900 to-black', likes: 51200 },
  { id: 5, title: 'Дрифт на Жигулях зимой ❄️🚗', author: '@vaz_drift', emoji: '🚗❄️💨', gradient: 'from-blue-950 via-[#0a192f] to-black', likes: 33100 },
  { id: 6, title: 'Шрек поет оперу 👹🎤', author: '@swamp_opera', emoji: '👹🎤🎼', gradient: 'from-green-950 via-lime-950 to-black', likes: 98400 },
  { id: 7, title: 'Киберпанк в деревенском туалете 🤖🚽', author: '@cyber_village', emoji: '🤖🚽⚡', gradient: 'from-[#8f9bff]/20 via-black to-purple-950', likes: 41000 },
  { id: 8, title: 'Реакция собаки на пылесос 🐶🧹', author: '@doggo_scared', emoji: '🐶🧹⚡', gradient: 'from-yellow-950 via-amber-900 to-black', likes: 17800 },
  { id: 9, title: 'Когда выпил 5 банок энергетического напитка ⚡🧪', author: '@energy_overload', emoji: '⚡🧪💥', gradient: 'from-cyan-950 via-teal-900 to-black', likes: 62900 },
  { id: 10, title: 'Магнит против телевизора 🧲📺', author: '@phys_experiments', emoji: '🧲📺🌀', gradient: 'from-fuchsia-950 via-pink-950 to-black', likes: 22400 },
  { id: 11, title: 'Огурец пугает кота 🥒🐈', author: '@cucumber_prank', emoji: '🥒🐈💥', gradient: 'from-[#8f9bff]/30 via-slate-900 to-black', likes: 88300 },
  { id: 12, title: 'Инопланетянин просит 100 рублей 🛸💸', author: '@ufo_money', emoji: '🛸💸👽', gradient: 'from-emerald-900 via-teal-950 to-black', likes: 31500 },
  { id: 13, title: 'Супер скорость сбора яблок 🍎⚡', author: '@speed_farmer', emoji: '🍎⚡🧺', gradient: 'from-red-900 via-amber-950 to-black', likes: 12900 },
  { id: 14, title: 'Сверхзвуковой чих бабушки 👵🔊', author: '@granny_power', emoji: '👵🔊💥', gradient: 'from-purple-950 via-violet-900 to-black', likes: 74600 },
  { id: 15, title: 'Утка играет на гитаре 🦆🎸', author: '@rock_duck', emoji: '🦆🎸🔥', gradient: 'from-orange-950 via-red-950 to-black', likes: 105000 },
];

export const ShortVideosTool: React.FC<ToolProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [disliked, setDisliked] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up');
  const [animating, setAnimating] = useState(false);

  const touchStartY = useRef<number | null>(null);

  const video = SHORT_VIDEOS[currentIndex];

  // 1.5-second video progress bar; auto-advance when 100% reached
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Auto-advance to next video!
          setSlideDirection('up');
          setAnimating(true);
          setTimeout(() => setAnimating(false), 300);
          setCurrentIndex((idx) => (idx + 1) % SHORT_VIDEOS.length);
          return 0;
        }
        return prev + 10; // 10 steps of 150ms = 1.5s total video length
      });
    }, 150);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleNext = () => {
    soundManager.playBeep(1200, 0.05);
    setSlideDirection('up');
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % SHORT_VIDEOS.length);
  };

  const handlePrev = () => {
    soundManager.playBeep(900, 0.05);
    setSlideDirection('down');
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + SHORT_VIDEOS.length) % SHORT_VIDEOS.length);
  };

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > 40) {
      if (diffY > 0) {
        handleNext(); // Swiped up -> Next
      } else {
        handlePrev(); // Swiped down -> Prev
      }
    }
    touchStartY.current = null;
  };

  // Wheel scroll handling
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30) {
      handleNext();
    } else if (e.deltaY < -30) {
      handlePrev();
    }
  };

  const handleLike = () => {
    soundManager.playBeep(1400, 0.08);
    setLiked((prev) => {
      const next = !prev[video.id];
      showToast(next ? '❤️ Нравится!' : 'Отметка снята');
      return { ...prev, [video.id]: next };
    });
  };

  const handleDislike = () => {
    soundManager.playBeep(400, 0.08);
    setDisliked((prev) => {
      const next = !prev[video.id];
      showToast(next ? '👎 Не нравится' : 'Отметка снята');
      return { ...prev, [video.id]: next };
    });
  };

  const handleShare = () => {
    soundManager.playBeep(1000, 0.05);
    showToast('🔗 Ссылка на видео скопирована!');
  };

  const handleReport = () => {
    soundManager.playBeep(300, 0.1);
    showToast('🚩 Жалоба отправлена модераторам');
  };

  const handleAddToPlaylist = () => {
    soundManager.playBeep(1100, 0.05);
    showToast('➕ Добавлено в ваш плейлист');
  };

  return (
    <ToolWrapper title="Короткие видео" onClose={onClose} headerColor="bg-[#0f121a] border-[#222840]">
      <style>{`
        @keyframes slideUpIn {
          from { transform: translateY(100%); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDownIn {
          from { transform: translateY(-100%); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
        .anim-slide-up {
          animation: slideUpIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-slide-down {
          animation: slideDownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative w-full h-[82vh] max-w-sm mx-auto flex-1 flex flex-col justify-between overflow-hidden select-none bg-black rounded-3xl border border-[#8f9bff]/40 shadow-2xl my-auto"
      >
        {/* Animated Background Canvas Video simulation */}
        <div
          key={video.id}
          className={`absolute inset-0 bg-gradient-to-b ${video.gradient} flex items-center justify-center overflow-hidden ${
            animating ? (slideDirection === 'up' ? 'anim-slide-up' : 'anim-slide-down') : ''
          }`}
        >
          {/* Moving background graphics / particles */}
          <div className="absolute inset-0 opacity-30 flex items-center justify-center pointer-events-none">
            <div
              className="w-64 h-64 rounded-full border-4 border-[#8f9bff] transition-transform duration-200"
              style={{
                transform: `scale(${1 + (progress / 100) * 0.4}) rotate(${(progress / 100) * 180}deg)`,
              }}
            />
          </div>

          {/* Center Main Animated Video Emoji */}
          <div className="text-7xl sm:text-8xl transition-all duration-200 transform scale-110 drop-shadow-[0_0_25px_rgba(143,155,255,0.6)] animate-pulse">
            {video.emoji}
          </div>

          {/* Video Progress Bar Loop */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
            <div
              className="h-full bg-[#8f9bff] transition-all duration-150 ease-linear shadow-[0_0_8px_#8f9bff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top Header Overlay: Exit button [X], Mute button */}
        <div className="relative z-20 p-3 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent">
          <span className="text-[10px] font-mono text-[#8f9bff] font-bold bg-black/60 px-2.5 py-1 rounded-full border border-[#8f9bff]/30">
            {currentIndex + 1} / {SHORT_VIDEOS.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-black/60 hover:bg-black text-white rounded-full transition-all cursor-pointer border border-white/20"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#8f9bff]" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-black/60 hover:bg-red-950 text-white hover:text-red-400 rounded-full transition-all cursor-pointer border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Swipe / Scroll Hotspots */}
        <div className="relative z-10 flex-1 flex flex-col justify-between p-2 pointer-events-none">
          <button
            onClick={handlePrev}
            className="self-center pointer-events-auto bg-black/40 hover:bg-black/80 text-white/80 hover:text-white text-[10px] font-bold px-3.5 py-1 rounded-full border border-white/20 cursor-pointer backdrop-blur-md transition-all active:scale-95"
          >
            ▲ Свайп вверх
          </button>

          <button
            onClick={handleNext}
            className="self-center pointer-events-auto bg-black/40 hover:bg-black/80 text-white/80 hover:text-white text-[10px] font-bold px-3.5 py-1 rounded-full border border-white/20 cursor-pointer backdrop-blur-md transition-all active:scale-95"
          >
            ▼ Свайп вниз
          </button>
        </div>

        {/* Bottom Bar: Title on Bottom Left, Action Buttons on Right Corner */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-between gap-3">
          {/* Title & Author at Bottom Left */}
          <div className="space-y-1 text-left flex-1 min-w-0">
            <span className="text-[11px] font-mono text-[#8f9bff] font-black block">
              {video.author}
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight drop-shadow-md">
              {video.title}
            </h3>
          </div>

          {/* Actions Stack on Right Side */}
          <div className="flex flex-col items-center gap-2.5 shrink-0">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-all border ${
                liked[video.id]
                  ? 'bg-red-600 text-white border-red-500 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                  : 'bg-black/60 text-white border-white/20 hover:text-red-400'
              }`}>
                <Heart className={`w-5 h-5 ${liked[video.id] ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[9px] font-mono font-bold text-white drop-shadow">
                {(video.likes + (liked[video.id] ? 1 : 0)).toLocaleString()}
              </span>
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-all border ${
                disliked[video.id]
                  ? 'bg-amber-600 text-white border-amber-500 scale-110'
                  : 'bg-black/60 text-white border-white/20 hover:text-amber-400'
              }`}>
                <ThumbsDown className="w-5 h-5" />
              </div>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 hover:border-[#8f9bff] backdrop-blur-md transition-all">
                <Share2 className="w-5 h-5 text-[#8f9bff]" />
              </div>
            </button>

            {/* Add to Playlist */}
            <button
              onClick={handleAddToPlaylist}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 hover:border-cyan-400 backdrop-blur-md transition-all">
                <Plus className="w-5 h-5 text-cyan-400" />
              </div>
            </button>

            {/* Report */}
            <button
              onClick={handleReport}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-black/60 hover:bg-red-950 text-gray-400 hover:text-red-400 border border-white/20 backdrop-blur-md transition-all">
                <Flag className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* Toast Popup Notification */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-[#0f121a]/95 text-[#8f9bff] border border-[#8f9bff] px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_20px_rgba(143,155,255,0.5)] animate-in fade-in zoom-in-95 duration-150">
            {toastMessage}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
