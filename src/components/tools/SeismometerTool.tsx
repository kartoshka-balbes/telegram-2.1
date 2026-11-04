import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Activity, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

export const SeismometerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [measuring, setMeasuring] = useState(false);
  const [seismicData, setSeismicData] = useState<{
    richter: number;
    acceleration: number;
    energyJoule: number;
    normMultiplier: string;
  } | null>(null);

  // Screen shake animation effect
  const isShaking = measuring || seismicData !== null;
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0, rot: 0 });

  useEffect(() => {
    if (!isShaking) {
      setShakeOffset({ x: 0, y: 0, rot: 0 });
      return;
    }
    const interval = setInterval(() => {
      setShakeOffset({
        x: (Math.random() - 0.5) * 28,
        y: (Math.random() - 0.5) * 28,
        rot: (Math.random() - 0.5) * 8,
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isShaking]);

  const handleMeasure = () => {
    soundManager.playBeep(700, 0.08);
    setMeasuring(true);
    setSeismicData(null);

    setTimeout(() => {
      soundManager.playBeep(1100, 0.15);
      setMeasuring(false);
      // Results are always giant numbers
      setSeismicData({
        richter: 9845201.4,
        acceleration: 894820150.8,
        energyJoule: 982000000000000000,
        normMultiplier: '84 920 000 000',
      });
    }, 1500);
  };

  return (
    <ToolWrapper title="Сейсмометр" onClose={onClose} headerColor="bg-stone-950 border-stone-900">
      <div
        className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between py-6 font-mono text-xs transition-transform duration-75"
        style={{ transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px) rotate(${shakeOffset.rot}deg)` }}
      >
        <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
          <Activity className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
          <h3 className="text-base font-black text-white uppercase">СЕЙСМОМЕТР СВЕРХЧУВСТВИТЕЛЬНЫЙ</h3>
          <p className="text-slate-400 text-[10px]">ИЗМЕРЕНИЕ ТЕКТОНИЧЕСКИХ КОЛЕБАНИЙ ГРУНТА</p>
        </div>

        <div className="bg-slate-900 border-2 border-stone-700 p-6 my-auto text-center space-y-4 shadow-2xl">
          {measuring && (
            <div className="space-y-3">
              <RefreshCw className="w-10 h-10 text-amber-400 mx-auto animate-spin" />
              <span className="text-amber-400 font-extrabold text-xs uppercase animate-pulse">
                СНИМАЮТСЯ ПОКАЗАНИЯ ДАТЧИКА ГРУНТА...
              </span>
            </div>
          )}

          {!measuring && seismicData === null && (
            <span className="text-slate-500 font-bold block">
              Нажмите кнопку для проведения первого сейсмозамера
            </span>
          )}

          {!measuring && seismicData !== null && (
            <div className="space-y-4 animate-in zoom-in duration-150">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  АМПЛИТУДА КОЛЕБАНИЙ:
                </span>
                <span className="text-3xl font-black text-amber-400 font-mono">
                  {seismicData.richter.toLocaleString('ru-RU')} ML
                </span>
              </div>

              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-center space-y-1">
                <span className="text-slate-300 font-bold block text-[10px] uppercase">
                  Интенсивность сейсмоактивности:
                </span>
                <span className="text-xl font-black text-red-400 font-mono block">
                  12 БАЛЛОВ (Катастрофа)
                </span>
                <span className="text-xs font-black text-amber-300 block uppercase">
                  Норма превышена в {seismicData.normMultiplier} раз!
                </span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 space-y-2 text-left font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ускорение грунта:</span>
                  <span className="text-white">{seismicData.acceleration.toLocaleString('ru-RU')} см/с²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Энергия толчка:</span>
                  <span className="text-amber-400">{seismicData.energyJoule.toExponential(2)} Дж</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleMeasure}
          disabled={measuring}
          className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white font-black uppercase text-sm cursor-pointer shadow-lg shadow-amber-600/20"
        >
          {measuring ? 'ИЗМЕРЕНИЕ...' : 'ИЗМЕРИТЬ СЕЙСМОАКТИВНОСТЬ'}
        </button>

        <div className="p-3 bg-slate-900 border border-slate-800 text-center text-slate-500 text-[10px]">
          ШКАЛА РИХТЕРА / МЕРКАЛЛИ • ТРЕХОСЕВОЙ ГЕОФОН
        </div>
      </div>
    </ToolWrapper>
  );
};
