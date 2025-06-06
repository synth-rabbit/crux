import { effect } from '@crux/reactivity';

import { Directive } from './types';

export const modelDirective: Directive = {
  match(attr) {
    return attr.name === 'cx:model';
  },
  apply(el, attr, expr: unknown) {
    el.removeAttribute('cx:model');
    if (!Array.isArray(expr) || expr.length !== 2) return;
    const [get, set] = expr as [() => any, (v: any) => void];
    const input = el as HTMLInputElement;

    const update = () => {
      input.value = String(get());
    };

    update();
    effect(update);

    input.addEventListener('input', (e: Event) => {
      set((e.target as HTMLInputElement).value);
    });
  },
};
