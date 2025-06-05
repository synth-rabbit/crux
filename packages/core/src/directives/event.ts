import { Directive } from './types';

export const eventDirective: Directive = {
  match(attr: Attr) {
    return attr.name.startsWith('cx-on:');
  },
  apply(el: Element, attr: Attr, expr: EventListenerOrEventListenerObject) {
    const event = attr.name.slice(6);
    el.addEventListener(event, expr);
  },
};
