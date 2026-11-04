import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ToolWrapper } from './ToolWrapper';
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
  Plus,
  Trash2,
  Check,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../../utils/soundEffects';

interface TrigonometricCircleToolProps {
  onClose: () => void;
}

interface SavedPoint {
  id: string;
  name: string;
  angleDeg: number;
  color: string;
}

// Canonical Special Angles on the Unit Circle
const SPECIAL_ANGLES = [
  { deg: 0, radText: '0', sinExact: '0', cosExact: '1', tanExact: '0' },
  { deg: 30, radText: 'π/6', sinExact: '1/2', cosExact: '√3/2', tanExact: '√3/3' },
  { deg: 45, radText: 'π/4', sinExact: '√2/2', cosExact: '√2/2', tanExact: '1' },
  { deg: 60, radText: 'π/3', sinExact: '√3/2', cosExact: '1/2', tanExact: '√3' },
  { deg: 90, radText: 'π/2', sinExact: '1', cosExact: '0', tanExact: '—' },
  { deg: 120, radText: '2π/3', sinExact: '√3/2', cosExact: '-1/2', tanExact: '-√3' },
  { deg: 135, radText: '3π/4', sinExact: '√2/2', cosExact: '-√2/2', tanExact: '-1' },
  { deg: 150, radText: '5π/6', sinExact: '1/2', cosExact: '-√3/2', tanExact: '-√3/3' },
  { deg: 180, radText: 'π', sinExact: '0', cosExact: '-1', tanExact: '0' },
  { deg: 210, radText: '7π/6', sinExact: '-1/2', cosExact: '-√3/2', tanExact: '√3/3' },
  { deg: 225, radText: '5π/4', sinExact: '-√2/2', cosExact: '-√2/2', tanExact: '1' },
  { deg: 240, radText: '4π/3', sinExact: '-√3/2', cosExact: '-1/2', tanExact: '√3' },
  { deg: 270, radText: '3π/2', sinExact: '-1', cosExact: '0', tanExact: '—' },
  { deg: 300, radText: '5π/3', sinExact: '-√3/2', cosExact: '1/2', tanExact: '-√3' },
  { deg: 315, radText: '7π/4', sinExact: '-√2/2', cosExact: '√2/2', tanExact: '-1' },
  { deg: 330, radText: '11π/6', sinExact: '-1/2', cosExact: '√3/2', tanExact: '-√3/3' },
  { deg: 360, radText: '2π', sinExact: '0', cosExact: '1', tanExact: '0' },
];

