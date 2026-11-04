import React, { useState, useEffect } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { TAXI_DRIVERS } from '../../data/mockData';
import {
  MapPin,
  Car,
  ChevronUp,
  RefreshCw,
  XCircle,
  Plus,
  Minus,
  Navigation,
  LocateFixed,
  Compass,
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface ToolProps {
  onClose: () => void;
}

const RANDOM_WAIT_TIMES = [
  '1 год, 7 месяцев',
  '4 года, 3 месяца, 12 дней',
  '8 лет, 11 месяцев',
  '13 лет, 2 месяца, 3 минуты',
  '2 года, 9 месяцев, 45 минут',
  '7 лет, 1 месяц',
];

export const TaxiTool: React.FC<ToolProps> = ({ onClose }) => {
  // Пробки: случайное число от 100 до 291 (обновляется при открытии)
  const [trafficJam] = useState(() => 100 + Math.floor(Math.random() * 192));
  const [status, setStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  const [driver, setDriver] = useState('');
  const [eta, setEta] = useState('');
  const [cardExpanded, setCardExpanded] = useState(true);
  const [waitCost, setWaitCost] = useState(0);
  const [distanceCost] = useState(120);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [carProgress, setCarProgress] = useState(0);

  // Animated taxi car progress along route when found
  useEffect(() => {
    if (status !== 'found') {
      setCarProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setCarProgress((prev) => (prev >= 1 ? 0 : prev + 0.015));
    }, 100);
    return () => clearInterval(interval);
  }, [status]);

  const handleOrderTaxi = () => {
    soundManager.playBeep(900, 0.08);
    setStatus('searching');
    const delay = Math.floor(Math.random() * 2000) + 1200;

    setTimeout(() => {
      soundManager.playBeep(1200, 0.15);
      setStatus('found');
      const randomDriver = TAXI_DRIVERS[Math.floor(Math.random() * TAXI_DRIVERS.length)];
      const randomEta = RANDOM_WAIT_TIMES[Math.floor(Math.random() * RANDOM_WAIT_TIMES.length)];
      setDriver(randomDriver);
      setEta(randomEta);
    }, delay);
  };

  const handleCancelTaxi = () => {
    soundManager.playBeep(500, 0.1);
    setStatus('idle');
    setDriver('');
    setEta('');
    setWaitCost(0);
  };

  const handleAddWaitCost = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playCoin();
    setWaitCost((prev) => prev + 10000);
  };

  return (
    <ToolWrapper title="Такси" onClose={onClose} headerColor="bg-[#111622] border-slate-800">
      <div className="relative flex-1 flex flex-col -m-4 overflow-hidden select-none bg-[#121722]">
        {/* Realistic Interactive City Map Viewport */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          <div
            className="w-full h-full relative transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Realistic Vector City Map */}
            <svg
              viewBox="0 0 1000 800"
              className="w-full h-full object-cover select-none"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Linear Gradients for Rivers & Expressways */}
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c2338" />
                  <stop offset="50%" stopColor="#0f2b45" />
                  <stop offset="100%" stopColor="#0c2033" />
                </linearGradient>

                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* 1. MAP BACKGROUND BASE */}
              <rect width="1000" height="800" fill="#131824" />

              {/* 2. PARK / GREEN SPACES */}
              {/* Central Park */}
              <polygon
                points="120,80 280,60 320,190 260,280 140,260 90,160"
                fill="#191c27"
                stroke="#222634"
                strokeWidth="1.5"
              />
              <text x="180" y="170" fill="#22c55e" opacity="0.6" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                Парк Победы
              </text>

              {/* Riverside Park */}
              <polygon
                points="420,400 580,360 620,480 510,540 400,470"
                fill="#191c27"
                stroke="#222634"
                strokeWidth="1.5"
              />
              <text x="470" y="460" fill="#22c55e" opacity="0.6" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                Набережный сквер
              </text>

              {/* North-East Park */}
              <polygon
                points="720,50 940,40 920,200 760,180"
                fill="#171923"
                stroke="#222634"
                strokeWidth="1.5"
              />

              {/* 3. WINDING RIVER WITH REALISTIC SHORELINE */}
              {/* River bank contour */}
              <path
                d="M-50,380 C 180,350 260,520 450,460 C 640,400 720,240 1050,220"
                fill="none"
                stroke="#183652"
                strokeWidth="74"
                strokeLinecap="round"
              />
              {/* River water */}
              <path
                d="M-50,380 C 180,350 260,520 450,460 C 640,400 720,240 1050,220"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="64"
                strokeLinecap="round"
              />
              <text x="120" y="440" fill="#38bdf8" opacity="0.4" fontSize="11" fontWeight="bold" letterSpacing="3">
                р. МОСКВА
              </text>

              {/* 4. CITY BLOCKS & 3D BUILDING FOOTPRINTS */}
              <g filter="url(#shadowFilter)">
                {/* Block Group 1 (Top Left) */}
                <rect x="50" y="320" width="70" height="45" rx="4" fill="#1e2638" stroke="#2b364e" strokeWidth="1" />
                <rect x="135" y="310" width="85" height="55" rx="4" fill="#20293d" stroke="#2d3a54" strokeWidth="1" />
                <text x="170" y="342" fill="#64748b" fontSize="10" fontFamily="sans-serif">14к1</text>

                <rect x="50" y="420" width="60" height="80" rx="4" fill="#1b2233" stroke="#28334a" strokeWidth="1" />
                <rect x="125" y="460" width="95" height="50" rx="4" fill="#1e273a" stroke="#2a364f" strokeWidth="1" />

                {/* Block Group 2 (Center Top) */}
                <rect x="350" y="70" width="110" height="70" rx="5" fill="#222c42" stroke="#313f5e" strokeWidth="1.5" />
                <text x="375" y="110" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ТЦ «Атриум»</text>

                <rect x="480" y="60" width="80" height="60" rx="4" fill="#1d2537" stroke="#2b374f" strokeWidth="1" />
                <rect x="480" y="135" width="80" height="75" rx="4" fill="#1e273a" stroke="#2b374f" strokeWidth="1" />
                <rect x="370" y="160" width="90" height="50" rx="4" fill="#1b2334" stroke="#28344c" strokeWidth="1" />

                {/* Block Group 3 (Center - Pickup Neighborhood) */}
                <rect x="360" y="240" width="120" height="90" rx="5" fill="#242e44" stroke="#384768" strokeWidth="1.5" />
                <text x="390" y="290" fill="#cbd5e1" fontSize="12" fontWeight="bold" fontFamily="sans-serif">ул. Ленина, 42</text>
                <text x="410" y="308" fill="#eab308" fontSize="10" fontWeight="bold" fontFamily="sans-serif">★ Вы здесь</text>

                <rect x="505" y="245" width="90" height="40" rx="4" fill="#1c2436" stroke="#2a364f" strokeWidth="1" />
                <rect x="505" y="295" width="90" height="40" rx="4" fill="#1d2639" stroke="#2c3852" strokeWidth="1" />

                {/* Block Group 4 (Right Side) */}
                <rect x="680" y="260" width="130" height="85" rx="5" fill="#202a3f" stroke="#2f3d5c" strokeWidth="1" />
                <text x="710" y="305" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">БЦ «Плаза»</text>

                <rect x="830" y="250" width="120" height="60" rx="4" fill="#1d2537" stroke="#2a364e" strokeWidth="1" />
                <rect x="830" y="325" width="120" height="70" rx="4" fill="#1e273b" stroke="#2c3852" strokeWidth="1" />

                {/* Block Group 5 (Bottom Right) */}
                <rect x="680" y="470" width="100" height="80" rx="4" fill="#1c2436" stroke="#29354d" strokeWidth="1" />
                <rect x="800" y="470" width="140" height="110" rx="5" fill="#212b40" stroke="#303f5e" strokeWidth="1" />
                <text x="830" y="530" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">ЖК «Ривер Парк»</text>

                <rect x="680" y="570" width="100" height="90" rx="4" fill="#1a2233" stroke="#28344b" strokeWidth="1" />
                <rect x="800" y="600" width="140" height="70" rx="4" fill="#1e273a" stroke="#2b374f" strokeWidth="1" />

                {/* Block Group 6 (Bottom Center / Left) */}
                <rect x="230" y="580" width="140" height="90" rx="5" fill="#20293d" stroke="#2f3c59" strokeWidth="1" />
                <rect x="390" y="590" width="120" height="80" rx="4" fill="#1c2538" stroke="#2a3750" strokeWidth="1" />
                <rect x="60" y="590" width="145" height="85" rx="4" fill="#1b2335" stroke="#28354e" strokeWidth="1" />
              </g>

              {/* 5. SECONDARY ROADS & STREETS */}
              <g stroke="#263147" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 0,160 L 350,160 L 350,360 L 0,360" />
                <path d="M 230,0 L 230,800" />
                <path d="M 640,0 L 640,800" />
                <path d="M 350,360 L 1000,360" />
                <path d="M 350,560 L 1000,560" />
                <path d="M 780,220 L 780,800" />
                <path d="M 490,0 L 490,360" />
                <path d="M 490,560 L 490,800" />
              </g>

              <g stroke="#32405d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 0,160 L 350,160 L 350,360 L 0,360" />
                <path d="M 230,0 L 230,800" />
                <path d="M 640,0 L 640,800" />
                <path d="M 350,360 L 1000,360" />
                <path d="M 350,560 L 1000,560" />
                <path d="M 780,220 L 780,800" />
                <path d="M 490,0 L 490,360" />
                <path d="M 490,560 L 490,800" />
              </g>

              {/* 6. PRIMARY HIGHWAY & BRIDGES (MAIN ARTERIAL ROADS) */}
              {/* Outer Ring Expressway */}
              <path
                d="M-50,720 Q 400,680 640,480 T 1050,100"
                stroke="#1e273a"
                strokeWidth="28"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M-50,720 Q 400,680 640,480 T 1050,100"
                stroke="#3b4866"
                strokeWidth="22"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M-50,720 Q 400,680 640,480 T 1050,100"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="14 10"
                fill="none"
              />

              {/* Main Prospect Avenue */}
              <path
                d="M 350,-20 L 350,820"
                stroke="#1e273a"
                strokeWidth="32"
                fill="none"
              />
              <path
                d="M 350,-20 L 350,820"
                stroke="#3f4d6d"
                strokeWidth="26"
                fill="none"
              />
              <path
                d="M 350,-20 L 350,820"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="16 12"
                fill="none"
                opacity="0.8"
              />

              {/* Bridge over River 1 */}
              <rect x="330" y="445" width="40" height="60" rx="3" fill="#475569" stroke="#64748b" strokeWidth="2" />
              <line x1="350" y1="445" x2="350" y2="505" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="10 8" />

              {/* Bridge over River 2 */}
              <rect x="622" y="325" width="36" height="50" rx="3" fill="#475569" stroke="#64748b" strokeWidth="2" transform="rotate(-25 640 350)" />

              {/* 7. STREET NAMES & POIs */}
              <text x="358" y="50" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif" transform="rotate(90 358 50)">
                ПРОСПЕКТ МИРА
              </text>
              <text x="358" y="660" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif" transform="rotate(90 358 660)">
                ПРОСПЕКТ МИРА
              </text>
              <text x="700" y="352" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                ул. Тверская
              </text>
              <text x="70" y="152" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                ул. Арбат
              </text>
              <text x="700" y="552" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                Садовая ул.
              </text>

              {/* Metro Station Badges */}
              <g transform="translate(325, 145)">
                <circle cx="10" cy="10" r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                <text x="6" y="14" fill="#ffffff" fontSize="11" fontWeight="black">М</text>
                <text x="26" y="14" fill="#f87171" fontSize="10" fontWeight="bold">м. Проспект Мира</text>
              </g>

              <g transform="translate(615, 235)">
                <circle cx="10" cy="10" r="10" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
                <text x="6" y="14" fill="#ffffff" fontSize="11" fontWeight="black">М</text>
                <text x="26" y="14" fill="#4ade80" fontSize="10" fontWeight="bold">м. Тверская</text>
              </g>

              {/* 8. NEARBY IDLE TAXIS (Yandex Yellow Cars on streets) */}
              {/* Taxi 1 (Waiting at top corner) */}
              <g transform="translate(222, 110) rotate(15)">
                <rect x="-8" y="-14" width="16" height="28" rx="4" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#1e293b" />
                <rect x="-4" y="-2" width="8" height="4" fill="#ffffff" />
                <text x="-3" y="1" fill="#000000" fontSize="4" fontWeight="black">🚕</text>
              </g>

              {/* Taxi 2 (Near river bank) */}
              <g transform="translate(772, 420) rotate(-10)">
                <rect x="-8" y="-14" width="16" height="28" rx="4" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#1e293b" />
                <rect x="-4" y="-2" width="8" height="4" fill="#ffffff" />
              </g>

              {/* Taxi 3 (East side) */}
              <g transform="translate(632, 620) rotate(180)">
                <rect x="-8" y="-14" width="16" height="28" rx="4" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#1e293b" />
                <rect x="-4" y="-2" width="8" height="4" fill="#ffffff" />
              </g>

              {/* 9. ACTIVE TAXI ROUTE & ANIMATED CAB (When Found / Searching) */}
              {(status === 'found' || status === 'searching') && (
                <g>
                  {/* Route Polyline Glow */}
                  <path
                    d="M 640,110 L 640,360 L 350,360 L 350,280"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                  />
                  {/* Glowing Animated Fast Route Path */}
                  <path
                    d="M 640,110 L 640,360 L 350,360 L 350,280"
                    fill="none"
                    stroke="url(#routeGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="12 8"
                    className="animate-pulse"
                  />

                  {/* Assigned Taxi Car driving along the route */}
                  {status === 'found' && (
                    <g
                      transform={`translate(${
                        carProgress < 0.45
                          ? 640
                          : carProgress < 0.85
                          ? 640 - ((carProgress - 0.45) / 0.4) * 290
                          : 350
                      }, ${
                        carProgress < 0.45
                          ? 110 + (carProgress / 0.45) * 250
                          : carProgress < 0.85
                          ? 360
                          : 360 - ((carProgress - 0.85) / 0.15) * 80
                      }) rotate(${
                        carProgress < 0.45 ? 180 : carProgress < 0.85 ? 270 : 0
                      })`}
                    >
                      {/* Car Headlights Beam */}
                      <polygon points="-12,-20 12,-20 35,-70 -35,-70" fill="#fef08a" opacity="0.35" />
                      {/* Car Body */}
                      <rect x="-11" y="-18" width="22" height="36" rx="5" fill="#eab308" stroke="#18181b" strokeWidth="2" filter="url(#shadowFilter)" />
                      {/* Windshields */}
                      <rect x="-8" y="-10" width="16" height="8" rx="2" fill="#0f172a" />
                      <rect x="-8" y="5" width="16" height="6" rx="2" fill="#0f172a" />
                      {/* Taxi Roof Sign */}
                      <rect x="-6" y="-2" width="12" height="5" rx="1.5" fill="#ffffff" stroke="#eab308" strokeWidth="1" />
                      <text x="-4" y="2" fill="#000000" fontSize="3.5" fontWeight="black">TAXI</text>
                    </g>
                  )}
                </g>
              )}

              {/* 10. USER PICKUP LOCATION PIN (ул. Ленина, 42) */}
              <g transform="translate(350, 280)">
                {/* Radar pulse ripples */}
                <circle cx="0" cy="0" r="40" fill="#38bdf8" opacity="0.15" className="animate-ping" />
                <circle cx="0" cy="0" r="24" fill="#0284c7" opacity="0.25" />
                <circle cx="0" cy="0" r="12" fill="#0369a1" opacity="0.5" />

                {/* Pickup Address Callout Bubble */}
                <g transform="translate(-75, -60)" filter="url(#shadowFilter)">
                  <rect x="0" y="0" width="150" height="32" rx="16" fill="#090d16" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="5" fill="#f59e0b" />
                  <text x="28" y="16" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif" dominantBaseline="middle">
                    ул. Ленина, д. 42
                  </text>
                  <polygon points="75,32 70,38 80,38" fill="#f59e0b" />
                </g>

                {/* Pin Circle Marker */}
                <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" filter="url(#shadowFilter)" />
                <circle cx="0" cy="0" r="4" fill="#000000" />
              </g>
            </svg>
          </div>

          {/* MAP INTERACTIVE CONTROLS OVERLAY */}
          {/* Top Right Info & Controls: Compass & Traffic */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {/* Traffic Widget */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200">Пробки: {trafficJam} {trafficJam % 10 === 1 && trafficJam % 100 !== 11 ? 'балл' : [2, 3, 4].includes(trafficJam % 10) && ![12, 13, 14].includes(trafficJam % 100) ? 'балла' : 'баллов'}</span>
            </div>

            {/* Compass */}
            <button
              onClick={() => setZoomLevel(1)}
              title="Север"
              className="w-10 h-10 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center text-slate-200 cursor-pointer transition-all active:scale-90 ml-auto"
            >
              <Compass className="w-5 h-5 text-red-400" />
            </button>
          </div>

          {/* Right Side Zoom Buttons */}
          <div className="absolute right-4 top-28 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
              title="Приблизить"
              className="w-10 h-10 bg-slate-900/90 hover:bg-slate-800 active:bg-amber-400 active:text-black backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center text-white cursor-pointer transition-all active:scale-90"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, Number((z - 0.15).toFixed(2))))}
              title="Отдалить"
              className="w-10 h-10 bg-slate-900/90 hover:bg-slate-800 active:bg-amber-400 active:text-black backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center text-white cursor-pointer transition-all active:scale-90"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              title="Моё местоположение"
              className="w-10 h-10 bg-slate-900/90 hover:bg-slate-800 active:bg-amber-400 active:text-black backdrop-blur-md border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center text-amber-400 cursor-pointer transition-all active:scale-90"
            >
              <LocateFixed className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pull-up Bottom Taxi Order Sheet */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-xl border-t-2 border-slate-700/80 rounded-t-3xl p-5 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 z-20 flex flex-col gap-3 ${
            cardExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-74px)]'
          }`}
        >
          {/* Handle bar toggle */}
          <button
            onClick={() => setCardExpanded(!cardExpanded)}
            className="w-full flex flex-col items-center justify-center cursor-pointer py-0.5 text-slate-400 hover:text-white"
          >
            <div className="w-10 h-1 bg-slate-600 rounded-full mb-1" />
            <ChevronUp
              className={`w-4 h-4 transition-transform ${cardExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Tariff Info Header */}
          <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Выбранный тариф:</span>
              <span className="text-sm font-black text-amber-400 uppercase tracking-wide">ЭКОНОМ</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Цена за расстояние:</span>
              <span className="text-xs font-black text-emerald-400 font-mono">{distanceCost} ₽/км</span>
            </div>
          </div>

          {/* Order Action Button */}
          {status !== 'found' && (
            <button
              onClick={handleOrderTaxi}
              disabled={status === 'searching'}
              className={`w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                status === 'idle'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/40 active:scale-95'
                  : 'bg-slate-800 text-amber-400 animate-pulse border border-amber-400'
              }`}
            >
              <Car className="w-5 h-5" />
              <span>
                {status === 'idle' && 'Заказать такси (Эконом)'}
                {status === 'searching' && 'Поиск машины...'}
              </span>
            </button>
          )}

          {/* Driver & ETA Details */}
          {status === 'found' && (
            <div className="flex flex-col gap-2.5 animate-in fade-in zoom-in duration-300">
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Водитель (Эконом):</span>
                  <span className="text-sm font-black text-amber-400 uppercase font-mono">
                    {driver}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Время ожидания:</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">{eta}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Платное ожидание:</span>
                  <span className="text-sm font-black text-red-400 font-mono">+{waitCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              <button
                onClick={handleAddWaitCost}
                className="w-full py-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-600/50 font-bold rounded-xl text-xs uppercase cursor-pointer transition-all active:scale-95"
              >
                Платное ожидание (+10 000 ₽)
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleOrderTaxi}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Другое такси</span>
                </button>
                <button
                  onClick={handleCancelTaxi}
                  className="py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Отменить такси</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
};
