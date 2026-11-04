import React, { useEffect, useRef } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // Exactly 0.7 seconds (700ms) animation
    const timer = setTimeout(() => {
      onFinishRef.current();
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0b0d13] z-[9999] flex flex-col items-center justify-center font-sans text-white select-none overflow-hidden">
      {/* Background pulsing glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#8f9bff]/10 animate-ping" />

      {/* Siren Emoji 0.7s pulse/scale animation */}
      <div className="relative z-10 text-8xl sm:text-9xl animate-bounce transform transition-all duration-300 scale-125 drop-shadow-[0_0_25px_rgba(143,155,255,0.8)]">
        🚨
      </div>

      <div className="mt-6 text-center space-y-1">
        <h2 className="text-xl font-extrabold text-[#8f9bff] tracking-widest uppercase animate-pulse">
          ТЕЛЕГРАМ
        </h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Загрузка...
        </p>
      </div>
    </div>
  );
};
