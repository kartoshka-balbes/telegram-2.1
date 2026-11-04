import React, { useState, useEffect, useRef } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { soundManager } from '../../utils/soundEffects';


interface ToolProps {
  onClose: () => void;
}

export const SpeedometerTool: React.FC<ToolProps> = ({ onClose }) => {
  const [speed, setSpeed] = useState(0);
  const [gasPressed, setGasPressed] = useState(false);
  const [brakePressed, setBrakePressed] = useState(false);
  const [hasReached900, setHasReached900] = useState(false);
  const [hasReached1240, setHasReached1240] = useState(false);
  const [hasReached1650, setHasReached1650] = useState(false);
  const [hasReached2500, setHasReached2500] = useState(false);
  const [hasReached5000, setHasReached5000] = useState(false);

  const maxSpeed = 9000;
  const speedRef = useRef(speed);

  // После 1300 км/ч играет звук с интервалом 5–8 секунд
  const over1300 = speed >= 1300;
  useEffect(() => {
    if (!over1300) return;
    let id: number;
    const loop = () => {
      soundManager.playKrab();
      id = window.setTimeout(loop, 5000 + Math.random() * 3000);
    };
    loop();
    return () => window.clearTimeout(id);
  }, [over1300]);
  speedRef.current = speed;

  useEffect(() => {
    if (speed >= 900 && !hasReached900) setHasReached900(true);
    if (speed >= 1240 && !hasReached1240) setHasReached1240(true);
    if (speed >= 1650 && !hasReached1650) setHasReached1650(true);
    if (speed >= 2500 && !hasReached2500) setHasReached2500(true);
    if (speed >= 5000 && !hasReached5000) setHasReached5000(true);
  }, [speed, hasReached900, hasReached1240, hasReached1650, hasReached2500, hasReached5000]);

  // Gas and Brake Physics Loop - smoothly calibrated acceleration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gasPressed) {
      interval = setInterval(() => {
        setSpeed((prev) => {
          if (prev >= maxSpeed) return maxSpeed;

          if (prev < 500) {
            return Math.min(maxSpeed, prev + 3.2);
          } else if (prev < 1000) {
            return Math.min(maxSpeed, prev + 4.8);
          } else if (prev < 1800) {
            return Math.min(maxSpeed, prev + 8.5);
          } else if (prev < 3000) {
            return Math.min(maxSpeed, prev + 15);
          } else {
            // Chaotic speed jump after 3000
            const isSlowPulse = Math.random() < 0.35;
            const chaoticDelta = isSlowPulse
              ? Math.floor(Math.random() * 8) + 2
              : Math.floor(Math.random() * 35) + 15;
            return Math.min(maxSpeed, prev + chaoticDelta);
          }
        });
      }, 50);
    } else if (brakePressed) {
      interval = setInterval(() => {
        setSpeed((prev) => Math.max(0, prev - (prev >= 2500 ? 90 : prev >= 1240 ? 55 : 30)));
      }, 50);
    } else {
      interval = setInterval(() => {
        setSpeed((prev) => Math.max(0, prev - (prev >= 2500 ? 20 : prev >= 1240 ? 12 : 5)));
      }, 50);
    }

    return () => clearInterval(interval);
  }, [gasPressed, brakePressed]);

  // Needle Jerking & Movement
  const [needleJitter, setNeedleJitter] = useState(0);

  useEffect(() => {
    if (speed >= 2500) {
      const jInterval = setInterval(() => {
        setNeedleJitter((Math.random() * 720) - 360);
      }, 30);
      return () => clearInterval(jInterval);
    } else if (speed >= 1240) {
      const jInterval = setInterval(() => {
        setNeedleJitter((Math.random() * 360) - 180);
      }, 40);
      return () => clearInterval(jInterval);
    } else if (speed >= 900) {
      const jInterval = setInterval(() => {
        setNeedleJitter((Math.random() * 24) - 12);
      }, 50);
      return () => clearInterval(jInterval);
    } else {
      setNeedleJitter(0);
    }
  }, [speed]);

  // Sound: flap-jack-scream.mp3 (1650 to 9000)
  const isScreamActive = speed >= 1650 && speed <= 9000;
  useEffect(() => {
    if (!isScreamActive) return;

    soundManager.playFlapJackScream();

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const scheduleNextScream = () => {
      const delayMs = Math.floor(Math.random() * 5000) + 4000;
      timeoutId = setTimeout(() => {
        if (isCancelled) return;
        if (speedRef.current >= 1650 && speedRef.current <= 9000) {
          soundManager.playFlapJackScream();
        }
        scheduleNextScream();
      }, delayMs);
    };

    scheduleNextScream();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isScreamActive]);

  // Sound: Siren (3000 to 9000)
  const isSirenActive = speed >= 3000 && speed <= 9000;
  useEffect(() => {
    if (!isSirenActive) return;

    soundManager.playSiren();

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const scheduleNextSiren = () => {
      const delayMs = Math.floor(Math.random() * 8000) + 7000;
      timeoutId = setTimeout(() => {
        if (isCancelled) return;
        if (speedRef.current >= 3000 && speedRef.current <= 9000) {
          soundManager.playSiren();
        }
        scheduleNextSiren();
      }, delayMs);
    };

    scheduleNextSiren();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isSirenActive]);

  // Sound: Rock (40% chance after 2800 every 4 seconds)
  const isRockActive = speed >= 2800;
  useEffect(() => {
    if (!isRockActive) return;

    const interval = setInterval(() => {
      if (speedRef.current >= 2800) {
        if (Math.random() < 0.4) {
          soundManager.playRock();
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isRockActive]);

  // Sound: Nuclear Alarm Siren (above 4600 and especially high speeds)
  const isDangerousSpeed = speed >= 4600;
  const isNuclearActive = speed >= 4600;
  useEffect(() => {
    if (!isNuclearActive) return;

    soundManager.playNuclearAlarm();

    const nuclearInterval = setInterval(() => {
      if (speedRef.current >= 4600) {
        soundManager.playNuclearAlarm();
      }
    }, 3200);

    return () => clearInterval(nuclearInterval);
  }, [isNuclearActive]);

  // FPS Drops simulation after 6300
  const isLagActive = speed >= 6300;
  const [displayedSpeed, setDisplayedSpeed] = useState(speed);

  useEffect(() => {
    if (!isLagActive) {
      setDisplayedSpeed(speed);
      return;
    }

    const lagInterval = setInterval(() => {
      setDisplayedSpeed(speedRef.current);
    }, Math.floor(Math.random() * 150) + 250);

    return () => clearInterval(lagInterval);
  }, [isLagActive, speed]);

  // Screen shake
  const isChaoticShake = speed >= 2500;
  const isExtremeShake = speed >= 1240;
  const isBaseShake = hasReached900 || speed >= 900 || (gasPressed && speed >= 500);

  const shakeAmount = isChaoticShake
    ? 45 + ((speed - 2500) / 6500) * 45
    : isExtremeShake
    ? 22
    : isBaseShake
    ? 8
    : 0;

  const shakeX = shakeAmount > 0 ? (Math.random() * shakeAmount - shakeAmount / 2) : 0;
  const shakeY = shakeAmount > 0 ? (Math.random() * shakeAmount - shakeAmount / 2) : 0;
  const shakeRotate = shakeAmount > 0 ? (Math.random() * (isChaoticShake ? 12 : 5) - (isChaoticShake ? 6 : 2.5)) : 0;

  // Realistic Fire Image Appearance only after speed reaches 3400
  const fireVisible = speed >= 3400;
  const fireOpacity = Math.min(1, Math.max(0, (speed - 3400) / 1800));
  const fireBrightness = 1.0 + ((speed - 3400) / (maxSpeed - 3400)) * 1.5;
  const fireContrast = 1.1 + (speed / maxSpeed) * 0.7;

  const isFireShaking = speed >= 3400;
  const fireShakeFactor = isFireShaking
    ? 8 + ((speed - 3400) / (maxSpeed - 3400)) * 52
    : 0;

  const [fireShakeOffsets, setFireShakeOffsets] = useState({ x: 0, y: 0, rot: 0, scale: 1 });

  useEffect(() => {
    if (isFireShaking) {
      const interval = setInterval(() => {
        const x = (Math.random() * fireShakeFactor) - (fireShakeFactor / 2);
        const y = (Math.random() * fireShakeFactor) - (fireShakeFactor / 2);
        const rot = (Math.random() * (fireShakeFactor * 0.35)) - (fireShakeFactor * 0.175);
        const scale = 1 + (Math.random() * 0.08 - 0.04);
        setFireShakeOffsets({ x, y, rot, scale });
      }, 35);
      return () => clearInterval(interval);
    } else {
      setFireShakeOffsets({ x: 0, y: 0, rot: 0, scale: 1 });
    }
  }, [isFireShaking, fireShakeFactor]);

  // Button shake
  const buttonShakeAmount = speed >= 500 ? Math.min(10, ((speed - 500) / 8500) * 10) : 0;
  const btnShakeX = buttonShakeAmount > 0 ? (Math.random() * buttonShakeAmount - buttonShakeAmount / 2) : 0;
  const btnShakeY = buttonShakeAmount > 0 ? (Math.random() * buttonShakeAmount - buttonShakeAmount / 2) : 0;

  // Vibration support
  useEffect(() => {
    if ((isBaseShake || isExtremeShake || isChaoticShake) && 'vibrate' in navigator) {
      const vibInterval = setInterval(() => {
        try {
          navigator.vibrate(isChaoticShake ? 90 : isExtremeShake ? 50 : 25);
        } catch {
          // ignore
        }
      }, 70);
      return () => clearInterval(vibInterval);
    }
  }, [isBaseShake, isExtremeShake, isChaoticShake]);

  const activeCalcSpeed = isLagActive ? displayedSpeed : speed;
  const baseNeedleAngle = -120 + (activeCalcSpeed / 900) * 360;
  const totalNeedleAngle = baseNeedleAngle + needleJitter;

  return (
    <ToolWrapper
      title="Спидометр"
      onClose={onClose}
      headerColor={
        isDangerousSpeed
          ? 'bg-[#200a0a] border-red-600/80 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
          : 'bg-[#12151e] border-[#222840]'
      }
    >
      <div
        className={`flex-1 flex flex-col items-center justify-between max-w-sm mx-auto w-full py-4 text-center select-none overflow-hidden transition-all duration-300 ${
          isDangerousSpeed
            ? 'bg-gradient-to-b from-red-950/20 via-black to-black shadow-[inset_0_0_80px_rgba(220,38,38,0.45)]'
            : ''
        }`}
      >
        
        {/* Shaking Dial Section */}
        <div
          className="relative my-auto flex items-center justify-center transition-transform duration-75 py-6 w-full"
          style={{
            transform: `translate(${shakeX}px, ${shakeY}px) rotate(${shakeRotate}deg)`,
          }}
        >
          {/* Authentic Afterburner Flame Aura */}
          {fireVisible && (
            <div
              className="absolute -inset-10 sm:-inset-16 pointer-events-none z-0 overflow-visible flex items-center justify-center transition-opacity duration-200"
              style={{
                opacity: fireOpacity,
                transform: `translate(${fireShakeOffsets.x}px, ${fireShakeOffsets.y}px) rotate(${fireShakeOffsets.rot}deg) scale(${fireShakeOffsets.scale})`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full blur-2xl transition-all duration-300"
                style={{
                  opacity: Math.min(1, fireOpacity * 0.95),
                  background:
                    speed >= 2400
                      ? 'radial-gradient(circle, rgba(255,30,0,0.95) 0%, rgba(255,100,0,0.7) 45%, transparent 75%)'
                      : 'radial-gradient(circle, rgba(255,80,0,0.75) 0%, rgba(255,150,0,0.4) 50%, transparent 75%)',
                }}
              />

              {/* Dynamic SVG Flames */}
              <svg className="w-full h-full object-contain filter drop-shadow-[0_0_30px_#ff4500] animate-pulse" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="plasmaCore" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffff55" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#ff5500" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#cc0000" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#plasmaCore)" />
                {/* Flame Tongue Spokes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M 50 10 Q 55 30 50 45 Q 45 30 50 10 Z"
                    fill="#ffaa00"
                    opacity="0.75"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
              </svg>
            </div>
          )}

          {/* MAIN CIRCULAR SPEEDOMETER GAUGE */}
          <div
            className={`relative z-10 w-56 h-56 border-4 rounded-full flex items-center justify-center overflow-hidden transition-colors ${
              speed >= 4780
                ? 'border-red-600 bg-[#1f0505]/80 shadow-[0_0_50px_rgba(239,68,68,0.9)] ring-4 ring-red-500/40 backdrop-blur-xs'
                : speed >= 2500
                ? 'border-red-500 bg-[#160a0a]/80 shadow-[0_0_40px_rgba(239,68,68,0.7)] backdrop-blur-xs'
                : speed >= 1240
                ? 'border-orange-500 bg-[#16100a]/80 shadow-[0_0_30px_rgba(249,115,22,0.6)] backdrop-blur-xs'
                : speed >= 900
                ? 'border-yellow-500 bg-[#16140a]/80 shadow-[0_0_20px_rgba(234,179,8,0.4)] backdrop-blur-xs'
                : 'border-[#8f9bff]/50 bg-[#12151e]/85 shadow-[0_0_20px_rgba(143,155,255,0.15)] backdrop-blur-xs'
            }`}
          >
            {/* Inner Fire Texture for Gauge at high speed */}
            {speed >= 3400 && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(255,80,0,0.5) 0%, rgba(200,20,0,0.2) 60%, transparent 100%)',
                  opacity: Math.min(0.7, ((speed - 3400) / 3000) * 0.7),
                }}
              />
            )}
            {/* Speedometer Scale Markings */}
            <div className="absolute inset-2 rounded-full border border-dashed border-gray-700/60 pointer-events-none" />

            {/* Gauge Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-75 pointer-events-none z-15"
              style={{ transform: `rotate(${totalNeedleAngle}deg)` }}
            >
              <div
                className={`w-1.5 h-24 rounded-t-full origin-bottom -mt-20 ${
                  speed >= 2500
                    ? 'bg-red-500 shadow-[0_0_20px_#ef4444]'
                    : speed >= 1240
                    ? 'bg-orange-400 shadow-[0_0_15px_#f97316]'
                    : speed >= 500
                    ? 'bg-[#b8c0ff] shadow-[0_0_10px_#b8c0ff]'
                    : 'bg-[#8f9bff]'
                }`}
              />
            </div>

            {/* CENTER HUB */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-8 h-8 rounded-full bg-[#161a26] border-2 border-[#8f9bff] shadow-md flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full ${speed >= 2500 ? 'bg-red-500' : 'bg-[#8f9bff]'}`} />
              </div>
            </div>

            {/* Speed Digital Readout */}
            <div className="absolute bottom-4 z-25 flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center">
                <span
                  className={`text-3xl font-black font-mono tracking-tight ${
                    speed >= 2500
                      ? 'text-red-400'
                      : speed >= 1240
                      ? 'text-orange-400'
                      : speed >= 500
                      ? 'text-[#b8c0ff]'
                      : 'text-[#8f9bff]'
                  }`}
                >
                  {Math.floor(isLagActive ? displayedSpeed : speed)}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase ml-1">км/ч</span>
              </div>
            </div>

          </div>
        </div>

        {/* Gas & Brake Controls */}
        <div
          className="w-full pt-2 pb-1 z-30 relative touch-none select-none transition-transform duration-75"
          style={{
            transform: `translate(${btnShakeX}px, ${btnShakeY}px)`,
          }}
        >
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onPointerDown={(e) => {
                soundManager.unlockContext();
                e.currentTarget.setPointerCapture?.(e.pointerId);
                setBrakePressed(true);
              }}
              onPointerUp={(e) => {
                try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
                setBrakePressed(false);
              }}
              onPointerCancel={() => setBrakePressed(false)}
              className="py-5 bg-[#ff3333] hover:bg-red-600 active:scale-98 text-white font-black text-lg rounded-2xl shadow-xl transition-transform uppercase cursor-pointer select-none ring-2 ring-red-500/40"
            >
              ТОРМОЗ
            </button>
            <button
              onPointerDown={(e) => {
                soundManager.unlockContext();
                soundManager.playBeep(300, 0.05);
                e.currentTarget.setPointerCapture?.(e.pointerId);
                setGasPressed(true);
              }}
              onPointerUp={(e) => {
                try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
                setGasPressed(false);
              }}
              onPointerCancel={() => setGasPressed(false)}
              className="py-5 bg-[#8f9bff] hover:bg-[#b8c0ff] active:scale-98 text-black font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(143,155,255,0.4)] transition-transform uppercase cursor-pointer select-none ring-2 ring-[#8f9bff]/60"
            >
              ГАЗ
            </button>
          </div>
        </div>

      </div>
    </ToolWrapper>
  );
};
