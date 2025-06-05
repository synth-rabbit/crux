import { describe, expect, it } from 'vitest';
import { createSignal } from '@crux/reactivity';

import { cxText } from '../src';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('cxText helper', () => {
  it('returns a reactive text node', async () => {
    const [count, setCount] = createSignal(1);
    const node = cxText(() => count())();
    expect(node.textContent).toBe('1');

    setCount(2);
    await flushEffects();
    expect(node.textContent).toBe('2');
  });
});
