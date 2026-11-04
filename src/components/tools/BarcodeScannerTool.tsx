import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Barcode, RefreshCw, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const BARCODE_ITEMS = [
  { name: 'трусы мужские', price: '279999р' },
  { name: 'колесо от камаза', price: '376190р' },
  { name: 'чебурек', price: '2р' },
  { name: 'линейка', price: '170р' },
  { name: 'человек', price: '1р' },
  { name: 'барбариска', price: '7р' },
  { name: 'саморезы (30 штук)', price: '2840р' },
  { name: 'кактус', price: '21000р' },
  { name: 'водонагреватель', price: '870р' },
  { name: 'карта мира', price: '65р' },
  { name: 'мотоцикл', price: '30р' },
  { name: 'тупой компьютер', price: '12р' },
];

export const BarcodeScannerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<{ name: string; price: string } | null>(null);

  const handleScan = () => {
    soundManager.playBeep(1000, 0.05);
    setScanning(true);
    setScannedItem(null);

    setTimeout(() => {
      soundManager.playBeep(1400, 0.1);
      setScanning(false);
      const randomObj = BARCODE_ITEMS[Math.floor(Math.random() * BARCODE_ITEMS.length)];
      setScannedItem(randomObj);
    }, 1200);
  };

  return (
    <ToolWrapper title="Сканер штрих-кода" onClose={onClose} headerColor="bg-slate-900 border-slate-800">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <Barcode className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
          <h3 className="text-base font-black text-white uppercase">ЛАЗЕРНЫЙ СТАНДАРТНЫЙ СТАНДАРТ EAN-13</h3>
          <p className="text-slate-400 text-[10px]">СКАНИРОВАНИЕ ТОВАРНОГО ШТРИХКОДА</p>
        </div>

        {/* Scanner Viewport */}
        <div className="bg-slate-950 border-2 border-cyan-500/80 p-8 my-auto text-center space-y-4 shadow-2xl relative overflow-hidden">
          {/* Laser beam overlay */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500 shadow-lg shadow-red-500/80 animate-pulse z-10" />

          {scanning && (
            <div className="space-y-3">
              <RefreshCw className="w-10 h-10 text-cyan-400 mx-auto animate-spin" />
              <span className="text-cyan-400 font-extrabold text-xs uppercase animate-pulse">
                СНИМАЕТСЯ КОД ТОВАРА...
              </span>
            </div>
          )}

          {!scanning && scannedItem === null && (
            <div className="space-y-2 py-4">
              <Barcode className="w-20 h-20 text-slate-600 mx-auto" />
              <span className="text-slate-400 font-bold block">
                Наведите камеру на штрих-код товара
              </span>
            </div>
          )}

          {!scanning && scannedItem !== null && (
            <div className="space-y-3 animate-in zoom-in duration-150">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  НАИМЕНОВАНИЕ ТОВАРА:
                </span>
                <span className="text-xl font-black text-white uppercase block mt-1">
                  {scannedItem.name}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">ЦЕНА В БАЗЕ:</span>
                <span className="text-3xl font-black text-cyan-400 font-mono">
                  {scannedItem.price}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-black uppercase text-sm cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          {scanning ? 'СКАНИРОВАНИЕ...' : 'СКАНИРОВАТЬ ШТРИХ-КОД'}
        </button>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          БАЗА ДАННЫХ В РОЗНИЧНОЙ СЕТИ • ЕАЕС 84920
        </div>
      </div>
    </ToolWrapper>
  );
};
