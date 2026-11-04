import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  Car,
  Key,
  ShieldCheck,
  Fuel,
  AlertTriangle,
  ReceiptText,
  StopCircle,
  Banknote,
  FileWarning,
  XCircle
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface CarSharingItem {
  id: string;
  model: string;
  plate: string;
  pricePerMin: string;
  dist: string;
  fuel: string;
  location: string;
}

interface FineRecord {
  id: string;
  time: string;
  reason: string;
  article: string;
  amount: number;
}

const CAR_CATALOG: CarSharingItem[] = [
  { id: '1', model: 'Belgee X50 (Комфорт)', plate: 'Х 777 АМ 799', pricePerMin: '11.5 ₽/мин', dist: '180 м', fuel: '85%', location: 'ул. Тверская, 12' },
  { id: '2', model: 'Haval Jolion 4WD', plate: 'Е 321 КХ 77', pricePerMin: '12.8 ₽/мин', dist: '340 м', fuel: '92%', location: 'пер. Газетный, 5' },
  { id: '3', model: 'Chery Tiggo 7 Pro Max', plate: 'М 001 СС 199', pricePerMin: '13.2 ₽/мин', dist: '520 м', fuel: '60%', location: 'Б. Дмитровка, 20' },
  { id: '4', model: 'Porsche Macan (Бизнес-Драйв)', plate: 'О 999 ООО 77', pricePerMin: '48.0 ₽/мин', dist: '1.2 км', fuel: '100%', location: 'Отель «Националь»' },
  { id: '5', model: 'Volkswagen Polo AT', plate: 'В 456 ТР 799', pricePerMin: '9.9 ₽/мин', dist: '650 м', fuel: '40%', location: 'Страстной б-р, 8' },
  { id: '6', model: 'BMW 320i M-Sport', plate: 'Т 888 ВВ 777', pricePerMin: '32.0 ₽/мин', dist: '890 м', fuel: '75%', location: 'ул. Новый Арбат, 21' },
  { id: '7', model: 'Geely Monjaro Luxury', plate: 'С 555 ЕЕ 199', pricePerMin: '18.5 ₽/мин', dist: '410 м', fuel: '95%', location: 'Кутузовский пр-т, 14' },
  { id: '8', model: 'Mercedes E200 AMG', plate: 'А 007 МР 77', pricePerMin: '42.0 ₽/мин', dist: '1.5 км', fuel: '80%', location: 'Пресненская набережная' },
];

const ABSURD_FINES_POOL = [
  { reason: 'Превышение допустимой громкости дыхания в салоне на 3.4 дБ', article: 'п. 8.14.2 Регламента сервиса', min: 850000, max: 2400000 },
  { reason: 'Синхронное моргание обоими глазами чаще 1 раза в 2 секунды', article: 'п. 19.3.1 Договора присоединения', min: 1200000, max: 3500000 },
  { reason: 'Подозрительно уверенный хват рулевого колеса без письменного согласования', article: 'п. 4.11.8 Правил эксплуатации ТС', min: 2500000, max: 6800000 },
  { reason: 'Взгляд в зеркало заднего вида под нерегламентированным углом 43°', article: 'п. 12.0.4 Требований безопасности', min: 950000, max: 2800000 },
  { reason: 'Мысленное несогласие с маршрутом штатного навигатора', article: 'п. 31.7.5 Лицензионного соглашения', min: 4500000, max: 9900000 },
  { reason: 'Включение обдува лобового стекла без предварительной подачи заявления', article: 'п. 6.2.1 Регламента климатических систем', min: 1400000, max: 4100000 },
  { reason: 'Недостаточно восторженное выражение лица при нажатии на педаль акселератора', article: 'п. 15.9.3 Стандарта лояльности клиента', min: 3800000, max: 8200000 },
  { reason: 'Шелест верхней одежды о заводскую тканевую обивку подголовника', article: 'п. 22.4.1 Сохранности интерьера ТС', min: 780000, max: 1950000 },
  { reason: 'Попытка отрегулировать положение солнцезащитного козырька левой рукой', article: 'п. 7.8.9 Протокола посадки водителя', min: 2900000, max: 7400000 },
  { reason: 'Превышение пульса водителя свыше 82 уд/мин в зоне действия знака 40', article: 'п. 18.2.2 Кардио-мониторинга телематики', min: 3100000, max: 6500000 },
  { reason: 'Прикосновение к ручке переключения передач без благоговейного трепета', article: 'п. 9.4.7 Кодекса этики арендатора', min: 5200000, max: 11800000 },
  { reason: 'Создание несанкционированных микровибраций подушки сиденья', article: 'п. 11.3.6 Антидеструктивного контроля', min: 1600000, max: 4900000 },
];

