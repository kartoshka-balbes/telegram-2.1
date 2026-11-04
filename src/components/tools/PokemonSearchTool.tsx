import React, { useState, useMemo } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Search, ArrowLeft } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

interface Pokemon {
  id: number;
  name: string;
  en: string;
  types: string[];
  icon: string;
  height: string;
  weight: string;
  desc: string;
}

const POKEMON: Pokemon[] = [
  { id: 1, name: 'Бульбазавр', en: 'Bulbasaur', types: ['Трава', 'Яд'], icon: '🌱', height: '0.7 м', weight: '6.9 кг', desc: 'С самого рождения на спине носит семя, которое растёт вместе с ним.' },
  { id: 4, name: 'Чармандер', en: 'Charmander', types: ['Огонь'], icon: '🔥', height: '0.6 м', weight: '8.5 кг', desc: 'Пламя на кончике хвоста показывает его состояние здоровья и настроение.' },
  { id: 7, name: 'Сквиртл', en: 'Squirtle', types: ['Вода'], icon: '🐢', height: '0.5 м', weight: '9.0 кг', desc: 'Панцирь защищает его и помогает плыть быстрее, снижая сопротивление воды.' },
  { id: 12, name: 'Баттерфри', en: 'Butterfree', types: ['Жук', 'Полёт'], icon: '🦋', height: '1.1 м', weight: '32.0 кг', desc: 'Крылья покрыты водоотталкивающей пыльцой, поэтому он летает даже под дождём.' },
  { id: 25, name: 'Пикачу', en: 'Pikachu', types: ['Электро'], icon: '⚡', height: '0.4 м', weight: '6.0 кг', desc: 'Накапливает электричество в щёчных мешках и разряжает его при опасности.' },
  { id: 39, name: 'Джигглипуфф', en: 'Jigglypuff', types: ['Нормальный', 'Фея'], icon: '🎤', height: '0.5 м', weight: '5.5 кг', desc: 'Его пение вызывает сон у всех, кто слышит мелодию.' },
  { id: 52, name: 'Мяут', en: 'Meowth', types: ['Нормальный'], icon: '🐱', height: '0.4 м', weight: '4.2 кг', desc: 'Любит блестящие предметы и ночью выходит на поиски монет.' },
  { id: 54, name: 'Псайдак', en: 'Psyduck', types: ['Вода'], icon: '🦆', height: '0.8 м', weight: '19.6 кг', desc: 'Постоянно страдает от головной боли; при её усилении проявляет скрытые способности.' },
  { id: 63, name: 'Абра', en: 'Abra', types: ['Психо'], icon: '🔮', height: '0.9 м', weight: '19.5 кг', desc: 'Спит до 18 часов в сутки и телепортируется при малейшей угрозе.' },
  { id: 74, name: 'Джеодуд', en: 'Geodude', types: ['Камень', 'Земля'], icon: '🪨', height: '0.4 м', weight: '20.0 кг', desc: 'Часто встречается в горах и маскируется под обычный валун.' },
  { id: 94, name: 'Генгар', en: 'Gengar', types: ['Призрак', 'Яд'], icon: '👻', height: '1.5 м', weight: '40.5 кг', desc: 'Прячется в тенях и понижает температуру воздуха вокруг себя.' },
  { id: 95, name: 'Оникс', en: 'Onix', types: ['Камень', 'Земля'], icon: '🐍', height: '8.8 м', weight: '210.0 кг', desc: 'Прокладывает тоннели под землёй, двигаясь со скоростью 80 км/ч.' },
  { id: 129, name: 'Мэджикарп', en: 'Magikarp', types: ['Вода'], icon: '🐟', height: '0.9 м', weight: '10.0 кг', desc: 'Слабый и малополезный, но при эволюции становится очень мощным.' },
  { id: 130, name: 'Гьярадос', en: 'Gyarados', types: ['Вода', 'Полёт'], icon: '🐉', height: '6.5 м', weight: '235.0 кг', desc: 'Агрессивен и неистов; в ярости способен разрушать целые города.' },
  { id: 133, name: 'Иви', en: 'Eevee', types: ['Нормальный'], icon: '🦊', height: '0.3 м', weight: '6.5 кг', desc: 'Генетически нестабилен и способен эволюционировать в несколько форм.' },
  { id: 143, name: 'Снорлакс', en: 'Snorlax', types: ['Нормальный'], icon: '😴', height: '2.1 м', weight: '460.0 кг', desc: 'Съедает около 400 кг пищи в день и засыпает сразу после еды.' },
  { id: 150, name: 'Мьюту', en: 'Mewtwo', types: ['Психо'], icon: '🧬', height: '2.0 м', weight: '122.0 кг', desc: 'Создан генной инженерией; считается одним из самых мощных покемонов.' },
  { id: 151, name: 'Мью', en: 'Mew', types: ['Психо'], icon: '✨', height: '0.4 м', weight: '4.0 кг', desc: 'Редкий покемон, содержащий в ДНК генетический код всех остальных.' },
  { id: 197, name: 'Амбреон', en: 'Umbreon', types: ['Тёмный'], icon: '🌙', height: '1.0 м', weight: '27.0 кг', desc: 'Кольца на теле светятся в темноте под лунным светом.' },
  { id: 245, name: 'Суикун', en: 'Suicune', types: ['Вода'], icon: '💧', height: '2.0 м', weight: '187.0 кг', desc: 'Очищает загрязнённую воду одним лишь прикосновением.' },
  { id: 249, name: 'Луджия', en: 'Lugia', types: ['Психо', 'Полёт'], icon: '🕊️', height: '5.2 м', weight: '216.0 кг', desc: 'Обитает на дне океана; взмах крыльев вызывает сорокадневные бури.' },
  { id: 258, name: 'Мадкип', en: 'Mudkip', types: ['Вода'], icon: '🐸', height: '0.4 м', weight: '7.6 кг', desc: 'Плавник на голове чувствует малейшие изменения в потоках воды.' },
  { id: 282, name: 'Гардевуар', en: 'Gardevoir', types: ['Психо', 'Фея'], icon: '💫', height: '1.6 м', weight: '48.4 кг', desc: 'Готов пожертвовать собой ради защиты своего тренера.' },
  { id: 384, name: 'Рэйкваза', en: 'Rayquaza', types: ['Дракон', 'Полёт'], icon: '🐲', height: '7.0 м', weight: '206.5 кг', desc: 'Живёт в озоновом слое и спускается на землю только при катастрофах.' },
  { id: 448, name: 'Лукарио', en: 'Lucario', types: ['Боевой', 'Сталь'], icon: '🥋', height: '1.2 м', weight: '54.0 кг', desc: 'Улавливает ауру живых существ и может читать их эмоции.' },
  { id: 658, name: 'Грининджа', en: 'Greninja', types: ['Вода', 'Тёмный'], icon: '🥷', height: '1.5 м', weight: '40.0 кг', desc: 'Метает острые водяные сюрикены, способные резать металл.' },
];

