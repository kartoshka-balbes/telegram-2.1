import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Utensils, Flame, ChefHat } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

const RECIPES = [
  {
    id: 'borscht',
    name: 'Борщ Классический',
    icon: '🍲',
    time: '1.5 часа',
    ingredients: ['Говядина 600г', 'Свекла 2шт', 'Капуста 300г', 'Картофель 3шт', 'Сметанина 100g'],
    steps: ['Сварить насыщенный мясной бульон.', 'Пассеровать свеклу с томатной пастой.', 'Заложить овощи и довести до готовности.', 'Подать со свежей зеленью.'],
  },
  {
    id: 'vareniki',
    name: 'Вареники с картошкой',
    icon: '🥟',
    time: '20 мин',
    ingredients: ['Вареники 500г', 'Сливочное масло 50г', 'Зажарка из лука'],
    steps: ['Бросить в кипяток.', 'Ждать 5 минут.', 'Подать со сметаной и жареным луком.'],
  },
  {
    id: 'cake',
    name: 'Торт «Наполеон»',
    icon: '🎂',
    time: '2 часа',
    ingredients: ['Слоеное тесто 1кг', 'Сгущенка 1 банка', 'Сливочное масло 200г'],
    steps: ['Испечь коржи.', 'Взбить крем.', 'Промазать коржи и убрать в холодильник.'],
  },
  {
    id: 'shashlik',
    name: 'Шашлык на углях',
    icon: '🍖',
    time: '40 мин',
    ingredients: ['Свинина 2кг', 'Лук 1кг', 'Уксус 2 ст.л.', 'Специи для мяса'],
    steps: ['Замариновать на 3 часа.', 'Жарить на седых углях.', 'Крутить шампуры.'],
  },
  {
    id: 'salads',
    name: 'Салат Оливье',
    icon: '🥗',
    time: '30 мин',
    ingredients: ['Вареная колбаса 300г', 'Картофель 4шт', 'Горошек 1 банка', 'Майонез ВЕДРО'],
    steps: ['Нарезать все кубиком.', 'Залить ведерком майонеза.', 'Перемешать.'],
  },
  {
    id: 'hell_mix',
    name: 'АДСКАЯ СМЕСЬ (Зелье силы)',
    icon: '🧪',
    time: '1 мин',
    ingredients: ['Кетчуп 100g', 'Майонез 100g', 'Горчица 50g', 'Табаско 10 кап.', 'Соль и перец'],
    steps: ['Смешать всё в одной кружке.', 'Выпить залпом.', 'Получить +999 к выносливости.'],
  },
];

export const RecipesTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState(RECIPES[0]);

  return (
    <ToolWrapper title="Книга рецептов" onClose={onClose} headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10">
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">
        
        {/* Categories horizontally */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {RECIPES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                soundManager.playBeep(1000, 0.05);
                setSelected(r);
              }}
              className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selected.id === r.id
                  ? 'bg-[#8f9bff] text-black border border-[#8f9bff]'
                  : 'bg-white/[0.05] backdrop-blur-xl text-gray-300 border border-white/10 hover:border-[#8f9bff]'
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Recipe Details */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 bg-white/[0.07] rounded-2xl border border-white/10">{selected.icon}</span>
            <div>
              <h3 className="font-extrabold text-sm text-white">{selected.name}</h3>
              <p className="text-[10px] text-[#8f9bff] font-bold uppercase mt-0.5">Время готовки: {selected.time}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2">
            <div className="text-xs font-extrabold text-gray-300 uppercase mb-1.5">Ингредиенты:</div>
            <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
              {selected.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/10 pt-2">
            <div className="text-xs font-extrabold text-gray-300 uppercase mb-1.5">Инструкция:</div>
            <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1.5">
              {selected.steps.map((st, i) => (
                <li key={i} className="leading-relaxed">{st}</li>
              ))}
            </ol>
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
};
