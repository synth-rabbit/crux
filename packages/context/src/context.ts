import { createSignal, Signal } from '@crux/reactivity';

export interface Context<T> {
  id: symbol;
  defaultValue?: Signal<T>;
}

type ContextMap = Map<symbol, unknown>;

let currentContextMap: ContextMap = new Map();
const contextStack: ContextMap[] = [];

/**
 * Creates a new signal-based context. Optionally accepts a default signal.
 */
export function createContext<T extends NonNullable<unknown>>(defaultValue?: T): Context<T> {
  return {
    id: Symbol('context'),
    defaultValue: defaultValue !== undefined ? createSignal(defaultValue) : undefined,
  };
}

/**
 * Pushes a new isolated context scope, runs the given function, and pops the scope.
 */
export function withContextScope<T>(fn: () => T): T {
  contextStack.push(new Map(currentContextMap));
  currentContextMap = contextStack[contextStack.length - 1];
  try {
    return fn();
  } finally {
    contextStack.pop();
    currentContextMap = contextStack[contextStack.length - 1] ?? new Map();
  }
}

/**
 * Provides a signal as the context value for the current scope.
 */
export function provide<T>(context: Context<T>, defaultValue?: T) {
  currentContextMap.set(
    context.id,
    defaultValue !== undefined ? createSignal(defaultValue) : context.defaultValue
  );
}

/**
 * Retrieves the signal for a given context.
 */
export function useContext<T>(context: Context<T>): Signal<T> | undefined {
  for (let i = contextStack.length - 1; i >= 0; i--) {
    const map = contextStack[i];
    if (map.has(context.id)) {
      return map.get(context.id) as Signal<T>;
    }
  }
  return context.defaultValue as Signal<T>;
}

/** Internal helper to reset the context stack for tests. */
export function _resetContextStack(): void {
  contextStack.length = 0;
  currentContextMap = new Map();
}
