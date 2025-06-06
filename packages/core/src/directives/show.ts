import { effect } from '@crux/reactivity';

import { isFunction } from '../utils';
import { Directive } from './types';

export const showDirective: Directive = {
  match(attr) {
    return attr.name === 'cx:show';
  },
  apply(el, attr, expr) {
    el.removeAttribute('cx:show');

    const toggle = (val: unknown) => {
      (el as HTMLElement).style.display = val ? '' : 'none';
    };

    const initial = isFunction(expr) ? expr() : expr;
    toggle(initial);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => toggle(expr())) : undefined;
  },
};