export const PokemonSearchTool: React.FC<ToolProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Pokemon | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace('#', '');
    if (!q) return POKEMON;
    return POKEMON.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.en.toLowerCase().includes(q) ||
        String(p.id) === q ||
        p.types.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <ToolWrapper title="Поиск покемонов" onClose={onClose} headerColor="bg-red-950 border-red-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col py-3 min-h-0">
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> К результатам
            </button>
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-xs text-slate-500 font-mono">#{String(selected.id).padStart(3, '0')}</div>
              <div className="text-7xl my-3">{selected.icon}</div>
              <h2 className="text-xl font-black text-white">{selected.name}</h2>
              <p className="text-xs text-slate-400">{selected.en}</p>
              <div className="flex justify-center gap-2 mt-3">
                {selected.types.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-8 mt-5 text-xs">
                <div>
                  <div className="text-white font-bold">{selected.height}</div>
                  <div className="text-slate-500">Рост</div>
                </div>
                <div>
                  <div className="text-white font-bold">{selected.weight}</div>
                  <div className="text-slate-500">Вес</div>
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-5 leading-relaxed">{selected.desc}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center bg-white/[0.05] backdrop-blur-xl border border-white/10 focus-within:border-red-400 rounded-2xl px-3 py-2.5 mb-3">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Имя, номер или тип покемона"
                className="w-full bg-transparent text-white placeholder-slate-500 outline-none text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {results.length === 0 && (
                <div className="text-center text-sm text-slate-500 py-10">Покемон не найден</div>
              )}
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-red-400/60 p-3 flex items-center gap-3 rounded-2xl text-left cursor-pointer transition-colors"
                >
                  <span className="text-3xl">{p.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-white truncate">{p.name}</span>
                    <span className="block text-[11px] text-slate-400 truncate">{p.types.join(' · ')}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{String(p.id).padStart(3, '0')}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolWrapper>
  );
};
