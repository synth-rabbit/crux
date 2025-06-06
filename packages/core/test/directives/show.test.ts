import { html } from '@crux/core';
import { createSignal } from '@crux/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('showDirective', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('toggles element visibility', async () => {
    const [visible, setVisible] = createSignal(true);
    const frag = html` <div id="el" cx:show=${() => visible()}>X</div>`;
    document.body.appendChild(frag);
    const el = document.getElementById('el') as HTMLElement;

    expect(el.style.display).toBe('');

    setVisible(false);
    await flushEffects();
    expect(el.style.display).toBe('none');

    setVisible(true);
    await flushEffects();
    expect(el.style.display).toBe('');
  });
});