const POINT_COLORS = ['#8f9bff', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7', '#fb7185'];

export const TrigonometricCircleTool: React.FC<TrigonometricCircleToolProps> = ({ onClose }) => {
  // Current angle in degrees (0 - 360)
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [inputDegStr, setInputDegStr] = useState<string>('45');
  const [inputRadStr, setInputRadStr] = useState<string>('π/4');
  
  // Animation / Rotation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // degrees per frame
  
  // Display Toggles
  const [showSine, setShowSine] = useState<boolean>(true);
  const [showCosine, setShowCosine] = useState<boolean>(true);
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [showCotangent, setShowCotangent] = useState<boolean>(true);
  const [showTriangle, setShowTriangle] = useState<boolean>(true);
  const [showAngleArc, setShowAngleArc] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'calculator' | 'points' | 'table' | 'formulas'>('calculator');

  // Custom User Saved Points
  const [savedPoints, setSavedPoints] = useState<SavedPoint[]>([
    { id: 'p-1', name: 'Точка A (30°)', angleDeg: 30, color: '#38bdf8' },
    { id: 'p-2', name: 'Точка B (135°)', angleDeg: 135, color: '#f59e0b' },
    { id: 'p-3', name: 'Точка C (240°)', angleDeg: 240, color: '#ec4899' },
  ]);
  const [newPointName, setNewPointName] = useState<string>('');

  // SVG interaction refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Derived radian angle
  const angleRad = useMemo(() => (angleDeg * Math.PI) / 180, [angleDeg]);

  // Coordinate values on Unit Circle
  const cosVal = useMemo(() => Math.cos(angleRad), [angleRad]);
  const sinVal = useMemo(() => Math.sin(angleRad), [angleRad]);
  
  // Tangent and Cotangent
  const tanVal = useMemo(() => {
    const absCos = Math.abs(cosVal);
    if (absCos < 1e-6) return null; // undefined at 90, 270
    return Math.tan(angleRad);
  }, [angleRad, cosVal]);

  const cotVal = useMemo(() => {
    const absSin = Math.abs(sinVal);
    if (absSin < 1e-6) return null; // undefined at 0, 180, 360
    return 1 / Math.tan(angleRad);
  }, [angleRad, sinVal]);

  const secVal = useMemo(() => {
    if (Math.abs(cosVal) < 1e-6) return null;
    return 1 / cosVal;
  }, [cosVal]);

  const cscVal = useMemo(() => {
    if (Math.abs(sinVal) < 1e-6) return null;
    return 1 / sinVal;
  }, [sinVal]);

  // Quadrant determination
  const quadrant = useMemo(() => {
    const norm = ((angleDeg % 360) + 360) % 360;
    if (norm === 0 || norm === 360) return 'Ось X+ (0°, 2π)';
    if (norm === 90) return 'Ось Y+ (90°, π/2)';
    if (norm === 180) return 'Ось X- (180°, π)';
    if (norm === 270) return 'Ось Y- (270°, 3π/2)';
    if (norm > 0 && norm < 90) return 'I четверть (0° - 90°)';
    if (norm > 90 && norm < 180) return 'II четверть (90° - 180°)';
    if (norm > 180 && norm < 270) return 'III четверть (180° - 270°)';
    return 'IV четверть (270° - 360°)';
  }, [angleDeg]);

  // Reference angle
  const referenceAngle = useMemo(() => {
    const norm = ((angleDeg % 360) + 360) % 360;
    if (norm <= 90) return norm;
    if (norm <= 180) return 180 - norm;
    if (norm <= 270) return norm - 180;
    return 360 - norm;
  }, [angleDeg]);

  // Approximate exact fraction text for standard angles
  const exactSpecial = useMemo(() => {
    const norm = Math.round(((angleDeg % 360) + 360) % 360);
    return SPECIAL_ANGLES.find((sa) => sa.deg === norm) || null;
  }, [angleDeg]);

  // Exact or formatted radian string
  const formattedRadian = useMemo(() => {
    if (exactSpecial) return exactSpecial.radText;
    return (angleRad / Math.PI).toFixed(3) + ' π (' + angleRad.toFixed(4) + ' рад)';
  }, [exactSpecial, angleRad]);

  // Update angle with wrapping [0, 360)
  const setNormalizedAngle = useCallback((deg: number) => {
    const norm = ((deg % 360) + 360) % 360;
    const rounded = Math.round(norm * 10) / 10;
    setAngleDeg(rounded);
    setInputDegStr(rounded.toString());
    const special = SPECIAL_ANGLES.find((sa) => Math.abs(sa.deg - rounded) < 0.1);
    if (special) {
      setInputRadStr(special.radText);
    } else {
      setInputRadStr((((rounded * Math.PI) / 180) / Math.PI).toFixed(3) + 'π');
    }
  }, []);

  // Dragging / Clicking Angle on SVG
  const calculateAngleFromEvent = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = centerY - clientY; // invert Y for Cartesian

    let rad = Math.atan2(dy, dx);
    if (rad < 0) rad += 2 * Math.PI;

    const deg = (rad * 180) / Math.PI;
    setNormalizedAngle(deg);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isDraggingRef.current = true;
    calculateAngleFromEvent(e);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    calculateAngleFromEvent(e);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Animation Loop for Auto-play rotation
  useEffect(() => {
    if (isPlaying) {
      const step = () => {
        setAngleDeg((prev) => {
          const next = (prev + playSpeed * 0.8) % 360;
          setInputDegStr((Math.round(next * 10) / 10).toString());
          return next;
        });
        animFrameRef.current = requestAnimationFrame(step);
      };
      animFrameRef.current = requestAnimationFrame(step);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playSpeed]);

  // Handle direct degree input submit
  const handleDegreeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(inputDegStr);
    if (!isNaN(num)) {
      triggerHaptic('tap');
      soundManager.playBeep(900, 0.05);
      setNormalizedAngle(num);
    }
  };

  // Handle direct radian input parse
  const handleRadianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = inputRadStr.trim().toLowerCase().replace(' ', '');
    try {
      let rad = 0;
      if (text.includes('pi') || text.includes('π')) {
        let replaced = text.replace(/pi|π/g, `${Math.PI}`);
        // evaluate simple fractions like 2*3.1415/3
        // safe math eval for expressions with numbers, *, /, +, -
        if (/^[\d.\/*+-]+$/.test(replaced)) {
          // eslint-disable-next-line no-eval
          rad = Function(`"use strict"; return (${replaced});`)();
        }
      } else {
        rad = parseFloat(text);
      }
      if (!isNaN(rad)) {
        triggerHaptic('tap');
        soundManager.playBeep(900, 0.05);
        const deg = (rad * 180) / Math.PI;
        setNormalizedAngle(deg);
      }
    } catch {
      // fallback
    }
  };

  // Add current point to saved points
  const handleAddSavedPoint = () => {
    triggerHaptic('success');
    soundManager.playBeep(1100, 0.08);
    const color = POINT_COLORS[savedPoints.length % POINT_COLORS.length];
    const name = newPointName.trim() || `Точка ${String.fromCharCode(65 + savedPoints.length)} (${Math.round(angleDeg)}°)`;
    setSavedPoints((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        name,
        angleDeg: Math.round(angleDeg * 10) / 10,
        color,
      },
    ]);
    setNewPointName('');
  };

  const handleDeletePoint = (id: string) => {
    triggerHaptic('tap');
    soundManager.playBeep(700, 0.05);
    setSavedPoints((prev) => prev.filter((p) => p.id !== id));
  };

  // SVG coordinate transformation math
  // Center is (200, 200), Radius R = 130px
  const SVG_CENTER = 200;
  const SVG_RADIUS = 130;

  const pointX = SVG_CENTER + SVG_RADIUS * cosVal;
  const pointY = SVG_CENTER - SVG_RADIUS * sinVal; // SVG inverted Y

  const cosX = pointX;
  const cosY = SVG_CENTER;

  const sinX = SVG_CENTER;
  const sinY = pointY;

  // Arc path for angle
  const arcRadius = 35;
  const arcStartX = SVG_CENTER + arcRadius;
  const arcStartY = SVG_CENTER;
  const arcEndX = SVG_CENTER + arcRadius * Math.cos(angleRad);
  const arcEndY = SVG_CENTER - arcRadius * Math.sin(angleRad);
  const largeArcFlag = angleDeg > 180 ? 1 : 0;
  const arcPath = `M ${SVG_CENTER} ${SVG_CENTER} L ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY} Z`;

  // Tangent point on line x = 1 (SVG: x = SVG_CENTER + SVG_RADIUS)
  const tangentLineX = SVG_CENTER + SVG_RADIUS;
  const tangentPointY = tanVal !== null ? SVG_CENTER - SVG_RADIUS * tanVal : null;

  // Cotangent point on line y = 1 (SVG: y = SVG_CENTER - SVG_RADIUS)
  const cotangentLineY = SVG_CENTER - SVG_RADIUS;
  const cotangentPointX = cotVal !== null ? SVG_CENTER + SVG_RADIUS * cotVal : null;

  return (
    <ToolWrapper
      title="Тригонометрическая окружность"
      onClose={onClose}
      headerColor="bg-[#0e1119] border-[#8f9bff]/30"
    >
      <div
        className="flex-1 flex flex-col lg:flex-row gap-5 max-w-7xl mx-auto w-full font-sans text-xs text-white"
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        
        {/* LEFT COLUMN: INTERACTIVE SVG CANVAS & MAIN CONTROLS */}
        <div className="flex-1 flex flex-col items-center bg-[#12151e] border border-[#222840] hover:border-[#8f9bff]/50 rounded-3xl p-4 sm:p-6 shadow-[0_0_30px_rgba(0,0,0,0.6)] relative">
          
          {/* Top Quick Status Pill */}
          <div className="w-full flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#222840] text-[#8f9bff] font-mono font-bold text-xs border border-[#8f9bff]/40 shadow-sm">
                R = 1.0 (Единичная)
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#1c2030] text-gray-300 font-mono text-[11px] border border-[#333]">
                {quadrant}
              </span>
            </div>

            {/* Play / Pause Rotation Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setIsPlaying(!isPlaying);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                    : 'bg-[#1b1b1b] text-gray-300 hover:text-white border-[#333] hover:border-[#8f9bff]/50'
                }`}
                title={isPlaying ? 'Остановить вращение' : 'Вращать точку автоматически'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Пауза' : 'Вращение'}</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('tap');
                  setNormalizedAngle(0);
                }}
                className="p-1.5 rounded-xl bg-[#1b1b1b] hover:bg-[#212536] text-gray-400 hover:text-white border border-[#333] cursor-pointer"
                title="Сбросить угол на 0°"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG UNIT CIRCLE CANVAS */}
          <div className="w-full max-w-[420px] aspect-square relative select-none flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full h-full cursor-crosshair touch-none filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleMouseDown}
              onTouchMove={calculateAngleFromEvent}
            >
              {/* Background Grid Lines */}
              {showGrid && (
                <g stroke="#1e2232" strokeWidth="1">
                  {/* Grid squares */}
                  <line x1="70" y1="20" x2="70" y2="380" strokeDasharray="3 3" />
                  <line x1="135" y1="20" x2="135" y2="380" strokeDasharray="3 3" />
                  <line x1="265" y1="20" x2="265" y2="380" strokeDasharray="3 3" />
                  <line x1="330" y1="20" x2="330" y2="380" strokeDasharray="3 3" />
                  <line x1="20" y1="70" x2="380" y2="70" strokeDasharray="3 3" />
                  <line x1="20" y1="135" x2="380" y2="135" strokeDasharray="3 3" />
                  <line x1="20" y1="265" x2="380" y2="265" strokeDasharray="3 3" />
                  <line x1="20" y1="330" x2="380" y2="330" strokeDasharray="3 3" />
                </g>
              )}

              {/* Special Angles Radial Guide Lines (30°, 45°, 60°, etc.) */}
              {SPECIAL_ANGLES.map((sa) => {
                const r = (sa.deg * Math.PI) / 180;
                const gx = SVG_CENTER + SVG_RADIUS * Math.cos(r);
                const gy = SVG_CENTER - SVG_RADIUS * Math.sin(r);
                return (
                  <line
                    key={sa.deg}
                    x1={SVG_CENTER}
                    y1={SVG_CENTER}
                    x2={gx}
                    y2={gy}
                    stroke="#2a2a2a"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                );
              })}

              {/* Tangent Line x = 1 */}
              {showTangent && (
                <line
                  x1={tangentLineX}
                  y1="20"
                  x2={tangentLineX}
                  y2="380"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              )}

              {/* Cotangent Line y = 1 */}
              {showCotangent && (
                <line
                  x1="20"
                  y1={cotangentLineY}
                  x2="380"
                  y2={cotangentLineY}
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              )}
              {showCotangent && (
                <g>
                  <text x="22" y={cotangentLineY - 6} fill="#a855f7" fontSize="10" fontWeight="bold">ось котангенсов (ctg)</text>
                  {[-2, -1, 0, 1, 2].map((k) => (
                    <g key={`ctg-tick-${k}`}>
                      <line x1={SVG_CENTER + SVG_RADIUS * k} y1={cotangentLineY - 4} x2={SVG_CENTER + SVG_RADIUS * k} y2={cotangentLineY + 4} stroke="#a855f7" strokeWidth="1.5" />
                      <text x={SVG_CENTER + SVG_RADIUS * k - 3} y={cotangentLineY + 16} fill="#a855f7" fontSize="9">{k}</text>
                    </g>
                  ))}
                </g>
              )}
              {showTangent && (
                <text x={tangentLineX + 4} y="34" fill="#f59e0b" fontSize="9" fontWeight="bold">ось tg</text>
              )}

              {/* Cotangent Projection Ray */}
              {showCotangent && cotangentPointX !== null && Math.abs(cotangentPointX - SVG_CENTER) < 300 && (
                <g>
                  <line
                    x1={SVG_CENTER}
                    y1={SVG_CENTER}
                    x2={cotangentPointX}
                    y2={cotangentLineY}
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={SVG_CENTER}
                    y1={cotangentLineY}
                    x2={cotangentPointX}
                    y2={cotangentLineY}
                    stroke="#a855f7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                  />
                  <circle cx={cotangentPointX} cy={cotangentLineY} r="4" fill="#a855f7" />
                </g>
              )}

              {/* Main Cartesian Axes X and Y */}
              <line x1="20" y1={SVG_CENTER} x2="380" y2={SVG_CENTER} stroke="#555555" strokeWidth="1.5" />
              <line x1={SVG_CENTER} y1="20" x2={SVG_CENTER} y2="380" stroke="#555555" strokeWidth="1.5" />

              {/* Axes Arrows */}
              <polygon points="385,200 375,195 375,205" fill="#888888" />
              <polygon points="200,15 195,25 205,25" fill="#888888" />

              {/* Axis Labels */}
              <text x="375" y="190" fill="#888888" fontSize="12" fontWeight="bold">X (cos)</text>
              <text x="210" y="25" fill="#888888" fontSize="12" fontWeight="bold">Y (sin)</text>
              <text x="188" y="215" fill="#666666" fontSize="10">0</text>
              <text x="330" y="215" fill="#888888" fontSize="10">1</text>
              <text x="65" y="215" fill="#888888" fontSize="10">-1</text>
              <text x="208" y="75" fill="#888888" fontSize="10">1</text>
              <text x="208" y="335" fill="#888888" fontSize="10">-1</text>

              {/* The Unit Circle Circle Geometry */}
              <circle
                cx={SVG_CENTER}
                cy={SVG_CENTER}
                r={SVG_RADIUS}
                fill="rgba(143, 155, 255, 0.02)"
                stroke="#8f9bff"
                strokeWidth="2.5"
                className="filter drop-shadow-[0_0_10px_rgba(143,155,255,0.3)]"
              />

              {/* Angle Arc Fill */}
              {showAngleArc && (
                <path d={arcPath} fill="rgba(143, 155, 255, 0.15)" stroke="#8f9bff" strokeWidth="1.5" />
              )}

              {/* Right Triangle Fill */}
              {showTriangle && (
                <polygon
                  points={`${SVG_CENTER},${SVG_CENTER} ${cosX},${SVG_CENTER} ${pointX},${pointY}`}
                  fill="rgba(56, 189, 248, 0.1)"
                  stroke="rgba(56, 189, 248, 0.4)"
                  strokeWidth="1"
                />
              )}

              {/* Cosine Projection (Blue Segment on X-Axis) */}
              {showCosine && (
                <g>
                  <line
                    x1={SVG_CENTER}
                    y1={SVG_CENTER}
                    x2={cosX}
                    y2={cosY}
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  />
                  {/* Dropdown vertical helper line to point */}
                  <line
                    x1={cosX}
                    y1={cosY}
                    x2={pointX}
                    y2={pointY}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </g>
              )}

              {/* Sine Projection (Green Segment on Y-Axis) */}
              {showSine && (
                <g>
                  <line
                    x1={SVG_CENTER}
                    y1={SVG_CENTER}
                    x2={sinX}
                    y2={sinY}
                    stroke="#8f9bff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_rgba(143,155,255,0.8)]"
                  />
                  {/* Horizontal helper line to point */}
                  <line
                    x1={sinX}
                    y1={sinY}
                    x2={pointX}
                    y2={pointY}
                    stroke="#8f9bff"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </g>
              )}

              {/* Tangent Projection Ray */}
              {showTangent && tangentPointY !== null && Math.abs(tangentPointY - SVG_CENTER) < 300 && (
                <g>
                  <line
                    x1={SVG_CENTER}
                    y1={SVG_CENTER}
                    x2={tangentLineX}
                    y2={tangentPointY}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1={tangentLineX}
                    y1={SVG_CENTER}
                    x2={tangentLineX}
                    y2={tangentPointY}
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]"
                  />
                  <circle cx={tangentLineX} cy={tangentPointY} r="4" fill="#f59e0b" />
                </g>
              )}

              {/* Saved Multi-Points */}
              {savedPoints.map((sp) => {
                const rad = (sp.angleDeg * Math.PI) / 180;
                const sx = SVG_CENTER + SVG_RADIUS * Math.cos(rad);
                const sy = SVG_CENTER - SVG_RADIUS * Math.sin(rad);
                return (
                  <g key={sp.id}>
                    <line
                      x1={SVG_CENTER}
                      y1={SVG_CENTER}
                      x2={sx}
                      y2={sy}
                      stroke={sp.color}
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                    <circle
                      cx={sx}
                      cy={sy}
                      r="6"
                      fill={sp.color}
                      stroke="#000"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => setNormalizedAngle(sp.angleDeg)}
                    />
                    <text
                      x={sx + (Math.cos(rad) > 0 ? 10 : -20)}
                      y={sy + (Math.sin(rad) > 0 ? -10 : 15)}
                      fill={sp.color}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {sp.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Radius Vector Line (Hypotenuse) */}
              <line
                x1={SVG_CENTER}
                y1={SVG_CENTER}
                x2={pointX}
                y2={pointY}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
              />

              {/* Center Origin Point */}
              <circle cx={SVG_CENTER} cy={SVG_CENTER} r="4" fill="#ffffff" />

              {/* Primary Draggable Angle Point */}
              <circle
                cx={pointX}
                cy={pointY}
                r="9"
                fill="#8f9bff"
                stroke="#ffffff"
                strokeWidth="3"
                className="filter drop-shadow-[0_0_15px_rgba(143,155,255,1)] cursor-grab active:cursor-grabbing"
              />

              {/* Angle Label beside point */}
              <text
                x={pointX + (cosVal >= 0 ? 14 : -35)}
                y={pointY + (sinVal >= 0 ? -12 : 20)}
                fill="#8f9bff"
                fontSize="12"
                fontWeight="black"
                className="filter drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]"
              >
                {Math.round(angleDeg)}°
              </text>
            </svg>
          </div>

          {/* Interactive Range Slider */}
          <div className="w-full mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
              <span>Угол θ (градусы):</span>
              <span className="text-[#8f9bff] font-bold text-sm">{angleDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="0.5"
              value={angleDeg}
              onChange={(e) => setNormalizedAngle(parseFloat(e.target.value))}
            />
          </div>

          {/* Manual Numeric Inputs for Degrees & Radians */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
            <form onSubmit={handleDegreeSubmit} className="flex items-center bg-[#161a26] border border-[#2d2d2d] rounded-2xl p-1.5 focus-within:border-[#8f9bff]">
              <span className="text-gray-400 font-bold px-2 text-[11px]">Градусы:</span>
              <input
                type="text"
                value={inputDegStr}
                onChange={(e) => setInputDegStr(e.target.value)}
                placeholder="45"
                className="w-full bg-transparent text-white font-mono text-xs outline-none px-1"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#8f9bff] text-black font-extrabold rounded-xl text-[10px] uppercase cursor-pointer"
              >
                OK
              </button>
            </form>

            <form onSubmit={handleRadianSubmit} className="flex items-center bg-[#161a26] border border-[#2d2d2d] rounded-2xl p-1.5 focus-within:border-[#8f9bff]">
              <span className="text-gray-400 font-bold px-2 text-[11px]">Радианы:</span>
              <input
                type="text"
                value={inputRadStr}
                onChange={(e) => setInputRadStr(e.target.value)}
                placeholder="π/4 или 0.785"
                className="w-full bg-transparent text-[#38bdf8] font-mono text-xs outline-none px-1"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#38bdf8] text-black font-extrabold rounded-xl text-[10px] uppercase cursor-pointer"
              >
                OK
              </button>
            </form>
          </div>

          {/* Visual Layer Toggles */}
          <div className="w-full flex items-center justify-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-[#1e2232]">
            <button
              onClick={() => setShowSine(!showSine)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showSine ? 'bg-[#8f9bff]/20 text-[#8f9bff] border-[#8f9bff]/60' : 'bg-[#161a26] text-gray-500 border-[#282c3d]'
              }`}
            >
              Sin (Y)
            </button>
            <button
              onClick={() => setShowCosine(!showCosine)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showCosine ? 'bg-sky-400/20 text-sky-400 border-sky-400/60' : 'bg-[#161a26] text-gray-500 border-[#282c3d]'
              }`}
            >
              Cos (X)
            </button>
            <button
              onClick={() => setShowTangent(!showTangent)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showTangent ? 'bg-amber-400/20 text-amber-400 border-amber-400/60' : 'bg-[#161a26] text-gray-500 border-[#282c3d]'
              }`}
            >
              Tan (Tg)
            </button>
            <button
              onClick={() => setShowCotangent(!showCotangent)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showCotangent ? 'bg-fuchsia-400/20 text-fuchsia-400 border-fuchsia-400/60' : 'bg-[#161a26] text-gray-500 border-[#282c3d]'
              }`}
            >
              Cot (Ctg)
            </button>
            <button
              onClick={() => setShowTriangle(!showTriangle)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showTriangle ? 'bg-purple-400/20 text-purple-400 border-purple-400/60' : 'bg-[#161a26] text-gray-500 border-[#282c3d]'
              }`}
            >
              Треугольник
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                showGrid ? 'bg-gray-200/20 text-gray-200 border-gray-400' : 'bg-[#161a26] text-gray-500 border-[#282c3d]'
              }`}
            >
              Сетка
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: CALCULATION RESULTS, PRESETS, POINTS, & FORMULAS */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Navigation Sub-tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#12151e] border border-[#222840] rounded-2xl">
            {[
              { id: 'calculator', label: 'Значения', icon: Compass },
              { id: 'points', label: 'Точки', icon: Layers },
              { id: 'table', label: 'Таблица', icon: BookOpen },
              { id: 'formulas', label: 'Формулы', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerHaptic('tap');
                    setActiveTab(tab.id as any);
                  }}
                  className={`py-2 px-1 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8f9bff] text-black shadow-[0_0_12px_rgba(143,155,255,0.3)] font-extrabold'
                      : 'text-gray-400 hover:text-white hover:bg-[#1c2030]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: REAL-TIME VALUE READOUTS */}
          {activeTab === 'calculator' && (
            <div className="space-y-3.5 flex-1 flex flex-col">
              
              {/* Primary Coordinates Box */}
              <div className="bg-[#12151e] border border-[#222840] rounded-2xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Координаты точки (X, Y):</span>
                  <span className="font-mono font-black text-sm text-[#8f9bff]">
                    ({cosVal.toFixed(4)}, {sinVal.toFixed(4)})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#161a26] border border-[#2d2d2d]">
                    <span className="text-gray-400 block text-[10px]">Угол в градусах:</span>
                    <span className="font-mono font-bold text-white text-sm">{angleDeg.toFixed(1)}°</span>
                    <span className="text-gray-500 block text-[9px] mt-0.5">Опорный: {referenceAngle.toFixed(1)}°</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#161a26] border border-[#2d2d2d]">
                    <span className="text-gray-400 block text-[10px]">Угол в радианах:</span>
                    <span className="font-mono font-bold text-[#38bdf8] text-sm truncate block">
                      {formattedRadian}
                    </span>
                    <span className="text-gray-500 block text-[9px] mt-0.5">({angleRad.toFixed(4)} rad)</span>
                  </div>
                </div>
              </div>

              {/* 6 Trigonometric Functions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                
                {/* SIN */}
                <div className="p-3 bg-[#12151e] border border-[#8f9bff]/40 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span className="text-[#8f9bff]">sin(θ)</span>
                    <span>Y</span>
                  </div>
                  <div className="font-mono font-black text-base text-white mt-1">
                    {sinVal.toFixed(4)}
                  </div>
                  {exactSpecial && (
                    <div className="text-[10px] text-[#8f9bff] font-mono mt-0.5">
                      = {exactSpecial.sinExact}
                    </div>
                  )}
                </div>

                {/* COS */}
                <div className="p-3 bg-[#12151e] border border-sky-400/40 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span className="text-sky-400">cos(θ)</span>
                    <span>X</span>
                  </div>
                  <div className="font-mono font-black text-base text-white mt-1">
                    {cosVal.toFixed(4)}
                  </div>
                  {exactSpecial && (
                    <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                      = {exactSpecial.cosExact}
                    </div>
                  )}
                </div>

                {/* TAN */}
                <div className="p-3 bg-[#12151e] border border-amber-400/40 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span className="text-amber-400">tan(θ) / tg</span>
                    <span>Y / X</span>
                  </div>
                  <div className="font-mono font-black text-base text-white mt-1">
                    {tanVal !== null ? tanVal.toFixed(4) : 'Не опред.'}
                  </div>
                  {exactSpecial && (
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                      = {exactSpecial.tanExact}
                    </div>
                  )}
                </div>

                {/* COT */}
                <div className="p-3 bg-[#12151e] border border-purple-400/40 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span className="text-purple-400">cot(θ) / ctg</span>
                    <span>X / Y</span>
                  </div>
                  <div className="font-mono font-black text-base text-white mt-1">
                    {cotVal !== null ? cotVal.toFixed(4) : 'Не опред.'}
                  </div>
                </div>

                {/* SEC */}
                <div className="p-3 bg-[#12151e] border border-[#282c3d] rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span>sec(θ)</span>
                    <span>1 / X</span>
                  </div>
                  <div className="font-mono font-black text-base text-white mt-1">
                    {secVal !== null ? secVal.toFixed(4) : '∞'}
                  </div>
                </div>

                {/* CSC */}
                <div className="p-3 bg-[#12151e] border border-[#282c3d] rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                    <span>csc(θ)</span>
                    <span>1 / Y</span>
                  </div>
                  <div className="font-mono font-black text-base text-white mt-1">
                    {cscVal !== null ? cscVal.toFixed(4) : '∞'}
                  </div>
                </div>

              </div>

              {/* 16 Classic Standard Angles Quick Preset Bar */}
              <div className="bg-[#12151e] border border-[#222840] rounded-2xl p-3.5 space-y-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                  Табличные углы (Быстрый выбор):
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                  {SPECIAL_ANGLES.map((sa) => {
                    const isCurrent = Math.abs(sa.deg - Math.round(angleDeg)) < 1;
                    return (
                      <button
                        key={sa.deg}
                        onClick={() => {
                          triggerHaptic('tap');
                          soundManager.playBeep(1000, 0.04);
                          setNormalizedAngle(sa.deg);
                        }}
                        className={`py-1.5 px-1 rounded-xl text-center border font-mono transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#8f9bff] text-black border-[#8f9bff] font-black shadow-[0_0_10px_rgba(143,155,255,0.4)]'
                            : 'bg-[#161a26] text-gray-300 hover:text-white border-[#2c2c2c] hover:border-[#8f9bff]/40'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{sa.deg}°</div>
                        <div className="text-[9px] opacity-70">{sa.radText}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SAVED CUSTOM POINTS ON CIRCLE */}
          {activeTab === 'points' && (
            <div className="bg-[#12151e] border border-[#222840] rounded-2xl p-4 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
                    Пользовательские точки на окружности
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Сохраняйте произвольные углы и точки для сравнения и решения задач.
                  </p>
                </div>
              </div>

              {/* Add Current Angle Form */}
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#161a26] border border-[#2d2d2d]">
                <input
                  type="text"
                  value={newPointName}
                  onChange={(e) => setNewPointName(e.target.value)}
                  placeholder={`Название (текущий: ${Math.round(angleDeg)}°)`}
                  className="flex-1 bg-transparent text-white text-xs outline-none px-2 placeholder-gray-500"
                />
                <button
                  onClick={handleAddSavedPoint}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#8f9bff] hover:bg-[#b8c0ff] text-black font-extrabold rounded-xl text-xs cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить</span>
                </button>
              </div>

              {/* Saved Points List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {savedPoints.map((sp) => {
                  const rad = (sp.angleDeg * Math.PI) / 180;
                  const cosP = Math.cos(rad);
                  const sinP = Math.sin(rad);
                  const isSelected = Math.abs(sp.angleDeg - angleDeg) < 0.5;

                  return (
                    <div
                      key={sp.id}
                      onClick={() => setNormalizedAngle(sp.angleDeg)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e1e1e] border-[#8f9bff] ring-1 ring-[#8f9bff]/50 shadow-[0_0_15px_rgba(143,155,255,0.15)]'
                          : 'bg-[#161a26] border-[#262a3b] hover:border-[#444]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-black shrink-0"
                          style={{ backgroundColor: sp.color }}
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{sp.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            θ = {sp.angleDeg}° | ({cosP.toFixed(3)}, {sinP.toFixed(3)})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNormalizedAngle(sp.angleDeg);
                          }}
                          className="px-2.5 py-1 bg-[#212536] hover:bg-[#333] text-gray-200 rounded-xl text-[10px] font-mono"
                        >
                          Перейти
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePoint(sp.id);
                          }}
                          className="p-1 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CANONICAL TRIGONOMETRIC TABLE */}
          {activeTab === 'table' && (
            <div className="bg-[#12151e] border border-[#222840] rounded-2xl p-3 sm:p-4 space-y-3 flex-1 overflow-y-auto max-h-[480px]">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
                Таблица точных значений для основных углов
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#2d2d2d] text-gray-400 text-[10px] uppercase">
                      <th className="py-2 px-2">Градусы</th>
                      <th className="py-2 px-2 text-[#38bdf8]">Радианы</th>
                      <th className="py-2 px-2 text-[#8f9bff]">sin(α)</th>
                      <th className="py-2 px-2 text-sky-400">cos(α)</th>
                      <th className="py-2 px-2 text-amber-400">tg(α)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPECIAL_ANGLES.map((row) => {
                      const isRowActive = Math.abs(row.deg - Math.round(angleDeg)) < 1;
                      return (
                        <tr
                          key={row.deg}
                          onClick={() => setNormalizedAngle(row.deg)}
                          className={`border-b border-[#1c2030] hover:bg-[#1e2232] cursor-pointer transition-colors ${
                            isRowActive ? 'bg-[#8f9bff]/15 font-bold text-white' : 'text-gray-300'
                          }`}
                        >
                          <td className="py-1.5 px-2 font-bold">{row.deg}°</td>
                          <td className="py-1.5 px-2 text-[#38bdf8]">{row.radText}</td>
                          <td className="py-1.5 px-2 text-[#8f9bff]">{row.sinExact}</td>
                          <td className="py-1.5 px-2 text-sky-400">{row.cosExact}</td>
                          <td className="py-1.5 px-2 text-amber-400">{row.tanExact}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ESSENTIAL TRIGONOMETRY IDENTITIES & FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="bg-[#12151e] border border-[#222840] rounded-2xl p-4 space-y-3 flex-1 overflow-y-auto max-h-[480px]">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8f9bff]" />
                Основные тригонометрические тождества
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                
                {/* Pythagorean identity */}
                <div className="p-3 rounded-xl bg-[#161a26] border border-[#282c3d] space-y-1">
                  <span className="text-[10px] text-[#8f9bff] font-bold uppercase">Основное тождество:</span>
                  <div className="font-mono font-bold text-white text-sm">
                    sin²(α) + cos²(α) = 1
                  </div>
                  <p className="text-[10px] text-gray-400">Следствие теоремы Пифагора на единичном круге</p>
                </div>

                {/* Tangent definition */}
                <div className="p-3 rounded-xl bg-[#161a26] border border-[#282c3d] space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Тангенс и Котангенс:</span>
                  <div className="font-mono font-bold text-white text-sm">
                    tg(α) = sin(α) / cos(α)
                  </div>
                  <div className="font-mono font-bold text-white text-xs">
                    ctg(α) = cos(α) / sin(α) = 1 / tg(α)
                  </div>
                </div>

                {/* Double angle */}
                <div className="p-3 rounded-xl bg-[#161a26] border border-[#282c3d] space-y-1">
                  <span className="text-[10px] text-sky-400 font-bold uppercase">Двойной угол:</span>
                  <div className="font-mono font-bold text-white text-xs">
                    sin(2α) = 2 · sin(α) · cos(α)
                  </div>
                  <div className="font-mono font-bold text-white text-xs">
                    cos(2α) = cos²(α) - sin²(α)
                  </div>
                </div>

                {/* Signs in quadrants */}
                <div className="p-3 rounded-xl bg-[#161a26] border border-[#282c3d] space-y-1">
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Знаки по четвертям:</span>
                  <div className="text-[10px] font-mono text-gray-300">
                    I: sin (+), cos (+), tg (+) <br />
                    II: sin (+), cos (-), tg (-) <br />
                    III: sin (-), cos (-), tg (+) <br />
                    IV: sin (-), cos (+), tg (-)
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </ToolWrapper>
  );
};
