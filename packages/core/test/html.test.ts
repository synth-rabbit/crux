import { describe, expect, it, vi } from 'vitest';
import { createSignal } from '@crux/reactivity';

import { html } from '../src/html';

const tick = () => new Promise<void>((r) => queueMicrotask(r));

describe('html()', () => {
  it('binds event listeners via cx-on', () => {
    const host = document.createElement('div');
    const spy = vi.fn();
    host.appendChild(html` <button cx-on:click=${spy}>OK</button>`);

    host.querySelector('button')!.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('reactively updates text nodes', async () => {
    const host = document.createElement('div');
    const [n, setN] = createSignal(1);
    host.appendChild(html`<span>${() => n()}</span>`);

    expect(host.textContent).toBe('1');
    setN(2);
    await tick();
    expect(host.textContent).toBe('2');
  });

  it('reactively updates cx: attributes', async () => {
    const host = document.createElement('div');
    const [cls, setCls] = createSignal('red');
    host.appendChild(html` <div cx:class=${() => cls()}></div>`);

    const el = host.querySelector('div')!;
    expect(el.getAttribute('class')).toBe('red');
    setCls('blue');
    await tick();
    expect(el.getAttribute('class')).toBe('blue');
  });

  it('skips unsafe attribute names', () => {
    const host = document.createElement('div');
    const [srcdoc] = createSignal('<evil>');
    host.appendChild(html` <iframe cx:srcdoc=${srcdoc}></iframe>`);

    const el = host.querySelector('iframe')!;
    expect(el.hasAttribute('srcdoc')).toBe(false);
  });

  it('handles DocumentFragment values and array reactivity', async () => {
    const host = document.createElement('div');
    const [list, setList] = createSignal<string[]>(['a', 'b']);

    host.appendChild(html`
      <ul>
        ${() => list().map((t) => html` <li>${t}</li>`)}
      </ul>
    `);

    expect(host.querySelectorAll('li').length).toBe(2);

    setList(['a', 'b', 'c']);
    await tick();
    expect(host.querySelectorAll('li').length).toBe(3);
  });
});
