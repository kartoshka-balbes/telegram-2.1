import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface ToolWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  headerColor?: string;
  hideDefaultClose?: boolean;
}

interface ToolTheme {
  a: string; // основной цвет
  b: string; // вторичный цвет
  icon: string;
}

const DEFAULT_THEME: ToolTheme = { a: '#8f9bff', b: '#6366f1', icon: '✨' };

// Свой цвет и значок для каждого приложения (ищется по фрагменту заголовка)
const THEMES: Array<[string, ToolTheme]> = [
  ['кинопоиск', { a: '#ff7a1a', b: '#e11d48', icon: '🎬' }],
  ['машина времени', { a: '#a78bfa', b: '#38bdf8', icon: '⏳' }],
  ['радио', { a: '#fb923c', b: '#f43f5e', icon: '📻' }],
  ['сейф', { a: '#fbbf24', b: '#f97316', icon: '🔐' }],
  ['метроном', { a: '#22d3ee', b: '#6366f1', icon: '🎼' }],
  ['уровень', { a: '#a3e635', b: '#22c55e', icon: '📐' }],
  ['банкомат', { a: '#60a5fa', b: '#34d399', icon: '🏧' }],
  ['сигнализация', { a: '#f87171', b: '#f59e0b', icon: '🚨' }],
  ['навигатор', { a: '#38bdf8', b: '#facc15', icon: '🧭' }],
  ['авито', { a: '#00aaff', b: '#97cf26', icon: '🛍️' }],
  ['дром', { a: '#f87171', b: '#94a3b8', icon: '🚘' }],
  ['едадил', { a: '#a3e635', b: '#fb7185', icon: '🏷️' }],
  ['youtube', { a: '#ff3b3b', b: '#f97316', icon: '▶️' }],
  ['билеты', { a: '#f43f5e', b: '#fb923c', icon: '🚆' }],
  ['рецепт', { a: '#fbbf24', b: '#fb7185', icon: '🍳' }],
  ['книги', { a: '#d6a35c', b: '#a16207', icon: '📚' }],
  ['калорий', { a: '#4ade80', b: '#fbbf24', icon: '🥗' }],
  ['тренировки', { a: '#fb923c', b: '#ef4444', icon: '💪' }],
  ['рулетка', { a: '#e879f9', b: '#6366f1', icon: '🎲' }],
  ['худеем', { a: '#f97316', b: '#ec4899', icon: '🔥' }],
  ['созвезд', { a: '#818cf8', b: '#22d3ee', icon: '🌌' }],
  ['зарядн', { a: '#4ade80', b: '#22d3ee', icon: '⚡' }],
  ['увлажнитель', { a: '#67e8f9', b: '#60a5fa', icon: '💧' }],
  ['озонатор', { a: '#5eead4', b: '#38bdf8', icon: '🫧' }],
  ['проектор', { a: '#a78bfa', b: '#f472b6', icon: '🌠' }],
  ['ночник', { a: '#fcd34d', b: '#fb923c', icon: '💡' }],
  ['покемон', { a: '#f87171', b: '#facc15', icon: '🔴' }],
  ['облачный', { a: '#34d399', b: '#6366f1', icon: '🎮' }],
];

const themeFor = (title: string): ToolTheme => {
  const t = title.toLowerCase();
  for (const [key, theme] of THEMES) {
    if (t.includes(key)) return theme;
  }
  return DEFAULT_THEME;
};

export const ToolWrapper: React.FC<ToolWrapperProps> = ({
  title,
  onClose,
  children,
  hideDefaultClose = false,
}) => {
  const theme = themeFor(title);

  return (
    <div className="fixed inset-0 bg-[#0b0d13] z-40 flex flex-col text-white overflow-hidden animate-in fade-in duration-200">
      {/* Атмосферный фон приложения */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25"
          style={{ background: theme.a }}
        />
        <div
          className="absolute -bottom-48 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-[0.16]"
          style={{ background: theme.b }}
        />
      </div>

      {/* Шапка */}
      <div className="relative z-10 px-3 sm:px-4 py-3 flex items-center justify-between gap-2 bg-[#0b0d13]/70 backdrop-blur-xl border-b border-white/[0.07]">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-gray-200 hover:text-white font-semibold text-sm cursor-pointer pl-2.5 pr-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <h2 className="flex items-center gap-2 text-[15px] sm:text-base font-bold text-white tracking-tight truncate min-w-0">
          <span
            className="w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-sm"
            style={{ background: `linear-gradient(135deg, ${theme.a}, ${theme.b})` }}
          >
            {theme.icon}
          </span>
          <span className="truncate max-w-[180px] sm:max-w-xs">{title}</span>
        </h2>

        {!hideDefaultClose ? (
          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 cursor-pointer"
            title="Закрыть инструмент"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto relative z-10 p-4 sm:p-6 flex flex-col modern-rise">{children}</div>
    </div>
  );
};
