import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Plane, ChevronDown } from 'lucide-react';

interface ToolProps {
  onClose: () => void;
}

const FLIGHTS = [
  { from: 'Москва', to: 'Париж', price: '45,000 ₽', duration: '3ч 40м' },
  { from: 'Санкт-Петербург', to: 'Сочи', price: '12,500 ₽', duration: '4ч 10м' },
  { from: 'Москва', to: 'Токио', price: '78,000 ₽', duration: '9ч 30м' },
];

export const AviasalesTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedFlight, setSelectedFlight] = useState<typeof FLIGHTS[0] | null>(null);
  const [purchasedModal, setPurchasedModal] = useState(false);

  const handleConfirmPurchase = () => {
    setSelectedFlight(null);
    setPurchasedModal(true);
  };

  return (
    <ToolWrapper title="Авиасейлс" onClose={onClose} headerColor="bg-sky-950 border-sky-900">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-6 py-4">
        {/* Banner */}
        <div className="bg-sky-600 rounded-3xl p-6 text-slate-950 shadow-2xl flex items-center justify-between font-bold">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider">АВИАСЕЙЛС</h1>
            <p className="text-xs text-slate-900 mt-1">Поиск дешёвых авиабилетов</p>
          </div>
          <Plane className="w-10 h-10 transform -rotate-45" />
        </div>

        {/* Flight Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Доступные рейсы:
          </h3>
          {FLIGHTS.map((flight, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-sky-400 rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white font-bold text-base flex items-center gap-2">
                  <span>{flight.from}</span>
                  <Plane className="w-4 h-4 text-sky-400" />
                  <span>{flight.to}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{flight.duration}</span>
              </div>
              <button
                onClick={() => setSelectedFlight(flight)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl uppercase transition-colors cursor-pointer"
              >
                {flight.price}
              </button>
            </div>
          ))}
        </div>

        {/* Scroll Confirm Modal */}
        {selectedFlight && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl flex flex-col h-[70vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white uppercase">Оформление билета</h3>
                <button
                  onClick={() => setSelectedFlight(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase"
                >
                  Отмена
                </button>
              </div>

              <div className="text-left text-xs font-bold text-sky-400 mb-2">
                Рейс: {selectedFlight.from} ➔ {selectedFlight.to} ({selectedFlight.price})
              </div>

              {/* Scrollable area requiring scroll down to find confirm button */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-6">
                <div className="text-slate-400 text-xs py-4 flex flex-col items-center gap-2">
                  <span>Пролистайте вниз для подтверждения</span>
                  <ChevronDown className="w-5 h-5 animate-bounce text-sky-400" />
                </div>

                <div className="h-96 flex items-center justify-center text-slate-700 font-bold uppercase">
                  (Листайте вниз)
                </div>

                {/* Confirm Purchase Button at bottom of scroll container */}
                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={handleConfirmPurchase}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    Подтвердить покупку
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchased Toast */}
        {purchasedModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-sky-400 rounded-3xl p-8 text-center shadow-2xl">
              <div className="text-6xl mb-4">✈️</div>
              <h2 className="text-2xl font-black text-white uppercase mb-4 leading-tight">
                Вы успешно купили билет
              </h2>
              <button
                onClick={() => setPurchasedModal(false)}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl uppercase cursor-pointer"
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
