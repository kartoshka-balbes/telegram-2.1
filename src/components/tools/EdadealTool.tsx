import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  Receipt,
  ScanLine,
  CheckCircle2,
  Clock,
  Coins,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Store,
  Tag,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

interface CashbackRecord {
  id: string;
  item: string;
  store: string;
  cashbackKopecks: number;
  time: string;
}

const PRESET_PRODUCTS = [
  'Хлеб Бородинский',
  'Молоко Домик в деревне 3.2%',
  'Сыр Российский 45%',
  'Колбаса Докторская ГОСТ',
  'Масло сливочное 82.5%',
  'Яблоки сезонные',
  'Пельмени Сибирские',
  'Чай черный 100 пакетиков',
];

const STORES = ['Пятёрочка', 'Магнит', 'Перекрёсток', 'Лента', 'Ашан', 'Дикси', 'ВкусВилл', 'К&Б'];

export const EdadealTool: React.FC<ToolProps> = ({ onClose }) => {
  const [productQuery, setProductQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('Пятёрочка');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTimeLeft, setProcessingTimeLeft] = useState(2.5);
  const [statusText, setStatusText] = useState('');
  const [currentCashback, setCurrentCashback] = useState<number | null>(null);
  const [lastCalculatedItem, setLastCalculatedItem] = useState('');
  const [totalAccumulatedKopecks, setTotalAccumulatedKopecks] = useState<number>(0.0000012489123);
  const [history, setHistory] = useState<CashbackRecord[]>([
    {
      id: '1',
      item: 'Молоко Домик в деревне 3.2%',
      store: 'Пятёрочка',
      cashbackKopecks: 0.0000014298105,
      time: '12:30'
    },
    {
      id: '2',
      item: 'Сыр Российский 45%',
      store: 'Магнит',
      cashbackKopecks: 0.0000026991341,
      time: '11:15'
    }
  ]);

  // Precision formatter for kopecks (up to 16 decimal places without scientific notation)
  const formatKopecks = (val: number) => {
    return val.toFixed(14).replace(/\.?0+$/, '');
  };

  const handleCalculateCashback = () => {
    const itemToProcess = productQuery.trim() || 'Товар из чека';
    setIsProcessing(true);
    setCurrentCashback(null);
    setLastCalculatedItem(itemToProcess);
    setProcessingTimeLeft(2.5);
    setStatusText('Поиск товара в базе ФНС и каталоге скидок...');

    triggerHaptic('tap');
    soundManager.playBeep(900, 0.05);

    // 1st step: 0.8s
    setTimeout(() => {
      setStatusText('Сверка чека с акционными позициями ритейлера...');
      soundManager.playBeep(1000, 0.04);
    }, 800);

    // 2nd step: 1.6s
    setTimeout(() => {
      setStatusText('Расчёт индивидуального кэшбэка по шкале лояльности...');
      soundManager.playBeep(1100, 0.04);
    }, 1600);

    // Completion at 2.4s (within requested 2-3 seconds)
    setTimeout(() => {
      // Pick random from range: 0.00000000001 копеек до 0.0000049876423279754 копеек
      const minVal = 0.00000000001;
      const maxVal = 0.0000049876423279754;
      const randomKopecks = minVal + Math.random() * (maxVal - minVal);

      setCurrentCashback(randomKopecks);
      setTotalAccumulatedKopecks((prev) => prev + randomKopecks);
      setIsProcessing(false);
      setStatusText('');

      const newRecord: CashbackRecord = {
        id: Date.now().toString(),
        item: itemToProcess,
        store: selectedStore,
        cashbackKopecks: randomKopecks,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newRecord, ...prev.slice(0, 9)]);
      triggerHaptic('success');
      soundManager.playBeep(1300, 0.1);
    }, 2400);
  };

  return (
    <ToolWrapper title="Едадил — Кэшбэк & Скидки" onClose={onClose} headerColor="bg-[#161922] border-[#2a2f41]">
      <div className="flex-1 flex flex-col gap-3.5 max-w-xl mx-auto w-full py-2 font-sans select-none text-white overflow-y-auto px-1">
        
        {/* Brand Banner */}
        <div className="bg-gradient-to-r from-[#222840] via-[#282d3e] to-[#161923] border border-[#8f9bff]/40 rounded-3xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8f9bff] text-black flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white tracking-wide">ЕДАДИЛ</h3>
                <span className="text-[10px] bg-[#8f9bff]/20 border border-[#8f9bff]/60 text-[#8f9bff] px-2 py-0.5 rounded-full font-mono font-bold">
                  ОФИЦИАЛЬНЫЙ СЕРВИС
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Напишите товар и получите положенный кэшбэк с чека
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-black/50 border border-[#8f9bff]/20 px-3 py-1.5 rounded-2xl">
            <span className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider block">
              Баланс
            </span>
            <div className="font-mono font-black text-xs text-[#8f9bff]">
              {formatKopecks(totalAccumulatedKopecks)} коп.
            </div>
          </div>
        </div>

        {/* Main Input Form Card */}
        <div className="bg-[#12151f] border border-[#252a3a] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-200 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#8f9bff]" />
              Введите ваш товар из чека:
            </label>
            <div className="relative">
              <input
                type="text"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isProcessing) {
                    handleCalculateCashback();
                  }
                }}
                placeholder="Например: Сыр Российский, Молоко 3.2%, Колбаса..."
                className="w-full bg-[#1c1c24] border border-white/15 focus:border-[#8f9bff] text-white text-xs px-3.5 py-3 rounded-2xl outline-none transition-all placeholder:text-gray-500 font-medium pr-10 shadow-inner"
              />
              {productQuery && (
                <button
                  onClick={() => setProductQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Select Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Быстрый выбор товара:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PRODUCTS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    triggerHaptic('tap');
                    setProductQuery(item);
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-2xl bg-[#1c1c24] hover:bg-[#252530] border border-white/10 text-gray-300 hover:text-[#8f9bff] transition-all cursor-pointer font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Store Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Супермаркет / Магазин:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {STORES.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    triggerHaptic('tap');
                    setSelectedStore(st);
                  }}
                  className={`py-1.5 px-1.5 rounded-2xl text-[10px] font-bold border transition-all cursor-pointer truncate ${
                    selectedStore === st
                      ? 'bg-[#8f9bff] text-black border-[#8f9bff] shadow-sm'
                      : 'bg-[#1c1c24] text-gray-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculateCashback}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-[#8f9bff] hover:bg-[#b8c0ff] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(143,155,255,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <ScanLine className="w-4 h-4 animate-spin text-black" />
                <span>Проверка чека и расчёт кэшбэка...</span>
              </>
            ) : (
              <>
                <Coins className="w-4 h-4" />
                <span>Рассчитать положенный кэшбэк (через 2-3 сек)</span>
              </>
            )}
          </button>
        </div>

        {/* 2-3 Seconds Loading / Processing State */}
        {isProcessing && (
          <div className="bg-[#12151f] border border-amber-500/40 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in shadow-xl">
            <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center text-xl">
              ⚡
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                ОБРАБОТКА В ЕДАДИЛ...
              </h4>
              <p className="text-xs text-gray-300 font-mono animate-pulse">
                {statusText}
              </p>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-3/4 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Calculated Result Card */}
        {currentCashback !== null && !isProcessing && (
          <div className="bg-[#161922] border border-[#8f9bff] rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-[0_0_30px_rgba(143,155,255,0.25)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#8f9bff]/20 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#8f9bff]" />
                <span className="text-xs font-black text-[#8f9bff] uppercase tracking-wider">
                  Положенный кэшбэк начислен
                </span>
              </div>
              <span className="text-[10px] bg-black/40 border border-[#8f9bff]/30 px-2 py-0.5 rounded-2xl text-emerald-300 font-mono font-bold">
                {selectedStore}
              </span>
            </div>

            <div className="space-y-1.5 text-center py-2">
              <div className="text-xs text-gray-300 font-medium">
                Положенный кэшбэк за товар «<span className="text-white font-bold">{lastCalculatedItem}</span>»:
              </div>
              <div className="font-mono font-black text-base sm:text-xl text-[#8f9bff] tracking-tight break-all py-1.5 px-2 bg-black/40 rounded-2xl border border-[#8f9bff]/30">
                {formatKopecks(currentCashback)} копеек
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                Диапазон: от 0.00000000001 до 0.0000049876423279754 копеек
              </div>
            </div>

            <div className="p-2.5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between text-[11px] text-gray-300 font-medium">
              <span>Статус выплаты:</span>
              <span className="text-[#8f9bff] font-bold">Зачислено на баланс ✓</span>
            </div>
          </div>
        )}

        {/* History Feed */}
        {history.length > 0 && (
          <div className="bg-[#12151f] border border-[#252a3a] rounded-3xl p-4 space-y-3 shadow-lg">
            <h4 className="font-extrabold text-gray-300 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-[#8f9bff]" />
              История начисленного кэшбэка ({history.length})
            </h4>
            <div className="space-y-2">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-[#1a1a22] border border-white/5 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-bold text-white truncate">{rec.item}</div>
                    <div className="text-[10px] text-gray-400">{rec.store} • {rec.time}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-[#8f9bff] text-[11px]">
                      +{formatKopecks(rec.cashbackKopecks)} коп.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
};
