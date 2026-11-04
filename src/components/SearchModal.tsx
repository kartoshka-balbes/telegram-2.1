import React, { useState } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { Chat } from '../types';

interface SearchModalProps {
  chats: Chat[];
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  chats,
  onClose,
  onSelectChat,
}) => {
  const [query, setQuery] = useState('');
  const [confirmChatId, setConfirmChatId] = useState<string | null>(null);

  // Filter chats matching query in title or messages
  const matchingChats = query.trim()
    ? chats.filter((c) => {
        if (!c) return false;
        const q = query.toLowerCase();
        const nameStr = (c.name || '').toLowerCase();
        const lastMsgStr = (c.lastMessage || '').toLowerCase();
        const matchesName = nameStr.includes(q);
        const matchesLast = lastMsgStr.includes(q);
        const matchesMsg =
          Array.isArray(c.messages) &&
          c.messages.some((m) => m && m.text && m.text.toLowerCase().includes(q));
        return matchesName || matchesLast || matchesMsg;
      })
    : [];

  const handleTileClick = (chatId: string) => {
    // Shows popup screen confirmation!
    setConfirmChatId(chatId);
  };

  const handleConfirmYes = () => {
    if (confirmChatId) {
      onSelectChat(confirmChatId);
      setConfirmChatId(null);
      onClose();
    }
  };

  const renderHighlightedText = (text: string | undefined | null, highlight: string) => {
    const str = text || '';
    if (!highlight.trim()) return str;
    try {
      const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = str.split(new RegExp(`(${escaped})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-red-500 font-extrabold bg-red-950/60 px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      );
    } catch {
      return str;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b0d13] z-50 flex flex-col font-sans">
      {/* Search Header */}
      <div className="p-4 bg-[#12151e] border-b border-[#222840] flex items-center gap-3">
        <SearchIcon className="w-5 h-5 text-[#8f9bff]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по чатам и сообщениям..."
          className="flex-1 bg-[#171b27] border border-[#222840] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#8f9bff] font-medium"
          autoFocus
        />
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-[#8f9bff] rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Results List as Tiles Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {!query.trim() && (
          <div className="text-center text-gray-500 py-12 font-medium">
            Введите текст для поиска по вашим чатам
          </div>
        )}

        {query.trim() && matchingChats.length === 0 && (
          <div className="text-center text-gray-500 py-12 font-medium">
            Ничего не найдено по запросу "{query}"
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {matchingChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleTileClick(chat.id)}
              className="bg-[#12151e] hover:bg-[#171b27] border border-[#222840] hover:border-[#8f9bff] rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all shadow-md group"
            >
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#252b63] via-[#6f7df0] to-[#8f9bff] flex items-center justify-center text-xl font-bold text-white shrink-0 group-hover:scale-105 transition-transform">
                <span className="w-full h-full bg-[#171b27] rounded-full flex items-center justify-center">
                  {chat.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base truncate">
                  {renderHighlightedText(chat.name, query)}
                </h3>
                <p className="text-gray-400 text-sm truncate mt-0.5">
                  {renderHighlightedText(chat.lastMessage, query)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full screen Confirm Popup when clicking a tile */}
      {confirmChatId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col justify-end p-6 select-none">
          <div className="w-full max-w-lg mx-auto bg-[#12151e] border border-[#8f9bff]/50 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-[0_0_30px_rgba(143,155,255,0.3)] text-center">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
              вы точно хотите это найти?
            </h2>

            <div className="w-full grid grid-cols-2 gap-4">
              <button
                onClick={() => setConfirmChatId(null)}
                className="py-3.5 bg-[#171b27] hover:bg-[#1e2232] text-gray-300 font-extrabold text-xl rounded-xl border border-[#222840] transition-colors uppercase cursor-pointer"
              >
                нет
              </button>
              <button
                onClick={handleConfirmYes}
                className="py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xl rounded-xl shadow-[0_0_15px_rgba(143,155,255,0.4)] transition-all uppercase cursor-pointer"
              >
                да
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
