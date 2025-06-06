import { effect } from '@crux/reactivity';

import { isFunction, unwrap } from '../utils';
import { Directive } from './types';

export const styleDirective: Directive = {
  match(attr) {
    return attr.name.startsWith('cx:style:');
  },
  apply(el, attr, expr) {
    const prop = attr.name.slice('cx:style:'.length);
    el.removeAttribute(attr.name);
    const update = (v: unknown) => {
      (el as HTMLElement).style.setProperty(prop, String(v));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => update(unwrap(expr))) : update(expr);
  },
};
