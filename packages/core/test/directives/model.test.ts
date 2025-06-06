import { html } from '@crux/core';
import { createSignal } from '@crux/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('modelDirective', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('binds input value to signal', async () => {
    const signal = createSignal('a');
    const frag = html` <input id="inp" cx:model=${signal} />`;
    document.body.appendChild(frag);
    const input = document.getElementById('inp') as HTMLInputElement;

    expect(input.value).toBe('a');

    input.value = 'b';
    input.dispatchEvent(new Event('input'));
    expect(signal[0]()).toBe('b');

    signal[1]('c');
    await flushEffects();
    expect(input.value).toBe('c');
  });
});
