import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { Wind, Flame, Zap, Sparkles, Radio, Fingerprint, Eye, Search, Home, Trash2, Shield, Compass, Waves, Volume2, Anchor, Target, AlertTriangle, FileText } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export type GadgetType =
  | 'ionizer' | 'humidifier' | 'ozonator' | 'shredder' | 'ir_thermometer'
  | 'fog_generator' | 'insect_repeller' | 'alien_smarthome' | 'dumpling_projector'
  | 'dawn_nightlight' | 'fan_heater' | 'electric_stove' | 'fingerprint_scanner'
  | 'walkie_talkie' | 'night_vision' | 'underwater_metal_detector' | 'pinterest';

interface Props {
  type: GadgetType;
  onClose: () => void;
}

const RANDOM_STREETS = [
  'квартире №42 (ул. Ленина, д. 15)',
  'квартире №118 (пр-т Мира, д. 24, корп. 2)',
  'квартире №7 (ул. Гагарина, д. 9)',
  'доме гражданина Петрова (п. Берёзки, д. 14)',
  'квартире №89 (ул. Пушкина, д. 31)',
  'коттедже №3 (ДНП «Лесной ручей»)',
  'квартире №204 (ул. Советская, д. 88)',
  'квартире №53 (б-р Строителей, д. 12)',
  'доме семьи Смирновых (ул. Садовая, д. 5)',
  'квартире №66 (ул. Заречная, д. 19)',
];

