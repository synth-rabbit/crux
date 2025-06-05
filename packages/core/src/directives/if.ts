import { effect } from '@crux/reactivity';

import { isFunction } from '../utils';

import { Directive } from './types';

export const ifDirective: Directive = {
  match(attr) {
    return attr.name === 'cx:if';
  },
  apply(el, attr, expr) {
    el.removeAttribute('cx:if');

    const toggle = (visible: boolean) => {
      el.style.display = visible ? '' : 'none';
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => toggle(expr())) : toggle(Boolean(expr));
  },
};
