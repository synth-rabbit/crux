import { html } from '@crux/core';
import { createSignal } from '@crux/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('forDirective', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders elements for each array item', async () => {
    const [items, setItems] = createSignal([1, 2]);
    const frag = html` <ul>
      <li cx:for=${() => items()}>Item</li>
    </ul>`;
    document.body.appendChild(frag);

    expect(document.querySelectorAll('li').length).toBe(2);

    setItems([1, 2, 3]);
    await flushEffects();

    expect(document.querySelectorAll('li').length).toBe(3);
  });
});
