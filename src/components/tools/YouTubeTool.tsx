import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Play, Pause, ThumbsUp, ThumbsDown, Share2, Download, ListPlus, Flag, MessageSquare, ExternalLink, Settings, Sparkles, Film, History, Flame } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';



interface ToolProps {
  onClose: () => void;
}

interface Video {
  id: string;
  title: string;
  channel: string;
  avatarEmoji: string;
  views: string;
  date: string;
  duration: string;
  comments: string[];
}

const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'КАК ВЫЖИТЬ В БОЛОТЕ С ШРЕКОМ (100 ДНЕЙ В HARDFLIP)',
    channel: 'Влад А4 Бумага',
    avatarEmoji: '⚡',
    views: '45,820,100',
    date: '2 дня назад',
    duration: '14:20',
    comments: ['Вау, крутое видео!', 'А4 топ, остальное фейк', 'Шрек лучший пнг'],
  },
  {
    id: '2',
    title: 'ТЕСТ-ДРАЙВ ТАНКА Т-34 В ГОРОДЕ (РАЗГОН ДО 100 КМ/Ч)',
    channel: 'AcademeG',
    avatarEmoji: '🚜',
    views: '12,450,000',
    date: '5 дней назад',
    duration: '22:15',
    comments: ['Костя как всегда гений', 'Гусеница отвалилась на 12 минуте xDD'],
  },
  {
    id: '3',
    title: 'ШОРТС: КАК ПОКОРМИТЬ КОТА ЗА 0.0001 СЕКУНДЫ',
    channel: 'Кот Борис Official',
    avatarEmoji: '🐱',
    views: '99,999,999',
    date: 'Вчера',
    duration: '00:15',
    comments: ['МЯУ', 'Борис легенда'],
  },
];

