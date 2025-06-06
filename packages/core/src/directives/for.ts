import { effect } from '@crux/reactivity';

import { isFunction } from '../utils';
import { Directive } from './types';

export const forDirective: Directive = {
  match(attr) {
    return attr.name === 'cx:for';
  },
  apply(el, attr, expr) {
    el.removeAttribute('cx:for');
    const parent = el.parentNode!;
    const placeholder = document.createComment('');
    const template = el.cloneNode(true) as Element;
    parent.replaceChild(placeholder, el);

    const nodes: Node[] = [];
    const render = (list: unknown[]) => {
      if (!Array.isArray(list)) list = [];

      while (nodes.length > list.length) {
        const node = nodes.pop()!;
        node.remove();
      }

      while (nodes.length < list.length) {
        const clone = template.cloneNode(true);
        parent.insertBefore(clone, placeholder);
        nodes.push(clone);
      }
    };

    const initial = isFunction(expr) ? expr() : expr;
    render(initial as unknown[]);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isFunction(expr) ? effect(() => render(expr() as unknown[])) : undefined;
  },
};
