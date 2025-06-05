import { describe, expect, it, vi } from 'vitest';

import { effect, onCleanup } from '../src/effect';
import { createSignal } from '../src/signal';

function flushSync() {
  return new Promise<void>((resolve) => queueMicrotask(() => resolve()));
}

describe('effect (integration with signal)', () => {
  it('runs the effect immediately', () => {
    const spy = vi.fn();
    const [count] = createSignal(0);
    effect(() => {
      count();
      spy();
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('re-runs when signal changes', async () => {
    const spy = vi.fn();
    const [count, setCount] = createSignal(0);
    effect(() => {
      count();
      spy();
    });
    expect(spy).toHaveBeenCalledTimes(1);
    setCount(1);
    await flushSync();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('runs cleanup before re-running', async () => {
    const cleanup = vi.fn();
    const [val, setVal] = createSignal(0);
    effect(() => {
      val();
      onCleanup(cleanup);
    });
    expect(cleanup).not.toHaveBeenCalled();
    setVal(1);
    await flushSync();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('does not run cleanup if signal doesn’t change', async () => {
    const cleanup = vi.fn();
    const [val, setVal] = createSignal(0);
    effect(() => {
      val();
      onCleanup(cleanup);
    });
    setVal(0);
    await flushSync();
    expect(cleanup).not.toHaveBeenCalled();
  });

  it('clears previous cleanups on each run', async () => {
    const cleanups: string[] = [];
    const [val, setVal] = createSignal(0);
    effect(() => {
      val();
      onCleanup(() => cleanups.push('cleanup'));
    });
    setVal(1);
    await flushSync();
    expect(cleanups).toEqual(['cleanup']);

    setVal(2);
    await flushSync();
    expect(cleanups).toEqual(['cleanup', 'cleanup']);
  });

  it('handles case where cleanupMap has no entry', () => {
    expect(() => {
      effect(() => {
        // No onCleanup call, triggers ?? []
      });
    }).not.toThrow();
  });

  it('handles case where cleanupMap.get returns undefined', () => {
    // This branch triggers the `?? []` fallback
    // We use a stub signal that doesn't actually track
    createSignal(0);
    expect(() => {
      effect(() => {
        // No actual dependencies, so cleanupMap.get will be undefined
      });
    }).not.toThrow();
  });
});
