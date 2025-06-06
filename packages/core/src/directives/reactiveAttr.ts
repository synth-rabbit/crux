import { effect } from '@crux/reactivity';

import { isFunction, unwrap } from '../utils';

import { Directive } from './types';

const blocked = ['srcdoc', 'style', 'href', 'src', 'xlink:href'];

export const reactiveAttrDirective: Directive = {
  match(attr: Attr) {
    const name = attr.name;
    if (
      name === 'cx:if' ||
      name === 'cx:for' ||
      name === 'cx:show' ||
      name === 'cx:model' ||
      name.startsWith('cx:style:')
    )
      return false;
    return name.startsWith('cx:') && !blocked.includes(name.slice(3));
  },
  apply(el: Element, attr: Attr, expr: unknown) {
    const target = attr.name.slice(3);
    const setter = (v: unknown) => el.setAttribute(target, String(v));
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => setter(unwrap(expr))) : setter(expr);
  },
};
