import React, { useEffect, useRef } from 'react';
import { ChatWallpaperType } from '../types';
export type { ChatWallpaperType };

export interface ChatWallpaperOption {
  id: ChatWallpaperType;
  name: string;
  previewClass: string;
  description: string;
}

export const WallpaperOptions: ChatWallpaperOption[] = [
  {
    id: 'cyber_emerald',
    name: 'Кибер-изумруд',
    previewClass: 'bg-gradient-to-br from-[#222840] via-[#0b0d13] to-[#002215]',
    description: 'Фирменный неоновый изумрудный фон',
  },
  {
    id: 'matrix',
    name: 'Матрица',
    previewClass: 'bg-black text-[#8f9bff] font-mono',
    description: 'Динамический падающий код Матрицы',
  },
  {
    id: 'neon_mesh',
    name: 'Динамичный неон',
    previewClass: 'bg-gradient-to-tr from-[#003d29] via-[#6f7df0] to-[#0e1119]',
    description: 'Переливающийся живой неон',
  },
  {
    id: 'stars_space',
    name: 'Космический туман',
    previewClass: 'bg-gradient-to-b from-[#080d1a] via-[#0a0b10] to-[#0b0d13]',
    description: 'Мерцающие звёзды и аврора',
  },
  {
    id: 'grid_cyber',
    name: 'Киберпанк сетка',
    previewClass: 'bg-[#0f0f0f] border border-[#8f9bff]/30',
    description: 'Трехмерная виртуальная сетка',
  },
  {
    id: 'aurora',
    name: 'Северное сияние',
    previewClass: 'bg-gradient-to-br from-[#1c202c] via-[#2a1b5e] to-[#06121f]',
    description: 'Плавные переливающиеся полосы света',
  },
  {
    id: 'rain',
    name: 'Дождь',
    previewClass: 'bg-gradient-to-b from-[#0d1b2a] to-[#050a10]',
    description: 'Падающие капли дождя',
  },
  {
    id: 'snow',
    name: 'Снегопад',
    previewClass: 'bg-gradient-to-b from-[#12202f] to-[#0a1018]',
    description: 'Медленно падающий снег',
  },
  {
    id: 'fireflies',
    name: 'Светлячки',
    previewClass: 'bg-gradient-to-b from-[#0e1016] to-[#050608]',
    description: 'Летающие огоньки в ночном лесу',
  },
  {
    id: 'bubbles',
    name: 'Пузыри',
    previewClass: 'bg-gradient-to-b from-[#0b2a3d] to-[#04121c]',
    description: 'Поднимающиеся пузырьки',
  },
  {
    id: 'ocean_waves',
    name: 'Морские волны',
    previewClass: 'bg-gradient-to-b from-[#06223a] to-[#031018]',
    description: 'Плавно движущиеся волны',
  },
  {
    id: 'gradient_flow',
    name: 'Течение цвета',
    previewClass: 'bg-gradient-to-br from-[#3b1e6e] via-[#0f3d5e] to-[#282d3f]',
    description: 'Медленно перетекающий градиент',
  },
  {
    id: 'lava_lamp',
    name: 'Лавовая лампа',
    previewClass: 'bg-gradient-to-b from-[#2a0f3d] to-[#0d0614]',
    description: 'Плавающие цветные капли',
  },
  {
    id: 'neon_rings',
    name: 'Неоновые кольца',
    previewClass: 'bg-[#07090f] border border-cyan-400/30',
    description: 'Расходящиеся светящиеся кольца',
  },
  {
    id: 'twinkle',
    name: 'Звёздная ночь',
    previewClass: 'bg-gradient-to-b from-[#050816] to-[#0b1230]',
    description: 'Мерцающие звёзды и падающие метеоры',
  },
  {
    id: 'sakura',
    name: 'Сакура',
    previewClass: 'bg-gradient-to-b from-[#2a1020] to-[#120810]',
    description: 'Падающие лепестки',
  },
  {
    id: 'confetti',
    name: 'Конфетти',
    previewClass: 'bg-gradient-to-b from-[#1a1230] to-[#0b0a18]',
    description: 'Праздничный дождь из конфетти',
  },
  {
    id: 'minimal_dark',
    name: 'Минимализм',
    previewClass: 'bg-[#0b0d13]',
    description: 'Глубокий матовый чёрный',
  },
];

interface ChatBackgroundProps {
  wallpaper: ChatWallpaperType;
}

