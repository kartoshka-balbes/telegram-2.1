import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Bot, Send, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const RESPONSES = [
  'Здравствуйте! Я могу помочь вам проанализировать данные или составить подробный отчёт.',
  'Информация принята. Выполняю обработку и форматирование результатов.',
  'Согласно актуальным спецификациям, данный алгоритм работает со сложностью O(n log n).',
  'Запрос успешно обработан базовым модулем анализа.',
  'Введенный фрагмент соответствует стандартной документации и техническим регламентам.',
];

export const ChatGPTTool: React.FC<ToolProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Привет! Я виртуальный собеседник. Напишите любой вопрос!' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    soundManager.playBeep(800, 0.05);

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input.trim() };
    const randomReply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: randomReply };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <ToolWrapper title="ChatGPT OpenAI" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono">
        <div className="bg-slate-900 border-2 border-emerald-500 p-3 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400 uppercase">ChatGPT 4o-Omni</span>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto p-1 max-h-[350px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 max-w-[85%] text-xs font-bold ${
                  m.sender === 'user'
                    ? 'ml-auto bg-emerald-600 text-slate-950 text-right'
                    : 'mr-auto bg-slate-950 border border-slate-800 text-emerald-300'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="mt-2 pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-slate-950 border border-slate-800 p-2 text-xs text-white outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </ToolWrapper>
  );
};
