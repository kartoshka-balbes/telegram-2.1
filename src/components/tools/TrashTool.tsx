import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Trash2, Plus, Send } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
  onBroadcastTrash: (fileName: string) => void;
}

interface TrashItem {
  id: string;
  name: string;
}

export const TrashTool: React.FC<ToolProps> = ({ onClose, onBroadcastTrash }) => {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [inputText, setInputText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newItem: TrashItem = {
      id: Date.now().toString(),
      name: inputText.trim(),
    };
    setItems((prev) => [...prev, newItem]);
    setInputText('');
  };

  const handleSendToTrash = (item: TrashItem) => {
    soundManager.playBeep(400, 0.1);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    onBroadcastTrash(item.name);
  };

  return (
    <ToolWrapper title="Мусорка" onClose={onClose}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-xl mb-4">
          <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-2 animate-pulse" />
          <h3 className="text-xl font-black text-white uppercase">Мусорная корзина</h3>
        </div>

        {/* Input Form to write text to delete */}
        <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите текст для удаления..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-2xl px-4 py-3 text-sm text-white outline-none font-bold"
          />
          <button
            type="submit"
            className="px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl flex items-center gap-1 uppercase text-xs cursor-pointer shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить</span>
          </button>
        </form>

        {/* File List */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Файлы в корзине ({items.length} шт):
          </h4>

          {items.length === 0 ? (
            <div className="text-center text-slate-500 py-8 font-medium bg-slate-900/40 rounded-2xl border border-slate-800">
              Корзина пуста
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <span className="text-white font-bold text-sm truncate pr-2">{item.name}</span>
                <button
                  onClick={() => handleSendToTrash(item)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Уничтожить</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
