import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Music, Volume2, Mic, Radio, Disc, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const MusicMakerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'piano' | 'guitar' | 'drums' | 'bass' | 'brass' | 'synth' | 'special'>('piano');

  const playNote = (freq: number) => {
    soundManager.playBeep(freq, 0.15);
  };

  return (
    <ToolWrapper title="Музыкальная Студия" onClose={onClose} headerColor="bg-purple-950 border-purple-900">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-2 font-mono">
        {/* Instrument Category Selector */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 border-b border-slate-800 pb-2 mb-3">
          {[
            { id: 'piano', label: 'Пианино' },
            { id: 'guitar', label: 'Гитара' },
            { id: 'drums', label: 'Барабаны' },
            { id: 'bass', label: 'Бас' },
            { id: 'brass', label: 'Трубы' },
            { id: 'synth', label: 'Синтез' },
            { id: 'special', label: 'Сирена' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-1.5 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Instrument Play Boards */}
        <div className="bg-slate-900 border-2 border-purple-500 p-4 min-h-[280px] flex flex-col justify-center">
          {activeTab === 'piano' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Пианино (Клавиши):</span>
              <div className="flex justify-center gap-1">
                {[
                  { note: 'До', freq: 261 },
                  { note: 'Ре', freq: 293 },
                  { note: 'Ми', freq: 329 },
                  { note: 'Фа', freq: 349 },
                  { note: 'Соль', freq: 392 },
                  { note: 'Ля', freq: 440 },
                  { note: 'Си', freq: 493 },
                  { note: 'До²', freq: 523 },
                ].map((k) => (
                  <button
                    key={k.note}
                    onClick={() => playNote(k.freq)}
                    className="w-10 h-28 bg-white hover:bg-slate-200 text-slate-950 font-black text-xs pb-2 flex items-end justify-center border-2 border-slate-950 transition-transform active:scale-95 cursor-pointer"
                  >
                    {k.note}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guitar' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Акустическая и Электро Гитара:</span>
              <div className="space-y-2">
                {[
                  { chord: 'Струна E (Ми)', freq: 164 },
                  { chord: 'Струна A (Ля)', freq: 220 },
                  { chord: 'Струна D (Ре)', freq: 293 },
                  { chord: 'Струна G (Соль)', freq: 392 },
                  { chord: 'Струна B (Си)', freq: 493 },
                  { chord: 'Аккорд Am (Ля-минор)', freq: 440 },
                ].map((s) => (
                  <button
                    key={s.chord}
                    onClick={() => playNote(s.freq)}
                    className="w-full py-2.5 bg-slate-950 border border-purple-500 hover:bg-purple-950 text-purple-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    🎸 {s.chord}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'drums' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Барабаны и Драм-машина:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Бочка (Kick)', freq: 80 },
                  { name: 'Малый (Snare)', freq: 350 },
                  { name: 'Хай-хэт (Hi-Hat)', freq: 1200 },
                  { name: 'Тарелка (Crash)', freq: 2000 },
                  { name: 'Том 1', freq: 180 },
                  { name: 'Том 2', freq: 120 },
                ].map((d) => (
                  <button
                    key={d.name}
                    onClick={() => playNote(d.freq)}
                    className="p-4 bg-purple-900 border-2 border-purple-400 hover:bg-purple-800 text-white font-black text-xs uppercase cursor-pointer text-center"
                  >
                    🥁 {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bass' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Бас-гитара:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Низкий Бас E', freq: 82 },
                  { name: 'Глубокий Бас A', freq: 110 },
                  { name: 'Панч Бас D', freq: 146 },
                  { name: 'Суб-Бас G', freq: 196 },
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => playNote(b.freq)}
                    className="p-4 bg-slate-950 border-2 border-purple-500 text-purple-300 font-extrabold text-xs uppercase cursor-pointer"
                  >
                    🔊 {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brass' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Трубы и Духовые:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Труба Джазовая', freq: 600 },
                  { name: 'Тромбон', freq: 400 },
                  { name: 'Саксофон', freq: 700 },
                  { name: 'Туба (Басовая)', freq: 220 },
                ].map((br) => (
                  <button
                    key={br.name}
                    onClick={() => playNote(br.freq)}
                    className="p-3 bg-amber-950 border border-amber-500 text-amber-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    🎺 {br.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'synth' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Аналоговый Синтезатор:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Synth Lead 1', freq: 800 },
                  { name: 'Pad Chord', freq: 550 },
                  { name: 'Arpeggiator', freq: 1100 },
                  { name: 'Sawtooth Wave', freq: 950 },
                  { name: 'Square Wave', freq: 750 },
                  { name: 'Laser FX', freq: 1500 },
                ].map((syn) => (
                  <button
                    key={syn.name}
                    onClick={() => playNote(syn.freq)}
                    className="p-3 bg-purple-950 border border-purple-400 text-purple-200 font-bold text-xs uppercase cursor-pointer"
                  >
                    🎛️ {syn.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'special' && (
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase text-center block">Спецэффекты, Клаксон, Сирена, Треугольник:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => playNote(2200)}
                  className="p-3 bg-slate-950 border border-slate-700 text-slate-200 font-bold text-xs uppercase cursor-pointer"
                >
                  🔺 Треугольник
                </button>
                <button
                  onClick={() => playNote(300)}
                  className="p-3 bg-red-950 border border-red-500 text-red-300 font-black text-xs uppercase cursor-pointer"
                >
                  📢 Мегафон с сиреной
                </button>
                <button
                  onClick={() => playNote(150)}
                  className="p-3 bg-amber-950 border border-amber-500 text-amber-300 font-black text-xs uppercase cursor-pointer"
                >
                  🚗 Гудок Клаксона
                </button>
                <button
                  onClick={() => playNote(1800)}
                  className="p-3 bg-cyan-950 border border-cyan-500 text-cyan-300 font-black text-xs uppercase cursor-pointer"
                >
                  🚨 Полицейская мигалка
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
