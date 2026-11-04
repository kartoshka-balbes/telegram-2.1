import { soundManager } from './soundEffects';

// Пока открыто любое приложение, отслеживаем все созданные им таймеры.
// При закрытии приложения таймеры отменяются и все звуки останавливаются,
// чтобы ничего не продолжало играть «из закрытого приложения».

let depth = 0;
let originals: { st: typeof window.setTimeout; si: typeof window.setInterval } | null = null;
const tracked = new Set<number>();

export const startToolSession = () => {
  if (typeof window === 'undefined') return;
  depth += 1;
  if (depth > 1) return;

  originals = { st: window.setTimeout, si: window.setInterval };
  const { st, si } = originals;

  window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = st.call(window, handler, timeout, ...args) as unknown as number;
    tracked.add(id);
    return id;
  }) as typeof window.setTimeout;

  window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = si.call(window, handler, timeout, ...args) as unknown as number;
    tracked.add(id);
    return id;
  }) as typeof window.setInterval;
};

export const endToolSession = () => {
  if (typeof window === 'undefined') return;
  depth = Math.max(0, depth - 1);
  if (depth > 0) return;

  if (originals) {
    window.setTimeout = originals.st;
    window.setInterval = originals.si;
    originals = null;
  }
  tracked.forEach((id) => {
    window.clearTimeout(id);
    window.clearInterval(id);
  });
  tracked.clear();

  soundManager.stopAll();
};
