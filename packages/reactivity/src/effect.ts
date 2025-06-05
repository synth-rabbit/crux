import type { ReactiveEffect } from './types';

export let currentEffect: ReactiveEffect | null = null;

// Map effects to their cleanups
const cleanupMap = new WeakMap<ReactiveEffect, (() => void)[]>();

export function effect(fn: () => void): void {
  const wrappedEffect: ReactiveEffect = () => {
    const cleanups = cleanupMap.get(wrappedEffect)!;
    cleanups.forEach((f) => f());
    cleanupMap.set(wrappedEffect, []);

    currentEffect = wrappedEffect;
    fn();
    currentEffect = null;
  };

  cleanupMap.set(wrappedEffect, []);
  wrappedEffect();
}

export function onCleanup(fn: () => void): void {
  if (currentEffect !== null) {
    const cleanups = cleanupMap.get(currentEffect)!;
    cleanups.push(fn);
  }
}