export const HomeAppliancesGadgetsTool: React.FC<Props> = ({ type, onClose }) => {
  // Common air/power states
  const [power, setPower] = useState(false);
  const [level, setLevel] = useState(5);
  const [msg, setMsg] = useState('');

  // Nightlight color and blast trigger
  const [color, setColor] = useState('#8f9bff');
  const [nightlightBlast, setNightlightBlast] = useState(false);

  // Fingerprint Scanner state
  const [scanning, setScanning] = useState(false);
  const [fingerprintSaved, setFingerprintSaved] = useState(false);

  // Shredder state
  const [shredText, setShredText] = useState('Секретный_отчёт_2026.docx');
  const [shredded, setShredded] = useState(false);
  const [shredProgress, setShredProgress] = useState(0);

  // IR Thermometer measurement state
  const [irMeasuring, setIrMeasuring] = useState(false);
  const [irCount, setIrCount] = useState(5);
  const [irResult, setIrResult] = useState<{ temp: string; extra: string } | null>(null);

  // Screen shake state for fan_heater
  const [shake, setShake] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (type !== 'fan_heater' || !power) {
      setShake({ x: 0, y: 0 });
      return;
    }
    const interval = setInterval(() => {
      const intensity = level * 1.5;
      setShake({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity,
      });
    }, 50);
    return () => clearInterval(interval);
  }, [type, power, level]);

  // Walkie talkie channel & PTT
  const [channel, setChannel] = useState(1);
  const [pttActive, setPttActive] = useState(false);

  // Underwater metal detector state
  const [underwaterScanning, setUnderwaterScanning] = useState(false);
  const [metalFound, setMetalFound] = useState<{ depth: number; signal: number; item: string } | null>(null);

  // Night Vision targets animation
  const [nightVisionTargets, setNightVisionTargets] = useState<Array<{ id: number; x: number; y: number; temp: string; type: string }>>([
    { id: 1, x: 25, y: 35, temp: '36.8°C', type: 'Биологический объект' },
    { id: 2, x: 70, y: 60, temp: '85.2°C', type: 'Двигатель ТС' },
  ]);

  // Pinterest state
  const [pinCategory, setPinCategory] = useState('Все');
  const [pinSearch, setPinSearch] = useState('');
  const [savedPins, setSavedPins] = useState<number[]>([]);

  // Nightlight: Every 0.6 seconds sharp color switch + explosion shockwave
  useEffect(() => {
    if (type !== 'dawn_nightlight' || !power) return;
    const colors = ['#ff0055', '#8f9bff', '#00e5ff', '#ffea00', '#aa00ff', '#ff3300', '#b8c0ff', '#00ffff'];
    const timer = setInterval(() => {
      soundManager.playBeep(1800, 0.04);
      setColor(colors[Math.floor(Math.random() * colors.length)]);
      setNightlightBlast(true);
      setTimeout(() => setNightlightBlast(false), 250);
    }, 600);
    return () => clearInterval(timer);
  }, [type, power]);

  // Insect repeller audio pulse loop
  useEffect(() => {
    if (type !== 'insect_repeller' || !power) return;
    const interval = setInterval(() => {
      soundManager.playBeep(2400 + Math.random() * 800, 0.04);
    }, 400);
    return () => clearInterval(interval);
  }, [type, power]);

  // Night Vision random targets movement
  useEffect(() => {
    if (type !== 'night_vision') return;
    const interval = setInterval(() => {
      setNightVisionTargets((prev) =>
        prev.map((t) => ({
          ...t,
          x: Math.max(10, Math.min(85, t.x + (Math.random() * 10 - 5))),
          y: Math.max(10, Math.min(85, t.y + (Math.random() * 10 - 5))),
        }))
      );
    }, 600);
    return () => clearInterval(interval);
  }, [type]);

  // Fingerprint scanner action
  const handleFingerprintScan = () => {
    soundManager.playBeep(1200, 0.1);
    setScanning(true);
    setFingerprintSaved(false);
    setTimeout(() => {
      setScanning(false);
      setFingerprintSaved(true);
      soundManager.playBeep(1600, 0.2);
    }, 2000);
  };

  // IR Thermometer measurement trigger
  const handleIrMeasure = () => {
    soundManager.playBeep(1400, 0.1);
    setIrResult(null);
    setIrCount(5);
    setIrMeasuring(true);
  };

  // Режим наведения: 5 секунд, после этого итог с температурой
  React.useEffect(() => {
    if (!irMeasuring) return;
    const id = window.setInterval(() => {
      setIrCount((c) => c - 1);
      soundManager.playBeep(1200, 0.05);
    }, 1000);
    return () => window.clearInterval(id);
  }, [irMeasuring]);

  React.useEffect(() => {
    if (!irMeasuring || irCount > 0) return;
    soundManager.playBeep(1800, 0.15);
    setIrMeasuring(false);
    setIrResult({
      temp: `${(Math.random() * 9500000 + 1000000).toLocaleString('ru-RU')} °C`,
      extra: 'Температура превышает норму поверхности в 230 000 раз!',
    });
  }, [irCount, irMeasuring]);

  // Smart Home trigger with address of someone's home
  const triggerSmartHome = (actionName: string) => {
    soundManager.playBeep(1300, 0.08);
    const randomAddress = RANDOM_STREETS[Math.floor(Math.random() * RANDOM_STREETS.length)];
    setMsg(`✓ Команда «${actionName}» успешно выполнена в ${randomAddress}!`);
    setTimeout(() => setMsg(''), 4000);
  };

  // Shredder Action with real progressive paper feeding animation
  const handleShred = () => {
    if (shredded) return;
    soundManager.playSiren();
    setShredded(true);
    setShredProgress(0);

    const stepInterval = setInterval(() => {
      setShredProgress((prev) => {
        if (prev >= 100) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setShredText('');
            setShredded(false);
            setShredProgress(0);
          }, 1500);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  // Underwater metal detector scan
  const handleUnderwaterScan = () => {
    soundManager.playBeep(800, 0.1);
    setUnderwaterScanning(true);
    setMetalFound(null);
    const interval = setInterval(() => {
      soundManager.playBeep(1200 + Math.random() * 600, 0.05);
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      soundManager.playBeep(2000, 0.2);
      setUnderwaterScanning(false);
      const items = [
        'Затонувший сундук со старинными монетами',
        'Титановый якорь подлодки',
        'Золотой слиток 18-го века',
        'Металлический зашифрованный контейнер',
      ];
      setMetalFound({
        depth: Math.floor(Math.random() * 180 + 20),
        signal: Math.floor(Math.random() * 30 + 70),
        item: items[Math.floor(Math.random() * items.length)],
      });
    }, 1500);
  };

  return (
    <ToolWrapper
      title={
        type === 'ionizer' ? 'Ионизатор воздуха' :
        type === 'humidifier' ? 'Увлажнитель воздуха' :
        type === 'ozonator' ? 'Озонатор воздуха' :
        type === 'shredder' ? 'Шредер для документов' :
        type === 'ir_thermometer' ? 'Инфракрасный термометр' :
        type === 'fog_generator' ? 'Генератор тумана' :
        type === 'insect_repeller' ? 'Отпугиватель насекомых' :
        type === 'alien_smarthome' ? 'Умный дом' :
        type === 'dumpling_projector' ? 'Проектор звёздного неба' :
        type === 'dawn_nightlight' ? 'Ночник' :
        type === 'fan_heater' ? 'Тепловентилятор' :
        type === 'electric_stove' ? 'Электрическая плита' :
        type === 'fingerprint_scanner' ? 'Сканер отпечатков пальцев' :
        type === 'walkie_talkie' ? 'Рация' :
        type === 'night_vision' ? 'Прибор ночного видения' :
        type === 'underwater_metal_detector' ? 'Подводный металлоискатель' : 'Pinterest'
      }
      onClose={onClose}
      headerColor="bg-white/[0.05] backdrop-blur-xl border-white/10"
    >
      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full py-2 font-sans select-none overflow-y-auto pr-1">

        {/* 1. AIR TOOLS (Ионизатор, Увлажнитель, Озонатор) with custom atmospheric animations */}
        {['ionizer', 'humidifier', 'ozonator'].includes(type) && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4 relative overflow-hidden">
            {/* Custom Atmospheric Mist / Ions / Ozone Aura */}
            {power && type === 'humidifier' && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-radial from-cyan-200/50 via-white/30 to-transparent blur-2xl animate-pulse [animation-duration:2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/10 to-white/40 blur-xl animate-bounce [animation-duration:3s]" />
              </div>
            )}

            {power && type === 'ionizer' && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle,#00e5ff_1px,transparent_1px)] [background-size:16px_16px] opacity-40 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-radial from-blue-600/30 via-cyan-400/20 to-transparent blur-2xl animate-spin [animation-duration:12s]" />
              </div>
            )}

            {power && type === 'ozonator' && (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-radial from-purple-500/40 via-violet-600/20 to-transparent blur-3xl animate-pulse [animation-duration:1.5s]" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-purple-400/30 to-transparent blur-xl" />
              </div>
            )}

            <div className={`w-36 h-36 mx-auto rounded-full border-4 relative z-10 flex flex-col items-center justify-center transition-all ${
              power
                ? type === 'humidifier'
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_35px_rgba(34,211,238,0.5)]'
                  : type === 'ionizer'
                  ? 'border-blue-400 bg-blue-950/40 shadow-[0_0_35px_rgba(96,165,250,0.5)]'
                  : 'border-purple-400 bg-purple-950/40 shadow-[0_0_35px_rgba(192,132,252,0.5)]'
                : 'border-gray-800 bg-white/[0.05] backdrop-blur-xl'
            }`}>
              {type === 'humidifier' && (
                <Wind className={`w-14 h-14 ${power ? 'text-cyan-300 animate-spin [animation-duration:2.5s]' : 'text-gray-600'}`} />
              )}
              {type === 'ionizer' && (
                <Zap className={`w-14 h-14 ${power ? 'text-blue-400 animate-pulse' : 'text-gray-600'}`} />
              )}
              {type === 'ozonator' && (
                <Sparkles className={`w-14 h-14 ${power ? 'text-purple-400 animate-spin [animation-duration:6s]' : 'text-gray-600'}`} />
              )}
              <span className="text-[11px] font-extrabold text-white mt-2">
                {power ? 'АКТИВЕН • РЕЖИМ 100%' : 'ВЫКЛЮЧЕН'}
              </span>
            </div>

            <p className="text-xs text-gray-300 font-medium relative z-10">
              {type === 'ionizer' && 'Высоковольтная ионизация с потоком отрицательно заряженных аэроионов.'}
              {type === 'humidifier' && 'Ультразвуковой водяной туман для создания идеального микроклимата.'}
              {type === 'ozonator' && 'Глубокая озоновая стерилизация и обеззараживание воздуха.'}
            </p>

            <button
              onClick={() => { setPower(!power); soundManager.playBeep(power ? 700 : 1200, 0.1); }}
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase cursor-pointer transition-all relative z-10 shadow-lg ${
                power
                  ? 'bg-red-950 text-red-400 border border-red-800'
                  : type === 'humidifier'
                  ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                  : type === 'ionizer'
                  ? 'bg-blue-400 text-black hover:bg-blue-300'
                  : 'bg-purple-400 text-black hover:bg-purple-300'
              }`}
            >
              {power ? `Выключить ${type === 'ionizer' ? 'ионизатор' : type === 'humidifier' ? 'увлажнитель' : 'озонатор'}` : 'Включить прибор'}
            </button>
          </div>
        )}

        {/* 2. FOG GENERATOR (Генератор тумана) */}
        {type === 'fog_generator' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4">
            <div
              className={`fixed inset-0 pointer-events-none z-50 transition-all duration-1000 ease-in-out flex items-center justify-center overflow-hidden ${
                power ? 'opacity-90 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              <div className="absolute inset-0 bg-radial from-white/80 via-slate-200/50 to-transparent blur-3xl animate-pulse [animation-duration:3s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-slate-100/40 to-white/60 blur-2xl animate-spin [animation-duration:25s]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,rgba(200,225,255,0.4)_50%,transparent_80%)] blur-xl" />
            </div>

            <div className={`w-40 h-40 mx-auto rounded-3xl border-4 relative overflow-hidden flex flex-col items-center justify-center transition-all ${
              power ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_35px_rgba(200,240,255,0.6)]' : 'border-gray-800 bg-white/[0.05] backdrop-blur-xl'
            }`}>
              {power && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-cyan-200/30 to-transparent animate-pulse [animation-duration:1s]" />
              )}
              <Wind className={`w-14 h-14 z-10 ${power ? 'text-white animate-spin [animation-duration:2s]' : 'text-gray-600'}`} />
              <span className="text-xs font-bold text-white z-10 mt-2">
                {power ? 'ГЕНЕРАЦИЯ БЕЛОГО ТУМАНА...' : 'ГЕНЕРАТОР ГОТОВ'}
              </span>
            </div>

            <p className="text-xs text-gray-300 font-medium">
              {power ? 'Густой белый туман рассеивается по всему экрану.' : 'Нажмите кнопку для включения эффекта тумана.'}
            </p>

            <button
              onClick={() => { setPower(!power); soundManager.playBeep(1100, 0.1); }}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase cursor-pointer transition-all shadow-lg ${
                power ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-cyan-400 text-black hover:bg-cyan-300'
              }`}
            >
              {power ? 'Выключить генератор тумана' : 'Включить генератор тумана'}
            </button>
          </div>
        )}

        {/* 3. INSECT REPELLER (Отпугиватель насекомых) */}
        {type === 'insect_repeller' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4">
            <div className={`w-36 h-36 mx-auto rounded-full border-4 flex flex-col items-center justify-center transition-all ${
              power ? 'border-[#8f9bff] bg-[#222840] shadow-[0_0_25px_rgba(143,155,255,0.4)] animate-pulse' : 'border-gray-800 bg-white/[0.05] backdrop-blur-xl'
            }`}>
              <Radio className={`w-12 h-12 ${power ? 'text-[#8f9bff]' : 'text-gray-600'}`} />
              <span className="text-[11px] font-mono font-bold text-white mt-1">
                {power ? '24 кГц - 65 кГц' : 'НЕАКТИВЕН'}
              </span>
            </div>

            <p className="text-xs text-gray-300 font-medium">
              {power ? 'Издаются звуковые ультразвуковые импульсы отпугивания.' : 'Нажмите кнопку для запуска отпугивателя.'}
            </p>

            <button
              onClick={() => { setPower(!power); soundManager.playBeep(1200, 0.1); }}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs uppercase cursor-pointer transition-all ${
                power ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-[#8f9bff] text-black hover:bg-[#b8c0ff]'
              }`}
            >
              {power ? 'Выключить отпугиватель' : 'Включить отпугиватель (24 кГц - 65 кГц)'}
            </button>
          </div>
        )}

        {/* 4. IR THERMOMETER (Инфракрасный термометр) */}
        {type === 'ir_thermometer' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4">
            <div className="bg-white/[0.05] backdrop-blur-xl border border-[#8f9bff] p-5 rounded-2xl text-center space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Показания пирометра:</span>
              <div className="text-2xl font-black text-[#b8c0ff] font-mono min-h-[40px] flex items-center justify-center">
                {irMeasuring ? (
                  <div className="flex flex-col items-center gap-2 py-1">
                    <div className="relative w-28 h-28">
                      <span className="absolute inset-0 rounded-full border-2 border-red-500/70 animate-ping" />
                      <span className="absolute inset-2 rounded-full border-2 border-red-400" />
                      <span className="absolute left-1/2 top-0 bottom-0 w-px bg-red-400/80" />
                      <span className="absolute top-1/2 left-0 right-0 h-px bg-red-400/80" />
                      <span className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)]" />
                      <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white drop-shadow">{Math.max(irCount, 0)}</span>
                    </div>
                    <span className="animate-pulse text-amber-300 text-xs">НАВЕДЕНИЕ ЛАЗЕРА... держите прицел на объекте</span>
                  </div>
                ) : irResult ? (
                  irResult.temp
                ) : (
                  '-- °C'
                )}
              </div>
              {irResult && (
                <p className="text-[10px] text-amber-300 font-bold border-t border-white/10 pt-1">
                  {irResult.extra}
                </p>
              )}
            </div>

            <button
              onClick={handleIrMeasure}
              disabled={irMeasuring}
              className="w-full py-4 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold text-xs uppercase rounded-2xl shadow-[0_0_15px_rgba(143,155,255,0.3)] transition-all cursor-pointer active:scale-95"
            >
              {irMeasuring ? 'ЗАМЕР...' : 'Сделать замер (Нажать курок)'}
            </button>
          </div>
        )}

        {/* 5. SMART HOME (Умный дом с множеством команд и уведомлением о чужом доме) */}
        {type === 'alien_smarthome' && (
          <div className="space-y-3">
            <div className="bg-black/30 border border-white/10 p-3 rounded-2xl flex items-center gap-2">
              <Home className="w-5 h-5 text-[#8f9bff]" />
              <div>
                <h4 className="text-xs font-extrabold text-white">Умный Дом (Центральный Контроллер)</h4>
                <p className="text-[10px] text-gray-400">Удалённое управление приборами экосистемы</p>
              </div>
            </div>

            {msg && (
              <div className="p-3 bg-[#222840] border border-[#8f9bff] text-[#8f9bff] text-xs font-extrabold text-center rounded-2xl animate-in zoom-in shadow-lg">
                {msg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: '💡 Выключить свет во всей квартире', dev: 'Выключение освещения' },
                { name: '🫖 Вскипятить чайник до 100°C', dev: 'Кипячение чайника' },
                { name: '🧹 Робот-пылесос (Турбо-режим)', dev: 'Запуск робота-пылесоса' },
                { name: '📻 Радио на полную громкость', dev: 'Включение радиостанции' },
                { name: '🔒 Заблокировать входную дверь', dev: 'Блокировка замков' },
                { name: '❄️ Кондиционер на +38°C (Сауна)', dev: 'Климат-контроль +38°C' },
                { name: '🚽 Спустить воду в бачке', dev: 'Смыв бачка' },
                { name: '🍿 Микроволновка на 20 минут', dev: 'Запуск микроволновки' },
                { name: '🪟 Открыть жалюзи настежь', dev: 'Открытие электрожалюзи' },
                { name: '🪩 Режим дискотеки и стробоскоп', dev: 'Диско-подсветка' },
                { name: '🚿 Ледяной душ в ванной', dev: 'Включение холодного душа' },
                { name: '🚪 Открыть дверцу холодильника', dev: 'Открытие холодильника' },
                { name: '⏰ Будильник на 04:00 утра', dev: 'Установка сирены будильника' },
                { name: '🛁 Набрать горячую ванну', dev: 'Набор ванны' },
                { name: '♨️ Тёплый пол на максимум', dev: 'Максимальный подогрев полов' },
                { name: '🚨 Включить охранную сирену', dev: 'Охранная сигнализация' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => triggerSmartHome(btn.dev)}
                  className="p-2.5 bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-[#8f9bff] text-white font-extrabold text-[11px] rounded-2xl transition-all cursor-pointer text-left shadow-lg active:scale-95 hover:bg-white/[0.07]"
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. STAR SKY PROJECTOR (Проектор звёздного неба с плавающими пельменями) */}
        {type === 'dumpling_projector' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4">
            <div className="w-56 h-56 mx-auto rounded-3xl bg-black/30 border border-indigo-500/50 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_35px_rgba(99,102,241,0.5)] p-4">
              {/* Star field & rotating nebula */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.25)_0%,rgba(15,23,42,1)_80%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] opacity-40 animate-pulse" />
              
              {/* Floating dumplings drifting in cosmic space */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <span className="absolute top-4 left-6 text-2xl animate-bounce [animation-duration:4s] opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                  🥟
                </span>
                <span className="absolute bottom-6 right-8 text-3xl animate-spin [animation-duration:14s] opacity-85 drop-shadow-[0_0_10px_rgba(99,102,241,0.9)]">
                  🥟
                </span>
                <span className="absolute top-1/2 left-8 text-xl animate-pulse [animation-duration:2.5s] opacity-80">
                  🥟
                </span>
                <span className="absolute bottom-10 left-12 text-2xl animate-bounce [animation-duration:6s] opacity-90">
                  🥟
                </span>
                <span className="absolute top-8 right-8 text-2xl animate-spin [animation-duration:9s] opacity-85">
                  🥟
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <Sparkles className="w-12 h-12 text-indigo-300 mx-auto animate-spin [animation-duration:8s]" />
                <span className="text-xs font-black text-indigo-100 block uppercase tracking-wider">
                  Проекция созвездий и Млечного Пути
                </span>
                <span className="text-[10px] text-indigo-300 font-mono block">
                  ОПТИЧЕСКАЯ ПРОЕКЦИЯ АКТИВНА
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setPower(!power);
                soundManager.playBeep(1200, 0.1);
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase rounded-2xl cursor-pointer shadow-lg transition-all"
            >
              {power ? 'Выключить проектор' : 'Переключить режим проекции'}
            </button>
          </div>
        )}

        {/* 7. ELECTRIC STOVE (Электрическая плита) */}
        {type === 'electric_stove' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-5">
            <div className={`w-44 h-44 mx-auto rounded-full border-8 transition-all duration-300 flex flex-col items-center justify-center relative shadow-2xl ${
              power ? 'border-red-600 bg-red-950/60 shadow-[0_0_40px_rgba(255,0,0,0.5)] animate-pulse' : 'border-gray-800 bg-white/[0.05] backdrop-blur-xl'
            }`}>
              <Flame className={`w-14 h-14 ${power ? 'text-red-500 animate-bounce' : 'text-gray-700'}`} />
              <span className="text-xs font-black uppercase text-white mt-2">
                {power ? 'КОНФОРКА НАГРЕТА (100%)' : 'ПЛИТА ВЫКЛЮЧЕНА'}
              </span>
            </div>

            <button
              onClick={() => { setPower(!power); soundManager.playBeep(power ? 600 : 1200, 0.1); }}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-xl cursor-pointer ${
                power ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-[#8f9bff] text-black hover:bg-[#b8c0ff]'
              }`}
            >
              {power ? 'ВЫКЛЮЧИТЬ ПЛИТУ' : 'ВКЛЮЧИТЬ ПЛИТУ'}
            </button>
          </div>
        )}

        {/* 8. NIGHT VISION (Прибор ночного видения) */}
        {type === 'night_vision' && (
          <div className="bg-[#0a0b10] border border-[#8f9bff] p-4 rounded-3xl text-[#8f9bff] font-mono text-xs space-y-3 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.3)]">
            <div className="flex justify-between items-center border-b border-[#8f9bff]/40 pb-2 text-[10px]">
              <span>NVG CRT SCOPE</span>
              <span className="animate-pulse">GAIN: HIGH</span>
            </div>

            <div className="w-56 h-56 mx-auto rounded-full border-4 border-[#8f9bff] bg-black/60 relative overflow-hidden flex items-center justify-center my-2">
              <div className="absolute inset-0 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:8px_8px] opacity-30" />
              <div className="absolute inset-0 border border-dashed border-[#8f9bff]/50 rounded-full animate-spin [animation-duration:10s]" />
              <div className="w-full h-0.5 bg-[#8f9bff]/60 absolute" />
              <div className="h-full w-0.5 bg-[#8f9bff]/60 absolute" />

              {nightVisionTargets.map((t) => (
                <div
                  key={t.id}
                  className="absolute transition-all duration-500 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${t.x}%`, top: `${t.y}%` }}
                >
                  <div className="w-5 h-5 rounded-full border border-[#8f9bff] bg-[#8f9bff]/40 animate-ping" />
                  <span className="text-[8px] bg-black text-[#8f9bff] px-1 rounded border border-[#8f9bff] mt-1">
                    {t.type} {t.temp}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center text-[10px] font-bold uppercase">
              Случайные тепловые сигнатуры объектов зафиксированы
            </div>
          </div>
        )}

        {/* 9. UNDERWATER METAL DETECTOR */}
        {type === 'underwater_metal_detector' && (
          <div className="bg-sky-950 border border-cyan-400 p-5 rounded-3xl text-cyan-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-800 pb-2">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold uppercase text-white">ПОДВОДНЫЙ СОНАР</span>
              </div>
              <span className="text-[10px] bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded">ГЛУБИНА: 45м</span>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-xl border border-cyan-700 p-4 rounded-2xl text-center space-y-2">
              {underwaterScanning ? (
                <div className="space-y-2">
                  <Waves className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
                  <span className="text-xs font-bold text-cyan-300 animate-pulse block">СКАНИРОВАНИЕ МОРСКОГО ДНА...</span>
                </div>
              ) : metalFound ? (
                <div className="space-y-1 animate-in zoom-in">
                  <div className="text-xs font-bold text-amber-300 uppercase">ОБНАРУЖЕН МЕТАЛЛИЧЕСКИЙ ОБЪЕКТ!</div>
                  <div className="text-sm font-black text-white">{metalFound.item}</div>
                  <div className="text-[10px] text-cyan-400">Глубина залегания: {metalFound.depth} см | Мощность сигнала: {metalFound.signal}%</div>
                </div>
              ) : (
                <span className="text-slate-400 font-bold block">Погрузите катушку и нажмите Сканировать</span>
              )}
            </div>

            <button
              onClick={handleUnderwaterScan}
              disabled={underwaterScanning}
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase rounded-2xl cursor-pointer transition-all shadow-lg"
            >
              {underwaterScanning ? 'Сканирование...' : 'Сканировать морское дно'}
            </button>
          </div>
        )}

        {/* 10. PINTEREST */}
        {type === 'pinterest' && (
          <div className="space-y-3 font-sans">
            <div className="flex gap-2">
              <div className="flex-1 bg-white/[0.07] border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск пинов и идей..."
                  value={pinSearch}
                  onChange={(e) => setPinSearch(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full"
                />
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
              {['Все', 'Киберпанк', 'Архитектура', 'Природа', 'Интерьер', 'Авто', 'Искусство'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPinCategory(cat)}
                  className={`px-3 py-1.5 rounded-2xl font-extrabold whitespace-nowrap transition-all ${
                    pinCategory === cat ? 'bg-[#8f9bff] text-black' : 'bg-white/[0.05] backdrop-blur-xl text-gray-400 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {[
                { id: 1, title: 'Киберпанк мегаполис', category: 'Киберпанк', icon: '🏙️', saves: 8400 },
                { id: 2, title: 'Футуристический интерьер', category: 'Интерьер', icon: '🛋️', saves: 3200 },
                { id: 3, title: 'Минималистичный сад', category: 'Природа', icon: '🌿', saves: 1900 },
                { id: 4, title: 'Спортивный гиперкар', category: 'Авто', icon: '🏎️', saves: 12400 },
                { id: 5, title: 'Современная гидравлика', category: 'Архитектура', icon: '🏛️', saves: 5100 },
                { id: 6, title: 'Цифровое искусство ИИ', category: 'Искусство', icon: '🎨', saves: 9800 },
                { id: 7, title: 'Неоновые вывески Токио', category: 'Киберпанк', icon: '🏮', saves: 6300 },
                { id: 8, title: 'Эко-дом в горах', category: 'Архитектура', icon: '🏡', saves: 4200 },
                { id: 9, title: 'Орбитальная станция Марс', category: 'Космос', icon: '🚀', saves: 15600 },
                { id: 10, title: 'Умные часы и нейроинтерфейс', category: 'Гаджеты', icon: '⌚', saves: 7100 },
              ]
                .filter((p) => pinCategory === 'Все' || p.category === pinCategory)
                .filter((p) => p.title.toLowerCase().includes(pinSearch.toLowerCase()))
                .map((pin) => {
                  const isSaved = savedPins.includes(pin.id);
                  return (
                    <div key={pin.id} className="bg-white/[0.05] backdrop-blur-xl border border-white/10 p-3 rounded-2xl text-center space-y-2">
                      <div className="text-4xl p-3 bg-black/30 rounded-2xl border border-white/10">{pin.icon}</div>
                      <div className="text-xs font-extrabold text-white leading-tight">{pin.title}</div>
                      <div className="text-[9px] text-gray-400">Сохранений: {pin.saves}</div>
                      <button
                        onClick={() => {
                          soundManager.playBeep(1200, 0.05);
                          setSavedPins((prev) => isSaved ? prev.filter((id) => id !== pin.id) : [...prev, pin.id]);
                        }}
                        className={`w-full py-1.5 rounded-2xl text-[10px] font-extrabold uppercase transition-all ${
                          isSaved ? 'bg-emerald-500 text-black' : 'bg-[#8f9bff] text-black hover:bg-[#b8c0ff]'
                        }`}
                      >
                        {isSaved ? 'Сохранено ✓' : 'Сохранить'}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 11. FAN HEATER (Тепловентилятор) */}
        {type === 'fan_heater' && (
          <div
            className="bg-black/30 border border-white/10 p-5 rounded-3xl text-center space-y-4 transition-transform duration-75"
            style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}
          >
            <div className={`w-32 h-32 mx-auto rounded-full border-4 flex flex-col items-center justify-center transition-all ${
              power ? 'border-[#8f9bff] bg-[#222840]/40 shadow-[0_0_25px_rgba(143,155,255,0.3)]' : 'border-gray-800 bg-white/[0.05] backdrop-blur-xl'
            }`}>
              <Wind className={`w-12 h-12 ${power ? 'text-[#8f9bff] animate-spin' : 'text-gray-600'}`} style={{ animationDuration: power ? `${Math.max(0.1, 1.2 - level * 0.1)}s` : '0s' }} />
              <span className="text-xs font-bold text-white mt-1">{power ? `Мощность: ${level}` : 'ВЫКЛ'}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Мощность обдува и нагрева (1 - 10):</label>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => { setLevel(num); setPower(true); soundManager.playBeep(1000 + num * 50, 0.05); }}
                    className={`flex-1 py-1.5 rounded-2xl text-xs font-black transition-all ${
                      power && level === num ? 'bg-[#8f9bff] text-black' : 'bg-white/[0.07] text-gray-400 border border-white/10'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setPower(!power); soundManager.playBeep(800, 0.1); }}
              className={`w-full py-3 rounded-2xl font-extrabold text-xs uppercase ${
                power ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-[#8f9bff] text-black'
              }`}
            >
              {power ? 'Выключить Тепловентилятор' : 'Включить Тепловентилятор'}
            </button>
          </div>
        )}

        {/* 12. FINGERPRINT SCANNER */}
        {type === 'fingerprint_scanner' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4">
            <div
              onMouseDown={handleFingerprintScan}
              className={`w-36 h-36 mx-auto rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                scanning
                  ? 'border-[#8f9bff] bg-[#222840] animate-pulse shadow-[0_0_30px_rgba(143,155,255,0.5)]'
                  : fingerprintSaved
                  ? 'border-emerald-500 bg-emerald-950/50'
                  : 'border-white/10 bg-white/[0.05] backdrop-blur-xl hover:border-[#8f9bff]'
              }`}
            >
              <Fingerprint className={`w-16 h-16 ${scanning ? 'text-[#8f9bff]' : fingerprintSaved ? 'text-emerald-400' : 'text-gray-500'}`} />
            </div>

            <p className="text-xs font-bold text-gray-300">
              {scanning ? 'Сканирование биометрического узора...' : fingerprintSaved ? '✓ Отпечаток сохранён в Базе Данных!' : 'Удерживайте палец на сканере'}
            </p>
          </div>
        )}

        {/* 13. NIGHTLIGHT (Ночник - резкая смена цвета каждые 0.6 сек со взрывом без упоминания) */}
        {type === 'dawn_nightlight' && (
          <div className="bg-black/30 border border-white/10 p-6 rounded-3xl text-center space-y-4 relative overflow-hidden">
            {nightlightBlast && (
              <div
                className="absolute inset-0 pointer-events-none animate-ping opacity-60 rounded-3xl"
                style={{ backgroundColor: color }}
              />
            )}

            <div
              className={`w-40 h-40 mx-auto rounded-full border-4 border-white transition-transform duration-150 flex items-center justify-center shadow-2xl ${
                nightlightBlast ? 'scale-125' : 'scale-100'
              }`}
              style={{ backgroundColor: color, boxShadow: `0 0 50px ${color}` }}
            >
              <Sparkles className="w-12 h-12 text-black animate-spin [animation-duration:2s]" />
            </div>

            <button
              onClick={() => { setPower(!power); soundManager.playBeep(1200, 0.1); }}
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase cursor-pointer transition-all shadow-lg ${
                power ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-[#8f9bff] text-black hover:bg-[#b8c0ff]'
              }`}
            >
              {power ? 'Выключить ночник' : 'Включить ночник'}
            </button>
          </div>
        )}

        {/* 14. WALKIE TALKIE (Рация без названия) */}
        {type === 'walkie_talkie' && (
          <div className="bg-black/30 border border-white/10 p-5 rounded-3xl text-center space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-gray-400">Канал рации:</span>
              <span className="text-sm font-black text-[#b8c0ff] font-mono">CH {channel} / 433.075 MHz</span>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((ch) => (
                <button
                  key={ch}
                  onClick={() => { setChannel(ch); soundManager.playBeep(1000 + ch * 100, 0.05); }}
                  className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${
                    channel === ch ? 'bg-[#8f9bff] text-black font-black' : 'bg-white/[0.07] text-gray-400 border border-white/10'
                  }`}
                >
                  CH {ch}
                </button>
              ))}
            </div>

            <button
              onMouseDown={() => { setPttActive(true); soundManager.playKrab(); }}
              onMouseUp={() => setPttActive(false)}
              onTouchStart={() => { setPttActive(true); soundManager.playKrab(); }}
              onTouchEnd={() => setPttActive(false)}
              className={`w-full py-7 rounded-2xl font-black text-sm uppercase transition-all cursor-pointer shadow-lg select-none ${
                pttActive ? 'bg-red-600 text-white scale-95 ring-4 ring-red-400' : 'bg-[#8f9bff] text-black hover:bg-[#b8c0ff]'
              }`}
            >
              {pttActive ? '📡 ПЕРЕДАЧА В ЭФИР (PTT)...' : '🎙️ ЗАЖАТЬ ДЛЯ СВЯЗИ (PTT)'}
            </button>
          </div>
        )}

        {/* 15. SHREDDER (Шредер с визуальной анимацией разрезания бумаги на ленты) */}
        {type === 'shredder' && (
          <div className="bg-black/30 border border-white/10 p-5 rounded-3xl text-center space-y-4">
            <input
              type="text"
              value={shredText}
              onChange={(e) => setShredText(e.target.value)}
              className="w-full bg-white/[0.07] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#8f9bff]"
              placeholder="Введите название документа..."
            />

            {/* Visual Shredder Chamber */}
            <div className="w-full h-44 bg-[#0b0d13] border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between p-2 shadow-inner">
              {/* Paper feed slot */}
              <div className="w-3/4 mx-auto h-2 bg-white/[0.05] backdrop-blur-xl border border-slate-600 rounded-full" />

              {/* Descending Paper */}
              {shredded && (
                <div
                  className="w-3/5 mx-auto bg-slate-100 text-slate-900 text-[10px] font-mono font-bold p-2 rounded shadow-lg transition-all duration-200"
                  style={{
                    transform: `translateY(${shredProgress * 0.8}px)`,
                    opacity: 1 - shredProgress / 100,
                  }}
                >
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-red-600" />
                    <span className="truncate">{shredText || 'Секретный_документ.doc'}</span>
                  </div>
                </div>
              )}

              {/* Shredder Blades Gear Animation */}
              <div className="w-full h-8 bg-white/[0.05] backdrop-blur-xl border-y border-white/10 flex items-center justify-around overflow-hidden">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <div
                    key={g}
                    className={`w-4 h-4 bg-slate-600 border border-slate-400 rounded-sm transform rotate-45 ${
                      shredded ? 'animate-spin [animation-duration:0.2s] bg-amber-500' : ''
                    }`}
                  />
                ))}
              </div>

              {/* Falling Shredded Paper Ribbons */}
              <div className="w-full h-16 flex justify-around items-end overflow-hidden pb-1">
                {shredded ? (
                  [...Array(12)].map((_, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-slate-200 rounded-sm animate-bounce"
                      style={{
                        height: `${Math.random() * 35 + 15}px`,
                        animationDuration: `${0.2 + (idx % 3) * 0.1}s`,
                      }}
                    />
                  ))
                ) : (
                  <span className="text-[10px] text-gray-500 font-mono self-center">
                    Корзина пуста. Готов к уничтожению.
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleShred}
              disabled={shredded}
              className="w-full py-3.5 bg-red-950 border border-red-800 text-red-300 font-extrabold text-xs uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-red-900 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>{shredded ? `УНИЧТОЖЕНИЕ (${shredProgress}%)...` : 'УНИЧТОЖИТЬ В ШРЕДЕРЕ'}</span>
            </button>
          </div>
        )}

      </div>
    </ToolWrapper>
  );
};

