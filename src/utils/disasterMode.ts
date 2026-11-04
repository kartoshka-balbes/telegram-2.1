import { useSyncExternalStore } from 'react';

let enabled = false;
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const getDisasterMode = () => enabled;

export const setDisasterMode = (value: boolean) => {
  if (enabled === value) return;
  enabled = value;
  listeners.forEach((l) => l());
};

export const useDisasterMode = () => useSyncExternalStore(subscribe, getDisasterMode, getDisasterMode);
