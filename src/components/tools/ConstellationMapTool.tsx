import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Star, Moon, Compass, Sparkles, Eye } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface Constellation {
  id: string;
  name: string;
  latin: string;
  brightestStar: string;
  fact: string;
  stars: { x: number; y: number }[];
}

const CONSTELLATIONS: Constellation[] = [
  {
    id: '1',
    name: 'Большая Медведица',
    latin: 'Ursa Major',
    brightestStar: 'Дубхе',
    fact: 'Семизвездие Ковша — наиболее узнаваемый астеризм северного неба.',
    stars: [{ x: 20, y: 30 }, { x: 35, y: 35 }, { x: 45, y: 50 }, { x: 60, y: 45 }, { x: 75, y: 60 }, { x: 80, y: 40 }, { x: 65, y: 30 }],
  },
  {
    id: '2',
    name: 'Орион',
    latin: 'Orion',
    brightestStar: 'Бетельгейзе',
    fact: 'Знаменитый «Пояс Ориона» состоит из трех ярких голубых гигантов.',
    stars: [{ x: 50, y: 20 }, { x: 30, y: 40 }, { x: 70, y: 40 }, { x: 40, y: 55 }, { x: 50, y: 55 }, { x: 60, y: 55 }, { x: 35, y: 75 }, { x: 65, y: 75 }],
  },
  {
    id: '3',
    name: 'Кассиопея',
    latin: 'Cassiopeia',
    brightestStar: 'Шедар',
    fact: 'Образует на небе характерную букву «W» или «M».',
    stars: [{ x: 20, y: 40 }, { x: 35, y: 60 }, { x: 50, y: 45 }, { x: 65, y: 65 }, { x: 80, y: 35 }],
  },
];

export const ConstellationMapTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selected, setSelected] = useState<Constellation>(CONSTELLATIONS[0]);
  const [showLines, setShowLines] = useState(true);

  return (
    <ToolWrapper title="Интерактивная карта созвездий" onClose={onClose} headerColor="bg-black/30 border-indigo-900">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-mono text-xs select-none space-y-3">
        {/* Night Sky Canvas View */}
        <div className="bg-black/30 border border-indigo-500 rounded-3xl h-56 relative overflow-hidden p-4 shadow-2xl flex flex-col justify-between">
          {/* Starfield background pattern */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

          <div className="relative z-10 flex justify-between items-center bg-white/[0.045] border border-white/10 p-2 rounded-2xl">
            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> {selected.name} ({selected.latin})
            </span>
            <button
              onClick={() => {
                soundManager.playBeep(800, 0.05);
                setShowLines(!showLines);
              }}
              className="px-2 py-0.5 bg-indigo-600 text-white rounded font-bold text-[10px] cursor-pointer"
            >
              {showLines ? 'Линии: ВКЛ' : 'Линии: ВЫКЛ'}
            </button>
          </div>

          {/* Interactive Constellation SVG Render */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full">
              {showLines &&
                selected.stars.map((st, i) => {
                  if (i === 0) return null;
                  const prev = selected.stars[i - 1];
                  return (
                    <line
                      key={i}
                      x1={`${prev.x}%`}
                      y1={`${prev.y}%`}
                      x2={`${st.x}%`}
                      y2={`${st.y}%`}
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                    />
                  );
                })}
              {selected.stars.map((st, i) => (
                <circle key={i} cx={`${st.x}%`} cy={`${st.y}%`} r="4" fill="#fef08a" className="animate-pulse" />
              ))}
            </svg>
          </div>

          <div className="relative z-10 bg-white/[0.045] border border-white/10 p-2 rounded-2xl text-[10px] text-slate-300">
            Главная звезда: <span className="text-amber-400 font-black">{selected.brightestStar}</span>
          </div>
        </div>

        {/* Astronomy Fact Box */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
            Астрономический факт:
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-bold">{selected.fact}</p>
        </div>

        {/* Constellations Selector */}
        <div className="grid grid-cols-3 gap-2">
          {CONSTELLATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                soundManager.playBeep(900, 0.05);
                setSelected(c);
              }}
              className={`p-2.5 rounded-2xl font-bold text-xs cursor-pointer border transition-all ${
                selected.id === c.id
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                  : 'bg-white/[0.05] backdrop-blur-xl border-white/10 text-slate-400 hover:border-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
};
