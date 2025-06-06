import { createSignal } from './signal';
import type { Signal } from './types';

export interface Store<T> {
  state: { [K in keyof T]: Signal<T[K]> };
  setState(patch: Partial<T>): void;
  getState(): T;
}

export function createStore<T extends Record<string, any>>(initial: T): Store<T> {
  const state = {} as { [K in keyof T]: Signal<T[K]> };

  for (const key of Object.keys(initial) as (keyof T)[]) {
    state[key] = createSignal(initial[key]);
  }

  const setState = (patch: Partial<T>): void => {
    for (const key of Object.keys(patch) as (keyof T)[]) {
      if (key in state) {
        state[key][1](patch[key] as T[keyof T]);
      }
    }
  };

  const getState = (): T => {
    const result = {} as T;
    for (const key of Object.keys(state) as (keyof T)[]) {
      result[key] = state[key][0]();
    }
    return result;
  };

  return { state, setState, getState };
}
