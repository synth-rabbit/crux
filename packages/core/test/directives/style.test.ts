import { html } from '@crux/core';
import { createSignal } from '@crux/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('styleDirective', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('updates style properties reactively', async () => {
    const [color, setColor] = createSignal('red');
    const frag = html` <div id="el" cx:style:color=${() => color()}></div>`;
    document.body.appendChild(frag);
    const el = document.getElementById('el') as HTMLElement;

    expect(el.style.color).toBe('red');

    setColor('blue');
    await flushEffects();
    expect(el.style.color).toBe('blue');
  });
});
