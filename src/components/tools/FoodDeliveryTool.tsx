import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Utensils, MapPin, Navigation, Clock } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const FoodDeliveryTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);

  const menu = [
    { name: 'Бургер Сочный Мощный 250г', price: '450 ₽', icon: '🍔' },
    { name: 'Пицца Пепперони 30см', price: '690 ₽', icon: '🍕' },
    { name: 'Шаурма Сытная Классика', price: '280 ₽', icon: '🌯' },
    { name: 'Суши Сет «Филадельфия»', price: '1 290 ₽', icon: '🍣' },
    { name: 'Вок с курицей Teriyaki', price: '420 ₽', icon: '🍜' },
    { name: 'Рамен Острый с телятиной', price: '510 ₽', icon: '🍲' },
    { name: 'Тако с говядиной и гуакамоле', price: '390 ₽', icon: '🌮' },
    { name: 'Чизкейк Нью-Йорк', price: '290 ₽', icon: '🍰' },
  ];

  const handleOrder = (foodName: string) => {
    soundManager.playBeep(800, 0.1);
    setSelectedFood(foodName);
    setIsDelivering(true);
  };

  return (
    <ToolWrapper title="Яндекс Еда / Быстрая Доставка" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none">
        {!isDelivering ? (
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold text-[#8f9bff] uppercase block mb-1">Выберите блюдо для быстрой доставки:</span>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {menu.map((m) => (
                <div key={m.name} className="bg-[#12151e] border border-[#222840] p-3.5 rounded-2xl flex justify-between items-center hover:border-[#8f9bff]/50 transition-all shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{m.icon}</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{m.name}</h4>
                      <span className="text-xs font-black text-[#b8c0ff] font-mono">{m.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOrder(m.name)}
                    className="px-3.5 py-2 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase cursor-pointer rounded-xl shadow-[0_0_10px_rgba(143,155,255,0.3)] transition-all active:scale-95"
                  >
                    Заказать
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#12151e] border-2 border-[#8f9bff] p-6 text-center space-y-4 rounded-3xl shadow-[0_0_30px_rgba(143,155,255,0.2)] animate-in zoom-in">
            <div className="w-16 h-16 bg-[#8f9bff] rounded-full flex items-center justify-center text-black mx-auto animate-bounce text-3xl shadow-[0_0_15px_rgba(143,155,255,0.4)]">
              🛵
            </div>
            <h3 className="text-base font-black text-[#8f9bff] uppercase tracking-wider">КУРЬЕР УЖЕ В ПУТИ!</h3>
            <div className="bg-[#0f121a] border border-[#222840] p-4 text-xs text-white rounded-2xl space-y-2 shadow-inner">
              <div>Заказ: <span className="font-extrabold text-[#8f9bff]">{selectedFood}</span></div>
              <div className="pt-2 border-t border-[#222840]">
                Ожидаемое время доставки (увеличено в 786 раз):
                <div className="text-lg font-black text-red-400 font-mono mt-1">
                  9 432 МИНУТЫ (157 ЧАСОВ)
                </div>
                <span className="text-[10px] text-gray-400 font-bold">(~ 6.5 дней ожидания)</span>
              </div>
            </div>
            <button
              onClick={() => setIsDelivering(false)}
              className="w-full py-3 bg-[#171b27] hover:bg-[#1e2232] border border-[#222840] text-gray-300 font-extrabold text-xs uppercase cursor-pointer rounded-xl transition-all"
            >
              Вернуться в меню
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
