import { html } from '@crux/core';
import { createSignal } from '@crux/reactivity';
import { describe, expect, it } from 'vitest';

async function flushEffects() {
  return new Promise((resolve) => {
    queueMicrotask(() => queueMicrotask(resolve));
  });
}

describe('ifDirective', () => {
  it('cx:if toggles visibility', async () => {
    const [show, setShow] = createSignal(true);
    const frag = html` <div cx:if=${() => show()}>Visible</div>`;
    document.body.appendChild(frag);

    expect(document.body.textContent).toContain('Visible');

    setShow(false);
    await flushEffects();

    expect(document.body.textContent).not.toContain('Visible');
  });
});
