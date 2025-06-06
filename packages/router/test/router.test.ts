import { describe, expect, it, beforeEach } from 'vitest';
import { withContextScope, useContext } from '@crux/context';
import { defineComponent, html } from '@crux/core';
import { createRouter, provideRouter, RouterContext } from '../src/router';
import '../src/link';

describe('router', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/');
  });
  it('updates current path on push', () => {
    const router = createRouter({ path: '/', component: 'x-root' });
    expect(router.currentPath[0]()).toBe('/');
    router.push('/test');
    expect(router.currentPath[0]()).toBe('/test');
    router.replace('/');
  });

  it('provides router via context', () => {
    const router = createRouter({ path: '/', component: 'x-root' });

    let path = '';
    defineComponent('x-test', () => {
      const sig = useContext(RouterContext)!;
      path = sig[0]().currentPath[0]();
      return html``;
    });

    withContextScope(() => {
      provideRouter(router);
      const el = document.createElement('x-test');
      document.body.appendChild(el);
    });

    expect(path).toBe('/');
  });

  it('cx-link navigates using router', () => {
    const router = createRouter({ path: '/', component: 'x-root' });

    withContextScope(() => {
      provideRouter(router);
      const el = document.createElement('cx-link');
      el.setAttribute('to', '/foo');
      el.setAttribute('label', 'Go');
      document.body.appendChild(el);
      const anchor = el.shadowRoot!.querySelector('a')!;
      anchor.dispatchEvent(new Event('click'));
    });

    expect(router.currentPath[0]()).toBe('/foo');
  });

  it('parses query strings', () => {
    const router = createRouter({ path: '/', component: 'x-root' });
    router.push('/todos?sort=asc');
    expect(router.currentRoute[0]().query.sort).toBe('asc');
  });

  it('matches dynamic and nested routes', () => {
    const router = createRouter({
      path: '/',
      component: 'x-root',
      children: [
        {
          path: 'todos',
          component: 'x-todos',
          children: [{ path: ':id', component: 'x-detail' }],
        },
      ],
    });

    router.push('/todos/1');
    const match = router.currentRoute[0]();
    expect(match.route.component).toBe('x-detail');
    expect(match.params.id).toBe('1');
  });
});
