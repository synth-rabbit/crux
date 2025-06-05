import { Directive } from './types';

export const eventDirective: Directive = {
  match(attr: any) {
    console.log('hello');
    return attr.name.startsWith('cx-on:');
  },
  apply(el: any, attr: any, expr: any) {
    console.log('goodbye');
    const event = attr.name.slice(6);
    el.addEventListener(event, expr);
  },
};
