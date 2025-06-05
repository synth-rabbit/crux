import { html } from '@crux/core';
import { createSignal } from '@crux/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('ifDirective', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('cx:if toggles visibility', async () => {
    const [show, setShow] = createSignal(true);
    const frag = html` <div cx:if=${() => show()}>Visible</div>`;
    document.body.appendChild(frag);

    expect(document.body.textContent).toContain('Visible');

    setShow(false);
    await flushEffects();

    expect(document.body.textContent).not.toContain('Visible');
  });

  it('cx:if does not block reactive updates when hidden', async () => {
    const [count, setCount] = createSignal(0);
    const frag = html`
      <div id="toggle" cx:if=${() => count() < 10}>Less than ten</div>
      <span id="display">${() => count()}</span>
    `;
    document.body.appendChild(frag);

    const display = document.getElementById('display') as HTMLElement;

    expect(display.textContent).toBe('0');
    expect(document.getElementById('toggle')).not.toBeNull();

    setCount(10);
    await flushEffects();

    expect(display.textContent).toBe('10');
    expect(document.getElementById('toggle')).toBeNull();

    setCount(11);
    await flushEffects();

    expect(display.textContent).toBe('11');
    expect(document.getElementById('toggle')).toBeNull();

    setCount(2);
    await flushEffects();

    expect(display.textContent).toBe('2');
    expect(document.getElementById('toggle')).not.toBeNull();
  });
});
