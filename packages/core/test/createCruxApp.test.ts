// packages/core/test/createCruxApp.test.ts
import { describe, expect, vi } from 'vitest';
import { createCruxApp } from '@crux/core';

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
});
