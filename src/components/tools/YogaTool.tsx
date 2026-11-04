import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Sun, Heart, Volume2, VolumeX, Sparkles, Wind } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface YogaPose {
  id: string;
  name: string;
  sanskrit: string;
  duration: string;
  benefit: string;
  icon: string;
}

const YOGA_POSES: YogaPose[] = [
  { id: '1', name: 'Поза Лотоса', sanskrit: 'Падмасана', duration: '3 минуты', benefit: 'Успокоение ума, выравнивание осанки', icon: '🧘‍♀️' },
  { id: '2', name: 'Собака мордой вниз', sanskrit: 'Адхо Мукха Шванасана', duration: '2 минуты', benefit: 'Растяжка позвоночника и ног', icon: '🐕' },
  { id: '3', name: 'Поза Воина', sanskrit: 'Вирабхадрасана', duration: '2 минуты', benefit: 'Укрепление бедер и баланс', icon: '🤺' },
  { id: '4', name: 'Поза Дерева', sanskrit: 'Врикшасана', duration: '1.5 минуты', benefit: 'Концентрация и равновесие', icon: '🌳' },
  { id: '5', name: 'Шавасана (Медитация)', sanskrit: 'Поза трупа', duration: '5 минут', benefit: 'Полное расслабление нервной системы', icon: '✨' },
];

export const YogaTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedPose, setSelectedPose] = useState<YogaPose>(YOGA_POSES[0]);
  const [breathPhase, setBreathPhase] = useState<'Вдох' | 'Выдох'>('Вдох');
  const [breathTimer, setBreathTimer] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathTimer((t) => {
        if (t <= 1) {
          setBreathPhase((p) => (p === 'Вдох' ? 'Выдох' : 'Вдох'));
          return 4;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToolWrapper title="Йога & Медитация" onClose={onClose} headerColor="bg-purple-950 border-purple-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Breathing Rhythm Circle */}
        <div className="bg-slate-900 border-2 border-purple-500/80 p-5 rounded-3xl text-center shadow-2xl flex flex-col items-center relative overflow-hidden">
          <div className="text-[10px] text-purple-300 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
            <Wind className="w-4 h-4 text-purple-400" /> Ритм дыхания 4-4
          </div>

          {/* Animated Pulsing Breathing Ring */}
          <div
            className={`w-28 h-28 rounded-full border-4 border-purple-400 flex flex-col items-center justify-center transition-all duration-1000 my-2 shadow-2xl shadow-purple-500/30 ${
              breathPhase === 'Вдох' ? 'scale-110 bg-purple-900/60' : 'scale-90 bg-slate-950'
            }`}
          >
            <span className="text-xl font-black text-white">{breathPhase}</span>
            <span className="text-2xl font-black text-purple-300 font-mono mt-0.5">{breathTimer}</span>
          </div>

          <div className="text-xs text-purple-200 font-bold mt-1">
            Текущая асана: <span className="text-amber-300 underline font-black">{selectedPose.name}</span>
          </div>
        </div>

        {/* Poses List */}
        <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
          {YOGA_POSES.map((pose) => (
            <div
              key={pose.id}
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setSelectedPose(pose);
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedPose.id === pose.id
                  ? 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pose.icon}</span>
                <div>
                  <h3 className="font-black text-xs text-white">{pose.name} ({pose.sanskrit})</h3>
                  <p className="text-[10px] text-purple-300">{pose.benefit}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-400 shrink-0">{pose.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