export const CarsharingTool: React.FC<ToolProps> = ({ onClose }) => {
  const [selectedCar, setSelectedCar] = useState<CarSharingItem>(CAR_CATALOG[0]);
  const [isRented, setIsRented] = useState(false);
  const [inspected, setInspected] = useState(false);
  const [rentSeconds, setRentSeconds] = useState(0);

  // Fines state
  const [finesList, setFinesList] = useState<FineRecord[]>([]);
  const [latestFinePopup, setLatestFinePopup] = useState<FineRecord | null>(null);

  const rentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Every 1 second when rented, trigger a new random huge fine
  useEffect(() => {
    if (isRented) {
      rentTimerRef.current = setInterval(() => {
        setRentSeconds((s) => s + 1);
      }, 1000);

      fineIntervalRef.current = setInterval(() => {
        const item = ABSURD_FINES_POOL[Math.floor(Math.random() * ABSURD_FINES_POOL.length)];
        const amount = Math.floor(Math.random() * (item.max - item.min) + item.min);
        const newFine: FineRecord = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          reason: item.reason,
          article: item.article,
          amount,
        };

        soundManager.playRock();
        setLatestFinePopup(newFine);
        setFinesList((prev) => [newFine, ...prev]);
      }, 1000);
    } else {
      if (rentTimerRef.current) clearInterval(rentTimerRef.current);
      if (fineIntervalRef.current) clearInterval(fineIntervalRef.current);
      setLatestFinePopup(null);
    }

    return () => {
      if (rentTimerRef.current) clearInterval(rentTimerRef.current);
      if (fineIntervalRef.current) clearInterval(fineIntervalRef.current);
    };
  }, [isRented]);

  const handleStartRental = () => {
    soundManager.playBeep(1200, 0.15);
    setIsRented(true);
    setRentSeconds(0);
    setFinesList([]);
  };

  const handleEndRental = () => {
    soundManager.playBeep(600, 0.2);
    setIsRented(false);
    setLatestFinePopup(null);
  };

  const totalFinesSum = finesList.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ToolWrapper title="Каршеринг" onClose={onClose} headerColor="bg-[#12151e] border-[#222840]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-2 font-sans text-xs select-none space-y-3 relative">
        
        {/* ========================================================================= */}
        {/* REAL-TIME ABSURD FINE TOAST POPUP (Every 1s during rental) */}
        {/* ========================================================================= */}
        {isRented && latestFinePopup && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md z-50 animate-in slide-in-from-top duration-150">
            <div className="p-3.5 bg-red-950/95 border-2 border-red-500 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)] backdrop-blur-md text-white space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-red-400 font-mono font-black text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                  <span>ВЫПИСАН ШТРАФ ТЕЛЕМАТИКИ</span>
                </div>
                <span className="font-mono font-black text-red-400 text-sm">
                  +{latestFinePopup.amount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <p className="text-white font-extrabold text-xs leading-snug">
                {latestFinePopup.reason}
              </p>
              <div className="flex justify-between items-center text-[10px] text-red-300 font-mono pt-1 border-t border-red-800/60">
                <span>{latestFinePopup.article}</span>
                <span>{latestFinePopup.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Map & Car Status Frame */}
        <div className="bg-[#0f121a] border-2 border-[#8f9bff] p-4 rounded-2xl relative overflow-hidden h-36 flex flex-col justify-between shadow-[0_0_20px_rgba(143,155,255,0.15)]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex justify-between items-center bg-[#12151e]/90 border border-[#222840] p-2.5 rounded-xl">
            <span className="font-extrabold text-[#8f9bff] text-xs flex items-center gap-1.5">
              <Car className="w-4 h-4 text-[#b8c0ff]" /> Автопарк: {CAR_CATALOG.length} авто
            </span>
            <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] uppercase font-mono ${
              isRented ? 'bg-red-600 text-white animate-pulse' : 'bg-[#8f9bff] text-black'
            }`}>
              {isRented ? `АРЕНДА • ${rentSeconds} СЕК` : 'ГОТОВ К АРЕНДЕ'}
            </span>
          </div>

          <div className="relative z-10 bg-[#12151e]/90 border border-[#222840] p-2 rounded-xl flex items-center justify-between">
            <span className="text-white font-extrabold">{selectedCar.model}</span>
            <span className="text-[#b8c0ff] font-black font-mono">{selectedCar.pricePerMin}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE RENTAL OR VEHICLE SELECTION */}
        {/* ========================================================================= */}
        {!isRented ? (
          <div className="bg-[#12151e] border border-[#222840] p-4 rounded-2xl space-y-3 shadow-md">
            <div className="flex justify-between items-start border-b border-[#222840] pb-2.5">
              <div>
                <h3 className="font-extrabold text-sm text-white">{selectedCar.model}</h3>
                <p className="text-[10px] text-gray-400 font-bold">{selectedCar.plate} • {selectedCar.location}</p>
              </div>
              <span className="text-[#8f9bff] font-black text-xs flex items-center gap-1 font-mono">
                <Fuel className="w-3.5 h-3.5 text-[#b8c0ff]" /> {selectedCar.fuel}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  soundManager.playBeep(800, 0.05);
                  setInspected(!inspected);
                }}
                className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                  inspected
                    ? 'bg-[#222840] border-[#8f9bff] text-[#8f9bff]'
                    : 'bg-[#0f121a] border-[#222840] text-gray-400 hover:border-[#8f9bff]/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{inspected ? 'Осмотр завершен (Замечаний нет)' : 'Фотоосмотр кузова и салона'}</span>
              </button>

              <button
                onClick={handleStartRental}
                className="w-full py-3.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-black text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(143,155,255,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Key className="w-4 h-4" />
                <span>Начать поездку ({selectedCar.pricePerMin})</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Trip Telematics & Accumulated Fines Card */
          <div className="bg-[#12151e] border-2 border-red-600/70 p-4 rounded-2xl space-y-3 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-red-900/50 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🚨</span>
                <div>
                  <h4 className="font-black text-white text-xs">РЕЖИМ ПОЕЗДКИ АКТИВЕН</h4>
                  <p className="text-[10px] text-gray-400 font-mono">Телематика передает параметры движения</p>
                </div>
              </div>
              <button
                onClick={handleEndRental}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-lg transition-all active:scale-95 flex items-center gap-1"
              >
                <StopCircle className="w-4 h-4" />
                <span>Сдать авто</span>
              </button>
            </div>

            {/* Total Fines Ticker */}
            <div className="p-3 bg-black border border-red-600/50 rounded-xl flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <ReceiptText className="w-4 h-4" />
                <span>Начислено штрафов:</span>
              </div>
              <span className="text-lg font-black text-red-500 tracking-tight">
                {totalFinesSum.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {/* Live Fines Stream Log */}
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 font-mono">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Журнал автоматических списаний:
              </span>
              {finesList.map((f) => (
                <div
                  key={f.id}
                  className="p-2 bg-red-950/40 border border-red-900/40 rounded-lg flex items-center justify-between text-[10px]"
                >
                  <div className="truncate pr-2">
                    <div className="text-gray-200 font-bold truncate">{f.reason}</div>
                    <div className="text-red-400 text-[9px]">{f.article} • {f.time}</div>
                  </div>
                  <span className="text-red-400 font-black shrink-0 font-mono">
                    +{f.amount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cars Catalog Selector */}
        <div className="space-y-1.5 overflow-y-auto max-h-[150px] pr-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
            Доступные автомобили:
          </span>
          {CAR_CATALOG.map((car) => (
            <button
              key={car.id}
              disabled={isRented}
              onClick={() => {
                soundManager.playBeep(700, 0.05);
                setSelectedCar(car);
              }}
              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between disabled:opacity-40 ${
                selectedCar.id === car.id
                  ? 'bg-[#222840] border-[#8f9bff] text-[#8f9bff]'
                  : 'bg-[#12151e] border-[#222840] text-gray-300 hover:border-[#8f9bff]/40'
              }`}
            >
              <div className="truncate pr-2">
                <div className="font-extrabold text-xs truncate">{car.model}</div>
                <div className="text-[10px] text-gray-400">{car.dist} от вас • {car.plate}</div>
              </div>
              <span className="text-xs font-black text-[#b8c0ff] shrink-0 font-mono">{car.pricePerMin}</span>
            </button>
          ))}
        </div>

      </div>
    </ToolWrapper>
  );
};
