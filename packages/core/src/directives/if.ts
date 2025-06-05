import { effect } from '@crux/reactivity';

import { isFunction } from '../utils';

import { Directive } from './types';

export const ifDirective: Directive = {
  match(attr) {
    return attr.name === 'cx:if';
  },
  apply(el, attr, expr) {
    el.removeAttribute('cx:if');

    const placeholder = document.createComment('');
    let inserted = true;

    const toggle = (visible: boolean) => {
      if (visible) {
        if (!inserted) {
          placeholder.replaceWith(el);
          inserted = true;
        }
      } else if (inserted) {
        el.replaceWith(placeholder);
        inserted = false;
      }
    };

    const initial = isFunction(expr) ? expr() : Boolean(expr);
    if (!initial) {
      el.replaceWith(placeholder);
      inserted = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => toggle(expr())) : undefined;
  },
};
