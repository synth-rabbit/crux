import { effect } from '@crux/reactivity';

import { isFunction } from '../utils';

import { Directive } from './types';

export const ifDirective: Directive = {
  match(attr) {
    return attr.name === 'cx:if';
  },
  apply(el, attr, expr) {
    el.removeAttribute('cx:if');

    const placeholder = document.createComment('cx:if');
    let isVisible = true;

    const toggle = (visible: boolean) => {
      if (visible === isVisible) return;
      if (visible) {
        const parent = placeholder.parentNode!;
        parent.replaceChild(el, placeholder);
      } else {
        const parent = el.parentNode!;
        parent.replaceChild(placeholder, el);
      }
      isVisible = visible;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => toggle(Boolean(expr()))) : toggle(Boolean(expr));
  },
};