export const ChatBackground: React.FC<ChatBackgroundProps> = ({ wallpaper }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Matrix animation effect
  useEffect(() => {
    if (wallpaper !== 'matrix') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize) + 1;
    const drops: number[] = Array(columns).fill(1);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#8f9bff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [wallpaper]);


  // Particle wallpapers (rain, snow, fireflies, bubbles)
  const particleKind = ['rain', 'snow', 'fireflies', 'bubbles', 'twinkle', 'sakura', 'confetti'].includes(wallpaper) ? wallpaper : null;
  const particleRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!particleKind) return;
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let h = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);
    const onResize = () => {
      if (!canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    const count = particleKind === 'rain' ? 120 : particleKind === 'snow' ? 90 : particleKind === 'twinkle' ? 110 : particleKind === 'confetti' ? 70 : particleKind === 'sakura' ? 45 : particleKind === 'fireflies' ? 40 : 35;
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * (particleKind === 'bubbles' ? 9 : 3),
      v: 0.4 + Math.random() * (particleKind === 'rain' ? 9 : 2),
      p: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const q of parts) {
        q.p += 0.02;
        if (particleKind === 'rain') {
          q.y += q.v + 6;
          q.x -= 1.2;
          ctx.strokeStyle = 'rgba(150,200,255,0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(q.x, q.y);
          ctx.lineTo(q.x + 2, q.y - 12 - q.v);
          ctx.stroke();
          if (q.y > h) { q.y = -20; q.x = Math.random() * w + 30; }
        } else if (particleKind === 'snow') {
          q.y += q.v * 0.6;
          q.x += Math.sin(q.p) * 0.6;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
          ctx.fill();
          if (q.y > h + 5) { q.y = -5; q.x = Math.random() * w; }
        } else if (particleKind === 'fireflies') {
          q.x += Math.cos(q.p) * 0.7;
          q.y += Math.sin(q.p * 0.8) * 0.5;
          const a = 0.3 + 0.7 * Math.abs(Math.sin(q.p * 1.5));
          const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 6);
          g.addColorStop(0, `rgba(190,255,120,${a})`);
          g.addColorStop(1, 'rgba(190,255,120,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r * 6, 0, Math.PI * 2);
          ctx.fill();
          if (q.x < -20) q.x = w + 20;
          if (q.x > w + 20) q.x = -20;
        } else if (particleKind === 'twinkle') {
          const a = 0.25 + 0.75 * Math.abs(Math.sin(q.p * 1.3));
          ctx.fillStyle = `rgba(220,230,255,${a})`;
          ctx.beginPath();
          ctx.arc(q.x, q.y, Math.min(q.r, 1.8), 0, Math.PI * 2);
          ctx.fill();
          if (Math.random() < 0.0015) {
            q.x = Math.random() * w;
            q.y = Math.random() * h * 0.6;
            q.v = -1;
          }
          if (q.v === -1) {
            q.x += 7;
            q.y += 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(q.x, q.y);
            ctx.lineTo(q.x - 36, q.y - 20);
            ctx.stroke();
            if (q.x > w + 40 || q.y > h + 40) { q.v = 1; q.x = Math.random() * w; q.y = Math.random() * h; }
          }
        } else if (particleKind === 'sakura') {
          q.y += q.v * 0.6 + 0.3;
          q.x += Math.sin(q.p) * 0.9 + 0.3;
          ctx.fillStyle = 'rgba(255,183,213,0.85)';
          ctx.beginPath();
          ctx.ellipse(q.x, q.y, q.r * 2.2, q.r * 1.2, q.p, 0, Math.PI * 2);
          ctx.fill();
          if (q.y > h + 10) { q.y = -10; q.x = Math.random() * w; }
          if (q.x > w + 10) q.x = -10;
        } else if (particleKind === 'confetti') {
          q.y += q.v * 0.9 + 0.4;
          q.x += Math.sin(q.p) * 0.8;
          const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#c084fc', '#f472b6'];
          ctx.fillStyle = colors[Math.floor(q.r * 10) % colors.length];
          ctx.save();
          ctx.translate(q.x, q.y);
          ctx.rotate(q.p * 2);
          ctx.fillRect(-q.r, -q.r * 0.5, q.r * 2.4, q.r);
          ctx.restore();
          if (q.y > h + 10) { q.y = -10; q.x = Math.random() * w; }
        } else {
          q.y -= q.v * 0.7;
          q.x += Math.sin(q.p) * 0.5;
          ctx.strokeStyle = 'rgba(160,220,255,0.55)';
          ctx.fillStyle = 'rgba(160,220,255,0.08)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (q.y < -15) { q.y = h + 15; q.x = Math.random() * w; }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [particleKind]);

  if (particleKind) {
    const bg =
      particleKind === 'rain' ? 'bg-gradient-to-b from-[#0d1b2a] to-[#050a10]'
      : particleKind === 'snow' ? 'bg-gradient-to-b from-[#12202f] to-[#0a1018]'
      : particleKind === 'fireflies' ? 'bg-gradient-to-b from-[#0e1016] to-[#050608]'
      : particleKind === 'twinkle' ? 'bg-gradient-to-b from-[#050816] to-[#0b1230]'
      : particleKind === 'sakura' ? 'bg-gradient-to-b from-[#2a1020] to-[#120810]'
      : particleKind === 'confetti' ? 'bg-gradient-to-b from-[#1a1230] to-[#0b0a18]'
      : 'bg-gradient-to-b from-[#0b2a3d] to-[#04121c]';
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${bg}`}>
        <canvas ref={particleRef} className="w-full h-full block" />
      </div>
    );
  }


  if (wallpaper === 'gradient_flow') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <style>{`
          @keyframes gflow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        `}</style>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, #2b1458, #0f3d5e, #282d3f, #5a1e4a, #2b1458)',
            backgroundSize: '400% 400%',
            animation: 'gflow 22s ease infinite',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  if (wallpaper === 'lava_lamp') {
    const blobs = [
      { c: '#f43f5e', l: '10%', s: 220, d: '17s', dl: '0s' },
      { c: '#a855f7', l: '55%', s: 260, d: '23s', dl: '-6s' },
      { c: '#f59e0b', l: '30%', s: 180, d: '19s', dl: '-11s' },
      { c: '#22d3ee', l: '70%', s: 200, d: '27s', dl: '-3s' },
    ];
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#2a0f3d] to-[#0d0614]">
        <style>{`
          @keyframes lava-rise { 0% { transform: translateY(20vh) scale(0.8); } 50% { transform: translateY(-60vh) scale(1.2); } 100% { transform: translateY(20vh) scale(0.8); } }
        `}</style>
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-50"
            style={{ left: b.l, bottom: '-10%', width: b.s, height: b.s, background: b.c, animation: `lava-rise ${b.d} ease-in-out infinite`, animationDelay: b.dl }}
          />
        ))}
      </div>
    );
  }

  if (wallpaper === 'neon_rings') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#07090f]">
        <style>{`
          @keyframes ring-out { 0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.9; } 100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; } }
        `}</style>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-[70vmin] h-[70vmin] rounded-full border-2"
            style={{
              borderColor: i % 2 ? '#22d3ee' : '#a855f7',
              boxShadow: `0 0 24px ${i % 2 ? '#22d3ee' : '#a855f7'}`,
              animation: 'ring-out 10s linear infinite',
              animationDelay: `${-i * 2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (wallpaper === 'aurora') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#06121f]">
        <style>{`
          @keyframes aurora-move-a { 0%,100% { transform: translate(-10%, -5%) rotate(0deg) scale(1); } 50% { transform: translate(10%, 8%) rotate(25deg) scale(1.25); } }
          @keyframes aurora-move-b { 0%,100% { transform: translate(8%, 10%) rotate(0deg) scale(1.2); } 50% { transform: translate(-12%, -6%) rotate(-30deg) scale(1); } }
        `}</style>
        <div className="absolute -top-1/4 -left-1/4 w-[90%] h-[70%] rounded-full blur-3xl opacity-60 bg-[#00ffa8]/50" style={{ animation: 'aurora-move-a 14s ease-in-out infinite' }} />
        <div className="absolute top-1/4 -right-1/4 w-[90%] h-[70%] rounded-full blur-3xl opacity-50 bg-[#7c3aed]/60" style={{ animation: 'aurora-move-b 18s ease-in-out infinite' }} />
        <div className="absolute -bottom-1/4 left-1/4 w-[80%] h-[60%] rounded-full blur-3xl opacity-40 bg-[#38bdf8]/50" style={{ animation: 'aurora-move-a 22s ease-in-out infinite reverse' }} />
      </div>
    );
  }

  if (wallpaper === 'ocean_waves') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#06223a] to-[#031018]">
        <style>{`
          @keyframes wave-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
        {[
          { top: '55%', op: 0.25, dur: '16s', col: '#38bdf8' },
          { top: '65%', op: 0.3, dur: '12s', col: '#0ea5e9' },
          { top: '75%', op: 0.4, dur: '9s', col: '#0284c7' },
        ].map((l, i) => (
          <svg
            key={i}
            className="absolute left-0 w-[200%] h-1/3"
            style={{ top: l.top, opacity: l.op, animation: `wave-slide ${l.dur} linear infinite` }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0 60 Q150 0 300 60 T600 60 T900 60 T1200 60 V120 H0 Z" fill={l.col} />
          </svg>
        ))}
      </div>
    );
  }

  if (wallpaper === 'matrix') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#0b0d13]">
        <canvas ref={canvasRef} className="w-full h-full block opacity-60" />
      </div>
    );
  }

  if (wallpaper === 'neon_mesh') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#08090c]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#003d29] via-[#00a843]/30 to-[#0e1119] animate-pulse opacity-70" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-[#8f9bff]/10 blur-3xl animate-spin [animation-duration:20s]" />
      </div>
    );
  }

  if (wallpaper === 'stars_space') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#060a12]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#222840]/50 via-[#080d18] to-[#04060a]" />
        <div className="absolute inset-0 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:24px_24px] opacity-20 animate-pulse" />
      </div>
    );
  }

  if (wallpaper === 'grid_cyber') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#0a0b10]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff8815_1px,transparent_1px),linear-gradient(to_bottom,#00ff8815_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0d13]/50 to-[#0b0d13]" />
      </div>
    );
  }

  if (wallpaper === 'minimal_dark') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#0b0d13]" />
    );
  }

  // Default: cyber_emerald
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#0b0d13]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#222840]/35 via-[#0b0d13] to-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(#8f9bff_1px,transparent_1px)] [background-size:18px_18px] opacity-10" />
    </div>
  );
};