export const YouTubeTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'shorts' | 'subs' | 'history'>('feed');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [likes, setLikes] = useState(145000);
  const [dislikes, setDislikes] = useState(12);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [speed, setSpeed] = useState('1.0x');
  const [showSettings, setShowSettings] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [avatarImageModal, setAvatarImageModal] = useState<string | null>(null);

  const triggerToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedVideo) return;
    selectedVideo.comments.push(newComment.trim());
    setNewComment('');
    triggerToast('Комментарий успешно добавлен!');
  };

  const handleOpenYandexImages = (channelName: string) => {
    setAvatarImageModal(`Яндекс.Картинки: Результаты поиска для «Аватарка канала ${channelName}»`);
  };

  return (
    <ToolWrapper title="YouTube Video Hosting" onClose={onClose} headerColor="bg-red-950 border-red-900">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2 font-mono">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 text-xs font-bold uppercase ${
              activeTab === 'feed' ? 'border-b-2 border-red-500 text-red-500' : 'text-slate-400'
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`px-3 py-1.5 text-xs font-bold uppercase ${
              activeTab === 'shorts' ? 'border-b-2 border-red-500 text-red-500' : 'text-slate-400'
            }`}
          >
            Shorts ⚡
          </button>
          <button
            onClick={() => setActiveTab('subs')}
            className={`px-3 py-1.5 text-xs font-bold uppercase ${
              activeTab === 'subs' ? 'border-b-2 border-red-500 text-red-500' : 'text-slate-400'
            }`}
          >
            Подписки
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-bold uppercase ${
              activeTab === 'history' ? 'border-b-2 border-red-500 text-red-500' : 'text-slate-400'
            }`}
          >
            История
          </button>
        </div>

        {toastMsg && (
          <div className="p-2 bg-red-950 border border-red-500 text-red-300 text-xs text-center font-bold mb-2">
            {toastMsg}
          </div>
        )}

        {/* Selected Video Player Box */}
        {selectedVideo && (
          <div className="bg-white/[0.05] backdrop-blur-xl border border-red-500 p-3 space-y-3 mb-3">
            {/* Player View */}
            <div className="bg-black border border-white/10 h-48 relative flex items-center justify-center">
              <span className="text-4xl animate-pulse">🎬</span>

              {/* Player Settings Overlay */}
              {showSettings && (
                <div className="absolute top-2 right-2 bg-black/30 border border-red-500 p-2 text-[10px] space-y-1 z-20">
                  <div className="font-bold text-red-400">Настройки плеера:</div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Качество:</span>
                    <button onClick={() => setQuality(quality === '1080p' ? '4K' : '1080p')} className="text-white font-bold">
                      {quality}
                    </button>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Скорость:</span>
                    <button onClick={() => setSpeed(speed === '1.0x' ? '2.0x' : '1.0x')} className="text-white font-bold">
                      {speed}
                    </button>
                  </div>
                </div>
              )}

              {/* Top Controls */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="absolute top-2 left-2 p-1 bg-white/[0.045] text-slate-300 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.08]">
                <div className="h-full bg-red-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Video Title & Channel Bar */}
            <div>
              <h3 className="text-xs font-black text-white">{selectedVideo.title}</h3>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{selectedVideo.views} просмотров • {selectedVideo.date}</span>
                <span className="text-red-400 font-bold">{quality} • {speed}</span>
              </div>

              {/* Channel Avatar & Info */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleOpenYandexImages(selectedVideo.channel)}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  title="Открыть Яндекс.Картинки"
                >
                  <div className="w-8 h-8 rounded-full border border-red-500 bg-black flex items-center justify-center text-base shrink-0 shadow-sm">
                    {selectedVideo.avatarEmoji}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{selectedVideo.channel}</span>
                      <ExternalLink className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[9px] text-slate-500">Яндекс.Картинки (клик)</span>
                  </div>
                </button>

                <button
                  onClick={() => triggerToast(`Вы подписились на канал «${selectedVideo.channel}»!`)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase cursor-pointer"
                >
                  Подписаться
                </button>
              </div>
            </div>

            {/* Video Action Toolbar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] font-bold">
              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  if (!isLiked) setLikes((l) => l + 1);
                }}
                className={`flex items-center gap-1 cursor-pointer ${isLiked ? 'text-red-400' : 'text-slate-400'}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => setIsDisliked(!isDisliked)}
                className={`flex items-center gap-1 cursor-pointer ${isDisliked ? 'text-slate-200' : 'text-slate-400'}`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{dislikes}</span>
              </button>

              <button onClick={() => triggerToast('Ссылка скопирована в буфер!')} className="flex items-center gap-1 text-slate-400">
                <Share2 className="w-3.5 h-3.5" />
                <span>Поделиться</span>
              </button>

              <button onClick={() => triggerToast('Загрузка 4K видео в память устройтва начата...')} className="flex items-center gap-1 text-slate-400">
                <Download className="w-3.5 h-3.5" />
                <span>Скачать</span>
              </button>

              <button onClick={() => triggerToast('Видео добавлено в Плейлист!')} className="flex items-center gap-1 text-slate-400">
                <ListPlus className="w-3.5 h-3.5" />
                <span>В плейлист</span>
              </button>

              <button onClick={() => triggerToast('Жалоба отправлена модераторам YouTube!')} className="flex items-center gap-1 text-red-500">
                <Flag className="w-3.5 h-3.5" />
                <span>Пожаловаться</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="bg-black/30 p-2.5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-red-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Комментарии ({selectedVideo.comments.length}):</span>
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Оставьте ваш комментарий..."
                  className="flex-1 bg-white/[0.05] backdrop-blur-xl border border-white/10 p-1.5 text-xs text-white outline-none focus:border-red-500"
                />
                <button type="submit" className="px-3 bg-red-600 text-white font-bold text-xs uppercase">
                  Отправить
                </button>
              </form>

              <div className="space-y-1 max-h-24 overflow-y-auto">
                {selectedVideo.comments.map((c, i) => (
                  <div key={i} className="text-[11px] text-slate-300 bg-white/[0.05] backdrop-blur-xl p-1.5 border border-white/10">
                    "{c}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Feed List */}
        <div className="space-y-2 overflow-y-auto max-h-48">
          <span className="text-xs font-black text-slate-400 uppercase block">Рекомендуемые видео:</span>
          {VIDEOS.map((vid) => (
            <button
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className={`w-full p-2 border text-left flex items-center gap-3 cursor-pointer ${
                selectedVideo?.id === vid.id ? 'bg-red-950 border-red-500' : 'bg-white/[0.05] backdrop-blur-xl border-white/10 hover:border-white/10'
              }`}
            >
              <div className="w-12 h-10 bg-black/30 border border-white/10 flex items-center justify-center text-xs text-red-400 font-bold shrink-0">
                ▶
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="text-xs font-bold text-white truncate">{vid.title}</h4>
                <div className="text-[10px] text-slate-400 truncate">{vid.channel} • {vid.views} просмотров</div>
              </div>
            </button>
          ))}
        </div>

        {/* Yandex Images Modal Overlay */}
        {avatarImageModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white/[0.05] backdrop-blur-xl border border-amber-400 p-5 max-w-sm w-full text-center space-y-3">
              <div className="text-xs font-black text-amber-400 uppercase">{avatarImageModal}</div>
              <div className="w-32 h-32 mx-auto bg-black/30 border border-white/10 flex items-center justify-center text-4xl">
                🖼️
              </div>
              <p className="text-[10px] text-slate-400">Открылись Яндекс.Картинки для аватара канала</p>
              <button
                onClick={() => setAvatarImageModal(null)}
                className="w-full py-1.5 bg-amber-500 text-slate-950 font-black text-xs uppercase"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
