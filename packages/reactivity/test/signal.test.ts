import { describe, expect, it, vi } from 'vitest';

import { createSignal } from '../src/signal';
import { effect } from '../src/effect';

describe('signal', () => {
  it('reacts', async () => {
    const [count, setCount] = createSignal(0);
    const spy = vi.fn();

    effect(() => {
      spy(count());
    });

    setCount(1);
    await Promise.resolve(); // wait for microtask flush

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(1);
  });

  it('does not trigger effect when value is unchanged', () => {
    const [count, setCount] = createSignal(0);
    const spy = vi.fn();

    effect(() => {
      spy(count());
    });

    expect(spy).toHaveBeenCalledTimes(1); // initial run

    setCount(0); // same value — should not trigger
    expect(spy).toHaveBeenCalledTimes(1); // still only one call
  });
});
