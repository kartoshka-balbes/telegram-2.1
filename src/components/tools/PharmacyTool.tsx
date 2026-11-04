import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { ShoppingCart, Pill, X } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const DRUGS = [
  { name: 'Активированный уголь (500 мг, 10 табл.)', price: '45 ₽' },
  { name: 'Парацетамол (500 мг, 20 табл.)', price: '68 ₽' },
  { name: 'Ибупрофен (200 мг, 50 табл.)', price: '120 ₽' },
  { name: 'Аскорбиновая кислота (50 мг, 200 шт.)', price: '35 ₽' },
  { name: 'Аспирин Упса (500 мг, 16 шип. табл.)', price: '295 ₽' },
  { name: 'Но-Шпа Дротаверин (40 мг, 24 табл.)', price: '240 ₽' },
  { name: 'Нурофен Экспресс (200 мг, 12 капсул)', price: '310 ₽' },
  { name: 'Терафлю Лимон (10 пакетиков)', price: '620 ₽' },
  { name: 'Мезим Форте (20 табл.)', price: '185 ₽' },
  { name: 'Супрастин (25 мг, 20 табл.)', price: '190 ₽' },
  { name: 'Пенталгин (12 табл.)', price: '260 ₽' },
  { name: 'Корвалол (25 мл капли)', price: '55 ₽' },
  { name: 'Валидол (60 мг, 20 табл.)', price: '60 ₽' },
  { name: 'Кеторол Экспресс (10 мг, 20 табл.)', price: '175 ₽' },
  { name: 'Смекта Лимон (10 пакетиков)', price: '210 ₽' },
  { name: 'Омепразол (20 мг, 30 капсул)', price: '140 ₽' },
  { name: 'Глицин (100 мг, 50 табл.)', price: '95 ₽' },
  { name: 'АЦЦ 600 мг (10 шип. табл.)', price: '450 ₽' },
];

export const PharmacyTool: React.FC<ToolProps> = ({ onClose }) => {
  const [cartCount, setCartCount] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const handleCheckout = () => {
    setShowErrorModal(true);
  };

  return (
    <ToolWrapper title="Аптека" onClose={onClose} headerColor="bg-emerald-950 border-emerald-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-4">
        {/* Drugs list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Каталог лекарственных препаратов:
          </h3>
          {DRUGS.map((drug, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-3 pr-2">
                <Pill className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">{drug.name}</h4>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{drug.price}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl uppercase transition-colors shrink-0 cursor-pointer"
              >
                + Корзина
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Cart Checkout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleCheckout}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl flex items-center justify-center gap-2 shadow-xl uppercase cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Купить ({cartCount} шт)</span>
          </button>
        </div>

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl relative">
              <button
                onClick={() => setShowErrorModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-2xl font-black text-white uppercase mb-2">
                Недостаточно средств
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                бомж
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
