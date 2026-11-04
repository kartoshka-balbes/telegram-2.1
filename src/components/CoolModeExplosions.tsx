import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/soundEffects';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  emoji: string;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

interface CoolModeExplosionsProps {
  active: boolean;
}

export const CoolModeExplosions: React.FC<CoolModeExplosionsProps> = ({ active }) => {
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  useEffect(() => {
    if (!active) return;

    const handleClick = (e: MouseEvent) => {
      soundManager.playExplosion();

      const newExpId = Date.now() + Math.random();
      const emojis = ['💥', '🔥', '⚡', '💣', '✨', '🚨'];
      const colors = ['#ff0055', '#ffaa00', '#ffff00', '#00e5ff', '#ff3300'];

      const particles: Particle[] = Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.5;
        const speed = 4 + Math.random() * 8;
        return {
          id: i,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 16 + Math.random() * 20,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        };
      });

      setExplosions((prev) => [...prev, { id: newExpId, x: e.clientX, y: e.clientY, particles }]);

      setTimeout(() => {
        setExplosions((prev) => prev.filter((exp) => exp.id !== newExpId));
      }, 700);
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [active]);

  if (!active || explosions.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {explosions.map((exp) => (
        <React.Fragment key={exp.id}>
          {/* Central blast wave */}
          <div
            className="absolute rounded-full border-4 border-amber-400 bg-red-500/40 animate-ping"
            style={{
              left: exp.x - 40,
              top: exp.y - 40,
              width: 80,
              height: 80,
            }}
          />

          {exp.particles.map((p) => (
            <div
              key={p.id}
              className="absolute font-bold transition-transform duration-500 ease-out flex items-center justify-center pointer-events-none"
              style={{
                left: p.x + p.vx * 10,
                top: p.y + p.vy * 10,
                fontSize: `${p.size}px`,
                transform: 'scale(1.4)',
                opacity: 0.9,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
