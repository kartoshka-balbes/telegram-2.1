import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { AlertOctagon } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface TaxNotice {
  id: string;
  title: string;
  amount: string;
}

const TAX_TYPES = [
  { title: 'Налог на недвижимое имущество', amount: '14 850 000 ₽' },
  { title: 'Транспортный налог (за ВАЗ-2107)', amount: '8 990 000 ₽' },
  { title: 'Налог на чистый воздух и дыхание', amount: '45 000 000 ₽' },
  { title: 'НДФЛ 250% за прошлый период', amount: '99 999 999 ₽' },
  { title: 'Земельный налог на болото', amount: '32 400 000 ₽' },
  { title: 'Налог на использование интернета', amount: '77 100 000 ₽' },
];

export const TaxTool: React.FC<ToolProps> = ({ onClose }) => {
  const [taxNotices, setTaxNotices] = useState<TaxNotice[]>([]);
  const [crashed, setCrashed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Every 0.6 seconds add a new tax pop-up
    const interval = setInterval(() => {
      soundManager.playRock();
      const randomTax = TAX_TYPES[Math.floor(Math.random() * TAX_TYPES.length)];
      const newNotice: TaxNotice = {
        id: Math.random().toString(),
        title: randomTax.title,
        amount: randomTax.amount,
      };
      setTaxNotices((prev) => [...prev, newNotice]);
    }, 600);

    // After ~6 seconds show crash screen, then close at ~7.5 seconds
    const crashTimer = setTimeout(() => {
      clearInterval(interval);
      setCrashed(true);
      setTimeout(() => {
        onClose(); // Exit tool
      }, 1500);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(crashTimer);
    };
  }, [onClose]);

  // Auto-scroll down when new notifications arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [taxNotices]);

  if (crashed) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center font-mono">
        <AlertOctagon className="w-24 h-24 text-red-600 mb-4 animate-ping" />
        <h1 className="text-2xl sm:text-4xl font-black text-red-500 uppercase mb-2">
          КРИТИЧЕСКАЯ ОШИБКА: ДОЛГ СЛИШКОМ ВЕЛИК!
        </h1>
        <p className="text-white text-sm max-w-md">
          Приложение принудительно заблокировано и закрыто ФНС России за неуплату налогов!
        </p>
      </div>
    );
  }

  return (
    <ToolWrapper title="Налоги и Задолженности (ФНС)" onClose={onClose} headerColor="bg-red-950 border-red-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono relative min-h-[400px] overflow-hidden">
        <div className="text-xs font-black text-red-400 uppercase text-center mb-2 animate-pulse">
          ⚠️ ПОСТУПЛЕНИЕ НАЛОГОВЫХ УВЕДОМЛЕНИЙ...
        </div>

        {/* Dynamic Tax Window Popups with Auto-scroll */}
        <div className="space-y-2 overflow-y-auto max-h-[380px] p-1">
          {taxNotices.map((n, idx) => (
            <div
              key={n.id}
              className="bg-red-950 border-2 border-red-500 p-3 shadow-xl animate-in zoom-in-90 duration-200"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-extrabold text-red-300 uppercase">ФНС РОССИИ #{idx + 1}</span>
                <span className="text-[9px] bg-red-600 text-white px-1 font-black">СРОЧНО!</span>
              </div>
              <h4 className="text-xs font-bold text-white">{n.title}</h4>
              <div className="text-lg font-black text-amber-400 mt-1">{n.amount}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </ToolWrapper>
  );
};
