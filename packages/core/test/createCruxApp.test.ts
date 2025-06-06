import { describe, expect, vi } from 'vitest';
import { createCruxApp, defineComponent, html } from '@crux/core';
import { useRouter } from '@crux/router';

describe('createCruxApp', () => {
  test('mounts root component into target', () => {
    document.body.innerHTML = `<div id="app"></div>`;
    createCruxApp({ root: 'my-app', selector: '#app' });
    expect(document.querySelector('my-app')).not.toBeNull();
  });

  test('logs error if selector is invalid', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    createCruxApp({ root: 'my-app', selector: '#nonexistent' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('provides router when configured', () => {
    defineComponent('router-root', () => {
      const r = useRouter();
      return html`<span>${r.currentPath[0]()}</span>`;
    });

    document.body.innerHTML = `<div id="app"></div>`;
    createCruxApp({
      root: 'router-root',
      selector: '#app',
      router: { root: { path: '/', component: 'router-root' } },
    });

    const span = document.querySelector('router-root')!.shadowRoot!.querySelector('span');
    expect(span?.textContent).toBe('/');
  });
});
